import React from 'react'
import Footer from './Footer'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar' 
import ScrollToTop from './ScrollToTop'

const MainNavigation = () => {
  return (
    <>
    <div className='layout-wrapper'>
      <ScrollToTop/>
    </div>
    <Navbar/>
    <main className='main-content'>
    <Outlet/>
    </main>
    
    <Footer/>
    
    </>
  )
}

export default MainNavigation