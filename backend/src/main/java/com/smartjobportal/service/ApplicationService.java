package com.smartjobportal.service;

import com.smartjobportal.model.Application;
import com.smartjobportal.repository.ApplicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ApplicationService {

    @Autowired
    private ApplicationRepository applicationRepository;

    // Apply for a job
    public Application applyJob(Application application) {
        return applicationRepository.save(application);
    }

    // View all applications
    public List<Application> getAllApplications() {
        return applicationRepository.findAll();
    }
}