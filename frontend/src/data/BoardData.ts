import { BoardData } from "../interface/ingame";
import { atom } from "recoil";

export const boardDataState = atom<BoardData>({
  key: "boardDataState",
  default: {
    "0-0": {
      name: "START",
      price: 0,
      cost: 0,
      kind: "start",
      sell: false,
      index: 0,
      order: 1,
      player: null,
      oil: false,
    },
    "0-1": {
      name: "구로",
      price: 250000,
      cost: 12000,
      kind: "ground",
      sell: false,
      index: 1,
      order: 2,
      player: null,
      oil: false,
    },
    "0-2": {
      name: "관악",
      price: 180000,
      cost: 9000,
      kind: "ground",
      sell: false,
      index: 2,
      order: 3,
      player: null,
      oil: false,
    },
    "0-3": {
      name: "강서",
      price: 220000,
      cost: 11000,
      kind: "ground",
      sell: false,
      index: 3,
      order: 4,
      player: null,
      oil: false,
    },
    "0-4": {
      name: "황금열쇠",
      price: 0,
      cost: 0,
      kind: "key",
      sell: false,
      index: 4,
      order: 5,
      player: null,
      oil: false,
    },
    "0-5": {
      name: "영등포",
      price: 270000,
      cost: 13500,
      kind: "ground",
      sell: false,
      index: 5,
      order: 6,
      player: null,
      oil: false,
    },
    "0-6": {
      name: "양천",
      price: 240000,
      cost: 12000,
      kind: "ground",
      sell: false,
      index: 6,
      order: 7,
      player: null,
      oil: false,
    },
    "0-7": {
      name: "동작",
      price: 260000,
      cost: 13000,
      kind: "ground",
      sell: false,
      index: 7,
      order: 8,
      player: null,
      oil: false,
    },
    "0-8": {
      name: "경찰서",
      price: 0,
      cost: 0,
      kind: "prison",
      sell: false,
      index: 8,
      order: 9,
      player: null,
      oil: false,
    },
    "1-8": {
      name: "은평",
      price: 210000,
      cost: 10500,
      kind: "ground",
      sell: false,
      index: 10,
      order: 10,
      player: null,
      oil: false,
    },
    "2-8": {
      name: "서대문",
      price: 230000,
      cost: 11500,
      kind: "ground",
      sell: false,
      index: 12,
      order: 11,
      player: null,
      oil: false,
    },
    "3-8": {
      name: "종로",
      price: 250000,
      cost: 12500,
      kind: "ground",
      sell: false,
      index: 14,
      order: 12,
      player: null,
      oil: false,
    },
    "4-8": {
      name: "황금열쇠",
      price: 0,
      cost: 0,
      kind: "key",
      sell: false,
      index: 16,
      order: 13,
      player: null,
      oil: false,
    },
    "5-8": {
      name: "중구",
      price: 290000,
      cost: 14500,
      kind: "ground",
      sell: false,
      index: 18,
      order: 14,
      player: null,
      oil: false,
    },
    "6-8": {
      name: "마포",
      price: 340000,
      cost: 17000,
      kind: "ground",
      sell: false,
      index: 20,
      order: 15,
      player: null,
      oil: false,
    },
    "7-8": {
      name: "용산",
      price: 340000,
      cost: 17000,
      kind: "ground",
      sell: false,
      index: 22,
      order: 16,
      player: null,
      oil: false,
    },
    "8-8": {
      name: "오일랜드",
      price: 0,
      cost: 0,
      kind: "oil",
      sell: false,
      index: 31,
      order: 17,
      player: null,
      oil: false,
    },
    "8-7": {
      name: "도봉",
      price: 300000,
      cost: 15000,
      kind: "ground",
      sell: false,
      index: 30,
      order: 18,
      player: null,
      oil: false,
    },
    "8-6": {
      name: "중랑",
      price: 300000,
      cost: 15000,
      kind: "ground",
      sell: false,
      index: 29,
      order: 19,
      player: null,
      oil: false,
    },
    "8-5": {
      name: "강북",
      price: 300000,
      cost: 15000,
      kind: "ground",
      sell: false,
      index: 28,
      order: 20,
      player: null,
      oil: false,
    },
    "8-4": {
      name: "황금열쇠",
      price: 0,
      cost: 0,
      kind: "key",
      sell: false,
      index: 27,
      order: 21,
      player: null,
      oil: false,
    },
    "8-3": {
      name: "노원",
      price: 260000,
      cost: 13000,
      kind: "ground",
      sell: false,
      index: 26,
      order: 22,
      player: null,
      oil: false,
    },
    "8-2": {
      name: "동대문",
      price: 240000,
      cost: 12000,
      kind: "ground",
      sell: false,
      index: 25,
      order: 23,
      player: null,
      oil: false,
    },
    "8-1": {
      name: "성북",
      price: 220000,
      cost: 11000,
      kind: "ground",
      sell: false,
      index: 24,
      order: 24,
      player: null,
      oil: false,
    },
    "8-0": {
      name: "지하철",
      price: 0,
      cost: 0,
      kind: "subway",
      sell: false,
      index: 23,
      order: 25,
      player: null,
      oil: false,
    },
    "7-0": {
      name: "강동",
      price: 200000,
      cost: 10000,
      kind: "ground",
      sell: false,
      index: 21,
      order: 26,
      player: null,
      oil: false,
    },
    "6-0": {
      name: "성동",
      price: 200000,
      cost: 10000,
      kind: "ground",
      sell: false,
      index: 19,
      order: 27,
      player: null,
      oil: false,
    },
    "5-0": {
      name: "광진",
      price: 200000,
      cost: 10000,
      kind: "ground",
      sell: false,
      index: 17,
      order: 28,
      player: null,
      oil: false,
    },
    "4-0": {
      name: "국세청",
      price: 0,
      cost: 0,
      kind: "tax",
      sell: false,
      index: 15,
      order: 29,
      player: null,
      oil: false,
    },
    "3-0": {
      name: "송파",
      price: 200000,
      cost: 10000,
      kind: "ground",
      sell: false,
      index: 13,
      order: 30,
      player: null,
      oil: false,
    },
    "2-0": {
      name: "서초",
      price: 0,
      cost: 0,
      kind: "ground",
      sell: false,
      index: 11,
      order: 31,
      player: null,
      oil: false,
    },
    "1-0": {
      name: "강남",
      price: 220000,
      cost: 11000,
      kind: "ground",
      sell: false,
      index: 9,
      order: 32,
      player: null,
      oil: false,
    },
  },
});
