import { ReactNode } from "react";
import "./IngameModal.css";

interface Props {
  children?: ReactNode;
  width?: string;
  height?: string;
  visible?: boolean;
}

/**인게임 모달창 템플릿 */
export default function IngameModal({
  children,
  width = "30vw",
  height = "60vh",
  visible = true,
}: Props) {
  return (
    <>
      <div
        className={`ingameModal ${visible ? "ingameModalActive" : ""}`}
        style={{ width: `${width}`, height: `${height}` }}
      >
        {children}
      </div>
    </>
  );
}
