import React, { useState } from 'react'
// import foodRecipe from "../assets/foodRecipe.png"
import Chef from "../assets/Chef.avif"
import RecipeItems from '../components/RecipeItems'
import { useNavigate } from 'react-router-dom'
import Modal from '../components/Modal'
import InputForm from '../components/InputForm'
const Home = () => {

  const navigate =useNavigate()
  const [isOpen, setIsOpen]=useState(false)

  const addRecipe=()=>{
    let token= localStorage.getItem("token")
    if(token)
      navigate("/addRecipe")
    else{
        setIsOpen(true)
    }
  }

  return (
    <>

    <section>
        <div className="home">
        <div className="left">
            <h2>Turn everyday meals into delicious memories. Share your recipe with the world.</h2>
            <button onClick={addRecipe}>Share Your recipe</button>
        </div>
        <div className="right">
            <img src={Chef} width ="600px" height="380px"/>
        </div>
        </div>
    </section>
    <div className='bg'>
         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#ff5500" fillOpacity="1" d="M0,64L48,90.7C96,117,192,171,288,170.7C384,171,480,117,576,80C672,43,768,21,864,42.7C960,64,1056,128,1152,160C1248,192,1344,192,1392,192L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path></svg>
          {/* getwavewebsite */}
        

    </div>

    {(isOpen) && <Modal onClose={()=>setIsOpen(false)}><InputForm setIsOpen={()=>setIsOpen(false)}/></Modal>}
    <div className='recipe'>
        <RecipeItems/>
    </div>
    

    </>
  )
}

export default Home