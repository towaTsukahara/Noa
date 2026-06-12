package noa.dto;

// 通報リクエスト（一般ユーザーが投稿/コメントを通報）
public class ReportRequest {
    private String targetType; // "POST" / "COMMENT"
    private Long targetId;     // 投稿id または コメントid
    private String reason;     // 理由（任意）

    public String getTargetType() { return targetType; }
    public void setTargetType(String targetType) { this.targetType = targetType; }
    public Long getTargetId() { return targetId; }
    public void setTargetId(Long targetId) { this.targetId = targetId; }
    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
}