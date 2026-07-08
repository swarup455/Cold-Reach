export function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="w-full border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
            <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 px-4 py-6 text-sm text-slate-500 dark:text-slate-400 sm:flex-row sm:px-6">
                <p>&copy; {year} ColdReach. All rights reserved.</p>

                <div className="flex items-center gap-5">
                    <a
                        href="/privacy"
                        className="transition hover:text-slate-700 dark:hover:text-slate-200"
                    >
                        Privacy
                    </a>
                    <a
                        href="/terms"
                        className="transition hover:text-slate-700 dark:hover:text-slate-200"
                    >
                        Terms
                    </a>
                    <a
                        href="mailto:support@coldreach.app"
                        className="transition hover:text-slate-700 dark:hover:text-slate-200"
                    >
                        Support
                    </a>
                </div>
            </div>
        </footer>
    );
}