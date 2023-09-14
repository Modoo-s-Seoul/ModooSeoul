import { useEffect, useState, useRef } from "react";
import Phaser from "phaser";
// import axios from "axios";
// import SockJS from "sockjs-client";
// import StompJs from "@stomp/stompjs";
import UserInfo from "./UserInfo";
import UserTurn from "./UserTurn";
import DiceRoll from "./DiceRoll";
import "./Board.css";
import { playerPosition, playerInfo } from "../interface/ingame";
import { useRecoilState, useRecoilValue } from "recoil";
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
} from "../data/IngameData";
import GameOption from "../components/Base/GameOption";

export default function Board() {
  const game = useRef<HTMLDivElement | null>(null);

  /** 글로벌 변수들 */
  const assetNames = ["Pink", "Blue", "Green", "Yellow"];
  const colorPalette = ["dd9090", "909add", "90dd9a", "dddc90"];
  const offset = 10; // 플레이어 위치 조정
  const offset2 = 220; // y축 위치조정용 변수
  const globalTileSize = 121; // 타일 크기및 간격
  /** 초기 플레이어 정보 */
  const [doubleCnt, setDoubleCnt] = useRecoilState(doubleCntState); // 더블 카운트
  const pNum = useRecoilValue(pNumState); // 플레이어 수
  const firstMoneyValue = useRecoilValue(first_money); // 초기 자본
  const playerDeafaults: playerInfo[] = [];
  const [playerData, setPlayerData] = useRecoilState(playerDataState); // 플레이어 현재 정보
  for (let i = 1; i <= pNum; i++) {
    playerDeafaults.push({
      name: `Player ${i}`,
      money: firstMoneyValue,
      color: colorPalette[i - 1],
    });
  }

  const [turn, setTurn] = useRecoilState(turnState); // 현재 플레이 순서
  const [, setDice1Value] = useRecoilState(dice1State); // 첫번째 주사위 값
  const [, setDice2Value] = useRecoilState(dice2State); // 두번째 주사위 값
  const [, setDiceActive] = useRecoilState(diceActiveState); // 주사위 상태
  const [isRolling, setIsRolling] = useRecoilState(isRollingState); // 주사위 굴리기 버튼 활성화 상태
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [playerSprite, setPlayerSprite] = useState<Phaser.GameObjects.Image[]>(
    []
  ); //플레이어 스프라이트
  const [etcSprite, setEtcSprite] = useState<Phaser.GameObjects.Image[]>([]); //기타 스프라이트
  const [playerPositions, setPlayerPositions] = useState<playerPosition[]>([]); // 플레이어 위치
  const [isUserTurnVisible, setIsUserTurnVisible] = useRecoilState(
    isUserTurnVisibleState
  ); // 플레이어 턴 수행 가능 여부

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
    this.load.image("Blue", "assets/alienBlue.png");
    this.load.image("Green", "assets/alienGreen.png");
    this.load.image("Pink", "assets/alienPink.png");
    this.load.image("Yellow", "assets/alienYellow.png");
    // 기타 에셋
    this.load.image("flag", "assets/gameFlag.png");
    this.load.image("arrow", "assets/loctionpin.gif");
    // 화살표
    for (let i = 0; i < 75; i++) {
      this.load.image(`locationframe_${i}`, `assets/location/${i}.png`);
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

          // 샵 폴리곤용
          const sampleBuilding = this.add
            .image(x, y, "sampleBuilding")
            .setOrigin(0.5, 8);
          sampleBuilding.setScale(0.2, 0.2);
          sampleBuilding.setAlpha(0.8);

          // 빌딩 폴리곤용
          const sampleShop = this.add
            .image(x, y, "sampleShop")
            .setOrigin(1.1, 9.2);
          sampleShop.setScale(0.3, 0.3);
          sampleShop.setAlpha(0.8);
        }
      }
    }

    // 플레이어 위치 초기화
    for (let i = 0; i < pNum; i++) {
      const newPlayer = this.add.image(
        config.scale.width / 2 + spritePosition[i][0],
        config.scale.height / 2 + spritePosition[i][1] - offset2,
        assetNames[i]
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
    const flag = this.add.image(
      config.scale.width / 2 + 10,
      config.scale.height / 2 - offset2,
      "flag"
    );
    flag.setScale(0.05, 0.05);
    flag.setAlpha(0);
    // 기타 에셋 추가
    setEtcSprite((prevEtcSprite) => [...prevEtcSprite, arrow]);
    setEtcSprite((prevEtcSprite) => [...prevEtcSprite, flag]);
  }

  // 플레이어 이동 함수
  const movePlayer = (rowOffset: number, colOffset: number) => {
    const tileSize = globalTileSize;
    const newRow = playerPositions[turn].row + rowOffset;
    const newCol = playerPositions[turn].col + colOffset;

    if (newRow >= 0 && newRow < 9 && newCol >= 0 && newCol < 9) {
      playerPositions[turn].row = newRow;
      playerPositions[turn].col = newCol;

      const x = (newCol - newRow) * (tileSize / 2) + config.scale.width / 2;
      const y = (newCol + newRow) * (tileSize / 4) + config.scale.height / 2;

      playerSprite[turn].setPosition(
        x + playerPositions[turn].mx,
        y + playerPositions[turn].my
      );
      // 화살표 같이 이동
      etcSprite[0].setPosition(
        x + playerPositions[turn].mx,
        y + playerPositions[turn].my - 35
      );
    }
  };

  // 플레이어 이동 방향 지정
  const setPlayerDirection = (
    totalDice: number,
    Dice1: number,
    Dice2: number
  ) => {
    // 더블 맥스 처리
    if (doubleCnt > 2) {
      if (Dice1 == Dice2) {
        alert("너무많은 더블... 감옥가자");
        console.log("너무많은 더블... 감옥가자");
        setDoubleCnt(0);
        setIsRolling(false);
        setTurn((turn + 1) % pNum);
        return;
      }
    }
    for (let i = 0; i < totalDice; i++) {
      // eslint-disable-next-line no-loop-func
      setTimeout(() => {
        if (playerPositions[turn].row === 0 && playerPositions[turn].col < 8) {
          movePlayer(0, 1);
        } else if (
          playerPositions[turn].col === 8 &&
          playerPositions[turn].row < 8
        ) {
          movePlayer(1, 0);
        } else if (
          playerPositions[turn].row === 8 &&
          playerPositions[turn].col > 0
        ) {
          movePlayer(0, -1);
        } else if (
          playerPositions[turn].col === 0 &&
          playerPositions[turn].row > 0
        ) {
          movePlayer(-1, 0);
        }
        // 이동이 끝날때 옵션
        if (i === totalDice - 1) {
          // 이벤트가 끝날 때
          setTimeout(() => {
            setIsUserTurnVisible(true);
            setIsRolling(false);
            console.log("자..", doubleCnt);
            if (Dice1 !== Dice2) {
              // 더블이 아닐시
              setTurn((turn + 1) % pNum);
              setDoubleCnt(0);
            } else {
              // 더블일시
              console.log("더블 한번더", doubleCnt);
              setDoubleCnt(() => {
                return doubleCnt + 1;
              });
            }
          }, 500);
        }
      }, i * 200);
    }
  };

  const rollDice = () => {
    if (isRolling) return; // 이미 주사위가 굴리는 중일 경우 무시
    setIsRolling(true); // 현재 주사위 상태 굴리는 중으로 설정

    // 주사위 값 결정
    const Dice1 = Math.floor(Math.random() * 6) + 1;
    const Dice2 = Math.floor(Math.random() * 6) + 1;
    // const Dice1 = 2;
    // const Dice2 = 2;

    setDiceActive(true);
    setDice1Value(Dice1);
    setDice2Value(Dice2);

    const totalDice = Dice1 + Dice2;

    // 도착지 깃발 위치 설정
    let goRow = playerPositions[turn].row;
    let goCol = playerPositions[turn].col;
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

  // useEffect
  useEffect(() => {
    setPlayerData(playerDeafaults);
    console.log(playerData);
    if (game.current) {
      new Phaser.Game(config);
    }
    window.addEventListener("beforeunload", preventRefresh);

    history.pushState(null, "", location.href);
    window.addEventListener("popstate", preventGoBack);
  }, []);
  // 화살표 동기화
  useEffect(() => {
    console.log("턴바뀜");
    if (etcSprite[0]) {
      const goRow = playerPositions[turn].row;
      const goCol = playerPositions[turn].col;
      const x = (goCol - goRow) * (globalTileSize / 2) + config.scale.width / 2;
      const y =
        (goCol + goRow) * (globalTileSize / 4) + config.scale.height / 2;
      etcSprite[0].setPosition(
        x + playerPositions[turn].mx,
        y + playerPositions[turn].my - 35
      );
      // 깃발 숨기기
      etcSprite[1].setAlpha(0);
    }
  }, [turn]);
  return (
    <div>
      <GameOption />
      <UserInfo />
      {isUserTurnVisible && <UserTurn position={playerPositions} />}
      {!isUserTurnVisible && (
        <div className="diceContainer">
          <DiceRoll />
          {!isRolling && (
            <button id="move-button" className="rollDiceBtn" onClick={rollDice}>
              주사위 굴리기
            </button>
          )}
        </div>
      )}
      <div ref={game} className="GameScreen" id="gameScreen" />
    </div>
  );
}
