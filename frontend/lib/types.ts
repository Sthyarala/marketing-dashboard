// User types

export type UserRole = 'brand' | 'company';

export interface User {
  id: number;
  username: string;
  role: UserRole;
  brand?: string | null;
  company?: string | null;
}

// Campaigns

export interface Campaign {
  brand_name: string;
  company_name: string;
  location_id: string;
  location_name: string;
  campaign_name: string;
  channel: string;
  spend: number;
  clicks: number;
  conversions: number;
  date: string;
}

// Leads

export interface Lead {
  brand_name: string;
  company_name: string;
  location_id: string;
  location_name: string;
  leads: number;
  date: string;
}

// Sales

export interface Sale {
  brand_name: string;
  company_name: string;
  location_id: string;
  location_name: string;
  revenue: number;
  date: string;
}

// ROI

export interface RoiRow {
  brand_name: string;
  company_name: string;
  location_id: string;
  spend: number;
  revenue: number;
  roi: number;
}
