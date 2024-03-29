import { useEffect, useState, useRef } from "react";
// 게임관련
import Phaser from "phaser";
import GameOption from "../components/Base/GameOption";

// 웹소켓
import IngameWebSocket from "../components/IngameWs/IngameWebSocket";
import { sendWsMessage } from "../components/IngameWs/IngameSendFunction";
import { useSocket } from "./SocketContext";
import { useLocation } from "react-router-dom";
// 컴포넌트 로드
import UserInfo from "./UserInfo";
import UserTurn from "./UserTurn";
import CommonTurn from "../components/CommonTurn/CommonTurn";
import DiceRoll from "./DiceRoll";
import IngameModal from "../components/Base/IngameModal";
import News from "../components/CommonTurn/News/News";
import NewsCheck from "../components/CommonTurn/News/NewsCheck";
import Loading from "../components/Base/Loading";
import NotMyTurn from "../components/Base/NotMyTurn";
import RoundInfo from "../components/Base/RoundInfo";
import OilSelectBtn from "../components/Turn/OilSelectBtn";
import SubwaySelectBtn from "../components/Turn/SubwaySelectBtn";
import StartSelectBtn from "../components/Turn/StartSelectBtn";
import StockCheck from "../components/CommonTurn/Stock/StockCheck";
import EvaderNotification from "../components/CommonTurn/EvaderNotification";
// css 로드
import "./Board.css";
// 데이터로드
import { PlayerPosition } from "../interface/ingame";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  pNumState,
  turnState,
  dice1State,
  dice2State,
  diceActiveState,
  playerInfoState,
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
  isLoadingVisibleState,
  isNewsVisibleState,
  isOilActiveState,
  matchPosition,
  oilLandState,
  isSubwayState,
  isSubwayActiveState,
  isStartActiveState,
  startMsgNumState,
  srowState,
  scolState,
  isPlayerMoveState,
  displayPlayerDataState,
  isCommonGroundSellActiveState,
  whoAreYouState,
  groundMsgNumState,
  isGameStartVisibleState,
  isYourTurnVisibleState,
  oilStartState,
  isGameEndVisibleState,
  isRankingVisibleState,
  isNotificationVisible,
  SmallMonenyChangeState,
} from "../data/IngameData";
import { musicState } from "../data/CommonData";
import { boardDataState } from "../data/BoardData";
import GroundSelectBtn from "../components/CommonTurn/GroundSelectBtn";
import GameStart from "../components/Base/intro/GameStart";
import YourTurn from "../components/Base/intro/YourTurn";
import GameEnd from "../components/Base/outro/GameEnd";
import Ranking from "../components/Base/outro/Ranking";

