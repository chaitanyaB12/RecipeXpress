const express = require("express");
const router = express.Router();
const {getRecipes,getRecipe,addRecipe,editRecipe, deleteRecipe} = require("../controller/recipeController");
const verifyToken = require("../middleware/auth");
const upload = require("../middleware/cloudinaryUpload");


 router.get("/",getRecipes) //get all Recipes
 router.get("/:id",getRecipe) //get recipe by id
 router.post("/",verifyToken, upload.single('file') , addRecipe) // add recipe
 router.put("/:id", verifyToken, upload.single('file'), editRecipe); //Edit Recipes
 router.delete("/:id",deleteRecipe) //Delete recipe
module.exports = router;