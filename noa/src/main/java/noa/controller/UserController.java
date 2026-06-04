package noa.controller;

import noa.dto.UserResponse;
import noa.dto.UserSummaryResponse;
import noa.entity.User;
import noa.repository.UserRepository;
import noa.security.CustomUserDetails;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/v1")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/me")
    public UserResponse me(@AuthenticationPrincipal CustomUserDetails principal) {
        if (principal == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "ログインが必要です");
        }
        return UserResponse.from(principal.getUser());
    }

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

        return UserSummaryResponse.from(target, isFollowing, nickname);
    }
}