import { formatDistanceToNow } from 'date-fns';

export type NewsCategory = 'deepfake' | 'cybercrime' | 'ai';

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  publishedAt: string;
  imageUrl: string;
  url: string;
  category: NewsCategory;
  isLive?: boolean;
}

const MOCK_NEWS: NewsItem[] = [
  {
    id: '1',
    title: 'Deepfake Scam Targets Major Indian Bank Customers',
    summary: 'A sophisticated deepfake voice scam has been reported targeting customers of a major Indian bank, leading to significant financial losses. Authorities urge caution.',
    source: 'CyberGuard India',
    publishedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
    imageUrl: 'https://images.unsplash.com/photo-1633265486064-084b5f994028?w=800&q=80',
    url: '#',
    category: 'deepfake',
    isLive: true,
  },
  {
    id: '2',
    title: 'New AI Regulation Bill Proposed in Parliament',
    summary: 'The government has tabled a new bill aiming to regulate the use of Artificial Intelligence in critical sectors, emphasizing data privacy and ethical use.',
    source: 'TechPolicy Watch',
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    imageUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80',
    url: '#',
    category: 'ai',
  },
  {
    id: '3',
    title: 'Massive Data Breach Exposes Millions of User Records',
    summary: 'Security researchers have discovered a massive unprotected database containing personal information of millions of users from a popular e-commerce platform.',
    source: 'SecureNet News',
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
    imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80',
    url: '#',
    category: 'cybercrime',
  },
  {
    id: '4',
    title: 'AI Tool Detects Deepfakes with 99% Accuracy',
    summary: 'Researchers at IIT Bombay have developed a new AI tool capable of detecting deepfake videos with unprecedented accuracy, a major step forward in the fight against misinformation.',
    source: 'India Tech Daily',
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80',
    url: '#',
    category: 'ai',
  },
  {
    id: '5',
    title: 'Cybercrime Cells Launched in 50 New Districts',
    summary: 'To combat the rising tide of digital crimes, the Home Ministry has announced the establishment of dedicated cybercrime cells in 50 new districts across the country.',
    source: 'GovNews Live',
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80',
    url: '#',
    category: 'cybercrime',
  },
];

export const getNews = async (category?: NewsCategory | 'all'): Promise<NewsItem[]> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));
  
  if (!category || category === 'all') {
    return MOCK_NEWS;
  }
  return MOCK_NEWS.filter((item) => item.category === category);
};

export const getBreakingNews = async (): Promise<NewsItem[]> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return MOCK_NEWS.filter(item => item.isLive);
}
