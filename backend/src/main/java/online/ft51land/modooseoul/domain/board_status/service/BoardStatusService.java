package online.ft51land.modooseoul.domain.board_status.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import online.ft51land.modooseoul.domain.board_status.dto.message.BuildingPurchaseMessage;
import online.ft51land.modooseoul.domain.board_status.dto.message.FTOilLandMessage;
import online.ft51land.modooseoul.domain.board_status.dto.message.GroundPurchaseMessage;
import online.ft51land.modooseoul.domain.board_status.dto.request.BuildingPurchaseRequestDto;
import online.ft51land.modooseoul.domain.board_status.entity.BoardStatus;
import online.ft51land.modooseoul.domain.board_status.entity.enums.PurchaseMessage;
import online.ft51land.modooseoul.domain.board_status.repository.BoardStatusRepository;
import online.ft51land.modooseoul.domain.building.entity.Building;
import online.ft51land.modooseoul.domain.building.repository.BuildingRepository;
import online.ft51land.modooseoul.domain.game.entity.Game;
import online.ft51land.modooseoul.domain.game.repository.GameRepository;
import online.ft51land.modooseoul.domain.player.entity.Player;
import online.ft51land.modooseoul.domain.player.repository.PlayerRepository;
import online.ft51land.modooseoul.domain.synergy.repository.SynergyReository;
import online.ft51land.modooseoul.utils.error.enums.ErrorMessage;
import online.ft51land.modooseoul.utils.error.exception.custom.BusinessException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
//@Transactional
public class BoardStatusService {
    private final BoardStatusRepository boardStatusRepository;
    private final PlayerRepository playerRepository;
    private final BuildingRepository buildingRepository;
    private final GameRepository gameRepository;
    private final SynergyReository synergyReository;


    public BoardStatus getBoardStatusById(String boardStatusId) {
        return boardStatusRepository.findById(boardStatusId)
                .orElseThrow(()-> new BusinessException(ErrorMessage.BOARD_NOT_FOUND));
    }


    public GroundPurchaseMessage purchaseGround(Player player) {
        Game game = gameRepository.findById(player.getGameId())
                .orElseThrow(() -> new BusinessException(ErrorMessage.GAME_NOT_FOUND));

        // 타이머가 활성화 되어 있는지 확인
        if(!game.getIsTimerActivated()){
            throw new BusinessException(ErrorMessage.TIMER_EXPIRED);
        }

        // 턴 정보 확인 TODO : 주석 해제하기
        if(!player.getTurnNum().equals(game.getTurnInfo())){
            throw  new BusinessException(ErrorMessage.BAD_SEQUENCE_REQUEST);
        }

        //현재 플레이어가 위치한 땅이 소유자가 없는지 한번 더 체크
        String curBoardId = player.getGameId()+"@"+player.getCurrentBoardIdx();

        BoardStatus boardStatus = getBoardStatusById(curBoardId);

        //플레이어 자산으로 땅을 살 수 있는지 체크
        if(player.getCash() < boardStatus.getPrice()) {
            return (GroundPurchaseMessage
                    .of(false
                            , PurchaseMessage.CASH_INSUFFICIENT //구매할 현금이 부족합니다.
                            , player.getCurrentBoardIdx()
                            , player.getTurnNum()));
        }

        if(boardStatus.getOwnerId() != null) {
            return (GroundPurchaseMessage
                    .of(false
                            , PurchaseMessage.GROUND_OWNER_EXISTS //땅의 소유자가 있습니다.
                            , player.getCurrentBoardIdx()
                            , player.getTurnNum()));
        }

        //초기화
        if(player.getEstates() == null) {
            List<Long> estates = new ArrayList<>();
            player.saveEstates(estates);
            playerRepository.save(player);
        }

        //구매
        //player 정보(현금, 소유 부동산) 업데이트
        player.purchaseGround(boardStatus.getPrice());
        playerRepository.save(player);

        //board status 업데이트
        boardStatus.purchaseGround(player.getId());
        boardStatusRepository.save(boardStatus);

        return (GroundPurchaseMessage
                .of(true
                        , PurchaseMessage.GROUND_PURCHASE_SUCCESS //땅구매에 성공하였습니다.
                        , player.getCurrentBoardIdx()
                        , player.getTurnNum()));
    }




