package noa.controller;

import java.util.Map;
import jakarta.validation.Valid;
import noa.dto.PostCreateRequest;
import noa.dto.PostResponse;
import noa.dto.search.SearchResponse;
import noa.entity.Post;
import noa.security.CustomUserDetails;
import noa.service.PostService;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

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
        return PostResponse.from(post, 0, false, 0, null); // 新規投稿はいいね0・未いいね
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

    //空検索時、最新10件表示用
    @GetMapping("/search/recent-posts")
    public SearchResponse recentPosts(
            @RequestParam(defaultValue = "10") int limit,
            @AuthenticationPrincipal CustomUserDetails principal) {

        if (principal == null) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "ログインが必要です");
        }

        return postService.getRecentPosts(
                principal.getUser(),
                limit);
    }
}
