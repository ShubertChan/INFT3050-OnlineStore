// ==========================================================================
// STATUS: IN PROGRESS
// ==========================================================================
// Product API (Zhang Lei) — products, stock, genres, sub-genres and sources.
// Lab method: GET/POST/PATCH/DELETE on /api/inft3050/<Table> using the client.
//
// TABLES USED HERE (from the course database / Postman collection):
//   - Product    : ID, Name, Author, Description, Genre, SubGenre, Published
//   - Stocktake  : ItemId, SourceId, ProductId, Quantity, Price   (lowest price shown)
//   - Genre      : GenreID, Name  ("Books"/"Movies"/"Games") — read at runtime
//   - BookGenre / MovieGenre / GameGenre : SubGenreID, Name (sub-categories per type)
//   - Source     : Sourceid, SourceName, ExternalLink, Genre (where stock comes from)
//
// So one product now carries: type (Genre), sub-category (SubGenre via the *Genre
// tables), publish date (Published), price/stock (Stocktake) and a source name/link
// (Stocktake.SourceId -> Source). NocoDB lists default to 25 rows, so we pass limit.
import client, { unwrapList } from "./client.js";

// Diagnostic snapshot of the last catalog load — surfaced on the Search page so we can
// see exactly what the database returns for Genre. Remove once movies/games display.
let _debug = null;
export function getCatalogDebug() { return _debug; }

const PRODUCT = "Product";
const STOCKTAKE = "Stocktake";
const GENRE = "Genre";
const SOURCE = "Source";
const SUBGENRE_TABLE = { Book: "BookGenre", Movie: "MovieGenre", Game: "GameGenre" };
const LIMIT = "?limit=1000";

const TYPE_COLOR = { Book: "#c9460b", Movie: "#2855c6", Game: "#7138d5", Deals: "#0f9668" };

function normTypeOrNull(name) {
  const n = String(name || "").trim().toLowerCase();
  if (!n || n === "[object object]") return null;
  if (n.startsWith("book") || n.includes("book") || n.includes("novel")) return "Book";
  if (n.startsWith("movie") || n.startsWith("film") || n.includes("movie") || n.includes("film") || n.includes("dvd") || n.includes("cinema")) return "Movie";
  if (n.startsWith("game") || n.includes("game") || n.includes("gaming") || n.includes("console") || n.includes("playstation") || n.includes("xbox") || n.includes("nintendo")) return "Game";
  return null;
}
function normType(name) {
  return normTypeOrNull(name) || "Book";
}

function pickId(v) {
  if (v == null) return null;
  if (Array.isArray(v)) return pickId(v[0]);
  if (v && typeof v === "object") return v.GenreID ?? v.GenreId ?? v.SubGenreID ?? v.SourceId ?? v.ID ?? v.Id ?? v.id ?? null;
  return v;
}

function pickName(v) {
  if (v == null) return "";
  if (Array.isArray(v)) return pickName(v[0]);
  if (v && typeof v === "object") return v.Name ?? v.Title ?? v.GenreName ?? v.SourceName ?? v.name ?? "";
  return String(v);
}

// Get a product's type. NocoDB may return the LINKED Genre record (an object like
// { GenreID, Name }) instead of a plain integer id — handle both so movies/games
// are not all silently defaulted to "Book".
// Build { subGenreId -> type } from the three sub-genre tables (used as a fallback when
// the Genre relation is not expanded). Returns the map plus whether ids overlap.
function buildSubTypeMap(subMaps) {
  const map = {}; let conflict = false;
  for (const type of ["Book", "Movie", "Game"]) {
    const m = (subMaps && subMaps[type]) || {};
    for (const id in m) { if (map[id] && map[id] !== type) conflict = true; map[id] = type; }
  }
  return { map, conflict };
}

