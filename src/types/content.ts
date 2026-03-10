export type ContentType = "image" | "video" | "document" | "text" | "link" | "social";
export type ContentFormat = "native" | "social";

export interface SharableNetwork {
  id: string;
  name: string;
  enabled: boolean;
}

export interface ContentItem {
  id: string;
  type: ContentType;
  format: ContentFormat;
  title: string;
  text: string;
  thumbnail?: string;
  linkDomain?: string;
  linkTitle?: string;
  socialSource?: "facebook" | "linkedin";
  socialAuthor?: string;
  socialDate?: string;
  networks: SharableNetwork[];
}

export const mockContentItems: ContentItem[] = [
  {
    id: "1",
    type: "image",
    format: "native",
    title: "Q1 Brand Campaign",
    text: "Our new brand campaign highlights the company's commitment to sustainability and innovation across all markets. Share this with your network to amplify our reach.",
    thumbnail: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=200&h=200&fit=crop",
    networks: [
      { id: "linkedin", name: "LinkedIn", enabled: true },
      { id: "facebook", name: "Facebook", enabled: true },
      { id: "x", name: "X", enabled: false },
    ],
  },
  {
    id: "2",
    type: "video",
    format: "native",
    title: "Product Launch Teaser",
    text: "Get a sneak peek at what's coming next quarter. This 30-second teaser is optimized for social sharing.",
    thumbnail: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=200&h=200&fit=crop",
    networks: [
      { id: "linkedin", name: "LinkedIn", enabled: true },
      { id: "facebook", name: "Facebook", enabled: false },
      { id: "x", name: "X", enabled: true },
    ],
  },
  {
    id: "3",
    type: "link",
    format: "native",
    title: "Blog: Future of Work",
    text: "Our latest thought leadership piece on hybrid work models and employee engagement strategies for 2026.",
    thumbnail: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=200&h=200&fit=crop",
    linkTitle: "The Future of Work: 5 Trends Shaping 2026",
    linkDomain: "blog.sociuu.com",
    networks: [
      { id: "linkedin", name: "LinkedIn", enabled: true },
      { id: "facebook", name: "Facebook", enabled: true },
      { id: "x", name: "X", enabled: true },
    ],
  },
  {
    id: "3b",
    type: "link",
    format: "native",
    title: "Case Study: Nordic Retail",
    text: "How we helped Nordic Retail increase employee advocacy engagement by 340% in just 6 months.",
    thumbnail: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=200&h=200&fit=crop",
    linkTitle: "Nordic Retail Case Study – 340% Growth",
    linkDomain: "sociuu.com/cases",
    networks: [
      { id: "linkedin", name: "LinkedIn", enabled: true },
      { id: "facebook", name: "Facebook", enabled: true },
      { id: "x", name: "X", enabled: false },
    ],
  },
  {
    id: "4",
    type: "text",
    format: "social",
    title: "Employee Spotlight Post",
    text: "🌟 Meet Sarah from our Copenhagen office! She's been leading our sustainability initiative and recently won the internal innovation award. Congratulations Sarah!",
    networks: [
      { id: "linkedin", name: "LinkedIn", enabled: true },
      { id: "facebook", name: "Facebook", enabled: true },
      { id: "x", name: "X", enabled: false },
    ],
  },
  {
    id: "5",
    type: "social",
    format: "social",
    title: "CEO LinkedIn Post",
    text: "Excited to announce our partnership with Nordic Innovation Hub. Together we'll be empowering 10,000 employees across Scandinavia.",
    socialSource: "linkedin",
    socialAuthor: "Anders Nielsen, CEO",
    socialDate: "2 days ago",
    thumbnail: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=200&h=200&fit=crop",
    networks: [
      { id: "linkedin", name: "LinkedIn", enabled: true },
      { id: "facebook", name: "Facebook", enabled: false },
      { id: "x", name: "X", enabled: false },
    ],
  },
  {
    id: "6",
    type: "document",
    format: "native",
    title: "Brand Guidelines 2026",
    text: "Updated brand guidelines document including new visual identity, tone of voice, and social media templates.",
    thumbnail: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=200&h=200&fit=crop",
    networks: [
      { id: "linkedin", name: "LinkedIn", enabled: true },
      { id: "facebook", name: "Facebook", enabled: false },
      { id: "x", name: "X", enabled: false },
    ],
  },
];
