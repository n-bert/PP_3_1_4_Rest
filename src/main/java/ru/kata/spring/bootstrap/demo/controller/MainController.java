package ru.kata.spring.bootstrap.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.bootstrap.demo.model.User;
import ru.kata.spring.bootstrap.demo.service.RoleService;
import ru.kata.spring.bootstrap.demo.service.UserService;

import javax.servlet.http.HttpServletRequest;
import java.security.Principal;

@Controller
public class MainController {

    @GetMapping("/user")
    public String showUserPage() {
//        model.addAttribute("authorizedUser", userService.getUserByEmail(principal.getName()));
//        model.addAttribute("rolesList", roleService.listRoles());
        return "user";
    }

    @GetMapping("/admin")
    public String showAdminPage() {
//        model.addAttribute("authorizedUser", userService.getUserByEmail(principal.getName()));
//        model.addAttribute("rolesList", roleService.listRoles());
//        model.addAttribute("users", userService.getAllUsers());
//        model.addAttribute("newUser", new User());
        return "admin";
    }
}
