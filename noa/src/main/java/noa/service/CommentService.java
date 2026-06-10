package noa.service;

import noa.dto.CommentResponse;
import noa.dto.MyCommentResponse;
import noa.dto.CommentCreateRequest;
import noa.entity.Comment;
import noa.entity.Post;
import noa.entity.User;
import noa.repository.CommentRepository;
import noa.repository.PostRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import jakarta.transaction.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class CommentService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final NotificationService notificationService;
    private final NicknameService nicknameService;

    public CommentService(
            CommentRepository commentRepository,
            PostRepository postRepository,
            NotificationService notificationService,
            NicknameService nicknameService) {
        this.commentRepository = commentRepository;
        this.postRepository = postRepository;
        this.notificationService = notificationService;
        this.nicknameService = nicknameService;
    }

    @Transactional
    public Comment create(User author, CommentCreateRequest req) {
        Post post = postRepository.findById(req.getPostId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "投稿が見つかりません"));

        Comment comment = new Comment();
        comment.setAuthor(author);
        comment.setPost(post);
        comment.setBody(req.getBody());
        Comment saved = commentRepository.save(comment);

        // 投稿者へ通知（自分の投稿への自分のコメントは NotificationService 側で弾かれる）
        notificationService.create(post.getAuthor().getId(), author.getId(), post.getId(), "REPLY");

        return saved;
    }

    public List<CommentResponse> getComments(Long postId, User viewer) {
        // viewer が付けたニックネーム辞書（handle → nickname）
        java.util.Map<String, String> nickMap = nicknameService.nicknameMapOf(viewer);

        return commentRepository.findByPostId(postId)
                .stream()
                .map(comment -> {
                    CommentResponse response = new CommentResponse();

                    String handle = comment.getAuthor().getHandle();
                    response.setId(comment.getId());
                    response.setAuthorId(comment.getAuthor().getId());
                    response.setAuthorName(handle);
                    response.setAuthorNickname(nickMap.get(handle)); // 呼び名（なければ null）
                    response.setBody(comment.getBody());
                    response.setCreatedAt(comment.getCreatedAt());

                    return response;
                })
                .toList();
    }

    public List<MyCommentResponse> getMyComments(User user) {
        List<MyCommentResponse> result = new ArrayList<>();
        for (Comment c : commentRepository.findByAuthorIdOrderByIdDesc(user.getId())) {
            Post p = c.getPost();
            if (p == null || p.isDeleted())
                continue; // 元投稿が消えていたらスキップ
            result.add(new MyCommentResponse(
                    c.getId(),
                    c.getBody(),
                    c.getCreatedAt(),
                    p.getId()));
        }
        return result;
    }

    // コメント削除（本人のみ・物理削除）
    @jakarta.transaction.Transactional
    public void delete(Long commentId, User requester) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new org.springframework.web.server.ResponseStatusException(
                        org.springframework.http.HttpStatus.NOT_FOUND, "コメントが見つかりません"));

        // 作者チェック: 自分のコメントだけ削除できる
        if (!comment.getAuthor().getId().equals(requester.getId())) {
            throw new org.springframework.web.server.ResponseStatusException(
                    org.springframework.http.HttpStatus.FORBIDDEN, "自分のコメントのみ削除できます");
        }
        commentRepository.delete(comment);
    }
}