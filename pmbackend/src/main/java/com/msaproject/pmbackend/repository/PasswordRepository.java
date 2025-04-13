package com.msaproject.pmbackend.repository;

import com.msaproject.pmbackend.entity.Passwords;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PasswordRepository extends JpaRepository<Passwords, Long> {
    List<Passwords> findByUserId(Long userId);
    List<Passwords> findByUserIdAndWebsiteContainingIgnoreCase(Long userId, String website);
    void deleteByUserIdAndId(Long userId, Long id);
}
