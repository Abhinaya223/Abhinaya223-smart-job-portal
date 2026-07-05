package com.smartjobportal.service;

import com.smartjobportal.repository.JobApplicationRepository;
import com.smartjobportal.repository.JobRepository;
import com.smartjobportal.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class DashboardService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private JobApplicationRepository jobApplicationRepository;

    public Map<String, Long> getDashboardStats() {

        Map<String, Long> stats = new HashMap<>();

        stats.put("Total Users", userRepository.count());
        stats.put("Total Jobs", jobRepository.count());
        stats.put("Total Applications", jobApplicationRepository.count());

        return stats;
    }
}