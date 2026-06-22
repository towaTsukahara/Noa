package noa.controller;

import noa.service.PostService;
import noa.security.CustomUserDetails;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@RestController
@RequestMapping("/api/v1")
public class TimelineController {

    private final PostService postService;

    public TimelineController(PostService postService) {
        this.postService = postService;
    }

    // タイムライン（通常投稿を新しい順・カーソルページング）
    // タイムライン（通常投稿を新しい順・カーソルページング）
    @GetMapping("/timeline")
    public Map<String, Object> timeline(
            @RequestParam(required = false) Long cursor,
            @RequestParam(defaultValue = "20") int limit,
            @AuthenticationPrincipal CustomUserDetails principal) {
        if (principal == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "ログインが必要です");
        }
        return postService.getTimeline(cursor, limit, principal.getUser());
    }
}