import { User, ROIData, Medicine, SalesRecord, ROIDetails, BusinessAdvice, VisualizationConfig, OutOfStockItem, WeeklyReportData, ActionableItem, Page } from "../types";

// --- Mock Data ---

const mockMedicines: Medicine[] = [
    { id: '1', name: 'Paracetamol 500mg', batch: 'P500-123', stock: 8, minRequired: 20, expiry: '2025-12-31', price: 25 },
    { id: '2', name: 'Amoxicillin 250mg', batch: 'A250-456', stock: 5, minRequired: 15, expiry: '2024-08-30', price: 75 },
    { id: '3', name: 'Cetirizine 10mg', batch: 'C10-789', stock: 12, minRequired: 25, expiry: '2026-05-20', price: 40 },
    { id: '4', name: 'Omeprazole 20mg', batch: 'O20-101', stock: 0, minRequired: 10, expiry: '2025-10-15', price: 60 },
    { id: '5', name: 'Ibuprofen 400mg', batch: 'I400-112', stock: 30, minRequired: 25, expiry: '2025-11-30', price: 35 },
    { id: '6', name: 'Aspirin 75mg', batch: 'A75-131', stock: 50, minRequired: 40, expiry: '2026-01-10', price: 15 },
    { id: '7', name: 'Vitamin C 500mg', batch: 'VC500-415', stock: 100, minRequired: 50, expiry: '2025-09-01', price: 50 },
    { id: '8', name: 'Metformin 500mg', batch: 'M500-161', stock: 22, minRequired: 30, expiry: '2024-09-25', price: 80 },
];

const mockSalesRecords: SalesRecord[] = [
    { id: '1', name: 'Paracetamol 500mg', unitsSold: 520, totalRevenue: 13000 },
    { id: '2', name: 'Vitamin C 500mg', unitsSold: 350, totalRevenue: 17500 },
    { id: '3', name: 'Aspirin 75mg', unitsSold: 310, totalRevenue: 4650 },
    { id: '4', name: 'Ibuprofen 400mg', unitsSold: 280, totalRevenue: 9800 },
    { id: '5', name: 'Cetirizine 10mg', unitsSold: 250, totalRevenue: 10000 },
    { id: '6', name: 'Metformin 500mg', unitsSold: 180, totalRevenue: 14400 },
    { id: '7', name: 'Amoxicillin 250mg', unitsSold: 150, totalRevenue: 11250 },
    { id: '8', name: 'Omeprazole 20mg', unitsSold: 120, totalRevenue: 7200 },
];

// --- Mock API Functions ---

const mockApiCall = <T>(data: T, delay: number = 500): Promise<T> => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(data);
        }, delay);
    });
};

export const login = async (email: string, password: string): Promise<{ user: User }> => {
     const nameFromEmail = email.split('@')[0];
     const capitalizedName = nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1);
    return mockApiCall({
        user: {
            id: '1',
            name: capitalizedName,
            email: email,
        }
    });
};

export const getROICalculation = async (): Promise<ROIData> => {
    return mockApiCall({
        totalSavings: 25000,
        expiryWaste: 8500,
        lostSales: 16500,
    });
};

export const getROIDetails = async (): Promise<ROIDetails> => {
    const expiringSoon = mockMedicines.filter(m => new Date(m.expiry) < new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)); // expiring in next 60 days
    const outOfStock: OutOfStockItem[] = mockMedicines.filter(m => m.stock === 0).map(m => ({
        id: m.id,
        name: m.name,
        potentialLostRevenue: (mockSalesRecords.find(s => s.name === m.name)?.totalRevenue || 0) * 0.5 // a rough estimate
    }));
    const expiryWaste = expiringSoon.reduce((acc, m) => acc + (m.stock * (m.price || 0)), 0);
    const lostSales = outOfStock.reduce((acc, i) => acc + i.potentialLostRevenue, 0);

    return mockApiCall({
        totalSavings: expiryWaste + lostSales,
        expiryWaste: expiryWaste,
        lostSales: lostSales,
        expiringSoon: expiringSoon,
        outOfStock: outOfStock,
    });
};

export const uploadData = async (file: File): Promise<{ message: string }> => {
    return mockApiCall({ message: `File "${file.name}" uploaded successfully. Data has been integrated.` }, 1200);
};

export const getLowStock = async (): Promise<{ medicines: Medicine[] }> => {
    return mockApiCall({ medicines: mockMedicines.filter(m => m.stock <= m.minRequired) });
};

