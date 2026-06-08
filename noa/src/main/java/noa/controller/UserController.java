package noa.controller;

//import noa.dto.ProfileUpdateRequest;
import noa.dto.UserResponse;
import noa.dto.UserSummaryResponse;
import noa.entity.User;
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
import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class UserController {

    private final ProfileService profileService;
    private final UserRepository userRepository;
    private final PostService postService;

    public UserController(
        UserRepository userRepository,
        PostService postService,
        ProfileService profileService) {
            this.userRepository = userRepository;
            this.postService = postService;
            this.profileService = profileService;
    }

    @GetMapping("/me")
    public UserResponse me(@AuthenticationPrincipal CustomUserDetails principal) {
        if (principal == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "ログインが必要です");
        }
        return UserResponse.from(principal.getUser(), profileService.tagsOf(principal.getUser()), profileService.getPostCounts(principal.getUser()));
    }

    // @PutMapping("/me/profile")
    // public UserResponse updateProfile(
    //         @Valid @RequestBody ProfileUpdateRequest req,
    //         @AuthenticationPrincipal CustomUserDetails principal) {
    //     if (principal == null)
    //         throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "ログインが必要です");
    //     profileService.updateProfile(principal.getUser(), req);
    //     return UserResponse.from(principal.getUser());
    //     }

    // 他ユーザーの公開プロフィール（完全秘匿ビュー）
    @GetMapping("/users/{handle}")
    public UserSummaryResponse getUser(@PathVariable String handle,
                                       @AuthenticationPrincipal CustomUserDetails principal) {
        User target = userRepository.findByHandle(handle)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "ユーザーが見つかりません"));

        // TODO(F-114): フォロー機能の実装後に、閲覧者(principal)が target を
        //              フォローしているか・付けた nickname を follows テーブルから取得する。
        //              現状はフォロー未実装のため、常に未フォロー/ニックネームなし＝完全秘匿表示。
        boolean isFollowing = false;
        String nickname = null;
        Map<String, List<String>> tags = profileService.tagsOf(target);

        return UserSummaryResponse.from(target, tags, isFollowing, nickname);
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