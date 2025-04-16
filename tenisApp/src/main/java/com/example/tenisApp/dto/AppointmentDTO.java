package com.example.tenisApp.dto;

import java.time.LocalDateTime;

public class AppointmentDTO {
    private Long id;
    private UserDTO user;
    private LocalDateTime startTime;
    private LocalDateTime endTime;

    public AppointmentDTO(Long id, UserDTO user, LocalDateTime startTime, LocalDateTime endTime) {
        this.id = id;
        this.user = user;
        this.startTime = startTime;
        this.endTime = endTime;
    }

    public AppointmentDTO(UserDTO user, LocalDateTime startTime, LocalDateTime endTime) {
        this(null, user, startTime, endTime);
    }

    public AppointmentDTO() {

    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public UserDTO getUser() {
        return user;
    }

    public void setUser(UserDTO user) {
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
}
