import { Company } from "../models/companyModel.js";

const YC_ALL_COMPANIES_URL = "https://yc-oss.github.io/api/companies/all.json";
const MISSING_LOGO_MARKER = "/company/thumb/missing.png";

export async function syncYCCompanies() {
    const startedAt = Date.now();
    console.log(`[yc-sync] Starting sync from ${YC_ALL_COMPANIES_URL}`);

    const response = await fetch(YC_ALL_COMPANIES_URL);
    if (!response.ok) {
        throw new Error(`[yc-sync] Failed to fetch: ${response.status} ${response.statusText}`);
    }

    const companies = await response.json();
    console.log(`[yc-sync] Fetched ${companies.length} companies from source`);

    const now = new Date();

    const ops = companies
        .filter((c: any) => c.id && c.name)
        .map((c: any) => {
            const domain = (c.website || "")
                .replace(/^https?:\/\//, "")
                .replace(/\/$/, "")
                .toLowerCase();

            const logoUrl =
                c.small_logo_thumb_url && !c.small_logo_thumb_url.includes(MISSING_LOGO_MARKER)
                    ? c.small_logo_thumb_url
                    : undefined;

            return {
                updateOne: {
                    filter: { ycId: c.id },
                    update: {
                        $setOnInsert: {
                            ycId: c.id,
                            name: c.name,
                            slug: c.slug,
                            domain: domain || undefined,
                            logoUrl,
                            oneLiner: c.one_liner || "",
                            longDescription: c.long_description || "",
                            batch: c.batch || undefined,
                            isHiring: !!c.isHiring,
                            tags: c.tags || [],
                            teamSize: c.team_size || undefined,
                            status: c.status || undefined,
                            industry: c.industry || undefined,
                            stage: c.stage || undefined,
                            location: c.all_locations || undefined,
                            launchedAt: c.launched_at ? new Date(c.launched_at * 1000) : undefined,
                            ycUrl: c.url || undefined,
                            lastSyncedAt: now,
                        },
                    },
                    upsert: true,
                },
            };
        });

    if (ops.length === 0) {
        console.log("[yc-sync] Nothing to sync");
        return { inserted: 0 };
    }

    const CHUNK_SIZE = 500;
    let inserted = 0;

    for (let i = 0; i < ops.length; i += CHUNK_SIZE) {
        const chunk = ops.slice(i, i + CHUNK_SIZE);
        const result = await Company.bulkWrite(chunk, { ordered: false });
        inserted += result.upsertedCount;
    }

    const durationMs = Date.now() - startedAt;
    console.log(`[yc-sync] Done in ${durationMs}ms — new companies inserted: ${inserted}`);

    return { inserted };
}