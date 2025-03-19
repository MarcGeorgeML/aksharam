import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Testapi from './components/Testapi'
import TestCanvas from './components/TestCanvas';
import HomePage from './pages/HomePage';
import TestHomePage from './pages/TestHomePage';
import Register from './pages/Register';
import Login from './pages/Login';
import Logout from './components/Logout';
import NotFound from './pages/NottFound';
import ProtectedRoute from './components/ProtectedRoute';
import Letters from './pages/Letters';
import LandingPage from './pages/LandingPage';
import LetterDetails from './pages/LetterDetails';
import WordDetails from './pages/WordDetails';
import SmartScan from './pages/SmartScan';
import Words from './pages/Words';

function RegisterAndLogout() {
  localStorage.clear()
  return <Register/>
}


function App() {
  return (
    <BrowserRouter>
      <Routes>
      <Route path='/' element={<LandingPage />} />
        <Route path='/home' element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        } />
        <Route path='/letters' element={
          <ProtectedRoute>
            <Letters />
          </ProtectedRoute>
        } />
        <Route path='/letters/:id' element={
          <ProtectedRoute>
            <LetterDetails />
          </ProtectedRoute>
        } />
        <Route path='/words' element={
          <ProtectedRoute>
            <Words />
          </ProtectedRoute>
        } />
        <Route path='/words/:id' element={
          <ProtectedRoute>
            <WordDetails />
          </ProtectedRoute>
        } />
        <Route path='/scan' element={
          <ProtectedRoute>
            <SmartScan />
          </ProtectedRoute>
        } />
        <Route path='/testhome' element={
          <ProtectedRoute>
            <TestHomePage />
          </ProtectedRoute>
        } />
        <Route path='/testcanvas' element={
          <ProtectedRoute>
          <TestCanvas />
        </ProtectedRoute>
        } />
        <Route path='/test' element={<Testapi />} />
        <Route path="/login" element={<Login />}/>
        <Route path="/logout" element={<Logout />}/>
        <Route path="/register" element={<RegisterAndLogout />}/>
        <Route path="*" element={<NotFound />}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
