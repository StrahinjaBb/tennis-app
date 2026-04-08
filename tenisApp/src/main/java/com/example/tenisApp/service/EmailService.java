package com.example.tenisApp.service;

import com.example.tenisApp.model.Appointment;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class EmailService {

    private final JavaMailSender mailSender;
    @Value("${app.notification.email}")
    private String notificationEmail;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendAppointmentCreatedEmail(Appointment appointment) {
        LocalDateTime startTime = appointment.getStartTime();
        LocalDateTime endTime = appointment.getEndTime();
        String appointmentTime = buildAppointmentTime(startTime, endTime);
        String appointmentDate = buildAppointmentDate(startTime, endTime);
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(notificationEmail);
        message.setSubject("Appointment Created");
        message.setText(
                appointment.getUser().getFirstName() +
                        " " +
                        appointment.getUser().getLastName() +
                        " booked appointment: " +
                        startTime.getDayOfWeek() +
                        " " + appointmentTime +
                        "(" +
                        appointmentDate + ")"
        );

        mailSender.send(message);
    }

    private String buildAppointmentTime(LocalDateTime startTime, LocalDateTime endTime) {
        if (startTime == null || endTime == null) {
            return null;
        }

        return startTime.getHour() + ":" + startTime.getMinute() + " - " + endTime.getHour() + ":" + endTime.getMinute() + "h";
    }

    private String buildAppointmentDate(LocalDateTime startTime, LocalDateTime endTime) {
        if (startTime == null || endTime == null) {
            return null;
        }

        return startTime.getDayOfMonth() + "." + startTime.getMonthValue() + "." + startTime.getYear() + ".";
    }
}
