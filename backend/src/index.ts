import "dotenv/config";
import connectDB from "./db/database.js";
import { app } from "./app.js";
import { startScheduledJobs } from "./jobs/scheduler.js";
import { syncYCCompanies } from "./jobs/syncYCCompanies.js";

const PORT: number = Number(process.env.PORT) || 8000;

connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`\n Server is running at port: ${PORT}`);
        });

        startScheduledJobs();

        syncYCCompanies().catch((err) =>
            console.error("[yc-sync] Initial sync failed:", err)
        );
    })
    .catch((error: Error) => {
        console.log("MongoDB connection failed !!! ", error);
        process.exit(1);
    });