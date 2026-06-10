package noa.dto;

import java.time.OffsetDateTime;

// 通知（「誰が」は含めない。種別・対象投稿・既読のみ）
public record NotificationResponse(
    Long id,
    String type,         // "LIKE" / "REPLY"
    Long postId,         // クリックで飛ぶ先
    String postBody,     // 対象投稿の本文（冒頭表示用）
    boolean isRead,
    OffsetDateTime createdAt
) {}