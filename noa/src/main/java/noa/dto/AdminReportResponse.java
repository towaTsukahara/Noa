package noa.dto;

import java.time.OffsetDateTime;

// 管理者用の通報表示
public record AdminReportResponse(
    Long id,
    String reporterHandle,   // 通報者（管理者のみ可視）
    String targetType,       // POST / COMMENT
    Long targetId,           // コメントid
    Long postId,             // 右パネルで開く投稿id
    String targetBody,       // 対象の本文（投稿/コメントの中身。削除済みなら印）
    String reason,           // 通報理由
    String status,           // PENDING / RESOLVED
    OffsetDateTime createdAt
) {}