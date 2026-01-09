package org.example.labkoto.services;

import org.example.labkoto.api.model.Report;
import org.example.labkoto.api.model.User;
import org.example.labkoto.repositories.ReportRepository;
import org.example.labkoto.repositories.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReportService {

    private final ReportRepository reportRepository;
    private final UserRepository userRepository;

    public ReportService(ReportRepository reportRepository, UserRepository userRepository) {
        this.reportRepository = reportRepository;
        this.userRepository = userRepository;
    }

    public Report createReport(Integer userId, String reportContent) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

        Report report = new Report();
        report.setUser(user);
        report.setReport(reportContent);
        report.setStatus("pending");

        return  reportRepository.save(report);
    }

    public List<Report> getAllReports()
    {
        return reportRepository.findAll();
    }
}

