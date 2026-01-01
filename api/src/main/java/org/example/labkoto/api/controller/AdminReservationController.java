package org.example.labkoto.api.controller;

import org.example.labkoto.api.model.Reservation;
import org.example.labkoto.services.ReservationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/reservations")
public class AdminReservationController {

    private final ReservationService reservationService;

    public AdminReservationController(ReservationService reservationService) {
        this.reservationService = reservationService;
    }

    @GetMapping("/pending")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<List<Reservation>> getPendingReservations(@RequestParam Integer userId) {
        return ResponseEntity.ok(reservationService.getPendingReservations(userId));
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<Reservation> approveReservation(
        @PathVariable Integer id,
        @RequestParam Integer userId,
        @RequestParam(required = false) String notes) {
        return ResponseEntity.ok(reservationService.approveReservation(id, userId, notes));
    }

    @PutMapping("/{id}/deny")
    public ResponseEntity<Reservation> denyReservation(
        @PathVariable Integer id,
        @RequestParam Integer userId,
        @RequestParam(required = false) String notes) {
        return ResponseEntity.ok(reservationService.denyReservation(id, userId, notes));
    }
}
