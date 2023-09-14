package online.ft51land.modooseoul.domain.test.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import online.ft51land.modooseoul.domain.test.entitiy.Test;
import online.ft51land.modooseoul.domain.test.service.TestService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/test")
@Slf4j
@RequiredArgsConstructor
public class TestController {
    private final TestService testService;

    @GetMapping("")
    public Test addTest() {
        Test test = new Test("닉네임","설명");
        testService.addTest(test);
        return test;
    }
}
