import "./CustomButton.css";
import { useState } from "react";

// Props 타입 정의
interface Props {
  width?: number;
  height?: number;
  text?: string;
  fontsize?: number;
  baseColor?: string;
  hoverColor?: string;
}

export default function CustomButton({
  width,
  height,
  text,
  fontsize,
  baseColor,
  hoverColor,
}: Props) {
  const [isHovered, setIsHovered] = useState(false); //hover 여부

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const buttonStyle = {
    width: `${width}px`,
    height: `${height}px`,
    fontSize: `${fontsize}px`,
    cursor: "pointer",
    backgroundColor: isHovered ? hoverColor : baseColor,
  };

  return (
    <>
      <button
        className="customBtn"
        style={buttonStyle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {text}
      </button>
    </>
  );
}
