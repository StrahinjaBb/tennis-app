package com.example.tenisApp.api.resource;

import com.example.tenisApp.api.models.UserApiModel;
import com.example.tenisApp.api.request.CreateUserRequest;
import com.example.tenisApp.api.request.GetUserRequest;
import com.example.tenisApp.dto.conversion.UserConversionUtils;
import com.example.tenisApp.model.User;
import com.example.tenisApp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("users")
public class UserController {
    @Autowired
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<UserApiModel>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserApiModel> getUser(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @PostMapping
    public ResponseEntity<UserApiModel> createUser(@RequestBody CreateUserRequest request) {
        return ResponseEntity.ok(UserConversionUtils.dbModelToApiModel(userService.createUser(UserConversionUtils.apiModelToDbModel(request.getUserApiModel()))));
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
    }
}
