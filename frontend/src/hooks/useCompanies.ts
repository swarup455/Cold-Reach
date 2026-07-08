import { useState, useEffect, useCallback } from "react";
import {
    getCompanies,
    getCompanyById,
    type Company,
    type Pagination,
    type GetCompaniesParams,
} from "@/api/companyApi";

interface UseCompaniesResult {
    companies: Company[];
    pagination: Pagination | null;
    loading: boolean;
    error: string | null;
    refetch: () => void;
}

interface UseCompanyResult {
    company: Company | null;
    loading: boolean;
    error: string | null;
    refetch: () => void;
}

export function useCompanies(params: GetCompaniesParams = {}): UseCompaniesResult {
    const [companies, setCompanies] = useState<Company[]>([]);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getCompanies(params);
            setCompanies(data.companies);
            setPagination(data.pagination);
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to fetch companies");
        } finally {
            setLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(params)]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { companies, pagination, loading, error, refetch: fetchData };
}

export function useCompany(id: string | undefined): UseCompanyResult {
    const [company, setCompany] = useState<Company | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        if (!id) return;
        setLoading(true);
        setError(null);
        try {
            const data = await getCompanyById(id);
            setCompany(data);
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to fetch company");
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { company, loading, error, refetch: fetchData };
}