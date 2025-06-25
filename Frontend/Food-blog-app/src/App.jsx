import React from 'react'
import './App.css'
import {createBrowserRouter,RouterProvider} from "react-router-dom"
import Home from './pages/Home'
import MainNavigation from './components/MainNavigation'
import axios from 'axios'
import  AddFoodRecipe  from './pages/AddFoodRecipe'
import EditRecipe from './pages/EditRecipe'
import RecipeDetails from './pages/RecipeDetails'

const BASE_URL = import.meta.env.VITE_BASE_URL;
console.log("BASE_URL:", BASE_URL);

const getAllRecipes = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/recipe`);
    const data = res.data;
    if (Array.isArray(data)) {
      return data;
    } else {
      console.error("Invalid response:", data);
      return []; // fallback
    }
  } catch (err) {
    console.error("Failed to fetch recipes:", err.message);
    return []; // fallback
  }
};

const getMyRecipes = async () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user || !user._id) {
    throw new Response("Unauthorized", { status: 401 });
  }

  const allRecipes = await getAllRecipes();
  if (!Array.isArray(allRecipes)) {
    console.error("Expected array, got:", allRecipes);
    return [];
  }

  return allRecipes.filter(item => item.createdBy === user._id);
};


const getFavRecipes=()=>{
  return JSON.parse(localStorage.getItem("fav"))
}

const getRecipe = async ({ params }) => {
  try {
    const recipeRes = await axios.get(`${BASE_URL}/recipe/${params.id}`);
    const recipe = recipeRes.data;

    if (!recipe.createdBy) return { ...recipe, email: "Anonymous" };

    try {
      const userRes = await axios.get(`${BASE_URL}/user/${recipe.createdBy}`);
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