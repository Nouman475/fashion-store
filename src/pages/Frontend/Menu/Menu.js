import React, { useState, useEffect } from "react";
import { Spin } from "antd";
import { firestore } from "config/firebase";
import { EyeOutlined } from "@ant-design/icons";
import {
  getDocs,
  collection,
  limit,
  query,
  startAfter,
} from "firebase/firestore";

import InfiniteScroll from "react-infinite-scroll-component";
import "bootstrap/dist/css/bootstrap.min.css";
import "./style.css";
import { Link, useNavigate } from "react-router-dom";
import MenuHero from "./MenuHero";

const Menu = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastVisible, setLastVisible] = useState(null);
  const [wishlistItems, setWishlistItems] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsRef = collection(firestore, "items");
        const firstQuery = query(productsRef, limit(20));
        const querySnapshot = await getDocs(firstQuery);

        const productsList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
        setProducts(productsList);
      } catch (error) {
        console.error("Error fetching products: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const fetchMoreData = async () => {
    try {
      setLoading(true);
      const productsRef = collection(firestore, "items");
      const nextQuery = query(productsRef, startAfter(lastVisible), limit(10));
      const querySnapshot = await getDocs(nextQuery);

      const moreProducts = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
      setProducts((prevProducts) => [...prevProducts, ...moreProducts]);
    } catch (error) {
      console.error("Error fetching more products: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedWishlist = localStorage.getItem("wishlist");
    if (storedWishlist) {
      setWishlistItems(JSON.parse(storedWishlist));
    }
  }, []);

  const navigate = useNavigate();

  const preview = (product) => {
    navigate(`/product/${product.id}`);
  };

  const updateWishlist = (product, isAdding) => {
    setWishlistItems((prevItems) => {
      let updatedItems;
      if (isAdding) {
        window.toastify(`${product.itemName} added to wishlist`, "info");
        updatedItems = [...prevItems, product];
      } else {
        window.toastify(`${product.itemName} removed from wishlist`, "info");
        updatedItems = prevItems.filter((item) => item.id !== product.id);
      }
      localStorage.setItem("wishlist", JSON.stringify(updatedItems));
      return updatedItems;
    });
  };

  const handleChange = (e, product) => {
    const isChecked = e.target.checked;
    updateWishlist(product, isChecked);
  };

  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center" style={{minHeight:"80vh"}}>
        <Spin />
      </div>
    );
  }

  return (
    <div className="menu-container container">
      <MenuHero />
      <div className="row">
        {/* Product Display Section */}
        <div className="col-12">
          <InfiniteScroll
            dataLength={products.length}
            next={fetchMoreData}
            hasMore={true}
            endMessage={
              <p style={{ textAlign: "center" }}>
                <b>Yay! You've seen it all</b>
              </p>
            }
          >
            <div className="pg-header d-flex justify-content-between">
              <div>
                <Link to="/" className="text-decoration-none text-secondary">
                  Home &nbsp;
                </Link>
                &gt; &nbsp;
                <Link to="/products" className="text-decoration-none text-black">
                  Shop
                </Link>
              </div>
              <div>
                
              </div>
            </div>
            <div id="card-container">
              {products.map((product, i) => (
                <div id="card" key={i}>
                  <div className="card-img">
                    <img
                      onClick={() => preview(product)}
                      src={product.mainImageUrl}
                      alt={product.itemName}
                    />
                  </div>
                  <div className="card-info">
                    <p className="text-title" style={{ width: "150px" }}>{product.itemName}</p>
                  </div>
                  <div className="card-footer">
                    <span className="text-title">PKR {product.price}</span>
                    <EyeOutlined
                      onClick={() => preview(product)}
                    />
                    <div className="heart-container" title="Like">
                      <input
                        checked={wishlistItems.some(
                          (item) => item.id === product.id
                        )}
                        onChange={(e) => handleChange(e, product)}
                        type="checkbox"
                        className="checkbox"
                        id="Give-It-An-Id"
                      />
                      <div className="svg-container">
                        <svg
                          viewBox="0 0 24 24"
                          className="svg-outline"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M17.5,1.917a6.4,6.4,0,0,0-5.5,3.3,6.4,6.4,0,0,0-5.5-3.3A6.8,6.8,0,0,0,0,8.967c0,4.547,4.786,9.513,8.8,12.88a4.974,4.974,0,0,0,6.4,0C19.214,18.48,24,13.514,24,8.967A6.8,6.8,0,0,0,17.5,1.917Zm-3.585,18.4a2.973,2.973,0,0,1-3.83,0C4.947,16.006,2,11.87,2,8.967a4.8,4.8,0,0,1,4.5-5.05A4.8,4.8,0,0,1,11,8.967a1,1,0,0,0,2,0,4.8,4.8,0,0,1,4.5-5.05A4.8,4.8,0,0,1,22,8.967C22,11.87,19.053,16.006,13.915,20.313Z"></path>
                        </svg>
                        <svg
                          viewBox="0 0 24 24"
                          className="svg-filled"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M17.5,1.917a6.4,6.4,0,0,0-5.5,3.3,6.4,6.4,0,0,0-5.5-3.3A6.8,6.8,0,0,0,0,8.967c0,4.547,4.786,9.513,8.8,12.88a4.974,4.974,0,0,0,6.4,0C19.214,18.48,24,13.514,24,8.967A6.8,6.8,0,0,0,17.5,1.917Z"></path>
                        </svg>
                        <svg
                          className="svg-celebrate"
                          width="100"
                          height="100"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <polygon points="10,10 20,20"></polygon>
                          <polygon points="10,50 20,50"></polygon>
                          <polygon points="20,80 30,70"></polygon>
                          <polygon points="90,10 80,20"></polygon>
                          <polygon points="90,50 80,50"></polygon>
                          <polygon points="80,80 70,70"></polygon>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </InfiniteScroll>
        </div>
      </div>
    </div>
  );
};

export default Menu;
