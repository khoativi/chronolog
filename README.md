# 🚀 ChronoLog
**ChronoLog** là một nền tảng quản lý dự án trực quan, được thiết kế để giúp các nhóm dễ dàng **ghi lại mọi sự kiện quan trọng** và cập nhật tiến độ theo **dạng timeline sinh động**. Từ các cột mốc phát triển, quyết định quan trọng, việc **thêm các diagram, báo cáo test case, đến ghi nhận các bug được fix**, ChronoLog cung cấp một **nhật ký dự án toàn diện và có tổ chức**. Nó giúp bạn có cái nhìn tổng quan rõ ràng về lịch sử dự án, dễ dàng tra cứu thông tin và đưa ra quyết định dựa trên dữ liệu.

## ✨ Tính năng nổi bật

  - **Nhật ký dự án theo Timeline:** Ghi lại mọi sự kiện, quyết định, và cập nhật quan trọng của dự án. Xem lại toàn bộ tiến trình dưới dạng một dòng thời gian trực quan, giúp bạn dễ dàng theo dõi lịch sử và tiến độ.
  - **Ghi nhận đa dạng sự kiện:** Thêm các loại sự kiện phong phú như:
      * **Thêm Diagram:** Ghi chú và đính kèm các sơ đồ, biểu đồ quan trọng.
      * **Thêm Test Case/Báo cáo Test:** Lưu trữ chi tiết các kịch bản kiểm thử và kết quả liên quan (bao gồm cả báo cáo k6, tích hợp trực tiếp vào nhật ký).
      * **Fix Bug Critical:** Đánh dấu các lỗi nghiêm trọng đã được khắc phục.
      * Và nhiều loại sự kiện tùy chỉnh khác, giúp bạn ghi lại mọi khía cạnh của dự án.
  - **Đăng nhập bằng Google**: Đơn giản hóa quy trình xác thực với tùy chọn đăng nhập nhanh chóng và an toàn bằng tài khoản Google.
  - **Quản lý theo nhóm (Team Management)**: Tổ chức người dùng thành các nhóm để dễ dàng quản lý quyền truy cập và cộng tác.
  - **Quản lý nhiều dự án**: Mỗi nhóm có thể tạo và quản lý nhiều dự án, giúp bạn phân loại và theo dõi nhật ký cho các ứng dụng hoặc tính năng khác nhau.
  - **Tham gia nhóm bằng liên kết (Join by Link)**: Mời thành viên mới vào nhóm một cách thuận tiện thông qua liên kết mời duy nhất.

## 🛠️ Công nghệ sử dụng

  - **Next.js (App Router)**: Framework React mạnh mẽ cho ứng dụng web, hỗ trợ Server Components và tối ưu hóa hiệu suất.
  - **TypeScript**: Ngôn ngữ lập trình được gõ tĩnh, giúp tăng cường tính bền vững và khả năng bảo trì của mã nguồn.
  - **NextAuth.js**: Thư viện xác thực linh hoạt cho Next.js, tích hợp dễ dàng với Google OAuth.
  - **Zod**: Thư viện validation schema mạnh mẽ, an toàn kiểu dữ liệu.
  - **Prisma**: ORM (Object-Relational Mapper) thế hệ tiếp theo, đơn giản hóa tương tác với cơ sở dữ liệu.
  - **AWS S3 (hoặc tương thích S3)**: Lưu trữ các file đính kèm (diagram, báo cáo k6, v.v.) một cách an toàn và có thể mở rộng.
  - **Tailwind CSS**: Framework CSS tiện ích, giúp xây dựng giao diện nhanh chóng và linh hoạt.
  - **Shadcn/ui**: Các thành phần UI có thể tùy chỉnh, được xây dựng trên Tailwind CSS và Radix UI.
  - **Sentry**: Theo dõi lỗi và hiệu suất ứng dụng.
  - **date-fns**: Thư viện tiện ích xử lý ngày tháng.
  - **lucide-react**: Thư viện icon đẹp và linh hoạt.

