import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { turnState } from "../../../data/IngameData";

/** Key - 로또 당청 */
export default function KeyLotto() {
  // 기본 인자
  const [turn, setTurn] = useRecoilState(turnState); // 턴 정보
  const [lottoMoney, setLottoMoney] = useState(0);

  // 자동 언마운트
  useEffect(() => {
    // 당첨금액 받아옴
    setLottoMoney(1000000);
    // 3초 후에 턴 넘김
    setTimeout(() => {
      setTurn(turn + 1);
    }, 3000);
  }, []);

  return (
    <>
      <div className="innerKeyContainer">
        <div className="innerKeyTitle">로또 당첨</div>
        <div className="innerKeyBody">
          <div className="keyLottoResult">당첨금</div>
          <div className="keyLottoResult">{lottoMoney}원</div>
        </div>
      </div>
    </>
  );
}
