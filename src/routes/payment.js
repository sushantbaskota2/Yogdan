const express = require("express");
const Cause = require("../models/causes");
const router = new express.Router();
const stripe = require("stripe")(process.env.STRIPE_API_SECRET);

router.post("/stripe-session/:id", async (req, res) => {
  const { title } = await Cause.findById(req.params.id);
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "npr",
          product_data: {
            name: title,
            images: ["https://i.imgur.com/EHyR2nP.png"],
          },
          unit_amount: req.body.amount * 100,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: req.body.success_url,
    cancel_url: req.body.cancel_url,
  });
  res.json({ id: session.id });
});

module.exports = router;
