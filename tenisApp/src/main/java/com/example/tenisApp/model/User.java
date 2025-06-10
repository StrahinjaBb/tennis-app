package com.example.tenisApp.model;

import com.example.tenisApp.enums.League;
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

    @Enumerated(EnumType.STRING)
    @Column(length = 1)
    private League league;;

    @Column(nullable = false)
    private Integer points;

    @Column(nullable = false)
    private Integer matches;

    public User() {

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

    public void increaseMatches() {
        if (this.matches == null) {
            this.matches = 1;
            return;
        }

        this.matches += 1;
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

    public User(Long id, UserStatus userStatus, String firstName, String lastName, String email, String password, RoleType roleType, String userName, League league, Integer points, Integer matches) {
        this(id, userStatus, firstName, lastName, email, password, roleType, userName);
        this.league = league;
        this.points = points;
        this.matches = matches;
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
