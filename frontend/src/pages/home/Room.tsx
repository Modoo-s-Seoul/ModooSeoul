import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
// import { ipAddress } from "../../api/RoomApi";
import { useSocket } from "../SocketContext";
import { useRecoilState, useSetRecoilState } from "recoil";
import { alertModalState, roomStatus } from "../../data/CommonData";
import { unsubscribeRoom } from "../../api/RoomApi";
import BackBtn from "../../components/Base/BackBtn";
import ClickBtn from "../../components/Base/CustomButton";
import "./Room.css";
import { CompatClient } from "@stomp/stompjs";
import { handleFullScreen } from "../../components/Base/BaseFunc";
import { AlertModal } from "../../components/Base/AlertModal";
import {
  pNumState,
  modalMsgState,
  isModalMsgActiveState,
} from "../../data/IngameData";
import NoLandMessage from "../../components/Base/MessageModal";

/** 게임 대기룸 컴포넌트. 
  초대링크, 방생성을 통해서만 접근 가능*/
export default function Room() {
  const [alertMsg, setAlertMsg] = useState(""); // alert modal
  const [alertVisible, setAlertVisible] = useRecoilState(alertModalState);
  const setpNumState = useSetRecoilState(pNumState);
  /**웹소켓 클라이언트 */
  const socketClient = useSocket();
  const navigate = useNavigate();
  /**유저 닉네임, 현재 방 ID, 플레이어 ID 가져오기 */
  const location = useLocation();

  const nickname = location.state.nickname;
  const gameId = location.state.gameId;
  const playerId = location.state.playerId;

  const [curRoomStatus, setRoomStatus] = useRecoilState(roomStatus);
  const setIsModalMsgActive = useSetRecoilState(isModalMsgActiveState); // 모달 메세지 토글
  const setModalMsg = useSetRecoilState(modalMsgState); // 모달 메세지

  /**게임시작 */
  const handleStartGame = () => {
    if (socketClient !== null) {
      socketClient.send(`/send/start/${gameId}`);
      // handleFullScreen();
    }
  };

  /**방 참가 링크 복사 */
  const handleCopyLink = () => {
    // const gameUrl = `${ipAddress}/home/invite/${gameId}`;
    const gameUrl = `http://modooseoul.online/home/invite/${gameId}`;

    navigator.clipboard
      .writeText(gameUrl)
      .then(() => {
        setModalMsg("링크가 클립보드에 복사되었습니다.");
        console.log("복사성공");
        setIsModalMsgActive(true);
      })
      .catch((error) => {
        console.error("링크 복사 실패:", error);
        setModalMsg("링크 복사에 실패했습니다.");
        setIsModalMsgActive(true);
      });
  };

  /**플레이어 준비 완료 */
  const readyPlayer = (socketClient: CompatClient | null, playerId: string) => {
    if (socketClient !== null) {
      socketClient.send(`/send/ready/${playerId}`);
    }
  };

  const leaveRoom = (socketClient: CompatClient | null, playerId: string) => {
    if (socketClient !== null) {
      socketClient.send(`/send/leave/${playerId}`);
    }
  };

  useEffect(() => {
    if (socketClient !== null) {
      //  현재 방의 정보를 알려주는 채널
      socketClient.subscribe(`/receive/game/init/${gameId}`, (msg) => {
        const message = JSON.parse(msg.body);
        console.log("Room Status:", message);
        const receivedData = message.data;
        setRoomStatus(receivedData);
      });

      // 플레이어 참가. 참가한 방의 정보 업데이트
      socketClient.send(`/send/join/${gameId}`);

      // 방에서 누군가가 나갈 시 나간 사람의 정보를 알려주는 채널
      socketClient.subscribe(`/receive/game/leave/${gameId}`, (msg) => {
        const message = JSON.parse(msg.body);
        const receivedData = message.data;
        setAlertMsg(`${receivedData.nickname} 님이 이 방에서 나갔습니다.`);
        setAlertVisible(true);
      });

      // 참가한 방의 게임 시작 가능 여부를 알려주는 채널
      socketClient.subscribe(`/receive/game/start/${gameId}`, (msg) => {
        const message = JSON.parse(msg.body);
        const receivedData = message.data;
        console.log("Start Status:", receivedData);
        handleFullScreen();
        if (receivedData.isStart === true) {
          navigate(`/game`, {
            // 유저 닉네임, 방 id 다음 페이지에 넘기기
            state: {
              nickname: nickname,
              gameId: gameId,
              playerId: playerId,
            },
          });
        } else {
          setAlertMsg(receivedData.message);
          setAlertVisible(true);
        }
      });
    }

    return () => {
      unsubscribeRoom(socketClient, playerId, gameId);
    };
  }, [socketClient]);
  /* 페이지 새로고침할 때마다 소켓도 재연결되어 소켓 클라이언트 객체가 null인 순간이 생기는데,
  페이지가 마운트될 때 실행되도록 설정한 useEffect 훅 내부에 소켓 클라이언트 객체를 활용하는 코드가
  존재하는 경우 해당 코드는 제대로 실행되지 않는다.
  */

  useEffect(() => {
    console.log("Current Room Status", curRoomStatus);
    setpNumState(curRoomStatus.length);
  }, [curRoomStatus]);

  return (
    <>
      {alertVisible && <AlertModal text={alertMsg} />}
      <div className="roomContainer">
        <div className="roomHeader">
          <div onClick={() => leaveRoom(socketClient, playerId)}>
            <BackBtn />
          </div>
          <NoLandMessage />
          <div
            className="roomHeaderBtn"
            style={{ cursor: "pointer" }}
            onClick={handleCopyLink}
          >
            링크 복사
          </div>
        </div>
        {curRoomStatus.length > 0 && (
          <div className="roomBody">
            <h1>{curRoomStatus[0].nickname}의 Room</h1>
            <div className="playerCardContainer">
              {/*방장일 경우 방을 생성했기 때문에 준비 완료된 상태인 것으로 간주한다.  */}
              {curRoomStatus.map((ele, index) => {
                return (
                  // 준비 완료된 상태인 경우 박스 테두리 색이 연두색으로 바뀐다.
                  <div
                    className={`playerCard ${
                      ele.isReady || index == 0 ? "ready" : ""
                    }`}
                    key={ele.nickname}
                  >
                    {ele.nickname === nickname ? (
                      <div>{`${index === 0 ? "👑" : ""} ${ele.nickname}`}</div>
                    ) : (
                      <div>{`${index === 0 ? "👑" : ""} ${ele.nickname}`}</div>
                    )}
                    <div>
                      <img src="" alt="" />
                      {/* 
                      if(방장){ -> curRoom~.nickname===nickname
                        준비 완료 표시
                      }
                      else{
                        if(준비 됨){
                          준비 완료
                        }
                        else{
                          if(본인){
                            레디 버튼
                          }
                          else{
                            준비 중...
                          }
                        }
                      }
                      */}
                      {curRoomStatus[0].nickname === ele.nickname ? (
                        <div>준비 완료!</div>
                      ) : ele.isReady ? (
                        <div>준비 완료!</div>
                      ) : ele.nickname === nickname ? (
                        <button
                          className="readyBtn"
                          onClick={() => readyPlayer(socketClient, playerId)}
                        >
                          Ready
                        </button>
                      ) : (
                        <div>준비 중...</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="clickBtnContainer">
              {curRoomStatus[0].nickname === nickname ? (
                <div onClick={handleStartGame}>
                  <ClickBtn
                    width={200}
                    height={80}
                    fontsize={30}
                    text={"게임 시작"}
                  />
                </div>
              ) : (
                <div>방장이 게임 시작 버튼을 누르면 게임이 시작됩니다!</div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
