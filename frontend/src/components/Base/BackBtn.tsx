// import React from 'react';
import { useNavigate } from "react-router-dom";
import "./BackBtn.css";

export default function BackBtn() {
  const navigate = useNavigate();
  return (
    <>
      <button className="cta" onClick={() => navigate(-1)}>
        <svg
          width="30px"
          height="30px"
          viewBox="0 0 24 24"
          fill="#747474"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M20 12H4M4 12L10 6M4 12L10 18"
            stroke="#313131"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </>
  );
}
