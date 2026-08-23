package com.smartjobportal.controller;

import com.smartjobportal.jwt.JwtUtil;
import com.smartjobportal.model.Job;
import com.smartjobportal.model.User;
import com.smartjobportal.repository.UserRepository;
import com.smartjobportal.service.JobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/jobs")
public class JobController {

    @Autowired
    private JobService jobService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    // Get All Jobs
    @GetMapping
    public List<Job> getAllJobs() {
        return jobService.getAllJobs();
    }

    // Get Job By ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getJobById(@PathVariable Long id) {
        Job job = jobService.getJobById(id);
        if (job == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(job);
    }

    // Add Job (Recruiter Only)
    @PostMapping
    public ResponseEntity<?> addJob(@RequestBody Job job, @RequestHeader(value = "Authorization", required = false) String authHeader) {
        User recruiter = null;

        // Try extracting user from SecurityContext
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof String email) {
            recruiter = userRepository.findByEmail(email).orElse(null);
        }

        // Fallback: extract directly from Bearer header
        if (recruiter == null && authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            if (jwtUtil.validateToken(token)) {
                String email = jwtUtil.extractEmail(token);
                recruiter = userRepository.findByEmail(email).orElse(null);
            }
        }

        if (recruiter != null) {
            job.setPostedBy(recruiter);
        }

        Job savedJob = jobService.addJob(job);
        return ResponseEntity.ok(savedJob);
    }

    // Update Job
    @PutMapping("/{id}")
    public ResponseEntity<Job> updateJob(@PathVariable Long id, @RequestBody Job job) {
        Job updated = jobService.updateJob(id, job);
        return ResponseEntity.ok(updated);
    }

    // Delete Job
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteJob(@PathVariable Long id) {
        jobService.deleteJob(id);
        return ResponseEntity.ok("Job deleted successfully");
    }

    // Search by Title
    @GetMapping("/search/title")
    public List<Job> searchByTitle(@RequestParam String title) {
        return jobService.searchByTitle(title);
    }

    // Search by Company
    @GetMapping("/search/company")
    public List<Job> searchByCompany(@RequestParam String company) {
        return jobService.searchByCompany(company);
    }

    // Search by Location
    @GetMapping("/search/location")
    public List<Job> searchByLocation(@RequestParam String location) {
        return jobService.searchByLocation(location);
    }
}