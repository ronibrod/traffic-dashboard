import express from "express"
import { db } from '../firebase/admin.js'
import { authenticate } from "../middlewares/auth.js"

const router = express.Router()

router.use(authenticate)

router.get("/", async (req, res) => {
  try {
    const userId = req.user.uid
    const snapshot = await db
      .collection("trafficStats")
      .doc(userId)
      .collection("records")
      .orderBy("date")
      .get()

    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    res.json(data)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.post("/", async (req, res) => {
  try {
    const userId = req.user.uid
    const { date, visits } = req.body

    if (!date || visits === undefined) {
      return res.status(400).json({ error: "Missing fields" })
    }

    const docRef = await db
      .collection("trafficStats")
      .doc(userId)
      .collection("records")
      .add({ date, visits })

    res.json({ id: docRef.id, date, visits })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.post("/many", async (req, res) => {
  try {
    const userId = req.user.uid;
    const records = req.body;

    if (!Array.isArray(records)) {
      return res.status(400).json({ error: "Expected array of records" });
    }

    const batch = db.batch();
    const userCollection = db.collection("trafficStats").doc(userId).collection("records");

    records.forEach(({ date, visits }) => {
      const newDoc = userCollection.doc(); // auto-id
      batch.set(newDoc, { date, visits });
    });

    await batch.commit();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const userId = req.user.uid
    const { id } = req.params
    const { date, visits } = req.body

    await db
      .collection("trafficStats")
      .doc(userId)
      .collection("records")
      .doc(id)
      .update({ date, visits })

    res.json({ id, date, visits })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.delete("/:id", async (req, res) => {
  try {
    const userId = req.user.uid
    const { id } = req.params

    await db
      .collection("trafficStats")
      .doc(userId)
      .collection("records")
      .doc(id)
      .delete()

    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router
