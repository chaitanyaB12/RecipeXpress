const Recipes = require("../models/recipe");
const multer = require('multer');
const path = require('path');

// Multer setup with extension preserved
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images');
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const filename = Date.now() + '-' + file.fieldname + ext;
    cb(null, filename);
  }
});
const upload = multer({ storage: storage });

const getRecipes = async (req, res) => {
  try {
    const recipes = await Recipes.find();
    return res.json(recipes);
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

const getRecipe = async (req, res) => {
  try {
    const recipe = await Recipes.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });
    res.json(recipe);
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

const addRecipe = async (req, res) => {
  try {
    const { title, ingredients, instructions, time } = req.body;
    if (!title || !ingredients || !instructions) {
      return res.status(400).json({ message: "Required fields can't be empty" });
    }

    // Convert ingredients to array if sent as string
    let ingredientsArr = Array.isArray(ingredients)
      ? ingredients
      : ingredients.split(',').map(i => i.trim());

    if (!req.file) {
      return res.status(400).json({ message: "Image file is required" });
    }

    const newRecipe = await Recipes.create({
      title,
      ingredients: ingredientsArr,
      instructions,
      time,
      coverImage: req.file.filename,
      createdBy: req.user.id
    });
    return res.status(201).json(newRecipe);
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

const editRecipe = async (req, res) => {
  try {
    const { title, ingredients, instructions, time } = req.body;
    let recipe = await Recipes.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });

    // Convert ingredients to array if sent as string
    let ingredientsArr = Array.isArray(ingredients)
      ? ingredients
      : ingredients.split(',').map(i => i.trim());

    let coverImage = req.file?.filename ? req.file.filename : recipe.coverImage;

    const updatedRecipe = await Recipes.findByIdAndUpdate(
      req.params.id,
      { title, ingredients: ingredientsArr, instructions, time, coverImage },
      { new: true }
    );
    res.json(updatedRecipe);
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

const deleteRecipe = async (req, res) => {
  try {
    await Recipes.deleteOne({ _id: req.params.id });
    res.json({ status: "ok" });
  } catch (err) {
    return res.status(400).json({ message: "error", error: err.message });
  }
};

module.exports = { getRecipes, getRecipe, addRecipe, editRecipe, deleteRecipe, upload };
