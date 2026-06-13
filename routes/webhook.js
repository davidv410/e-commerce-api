import 'dotenv/config'
import express from 'express'
import Stripe from 'stripe'
import { protect } from '../middleware/protect.js';

const router = express.Router()

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post('/', express.raw({ type: 'application/json' }), (req, res) => {
    const sig = req.headers['stripe-signature'];

    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.error('Webhook signature error:', err.message);
        return res.status(400).json({ error: 'Invalid signature' });
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;


        //NAPRAVIT TABLU DI PISE DA JE PLACENO, order status
        //OCISTIT USEROV CART
        //POSLAT MAIL

        // await db.orders.create({
        //     email: session.customer_email,
        //     amount: session.amount_total,
        //     status: 'paid',
        // });
        console.log('Payment success:', session.metadata.userId);
    }

    res.json({ received: true });
})

export default router