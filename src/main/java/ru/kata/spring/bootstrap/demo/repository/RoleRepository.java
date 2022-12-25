package ru.kata.spring.bootstrap.demo.repository;

import org.springframework.data.repository.CrudRepository;
import ru.kata.spring.bootstrap.demo.model.Role;

public interface RoleRepository extends CrudRepository<Role, Long> {
    Role findByName(String name);
}
