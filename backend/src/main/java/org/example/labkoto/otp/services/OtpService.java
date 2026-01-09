package org.example.labkoto.otp.services;

import org.example.labkoto.api.model.Otp;
import org.example.labkoto.api.model.User;
import org.example.labkoto.repositories.OtpRepository;
import org.example.labkoto.repositories.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class OtpService {

    private final OtpRepository otpRepository;
    private final UserRepository userRepository;

    public OtpService(OtpRepository otpRepository, UserRepository userRepository) {
        this.otpRepository = otpRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public void saveOtp(Integer userId, String token, String purpose) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

        Otp otp = new Otp();
        otp.setUser(user);
        otp.setToken(token);
        otp.setPurpose(purpose);
        otp.setExpiresAt(LocalDateTime.now().plusMinutes(5));

        otpRepository.save(otp);
    }

    @Transactional
    public boolean verifyOtp(Integer userId, String token, String purpose) {
        Optional<Otp> otpOpt = otpRepository.findByUserIdAndTokenAndPurposeAndUsedFalseAndExpiresAtAfter(
            userId, token, purpose, LocalDateTime.now()
                                                                                                        );
        if (otpOpt.isPresent()) {
            Otp otp = otpOpt.get();
            otp.setUsed(true);
            otpRepository.save(otp);

            if("email_verification".equals(purpose)) {
                User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
                user.setEmailVerified(true);
                userRepository.save(user);
            }
            return true;
        }
        return false;
    }
}
