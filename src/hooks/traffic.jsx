import axios from 'axios'
import useSWR from 'swr'
import { getAuth } from 'firebase/auth'

const fetchTrafficData = async () => {
  const user = getAuth().currentUser
  if (!user) throw new Error('No user')

  const token = await user.getIdToken()

  const { data } = await axios.get('api/traffic', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return data
}

export const useTrafficData = () => {
  const { data, error, isLoading, mutate } = useSWR('traffic', fetchTrafficData)

  return {
    trafficData: data || [],
    isLoading,
    error,
    mutate,
  }
}
