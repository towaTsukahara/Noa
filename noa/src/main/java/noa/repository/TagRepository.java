package noa.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import noa.entity.Tag;

public interface TagRepository extends JpaRepository<Tag, Long> {
}