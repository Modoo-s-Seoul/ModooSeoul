package online.ft51land.modooseoul.utils.config;

import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Slf4j
@Getter
@Configuration
@EnableWebSocketMessageBroker // STOMP 설정을 위한 어노테이션
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

	@Override
	public void registerStompEndpoints(StompEndpointRegistry registry) {
		registry.addEndpoint("ws").setAllowedOrigins("*")
		        .withSockJS(); // ws 엔드포인트 주소로 SockJS 를 사용하여 통신하겠다.
	}

	@Override
	public void configureMessageBroker(MessageBrokerRegistry registry) {
		registry.enableSimpleBroker("/receive"); // 서버가 클라이언트로 메시지 보낼 때
		registry.setApplicationDestinationPrefixes("/send"); // 서버에서 메시지를 받을 때 사용
	}
}
