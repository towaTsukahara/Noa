package noa.dto;

import java.time.OffsetDateTime;

// 統一エラーレスポンス（全APIのエラーをこの形で返す）
public record ErrorResponse(
    int status,
    String message,
    String path,
    OffsetDateTime timestamp
) {}