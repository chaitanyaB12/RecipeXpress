import React, { useEffect, useRef, useState } from 'react';
import Modal from './Modal';
import InputForm from './InputForm';
import { NavLink } from 'react-router-dom';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user")));
  const [isLogin, setIsLogin] = useState(!localStorage.getItem("token"));
  const [showDropdown, setShowDropdown] = useState(false);

  // Close dropdown when clicking outside
  const dropdownRef = useRef(null);
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const checkLogin = () => {
    if (token) {
      // logout
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setToken(null);
      setUser(null);
      setIsLogin(true);
      setShowDropdown(false);
    } else {
      setIsOpen(true); // open login modal
    }
  };

  return (
    <>
      <header>
        <h2 className='title'>RecipeXpress</h2>
        <ul>
          <li><NavLink to="/">Home</NavLink></li>
          <li onClick={() => isLogin && setIsOpen(true)}>
            <NavLink to={!isLogin ? "/myRecipe" : "/"}>My Recipe</NavLink>
          </li>
          <li onClick={() => isLogin && setIsOpen(true)}>
            <NavLink to={!isLogin ? "/favRecipe" : "/"}>Favourites</NavLink>
          </li>

          <li className="dropdown" ref={dropdownRef}>
            <p
              className="login"
              onClick={() => {
                if (isLogin) {
                  setIsOpen(true);
                  setShowDropdown(false);
                } else {
                  setShowDropdown((prev) => !prev);
                }
              }}
            >
              {isLogin ? "Login" : "👤 Profile ▼"}
            </p>

            {!isLogin && showDropdown && (
              <ul className="dropdown-menu">
                {user && <li className="dropdown-item">{user.email}</li>}
                <li className="dropdown-items" onClick={checkLogin}>Logout</li>
              </ul>
            )}
          </li>
        </ul>
      </header>

      {isOpen && (
        <Modal onClose={() => setIsOpen(false)}>
          <InputForm
            setIsOpen={() => setIsOpen(false)}
            setToken={setToken}
            setUser={setUser}
            setIsLogin={setIsLogin}
          />
        </Modal>
      )}
    </>
  );
}
