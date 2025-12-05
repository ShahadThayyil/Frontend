import React from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import LandingPage from './pages/LandingPage'
import Footer from './components/Footer'
import Login from './pages/Login'
import CreateExam from './pages/CreateExam'
import ConductExam from './pages/ConductExam'
import PreviewExam from './pages/PreviewExam'
import ResultExam from './pages/ResultExam'
import Announcement from './pages/Announcments'
import StudentExam from './pages/StudentExam'
import StudentLogin from './pages/StudentLogin'
import Dashboard from './pages/Dashboard'
import LessonPlan from './pages/LessonPlan'
import LessonPreview from './pages/LessonPreview'


const App = () => {
  const location = useLocation();

  return (
    <div className="bg-slate-50 min-h-screen">

      {/* Navbar */}
      <Navbar />
         
      {/* Routes */}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        

      </Routes>

      {/* Footer only if NOT login page */}
      {location.pathname !== "/login" && <Footer />}
   

   
       


    </div>
  );
};

export default App;
