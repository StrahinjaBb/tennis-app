package com.example.tenisApp.api.resource;

import com.example.tenisApp.api.models.UserApiModel;
import com.example.tenisApp.api.request.LoginUserRequest;
import com.example.tenisApp.model.User;
import com.example.tenisApp.security.JwtTokenProvider;
import com.example.tenisApp.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    // Login endpoint
    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginUserRequest loginRequest) {
        // Authenticate the user based on the provided credentials (username and password)
        UserApiModel user = userService.authenticate(loginRequest.getUsername(), loginRequest.getPassword());

        if (user != null) {
            // Generate JWT token upon successful authentication
            String token = jwtTokenProvider.generateToken(user.getUsername());
            return ResponseEntity.ok().body(token);
        } else {
            return ResponseEntity.status(401).body("Invalid username or password");
        }
    }

    // Optionally, add logout functionality if you want to handle token invalidation
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) {
        // Invalidate session or token here
        return ResponseEntity.ok().body("Successfully logged out");
    }
}
