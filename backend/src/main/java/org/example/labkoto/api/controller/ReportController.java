package org.example.labkoto.api.controller;


import org.example.labkoto.api.model.Report;
import org.example.labkoto.services.ReportService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping ("/api/reports")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @PostMapping
    public ResponseEntity<?> createReport(@RequestBody CreateReportRequest request) {
        Report report = reportService.createReport(request.getUserId(), request.getReport());
        return ResponseEntity.ok(report);
    }

    @GetMapping
    @PreAuthorize ("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<List<Report>> getAllReports() {
        return ResponseEntity.ok(reportService.getAllReports());
    }

    @GetMapping ("/user/{userId}")
    public ResponseEntity<List<Report>> getReportsByUser(@PathVariable Integer userId) {
        return ResponseEntity.ok(reportService.getReportsByUser(userId));
    }

    @GetMapping ("/status/{status}")
    @PreAuthorize ("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<List<Report>> getReportsByStatus(@PathVariable String status) {
        return ResponseEntity.ok(reportService.getReportsByStatus(status));
    }

    @GetMapping ("/{id}")
    public ResponseEntity<Report> getReportById(@PathVariable Integer id) {
        return reportService.getReportById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping ("/{id}/status")
    @PreAuthorize ("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Report> updateReportStatus(
        @PathVariable Integer id,
        @RequestBody UpdateReportRequest request) {
        Report report = reportService.updateReportStatus(id, request.getStatus(), request.getAdminResponse());
        return ResponseEntity.ok(report);
    }

    @DeleteMapping ("/{id}")
    @PreAuthorize ("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Void> deleteReport(@PathVariable Integer id) {
        reportService.deleteReport(id);
        return ResponseEntity.noContent().build();
    }

    public static class CreateReportRequest {
        private Integer userId;
        private String report;

        public Integer getUserId() {
            return userId;
        }

        public void setUserId(Integer userId) {
            this.userId = userId;
        }

        public String getReport() {
            return report;
        }

        public void setReport(String report) {
            this.report = report;
        }
    }

    public static class UpdateReportRequest {
        private String status;
        private String adminResponse;

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }

        public String getAdminResponse() {
            return adminResponse;
        }

        public void setAdminResponse(String adminResponse) {
            this.adminResponse = adminResponse;
        }
    }
}
