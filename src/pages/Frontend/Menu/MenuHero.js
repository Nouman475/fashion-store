import React from 'react';
import { useNavigate } from 'react-router-dom';
import c1 from "../../../Assets/c1.jpg";

const MenuHero = () => {
  // Hardcoded data for the featured product
  const product = {
    id: 1,
    name: 'Great Lighting Keyboard',
    price: '$129.99',
    imageUrl: {c1} // Replace with your image URL
  };

  const navigate = useNavigate()

  return (
    <section className="hero-banner">
      <div className="banner-content">
        <div className="banner-text">
          <h1>Elevate Your Style, One Bag at a Time.</h1>
          <p>Whether you're seeking a chic handbag for a night out, a spacious tote for your daily adventures, or a sophisticated clutch for special occasions, our curated collection has something for every woman.</p>
          <button className="cta-button" onClick={()=>{navigate("/product/6053576088")}}>Shop Now</button>
        </div>
        <div className="banner-image">
          <img src={c1} alt={product.name} />
        </div>
      </div>
    </section>
  );
};

export default MenuHero;
