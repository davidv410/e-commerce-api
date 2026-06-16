import * as productService from '../services/product.service.js'

export const getProducts = async (req, res) => {
    try{
        const result = await productService.getProducts(req.query)
        res.status(200).json(result)
    }catch(error){
        console.log(error)
        return res.status(500).json({ message: 'Server error' })
    }
}

export const getProduct = async (req, res) => {
    try{
        const data = await productService.getProduct(req.params.id)
        res.status(data.status).json(data.message)
    }catch(error){
        res.status(500).json({ message: 'Server error' })
    }
}

export const createProduct = async (req, res) => {
    try{
        const create = await productService.createProduct(req.body, req.user.id, req.files)
        res.status(create.status).json(create.message)
    }catch(error){
        res.status(500).json({ message: 'Server error' })
    }
}

export const updateProduct = async (req, res) => {
    try{
        const update = await productService.updateProduct(req.params.id, req.body, req.user.id)
        res.status(update.status).json(update.message)
    }catch(error){
        console.log(error)
        res.status(500).json({ message: 'Server error' })
    }
}

export const deleteProduct = async (req, res) => {
    try{
        const remove = await productService.deleteProduct(req.params.id, req.user.id)
        res.status(remove.status).json(remove.message)
    }catch(error){
        res.status(500).json({ message: 'Server error' })
    }
}