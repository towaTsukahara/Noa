package noa.controller;

import jakarta.validation.Valid;
import noa.dto.PostCreateRequest;
import noa.dto.PostResponse;
import noa.entity.Post;
import noa.security.CustomUserDetails;
import noa.service.PostService;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/v1")
public class PostController {

    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    // 投稿作成（ログイン中のユーザーが投稿者になる）
    @PostMapping("/posts")
    @ResponseStatus(HttpStatus.CREATED)
    public PostResponse create(@Valid @RequestBody PostCreateRequest req,
                               @AuthenticationPrincipal CustomUserDetails principal) {
        if (principal == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "ログインが必要です");
        }
        // current user を投稿者として渡す
        Post post = postService.create(principal.getUser(), req);
        return PostResponse.from(post);
    }
}