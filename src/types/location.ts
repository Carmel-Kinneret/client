export type LocationPoint = {
  id: string;
  title: string;
  description?: string;
  latitude: number;
  longitude: number;
  category?: string;
  image?: string;
};

export type LocationSheetState = {
  locationId: string | null;
  isOpen: boolean;
};

export type LocationCategoryFilter = {
  category: string;
  active: boolean;
};

export type LocationImportSource = {
  rawLink: string;
  label?: string;
};

export type LocationImportResult = {
  points: LocationPoint[];
  source: LocationImportSource;
};