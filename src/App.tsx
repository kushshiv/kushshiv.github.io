import { Navigate, Route, Routes } from 'react-router-dom'
import Shell from '@/layout/Shell'
import Overview from '@/pages/Overview'
import Contact from '@/pages/Contact'
import BiteScoreLab from '@/pages/BiteScoreLab'
import DendriDBLab from '@/pages/DendriDBLab'

export default function App() {
  return (
    <Routes>
      <Route element={<Shell />}>
        <Route path="/" element={<Overview />} />
        <Route path="/work" element={<Navigate to="/" replace />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/content" element={<Navigate to="/contact" replace />} />
        <Route path="/about" element={<Navigate to="/contact" replace />} />
      </Route>
      <Route path="/labs/bite-score" element={<BiteScoreLab />} />
      <Route path="/labs/dendridb" element={<DendriDBLab />} />
    </Routes>
  )
}
