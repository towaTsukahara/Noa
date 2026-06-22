package noa.service;

import noa.dto.PostResponse;
import noa.dto.search.*;
import noa.entity.Post;
import noa.entity.Tag;
import noa.entity.User;
import noa.repository.LikeRepository;
import noa.repository.PostRepository;
import noa.repository.TagRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Map;

@Service
public class SearchService {

    private final LikeRepository likeRepository;
    private final PostRepository postRepository;
    private final TagRepository tagRepository;
    private final NicknameService nicknameService;

    public SearchService(
            PostRepository postRepository,
            TagRepository tagRepository,
            LikeRepository likeRepository,
            NicknameService nicknameService) {
        this.postRepository = postRepository;
        this.tagRepository = tagRepository;
        this.likeRepository = likeRepository;
        this.nicknameService = nicknameService;
    }

    public SearchResponse search(String keyword, int limit, User viewer) {
        // viewer が付けたニックネーム辞書（handle → nickname）を1回だけ取得
        Map<String, String> nickMap = nicknameService.nicknameMapOf(viewer);

        List<Post> matchedPosts = postRepository.searchPosts(keyword);

        boolean hasMore = matchedPosts.size() > limit;

        List<PostResponse> posts = matchedPosts
                .stream()
                .limit(limit)
                .map(post -> {
                    long likeCount = likeRepository.countByPostId(post.getId());
                    long replyCount = postRepository.countReplies(post.getId());
                    boolean likedByMe = likeRepository.existsByUserIdAndPostId(viewer.getId(), post.getId());

                    return PostResponse.from(post, likeCount, likedByMe, replyCount,
                            nickMap.get(post.getAuthor().getHandle()));
                })
                .toList();
        List<SearchTagResponse> tags = tagRepository
                .findByNameContainingIgnoreCase(keyword)
                .stream()
                .map(this::toTagResponse)
                .toList();

        return new SearchResponse(posts, tags, hasMore);
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
