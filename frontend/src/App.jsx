import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Testapi from './components/Testapi'
import TestCanvas from './components/TestCanvas';
import HomePage from './pages/HomePage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='' element={<HomePage />} />
        <Route path='/test' element={<Testapi />} />
        <Route path='/testcanvas' element={<TestCanvas />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
