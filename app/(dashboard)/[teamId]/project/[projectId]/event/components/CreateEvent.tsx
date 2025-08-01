'use client';

import { format } from 'date-fns';
import {
  ChevronDownIcon,
  Download,
  File,
  FileAudio,
  FileImage,
  FileText,
  FileVideo,
  Loader2,
  PlusCircle,
  XCircle
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';

import { createEvent } from '@/actions/project';
import { TextEditor } from '@/components/text-editor';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';

type Props = {
  projectId: string;
  teamId: string;
};

export interface AttachmentInput {
  id: string;
  name: string;
  file: File | null;
}

export default function CreateEvent({ projectId, teamId }: Readonly<Props>) {
  const router = useRouter();

  const [content, setContent] = useState<string>('');
  const [attachments, setAttachments] = useState<AttachmentInput[]>([]);
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date());

  const handleAddAttachment = () => {
    setAttachments((prev) => [
      ...prev,
      { id: crypto.randomUUID(), name: '', file: null }
    ]);
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((att) => att.id !== id));
  };

  const handleAttachmentNameChange = (id: string, newName: string) => {
    setAttachments((prev) =>
      prev.map((att) => (att.id === id ? { ...att, name: newName } : att))
    );
  };

  const handleFileChange = (
    id: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files ? e.target.files[0] : null;
    setAttachments((prev) =>
      prev.map((att) => (att.id === id ? { ...att, file: file } : att))
    );
  };

  const getFileIcon = (fileType: string | undefined) => {
    if (!fileType) return <File className="h-4 w-4" />;
    if (fileType.startsWith('video/')) return <FileVideo className="h-4 w-4" />;
    if (fileType.startsWith('video/')) return <FileAudio className="h-4 w-4" />;
    if (fileType.startsWith('image/')) return <FileImage className="h-4 w-4" />;
    if (fileType.startsWith('application/') || fileType.startsWith('text/'))
      return <FileText className="h-4 w-4" />;
    return <Download className="h-4 w-4" />;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    startTransition(async () => {
      const formData = new FormData(e.currentTarget);
      formData.set('projectId', projectId);
      formData.set('description', content);

      if (date) {
        formData.set('eventDate', date.toISOString());
      }

      attachments.forEach((att, index) => {
        if (att.file) {
          formData.append(
            `attachment-${index}-name`,
            att.name || att.file.name
          );
          formData.append(`attachment-${index}-file`, att.file);
        }
      });

      const result = await createEvent(formData);

      if (result.success) {
        toast.success(result.message);
        router.push(`/${teamId}/project/${projectId}`);
      } else {
        toast.error(result.message);
      }
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Tạo Sự kiện Mới</h2>
        <p className="text-muted-foreground">
          Điền thông tin chi tiết về sự kiện và đính kèm các tệp liên quan.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Tiêu đề sự kiện</Label>
          <Input id="title" name="title" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Mô tả sự kiện</Label>
          <TextEditor
            content={content}
            handleChangeContent={(value) => setContent(value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="eventDate">Ngày sự kiện</Label>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                id="date"
                className="w-48 justify-between font-normal"
              >
                {date ? format(date, 'dd/MM/yyyy') : 'Select date'}
                <ChevronDownIcon />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto overflow-hidden p-0"
              align="start"
            >
              <Calendar
                mode="single"
                selected={date}
                captionLayout="dropdown"
                onSelect={(date) => {
                  setDate(date);
                  setOpen(false);
                }}
              />
            </PopoverContent>
          </Popover>
        </div>
        <div>
          <Label className="mb-2 block">Tệp đính kèm</Label>
          <div className="space-y-4">
            {attachments.map((att) => (
              <div key={att.id} className="flex items-start gap-2">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                  <div className="space-y-2">
                    <Input
                      required
                      id={`attachment-name-${att.id}`}
                      placeholder="Tên hiển thị của tệp (ví dụ: Báo cáo Q1)"
                      value={att.name}
                      onChange={(e) =>
                        handleAttachmentNameChange(att.id, e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="relative">
                      <Input
                        required
                        id={`attachment-file-${att.id}`}
                        type="file"
                        onChange={(e) => handleFileChange(att.id, e)}
                        className="pr-10"
                      />
                      {att.file && (
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          {getFileIcon(att.file.type)}
                        </div>
                      )}
                    </div>
                    {att.file && (
                      <p className="text-xs text-muted-foreground mt-1">
                        File đã chọn: {att.file.name} (
                        {Math.round(att.file.size / 1024)} KB)
                      </p>
                    )}
                  </div>
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => handleRemoveAttachment(att.id)}
                  className="mt-7 md:mt-0"
                >
                  <XCircle className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          <Button
            type="button"
            variant="outline"
            className="mt-4 w-full"
            onClick={handleAddAttachment}
          >
            <PlusCircle className="mr-2 h-4 w-4" /> Thêm tệp đính kèm
          </Button>
        </div>

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Lưu Sự kiện
        </Button>
      </form>
    </div>
  );
}
