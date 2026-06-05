package noa.controller;

import noa.security.CustomUserDetails;
import noa.service.LikeService;
import noa.service.PostService;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@RestController
@RequestMapping("/api/v1")
public class LikeController {

    private final LikeService likeService;
    private final PostService postService;

    public LikeController(LikeService likeService, PostService postService) {
        this.likeService = likeService;
        this.postService = postService;
    }

    // いいねする
    @PostMapping("/posts/{id}/like")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void like(@PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails principal) {
        if (principal == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "ログインが必要です");
        }
        likeService.like(id, principal.getUser());
    }

    // いいね取り消し
    @DeleteMapping("/posts/{id}/like")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void unlike(@PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails principal) {
        if (principal == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "ログインが必要です");
        }
        likeService.unlike(id, principal.getUser());
    }

    // 自分がいいねした投稿一覧
    @GetMapping("/me/likes")
    public Map<String, Object> myLikes(
            @RequestParam(required = false) Long cursor,
            @RequestParam(defaultValue = "20") int limit,
            @AuthenticationPrincipal CustomUserDetails principal) {
        if (principal == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "ログインが必要です");
        }
        return postService.getMyLikes(principal.getUser(), cursor, limit);
    }
}