package noa.entity;

import jakarta.persistence.*;
import java.time.OffsetDateTime;

@Entity
@Table(name = "reports")
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "reporter_id", nullable = false)
    private Long reporterId;        // 通報者（管理者のみ可視）

    @Column(name = "target_type", nullable = false, length = 10)
    private String targetType;      // "POST" / "COMMENT"

    @Column(name = "target_id", nullable = false)
    private Long targetId;          // 投稿id または コメントid

    @Column(length = 500)
    private String reason;          // 任意

    @Column(nullable = false, length = 10)
    private String status = "PENDING";  // PENDING / RESOLVED

    @Column(name = "created_at", nullable = false, insertable = false, updatable = false)
    private OffsetDateTime createdAt;

    public Long getId() { return id; }
    public Long getReporterId() { return reporterId; }
    public void setReporterId(Long reporterId) { this.reporterId = reporterId; }
    public String getTargetType() { return targetType; }
    public void setTargetType(String targetType) { this.targetType = targetType; }
    public Long getTargetId() { return targetId; }
    public void setTargetId(Long targetId) { this.targetId = targetId; }
    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public OffsetDateTime getCreatedAt() { return createdAt; }
}