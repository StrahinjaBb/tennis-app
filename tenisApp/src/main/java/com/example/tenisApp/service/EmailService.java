package com.example.tenisApp.service;

import com.example.tenisApp.model.Appointment;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;
    @Value("${app.notification.email}")
    private String notificationEmail;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendAppointmentCreatedEmail(Appointment appointment) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(notificationEmail);
        message.setSubject("Appointment Created");
        message.setText(
                "Your appointment is scheduled at: " + appointment.getStartTime() + " for user: " + appointment.getUser().getUsername()
        );

        mailSender.send(message);
    }
}
