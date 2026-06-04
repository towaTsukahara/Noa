package noa.service;

import noa.dto.PostCreateRequest;
import noa.entity.Post;
import noa.entity.User;
import noa.repository.PostRepository;
import org.springframework.stereotype.Service;
import noa.dto.PostResponse;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.time.OffsetDateTime;
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

        // 投稿を論理削除する（本人のみ）
    public void delete(Long postId, User requester) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "投稿が見つかりません"));

        // 削除済みのものは「存在しない」扱い
        if (post.isDeleted()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "投稿が見つかりません");
        }

        // 作者チェック: 自分の投稿だけ削除できる
        if (!post.getAuthor().getId().equals(requester.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "自分の投稿のみ削除できます");
        }

        post.setDeleted(true);
        post.setDeletedAt(OffsetDateTime.now());
        postRepository.save(post);
    }
}