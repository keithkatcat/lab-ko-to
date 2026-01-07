package org.example.labkoto.services;

import org.example.labkoto.api.model.Lab;
import org.example.labkoto.api.model.Reservation;
import org.example.labkoto.api.model.User;
import org.example.labkoto.repositories.LabRepository;
import org.example.labkoto.repositories.ReservationRepository;
import org.example.labkoto.repositories.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final UserRepository userRepository;
    private final LabRepository labRepository;

    public ReservationService(ReservationRepository reservationRepository,
                              UserRepository userRepository,
                              LabRepository labRepository) {
        this.reservationRepository = reservationRepository;
        this.userRepository = userRepository;
        this.labRepository = labRepository;
    }

    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();
    }

    public Optional<Reservation> getReservationById(Integer id) {
        return reservationRepository.findById(id);
    }

    public Reservation createReservation(Integer userId, Integer labId, Reservation reservation) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        Lab lab = labRepository.findById(labId)
            .orElseThrow(() -> new RuntimeException("Lab not found"));

        if (!lab.getIsActive()) {
            throw new IllegalStateException("Lab is not available");
        }

        if (!"admin".equalsIgnoreCase(user.getAccountType()))
        {
            reservation.setStatus("Pending");
        }
        else
        {
            reservation.setStatus("Approved");
        }

        List<Reservation> existingReservations = reservationRepository.findByLabId(labId);

        for (Reservation existing : existingReservations) {
            if (existing.getDate().equals(reservation.getDate())) {

                boolean overlap = reservation.getStartTime().isBefore(existing.getEndTime()) &&
                    reservation.getEndTime().isAfter(existing.getStartTime());
                if (overlap) {
                    throw new RuntimeException("The Laboratory is already reserved at this timeslot.");
                }
            }
        }

        reservation.setUser(user);
        reservation.setLab(lab);
        return reservationRepository.save(reservation);
    }

    public Reservation updateReservation(Integer id, Integer userId, Reservation details) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

        Reservation reservation = reservationRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Reservation not found"));

        if (!"admin".equalsIgnoreCase(user.getAccountType())) {
            throw new RuntimeException("Only Admins can update reservations");
        }

        reservation.setDate(details.getDate());
        reservation.setStartTime(details.getStartTime());
        reservation.setEndTime(details.getEndTime());
        reservation.setPurpose(details.getPurpose());
        reservation.setStatus(details.getStatus());
        reservation.setAdminNotes(details.getAdminNotes());

        return reservationRepository.save(reservation);
    }

    public void deleteReservation(Integer id, Integer userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

        if (!"admin".equalsIgnoreCase(user.getAccountType())) {
            throw new RuntimeException("Only Admins can delete reservations");
        }
        reservationRepository.deleteById(id);
    }

    public Reservation approveReservation(Integer id, Integer userId, String notes) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        if (!"admin".equalsIgnoreCase(user.getAccountType())) {
            throw new RuntimeException("Only admins can approve reservations");
        }
        Reservation reservation = reservationRepository.findById(id).orElseThrow(() -> new RuntimeException("Reservation not found"));
        reservation.setStatus("approved");
        reservation.setAdminNotes(notes);
        return reservationRepository.save(reservation);
    }

    public Reservation denyReservation(Integer id, Integer userId, String notes) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        if (!"admin".equalsIgnoreCase(user.getAccountType())) {
            throw new RuntimeException("Only admins can deny reservations");
        }
        Reservation reservation = reservationRepository.findById(id).orElseThrow(() -> new RuntimeException("Reservation not found"));
        reservation.setStatus("denied");
        reservation.setAdminNotes(notes);
        return reservationRepository.save(reservation);
    }

    public List<Reservation> getPendingReservations(Integer userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        if (!"admin".equalsIgnoreCase(user.getAccountType())) {
            throw new RuntimeException("Only admins can view pending reservations");
        }
        return reservationRepository.findByStatus("Pending");
    }
}


