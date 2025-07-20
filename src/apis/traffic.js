import axios from 'axios'
import { getAuth } from 'firebase/auth'

const getAuthHeaders = async () => {
  const user = getAuth().currentUser
  if (!user) throw new Error('User not authenticated')
  const token = await user.getIdToken()
  return {
    Authorization: `Bearer ${token}`,
  }
}

export const createTrafficEntry = async ({ date, visits }) => {
  const headers = await getAuthHeaders()
  return axios.post('/api/traffic', { date, visits }, { headers })
}

export const updateTrafficEntry = async (id, updatedData) => {
  const headers = await getAuthHeaders()
  return axios.put(`/api/traffic/${id}`, updatedData, { headers })
}

export const deleteTrafficEntry = async (id) => {
  const headers = await getAuthHeaders()
  return axios.delete(`/api/traffic/${id}`, { headers })
}

export const uploadTrafficData = async (json) => {
  if (!Array.isArray(json)) {
    throw new Error('Invalid data format: expected an array of objects')
  }

  const headers = await getAuthHeaders()

  try {
    await axios.post(
      'api/traffic/many',
      json,
      { headers }
    )
  } catch (err) {
    console.error('Failed to upload bulk traffic data:', err)
    throw err
  }
}
