/**플레이어의 필드 내 위치 정보 */
export interface playerPosition {
  /**추상적 좌표값 */
  row: number;
  col: number;

  /**스프라이트가 위치할 실제 좌표값 */
  mx: number;
  my: number;
}

/**플레이어의 게임 내 정보 */
export interface playerInfo {
  name: string;
  money: number;
  color: string;
}

/**보드의 칸 정보 */
export interface SpaceInfo{
    name: string;
    price: number;
    cost: number;
    kind: string;
    sell: boolean;
}

/**칸의 좌표와 칸 정보가 매칭된 보드 정보 */
export interface BoardData {
  [key: string]:SpaceInfo;
}