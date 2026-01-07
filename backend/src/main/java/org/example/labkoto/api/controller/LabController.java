package org.example.labkoto.api.controller;

import org.example.labkoto.api.model.Lab;
import org.example.labkoto.services.LabService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping ("/api/labs")
public class LabController {

    private final LabService labService;

    public LabController(LabService labService) {
        this.labService = labService;
    }

    @GetMapping
    public ResponseEntity<List<Lab>> getActiveLabs() {
        return ResponseEntity.ok(labService.getActiveLabs());
    }

    @GetMapping ("/all")
    @PreAuthorize ("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<List<Lab>> getAllLabs() {
        return ResponseEntity.ok(labService.getAllLabs());
    }

@GetMapping ("/{id}")
public ResponseEntity<Lab> getLabById(@PathVariable Integer id) {
    return labService.getLabById(id)
        .map(ResponseEntity::ok)
        .orElse(ResponseEntity.notFound().build());
}

@PostMapping
@PreAuthorize ("hasAuthority('ROLE_ADMIN')")
public ResponseEntity<Lab> createLab(@RequestBody Lab lab) {
    return ResponseEntity.ok(labService.createLab(lab));
}

@PutMapping ("/{id}")
@PreAuthorize ("hasAuthority('ROLE_ADMIN')")
public ResponseEntity<Lab> updateLab(@PathVariable Integer id, @RequestBody Lab labDetails) {
    return ResponseEntity.ok(labService.updateLab(id, labDetails));
}

@PutMapping ("/{id}/status")
@PreAuthorize ("hasAuthority('ROLE_ADMIN')")
public ResponseEntity<Lab> updateLabStatus(@PathVariable Integer id,
                                           @RequestParam boolean isActive) {
    Lab updatedLab = labService.updateStatus(id, isActive);
    return ResponseEntity.ok(updatedLab);
}


@DeleteMapping ("/{id}")
@PreAuthorize ("hasAuthority('ROLE_ADMIN')")
public ResponseEntity<Void> deleteLab(@PathVariable Integer id) {
    labService.deleteLab(id);
    return ResponseEntity.noContent().build();
}
    }

