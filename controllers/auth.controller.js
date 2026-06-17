import * as authService from '../services/auth.service.js'

export const login = async (req, res) => {
    try{
        const response = await authService.login(req.body)

        res.cookie('token', response.token, {
            httpOnly: true,
            secure: true, 
            sameSite: 'None', 
            maxAge: 60 * 60 * 1000  //1h
        })

        res.cookie('refreshToken', response.refresh, {
                httpOnly: true,
                secure: true, 
                sameSite: 'None', 
                maxAge: 7 * 24 * 60 * 60 * 1000  //7d
        })
        return res.status(response.status).json(response.message)
    }catch(error){
        console.log(error)
        return res.status(500).json({ message: 'Server error' })
    }
}

export const refresh = async (req, res) => {
    try{
        const response = await authService.refresh(req.cookies)

        res.clearCookie('token')
        res.cookie('token', response.token, {
                httpOnly: true,
                secure: true, 
                sameSite: 'None',
                maxAge: 60 * 60 * 1000  //1h
        })

        res.status(response.status).json(response.message)

    }catch(error){
        console.log(error)
        return res.status(500).json({ message: 'Server error' })
    }
}

export const signup = async (req, res) => {
    try{
        const response = await authService.signup(req.body)
        res.status(response.status).json(response.message)
    }catch(error){
        console.log(error)
        return res.status(500).json({ message: 'Server error' })
    }
}

export const logout = async (req, res) => {
    try{
        await authService.logout(req.user.id)

        res.clearCookie('token')
        res.clearCookie('refreshToken')

        return res.status(200).json({message: "Logged out successfully"})
    }catch(error){
        console.log(error)
        return res.status(500).json({ message: 'Server error' })
    }
}