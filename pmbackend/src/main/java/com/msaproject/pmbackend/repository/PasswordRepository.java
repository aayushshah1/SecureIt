package com.msaproject.pmbackend.repository;

import com.msaproject.pmbackend.entity.Passwords;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PasswordRepository extends JpaRepository<Passwords, Long> {
}
