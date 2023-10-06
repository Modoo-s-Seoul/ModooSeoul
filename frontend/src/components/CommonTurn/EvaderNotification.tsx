import "./EvaderNotification.css";
import { isNotificationVisible, notificationMsg } from "../../data/IngameData";
import { useRecoilState, useRecoilValue } from "recoil";
import { useEffect, useState } from "react";

export default function EvaderNotification() {
  const [isVisible, setVisible] = useRecoilState(isNotificationVisible);
  const message = useRecoilValue(notificationMsg);
  const [timeCnt, setTimeCnt] = useState(10);

  useEffect(() => {
    console.log(isVisible);
  }, [isVisible]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (timeCnt > 1) {
        setTimeCnt(timeCnt - 1);
      } else {
        clearInterval(timer); // 타이머 정지
        setVisible(false);
      }
    }, 1000);
    // 컴포넌트가 언마운트될 때 타이머 정리
    return () => {
      clearInterval(timer);
    };
  }, [timeCnt]);

  return (
    <div className="notificationContainer">
      <div className="notificationBox">
        <div className="notificationText">
          <div>❗ {message}</div>
        </div>
      </div>
    </div>
  );
}
