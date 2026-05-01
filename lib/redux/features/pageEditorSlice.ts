import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface SectionSettings {
  padding?: string;
  margin?: string;
  width?: string;
  height?: string;
  backgroundColor?: string;
  textColor?: string;
  alignment?: 'left' | 'center' | 'right';
  visibility?: boolean;
  customClass?: string;
}

export interface Section {
  id: string;
  type: string;
  data: any;
  settings: SectionSettings;
}

export interface PageState {
  id: string;
  title: string;
  slug: string;
  sections: Section[];
  editMode: boolean;
  selectedSectionId: string | null;
  isSaving: boolean;
}

const initialState: PageState = {
  id: '',
  title: '',
  slug: '',
  sections: [],
  editMode: false,
  selectedSectionId: null,
  isSaving: false,
};

export const pageEditorSlice = createSlice({
  name: 'pageEditor',
  initialState,
  reducers: {
    setPage: (state, action: PayloadAction<{ id: string; title: string; slug: string; sections: Section[] }>) => {
      state.id = action.payload.id;
      state.title = action.payload.title;
      state.slug = action.payload.slug;
      state.sections = action.payload.sections;
    },
    setEditMode: (state, action: PayloadAction<boolean>) => {
      state.editMode = action.payload;
    },
    setSelectedSectionId: (state, action: PayloadAction<string | null>) => {
      state.selectedSectionId = action.payload;
    },
    updateSectionData: (state, action: PayloadAction<{ id: string; data: any }>) => {
      const section = state.sections.find((s) => s.id === action.payload.id);
      if (section) {
        section.data = { ...section.data, ...action.payload.data };
      }
    },
    updateSectionSettings: (state, action: PayloadAction<{ id: string; settings: Partial<SectionSettings> }>) => {
      const section = state.sections.find((s) => s.id === action.payload.id);
      if (section) {
        section.settings = { ...section.settings, ...action.payload.settings };
      }
    },
    addSection: (state, action: PayloadAction<{ type: string; data: any; settings?: SectionSettings }>) => {
      const newSection: Section = {
        id: `section-${Date.now()}`,
        type: action.payload.type,
        data: action.payload.data,
        settings: action.payload.settings || { visibility: true },
      };
      state.sections.push(newSection);
      state.selectedSectionId = newSection.id;
    },
    duplicateSection: (state, action: PayloadAction<string>) => {
      const index = state.sections.findIndex((s) => s.id === action.payload);
      if (index !== -1) {
        const original = state.sections[index];
        const copy: Section = {
          ...original,
          id: `section-${Date.now()}`,
        };
        state.sections.splice(index + 1, 0, copy);
      }
    },
    deleteSection: (state, action: PayloadAction<string>) => {
      state.sections = state.sections.filter((s) => s.id !== action.payload);
      if (state.selectedSectionId === action.payload) {
        state.selectedSectionId = null;
      }
    },
    reorderSections: (state, action: PayloadAction<Section[]>) => {
      state.sections = action.payload;
    },
    setIsSaving: (state, action: PayloadAction<boolean>) => {
      state.isSaving = action.payload;
    },
  },
});

export const {
  setPage,
  setEditMode,
  setSelectedSectionId,
  updateSectionData,
  updateSectionSettings,
  addSection,
  duplicateSection,
  deleteSection,
  reorderSections,
  setIsSaving,
} = pageEditorSlice.actions;

export default pageEditorSlice.reducer;
