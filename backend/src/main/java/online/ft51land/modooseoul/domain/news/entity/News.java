package online.ft51land.modooseoul.domain.news.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import online.ft51land.modooseoul.domain.news.entity.enums.NewsType;
import online.ft51land.modooseoul.domain.stock.entity.Stock;

@Entity
@Getter
@NoArgsConstructor
public class News {

    @jakarta.persistence.Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn
    private Stock stock;

    private String description;

    @Enumerated(EnumType.STRING)
    private NewsType newsType;

    private Long percent;
}
