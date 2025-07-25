const Recipes = require("../models/recipe");

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

    if (!title || !ingredients || !instructions || !req.file) {
      return res.status(400).json({ message: "All fields and image are required" });
    }

    const ingredientsArr = Array.isArray(ingredients)
      ? ingredients
      : ingredients.split(',').map(i => i.trim());

    const imageUrl = req.file?.path;

    const newRecipe = await Recipes.create({
      title,
      ingredients: ingredientsArr,
      instructions,
      time,
      coverImage: imageUrl,
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
    const recipe = await Recipes.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });

    const ingredientsArr = Array.isArray(ingredients)
      ? ingredients
      : ingredients.split(',').map(i => i.trim());

    const coverImage = req.file?.path || recipe.coverImage;

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
    return res.status(400).json({ message: "Failed to delete recipe", error: err.message });
  }
};

module.exports = {
  getRecipes,
  getRecipe,
  addRecipe,
  editRecipe,
  deleteRecipe
};
