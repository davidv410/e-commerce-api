export const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(400).json({ message: 'Access denied' })
    }
    next()
}

//stavit iza protect i ne moram opet decode jwt