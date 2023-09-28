import { atom } from "recoil";
import { RoomPlayerStatus } from "../interface/common";

// 로비

// 방 생성
export const roomStatus = atom<RoomPlayerStatus[]>({
  key: "roomStatus",
  default: [],
});

// 랜덤 매칭

// 초대 입장

// 웹 설정

// 웹 게임설정

// 배경음악
export const musicState = atom<HTMLAudioElement>({
  key: "musicState",
  default: new Audio("/assets/music2.mp3"),
});

// etc
export const alertModalState = atom<boolean>({
  key: "alertModalState",
  default: false,
});
