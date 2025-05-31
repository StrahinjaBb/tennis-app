package com.example.tenisApp.api.request;

public class UpdateUserPoints {
    private Integer points;

    public UpdateUserPoints(Integer points) {
        this.points = points;
    }

    public UpdateUserPoints() {

    }

    public Integer getPoints() {
        return points;
    }

    public void setPoints(Integer points) {
        this.points = points;
    }
}
