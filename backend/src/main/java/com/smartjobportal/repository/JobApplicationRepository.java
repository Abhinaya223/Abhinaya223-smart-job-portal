package com.smartjobportal.repository;

import com.smartjobportal.model.JobApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {

    @Query("SELECT ja FROM JobApplication ja WHERE ja.candidate.id = :candidateId")
    List<JobApplication> findByCandidateId(@Param("candidateId") Long candidateId);

    @Query("SELECT ja FROM JobApplication ja WHERE ja.job.postedBy.id = :recruiterId")
    List<JobApplication> findByJobPostedById(@Param("recruiterId") Long recruiterId);

    @Query("SELECT ja FROM JobApplication ja WHERE ja.job.id = :jobId")
    List<JobApplication> findByJobId(@Param("jobId") Long jobId);

    default List<JobApplication> findByUserId(Long userId) {
        return findByCandidateId(userId);
    }
}