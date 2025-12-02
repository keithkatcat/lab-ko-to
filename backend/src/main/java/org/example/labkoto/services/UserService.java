package org.example.labkoto.services;

import org.example.labkoto.api.model.User;
import org.example.labkoto.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User getUser(Integer id) {
        return userRepository.findById(id).orElse(null);
    }

}
