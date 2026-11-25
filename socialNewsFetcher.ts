import dns from 'node:dns/promises';
import net from 'node:net';
import crypto from 'node:crypto';
import type {
  SocialFeedPlatform,
  SocialFeedSourcesConfig,
  SocialNewsFeedItem,
} from '../src/types/index.ts';

export const DEFAULT_SOCIAL_FEED_SOURCES: SocialFeedSourcesConfig = {
  autoSyncIntervalMinutes: 15,
  defaultNewsKeywords: [
    'CoLASH',
    'কোলাশ',
    'CoLASH Foundation',
    'কোলাশ ফাউন্ডেশন',
    'কমলগঞ্জ',
    'Kamalganj',
    'মৌলভীবাজার',
    'Moulvibazar',
    'সিলেট',
    'বন্যা',
    'ত্রাণ',
    'রক্তদান',
    'মানবিক',
  ],
  socialAccounts: [
    {
      id: 'social-fb-colash',
      platform: 'facebook',
      label: 'CoLASH Official Facebook Page',
      pageUrl: 'https://www.facebook.com/CoLASHFoundation',
      rssOrBridgeUrl: '',
      channelOrPageId: '',
      accessToken: '',
      autoSyncEnabled: true,
      lastStatus: 'needs_config',
      lastMessage: 'Add a Meta Page Access Token + Page ID or a Facebook RSS/Bridge URL for automated post pull.',
    },
    {
      id: 'social-ig-colash',
      platform: 'instagram',
      label: 'CoLASH Official Instagram',
      pageUrl: 'https://www.instagram.com/colashfoundation',
      rssOrBridgeUrl: '',
      channelOrPageId: '',
      accessToken: '',
      autoSyncEnabled: true,
      lastStatus: 'needs_config',
      lastMessage: 'Add an Instagram Graph Token + IG User ID or Instagram RSS/Bridge URL for automated reel/post pull.',
    },
    {
      id: 'social-yt-colash',
      platform: 'youtube',
      label: 'CoLASH Foundation YouTube',
      pageUrl: 'https://www.youtube.com/@CoLASHFoundation',
      rssOrBridgeUrl: '',
      channelOrPageId: '',
      accessToken: '',
      autoSyncEnabled: true,
      lastStatus: 'needs_config',
      lastMessage: 'Auto-discovers YouTube Atom feed from Channel URL or Channel ID.',
    },
  ],
  newsChannels: [
    {
      id: 'news-prothomalo',
      nameBn: 'প্রথম আলো (Prothom Alo)',
      nameEn: 'Prothom Alo',
      siteUrl: 'https://www.prothomalo.com',
      rssUrl: 'https://www.prothomalo.com/feed',
      keywords: ['CoLASH', 'কোলাশ', 'কমলগঞ্জ', 'মৌলভীবাজার', 'বন্যা', 'ত্রাণ', 'রক্তদান'],
      matchAllArticles: false,
      autoSyncEnabled: true,
    },
    {
      id: 'news-dailystar',
      nameBn: 'দ্য ডেইলি স্টার (The Daily Star)',
      nameEn: 'The Daily Star',
      siteUrl: 'https://www.thedailystar.net',
      rssUrl: 'https://www.thedailystar.net/frontpage/rss.xml',
      keywords: ['CoLASH', 'Kamalganj', 'Moulvibazar', 'Sylhet', 'flood', 'relief', 'blood'],
      matchAllArticles: false,
      autoSyncEnabled: true,
    },
    {
      id: 'news-jagonews24',
      nameBn: 'জাগোনিউজ২৪ (Jagonews24)',
      nameEn: 'Jagonews24',
      siteUrl: 'https://www.jagonews24.com',
      rssUrl: 'https://www.jagonews24.com/rss/rss.xml',
      keywords: ['CoLASH', 'কোলাশ', 'কমলগঞ্জ', 'মৌলভীবাজার', 'সিলেট', 'মানবিক', 'রক্তদান'],
      matchAllArticles: false,
      autoSyncEnabled: true,
    },
    {
      id: 'news-dhakatribune',
      nameBn: 'ঢাকা ট্রিবিউন (Dhaka Tribune)',
      nameEn: 'Dhaka Tribune',
      siteUrl: 'https://www.dhakatribune.com',
      rssUrl: 'https://www.dhakatribune.com/feed',
      keywords: ['CoLASH', 'Kamalganj', 'Moulvibazar', 'Sylhet', 'relief', 'charity'],
      matchAllArticles: false,
      autoSyncEnabled: true,
    },
  ],
};

