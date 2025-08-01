import { notFound } from 'next/navigation';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { prisma } from '@/lib/prisma';

import TeamInvite from '../components/team-invite';

type Props = {
  params: Promise<{ teamId: string }>;
};

export default async function TeamSettingsPage({ params }: Readonly<Props>) {
  const { teamId } = await params;

  const team = await prisma.team.findFirst({
    where: { id: teamId }
  });

  if (!team) {
    notFound();
  }

  const members = await prisma.teamMember.findMany({
    where: { teamId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true
        }
      }
    }
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium">
          Quản lý Nhóm <span className="font-semibold">{team.name}</span>
        </h2>
        <p className="text-sm text-muted-foreground">
          Quản lý các thành viên và mời người dùng mới vào nhóm này.
        </p>
      </div>
      <Separator />

      <TeamInvite teamId={teamId} />

      <Card>
        <CardHeader>
          <CardTitle>Thành viên Nhóm</CardTitle>
          <CardDescription>
            Các thành viên hiện có trong nhóm này.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Vai trò</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-7 w-7">
                          <AvatarImage
                            src={member.user.image ?? ''}
                            alt={member.user.name ?? 'Ảnh đại diện người dùng'}
                          />
                          <AvatarFallback>
                            {member.user.name?.[0] ?? '?'}
                          </AvatarFallback>
                        </Avatar>
                        <span>{member.user.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{member.user.email}</TableCell>
                    <TableCell>{member.role}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
