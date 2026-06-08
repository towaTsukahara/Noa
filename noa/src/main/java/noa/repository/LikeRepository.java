package noa.repository;

import noa.entity.PostLike;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
import java.util.Optional;

public interface LikeRepository extends JpaRepository<PostLike, Long> {

    Optional<PostLike> findByUserIdAndPostId(Long userId, Long postId);

    boolean existsByUserIdAndPostId(Long userId, Long postId);

    long countByPostId(Long postId);

    // 複数投稿のうち、このユーザーがいいね済みのものを一括取得（F-112 のタイムライン用）
    List<PostLike> findByUserIdAndPostIdIn(Long userId, List<Long> postIds);

    // 自分がいいねした likes を新しい順にN件（1ページ目）
    @org.springframework.data.jpa.repository.Query(
        "select l from PostLike l where l.userId = :userId order by l.id desc")
    List<PostLike> findMyLikesFirst(Long userId, org.springframework.data.domain.Pageable pageable);

    // 同・カーソルの続き
    @org.springframework.data.jpa.repository.Query(
        "select l from PostLike l where l.userId = :userId and l.id < :cursor order by l.id desc")
    List<PostLike> findMyLikesAfter(Long userId, Long cursor, org.springframework.data.domain.Pageable pageable);

    @Query("""
        select count(l) from PostLike l, Post p where l.postId = p.id and p.author.id = :userId and p.isDeleted = false
    """)
    long countRecievedLikes(Long userId);
}