package noa.repository;

import noa.entity.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;
import java.util.List;

public interface TagRepository extends JpaRepository<Tag, Long> {

    Optional<Tag> findByName(String name);

    // 名前検索（オートコンプリートとか）
    List<Tag> findByNameContainingIgnoreCaseOrderByName(String q);

    // 検索機能用
    List<Tag> findByNameContainingIgnoreCase(String keyword);

    //空検索時、ランダム取得
    @Query( value = " select * from tags order by random() limit :limit ", nativeQuery = true)
    List<Tag> findRandomTags(int limit);
}