import { Link } from "react-router-dom";
import WebInfo from "../../components/Base/WebInfo";
import WebOption from "../../components/Base/WebOption";
import WebClose from "../../components/Base/WebClose";
import "./Lobby.css";

/** 게임로비 컴포넌트 */
export default function Lobby() {
  return (
    <>
      <div className="lobbyContainer">
        {/* 헤더부분 - 버튼 */}
        <div className="lobbyHeader">
          <div className="lobbyHeaderBtnContainer">
            <WebInfo />
            <WebOption />
            <WebClose />
          </div>
        </div>
        {/* 바디부분 - 기능 이동키 */}
        <div className="lobbyBody">
          {/* <div className="title">모두의 서울</div> */}
          <img src="/moduseoul.png" alt="" className="lobbyImg" />
          <div className="lobbyBtnContainer">
            <Link to={"/home/create"} className="customLink">
              <div className="lobbyBtn" style={{ cursor: "pointer" }}>
                방 생성
              </div>
            </Link>
            <Link to={"/home/random"} className="customLink">
              <div className="lobbyBtn" style={{ cursor: "pointer" }}>
                <div>랜덤 매칭</div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
