import express from 'express'
import { auth } from '../firebase/admin.js' // ✅
import { authenticate } from '../middlewares/auth.js'

const router = express.Router()

router.get("/me", authenticate, async (req, res) => {
  try {
    const userRecord = await auth.getUser(req.user.uid)
    res.json({
      uid: userRecord.uid,
      email: userRecord.email,
      displayName: userRecord.displayName,
      role: req.user.role || "viewer"
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router
