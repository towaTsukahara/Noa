package noa.service;

import noa.entity.ViewLog;
import noa.repository.ViewLogRepository;
import org.springframework.stereotype.Service;

@Service
public class ViewLogService {

    private final ViewLogRepository viewLogRepository;

    public ViewLogService(ViewLogRepository viewLogRepository) {
        this.viewLogRepository = viewLogRepository;
    }

    // 閲覧を記録する。失敗しても投稿表示を止めないため、例外は握りつぶす。
    public void record(Long userId, Long postId) {
        try {
            ViewLog log = new ViewLog();
            log.setUserId(userId);
            log.setPostId(postId);
            viewLogRepository.save(log);
        } catch (Exception e) {
            // ログ記録の失敗は本機能を止めない（監査ログのため握りつぶす）
            // 必要ならここでログ出力（System.err等）
        }
    }
}