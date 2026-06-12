package noa.service;

import noa.dto.AdminCommentResponse;
import noa.dto.AdminPostResponse;
import noa.dto.AdminUserResponse;
import noa.entity.Post;
import noa.entity.User;
import noa.repository.CommentRepository;
import noa.repository.LikeRepository;
import noa.repository.PostRepository;
import noa.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final LikeRepository likeRepository;
    private final CommentRepository commentRepository;

    public AdminService(UserRepository userRepository, PostRepository postRepository,
                        LikeRepository likeRepository, CommentRepository commentRepository) {
        this.userRepository = userRepository;
        this.postRepository = postRepository;
        this.likeRepository = likeRepository;
        this.commentRepository = commentRepository;
    }
    // 全ユーザー一覧（管理者用・秘匿しない）
    public List<AdminUserResponse> listUsers() {
        return userRepository.findAllByOrderByIdAsc().stream()
                .map(u -> new AdminUserResponse(
                        u.getId(),
                        u.getHandle(),
                        u.getEmployeeNo(),
                        u.getEmail(),
                        u.getRole(),
                        u.getStatus(),
                        u.getCreatedAt()))
                .toList();
    }

    // 特定ユーザーの投稿一覧（管理者用・生きている投稿のみ）
    public List<AdminPostResponse> listUserPosts(Long userId) {
        User target = userRepository.findById(userId)
                .orElseThrow(() -> new org.springframework.web.server.ResponseStatusException(
                        org.springframework.http.HttpStatus.NOT_FOUND, "ユーザーが見つかりません"));

        return postRepository.findAliveByAuthor(target.getId()).stream()
                .map(p -> new AdminPostResponse(
                        p.getId(),
                        p.getAuthor().getHandle(),
                        p.getBody(),
                        (p.getTags() == null) ? List.of()
                                : p.getTags().stream().map(noa.entity.Tag::getName).toList(),
                        (int) likeRepository.countByPostId(p.getId()),
                        (int) commentRepository.countByPostId(p.getId()),
                        p.getCreatedAt()))
                .toList();
    }

    // 特定ユーザーのコメント一覧（管理者用）
    public List<AdminCommentResponse> listUserComments(Long userId) {
        User target = userRepository.findById(userId)
                .orElseThrow(() -> new org.springframework.web.server.ResponseStatusException(
                        org.springframework.http.HttpStatus.NOT_FOUND, "ユーザーが見つかりません"));

        return commentRepository.findByAuthorIdOrderByIdDesc(target.getId()).stream()
                .map(c -> new AdminCommentResponse(
                        c.getId(),
                        c.getAuthor().getHandle(),
                        c.getBody(),
                        c.getPost().getId(),
                        c.getCreatedAt()))
                .toList();
    }

    // ユーザーを停止する（status を SUSPENDED に）
    @org.springframework.transaction.annotation.Transactional
    public void suspendUser(Long userId, User admin) {
        User target = userRepository.findById(userId)
                .orElseThrow(() -> new org.springframework.web.server.ResponseStatusException(
                        org.springframework.http.HttpStatus.NOT_FOUND, "ユーザーが見つかりません"));

        // 自分自身は停止できない（管理者が自分を締め出す事故を防ぐ）
        if (target.getId().equals(admin.getId())) {
            throw new org.springframework.web.server.ResponseStatusException(
                    org.springframework.http.HttpStatus.BAD_REQUEST, "自分自身は停止できません");
        }
        target.setStatus("SUSPENDED");
        userRepository.save(target);
    }

    // ユーザーの停止を解除する（status を ACTIVE に）
    @org.springframework.transaction.annotation.Transactional
    public void activateUser(Long userId) {
        User target = userRepository.findById(userId)
                .orElseThrow(() -> new org.springframework.web.server.ResponseStatusException(
                        org.springframework.http.HttpStatus.NOT_FOUND, "ユーザーが見つかりません"));
        target.setStatus("ACTIVE");
        userRepository.save(target);
    }

    // 管理者による投稿削除（他人の投稿でも論理削除できる）
    @org.springframework.transaction.annotation.Transactional
    public void deletePost(Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new org.springframework.web.server.ResponseStatusException(
                        org.springframework.http.HttpStatus.NOT_FOUND, "投稿が見つかりません"));
        post.setDeleted(true);
        post.setDeletedAt(java.time.OffsetDateTime.now());
        postRepository.save(post);
    }

    // 管理者によるコメント削除（他人のコメントでも・物理削除）
    @org.springframework.transaction.annotation.Transactional
    public void deleteComment(Long commentId) {
        var comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new org.springframework.web.server.ResponseStatusException(
                        org.springframework.http.HttpStatus.NOT_FOUND, "コメントが見つかりません"));
        commentRepository.delete(comment);
    }
}