// data.js
export interface SpaceInfo{
    name: string;
    price: number;
    cost: number;
    kind: string;
    sell: boolean;
}

export interface BoardData {
  [key: string]:SpaceInfo;
}

export const boardData:BoardData = {
  "0-0": {
    name: "START",
    price: 0,
    cost: 0,
    kind: "start",
    sell: false,
  },
  "0-1": {
    name: "서대문",
    price: 250000,
    cost: 12000,
    kind: "ground",
    sell: false,
  },
  "0-2": {
    name: "마포",
    price: 180000,
    cost: 9000,
    kind: "ground",
    sell: false,
  },
  "0-3": {
    name: "은평",
    price: 220000,
    cost: 11000,
    kind: "ground",
    sell: false,
  },
  "0-4": {
    name: "황금열쇠",
    price: 0,
    cost: 0,
    kind: "key",
    sell: false,
  },
  "0-5": {
    name: "강서",
    price: 270000,
    cost: 13500,
    kind: "ground",
    sell: false,
  },
  "0-6": {
    name: "구로",
    price: 240000,
    cost: 12000,
    kind: "ground",
    sell: false,
  },
  "0-7": {
    name: "영등포",
    price: 260000,
    cost: 13000,
    kind: "ground",
    sell: false,
  },
  "0-8": {
    name: "감옥",
    price: 0,
    cost: 0,
    kind: "prison",
    sell: false,
  },
  "1-8": {
    name: "용산",
    price: 210000,
    cost: 10500,
    kind: "ground",
    sell: false,
  },
  "2-8": {
    name: "종로",
    price: 230000,
    cost: 11500,
    kind: "ground",
    sell: false,
  },
  "3-8": {
    name: "노원",
    price: 250000,
    cost: 12500,
    kind: "ground",
    sell: false,
  },
  "4-8": {
    name: "황금열쇠",
    price: 0,
    cost: 0,
    kind: "key",
    sell: false,
  },
  "5-8": {
    name: "도봉",
    price: 290000,
    cost: 14500,
    kind: "ground",
    sell: false,
  },
  "6-8": {
    name: "성북",
    price: 340000,
    cost: 17000,
    kind: "ground",
    sell: false,
  },
  "7-8": {
    name: "강북",
    price: 340000,
    cost: 17000,
    kind: "ground",
    sell: false,
  },
  "8-8": {
    name: "oil",
    price: 0,
    cost: 0,
    kind: "oil",
    sell: false,
  },
  "8-7": {
    name: "성동",
    price: 300000,
    cost: 15000,
    kind: "ground",
    sell: false,
  },
  "8-6": {
    name: "동대문",
    price: 300000,
    cost: 15000,
    kind: "ground",
    sell: false,
  },
  "8-5": {
    name: "광진",
    price: 300000,
    cost: 15000,
    kind: "ground",
    sell: false,
  },
  "8-4": {
    name: "황금열쇠",
    price: 0,
    cost: 0,
    kind: "key",
    sell: false,
  },
  "8-3": {
    name: "강동",
    price: 260000,
    cost: 13000,
    kind: "ground",
    sell: false,
  },
  "8-2": {
    name: "여의도",
    price: 240000,
    cost: 12000,
    kind: "ground",
    sell: false,
  },
  "8-1": {
    name: "중랑",
    price: 220000,
    cost: 11000,
    kind: "ground",
    sell: false,
  },
  "8-0": {
    name: "지하철",
    price: 0,
    cost: 0,
    kind: "subway",
    sell: false,
  },
  "7-0": {
    name: "송파",
    price: 200000,
    cost: 10000,
    kind: "ground",
    sell: false,
  },
  "6-0": {
    name: "관악",
    price: 200000,
    cost: 10000,
    kind: "ground",
    sell: false,
  },
  "5-0": {
    name: "동작",
    price: 200000,
    cost: 10000,
    kind: "ground",
    sell: false,
  },
  "4-0": {
    name: "황금열쇠",
    price: 0,
    cost: 0,
    kind: "key",
    sell: false,
  },
  "3-0": {
    name: "강남",
    price: 200000,
    cost: 10000,
    kind: "ground",
    sell: false,
  },
  "2-0": {
    name: "국세청",
    price: 0,
    cost: 0,
    kind: "tax",
    sell: false,
  },
  "1-0": {
    name: "서초",
    price: 220000,
    cost: 11000,
    kind: "ground",
    sell: false,
  },
};

export default boardData;
