package com.example.tenisApp.repository;

import com.example.tenisApp.enums.League;
import com.example.tenisApp.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    List<User> findByLeagueOrderByPointsDesc(League league);
}
