import { useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { isModalMsgActiveState, modalMsgState } from "../../data/IngameData";
import "./MessageModal.css";

export default function NoLandMessage() {
  const [isModalMsgActive, setIsModalMsgActive] = useRecoilState(
    isModalMsgActiveState
  ); // 모달 메세지 토글
  const modalMsg = useRecoilValue(modalMsgState); // 모달 메세지

  useEffect(() => {
    // 선택 가능한 땅이 없을 때, 2초 동안 메시지를 보여준 후 숨김
    const timer = setTimeout(() => {
      setIsModalMsgActive(false);
    }, 2000);

    return () => {
      // setIsModalMsgActive(false);
      clearTimeout(timer);
    };
  }, [isModalMsgActive]);

  return isModalMsgActive ? (
    <div className="noLandMessage">{modalMsg}</div>
  ) : null;
}
