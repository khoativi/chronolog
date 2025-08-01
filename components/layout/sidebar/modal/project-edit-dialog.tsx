import { useQueryClient } from '@tanstack/react-query';
import { Loader } from 'lucide-react';
import { useTransition } from 'react';
import { toast } from 'sonner';

import { updateProject } from '@/actions/project';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

interface ProjectEditDialogProps {
  teamId: string;
  projectId: string;
  currentName: string;
  onOpenChange: (open: boolean) => void;
}

export function ProjectEditDialog({
  teamId,
  projectId,
  currentName,
  onOpenChange
}: Readonly<ProjectEditDialogProps>) {
  const queryClient = useQueryClient();
  const [isPending, startTransition] = useTransition();

  return (
    <Dialog open onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Đổi tên dự án</DialogTitle>
          <DialogDescription>
            Hãy nhập tên mới cho dự án của bạn.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData();
            formData.set('id', projectId);
            formData.set('teamId', teamId);
            formData.set(
              'name',
              (e.currentTarget.elements.namedItem('name') as HTMLInputElement)
                ?.value || ''
            );

            startTransition(async () => {
              const res = await updateProject(formData);
              if (res.success) {
                await queryClient.invalidateQueries({ queryKey: ['projects'] });
                toast.success(res.message);
                onOpenChange(false);
              } else {
                toast.error(res.message);
              }
            });
          }}
        >
          <Input
            required
            name="name"
            defaultValue={currentName}
            placeholder="Nhập tên dự án mới"
            maxLength={100}
          />
          <DialogFooter className="sm:justify-start mt-4">
            <Button type="submit" disabled={isPending} className="w-full">
              {isPending && <Loader className="animate-spin" />} Cập nhật
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