function genreTypeOf(p, idToType, subTypeMap, subMaps, stock, src) {
  // 1) Product.Genre relation: NocoDB may return an object, array, scalar id, or sometimes just {}.
  for (const key of ["Genre", "genre", "GenreId", "GenreID", "Genre_id"]) {
    const g = p[key];
    const direct = normTypeOrNull(pickName(g));
    if (direct) return direct;
    const gid = pickId(g);
    if (gid != null && idToType && idToType[gid]) return idToType[gid];
  }

  // 2) Source.Genre fallback. In this database, Product.Genre can appear as {},
  // but Stocktake.SourceId -> Source often still tells us Book/Movie/Game.
  const fromSource = normTypeOrNull(src?.genre ?? src?.name);
  if (fromSource) return fromSource;

  // 3) SubGenre fallback. This is safe when subgenre ids do not overlap between tables.
  let sg = p.SubGenre ?? p.subGenre ?? p.SubGenreId ?? p.SubGenreID;
  const sgName = pickName(sg);
  const fromSubName = normTypeOrNull(sgName);
  if (fromSubName) return fromSubName;
  const sgId = pickId(sg);
  if (sgId != null) {
    if (subTypeMap && !subTypeMap.conflict && subTypeMap.map[sgId]) return subTypeMap.map[sgId];
    // Even if ids overlap, try to match a numeric subgenre id to a unique non-empty table.
    const matches = ["Book", "Movie", "Game"].filter((type) => subMaps?.[type]?.[sgId]);
    if (matches.length === 1) return matches[0];
  }

  // 4) Last resort: scan nested fields for a useful Name. Empty {} will be ignored.
  for (const k in p) {
    const v = p[k];
    const t = normTypeOrNull(pickName(v));
    if (t) return t;
  }

  // Unknown. The UI needs a value, so only now fall back to Book.
  return "Book";
}

// --- Genre (main category) map: GenreID <-> type, read once ---
let _genreCache = null;
async function genreMaps() {
  if (_genreCache) return _genreCache;
  let idToType = {}, typeToId = {};
  try {
    const rows = await client.get(`/${GENRE}${LIMIT}`).then(unwrapList);
    rows.forEach((g) => {
      const id = g.GenreID ?? g.GenreId ?? g.ID ?? g.Id ?? g.id;
      const type = normType(g.Name ?? g.name ?? g.GenreName ?? g.Title);
      if (id != null) { idToType[id] = type; if (typeToId[type] == null) typeToId[type] = id; }
    });
  } catch { /* defaults below */ }
  if (Object.keys(idToType).length === 0) {
    idToType = { 1: "Book", 2: "Movie", 3: "Game" };
    typeToId = { Book: 1, Movie: 2, Game: 3 };
  }
  _genreCache = { idToType, typeToId };
  return _genreCache;
}

// --- Sub-genre maps: { Book:{SubGenreID:Name}, Movie:{...}, Game:{...} } ---
let _subCache = null;
async function subGenreMaps() {
  if (_subCache) return _subCache;
  const out = {};
  await Promise.all(Object.entries(SUBGENRE_TABLE).map(async ([type, table]) => {
    try {
      const rows = await client.get(`/${table}${LIMIT}`).then(unwrapList);
      const m = {};
      rows.forEach((r) => { const id = r.SubGenreID ?? r.ID ?? r.Id; if (id != null) m[id] = r.Name; });
      out[type] = m;
    } catch { out[type] = {}; }
  }));
  _subCache = out;
  return out;
}

// --- Source map: { Sourceid: { name, link } } ---
let _sourceCache = null;
async function sourceMap() {
  if (_sourceCache) return _sourceCache;
  const m = {};
  try {
    const rows = await client.get(`/${SOURCE}${LIMIT}`).then(unwrapList);
    rows.forEach((s) => {
      const id = s.Sourceid ?? s.SourceId ?? s.SourceID ?? s.ID ?? s.Id;
      if (id != null) m[id] = {
        name: s.SourceName ?? "",
        link: s.ExternalLink ?? "",
        genre: s.Genre ?? s.Type ?? s.Category ?? "",
      };
    });
  } catch { /* optional */ }
  _sourceCache = m;
  return m;
}

