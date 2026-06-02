package noa.mock;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
@Tag(name = "通知")
public class NotificationController {

    @Operation(summary = "通知一覧（モック）")
    @GetMapping("/notifications")
    public Map<String, Object> list() {
        return MockData.page(List.of(
                MockData.notification(77, "LIKE", "Noa-002", 1, "Springの@Transactional…", false),
                MockData.notification(76, "REPLY", "Noa-003", 23, "サービス層に付けています…", true)
        ), null);
    }

    @Operation(summary = "未読数（モック）")
    @GetMapping("/notifications/unread-count")
    public Map<String, Object> unreadCount() {
        Map<String, Object> m = new java.util.LinkedHashMap<>();
        m.put("count", 3);
        return m;
    }

    @Operation(summary = "1件を既読化（モック）")
    @PostMapping("/notifications/{id}/read")
    public Map<String, Object> read(@PathVariable long id) {
        return MockData.ok();
    }

    @Operation(summary = "全件既読化（モック）")
    @PostMapping("/notifications/read-all")
    public Map<String, Object> readAll() {
        return MockData.ok();
    }
}
