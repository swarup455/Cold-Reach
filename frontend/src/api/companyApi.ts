import api from "./axiosInstance";

export interface Company {
    _id: string;
    ycId: number;
    name: string;
    slug: string;
    domain?: string;
    logoUrl?: string;
    oneLiner?: string;
    longDescription?: string;
    batch?: string;
    isHiring: boolean;
    tags: string[];
    teamSize?: number;
    lastSyncedAt: string;
}

export interface Pagination {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface GetCompaniesParams {
    batch?: string;
    isHiring?: boolean;
    tag?: string;
    search?: string;
    page?: number;
    limit?: number;
}

export const getCompanies = async (params: GetCompaniesParams = {}) => {
    const res = await api.get("/companies", { params });
    return res.data.data as { companies: Company[]; pagination: Pagination };
};

export const getCompanyById = async (id: string) => {
    const res = await api.get(`/companies/${id}`);
    return res.data.data as Company;
};