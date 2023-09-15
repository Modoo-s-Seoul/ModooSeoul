import { useState, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { createRoom, joinRoom } from "../../api/RoomApi";
import BackBtn from "../../components/Base/BackBtn";
import ClickBtn from "../../components/Base/ClickBtn";

/** 게임 방생성 컴포넌트 */
export default function RoomCreate() {
  const [nickname, setNickname] = useState("");
  const navigate = useNavigate();

  /**입력값 반영 함수 */
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setNickname(() => e.target.value);
  };

  /**방 생성 버튼 클릭 시 실행되는 함수 */
  const handleCreateRoom = async () => {
    // 닉네임 필드가 비어 있는 경우
    if (nickname === "") {
      window.alert("닉네임을 입력하세요.");
      return;
    }

    // 필드가 모두 유효한 경우
    try {
      const roomInfo = await createRoom();
      const joinResponse = await joinRoom(nickname, roomInfo.data.id);

      if (joinResponse.message === "success") {
        navigate(`/home/room`, {
          // 유저 닉네임, 방 id 다음 페이지에 넘기기
          state: {
            nickname: nickname,
            gameId: roomInfo.data.id,
            playerId: joinResponse.data.id,
          },
        });
      } else {
        window.alert(joinResponse.phrase); // 경고창 표시
        return;
      }
    } catch (error) {
      console.error("Error fetching Room Info");
      throw error;
    }
  };

  return (
    <>
      <div>
        <div className="roomHeader">
          <BackBtn />
        </div>
        <div className="roomBody">
          <h1>방 생성하기</h1>
          <div className="roomInput">
            <div>닉네임</div>
            <input
              type="text"
              name="nickname"
              value={nickname}
              onChange={handleChange}
              className="customInput"
            />
          </div>
        </div>

        <div className="clickBtnContainer">
          <div onClick={handleCreateRoom}>
            <ClickBtn width={120} height={60} fontsize={21} text={"방 생성"} />
          </div>
        </div>
      </div>
    </>
  );
}
