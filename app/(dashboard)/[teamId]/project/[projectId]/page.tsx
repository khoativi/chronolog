import { format } from 'date-fns';
import {
  Calendar,
  CalendarPlus,
  Download,
  FileAudio,
  FileImage,
  FileText,
  FileVideo
} from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { isValidUuidV7 } from '@/lib/validate-utils';

type Props = {
  params: Promise<{ projectId: string; teamId: string }>;
};

interface StoredAttachment {
  name: string;
  url: string;
  type: string;
  filesize: string;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const projectId = (await params).projectId;
  const teamId = (await params).teamId;

  if (!isValidUuidV7(teamId) || !isValidUuidV7(projectId)) {
    notFound();
  }

  const project = await prisma.project.findFirst({
    where: { id: projectId, teamId },
    select: { name: true }
  });

  if (!project) {
    notFound();
  }

  return {
    title: `Xem Dự Án ${project.name}`,
    description: `Xem lại toàn bộ lịch sử và tiến độ của dự án ${project.name} trên ChronoLog. Theo dõi mọi sự kiện, cột mốc, báo cáo test và cập nhật khác trên timeline trực quan.`,
    openGraph: {
      title: `Xem Dự Án ${project.name}`,
      description: `Xem lại toàn bộ lịch sử và tiến độ của dự án ${project.name} trên ChronoLog. Theo dõi mọi sự kiện, cột mốc, báo cáo test và cập nhật khác trên timeline trực quan.`
    }
  };
}

export default async function Page({ params }: Readonly<Props>) {
  const { teamId, projectId } = await params;
  if (!isValidUuidV7(teamId) || !isValidUuidV7(projectId)) {
    notFound();
  }

  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  const isMember = await prisma.teamMember.findFirst({
    where: {
      userId,
      teamId
    }
  });
  if (!isMember) notFound();

  const project = await prisma.project.findFirst({
    where: { id: projectId, teamId },
    select: { name: true }
  });
  if (!project) notFound();

  const experiences = await prisma.event.findMany({
    orderBy: { id: 'desc' },
    where: { projectId },
    select: {
      user: { select: { name: true, image: true } },
      title: true,
      description: true,
      eventDate: true,
      attachments: true
    },
    take: 1000
  });

  const formattedExperiences = experiences.map((experience) => {
    const typedAttachments: StoredAttachment[] | null = Array.isArray(
      experience.attachments
    )
      ? (experience.attachments as unknown as StoredAttachment[])
      : null;

    return {
      ...experience,
      attachments: typedAttachments
    };
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{project.name}</h1>
          <p className="text-muted-foreground">
            Các sự kiện đã thực hiện trên dự án này
          </p>
        </div>
        <div className="flex gap-2">
          <Link href={`/${teamId}/project/${projectId}/event/create`}>
            <Button>
              <CalendarPlus /> Tạo Sự kiện
            </Button>
          </Link>
        </div>
      </div>
      <Separator className="my-6" />
      <div className="relative ml-3">
        <div className="absolute left-0 top-4 bottom-0 border-l-2" />
        {formattedExperiences.map(
          ({ description, title, attachments, eventDate, user }, index) => (
            <div key={index} className="relative pl-8 pb-12 last:pb-0">
              <div className="absolute h-3 w-3 -translate-x-1/2 left-px top-3 rounded-full border-2 border-primary bg-background" />
              <div className="space-y-3">
                <div>
                  <h3 className="text-lg sm:text-xl font-medium">{title}</h3>
                  <div className="flex items-center gap-2 mt-1 text-sm">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-7 w-7">
                        <AvatarImage
                          src={user.image ?? ''}
                          alt={user.name ?? 'Ảnh đại diện người dùng'}
                        />
                        <AvatarFallback>{user.name?.[0] ?? '?'}</AvatarFallback>
                      </Avatar>
                      <span>{user.name}</span>
                    </div>
                    <Calendar className="h-4 w-4" />
                    <span>{format(eventDate, 'dd/MM/yyyy')}</span>
                  </div>
                </div>
                <p
                  className="text-sm sm:text-base text-muted-foreground"
                  dangerouslySetInnerHTML={{ __html: description }}
                />
                {attachments && attachments?.length > 0 && (
                  <div className="mt-4 border-t pt-4">
                    <h6 className="text-sm font-semibold mb-2">Tệp đính kèm</h6>
                    <div className="flex flex-wrap gap-2">
                      {attachments?.map((attachment, attIndex) => (
                        <a
                          key={attIndex}
                          href={`${process.env.AWS_S3_HOST_NAME}/${process.env.AWS_S3_BUCKET_NAME}/${attachment.url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 rounded-full border bg-muted px-3 py-1 text-sm font-medium text-muted-foreground hover:bg-muted/80"
                        >
                          {attachment.type.startsWith('video') ? (
                            <FileVideo className="h-4 w-4" />
                          ) : attachment.type.startsWith('audio') ? (
                            <FileAudio className="h-4 w-4" />
                          ) : attachment.type.startsWith('image') ? (
                            <FileImage className="h-4 w-4" />
                          ) : attachment.type.startsWith('application') ||
                            attachment.type.startsWith('text') ? (
                            <FileText className="h-4 w-4" />
                          ) : (
                            <Download className="h-4 w-4" />
                          )}
                          <span>{attachment.name}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
