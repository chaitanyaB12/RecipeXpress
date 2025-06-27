import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function AddFoodRecipe() {
    const [recipeData, setRecipeData] = useState({})
    const [isSubmitting, setIsSubmitting] = useState(false)
    const navigate = useNavigate()
  const onHandleChange = (e) => {
  let val = e.target.value;

  if (e.target.name === "ingredients") {
    val = val.split(",").map(i => i.trim()).filter(Boolean); // removes empty strings
  } else if (e.target.name === "file") {
    val = e.target.files[0];
  }

  setRecipeData(pre => ({ ...pre, [e.target.name]: val }));
};

    const onHandleSubmit = async (e) => {
  e.preventDefault();
  if (isSubmitting) return;

  const ingredients = recipeData.ingredients;
  const cleanedIngredients = Array.isArray(ingredients)
    ? ingredients
    : ingredients.split(',').map(i => i.trim()).filter(Boolean);

  if (cleanedIngredients.length === 0) {
    alert("Please enter at least one valid ingredient.");
    return;
  }

  setIsSubmitting(true);

  const formData = new FormData();
  formData.append("title", recipeData.title);
  formData.append("time", recipeData.time);
  formData.append("instructions", recipeData.instructions);
  formData.append("ingredients", cleanedIngredients.join(","));
  formData.append("file", recipeData.file);


  await axios.post(`${BASE_URL}/recipe`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'authorization': 'bearer ' + localStorage.getItem("token")
    }
  }).then(() => navigate("/"));
  }

    return (
        <>
            <div className='container add-recipe'>
             <form className='form' onSubmit={onHandleSubmit}>
                <button type='button' onClick={()=>navigate(-1)} className='home-button'>←Back</button>
                    <div className='form-control'>
                        <label>Title</label>
                        <input type="text" className='input' name="title" onChange={onHandleChange} required></input>
                    </div>
                    <div className='form-control'>
                        <label>Time</label>
                        <input type="text" className='input' name="time" onChange={onHandleChange}></input>
                    </div>
                    <div className='form-control'>
                        <label>Ingredients</label>
                        <textarea type="text" className='input-textarea' name="ingredients" rows="5" onChange={onHandleChange} required></textarea>
                    </div>
                    <div className='form-control'>
                        <label>Instructions</label>
                        <textarea type="text" className='input-textarea' name="instructions" rows="5" onChange={onHandleChange} required></textarea>
                    </div>
                    <div className='form-control'>
                        <label>Recipe Image</label>
                        <input type="file" className='input' name="file" onChange={onHandleChange} required></input>
                    </div>
                    <button type="submit" disabled={isSubmitting} className='add-rec'>Add Recipe</button>
                </form>
            </div>
        </>
    )
}