import "./LogoWithStart.css";
import { Link } from "react-router-dom";
import { handleFullScreen } from "../../components/Base/BaseFunc";

export default function LogoWithStart() {
  return (
    <>
      <div className="logoStartContainer">
        <img src="/moduseoul.png" alt="" />
        <Link to={"/home"} className="startLink" onClick={handleFullScreen}>
          <div className="logoStartBtn">시작하기</div>
        </Link>
      </div>
    </>
  );
}
