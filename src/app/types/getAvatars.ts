export interface AvatarsDetail {
  avatar_media: string;
  avatar_id: number;
  name: string;
  avatar_gender: 'male' | 'female';
  status: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  total_pages: number;
  total_records: number;
  current_page: number;
  records_per_page: number;
}

export interface AvatarData {
  Records: AvatarsDetail[];
  Pagination: Pagination;
}

export interface GetAvatars {
  status: boolean;
  data: AvatarData;
  message: string;
  toast: boolean;
}
