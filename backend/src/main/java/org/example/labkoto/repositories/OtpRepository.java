package org.example.labkoto.repositories;

import org.example.labkoto.api.model.Otp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface OtpRepository extends JpaRepository<Otp, Integer> {
    Optional<Otp> findByUserIdAndTokenAndPurposeAndUsedFalseAndExpiresAtAfter(
        Integer userId,
        String token,
        String purpose,
        LocalDateTime currentTime
    )
        ;
}
