import { ChangeEvent, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { joinRoom } from '../../api/RoomApi';
import BackBtn from '../../components/Base/BackBtn';
import ClickBtn from '../../components/Base/CustomButton';
import axios from 'axios';

/** 방 입장 컴포넌트 */
export default function Invite() {
  const [nickname, setNickname] = useState(''); // 유저 닉네임
  const navigate = useNavigate();
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
    if (nickname === '') {
      window.alert('닉네임을 입력하세요.'); // 경고창 표시
      return;
    }

    try {
      const joinResponse = await joinRoom(nickname, pk);
      console.log(joinResponse);

      if (joinResponse.message === 'success') {
        navigate(`/home/room`, {
          // 유저 닉네임, 방 id 다음 페이지에 넘기기
          state: {
            nickname: nickname,
            gameId: pk,
            playerId: joinResponse.data.id,
          },
        });
      } else {
        window.alert(joinResponse.phrase); // 경고창 표시
        return;
      }
    } catch (error) {
      console.error('Error fetching Room Info', error);
      if (axios.isAxiosError(error)) {
        alert(error.response?.data.phrase);
        throw error;
      }
    }
  };

  return (
    <>
      <div className="roomContainer">
        <div className="roomHeader">
          <BackBtn />
        </div>
        <div>
          <h1>방 입장하기</h1>
          <div className="roomInput">
            <div>닉네임</div>{' '}
            <input
              type="text"
              name="nickname"
              className="customInput"
              onChange={handleChange}
            />
          </div>
          <div className="clickBtnContainer" onClick={handelGoGame}>
            <ClickBtn width={120} height={60} fontsize={21} text={'방 참가'} />
          </div>
        </div>
      </div>
    </>
  );
}
