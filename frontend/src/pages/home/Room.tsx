import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
// import { ipAddress } from "../../api/RoomApi";
import { useSocket } from "../SocketContext";
import { useRecoilState } from "recoil";
import { roomStatus } from "../../data/CommonData";
import { unsubscribeRoom } from "../../api/RoomApi";
import BackBtn from "../../components/Base/BackBtn";
import ClickBtn from "../../components/Base/ClickBtn";
import "./Room.css";
import { CompatClient } from "@stomp/stompjs";

/** 게임 대기룸 컴포넌트. 
  초대링크, 방생성을 통해서만 접근 가능*/
export default function Room() {
  /**웹소켓 클라이언트 */
  const socketClient = useSocket();
  const navigate = useNavigate();
  /**유저 닉네임, 현재 방 ID, 플레이어 ID 가져오기 */
  const location = useLocation();

  const nickname = location.state.nickname;
  const gameId = location.state.gameId;
  const playerId = location.state.playerId;

  const [curRoomStatus, setRoomStatus] = useRecoilState(roomStatus);

  console.log(location.state);

  /**게임시작 */
  const handleStartGame = () => {
    navigate(`/game`);
  };

  /**방 참가 링크 복사 */
  const handleCopyLink = () => {
    // const gameUrl = `${ipAddress}/home/invite/${gameId}`;
    const gameUrl = `http://localhost:5173/home/invite/${gameId}`;

    navigator.clipboard
      .writeText(gameUrl)
      .then(() => {
        alert("링크가 클립보드에 복사되었습니다.");
      })
      .catch((error) => {
        console.error("링크 복사 실패:", error);
        alert("링크 복사에 실패했습니다.");
      });
  };

  /**플레이어 준비 완료 */
  const readyPlayer = (socketClient: CompatClient | null, playerId: string) => {
    if (socketClient !== null) {
      socketClient.send(`/send/ready/${playerId}`);
    }
  };

  useEffect(() => {
    if (socketClient !== null) {
      // 참가한 방의 정보를 알려주는 채널
      socketClient.subscribe(`/receive/game/join/${gameId}`, (msg) => {
        const message = JSON.parse(msg.body);
        console.log("Room Status:", message);
        const receivedData = message;
        setRoomStatus(receivedData);
      });

      // 플레이어 참가. 참가한 방의 정보 업데이트
      socketClient.send(`/send/join/${gameId}`);

      // 준비 완료 시 갱신된 참가한 방의 정보를 알려주는 채널
      socketClient.subscribe(`/receive/game/ready/${playerId}`, (msg) => {
        const message = JSON.parse(msg.body);
        const receivedData = message.data;
        setRoomStatus(receivedData);
      });
    }

    return () => {
      unsubscribeRoom(socketClient, playerId, gameId);
    };
  }, []);

  useEffect(() => {
    console.log(curRoomStatus);
  }, [curRoomStatus]);

  return (
    <>
      <div>
        <div className="roomHeader">
          <BackBtn />
          <div className="roomHeaderBtn" onClick={handleCopyLink}>
            링크 복사
          </div>
        </div>
        {curRoomStatus.length > 0 && (
          <div className="roomBody">
            <h1>{curRoomStatus[0].nickname}의 Room</h1>
            <div className="playerCardContainer">
              {curRoomStatus.map((ele) => {
                return (
                  <div
                    className={`playerCard ${ele.isReady ? "ready" : ""}`}
                    key={ele.nickname}
                  >
                    {ele.nickname === nickname ? (
                      <div style={{ backgroundColor: "red" }}>
                        {ele.nickname}
                      </div>
                    ) : (
                      <div>{ele.nickname}</div>
                    )}
                    <div>
                      <img src="" alt="" />
                      {ele.nickname === nickname && (
                        <button
                          onClick={() => readyPlayer(socketClient, playerId)}
                        >
                          레디
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
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
        )}
      </div>
    </>
  );
}
