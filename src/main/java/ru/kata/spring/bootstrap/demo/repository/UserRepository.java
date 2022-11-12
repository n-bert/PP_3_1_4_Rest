package ru.kata.spring.bootstrap.demo.repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import ru.kata.spring.bootstrap.demo.model.User;

public interface UserRepository extends CrudRepository<User, Long> {
    @Query("from User u left join fetch u.roles where u.email= :email")
    User findUserByEmail(String email);
}