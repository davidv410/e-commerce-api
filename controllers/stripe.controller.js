import * as stripeService from '../services/stripe.service.js'

export const checkout = async (req, res) => {
    try{
        const response = await stripeService.checkout(req.body, req.user.id)
        res.status(response.status).json(response.url)
    }catch(error){
        console.log(error)
        res.status(500).json({ message: 'Server error' })
    }
}