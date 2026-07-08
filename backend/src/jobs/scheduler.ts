import cron from "node-cron";
import { syncYCCompanies } from "./syncYCCompanies.js";

export function startScheduledJobs() {
    cron.schedule("0 */6 * * *", async () => {
        try {
            await syncYCCompanies();
        } catch (err) {
            console.error("[yc-sync] Job failed:", err);
        }
    });

    console.log("[scheduler] YC company sync scheduled every 6 hours");
}