function isPrivateOrLocalIp(ip: string): boolean {
  if (!ip) return true;
  const clean = ip.toLowerCase();
  if (clean === '::1' || clean === '::' || clean.startsWith('fe80:') || clean.startsWith('fc') || clean.startsWith('fd')) {
    return true;
  }
  if (clean.startsWith('::ffff:')) {
    return isPrivateOrLocalIp(clean.slice(7));
  }
  if (!net.isIPv4(clean)) return false;
  const parts = clean.split('.').map(Number);
  if (parts.length !== 4 || parts.some((n) => Number.isNaN(n))) return true;
  const [a, b] = parts;
  if (a === 0 || a === 10 || a === 127) return true;
  if (a === 169 && b === 254) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  if (a === 192 && b === 168) return true;
  if (a === 100 && b >= 64 && b <= 127) return true;
  return false;
}

export async function assertSafePublicUrl(rawUrl: string): Promise<URL> {
  const trimmed = String(rawUrl || '').trim();
  if (!trimmed) {
    throw new Error('URL is required');
  }
  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  let parsed: URL;
  try {
    parsed = new URL(withProtocol);
  } catch {
    throw new Error('Invalid URL format');
  }
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    throw new Error('Only HTTP/HTTPS URLs are allowed');
  }
  const host = parsed.hostname.toLowerCase();
  if (
    host === 'localhost' ||
    host.endsWith('.local') ||
    host.endsWith('.internal') ||
    host === '0.0.0.0' ||
    host === '[::1]'
  ) {
    throw new Error('Local or internal URLs are not permitted');
  }
  if (net.isIP(host) && isPrivateOrLocalIp(host)) {
    throw new Error('Private IP addresses are not permitted');
  }
  try {
    const records = await dns.lookup(host, { all: true });
    for (const rec of records) {
      if (isPrivateOrLocalIp(rec.address)) {
        throw new Error('URL resolves to a private network address');
      }
    }
  } catch (err) {
    if (err instanceof Error && err.message.includes('private network')) {
      throw err;
    }
    // DNS lookup might fail in sandboxed checks or transient offline — let fetch attempt fail cleanly if unreachable
  }
  return parsed;
}

export function normalizeUrlKey(urlStr: string): string {
  try {
    const u = new URL(urlStr.trim());
    u.hash = '';
    const dropParams = ['fbclid', 'gclid', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'mibextid', 'si'];
    for (const p of dropParams) {
      u.searchParams.delete(p);
    }
    const cleanPath = u.pathname.replace(/\/+$/, '') || '/';
    return `${u.protocol}//${u.hostname.toLowerCase()}${cleanPath}${u.search}`;
  } catch {
    return urlStr.trim().toLowerCase();
  }
}

export function makeDeterministicId(prefix: string, uniqueSeed: string): string {
  const hash = crypto.createHash('sha1').update(uniqueSeed).digest('hex').slice(0, 14);
  return `${prefix}-${hash}`;
}

export function decodeHtmlEntities(input: string): string {
  if (!input) return '';
  return input
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&nbsp;/gi, ' ')
    .replace(/&#(\d+);/g, (_m, dec) => {
      const code = Number(dec);
      return Number.isFinite(code) ? String.fromCodePoint(code) : '';
    })
    .replace(/&#x([0-9a-f]+);/gi, (_m, hex) => {
      const code = parseInt(hex, 16);
      return Number.isFinite(code) ? String.fromCodePoint(code) : '';
    })
    .trim();
}

