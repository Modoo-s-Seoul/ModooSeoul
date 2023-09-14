package online.ft51land.modooseoul.domain.test.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import online.ft51land.modooseoul.domain.test.entitiy.Test;
import online.ft51land.modooseoul.domain.test.repository.TestRepository;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class TestService {
    private final TestRepository testRepository;

    public Test addTest(Test test) {
        testRepository.save(test);
        return test;
    }
}