// Turn one Product row (+ its stock row) into the shape the frontend uses.
function toProduct(p, stock, idToType, subMaps, srcMap, subTypeMap) {
  const id = String(p.ID ?? p.Id ?? p.ProductId ?? "");
  const title = p.Name ?? p.ProductName ?? "Untitled";
  const price = stock?.Price != null ? Number(stock.Price) : 0;
  const sourceId = stock?.SourceId ?? stock?.SourceID ?? stock?.sourceId;
  const src = sourceId != null && srcMap ? srcMap[sourceId] : null;
  const type = genreTypeOf(p, idToType, subTypeMap, subMaps, stock, src);
  const subId = pickId(p.SubGenre ?? p.subGenre ?? p.SubGenreId ?? p.SubGenreID);
  return {
    id, title, type, price, homePrice: price,
    stock: stock?.Quantity != null ? Number(stock.Quantity) : 0,
    letter: String(title).trim().charAt(0).toUpperCase() || "B",
    color: TYPE_COLOR[type] || "#c9460b",
    author: p.Author ?? "",
    subGenre: (subMaps && subMaps[type] && subMaps[type][subId]) || pickName(p.SubGenre) || "", // sub-category name
    published: p.Published ?? "",                                            // publish/release date
    sourceName: src?.name || "",                                             // where it is sourced
    sourceLink: src?.link || "",                                             // external buy link
    description: p.Description ?? "Curated for Wukong members.",
    details: p.Description ?? "Product details from the database.",
    shipping: "Ready to ship",
  };
}

// Lowest-price stock row per product.
function indexStock(stockRows) {
  const map = {};
  stockRows.forEach((s) => {
    const pid = s.ProductId ?? s.ProductID ?? s.productId;
    if (pid == null) return;
    const cur = map[pid];
    if (!cur) { map[pid] = s; return; }
    const price = s.Price != null ? Number(s.Price) : null;
    const curPrice = cur.Price != null ? Number(cur.Price) : null;
    if (price != null && (curPrice == null || price < curPrice)) map[pid] = s;
  });
  return map;
}

// READ: all products, merged with stock + genre + sub-genre + source.
export async function getProducts() {
  const [products, stock, maps, subMaps, srcMap] = await Promise.all([
    client.get(`/${PRODUCT}${LIMIT}`).then(unwrapList),
    client.get(`/${STOCKTAKE}${LIMIT}`).then(unwrapList).catch(() => []),
    genreMaps(), subGenreMaps(), sourceMap(),
  ]);
  const stockById = indexStock(stock);
  const subTypeMap = buildSubTypeMap(subMaps);
  const result = products.map((p) => toProduct(p, stockById[p.ID ?? p.Id ?? p.ProductId], maps.idToType, subMaps, srcMap, subTypeMap));
  // Diagnostic (open the browser console): genre map + how many products per type +
  // a few raw Genre values. If movies/games are missing, this shows why.
  try {
    const dist = {};
    result.forEach((pp) => { dist[pp.type] = (dist[pp.type] || 0) + 1; });
    _debug = {
      types: dist,
      sampleGenre: products.slice(0, 4).map((pp) => pp.Genre),
      sampleSubGenre: products.slice(0, 4).map((pp) => pp.SubGenre),
      sampleStock: stock.slice(0, 4).map((ss) => ({ ProductId: ss.ProductId, SourceId: ss.SourceId, Price: ss.Price })),
      sampleSource: Object.values(srcMap || {}).slice(0, 4),
      fields: products[0] ? Object.keys(products[0]) : [],
    };
    console.log("[catalog] Genre map:", maps.idToType,
      "| type counts:", dist,
      "| raw Genre samples:", products.slice(0, 5).map((p) => p.Genre),
      "| first product fields:", products[0] ? Object.keys(products[0]) : [],
      "| first product:", products[0]);
  } catch { /* ignore */ }
  return result;
}

