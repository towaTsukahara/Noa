package noa.repository;

import noa.entity.PostLike;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface LikeRepository extends JpaRepository<PostLike, Long> {

    Optional<PostLike> findByUserIdAndPostId(Long userId, Long postId);

    boolean existsByUserIdAndPostId(Long userId, Long postId);
    
    long countByPostId(Long postId);

    // 複数投稿のうち、このユーザーがいいね済みのものを一括取得（F-112 のタイムライン用）
    List<PostLike> findByUserIdAndPostIdIn(Long userId, List<Long> postIds);
}