/**(타입) 플레이어의 필드 내 위치 정보 */
export interface PlayerPosition {
  /**추상적 좌표값 */
  row: number;
  col: number;

  /**스프라이트가 위치할 실제 좌표값 */
  mx: number;
  my: number;

  /** 지하철 여부 */
  subway: boolean;
}

/**(타입) 플레이어 고유 정보 */
export interface PlayerInfo {
  nickname: string;
  gameId: string;
  playerId: string;
}

/**(타입) 플레이어의 게임 내 정보 */
export interface PlayerData {
  name: string;
  cash: number;
  totalAsset: number;
  color: string;
}

/**(타입) 보드의 칸 정보 */
export interface SpaceInfo {
  name: string;
  price: number;
  cost: number;
  kind: string;
  sell: boolean;
  index: number;
  order: number;
  player: null | number;
  oil: boolean;
}

/**(타입) 칸의 좌표와 칸 정보가 매칭된 보드 정보 */
export interface BoardData {
  [key: string]: SpaceInfo;
}

/**(타입) 보드판 위치 정보 */
export interface defaultMatch {
  row: number;
  col: number;
}

/**(타입) 보드판 인덱스 정보 */
export interface defaultIndex{
  row: number;
  col: number;
}

/**(타입) 땅 변동 기록 */
export interface groundChangeType {
  player: number | null;
  index: number;
  // sell: boolean;
}

/** (타입) 건물 정보 기록 */
export interface builingInfoType {
  player: number | null;
  sell: boolean;
  industry: number;
}

/** (타입) 땅 정보 기록 */
export interface groundInfoType {
  player: number | null;
  sell: boolean;
  color: string;
}

/** (타입) 건물 변동 기록 */
export interface buildingChangeType {
  player: number | null;
  index: number;
  point: number;
  industry: number;
  // sell: boolean;
}

/** (타입) 주식 변동 기록 */
export interface stockChangeType {
  stockName: string;
  currentPrice: number;
  stockHistory: number[];
}

/** (타입) 지하철 변동 기록 */
export interface subwayChangeType {
  player: number | null;
  row: number | null;
  col: number | null;
  move: boolean;
}
