package noa.service;

import noa.dto.PostCreateRequest;
import noa.entity.Post;
import noa.entity.User;
import noa.entity.PostLike;
import noa.repository.LikeRepository;
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
import java.util.Set;
import java.util.stream.Collectors;
import java.util.ArrayList;

@Service
public class PostService {

        private final PostRepository postRepository;
        private final LikeRepository likeRepository;

        public PostService(PostRepository postRepository, LikeRepository likeRepository) {
                this.postRepository = postRepository;
                this.likeRepository = likeRepository;
        }

        // 通常投稿を作成する（投稿者は呼び出し側が渡す current user）
        public Post create(User author, PostCreateRequest req) {
                Post post = new Post();
                post.setAuthor(author);
                post.setBody(req.body());
                post.setParentId(null); // 通常投稿は親なし（返信は F-109）
                // is_deleted は false がデフォルト、created_at/updated_at は DB 任せ
                return postRepository.save(post);
        }

        // 特定ユーザーの投稿一覧（カーソルページング）
        public Map<String, Object> getUserPosts(User author, Long cursor, int limit, User viewer) {
                Pageable pageable = PageRequest.of(0, limit);
                List<Post> posts = (cursor == null)
                                ? postRepository.findUserPostsFirst(author.getId(), pageable)
                                : postRepository.findUserPostsAfter(author.getId(), cursor, pageable);
                return buildPageResponse(posts, limit, viewer);
        }

        // 共通: 投稿リストを items + nextCursor の形に組み立てる
        // 共通: 投稿リストを items + nextCursor の形に組み立てる（likeCount/likedByMe を実数で）
        private Map<String, Object> buildPageResponse(List<Post> posts, int limit, User viewer) {
                List<Long> postIds = posts.stream().map(Post::getId).toList();

                // 閲覧者がいいね済みの投稿idを、1クエリでまとめて取得
                Set<Long> likedIds = postIds.isEmpty()
                                ? Set.of()
                                : likeRepository.findByUserIdAndPostIdIn(viewer.getId(), postIds).stream()
                                                .map(PostLike::getPostId)
                                                .collect(Collectors.toSet());

                List<PostResponse> items = posts.stream()
                                .map(p -> PostResponse.from(
                                                p,
                                                likeRepository.countByPostId(p.getId()),
                                                likedIds.contains(p.getId()),
                                                postRepository.countReplies(p.getId()) // 返信数
                                ))
                                .toList();

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

        // タイムライン取得（カーソルページング）
        public Map<String, Object> getTimeline(Long cursor, int limit, User viewer) {
                Pageable pageable = PageRequest.of(0, limit);
                List<Post> posts = (cursor == null)
                                ? postRepository.findTimelineFirst(pageable)
                                : postRepository.findTimelineAfter(cursor, pageable);
                return buildPageResponse(posts, limit, viewer);
        }

        // 自分がいいねした投稿一覧（いいねした順・カーソルページング）
    public Map<String, Object> getMyLikes(User viewer, Long cursor, int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        List<PostLike> likes = (cursor == null)
                ? likeRepository.findMyLikesFirst(viewer.getId(), pageable)
                : likeRepository.findMyLikesAfter(viewer.getId(), cursor, pageable);

        // いいね順を保ったまま投稿を取得（削除済みは除外）
        List<Post> posts = new ArrayList<>();
        for (PostLike like : likes) {
            postRepository.findById(like.getPostId())
                    .filter(p -> !p.isDeleted())
                    .ifPresent(posts::add);
        }

        List<PostResponse> items = posts.stream()
                .map(p -> PostResponse.from(
                        p,
                        likeRepository.countByPostId(p.getId()),
                        true,
                        postRepository.countReplies(p.getId())
                ))
                .toList();

        // カーソルは likes の id（いいね順のしおり）
        Long nextCursor = (likes.size() == limit && !likes.isEmpty())
                ? likes.get(likes.size() - 1).getId()
                : null;

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("items", items);
        result.put("nextCursor", nextCursor);
        return result;
    }
}