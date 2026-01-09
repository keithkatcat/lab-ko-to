package org.example.labkoto.services;

import org.example.labkoto.api.model.Lab;
import org.example.labkoto.repositories.LabRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class LabService {

    private final LabRepository labRepository;

    public LabService(LabRepository labRepository) {
        this.labRepository = labRepository;
    }

    public List<Lab> getActiveLabs() {
        return labRepository.findByIsActiveTrue();
    }

    public List<Lab> getAllLabs() {
        return labRepository.findAll();
    }

    public Optional<Lab> getLabById(Integer id) {
        return labRepository.findById(id);
    }

    public Lab createLab(Lab lab) {
        return labRepository.save(lab);
    }

    public Lab updateLab(Integer id, Lab labDetails) {
        Lab lab = labRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Lab not found"));

        lab.setName(labDetails.getName());
        lab.setCapacity(labDetails.getCapacity());
        lab.setEquipment(labDetails.getEquipment());
        lab.setIsActive(labDetails.getIsActive());

        return labRepository.save(lab);
    }

    public Lab updateStatus(Integer labId, boolean isActive) {
        Lab lab = labRepository.findById(labId)
            .orElseThrow(() -> new IllegalArgumentException("Lab not found"));
        lab.setIsActive(isActive);
        return labRepository.save(lab);
    }


    public void deleteLab(Integer id) {
        labRepository.deleteById(id);
    }
}
