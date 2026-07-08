import { Link } from "react-router-dom"
import { Mail, Zap, Filter, Send, ArrowRight, CheckCircle2 } from "lucide-react"
import { Footer } from "@/components/common/Footer"
import { Header } from "@/components/common/Header"

const PIPELINE_STAGES = [
    { label: "Added", desc: "Synced from YC" },
    { label: "Enriched", desc: "Contact found" },
    { label: "Draft ready", desc: "Email written" },
    { label: "Sent", desc: "In their inbox" },
]

const FEATURES = [
    {
        icon: Zap,
        title: "Auto-synced company data",
        description:
            "Every YC company, refreshed every 6 hours — name, domain, logo, hiring status, and batch, without lifting a finger.",
    },
    {
        icon: Filter,
        title: "Filter to what matters",
        description:
            "Search by name, filter to companies actively hiring, and narrow down to the batches and industries you care about.",
    },
    {
        icon: Send,
        title: "One pipeline, start to send",
        description:
            "Move each company through Added → Enriched → Draft ready → Sent, so nothing slips through and no email goes out twice.",
    },
]

const Landing = () => {
    return (
        <div className="bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50">
            <Header />

            <main>
                {/* Hero */}
                <section className="relative overflow-hidden">
                    <div className="absolute inset-x-0 top-0 -z-10 h-125 bg-linear-to-b from-blue-600/10 to-transparent dark:from-blue-500/10" />

                    <div className="mx-auto max-w-6xl px-4 pb-16 pt-20 text-center sm:px-6 sm:pt-28">
                        <div className="mx-auto mb-6 flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-medium text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
                            <span className="flex h-2 w-2 rounded-full bg-blue-600" />
                            6,000+ YC companies, synced automatically
                        </div>

                        <h1 className="mx-auto max-w-3xl text-4xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 sm:text-5xl">
                            Land your next job at a YC startup, one good email at a time
                        </h1>

                        <p className="mx-auto mt-5 max-w-xl text-base text-slate-500 dark:text-slate-400 sm:text-lg">
                            ColdReach turns Y Combinator's company directory into a working
                            outreach pipeline — find the right companies, track every
                            conversation, and send emails that actually get replies.
                        </p>

                        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                            <Link
                                to="/register"
                                className="flex w-full items-center justify-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-blue-700 sm:w-auto"
                            >
                                Get started free
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                            <Link
                                to="/login"
                                className="w-full rounded-full border border-slate-300 px-6 py-3 text-center text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-900 sm:w-auto"
                            >
                                Log in
                            </Link>
                        </div>

                        {/* Product screenshot in a browser frame */}
                        <div className="relative mx-auto mt-16 max-w-5xl">
                            <div className="absolute inset-0 -z-10 rounded-2xl bg-blue-600/20 blur-3xl" />
                            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
                                <div className="flex items-center gap-1.5 border-b border-slate-200 bg-slate-100 px-4 py-3 dark:border-slate-800 dark:bg-slate-950">
                                    <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                                    <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                                    <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
                                    <span className="ml-3 rounded-md bg-white px-3 py-0.5 text-xs text-slate-400 dark:bg-slate-900">
                                        app.coldreach.io/dashboard/startups
                                    </span>
                                </div>
                                <img
                                    src="/home-light.png"
                                    alt="ColdReach dashboard showing a list of YC startup companies"
                                    className="w-full dark:hidden"
                                />
                                <img
                                    src="/home-dark.png"
                                    alt="ColdReach dashboard showing a list of YC startup companies"
                                    className="hidden w-full dark:block"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Pipeline flow — signature element */}
                <section className="border-y border-slate-200 bg-white py-16 dark:border-slate-800 dark:bg-slate-900">
                    <div className="mx-auto max-w-5xl px-4 sm:px-6">
                        <div className="mb-10 text-center">
                            <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                                Every company moves through one clear pipeline
                            </h2>
                            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                                No spreadsheets, no guessing who you've already emailed.
                            </p>
                        </div>

                        <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-0">
                            {PIPELINE_STAGES.map((stage, i) => (
                                <div key={stage.label} className="flex flex-1 items-center">
                                    <div className="flex flex-1 flex-col items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-5 text-center dark:border-slate-800 dark:bg-slate-950">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white">
                                            {i + 1}
                                        </div>
                                        <span className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                                            {stage.label}
                                        </span>
                                        <span className="text-xs text-slate-500 dark:text-slate-400">
                                            {stage.desc}
                                        </span>
                                    </div>
                                    {i < PIPELINE_STAGES.length - 1 && (
                                        <ArrowRight className="mx-2 hidden h-4 w-4 shrink-0 text-slate-300 dark:text-slate-700 sm:block" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Features */}
                <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
                    <div className="mb-12 text-center">
                        <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                            Built for job seekers, not sales teams
                        </h2>
                        <p className="mx-auto mt-2 max-w-lg text-sm text-slate-500 dark:text-slate-400">
                            Every feature exists to help you reach the right person at the
                            right startup, without the busywork.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                        {FEATURES.map((feature) => {
                            const Icon = feature.icon
                            return (
                                <div
                                    key={feature.title}
                                    className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"
                                >
                                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600/10 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                                        <Icon className="h-5 w-5" />
                                    </div>
                                    <h3 className="mb-2 text-base font-semibold text-slate-900 dark:text-slate-50">
                                        {feature.title}
                                    </h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">
                                        {feature.description}
                                    </p>
                                </div>
                            )
                        })}
                    </div>
                </section>

                {/* Stats */}
                <section className="border-y border-slate-200 bg-white py-12 dark:border-slate-800 dark:bg-slate-900">
                    <div className="mx-auto grid max-w-4xl grid-cols-3 gap-6 px-4 text-center sm:px-6">
                        <div>
                            <div className="text-3xl font-semibold text-slate-900 dark:text-slate-50">
                                6,020
                            </div>
                            <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                Companies tracked
                            </div>
                        </div>
                        <div>
                            <div className="text-3xl font-semibold text-slate-900 dark:text-slate-50">
                                6h
                            </div>
                            <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                Sync frequency
                            </div>
                        </div>
                        <div>
                            <div className="text-3xl font-semibold text-slate-900 dark:text-slate-50">
                                Free
                            </div>
                            <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                To get started
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6">
                    <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 sm:text-3xl">
                        Your next offer starts with one email
                    </h2>
                    <p className="mx-auto mt-3 max-w-md text-sm text-slate-500 dark:text-slate-400">
                        Create your account and start building your outreach pipeline in
                        minutes.
                    </p>
                    <Link
                        to="/register"
                        className="mt-6 inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-blue-700"
                    >
                        <Mail className="h-4 w-4" />
                        Create free account
                    </Link>
                    <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-slate-400 dark:text-slate-500">
                        <span className="flex items-center gap-1.5">
                            <CheckCircle2 className="h-3.5 w-3.5 text-blue-600" />
                            No credit card required
                        </span>
                        <span className="flex items-center gap-1.5">
                            <CheckCircle2 className="h-3.5 w-3.5 text-blue-600" />
                            Set up in under 2 minutes
                        </span>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    )
}

export default Landing