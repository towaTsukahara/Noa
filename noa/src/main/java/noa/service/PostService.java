package noa.service;

import noa.dto.PostCreateRequest;
import noa.entity.Post;
import noa.entity.User;
import noa.repository.PostRepository;
import org.springframework.stereotype.Service;
import noa.dto.PostResponse;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import java.util.List;
import java.util.Map;
import java.util.LinkedHashMap;

@Service
public class PostService {

    private final PostRepository postRepository;

    public PostService(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    // 通常投稿を作成する（投稿者は呼び出し側が渡す current user）
    public Post create(User author, PostCreateRequest req) {
        Post post = new Post();
        post.setAuthor(author);
        post.setBody(req.body());
        post.setParentId(null);   // 通常投稿は親なし（返信は F-109）
        // is_deleted は false がデフォルト、created_at/updated_at は DB 任せ
        return postRepository.save(post);
    }

    // タイムライン取得（カーソルページング）
    public Map<String, Object> getTimeline(Long cursor, int limit) {
        Pageable pageable = PageRequest.of(0, limit);

        List<Post> posts = (cursor == null)
                ? postRepository.findTimelineFirst(pageable)
                : postRepository.findTimelineAfter(cursor, pageable);

        // 取得した投稿を PostResponse に変換
        List<PostResponse> items = posts.stream()
                .map(PostResponse::from)
                .toList();

        // 次のカーソル: 取得結果が limit 件ちょうどなら「まだ続きがあるかも」として
        //              最後の投稿のidを返す。limit 未満なら最後のページなので null。
        Long nextCursor = (posts.size() == limit && !posts.isEmpty())
                ? posts.get(posts.size() - 1).getId()
                : null;

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("items", items);
        result.put("nextCursor", nextCursor);
        return result;
    }
}