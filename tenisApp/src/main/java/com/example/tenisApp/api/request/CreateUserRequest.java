package com.example.tenisApp.api.request;

import com.example.tenisApp.api.models.UserApiModel;

public class CreateUserRequest {
    UserApiModel userApiModel;

    public CreateUserRequest(UserApiModel userApiModel) {
        this.userApiModel = userApiModel;
    }

    public CreateUserRequest() {

    }

    public UserApiModel getUserApiModel() {
        return userApiModel;
    }

    public void setUserApiModel(UserApiModel userApiModel) {
        this.userApiModel = userApiModel;
    }
}
