'use client';

import { useState } from 'react';

import SignInModal from './sign-in-modal';
import { Button } from './ui/button';

export default function Welcome() {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto w-[80%] max-w-4xl text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl mb-4">
          Chào mừng đến với{' '}
          <span className="text-blue-600 dark:text-blue-400">ChronoLog</span>
        </h1>
        <p className="mt-3 text-lg text-gray-600 dark:text-gray-300">
          ChronoLog giúp bạn <strong>ghi lại mọi sự kiện quan trọng</strong> của
          dự án và theo dõi tiến độ theo <strong>timeline trực quan</strong>. Từ
          các cột mốc phát triển, báo cáo kiểm thử, đến việc ghi nhận bug
          đã fix, mọi thứ đều được sắp xếp gọn gàng. Hãy bắt đầu xây dựng{' '}
          <strong>nhật ký dự án toàn diện</strong> của bạn ngay hôm nay!
        </p>
        <div className="mt-8 flex justify-center space-x-4">
          <Button onClick={() => setShowLogin(true)}>Đăng nhập</Button>
          <SignInModal open={showLogin} onClose={() => setShowLogin(false)} />
        </div>
      </div>
    </div>
  );
}
