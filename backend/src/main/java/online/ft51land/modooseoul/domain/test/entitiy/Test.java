package online.ft51land.modooseoul.domain.test.entitiy;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
public class Test {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long testId;

    private String nickname;

    private String description;

    public Test(String nickname, String description) {
        this.nickname = nickname;
        this.description = description;
    }

}
