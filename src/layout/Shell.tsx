import { Outlet } from 'react-router-dom'
import Nav from '@/components/Nav'

export default function Shell() {
  return (
    <div className="min-h-screen bg-bg text-fg">
      <Nav />
      <Outlet />
    </div>
  )
}
