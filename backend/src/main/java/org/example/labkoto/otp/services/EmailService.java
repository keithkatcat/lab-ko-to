package org.example.labkoto.otp.services;

import jakarta.mail.*;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Properties;

@Service
public class EmailService {

    private static final String FROM_EMAIL = "labkoto.reservation.system@gmail.com";
    private static final String APP_PASSWORD = "dhyqrcusmxptpryc";

    private final String fromEmail;
    private final String appPassword;

    public EmailService(
        @Value ("${email.from}") String fromEmail,
        @Value ("${email.password") String appPassword) {
        this.fromEmail = fromEmail;
        this.appPassword = appPassword;
    }

    public void sendOtpEmail(String toEmail, String otp) throws MessagingException {

        Properties props = new Properties();
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.host", "smtp.gmail.com");
        props.put("mail.smtp.port", "587");

        Session session = Session.getInstance(props, new Authenticator() {
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(fromEmail, appPassword);
            }
        });

        Message message = new MimeMessage(session);
        message.setFrom(new InternetAddress(fromEmail));
        message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(toEmail));
        message.setSubject("Your OTP Code");
        message.setText(
            "Hello,\n\nYour OTP code is: " + otp +
                "\nThis code will expire in 5 minutes.\n\nLab Reservation System"
                       );

        Transport.send(message);
    }
}

