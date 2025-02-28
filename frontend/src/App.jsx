import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Testapi from './components/Testapi'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/test' element={<Testapi/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
