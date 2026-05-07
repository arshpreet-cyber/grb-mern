'use client';
import React from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { 
  setSelectedSectionId, 
  duplicateSection, 
  deleteSection 
} from '@/lib/redux/features/pageEditorSlice';
import { Settings, Copy, Trash2, GripVertical } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface EditableSectionProps {
  section: any;
  children: React.ReactNode;
}

export default function EditableSection({ section, children }: EditableSectionProps) {
  const dispatch = useAppDispatch();
  const selectedSectionId = useAppSelector((state) => state.pageEditor.selectedSectionId);
  const isSelected = selectedSectionId === section.id;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative border-2 transition-all duration-300 ease-in-out ${
        isSelected 
          ? 'border-[#FFE582] shadow-[0_0_30px_rgba(255,229,130,0.15)] z-20' 
          : 'border-transparent hover:border-[#1a1a1a]/10 hover:z-10'
      }`}
      onClick={(e) => {
        e.stopPropagation();
        dispatch(setSelectedSectionId(section.id));
      }}
    >
      {/* Action Toolbar - Premium Light Floating */}
      <div className={`absolute -top-12 left-0 right-0 flex justify-center opacity-0 ${isSelected ? 'opacity-100' : 'group-hover:opacity-100'} transition-all duration-300 translate-y-2 ${isSelected || 'group-hover:translate-y-0'} z-[60] pointer-events-none`}>
        <div className="bg-white text-[#1a1a1a] flex items-center rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.15)] border border-black/5 p-1.5 pointer-events-auto">
          <button 
            {...attributes} 
            {...listeners}
            className="p-2.5 text-black/20 hover:text-[#fc0] hover:bg-black/5 rounded-xl transition-all cursor-grab active:cursor-grabbing"
            title="Drag to reorder"
          >
            <GripVertical size={18} />
          </button>
          
          <div className="w-px h-6 bg-black/5 mx-1" />
          
          <button 
            onClick={() => dispatch(duplicateSection(section.id))}
            className="p-2.5 text-black/40 hover:text-black hover:bg-black/5 rounded-xl transition-all"
            title="Duplicate"
          >
            <Copy size={18} />
          </button>
          <button 
            onClick={() => dispatch(deleteSection(section.id))}
            className="p-2.5 text-red-500/40 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
            title="Delete"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* Visibility Overlay */}
      {section.settings?.visibility === false && (
        <div className="absolute inset-0 bg-[#fafafa]/60 backdrop-blur-[2px] flex items-center justify-center pointer-events-none z-10">
          <div className="bg-[#1a1a1a] text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl">
            Section Hidden
          </div>
        </div>
      )}

      <div className={`relative ${isSelected ? 'scale-[1.002]' : 'scale-100'} transition-transform duration-300`}>
        {children}
      </div>
    </div>
  );
}
