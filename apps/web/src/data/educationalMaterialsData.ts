import type { EducationalFile } from '../types';

export const MOCK_EDUCATIONAL_FILES: EducationalFile[] = [
    {
        id: 'file-001',
        name: 'Leadership Training Deck.pptx',
        type: 'pptx',
        category: 'presentations',
        size: 5242880, // 5 MB
        url: '#',
        uploadDate: '2024-07-20T10:00:00Z',
    },
    {
        id: 'file-002',
        name: 'Annual Report 2023.pdf',
        type: 'pdf',
        category: 'documents',
        size: 2097152, // 2 MB
        url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        uploadDate: '2024-07-18T14:30:00Z',
    },
    {
        id: 'file-003',
        name: 'Impact Story - Water Well Project.mp4',
        type: 'mp4',
        category: 'videos',
        size: 41943040, // 40 MB
        url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        uploadDate: '2024-07-15T09:00:00Z',
    },
    {
        id: 'file-004',
        name: 'Gala Dinner Photo 1.jpg',
        type: 'jpg',
        category: 'other',
        size: 1048576, // 1 MB
        url: 'https://picsum.photos/seed/gala1/800/600',
        uploadDate: '2024-07-12T11:45:00Z',
    },
    {
        id: 'file-005',
        name: 'Volunteer Handbook.pdf',
        type: 'pdf',
        category: 'documents',
        size: 768000, // 750 KB
        url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        uploadDate: '2024-07-10T16:00:00Z',
    },
     {
        id: 'file-006',
        name: 'Team Building Presentation.ppt',
        type: 'ppt',
        category: 'presentations',
        size: 3145728, // 3 MB
        url: '#',
        uploadDate: '2024-07-05T13:00:00Z',
    },
];
