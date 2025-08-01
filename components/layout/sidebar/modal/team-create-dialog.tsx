import { Loader } from 'lucide-react';
import { useEffect, useRef, useTransition } from 'react';
import { toast } from 'sonner';

import { createTeam } from '@/actions/team';
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

export function TeamCreateDialog({
  open,
  onOpenChange
}: Readonly<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
}>) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!open) {
      formRef.current?.reset();
    }
  }, [open]);

  async function handleAction(formData: FormData) {
    startTransition(async () => {
      const res = await createTeam(formData);
      if (res.success) {
        window.location.href = `/${res?.team?.id}`;
      } else {
        toast.error(res.message);
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tạo team mới</DialogTitle>
          <DialogDescription>
            Hãy đặt tên cho team để bắt đầu quản lý dự án.
          </DialogDescription>
        </DialogHeader>
        <form ref={formRef} action={handleAction} className="space-y-4">
          <Input
            name="name"
            placeholder="Nhập tên team"
            required
            maxLength={50}
          />
          <DialogFooter>
            <Button type="submit" className="w-full">
              {isPending && <Loader className="animate-spin" />} Tạo team
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
