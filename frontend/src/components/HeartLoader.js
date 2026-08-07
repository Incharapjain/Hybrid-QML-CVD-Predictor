import React from "react";
import "./HeartLoader.css";

export default function HeartLoader() {
  return (
    <div className="heart-loader">
      <div className="loader-content">
        <div className="loader-heart"></div>

        <svg
          className="loader-wave"
          viewBox="0 0 700 120"
          preserveAspectRatio="none"
        >
          <path
            d="
            M0 65
            L120 65
            L150 65
            L170 50
            L190 65
            L250 65
            L275 85
            L300 15
            L330 105
            L360 45
            L385 65
            L450 65
            L470 52
            L490 65
            L700 65
            "
          />
        </svg>

        <h2>Q-CARDIO</h2>

        <p>Listening to every beat...</p>
      </div>
    </div>
  );
}