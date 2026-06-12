package noa.dto;

import java.time.OffsetDateTime;
import java.util.List;

// 管理者用の投稿表示（誰がいいねしたか等のviewer依存情報は持たない）
public record AdminPostResponse(
    Long id,
    String authorHandle,
    String body,
    List<String> tags,
    int likeCount,
    int replyCount,
    OffsetDateTime createdAt
) {}