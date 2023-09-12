// GameRule.ts
// 랜덤 매치에서 보여줄 문구들입니다.

export interface GameRule {
  id: number;
  title: string;
  description: string;
}

const gameRules: GameRule[] = [
  {
    id: 1,
    title: "게임 룰 1",
    description: "이것은 게임 룰 1에 대한 설명입니다.",
  },
  {
    id: 2,
    title: "게임 룰 2",
    description: "이것은 게임 룰 2에 대한 설명입니다.",
  },
  {
    id: 3,
    title: "게임 팁 1",
    description: "이것은 게임 팁 1에 대한 설명입니다.",
  },
  {
    id: 4,
    title: "게임 팁 2",
    description: "이것은 게임 팁 2에 대한 설명입니다.",
  },
];

export default gameRules;
