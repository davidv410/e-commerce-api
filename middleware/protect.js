import 'dotenv/config'
import jwt from 'jsonwebtoken'

export const protect = (req, res, next) => {

    const token = req.cookies.token

    try{

        if(!token){ return res.status(400).json({ message: "Access denied" }) }

        const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        console.log(decode)
        
        req.user = decode

        next()

    }catch(error){

        return res.status(401).json({ msg: "Invalid token" })

    }
}