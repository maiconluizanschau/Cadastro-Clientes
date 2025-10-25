import { PropsWithChildren } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

export default function RequireAuth({ children }: PropsWithChildren) {
  const location = useLocation()
  const username = sessionStorage.getItem('username')
  if (!username) return <Navigate to="/" replace state={{ from: location }} />
  return <>{children}</>
}
