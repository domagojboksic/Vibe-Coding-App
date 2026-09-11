import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthBoot, useReady, useUser } from '@/features/auth/hooks/useAuth'
import AuthPage from '@/features/auth/components/AuthPage'

// Auth guard — redirect to /auth if not logged in
function ProtectedRoute({ children }) {
  const user = useUser()
  const ready = useReady()
  if (!ready) return <div className="app-loading"><span className="app-spinner" /></div>
  if (!user)  return <Navigate to="/auth" replace />
  return children
}

// Public route — redirect to / if already logged in
function PublicRoute({ children }) {
  const user  = useUser()
  const ready = useReady()
  if (!ready) return <div className="app-loading"><span className="app-spinner" /></div>
  if (user)   return <Navigate to="/" replace />
  return children
}

function AppRoutes() {
  useAuthBoot()

  return (
    <Routes>
      <Route path="/auth" element={
        <PublicRoute><AuthPage /></PublicRoute>
      } />

      {/* Home placeholder — we'll build this next */}
      <Route path="/" element={
        <ProtectedRoute>
          <div style={{padding:32,color:'var(--text2)',fontSize:15}}>
            ✅ Logged in! Home screen coming next.
          </div>
        </ProtectedRoute>
      } />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
      <style>{`
        .app-loading {
          height: 100vh; display: flex;
          align-items: center; justify-content: center;
        }
        .app-spinner {
          width: 28px; height: 28px; border-radius: 50%;
          border: 3px solid var(--border-mid);
          border-top-color: var(--green);
          animation: spin .7s linear infinite;
          display: block;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </BrowserRouter>
  )
}
