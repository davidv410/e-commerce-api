import 'dotenv/config'
import express from 'express'
import Stripe from 'stripe'
import { protect } from '../middleware/protect.js';

const router = express.Router()

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post('/', protect, async (req, res) => {
  try {


    //OVDJE CU MORAT DODAT ZAPRAVO SELECT IZ CARTA, BAZE

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: req.body.items.map(item => ({
        price_data: {
            //NOVAC PROMJENIT
          currency: 'usd',
          product_data: { name: item.name },
            //CIJENA IZ BAZE
          unit_amount: item.price,
        },
        quantity: item.quantity,
      })),
      //TREBO BI EMAIL UMJESTO ID
      metadata: { userId: req.user.id },
      success_url: `${process.env.BASE_URL}/success`,
      cancel_url: `${process.env.BASE_URL}/cancel`,
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error('Stripe session error:', err.message);
    res.status(500).json({ error: 'Could not create checkout session' });
  }
});

export default router