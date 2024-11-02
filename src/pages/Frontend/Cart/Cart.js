import React, { useState, useEffect } from "react";
import { InputNumber, Button, Input, message, Spin } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom"; 
import "./Cart.css"; 

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); 

  // Initialize cart with default quantities and selected colors
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    const normalizedCart = storedCart.map(item => ({
      ...item,
      quantity: item.quantity || 1,
      selectedColor: item.selectedColor || (item.availableColors && item.availableColors.length > 0 ? item.availableColors[0] : null) // Default to first color if available
    }));
    
    // Update localStorage with normalized cart
    localStorage.setItem("cart", JSON.stringify(normalizedCart));
    setCartItems(normalizedCart);
    setLoading(false);
    
    // Calculate total with normalized quantities
    calculateTotal(normalizedCart);
  }, []);

  const calculateTotal = (items) => {
    const total = items.reduce((acc, item) => {
      const price = Number(item.price) || 0;
      const quantity = Number(item.quantity) || 1;
      return acc + price * quantity;
    }, 0);
    setGrandTotal(total);
  };

  const removeItem = (id) => {
    const updatedCart = cartItems.filter((item) => item.productId !== id);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    calculateTotal(updatedCart);
    message.success("Item removed");
  };

  const applyCoupon = () => {
    if (coupon === "DISCOUNT10") {
      setDiscount(0.1);
      message.success("Coupon applied: 10% off");
    } else {
      message.error("Invalid coupon");
      setDiscount(0);
    }
  };

  const updateQuantity = (id, value) => {
    if (value < 1) return;
    const updatedCart = cartItems.map((item) =>
      item.productId === id ? { ...item, quantity: value } : item
    );
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    calculateTotal(updatedCart);
  };

  const updateColor = (id, color) => {
    const updatedCart = cartItems.map((item) =>
      item.productId === id ? { ...item, selectedColor: color } : item
    );
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const finalTotal = grandTotal - grandTotal * discount;

  const handleCheckout = () => {
    const normalizedCart = cartItems.map(item => ({
      ...item,
      quantity: item.quantity || 1,
      selectedColor: item.selectedColor // Ensure selectedColor is included
    }));
    
    // Update localStorage with final cart state
    localStorage.setItem("cart", JSON.stringify(normalizedCart));
    navigate(`/checkout`);
  };

  if (loading) {
    return (
      <div className="spin-c">
        <Spin />
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="fs-3 my-2">
        <ShoppingCartOutlined /> Cart
      </div>
      <div className="row">
        {cartItems.length === 0 ? (
          <div className="row">
            <div className="col-lg-6 col-sm-12">
              <img
                id="no-img"
                src="https://cdni.iconscout.com/illustration/premium/thumb/search-not-found-illustration-download-in-svg-png-gif-file-formats--page-error-404-empty-state-pack-user-interface-illustrations-5210416.png"
                alt="not found"
              />
            </div>
          </div>
        ) : (
          cartItems.map((item) => (
            <div key={item.productId} className="col-md-6 col-lg-4 mb-4">
              <div className="card h-100">
                <img
                  src={item.mainImageUrl || "https://via.placeholder.com/150"}
                  alt={item.name}
                  className="card-img-top"
                  style={{ height: "200px", objectFit: "cover" }}
                />
                <div className="card-body d-flex flex-column justify-content-between">
                  <h5 className="card-title">{item.name}</h5>
                  <p className="mb-2">
                    Price: PKR {(Number(item.price) || 0).toFixed(2)}
                  </p>
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <div className="quantity-section">
                      <p className="mb-0">Quantity:</p>
                      <InputNumber
                        min={1}
                        max={99}
                        value={item.quantity || 1}
                        onChange={(value) => updateQuantity(item.productId, value)}
                        className="mx-2"
                      />
                    </div>
                    <p className="mb-0">
                      Total: PKR {((Number(item.price) || 0) * (item.quantity || 1)).toFixed(2)}
                    </p>
                  </div>
                  <div className="mb-3">
                    <p className="mb-0">Select Color:</p>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {item.availableColors && item.availableColors.map(color => (
                        <div
                          key={color}
                          onClick={() => updateColor(item.productId, color)}
                          style={{
                            width: '30px',
                            height: '30px',
                            borderRadius: '50%',
                            backgroundColor: color,
                            border: item.selectedColor === color ? '2px solid black' : 'none',
                            cursor: 'pointer'
                          }}
                        />
                      ))}
                    </div>
                  </div>
                  <Button danger onClick={() => removeItem(item.productId)}>
                    Remove
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {cartItems.length > 0 && (
        <div className="mt-4 p-3 bg-light rounded">
          <div className="row">
            <div className="col-md-6">
              <Input
                placeholder="Enter coupon code"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
              />
            </div>
            <div className="col-md-6 text-right">
              <Button type="primary" onClick={applyCoupon} id="c">
                Apply Coupon
              </Button>
            </div>
          </div>
          <div className="mt-3">
            <p>Grand Total: <b>PKR {grandTotal.toFixed(2)}</b></p>
            {discount > 0 && (
              <h4>Discount: <b>-PKR {(grandTotal * discount).toFixed(2)}</b></h4>
            )}
            <p>Final Total: <b>PKR {finalTotal.toFixed(2)}</b></p>
          </div>
          <div className="text-right">
            <Button
              type="primary"
              size="large"
              onClick={handleCheckout}
            >
              Checkout
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
