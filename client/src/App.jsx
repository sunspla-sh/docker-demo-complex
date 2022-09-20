import { Routes, Route } from 'react-router-dom'
import './App.css'
import HomePage from './pages/HomePage'
import OtherPage from './pages/OtherPage'

function App() {

  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/other' element={<OtherPage />} />
      </Routes>
    </div>
  )
}

export default App
