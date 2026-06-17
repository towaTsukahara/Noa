package noa.controller;

import java.util.List;
import java.util.Map;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;

import noa.dto.SaveTagRequest;
import noa.dto.TagDetailResponse;
import noa.dto.TagResponse;
import noa.security.CustomUserDetails;
import noa.service.TagDetailService;
import noa.service.TagService;

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
    public Map<String, String> save(@Valid @RequestBody SaveTagRequest req) {

        tagService.saveTags(req);

        return Map.of("status", "ok");
    }

    @GetMapping("/tags/random")
    public List<TagResponse> randomTags(
            @RequestParam(defaultValue = "10") int limit) {

        return tagService.getRandomTags(limit);
    }
}