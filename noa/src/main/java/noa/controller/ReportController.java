package noa.controller;

import noa.dto.ReportRequest;
import noa.security.CustomUserDetails;
import noa.service.ReportService;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/v1")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    // 投稿/コメントを通報する
    @PostMapping("/reports")
    @ResponseStatus(HttpStatus.CREATED)
    public void create(@RequestBody ReportRequest req,
                       @AuthenticationPrincipal CustomUserDetails principal) {
        if (principal == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "ログインが必要です");
        }
        reportService.create(principal.getUser(), req);
    }
}