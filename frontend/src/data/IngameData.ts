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

// (임시) 게임 데이터
export const doubleCntState = atom<number>({
  key: "doubleCntState",
  default: 0,
});
export const pNumState = atom<number>({
  key: "pNumState",
  default: 4,
});
export const turnState = atom<number>({
  key: "turnState",
  default: 0,
});
export const trowState = atom<number>({
  key: "trowState",
  default: 0,
});
export const tcolState = atom<number>({
  key: "tcolState",
  default: 0,
});
export const isUserTurnVisibleState = atom<boolean>({
  key: "isUserTurnVisibleState",
  default: false,
});
export const first_money = atom<number>({
  key: "first_money",
  default: 10000000,
});
export const dice1State = atom<number>({
  key: "dice1State",
  default: 0,
});
export const dice2State = atom<number>({
  key: "dice2State",
  default: 1,
});
export const diceActiveState = atom<boolean>({
  key: "diceActiveState",
  default: false,
});
export const isRollingState = atom<boolean>({
  key: "isRollingState",
  default: false,
});
export interface playerInfo {
  name: string;
  money: number;
  color: string;
}
export const playerDataState = atom<playerInfo[]>({
  key: "playerDataState",
  default: [],
});
export interface playerPosition {
  row: number;
  col: number;
  mx: number;
  my: number;
}
export const playerPositionsState = atom<playerPosition[]>({
  key: "playerPositionsState",
  default: [],
});
export const playerSpriteState = atom<Phaser.GameObjects.Image[]>({
  key: "playerSpriteState",
  default: [],
});
export interface defaultMatch {
  row: number;
  col: number;
}
export const matchPosition = atom<defaultMatch[]>({
  key: "matchPosition",
  default: [
    { row: 0, col: 0 },
    { row: 0, col: 1 },
    { row: 0, col: 2 },
    { row: 0, col: 3 },
    { row: 0, col: 4 },
    { row: 0, col: 5 },
    { row: 0, col: 6 },
    { row: 0, col: 7 },
    { row: 0, col: 8 },
    { row: 1, col: 8 },
    { row: 2, col: 8 },
    { row: 3, col: 8 },
    { row: 4, col: 8 },
    { row: 5, col: 8 },
    { row: 6, col: 8 },
    { row: 7, col: 8 },
    { row: 8, col: 8 },
    { row: 8, col: 7 },
    { row: 8, col: 6 },
    { row: 8, col: 5 },
    { row: 8, col: 4 },
    { row: 8, col: 3 },
    { row: 8, col: 2 },
    { row: 8, col: 1 },
    { row: 8, col: 0 },
    { row: 7, col: 0 },
    { row: 6, col: 0 },
    { row: 5, col: 0 },
    { row: 4, col: 0 },
    { row: 3, col: 0 },
    { row: 2, col: 0 },
    { row: 1, col: 0 },
  ],
});

// 게임 전체

// 플레이어 개인
