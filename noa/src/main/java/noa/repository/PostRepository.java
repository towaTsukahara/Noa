package noa.repository;

import noa.entity.Post;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {

    // 1ページ目: 通常投稿(parent_id is null)・未削除を、新しい順にN件
    @Query("select p from Post p where p.parentId is null and p.isDeleted = false order by p.id desc")
    List<Post> findTimelineFirst(Pageable pageable);

    // 2ページ目以降: 指定id(cursor)より小さいものを、新しい順にN件
    @Query("select p from Post p where p.parentId is null and p.isDeleted = false and p.id < :cursor order by p.id desc")
    List<Post> findTimelineAfter(Long cursor, Pageable pageable);
}