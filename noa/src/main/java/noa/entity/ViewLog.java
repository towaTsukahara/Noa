package noa.entity;

import jakarta.persistence.*;
import java.time.OffsetDateTime;

@Entity
@Table(name = "view_logs")
public class ViewLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;     // 見た人

    @Column(name = "post_id", nullable = false)
    private Long postId;     // 見られた投稿

    @Column(name = "viewed_at", nullable = false, insertable = false, updatable = false)
    private OffsetDateTime viewedAt;

    public Long getId() { return id; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public Long getPostId() { return postId; }
    public void setPostId(Long postId) { this.postId = postId; }
    public OffsetDateTime getViewedAt() { return viewedAt; }
}