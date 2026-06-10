package noa.service;

import noa.entity.Post;
import noa.entity.PostLike;
import noa.entity.User;
import noa.repository.LikeRepository;
import noa.repository.PostRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class LikeService {

    private final LikeRepository likeRepository;
    private final PostRepository postRepository;
    private final NotificationService notificationService;

    public LikeService(LikeRepository likeRepository, PostRepository postRepository,
                       NotificationService notificationService) {
        this.likeRepository = likeRepository;
        this.postRepository = postRepository;
        this.notificationService = notificationService;
    }

    // いいねする（既にいいね済みなら何もしない＝冪等。トグル運用でズレてもエラーにしない）
    @Transactional
    public void like(Long postId, User user) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "投稿が見つかりません"));
        if (post.isDeleted()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "投稿が見つかりません");
        }
        if (likeRepository.existsByUserIdAndPostId(user.getId(), postId)) {
            return; // 二重POSTは成功扱い（このとき通知も作らない＝重複通知を防ぐ）
        }
        PostLike like = new PostLike();
        like.setUserId(user.getId());
        like.setPostId(postId);
        likeRepository.save(like);

        // 投稿者へ通知（自分の投稿なら NotificationService 側で弾かれる）
        notificationService.create(post.getAuthor().getId(), user.getId(), postId, "LIKE");
    }

    // いいね取り消し（いいねしていなければ何もしない＝冪等）
    @Transactional
    public void unlike(Long postId, User user) {
        likeRepository.findByUserIdAndPostId(user.getId(), postId)
                .ifPresent(likeRepository::delete);
    }
}