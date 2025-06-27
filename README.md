# 🍽️ RecipeXpress

**RecipeXpress** is a full-stack food recipe sharing web app that allows users to add, edit, favorite, and explore recipes. Users can sign up and log in to manage their own recipes, all with a beautiful UI and image uploads using Cloudinary.

---

## 🔧 Tech Stack

### 🔹 Frontend:
- React.js
- React Router DOM
- Axios
- CSS (Custom styling)

 🔹 Backend:
- Node.js
- Express.js
- MongoDB (Atlas)
- Mongoose
- Multer + Cloudinary for image upload
- JWT (Authentication)

---

## 🌐 Live Links

- 🔗 **Frontend (Vercel):** [recipe-xpress.vercel.app](https://recipe-xpress.vercel.app)
- 🔗 **Backend (Render):** [recipexpress.onrender.com](https://recipexpress.onrender.com)

---

## ✨ Features

- 🔐 **Authentication**
  - Sign Up / Login (JWT-based)
  - Profile dropdown with logout
- 📸 **Image Upload**
  - Upload recipe image via Cloudinary
- 📄 **Recipe Management**
  - Add new recipes with title, time, ingredients, instructions, and image
  - Edit or delete your own recipes
  - View details of each recipe
- ❤️ **Favorites**
  - Mark/unmark recipes as favorites (frontend logic)
- 🔍 **Responsive Design**
  - Fully responsive cards, navbar, and dropdowns across devices
  - Background image with CSS wave and overlay

---

```📁 Project Structure
RecipeXpress/
├── Backend/
│   ├── config/
│   │   └── connectiondb.js
│   ├── controller/
│   │   ├── recipeController.js
│   │   └── userController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── cloudinaryUpload.js
│   ├── models/
│   │   ├── recipe.js
│   │   └── user.js
│   ├── routes/
│   │   ├── recipeRoutes.js
│   │   └── userRoutes.js
│   ├── utils/
│   │   └── cloudinary.js
│   └── index.js

├── Frontend/
│   ├── public/
│   │   ├── kitchen.jpg
│   │   └── vite.svg
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── InputForm.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── MainNavigation.jsx
│   │   │   ├── ScrollToTop.jsx
│   │   │   └── RecipeItems.jsx
│   │   ├── pages/
│   │   │   ├── AddFoodRecipe.jsx
│   │   │   ├── EditRecipe.jsx
│   │   │   ├── Home.jsx
│   │   │   └── RecipeDetails.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── App.css
│   └── vite.config.js

├── ScreenShots/
│   ├── Home.png
│   ├── SignUp.png
│   ├── Add New and Edit page.png
│   └── RecipeCards.png

├── .gitignore
├── package.json
├── README.md


```
---

## 🧪 Local Development Setup

### 🔹 Frontend (React)

bash
cd Frontend
npm install
npm run dev

###🔹Backend (Express)

cd Backend
npm install
npm start

---
🚀 Deployment
# Frontend (Vercel):

Connect GitHub repo to Vercel

Set environment variable

Vercel will auto-deploy on every push to main

# Backend (Render):

Create a Web Service

Connect to GitHub repo

Set environment variables

PORT

MONGODB_URI

SECRET_KEY

CLOUDINARY_CLOUD_NAME

CLOUDINARY_API_KEY

CLOUDINARY_API_SECRET

----Set deployment as Manual Deploy (optional)

Click “Deploy latest commit” after push

📸 Screenshots
🏠 ![Alt Text](https://github.com/chaitanyaB12/RecipeXpress/blob/781951b41248063c5d12fdb3fe41a7268aa2241a/ScreenShots/Home.png)
Features background, wave, and call-to-action with Share Recipe button.

🔐 Auth Modal
 ![Alt Text](https://github.com/chaitanyaB12/RecipeXpress/blob/781951b41248063c5d12fdb3fe41a7268aa2241a/ScreenShots/SignUp.png)
Login / Sign Up with toggle and inline error display.

🧾 Add/Edit Recipe
![Alt Text](https://github.com/chaitanyaB12/RecipeXpress/blob/781951b41248063c5d12fdb3fe41a7268aa2241a/ScreenShots/Add%20New%20and%20Edit%20page.png)
Responsive form with consistent input alignment and image upload.

📄 Recipe Cards
![Alt Text](https://github.com/chaitanyaB12/RecipeXpress/blob/781951b41248063c5d12fdb3fe41a7268aa2241a/ScreenShots/RecipeCards.png)
Uniform card layout with image, title, time, and icons.

## 👨‍💻 Author

### 💖 Made with love by **Chaitanya**


