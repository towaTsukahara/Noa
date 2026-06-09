package noa.dto;

import java.time.OffsetDateTime;

// 「自分のコメント」一覧用。本文＋飛ぶ先の投稿id だけ。
public record MyCommentResponse(
    Long commentId,
    String commentBody,
    OffsetDateTime commentedAt,
    Long postId            // クリックで飛ぶ先（元投稿の詳細）
) {}