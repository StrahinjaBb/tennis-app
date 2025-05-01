package com.example.tenisApp.api.response;

public class LoginUserResponse {
    private String token;
    private Long id;

    public LoginUserResponse(String token, Long id) {
        this.token = token;
        this.id = id;
    }

    public LoginUserResponse() {

    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
}
