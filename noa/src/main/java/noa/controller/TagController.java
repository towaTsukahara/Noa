package noa.controller;

import java.util.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import noa.dto.TagResponse;
import noa.dto.TagDetailResponse;
import noa.security.CustomUserDetails;
import noa.service.TagService;
import noa.service.TagDetailService;
import noa.dto.SaveTagRequest;

@RestController
@RequestMapping("/api/v1")
public class TagController {
    private final TagService tagService;
    private final TagDetailService tagDetailService;

    public TagController(
            TagService tagService,
            TagDetailService tagDetailService) {
        this.tagService = tagService;
        this.tagDetailService = tagDetailService;
    }

    @GetMapping("/tags")
    public List<TagResponse> search(@RequestParam(required = false) String q) {
        return tagService.search(q);
    }

    @GetMapping("/tags/{id}")
    public TagDetailResponse getTag(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails principal) {
        return tagDetailService.getTag(principal.getUser(), id);
    }

    // タグ名で詳細を引く（プロフィールの文字列タグから飛ぶ用）
    @GetMapping("/tags/by-name/{name}")
    public TagDetailResponse getTagByName(
            @PathVariable String name,
            @AuthenticationPrincipal CustomUserDetails principal) {
        return tagDetailService.getTagByName(principal.getUser(), name);
    }

    @PostMapping("/tags/save")
    public Map<String, String> save(@RequestBody SaveTagRequest req) {
        tagService.saveTags(req);

        return Map.of("status", "ok");
    }

    // 空検索時、ランダムで10件表示
    @GetMapping("/tags/random")
    public List<TagResponse> randomTags(
            @RequestParam(defaultValue = "10") int limit) {

        return tagService.getRandomTags(limit);
    }
}