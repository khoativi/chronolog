'use client';

import { Check, Copy } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

export default function TeamInvite({ teamId }: Readonly<{ teamId: string }>) {
  const [copied, setCopied] = useState(false);
  const [inviteLink, setInviteLink] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setInviteLink(`${window.location.origin}/invite?teamId=${teamId}`);
    }
  }, [teamId]);

  const handleCopy = async () => {
    if (!inviteLink) return;

    await navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mời Thành viên Mới</CardTitle>
        <CardDescription>
          Chia sẻ liên kết này với bất kỳ ai bạn muốn mời vào nhóm.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
          <p className="flex-1 p-2 border rounded-md bg-muted text-sm text-muted-foreground break-all sm:break-words truncate">
            {inviteLink || 'Đang tải liên kết mời...'}
          </p>
          <Button
            onClick={handleCopy}
            variant="outline"
            size="sm"
            disabled={!inviteLink}
            className="w-full sm:w-auto"
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
            <span className="ml-2">
              {copied ? 'Đã sao chép!' : 'Sao chép liên kết'}
            </span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