    public BuildingPurchaseMessage purchaseBuilding(Player player, BuildingPurchaseRequestDto buildingPurchaseRequestDto) {

        Game game = gameRepository.findById(player.getGameId())
                .orElseThrow(() -> new BusinessException(ErrorMessage.GAME_NOT_FOUND));

        // 타이머가 활성화 되어 있는지 확인
        if(!game.getIsTimerActivated()){
            throw new BusinessException(ErrorMessage.TIMER_EXPIRED);
        }

        // 턴 정보 확인 TODO : 주석해제하기
        if(!player.getTurnNum().equals(game.getTurnInfo())){
            throw  new BusinessException(ErrorMessage.BAD_SEQUENCE_REQUEST);
        }

        Long boardIdxForBuilding = player.getCurrentBoardIdx(); //건물 지을 땅 인덱스

        //플레이어가 현재 시작점인지 체크, 시작점이 아니라면 건물짓는 위치가 현재위치 시작점이라면 받아온 index로 지음
        if(player.getCurrentBoardIdx() == 1) {
            boardIdxForBuilding  = buildingPurchaseRequestDto.boardIdx();
        }

        //플레이어 땅인지 체크
        String curBoardId = player.getGameId()+"@"+boardIdxForBuilding;

        BoardStatus boardStatus = getBoardStatusById(curBoardId);

        //땅의 주인이 플레이어인지확인
        if(!boardStatus.getOwnerId().equals(player.getId())) {
            return(BuildingPurchaseMessage
                    .of(false
                            , PurchaseMessage.NOT_PLAYER_GROUND // 플레이어의 땅이 아닙니다.
                            , boardIdxForBuilding
                            , buildingPurchaseRequestDto.buildingIdx()
                            , buildingPurchaseRequestDto.buildingId()
                            , player.getTurnNum()));
        }

        if(boardStatus.getBuildings() == null) {
            int[] buildings = new int[4];
            boardStatus.saveBuilding(buildings);
            boardStatusRepository.save(boardStatus);
        }

        //건물 짓는 위치 : 1~3
        if (1 > buildingPurchaseRequestDto.buildingIdx() || buildingPurchaseRequestDto.buildingIdx() > 3) {
            return(BuildingPurchaseMessage
                    .of(false
                            , PurchaseMessage.INVALID_LOCATION //유효하지 않은 건물 위치 입니다.
                            , boardIdxForBuilding
                            , buildingPurchaseRequestDto.buildingIdx()
                            , buildingPurchaseRequestDto.buildingId()
                            , player.getTurnNum()));

        }


        //건물 종류 : 1~5
        if(1 > buildingPurchaseRequestDto.buildingId() || buildingPurchaseRequestDto.buildingId() > 5){
            return(BuildingPurchaseMessage
                    .of(false
                            , PurchaseMessage.INVALID_BUILDING //유효하지 않은 건물 입니다.
                            , boardIdxForBuilding
                            , buildingPurchaseRequestDto.buildingIdx()
                            , buildingPurchaseRequestDto.buildingId()
                            , player.getTurnNum()));
        }


        //그 땅 그 위치에 건물이 이미 있는지 확인
        if(boardStatus.getBuildings()[Math.toIntExact(buildingPurchaseRequestDto.buildingIdx())] != 0L) {
            return(BuildingPurchaseMessage
                    .of(false
                            , PurchaseMessage.BUILDING_EXISTS // "이미 건물이 있는 위치입니다.";
                            , boardIdxForBuilding
                            , buildingPurchaseRequestDto.buildingIdx()
                            , buildingPurchaseRequestDto.buildingId()
                            , player.getTurnNum()));
        }



        //플레이어 자산으로 건물을 살 수 있는지 체크
        Building building = buildingRepository.findById(buildingPurchaseRequestDto.buildingId())
                .orElseThrow(()-> new BusinessException(ErrorMessage.BUILDING_NOT_FOUND));

        if(player.getCash() < building.getPrice()) {
            //여기
            return(BuildingPurchaseMessage
                    .of(false
                            , PurchaseMessage.CASH_INSUFFICIENT //  "구매할 현금이 부족합니다.";
                            , boardIdxForBuilding
                            , buildingPurchaseRequestDto.buildingIdx()
                            , buildingPurchaseRequestDto.buildingId()
                            , player.getTurnNum()));

        }

        //구매
        //player 자산 정보 업데이트
        player.purchaseBuilding(building.getPrice());
        playerRepository.save(player);

        boardStatus.purchaseBuilding(buildingPurchaseRequestDto.buildingIdx(), buildingPurchaseRequestDto.buildingId(),building.getPrice());

        // 시너지 확인
        for (int buildingId : boardStatus.getBuildings()) {
            Long minBuildingId = 0L;
            Long maxBuildingId = 0L;
            if(buildingId < buildingPurchaseRequestDto.buildingId()){
                minBuildingId = (long) buildingId;
                maxBuildingId = buildingPurchaseRequestDto.buildingId();
            }else{
                minBuildingId = buildingPurchaseRequestDto.buildingId();
                maxBuildingId = (long) buildingId;
            }

            if(synergyReository.existsByFirstBuildingAndSecondBuilding(minBuildingId, maxBuildingId)){
                boardStatus.addSynerge();
            }
        }

        //board status 업데이트
        boardStatusRepository.save(boardStatus);

        return(BuildingPurchaseMessage
                .of(true
                        ,PurchaseMessage.BUILDING_PURCHASE_SUCCESS //건물 구매 성공
                        ,boardIdxForBuilding
                        ,buildingPurchaseRequestDto.buildingIdx()
                        ,buildingPurchaseRequestDto.buildingId()
                        ,player.getTurnNum()));
    }



