package com.example.tenisApp.api.models;

import java.time.LocalDateTime;

public class AppointmentApiModel {
    private Long id;
    private UserApiModel user;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String appointmentName;

    public AppointmentApiModel(UserApiModel user, LocalDateTime startTime, LocalDateTime endTime, String appointmentName) {
        this.user = user;
        this.startTime = startTime;
        this.endTime = endTime;
        this.appointmentName = appointmentName;
    }

    public AppointmentApiModel(Long id, UserApiModel user, LocalDateTime startTime, LocalDateTime endTime, String appointmentName) {
        this(user, startTime, endTime, appointmentName);
        this.id = id;
    }

    public AppointmentApiModel() {

    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public UserApiModel getUser() {
        return user;
    }

    public void setUser(UserApiModel user) {
        this.user = user;
    }

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
    }

    public LocalDateTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalDateTime endTime) {
        this.endTime = endTime;
    }

    public String getAppointmentName() {
        return appointmentName;
    }

    public void setAppointmentName(String appointmentName) {
        this.appointmentName = appointmentName;
    }
}
