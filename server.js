require("dotenv").config();
const express = require("express");
const Stripe = require("stripe");
const app = express();

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

app.use(express.json());
app.use(express.static("public"));

const products = [
  {
    id: "pp-1",
    name: "Pink Paradise Hoodie",
    price: 5500,
    category: "Clothing"
  },
  {
    id: "pp-2",
    name: "Paradise Lip Gloss",
    price: 1800,
    category: "Beauty"
  },
  {
    id: "pp-3",
    name: "Pink Paradise Tote",
    price: 3200,
    category: "Accessories"
  }
];

app.get("/products", (req, res) => {
  res.json(products);
});

app.post("/create-checkout-session", async (req, res) => {
  const { cart } = req.body;

  const line_items = cart.map(item => ({
    price_data: {
      currency: "usd",
      product_data: {
        name: item.name
      },
      unit_amount: item.price
    },
    quantity: item.quantity
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items,
    success_url: "http://localhost:4242?success=true",
    cancel_url: "http://localhost:4242?canceled=true"
  });

  res.json({ url: session.url });
});

app.listen(4242, () =>
  console.log("🌸 Pink Paradise running on http://localhost:4242")
);
