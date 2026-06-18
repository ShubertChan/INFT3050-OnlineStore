import { useNavigate } from "react-router-dom";
import { products, money } from "../data.js";
import CustomerShell from "../components/CustomerShell.jsx";
import Cover from "../components/Cover.jsx";
import { useTitle } from "../useTitle.js";

function HomeCard({ product }) {
  const navigate = useNavigate();
  return (
    <article className="home-card card" onClick={() => navigate(`/product?id=${product.id}`)}>
      <Cover product={product} />
      <span className="pill">{product.type}</span>
      <h3>{product.title}</h3>
      <p>Curated for Wukong members</p>
      <strong>{money(product.homePrice)}</strong>
    </article>
  );
}

function ArrivalCard({ product }) {
  const navigate = useNavigate();
  return (
    <article className="new-card card" onClick={() => navigate(`/product?id=${product.id}`)}>
      <span className="new-badge">NEW</span>
      <Cover product={product} />
      <span className="pill">{product.type}</span>
      <h3>{product.title}</h3>
      <strong>{money(product.price)}</strong>
    </article>
  );
}

export default function Home() {
  useTitle("Home");
  const navigate = useNavigate();
  const popular = products.slice(0, 3);
  const arrivals = [...products].reverse();

  return (
    <CustomerShell active="Home">
      <style>{css}</style>
      <section className="hero">
        <div className="hero-copy">
          <h1>Stories. Adventures.<br />Endless Fun.</h1>
          <p>Books, movies, and games for every journey.</p>
          <button className="btn" type="button" onClick={() => navigate("/search")}>Explore popular picks</button>
        </div>
        <div className="hero-art" aria-hidden="true">
          <span className="hero-disc"></span>
          <span className="hero-tile book">BOOK</span>
          <span className="hero-tile movie">MOVIE</span>
          <span className="hero-tile game">GAME</span>
        </div>
      </section>
      <section className="popular">
        <h2 className="section-title">Popular Picks</h2>
        <div className="home-grid">{popular.map((product) => <HomeCard key={product.id} product={product} />)}</div>
      </section>
      <section className="arrivals">
        <div className="arrivals-head">
          <h2 className="section-title">New Arrivals</h2>
          <button className="btn link" type="button" onClick={() => navigate("/search")}>View all</button>
        </div>
        <div className="new-grid">{arrivals.map((product) => <ArrivalCard key={product.id} product={product} />)}</div>
      </section>
    </CustomerShell>
  );
}

const css = `
.hero {
  position: relative;
  display: grid;
  grid-template-columns: 1.1fr .9fr;
  min-height: 286px;
  overflow: hidden;
  border-radius: 24px;
  background:
    radial-gradient(circle at 88% 52%, rgba(244, 184, 96, .85) 0, rgba(244, 184, 96, .45) 28%, transparent 30%),
    linear-gradient(110deg, #242938 0%, #a34b2a 44%, #f05125 100%);
  color: #fff;
}
.hero-copy {
  position: relative;
  z-index: 2;
  padding: 36px 62px;
}
.hero h1 {
  margin: 0;
  font-size: 49px;
  line-height: 1.04;
}
.hero p {
  margin: 16px 0 26px;
  font-size: 24px;
}
.hero .btn {
  border: 0;
  background: #fff;
  color: var(--primary);
}
.hero-art {
  position: relative;
  min-height: 286px;
}
.hero-disc {
  position: absolute;
  inset: 0 0 auto auto;
  width: 378px;
  height: 378px;
  border-radius: 50%;
  border: 36px solid rgba(255,255,255,.18);
  transform: translate(34px, -48px);
}
.hero-tile {
  position: absolute;
  display: grid;
  place-items: center;
  width: 78px;
  height: 132px;
  border-radius: 10px;
  color: var(--navy);
  background: #fff;
  font-weight: 900;
}
.hero-tile.book { right: 220px; top: 80px; transform: rotate(-4deg); }
.hero-tile.movie { right: 122px; top: 92px; height: 132px; background: #ffe5d4; transform: rotate(-3deg); }
.hero-tile.game { right: 30px; top: 56px; height: 132px; background: #e8e5ff; transform: rotate(-4deg); }
.popular { margin-top: 30px; }
.arrivals { margin-top: 34px; }
.arrivals-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 20px;
}
.arrivals-head .section-title { margin: 0; }
.new-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 22px;
}
.new-card {
  position: relative;
  display: grid;
  justify-items: center;
  align-content: start;
  gap: 6px;
  padding: 22px 18px;
  text-align: center;
  cursor: pointer;
  transition: transform .15s ease, border-color .15s ease, box-shadow .15s ease;
}
.new-card:hover {
  transform: translateY(-6px) scale(1.02);
  border-color: #ffc6b5;
  box-shadow: 0 18px 38px rgba(31, 41, 55, .14);
}
.new-card:active { transform: translateY(-2px) scale(.99); }
.new-card h3 { margin: 8px 0 2px; font-size: 19px; line-height: 1.15; }
.new-card strong { color: var(--primary); font-size: 20px; }
.new-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 3px 10px;
  border-radius: 999px;
  background: var(--green);
  color: #fff;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: .5px;
}
.home-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 28px;
}
.home-card {
  display: grid;
  justify-items: center;
  align-content: start;
  min-height: 320px;
  padding: 18px 24px;
  text-align: center;
  cursor: pointer;
}
.home-card h3 {
  margin: 12px 0 6px;
  font-size: 24px;
  line-height: 1.15;
}
.home-card p {
  margin: 0 0 10px;
  color: var(--muted);
  font-size: 16px;
}
.home-card strong {
  color: var(--primary);
  font-size: 25px;
}
@media (max-width: 980px) {
  .hero { grid-template-columns: 1fr; }
  .hero-art { min-height: 180px; }
  .home-grid { grid-template-columns: 1fr; }
  .new-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 640px) {
  .hero-copy { padding: 28px; }
  .hero h1 { font-size: 38px; }
  .hero p { font-size: 18px; }
  .new-grid { grid-template-columns: 1fr; }
}
`;
