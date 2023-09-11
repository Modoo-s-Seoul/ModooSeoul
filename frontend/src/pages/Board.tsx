import { useEffect, useState, useRef } from "react";
import Phaser from "phaser";
// import axios from "axios";
// import SockJS from "sockjs-client";
// import StompJs from "@stomp/stompjs";
import UserInfo from "./UserInfo";
import UserTurn from "./UserTurn";
import DiceRoll from "./DiceRoll";
import "./Board.css";

export interface playerPosition {
  row: number;
  col: number;
  mx: number;
  my: number;
}

export interface playerInfo {
  name: string;
  money: number;
  color: string;
}

export default function Board() {
  const game = useRef<HTMLDivElement | null>(null);

  /** 플레이어 수*/
  const pNum = 4;
  /** 플레이어 에셋*/
  const assetNames = ["Blue", "Green", "Pink", "Yellow"];
  const colorPalette = ["dd9090", "909add", "90dd9a", "dddc90"];
  /** 시작 자본금*/
  const first_money = 10000000;
  /** 초기 플레이어 정보 */
  const playerDeafaults: playerInfo[] = [];

  for (let i = 1; i <= pNum; i++) {
    playerDeafaults.push({
      name: `Player ${i}`,
      money: first_money,
      color: colorPalette[i - 1],
    });
  }

  const [turn, setTurn] = useState(0); // 현재 플레이 순서
  const [dice1, setDice1Value] = useState(0); // 첫번째 주사위 값
  const [dice2, setDice2Value] = useState(0); // 두번째 주사위 값
  const [diceActive, setDiceActive] = useState(false); // 주사위 상태
  const [isRolling, setIsRolling] = useState(false); // 주사위 굴리기 버튼 활성화 상태
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [playerData, setPlayerData] = useState(playerDeafaults); // 플레이어 현재 정보
  const [playerSprite, setPlayerSprite] = useState<Phaser.GameObjects.Image[]>(
    []
  ); //플레이어 스프라이트
  const [playerPositions, setPlayerPositions] = useState<playerPosition[]>([]); // 플레이어 위치
  const [isUserTurnVisible, setIsUserTurnVisible] = useState(false); // 플레이어 턴 수행 가능 여부

  const config = {
    type: Phaser.AUTO,

    // transparent: true, //배경 투명하게 설정

    // 캔버스 크기 창 크기에 따라 자동 맞춤되는 옵션
    scale: {
      mode: Phaser.Scale.FIT,
      width: window.innerWidth,
      height: window.innerHeight * 1,
    },

    scene: {
      preload: preload,
      create: create,
    },
  };

  // Game Settings
  const setPosition = [
    [-6, -6],
    [6, -6],
    [-6, 6],
    [6, 6],
  ];

  // 에셋 불러오기
  function preload(this: Phaser.Scene) {
    // this.load.image("sampleTile", "assets/Polygon3.png"); // Load your tile image
    this.load.image("sampleTile", "assets/green_tile.png"); // Load your tile image
    this.load.image("sampleBuilding", "assets/building.png"); // Load your building image
    this.load.image("sampleShop", "assets/shop.png"); // Load your shop image
    this.load.image("Blue", "assets/alienBlue.png");
    this.load.image("Green", "assets/alienGreen.png");
    this.load.image("Pink", "assets/alienPink.png");
    this.load.image("Yellow", "assets/alienYellow.png");
  }

  // 보드 생성
  function create(this: Phaser.Scene) {
    const tileSize = 81; // Assuming each tile is 64x64 pixels
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (row === 0 || col === 0 || row === 8 || col === 8) {
          // Border tiles
          const x = (col - row) * (tileSize / 2) + config.scale.width / 2;
          const y = (col + row) * (tileSize / 4) + config.scale.height / 2;

          // 타일
          const sampleTile = this.add
            .image(x, y, "sampleTile")
            .setOrigin(0.5, 1.1);
          sampleTile.setScale(1.2, 1.2); // scaleX와 scaleY를 원하는 크기로 설정하세요.

          // const sampleTile = this.add
          //   .image(x, y, "sampleTile")
          //   .setOrigin(0.5, 3);
          // sampleTile.setScale(0.5, 0.5); // scaleX와 scaleY를 원하는 크기로 설정하세요.

          // 샵
          const sampleBuilding = this.add
            .image(x, y, "sampleBuilding")
            .setOrigin(0.8, 5.8);
          sampleBuilding.setScale(0.125, 0.125); // scaleX와 scaleY를 원하는 크기로 설정하세요.

          // 빌딩
          const sampleShop = this.add
            .image(x, y, "sampleShop")
            .setOrigin(1.1, 6.2);
          sampleShop.setScale(0.2, 0.2); // scaleX와 scaleY를 원하는 크기로 설정하세요.
        }
      }
    }

    // 플레이어 위치 초기화
    for (let i = 0; i < pNum; i++) {
      // const player = this.add.circle(
      //   game.config.width / 2 + setPosition[i][0],
      //   game.config.height / 2 + setPosition[i][1] - 100,
      //   tileSize / 10,
      //   parseInt(colorPalette[i], 16)
      // );

      const newPlayer = this.add.image(
        config.scale.width / 2 + setPosition[i][0],
        config.scale.height / 2 + setPosition[i][1] - 100,
        assetNames[i]
      );

      newPlayer.setScale(0.5, 0.5);

      setPlayerSprite((prevPlayerSprite) => [...prevPlayerSprite, newPlayer]);

      setPlayerPositions((prevPlayerPositions) => [
        ...prevPlayerPositions,
        {
          row: 0,
          col: 0,
          mx: setPosition[i][0],
          my: setPosition[i][1] - 100,
        },
      ]);
    }
  }

  // 플레이어 이동
  const movePlayer = (rowOffset: number, colOffset: number) => {
    const tileSize = 81;
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
    }
  };

  // 플레이어 이동 방향 지정
  const setPlayerDirection = (totalDice: number) => {
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
          // 이벤트가 끝날 때 버튼 다시 활성화
          setTimeout(() => {
            setIsUserTurnVisible(true);
            setIsRolling(false);
            setTurn((turn + 1) % pNum);
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

    setDiceActive(true);
    setDice1Value(Dice1);
    setDice2Value(Dice2);

    const totalDice = Dice1 + Dice2;

    // 주사위 수만큼 플레이어 이동
    setTimeout(() => {
      setPlayerDirection(totalDice);
      setDiceActive(false);
    }, 2000);

    console.log(turn, "의 턴입니다.");
  };

  useEffect(() => {
    if (game.current) {
      new Phaser.Game(config);
    }
  }, []);

  return (
    <div>
      <UserInfo playerData={playerData} turn={turn} />
      {isUserTurnVisible && (
        <UserTurn
          position={playerPositions}
          turn={turn}
          close={setIsUserTurnVisible}
          pNum={pNum}
        />
      )}
      <div className="diceContainer">
        <DiceRoll diceActive={diceActive} dice1={dice1} dice2={dice2} />
        <button id="move-button" className="rollDiceBtn" onClick={rollDice}>
          주사위 굴리기
        </button>
      </div>
      <div ref={game} className="GameScreen" />
    </div>
  );
}
