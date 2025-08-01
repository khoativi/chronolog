import type { Metadata } from 'next';

import CreateEvent from '../components/CreateEvent';

type Props = {
  params: Promise<{ projectId: string; teamId: string }>;
};

export const metadata: Metadata = {
  title: 'Tạo Sự Kiện Mới',
  description:
    'Ghi lại mọi sự kiện, cột mốc hoặc cập nhật quan trọng cho dự án của bạn trên ChronoLog. Thêm báo cáo test, diagram, hay ghi chú về bug đã fix một cách dễ dàng.',
  openGraph: {
    title: 'Tạo Sự Kiện Mới',
    description:
      'Ghi lại mọi sự kiện, cột mốc hoặc cập nhật quan trọng cho dự án của bạn trên ChronoLog. Thêm báo cáo test, diagram, hay ghi chú về bug đã fix một cách dễ dàng.'
  }
};

export default async function Page({ params }: Readonly<Props>) {
  const { projectId, teamId } = await params;

  return <CreateEvent projectId={projectId} teamId={teamId} />;
}
