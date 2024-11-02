import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ShoppingCartOutlined, HeartOutlined, UserOutlined } from "@ant-design/icons";
import { Badge } from "antd";
import { useAuthContext } from "contexts/AuthContext";
import logo from '../../Assets/logo.png'

export default function Header() {
  const { isAuthenticated } = useAuthContext();
  const nav = useRef(null);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  // Function to update counts from localStorage
  const updateCounts = () => {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const wishlistItems = JSON.parse(localStorage.getItem('wishlist')) || [];
    setCartCount(cartItems.length);
    setWishlistCount(wishlistItems.length);
  };

  // Update counts on component mount and when localStorage changes
  useEffect(() => {
    updateCounts();

    // Add event listener for storage changes
    window.addEventListener('storage', updateCounts);

    return () => {
      // Clean up event listener on component unmount
      window.removeEventListener('storage', updateCounts);
    };
  }, []);

  const toggleMenu = () => {
    nav.current.classList.toggle("active");
  };

  return (
    <header className="header">
      <div className="logo">
        <img
          src={logo}
          alt="Logo"
        />
        <span>Fashion Store</span>
      </div>
      <div className="menu-toggle" onClick={toggleMenu}>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <nav className="nav" ref={nav}>
        {isAuthenticated ? (
          <>
            <Link to="/products">Shop</Link>
            <Link to="/dashboard"><UserOutlined /> &nbsp; <span>Account</span> </Link>
            <Link to="/cart">
              <Badge count={cartCount} style={{ backgroundColor: '#f5222d' }}>
                <ShoppingCartOutlined style={{ fontSize: '24px' }} />
              </Badge> &nbsp;
              <span>Cart</span>
            </Link>
            <Link to="/wishlist">
              <Badge count={wishlistCount} style={{ backgroundColor: '#f5222d' }}>
                <HeartOutlined style={{ fontSize: '24px' }} />
              </Badge> &nbsp;
              <span>Wishlist</span>
            </Link>
          </>
        ) : (
          <>
            <Link to="/">Home</Link>
            <Link to="/auth/login">Login</Link>
          </>
        )}
      </nav>
    </header>
  );
}
