package ru.kata.spring.bootstrap.demo;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import ru.kata.spring.bootstrap.demo.model.Role;
import ru.kata.spring.bootstrap.demo.model.User;
import ru.kata.spring.bootstrap.demo.repository.RoleRepository;
import ru.kata.spring.bootstrap.demo.repository.UserRepository;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Component
public class DataLoader implements ApplicationRunner {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public DataLoader(UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(ApplicationArguments args) throws Exception {

        List<Role> roleList = new ArrayList<>() {
            {
                add(new Role("ROLE_ADMIN"));
                add(new Role("ROLE_USER"));
                add(new Role("ROLE_TEST"));
            }
        };
        roleRepository.saveAll(roleList);

        List<Role> admin_role = List.of(roleRepository.findByName("ROLE_ADMIN"), roleRepository.findByName("ROLE_USER"));
        List<Role> user_role = Collections.singletonList(roleRepository.findByName("ROLE_USER"));

        List<User> userList = new ArrayList<>() {
            {
                add(new User("admin", "admin", 40, "admin@gmail.com", passwordEncoder.encode("admin"), admin_role));
                add(new User("user", "user", 40, "user@gmail.com", passwordEncoder.encode("user"), user_role));
                add(new User("Linus", "Torvalds", 52, "ltorvalds@nvidia.com", passwordEncoder.encode("ltorvalds"), user_role));
                add(new User("James", "Gosling", 67, "jgosling@gmail.com", passwordEncoder.encode("jgosling"), user_role));
                add(new User("Steve", "Jobs", 56, "sjobs@gmail.com", passwordEncoder.encode("sjobs"), user_role));
                add(new User("Tim", "Berners-Lee", 67, "tberners-lee@gmail.com", passwordEncoder.encode("tberners-lee"), user_role));
                add(new User("Bill", "Gates", 66, "bgates@gmail.com", passwordEncoder.encode("bgates"), user_role));
            }
        };
        userRepository.saveAll(userList);
    }
}
