package noa.repository;

import noa.entity.ProfileUserTag;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProfileUserTagRepository extends JpaRepository<ProfileUserTag, Long> {
    boolean existsByUserIdAndTagIdAndCategory(Long userId, Long tagId, String category);
}