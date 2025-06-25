import React from 'react'
import profileImg from '../assets/profile.png'
import { useLoaderData } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

const BASE_URL = import.meta.env.VITE_BASE_URL;
console.log("BASE_URL:", BASE_URL);

export default function RecipeDetails() {
    const recipe=useLoaderData()
    console.log(recipe);
    const navigate = useNavigate()
    console.log(recipe)
  return (
   <>
    <div className='outer-container'>
        <button onClick={()=>navigate(-1)} className='black-button'>←Back</button>
        <div className='profile'>
            <img src={profileImg} width="50px" height="50px"></img>
            <h5>{recipe.email || "Anonymous"}</h5>
        </div>
        <h3 className='title-name'>{recipe.title}</h3>
        <img src={recipe.coverImage?.startsWith("http")? recipe.coverImage : `${BASE_URL}/images/${recipe.coverImage}`} width="220px" height="200px"></img>
        <div className='recipe-details'>
            <div className='ingredients'><h4>Ingredients</h4><ul>{recipe.ingredients.map((item, index)=>(<li key={index}>{item}</li>))}</ul></div>
            <div className='instructions'><h4>Instructions</h4><span>{recipe.instructions}</span></div>
        </div>
    </div>
   </>
  )
}