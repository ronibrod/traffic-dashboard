import express from "express"
import cors from "cors"
import authRoutes from "./routes/auth.js"
import trafficRoutes from "./routes/traffic.js"

const app = express()

const allowedOrigins = ["http://localhost:5173"]
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error("Not allowed by CORS"))
    }
  },
  credentials: true,
}

app.use(cors(corsOptions))
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/traffic', trafficRoutes)

export default app
