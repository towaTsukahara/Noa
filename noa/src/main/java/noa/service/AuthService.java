package noa.service;

import noa.dto.RegisterRequest;
import noa.entity.User;
import noa.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {

    private final UserRepository userRepository;

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User register(RegisterRequest req) {
        // 重複チェック
        if (userRepository.existsByEmail(req.email())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "このメールアドレスは既に登録されています");
        }
        if (userRepository.existsByEmployeeNo(req.employeeNo())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "この社員番号は既に登録されています");
        }

        User user = new User();
        user.setEmployeeNo(req.employeeNo());
        user.setEmail(req.email());
        user.setPassword(req.password());   // 開発段階は平文（後でハッシュ化）
        user.setRole("USER");
        user.setStatus("ACTIVE");
        user.setEmailVerified(true);         // フェーズ1はメール確認なしで即有効
        user.setHandle(generateNextHandle());

        return userRepository.save(user);
    }

        private String generateNextHandle() {
        long next = userRepository.findMaxHandleNumber()
                .map(n -> n + 1)
                .orElse(1L);
        return String.format("Noa-%03d", next);
    }
}