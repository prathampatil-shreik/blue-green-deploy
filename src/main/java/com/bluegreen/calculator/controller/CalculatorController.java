package com.bluegreen.calculator.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class CalculatorController {

    @Value("${app.env:BLUE}")
    private String appEnv;

    @Value("${app.version:v1.0}")
    private String appVersion;

    @Value("${simulate.failure:false}")
    private boolean simulateFailure;

    @GetMapping("/")
    public String index(Model model) {
        model.addAttribute("appEnv", appEnv);
        model.addAttribute("appVersion", appVersion);
        model.addAttribute("status", simulateFailure ? "UNHEALTHY" : "HEALTHY");
        return "index";
    }
}
