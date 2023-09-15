import "./App.css";
import MonopolyBoard from "./pages/Board";
import Lobby from "./pages/home/Lobby";
import RandomMatch from "./pages/home/RandomMatch";
import Room from "./pages/home/Room";
import RoomCreate from "./pages/home/RoomCreate";
import RoomInvite from "./pages/home/RoomInvite";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <>
      <Routes>
        {/* 홈 */}
        <Route path="/home" element={<Lobby />} />
        <Route path="/home/create" element={<RoomCreate />} />
        <Route path="/home/random" element={<RandomMatch />} />
        <Route path="/home/invite/:pk" element={<RoomInvite />} />
        <Route path="/home/room" element={<Room />} />
        {/* 인게임 */}
        <Route path="/game" element={<MonopolyBoard />} />
      </Routes>
    </>
  );
}

export default App;
