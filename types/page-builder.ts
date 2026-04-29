export type SectionData = {
  heading?: string;
  content?: string;
  image?: string;
};

export type Section = {
  id: string;
  type: string;
  data: SectionData;
};