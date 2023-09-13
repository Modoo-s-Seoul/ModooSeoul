import { atom, selector } from "recoil";

export const sample = atom<number>({
  key: "sampleState",
  default: 0,
});

export const sample2 = selector({
  key: "sampleSelector",
  get: ({ get }) => {
    get;
    return;
  },
});

// 로비

// 방 생성

// 랜덤 매칭

// 초대 입장

// 웹 설정

// 웹 게임설정
