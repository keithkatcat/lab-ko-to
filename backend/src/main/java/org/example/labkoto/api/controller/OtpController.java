package org.example.labkoto.api.controller;

import jakarta.mail.MessagingException;
import org.example.labkoto.otp.generator.OtpGenerator;
import org.example.labkoto.otp.services.EmailService;
import org.example.labkoto.otp.services.OtpService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping ("/api/otp")
public class OtpController {
    private final OtpService otpService;
    private final EmailService emailService;

    public OtpController(OtpService otpService, EmailService emailService) {
        this.otpService = otpService;
        this.emailService = emailService;
    }

    public static class SendOtpRequest {
        private Integer userId;
        private String email;
        private String purpose;

        public Integer getUserId() {
            return userId;
        }

        public void setUserId(Integer userId) {
            this.userId = userId;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getPurpose() {
            return purpose;
        }

        public void setPurpose(String purpose) {
            this.purpose = purpose;
        }
    }

    public static class VerifyOtpRequest {
        private Integer userId;
        private String token;
        private String purpose;

        public Integer getUserId() {
            return userId;
        }

        public void setUserId(Integer userId) {
            this.userId = userId;
        }

        public String getToken() {
            return token;
        }

        public void setToken(String token) {
            this.token = token;
        }

        public String getPurpose() {
            return purpose;
        }

        public void setPurpose(String purpose) {
            this.purpose = purpose;
        }
    }

    public static class OtpResponse {
        private boolean success;
        private String message;

        public OtpResponse(boolean success, String message) {
            this.success = success;
            this.message = message;
        }

        public boolean isSuccess() {
            return success;
        }

        public void setSuccess(boolean success) {
            this.success = success;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }
    }

    @PostMapping ("/send")
    public ResponseEntity<OtpResponse> sendOtp(@RequestBody SendOtpRequest request) {
        try {
            String otp = OtpGenerator.generateOTP();

            otpService.saveOtp(request.getUserId(), otp, request.getPurpose());

            emailService.sendOtpEmail(request.getEmail(), otp);
            return ResponseEntity.ok(new OtpResponse(true, "Otp sent successfully"));
        } catch (MessagingException e) {
            return ResponseEntity.status(500)
                .body(new OtpResponse(false, "Failed to send OTP: " + e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500)
                .body(new OtpResponse(false, "Failed to generate OTP: " + e.getMessage()));
        }
    }

    @PostMapping ("/verify")
    public ResponseEntity<OtpResponse> verifyOtp(@RequestBody VerifyOtpRequest request) {
        try {
            boolean isValid = otpService.verifyOtp(
                request.getUserId(),
                request.getToken(),
                request.getPurpose()
                                                  );

            if (isValid) {
                return ResponseEntity.ok(new OtpResponse(true, "Otp verified successfully"));
            } else {
                return ResponseEntity.status(400)
                    .body(new OtpResponse(false, "Invalid or Expired OTP"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(500)
                .body(new OtpResponse(false, "Failed to verify OTP: " + e.getMessage()));
        }
    }
}