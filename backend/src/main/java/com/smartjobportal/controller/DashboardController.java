package com.smartjobportal.controller;

import com.smartjobportal.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @GetMapping
    public Map<String, Long> getDashboardStats() {
        return dashboardService.getDashboardStats();
    }
}