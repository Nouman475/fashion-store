import React, { useEffect, useState } from "react";
//import { Link } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import bags1 from "../../../Assets/bags1.jpg";
import lady from "../../../Assets/lady.png";
import { Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const [timeLeft, setTimeLeft] = useState(60 * 60 * 60);

  const navigate = useNavigate();
  const { ref: featuredRef, inView: featuredInView } = useInView({
    triggerOnce: true,
  });
  const { ref: testimonialsRef, inView: testimonialsInView } = useInView({
    triggerOnce: true,
  });
  const { ref: whyChooseRef, inView: whyChooseInView } = useInView({
    triggerOnce: true,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const displaySeconds = seconds % 60;
    return {
      hours: String(hours).padStart(2, "0"),
      minutes: String(minutes).padStart(2, "0"),
      seconds: String(displaySeconds).padStart(2, "0"),
    };
  };

  const { hours, minutes, seconds } = formatTime(timeLeft);

  return (
    <main>
      <section className="hero container my-3">
        <div className="hero-content">
          <h1>Chic, Functional, and Uniquely You</h1>
          <button
            className="my-3 btn"
            onClick={() => {
              navigate("/auth/login");
            }}
          >
            Buy Now
          </button>
        </div>
        <div className="hero-image">
          <div id="blob"></div>
          <img
            src="https://image.made-in-china.com/226f3j00gafkSKErszuJ/2024-Bolsos-PARA-Mujeres-Fashion-Bags-Women-Handbags-Ladies-Hand-Bag.webp"
            alt="Boy listening to music"
          />
        </div>
      </section>

      {/* Featured Products Section */}
      <section
        className={`featured ${
          featuredInView ? "slide-in" : "slide-hidden"
        } px-5`}
        ref={featuredRef}
      >
        <div className="featured-content">
          <div className="featured-image">
            <img src={bags1} alt="Featured Product" />
          </div>
          <div className="featured-text">
            <h2>Featured Products</h2>
            <h2>Carry Style, Elevate Every Journey</h2>
          </div>
        </div>
      </section>

      <section
        className={`featured-products ${
          featuredInView ? "slide-in" : "slide-hidden"
        } container`}
        ref={featuredRef}
      >
       <div className="deal-container container">
      <div className="timer">
        <h1>Deal of the Month!</h1>
        <div className="countdown">
          <div className="time-box">
            <div className="time">
              {hours}
              <div className="label">Hours</div>
            </div>
            <div className="time">
              {minutes}
              <div className="label">Minutes</div>
            </div>
            <div className="time">
              {seconds}
              <div className="label">Seconds</div>
            </div>
          </div>
        </div>
        <button id="f-btn">See the discounted products ---&gt;</button>
      </div>
      <div className="image-container">
        <img src={lady} alt="Deal of the Month" />
      </div>
    </div>
      </section>

      {/* Why Choose Us Section */}
      <section
        className={`why-choose-us ${
          whyChooseInView ? "slide-up" : "slide-hidden"
        } my-5 container`}
        ref={whyChooseRef}
      >
        <h2 className="my-5 text-center display-4 font-weight-bold text-uppercase">
          Why Choose Us?
        </h2>
        <div className="row text-center">
          <div className="col-md-4 mb-4">
            <div className="card choose-us-card">
              <div className="card-body d-flex flex-column align-items-center">
                <h5 className="card-title">Quality Products</h5>
                <p className="card-text">
                  We provide only the best and most reliable products.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="card choose-us-card">
              <div className="card-body d-flex flex-column align-items-center">
                <h5 className="card-title">Affordable Prices</h5>
                <p className="card-text">
                  Our prices are unbeatable for the value we offer.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="card choose-us-card">
              <div className="card-body d-flex flex-column align-items-center">
                <h5 className="card-title">Excellent Support</h5>
                <p className="card-text">
                  Our customer support is here to help you 24/7.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section
        className={`testimonials ${
          testimonialsInView ? "slide-in" : "slide-hidden"
        } my-4 container`}
        ref={testimonialsRef}
      >
        <h2 className="text-center my-5">Customer Testimonials</h2>
        <div
          id="testimonialsCarousel"
          className="carousel slide"
          data-bs-ride="carousel"
        >
          <div className="carousel-inner">
            <div className="carousel-item active text-center">
              <div className="d-flex flex-column align-items-center">
                <Avatar
                  size={100}
                  style={{
                    background: "linear-gradient(to right, #c0392b, #8e44ad)",
                  }}
                  className="mb-3"
                  icon={<UserOutlined />}
                />
                <p className="mb-1">"Great products and amazing service!"</p>
                <span>∼ Customer 1</span>
              </div>
            </div>
            <div className="carousel-item text-center">
              <div className="d-flex flex-column align-items-center">
                <Avatar
                  style={{
                    background: "linear-gradient(to right, #c0392b, #8e44ad)",
                  }}
                  size={100}
                  className="mb-3"
                  icon={<UserOutlined />}
                />
                <p className="mb-1">"Fast delivery and top-notch quality!"</p>
                <span>∼ Customer 2</span>
              </div>
            </div>
            <div className="carousel-item text-center">
              <div className="d-flex flex-column align-items-center">
                <Avatar
                  style={{
                    background: "linear-gradient(to right, #c0392b, #8e44ad)",
                  }}
                  size={100}
                  className="mb-3"
                  icon={<UserOutlined />}
                />
                <p className="mb-1">
                  "Excellent customer support and great prices."
                </p>
                <span>∼ Customer 3</span>
              </div>
            </div>
          </div>
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#testimonialsCarousel"
            data-bs-slide="prev"
          >
            <span
              className="carousel-control-prev-icon bg-dark rounded-circle"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#testimonialsCarousel"
            data-bs-slide="next"
          >
            <span
              className="carousel-control-next-icon bg-dark rounded-circle"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </section>
    </main>
  );
}
