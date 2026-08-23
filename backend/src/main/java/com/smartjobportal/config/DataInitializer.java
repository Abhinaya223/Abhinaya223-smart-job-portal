package com.smartjobportal.config;

import com.smartjobportal.model.Job;
import com.smartjobportal.model.JobApplication;
import com.smartjobportal.model.User;
import com.smartjobportal.repository.JobApplicationRepository;
import com.smartjobportal.repository.JobRepository;
import com.smartjobportal.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initData(
            UserRepository userRepository,
            JobRepository jobRepository,
            JobApplicationRepository jobApplicationRepository,
            PasswordEncoder passwordEncoder) {
        return args -> {
            User seeker = userRepository.findByEmail("alex@example.com").orElse(null);
            User recruiter = userRepository.findByEmail("recruiter@techcorp.com").orElse(null);

            if (userRepository.count() == 0 || seeker == null || recruiter == null) {
                seeker = new User();
                seeker.setName("Alex Rivera");
                seeker.setEmail("alex@example.com");
                seeker.setPassword(passwordEncoder.encode("password123"));
                seeker.setRole("CANDIDATE");
                seeker = userRepository.save(seeker);

                recruiter = new User();
                recruiter.setName("Sarah Jenkins");
                recruiter.setEmail("recruiter@techcorp.com");
                recruiter.setPassword(passwordEncoder.encode("password123"));
                recruiter.setRole("RECRUITER");
                recruiter = userRepository.save(recruiter);
            }

            if (jobRepository.count() == 0) {
                Job job1 = new Job();
                job1.setTitle("Senior Full-Stack Engineer");
                job1.setCompany("Nexus Labs");
                job1.setLocation("San Francisco, CA (Remote)");
                job1.setSalary(145000);
                job1.setJobType("Full-Time");
                job1.setDescription("Build next-generation SaaS applications using React, Tailwind CSS, and Spring Boot REST microservices.");
                job1.setPostedBy(recruiter);
                jobRepository.save(job1);

                Job job2 = new Job();
                job2.setTitle("Lead AI Systems Architect");
                job2.setCompany("Hyperion Dynamics");
                job2.setLocation("New York, NY");
                job2.setSalary(175000);
                job2.setJobType("Full-Time");
                job2.setDescription("Architect high-throughput AI services, multi-modal workflows, and distributed backend engines with Spring Boot.");
                job2.setPostedBy(recruiter);
                jobRepository.save(job2);

                Job job3 = new Job();
                job3.setTitle("Principal UI/UX Designer");
                job3.setCompany("Vanguard Interactive");
                job3.setLocation("Austin, TX (Hybrid)");
                job3.setSalary(130000);
                job3.setJobType("Contract");
                job3.setDescription("Craft spatial design systems, clean SaaS interface layouts, and responsive component libraries.");
                job3.setPostedBy(recruiter);
                jobRepository.save(job3);

                // Initial Job Application
                JobApplication app = new JobApplication();
                app.setCandidate(seeker);
                app.setJob(job1);
                app.setStatus("APPLIED");
                app.setResumeFileName("Alex_Rivera_Resume_2026.pdf");
                jobApplicationRepository.save(app);
            }
        };
    }
}
