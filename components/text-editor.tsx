'use client';
import '@/styles/jodit.css'; // <-- chỉ chứa rule cho .dark

import JoditEditor from 'jodit-react';
import { useTheme } from 'next-themes';
import React, { useMemo, useRef } from 'react';

type TextEditorProps = {
  content?: string;
  handleChangeContent?: (value: string) => void;
};

export const TextEditor = ({
  content,
  handleChangeContent
}: TextEditorProps) => {
  const editor = useRef(null);

  const { theme } = useTheme();

  const config = useMemo(
    () => ({
      theme: theme === 'light' ? 'default' : 'dark'
    }),
    [theme]
  );

  return (
    <JoditEditor
      ref={editor}
      value={content}
      config={config}
      tabIndex={1}
      onBlur={handleChangeContent}
      onChange={handleChangeContent}
    />
  );
};
