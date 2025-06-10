package com.example.tenisApp.dto;

import com.example.tenisApp.api.models.UserApiModel;
import com.example.tenisApp.enums.League;
import com.example.tenisApp.enums.RoleType;
import com.example.tenisApp.enums.UserStatus;

public class UserDTO {
    private Long id;
    private UserStatus userStatus;
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private RoleType roleType;
    private String username;
    private League league;
    private Integer points;
    private Integer matches;


    public UserDTO(Long id, UserStatus userStatus, String firstName, String lastName, String email, String password, RoleType roleType, String username, League league, Integer points, Integer matches) {
        this.id = id;
        this.userStatus = userStatus;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.roleType = roleType;
        this.username = username;
        this.league = league;
        this.points = points;
        this.matches = matches;
    }

    public UserDTO(Long id, UserStatus userStatus, String firstName, String lastName, String email, String password, RoleType roleType, String username) {
        this.id = id;
        this.userStatus = userStatus;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.roleType = roleType;
        this.username = username;
    }

    public UserDTO(UserStatus userStatus, String firstName, String lastName, String email, String password, RoleType roleType, String username) {
        this.userStatus = userStatus;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.roleType = roleType;
        this.username = username;
    }

    public UserDTO() {

    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public UserStatus getUserStatus() {
        return userStatus;
    }

    public void setUserStatus(UserStatus userStatus) {
        this.userStatus = userStatus;
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

    public RoleType getRoleType() {
        return roleType;
    }

    public void setRoleType(RoleType roleType) {
        this.roleType = roleType;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public League getLeague() {
        return league;
    }

    public void setLeague(League league) {
        this.league = league;
    }

    public Integer getPoints() {
        return points;
    }

    public void setPoints(Integer points) {
        this.points = points;
    }

    public Integer getMatches() {
        return matches;
    }

    public void setMatches(Integer matches) {
        this.matches = matches;
    }
}
