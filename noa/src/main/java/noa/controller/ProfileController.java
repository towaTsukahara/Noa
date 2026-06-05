package noa.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import jakarta.validation.Valid;
import noa.dto.ProfileUpdateRequest;
import noa.dto.UserResponse;
import noa.security.CustomUserDetails;
import noa.service.ProfileService;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;


@RestController
@RequestMapping("/api/v1")
public class ProfileController {

    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) { 
        this.profileService = profileService;
    }

    @PutMapping("/me/profile")
    public UserResponse updateProfile(
        @Valid @RequestBody ProfileUpdateRequest req,
        @AuthenticationPrincipal CustomUserDetails principal) {

            if (principal == null)
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "ログインが必須です");
            profileService.updateProfile(principal.getUser(), req);

            return UserResponse.from(
                principal.getUser(),
                profileService.tagsOf(principal.getUser()));
        }
}
