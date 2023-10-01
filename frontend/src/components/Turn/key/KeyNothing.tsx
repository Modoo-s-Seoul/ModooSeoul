import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { turnState } from "../../../data/IngameData";

/** Key - 꽝 */
export default function KeyNothing() {
  // 기본 인자
  const [turn, setTurn] = useRecoilState(turnState); // 턴 정보

  // 자동 언마운트
  useEffect(() => {
    // 3초 후에 턴 넘김
    setTimeout(() => {
      setTurn(turn + 1);
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
