import { Route, Routes } from 'react-router-dom'
import Landing from '@/pages/Landing'
import HackathonList from '@/pages/HackathonList'
import HackathonDetail from '@/pages/HackathonDetail'
import RegisterHackathon from '@/pages/RegisterHackathon'
import ParticipantDashboard from '@/pages/ParticipantDashboard'
import SubmitProject from '@/pages/SubmitProject'
import JudgePanel from '@/pages/JudgePanel'
import OrganizerDashboard from '@/pages/OrganizerDashboard'
import Leaderboard from '@/pages/Leaderboard'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/hackathons" element={<HackathonList />} />
      <Route path="/hackathon/:id" element={<HackathonDetail />} />
      <Route path="/register-hackathon" element={<RegisterHackathon />} />
      <Route path="/participant" element={<ParticipantDashboard />} />
      <Route path="/submit" element={<SubmitProject />} />
      <Route path="/judge" element={<JudgePanel />} />
      <Route path="/organizer" element={<OrganizerDashboard />} />
      <Route path="/leaderboard" element={<Leaderboard />} />
    </Routes>
  )
}
