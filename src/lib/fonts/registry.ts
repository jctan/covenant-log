import type { TypographyRole, TypographySettings } from '../theme-settings';

/* 字体注册表：ui.typography 设置的唯一可选值来源（受控枚举，不接受自由 font-family 字符串）。
   添加自定义字体 = 在 THEME_FONT_REGISTRY 增加一个条目（ThemeFontId 类型自动派生自条目 id）：
   - subset-pipeline 字体需自行提供 woff2 与 @font-face（见 README「字体与许可」）；
   - astro-fonts-api 字体只需 provider + familyName，构建时自动下载自托管。
   acquisition 语义：
   - subset-pipeline：自托管字体，woff2 由 npm run font:build（pyftsubset 内容感知子集）生成，@font-face 声明在 global.css；
   - system：纯系统字体栈，零下载；
   - astro-fonts-api：构建时由 Astro Fonts API 从 provider 下载并自托管，页面零第三方请求。 */

export type ThemeFontLocalVariant = {
  src: string;
  weight: number | string;
  style: 'normal' | 'italic';
};

type ThemeFontRegistryEntryBase = {
  id: string;
  label: string;
  /* 管理台字体卡片用的短名与来源说明：cardLabel + badge 随卡片展示（badge 为浅灰小字）；
     label/sizeHint 是注册表元数据（全称与获取成本说明），当前管理台 UI 不直接渲染。 */
  cardLabel: string;
  badge: string;
  roles: readonly TypographyRole[];
  /* fallbacks 按 CSS 字面量原样存储（含引号），保证默认 role 解析结果与 global.css tokens 逐字一致。 */
  fallbacks: readonly string[];
  license: string | null;
  sizeHint: string;
};

/* 按 acquisition/provider 判别的联合类型：非法组合（如 astro-fonts-api + provider:null、
   local 无 localVariants）在 `as const satisfies` 处直接编译报错，不会静默进入下拉。 */
export type ThemeFontRegistryEntry =
  | (ThemeFontRegistryEntryBase & {
      acquisition: 'system';
      provider: null;
      familyName: null;
      weights: readonly [];
    })
  | (ThemeFontRegistryEntryBase & {
      acquisition: 'subset-pipeline';
      provider: null;
      familyName: string;
      weights: readonly number[];
    })
  | (ThemeFontRegistryEntryBase & {
      acquisition: 'astro-fonts-api';
      provider: 'google' | 'fontsource';
      familyName: string;
      weights: readonly number[];
      /* 远程 provider 的下载子集，缺省 ['latin']；CJK 条目必须显式声明（如
         ['chinese-simplified', 'latin']），否则中文字形不在产物内、静默落到 fallback。 */
      subsets?: readonly string[];
    })
  | (ThemeFontRegistryEntryBase & {
      acquisition: 'astro-fonts-api';
      provider: 'local';
      familyName: string;
      weights: readonly number[];
      /* 字体文件路径（相对项目根，如 './src/assets/fonts/xxx.woff2'）。构建零网络依赖，
         仍由 Astro Fonts API 生成 @font-face 与度量对齐 fallback——大陆网络/离线构建的首选。 */
      localVariants: readonly ThemeFontLocalVariant[];
    });

export type ThemeFontAcquisition = ThemeFontRegistryEntry['acquisition'];
export type ThemeFontProvider = ThemeFontRegistryEntry['provider'];

