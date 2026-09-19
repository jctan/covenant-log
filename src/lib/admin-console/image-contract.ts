export type AdminImageOrigin = 'public' | 'src/assets' | 'src/content' | 'cloud';
export type AdminImageBrowseGroup = 'all' | 'posts' | 'bits' | 'memo' | 'assets' | 'pages' | 'cloud' | 'uncategorized';
export type AdminImageScopeKey = 'recent';

export const ADMIN_IMAGE_DEFAULT_LIST_LIMIT = 20;

export const ADMIN_IMAGE_BROWSE_GROUP_LABELS = {
  all: 'All',
  posts: 'Posts',
  bits: 'Bits',
  memo: 'Memo',
  assets: 'Config assets',
  pages: 'Page illustrations',
  cloud: 'Cloud images',
  uncategorized: 'Uncategorized'
} as const satisfies Record<AdminImageBrowseGroup, string>;

export const ADMIN_IMAGE_BROWSE_GROUP_ORDER = [
  'all',
  'posts',
  'bits',
  'memo',
  'assets',
  'pages',
  'cloud',
  'uncategorized'
] as const satisfies readonly AdminImageBrowseGroup[];

export const ADMIN_IMAGE_SCOPE_LABELS = {
  recent: 'Recently modified'
} as const satisfies Record<AdminImageScopeKey, string>;

export const isAdminImageOrigin = (value: unknown): value is AdminImageOrigin =>
  value === 'public' || value === 'src/assets' || value === 'src/content' || value === 'cloud';

export const isAdminImageBrowseGroup = (value: unknown): value is AdminImageBrowseGroup =>
  typeof value === 'string' && value in ADMIN_IMAGE_BROWSE_GROUP_LABELS;

export const isAdminImageScopeKey = (value: unknown): value is AdminImageScopeKey =>
  typeof value === 'string' && value in ADMIN_IMAGE_SCOPE_LABELS;
