package online.ft51land.modooseoul.domain.room.entity;

import lombok.*;
import online.ft51land.modooseoul.utils.domain.BaseEntity;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;
import org.springframework.data.redis.core.index.Indexed;

import java.time.LocalDateTime;

@Getter
@RedisHash(value = "room", timeToLive = 10000) // Redis Repository 사용을 위한
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class Room extends BaseEntity {

    @Id
    private Long id;

    @Indexed
    private String name;
    private Boolean isStart;
    private LocalDateTime createDateTime;
    
    /*
    멤버 만들어서 넣어보기
    한글 깨지는거 해결하기
     */


    @Builder
    public Room(String name, Boolean isStart){
        this.name = name;
        this.isStart = isStart;
        this.createDateTime = LocalDateTime.now();
    }
}