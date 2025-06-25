import React from 'react'
import './App.css'
import {createBrowserRouter,RouterProvider} from "react-router-dom"
import Home from './pages/Home'
import MainNavigation from './components/MainNavigation'
import axios from 'axios'
import  AddFoodRecipe  from './pages/AddFoodRecipe'
import EditRecipe from './pages/EditRecipe'
import RecipeDetails from './pages/RecipeDetails'


const getAllRecipes=async()=>{
  let allRecipes=[]
  await axios.get('http://localhost:5000/recipe').then(res=>{
    allRecipes=res.data
  })
  return allRecipes
}

const getMyRecipes=async()=>{
  let user=JSON.parse(localStorage.getItem("user"))
  if(!user || !user._id){
    throw new Response("Unathorized",{status:401})
  }
  let allRecipes=await getAllRecipes();
  return allRecipes.filter(item=>item.createdBy===user._id)
}

const getFavRecipes=()=>{
  return JSON.parse(localStorage.getItem("fav"))
}

const getRecipe = async ({ params }) => {
  try {
    const recipeRes = await axios.get(`http://localhost:5000/recipe/${params.id}`);
    const recipe = recipeRes.data;

    if (!recipe.createdBy) return { ...recipe, email: "Anonymous" };

    try {
      const userRes = await axios.get(`http://localhost:5000/user/${recipe.createdBy}`);
      return { ...recipe, email: userRes.data?.email || "Anonymous" };
    } catch (innerErr) {
      console.warn("User not found:" ,innerErr.message);
      return { ...recipe, email: "Anonymous" };
    }

  } catch (err) {
    console.error("❌ Error loading recipe details:", err.message);
    throw new Response("Failed to load recipe", { status: 500 });
  }
};



const router=createBrowserRouter([
  {path:"/",element:<MainNavigation/>,children:[
    {path:"/",element:<Home/>,loader:getAllRecipes},
    {path:"/myRecipe",element:<Home/>,loader:getMyRecipes},
    {path:"/favRecipe",element:<Home/>,loader:getFavRecipes},
    {path:"/addRecipe",element:<AddFoodRecipe/>},
    {path:"/editRecipe/:id",element:<EditRecipe/>},
    {path:"/recipe/:id",element:<RecipeDetails/>,loader:getRecipe}
  ]}
 
])

export default function App() {
  return (
   <>
   <RouterProvider router={router}></RouterProvider>
   </>
  )
}