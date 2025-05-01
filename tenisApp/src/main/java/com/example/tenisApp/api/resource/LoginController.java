package com.example.tenisApp.api.resource;

import com.example.tenisApp.api.models.UserApiModel;
import com.example.tenisApp.api.request.LoginUserRequest;
import com.example.tenisApp.api.response.LoginUserResponse;
import com.example.tenisApp.model.User;
import com.example.tenisApp.security.JwtTokenProvider;
import com.example.tenisApp.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("auth")
public class LoginController {
    @Autowired
    private final UserService userService;
    private final JwtTokenProvider jwtTokenProvider;

    public LoginController(UserService userService, JwtTokenProvider jwtTokenProvider) {
        this.userService = userService;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginUserResponse> login(@RequestBody LoginUserRequest loginRequest) {
        UserApiModel user = userService.authenticate(loginRequest.getUsername(), loginRequest.getPassword());

        if (user != null) {
            String token = jwtTokenProvider.generateToken(user.getUsername());
            LoginUserResponse response = new LoginUserResponse();
            response.setToken(token);
            response.setId(user.getId());
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(401).build();
        }
    }

    // Optionally, add logout functionality if you want to handle token invalidation
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) {
        // Invalidate session or token here
        return ResponseEntity.ok().body("Successfully logged out");
    }
}