////////  게임 보드 /////////
export default function Board() {
  const game = useRef<HTMLDivElement | null>(null);

  // 글로벌 변수들
  // const colorPalette = ["dd9090", "909add", "90dd9a", "dddc90"];
  const colorPaletteTint = [0xdd9090, 0x909add, 0x90dd9a, 0xdddc90];
  colorPaletteTint;
  const offset = 10; // 플레이어 위치 조정
  const offset2 = 220; // y축 위치조정용 변수
  const globalTileSize = 144; // 타일 크기및 간격

  /**캐릭터 에셋 이름 */
  const characterAssetNames = ["Pink", "Blue", "Green", "Yellow"];

  /**캐릭터 에셋 주소 */
  const characterAssetLocation = [
    "assets/alienPink.png",
    "assets/alienBlue.png",
    "assets/alienGreen.png",
    "assets/alienYellow.png",
  ];
  // 개발자용
  // const [devDice1, setDevDice1] = useState<number>(0);
  // const [devDice2, setDevDice2] = useState<number>(0);

  // 초기 정보
  const [doubleCnt, setDoubleCnt] = useRecoilState(doubleCntState); // 더블 카운트
  const pNum = useRecoilValue(pNumState); // 플레이어 수
  const groundChange = useRecoilValue(groundChangeState); // 땅 변동
  const buildingChange = useRecoilValue(buildingChangeState); // 건물 변동
  const subwayChange = useRecoilValue(isSubwayState); // 지하철 변동
  const [playerInfo, setPlayerInfo] = useRecoilState(playerInfoState); // 플레이어 고유 정보
  const [playerData] = useRecoilState(playerDataState); // 플레이어 인게임 정보
  const setDisplayPlayerData = useSetRecoilState(displayPlayerDataState); // 출력용 플레이어 인게임 정보
  const [turn, setTurn] = useRecoilState(turnState); // 현재 플레이 순서

  const setIsPlayerMove = useSetRecoilState(isPlayerMoveState);
  const [tRow, setTRow] = useRecoilState(trowState); // 현재 턴 row
  const [tCol, setTCol] = useRecoilState(tcolState); // 현재 턴 col
  const [sRow, setSRow] = useRecoilState(srowState); // 시작점 선택 row
  const [sCol, setSCol] = useRecoilState(scolState); // 시작점 선택 col
  const [dice1] = useRecoilState(dice1State); // 첫번째 주사위 값
  const [dice2] = useRecoilState(dice2State); // 두번째 주사위 값
  const [diceActive, setDiceActive] = useRecoilState(diceActiveState); // 주사위 상태
  const [isRolling, setIsRolling] = useRecoilState(isRollingState); // 주사위 굴리기 버튼 활성화 상태
  const [isUserTurnVisible, setIsUserTurnVisible] = useRecoilState(
    isUserTurnVisibleState
  ); // 플레이어 턴 수행 가능 여부
  const [isCommonTurnVisible, setIsCommonTurnVisible] = useRecoilState(
    isCommonTurnVisibleState
  ); // 공통 턴 수행 가능 여부
  const [loadingVisible, setLoadingVisible] = useRecoilState(
    isLoadingVisibleState
  ); // 로딩 페이지 토글
  // 기본 인자
  const [isGameStartVisible, setIsGameStartVisible] = useRecoilState(
    isGameStartVisibleState
  ); // 1. 게임스타트 인자
  const isYourTurnVisible = useRecoilValue(isYourTurnVisibleState); // 2. 순서정하기
  const [isOilActive, setIsOilActive] = useRecoilState(isOilActiveState); // 오일 토글
  const [oilLand, setOilLand] = useRecoilState(oilLandState); // 오일 위치
  const [isSubwayActive, setIsSubwayActive] =
    useRecoilState(isSubwayActiveState); // 지하철 토글
  const [isSubway, setIsSubway] = useRecoilState(isSubwayState); // 지하철 변동
  const [isStartActive, setIsStartActive] = useRecoilState(isStartActiveState); // 시작점 토글
  const [startNum, setStartNum] = useRecoilState(startMsgNumState); // 시작점 선택 순서
  const [groundMsgNum, setGroundMsgNum] = useRecoilState(groundMsgNumState); // 공통턴 선택 순서
  const [isCommonGroundSellActive, setIsCGSA] = useRecoilState(
    isCommonGroundSellActiveState
  ); // 공통턴 땅판매 토글
  const oilStart = useRecoilValue(oilStartState); // 오일 시작

  const notificationVisible = useRecoilValue(isNotificationVisible);

  // 데이터 보관
  const [boardData, setBoardData] = useRecoilState(boardDataState); // 보드데이터
  const matchPos = useRecoilValue(matchPosition); // 매칭데이터
  const [backgroundSprite, setBackgroundSprite] = useState<
    Phaser.GameObjects.Graphics[]
  >([]); //기타 스프라이트
  const [playerSprite, setPlayerSprite] = useState<Phaser.GameObjects.Image[]>(
    []
  ); //플레이어 스프라이트
  const [etcSprite, setEtcSprite] = useState<Phaser.GameObjects.Image[]>([]); //기타 스프라이트
  const [groundSprite, setGroundSprite] = useState<Phaser.GameObjects.Image[]>(
    []
  ); //땅 스프라이트
  const [buildingSprite, setBuildingSprite] = useState<
    Phaser.GameObjects.Image[]
  >([]); //건물 스프라이트
  buildingSprite;
  const [playerPositions, setPlayerPositions] = useState<PlayerPosition[]>([]); // 플레이어 위치
  const [builingData, setBuildingInfo] = useRecoilState(builingInfoState); // 건물 데이터
  const [smallMoneryChange, setSmallMoneyChange] = useRecoilState(
    SmallMonenyChangeState
  );

  // 토글
  const [isGameEndVisible] = useRecoilState(isGameEndVisibleState); // 1. 게임 종료 인자
  const [isRankingvisible] = useRecoilState(isRankingVisibleState); // 랭킹 컴포넌트 토글

  // 플레이어 개인정보
  const whoAreYou = useRecoilValue(whoAreYouState); // 본인의 턴

  // 음악
  const audio = useRecoilValue(musicState);
  const [isNewsVisible, setIsNewsVisible] = useRecoilState(isNewsVisibleState); // 공통 턴 수행 가능 여부

  // 웹소켓 기본인자
  const socketClient = useSocket();
  const weblocation = useLocation();

  /** 인게임 설정 */
  const config = {
    type: Phaser.AUTO,
    parent: "gameScreen",
    transparent: true, //배경 투명하게 설정

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

  /** 플레이어 스프라이트 위치 조정 변수 */
  const spritePosition = [
    [-offset, -offset],
    [offset, -offset],
    [-offset, offset],
    [offset, offset],
  ];

  /** phaser 에셋 불러오기 */
  function preload(this: Phaser.Scene) {
    // 보드 에셋
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (row === 0 || col === 0 || row === 8 || col === 8) {
          this.load.image(
            `boardframe_${row}-${col}`,
            `assets/board/${row}-${col}.png`
          );
        }
      }
    }
    // 건물 에셋
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
    // 오일 이펙트
    for (let i = 0; i < 25; i++) {
      this.load.image(`oilframe_${i}`, `assets/oil/${i}.png`);
    }
    // 음악
    this.load.audio("music", ["music.mp3"]);
  }

  /** phaser 에셋 생성 */
  function create(this: Phaser.Scene) {
    // 배경 생성
    const gradient = this.add.graphics();
    gradient.fillGradientStyle(0xadd8e6, 0xadd8e6, 0x87ceeb, 0x87ceeb, 1);
    gradient.fillRect(0, 0, config.scale.width, config.scale.height);
    setBackgroundSprite((prevBackgroundSprite) => [
      ...prevBackgroundSprite,
      gradient,
    ]);
    gradient.setAlpha(0.5);

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
            .image(x, y, `boardframe_${row}-${col}`)
            .setOrigin(0.5, 3.35);
          sampleTile.setScale(1, 1);
          setGroundSprite((prevGroundSprite) => [
            ...prevGroundSprite,
            sampleTile,
          ]);

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
            sampleBuilding3,
            sampleBuilding,
            sampleBuilding2,
          ]);
          // 건물 정보 리스트 추가
          setBuildingInfo((prevBuildingInfo) => [
            ...prevBuildingInfo,
            { player: null, sell: false, industry: -1 },
            { player: null, sell: false, industry: -1 },
            { player: null, sell: false, industry: -1 },
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
      newPlayer.setScale(0.8, 0.8);
      // 위치조정
      setPlayerSprite((prevPlayerSprite) => [...prevPlayerSprite, newPlayer]);
      setPlayerPositions((prevPlayerPositions) => [
        ...prevPlayerPositions,
        {
          row: 0,
          col: 0,
          mx: spritePosition[i][0],
          my: spritePosition[i][1] - offset2,
          subway: false,
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
    /** 3. 오일 이펙트 */
    const frameNamesOil = [];
    for (let i = 0; i < 25; i++) {
      frameNamesOil.push({ key: `oilframe_${i}` });
    }
    // 애니메이션 생성
    this.anims.create({
      key: "oilAnimation", // 애니메이션 키(key)
      frames: frameNamesOil, // 프레임들의 배열
      frameRate: 25, // 재생 속도 (프레임/초)
      repeat: -1, // -1로 설정하면 무한 반복
    });
    // 애니메이션을 스프라이트에 할당
    const oileffect = this.add.sprite(
      config.scale.width / 2,
      config.scale.height / 2 - offset2 - 10,
      "oilframe_0" // 처음 프레임을 설정
    );
    oileffect.setScale(0.5, 0.5);
    oileffect.setAlpha(0);
    oileffect.anims.play("oilAnimation"); // 애니메이션 재생

    // 기타 에셋 추가
    setEtcSprite((prevEtcSprite) => [...prevEtcSprite, arrow]);
    setEtcSprite((prevEtcSprite) => [...prevEtcSprite, flag]);
    setEtcSprite((prevEtcSprite) => [...prevEtcSprite, oileffect]);

    // 생성 완료후 - 로딩, 게임스타트
    setLoadingVisible(false);
    setIsGameStartVisible(true);
  }

  /** 플레이어 이동 함수 */
  const movePlayer = (rowOffset: number, colOffset: number) => {
    // 기본인자
    const tileSize = globalTileSize;
    const newRow = playerPositions[turn].row + rowOffset;
    const newCol = playerPositions[turn].col + colOffset;
    // 월급흭득
    if (newRow == 0 && newCol == 0) {
      const newSmallMoneyStatus = [...smallMoneryChange];
      newSmallMoneyStatus[turn] = { player: true };
      setSmallMoneyChange(newSmallMoneyStatus);
      // 돈정보 디스플레이 업데이트
      setDisplayPlayerData(playerData);
    }

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
    // 더블 맥스가 아닐시 정상 이동
    for (let i = 0; i < totalDice; i++) {
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
            etcSprite[1].setAlpha(0);
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
  /** 지하철용 이동 함수 */
  const movePlayerSubway = (totalDice: number) => {
    // 주사위 굴리고 싶을시
    if (totalDice === 0) {
      etcSprite[1].setAlpha(0);
      playerPositions[turn].subway = false;
      sendWsMessage(socketClient, playerInfo.playerId, "send/roll");
    }
    // 클릭 이동시
    for (let i = 0; i < totalDice; i++) {
      setIsPlayerMove(true);
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
        if (i === totalDice - 1) {
          etcSprite[1].setAlpha(0);
          playerPositions[turn].subway = false;
          // 이벤트가 끝날 때
          setTimeout(() => {
            setTRow(playerPositions[turn].row);
            setTCol(playerPositions[turn].col);
            setIsUserTurnVisible(true);
            setIsPlayerMove(false);
          }, 500);
        }
      }, i * 100);
    }
  };

  /** 주사위 굴리기 함수 */
  const rollDice = (): void => {
    if (turn >= pNum) return; // 턴이 아닐시 주사위 굴리기 무시
    if (isRolling) return; // 이미 주사위가 굴리는 중일 경우 무시
    setIsRolling(true); // 현재 주사위 상태 굴리는 중으로 설정
    // (실제구현) 주사위값 변경 요청
    sendWsMessage(socketClient, playerInfo.playerId, "send/timer-cancel");
    if (socketClient) {
      sendWsMessage(socketClient, playerInfo.playerId, "send/roll");
    }
  };

  /** 주사위 굴리기 함수(개발자용) */
  // const rollDiceDev = () => {
  //   if (turn >= pNum) return; // 턴이 아닐시 주사위 굴리기 무시
  //   if (isRolling) return; // 이미 주사위가 굴리는 중일 경우 무시
  //   setIsRolling(true); // 현재 주사위 상태 굴리는 중으로 설정
  //   // (실제구현) 주사위값 변경 요청
  //   if (socketClient) {
  //     sendWsMessage(
  //       socketClient,
  //       playerInfo.playerId,
  //       "send/roll-test",
  //       `{"dice1":${devDice1},"dice2":${devDice2}}`
  //     );
  //   }
  //   // setDiceActive(true);
  //   // setDice1Value(Number(devDice1));
  //   // setDice2Value(Number(devDice2));
  // };

  /**실수로 인한 창 닫기, 새로고침 방지 */
  const preventRefresh = (e: BeforeUnloadEvent) => {
    e.preventDefault();
    e.returnValue = ""; // 빈 문자열을 반환하여 경고 메시지를 표시
  };

  /**실수로 인한 뒤로가기 방지 */
  const preventGoBack = () => {
    history.pushState(null, "", location.href);
  };

  ///////////// 인게임 useEffect ///////////////
  /** 기본 useEffect */
  useEffect(() => {
    // 유저정보 기본 세팅
    let gameId = "test";
    let playerId = "test";
    let nickname = "test";
    if (weblocation.state) {
      console.log("전달받은 아이디 있음");
      gameId = weblocation.state.gameId;
      playerId = weblocation.state.playerId;
      nickname = weblocation.state.nickname;
      window.localStorage.setItem("gameId", gameId);
      window.localStorage.setItem("playerId", playerId);
      window.localStorage.setItem("nickname", nickname);
      const newPlayerInfo = { ...playerInfo };
      newPlayerInfo.gameId = gameId;
      newPlayerInfo.playerId = playerId;
      newPlayerInfo.nickname = nickname;
      setPlayerInfo(newPlayerInfo);
    } else {
      console.log("전달받은 아이디 없음");
      const getGameid = window.localStorage.getItem("gameId");
      const getPlayerid = window.localStorage.getItem("playerId");
      const getNickname = window.localStorage.getItem("nickname");
      if (getGameid != null) {
        gameId = getGameid;
      }
      if (getPlayerid) {
        playerId = getPlayerid;
      }
      if (getNickname) {
        nickname = getNickname;
      }
      const newPlayerInfo = { ...playerInfo };
      newPlayerInfo.gameId = gameId;
      newPlayerInfo.playerId = playerId;
      newPlayerInfo.nickname = nickname;
      setPlayerInfo(newPlayerInfo);
    }
    console.log("---------------", gameId, playerId);
    setDisplayPlayerData(playerData);

    sendWsMessage(socketClient, gameId, "send/players-info");

    // 라운드 세팅
    // sendWsMessage(socketClient, gameId, "send/round-start");

    console.log("플레이어 고유 정보입니다", playerInfo);
    console.log("플레이어 시작 정보입니다", playerData);

    // 보드 세팅
    if (game.current) {
      new Phaser.Game(config);
    }

    // 새로고침, 뒤로가기 기능 억제
    window.addEventListener("beforeunload", preventRefresh);
    history.pushState(null, "", location.href);
    window.addEventListener("popstate", preventGoBack);

    // 전체화면

    // 배경음악 재생
    audio.play();
    // 뉴스턴 맞추기
    setTurn(pNum + 1);
  }, []);

  /** 주사위 시간제한 */
  useEffect(() => {
    // 플레이어 턴일시
    if (turn < pNum) {
      const rollTimeout = setTimeout(() => {
        // 가구현
        // setTurn(turn + 1);
        // 실제 구현 - 턴 변경 요청
      }, 10000);
      if (isRolling) {
        clearTimeout(rollTimeout);
      }
      if (isUserTurnVisible) {
        clearTimeout(rollTimeout);
      }
      return () => {
        if (rollTimeout) {
          clearTimeout(rollTimeout);
        }
      };
    }
  }, [turn, isRolling]);

  /** 화살표 동기화 */
  useEffect(() => {
    if (etcSprite[0] && turn < pNum) {
      etcSprite[0].setAlpha(1);
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
    } else if (etcSprite[0] && turn >= pNum) {
      etcSprite[0].setAlpha(0);
    }
  }, [turn]);

  /** 깃발 동기화 */
  useEffect(() => {
    if (etcSprite[1] && groundMsgNum == 0) {
      etcSprite[1].setAlpha(0);
    }
  }, [groundMsgNum, turn]);

  /** 땅 정보 변경시 */
  useEffect(() => {
    console.log("땅 정보 변경", groundChange);
    if (groundChange[0].player !== null && groundChange[0].player !== 6) {
      groundSprite[groundChange[0].index].setTint(
        colorPaletteTint[groundChange[0].player]
      );
      // 보드 데이터 갱신
      const newData = { ...boardData };
      newData[`${tRow}-${tCol}`] = {
        ...newData[`${tRow}-${tCol}`],
        sell: true,
        player: turn,
      };
      setBoardData(newData);
    } else if (groundChange[0].player === 6) {
      // 판매요청시
      console.log("땅 판매요청");
      groundSprite[groundChange[0].index].clearTint();
      // 보드 데이터 갱신
      const newGroundData = { ...boardData };
      newGroundData[`${tRow}-${tCol}`] = {
        ...newGroundData[`${tRow}-${tCol}`],
        sell: false,
        player: null,
      };
      setBoardData(newGroundData);
    }
    // 돈정보 디스플레이 업데이트
    setDisplayPlayerData(playerData);
  }, [groundChange]);

  /** 건물 정보 변경시 */
  useEffect(() => {
    if (buildingChange[0].player !== null && buildingChange[0].player !== 6) {
      // 산업군별 이미지 변경

      // 색변경
      buildingSprite[buildingChange[0].index + buildingChange[0].point].setTint(
        colorPaletteTint[buildingChange[0].player]
      );
      // 투명도 조정
      buildingSprite[
        buildingChange[0].index + buildingChange[0].point
      ].setAlpha(1);
      // 건물 데이터 갱신
      const newData = { ...builingData };
      newData[buildingChange[0].index + buildingChange[0].point] = {
        ...newData[buildingChange[0].index + buildingChange[0].point],
        sell: true,
        player: buildingChange[0].player,
        industry: buildingChange[0].industry,
      };
      setBuildingInfo(newData);
    } else if (buildingChange[0].player === 6) {
      // 판매요청시
      console.log("건물 판매요청", buildingChange);
      for (let i = 0; i < buildingChange.length; i++) {
        buildingSprite[
          buildingChange[i].index + buildingChange[i].point
        ].clearTint();
        buildingSprite[
          buildingChange[i].index + buildingChange[i].point
        ].setAlpha(0);
      }
      // 건물 데이터 갱신
      const newData = { ...builingData };
      newData[buildingChange[0].index + buildingChange[0].point] = {
        ...newData[buildingChange[0].index + buildingChange[0].point],
        sell: false,
        player: null,
        industry: buildingChange[0].industry,
      };
      setBuildingInfo(newData);
    }
    // 돈정보 디스플레이 업데이트
    setDisplayPlayerData(playerData);
  }, [buildingChange]);

  /** 유저 턴 구현 */
  useEffect(() => {
    // 주사위가 던져지고 나면
    if (diceActive) {
      // 1. 도착지 깃발 위치 이동
      let goRow = playerPositions[turn].row;
      let goCol = playerPositions[turn].col;
      for (let i = 0; i < dice1 + dice2; i++) {
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
      setTRow(goRow);
      setTCol(goCol);
      const x = (goCol - goRow) * (globalTileSize / 2) + config.scale.width / 2;
      const y =
        (goCol + goRow) * (globalTileSize / 4) + config.scale.height / 2;
      etcSprite[1].setPosition(x + 10, y - 220);

      // 1.5 깃발 생성
      setTimeout(() => {
        etcSprite[1].setAlpha(1);
      }, 1500);

      // 2. 주사위 값만큼 플레이이 이동 함수 실행
      setTimeout(() => {
        setPlayerDirection(dice1 + dice2, dice1, dice2);
        setDiceActive(false);
      }, 2000);
    }
  }, [isRolling, dice1, dice2, diceActive]);

  /** 공통 턴 구현 */
  useEffect(() => {
    // 각종턴 언로드
    setIsUserTurnVisible(false);
    setIsOilActive(false);
    setIsOilActive(false);
    setIsStartActive(false);
    setIsSubwayActive(false);
    setIsCGSA(false);
    setDoubleCnt(0);
    setGroundMsgNum(0);
    setStartNum(0);

    if (turn === pNum) {
      // 공통턴 띄우기
      setIsCommonTurnVisible(true);
    } else if (turn === pNum + 1) {
      // 뉴스턴 띄우기
      setIsNewsVisible(true);
    } else if (turn < pNum) {
      // 지하철 이동 띄우기
      if (playerPositions[turn].subway == true && turn == whoAreYou) {
        setIsSubwayActive(true);
      }
    }
  }, [turn]);

  /** 지하철 변동감지 */
  useEffect(() => {
    const how = subwayChange[0].player;
    if (subwayChange[0].move == true) {
      // 이동 구현
      const goIndex = subwayChange[0].index;
      const totalMove = (goIndex - 25 + 32) % 32;
      console.log(
        "지하철로 인한 이동 구현",
        boardData[`${subwayChange[0].row}-${subwayChange[0].col}`],
        subwayChange[0].row,
        subwayChange[0].col,
        goIndex,
        totalMove
      );
      movePlayerSubway(totalMove);
      return;
    }
    if (how !== null) {
      playerPositions[how].subway = true;
    }
  }, [subwayChange]);
  /** 지하철 이동 구현 */
  useEffect(() => {
    if (isSubwayActive) {
      console.log("지하철 이벤트 실행");
      // 클릭이벤트 구현
      for (let i = 0; i < matchPos.length; i++) {
        const row = matchPos[i].row;
        const col = matchPos[i].col;
        groundSprite[i].setInteractive();
        groundSprite[i].on("pointerdown", () => {
          const x = (col - row) * (globalTileSize / 2) + config.scale.width / 2;
          const y =
            (col + row) * (globalTileSize / 4) + config.scale.height / 2;
          etcSprite[1].setPosition(x + 10, y - 220);
          setSRow(row);
          setSCol(col);
          // 토글
          if (isSubway[0].player === null) {
            etcSprite[1].setAlpha(1);
            setSRow(row);
            setSCol(col);
            setIsSubway([
              { player: turn, row: row, col: col, move: false, index: 0 },
            ]);
          } else {
            etcSprite[1].setAlpha(0);
            setIsSubway([
              { player: null, row: row, col: col, move: false, index: 0 },
            ]);
          }
        });
      }
    }
  }, [isSubwayActive, isSubway]);

  /** 오일랜드 선택시 */
  useEffect(() => {
    if (isOilActive) {
      // 투명화
      for (let i = 0; i < matchPos.length; i++) {
        const row = matchPos[i].row;
        const col = matchPos[i].col;
        if (boardData[`${row}-${col}`].player !== turn) {
          groundSprite[i].setAlpha(0.1);
        } else {
          // 클릭이벤트 넣기
          groundSprite[i].setInteractive();
          groundSprite[i].on("pointerdown", () => {
            const x =
              (col - row) * (globalTileSize / 2) + config.scale.width / 2;
            const y =
              (col + row) * (globalTileSize / 4) + config.scale.height / 2;
            // 토글
            etcSprite[2].setPosition(x, y - offset2 - 10);
            setSRow(row);
            setSCol(col);
            if (oilLand === -1) {
              etcSprite[2].setAlpha(1);
              setOilLand(i);
              setSRow(row);
              setSCol(col);
            } else {
              etcSprite[2].setAlpha(0);
              setOilLand(-1);
            }
          });
        }
      }
    } else if (backgroundSprite[0]) {
      // 투명 원복
      for (let i = 0; i < groundSprite.length; i++) {
        const row = matchPos[i].row;
        const col = matchPos[i].col;
        if (boardData[`${row}-${col}`].player !== turn) {
          groundSprite[i].setAlpha(1);
        }
      }
    }
  }, [isOilActive, oilLand]);
  /** 오일 활성화 */
  useEffect(() => {
    if (oilStart) {
      // 오일 이펙트 전원 활성화!
      console.log("오일효과가 활성화 되었습니다!", oilLand);
      const i = oilLand;
      const row = matchPos[i].row;
      const col = matchPos[i].col;
      const x = (col - row) * (globalTileSize / 2) + config.scale.width / 2;
      const y = (col + row) * (globalTileSize / 4) + config.scale.height / 2;
      etcSprite[2].setPosition(x, y - offset2 - 10);
      etcSprite[2].setAlpha(1);
    }
  }, [oilStart]);

  /** 시작점 선택시 */
  useEffect(() => {
    if (isStartActive) {
      // 투명화
      for (let i = 0; i < matchPos.length; i++) {
        const row = matchPos[i].row;
        const col = matchPos[i].col;
        if (boardData[`${row}-${col}`].player !== turn) {
          groundSprite[i].setAlpha(0.1);
        } else {
          // 클릭이벤트 넣기
          groundSprite[i].setInteractive();
          groundSprite[i].on("pointerdown", () => {
            const x =
              (col - row) * (globalTileSize / 2) + config.scale.width / 2;
            const y =
              (col + row) * (globalTileSize / 4) + config.scale.height / 2;
            etcSprite[1].setPosition(x + 10, y - 220);
            setSRow(row);
            setSCol(col);
            // 토글
            if (startNum === 0) {
              etcSprite[1].setAlpha(1);
              setSRow(row);
              setSCol(col);
              setStartNum(1);
            } else {
              etcSprite[1].setAlpha(0);
              setStartNum(0);
            }
          });
        }
      }
    } else if (backgroundSprite[0]) {
      console.log("투명 원복", isStartActive);
      // 투명 원복
      for (let i = 0; i < groundSprite.length; i++) {
        const row = matchPos[i].row;
        const col = matchPos[i].col;
        if (boardData[`${row}-${col}`].player !== turn) {
          groundSprite[i].setAlpha(1);
        }
      }
    }
  }, [isStartActive, startNum]);

  /** 공통턴 - 땅판매 선택시 */
  useEffect(() => {
    // 본인 턴 값에 일치하는 땅에 대해서만 조사
    if (isCommonGroundSellActive) {
      // 투명화
      for (let i = 0; i < matchPos.length; i++) {
        const row = matchPos[i].row;
        const col = matchPos[i].col;
        if (boardData[`${row}-${col}`].player !== whoAreYou) {
          groundSprite[i].setAlpha(0.1);
        } else {
          // 클릭이벤트 넣기
          groundSprite[i].setInteractive();
          groundSprite[i].on("pointerdown", () => {
            const x =
              (col - row) * (globalTileSize / 2) + config.scale.width / 2;
            const y =
              (col + row) * (globalTileSize / 4) + config.scale.height / 2;
            etcSprite[1].setPosition(x, y - offset2 - 10);
            // 토글
            if (groundMsgNum === 1 && sRow == row && sCol == col) {
              etcSprite[1].setAlpha(0);
              setGroundMsgNum(0);
            } else {
              etcSprite[1].setAlpha(1);
              setSRow(row);
              setSCol(col);
              setGroundMsgNum(1);
            }
          });
        }
      }
    } else if (
      backgroundSprite[0] &&
      !isStartActive &&
      !isOilActive &&
      !isSubwayActive
    ) {
      // 투명 원복
      for (let i = 0; i < groundSprite.length; i++) {
        const row = matchPos[i].row;
        const col = matchPos[i].col;
        if (boardData[`${row}-${col}`].player !== turn) {
          groundSprite[i].setAlpha(1);
        }
      }
    }
  }, [
    isCommonGroundSellActive,
    isStartActive,
    isOilActive,
    isSubwayActive,
    groundMsgNum,
    sCol,
    sRow,
  ]);

  /** 변경 이벤트 (오일랜드, 지하철, 시작점, 공통턴땅판매) */
  useEffect(() => {
    if (
      isOilActive ||
      isSubwayActive ||
      isStartActive ||
      isCommonGroundSellActive
    ) {
      backgroundSprite[0].clear();
    } else if (backgroundSprite[0]) {
      backgroundSprite[0].fillGradientStyle(
        0xadd8e6,
        0xadd8e6,
        0x87ceeb,
        0x87ceeb,
        1
      );
      backgroundSprite[0].fillRect(
        0,
        0,
        config.scale.width,
        config.scale.height
      );
      backgroundSprite[0].setAlpha(0.5);
      // 클릭이벤트 원복
      for (let i = 0; i < groundSprite.length; i++) {
        groundSprite[i].removeAllListeners("pointerdown");
      }
    }
  }, [isOilActive, isSubwayActive, isStartActive, isCommonGroundSellActive]);

  /** 자금 디스플레이 반영 수동 */
  useEffect(() => {
    // 플레이어 정보 업데이트
    if (weblocation.state) {
      const gameId = weblocation.state.gameId;
      sendWsMessage(socketClient, gameId, "send/players-info");
    }
    // 돈정보 디스플레이 업데이트
    setDisplayPlayerData(playerData);
  }, [turn]);

  /** 렌더링 부분 */
  return (
    <div>
      {/* 로딩 */}
      {loadingVisible && <Loading />}
      {!loadingVisible && <GameStart />}
      {!isGameStartVisible && <YourTurn />}
      {isGameEndVisible && <GameEnd />}
      {isRankingvisible && <Ranking />}
      {!loadingVisible && !isGameStartVisible && !isYourTurnVisible && (
        <NotMyTurn />
      )}
      {!loadingVisible && !isGameStartVisible && !isYourTurnVisible && (
        <RoundInfo />
      )}
      {!loadingVisible && !isGameStartVisible && !isYourTurnVisible && (
        <UserInfo />
      )}

      {/* 주사위 */}
      <DiceRoll rollDiceInBoard={rollDice} />

      {/* 유저턴 */}
      <IngameModal visible={isUserTurnVisible && whoAreYou == turn}>
        {isUserTurnVisible && <UserTurn />}
      </IngameModal>

      {/* 기본 세팅 */}
      <IngameWebSocket />
      <GameOption />
      <OilSelectBtn />
      <SubwaySelectBtn />
      <StartSelectBtn />
      <GroundSelectBtn />

      {/* 공통턴 */}
      <IngameModal visible={isCommonTurnVisible}>
        {isCommonTurnVisible && <CommonTurn />}
      </IngameModal>

      {/* 뉴스턴 */}
      <IngameModal
        width="60vw"
        height="30vh"
        maxWidth="600px"
        minHeight="200px"
        visible={
          isNewsVisible &&
          !loadingVisible &&
          !isGameStartVisible &&
          !isGameEndVisible &&
          !isRankingvisible &&
          !isYourTurnVisible
        }
      >
        {isNewsVisible &&
          !loadingVisible &&
          !isGameStartVisible &&
          !isGameEndVisible &&
          !isRankingvisible &&
          !isYourTurnVisible && <News />}
      </IngameModal>
      <NewsCheck />
      <StockCheck />
      {notificationVisible && <EvaderNotification />}

      {/* Phaser 게임구현 */}
      <div ref={game} className="GameScreen" id="gameScreen" />

      {/* 개발자용 */}
      {/* {whoAreYou !== 6 && (
        <div className="devContainer">
          <input
            type="number"
            onChange={(e) => {
              setDevDice1(Number(e.target.value));
            }}
          />
          <input
            type="number"
            onChange={(e) => {
              setDevDice2(Number(e.target.value));
            }}
          />
          <button onClick={rollDiceDev}>굴리기</button>
          <button
            onClick={() => {
              sendWsMessage(
                socketClient,
                playerInfo.playerId,
                "send/timer-cancel"
              );
            }}
          >
            타이머 종료
          </button>
          <button
            onClick={() => {
              sendWsMessage(socketClient, playerInfo.gameId, "send/pass-turn");
            }}
          >
            강제 턴이동
          </button>
        </div>
      )} */}
    </div>
  );
}
