package noa.controller;

import noa.security.CustomUserDetails;
import noa.service.FollowService;
import noa.dto.NicknameRequest;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
public class FollowController {

    private final FollowService followService;

    public FollowController(FollowService followService) {
        this.followService = followService;
    }

    @PostMapping("/users/{handle}/follow")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void follow(@PathVariable String handle,
            @AuthenticationPrincipal CustomUserDetails principal) {
        requireLogin(principal);
        followService.follow(principal.getUser(), handle);
    }

    @DeleteMapping("/users/{handle}/follow")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void unfollow(@PathVariable String handle,
            @AuthenticationPrincipal CustomUserDetails principal) {
        requireLogin(principal);
        followService.unfollow(principal.getUser(), handle);
    }

    @GetMapping("/me/following")
    public Map<String, Object> following(
            @RequestParam(required = false) Long cursor,
            @RequestParam(defaultValue = "20") int limit,
            @AuthenticationPrincipal CustomUserDetails principal) {
        requireLogin(principal);
        return followService.getFollowing(principal.getUser(), cursor, limit);
    }

    private void requireLogin(CustomUserDetails principal) {
        if (principal == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "ログインが必要です");
        }
    }

    @PutMapping("/users/{handle}/nickname")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void setNickname(@PathVariable String handle,
            @RequestBody NicknameRequest req,
            @AuthenticationPrincipal CustomUserDetails principal) {
        requireLogin(principal);
        followService.setNickname(principal.getUser(), handle, req.getNickname());
    }

    @DeleteMapping("/users/{handle}/nickname")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void clearNickname(@PathVariable String handle,
            @AuthenticationPrincipal CustomUserDetails principal) {
        requireLogin(principal);
        followService.clearNickname(principal.getUser(), handle);
    }
}