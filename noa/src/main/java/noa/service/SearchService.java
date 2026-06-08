package noa.service;

import noa.dto.search.*;
import noa.entity.Post;
import noa.entity.Tag;
import noa.repository.PostRepository;
import noa.repository.TagRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class SearchService {

    private final PostRepository postRepository;
    private final TagRepository tagRepository;

    public SearchService(
            PostRepository postRepository,
            TagRepository tagRepository) {
        this.postRepository = postRepository;
        this.tagRepository = tagRepository;
    }

    public SearchResponse search(String keyword) {
        List<SearchPostResponse> posts = postRepository
                .findByBodyContainingIgnoreCase(keyword)
                .stream()
                .map(this::toPostResponse)
                .toList();
        List<SearchTagResponse> tags = tagRepository
                .findByNameContainingIgnoreCase(keyword)
                .stream()
                .map(this::toTagResponse)
                .toList();

        return new SearchResponse(posts, tags);
    }

    private SearchPostResponse toPostResponse(Post post) {
        return new SearchPostResponse(
                post.getId(),
                post.getBody());
    }

    private SearchTagResponse toTagResponse(Tag tag) {
        return new SearchTagResponse(
                tag.getId(),
                tag.getName());
    }
}
