package noa.controller;

import noa.dto.TagResponse;
import noa.security.CustomUserDetails;
import noa.service.TagFollowService;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class TagFollowController {

    private final TagFollowService tagFollowService;

    public TagFollowController(TagFollowService tagFollowService) {
        this.tagFollowService = tagFollowService;
    }

    @PostMapping("/tags/{name}/follow")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void follow(@PathVariable String name,
                       @AuthenticationPrincipal CustomUserDetails principal) {
        requireLogin(principal);
        tagFollowService.follow(principal.getUser(), name);
    }

    @DeleteMapping("/tags/{name}/follow")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void unfollow(@PathVariable String name,
                         @AuthenticationPrincipal CustomUserDetails principal) {
        requireLogin(principal);
        tagFollowService.unfollow(principal.getUser(), name);
    }

    @GetMapping("/me/following/tags")
    public List<TagResponse> followingTags(@AuthenticationPrincipal CustomUserDetails principal) {
        requireLogin(principal);
        return tagFollowService.getFollowingTags(principal.getUser());
    }

    private void requireLogin(CustomUserDetails principal) {
        if (principal == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "ログインが必要です");
        }
    }
}