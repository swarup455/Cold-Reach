import { useEffect, useState } from "react";

const API_KEY = import.meta.env.VITE_GEOAPIFY_API_KEY;

type GeoapifyResponse = {
    features: {
        properties: {
            formatted: string;
        };
    }[];
};

export function useLocations(query: string) {
    const [locations, setLocations] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!query.trim()) {
            setLocations([]);
            return;
        }

        const controller = new AbortController();

        const timer = setTimeout(async () => {
            try {
                setLoading(true);
                setError(null);

                const res = await fetch(
                    `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(
                        query
                    )}&type=city&limit=10&apiKey=${API_KEY}`,
                    { signal: controller.signal }
                );

                if (!res.ok) {
                    throw new Error(`Failed to load locations (${res.status})`);
                }

                const data: GeoapifyResponse = await res.json();

                const names = [
                    ...new Set(
                        data.features.map((item: any) => item.properties.formatted)
                    ),
                ];

                setLocations(names);
            } catch (err: any) {
                if (err.name !== "AbortError") {
                    setError(err.message);
                }
            } finally {
                setLoading(false);
            }
        }, 300);

        return () => {
            clearTimeout(timer);
            controller.abort();
        };
    }, [query]);

    return { locations, loading, error };
}