export const getTopSelling = async (timePeriod: string): Promise<{ sales: SalesRecord[] }> => {
    // We ignore timePeriod in the mock, but in a real app it would be used.
    return mockApiCall({ sales: [...mockSalesRecords].sort((a,b) => b.totalRevenue - a.totalRevenue) });
};

export const updateSettings = async (settings: any): Promise<{ message: string }> => {
    console.log("Saving settings:", settings);
    return mockApiCall({ message: 'Settings updated successfully!' });
};

export const getBusinessAdvice = async (): Promise<{ advice: BusinessAdvice[] }> => {
    return mockApiCall({
        advice: [
            { id: '1', title: 'Restock Paracetamol 500mg', message: 'This item is consistently a top seller but stock is running low. Reorder soon to avoid missing sales.', category: 'Inventory' },
            { id: '2', title: 'Seasonal Sales Opportunity', message: 'Demand for Cetirizine 10mg is peaking. Consider a promotional bundle to maximize revenue.', category: 'Sales' },
            { id: '3', title: 'Expiring Stock Action', message: 'A batch of Amoxicillin is expiring in two months. Prioritize selling this batch to prevent financial loss.', category: 'Inventory' },
            { id: '4', title: 'Strategic Pricing Review', message: 'Analyze profit margins on high-volume, low-cost items like Aspirin to optimize your overall pricing strategy.', category: 'Strategy' },
        ]
    }, 800);
};

export const getVisualizationData = async (config: VisualizationConfig): Promise<{ data: any[] }> => {
    let data = [];
    if (config.dimension === 'medicine') {
        data = mockSalesRecords.map(record => ({
            name: record.name,
            unitsSold: record.unitsSold,
            totalRevenue: record.totalRevenue,
            stock: mockMedicines.find(m => m.name === record.name)?.stock || 0,
        })).slice(0, 7); // Return top 7 for better visuals
    } else { // dimension is 'time'
        // generate some dummy time-series data
        data = [
            { name: 'May 1', unitsSold: 1200, totalRevenue: 45000 },
            { name: 'May 2', unitsSold: 1500, totalRevenue: 52000 },
            { name: 'May 3', unitsSold: 1350, totalRevenue: 48000 },
            { name: 'May 4', unitsSold: 1600, totalRevenue: 55000 },
            { name: 'May 5', unitsSold: 1800, totalRevenue: 62000 },
            { name: 'May 6', unitsSold: 2100, totalRevenue: 71000 },
            { name: 'May 7', unitsSold: 1900, totalRevenue: 68000 },
        ]
    }
    return mockApiCall({ data }, 1000);
};


export const getAIInsights = async (): Promise<{ insights: any[] }> => {
    const insights = {
        insights: [
            {
                title: "Data Quality Anomaly",
                message: "Found 2 sales records for 'Aspirin 150mg' which does not exist in your current inventory master. Consider adding it or correcting the sales entries.",
                category: "Financial"
            },
            {
                title: "Inventory Optimization: Paracetamol",
                message: "Paracetamol 500mg has a high sales velocity but is currently low on stock. Recommend increasing minimum stock level from 20 to 50 units to prevent stockouts.",
                category: "Inventory"
            },
            {
                title: "Sales Trend: Anti-Allergens",
                message: "Sales for Cetirizine have increased by 30% month-over-month. This indicates a seasonal trend; ensure adequate stock for the next 4-6 weeks.",
                category: "Sales"
            },
        ]
    };
    return mockApiCall(insights, 1500);
};

