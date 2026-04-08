package com.example.tenisApp.repository;

import com.example.tenisApp.enums.League;
import com.example.tenisApp.model.User;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    List<User> findByLeagueOrderByPointsDesc(League league);
    @Modifying
    @Transactional
    @Query(value = "UPDATE app_user SET matches = 0, points = 0 WHERE id = :id", nativeQuery = true)
    int resetUserMatchesAndPoints(@Param("id") Long id);
}
