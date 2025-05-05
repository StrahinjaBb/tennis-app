package com.example.tenisApp.api.response;

import com.example.tenisApp.enums.RoleType;

public class LoginUserResponse {
    private String token;
    private Long id;

    private RoleType roleType;

    public LoginUserResponse(String token, Long id, RoleType roleType) {
        this.token = token;
        this.id = id;
        this.roleType = roleType;
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

    public RoleType getRoleType() {
        return roleType;
    }

    public void setRoleType(RoleType roleType) {
        this.roleType = roleType;
    }
}
