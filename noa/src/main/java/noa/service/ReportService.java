package noa.service;

import noa.dto.ReportRequest;
import noa.entity.Report;
import noa.entity.User;
import noa.repository.CommentRepository;
import noa.repository.PostRepository;
import noa.repository.ReportRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ReportService {

    private final ReportRepository reportRepository;
    private final PostRepository postRepository;
    private final CommentRepository commentRepository;

    public ReportService(ReportRepository reportRepository, PostRepository postRepository,
                         CommentRepository commentRepository) {
        this.reportRepository = reportRepository;
        this.postRepository = postRepository;
        this.commentRepository = commentRepository;
    }

    // 通報を作成する
    @Transactional
    public void create(User reporter, ReportRequest req) {
        String type = req.getTargetType();
        Long targetId = req.getTargetId();

        // 対象種別のバリデーション
        if (!"POST".equals(type) && !"COMMENT".equals(type)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "通報対象の種別が不正です");
        }

        // 対象が実在するか確認
        boolean exists = "POST".equals(type)
                ? postRepository.findById(targetId).filter(p -> !p.isDeleted()).isPresent()
                : commentRepository.findById(targetId).isPresent();
        if (!exists) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "通報対象が見つかりません");
        }

        // 重複通報チェック（1人1対象1回）
        if (reportRepository.existsByReporterIdAndTargetTypeAndTargetId(reporter.getId(), type, targetId)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "すでに通報済みです");
        }

        Report report = new Report();
        report.setReporterId(reporter.getId());
        report.setTargetType(type);
        report.setTargetId(targetId);
        report.setReason(req.getReason());
        // status は "PENDING" がデフォルト
        reportRepository.save(report);
    }
}