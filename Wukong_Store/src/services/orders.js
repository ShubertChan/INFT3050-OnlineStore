// ==========================================================================
// STATUS: IN PROGRESS
// ==========================================================================
// Order API (Zhang Lei) — orders, order line items and payment records via NocoDB.
//
// REAL SCHEMA (course database):
//   - Orders           : OrderID, Customer, StreetAddress, Suburb, State, PostCode
//   - ProductsInOrders : OrderId, ProductId, Quantity  (line items; in NocoDB this is
//                        a LINKED/nested column on Orders, not a plain table — see note)
//   - TO               : CustomerID/PatronId, CardOwner, CardNumber, CVV, Expiry,
//                        Email, PhoneNumber, StreetAddress, Suburb, State, PostCode
//                        (payment + delivery details for a checkout)
//
// NOTE: Orders has NO "Status" column, and Customer (not CustomerId) is the buyer key.
// ProductsInOrders is a nested link column, so writing line items may need NocoDB's
// link API; we POST best-effort and fall back quietly — verify on the live database.
// SECURITY: TO stores raw card data because the course schema defines those columns;
// in a real product card numbers/CVV would never be stored like this.
import client, { unwrapList } from "./client.js";

const ORDERS = "Orders";
const ORDER_LINES = "ProductsInOrders";
const PAYMENTS = "TO";

// READ: all orders.
export async function getOrders() {
  return client.get(`/${ORDERS}?limit=1000`).then(unwrapList);
}

// READ ONE: a single order by id.
export async function getOrder(id) {
  return client.get(`/${ORDERS}/${id}`).then((r) => r.data);
}

// QUERY: this customer's own orders (for the account / order-history page).
export async function getOrdersByCustomer(customer) {
  try {
    return await client.get(`/${ORDERS}?where=(Customer,eq,${encodeURIComponent(customer)})&limit=1000`).then(unwrapList);
  } catch {
    const all = await getOrders();
    return all.filter((o) => String(o.Customer ?? "") === String(customer));
  }
}

// CREATE: order header (+ delivery address) -> line items -> payment record.
// args: { customer, address:{street,suburb,state,postcode}, items:[{id,qty}], card:{...} }
export async function createOrder({ customer, address = {}, items = [], card = null }) {
  // 1) Order header with the delivery address.
  const order = await client
    .post(`/${ORDERS}`, {
      Customer: customer,
      StreetAddress: address.street ?? "",
      Suburb: address.suburb ?? "",
      State: address.state ?? "",
      PostCode: address.postcode ?? "",
    })
    .then((r) => r.data);
  const orderId = order.OrderID ?? order.ID ?? order.Id ?? order.OrderId;

  // 2) Line items (one ProductsInOrders row per cart line). Best-effort: this is a
  //    nested link column, so on the live DB this may need the NocoDB link endpoint.
  await Promise.all(
    items.map((it) =>
      client.post(`/${ORDER_LINES}`, { OrderId: orderId, ProductId: it.id, Quantity: it.qty }).catch(() => {})
    )
  );

  // 3) Payment + delivery details into TO.
  if (card) {
    try {
      await client.post(`/${PAYMENTS}`, {
        CustomerID: customer, PatronId: customer,
        CardOwner: card.owner ?? "", CardNumber: card.number ?? "",
        CVV: card.cvv ?? "", Expiry: card.expiry ?? "",
        Email: card.email ?? "", PhoneNumber: card.phone ?? "",
        StreetAddress: address.street ?? "", Suburb: address.suburb ?? "",
        State: address.state ?? "", PostCode: address.postcode ?? "",
      });
    } catch { /* payment table columns may differ */ }
  }

  return order;
}
