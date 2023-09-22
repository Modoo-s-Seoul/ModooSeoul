import { ReactNode } from "react";
import "./IngameBox.css";

interface Props {
  children?: ReactNode;
  width?: string;
  height?: string;
}

/**인게임 모달창 안에 넣는 박스 템플릿 */
export default function IngameBox({
  children,
  width = "50px",
  height = "50px",
}: Props) {
  return (
    <>
      <div
        className="ingameBox"
        style={{ width: `${width}`, height: `${height}` }}
      >
        {children}
      </div>
    </>
  );
}
