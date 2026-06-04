package noa.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import noa.entity.ProfileUserTag;

public interface ProfileUserTagRepository extends JpaRepository<ProfileUserTag, Long> {
}