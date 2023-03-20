import { useState } from 'react'
import { BrowserRouter } from 'react-router-dom'
import reactLogo from './assets/react.svg'
import { Header } from './components/Header'
import { Router } from './Router'


function App() {

  return (
      <BrowserRouter>
        <Router />
      </BrowserRouter>

  )
}

export default App
