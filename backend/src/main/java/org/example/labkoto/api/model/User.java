package org.example.labkoto.api.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

@Entity
@Table (name = "users")
public class User {

    @Id
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column (nullable = false, unique = true)
    private String username;

    @Column (nullable = false, unique = true)
    private String email;

    @Column (nullable = false)
    @JsonProperty (access = JsonProperty.Access.WRITE_ONLY)
    private String password;

    @Column (nullable = false, name = "account_type")
    private String accountType;

    @Column (name = "email_verified")
    private Boolean emailVerified = false;

    public String getAccountType() {
        if (accountType == null) {
            return "student";
        }
        String normalized = accountType.toLowerCase().trim();

        if (normalized.equalsIgnoreCase("admin")) {
            return "admin";
        } else if (normalized.equalsIgnoreCase("professor")) {
            return "professor";
        } else
            return "student";
    }

    public void setAccountType(String accountType) {
        if (accountType == null || accountType.trim().isEmpty()) {
            this.accountType = "student";
            return;
        }
        String normalized = accountType.toLowerCase().trim();

        if (normalized.equalsIgnoreCase("admin") || normalized.equalsIgnoreCase("professor") ||
            normalized.equalsIgnoreCase("student")){
            this.accountType = normalized;
        } else {
            this.accountType = "student";
        }
    }


    public User() {
    }

//    public User(Integer id, Integer perm, String username, String email, String password) {
//        this.id = id;
//        this.username = username;
//        this.email = email;
//        this.password = password;
//        this.accountType = (perm != null && perm == 1) ? "admin" : "student";
//    }
//

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }
@JsonIgnore
    public Integer getPerm() {
        return "admin".equalsIgnoreCase(accountType) ? 1 : 0;
    }

    public void setPerm(Integer perm) {
        this.accountType = (perm == 1) ? "admin" : "student";
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }


    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getUsername() {
        return username;
    }

    public Boolean getEmailVerified() {
        return emailVerified != null ? emailVerified : false;
    }

    public void setEmailVerified(Boolean emailVerified) {
        this.emailVerified = emailVerified;
    }
}