export function stripHtmlTags(input: string): string {
  if (!input) return '';
  return decodeHtmlEntities(input)
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const KNOWN_NEWS_HOSTS = [
  'prothomalo.com',
  'thedailystar.net',
  'bdnews24.com',
  'jugantor.com',
  'kalerkantho.com',
  'somoynews.tv',
  'jamuna.tv',
  'ittefaq.com.bd',
  'samakal.com',
  'dhakatribune.com',
  'tbsnews.net',
  'jagonews24.com',
  'banglanews24.com',
  'channelionline.com',
  'ekattor.tv',
  'independent24.com',
  'dailyjanakantha.com',
  'manabzamin.com',
  'mzamin.com',
  'nayadiganta.com',
  'inqilab.com',
  'bbc.com',
  'aljazeera.com',
  'reuters.com',
];

export function detectPlatformFromUrl(urlStr: string): SocialFeedPlatform {
  try {
    const u = new URL(urlStr);
    const host = u.hostname.toLowerCase().replace(/^www\./, '');
    if (host.includes('youtube.com') || host === 'youtu.be') return 'youtube';
    if (host.includes('facebook.com') || host.includes('fb.watch') || host === 'fb.com') return 'facebook';
    if (host.includes('instagram.com') || host === 'instagr.am') return 'instagram';
    if (KNOWN_NEWS_HOSTS.some((d) => host === d || host.endsWith(`.${d}`))) return 'news';
    if (/\/(news|article|bangladesh|national|sylhet|sylhet-division)\//i.test(u.pathname)) return 'news';
    return 'web';
  } catch {
    return 'web';
  }
}

export function extractYouTubeVideoId(urlStr: string): string | null {
  try {
    const u = new URL(urlStr);
    const host = u.hostname.toLowerCase().replace(/^www\./, '');
    if (host === 'youtu.be') {
      const seg = u.pathname.split('/').filter(Boolean)[0];
      return seg && seg.length >= 6 ? seg : null;
    }
    if (host.includes('youtube.com')) {
      const v = u.searchParams.get('v');
      if (v) return v;
      const parts = u.pathname.split('/').filter(Boolean);
      if ((parts[0] === 'shorts' || parts[0] === 'embed' || parts[0] === 'live') && parts[1]) {
        return parts[1];
      }
    }
  } catch {
    // ignore
  }
  return null;
}

function extractMetaTags(html: string): Record<string, string> {
  const metaMap: Record<string, string> = {};
  const metaRegex = /<meta\s+([^>]*?)>/gi;
  let match: RegExpExecArray | null;
  while ((match = metaRegex.exec(html)) !== null) {
    const attrsStr = match[1];
    const attrs: Record<string, string> = {};
    const attrRegex = /([a-zA-Z0-9:_-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+))/g;
    let attrMatch: RegExpExecArray | null;
    while ((attrMatch = attrRegex.exec(attrsStr)) !== null) {
      const key = attrMatch[1].toLowerCase();
      const val = decodeHtmlEntities(attrMatch[2] ?? attrMatch[3] ?? attrMatch[4] ?? '');
      attrs[key] = val;
    }
    const nameKey = (attrs.property || attrs.name || attrs.itemprop || '').toLowerCase();
    if (nameKey && attrs.content && !metaMap[nameKey]) {
      metaMap[nameKey] = attrs.content;
    }
  }
  return metaMap;
}

function resolveAbsoluteUrl(maybeRelative: string, baseUrl: string): string {
  const clean = (maybeRelative || '').trim();
  if (!clean) return '';
  try {
    return new URL(clean, baseUrl).toString();
  } catch {
    return clean;
  }
}

function looksBlockedTitle(title: string): boolean {
  const lower = title.toLowerCase();
  return (
    !lower ||
    lower === 'facebook' ||
    lower === 'instagram' ||
    lower === 'youtube' ||
    lower.includes('log in or sign up') ||
    lower.includes('log into facebook') ||
    lower.includes('just a moment') ||
    lower.includes('attention required') ||
    lower.includes('access denied')
  );
}

export interface ParsedLinkResult {
  item: SocialNewsFeedItem;
  needsManualDetails: boolean;
  fetchNote?: string;
}

export async function fetchAndExtractLinkMetadata(
  rawUrl: string,
  submittedBy?: string,
  submitterNote?: string
): Promise<ParsedLinkResult> {
  const parsedUrl = await assertSafePublicUrl(rawUrl);
  const finalInputUrl = parsedUrl.toString();
  const platform = detectPlatformFromUrl(finalInputUrl);
  const ytVideoId = platform === 'youtube' ? extractYouTubeVideoId(finalInputUrl) : null;
  const fallbackHost = parsedUrl.hostname.replace(/^www\./, '');

  let title = '';
  let description = '';
  let imageUrl = '';
  let sourceName = fallbackHost;
  let publishedAt = new Date().toISOString();
  let canonicalUrl = finalInputUrl;
  let embedUrl = ytVideoId ? `https://www.youtube.com/embed/${ytVideoId}` : '';
  let needsManualDetails = false;
  let fetchNote: string | undefined;

  // 1. Try YouTube oEmbed first for instant reliable metadata
  if (ytVideoId) {
    imageUrl = `https://i.ytimg.com/vi/${ytVideoId}/hqdefault.jpg`;
    sourceName = 'YouTube';
    try {
      const oembedRes = await fetch(
        `https://www.youtube.com/oembed?url=${encodeURIComponent(finalInputUrl)}&format=json`,
        { signal: AbortSignal.timeout(7000) }
      );
      if (oembedRes.ok) {
        const oData = (await oembedRes.json()) as {
          title?: string;
          author_name?: string;
          thumbnail_url?: string;
        };
        if (oData.title) title = oData.title.trim();
        if (oData.author_name) sourceName = oData.author_name.trim();
        if (oData.thumbnail_url) imageUrl = oData.thumbnail_url.trim();
      }
    } catch {
      // Fall through to HTML fetch
    }
  }

  // 2. Fetch page HTML & inspect OpenGraph / Twitter / Meta tags
  try {
    const response = await fetch(finalInputUrl, {
      redirect: 'follow',
      signal: AbortSignal.timeout(8500),
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'bn-BD,bn;q=0.9,en-US;q=0.8,en;q=0.7',
      },
    });

    if (response.url) {
      await assertSafePublicUrl(response.url);
      canonicalUrl = response.url;
    }

    const contentType = (response.headers.get('content-type') || '').toLowerCase();
    if (response.ok && (contentType.includes('text/html') || contentType.includes('application/xhtml') || !contentType)) {
      const html = (await response.text()).slice(0, 600_000);
      const metas = extractMetaTags(html);

      const ogTitle =
        metas['og:title'] ||
        metas['twitter:title'] ||
        metas['title'] ||
        decodeHtmlEntities((html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || '').trim());

      const ogDesc =
        metas['og:description'] ||
        metas['twitter:description'] ||
        metas['description'] ||
        '';

      const ogImage =
        metas['og:image:secure_url'] ||
        metas['og:image'] ||
        metas['twitter:image'] ||
        metas['twitter:image:src'] ||
        '';

      const ogSite = metas['og:site_name'] || '';
      const pubTime = metas['article:published_time'] || metas['og:updated_time'] || metas['date'] || '';
      const canonicalTag = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i)?.[1];

      if (ogTitle && !looksBlockedTitle(ogTitle) && !title) {
        title = ogTitle;
      }
      if (ogDesc && !looksBlockedTitle(ogDesc) && !description) {
        description = ogDesc;
      }
      if (ogImage && !imageUrl) {
        imageUrl = resolveAbsoluteUrl(ogImage, canonicalUrl);
      }
      if (ogSite && sourceName === fallbackHost) {
        sourceName = ogSite;
      }
      if (pubTime) {
        const parsedDate = Date.parse(pubTime);
        if (!Number.isNaN(parsedDate)) {
          publishedAt = new Date(parsedDate).toISOString();
        }
      }
      if (canonicalTag) {
        try {
          const abs = new URL(canonicalTag, canonicalUrl).toString();
          if (!abs.includes('/login')) canonicalUrl = abs;
        } catch {
          // ignore invalid canonical
        }
      }
    } else if (!response.ok) {
      fetchNote = `Site responded with HTTP ${response.status}; you can confirm or edit the title & summary below.`;
    }
  } catch (err) {
    fetchNote =
      err instanceof Error
        ? `Automatic preview restricted (${err.message}); please verify title & summary before submitting.`
        : 'Automatic preview restricted; please verify title & summary before submitting.';
  }

  if (!title || looksBlockedTitle(title)) {
    needsManualDetails = true;
    if (platform === 'facebook') {
      sourceName = 'Facebook';
      title = 'Facebook Post / Video — CoLASH Update';
    } else if (platform === 'instagram') {
      sourceName = 'Instagram';
      title = 'Instagram Post / Reel — CoLASH Update';
    } else if (platform === 'youtube' && ytVideoId) {
      sourceName = 'YouTube';
      title = `YouTube Video (${ytVideoId})`;
    } else {
      const pathSlug = decodeURIComponent(
        parsedUrl.pathname.split('/').filter(Boolean).pop() || fallbackHost
      )
        .replace(/[-_]+/g, ' ')
        .slice(0, 120);
      title = pathSlug || `${fallbackHost} Update`;
    }
    if (!fetchNote) {
      fetchNote =
        'This link has restricted public preview metadata (common on Facebook/Instagram login walls). You can edit the Bengali/English title and summary below before sending for approval.';
    }
  }

  const cleanTitle = stripHtmlTags(title).slice(0, 220);
  const cleanDesc = stripHtmlTags(description || submitterNote || `${sourceName} থেকে সংগৃহীত লিংক।`).slice(0, 600);
  const normalizedUrl = normalizeUrlKey(canonicalUrl || finalInputUrl);

  const item: SocialNewsFeedItem = {
    id: makeDeterministicId('lnk', normalizedUrl),
    titleBn: cleanTitle,
    titleEn: cleanTitle,
    summaryBn: cleanDesc,
    summaryEn: cleanDesc,
    sourceUrl: finalInputUrl,
    platform,
    sourceName: sourceName.slice(0, 80),
    imageUrl: imageUrl || undefined,
    embedUrl: embedUrl || undefined,
    externalId: ytVideoId || normalizedUrl,
    importMethod: 'link_paste',
    status: 'pending',
    submittedBy: submittedBy || 'Web Visitor / Coordinator',
    submitterNote: submitterNote || undefined,
    publishedAt,
    fetchedAt: new Date().toISOString(),
    tags: [platform, sourceName].filter(Boolean),
  };

  return { item, needsManualDetails, fetchNote };
}

