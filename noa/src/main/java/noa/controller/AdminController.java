package noa.controller;

import noa.dto.AdminCommentResponse;
import noa.dto.AdminPostResponse;
import noa.dto.AdminReportResponse;
import noa.dto.AdminUserResponse;
import noa.security.CustomUserDetails;
import noa.service.AdminService;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    // 全ユーザー一覧（管理者用）
    @GetMapping("/users")
    public List<AdminUserResponse> listUsers() {
        return adminService.listUsers();
    }

    // ユーザーを停止
    @PostMapping("/users/{userId}/suspend")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void suspendUser(@PathVariable Long userId,
                            @AuthenticationPrincipal CustomUserDetails principal) {
        adminService.suspendUser(userId, principal.getUser());
    }

    // ユーザーの停止を解除
    @PostMapping("/users/{userId}/activate")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void activateUser(@PathVariable Long userId) {
        adminService.activateUser(userId);
    }

    // 特定ユーザーの投稿一覧
    @GetMapping("/users/{userId}/posts")
    public List<AdminPostResponse> userPosts(@PathVariable Long userId) {
        return adminService.listUserPosts(userId);
    }

    // 投稿削除（管理者・他人の投稿でも可）
    @DeleteMapping("/posts/{postId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletePost(@PathVariable Long postId) {
        adminService.deletePost(postId);
    }

    // 特定ユーザーのコメント一覧
    @GetMapping("/users/{userId}/comments")
    public List<AdminCommentResponse> userComments(@PathVariable Long userId) {
        return adminService.listUserComments(userId);
    }

    // コメント削除（管理者）
    @DeleteMapping("/comments/{commentId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteComment(@PathVariable Long commentId) {
        adminService.deleteComment(commentId);
    }

    // 通報一覧（?status=PENDING で未対応のみ等）
    @GetMapping("/reports")
    public List<AdminReportResponse> reports(@RequestParam(required = false) String status) {
        return adminService.listReports(status);
    }

    // 通報を対応済みにする
    @PostMapping("/reports/{reportId}/resolve")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void resolveReport(@PathVariable Long reportId) {
        adminService.resolveReport(reportId);
    }
}