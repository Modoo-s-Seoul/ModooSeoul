import Close from "/assets/Close Symbol.png";
import "./CloseButton.css";

export default function CloseButton({ onClick }: { onClick: () => void }) {
  return (
    <>
      <div
        className="closeButton"
        onClick={onClick}
        style={{ cursor: "pointer" }}
      >
        <img src={Close} alt="x" />
      </div>
    </>
  );
}
