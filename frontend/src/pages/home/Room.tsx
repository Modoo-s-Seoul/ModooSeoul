import { useNavigate, useLocation } from "react-router-dom";
import BackBtn from "../../components/Base/BackBtn";
import ClickBtn from "../../components/Base/ClickBtn";
import "./Room.css";

// 초대링크, 방생성을 통해서만 접근 가능
/** 게임 대기룸 컴포넌트 */
export default function Room() {
  const navigate = useNavigate();
  /**유저 닉네임, 현재 방 ID 가져오기 */
  const location = useLocation();

  console.log(location.state);

  /**게임시작 */
  const handleStartGame = () => {
    navigate(`/game`);
  };

  /**방 참가 링크 복사 */
  const handleEnterLink = () => {
    const roomUrl = `http://localhost:5173/home/invite/${location.state.roomId}`;

    navigator.clipboard
      .writeText(roomUrl)
      .then(() => {
        alert("링크가 클립보드에 복사되었습니다.");
      })
      .catch((error) => {
        console.error("링크 복사 실패:", error);
        alert("링크 복사에 실패했습니다.");
      });
  };

  // 1. 웹소켓 연결
  // 2. join 요청
  // 3. 유저 키 관리
  return (
    <>
      <div>
        <div className="roomHeader">
          <BackBtn />
          <div className="roomHeaderBtn" onClick={handleEnterLink}>
            링크 복사
          </div>
        </div>
        <div className="roomBody">
          <h1>{}의 Room</h1>
          <div className="playerCardContainer">
            <div className="playerCard crown">
              <div>플레이어 1</div>
              <div>
                <img src="" alt="" />
              </div>
            </div>
            <div className="playerCard"></div>
            <div className="playerCard"></div>
            <div className="playerCard"></div>
          </div>
          <div className="clickBtnContainer">
            <div onClick={handleStartGame}>
              <ClickBtn
                width={200}
                height={80}
                fontsize={30}
                text={"게임 시작"}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
