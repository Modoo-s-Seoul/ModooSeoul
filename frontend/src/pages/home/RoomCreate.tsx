import { useState, ChangeEvent } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import BackBtn from "../../components/Base/BackBtn";
import ClickBtn from "../../components/Base/ClickBtn";

/** 게임 방생성 인풋 인터페이스 */
interface RoomCreateProps {
  participants: number;
  roomName: string;
  nickname: string;
}
/** 게임 방생성 컴포넌트 */
export default function RoomCreate() {
  // 인풋 필드 관리
  const [formData, setFormData] = useState<RoomCreateProps>({
    participants: 2,
    roomName: "",
    nickname: "",
  });
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === "participants" ? parseInt(value, 10) : value,
    }));
  };

  // 생성하기 버튼 클릭시
  const navigate = useNavigate();
  const handleCreateRoom = () => {
    // 방 이름 필드가 비어 있는 경우
    if (!formData.roomName) {
      window.alert("방 이름을 입력하세요.");
      return;
    }
    // 닉네임 필드가 비어 있는 경우
    if (!formData.nickname) {
      window.alert("닉네임을 입력하세요.");
      return;
    }
    // 필드가 모두 유효한 경우
    const createroom = async () => {
      try {
        const response = await axios.post(
          // "http://70.12.247.90:8080/rooms",
          "http://70.12.247.25:8080/rooms"
          // createUrl("/auth/login"),
        );
        console.log(response);
        navigate(`/home/room`, {
          state: {
            nickname: formData.nickname,
            roomId: response.data.data.id,
          },
        });

        // return response.data;
      } catch (error) {
        console.error("Error fetching Room Create:", error);
        throw error;
      }
    };
    createroom();
  };

  // 참가 인원 버튼 클릭시
  const handleSelectPlayer = (numberOfPlayers: number) => {
    // "2인", "3인", "4인" 버튼을 누를 때 participants 값을 변경
    setFormData((prevData) => ({
      ...prevData,
      participants: numberOfPlayers,
    }));
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
            <div>참가인원</div>
            <div className="selectPlayerContainer">
              <div
                className={`selectPlayerBtn ${
                  formData.participants === 2 ? "selectActive" : ""
                }`}
                onClick={() => handleSelectPlayer(2)}
              >
                2인
              </div>
              <div
                className={`selectPlayerBtn ${
                  formData.participants === 3 ? "selectActive" : ""
                }`}
                onClick={() => handleSelectPlayer(3)}
              >
                3인
              </div>
              <div
                className={`selectPlayerBtn ${
                  formData.participants === 4 ? "selectActive" : ""
                }`}
                onClick={() => handleSelectPlayer(4)}
              >
                4인
              </div>
            </div>
          </div>
          <div className="roomInput">
            <div>방이름</div>
            <input
              type="text"
              name="roomName"
              value={formData.roomName}
              onChange={handleChange}
              className="customInput"
            />
          </div>
          <div className="roomInput">
            <div>닉네임</div>
            <input
              type="text"
              name="nickname"
              value={formData.nickname}
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
