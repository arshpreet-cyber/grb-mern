'use client';
import React, { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
import { Link } from '@tiptap/extension-link';
import { Image } from '@tiptap/extension-image';
import { TextAlign } from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { Highlight } from '@tiptap/extension-highlight';
import { Underline } from '@tiptap/extension-underline';
import { Placeholder } from '@tiptap/extension-placeholder';
import { 
  Bold, Italic, Underline as UnderlineIcon, List, ListOrdered, 
  Link as LinkIcon, Heading1, Heading2, Heading3, Quote, 
  Undo, Redo, AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Type, Highlighter, Palette, Eraser, Maximize2, Minimize2, X, Code2
} from 'lucide-react';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

const MenuBar = ({ 
  editor, 
  onToggleExpand, 
  isExpanded, 
  isCodeMode, 
  setIsCodeMode 
}: { 
  editor: any, 
  onToggleExpand: () => void, 
  isExpanded: boolean,
  isCodeMode: boolean,
  setIsCodeMode: (val: boolean) => void
}) => {
  if (!editor) return null;

  const ToolbarButton = ({ onClick, isActive, icon, title, disabled = false }: any) => (
    <button
      onClick={(e) => { e.preventDefault(); onClick(); }}
      disabled={disabled}
      className={`p-2 rounded-lg transition-all flex items-center justify-center hover:bg-slate-100 disabled:opacity-30 ${
        isActive ? 'bg-blue-50 text-blue-600 shadow-sm' : 'text-slate-600'
      }`}
      title={title}
    >
      {icon}
    </button>
  );

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
      <div className="flex items-center gap-1 pr-2 mr-2 border-r border-slate-200">
        <ToolbarButton 
          onClick={() => editor.chain().focus().undo().run()} 
          icon={<Undo size={16} />} 
          title="Undo" 
          disabled={isCodeMode}
        />
        <ToolbarButton 
          onClick={() => editor.chain().focus().redo().run()} 
          icon={<Redo size={16} />} 
          title="Redo" 
          disabled={isCodeMode}
        />
      </div>

      <div className="flex items-center gap-1 pr-2 mr-2 border-r border-slate-200">
        <ToolbarButton 
          onClick={() => editor.chain().focus().toggleBold().run()} 
          isActive={editor.isActive('bold')} 
          icon={<Bold size={16} />} 
          title="Bold" 
          disabled={isCodeMode}
        />
        <ToolbarButton 
          onClick={() => editor.chain().focus().toggleItalic().run()} 
          isActive={editor.isActive('italic')} 
          icon={<Italic size={16} />} 
          title="Italic" 
          disabled={isCodeMode}
        />
        <ToolbarButton 
          onClick={() => editor.chain().focus().toggleUnderline().run()} 
          isActive={editor.isActive('underline')} 
          icon={<UnderlineIcon size={16} />} 
          title="Underline" 
          disabled={isCodeMode}
        />
      </div>

      <div className="flex items-center gap-1 pr-2 mr-2 border-r border-slate-200">
        <ToolbarButton 
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} 
          isActive={editor.isActive('heading', { level: 1 })} 
          icon={<Heading1 size={16} />} 
          title="H1" 
          disabled={isCodeMode}
        />
        <ToolbarButton 
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} 
          isActive={editor.isActive('heading', { level: 2 })} 
          icon={<Heading2 size={16} />} 
          title="H2" 
          disabled={isCodeMode}
        />
      </div>

      <div className="flex items-center gap-1 pr-2 mr-2 border-r border-slate-200">
        <ToolbarButton 
          onClick={() => editor.chain().focus().setTextAlign('left').run()} 
          isActive={editor.isActive({ textAlign: 'left' })} 
          icon={<AlignLeft size={16} />} 
          title="Align Left" 
          disabled={isCodeMode}
        />
        <ToolbarButton 
          onClick={() => editor.chain().focus().setTextAlign('center').run()} 
          isActive={editor.isActive({ textAlign: 'center' })} 
          icon={<AlignCenter size={16} />} 
          title="Align Center" 
          disabled={isCodeMode}
        />
        <ToolbarButton 
          onClick={() => editor.chain().focus().setTextAlign('right').run()} 
          isActive={editor.isActive({ textAlign: 'right' })} 
          icon={<AlignRight size={16} />} 
          title="Align Right" 
          disabled={isCodeMode}
        />
      </div>

      <div className="flex items-center gap-1">
        <ToolbarButton 
          onClick={() => editor.chain().focus().toggleHighlight().run()} 
          isActive={editor.isActive('highlight')} 
          icon={<Highlighter size={16} />} 
          title="Highlight" 
          disabled={isCodeMode}
        />

        {/* Text Color */}
        <div className="relative flex items-center" title="Text Color">
          <label className="p-2 rounded-lg hover:bg-slate-100 cursor-pointer flex items-center gap-1 text-slate-600">
            <Palette size={16} />
            <input
              type="color"
              className="w-0 h-0 opacity-0 absolute"
              onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
              title="Text Color"
            />
            <span
              className="w-3 h-1.5 rounded-sm block"
              style={{ backgroundColor: editor.getAttributes('textStyle').color || '#000000' }}
            />
          </label>
        </div>

        {/* Font Size */}
        <select
          className="text-xs border border-slate-200 rounded-lg px-1 py-1.5 text-slate-600 bg-white hover:bg-slate-50 focus:outline-none"
          title="Font Size"
          onChange={(e) => {
            if (e.target.value) {
              editor.chain().focus().setMark('textStyle', { fontSize: e.target.value }).run();
            }
          }}
          defaultValue=""
        >
          <option value="" disabled>Size</option>
          {['12px','14px','16px','18px','20px','24px','28px','32px','36px','48px','64px'].map(s => (
            <option key={s} value={s}>{s.replace('px','')}</option>
          ))}
        </select>

        {/* Link */}
        <ToolbarButton
          onClick={() => {
            const url = window.prompt('Enter URL:', editor.getAttributes('link').href || 'https://');
            if (url === null) return;
            if (url === '') {
              editor.chain().focus().unsetLink().run();
            } else {
              editor.chain().focus().setLink({ href: url, target: '_blank' }).run();
            }
          }}
          isActive={editor.isActive('link')}
          icon={<LinkIcon size={16} />}
          title="Insert / Edit Link"
          disabled={isCodeMode}
        />

        <ToolbarButton 
          onClick={() => setIsCodeMode(!isCodeMode)} 
          isActive={isCodeMode}
          icon={<Code2 size={16} />} 
          title="Toggle Code Editor" 
        />
      </div>

      <div className="flex-1" />
      
      <ToolbarButton 
        onClick={onToggleExpand} 
        icon={isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />} 
        title={isExpanded ? "Collapse Editor" : "Fullscreen Mode"} 
      />
    </div>
  );
};

