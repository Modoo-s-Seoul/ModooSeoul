package online.ft51land.modooseoul.domain.player.service;

import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class PlayerService {

    private final SimpMessagingTemplate simpMessagingTemplate;

    //플레이어 세션 아이디만 등록
    public void registPlayer(String sessionId) {
        
    }
}
