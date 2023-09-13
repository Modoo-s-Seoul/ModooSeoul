import { ChangeEvent, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import BackBtn from "../../components/Base/BackBtn";
import ClickBtn from "../../components/Base/ClickBtn";

/** 링크로 진입할시 닉네임만 입력하는 컴포넌트 */
interface RoomEnterProps {
  roomId: string;
  nickname: string;
}
/** 초대 입장 컴포넌트 */
export default function Invite() {
  // 인풋 필드 관리
  const [formData, setFormData] = useState<RoomEnterProps>({
    roomId: "",
    nickname: "",
  });
  // 인풋 변경
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const navigate = useNavigate();
  const { pk } = useParams();
  // 게임 참가버튼을 눌렀을때
  const handelGoGame = () => {
    if (formData.nickname == "") {
      window.alert("닉네임을 입력하세요."); // 경고창 표시
      return;
    } else {
      // 닉네임이 비어있지 않은 경우, 게임 참가 로직을 실행
      navigate(`/home/room`, {
        state: {
          nickname: formData.nickname,
          roomId: pk,
        },
      });
    }
  };
  return (
    <>
      <div>
        <div className="roomHeader">
          <BackBtn />
        </div>
        <div>
          <h1>방 입장하기</h1>
          <div className="roomInput">
            <div>닉네임</div>{" "}
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
