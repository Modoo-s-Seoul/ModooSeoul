import { atom } from "recoil";
import { playerInfo } from "../interface/ingame";

/*
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
*/

// (임시) 게임 데이터

/** 더블 중첩 횟수 */
export const doubleCntState = atom<number>({
  key: "doubleCntState",
  default: 0,
});

/** 플레이어 수 */
export const pNumState = atom<number>({
  key: "pNumState",
  default: 4,
});

/** 턴 정보 */
export const turnState = atom<number>({
  key: "turnState",
  default: 0,
});

/** 해당 턴 row값 */
export const trowState = atom<number>({
  key: "trowState",
  default: 0,
});

/** 해당 턴 col값 */
export const tcolState = atom<number>({
  key: "tcolState",
  default: 0,
});

/** 플레이어 턴 컴포넌트 활성화 */
export const isUserTurnVisibleState = atom<boolean>({
  key: "isUserTurnVisibleState",
  default: false,
});

/** 공통 턴 컴포넌트 활성화 */
export const isCommonTurnVisibleState = atom<boolean>({
  key: "isCommonTurnVisibleState",
  default: false,
});

/** 초기자금 */
export const first_money = atom<number>({
  key: "first_money",
  default: 10000000,
});

/** 주사위 1 */
export const dice1State = atom<number>({
  key: "dice1State",
  default: 0,
});

/** 주사위 2 */
export const dice2State = atom<number>({
  key: "dice2State",
  default: 1,
});

/** 주사위 컴포넌트 활성화 */
export const diceActiveState = atom<boolean>({
  key: "diceActiveState",
  default: false,
});

/** 주사위 구르는 중 */
export const isRollingState = atom<boolean>({
  key: "isRollingState",
  default: false,
});

/** 플레이어 정보 기록 */
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

/** 플레이어 위치 기록 */
export const playerPositionsState = atom<playerPosition[]>({
  key: "playerPositionsState",
  default: [],
});

/** (타입) 건물 정보 기록 */
export interface builingInfoType {
  player: number | null;
  sell: boolean;
}

/** 건물 정보 기록 */
export const builingInfoState = atom<builingInfoType[]>({
  key: "builingInfoState",
  default: [],
});

/** (타입) 땅 정보 기록 */
export interface groundInfoType {
  player: number | null;
  sell: boolean;
  color: string;
}

/** 땅 정보 기록 */
export const groundInfoState = atom<groundInfoType[]>({
  key: "groundInfoState",
  default: [],
});

/** (타입) 땅 변동 기록 */
export interface groundChangeType {
  player: number | null;
  index: number;
  // sell: boolean;
}

/** 땅 변동 기록 */
export const groundChangeState = atom<groundChangeType[]>({
  key: "groundChangeState",
  default: [{ player: null, index: -1 }],
});

/** (타입) 건물 변동 기록 */
export interface buildingChangeType {
  player: number | null;
  index: number;
  point: number;
  // sell: boolean;
}

/** 건물 변동 기록 */
export const buildingChangeState = atom<buildingChangeType[]>({
  key: "buildingChangeState",
  default: [{ player: null, index: -1, point: -1 }],
});
export interface defaultMatch {
  row: number;
  col: number;
}

/** 보드판 위치 정보 */
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
