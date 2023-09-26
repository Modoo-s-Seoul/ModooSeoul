import "./App.css";
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
  return (
    <>
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
    </>
  );
}

export default App;
