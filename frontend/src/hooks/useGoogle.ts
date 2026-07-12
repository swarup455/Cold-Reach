import { useCallback, useEffect, useState } from "react";
import {
    connectGoogle,
    disconnectGoogle,
    getGoogleConnectionStatus,
} from "@/api/googleApi";

interface UseGoogleResult {
    gmailConnected: boolean;
    loading: boolean;
    error: string | null;
    connect: () => void;
    disconnect: () => Promise<void>;
    refetch: () => Promise<void>;
}

export function useGoogle(): UseGoogleResult {
    const [gmailConnected, setGmailConnected] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchStatus = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const data = await getGoogleConnectionStatus();
            setGmailConnected(data.gmailConnected);
        } catch (err: any) {
            setError(
                err.response?.data?.message ||
                "Failed to fetch Gmail connection status."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    const disconnect = useCallback(async () => {
        try {
            await disconnectGoogle();
            setGmailConnected(false);
        } catch (err: any) {
            setError(
                err.response?.data?.message ||
                "Failed to disconnect Gmail."
            );
        }
    }, []);

    useEffect(() => {
        fetchStatus();
    }, [fetchStatus]);

    return {
        gmailConnected,
        loading,
        error,
        connect: connectGoogle,
        disconnect,
        refetch: fetchStatus,
    };
}