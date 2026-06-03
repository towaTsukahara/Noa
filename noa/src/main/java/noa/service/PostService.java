package noa.service;

import noa.dto.PostCreateRequest;
import noa.entity.Post;
import noa.entity.User;
import noa.repository.PostRepository;
import org.springframework.stereotype.Service;

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
}