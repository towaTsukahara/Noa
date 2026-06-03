package noa.service;

import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import noa.dto.ProfileOwnPostResponse;
import noa.entity.ProfileOwnPost;
import noa.repository.ProfileOwnPostRepository;

@Service
public class ProfileOwnPostService {

    private final ProfileOwnPostRepository profileOwnPostRepository;

    public ProfileOwnPostService(ProfileOwnPostRepository profileOwnPostRepository) {
        this.profileOwnPostRepository = profileOwnPostRepository;
    }

    public ProfileOwnPostResponse getProfileOwnPost(Long id) {
        ProfileOwnPost profileOwnPost = profileOwnPostRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "投稿がありません"));
        return ProfileOwnPostResponse.from(profileOwnPost);
    }
}
