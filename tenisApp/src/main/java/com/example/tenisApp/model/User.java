package com.example.tenisApp.model;

import com.example.tenisApp.enums.RoleType;
import com.example.tenisApp.enums.UserStatus;
import jakarta.persistence.*;

@Entity
@Table(name = "app_user")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private UserStatus userStatus;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RoleType roleType;

    @Column(nullable = false)
    private String username;

    public User() {

    }

    public User(UserStatus userStatus, String firstName, String lastName, String email, String password, RoleType roleType, String userName) {
        this.userStatus = userStatus;
        this.firstName = firstName;
        this.lastName = lastName;
        this.roleType = roleType;
        this.email = email;
        this.password = password;
        this.username = userName;
    }

    public User(Long id, UserStatus userStatus, String firstName, String lastName, String email, String password, RoleType roleType, String userName) {
        this(userStatus, firstName, lastName, email, password, roleType, userName);
        this.id = id;
    }

    public Long getId() {
        return id;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public RoleType getRoleType() {
        return roleType;
    }

    public void setRoleType(RoleType roleType) {
        this.roleType = roleType;
    }

    public UserStatus getUserStatus() {
        return userStatus;
    }

    public void setUserStatus(UserStatus userStatus) {
        this.userStatus = userStatus;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
}
