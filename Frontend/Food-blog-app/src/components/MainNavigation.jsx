import React from 'react'
import Footer from './Footer'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar' 
import ScrollToTop from './ScrollToTop'

const MainNavigation = () => {
  return (
    <>
    <ScrollToTop/>
    <Navbar/>
    <Outlet/>
    <Footer/>
    
    </>
  )
}

export default MainNavigation