export const THEME_FONT_REGISTRY = [
  {
    id: 'noto-serif-sc',
    label: 'Noto Serif SC',
    cardLabel: 'Noto Serif SC',
    badge: 'Self-hosted subset',
    roles: ['readable', 'brand'],
    acquisition: 'subset-pipeline',
    provider: null,
    familyName: 'Noto Serif SC',
    fallbacks: ['ui-serif', 'Georgia', '"Times New Roman"', '"Songti SC"', 'serif'],
    weights: [400, 600],
    license: 'OFL-1.1',
    sizeHint: 'Self-hosted content subset'
  },
  {
    id: 'lxgw-wenkai-lite',
    label: 'LXGW WenKai Lite',
    cardLabel: 'LXGW WenKai Lite',
    badge: 'Self-hosted subset',
    roles: ['readable', 'copy', 'brand'],
    acquisition: 'subset-pipeline',
    provider: null,
    familyName: 'LXGW WenKai Lite',
    fallbacks: ['"Kaiti SC"', '"STKaiti"', 'serif'],
    weights: [400],
    license: 'OFL-1.1',
    sizeHint: 'Self-hosted content subset'
  },
  {
    id: 'system-serif',
    label: 'System Serif (Songti / Georgia)',
    cardLabel: 'System Serif',
    badge: 'No download',
    roles: ['readable'],
    acquisition: 'system',
    provider: null,
    familyName: null,
    fallbacks: ['ui-serif', 'Georgia', '"Times New Roman"', '"Songti SC"', 'serif'],
    weights: [],
    license: null,
    sizeHint: 'No download'
  },
  {
    id: 'serif-georgia',
    label: 'System Serif (Georgia)',
    cardLabel: 'Georgia',
    badge: 'No download',
    roles: ['brand'],
    acquisition: 'system',
    provider: null,
    familyName: null,
    fallbacks: ['Georgia', 'serif'],
    weights: [],
    license: null,
    sizeHint: 'No download'
  },
  {
    id: 'system-kai',
    label: 'System Kaiti (Kaiti / STKaiti)',
    cardLabel: 'System Kaiti',
    badge: 'No download',
    roles: ['copy'],
    acquisition: 'system',
    provider: null,
    familyName: null,
    fallbacks: ['"Kaiti SC"', '"STKaiti"', 'serif'],
    weights: [],
    license: null,
    sizeHint: 'No download'
  },
  {
    id: 'system-mono',
    label: 'System Monospace (Sarasa / SF Mono)',
    cardLabel: 'System Monospace',
    badge: 'No download',
    roles: ['mono'],
    acquisition: 'system',
    provider: null,
    familyName: null,
    fallbacks: [
      '"Sarasa Mono SC"',
      '"Noto Sans Mono CJK SC"',
      'ui-monospace',
      'SFMono-Regular',
      'Menlo',
      'Monaco',
      'Consolas',
      '"Liberation Mono"',
      '"Courier New"',
      'monospace'
    ],
    weights: [],
    license: null,
    sizeHint: 'No download'
  },
  {
    id: 'jetbrains-mono',
    label: 'JetBrains Mono (Latin monospace)',
    cardLabel: 'JetBrains Mono',
    badge: 'Downloaded at build time',
    roles: ['mono'],
    acquisition: 'astro-fonts-api',
    // fontsource 走 jsDelivr/R2 分发，可达性优于 fonts.google.com（大陆网络不可达）。
    provider: 'fontsource',
    familyName: 'JetBrains Mono',
    fallbacks: [
      '"Sarasa Mono SC"',
      '"Noto Sans Mono CJK SC"',
      'ui-monospace',
      'SFMono-Regular',
      'Menlo',
      'Monaco',
      'Consolas',
      '"Liberation Mono"',
      '"Courier New"',
      'monospace'
    ],
    weights: [400],
    license: 'OFL-1.1',
    sizeHint: 'Downloaded and self-hosted at build time (latin; CJK falls back to system monospace)'
  },
  {
    id: 'noto-sans-sc',
    label: 'Noto Sans SC',
    cardLabel: 'Noto Sans SC',
    badge: 'Downloaded at build time ~1.1MB',
    roles: ['readable', 'copy'],
    acquisition: 'astro-fonts-api',
    provider: 'fontsource',
    familyName: 'Noto Sans SC',
    fallbacks: ['"PingFang SC"', '"Microsoft YaHei"', '"Heiti SC"', 'sans-serif'],
    // 单字重封顶下载成本：fontsource 的 CJK 子集是整段单文件（实测 unifont 不走编号切片），
    // 每加一档字重产物即 +1.1 MB。粗体由浏览器合成，与 lxgw-wenkai-lite 单字重策略一致。
    weights: [400],
    license: 'OFL-1.1',
    sizeHint: 'Downloaded and self-hosted at build time (~1.1 MB for the full CJK block + 13 KB latin, loaded on demand via unicode-range)',
    subsets: ['chinese-simplified', 'latin']
  },
  {
    id: 'fira-code',
    label: 'Fira Code (Latin monospace, ligatures)',
    cardLabel: 'Fira Code',
    badge: 'Downloaded at build time',
    roles: ['mono'],
    acquisition: 'astro-fonts-api',
    provider: 'fontsource',
    familyName: 'Fira Code',
    fallbacks: [
      '"Sarasa Mono SC"',
      '"Noto Sans Mono CJK SC"',
      'ui-monospace',
      'SFMono-Regular',
      'Menlo',
      'Monaco',
      'Consolas',
      '"Liberation Mono"',
      '"Courier New"',
      'monospace'
    ],
    weights: [400],
    license: 'OFL-1.1',
    sizeHint: 'Downloaded and self-hosted at build time (latin; CJK falls back to system monospace)'
  }
] as const satisfies readonly ThemeFontRegistryEntry[];

export type ThemeFontId = (typeof THEME_FONT_REGISTRY)[number]['id'];

/* 四角色的唯一枚举来源：新增 role 时只改这里与 TypographyRole 类型，消费方一律循环本常量。 */
export const TYPOGRAPHY_ROLES = ['readable', 'copy', 'mono', 'brand'] as const satisfies readonly TypographyRole[];

export const THEME_TYPOGRAPHY_DEFAULT: TypographySettings = {
  readable: 'noto-serif-sc',
  copy: 'lxgw-wenkai-lite',
  mono: 'system-mono',
  brand: 'serif-georgia'
};

