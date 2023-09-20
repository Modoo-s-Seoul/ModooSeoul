import { useState } from "react";
import "./Modal.css";
import "./WebInfo.css";

export default function WebInfo() {
  /** 인포창 끄고 켜기 */
  const [isWebInfoVisible, setIsWebInfoVisible] = useState(false);
  const toggleWebInfo = () => {
    setIsWebInfoVisible(!isWebInfoVisible);
  };

  return (
    <>
      <div className="lobbyHeaderBtn" onClick={toggleWebInfo}>
        정보
      </div>
      {isWebInfoVisible && <WebInfoLoad onClose={toggleWebInfo} />}
    </>
  );
}

/** 토글로 커지는 인포창 인터페이스 */
interface WebInfoLoadProps {
  onClose: () => void; // onClose 함수의 타입을 명시적으로 정의합니다.
}
/** 토글로 커지는 인포창 */
export function WebInfoLoad({ onClose }: WebInfoLoadProps) {
  return (
    <div className="modalOverlay">
      <div className="modal">
        <div className="modalClose">
          <div style={{ cursor: "pointer" }} onClick={onClose}>
            ✖
          </div>
        </div>
        <h1>게임 설명</h1>
        <div className="infoContainer">
          <div className="infoBox">
            <div>1</div>
            <img src="" alt="" />
            <div className="infoTxt">
              Lorem ipsum, dolor sit amet consectetur adipisicing elit.
              Asperiores doloribus commodi nam dolor voluptatibus ullam
              inventore quibusdam excepturi quia molestias temporibus suscipit
              quaerat voluptates sequi, ab deserunt quos minus exercitationem!
              Aut, delectus. At a libero perferendis voluptatibus sed, sequi
              sint dolorum doloribus consectetur nisi maxime aspernatur quo non
              magnam, error incidunt eaque. Veritatis, quasi quaerat. Voluptate
              incidunt aut quos facilis, alias temporibus asperiores laudantium
              eligendi molestiae obcaecati consequuntur libero dicta iusto non.
              Nihil similique repudiandae esse aspernatur alias ab neque
              deserunt dolorum rerum fugit, quas repellat non?!
            </div>
          </div>
          <div className="infoBox">
            <div>2</div>
            <img src="" alt="" />
            <div className="infoTxt">
              Lorem ipsum, dolor sit amet consectetur adipisicing elit.
              Asperiores doloribus commodi nam dolor voluptatibus ullam
              inventore quibusdam excepturi quia molestias temporibus suscipit
              quaerat voluptates sequi, ab deserunt quos minus exercitationem!
              Aut, delectus. At a libero perferendis voluptatibus sed, sequi
              sint dolorum doloribus consectetur nisi maxime aspernatur quo non
              magnam, error incidunt eaque. Veritatis, quasi quaerat. Voluptate
              incidunt aut quos facilis, alias temporibus asperiores laudantium
              eligendi molestiae obcaecati consequuntur libero dicta iusto non.
              Nihil similique repudiandae esse aspernatur alias ab neque
              deserunt dolorum rerum fugit, quas repellat non?!
            </div>
          </div>
          <div className="infoBox">
            <div>3</div>
            <img src="" alt="" />
            <div className="infoTxt">
              Lorem ipsum, dolor sit amet consectetur adipisicing elit.
              Asperiores doloribus commodi nam dolor voluptatibus ullam
              inventore quibusdam excepturi quia molestias temporibus suscipit
              quaerat voluptates sequi, ab deserunt quos minus exercitationem!
              Aut, delectus. At a libero perferendis voluptatibus sed, sequi
              sint dolorum doloribus consectetur nisi maxime aspernatur quo non
              magnam, error incidunt eaque. Veritatis, quasi quaerat. Voluptate
              incidunt aut quos facilis, alias temporibus asperiores laudantium
              eligendi molestiae obcaecati consequuntur libero dicta iusto non.
              Nihil similique repudiandae esse aspernatur alias ab neque
              deserunt dolorum rerum fugit, quas repellat non?!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
