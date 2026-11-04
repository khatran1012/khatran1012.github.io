# Kết quả sửa và tối ưu — 05/11/2026

Đã hoàn tất các mục sửa từ lần audit trên HEAD 525cbc4. Giữ giao diện, sáu dự án, thứ tự Selected Work trước System, các section, font tiếng Việt, base '/', nội dung HTML dựng sẵn và thiết kế galaxy. Tại thời điểm đo dưới đây, các thay đổi chưa được push hoặc deploy.

## Các thay đổi

- 3D: rời scene sẽ tắt wheel zoom; phân biệt lỗi tải module và lỗi WebGL. Module lỗi có nút Reload page for 3D để xóa cache lỗi, giữ URL và phục hồi lựa chọn 3D bằng cờ session một lần; WebGL lỗi có Retry 3D qua remount. Reload luôn do người dùng bấm. Khi session storage bị chặn, trang vẫn reload và có thể bấm Explore lại.
- Thêm stage Connected bằng kiểu tab đang dùng, cho phép chạm, Next hoặc End tới đoạn ráp nối cuối. Giữ xoay, pan, zoom, Home/R, Escape, focus node và on-demand canvas. Sửa khoảng cách camera khi quay lại layer từ node.
- Open University và Socotec có đủ Problem → My Role → Solution → Trade-offs → Outcome & Evidence, dựa trên trách nhiệm CV có sẵn. Không thêm benchmark hoặc chứng nhận chưa có bằng chứng.
- Case study có Back/Forward, liên kết ?case= và cập nhật fragment khi trang đã mở; giữ các query/fragment khác. Đóng liên kết trực tiếp không điều hướng ra ngoài trang.
- Sửa nhãn home, trạng thái chọn và quan hệ workspace của mô phỏng; menu Escape trả focus; chuyển breakpoint desktop sang 1200px để tránh header chật ở 900–1024px. Footer tôn trọng reduced motion; hover lựa chọn dự án chỉ đổi viền.
- Chuẩn hóa telephone URI sang +84326004229; CI build chuyển sang Node 24 LTS. README/review phản ánh showcase và migration đã hoàn tất.
- Hero dùng wording về cơ chế đã triển khai, bỏ các khẳng định sub-millisecond, WCAG AA, zero double-spending và phiên bản React chưa được chứng minh.
- Tối ưu quá trình khởi tạo: đo toàn bộ vị trí trước khi đổi class, đo route trước khi ghi CSS; memo các chapter tĩnh để đổi theme không render lại cả trang.
- Thêm ảnh module 192/256px và nền 960/1280px; giữ các bản độ phân giải cao. Chỉnh sizes theo kích thước thực; ảnh và bố cục giữ nguyên. Kiểm tra build xác minh tất cả srcset candidates và phone URI.

## Hiệu năng trước/sau

Lighthouse 13.6.0, Chrome headless trên máy hiện tại, đo static production build cũ ở localhost:4173 và bản mới ở localhost:4174. Mobile dùng cấu hình mặc định (412×823, DPR 1,75, CPU slowdown 4×, simulated throttling); chạy xen kẽ trước/sau ba vòng rồi lấy median. Desktop dùng preset desktop, một lượt mỗi bản.

| Chỉ số | Mobile trước | Mobile sau | Desktop trước | Desktop sau |
| --- | ---: | ---: | ---: | ---: |
| Performance | 100 | 100 | 100 | 100 |
| LCP | 1,154 s | 1,151 s | 0,752 s | 0,665 s |
| Total Blocking Time | 56,5 ms | 74,5 ms | 0 ms | 0 ms |
| CLS | 0,000053 | 0,000058 | 0,01494 | 0,01494 |

Điểm mobile từng lượt trước: 100 / 100 / 99; sau: 100 / 100 / 99. Accessibility, Best Practices và SEO đều 100 ở tất cả tám lượt chốt. Điểm tự động này không phải chứng nhận WCAG.

LCP mobile gần như giữ nguyên, TBT tăng nhẹ 18 ms; các số đo này chưa chứng minh giảm tổng CPU. Những lượt thăm dò cũng cho thấy tốc độ máy thay đổi đáng kể, nên không lấy chênh lệch điểm của những phiên khác nhau làm mức cải thiện. Kết quả production trước audit (78 mobile / 98 desktop) có điều kiện tải khác và không được dùng để tuyên bố tăng 22 điểm từ thay đổi này.

