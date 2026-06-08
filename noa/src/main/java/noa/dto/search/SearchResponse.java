package noa.dto.search;

import java.util.List;

public record SearchResponse(
    List<SearchPostResponse> posts,
    List<SearchTagResponse> tags
) {
    
}
