package noa.controller;

//import noa.dto.ProfileUpdateRequest;
import noa.dto.UserResponse;
import noa.dto.UserSummaryResponse;
import noa.entity.Follow;
import noa.entity.User;
import noa.repository.FollowRepository;
import noa.repository.UserRepository;
import noa.security.CustomUserDetails;
import noa.service.PostService;
import noa.service.ProfileService;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

//import jakarta.validation.Valid;

import java.util.Map;
import java.util.LinkedHashMap;
import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class UserController {

    private final UserRepository userRepository;
    private final PostService postService;
    private final FollowRepository followRepository;
    private final ProfileService profileService;

    public UserController(UserRepository userRepository, PostService postService,
            FollowRepository followRepository, ProfileService profileService) {
        this.userRepository = userRepository;
        this.postService = postService;
        this.followRepository = followRepository;
        this.profileService = profileService;
    }

    @GetMapping("/me")
    public UserResponse me(@AuthenticationPrincipal CustomUserDetails principal) {
        if (principal == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "ログインが必要です");
        }
        return UserResponse.from(principal.getUser(), profileService.tagsOf(principal.getUser()));
    }

    // @PutMapping("/me/profile")
    // public UserResponse updateProfile(
    // @Valid @RequestBody ProfileUpdateRequest req,
    // @AuthenticationPrincipal CustomUserDetails principal) {
    // if (principal == null)
    // throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "ログインが必要です");
    // profileService.updateProfile(principal.getUser(), req);
    // return UserResponse.from(principal.getUser());
    // }

    // 他ユーザーの公開プロフィール（完全秘匿ビュー）
    @GetMapping("/users/{handle}")
    public UserSummaryResponse getUser(@PathVariable String handle,
            @AuthenticationPrincipal CustomUserDetails principal) {
        if (principal == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "ログインが必要です");
        }
        User target = userRepository.findByHandle(handle)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "ユーザーが見つかりません"));

        // 閲覧者→対象のフォロー関係から isFollowing / nickname を実値で返す（F-113/F-114）
        Follow follow = followRepository
                .findByFollowerIdAndFolloweeId(principal.getUser().getId(), target.getId())
                .orElse(null);

        return UserSummaryResponse.from(
                target,
                profileService.tagsOf(target),
                follow != null,
                follow != null ? follow.getNickname() : null);
    }

    // TODO(F-104): F-104のタグ取得サービスができたら、そちらに置き換えてこの重複ヘルパーは削除
    private Map<String, List<String>> emptyTags() {
        Map<String, List<String>> tags = new LinkedHashMap<>();
        tags.put("tech", List.of());
        tags.put("hobby", List.of());
        tags.put("cert", List.of());
        return tags;
    }

    // そのユーザーの投稿一覧（通常投稿・新しい順・カーソルページング）
    @GetMapping("/users/{handle}/posts")
    public Map<String, Object> userPosts(@PathVariable String handle,
            @RequestParam(required = false) Long cursor,
            @RequestParam(defaultValue = "20") int limit,
            @AuthenticationPrincipal CustomUserDetails principal) {
        if (principal == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "ログインが必要です");
        }
        User target = userRepository.findByHandle(handle)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "ユーザーが見つかりません"));
        return postService.getUserPosts(target, cursor, limit, principal.getUser());
    }
}