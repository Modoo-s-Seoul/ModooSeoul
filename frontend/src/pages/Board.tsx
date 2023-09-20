import { useEffect, useState, useRef } from "react";
import { CursorifyProvider } from "@cursorify/react";
// import { PhingerCursor } from "@cursorify/cursors";
import { EmojiCursor } from "../components/Base/EmojiCursor";
import Phaser from "phaser";
// import axios from "axios";
// import SockJS from "sockjs-client";
// import StompJs from "@stomp/stompjs";
import UserInfo from "./UserInfo";
import UserTurn from "./UserTurn";
import CommonTurn from "../components/All/CommonTurn";
import DiceRoll from "./DiceRoll";
import "./Board.css";
import { PlayerPosition, PlayerInfo } from "../interface/ingame";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  pNumState,
  first_money,
  turnState,
  dice1State,
  dice2State,
  diceActiveState,
  playerDataState,
  isUserTurnVisibleState,
  isRollingState,
  doubleCntState,
  trowState,
  tcolState,
  builingInfoState,
  groundChangeState,
  buildingChangeState,
  isCommonTurnVisibleState,
} from "../data/IngameData";
import GameOption from "../components/Base/GameOption";

export default function Board() {
  const game = useRef<HTMLDivElement | null>(null);

  // 글로벌 변수들

  /**캐릭터 에셋 이름 */
  const characterAssetNames = ["Pink", "Blue", "Green", "Yellow"];

  /**캐릭터 에셋 주소 */
  const characterAssetLocation = [
    "assets/alienPink.png",
    "assets/alienBlue.png",
    "assets/alienGreen.png",
    "assets/alienYellow.png",
  ];

  const colorPalette = ["dd9090", "909add", "90dd9a", "dddc90"];
  const colorPaletteTint = [0xdd9090, 0x909add, 0x90dd9a, 0xdddc90];
  colorPaletteTint;
  const offset = 10; // 플레이어 위치 조정
  const offset2 = 220; // y축 위치조정용 변수
  const globalTileSize = 121; // 타일 크기및 간격
  // 초기 정보
  const [doubleCnt, setDoubleCnt] = useRecoilState(doubleCntState); // 더블 카운트
  const pNum = useRecoilValue(pNumState); // 플레이어 수
  const firstMoneyValue = useRecoilValue(first_money); // 초기 자본
  const groundChange = useRecoilValue(groundChangeState); // 땅 변동
  const buildingChange = useRecoilValue(buildingChangeState); // 건물 변동
  const playerDeafaults: PlayerInfo[] = [];
  const [playerData, setPlayerData] = useRecoilState(playerDataState); // 플레이어 현재 정보
  playerData;
  for (let i = 1; i <= pNum; i++) {
    playerDeafaults.push({
      name: `Player ${i}`,
      money: firstMoneyValue,
      color: colorPalette[i - 1],
    });
  }

  const [turn, setTurn] = useRecoilState(turnState); // 현재 플레이 순서
  const setTRow = useSetRecoilState(trowState); // 현재 턴 row
  const setTCol = useSetRecoilState(tcolState); // 현재 턴 col
  const setDice1Value = useSetRecoilState(dice1State); // 첫번째 주사위 값
  const setDice2Value = useSetRecoilState(dice2State); // 두번째 주사위 값
  const setDiceActive = useSetRecoilState(diceActiveState); // 주사위 상태
  const [isRolling, setIsRolling] = useRecoilState(isRollingState); // 주사위 굴리기 버튼 활성화 상태
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [playerSprite, setPlayerSprite] = useState<Phaser.GameObjects.Image[]>(
    []
  ); //플레이어 스프라이트
  const [etcSprite, setEtcSprite] = useState<Phaser.GameObjects.Image[]>([]); //기타 스프라이트
  const [groundSprite, setGroundSprite] = useState<Phaser.GameObjects.Image[]>(
    []
  ); //땅 스프라이트
  groundSprite;

  const [buildingSprite, setBuildingSprite] = useState<
    Phaser.GameObjects.Image[]
  >([]); //건물 스프라이트
  const setBuildingInfo = useSetRecoilState(builingInfoState); //건물 정보
  buildingSprite;
  const [PlayerPositions, setPlayerPositions] = useState<PlayerPosition[]>([]); // 플레이어 위치
  const [isUserTurnVisible, setIsUserTurnVisible] = useRecoilState(
    isUserTurnVisibleState
  ); // 플레이어 턴 수행 가능 여부
  const [isCommonTurnVisible, setIsCommonTurnVisible] = useRecoilState(
    isCommonTurnVisibleState
  ); // 공통 턴 수행 가능 여부

  const config = {
    type: Phaser.AUTO,
    parent: "gameScreen",
    // transparent: true, //배경 투명하게 설정

    // 캔버스 크기 창 크기에 따라 자동 맞춤되는 옵션
    scale: {
      mode: Phaser.Scale.FIT,
      width: window.innerWidth,
      height: window.innerHeight,
    },

    scene: {
      preload: preload,
      create: create,
    },
  };

  // 플레이어 스프라이트 위치 조정
  const spritePosition = [
    [-offset, -offset],
    [offset, -offset],
    [-offset, offset],
    [offset, offset],
  ];

  // 에셋 불러오기
  function preload(this: Phaser.Scene) {
    // 보드관련 에셋
    this.load.image("sampleTile", "assets/Polygon3.png");
    this.load.image("sampleBuilding", "assets/building.png");
    this.load.image("sampleShop", "assets/shop.png");
    // 캐릭터 에셋
    for (let i = 0; i < 4; i++) {
      this.load.image(characterAssetNames[i], characterAssetLocation[i]);
    }
    // 화살표
    for (let i = 0; i < 75; i++) {
      this.load.image(`locationframe_${i}`, `assets/location/${i}.png`);
    }
    // 깃발
    for (let i = 0; i < 47; i++) {
      this.load.image(`flagframe_${i}`, `assets/flag/${i}.png`);
    }
  }

  function create(this: Phaser.Scene) {
    // 배경 생성
    const gradient = this.add.graphics();
    gradient.fillGradientStyle(0xadd8e6, 0xadd8e6, 0x87ceeb, 0x87ceeb, 1);
    gradient.fillRect(0, 0, config.scale.width, config.scale.height);

    // 보드 생성
    const tileSize = globalTileSize;
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (row === 0 || col === 0 || row === 8 || col === 8) {
          // Border tiles
          const x = (col - row) * (tileSize / 2) + config.scale.width / 2;
          const y = (col + row) * (tileSize / 4) + config.scale.height / 2;

          // 폴리곤
          const sampleTile = this.add
            .image(x, y, "sampleTile")
            .setOrigin(0.5, 4);
          sampleTile.setScale(0.8, 0.8);
          setGroundSprite((prevGroundSprite) => [
            ...prevGroundSprite,
            sampleTile,
          ]);
          // sampleTile.setTint(0xff0000);

          // 디폴트 건물 1
          const sampleBuilding = this.add
            .image(x, y, "sampleBuilding")
            .setOrigin(0.4, 8);
          sampleBuilding.setScale(0.2, 0.2);
          sampleBuilding.setAlpha(0);
          // 디폴트 건물 2
          const sampleBuilding2 = this.add
            .image(x, y, "sampleBuilding")
            .setOrigin(-0.45, 7.5);
          sampleBuilding2.setScale(0.2, 0.2);
          sampleBuilding2.setAlpha(0);
          // 디폴트 건물 3
          const sampleBuilding3 = this.add
            .image(x, y, "sampleBuilding")
            .setOrigin(1.2, 7.5);
          sampleBuilding3.setScale(0.2, 0.2);
          sampleBuilding3.setAlpha(0);
          // 스프라이트 리스트 추가
          setBuildingSprite((prevBuildingSprite) => [
            ...prevBuildingSprite,
            sampleBuilding,
            sampleBuilding2,
            sampleBuilding3,
          ]);
          // 건물 정보 리스트 추가
          setBuildingInfo((prevBuildingInfo) => [
            ...prevBuildingInfo,
            { player: null, sell: false, color: "default" },
            { player: null, sell: false, color: "default" },
            { player: null, sell: false, color: "default" },
          ]);
        }
      }
    }

    // 플레이어 위치 초기화
    for (let i = 0; i < pNum; i++) {
      const newPlayer = this.add.image(
        config.scale.width / 2 + spritePosition[i][0],
        config.scale.height / 2 + spritePosition[i][1] - offset2,
        characterAssetNames[i]
      );
      newPlayer.setScale(0.7, 0.7);
      // 위치조정
      setPlayerSprite((prevPlayerSprite) => [...prevPlayerSprite, newPlayer]);
      setPlayerPositions((prevPlayerPositions) => [
        ...prevPlayerPositions,
        {
          row: 0,
          col: 0,
          mx: spritePosition[i][0],
          my: spritePosition[i][1] - offset2,
        },
      ]);
    }
    // 기타 에셋 첨부
    /** 1. 턴 플레이어 화살표 */
    const frameNames = [];
    for (let i = 0; i < 75; i++) {
      frameNames.push({ key: `locationframe_${i}` });
    }
    // 애니메이션 생성
    this.anims.create({
      key: "locationAnimation", // 애니메이션 키(key)
      frames: frameNames, // 프레임들의 배열
      frameRate: 30, // 재생 속도 (프레임/초)
      repeat: -1, // -1로 설정하면 무한 반복
    });
    // 애니메이션을 스프라이트에 할당
    const arrow = this.add.sprite(
      config.scale.width / 2 - offset,
      config.scale.height / 2 - offset - offset2 - 35,
      "locationframe_0" // 처음 프레임을 설정
    );
    arrow.setScale(0.025, 0.025);
    arrow.setAlpha(0.8);
    arrow.anims.play("locationAnimation"); // 애니메이션 재생
    /** 2. 도착지 깃발 */
    const frameNamesFlag = [];
    for (let i = 0; i < 46; i++) {
      frameNamesFlag.push({ key: `flagframe_${i}` });
    }
    // 애니메이션 생성
    this.anims.create({
      key: "flagAnimation", // 애니메이션 키(key)
      frames: frameNamesFlag, // 프레임들의 배열
      frameRate: 80, // 재생 속도 (프레임/초)
      repeat: -1, // -1로 설정하면 무한 반복
    });
    // 애니메이션을 스프라이트에 할당
    const flag = this.add.sprite(
      config.scale.width / 2 + 10,
      config.scale.height / 2 - offset2 - 20,
      "flagframe_0" // 처음 프레임을 설정
    );
    flag.setScale(0.1, 0.1);
    flag.setAlpha(0);
    flag.anims.play("flagAnimation"); // 애니메이션 재생
    // 기타 에셋 추가
    setEtcSprite((prevEtcSprite) => [...prevEtcSprite, arrow]);
    setEtcSprite((prevEtcSprite) => [...prevEtcSprite, flag]);
  }

  /** 플레이어 이동 함수 */
  const movePlayer = (rowOffset: number, colOffset: number) => {
    // 기본인자
    const tileSize = globalTileSize;
    const newRow = PlayerPositions[turn].row + rowOffset;
    const newCol = PlayerPositions[turn].col + colOffset;

    if (newRow >= 0 && newRow < 9 && newCol >= 0 && newCol < 9) {
      PlayerPositions[turn].row = newRow;
      PlayerPositions[turn].col = newCol;

      const x = (newCol - newRow) * (tileSize / 2) + config.scale.width / 2;
      const y = (newCol + newRow) * (tileSize / 4) + config.scale.height / 2;

      playerSprite[turn].setPosition(
        x + PlayerPositions[turn].mx,
        y + PlayerPositions[turn].my
      );
      // 화살표 같이 이동
      etcSprite[0].setPosition(
        x + PlayerPositions[turn].mx,
        y + PlayerPositions[turn].my - 35
      );
      // 플레이어 좌우반전 구현
      if (newRow !== 0) {
        playerSprite[turn].setFlipX(true);
      }
      if (newCol === 0) {
        playerSprite[turn].setFlipX(false);
      }
    }
  };

  /** 플레이어 이동 방향 지정 */
  const setPlayerDirection = (
    totalDice: number,
    Dice1: number,
    Dice2: number
  ) => {
    // 더블 맥스 처리
    if (doubleCnt > 1) {
      if (Dice1 == Dice2) {
        alert("너무많은 더블... 감옥가자");
        // 캐릭터 감옥이동

        // 기본 정보 재세팅
        setDoubleCnt(0);
        setIsRolling(false);
        setTurn(turn + 1);
        return;
      }
    }
    for (let i = 0; i < totalDice; i++) {
      // eslint-disable-next-line no-loop-func
      setTimeout(() => {
        if (PlayerPositions[turn].row === 0 && PlayerPositions[turn].col < 8) {
          movePlayer(0, 1);
        } else if (
          PlayerPositions[turn].col === 8 &&
          PlayerPositions[turn].row < 8
        ) {
          movePlayer(1, 0);
        } else if (
          PlayerPositions[turn].row === 8 &&
          PlayerPositions[turn].col > 0
        ) {
          movePlayer(0, -1);
        } else if (
          PlayerPositions[turn].col === 0 &&
          PlayerPositions[turn].row > 0
        ) {
          movePlayer(-1, 0);
        }
        // 이동이 끝날때 옵션
        if (i === totalDice - 1) {
          // 이벤트가 끝날 때
          setTimeout(() => {
            setIsUserTurnVisible(true);
            setIsRolling(false);
            if (Dice1 !== Dice2) {
              // 더블이 아닐시
              setDoubleCnt(0);
            } else {
              // 더블일시
              etcSprite[1].setAlpha(0);
              setDoubleCnt(() => {
                return doubleCnt + 1;
              });
            }
          }, 500);
        }
      }, i * 200);
    }
  };

  /** 주사위 굴리기 함수 */
  const rollDice = async () => {
    if (isRolling) return; // 이미 주사위가 굴리는 중일 경우 무시
    setIsRolling(true); // 현재 주사위 상태 굴리는 중으로 설정

    // 주사위 값 결정
    const Dice1 = Math.floor(Math.random() * 6) + 1;
    const Dice2 = Math.floor(Math.random() * 6) + 1;
    // const Dice1 = 1;
    // const Dice2 = 2;

    setDiceActive(true);
    setDice1Value(Dice1);
    setDice2Value(Dice2);

    const totalDice = Dice1 + Dice2;

    // 도착지 깃발 위치 설정
    let goRow = PlayerPositions[turn].row;
    let goCol = PlayerPositions[turn].col;
    for (let i = 0; i < totalDice; i++) {
      if (goRow === 0 && goCol < 8) {
        goCol += 1;
      } else if (goCol === 8 && goRow < 8) {
        goRow += 1;
      } else if (goRow === 8 && goCol > 0) {
        goCol -= 1;
      } else if (goCol === 0 && goRow > 0) {
        goRow -= 1;
      }
    }
    await setTRow(goRow);
    await setTCol(goCol);
    const x = (goCol - goRow) * (globalTileSize / 2) + config.scale.width / 2;
    const y = (goCol + goRow) * (globalTileSize / 4) + config.scale.height / 2;
    etcSprite[1].setPosition(x + 10, y - 220);
    // 깃발 생성
    setTimeout(() => {
      etcSprite[1].setAlpha(1);
    }, 1500);
    // 주사위 수만큼 플레이어 이동
    setTimeout(() => {
      setPlayerDirection(totalDice, Dice1, Dice2);
      setDiceActive(false);
    }, 2000);
  };

  /**실수로 인한 창 닫기, 새로고침 방지 */
  const preventRefresh = (e: BeforeUnloadEvent) => {
    e.preventDefault();
    e.returnValue = ""; // 빈 문자열을 반환하여 경고 메시지를 표시
  };

  /**실수로 인한 뒤로가기 방지 */
  const preventGoBack = () => {
    history.pushState(null, "", location.href);
  };

  /** 기본 useEffect */
  useEffect(() => {
    // 유저정보 기본 세팅
    setPlayerData(playerDeafaults);
    console.log("플레이어 시작 정보입니다", playerDeafaults);
    if (game.current) {
      new Phaser.Game(config);
    }
    // 디폴트 기능 억제
    window.addEventListener("beforeunload", preventRefresh);
    history.pushState(null, "", location.href);
    window.addEventListener("popstate", preventGoBack);
    // 전체화면
  }, []);

  /** 화살표 동기화 */
  useEffect(() => {
    if (etcSprite[0] && turn !== pNum) {
      etcSprite[0].setAlpha(1);
      const goRow = PlayerPositions[turn].row;
      const goCol = PlayerPositions[turn].col;
      const x = (goCol - goRow) * (globalTileSize / 2) + config.scale.width / 2;
      const y =
        (goCol + goRow) * (globalTileSize / 4) + config.scale.height / 2;
      etcSprite[0].setPosition(
        x + PlayerPositions[turn].mx,
        y + PlayerPositions[turn].my - 35
      );
      // 깃발 숨기기
      etcSprite[1].setAlpha(0);
    } else if (etcSprite[0] && turn === pNum) {
      etcSprite[0].setAlpha(0);
    }
  }, [turn]);

  /** 땅 정보 변경시 */
  useEffect(() => {
    if (groundChange[0].player !== null && groundChange[0].player !== 6) {
      groundSprite[groundChange[0].index].setTint(
        colorPaletteTint[groundChange[0].player]
      );
    } else if (groundChange[0].player === 6) {
      // 판매요청시
      groundSprite[groundChange[0].index].clearTint();
    }
  }, [groundChange]);

  /** 건물 정보 변경시 */
  useEffect(() => {
    if (buildingChange[0].player !== null && buildingChange[0].player !== 6) {
      // 색변경
      buildingSprite[buildingChange[0].index + buildingChange[0].point].setTint(
        colorPaletteTint[buildingChange[0].player]
      );
      // 투명도 조정
      buildingSprite[
        buildingChange[0].index + buildingChange[0].point
      ].setAlpha(1);
    } else if (buildingChange[0].player === 6) {
      // 판매요청시
      buildingSprite[buildingChange[0].index].clearTint();
      buildingSprite[
        buildingChange[0].index + buildingChange[0].point
      ].setAlpha(0);
    }
  }, [buildingChange]);

  /** 유저 턴 구현 */

  /** 공통 턴 구현 */
  useEffect(() => {
    if (turn === pNum) {
      console.log("공통턴 띄워라");
      setIsCommonTurnVisible(true);
    }
  }, [turn]);

  return (
    <CursorifyProvider cursor={<EmojiCursor />} delay={1} opacity={1}>
      <div>
        <GameOption />
        <UserInfo />
        {isUserTurnVisible && <UserTurn />}
        {isCommonTurnVisible && <CommonTurn />}
        {!isUserTurnVisible && !isCommonTurnVisible && (
          <div className="diceContainer">
            <DiceRoll />
            {!isRolling && (
              <button
                id="move-button"
                className="rollDiceBtn"
                onClick={rollDice}
                style={{ cursor: "pointer" }}
              >
                주사위 굴리기
              </button>
            )}
          </div>
        )}
        <div ref={game} className="GameScreen" id="gameScreen" />
      </div>
    </CursorifyProvider>
  );
}
