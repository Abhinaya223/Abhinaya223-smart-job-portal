package com.smartjobportal.service;

import com.smartjobportal.model.Job;
import com.smartjobportal.repository.JobRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class JobService {

    @Autowired
    private JobRepository jobRepository;

    // Add Job
    public Job addJob(Job job) {
        return jobRepository.save(job);
    }

    // Get All Jobs
    public List<Job> getAllJobs() {
        return jobRepository.findAll();
    }

    // Get Job By ID
    public Job getJobById(Long id) {
        return jobRepository.findById(id).orElse(null);
    }

    // Update Job
    public Job updateJob(Long id, Job updatedJob) {

        Job existingJob = jobRepository.findById(id).orElse(null);

        if (existingJob != null) {
            existingJob.setTitle(updatedJob.getTitle());
            existingJob.setCompany(updatedJob.getCompany());
            existingJob.setLocation(updatedJob.getLocation());
            existingJob.setSalary(updatedJob.getSalary());
            existingJob.setDescription(updatedJob.getDescription());

            return jobRepository.save(existingJob);
        }

        return null;
    }

    // Delete Job
    public void deleteJob(Long id) {
        jobRepository.deleteById(id);
    }

    // Search by Title
    public List<Job> searchByTitle(String title) {
        return jobRepository.findByTitleContainingIgnoreCase(title);
    }

    // Search by Company
    public List<Job> searchByCompany(String company) {
        return jobRepository.findByCompanyContainingIgnoreCase(company);
    }

    // Search by Location
    public List<Job> searchByLocation(String location) {
        return jobRepository.findByLocationContainingIgnoreCase(location);
    }
}