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

    // Add API connection test function
    const testAPIConnection = async () => {
        try {
            console.log('=== TESTING API CONNECTION ===');
            console.log('🔍 BASE_URL:', BASE_URL);
            console.log('🔍 Token:', localStorage.getItem("token"));
            
            // Test basic connectivity - try to get recipes
            const response = await axios.get(`${BASE_URL}/recipe`, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem("token")
                },
                timeout: 10000
            });
            
            console.log('✅ API Connection Test - Status:', response.status);
            console.log('✅ API Connection Test - Response:', response.data);
            alert('API connection successful!');
            
        } catch (error) {
            console.error('❌ API Connection Test Failed:', error);
            if (error.response) {
                console.error('❌ Response status:', error.response.status);
                console.error('❌ Response data:', error.response.data);
                alert(`API connection failed: ${error.response.status} - ${error.response.data?.message || 'Unknown error'}`);
            } else if (error.request) {
                console.error('❌ No response received:', error.request);
                alert('Network error: Cannot reach the server');
            } else {
                console.error('❌ Request setup error:', error.message);
                alert(`Connection error: ${error.message}`);
            }
        }
    };

    const onHandleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;

        console.log("=== DEBUGGING RECIPE SUBMISSION ===");
        
        // Enhanced debugging
        console.log("🔍 Environment Check:");
        console.log("  BASE_URL:", BASE_URL);
        console.log("  Token exists:", !!localStorage.getItem("token"));
        console.log("  Token length:", localStorage.getItem("token")?.length || 0);
        console.log("  User data:", localStorage.getItem("user"));

        console.log("🔍 Form Data Check:");
        console.log("  Title:", recipeData.title);
        console.log("  Time:", recipeData.time);
        console.log("  Ingredients:", recipeData.ingredients);
        console.log("  Instructions:", recipeData.instructions);
        console.log("  File:", recipeData.file?.name, recipeData.file?.size, recipeData.file?.type);

        // Validation
        if (!recipeData.title?.trim()) {
            console.error("❌ Validation failed: Missing title");
            alert("Please enter a recipe title.");
            return;
        }

        if (!recipeData.instructions?.trim()) {
            console.error("❌ Validation failed: Missing instructions");
            alert("Please enter cooking instructions.");
            return;
        }

        if (!recipeData.ingredients?.trim()) {
            console.error("❌ Validation failed: Missing ingredients");
            alert("Please enter ingredients.");
            return;
        }

        if (!recipeData.file) {
            console.error("❌ Validation failed: Missing file");
            alert("Please upload a recipe image.");
            return;
        }

        // Check file size (optional)
        if (recipeData.file.size > 5 * 1024 * 1024) { // 5MB limit
            console.error("❌ File too large:", recipeData.file.size);
            alert("File size too large. Please choose an image smaller than 5MB.");
            return;
        }

        // Process ingredients
        const cleanedIngredients = recipeData.ingredients
            .split(',')
            .map(i => i.trim())
            .filter(Boolean);

        if (cleanedIngredients.length === 0) {
            console.error("❌ Validation failed: No valid ingredients");
            alert("Please enter at least one valid ingredient.");
            return;
        }

        console.log("✅ Validation passed. Processed ingredients:", cleanedIngredients);

        setIsSubmitting(true);

        try {
            const formData = new FormData();
            formData.append("title", recipeData.title.trim());
            formData.append("time", recipeData.time?.trim() || "");
            formData.append("instructions", recipeData.instructions.trim());
            formData.append("ingredients", cleanedIngredients.join(","));
            formData.append("file", recipeData.file);

            console.log("📤 FormData being sent:");
            for (let pair of formData.entries()) {
                if (pair[0] === 'file') {
                    console.log(`  ${pair[0]}:`, {
                        name: pair[1].name,
                        size: pair[1].size,
                        type: pair[1].type
                    });
                } else {
                    console.log(`  ${pair[0]}:`, pair[1]);
                }
            }

            console.log("📤 Request details:");
            console.log("  URL:", `${BASE_URL}/recipe`);
            console.log("  Method: POST");
            console.log("  Content-Type: multipart/form-data");
            console.log("  Authorization: Bearer " + (localStorage.getItem("token") ? "[TOKEN_PRESENT]" : "[NO_TOKEN]"));

            const response = await axios.post(`${BASE_URL}/recipe`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': 'Bearer ' + localStorage.getItem("token")
                },
                timeout: 60000, // 60 seconds timeout for Render free tier
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    console.log(`📤 Upload progress: ${percentCompleted}%`);
                }
            });

            console.log("✅ SUCCESS! Recipe added:");
            console.log("  Status:", response.status);
            console.log("  Response data:", response.data);
            console.log("  Response headers:", response.headers);
            
            alert("Recipe added successfully!");
            navigate("/");

        } catch (err) {
            console.log("=== ERROR ANALYSIS ===");
            console.error("❌ Recipe submission failed:", err);
            
            // Comprehensive error analysis
            if (err.response) {
                console.error("❌ Server responded with error:");
                console.error("  Status:", err.response.status);
                console.error("  Status Text:", err.response.statusText);
                console.error("  Data:", err.response.data);
                console.error("  Headers:", err.response.headers);
                
                // Specific error handling
                switch (err.response.status) {
                    case 400:
                        console.error("❌ Bad Request - Check your data format");
                        alert(`Bad Request: ${err.response.data?.message || 'Invalid data provided'}`);
                        break;
                    case 401:
                        console.error("❌ Unauthorized - Check your token");
                        alert("Please log in to add recipes.");
                        break;
                    case 403:
                        console.error("❌ Forbidden - Token might be expired");
                        alert("Access denied. Please log in again.");
                        break;
                    case 413:
                        console.error("❌ Payload too large - File might be too big");
                        alert("File too large. Please choose a smaller image.");
                        break;
                    case 500:
                        console.error("❌ Internal Server Error - Backend issue");
                        alert("Server error. Please try again later.");
                        break;
                    default:
                        alert(`Error ${err.response.status}: ${err.response.data?.message || 'Something went wrong'}`);
                }
            } else if (err.request) {
                console.error("❌ Network Error - No response received:");
                console.error("  Request:", err.request);
                console.error("  This usually means:");
                console.error("    - Server is down");
                console.error("    - Network connectivity issues");
                console.error("    - CORS issues");
                console.error("    - Wrong BASE_URL");
                alert("Network error. Please check your connection and try again.");
            } else {
                console.error("❌ Request Setup Error:");
                console.error("  Message:", err.message);
                console.error("  Code:", err.code);
                alert(`Request error: ${err.message}`);
            }

            // Additional debugging info
            console.log("🔍 Additional Debug Info:");
            console.log("  Current URL:", window.location.href);
            console.log("  BASE_URL configured:", BASE_URL);
            console.log("  Token length:", localStorage.getItem("token")?.length || 0);
            console.log("  Browser:", navigator.userAgent);
            
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <div className='container add-recipe'>
                <form className='form' onSubmit={onHandleSubmit}>
                    <button type='button' onClick={() => navigate(-1)} className='home-button'>←Back</button>
                    
                    {/* Add test button temporarily */}
                    <button 
                        type='button' 
                        onClick={testAPIConnection}
                        className='home-button'
                        style={{marginLeft: '10px', backgroundColor: '#007bff'}}
                    >
                        Test API
                    </button>
                    
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