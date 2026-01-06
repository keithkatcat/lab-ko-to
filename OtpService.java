package otp;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

public class OtpService {

    public static void saveOtp(Connection conn, int userId, String otp, String purpose) throws Exception {
        String sql = """
            INSERT INTO otp_tokens (user_id, token, purpose, expires_at)
            VALUES (?, ?, ?, datetime('now', '+5 minutes'))
        """;
        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, userId);
            stmt.setString(2, otp);
            stmt.setString(3, purpose);
            stmt.executeUpdate();
        }
    }

    public static boolean verifyOtp(Connection conn, int userId, String otp, String purpose) throws Exception {
        String selectSql = """
            SELECT id FROM otp_tokens
            WHERE user_id = ? AND token = ? AND purpose = ? AND used = 0 AND expires_at > datetime('now')
        """;
        try (PreparedStatement stmt = conn.prepareStatement(selectSql)) {
            stmt.setInt(1, userId);
            stmt.setString(2, otp);
            stmt.setString(3, purpose);

            ResultSet rs = stmt.executeQuery();
            if (rs.next()) {
                int otpId = rs.getInt("id");
                try (PreparedStatement updateStmt = conn.prepareStatement("UPDATE otp_tokens SET used = 1 WHERE id = ?")) {
                    updateStmt.setInt(1, otpId);
                    updateStmt.executeUpdate();
                }

                if (purpose.equals("email_verification")) {
                    try (PreparedStatement userStmt = conn.prepareStatement("UPDATE users SET email_verified = 1 WHERE id = ?")) {
                        userStmt.setInt(1, userId);
                        userStmt.executeUpdate();
                    }
                }

                return true;
            }
        }
        return false;
    }
}
