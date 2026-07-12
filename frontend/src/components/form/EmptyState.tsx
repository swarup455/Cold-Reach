export function EmptyState({ message }: { message: string }) {
    return (
        <p className="rounded-lg border border-dashed border-slate-300 p-4 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
            {message}
        </p>
    );
}