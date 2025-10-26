import { GameShell } from './components/GameShell'
import { Toaster } from './components/ui/toast'
import { BrowserRouter as Router } from 'react-router-dom';
import './App.css'

function App() {
  return (
    <>
    <Router>
      <GameShell />
      <Toaster position="top-right" />
    </Router> 
    </>
  )
}

export default App