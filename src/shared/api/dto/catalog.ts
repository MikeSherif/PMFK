export type CatalogProfileDto = {
  id: string;
  fullName: string;
  company: string;
  role: string;
  industry: string;
  city: string;
  lookingFor: string;
  offering: string;
  tags: string[];
  about: string;
  saved: boolean;
};

export type FeedPageDto = {
  items: CatalogProfileDto[];
  nextCursor: string | null;
  total: number;
};
