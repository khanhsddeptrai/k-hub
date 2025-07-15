"dev": "node --watch -r ts-node/register ./src/server.ts"

git status --short | grep "^ M web/" ==> kiểm tra xem thư mục repo con có code chưa commit không

# Bước 1: Tạo thư mục dự án monorepo
mkdir k-hub
cd k-hub
mkdir -p services/auth-service
mkdir -p services/user-service
mkdir -p services/post-service

# Bước 2: Khởi tạo Git trong monorepo
git init
git add .
git commit -m "Initial commit for monorepo with services"

# Bước 3: Tạo 3 repo riêng trên GitHub / GitLab
Trên GitHub, tạo 3 repo trống:
auth-service
user-service
post-service
(Lưu lại đường dẫn clone của chúng)

# Bước 4: Thêm remote cho từng service vào monorepo
git remote add auth-service https://github.com/your-org/auth-service.git
git remote add user-service https://github.com/your-org/user-service.git
git remote add post-service https://github.com/your-org/post-service.git

# Bước 5: Push từng service lên repo riêng (lần đầu)
git subtree push --prefix=services/auth-service auth-service main
git subtree push --prefix=services/user-service user-service main
git subtree push --prefix=services/post-service post-service main

# Bước 6: Làm việc như bình thường
Bất kỳ khi nào bạn sửa code trong services/auth-service:
# Commit bình thường
git add services/auth-service
git commit -m "Update auth logic"
# Push riêng service đó lên repo tương ứng
git subtree push --prefix=services/auth-service auth-service main

# Bước 7: Kéo thay đổi từ repo riêng về lại monorepo (nếu có người khác sửa)
git subtree pull --prefix=services/auth-service auth-service main --squash