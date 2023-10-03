import "./App.css";
import { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import Board from "./pages/Board";
import Lobby from "./pages/home/Lobby";
import RandomMatch from "./pages/home/RandomMatch";
import Room from "./pages/home/Room";
import RoomCreate from "./pages/home/RoomCreate";
import RoomInvite from "./pages/home/RoomInvite";
import TestComponent from "./components/Dev/TestComponent";
import BackgroundMusic from "./components/Base/Music";
import LogoWithStart from "./pages/home/LogoWithStart";
import NotFound from "./pages/NotFound";

function App() {
  const [backGroundImg, setBackGroundImg] = useState(
    "/assets/background/서울1.avif"
  );

  const imgList = [
    "/assets/background/서울3.avif",
    "/assets/background/서울4.avif",
    "/assets/background/서울5.avif",
    "/assets/background/서울6.avif",
    "/assets/background/서울7.avif",
    "/assets/background/서울9.avif",
  ];

  const containerStyle: React.CSSProperties = {
    position: "relative",
    backgroundImage: `url(${backGroundImg})`,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundBlendMode: "darken",
    width: "100%",
    height: "100vh",
    transition: "background-image 2s ease",
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * imgList.length);
      setBackGroundImg(imgList[randomIndex]);
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <div className="App" style={containerStyle}>
        <BackgroundMusic />
        <Routes>
          {/* 홈 */}
          <Route path="/" element={<LogoWithStart />} />
          <Route path="/home" element={<Lobby />} />
          <Route path="/home/create" element={<RoomCreate />} />
          <Route path="/home/random" element={<RandomMatch />} />
          <Route path="/home/invite/:pk" element={<RoomInvite />} />
          <Route path="/home/room" element={<Room />} />
          {/* 인게임 */}
          <Route path="/game" element={<Board />} />
          {/* 404 */}
          <Route path="*" element={<NotFound />} />
          {/* 컴포넌트 테스트 */}
          <Route path="/test" element={<TestComponent />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
