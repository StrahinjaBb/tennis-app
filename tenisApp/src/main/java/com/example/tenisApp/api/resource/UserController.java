package com.example.tenisApp.api.resource;

import com.example.tenisApp.api.models.UserApiModel;
import com.example.tenisApp.api.request.*;
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

    @GetMapping("/league")
    public ResponseEntity<List<UserApiModel>> getLeagueUsers(@RequestBody GetLeagueUsersRequest request) {
        return ResponseEntity.ok(userService.getLeagueUsers(request.getLeague()));
    }

    @PostMapping
    public ResponseEntity<UserApiModel> createUser(@RequestBody CreateUserRequest request) {
        if (userService.getUserByUsername(request.getUserApiModel().getUsername()) != null) {
            return ResponseEntity.badRequest().build();
        }
        if (userService.getUserByEmail(request.getUserApiModel().getEmail()) != null) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(UserConversionUtils.dbModelToApiModel(userService.createUser(UserConversionUtils.apiModelToDbModel(request.getUserApiModel()))));
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
    }

    @PutMapping("/{id}/role")
    public ResponseEntity changeUserRole(@PathVariable Long id, @RequestBody UpdateUserRole request) {
        UserApiModel user = userService.getUserById(id);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        user.setRoleType(request.getRoleType());
        User updatedUser = userService.saveUser(UserConversionUtils.apiModelToDbModel(user));

        return ResponseEntity.ok(UserConversionUtils.dbModelToApiModel(updatedUser));
    }

    @PutMapping("/{id}/points")
    public ResponseEntity updatePoints(@PathVariable Long id, @RequestBody UpdateUserPoints request) {
        User user = userService.getDbUserById(id);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        if (user.getPoints() == null) {
            user.setPoints(request.getPoints());
            User updatedUser = userService.saveUser(user);
            return ResponseEntity.ok(UserConversionUtils.dbModelToApiModel(updatedUser));
        }

        Integer newPoints = user.getPoints() + request.getPoints();
        user.setPoints(newPoints);
        User updatedUser = userService.saveUser(user);

        return ResponseEntity.ok(UserConversionUtils.dbModelToApiModel(updatedUser));
    }

    @PutMapping("/{id}/league")
    public ResponseEntity updateLeague(@PathVariable Long id, @RequestBody UpdateUserLeague request) {
        User user = userService.getDbUserById(id);

        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        user.setLeague(request.getLeague());
        User updatedUser = userService.saveUser(user);

        return ResponseEntity.ok(UserConversionUtils.dbModelToApiModel(updatedUser));
    }
 }
