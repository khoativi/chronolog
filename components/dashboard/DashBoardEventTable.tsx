import { Event, User } from '@prisma/client';
import { format } from 'date-fns';

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

type EventWithUser = Event & { user: User };

export default function DashBoardEventTable({
  events
}: Readonly<{ events: EventWithUser[]; teamId: string }>) {
  return (
    <div className="overflow-x-auto rounded-lg border">
      <Table>
        <TableCaption>
          {events.length === 0 && (
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
            <TableHead className="capitalize">Nội dung</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.map((item) => {
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
                <TableCell
                  className="max-w-[300px] truncate whitespace-nowrap"
                  dangerouslySetInnerHTML={{ __html: item.description }}
                />
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
