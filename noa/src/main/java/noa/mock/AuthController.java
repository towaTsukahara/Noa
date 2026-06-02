package noa.mock;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1")
@Tag(name = "認証")
public class AuthController {

    @Operation(summary = "アカウント登録（モック）")
    @PostMapping("/auth/register")
    public Map<String, Object> register(@RequestBody(required = false) Map<String, Object> body) {
        return MockData.me();
    }

    @Operation(summary = "ログイン（モック）")
    @PostMapping("/auth/login")
    public Map<String, Object> login(@RequestBody(required = false) Map<String, Object> body) {
        return MockData.me();
    }

    @Operation(summary = "ログアウト（モック）")
    @PostMapping("/auth/logout")
    public Map<String, Object> logout() {
        return MockData.ok();
    }

    @Operation(summary = "自分の情報（モック）")
    @GetMapping("/me")
    public Map<String, Object> me() {
        return MockData.me();
    }
}
