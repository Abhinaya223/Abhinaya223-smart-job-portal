package com.smartjobportal.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "job_applications")
public class JobApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "job_id", nullable = false)
    private Job job;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "candidate_id", nullable = false)
    private User candidate;

    private String resumeFileName;
    private String resumeFilePath;

    // APPLIED, ACCEPTED, REJECTED
    private String status;

    private LocalDateTime appliedAt;

    public JobApplication() {
        this.appliedAt = LocalDateTime.now();
        this.status = "APPLIED";
    }

    @PrePersist
    public void onCreate() {
        if (this.appliedAt == null) {
            this.appliedAt = LocalDateTime.now();
        }
        if (this.status == null) {
            this.status = "APPLIED";
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Job getJob() {
        return job;
    }

    public void setJob(Job job) {
        this.job = job;
    }

    public User getCandidate() {
        return candidate;
    }

    public void setCandidate(User candidate) {
        this.candidate = candidate;
    }

    public String getResumeFileName() {
        return resumeFileName;
    }

    public void setResumeFileName(String resumeFileName) {
        this.resumeFileName = resumeFileName;
    }

    public String getResumeFilePath() {
        return resumeFilePath;
    }

    public void setResumeFilePath(String resumeFilePath) {
        this.resumeFilePath = resumeFilePath;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getAppliedAt() {
        return appliedAt;
    }

    public void setAppliedAt(LocalDateTime appliedAt) {
        this.appliedAt = appliedAt;
    }

    // Convenience getters for JSON output compatibility
    public Long getJobId() {
        return job != null ? job.getId() : null;
    }

    public Long getUserId() {
        return candidate != null ? candidate.getId() : null;
    }

    public String getCandidateName() {
        return candidate != null ? candidate.getName() : null;
    }

    public String getCandidateEmail() {
        return candidate != null ? candidate.getEmail() : null;
    }

    public String getJobTitle() {
        return job != null ? job.getTitle() : null;
    }

    public String getCompanyName() {
        return job != null ? job.getCompany() : null;
    }
}