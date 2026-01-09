package org.example.labkoto.services;

import org.example.labkoto.api.model.Report;
import org.example.labkoto.api.model.User;
import org.example.labkoto.repositories.ReportRepository;
import org.example.labkoto.repositories.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

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
            .orElseThrow(() -> new RuntimeException("User with" + userId + " id not found"));

        Report report = new Report();
        report.setUser(user);
        report.setReport(reportContent);
        report.setStatus("pending");

        return reportRepository.save(report);
    }

    public List<Report> getAllReports() {
        return reportRepository.findAll();
    }

    public List<Report> getReportsByUser(Integer userId) {
        return reportRepository.findByUserId(userId);
    }

    public List<Report> getReportsByStatus(String status) {
        return reportRepository.findByStatus(status);
    }

    public Optional<Report> getReportById(Integer reportId) {
        return reportRepository.findById(reportId);
    }

    public Report updateReportStatus(Integer reportId, String status, String adminResponse) {
        Report report = reportRepository.findById(reportId)
            .orElseThrow(() -> new RuntimeException("Report with " + reportId + " id not found"));

        report.setStatus(status);
        if (adminResponse != null && !adminResponse.isBlank()) {
            report.setAdminResponse(adminResponse);
        }
        return reportRepository.save(report);
    }

    public void deleteReport(Integer id)
    {
        reportRepository.deleteById(id);
    }
}

