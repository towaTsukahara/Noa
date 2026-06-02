package noa.mock;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/v1")
@Tag(name = "ヘルスチェック")
public class PingController {

    @Operation(summary = "疎通確認")
    @GetMapping("/ping")
    public Map<String, String> ping() {
        return Map.of("status", "ok", "service", "noa");
    }
}
