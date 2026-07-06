import { Route, Routes } from 'react-router-dom'
import AuthRedirect from './components/AuthRedirect.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import AppLayout from './layouts/AppLayout.jsx'
import Diet from './pages/Diet/Diet.jsx'
import DietReport from './pages/DietReport/DietReport.jsx'
import HealthAI from './pages/HealthAI/HealthAI.jsx'
import Home from './pages/Home/Home.jsx'
import Landing from './pages/Landing/Landing.jsx'
import Login from './pages/Login/Login.jsx'
import Pedometer from './pages/Pedometer/Pedometer.jsx'
import Profile from './pages/Profile/Profile.jsx'
import Signup from './pages/Signup/Signup.jsx'
import ExerciseRankings from './pages/Workout/ExerciseRankings.jsx'
import Workout from './pages/Workout/Workout.jsx'

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Landing />} />
        <Route element={<AuthRedirect />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<Profile />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<Home />} />
          <Route path="/pedometer" element={<Pedometer />} />
          <Route path="/workout" element={<Workout />} />
          <Route path="/workout/exercises" element={<ExerciseRankings />} />
          <Route path="/diet" element={<Diet />} />
          <Route path="/diet-report" element={<DietReport />} />
          <Route path="/health-ai" element={<HealthAI />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App
