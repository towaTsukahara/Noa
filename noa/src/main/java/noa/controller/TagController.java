package noa.controller;

import java.util.List;
import org.springframework.web.bind.annotation.*;
import noa.dto.TagResponse;
import noa.service.TagService;

@RestController
@RequestMapping("/api/v1")
public class TagController {
    private final TagService tagService;

    public TagController(TagService tagService){
        this.tagService=tagService;
    }

    @GetMapping("/tags")
    public List<TagResponse> search(@RequestParam(required = false) String q){
        return tagService.search(q);
    }
}
