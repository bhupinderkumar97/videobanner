import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './Pages/Home'
import About from './Pages/About'
import Contact from './Pages/Contact'
import WebDesign from './Pages/WebDesign'

export default function RoutingAll() {
  return (
    <Routes>
       <Route path='/' element={<Home/>}/>
       <Route path='/about' element={<About/>}/>
       <Route path='/contact' element={<Contact/>}/>
       <Route path='/web-design' element={<WebDesign/>}/>
    </Routes>
  )
}
