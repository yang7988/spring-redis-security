package com.boomhope.redis.controller.auth;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping(value="/auth")
public class UserController {
   @RequestMapping(value="listUsers")
   public String checkUser() {
	   return "user";
   }
}