export type ThemeFontOption = {
  id: ThemeFontId;
  cardLabel: string;
  badge: string;
  /* 卡片预览用的字体族栈（见 getThemeFontPreviewStack），直接喂给 CSS font-family。 */
  previewStack: string;
};

const entryHasRole = (entry: ThemeFontRegistryEntry, role: TypographyRole): boolean =>
  entry.roles.includes(role);

const buildRoleFontIdSet = (role: TypographyRole): ReadonlySet<string> =>
  new Set(THEME_FONT_REGISTRY.filter((entry) => entryHasRole(entry, role)).map((entry) => entry.id));

const ROLE_FONT_ID_SETS = Object.fromEntries(
  TYPOGRAPHY_ROLES.map((role) => [role, buildRoleFontIdSet(role)])
) as Record<TypographyRole, ReadonlySet<string>>;

export const isThemeFontIdForRole = (role: TypographyRole, value: string): value is ThemeFontId =>
  ROLE_FONT_ID_SETS[role].has(value);

/* 校验+回退的唯一实现（trim 后校验，非法返回 undefined）：canonicalize / theme-settings /
   config 期 raw 解析共用，避免三处各自维护同一语义。 */
export const asThemeFontIdForRole = (role: TypographyRole, value: unknown): ThemeFontId | undefined => {
  const trimmed = typeof value === 'string' ? value.trim() : '';
  return isThemeFontIdForRole(role, trimmed) ? trimmed : undefined;
};

export const getThemeFontOptionsForRole = (role: TypographyRole): ThemeFontOption[] =>
  THEME_FONT_REGISTRY
    .filter((entry) => entryHasRole(entry, role))
    .map(({ id, cardLabel, badge }) => ({
      id,
      cardLabel,
      badge,
      previewStack: getThemeFontPreviewStack(id)
    }));

export const getThemeFontRegistryEntry = (id: ThemeFontId): ThemeFontRegistryEntry | undefined =>
  THEME_FONT_REGISTRY.find((entry) => entry.id === id);

/* 管理台卡片预览专用栈：不含 var(--font-*)。未选中的 astro-fonts-api 字体页面上没有对应变量，
   var() 未定义会让整条 font-family 声明失效（连字面 fallback 一起丢），因此预览一律用
   字面量族名 + fallback 尽力渲染，不为预览额外下载字体。 */
export const getThemeFontPreviewStack = (id: ThemeFontId): string => {
  const entry = getThemeFontRegistryEntry(id);
  if (!entry) return '';
  const families = entry.familyName ? [`"${entry.familyName}"`, ...entry.fallbacks] : [...entry.fallbacks];
  return families.join(', ');
};

export const getThemeFontStack = (id: ThemeFontId): string => {
  const entry = getThemeFontRegistryEntry(id);
  if (!entry) return '';
  if (entry.acquisition === 'astro-fonts-api') {
    // Astro Fonts API 的 cssVariable 已含字体族与度量对齐的 fallback；追加注册表 fallback 兜住 CJK 字形。
    return [`var(--font-${entry.id})`, ...entry.fallbacks].join(', ');
  }
  return getThemeFontPreviewStack(id);
};

/* 当前 typography 选择中需要 Astro Fonts API 构建期下载的条目；astro.config 与 BaseLayout 共用同一判定。 */
export const getSelectedAstroApiFonts = (typography: TypographySettings): ThemeFontRegistryEntry[] => {
  const selected = new Set<string>(TYPOGRAPHY_ROLES.map((role) => typography[role]));
  return THEME_FONT_REGISTRY.filter(
    (entry) => entry.acquisition === 'astro-fonts-api' && selected.has(entry.id)
  );
};

/* 供 astro.config 在 config 期直接消费手读的 ui.json（不经 theme-settings 完整管线）：
   非法/缺失值一律回退默认，与 canonicalize 的容错语义一致。 */
export const resolveTypographyFromRawUiSettings = (raw: unknown): TypographySettings => {
  const isRecord = (value: unknown): value is Record<string, unknown> =>
    typeof value === 'object' && value !== null && !Array.isArray(value);
  const typography = isRecord(raw) && isRecord(raw.typography) ? raw.typography : {};
  const pick = (role: TypographyRole): ThemeFontId =>
    asThemeFontIdForRole(role, typography[role]) ?? THEME_TYPOGRAPHY_DEFAULT[role];
  return { readable: pick('readable'), copy: pick('copy'), mono: pick('mono'), brand: pick('brand') };
};

/* 仅为偏离默认值的 role 生成 --font-* 覆盖；默认态输出 null，global.css 的 :root tokens 保持唯一默认来源。 */
export const getTypographyStyleOverride = (typography: TypographySettings): string | null => {
  const declarations = TYPOGRAPHY_ROLES
    .filter((role) => typography[role] !== THEME_TYPOGRAPHY_DEFAULT[role])
    .map((role) => `--font-${role}: ${getThemeFontStack(typography[role])}`);
  return declarations.length ? declarations.join('; ') : null;
};
