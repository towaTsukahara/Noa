package noa.dto;

import java.time.OffsetDateTime;

// 管理者用のユーザー情報（秘匿しない。一般の UserSummary とは別物）
public record AdminUserResponse(
    Long id,
    String handle,
    String employeeNo,
    String email,
    String role,
    String status,
    OffsetDateTime createdAt
) {}