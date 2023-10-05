import { useEffect } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import {
  displayPlayerDataState,
  lottoResultState,
  playerDataState,
  playerInfoState,
} from "../../../data/IngameData";
import { useSocket } from "../../../pages/SocketContext";
import { sendWsMessage } from "../../IngameWs/IngameSendFunction";

/** Key - 로또 당청 */
export default function KeyLotto() {
  // 기본 인자
  const [lottoResult] = useRecoilState(lottoResultState);
  // 웹소켓 기본인자
  const socketClient = useSocket();
  const [playerInfo] = useRecoilState(playerInfoState); // 플레이어 고유 정보
  const setDisplayPlayerData = useSetRecoilState(displayPlayerDataState); // 출력용 플레이어 인게임 정보
  const [playerData] = useRecoilState(playerDataState); // 플레이어 인게임 정보

  // 자동 언마운트
  useEffect(() => {
    // 당첨금액 받아옴
    // 돈정보 디스플레이 업데이트
    setDisplayPlayerData(playerData);
    // 3초 후에 턴 넘김
    setTimeout(() => {
      sendWsMessage(socketClient, playerInfo.gameId, "send/pass-turn");
    }, 3000);
  }, []);

  return (
    <>
      <div className="innerKeyContainer">
        <div className="innerKeyTitle">로또 당첨</div>
        <div className="innerKeyBody">
          <div className="keyLottoResult">{lottoResult}</div>
        </div>
      </div>
    </>
  );
}
