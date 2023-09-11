import { useState, ChangeEvent } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

interface RoomCreateProps {
  participants: number;
  roomName: string;
  nickname: string;
}
export default function RoomCreate() {
  const [createNumb, setCreateNumb] = useState();
  // 인풋 필드 관리
  const [formData, setFormData] = useState<RoomCreateProps>({
    participants: 1,
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
    axios.post("http://70.12.247.90:8080/room/create").then((res) => {
      console.log(res);
      setCreateNumb(res.data);
      createNumb;
      navigate(
        `/home/room?nickname=${formData.nickname}&roomNumber=${res.data}`
      );
    });
  };

  return (
    <>
      <div>
        <div className="roomHeader">
          <Link to="/home">
            <button>Back</button>
          </Link>
        </div>
        <div className="roomBody">
          <h1>방 생성하기</h1>
          <div className="roomInput">
            참가인원 :{" "}
            <input
              type="number"
              name="participants"
              value={formData.participants}
              onChange={handleChange}
            />
          </div>
          <div className="roomInput">
            방이름 :{" "}
            <input
              type="text"
              name="roomName"
              value={formData.roomName}
              onChange={handleChange}
            />
          </div>
          <div className="roomInput">
            닉네임 :
            <input
              type="text"
              name="nickname"
              value={formData.nickname}
              onChange={handleChange}
            />
          </div>
        </div>

        <button className="roomCreateBtn" onClick={handleCreateRoom}>
          생성하기
        </button>
      </div>
    </>
  );
}
