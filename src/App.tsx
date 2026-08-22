import { Navigate, Route, Routes } from 'react-router-dom'
import Shell from '@/layout/Shell'
import Overview from '@/pages/Overview'
import About from '@/pages/About'
import BiteScoreLab from '@/pages/BiteScoreLab'
import DendriDBLab from '@/pages/DendriDBLab'

export default function App() {
  return (
    <Routes>
      <Route element={<Shell />}>
        <Route path="/" element={<Overview />} />
        <Route path="/work" element={<Navigate to="/" replace />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Navigate to="/about" replace />} />
        <Route path="/content" element={<Navigate to="/about" replace />} />
      </Route>
      <Route path="/labs/bite-score" element={<BiteScoreLab />} />
      <Route path="/labs/dendridb" element={<DendriDBLab />} />
    </Routes>
  )
}
