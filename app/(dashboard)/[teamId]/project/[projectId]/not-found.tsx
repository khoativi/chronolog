import { Ban } from 'lucide-react';

export default function NotFoundError() {
  return (
    <div className="h-svh">
      <div className="m-auto flex h-full w-full flex-col items-center justify-center gap-2">
        <Ban size={80} />
        <span className="font-medium text-[2rem]">Oops! Page Not Found!</span>
        <p className="text-muted-foreground text-center">
          Dữ liệu bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
        </p>
      </div>
    </div>
  );
}
