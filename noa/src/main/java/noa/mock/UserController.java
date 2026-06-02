package noa.mock;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
@Tag(name = "プロフィール・ユーザー")
public class UserController {

    @Operation(summary = "プロフィール設定・更新（モック）")
    @PutMapping("/me/profile")
    public Map<String, Object> updateProfile(@RequestBody(required = false) Map<String, Object> body) {
        return MockData.me();
    }

    @Operation(summary = "ユーザーの公開プロフィール（モック）")
    @GetMapping("/users/{handle}")
    public Map<String, Object> getUser(@PathVariable String handle) {
        return MockData.userSummary(handle, "Reactの人", "フロント中心。Reactすき");
    }

    @Operation(summary = "そのユーザーの投稿一覧（モック）")
    @GetMapping("/users/{handle}/posts")
    public Map<String, Object> userPosts(@PathVariable String handle) {
        return MockData.page(List.of(
                MockData.post(11, handle, null, "プロフィールからの投稿その1", 2, false, 0),
                MockData.post(12, handle, null, "プロフィールからの投稿その2", 0, false, 1)
        ), null);
    }
}
