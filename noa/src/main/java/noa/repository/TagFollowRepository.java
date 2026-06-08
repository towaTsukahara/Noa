package noa.repository;

import noa.entity.TagFollow;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface TagFollowRepository extends JpaRepository<TagFollow, Long> {

    Optional<TagFollow> findByUserIdAndTagId(Long userId, Long tagId);

    boolean existsByUserIdAndTagId(Long userId, Long tagId);

    // 自分がフォロー中のタグ（新しい順）
    List<TagFollow> findByUserIdOrderByIdDesc(Long userId);
}