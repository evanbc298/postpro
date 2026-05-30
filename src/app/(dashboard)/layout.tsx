import Sidebar from '@/components/dashboard/Sidebar'
import ChatIA from '@/components/dashboard/ChatIA'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar />
      <main style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
        {children}
      </main>
      <ChatIA />
    </div>
  )
}
