package online.ft51land.modooseoul.domain.messagenum.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import online.ft51land.modooseoul.domain.messagenum.entity.MessageNum;
import online.ft51land.modooseoul.domain.messagenum.repository.MessageNumRepository;
import online.ft51land.modooseoul.utils.error.enums.ErrorMessage;
import online.ft51land.modooseoul.utils.error.exception.custom.BusinessException;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class MessageNumService {

    private final MessageNumRepository messageNumRepository;

    @Transactional
    public Long getMessageNumByGameId(String gameId){

        //받은 방번호로 메시지 넘버를 찾아와서
        MessageNum messageNum = messageNumRepository.findById(gameId)
                .orElseThrow(() -> new BusinessException(ErrorMessage.GAME_NOT_FOUND));

        // 메시지 넘버를 증가 시키고
        Long num = messageNum.updateMessageNum();

        //다시 저장후
        messageNumRepository.save(messageNum);

        // 증가된 메시지 번호 반환
        return num;
    }

}
