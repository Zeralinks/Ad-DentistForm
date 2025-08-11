import { useState } from 'react'
import LandingPage from './Pages/LandingPage'
import DashboardPage from './Pages/DashboardPage' 
import { BrowserRouter, Route, Routes,  } from 'react-router'
import DashboardOverview from './components/DashboardPage/DashboardOverview'
import LeadsSection from './components/DashboardPage/LeadSection'
import AppointmentsSection from './components/DashboardPage/AppointmentSection'
import FollowUpSection from './components/DashboardPage/FollowUpSection'
import IntegrationsSection from './components/DashboardPage/IntergrationSection'
import SettingsSection from './components/DashboardPage/SettingsSection'


function App() {
  const [count, setCount] = useState(0)

 return (
    <BrowserRouter>
      <Routes>
        <Route index element={<LandingPage />} />
        <Route path="/dashboard" element={<DashboardPage />} >
          <Route index element={<DashboardOverview />} />
          <Route path="leads" element={<LeadsSection/>} />
          <Route path="appointments" element={<AppointmentsSection/>} />
          <Route path="follow-ups" element={<FollowUpSection />} />
          <Route path="integrations" element={<IntegrationsSection />} />
          <Route path="settings" element={<SettingsSection />} />

        </Route>
      </Routes>    
    </BrowserRouter>
  )
}

export default App
