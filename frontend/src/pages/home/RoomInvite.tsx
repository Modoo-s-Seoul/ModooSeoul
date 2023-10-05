import { ChangeEvent, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { joinRoom } from "../../api/RoomApi";
import BackBtn from "../../components/Base/BackBtn";
import ClickBtn from "../../components/Base/CustomButton";
import axios from "axios";
import { useRecoilState } from "recoil";
import { AlertModal } from "../../components/Base/AlertModal";
import { alertModalState } from "../../data/CommonData";
import { handleFullScreen } from "../../components/Base/BaseFunc";

/** 방 입장 컴포넌트 */
export default function Invite() {
  const [nickname, setNickname] = useState(""); // 유저 닉네임
  const navigate = useNavigate();
  const [alertMsg, setAlertMsg] = useState(""); // alert modal
  const [alertVisible, setAlertVisible] = useRecoilState(alertModalState);

  /**게임 ID */
  const { pk } = useParams();

  /**입력값 반영 함수 */
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setNickname(() => e.target.value);
  };

  /**방 참가 */
  const handelGoGame = async () => {
    if (nickname === "") {
      setAlertMsg("닉네임을 입력하세요.");
      setAlertVisible(true);
      return;
    }

    try {
      const joinResponse = await joinRoom(nickname, pk);
      handleFullScreen();
      console.log(joinResponse);

      if (joinResponse.message === "success") {
        navigate(`/home/room`, {
          // 유저 닉네임, 방 id 다음 페이지에 넘기기
          state: {
            nickname: nickname,
            gameId: pk,
            playerId: joinResponse.data.id,
          },
        });
      } else {
        setAlertMsg(joinResponse.phrase);
        setAlertVisible(true);
        return;
      }
    } catch (error) {
      console.error("Error fetching Room Info", error);
      if (axios.isAxiosError(error)) {
        setAlertMsg(error.response?.data.phrase);
        setAlertVisible(true);
        throw error;
      }
    }
  };

  return (
    <>
      {alertVisible && <AlertModal text={alertMsg} />}
      <div className="roomContainer">
        <div className="roomHeader">
          <BackBtn />
        </div>
        <div className="roomCreateBody">
          <div className="roomCreateTitle">방 입장하기</div>
          <div className="roomInput">
            <div>닉네임</div>
            <input
              type="text"
              name="nickname"
              className="customInput"
              onChange={handleChange}
            />
          </div>
          <div className="clickBtnContainer" onClick={handelGoGame}>
            <ClickBtn width={120} height={60} fontsize={21} text={"방 참가"} />
          </div>
        </div>
      </div>
    </>
  );
}
