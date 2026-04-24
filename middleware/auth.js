import Blacklist from '../models/Blacklist.js'
import jwt from 'jsonwebtoken'

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token
    if (!token) return res.redirect('/login')

    const blacklisted = await Blacklist.findOne({ token })
    if (blacklisted) return res.redirect('/login')

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    req.token = token
    next()
  } catch (err) {
    return res.redirect('/login')
  }
}

export const authMiddleware2 = async (req, res, next) => {
  try {
    const token = req.cookies.token
    if (!token) return res.redirect('/employer-login')

    const blacklisted = await Blacklist.findOne({ token })
    if (blacklisted) return res.redirect('/employer-login')

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    req.token = token
    next()
  } catch (err) {
    return res.redirect('/employer-login')
  }
}

export default authMiddleware2