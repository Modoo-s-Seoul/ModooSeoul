package online.ft51land.modooseoul.utils.websocket;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import online.ft51land.modooseoul.domain.messagenum.entity.MessageNum;
import online.ft51land.modooseoul.domain.messagenum.repository.MessageNumRepository;
import online.ft51land.modooseoul.utils.dto.message.BaseMessage;
import online.ft51land.modooseoul.utils.error.enums.ErrorMessage;
import online.ft51land.modooseoul.utils.error.exception.custom.BusinessException;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

@RequiredArgsConstructor
@Component
@Slf4j
public class WebSocketSendHandler {

	private final MessageNumRepository messageNumRepository;
	private final SimpMessagingTemplate simpMessagingTemplate;

	public <T> void sendToGame(String topic, String gameId, T message) {
		log.info("gameId = {}, message = {}", gameId, message);

		//받은 방번호로 메시지 넘버를 찾아와서
		MessageNum messageNum = messageNumRepository.findById(gameId)
				.orElseThrow(() -> new BusinessException(ErrorMessage.GAME_NOT_FOUND));

		// 메시지 넘버를 증가 시키고
		Long num = messageNum.updateMessageNum();

		//다시 저장후
		messageNumRepository.save(messageNum);


		simpMessagingTemplate.convertAndSend("/receive/game/"+ topic +"/"+gameId,
				BaseMessage.baseMessage(num, message));
	}

	public <T> void sendToPlayer(String topic, String playerId, String gameId, T message) {
		//받은 방번호로 메시지 넘버를 찾아와서
		MessageNum messageNum = messageNumRepository.findById(gameId)
				.orElseThrow(() -> new BusinessException(ErrorMessage.GAME_NOT_FOUND));

		// 메시지 넘버를 증가 시키고
		Long num = messageNum.updateMessageNum();

		//다시 저장후
		messageNumRepository.save(messageNum);
		simpMessagingTemplate.convertAndSend("/receive/" + topic + "/" + playerId,
				BaseMessage.baseMessage(num, message));
	}
}
