'use client';
import { Project } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import { CalendarPlus, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as React from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from '@/components/ui/sidebar';
import { api } from '@/lib/axios';

import { ProjectDeleteDialog } from './modal/project-delete-dialog';
import { ProjectEditDialog } from './modal/project-edit-dialog';

export default function AppSidebarProject() {
  const { isMobile } = useSidebar();
  const pathname = usePathname();
  const teamId = pathname.split('/')[1];

  const { data: projects } = useQuery({
    queryKey: ['projects', teamId],
    queryFn: async () => {
      const { data } = await api.get('/api/projects', {
        params: { teamId }
      });
      return data;
    }
  });

  const [editProject, setEditProject] = React.useState<{
    id: string;
    name: string;
  } | null>(null);
  const [projectToDelete, setProjectToDelete] = React.useState<{
    id: string;
    name: string;
  } | null>(null);

  return (
    <>
      <SidebarMenu>
        {projects?.map((item: Project) => (
          <SidebarMenuItem key={item.id}>
            <SidebarMenuButton
              asChild
              isActive={pathname?.startsWith(`/${teamId}/project/${item.id}`)}
            >
              <Link href={`/${teamId}/project/${item.id}`}>
                <span>{item.name}</span>
              </Link>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction showOnHover>
                  <MoreHorizontal />
                  <span className="sr-only">More</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-48 rounded-lg"
                side={isMobile ? 'bottom' : 'right'}
                align={isMobile ? 'end' : 'start'}
              >
                <DropdownMenuItem>
                  <Link
                    href={`/${teamId}/project/${item.id}/event/create`}
                    className="flex items-center gap-2"
                  >
                    <CalendarPlus className="w-4 h-4" />
                    <span>Tạo sự kiện</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() =>
                    setEditProject({ id: item.id, name: item.name })
                  }
                >
                  <Pencil />
                  <span>Đổi tên</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() =>
                    setProjectToDelete({ id: item.id, name: item.name })
                  }
                >
                  <Trash2 />
                  <span>Xóa</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
      {editProject && (
        <ProjectEditDialog
          teamId={teamId}
          projectId={editProject.id}
          currentName={editProject.name}
          onOpenChange={(open) => !open && setEditProject(null)}
        />
      )}
      {projectToDelete && (
        <ProjectDeleteDialog
          teamId={teamId}
          projectId={projectToDelete.id}
          onOpenChange={(open) => !open && setProjectToDelete(null)}
        />
      )}
    </>
  );
}
