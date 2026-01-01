package org.example.labkoto.api.controller;

import org.example.labkoto.api.model.Reservation;
import org.example.labkoto.services.ReservationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping ("/api/reservations")
public class ReservationController {

    private final ReservationService reservationService;

    public ReservationController(ReservationService reservationService) {
        this.reservationService = reservationService;
    }

    @GetMapping
    public ResponseEntity<List<Reservation>> getAllReservations() {
        return ResponseEntity.ok(reservationService.getAllReservations());
    }

    @GetMapping ("/{id}")
    public ResponseEntity<Reservation> getReservationById(@PathVariable Integer id) {
        return reservationService.getReservationById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Reservation> createReservation(
        @RequestParam Integer userId,
        @RequestParam Integer labId,
        @RequestBody Reservation reservation) {
        return ResponseEntity.ok(reservationService.createReservation(userId, labId, reservation));
    }

    @PutMapping("/{id}")
    @PreAuthorize ("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Reservation> updateReservation(
        @PathVariable Integer id,
        @RequestParam Integer userId,
        @RequestBody Reservation reservation) {
        return ResponseEntity.ok(reservationService.updateReservation(id, userId, reservation));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize ("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Void> deleteReservation(@PathVariable Integer id, @RequestParam Integer userId) {
        reservationService.deleteReservation(id, userId);
        return ResponseEntity.noContent().build();
    }
}

