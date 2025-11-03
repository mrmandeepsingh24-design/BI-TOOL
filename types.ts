export interface User {
  id: string;
  name: string;
  email: string;
}

export enum Page {
  Dashboard = 'dashboard',
  ActionCenter = 'action-center',
  UploadData = 'upload-data',
  LowStock = 'low-stock',
  TopSelling = 'top-selling',
  Visualizations = 'visualizations',
  AIInsights = 'ai-insights',
  AIChat = 'ai-chat',
  ROITracker = 'roi-tracker',
  Reports = 'reports',
  Settings = 'settings',
  Documentation = 'documentation',
}

export interface ROIData {
  totalSavings: number;
  expiryWaste: number;
  lostSales: number;
}

export interface Medicine {
  id: string;
  name: string;
  batch: string;
  stock: number;
  price?: number;
  expiry: string;
  minRequired: number;
}

export interface SalesRecord {
  id: string;
  name: string;
  unitsSold: number;
  totalRevenue: number;
}

export interface OutOfStockItem {
  id: string;
  name: string;
  potentialLostRevenue: number;
}

export interface ROIDetails {
  totalSavings: number;
  expiryWaste: number;
  lostSales: number;
  expiringSoon: Medicine[];
  outOfStock: OutOfStockItem[];
}

export interface BusinessAdvice {
    id: string;
    title: string;
    message: string;
    category: 'Inventory' | 'Sales' | 'Strategy';
}

export type ChartType = 'bar' | 'line' | 'pie';
export type Metric = 'totalRevenue' | 'unitsSold' | 'stock';
export type Dimension = 'medicine' | 'time';

export interface VisualizationConfig {
    chartType: ChartType;
    metric: Metric;
    dimension: Dimension;
}

export interface WeeklyReportData {
    week: string;
    totalRevenue: number;
    unitsSold: number;
    newLowStockItems: number;
    topSeller: SalesRecord;
    dailySales: { name: string; sales: number }[];
    stockStatus: { name: string; value: number }[];
    aiSummary: string;
}

export interface ActionableItem {
  id: string;
  title: string;
  description: string;
  category: 'Inventory' | 'Sales' | 'Strategy' | 'Data Quality';
  priority: 'High' | 'Medium' | 'Low';
  status: 'todo' | 'done';
  actionUrl?: Page;
}

export interface AlertInfo {
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
}