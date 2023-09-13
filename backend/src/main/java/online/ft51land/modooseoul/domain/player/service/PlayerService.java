package online.ft51land.modooseoul.domain.player.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import online.ft51land.modooseoul.domain.player.dto.request.PlayerJoinRequestDto;
import online.ft51land.modooseoul.domain.player.dto.response.PlayerJoinResponseDto;
import online.ft51land.modooseoul.domain.player.entity.Player;
import online.ft51land.modooseoul.domain.player.repository.PlayerRepository;
import online.ft51land.modooseoul.domain.room.entity.Room;
import online.ft51land.modooseoul.domain.room.repository.RoomRepository;
import online.ft51land.modooseoul.utils.error.enums.ErrorMessage;
import online.ft51land.modooseoul.utils.error.exception.custom.BusinessException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class PlayerService {

    private final PlayerRepository playerRepository;
    private final RoomRepository roomRepository;

    public PlayerJoinResponseDto joinRoom(PlayerJoinRequestDto playerJoinRequestDto) {

        // 1. 방이 존재하는지 확인
        Room room = roomRepository.findById(playerJoinRequestDto.roomId())
                .orElseThrow(() -> new BusinessException(ErrorMessage.ROOM_NOT_FOUND));

        // 2. 대기 중인 방인지 확인
        if(room.getIsStart()){
            throw new BusinessException(ErrorMessage.ROOM_ALREADY_GAME_START);
        }
        
        // 3. 참여자 정원일 다 찼는지 확인
        if(room.getPlayers() != null && room.getPlayers().size() >= 4){
            throw new BusinessException(ErrorMessage. ROOM_ALREADY_FULL);
        }

        // 4. 해당방에 중복된 닉네임이 있는지 확인
        List<String> players = room.getPlayers();
        for(String nickname : players){
            if(nickname.equals(playerJoinRequestDto.nickname())){
                throw new BusinessException(ErrorMessage.DUPLICATE_PLAYER_NICKNAME);
            }
        }

        // 중복되지 않으면 사용자를 생성 후
        Player player = playerRepository.save(playerJoinRequestDto.toPlayer());

        // 방 참여 ( 방 players에 사용자 pk 추가)
        room.addPlayer(player);

        roomRepository.save(room);

        return PlayerJoinResponseDto.of(player);
    }
}
