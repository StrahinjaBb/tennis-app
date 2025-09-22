package com.example.tenisApp.service;

import com.example.tenisApp.api.models.UserApiModel;
import com.example.tenisApp.enums.RoleType;
import com.example.tenisApp.model.Appointment;
import com.example.tenisApp.model.User;
import com.example.tenisApp.repository.AppointmentRepository;
import com.example.tenisApp.repository.UserRepository;
import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AppointmentService {
    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;

    public AppointmentService(AppointmentRepository appointmentRepository, UserRepository userRepository) {
        this.appointmentRepository = appointmentRepository;
        this.userRepository = userRepository;
    }

    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    public Appointment createAppointment(Appointment appointment) {
        User user = userRepository.findById(appointment.getUser().getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        appointment.setUser(user);
        if (user.getRoleType() != RoleType.ADMIN) {
            appointment.setAppointmentName(null);
        }

        return appointmentRepository.save(appointment);
    }

    public void deleteAppointment(Long id) {
        appointmentRepository.deleteById(id);
    }

    public List<Appointment> getAppointmentsForUser(Long userId) {
        return appointmentRepository.findByUserId(userId);
    }
}
