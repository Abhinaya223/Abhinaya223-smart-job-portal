package com.smartjobportal.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class FileUploadService {

    private static final String UPLOAD_DIR =
            System.getProperty("user.dir") + File.separator + "uploads" + File.separator + "resumes";

    public static class UploadResult {
        public String originalFileName;
        public String storedFileName;
        public String relativePath;

        public UploadResult(String originalFileName, String storedFileName, String relativePath) {
            this.originalFileName = originalFileName;
            this.storedFileName = storedFileName;
            this.relativePath = relativePath;
        }
    }

    public UploadResult storeResume(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File is empty or not provided.");
        }

        // Validate max 5MB (5 * 1024 * 1024 bytes)
        if (file.getSize() > 5 * 1024 * 1024) {
            throw new IllegalArgumentException("File size exceeds maximum limit of 5MB.");
        }

        String originalName = file.getOriginalFilename();
        if (originalName == null) {
            originalName = "resume.pdf";
        }

        // Validate PDF extension
        if (!originalName.toLowerCase().endsWith(".pdf")) {
            throw new IllegalArgumentException("Invalid file type. Only PDF files (.pdf) are allowed.");
        }

        File directory = new File(UPLOAD_DIR);
        if (!directory.exists()) {
            directory.mkdirs();
        }

        String ext = ".pdf";
        String storedFileName = UUID.randomUUID().toString() + ext;
        Path destination = Paths.get(UPLOAD_DIR, storedFileName);

        Files.copy(file.getInputStream(), destination);

        String relativePath = "uploads/resumes/" + storedFileName;
        return new UploadResult(originalName, storedFileName, relativePath);
    }
}