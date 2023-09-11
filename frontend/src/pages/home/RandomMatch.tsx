// import React from 'react';
import { Link } from "react-router-dom";

export default function RandomMatch() {
  return (
    <>
      <div>
        <div className="roomHeader">
          <Link to="/home">
            <button>Back</button>
          </Link>
        </div>
        <div>
          <h1>랜덤 매칭중입니다...</h1>
        </div>
      </div>
    </>
  );
}
