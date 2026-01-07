package org.example.labkoto.repositories;

import org.example.labkoto.api.model.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Integer> {
    List<Reservation> findByUserId(Integer userId);
    List<Reservation> findByLabId(Integer labId);
    List<Reservation> findByStatus(String status);
}
