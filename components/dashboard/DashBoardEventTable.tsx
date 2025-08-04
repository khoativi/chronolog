import { Event, User } from '@prisma/client';
import { format } from 'date-fns';
import {
  Download,
  FileAudio,
  FileImage,
  FileText,
  FileVideo
} from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { StoredAttachment } from '@/types/event';

type EventWithUser = Event & { user: User };

export default function DashBoardEventTable({
  events
}: Readonly<{ events: EventWithUser[]; teamId: string }>) {
  const formattedEvents = events.map((experience) => {
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
    <div className="overflow-x-auto rounded-lg border">
      <Table>
        <TableCaption>
          {formattedEvents.length === 0 && (
            <div className="items-center justify-center py-32 text-center text-muted-foreground space-y-4">
              <h2 className="text-lg font-semibold">Sự kiện trống</h2>
              <p className="text-sm">
                Hãy thêm một số sự kiện để bắt đầu theo dõi lịch sử.
              </p>
            </div>
          )}
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="capitalize">Thời gian</TableHead>
            <TableHead className="capitalize">Người tạo</TableHead>
            <TableHead className="capitalize">Sự kiện</TableHead>
            <TableHead className="capitalize">File đính kèm</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {formattedEvents.map((item) => {
            return (
              <TableRow key={item.id}>
                <TableCell>
                  {format(item.createdAt, 'HH:mm dd/MM/yyyy')}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-7 w-7">
                      <AvatarImage
                        src={item.user.image ?? ''}
                        alt={item.user.name ?? 'User Avatar'}
                      />
                      <AvatarFallback>
                        {item.user.name?.[0] ?? '?'}
                      </AvatarFallback>
                    </Avatar>
                    <span>{item.user.name}</span>
                  </div>
                </TableCell>
                <TableCell>{item.title}</TableCell>
                <TableCell>
                  {item.attachments && item.attachments?.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {item.attachments?.map((attachment, attIndex) => (
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
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
