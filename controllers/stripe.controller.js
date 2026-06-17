import * as stripeService from '../services/stripe.service.js'

export const checkout = async (req, res) => {
    try{
        const response = await stripeService.checkout(req.user.id, req.user.email)
        res.status(response.status).json({ url: response.url, data: response.data })
    }catch(error){
        console.log(error)
        res.status(500).json({ message: 'Server error' })
    }
}