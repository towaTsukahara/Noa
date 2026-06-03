package noa.controller;

import org.springframework.web.bind.annotation.*;

import noa.dto.ProfileOwnPostResponse;
import noa.service.ProfileOwnPostService;

@RestController
@RequestMapping("/api/v1")
public class ProfileOwnPostController {

    private final ProfileOwnPostService profileOwnPostService;

    public ProfileOwnPostController(ProfileOwnPostService profileOwnPostService) {
        this.profileOwnPostService = profileOwnPostService;
    }

    @GetMapping("/user/{handle}/post")
    public ProfileOwnPostResponse get(@PathVariable Long id) {
        return profileOwnPostService.getProfileOwnPost(id);
    }
}
