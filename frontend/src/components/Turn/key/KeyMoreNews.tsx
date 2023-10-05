import { useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { moreNewsState, playerInfoState } from "../../../data/IngameData";
import { useSocket } from "../../../pages/SocketContext";
import { sendWsMessage } from "../../IngameWs/IngameSendFunction";

/** Key - 뉴스 더 제공받기 */
export default function KeyMoreNews() {
  // 기본 인자
  // 웹소켓 기본인자
  const socketClient = useSocket();
  const [playerInfo] = useRecoilState(playerInfoState); // 플레이어 고유 정보
  const moreNews = useRecoilValue(moreNewsState);

  // 자동 언마운트
  useEffect(() => {
    // 뉴스 내용받아오기

    // 3초 후에 턴 넘김
    setTimeout(() => {
      sendWsMessage(socketClient, playerInfo.gameId, "send/pass-turn");
    }, 3000);
  }, []);

  return (
    <>
      <div className="innerKeyContainer">
        <div className="innerKeyTitle">추가 뉴스</div>
        <div className="innerKeyBody">
          <div className="keyNewsResult">{moreNews}</div>
        </div>
      </div>
    </>
  );
}
