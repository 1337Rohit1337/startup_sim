import { GameShell } from './components/GameShell'
import { Toaster } from './components/ui/toast'
import './App.css'

function App() {
  return (
    <>
      <GameShell />
      <Toaster position="top-right" />
    </>
  )
}

export default App