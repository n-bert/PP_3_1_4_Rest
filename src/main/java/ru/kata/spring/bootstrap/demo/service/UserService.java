package ru.kata.spring.bootstrap.demo.service;

import ru.kata.spring.bootstrap.demo.model.User;

import java.util.List;

public interface UserService {
    List<User> getAllUsers();
    User getUserByEmail(String email);

    User getUserById(Long id);
    void saveUser(User user);
    void updateUser(Long id, User user);
    void deleteUser(Long id);
}
