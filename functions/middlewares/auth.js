import { auth } from '../firebase/admin.js'

export const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing or invalid Authorization header" })
  }

  const idToken = authHeader.split("Bearer ")[1]

  try {
    const decodedToken = await auth.verifyIdToken(idToken) 
    req.user = decodedToken
    next()
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired token" })
  }
}
