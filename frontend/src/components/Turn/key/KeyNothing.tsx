import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { playerInfoState } from "../../../data/IngameData";
import { useSocket } from "../../../pages/SocketContext";
import { sendWsMessage } from "../../IngameWs/IngameSendFunction";

/** Key - 꽝 */
export default function KeyNothing() {
  // 기본 인자
  // 웹소켓 기본인자
  const socketClient = useSocket();
  const [playerInfo] = useRecoilState(playerInfoState); // 플레이어 고유 정보

  // 자동 언마운트
  useEffect(() => {
    // 3초 후에 턴 넘김
    setTimeout(() => {
      sendWsMessage(socketClient, playerInfo.gameId, "send/pass-turn");
    }, 3000);
  }, []);

  return (
    <>
      <div className="innerKeyContainer">
        <div className="innerKeyNothing">꽝</div>
      </div>
    </>
  );
}
