package com.example.tenisApp.dto.conversion;

import com.example.tenisApp.api.models.UserApiModel;
import com.example.tenisApp.dto.UserDTO;
import com.example.tenisApp.model.User;

public class UserConversionUtils {
    public static UserApiModel dtoToApiModel(UserDTO user) {
        return new UserApiModel(user.getId(),
                user.getUserStatus(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getPassword(),
                user.getRoleType(),
                user.getUsername(),
                user.getLeague(),
                user.getPoints());
    }

    public static User apiModelToDbModel(UserApiModel user) {
        return new User(user.getId(),
                user.getUserStatus(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getPassword(),
                user.getRoleType(),
                user.getUsername(),
                user.getLeague(),
                user.getPoints());
    }

    public static UserDTO apiToDTO(UserApiModel userApiModel) {
        return new UserDTO(userApiModel.getId(),
                userApiModel.getUserStatus(),
                userApiModel.getFirstName(),
                userApiModel.getLastName(),
                userApiModel.getEmail(),
                userApiModel.getPassword(),
                userApiModel.getRoleType(),
                userApiModel.getUsername(),
                userApiModel.getLeague(),
                userApiModel.getPoints());
    }

    public static UserDTO dbToDto(User user) {
        return new UserDTO(user.getId(),
                user.getUserStatus(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getPassword(),
                user.getRoleType(),
                user.getUsername());
    }

    public static UserApiModel dbModelToApiModel(User user) {
        return new UserApiModel(user.getId(),
                user.getUserStatus(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getPassword(),
                user.getRoleType(),
                user.getUsername(),
                user.getLeague(),
                user.getPoints());
    }
}
