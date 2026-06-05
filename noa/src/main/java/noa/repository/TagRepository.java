package noa.repository;

import noa.entity.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;

public interface TagRepository extends JpaRepository<Tag, Long> {

    Optional<Tag> findByName(String name);
    // 名前検索（オートコンプリートとか）
    List<Tag> findByNameContainingIgnoreCaseOrderByName(String q);

}