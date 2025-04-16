package com.example.tenisApp.api.request;

public class GetUserRequest {
    private Long userId;

    public GetUserRequest(Long userId) {
        this.userId = userId;
    }

    public GetUserRequest() {

    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }
}
