'use client';
import React, { useState, useEffect, useRef } from 'react';
import {
  Bold, Italic, Underline, Heading1, Heading2, Heading3,
  AlignLeft, AlignCenter, AlignRight, List, Link, Undo2, Redo2,
  Code2, Maximize2, Minimize2, Pilcrow, Palette
} from 'lucide-react';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

const Divider = () => <div className="w-px h-5 bg-slate-200 mx-0.5 shrink-0" />;

const Btn = ({ onMouseDown, title, isActive, children }: {
  onMouseDown: (e: React.MouseEvent) => void;
  title: string;
  isActive?: boolean;
  children: React.ReactNode;
}) => (
  <button
    onMouseDown={onMouseDown}
    title={title}
    className={`p-1.5 rounded-md transition-all flex items-center justify-center shrink-0 ${
      isActive ? 'bg-[#fc0]/20 text-[#b38600]' : 'hover:bg-slate-100 text-slate-500 hover:text-slate-800'
    }`}
  >
    {children}
  </button>
);

export default function RichTextEditor({ content, onChange, placeholder = "Start typing..." }: RichTextEditorProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCodeMode, setIsCodeMode] = useState(false);
  const [rawHtml, setRawHtml] = useState(content);
  const editableRef = useRef<HTMLDivElement>(null);
  const isInitialized = useRef(false);

  useEffect(() => {
    if (editableRef.current && !isInitialized.current) {
      editableRef.current.innerHTML = content;
      isInitialized.current = true;
    }
  }, []);

  useEffect(() => {
    if (!isCodeMode && editableRef.current) {
      editableRef.current.innerHTML = rawHtml;
    }
  }, [isCodeMode]);

  const handleVisualInput = () => {
    if (editableRef.current) {
      const html = editableRef.current.innerHTML;
      setRawHtml(html);
      onChange(html);
    }
  };

  const handleRawChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setRawHtml(e.target.value);
    onChange(e.target.value);
  };

  const exec = (cmd: string, value?: string) => {
    editableRef.current?.focus();
    document.execCommand(cmd, false, value);
    handleVisualInput();
  };

  return (
    <>
      {isExpanded && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9998]" onClick={() => setIsExpanded(false)} />
      )}
      <div className={`flex flex-col border border-slate-200 rounded-xl overflow-hidden bg-white shadow-md transition-all duration-300 ${isExpanded ? 'fixed inset-4 z-[9999]' : 'relative w-full'}`}>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 bg-[#fafafa] border-b border-slate-200 sticky top-0 z-20">

          {/* Undo / Redo */}
          <Btn onMouseDown={(e) => { e.preventDefault(); exec('undo'); }} title="Undo"><Undo2 size={15} /></Btn>
          <Btn onMouseDown={(e) => { e.preventDefault(); exec('redo'); }} title="Redo"><Redo2 size={15} /></Btn>
          <Divider />

          {/* Text Style */}
          <Btn onMouseDown={(e) => { e.preventDefault(); exec('bold'); }} title="Bold"><Bold size={15} /></Btn>
          <Btn onMouseDown={(e) => { e.preventDefault(); exec('italic'); }} title="Italic"><Italic size={15} /></Btn>
          <Btn onMouseDown={(e) => { e.preventDefault(); exec('underline'); }} title="Underline"><Underline size={15} /></Btn>
          <Divider />

          {/* Headings */}
          <Btn onMouseDown={(e) => { e.preventDefault(); exec('formatBlock', 'h1'); }} title="Heading 1"><Heading1 size={15} /></Btn>
          <Btn onMouseDown={(e) => { e.preventDefault(); exec('formatBlock', 'h2'); }} title="Heading 2"><Heading2 size={15} /></Btn>
          <Btn onMouseDown={(e) => { e.preventDefault(); exec('formatBlock', 'h3'); }} title="Heading 3"><Heading3 size={15} /></Btn>
          <Btn onMouseDown={(e) => { e.preventDefault(); exec('formatBlock', 'p'); }} title="Paragraph"><Pilcrow size={15} /></Btn>
          <Divider />

          {/* Alignment */}
          <Btn onMouseDown={(e) => { e.preventDefault(); exec('justifyLeft'); }} title="Align Left"><AlignLeft size={15} /></Btn>
          <Btn onMouseDown={(e) => { e.preventDefault(); exec('justifyCenter'); }} title="Align Center"><AlignCenter size={15} /></Btn>
          <Btn onMouseDown={(e) => { e.preventDefault(); exec('justifyRight'); }} title="Align Right"><AlignRight size={15} /></Btn>
          <Divider />

          {/* List */}
          <Btn onMouseDown={(e) => { e.preventDefault(); exec('insertUnorderedList'); }} title="Bullet List"><List size={15} /></Btn>
          <Divider />

          {/* Text Color */}
          <label className="p-1.5 rounded-md hover:bg-slate-100 cursor-pointer flex items-center gap-1 text-slate-500 hover:text-slate-800 transition-all" title="Text Color">
            <Palette size={15} />
            <input
              type="color"
              className="w-4 h-4 cursor-pointer rounded border-0 p-0"
              onInput={(e) => exec('foreColor', (e.target as HTMLInputElement).value)}
            />
          </label>

          {/* Font Size */}
          <select
            className="text-xs border border-slate-200 rounded-md px-1.5 py-1 text-slate-500 bg-white hover:bg-slate-50 focus:outline-none focus:border-[#fc0] transition-all"
            onMouseDown={(e) => e.stopPropagation()}
            onChange={(e) => { exec('fontSize', e.target.value); e.target.value = ''; }}
            defaultValue=""
            title="Font Size"
          >
            <option value="" disabled>Size</option>
            <option value="1">10</option>
            <option value="2">13</option>
            <option value="3">16</option>
            <option value="4">18</option>
            <option value="5">24</option>
            <option value="6">32</option>
            <option value="7">48</option>
          </select>

          {/* Link */}
          <Btn
            onMouseDown={(e) => {
              e.preventDefault();
              const url = window.prompt('Enter URL:', 'https://');
              if (url) exec('createLink', url);
            }}
            title="Insert Link"
          >
            <Link size={15} />
          </Btn>
          <Divider />

          {/* Code Toggle */}
          <Btn
            onMouseDown={(e) => { e.preventDefault(); setIsCodeMode(!isCodeMode); }}
            title="Toggle HTML Editor"
            isActive={isCodeMode}
          >
            <Code2 size={15} />
          </Btn>

          <div className="flex-1" />

          {/* Expand */}
          <Btn
            onMouseDown={(e) => { e.preventDefault(); setIsExpanded(!isExpanded); }}
            title={isExpanded ? 'Collapse' : 'Fullscreen'}
          >
            {isExpanded ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
          </Btn>
        </div>

        {/* Editor Area */}
        <div className={`overflow-y-auto ${isExpanded ? 'flex-1' : 'max-h-[500px]'}`}>
          {isCodeMode ? (
            <textarea
              value={rawHtml}
              onChange={handleRawChange}
              className="w-full h-full min-h-[300px] p-6 font-mono text-sm bg-slate-900 text-slate-300 focus:outline-none resize-none leading-relaxed"
              placeholder="Enter raw HTML here..."
              spellCheck={false}
            />
          ) : (
            <div
              ref={editableRef}
              contentEditable
              suppressContentEditableWarning
              onInput={handleVisualInput}
              className="prose prose-slate max-w-none focus:outline-none p-4 min-h-[200px] text-slate-800"
              data-placeholder={placeholder}
            />
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-1.5 bg-[#fafafa] border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-400 font-medium uppercase tracking-wider">
          <span>{isCodeMode ? '⟨/⟩ Source Code' : '✏ Visual Editor'}</span>
          {isExpanded && <span className="text-[#fc0] lowercase normal-case">Click outside to collapse</span>}
        </div>
      </div>
    </>
  );
}
