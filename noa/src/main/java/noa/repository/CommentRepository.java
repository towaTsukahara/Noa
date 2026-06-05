package noa.repository;

import noa.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {

    @Query("""
        select c
        from Comment c
        where c.post.id = :postId
        order by c.id asc
    """)
    List<Comment> findByPostId(Long postId);
}