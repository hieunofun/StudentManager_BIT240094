# Quản lý sinh viên – Phan Văn Hiếu – BIT240094

Ứng dụng thực hành CRUD bằng React Native 0.86, Expo SDK 57, TypeScript và Expo Router. Dữ liệu lưu trên thiết bị bằng AsyncStorage; không có backend, đăng nhập hoặc database online.

## Cài đặt và chạy

Yêu cầu Node.js tương thích Expo SDK 57 và npm.

```bash
npm ci
npm start
```

Quét QR bằng Expo Go tương thích SDK 57 để mở trên điện thoại. Chạy trên trình duyệt:

```bash
npm run web
```

Bản web dùng chế độ SPA (`web.output: single`), đọc dữ liệu local và ngôn ngữ trong trình duyệt. Khi tự host thư mục `dist`, cấu hình các đường dẫn về `index.html` để mở trực tiếp trang chi tiết theo id.

## Đúng ba màn hình

1. `src/app/index.tsx`: danh sách cuộn, avatar, họ tên, MSSV, nút Thêm mới; Sửa/Xóa nằm cùng dòng với từng sinh viên. Sửa mở form điền sẵn, Xóa hỏi Có/Không và chỉ xóa khi ghi local thành công. Nhấn phần avatar/họ tên/MSSV mở chi tiết. Có trạng thái tải, trống và lỗi đọc dữ liệu.
2. `src/app/student/[id].tsx`: chi tiết sinh viên, Quay lại, Sửa và Xóa. Chỉ xóa khi chọn Có trong hộp thoại xác nhận.
3. `src/app/student-form.tsx`: form chung cho thêm/sửa. Thêm bắt đầu trống; sửa điền sẵn. Chọn Không giữ bản nháp và dữ liệu cũ; Có mới lưu. Hủy/Quay lại không tự lưu. Form cuộn khi mở bàn phím, nút lưu được khóa trong lúc xử lý.

Component form nằm ở `src/components/student-form.tsx`; các component dùng chung nằm cùng thư mục. Màu giao diện nằm ở `src/constants/theme.ts`, dùng font hệ thống và giao diện sáng.

## Kiểm tra dữ liệu và lưu local

- Họ tên, MSSV và email bắt buộc; trim trước khi lưu.
- MSSV theo `/^B[A-Z]{2}(2[2-6])[0-9]{4}$/`: đúng 9 ký tự, bắt đầu B, hai chữ in hoa, khóa 22–26, bốn số cuối. Ví dụ: BIT240094, BAA220000, BZZ269999.
- MSSV duy nhất; sửa loại chính bản ghi hiện tại khỏi kiểm tra trùng. Email theo định dạng thông dụng; URL avatar chỉ nhận http/https.
- Avatar tùy chọn, thiếu/lỗi ảnh dùng ảnh mặc định. Có xem trước, chọn ảnh từ thiết bị và bỏ ảnh.
- `src/storage/student-storage.ts` đọc/ghi JSON tại khóa `@StudentManager_BIT240094/students`. `src/contexts/student-context.tsx` tải dữ liệu trước khi cho phép thay đổi, giữ `id` ổn định, khóa thao tác ghi đồng thời và chỉ cập nhật danh sách/thông báo sau khi ghi thành công. Lỗi đọc không ghi đè dữ liệu; lỗi ghi giữ kết quả đã lưu trước đó.
- Trên Android/iOS, `src/utils/avatar-picker.ts` xin quyền đọc ảnh, xử lý từ chối/hủy, dùng Expo FileSystem sao chép ảnh vào `Paths.document/student-avatars` trước khi lưu URI. Hủy chọn ảnh giữ avatar hiện tại.
- Trên web, `avatar-picker.web.ts` dùng bộ chọn tệp của trình duyệt và lưu ảnh dưới dạng data URL để tồn tại sau khi tải lại. AsyncStorage dùng localStorage của từng trình duyệt/origin. Ảnh quá lớn vượt dung lượng lưu trữ sẽ báo lỗi ghi, không báo thành công.
- Dữ liệu và ảnh trong thư mục ứng dụng tồn tại khi đóng/mở app, nhưng sẽ mất nếu gỡ app hoặc xóa dữ liệu của app. Ảnh đã chọn trong bản nháp bị hủy có thể còn trong thư mục ảnh của ứng dụng.

## Tiếng Việt / tiếng Anh

Bản dịch tập trung tại `src/i18n/translations.ts`. `locale-context.tsx` đọc `expo-localization`: ngôn ngữ `vi` dùng tiếng Việt, ngôn ngữ khác dùng tiếng Anh. Khi trở lại foreground, app đọc lại ngôn ngữ. Họ tên, MSSV và email của người dùng không bị dịch.

Thử trên điện thoại: đổi ngôn ngữ thiết bị/app trong Cài đặt sang tiếng Việt hoặc tiếng Anh rồi mở lại app; Android cũng cập nhật khi đưa app trở lại foreground. iOS có thể khởi động lại app khi đổi ngôn ngữ. Trên web, đổi ngôn ngữ ưu tiên của trình duyệt và tải lại trang.

Tên giao diện: **Quản lý sinh viên** / **Student Manager**. `app.json` và `locales/vi.json`, `locales/en.json` cấu hình tên dưới biểu tượng Android/iOS và nội dung xin quyền ảnh iOS. Cấu hình native cần build lại, Expo Go không kiểm chứng được tên dưới biểu tượng của ứng dụng riêng. Có thể tạo bản native bằng EAS:

```bash
npx eas-cli@latest build --platform android
```

## Kiểm tra

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

`npm test` kiểm tra regex, trim, email, MSSV trùng khi thêm/sửa, URL, đọc/ghi và dữ liệu hỏng. Các kiểm tra quyền ảnh, hủy và sao chép bền vững chạy với **mock API native**, không thay thế kiểm chứng trên điện thoại thật.

Kiểm tra giao diện tự động bằng Chromium sau khi export:

```bash
npx playwright install chromium
npm run test:e2e
```

Có thể đặt `PLAYWRIGHT_CHROMIUM_EXECUTABLE` tới Chromium đã cài để không tải thêm trình duyệt. Kịch bản phục vụ thư mục `dist` tại cổng 8085, kiểm tra CRUD, xác nhận Có/Không, validation, avatar, mở lại dữ liệu, lỗi ghi/đọc, ngôn ngữ và không tràn ngang. Ảnh chụp/kết quả nằm trong `test-results`, không đưa lên Git.

Xem [TESTING.md](TESTING.md) để biết kết quả đã thực hiện và các phần cần thử tiếp trên thiết bị native.
