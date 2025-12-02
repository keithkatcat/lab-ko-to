package org.example.labkoto.api.model;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private int perm;
    private String userId;
    private String email;
    private String pass;

    public User(int perm, String userId, String email, String pass) {
        this.perm = perm;
        this.userId = userId;
        this.email = email;
        this.pass = pass;
    }

    public User() {

    }

    public Integer getId(Integer id) {
        return id;
    }

    public int getPerm() {
        return perm;
    }

    public void setPerm(int perm) {
        this.perm = perm;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String id) {
        this.userId = userId;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPass() {
        return pass;
    }

    public void setPass(String pass) {
        this.pass = pass;
    }

}