interface ParsedFeedEntry {
  title: string;
  link: string;
  summary: string;
  publishedAt: string;
  imageUrl?: string;
  externalId?: string;
  embedUrl?: string;
}

function getTagValue(block: string, tagNames: string[]): string {
  for (const tag of tagNames) {
    const escaped = tag.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(`<${escaped}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${escaped}>`, 'i');
    const m = block.match(re);
    if (m && m[1]) {
      return decodeHtmlEntities(m[1]).trim();
    }
  }
  return '';
}

function parseRssOrAtomXml(xml: string, baseUrl: string): ParsedFeedEntry[] {
  const entries: ParsedFeedEntry[] = [];
  const isAtom = /<feed[\s>]/i.test(xml) && /<entry[\s>]/i.test(xml);
  const blockRegex = isAtom ? /<entry[\s>]([\s\S]*?)<\/entry>/gi : /<item[\s>]([\s\S]*?)<\/item>/gi;

  let m: RegExpExecArray | null;
  while ((m = blockRegex.exec(xml)) !== null) {
    const block = m[1];
    const title = stripHtmlTags(getTagValue(block, ['title']));
    let link = getTagValue(block, ['link', 'guid', 'id']);

    if (!link || !/^https?:\/\//i.test(link)) {
      const atomLinkMatch =
        block.match(/<link[^>]+rel=["']alternate["'][^>]+href=["']([^"']+)["']/i) ||
        block.match(/<link[^>]+href=["']([^"']+)["']/i);
      if (atomLinkMatch && atomLinkMatch[1]) {
        link = decodeHtmlEntities(atomLinkMatch[1]);
      }
    }
    if (!link) continue;
    link = resolveAbsoluteUrl(link, baseUrl);
    if (!/^https?:\/\//i.test(link)) continue;

    const rawBody = getTagValue(block, ['media:description', 'description', 'summary', 'content:encoded', 'content']);
    const summary = stripHtmlTags(rawBody).slice(0, 420);

    const rawDate = getTagValue(block, ['pubDate', 'published', 'updated', 'dc:date']);
    const parsedTime = rawDate ? Date.parse(rawDate) : NaN;
    const publishedAt = !Number.isNaN(parsedTime) ? new Date(parsedTime).toISOString() : new Date().toISOString();

    let imageUrl = '';
    const thumbMatch =
      block.match(/<media:thumbnail[^>]+url=["']([^"']+)["']/i) ||
      block.match(/<media:content[^>]+url=["']([^"']+)["']/i) ||
      block.match(/<enclosure[^>]+url=["']([^"']+)["']/i) ||
      rawBody.match(/<img[^>]+src=["']([^"']+)["']/i);
    if (thumbMatch && thumbMatch[1]) {
      imageUrl = resolveAbsoluteUrl(decodeHtmlEntities(thumbMatch[1]), baseUrl);
    }

    const ytVideoId = getTagValue(block, ['yt:videoId']) || extractYouTubeVideoId(link) || undefined;
    if (!imageUrl && ytVideoId) {
      imageUrl = `https://i.ytimg.com/vi/${ytVideoId}/hqdefault.jpg`;
    }

    entries.push({
      title: title || link,
      link,
      summary: summary || title || link,
      publishedAt,
      imageUrl: imageUrl || undefined,
      externalId: ytVideoId || getTagValue(block, ['guid', 'id']) || link,
      embedUrl: ytVideoId ? `https://www.youtube.com/embed/${ytVideoId}` : undefined,
    });
  }
  return entries;
}

async function resolveYouTubeChannelId(pageUrl: string): Promise<string | null> {
  try {
    const u = new URL(pageUrl);
    const channelMatch = u.pathname.match(/\/channel\/(UC[a-zA-Z0-9_-]+)/);
    if (channelMatch) return channelMatch[1];

    const res = await fetch(pageUrl, {
      signal: AbortSignal.timeout(8000),
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; CoLASHBot/1.0)',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    });
    if (!res.ok) return null;
    const html = (await res.text()).slice(0, 600_000);
    const metaId =
      html.match(/<meta[^>]+itemprop=["']channelId["'][^>]+content=["'](UC[a-zA-Z0-9_-]+)["']/i)?.[1] ||
      html.match(/"channelId"\s*:\s*"(UC[a-zA-Z0-9_-]+)"/)?.[1] ||
      html.match(/"externalId"\s*:\s*"(UC[a-zA-Z0-9_-]+)"/)?.[1];
    return metaId || null;
  } catch {
    return null;
  }
}

export interface SyncRunResult {
  discoveredItems: SocialNewsFeedItem[];
  updatedSources: SocialFeedSourcesConfig;
  reports: Array<{ id: string; label: string; status: string; found: number; message: string }>;
}

export async function runSocialAndNewsSync(
  currentSources: SocialFeedSourcesConfig,
  websiteConfig?: { facebookUrl?: string; instagramUrl?: string; youtubeUrl?: string } | null,
  target: 'all' | 'social' | 'news' = 'all'
): Promise<SyncRunResult> {
  const sources: SocialFeedSourcesConfig = {
    ...DEFAULT_SOCIAL_FEED_SOURCES,
    ...currentSources,
    socialAccounts: (currentSources.socialAccounts?.length
      ? currentSources.socialAccounts
      : DEFAULT_SOCIAL_FEED_SOURCES.socialAccounts
    ).map((a) => ({ ...a })),
    newsChannels: (currentSources.newsChannels?.length
      ? currentSources.newsChannels
      : DEFAULT_SOCIAL_FEED_SOURCES.newsChannels
    ).map((c) => ({ ...c })),
  };

  // Sync latest Facebook/Instagram/YouTube URLs from published websiteConfig
  if (websiteConfig) {
    const urlByPlatform: Partial<Record<'facebook' | 'instagram' | 'youtube', string>> = {
      facebook: websiteConfig.facebookUrl,
      instagram: websiteConfig.instagramUrl,
      youtube: websiteConfig.youtubeUrl,
    };
    for (const acc of sources.socialAccounts) {
      const cfgUrl = urlByPlatform[acc.platform];
      if (cfgUrl && /^https?:\/\//i.test(cfgUrl.trim()) && (!acc.pageUrl || acc.id.startsWith('social-'))) {
        acc.pageUrl = cfgUrl.trim();
      }
    }
  }

  const discoveredItems: SocialNewsFeedItem[] = [];
  const reports: SyncRunResult['reports'] = [];
  const nowIso = new Date().toISOString();

  // ------------------------------------------------------------------
  // A. Connected Social Platforms Sync (YouTube Atom + Meta Graph + RSS Bridge)
  // ------------------------------------------------------------------
  if (target === 'all' || target === 'social') {
    for (const acc of sources.socialAccounts) {
      if (!acc.autoSyncEnabled) continue;
      let foundCount = 0;

      try {
        // 1. Custom RSS/Atom or JSON Bridge URL works for ANY platform (FB/IG/YT)
        if (acc.rssOrBridgeUrl && /^https?:\/\//i.test(acc.rssOrBridgeUrl.trim())) {
          const bridgeUrl = (await assertSafePublicUrl(acc.rssOrBridgeUrl)).toString();
          const res = await fetch(bridgeUrl, { signal: AbortSignal.timeout(8500) });
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const text = await res.text();
          const trimmed = text.trim();

          if (trimmed.startsWith('{')) {
            const jsonFeed = JSON.parse(trimmed) as {
              items?: Array<{
                id?: string;
                url?: string;
                title?: string;
                content_text?: string;
                content_html?: string;
                summary?: string;
                image?: string;
                date_published?: string;
              }>;
            };
            for (const entry of (jsonFeed.items || []).slice(0, 12)) {
              const link = entry.url;
              if (!link) continue;
              const itemTitle = stripHtmlTags(entry.title || entry.summary || `${acc.label} Post`).slice(0, 220);
              const itemDesc = stripHtmlTags(entry.summary || entry.content_text || entry.content_html || itemTitle).slice(0, 500);
              discoveredItems.push({
                id: makeDeterministicId(`soc-${acc.platform}`, normalizeUrlKey(link)),
                titleBn: itemTitle,
                titleEn: itemTitle,
                summaryBn: itemDesc,
                summaryEn: itemDesc,
                sourceUrl: link,
                platform: acc.platform,
                sourceName: acc.label,
                imageUrl: entry.image,
                externalId: entry.id || link,
                importMethod: 'auto_social',
                status: 'pending',
                submittedBy: `Auto-Sync (${acc.label})`,
                publishedAt: entry.date_published || nowIso,
                fetchedAt: nowIso,
                tags: [acc.platform, 'auto_social'],
              });
              foundCount += 1;
            }
          } else {
            const parsedEntries = parseRssOrAtomXml(text, bridgeUrl).slice(0, 12);
            for (const entry of parsedEntries) {
              discoveredItems.push({
                id: makeDeterministicId(`soc-${acc.platform}`, normalizeUrlKey(entry.link)),
                titleBn: entry.title,
                titleEn: entry.title,
                summaryBn: entry.summary,
                summaryEn: entry.summary,
                sourceUrl: entry.link,
                platform: acc.platform,
                sourceName: acc.label,
                imageUrl: entry.imageUrl,
                embedUrl: entry.embedUrl,
                externalId: entry.externalId,
                importMethod: 'auto_social',
                status: 'pending',
                submittedBy: `Auto-Sync (${acc.label})`,
                publishedAt: entry.publishedAt,
                fetchedAt: nowIso,
                tags: [acc.platform, 'auto_social'],
              });
              foundCount += 1;
            }
          }
          acc.lastSyncedAt = nowIso;
          acc.lastStatus = 'ok';
          acc.lastMessage = `Fetched ${foundCount} items via connected feed.`;
        }
        // 2. Meta Graph API for Facebook / Instagram when Page Token + ID are configured
        else if ((acc.platform === 'facebook' || acc.platform === 'instagram') && acc.accessToken && acc.channelOrPageId) {
          if (acc.platform === 'facebook') {
            const graphUrl = `https://graph.facebook.com/v21.0/${encodeURIComponent(acc.channelOrPageId)}/posts?fields=id,message,story,created_time,full_picture,permalink_url&limit=10&access_token=${encodeURIComponent(acc.accessToken)}`;
            const res = await fetch(graphUrl, { signal: AbortSignal.timeout(8500) });
            const json = (await res.json()) as {
              data?: Array<{
                id: string;
                message?: string;
                story?: string;
                created_time?: string;
                full_picture?: string;
                permalink_url?: string;
              }>;
              error?: { message?: string };
            };
            if (!res.ok || json.error) {
              throw new Error(json.error?.message || `Graph API HTTP ${res.status}`);
            }
            for (const post of json.data || []) {
              const link = post.permalink_url || acc.pageUrl;
              const rawText = (post.message || post.story || 'Facebook Page Update').trim();
              const title = rawText.split('\n')[0].slice(0, 140);
              discoveredItems.push({
                id: makeDeterministicId('soc-fb', post.id || normalizeUrlKey(link)),
                titleBn: title,
                titleEn: title,
                summaryBn: rawText.slice(0, 500),
                summaryEn: rawText.slice(0, 500),
                sourceUrl: link,
                platform: 'facebook',
                sourceName: acc.label,
                imageUrl: post.full_picture,
                externalId: post.id,
                importMethod: 'auto_social',
                status: 'pending',
                submittedBy: `Facebook Graph API (${acc.label})`,
                publishedAt: post.created_time || nowIso,
                fetchedAt: nowIso,
                tags: ['facebook', 'graph_api'],
              });
              foundCount += 1;
            }
          } else {
            const igUrl = `https://graph.facebook.com/v21.0/${encodeURIComponent(acc.channelOrPageId)}/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp&limit=10&access_token=${encodeURIComponent(acc.accessToken)}`;
            const res = await fetch(igUrl, { signal: AbortSignal.timeout(8500) });
            const json = (await res.json()) as {
              data?: Array<{
                id: string;
                caption?: string;
                media_url?: string;
                thumbnail_url?: string;
                permalink?: string;
                timestamp?: string;
              }>;
              error?: { message?: string };
            };
            if (!res.ok || json.error) {
              throw new Error(json.error?.message || `Instagram API HTTP ${res.status}`);
            }
            for (const media of json.data || []) {
              const link = media.permalink || acc.pageUrl;
              const rawCaption = (media.caption || 'Instagram Post').trim();
              const title = rawCaption.split('\n')[0].slice(0, 140);
              discoveredItems.push({
                id: makeDeterministicId('soc-ig', media.id || normalizeUrlKey(link)),
                titleBn: title,
                titleEn: title,
                summaryBn: rawCaption.slice(0, 500),
                summaryEn: rawCaption.slice(0, 500),
                sourceUrl: link,
                platform: 'instagram',
                sourceName: acc.label,
                imageUrl: media.thumbnail_url || media.media_url,
                externalId: media.id,
                importMethod: 'auto_social',
                status: 'pending',
                submittedBy: `Instagram Graph API (${acc.label})`,
                publishedAt: media.timestamp || nowIso,
                fetchedAt: nowIso,
                tags: ['instagram', 'graph_api'],
              });
              foundCount += 1;
            }
          }
          acc.lastSyncedAt = nowIso;
          acc.lastStatus = 'ok';
          acc.lastMessage = `Synced ${foundCount} posts from Meta Graph API.`;
        }
        // 3. YouTube automatic public Atom feed discovery via Channel ID or Channel URL
        else if (acc.platform === 'youtube') {
          let channelId = acc.channelOrPageId?.trim() || '';
          if (!channelId && acc.pageUrl) {
            await assertSafePublicUrl(acc.pageUrl);
            channelId = (await resolveYouTubeChannelId(acc.pageUrl)) || '';
            if (channelId) acc.channelOrPageId = channelId;
          }
          if (!channelId) {
            acc.lastSyncedAt = nowIso;
            acc.lastStatus = 'needs_config';
            acc.lastMessage = 'Could not auto-detect YouTube Channel ID (UC...) from the configured URL. Enter Channel ID or RSS URL in settings.';
          } else {
            const ytFeedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${encodeURIComponent(channelId)}`;
            const res = await fetch(ytFeedUrl, { signal: AbortSignal.timeout(8500) });
            if (!res.ok) throw new Error(`YouTube Feed HTTP ${res.status}`);
            const xml = await res.text();
            const parsedEntries = parseRssOrAtomXml(xml, ytFeedUrl).slice(0, 10);
            for (const entry of parsedEntries) {
              discoveredItems.push({
                id: makeDeterministicId('soc-yt', normalizeUrlKey(entry.link)),
                titleBn: entry.title,
                titleEn: entry.title,
                summaryBn: entry.summary,
                summaryEn: entry.summary,
                sourceUrl: entry.link,
                platform: 'youtube',
                sourceName: acc.label,
                imageUrl: entry.imageUrl,
                embedUrl: entry.embedUrl,
                externalId: entry.externalId,
                importMethod: 'auto_social',
                status: 'pending',
                submittedBy: `YouTube Auto-Sync (${acc.label})`,
                publishedAt: entry.publishedAt,
                fetchedAt: nowIso,
                tags: ['youtube', 'video'],
              });
              foundCount += 1;
            }
            acc.lastSyncedAt = nowIso;
            acc.lastStatus = 'ok';
            acc.lastMessage = `Synced ${foundCount} videos via YouTube public feed.`;
          }
        } else {
          acc.lastSyncedAt = nowIso;
          acc.lastStatus = 'needs_config';
          acc.lastMessage = 'Configure a Meta Graph Page Token + ID or an RSS/JSON Bridge URL to enable automated sync for this platform (or paste links directly via the ⋮ menu).';
        }
      } catch (err) {
        acc.lastSyncedAt = nowIso;
        acc.lastStatus = 'error';
        acc.lastMessage = err instanceof Error ? err.message : 'Sync failed';
      }

      reports.push({
        id: acc.id,
        label: acc.label,
        status: acc.lastStatus || 'ok',
        found: foundCount,
        message: acc.lastMessage || '',
      });
    }
  }

  // ------------------------------------------------------------------
  // B. Automated News Channels RSS/Atom Sync (Filtered + Always Pending)
  // ------------------------------------------------------------------
  if (target === 'all' || target === 'news') {
    for (const channel of sources.newsChannels) {
      if (!channel.autoSyncEnabled) continue;
      let foundCount = 0;

      try {
        const safeRssUrl = (await assertSafePublicUrl(channel.rssUrl)).toString();
        const res = await fetch(safeRssUrl, {
          signal: AbortSignal.timeout(9000),
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; CoLASHNewsBot/1.0)',
            Accept: 'application/rss+xml, application/atom+xml, application/xml, text/xml;q=0.9, */*;q=0.8',
          },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const xml = await res.text();
        const parsedEntries = parseRssOrAtomXml(xml, channel.siteUrl || safeRssUrl);

        const activeKeywords = Array.from(
          new Set([...(channel.keywords || []), ...(sources.defaultNewsKeywords || [])])
        )
          .map((k) => k.trim().toLowerCase())
          .filter(Boolean);

        for (const entry of parsedEntries.slice(0, 30)) {
          const haystack = `${entry.title} ${entry.summary}`.toLowerCase();
          const matchedKws = activeKeywords.filter((kw) => haystack.includes(kw));
          if (!channel.matchAllArticles && activeKeywords.length > 0 && matchedKws.length === 0) {
            continue;
          }

          discoveredItems.push({
            id: makeDeterministicId('news', normalizeUrlKey(entry.link)),
            titleBn: entry.title,
            titleEn: entry.title,
            summaryBn: entry.summary,
            summaryEn: entry.summary,
            sourceUrl: entry.link,
            platform: 'news',
            sourceName: channel.nameBn || channel.nameEn,
            imageUrl: entry.imageUrl,
            externalId: entry.externalId,
            importMethod: 'auto_news',
            status: 'pending',
            submittedBy: `News Auto-Sync (${channel.nameEn})`,
            publishedAt: entry.publishedAt,
            fetchedAt: nowIso,
            tags: ['news', channel.nameEn, ...matchedKws.slice(0, 4)],
          });
          foundCount += 1;
        }

        channel.lastSyncedAt = nowIso;
        channel.lastStatus = 'ok';
        channel.lastMessage = `Scanned ${parsedEntries.length} headlines; queued ${foundCount} matching item(s) for approval.`;
      } catch (err) {
        channel.lastSyncedAt = nowIso;
        channel.lastStatus = 'error';
        channel.lastMessage = err instanceof Error ? err.message : 'News RSS sync failed';
      }

      reports.push({
        id: channel.id,
        label: channel.nameEn,
        status: channel.lastStatus || 'ok',
        found: foundCount,
        message: channel.lastMessage || '',
      });
    }
  }

  sources.lastFullSyncAt = nowIso;

  return {
    discoveredItems,
    updatedSources: sources,
    reports,
  };
}