export default function RichTextEditor({ content, onChange, placeholder = "Start typing..." }: RichTextEditorProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCodeMode, setIsCodeMode] = useState(false);
  const [rawHtml, setRawHtml] = useState(content);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: false, HTMLAttributes: { class: 'text-blue-600 underline' } }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      TextStyle.extend({
        addAttributes() {
          return {
            ...this.parent?.(),
            fontSize: {
              default: null,
              parseHTML: (el) => el.style.fontSize || null,
              renderHTML: (attrs) => attrs.fontSize ? { style: `font-size: ${attrs.fontSize}` } : {},
            },
          };
        },
      }),
      Color,
      Highlight.configure({ multicolor: true }),
      Placeholder.configure({ placeholder }),
      Image.configure({ HTMLAttributes: { class: 'rounded-lg max-w-full h-auto' } }),
    ],
    content: content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setRawHtml(html);
      onChange(html);
    },
    editorProps: {
      attributes: {
        class: `prose prose-slate max-w-none focus:outline-none transition-all duration-300 ${isExpanded ? 'p-12 text-lg min-h-[60vh]' : 'p-4 text-sm min-h-[200px]'} text-slate-800`
      }
    }
  });

  // Sync rawHtml with editor when switching out of code mode
  useEffect(() => {
    if (!isCodeMode && editor && editor.getHTML() !== rawHtml) {
      editor.commands.setContent(rawHtml);
    }
  }, [isCodeMode, editor, rawHtml]);

  const handleRawChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setRawHtml(e.target.value);
    onChange(e.target.value);
  };

  const editorContent = (
    <div className={`
      flex flex-col border border-slate-200 rounded-xl overflow-hidden bg-white shadow-lg transition-all duration-300
      ${isExpanded ? 'fixed inset-4 z-[9999] ring-offset-background animate-in zoom-in-95' : 'relative w-full'}
    `}>
      <MenuBar 
        editor={editor} 
        onToggleExpand={() => setIsExpanded(!isExpanded)} 
        isExpanded={isExpanded} 
        isCodeMode={isCodeMode}
        setIsCodeMode={setIsCodeMode}
      />
      
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
          <EditorContent editor={editor} />
        )}
      </div>
      
      <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-400 font-medium uppercase tracking-wider">
        <span>{isCodeMode ? 'Source Code Editor' : 'Visual Editor'}</span>
        <div className="flex items-center gap-4">
          {isExpanded && <span className="text-blue-500 lowercase">ESC to exit</span>}
          <span>HTML5 Compliant</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {isExpanded && <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9998]" onClick={() => setIsExpanded(false)} />}
      {editorContent}
    </>
  );
}
