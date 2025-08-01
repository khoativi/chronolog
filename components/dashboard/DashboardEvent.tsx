import { Event, User } from '@prisma/client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

import DashBoardEventTable from './DashBoardEventTable';

type EventWithUser = Event & { user: User };

export default function DashboardEvent({
  events,
  teamId
}: Readonly<{ events: EventWithUser[]; teamId: string }>) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sự kiện gần đây</CardTitle>
        <CardDescription>
          Danh sách 50 sự kiện gần đây nhất của dự án trong nhóm.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DashBoardEventTable teamId={teamId} events={events} />
      </CardContent>
    </Card>
  );
}
