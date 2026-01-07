package org.example.labkoto.otp.services;

import jakarta.mail.*;
import jakarta.mail.internet.*;
import java.util.Properties;

public class EmailService {

    private static final String FROM_EMAIL = "labkoto.reservation.system@gmail.com";
    private static final String APP_PASSWORD = "dhyqrcusmxptpryc";

    public static void sendOtpEmail(String toEmail, String otp) throws MessagingException {

        Properties props = new Properties();
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.host", "smtp.gmail.com");
        props.put("mail.smtp.port", "587");

        Session session = Session.getInstance(props, new Authenticator() {
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(FROM_EMAIL, APP_PASSWORD);
            }
        });

        Message message = new MimeMessage(session);
        message.setFrom(new InternetAddress(FROM_EMAIL));
        message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(toEmail));
        message.setSubject("Your OTP Code");
        message.setText(
            "Hello,\n\nYour OTP code is: " + otp +
            "\nThis code will expire in 5 minutes.\n\nLab Reservation System"
        );

        Transport.send(message);
    }
}

