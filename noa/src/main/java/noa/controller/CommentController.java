package noa.controller;

import noa.dto.CommentCreateRequest;
import noa.dto.CommentResponse;
import noa.entity.Comment;
import noa.security.CustomUserDetails;
import noa.service.CommentService;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/v1/comments")
public class CommentController {

    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @GetMapping
    public List<CommentResponse> getComments(
            @RequestParam Long postId) {

        return commentService.getComments(postId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Comment create(
            @RequestBody CommentCreateRequest request,
            @AuthenticationPrincipal CustomUserDetails principal) {

        if (principal == null) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "ログインが必要です");
        }

        return commentService.create(
                principal.getUser(),
                request);
    }
}