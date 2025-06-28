import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function AddFoodRecipe() {
  const [recipeData, setRecipeData] = useState({
    title: '',
    time: '',
    ingredients: '',
    instructions: '',
    file: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const onHandleChange = (e) => {
    let val = e.target.value;

    if (e.target.name === "file") {
      val = e.target.files[0];
    }

    setRecipeData(pre => ({ ...pre, [e.target.name]: val }));
  };

  const onHandleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    const { title, time, ingredients, instructions, file } = recipeData;

    if (!title.trim() || !ingredients.trim() || !instructions.trim() || !file) {
      alert("Please fill in all required fields and upload an image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("File size too large. Please choose an image smaller than 5MB.");
      return;
    }

    const cleanedIngredients = ingredients
      .split(',')
      .map(i => i.trim())
      .filter(Boolean);

    if (cleanedIngredients.length === 0) {
      alert("Please enter at least one valid ingredient.");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("time", time.trim());
      formData.append("instructions", instructions.trim());
      formData.append("ingredients", cleanedIngredients.join(","));
      formData.append("file", file);

      await axios.post(`${BASE_URL}/recipe`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': 'Bearer ' + localStorage.getItem("token")
        }
      });

      alert("Recipe added successfully!");
      navigate("/");
    } catch (err) {
      const status = err.response?.status;
      if (status === 400) alert("Bad request: Please check your input.");
      else if (status === 401 || status === 403) alert("Unauthorized. Please login.");
      else if (status === 413) alert("Image too large.");
      else alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='container add-recipe'>
      <form className='form' onSubmit={onHandleSubmit}>
        <button type='button' onClick={() => navigate(-1)} className='home-button'>←Back</button>

        <div className='form-control'>
          <label>Title *</label>
          <input
            type="text"
            className='input'
            name="title"
            value={recipeData.title}
            onChange={onHandleChange}
            required
          />
        </div>

        <div className='form-control'>
          <label>Time</label>
          <input
            type="text"
            className='input'
            name="time"
            value={recipeData.time}
            onChange={onHandleChange}
            placeholder="e.g., 30 mins"
          />
        </div>

        <div className='form-control'>
          <label>Ingredients * (separate with commas)</label>
          <textarea
            className='input-textarea'
            name="ingredients"
            rows="5"
            value={recipeData.ingredients}
            onChange={onHandleChange}
            required
            placeholder="e.g., 2 cups flour, 1 cup sugar, 3 eggs"
          />
        </div>

        <div className='form-control'>
          <label>Instructions *</label>
          <textarea
            className='input-textarea'
            name="instructions"
            rows="5"
            value={recipeData.instructions}
            onChange={onHandleChange}
            required
            placeholder="Step by step cooking instructions..."
          />
        </div>

        <div className='form-control'>
          <label>Recipe Image *</label>
          <input
            type="file"
            className='input'
            name="file"
            onChange={onHandleChange}
            accept="image/*"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className='add-rec'
        >
          {isSubmitting ? 'Adding Recipe...' : 'Add Recipe'}
        </button>
      </form>
    </div>
  );
}
