import "./ClickBtn.css";

// Props 타입 정의
interface CustomButtonProps {
  width: number;
  height: number;
  text: string;
  fontsize: number;
}

export default function CustomButton(props: CustomButtonProps) {
  // props에서 너비, 높이 및 텍스트를 추출합니다.
  const { width, height, text, fontsize } = props;

  // 스타일 객체를 생성하여 너비와 높이를 설정합니다.
  const buttonStyle = {
    width: `${width}px`,
    height: `${height}px`,
    fontSize: `${fontsize}px`,
    cursor: "pointer",
  };

  return (
    <>
      <button className="customBtn" style={buttonStyle}>
        {text}
      </button>
    </>
  );
}
