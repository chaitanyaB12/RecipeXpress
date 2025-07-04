const express = require("express")
const app = express()
const dotenv = require("dotenv").config()
const connectDb =require("./config/connectiondb")
const cors = require("cors")

const PORT = process.env.PORT || 3000
connectDb()


app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://recipe-xpress.vercel.app",
    "https://recipe-xpress-81zcy9c5z-chaitanyas-projects-7e70116a.vercel.app" // add preview too
  ],
  credentials: true,
}));

app.use(express.static("public"))
 
app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/user",require("./routes/userRoutes"))
app.use("/recipe",require("./routes/recipeRoutes"))

app.listen(PORT, (err)=>{
 console.log(`App is listening on port ${PORT}`);
})