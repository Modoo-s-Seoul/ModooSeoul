import { ReactNode } from "react";
import "./IngameModal.css";
import "../CommonTurn/CommonTurn.css";
import { useRecoilValue } from "recoil";
import { isCommonGroundSellActiveState } from "../../data/IngameData";

interface Props {
  children?: ReactNode;
  width?: string;
  height?: string;
  maxWidth?: string;
  maxHeight?: string;
  minWidth?: string;
  minHeight?: string;
  visible?: boolean;
}

/**인게임 모달창 템플릿 */
export default function IngameModal({
  children,
  width = "30vw",
  height = "60vh",
  visible = true,
  maxWidth = "1200px",
  maxHeight = "600px",
  minWidth,
  minHeight,
}: Props) {
  const isGroundSellActive = useRecoilValue(isCommonGroundSellActiveState);

  return (
    <>
      <div
        className={`${isGroundSellActive ? "hideModal" : ""} ingameModal ${
          visible ? "ingameModalActive" : ""
        } `}
        style={{
          width: `${width}`,
          height: `${height}`,
          maxWidth: `${maxWidth}`,
          maxHeight: `${maxHeight}`,
          minWidth: `${minWidth}`,
          minHeight: `${minHeight}`,
        }}
      >
        {children}
      </div>
    </>
  );
}
