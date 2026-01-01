package org.example.labkoto.repositories;

import org.example.labkoto.api.model.Lab;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LabRepository extends JpaRepository<Lab, Integer> {
        List<Lab> findByIsActiveTrue();
}
