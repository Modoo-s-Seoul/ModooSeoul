// import React from 'react';
import { Link } from "react-router-dom";

export default function EnterRoom() {
  return (
    <>
      <div>
        <div className="roomHeader">
          <Link to="/home">
            <button>Back</button>
          </Link>
        </div>
        <div>
          <h1>방 입장하기</h1>
          <div className="roomInput">
            방이름 : <input type="text" name="" id="" />
          </div>
          <div className="roomInput">
            닉네임 : <input type="text" name="" id="" />
          </div>
          <Link to="/home/room">
            <button className="roomCreateBtn">참가하기</button>
          </Link>
        </div>
      </div>
    </>
  );
}
