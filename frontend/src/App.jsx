import { Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import ListingPage from './pages/ListingPage'
import FormPage from './pages/FormPage'

export default function App() {
  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar />
      <main className="ml-60 flex-1 min-h-screen">
        <Routes>
          <Route path="/" element={<Navigate to="/planos" replace />} />
          <Route path="/planos" element={<ListingPage />} />
          <Route path="/planos/novo" element={<FormPage />} />
          <Route path="/planos/:id/editar" element={<FormPage />} />
        </Routes>
      </main>
    </div>
  )
}
