package org.example.labkoto;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.persistence.autoconfigure.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaRepositories(basePackages = "org.example.labkoto.repositories")
@EntityScan(basePackages = "org.example.labkoto.api.model")
public class LabKoToApplication {

    public static void main(String[] args) {

        SpringApplication.run(LabKoToApplication.class, args);
    }

}
