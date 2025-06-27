import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function AddFoodRecipe() {
  
    const [recipeData, setRecipeData] = useState({
        title: '',
        time: '',
        ingredients: '',
        instructions: '',
        file: null
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const navigate = useNavigate()

    const onHandleChange = (e) => {
        let val = e.target.value;

        if (e.target.name === "ingredients") {
            // Keep as string for now, we'll process it on submit
            val = e.target.value;
        } else if (e.target.name === "file") {
            val = e.target.files[0];
        }

        setRecipeData(pre => ({ ...pre, [e.target.name]: val }));
    };

    const onHandleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;

        // Debug logging
        console.log("🔍 BASE_URL:", BASE_URL);
        console.log("🔍 Token:", localStorage.getItem("token"));
        console.log("🔍 User:", localStorage.getItem("user"));

        // Validation
        if (!recipeData.title?.trim()) {
            alert("Please enter a recipe title.");
            return;
        }

        if (!recipeData.instructions?.trim()) {
            alert("Please enter cooking instructions.");
            return;
        }

        if (!recipeData.ingredients?.trim()) {
            alert("Please enter ingredients.");
            return;
        }

        if (!recipeData.file) {
            alert("Please upload a recipe image.");
            return;
        }

        // Process ingredients
        const cleanedIngredients = recipeData.ingredients
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
            formData.append("title", recipeData.title.trim());
            formData.append("time", recipeData.time?.trim() || "");
            formData.append("instructions", recipeData.instructions.trim());
            formData.append("ingredients", cleanedIngredients.join(","));
            formData.append("file", recipeData.file);

            console.log("📤 Submitting to:", `${BASE_URL}/recipe`);
            console.log("📤 FormData contents:");
            for (let pair of formData.entries()) {
                console.log(`  ${pair[0]}:`, pair[1]);
            }

            const response = await axios.post(`${BASE_URL}/recipe`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': 'Bearer ' + localStorage.getItem("token")
                },
                timeout: 60000 // 60 seconds timeout for Render free tier
            });

            console.log("✅ Recipe added successfully:", response.data);
            alert("Recipe added successfully!");
            navigate("/");

        } catch (err) {
            console.error("❌ Recipe submission failed:", err);
            
            // Better error handling
            if (err.response) {
                console.error("❌ Response data:", err.response.data);
                console.error("❌ Response status:", err.response.status);
                console.error("❌ Response headers:", err.response.headers);
                
                if (err.response.status === 401) {
                    alert("Please log in to add recipes.");
                } else if (err.response.status === 400) {
                    alert(err.response.data.message || "Invalid data provided.");
                } else {
                    alert(`Error: ${err.response.data.message || 'Something went wrong'}`);
                }
            } else if (err.request) {
                console.error("❌ Request made but no response:", err.request);
                alert("Network error. Please check your connection and backend server.");
            } else {
                console.error("❌ Error setting up request:", err.message);
                alert("Something went wrong while adding your recipe.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
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
        </>
    )
}