## 🚀 Bắt đầu dự án

Để chạy dự án này trên máy cục bộ của bạn, hãy làm theo các bước sau:

### 1\. Yêu cầu

  - Node.js (phiên bản 18 hoặc cao hơn)
  - **pnpm** (phiên bản 10.x hoặc cao hơn)
  - Docker (để triển khai dễ dàng)
  - Một instance SonarQube (để phân tích mã nguồn, tùy chọn)
  - Một tài khoản Google Cloud Project (để cấu hình Google OAuth)
  - Một bucket tương thích S3 (ví dụ: AWS S3, MinIO)

### 2\. Cài đặt

Clone repository:

```bash
git clone https://github.com/khoativi/chronolog.git
cd chronolog
```

Cài đặt các dependencies bằng **pnpm**:

```bash
pnpm install
```

### 3\. Cấu hình Biến môi trường

Tạo một file `.env` ở thư mục gốc của dự án và điền các biến môi trường cần thiết, xem file [.env.example](.env.example)

### 4\. Thiết lập cơ sở dữ liệu

Chạy các lệnh Prisma để tạo schema cơ sở dữ liệu và áp dụng các migration:

```bash
pnpm prisma db push
# hoặc nếu bạn đã có migration và muốn áp dụng chúng
# pnpm prisma migrate deploy
```

### 5\. Chạy dự án

Khởi động server phát triển:

```bash
pnpm dev
```

Mở trình duyệt của bạn và truy cập: `http://localhost:3000`

## 📦 Triển khai dễ dàng với Docker

ChronoLog có thể được đóng gói và triển khai dễ dàng bằng Docker.

[Dockerfile](Dockerfile)

### Cách build và chạy Docker Image

1.  **Build Docker Image:**
    Hãy đảm bảo bạn đã điền đầy đủ các biến môi trường như `DATABASE_URL` khi build image nếu Prisma cần chúng trong giai đoạn `prisma generate`.

2.  **Chạy Docker Container:**
    Bạn cần cung cấp các biến môi trường cho ứng dụng Next.js trong quá trình chạy container.

    ```bash
    docker run -p 3000:3000 chronolog-app
    ```

## 📊 Phân tích Mã nguồn với SonarQube (Tùy chọn)

Dự án này được cấu hình để hoạt động tốt với SonarQube để phân tích chất lượng mã nguồn.

### Chạy Sonar Scanner

Bạn nên sử dụng biến môi trường để truyền các thông tin nhạy cảm và linh hoạt như `sonar.login`, `sonar.host.url`, `sonar.projectKey`, và `sonar.projectName`.

Trong môi trường CI/CD (ví dụ: GitHub Actions, GitLab CI), hãy cấu hình các biến môi trường bí mật (secrets/variables) như sau:

  - `SONAR_TOKEN`: Token xác thực SonarQube của bạn (nên là **Project Analysis Token**).
  - `SONAR_HOST_URL`: URL của SonarQube server của bạn.
  - `SONAR_PROJECT_KEY`: Khóa định danh duy nhất cho dự án SonarQube.
  - `SONAR_PROJECT_NAME`: Tên hiển thị của dự án trên SonarQube.

Ví dụ lệnh chạy Sonar Scanner trong CI/CD pipeline:

```bash
sonar-scanner \
  -Dsonar.projectKey=${SONAR_PROJECT_KEY} \
  -Dsonar.projectName=${SONAR_PROJECT_NAME} \
  -Dsonar.host.url=${SONAR_HOST_URL} \
  -Dsonar.token=${SONAR_TOKEN}
```

## 🤝 Đóng góp
Chào mừng mọi đóng góp\! Nếu bạn muốn cải thiện ChronoLog, vui lòng fork repository, tạo một nhánh mới và gửi pull request.

## 📄 Giấy phép

MIT - see [LICENSE](LICENSE) for details.