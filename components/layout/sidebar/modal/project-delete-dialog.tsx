import { useQueryClient } from '@tanstack/react-query';
import { Loader } from 'lucide-react';
import { useTransition } from 'react';
import { toast } from 'sonner';

import { deleteProject } from '@/actions/project';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

interface ProjectDeleteDialogProps {
  teamId: string;
  projectId: string;
  onOpenChange: (open: boolean) => void;
}

export function ProjectDeleteDialog({
  teamId,
  projectId,
  onOpenChange
}: Readonly<ProjectDeleteDialogProps>) {
  const queryClient = useQueryClient();
  const [isPending, startTransition] = useTransition();

  return (
    <AlertDialog open onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
          <AlertDialogDescription>
            Hành động này sẽ xóa vĩnh viễn dự án và dữ liệu liên quan. Không thể
            khôi phục lại.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={() => {
              const formData = new FormData();
              formData.set('id', projectId);
              formData.set('teamId', teamId);
              startTransition(async () => {
                const res = await deleteProject(formData);
                if (res.success) {
                  await queryClient.invalidateQueries({
                    queryKey: ['projects']
                  });
                  toast.success(res.message);
                  onOpenChange(false);
                } else {
                  toast.error(res.message);
                }
              });
            }}
            disabled={isPending}
          >
            {isPending && <Loader className="animate-spin" />} Xóa dự án
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
