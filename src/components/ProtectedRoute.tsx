import { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

interface Props {
  children: ReactNode
  requireActivated?: boolean
}

const ProtectedRoute = ({ children, requireActivated = true }: Props) => {
  const { user, profile, loading } = useAuth()
  const location = useLocation()

  if (loading) return null
  if (!user) return <Navigate to="/landing" state={{ from: location }} replace />
  if (requireActivated && profile && !profile.is_activated) {
    return <Navigate to="/activate" replace />
  }
  return <>{children}</>
}

export default ProtectedRoute
