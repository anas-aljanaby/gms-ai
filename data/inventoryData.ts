import type { InventoryData } from '../types';

export const MOCK_INVENTORY_DATA: InventoryData = {
    items: [
        { 
            id: 'ITEM-001', 
            name: { en: 'Winter Blankets', ar: 'بطانيات شتوية', tr: 'Kışlık Battaniyeler' }, 
            category: 'clothing', 
            sku: 'CL-BLK-01', 
            description: { en: 'High-quality thermal blankets for winter aid.', ar: 'بطانيات حرارية عالية الجودة للمساعدات الشتوية.', tr: 'Kış yardımı için yüksek kaliteli termal battaniyeler.' }, 
            imageUrl: 'https://picsum.photos/seed/blanket/200/200',
            unitOfMeasure: 'pcs',
            valuePerUnit: 15.50
        },
        { 
            id: 'ITEM-002', 
            name: { en: 'Canned Food Mix', ar: 'معلبات غذائية مشكلة', tr: 'Karışık Konserve Gıda' }, 
            category: 'food', 
            sku: 'FD-CAN-MX', 
            description: { en: 'Assorted canned goods (beans, vegetables).', ar: 'معلبات متنوعة (فول، خضروات).', tr: 'Çeşitli konserve ürünler (fasulye, sebze).' }, 
            imageUrl: 'https://picsum.photos/seed/cannedfood/200/200',
            unitOfMeasure: 'box',
            valuePerUnit: 25.00
        },
        { 
            id: 'ITEM-003', 
            name: { en: 'Basic Medical Kit', ar: 'عدة طبية أساسية', tr: 'Temel Tıbbi Kiti' }, 
            category: 'medical', 
            sku: 'MED-KIT-B', 
            description: { en: 'First-aid kit with essential supplies.', ar: 'عدة إسعافات أولية مع لوازم أساسية.', tr: 'Temel malzemelerle ilk yardım kiti.' }, 
            imageUrl: 'https://picsum.photos/seed/medkit/200/200',
            unitOfMeasure: 'kit',
            valuePerUnit: 35.75
        },
        { 
            id: 'ITEM-004', 
            name: { en: 'School Notebooks', ar: 'دفاتر مدرسية', tr: 'Okul Defterleri' }, 
            category: 'education', 
            sku: 'EDU-NB-A5', 
            description: { en: 'A5 size notebooks for students.', ar: 'دفاتر حجم A5 للطلاب.', tr: 'Öğrenciler için A5 boyutunda defterler.' }, 
            imageUrl: 'https://picsum.photos/seed/notebooks/200/200',
            unitOfMeasure: 'pcs',
            valuePerUnit: 1.20
        },
    ],
    warehouses: [
        { id: 'WH-01', name: 'Istanbul Hub', location: 'Istanbul, Turkey' },
        { id: 'WH-02', name: 'Gaziantep Depot', location: 'Gaziantep, Turkey' },
        { id: 'WH-03', name: 'Beirut Annex', location: 'Beirut, Lebanon' },
    ],
    stockLevels: [
        { itemId: 'ITEM-001', warehouseId: 'WH-01', quantity: 1500, lowStockThreshold: 500 },
        { itemId: 'ITEM-001', warehouseId: 'WH-02', quantity: 450, lowStockThreshold: 500 }, // Low stock
        { itemId: 'ITEM-002', warehouseId: 'WH-01', quantity: 800, lowStockThreshold: 200 },
        { itemId: 'ITEM-002', warehouseId: 'WH-03', quantity: 300, lowStockThreshold: 150 },
        { itemId: 'ITEM-003', warehouseId: 'WH-02', quantity: 250, lowStockThreshold: 100 },
        { itemId: 'ITEM-003', warehouseId: 'WH-03', quantity: 150, lowStockThreshold: 100 },
        { itemId: 'ITEM-004', warehouseId: 'WH-01', quantity: 10000, lowStockThreshold: 2000 },
    ],
    transactions: [
        { id: 'TRN-001', itemId: 'ITEM-001', warehouseId: 'WH-01', type: 'inbound', quantity: 2000, date: '2024-06-01T00:00:00Z', notes: 'Supplier delivery' },
        { id: 'TRN-002', itemId: 'ITEM-001', warehouseId: 'WH-01', type: 'outbound', quantity: -500, date: '2024-06-15T00:00:00Z', notes: 'Distribution for project PROJ-2024-002', relatedProjectId: 'PROJ-2024-002' },
        { id: 'TRN-003', itemId: 'ITEM-002', warehouseId: 'WH-03', type: 'inbound', quantity: 500, date: '2024-06-05T00:00:00Z', notes: 'Donation received' },
        { id: 'TRN-004', itemId: 'ITEM-002', warehouseId: 'WH-03', type: 'outbound', quantity: -200, date: '2024-06-20T00:00:00Z', notes: 'Local partner distribution' },
        { id: 'TRN-005', itemId: 'ITEM-004', warehouseId: 'WH-01', type: 'adjustment', quantity: -50, date: '2024-06-25T00:00:00Z', notes: 'Damaged stock correction' },
    ]
};
