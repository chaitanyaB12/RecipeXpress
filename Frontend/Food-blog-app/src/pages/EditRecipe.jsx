import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

export default function EditRecipe() {
    const [recipeData, setRecipeData] = useState({
         title: "",
         ingredients: "",
         instructions: "",
         time: "",
         file: null
    })
    
    const navigate = useNavigate()
    const { id } = useParams()

    useEffect(() => {
        const getData = async () => {
            const response = await axios.get(`http://localhost:5000/recipe/${id}`);
            const res = response.data;
            setRecipeData({
                title: res.title || "",
                ingredients: Array.isArray(res.ingredients) ? res.ingredients.join(",") : res.ingredients || "",
                instructions: res.instructions || "",
                time: res.time || "",
                file: null // Don't prefill file input
            });
        };
        getData();
    }, [id])

    const onHandleChange = (e) => {
        let val;
        if (e.target.name === "ingredients") {
            val = e.target.value;
        } else if (e.target.type === "file") {
            val = e.target.files[0];
        } else {
            val = e.target.value;
        }
        setRecipeData(pre => ({ ...pre, [e.target.name]: val }))
    }

    const onHandleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("title", recipeData.title);
        formData.append("time", recipeData.time);
        formData.append("ingredients", recipeData.ingredients);
        formData.append("instructions", recipeData.instructions);
        if (recipeData.file) {
            formData.append("file", recipeData.file);
        }

        await axios.put(`http://localhost:5000/recipe/${id}`, formData, {
            headers: {
                'authorization': 'bearer ' + localStorage.getItem("token")
                // Do NOT set Content-Type manually!
            }
        });
        navigate("/myRecipe");
    };

    return (
        <>
        <div className='container'>
            <form className='form' onSubmit={onHandleSubmit}>
                 <button onClick={()=>navigate(-1)} className='editback-button'>←Back</button>
                <div className='form-control'>
                    <label>Title</label>
                    <input type="text" className='input' name="title" onChange={onHandleChange} value={recipeData.title} required/>
                </div>
                <div className='form-control'>
                    <label>Time</label>
                    <input type="text" className='input' name="time" onChange={onHandleChange} value={recipeData.time} required/>
                </div>
                <div className='form-control'>
                    <label>Ingredients</label>
                    <textarea type="text" className='input-textarea' name="ingredients" rows="5" onChange={onHandleChange} value={recipeData.ingredients} required></textarea>
                </div>
                <div className='form-control'>
                    <label>Instructions</label>
                    <textarea type="text" className='input-textarea' name="instructions" rows="5" onChange={onHandleChange} value={recipeData.instructions} required></textarea>
                </div>
                <div className='form-control'>
                    <label>Recipe Image</label>
                    <input type="file" className='input' name="file" onChange={onHandleChange} />
                </div>
                <button type="submit" className='editdone'>Edit Recipe</button>
            </form>
        </div>
        </>
    )
    
}
 