package com.example.tenisApp.service;

import com.example.tenisApp.enums.RoleType;
import com.example.tenisApp.model.Appointment;
import com.example.tenisApp.model.User;
import com.example.tenisApp.repository.AppointmentRepository;
import com.example.tenisApp.repository.UserRepository;
import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.stereotype.Service;

import javax.naming.OperationNotSupportedException;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class AppointmentService {
    private final EmailService emailService;
    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;

    public AppointmentService(AppointmentRepository appointmentRepository, UserRepository userRepository, EmailService emailService) {
        this.appointmentRepository = appointmentRepository;
        this.userRepository = userRepository;
        this.emailService = emailService;
    }

    public List<Appointment> getAllAppointments() {
        LocalDateTime threeDaysAgo = LocalDateTime.now().minusDays(3);

        return appointmentRepository.findByStartTimeAfter(threeDaysAgo);
    }

    public Appointment createAppointment(Appointment appointment) {
        User user = userRepository.findById(appointment.getUser().getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        appointment.setUser(user);
        if (user.getRoleType() != RoleType.ADMIN) {
            appointment.setAppointmentName(null);
        }

        emailService.sendAppointmentCreatedEmail(appointment);

        return appointmentRepository.save(appointment);
    }

    public void deleteAppointment(Long id) throws OperationNotSupportedException {
        if (!canDeleteAppointment(id)) {
            throw new OperationNotSupportedException("Can't delete appointment less then 6 hours before it starts.");
        }
        appointmentRepository.deleteById(id);
    }

    public List<Appointment> getAppointmentsForUser(Long userId) {
        return appointmentRepository.findByUserId(userId);
    }

    private boolean canDeleteAppointment(Long id) {
        Appointment appointment = appointmentRepository.getReferenceById(id);
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime startTime = appointment.getStartTime();

        long hoursUntilStart = ChronoUnit.HOURS.between(now, startTime);
        return hoursUntilStart >= 7;
    }
}