    public FTOilLandMessage ftOilLandEffect(Game game, Player player, Long boardId) {

        // 타이머가 활성화 되어 있는지 확인
        if(!game.getIsTimerActivated()){
            throw new BusinessException(ErrorMessage.TIMER_EXPIRED);
        }

        // 턴 정보 확인 TODO : 주석해제하기
//        if(!player.getTurnNum().equals(game.getTurnInfo())){
//            throw  new BusinessException(ErrorMessage.BAD_SEQUENCE_REQUEST);
//        }

        BoardStatus boardStatus = boardStatusRepository.findById(player.getGameId()+"@"+boardId)
                .orElseThrow(()-> new BusinessException(ErrorMessage.BOARD_NOT_FOUND));

        // ftoilland 가 이미 존재 했을 경우
        if(game.getFtOilLandBoardId() != null){

            // 이미 있는데 그 땅이 선택한 땅이 다를 경우
            if(boardId != game.getFtOilLandBoardId()){
                // 이미 있는데 다른 땅을 선택했다면
                BoardStatus originFTOilLand = boardStatusRepository.findById(player.getGameId()+"@"+game.getFtOilLandBoardId())
                        .orElseThrow(()-> new BusinessException(ErrorMessage.BOARD_NOT_FOUND));

                // 기존 ftoilland 일반땅으로 변경
                originFTOilLand.oilInit();
                boardStatusRepository.save(originFTOilLand);

            }
        }


        // 게임에 ftoilland 설정
        game.setFTOilLand(boardId);
        gameRepository.save(game);

        // 몇배인지 설정
        boardStatus.updateOil();
        boardStatusRepository.save(boardStatus);

        // 비용지불
        player.payFTOilLandEffect();
        playerRepository.save(player);


        return FTOilLandMessage.of(player.getCash(), boardStatus);

    }
}