Giảm dữ liệu xác minh được: năm ảnh module Hero trong cấu hình mobile đi từ 101.455 xuống 54.247 byte, tiết kiệm 47.208 byte (~46,5%). Các biến thể lớn vẫn phục vụ màn hình cần độ phân giải cao. JS khởi tạo tăng từ 142,0 lên 143,7 KiB gzip do bổ sung narrative và xử lý điều hướng/phục hồi, trong budget 160 KiB. Chunk WebGL riêng vẫn 883,05 kB minified / 236,69 kB gzip; tải sau Explore và cảnh báo 500 kB vẫn được giữ.

Các kết quả trên đo local trước khi publish; chưa phải số đo production với mã mới. Đây là phép đo lab, không phải Core Web Vitals từ người dùng thật.

## Kiểm tra giao diện và tương tác

- npm run build đạt TypeScript, bundling, prerender, HTML/metadata/redirect/font/CV/resource/JS-budget checks; npm run check:build và git diff --check đạt.
- Đối chiếu hình học Hero và vị trí Selected Work ở 390px/1440px, cả light/dark: khớp trong sai số dưới 1px. Đã xem ảnh so sánh và độ nét của các biến thể.
- Không thấy tràn ngang ở 360, 390, 768, 900, 1024, 1200, 1280, 1440px.
- Cả sáu dialog đủ năm phần, Escape đóng và trả focus. Back/Forward, thao tác nhanh Back→Forward, query trực tiếp, fragment thay đổi sau mount đều đạt; body scroll được khôi phục.
- Bộ chọn mô phỏng thông báo trạng thái active và workspace; menu Escape và hover không thay đổi kích thước/shadow đều đạt. Footer reduced motion dùng instant.
- Tắt JavaScript vẫn chọn được Socotec và mở native details bằng bàn phím.
- Ban đầu không có canvas; Explore mount canvas; Exit/Escape gỡ canvas qua nhiều vòng. Wheel leave tắt zoom, node focus/back hoạt động, Connected tới được bằng End/chạm; các lệnh rotate/pan/zoom/Home/R không phát sinh lỗi.
- Đã chặn tải chunk 3D, bỏ chặn rồi bấm Reload page for 3D: canvas trở lại, URL giữ nguyên, cờ session đã được dùng và xóa. Giả lập contextlost rồi Retry 3D remount thành công.
- Trong luồng bình thường không ghi nhận lỗi JavaScript hoặc request thất bại; lỗi module được tạo có chủ ý trong ca recovery được tách riêng.

## Mẫu 3D

Đo cả năm layer, 60–71 frame/layer, trên desktop 1440×1000 và mobile giả lập 390×844, cả dark/light. Median frame time trong các mẫu: 16,4–16,7 ms; p95: 18,2–19,2 ms (~60 FPS theo median). DPR thích ứng: desktop 1, mobile giả lập 1,25. Đây là thiết bị desktop chạy Chrome headless với viewport mobile; chưa phải FPS, VRAM hoặc nhiệt độ của điện thoại thật. Gỡ canvas đã được kiểm tra; chưa kết luận về GPU memory sau sử dụng kéo dài.

## Báo cáo máy đọc và ảnh kiểm chứng

Các số đo và kết quả kiểm tra được lưu cùng mã nguồn:

- [Số đo tổng hợp](reports/2026-11-05/measurements.json)
- [Kiểm tra tương tác](reports/2026-11-05/runtime-checks.json)
- [Mẫu đầy đủ 3D](reports/2026-11-05/3d-profiles.json)

Báo cáo Lighthouse HTML, trace và ảnh so sánh được giữ trong artifact cục bộ của đợt kiểm tra; không cần đưa chúng vào bản triển khai website.

Không đổi hosting chỉ để xử lý cache của GitHub Pages; chưa thay thư viện render hoặc giảm chi tiết 3D khi mẫu đo hiện tại chưa chỉ ra bottleneck tương ứng.
