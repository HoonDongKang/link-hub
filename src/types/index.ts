export interface Folder {
  id: string;
  name: string;
  color?: string;
  icon?: string;
  createdAt: number;
}

export interface Link {
  id: string;
  title: string;
  url: string;
  description: string;
  tags: string[];
  folderId: string | null; // null means it's unorganized/in root
  createdAt: number;
}