// READ ONE: a single product by id (with stock + source).
export async function getProduct(id) {
  const [p, maps, subMaps, srcMap] = await Promise.all([
    client.get(`/${PRODUCT}/${id}`).then((r) => r.data),
    genreMaps(), subGenreMaps(), sourceMap(),
  ]);
  let stock = null;
  try {
    const rows = await client.get(`/${STOCKTAKE}?where=(ProductId,eq,${id})&limit=1000`).then(unwrapList);
    stock = indexStock(rows)[id] ?? rows[0] ?? null;
  } catch { /* optional */ }
  return toProduct(p, stock, maps.idToType, subMaps, srcMap);
}

// Sub-categories for a given type — used to build a sub-genre filter in the UI.
export async function getSubGenres(type) {
  const maps = await subGenreMaps();
  const m = maps[type] || {};
  return Object.entries(m).map(([id, name]) => ({ id, name }));
}

// All main genres (for reference / filters).
export async function getGenres() {
  const { idToType } = await genreMaps();
  return Object.entries(idToType).map(([id, type]) => ({ id, type }));
}

// All sources (for reference).
export async function getSources() {
  const m = await sourceMap();
  return Object.entries(m).map(([id, s]) => ({ id, ...s }));
}

// SEARCH: filter by title / type / sub-genre (client-side).
export async function searchProducts(term) {
  const all = await getProducts();
  const q = (term || "").trim().toLowerCase();
  if (!q) return all;
  return all.filter((p) =>
    p.title.toLowerCase().includes(q) ||
    p.type.toLowerCase().includes(q) ||
    (p.subGenre || "").toLowerCase().includes(q)
  );
}

// CREATE (admin): add a product (+ its stock row).
export async function createProduct(form) {
  const { typeToId } = await genreMaps();
  const created = await client
    .post(`/${PRODUCT}`, {
      Name: form.title,
      Genre: typeToId[form.type] ?? typeToId.Book ?? 1,
      SubGenre: form.subGenreId ?? null,
      Author: form.author ?? "",
      Published: form.published ?? null,
      Description: form.description ?? "",
    })
    .then((r) => r.data);

  const pid = created.ID ?? created.Id ?? created.ProductId;
  try {
    await client.post(`/${STOCKTAKE}`, {
      ProductId: pid,
      SourceId: form.sourceId ?? null,
      Price: Number(form.price) || 0,
      Quantity: Number(form.stock) || 0,
    });
  } catch { /* stock columns may differ */ }
  return toProduct(created, { Price: form.price, Quantity: form.stock }, { [created.Genre]: form.type }, {}, {});
}

// UPDATE (admin): patch product + its stock.
export async function updateProduct(id, form) {
  const { typeToId } = await genreMaps();
  const patch = {};
  if (form.title != null) patch.Name = form.title;
  if (form.type != null) patch.Genre = typeToId[form.type] ?? typeToId.Book ?? 1;
  if (form.subGenreId != null) patch.SubGenre = form.subGenreId;
  if (form.author != null) patch.Author = form.author;
  if (form.published != null) patch.Published = form.published;
  if (form.description != null) patch.Description = form.description;
  await client.patch(`/${PRODUCT}/${id}`, patch);

  try {
    const rows = await client.get(`/${STOCKTAKE}?where=(ProductId,eq,${id})&limit=1000`).then(unwrapList);
    const body = { Price: Number(form.price) || 0, Quantity: Number(form.stock) || 0 };
    if (form.sourceId != null) body.SourceId = form.sourceId;
    if (rows[0]) await client.patch(`/${STOCKTAKE}/${rows[0].ItemId ?? rows[0].ID ?? rows[0].Id}`, body);
    else await client.post(`/${STOCKTAKE}`, { ProductId: id, ...body });
  } catch { /* best-effort */ }
  return true;
}

// DELETE (admin): remove a product.
export async function deleteProduct(id) {
  return client.delete(`/${PRODUCT}/${id}`).then((r) => r.data);
}
