# Đánh giá và tối ưu bổ sung

Đối chiếu góp ý với mã nguồn đang có ngày 05/11/2026. Giữ nguyên HTML dựng sẵn, SEO, font tiếng Việt, Hero, Bento, gallery kinh nghiệm, CTA và showcase sáu dự án đã được chọn.

| Góp ý | Quyết định | Cơ sở và thay đổi |
| --- | --- | --- |
| Lazy-load 3D trong Hero | Bỏ qua ví dụ được đề xuất | `SculptureCanvas.tsx` hiện dùng ảnh, SVG và React; không import Three.js, R3F hay Drei. Không thêm nút kích hoạt cho một Hero vốn không chạy WebGL. |
| Bố cục dự án | Giữ showcase sáu dự án | Radio native chọn một dự án, kèm hình minh họa riêng và phần mở rộng toàn bộ trách nhiệm trong CV. HTML và lựa chọn dự án hoạt động khi chưa có JavaScript. Không chia lại thành grid hoặc archive riêng. |
| Ảnh và mô tả có bằng chứng | Giữ và làm rõ | Ghi rõ artwork và diagram là concept/engineering illustration; dẫn người đọc tới phạm vi cá nhân trong My Role. Không dùng hình minh họa như screenshot sản phẩm. |
| Measured Outcome | Hoàn thiện đủ sáu case study | Dùng Outcome & Evidence; không gọi kết quả là Measured Impact khi chưa có benchmark. Cả sáu case study, gồm Open University và Socotec, theo Problem → My Role → Solution → Trade-offs → Outcome & Evidence. Nội dung dựa trên trách nhiệm CV, không thêm chứng nhận hoặc số liệu chưa có. |
| Link và lịch sử case study | Sửa đồng bộ URL | Mở case study tạo history entry để Back đóng và Forward mở lại. Theo dõi popstate/hashchange để link dự án hoạt động cả sau khi tải trang. Đóng direct link chỉ bỏ tham số case, giữ query khác và hash; tương thích fragment archive cũ. |
| 3D khởi tạo khi cuộn tới | Tối ưu ngay | Mặc định hiển thị poster và panel đọc được; chỉ mount WebGL sau khi bấm Explore in 3D. Giữ nguyên cảnh galaxy và mô hình các layer. |
| Cuộn bị giữ lại | Tối ưu ngay | Chỉ có hành trình theo cuộn trong chế độ 3D được bật chủ động. Wheel zoom tắt mặc định, có nút bật riêng; rời vùng scene sẽ tắt. Escape hoặc Exit 3D đóng cảnh và giải phóng canvas. |
| Hoàn tất hành trình và phục hồi 3D | Bổ sung | Stage Connected truy cập bằng tab, Next hoặc End, không phụ thuộc vào cuộn. Lỗi WebGL trở về nội dung HTML và có Retry 3D. Lỗi tải module có Reload page for 3D do trình duyệt có thể cache import lỗi; chỉ reload khi người dùng bấm, giữ URL và dùng cờ session một lần để mở lại, không tạo vòng lặp tự tải lại. |
| Focus và nhãn node | Tối ưu ngay | Node đang đọc giữ nguyên layer khi trang cuộn. Giảm nền galaxy, ngừng hiệu ứng xung quanh, giữ panel HTML và nhãn billboard dễ đọc; không thêm vòng chọn trang trí. |
| Signal flow | Làm rõ | Hiển thị Interface → State → API → Database → Edge gateway cùng các kết nối có tên hiện có. Ghi rõ đây là luồng minh họa, không phải sơ đồ production được xác nhận. |
| ExtrudeGeometry từ SVG | Bỏ qua ở luồng hiện tại | Không tìm thấy `ExtrudeGeometry` hoặc `SVGLoader` trong Hero và các module của Architecture Galaxy đang dùng. Chưa có bằng chứng cần đổi pipeline asset sang model. |
| Pause và render theo tương tác | Giữ và bổ sung | Giữ lazy scene, frameloop demand, DPR thích ứng, pause khi ẩn/outside viewport. Khi focus một node, dừng chuyển động nền không cần thiết. |
| Cắt số font | Giữ nguyên | Bốn family có vai trò đang được dùng; chỉ Jakarta Latin và Syne được preload. Giữ WOFF2, subset tiếng Việt và typography vừa hoàn thiện. |
| Lazy-load toàn bộ chapter | Hoãn | Cách dựng HTML dùng `renderToString`; lazy/Suspense có thể chỉ xuất fallback. Giữ nội dung dự án, mô phỏng và liên hệ trong HTML; chỉ trì hoãn phần đồ họa không thiết yếu. |
| Ngưỡng cảnh báo bundle | Tối ưu ngay | Hạ về 500 kB; giữ cảnh báo chunk WebGL lớn thay vì che nó. Kiểm tra manifest để đồ họa không lọt vào chuỗi import khởi tạo và giới hạn tổng JS khởi tạo ở 160 KiB gzip. |
| Quick Overview và vị trí dự án | Chọn thay đổi có ích | Hero và Bento đã tóm tắt năng lực. Đưa toàn bộ Selected Work lên trước Galaxy và mô phỏng; đồng bộ số chapter và navigation, giữ nguyên các anchor cũ. |
| Giảm thuật ngữ | Tối ưu ngay | Viết lại phần mở đầu mô phỏng, footer và tiêu đề trong case study bằng câu dễ đọc; nội dung kỹ thuật vẫn có ở phần chi tiết. |
| Liên hệ quốc tế | Chuẩn hóa số điện thoại | tel URI dùng +84326004229, đồng nhất với số hiển thị và JSON-LD, để trình quay số không hiểu thành số nội địa ở quốc gia khác. |
| README và CI | Cập nhật hiện trạng | Tài liệu phản ánh showcase sáu dự án và việc đổi tên/deploy User Page đã hoàn tất. Workflow chuyển từ Node 20 đã EOL sang Node 24 LTS. Build/deploy dùng workflow hiện có khi thay đổi được push lên master; không đổi metadata repository từ xa. |

Không đổi framework, xóa section, thêm thư viện cuộn, thêm particle, loại font hay công bố số liệu hiệu năng chưa đo.

Đợt kiểm chứng ngày 05/11/2026 bổ sung ảnh responsive, đo vị trí trước khi ghi CSS và memo các chapter tĩnh. Các lỗi 3D, case study, lịch sử điều hướng, khả năng truy cập và liên hệ đã được sửa. Xem [kết quả build, kiểm tra và đo trước/sau](PERFORMANCE-RESULTS.md); số đo local được tách rõ khỏi production và điện thoại thật.

Các kiểm tra build bảo vệ HTML tĩnh, URL gốc User Page với `base: '/'`, SEO, CV, tài nguyên và font tiếng Việt. Prefix Project Page cũ chỉ còn dùng cho redirect sau khi đổi tên repository. Kiểm tra trình duyệt bổ sung xác nhận chế độ đọc không tạo canvas, kích hoạt/thoát 3D, focus node, responsive và case study. Đây không thay thế Lighthouse, Core Web Vitals ngoài production hoặc profiling trên nhiều thiết bị.

Tham khảo chính thức: [React renderToString và Suspense](https://react.dev/reference/react-dom/server/renderToString), [R3F render theo nhu cầu](https://r3f.docs.pmnd.rs/advanced/scaling-performance), [ngưỡng cảnh báo Vite 6](https://v6.vite.dev/config/build-options#build-chunksizewarninglimit).
