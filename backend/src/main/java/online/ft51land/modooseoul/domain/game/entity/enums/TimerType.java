package online.ft51land.modooseoul.domain.game.entity.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;


@Getter
@RequiredArgsConstructor
public enum TimerType {

    SELECT_FIRST_PLAYER(5L), //선정하기
    SELECT_NEWS(10L), // 뉴스제공
    ROLL_DICE(10L),// 주사위 굴리기
    SUBWAY(10L), // 지하철
    ESTATE_PURCHASE(30L),// 부동산 구매
    STARTING_POINT_ARRIVAL(10L),// 출발점 도착
    FTOILLAND_ARRIVAL(10L),// FT OilLand
    FREE_ACTION(300L);// 5분 액션


    private final Long seconds;

    public Long getSeconds() {
        return  seconds;
    }

}
