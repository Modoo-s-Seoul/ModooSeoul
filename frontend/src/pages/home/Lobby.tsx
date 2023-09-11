// import React from 'react';
import "./Lobby.css";
import { Link } from "react-router-dom";

export default function Lobby() {
  return (
    <>
      <div>
        <div className="lobbyHeader">
          <div className="lobbyHeaderBtnContainer">
            <div className="lobbyHeaderBtn">정보</div>
            <div className="lobbyHeaderBtn">옵션</div>
            <div className="lobbyHeaderBtn">나가기</div>
          </div>
          <h1>모두의 서울</h1>
        </div>
        <div className="lobbyBtnContainer">
          <Link to={"/home/create"}>
            <div className="lobbyBtn">
              <div>방 생성</div>
            </div>
          </Link>
          <Link to={"/home/enter"}>
            <div className="lobbyBtn">
              <div>방 참가</div>
            </div>
          </Link>
          <Link to={"/home/random"}>
            <div className="lobbyBtn">
              <div>랜덤 매칭</div>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
}
