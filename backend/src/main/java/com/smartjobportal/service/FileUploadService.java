

package com.smartjobportal.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;

@Service
public class FileUploadService {

    private static final String UPLOAD_DIR =
            System.getProperty("user.dir") + File.separator + "uploads";

    public String uploadResume(MultipartFile file) throws IOException {

        File directory = new File(UPLOAD_DIR);

        if (!directory.exists()) {
            directory.mkdirs();
        }

        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();

        File destination = new File(directory, fileName);

        file.transferTo(destination);

        return fileName;
    }
}