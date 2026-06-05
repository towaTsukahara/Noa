package noa.controller;

import java.util.Map;
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
        return PostResponse.from(post, 0, false, 0);  // 新規投稿はいいね0・未いいね
    }

    // 投稿削除（論理削除・本人のみ）
    @DeleteMapping("/posts/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails principal) {
        if (principal == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "ログインが必要です");
        }
        postService.delete(id, principal.getUser());
    }

    @GetMapping("/posts/{id}")
    public PostResponse get(@PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails principal) {
        if (principal == null)
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "ログインが必要です");
        return postService.getPost(id, principal.getUser());
    }

    // 返信一覧
    @GetMapping("/posts/{id}/replies")
    public Map<String, Object> replies(@PathVariable Long id,
            @RequestParam(required = false) Long cursor,
            @RequestParam(defaultValue = "20") int limit,
            @AuthenticationPrincipal CustomUserDetails principal) {
        if (principal == null)
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "ログインが必要です");
        return postService.getReplies(id, cursor, limit, principal.getUser());
    }

    // 返信作成（入力は投稿作成と同じ PostCreateRequest を再利用）
    @PostMapping("/posts/{id}/replies")
    @ResponseStatus(HttpStatus.CREATED)
    public PostResponse reply(@PathVariable Long id,
            @Valid @RequestBody PostCreateRequest req,
            @AuthenticationPrincipal CustomUserDetails principal) {
        if (principal == null)
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "ログインが必要です");
        Post reply = postService.createReply(id, principal.getUser(), req);
        return PostResponse.from(reply, 0, false); // 新規返信はいいね0・未いいね
    }
}