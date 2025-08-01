import { useQueryClient } from '@tanstack/react-query';
import { Loader } from 'lucide-react';
import { useTransition } from 'react';
import { toast } from 'sonner';

import { createProject } from '@/actions/project';
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

interface Props {
  teamId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ProjectCreateDialog({
  teamId,
  open,
  onOpenChange
}: Readonly<Props>) {
  const [isPending, startTransition] = useTransition();

  const queryClient = useQueryClient();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tạo dự án mới</DialogTitle>
          <DialogDescription>
            Hãy nhập tên dự án để bắt đầu quản lý và kiểm thử hiệu năng.
          </DialogDescription>
        </DialogHeader>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            formData.set('teamId', teamId);
            startTransition(async () => {
              const res = await createProject(formData);
              if (res.success) {
                await queryClient.invalidateQueries({ queryKey: ['projects'] });
                onOpenChange(false);
                toast.success(res.message);
              } else {
                toast.error(res.message);
              }
            });
          }}
        >
          <Input
            name="name"
            placeholder="Nhập tên dự án"
            required
            maxLength={100}
          />
          <DialogFooter>
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending && <Loader className="animate-spin" />} Tạo dự án
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
