package com.smartjobportal.controller;

import com.smartjobportal.service.FileUploadService;
import org.springframework.web.multipart.MultipartFile;

import com.smartjobportal.model.JobApplication;
import com.smartjobportal.service.JobApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
public class JobApplicationController {

    @Autowired
    private JobApplicationService jobApplicationService;
    @Autowired
    private FileUploadService fileUploadService;

    // Apply for Job
    @PostMapping
    public JobApplication applyJob(@RequestBody JobApplication application) {
        return jobApplicationService.applyJob(application);
    }

    // Get All Applications
    @GetMapping
    public List<JobApplication> getAllApplications() {
        return jobApplicationService.getAllApplications();
    }

    // Get Application By ID
    @GetMapping("/{id}")
    public JobApplication getApplicationById(@PathVariable Long id) {
        return jobApplicationService.getApplicationById(id);
    }

    // Recruiter - View Applicants for a Job
    @GetMapping("/job/{jobId}")
    public List<JobApplication> getApplicationsByJobId(@PathVariable Long jobId) {
        return jobApplicationService.getApplicationsByJobId(jobId);
    }

    // Job Seeker - View My Applications
    @GetMapping("/user/{userId}")
    public List<JobApplication> getApplicationsByUserId(@PathVariable Long userId) {
        return jobApplicationService.getApplicationsByUserId(userId);
    }

    // Delete Application
    @DeleteMapping("/{id}")
    public String deleteApplication(@PathVariable Long id) {
        jobApplicationService.deleteApplication(id);
        return "Application deleted successfully";
    }
    // Accept Application
@PutMapping("/{id}/accept")
public JobApplication acceptApplication(@PathVariable Long id) {
    return jobApplicationService.acceptApplication(id);
}

// Reject Application
@PutMapping("/{id}/reject")
public JobApplication rejectApplication(@PathVariable Long id) {
    return jobApplicationService.rejectApplication(id);
}
@PostMapping("/upload")
public String uploadResume(@RequestParam("file") MultipartFile file) {

    try {
        String fileName = fileUploadService.uploadResume(file);
        return "Resume uploaded successfully: " + fileName;
    } catch (Exception e) {
        return "Upload failed: " + e.getMessage();
    }
}

}