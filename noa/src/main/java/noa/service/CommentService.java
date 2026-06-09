package noa.service;

import noa.dto.CommentResponse;
import noa.dto.MyCommentResponse;
import noa.dto.MyCommentResponse;
import noa.dto.CommentCreateRequest;
import noa.entity.Comment;
import noa.entity.Post;
import noa.entity.User;
import noa.repository.CommentRepository;
import noa.repository.PostRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class CommentService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;

    public CommentService(
            CommentRepository commentRepository,
            PostRepository postRepository) {

        this.commentRepository = commentRepository;
        this.postRepository = postRepository;
    }

    public Comment create(User author, CommentCreateRequest req) {

        Post post = postRepository.findById(req.getPostId())
                .orElseThrow();

        Comment comment = new Comment();

        comment.setAuthor(author);
        comment.setPost(post);
        comment.setBody(req.getBody());

        return commentRepository.save(comment);
    }

    public List<CommentResponse> getComments(Long postId) {

        return commentRepository.findByPostId(postId)
                .stream()
                .map(comment -> {
                    CommentResponse response = new CommentResponse();

                    response.setId(comment.getId());
                    response.setAuthorId(comment.getAuthor().getId());
                    response.setAuthorName(comment.getAuthor().getHandle());
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
            if (p == null || p.isDeleted()) continue; // 元投稿が消えていたらスキップ
            result.add(new MyCommentResponse(
                c.getId(),
                c.getBody(),
                c.getCreatedAt(),
                p.getId()
            ));
        }
        return result;
    }
}