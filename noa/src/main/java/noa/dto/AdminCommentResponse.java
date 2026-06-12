package noa.dto;

import java.time.OffsetDateTime;

// 管理者用のコメント表示
public record AdminCommentResponse(
    Long id,
    String authorHandle,
    String body,
    Long postId,        // どの投稿へのコメントか（元投稿へ辿る用）
    OffsetDateTime createdAt
) {}