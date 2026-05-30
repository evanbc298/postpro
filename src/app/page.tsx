import Sidebar from '@/components/dashboard/Sidebar'
import Home from './(dashboard)/page'

export default function RootPage() {
  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar />
      <main style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
        <Home />
      </main>
    </div>
  )
}
