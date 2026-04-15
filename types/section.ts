export interface SectionItem {
  key: string;
  label: string;
  value?: string;
}

export interface Section {
  title: string;
  items: SectionItem[];
}
