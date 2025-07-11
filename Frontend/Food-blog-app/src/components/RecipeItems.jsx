import React, { useEffect, useState } from 'react'
import { Link, useLoaderData, useNavigate } from 'react-router-dom'

import { BsStopwatchFill } from "react-icons/bs";
import { FaHeart } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import axios from 'axios';


const BASE_URL = import.meta.env.VITE_BASE_URL;


export default function RecipeItems() {
    const recipes = useLoaderData()
    // console.log("recipes from loader:", recipes);
    const [allRecipes, setAllRecipes] = useState()
    let path = window.location.pathname === "/myRecipe" ? true : false
    let favItems = JSON.parse(localStorage.getItem("fav")) ?? []
    const [isFavRecipe, setIsFavRecipe] = useState(false)
    const navigate=useNavigate()
    // console.log(allRecipes)

   useEffect(() => {
  if (Array.isArray(recipes)) {
    setAllRecipes(recipes);
  } else {
    console.error("Expected recipes to be an array but got:", recipes);
    setAllRecipes([]); // fail-safe to avoid crashing
  }
}, [recipes]);

    const onDelete = async (id) => {
        await axios.delete(`${BASE_URL}/recipe/${id}`)
            .then((res) => console.log(res))
        setAllRecipes(recipes => recipes.filter(recipe => recipe._id !== id))
        let filterItem = favItems.filter(recipe => recipe._id !== id)
        localStorage.setItem("fav", JSON.stringify(filterItem))
    }

    const favRecipe = (item) => {
        console.log(isFavRecipe)
        let filterItem = favItems.filter(recipe => recipe._id !== item._id)
        favItems = favItems.filter(recipe => recipe._id === item._id).length === 0 ? [...favItems, item] : filterItem
        localStorage.setItem("fav", JSON.stringify(favItems))
        setIsFavRecipe(pre => !pre)
    }

    return (
        <>
            <div className='card-container'>
                {
                    allRecipes?.map((item, index) => {
                        return (
                            <div key={index} className='card'onClick={()=>navigate(`/recipe/${item._id}`)}>
                                <img src={item.coverImage?.startsWith("http")? item.coverImage : `${BASE_URL}/images/${item.coverImage}`} width="120px" height="100px" className='card-img'></img>
                                <div className='card-body'>
                                    <div className='title'>{item.title}</div>
                                    <div className='icons'>
                                        <div className='timer'><BsStopwatchFill />{item.time}</div>
                                        {(!path) ? <FaHeart onClick={(e) =>{e.stopPropagation(); favRecipe(item)}}
                                            style={{ color: (favItems.some(res => res._id === item._id)) ? "red" : "" }} /> :
                                            <div className='action'>
                                                <Link to={`/editRecipe/${item._id}`} className="editIcon" onClick={(e)=>e.stopPropagation()}><FaEdit /></Link>
                                                <MdDelete onClick={(e) =>{e.stopPropagation(); onDelete(item._id)}} className='deleteIcon' />
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </>
    )
}