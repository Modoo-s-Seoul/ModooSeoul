package online.ft51land.modooseoul.domain.board_status.service;

import lombok.RequiredArgsConstructor;
import online.ft51land.modooseoul.domain.board_status.repository.BoardStatusRepository;
import online.ft51land.modooseoul.domain.messagenum.repository.MessageNumRepository;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BoardStatusService {
    private final BoardStatusRepository boardStatusRepository;
    private final MessageNumRepository messageNumRepository;


}
