const express = require("express");
const router = express.Router();
const {getRecipes,getRecipe,addRecipe,editRecipe, deleteRecipe} = require("../controller/recipeController");
const verifyToken = require("../middleware/auth");
const upload = require("../middleware/cloudinaryUpload");

router.post("/", verifyToken, (req, res, next) => {
  console.log("🔍 Before upload middleware");
  next();
}, upload.single('file'), (req, res, next) => {
  console.log("🔍 After upload middleware");
  console.log("📁 req.file:", req.file);
  next();
}, addRecipe);

// Add this to your recipe routes temporarily
router.post("/test-upload", upload.single('file'), (req, res) => {
  console.log("Test upload - req.file:", req.file);
  if (req.file) {
    res.json({ 
      success: true, 
      file: req.file,
      cloudinaryUrl: req.file.path 
    });
  } else {
    res.status(400).json({ success: false, message: "No file uploaded" });
  }
});

 router.get("/",getRecipes) //get all Recipes
 router.get("/:id",getRecipe) //get recipe by id
//  router.post("/",verifyToken, upload.single('file') , addRecipe) // add recipe
 router.put("/:id", verifyToken, upload.single('file'), editRecipe); //Edit Recipes
 router.delete("/:id",deleteRecipe) //Delete recipe
module.exports = router;