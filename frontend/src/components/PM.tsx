// import React from 'react';
import { useNavigate } from "react-router-dom";

/** 작업용 임시 버튼들입니다 */
export default function PM() {
  const navigate = useNavigate();
  return (
    <>
      {/* 임시 - 작업용 */}
      <div style={{ marginTop: "50px" }} />
      <hr />
      작업용 임시 버튼입니다
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div>
          <button
            onClick={() => {
              navigate(-1);
            }}
            style={{ margin: "5px" }}
          >
            뒤로가기
          </button>
          <button
            onClick={() => {
              window.location.reload();
            }}
            style={{ margin: "5px" }}
          >
            새로고침
          </button>
          <button
            onClick={() => {
              navigate(`/home`);
            }}
            style={{ margin: "5px" }}
          >
            홈 이동
          </button>
          <button
            onClick={() => {
              navigate(`/home/invite/askdm`);
            }}
            style={{ margin: "5px" }}
          >
            초대링크 이동
          </button>
          <button
            onClick={() => {
              navigate(`/home/room`);
            }}
            style={{ margin: "5px" }}
          >
            게임룸 이동
          </button>
          <button
            onClick={() => {
              navigate(`/game`);
            }}
            style={{ margin: "5px" }}
          >
            인게임 이동
          </button>
        </div>
      </div>
      <div style={{ marginTop: "50px" }} />
    </>
  );
}
