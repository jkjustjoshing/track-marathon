import { useEffect, useState, useCallback } from 'react'

const auth = window.firebase.auth()

const useAuth = () => {
  const login = useCallback((username, password) => {
    return auth.signInWithEmailAndPassword(username, password)
  }, [])

  const logout = useCallback(() => {
    return auth.signOut()
  }, [])

  const [userId, setUserId] = useState(null)
  useEffect(() => {
    return auth.onIdTokenChanged((response) => {
      setUserId(response && response.uid)
    })
  }, [])

  return { userId, login, logout }
}

export default useAuth
