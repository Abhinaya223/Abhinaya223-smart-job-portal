package com.smartjobportal.service;

import com.smartjobportal.model.JobApplication;
import com.smartjobportal.repository.JobApplicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class JobApplicationService {

    @Autowired
    private JobApplicationRepository jobApplicationRepository;

    // Apply for Job
    public JobApplication applyJob(JobApplication application) {
        application.setStatus("Applied");
        return jobApplicationRepository.save(application);
    }

    // Get All Applications
    public List<JobApplication> getAllApplications() {
        return jobApplicationRepository.findAll();
    }

    // Get Application By ID
    public JobApplication getApplicationById(Long id) {
        return jobApplicationRepository.findById(id).orElse(null);
    }

    // Get Applications By Job ID (Recruiter)
    public List<JobApplication> getApplicationsByJobId(Long jobId) {
        return jobApplicationRepository.findByJobId(jobId);
    }

    // Get Applications By User ID (Job Seeker)
    public List<JobApplication> getApplicationsByUserId(Long userId) {
        return jobApplicationRepository.findByUserId(userId);
    }

    // Delete Application
    public void deleteApplication(Long id) {
        jobApplicationRepository.deleteById(id);
    }
    // Accept Application
public JobApplication acceptApplication(Long id) {
    JobApplication application = jobApplicationRepository.findById(id).orElse(null);
    if (application != null) {
        application.setStatus("Accepted");
        return jobApplicationRepository.save(application);
    }
    return null;
}

// Reject Application
public JobApplication rejectApplication(Long id) {
    JobApplication application = jobApplicationRepository.findById(id).orElse(null);
    if (application != null) {
        application.setStatus("Rejected");
        return jobApplicationRepository.save(application);
    }
    return null;
}

}