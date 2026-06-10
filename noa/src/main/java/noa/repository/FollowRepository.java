package noa.repository;

import noa.entity.Follow;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
import java.util.Optional;

public interface FollowRepository extends JpaRepository<Follow, Long> {

    Optional<Follow> findByFollowerIdAndFolloweeId(Long followerId, Long followeeId);

    boolean existsByFollowerIdAndFolloweeId(Long followerId, Long followeeId);

    // 自分がフォロー中の一覧（フォローした順の新しい順・カーソルページング）
    @Query("select f from Follow f where f.followerId = :followerId order by f.id desc")
    List<Follow> findFollowingFirst(Long followerId, Pageable pageable);

    @Query("select f from Follow f where f.followerId = :followerId and f.id < :cursor order by f.id desc")
    List<Follow> findFollowingAfter(Long followerId, Long cursor, Pageable pageable);

    java.util.List<Follow> findByFollowerId(Long followerId);
}