package online.ft51land.modooseoul.domain.board_status.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import online.ft51land.modooseoul.domain.board_status.dto.message.BuildingPurchaseMessage;
import online.ft51land.modooseoul.domain.board_status.dto.message.GroundPurchaseMessage;
import online.ft51land.modooseoul.domain.board_status.dto.request.BuildingPurchaseRequestDto;
import online.ft51land.modooseoul.domain.board_status.entity.BoardStatus;
import online.ft51land.modooseoul.domain.board_status.entity.enums.PurchaseMessage;
import online.ft51land.modooseoul.domain.board_status.repository.BoardStatusRepository;
import online.ft51land.modooseoul.domain.building.entity.Building;
import online.ft51land.modooseoul.domain.building.repository.BuildingRepository;
import online.ft51land.modooseoul.domain.player.entity.Player;
import online.ft51land.modooseoul.domain.player.repository.PlayerRepository;
import online.ft51land.modooseoul.utils.error.enums.ErrorMessage;
import online.ft51land.modooseoul.utils.error.exception.custom.BusinessException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class BoardStatusService {
    private final BoardStatusRepository boardStatusRepository;
    private final PlayerRepository playerRepository;
    private final BuildingRepository buildingRepository;

    public GroundPurchaseMessage purchaseGround(Player player) {

        //현재 플레이어가 위치한 땅이 소유자가 없는지 한번 더 체크
        String curBoardId = player.getGameId()+"@"+player.getCurrentBoardIdx();

        BoardStatus boardStatus = boardStatusRepository.findById(curBoardId)
                .orElseThrow(()-> new BusinessException(ErrorMessage.BOARD_NOT_FOUND));

        //플레이어 자산으로 땅을 살 수 있는지 체크
        if(player.getCash() < boardStatus.getPrice()) {
            return (GroundPurchaseMessage
                    .of(false
                            , PurchaseMessage.CASH_INSUFFICIENT //구매할 현금이 부족합니다.
                            , player.getCurrentBoardIdx()
                            , player.getId()));
        }

        if(boardStatus.getOwnerId() != null) {
            return (GroundPurchaseMessage
                    .of(false
                            , PurchaseMessage.GROUND_OWNER_EXISTS //땅의 소유자가 있습니다.
                            , player.getCurrentBoardIdx()
                            , player.getId()));
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
                        , player.getId()));
    }



    public BuildingPurchaseMessage purchaseBuilding(Player player, BuildingPurchaseRequestDto buildingPurchaseRequestDto) {

        Long boardIdxForBuilding = player.getCurrentBoardIdx(); //건물 지을 땅 인덱스

        //플레이어가 현재 시작점인지 체크, 시작점이 아니라면 건물짓는 위치가 현재위치 시작점이라면 받아온 index로 지음
        if(player.getCurrentBoardIdx() == 1) {
            boardIdxForBuilding  = buildingPurchaseRequestDto.boardIdx();
        }

        //플레이어 땅인지 체크
        String curBoardId = player.getGameId()+"@"+boardIdxForBuilding;

        BoardStatus boardStatus = boardStatusRepository.findById(curBoardId)
                .orElseThrow(()-> new BusinessException(ErrorMessage.BOARD_NOT_FOUND));

        //땅의 주인이 플레이어인지확인
        if(!boardStatus.getOwnerId().equals(player.getId())) {
            return(BuildingPurchaseMessage
                    .of(false
                            , PurchaseMessage.NOT_PLAYER_GROUND // 플레이어의 땅이 아닙니다.
                            , boardIdxForBuilding
                            , buildingPurchaseRequestDto.buildingIdx()
                            , buildingPurchaseRequestDto.buildingId()
                            , player.getId()));
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
                            , player.getId()));

        }


        //건물 종류 : 1~5
        if(1 > buildingPurchaseRequestDto.buildingId() || buildingPurchaseRequestDto.buildingId() > 5){
            return(BuildingPurchaseMessage
                    .of(false
                            , PurchaseMessage.INVALID_BUILDING //유효하지 않은 건물 입니다.
                            , boardIdxForBuilding
                            , buildingPurchaseRequestDto.buildingIdx()
                            , buildingPurchaseRequestDto.buildingId()
                            , player.getId()));
        }


        //그 땅 그 위치에 건물이 이미 있는지 확인
        if(boardStatus.getBuildings()[Math.toIntExact(buildingPurchaseRequestDto.buildingIdx())] != 0L) {
            return(BuildingPurchaseMessage
                    .of(false
                            , PurchaseMessage.BUILDING_EXISTS // "이미 건물이 있는 위치입니다.";
                            , boardIdxForBuilding
                            , buildingPurchaseRequestDto.buildingIdx()
                            , buildingPurchaseRequestDto.buildingId()
                            , player.getId()));
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
                            , player.getId()));

        }

        //구매
        //player 자산 정보 업데이트
        player.purchaseBuilding(building.getPrice());
        playerRepository.save(player);

        //board status 업데이트
        boardStatus.purchaseBuilding(buildingPurchaseRequestDto.buildingIdx(), buildingPurchaseRequestDto.buildingId(),building.getPrice());
        boardStatusRepository.save(boardStatus);

        return(BuildingPurchaseMessage
                .of(true
                        ,PurchaseMessage.BUILDING_PURCHASE_SUCCESS //건물 구매 성공
                        ,boardIdxForBuilding
                        ,buildingPurchaseRequestDto.buildingIdx()
                        ,buildingPurchaseRequestDto.buildingId()
                        ,player.getId()));
    }
}
