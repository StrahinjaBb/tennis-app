package com.example.tenisApp.api.request;

import com.example.tenisApp.enums.RoleType;

public class UpdateUserRole {
    private RoleType roleType;

    public UpdateUserRole(RoleType roleType) {
        this.roleType = roleType;
    }

    public UpdateUserRole() {

    }

    public RoleType getRoleType() {
        return roleType;
    }

    public void setRoleType(RoleType roleType) {
        this.roleType = roleType;
    }
}
