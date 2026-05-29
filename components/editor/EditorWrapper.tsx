'use client';
import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { 
  setPage, 
  setEditMode, 
  reorderSections, 
  addSection,
  setIsSaving
} from '@/lib/redux/features/pageEditorSlice';
import PageSettingsPanel from './PageSettingsPanel';
import Sidebar from './Sidebar';
import PageRenderer from '../sections/PageRenderer';
import EditableSection from './EditableSection';
import SectionSelector from './SectionSelector';
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Plus, Save, Loader2, ExternalLink, Smartphone, Monitor, Laptop, PanelRightClose, PanelRight, Settings } from 'lucide-react';

interface EditorWrapperProps {
  initialPage: any;
}

export default function EditorWrapper({ initialPage }: EditorWrapperProps) {
  const dispatch = useAppDispatch();
  const { sections, editMode, isSaving, title, slug, id, meta } = useAppSelector((state) => state.pageEditor);
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile' | 'tablet'>('desktop');
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    if (initialPage) {
      const editorSections = (initialPage.draftSections && initialPage.draftSections.length > 0)
        ? initialPage.draftSections
        : initialPage.sections;

      dispatch(setPage({
        id: initialPage.id,
        title: initialPage.title,
        slug: initialPage.slug,
        sections: editorSections || [],
        meta: {
          metaTitle: initialPage.metaTitle || '',
          metaDescription: initialPage.metaDescription || '',
          keywords: initialPage.keywords || '',
          canonicalLink: initialPage.canonicalLink || '',
          robotsText: initialPage.robotsText || 'index, follow',
          inSitemap: initialPage.inSitemap ?? true,
          titleImage: initialPage.titleImage || '',
          opengraphImage: initialPage.opengraphImage || '',
          schemaCode: initialPage.schemaCode || '',
          headerScript: initialPage.headerScript || '',
          bodyScript: initialPage.bodyScript || '',
          footerScript: initialPage.footerScript || '',
          status: initialPage.status || 'Draft',
        },
      }));
    }
  }, [initialPage, dispatch]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = sections.findIndex((s) => s.id === active.id);
      const newIndex = sections.findIndex((s) => s.id === over.id);
      dispatch(reorderSections(arrayMove(sections, oldIndex, newIndex)));
    }
  };

  const serializeData = (data: any) => {
    return JSON.parse(JSON.stringify(data, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    ));
  };

  const savePage = async (publish = false) => {
    dispatch(setIsSaving(true));
    try {
      const pageSlug = slug || initialPage.slug;
      const pageId = id || initialPage.id;
      const response = await fetch(`/api/page/${encodeURIComponent(pageSlug)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, sections: serializeData(sections), title, publish, meta }),
      });
      if (!response.ok) {
        let errorMessage = 'Failed to save';
        let responseText = '';
        try {
          responseText = await response.text();
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.code 
            ? `Database Error [${errorData.code}]: ${errorData.details || errorMessage}`
            : (errorData.details || errorData.error || errorMessage);
          

        } catch (e) {
          errorMessage = `Server Error: ${response.status} ${response.statusText} for slug '${pageSlug}' id '${pageId}'. Response: ${responseText.substring(0, 100)}`;
        }
        throw new Error(errorMessage);
      }
      alert(publish ? 'Page published to live site!' : 'Draft saved successfully!');
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      dispatch(setIsSaving(false));
    }
  };

  const onAddSection = (type: string) => {
    let data = {};
    if (type === 'hero') data = { title: 'New Hero Section', subtitle: 'Subtitle goes here' };
    if (type === 'text') data = { content: '<h2>New Text Section</h2><p>Start typing...</p>' };
    if (type === 'image') data = { imageUrl: '', alt: 'Image description' };
    if (type === 'buy-reviews') data = {};

    dispatch(addSection({ type, data }));
    setIsSelectorOpen(false);
  };

  const currentSections = sections.length > 0 ? sections : (
    (initialPage.draftSections && initialPage.draftSections.length > 0)
      ? initialPage.draftSections
      : initialPage.sections
  ) || [];

  return (
    <div className="flex h-screen bg-[#F4F4F4] overflow-hidden font-[Poppins]">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Editor Toolbar - Premium Light Theme */}
        <header className="h-20 bg-white text-[#1a1a1a] px-8 flex items-center justify-between z-[110] shadow-md border-b border-black/5">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-[#fc0] rounded-2xl flex items-center justify-center shadow-lg shadow-[#fc0]/20">
                <span className="text-[#1a1a1a] font-black text-xl">G</span>
              </div>
              <div className="flex flex-col">
                <h1 className="font-black text-base tracking-tight text-[#1a1a1a]">{title || initialPage.title}</h1>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-black/30 font-bold uppercase tracking-[0.15em]">
                    {slug === 'home' ? 'Main Site' : slug}
                  </span>
                  <div className="w-1 h-1 rounded-full bg-black/10" />
                  <span className="text-[10px] text-[#fc0] font-black uppercase tracking-[0.15em] bg-[#fc0]/10 px-2 py-0.5 rounded-full">
                    {editMode ? 'Design Mode' : 'Preview Mode'}
                  </span>
                </div>
              </div>
            </div>

            <div className="h-10 w-px bg-black/5 mx-2" />

            {/* Device Switcher */}
            <div className="flex bg-black/5 p-1 rounded-2xl border border-black/5">
              <button 
                onClick={() => setViewMode('mobile')}
                className={`p-2.5 rounded-xl transition-all ${viewMode === 'mobile' ? 'bg-white text-[#fc0] shadow-sm' : 'text-black/30 hover:text-black/60'}`}
                title="Mobile View"
              >
                <Smartphone size={18} />
              </button>
              <button 
                onClick={() => setViewMode('tablet')}
                className={`p-2.5 rounded-xl transition-all ${viewMode === 'tablet' ? 'bg-white text-[#fc0] shadow-sm' : 'text-black/30 hover:text-black/60'}`}
                title="Tablet View"
              >
                <Laptop size={18} />
              </button>
              <button 
                onClick={() => setViewMode('desktop')}
                className={`p-2.5 rounded-xl transition-all ${viewMode === 'desktop' ? 'bg-white text-[#fc0] shadow-sm' : 'text-black/30 hover:text-black/60'}`}
                title="Desktop View"
              >
                <Monitor size={18} />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4">
             <div className="flex bg-black/5 p-1 rounded-2xl border border-black/5">
              <button 
                onClick={() => dispatch(setEditMode(true))}
                className={`px-6 py-2 text-xs font-black rounded-xl transition-all ${editMode ? 'bg-white text-[#1a1a1a] shadow-sm' : 'text-black/30 hover:text-black/60'}`}
              >
                BUILD
              </button>
              <button 
                onClick={() => dispatch(setEditMode(false))}
                className={`px-6 py-2 text-xs font-black rounded-xl transition-all ${!editMode ? 'bg-white text-[#1a1a1a] shadow-sm' : 'text-black/30 hover:text-black/60'}`}
              >
                PREVIEW
              </button>
            </div>

            <div className="h-10 w-px bg-black/5 mx-1" />

            <button 
              onClick={() => setIsSettingsOpen(true)}
              className="p-3 text-black/30 hover:text-[#fc0] hover:bg-black/5 rounded-2xl transition-all"
              title="Page Settings & SEO"
            >
              <Settings size={20} />
            </button>

            <button 
              onClick={() => window.open(`/${slug === 'home' ? '' : slug}`, '_blank')}
              className="p-3 text-black/30 hover:text-[#fc0] hover:bg-black/5 rounded-2xl transition-all"
              title="Open Live Site"
            >
              <ExternalLink size={20} />
            </button>

            <button 
              onClick={() => savePage(false)}
              disabled={isSaving}
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-black/60 hover:text-black hover:bg-black/5 rounded-2xl transition-all border border-black/5 disabled:opacity-30"
            >
              <Save size={16} />
              SAVE DRAFT
            </button>

            <button 
              onClick={() => savePage(true)}
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-2.5 text-xs font-black bg-[#fc0] text-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-[#fc0] rounded-2xl transition-all shadow-[0_10px_25px_rgba(255,204,0,0.3)] disabled:opacity-30"
            >
              {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              PUBLISH LIVE
            </button>

            <button 
              onClick={() => setIsSidebarVisible(!isSidebarVisible)}
              className={`p-3 rounded-2xl transition-all ${isSidebarVisible ? 'text-[#fc0] bg-[#fc0]/5' : 'text-black/30 hover:text-black/60 hover:bg-black/5'}`}
            >
              {isSidebarVisible ? <PanelRightClose size={22} /> : <PanelRight size={22} />}
            </button>
          </div>
        </header>

        {/* Scrollable Canvas */}
        <main className="flex-1 overflow-y-auto p-8 flex justify-center bg-[#F4F4F4] scrollbar-hide">
          <style dangerouslySetInnerHTML={{ __html: `
            .editor-mobile-view .grid { grid-template-columns: repeat(1, minmax(0, 1fr)) !important; }
            .editor-mobile-view .md\\:grid-cols-2 { grid-template-columns: repeat(1, minmax(0, 1fr)) !important; }
            .editor-mobile-view .lg\\:grid-cols-3 { grid-template-columns: repeat(1, minmax(0, 1fr)) !important; }
            .editor-mobile-view .xl\\:grid-cols-4 { grid-template-columns: repeat(1, minmax(0, 1fr)) !important; }
            .editor-mobile-view .flex-row { flex-direction: column !important; }
            
            .editor-tablet-view .grid { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
            .editor-tablet-view .lg\\:grid-cols-3 { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
            .editor-tablet-view .xl\\:grid-cols-4 { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
          `}} />
          <div 
            className={`bg-[#FFFEF9] shadow-[0_20px_50px_rgba(0,0,0,0.1)] min-h-full transition-all duration-500 ease-in-out border border-black/5 origin-top
              ${viewMode === 'mobile' ? 'w-[375px] editor-mobile-view' : viewMode === 'tablet' ? 'w-[768px] editor-tablet-view' : 'w-full'}
              ${editMode ? 'ring-1 ring-[#fc0]/30' : ''}`}
          >
            {editMode ? (
              <DndContext 
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext 
                  items={currentSections.map((s: any) => s.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <PageRenderer 
                    sections={currentSections} 
                    isEditing={true}
                    renderWrapper={(section: any, children: any) => (
                      <EditableSection key={section.id} section={section}>
                        {children}
                      </EditableSection>
                    )}
                  />
                </SortableContext>
              </DndContext>
            ) : (
              <PageRenderer sections={currentSections.filter((s: any) => s.settings?.visibility !== false)} />
            )}

            {editMode && (
              <div className="p-16 flex justify-center">
                <button 
                  onClick={() => setIsSelectorOpen(true)}
                  className="flex items-center gap-3 px-8 py-4 bg-white border-2 border-dashed border-[#1a1a1a]/10 text-[#1a1a1a]/40 hover:border-[#fc0] hover:text-[#1a1a1a] hover:shadow-xl rounded-2xl transition-all font-bold group"
                >
                  <Plus size={24} className="group-hover:rotate-90 transition-transform text-[#fc0]" />
                  ADD NEW SECTION
                </button>
              </div>
            )}
          </div>
        </main>
      </div>

      {isSelectorOpen && (
        <SectionSelector 
          onSelect={onAddSection} 
          onClose={() => setIsSelectorOpen(false)} 
        />
      )}

      {isSettingsOpen && (
        <PageSettingsPanel onClose={() => setIsSettingsOpen(false)} />
      )}

      {/* Right Sidebar - Always accessible for Page Settings */}
      {isSidebarVisible && (
        <div className="w-[450px] shrink-0 h-full border-l border-[#1a1a1a]/5 bg-white shadow-2xl z-[100] animate-in slide-in-from-right duration-300">
          <Sidebar />
        </div>
      )}
    </div>
  );
}
