import { atom } from "recoil";
import {
  PlayerInfo,
  PlayerPosition,
  PlayerData,
  defaultMatch,
  groundChangeType,
  builingInfoType,
  groundInfoType,
  buildingChangeType,
  subwayChangeType,
} from "../interface/ingame";

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

// 게임 전체

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

/** 라운드 정보 */
export const roundState = atom<number>({
  key: "roundState",
  default: 0,
});

/** 턴 정보 */
export const turnState = atom<number>({
  key: "turnState",
  default: 6,
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

/** 시작점 선택 row값 */
export const srowState = atom<number>({
  key: "srowState",
  default: 0,
});

/** 시작점 선택 col값 */
export const scolState = atom<number>({
  key: "scolState",
  default: 0,
});

/** 로딩 컴포넌트 활성화 */
export const isLoadingVisibleState = atom<boolean>({
  key: "isLoadingVisibleState",
  default: true,
});

/** 뉴스 컴포넌트 활성화 */
export const isNewsVisibleState = atom<boolean>({
  key: "isNewsVisibleState",
  default: false,
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

/** 오일선택 활성화 */
export const isOilActiveState = atom<boolean>({
  key: "isOilActiveState",
  default: false,
});

/** 지하철선택 활성화 */
export const isSubwayActiveState = atom<boolean>({
  key: "isSubwayActiveState",
  default: false,
});

/** 시작점선택 활성화 */
export const isStartActiveState = atom<boolean>({
  key: "isStartActiveState",
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

/** 플레이어 고유 정보 기록 */
export const playerInfoState = atom<PlayerInfo>({
  key: "playerInfoState",
  default: { gameId: "", playerId: "" },
});

/** 플레이어 인게임 정보 기록 */
export const playerDataState = atom<PlayerData[]>({
  key: "playerDataState",
  default: [],
});

/** 플레이어 위치 기록 */
export const playerPositionsState = atom<PlayerPosition[]>({
  key: "playerPositionsState",
  default: [],
});

/** 건물 정보 기록 */
export const builingInfoState = atom<builingInfoType[]>({
  key: "builingInfoState",
  default: [],
});

/** 땅 정보 기록 */
export const groundInfoState = atom<groundInfoType[]>({
  key: "groundInfoState",
  default: [],
});

/** 땅 변동 기록 */
export const groundChangeState = atom<groundChangeType[]>({
  key: "groundChangeState",
  default: [{ player: null, index: -1 }],
});

/** 건물 변동 기록 */
export const buildingChangeState = atom<buildingChangeType[]>({
  key: "buildingChangeState",
  default: [{ player: null, index: -1, point: -1, industry: -1 }],
});

/** 오일랜드 위치 */
export const oilLandState = atom<number>({
  key: "oilLandState",
  default: -1,
});

/** 시작점 선택순서 */
export const startMsgNumState = atom<number>({
  key: "startMsgNumState",
  default: 0,
});

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
    { row: 1, col: 0 },
    { row: 1, col: 8 },
    { row: 2, col: 0 },
    { row: 2, col: 8 },
    { row: 3, col: 0 },
    { row: 3, col: 8 },
    { row: 4, col: 0 },
    { row: 4, col: 8 },
    { row: 5, col: 0 },
    { row: 5, col: 8 },
    { row: 6, col: 0 },
    { row: 6, col: 8 },
    { row: 7, col: 0 },
    { row: 7, col: 8 },
    { row: 8, col: 0 },
    { row: 8, col: 1 },
    { row: 8, col: 2 },
    { row: 8, col: 3 },
    { row: 8, col: 4 },
    { row: 8, col: 5 },
    { row: 8, col: 6 },
    { row: 8, col: 7 },
    { row: 8, col: 8 },
  ],
});

/** 모달 메세지 토글 */
export const isModalMsgActiveState = atom<boolean>({
  key: "isModalMsgActiveState",
  default: false,
});

/** 모달 메세지 토글 */
export const modalMsgState = atom<string>({
  key: "modalMsgState",
  default: "",
});

// 플레이어 개인

export const selectedNewsState = atom<string>({
  key: "selectedNewsState",
  default: "뉴스",
});

/** 감옥 여부 */
export const isPrisonState = atom<boolean>({
  key: "isPrisonState",
  default: false,
});

/** 지하철 변동감지 */
export const isSubwayState = atom<subwayChangeType[]>({
  key: "isSubwayState",
  default: [{ player: null, row: 0, col: 0, move: false }],
});
