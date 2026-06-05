package noa.repository;

import noa.entity.PostTag;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PostTagRepository extends JpaRepository<PostTag, Long> {

    // 投稿に紐づくタグ一覧
    List<PostTag> findByPostId(Long postId);

    // タグに紐づく投稿（タグ検索）
    List<PostTag> findByTagId(Long tagId);

}