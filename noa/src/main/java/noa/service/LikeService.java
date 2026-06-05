package noa.service;

import noa.entity.Post;
import noa.entity.PostLike;
import noa.entity.User;
import noa.repository.LikeRepository;
import noa.repository.PostRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import jakarta.transaction.Transactional;

@Service
public class LikeService {

    private final LikeRepository likeRepository;
    private final PostRepository postRepository;

    public LikeService(LikeRepository likeRepository, PostRepository postRepository) {
        this.likeRepository = likeRepository;
        this.postRepository = postRepository;
    }

    // いいねする（既にいいね済みなら何もしない＝冪等。トグル運用でズレてもエラーにしない）
    public void like(Long postId, User user) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "投稿が見つかりません"));
        if (post.isDeleted()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "投稿が見つかりません");
        }
        if (likeRepository.existsByUserIdAndPostId(user.getId(), postId)) {
            return; // 二重POSTは成功扱い
        }
        PostLike like = new PostLike();
        like.setUserId(user.getId());
        like.setPostId(postId);
        likeRepository.save(like);
    }

    // いいね取り消し（いいねしていなければ何もしない＝冪等）
    @Transactional
    public void unlike(Long postId, User user) {
        likeRepository.findByUserIdAndPostId(user.getId(), postId)
                .ifPresent(likeRepository::delete);
    }
}