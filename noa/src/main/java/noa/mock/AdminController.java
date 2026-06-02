package noa.mock;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
@Tag(name = "管理者")
public class AdminController {

    @Operation(summary = "全投稿一覧（モック・ADMIN）")
    @GetMapping("/admin/posts")
    public Map<String, Object> posts() {
        return MockData.page(List.of(
                MockData.post(1, "Noa-001", null, "Spring Bootの@Transactionalの話", 3, false, 2),
                MockData.post(22, "Noa-005", null, "（削除済みの投稿）", 0, false, 0)
        ), null);
    }

    @Operation(summary = "投稿/返信の非表示・削除（モック・ADMIN）")
    @DeleteMapping("/admin/posts/{id}")
    public Map<String, Object> deletePost(@PathVariable long id) {
        return MockData.ok();
    }

    @Operation(summary = "全ユーザー一覧（モック・ADMIN）")
    @GetMapping("/admin/users")
    public Map<String, Object> users() {
        return MockData.page(List.of(
                adminUser("Noa-001", "ADMIN", "ACTIVE"),
                adminUser("Noa-002", "USER", "ACTIVE"),
                adminUser("Noa-003", "USER", "DISABLED")
        ), null);
    }

    @Operation(summary = "ユーザーの有効化/無効化（モック・ADMIN）")
    @PatchMapping("/admin/users/{handle}/status")
    public Map<String, Object> setStatus(@PathVariable String handle,
                                         @RequestBody(required = false) Map<String, Object> body) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("handle", handle);
        m.put("status", "DISABLED");
        return m;
    }

    private static Map<String, Object> adminUser(String handle, String role, String status) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("handle", handle);
        m.put("role", role);
        m.put("status", status);
        return m;
    }
}
