package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Coursier;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Coursier entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CoursierRepository extends JpaRepository<Coursier, Long> {}
