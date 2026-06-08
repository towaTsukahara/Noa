package noa.controller;

import noa.dto.search.SearchResponse;
import noa.service.SearchService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class SearchController {

    private final SearchService searchService;

    public SearchController(SearchService searchService) {
        this.searchService = searchService;
    }

    @GetMapping("/api/search")
    public SearchResponse search(@RequestParam String keyword) {
        return searchService.search(keyword);
    }
}
