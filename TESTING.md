# Kết quả kiểm tra

Thực hiện ngày 06/10/2026 tại dự án `StudentManager_BIT240094`.

| Kiểm tra đã chạy | Kết quả |
| --- | --- |
| `npm run lint` | Qua, không lỗi/cảnh báo |
| `npm run typecheck` | Qua |
| `npm test` | 19/19 qua |
| `npx expo-doctor` | 21/21 qua |
| `npm run build` | Export bundle Android, iOS và web thành công; không phải APK/IPA |
| `npm run test:e2e` với Chromium | 17/17 kịch bản qua; không có lỗi runtime |
| `npx expo prebuild --platform android --no-install` | Qua; tài nguyên tên app en/vi và danh sách ngôn ngữ được tạo đúng |
| Probe giao diện thực tế | Không có lỗi tràn ngang ở 320, 375, 768, 1024, 1280, 1440, 1920px; quét thêm các khổ giữa 375–1440px |

Các kịch bản web đã kiểm chứng:

- Form thêm trống; chặn ba trường bắt buộc chỉ có khoảng trắng, email sai, URL sai và năm ví dụ MSSV không hợp lệ trong đề.
- Thêm dữ liệu hợp lệ, trim, chọn ảnh và xem đúng chi tiết.
- Tải lại trang và mở browser context mới giữ dữ liệu cùng ảnh đã chọn.
- Sửa → Không giữ bản nháp và dữ liệu cũ; sửa → Có ghi dữ liệu, giữ id ổn định và avatar. MSSV không thay đổi của chính sinh viên vẫn được chấp nhận.
- Chặn MSSV trùng khi thêm và khi sửa sinh viên khác; nhấn Lưu liên tiếp chỉ thêm một bản ghi.
- Ảnh URL trả về 404 chuyển sang ảnh mặc định; hủy bộ chọn ảnh web giữ avatar hiện tại.
- Hủy thêm/sửa không tự lưu; xóa → Không giữ bản ghi, xóa → Có cập nhật bộ lưu trữ và quay về danh sách.
- Giả lập lỗi ghi localStorage khi thêm, sửa và xóa: báo lỗi, giữ dữ liệu cũ và màn hình phù hợp, không báo thành công; thử lại ghi được.
- Dữ liệu khởi động bị hỏng: báo lỗi, khóa Thêm mới, không ghi đè; Thử lại đọc được khi sửa dữ liệu thử nghiệm.
- Tiếng Việt/Anh gồm tiêu đề, nhãn, lỗi và hộp thoại; sự kiện foreground đọc lại ngôn ngữ, không dịch dữ liệu người dùng. Thiết bị dùng tiếng Pháp rơi về tiếng Anh.
- Các khổ điện thoại/desktop không tràn ngang; các nút và ô nhập vẫn thao tác được trên màn hình 320px.
- Danh sách 60 sinh viên cuộn được tới mục cuối. Họ tên dài, email dài và mở trực tiếp đường dẫn chi tiết theo id hoạt động ở 320px.

Kiểm tra native bằng mock trong `npm test`: từ chối quyền không mở picker, hủy trả về null, thao tác copy ảnh được chờ hoàn tất và trả URI trong thư mục documents, lỗi copy báo mã lỗi phù hợp. Kiểm tra lưu trữ cũng xác nhận URI local và id giữ nguyên qua lần đọc tiếp theo.

**Chưa kiểm chứng trên Android/iOS thật:** hộp thoại quyền của hệ điều hành, chọn/hủy ảnh native, sự tồn tại thực tế của file ảnh sau khi đóng/mở app, bàn phím và safe area native, đổi ngôn ngữ trong cài đặt hệ điều hành, tên dưới biểu tượng và cài đặt APK/IPA. Expo Go không thể kiểm chứng tên biểu tượng của ứng dụng riêng. Cần native build để thử các phần này.

Kịch bản thử trên điện thoại: thêm BIT240094 có ảnh → đóng/mở app → xem ảnh/dữ liệu → sửa và chọn Không/Có → thử xóa Không/Có → thử từ chối quyền ảnh và hủy picker → đổi ngôn ngữ vi/en rồi trở lại app → mở bàn phím và cuộn tới nút Lưu. Sau thử thành công, cập nhật kết quả ở đây.

Giao diện dùng danh sách dọc, form một cột, màu trung tính và font hệ thống; chỉ có dữ liệu người dùng nhập, không gieo sẵn sinh viên mẫu. Có chỉ báo focus của trình duyệt để hỗ trợ thao tác bằng bàn phím. Dự án dùng giao diện sáng.