export const askAIAboutData = async (question: string): Promise<{ answer: string }> => {
    let answer = "I'm sorry, I don't have the specific information to answer that. Here's what I can tell you about your data: You have 8 unique medicines in your inventory, and your total sales revenue in the last period was ₹87,800.";
    const lowerCaseQuestion = question.toLowerCase();

    if (lowerCaseQuestion.includes("low on stock") || lowerCaseQuestion.includes("low stock")) {
        const lowStockMeds = mockMedicines.filter(m => m.stock < m.minRequired).map(m => m.name);
        answer = `The following medicines are currently low on stock: ${lowStockMeds.join(', ')}.`;
    } else if (lowerCaseQuestion.includes("top selling")) {
        const topSeller = [...mockSalesRecords].sort((a,b) => b.totalRevenue - a.totalRevenue)[0];
        answer = `Your top-selling medicine by revenue is ${topSeller.name}, which generated ₹${topSeller.totalRevenue.toLocaleString('en-IN')}.`;
    } else if (lowerCaseQuestion.includes("inventory value")) {
        const totalValue = mockMedicines.reduce((acc, med) => acc + (med.stock * (med.price || 0)), 0);
        answer = `The total value of your current inventory is ₹${totalValue.toLocaleString('en-IN')}.`;
    } else if (lowerCaseQuestion.includes("out of stock")) {
        const outOfStockMeds = mockMedicines.filter(m => m.stock === 0).map(m => m.name);
        if (outOfStockMeds.length > 0) {
            answer = `You are completely out of stock for: ${outOfStockMeds.join(', ')}.`;
        } else {
            answer = `Good news! Nothing is completely out of stock right now.`;
        }
    }

    return mockApiCall({ answer }, 1000);
};

export const getWeeklyReportData = async (week: string): Promise<WeeklyReportData> => {
    const totalRevenue = mockSalesRecords.reduce((sum, record) => sum + record.totalRevenue, 0) * (Math.random() * 0.2 + 0.9);
    const unitsSold = mockSalesRecords.reduce((sum, record) => sum + record.unitsSold, 0) * (Math.random() * 0.2 + 0.9);
    
    const reportData: WeeklyReportData = {
        week: "May 20, 2024 - May 26, 2024",
        totalRevenue: totalRevenue,
        unitsSold: Math.round(unitsSold),
        newLowStockItems: 3,
        topSeller: mockSalesRecords[0],
        dailySales: [
            { name: 'Mon', sales: 12000 },
            { name: 'Tue', sales: 15000 },
            { name: 'Wed', sales: 13500 },
            { name: 'Thu', sales: 16000 },
            { name: 'Fri', sales: 18000 },
            { name: 'Sat', sales: 21000 },
            { name: 'Sun', sales: 19000 },
        ],
        stockStatus: [
            { name: 'In Stock', value: mockMedicines.filter(m => m.stock > m.minRequired).length },
            { name: 'Low Stock', value: mockMedicines.filter(m => m.stock <= m.minRequired && m.stock > 0).length },
            { name: 'Out of Stock', value: mockMedicines.filter(m => m.stock === 0).length },
        ],
        aiSummary: "This week showed strong sales, particularly on Saturday. Revenue is up 5% compared to the previous week. However, Paracetamol 500mg is consistently a top seller and is approaching low stock levels. Recommend placing a reorder within the next 2 days to avoid a stockout. Also, consider a promotion for Amoxicillin, as its sales have been slower than average."
    };
    return mockApiCall(reportData, 1200);
};

export const getActionableItems = async (): Promise<{ items: ActionableItem[] }> => {
    const items: ActionableItem[] = [
        { id: '1', title: 'Restock Paracetamol 500mg', description: 'This item is consistently a top seller but stock is running low. Reorder soon to avoid missing sales.', category: 'Inventory', priority: 'High', status: 'todo', actionUrl: Page.LowStock },
        { id: '2', title: 'Resolve Data Anomaly', description: "Found 2 sales records for 'Aspirin 150mg' which does not exist in your current inventory master. Consider adding it or correcting the sales entries.", category: 'Data Quality', priority: 'High', status: 'todo', actionUrl: Page.UploadData },
        { id: '3', title: 'Address Expiring Stock', description: 'A batch of Amoxicillin is expiring in two months. Prioritize selling this batch to prevent financial loss.', category: 'Inventory', priority: 'Medium', status: 'todo', actionUrl: Page.ROITracker },
        { id: '4', title: 'Launch Seasonal Promotion', description: 'Demand for Cetirizine 10mg is peaking. Consider a promotional bundle to maximize revenue.', category: 'Sales', priority: 'Medium', status: 'todo', actionUrl: Page.TopSelling },
        { id: '5', title: 'Review Pricing Strategy', description: 'Analyze profit margins on high-volume, low-cost items like Aspirin to optimize your overall pricing strategy.', category: 'Strategy', priority: 'Low', status: 'todo' },
        { id: '6', title: 'Increase Vitamin C Stock', description: 'Sales for Vitamin C are trending upwards. Ensure you have enough stock for the next 4-6 weeks to meet demand.', category: 'Inventory', priority: 'Medium', status: 'done' },
    ];
    return mockApiCall({ items }, 700);
};