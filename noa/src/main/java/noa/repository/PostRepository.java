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

    // 特定ユーザーの通常投稿(未削除)を新しい順にN件（1ページ目）
    @Query("select p from Post p where p.author.id = :authorId and p.parentId is null and p.isDeleted = false order by p.id desc")
    List<Post> findUserPostsFirst(Long authorId, Pageable pageable);

    // 同・カーソルの続き（cursorより小さいid）
    @Query("select p from Post p where p.author.id = :authorId and p.parentId is null and p.isDeleted = false and p.id < :cursor order by p.id desc")
    List<Post> findUserPostsAfter(Long authorId, Long cursor, Pageable pageable);

    // 投稿への返信数（未削除のみ）
    @Query("select count(p) from Post p where p.parentId = :parentId and p.isDeleted = false")
    long countReplies(Long parentId);
    //  ここから下、付け足した部分

    // 返信一覧（1ページ目）: parent_id = この投稿、未削除、新しい順
    @Query("select p from Post p where p.parentId = :parentId and p.isDeleted = false order by p.id desc")
    List<Post> findRepliesFirst(Long parentId, Pageable pageable);

    // 返信一覧（続き）: cursor より小さい id
    @Query("select p from Post p where p.parentId = :parentId and p.isDeleted = false and p.id < :cursor order by p.id desc")
    List<Post> findRepliesAfter(Long parentId, Long cursor, Pageable pageable);

    //投稿数カウント用
    long countByAuthorIdAndParentIdIsNullAndIsDeletedFalse(Long authorId);

    //検索機能用
    List<Post> findByBodyContainingIgnoreCase(String keyword);
}