import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthBoot, useReady, useUser, useProfile } from '@/features/auth/hooks/useAuth'
import { signOut } from '@/features/auth/api/auth.api'
import AuthPage from '@/features/auth/components/AuthPage'
import ResetPasswordPage from '@/features/auth/components/ResetPasswordPage'

function ProtectedRoute({ children }) {
  const user  = useUser()
  const ready = useReady()
  if (!ready) return <div className="app-loading"><span className="app-spinner" /></div>
  if (!user)  return <Navigate to="/auth" replace />
  return children
}

function PublicRoute({ children }) {
  const user  = useUser()
  const ready = useReady()
  if (!ready) return <div className="app-loading"><span className="app-spinner" /></div>
  if (user)   return <Navigate to="/" replace />
  return children
}

function HomePlaceholder() {
  const profile = useProfile()
  const handleSignOut = async () => { await signOut() }

  return (
    <div style={{ padding: 32, maxWidth: 400, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 700 }}>Hey, {profile?.full_name?.split(' ')[0]} 👋</div>
          <div style={{ fontSize: 13, color: 'var(--text2)', marginTop: 2 }}>@{profile?.username}</div>
        </div>
        <button
          onClick={handleSignOut}
          style={{
            fontSize: 13, fontWeight: 600, padding: '7px 14px',
            borderRadius: 'var(--radius)', border: '1.5px solid var(--border-mid)',
            background: 'var(--surface)', color: 'var(--text2)', cursor: 'pointer'
          }}
        >
          Sign out
        </button>
      </div>
      <div style={{
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)', padding: '20px',
        color: 'var(--text2)', fontSize: 14, lineHeight: 1.6
      }}>
        ✅ Auth is working!<br/>
        Home screen coming next.
      </div>
    </div>
  )
}

function AppRoutes() {
  useAuthBoot()
  return (
    <Routes>
      <Route path="/auth"           element={<PublicRoute><AuthPage /></PublicRoute>} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/"               element={<ProtectedRoute><HomePlaceholder /></ProtectedRoute>} />
      <Route path="*"               element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
      <style>{`
        .app-loading { height: 100vh; display: flex; align-items: center; justify-content: center; }
        .app-spinner { width: 28px; height: 28px; border-radius: 50%; border: 3px solid var(--border-mid); border-top-color: var(--green); animation: spin .7s linear infinite; display: block; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </BrowserRouter>
  )
}