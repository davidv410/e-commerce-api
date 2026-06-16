import { cart } from '../db/schema.js'
import * as cartService from '../services/cart.service.js'

export const getCart = async (req, res) => {
    try{
        const result = await cartService.getCart(req.user.id)
        res.status(result.status).json(result.cart)
    }catch(error){
        console.log(error)
        return res.status(500).json({ message: 'Server error' })
    }
}

export const addToCart = async (req, res) => {
    try{
        const result = await cartService.addToCart(req.user.id, req.body.productId, req.body.quantity)
        res.status(result.status).json(result.message)
    }catch(error){
        console.log(error)
        return res.status(500).json({ message: 'Server error' })
    }
}

export const updateQuantity = async (req, res) => {
    try{
        const result = await cartService.updateQuantity(req.body, req.user.id, req.params.id)
        res.status(result.status).json(result.message)
    }catch(error){
        console.log(error)
        return res.status(500).json({ message: 'Server error' })
    }
}

export const removeFromCart = async (req, res) => {
    try{
        const result = await cartService.removeFromCart(req.user.id, req.params.id)
        res.status(result.status).json(result.message)
    }catch(error){
        console.log(error)
        return res.status(500).json({ message: 'Server error' })
    }
}