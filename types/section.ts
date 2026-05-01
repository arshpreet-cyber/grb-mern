import { SectionSettings } from "@/lib/redux/features/pageEditorSlice";

export interface SectionProps {
  id: string;
  data: any;
  settings: SectionSettings;
  isEditing?: boolean;
}
