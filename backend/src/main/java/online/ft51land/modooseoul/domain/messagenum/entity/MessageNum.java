package online.ft51land.modooseoul.domain.messagenum.entity;

import jakarta.persistence.Column;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;

@Getter
@NoArgsConstructor //기본 생성자 생성
@RedisHash(value = "message_num", timeToLive = 10000)
@ToString
public class MessageNum {


    @Id
    @Column(name = "game_id", nullable = false)
    private String gameId;

    @Column(name = "message_num", nullable = false)
    private Long messageNum;


//    @Builder
    public MessageNum(String gameId){
        this.gameId = gameId;
        this.messageNum = 0L;
    }

    public Long updateMessageNum(){
        this.messageNum +=1;
        return messageNum;
    }
}
