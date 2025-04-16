package com.example.tenisApp.service;

import com.example.tenisApp.api.models.UserApiModel;
import com.example.tenisApp.dto.UserDTO;
import com.example.tenisApp.dto.conversion.UserConversionUtils;
import com.example.tenisApp.model.User;
import com.example.tenisApp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class UserService {
    @Autowired
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User createUser(User user) {
        return userRepository.save(user);
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    public UserApiModel getUserById(Long id) {
        return UserConversionUtils.dbModelToApiModel(userRepository.getReferenceById(id));
    }

    public List<UserApiModel> getAllUsers() {
        List<UserApiModel> models = new ArrayList<>();
        List<User> users = userRepository.findAll();
        for (User user : users) {
            models.add(UserConversionUtils.dbModelToApiModel(user));
        }

        return models;
    }

    public UserApiModel authenticate(String email, String username, String password) {
        for (User user : userRepository.findAll()) {
            if (user.getEmail().equals(email) && user.getUsername().equals(username) && user.getPassword().equals(password)) {
                return UserConversionUtils.dbModelToApiModel(user);
            }
        }

        return null;
    }

    public UserApiModel authenticate(String username, String password) {
        for (User user : userRepository.findAll()) {
            if (user.getUsername().equals(username) && user.getPassword().equals(password)) {
                return UserConversionUtils.dbModelToApiModel(user);
            }
        }

        return null;
    }
}
