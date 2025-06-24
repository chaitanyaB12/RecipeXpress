const express = require("express")
const router = express.Router()
const {userLogin, userSignUp, getUser} = require("../controller/userController")

router.post("/SignUp", userSignUp)
router.post("/login", userLogin)
router.get("/:id", getUser) 

module.exports = router
