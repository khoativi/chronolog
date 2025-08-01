import type { Metadata } from 'next';

import { Separator } from '@/components/ui/separator';

import { SettingsSidebar } from './components/settings-sidebar';

type Props = {
  children: React.ReactNode;
  params: Promise<{ teamId: string }>;
};

export const metadata: Metadata = {
  title: 'Cài đặt',
  description:
    'Quản lý cấu hình và cài đặt cho nhóm của bạn. Bạn có thể thay đổi tên nhóm, quản lý thành viên và các cài đặt khác liên quan đến dự án.',
  openGraph: {
    title: 'Cài đặt',
    description:
      'Quản lý cấu hình và cài đặt cho nhóm của bạn. Bạn có thể thay đổi tên nhóm, quản lý thành viên và các cài đặt khác liên quan đến dự án.'
  }
};

export default async function SettingsLayout({
  children,
  params
}: Readonly<Props>) {
  const { teamId } = await params;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Cài đặt</h2>
        <p className="text-muted-foreground">
          Quản lý cấu hình và cài đặt cho nhóm của bạn. Bạn có thể thay đổi tên
          nhóm, quản lý thành viên và các cài đặt khác liên quan đến dự án.
        </p>
      </div>
      <Separator className="my-6" />
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="lg:w-1/5">
          <SettingsSidebar teamId={teamId} />
        </aside>
        <div className="flex-1 lg:max-w-2xl">{children}</div>
      </div>
    </div>
  );
}
