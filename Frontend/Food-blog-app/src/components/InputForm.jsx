import React, { useState } from 'react'
import axios from 'axios'


const BASE_URL = import.meta.env.VITE_BASE_URL;
console.log("BASE_URL:", BASE_URL);
const InputForm = ({setIsOpen,setToken, setUser, setIsLogin}) => {

    const[email,setEmail]=useState("")
    const[password, setPassword]=useState("")
    const[isSignUp,setIsSignUp]=useState(false)
    const[error, setError]=useState("")

   const handleOnSubmit = async (e) => {
    e.preventDefault();
    let endpoint = isSignUp ? "signUp" : "login";
    try {
        const res = await axios.post(`${BASE_URL}/user/${endpoint}`, { email, password });
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        setIsOpen();
        setToken(res.data.token);
setUser(res.data.user);
setIsLogin(false);
    } catch (err) {
        setError(err.response?.data?.error || "Server error");
    }
}


  return (
    <>
  
    <form className='form'  onSubmit={handleOnSubmit}>
        <div className='form-control'>
            <label>Email</label>
            <input type="email" className='input' onChange={(e)=>setEmail(e.target.value.trim())} required />
        </div>
          <div className='form-control'>
            <label>Password</label>
            <input type="password" className='input' onChange={(e)=>setPassword(e.target.value)} required />
        </div>
        <button type='submit'className='logindata' >{(isSignUp) ? "Sign Up" : "Login"}</button> <br /> <br />
       {(error != "") && <h6 className='error'>{error}</h6>} <br /> <br />
        <p onClick={()=>setIsSignUp(pre=>!pre)}>{(isSignUp) ? "Already have an account": "Create new account"}</p>
    </form>
    </>
  )
}

export default InputForm