import type { ForumCategory, ForumPost } from '../types';

export const MOCK_FORUM_CATEGORIES: ForumCategory[] = [
    {
        id: 'cat-1',
        name: { en: 'General Discussion', ar: 'نقاش عام' },
        description: { en: 'Talk about anything and everything.', ar: 'تحدث عن أي شيء وكل شيء.' }
    },
    {
        id: 'cat-2',
        name: { en: 'Project Ideas', ar: 'أفكار مشاريع' },
        description: { en: 'Share and collaborate on new project ideas.', ar: 'شارك وتعاون في أفكار مشاريع جديدة.' }
    },
    {
        id: 'cat-3',
        name: { en: 'Q&A with Leadership', ar: 'سؤال وجواب مع القيادة' },
        description: { en: 'Ask questions directly to the leadership team.', ar: 'اطرح أسئلة مباشرة على فريق القيادة.' }
    },
    {
        id: 'cat-4',
        name: { en: 'Volunteer Corner', ar: 'ركن المتطوعين' },
        description: { en: 'A space for volunteers to connect and share experiences.', ar: 'مساحة للمتطوعين للتواصل وتبادل الخبرات.' }
    }
];

export const MOCK_FORUM_POSTS: ForumPost[] = [
    {
        id: 'post-1',
        title: 'Thoughts on the upcoming Annual Gala?',
        content: 'I was looking at the plans for the Annual Gala and had a few ideas to make it even more engaging. What does everyone think about a live social media wall?',
        authorId: 'user-2',
        authorName: 'Fatma Kaya',
        authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
        categoryId: 'cat-1',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        lastActivity: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        replies: [
            {
                id: 'reply-1-1',
                authorId: 'user-3',
                authorName: 'John Doe',
                authorAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=200&auto=format&fit=crop',
                content: 'That\'s a great idea! It would really boost engagement.',
                createdAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(),
            },
            {
                id: 'reply-1-2',
                authorId: 'user-1',
                authorName: 'Ali Veli',
                authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
                content: 'I agree. We should also consider a dedicated hashtag.',
                createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
            }
        ],
        tags: ['event', 'gala', 'fundraising']
    },
    {
        id: 'post-2',
        title: 'New Project Idea: Digital Literacy for Seniors',
        content: 'I believe we could make a huge impact by starting a program to teach digital literacy skills to senior citizens in our community. This could help them connect with family and access online services.',
        authorId: 'user-3',
        authorName: 'John Doe',
        authorAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=200&auto=format&fit=crop',
        categoryId: 'cat-2',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        lastActivity: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        replies: [
            {
                id: 'reply-2-1',
                authorId: 'user-2',
                authorName: 'Fatma Kaya',
                authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
                content: 'This aligns perfectly with our community outreach goals. I can help draft a preliminary budget.',
                createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            }
        ],
        tags: ['project-idea', 'community', 'digital-literacy']
    },
     {
        id: 'post-3',
        title: 'How can we improve volunteer onboarding?',
        content: 'As a new volunteer, I found the onboarding process a bit overwhelming. Does anyone have suggestions on how we could streamline it?',
        authorId: 'user-4',
        authorName: 'Jane Smith',
        authorAvatar: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?q=80&w=200&auto=format&fit=crop',
        categoryId: 'cat-4',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        lastActivity: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        replies: [],
        tags: ['volunteer', 'onboarding', 'hr']
    }
];