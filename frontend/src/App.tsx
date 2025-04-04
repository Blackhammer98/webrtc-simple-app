

import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import { HomePage } from './pages/HomePage'
import  RoomPage  from './pages/RoomPage'


function App() {
  

  return (
    <BrowserRouter>
    <Routes>
     <Route path='/' element = {<HomePage/>}/>
     <Route path='/room/:roomId' element = {<RoomPage/>}/>
    </Routes>
    </BrowserRouter> 
   )
}

export default App
