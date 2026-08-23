package com.smartjobportal.controller;

import com.smartjobportal.jwt.JwtUtil;
import com.smartjobportal.model.Job;
import com.smartjobportal.model.JobApplication;
import com.smartjobportal.model.User;
import com.smartjobportal.repository.JobApplicationRepository;
import com.smartjobportal.repository.JobRepository;
import com.smartjobportal.repository.UserRepository;
import com.smartjobportal.service.FileUploadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;

@RestController
@RequestMapping("/api/applications")
public class JobApplicationController {

    @Autowired
    private JobApplicationRepository jobApplicationRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FileUploadService fileUploadService;

    @Autowired
    private JwtUtil jwtUtil;

    // Helper: resolve User from auth header / SecurityContext
    private User getAuthenticatedUser(String authHeader) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof String email) {
            Optional<User> u = userRepository.findByEmail(email);
            if (u.isPresent()) return u.get();
        }

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            if (jwtUtil.validateToken(token)) {
                String email = jwtUtil.extractEmail(token);
                return userRepository.findByEmail(email).orElse(null);
            }
        }
        return null;
    }

    // Candidate applies for Job with PDF file upload (multipart/form-data)
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> applyJobWithFile(
            @RequestParam("jobId") Long jobId,
            @RequestParam("file") MultipartFile file,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {

        User candidate = getAuthenticatedUser(authHeader);
        if (candidate == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User authentication required to apply");
        }

        Optional<Job> jobOpt = jobRepository.findById(jobId);
        if (jobOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Job ID #" + jobId + " not found.");
        }

        FileUploadService.UploadResult uploadResult;
        try {
            uploadResult = fileUploadService.storeResume(file);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to upload resume file: " + e.getMessage());
        }

        JobApplication app = new JobApplication();
        app.setJob(jobOpt.get());
        app.setCandidate(candidate);
        app.setResumeFileName(uploadResult.originalFileName);
        app.setResumeFilePath(uploadResult.relativePath);
        app.setStatus("APPLIED");

        JobApplication saved = jobApplicationRepository.save(app);
        return ResponseEntity.ok(saved);
    }

    // Candidate applies for Job (JSON fallback endpoint)
    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> applyJobJson(
            @RequestBody Map<String, Object> payload,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {

        User candidate = getAuthenticatedUser(authHeader);
        Long userId = payload.containsKey("userId") ? ((Number) payload.get("userId")).longValue() : (candidate != null ? candidate.getId() : null);
        Long jobId = payload.containsKey("jobId") ? ((Number) payload.get("jobId")).longValue() : null;

        if (userId != null && candidate == null) {
            candidate = userRepository.findById(userId).orElse(null);
        }

        if (candidate == null || jobId == null) {
            return ResponseEntity.badRequest().body("Valid candidate user and jobId are required");
        }

        Optional<Job> jobOpt = jobRepository.findById(jobId);
        if (jobOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Job ID #" + jobId + " not found");
        }

        JobApplication app = new JobApplication();
        app.setJob(jobOpt.get());
        app.setCandidate(candidate);
        app.setResumeFileName(payload.containsKey("resumeFileName") ? payload.get("resumeFileName").toString() : "Resume.pdf");
        app.setStatus("APPLIED");

        JobApplication saved = jobApplicationRepository.save(app);
        return ResponseEntity.ok(saved);
    }

    // Candidate - View My Applications
    @GetMapping("/my")
    public ResponseEntity<?> getMyApplications(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        User candidate = getAuthenticatedUser(authHeader);
        if (candidate == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User authentication required");
        }

        List<JobApplication> apps = jobApplicationRepository.findByCandidateId(candidate.getId());
        return ResponseEntity.ok(apps);
    }

    // Recruiter - View Applicants for recruiter's posted jobs
    @GetMapping("/recruiter")
    public ResponseEntity<?> getRecruiterApplications(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        User recruiter = getAuthenticatedUser(authHeader);
        if (recruiter == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Recruiter authentication required");
        }

        List<JobApplication> apps = jobApplicationRepository.findByJobPostedById(recruiter.getId());
        if (apps.isEmpty()) {
            // Fallback: return all applications if recruiter has not explicitly linked jobs yet
            apps = jobApplicationRepository.findAll();
        }
        return ResponseEntity.ok(apps);
    }

    // Get All Applications (legacy / general)
    @GetMapping
    public List<JobApplication> getAllApplications() {
        return jobApplicationRepository.findAll();
    }

    // Recruiter - Update Status (PATCH /api/applications/{id}/status)
    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateStatusPatch(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {

        String newStatus = body.get("status");
        if (newStatus == null || newStatus.isBlank()) {
            return ResponseEntity.badRequest().body("Status field is required");
        }

        Optional<JobApplication> appOpt = jobApplicationRepository.findById(id);
        if (appOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        JobApplication app = appOpt.get();
        app.setStatus(newStatus.toUpperCase().equals("ACCEPT") ? "ACCEPTED" :
                      newStatus.toUpperCase().equals("REJECT") ? "REJECTED" : newStatus);

        JobApplication updated = jobApplicationRepository.save(app);
        return ResponseEntity.ok(updated);
    }

    // Recruiter - Accept Application
    @PutMapping("/{id}/accept")
    public ResponseEntity<?> acceptApplication(@PathVariable Long id) {
        Optional<JobApplication> appOpt = jobApplicationRepository.findById(id);
        if (appOpt.isEmpty()) return ResponseEntity.notFound().build();
        JobApplication app = appOpt.get();
        app.setStatus("ACCEPTED");
        return ResponseEntity.ok(jobApplicationRepository.save(app));
    }

    // Recruiter - Reject Application
    @PutMapping("/{id}/reject")
    public ResponseEntity<?> rejectApplication(@PathVariable Long id) {
        Optional<JobApplication> appOpt = jobApplicationRepository.findById(id);
        if (appOpt.isEmpty()) return ResponseEntity.notFound().build();
        JobApplication app = appOpt.get();
        app.setStatus("REJECTED");
        return ResponseEntity.ok(jobApplicationRepository.save(app));
    }

    // Stream Resume PDF file for viewing (inline preview) or downloading by Application ID
    @GetMapping("/{id}/resume")
    public ResponseEntity<Resource> getResumeByApplicationId(
            @PathVariable Long id,
            @RequestParam(value = "download", defaultValue = "false") boolean download) {

        Optional<JobApplication> appOpt = jobApplicationRepository.findById(id);
        if (appOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        JobApplication app = appOpt.get();
        String relativePath = app.getResumeFilePath();
        String originalName = app.getResumeFileName() != null ? app.getResumeFileName() : "Resume.pdf";

        File file = null;
        if (relativePath != null && !relativePath.isBlank()) {
            file = new File(System.getProperty("user.dir"), relativePath);
        }

        if (file == null || !file.exists()) {
            // Check direct uploads directory as fallback
            if (app.getResumeFileName() != null) {
                file = new File(System.getProperty("user.dir") + "/uploads/resumes/" + app.getResumeFileName());
                if (!file.exists()) {
                    file = new File(System.getProperty("user.dir") + "/uploads/" + app.getResumeFileName());
                }
            }
        }

        if (file == null || !file.exists()) {
            return ResponseEntity.notFound().build();
        }

        Resource resource = new FileSystemResource(file);
        String dispositionType = download ? "attachment" : "inline";

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, dispositionType + "; filename=\"" + originalName + "\"")
                .body(resource);
    }

    // Stream Resume File directly by filename (direct route)
    @GetMapping("/resume/{fileName:.+}")
    public ResponseEntity<Resource> getResumeFileDirect(
            @PathVariable String fileName,
            @RequestParam(value = "download", defaultValue = "false") boolean download) {

        Path filePath = Paths.get(System.getProperty("user.dir"), "uploads", "resumes", fileName);
        File file = filePath.toFile();

        if (!file.exists()) {
            file = Paths.get(System.getProperty("user.dir"), "uploads", fileName).toFile();
        }

        if (!file.exists()) {
            return ResponseEntity.notFound().build();
        }

        Resource resource = new FileSystemResource(file);
        String dispositionType = download ? "attachment" : "inline";

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, dispositionType + "; filename=\"" + fileName + "\"")
                .body(resource);
    }
}