package com.example.tenisApp.api.resource;

import com.example.tenisApp.api.models.AppointmentApiModel;
import com.example.tenisApp.dto.conversion.AppointmentConversionUtils;
import com.example.tenisApp.model.Appointment;
import com.example.tenisApp.model.User;
import com.example.tenisApp.service.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("appointments")
public class AppointmentController {
    @Autowired
    private final AppointmentService appointmentService;

    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    @GetMapping
    public List<Appointment> getAllAppointments() {
        return appointmentService.getAllAppointments();
    }

    @GetMapping("/{userId}")
    public List<Appointment> getAppointmentsForUser(@PathVariable Long userId) {
        return appointmentService.getAppointmentsForUser(userId);
    }

    @PostMapping
    public Appointment createAppointment(@RequestBody AppointmentApiModel appointment) {
        return appointmentService.createAppointment(AppointmentConversionUtils.apiToDb(appointment));
    }

    @DeleteMapping("/{id}")
    public void deleteAppointment(@PathVariable Long id) {
        appointmentService.deleteAppointment(id);
    }

}
