import {
    Mail,
    Phone,
    MapPin,
    Calendar,
    Briefcase,
    GraduationCap,
    FolderGit2,
    Award,
    Settings2,
    Link2,
    Globe,
    FileText,
} from "lucide-react";
import { FaGithub as Github, FaLinkedin as Linkedin } from "react-icons/fa"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { Profile } from "@/api/profileApi";

function getInitials(name: string) {
    return name
        .split(" ")
        .map((part) => part[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();
}

function SectionHeading({
    icon: Icon,
    title,
}: {
    icon: typeof Briefcase;
    title: string;
}) {
    return (
        <div className="flex items-center gap-2">
            <Icon className="h-5 w-5 text-slate-500 dark:text-slate-400" />
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                {title}
            </h2>
        </div>
    );
}

function DetailRow({
    icon: Icon,
    label,
    value,
}: {
    icon: typeof Mail;
    label: string;
    value?: string | null;
}) {
    if (!value) return null;
    return (
        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            <Icon className="h-4 w-4 shrink-0 text-slate-400 dark:text-slate-500" />
            <span className="text-slate-500 dark:text-slate-400">{label}:</span>
            <span className="text-slate-900 dark:text-slate-100">{value}</span>
        </div>
    );
}

function LinkPill({
    icon: Icon,
    label,
    href,
}: {
    icon: typeof Github;
    label: string;
    href?: string;
}) {
    if (!href) return null;
    return (
        <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 rounded-full border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:border-blue-500 hover:text-blue-600 dark:border-slate-700 dark:text-slate-300 dark:hover:border-blue-500 dark:hover:text-blue-400"
        >
            <Icon className="h-3.5 w-3.5" />
            {label}
        </a>
    );
}

export function ProfileCard({ profile }: { profile: Profile }) {
    const locationText = [
        profile.location?.city,
        profile.location?.state,
        profile.location?.country,
    ]
        .filter(Boolean)
        .join(", ");

    return (
        <div className="w-full space-y-10 rounded-xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
                <Avatar className="h-20 w-20 border border-slate-200 dark:border-slate-700">
                    <AvatarImage src={profile.profilePhoto} alt={profile.name} />
                    <AvatarFallback className="bg-blue-600 text-lg font-medium text-white">
                        {getInitials(profile.name)}
                    </AvatarFallback>
                </Avatar>

                <div className="space-y-1">
                    <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-50">
                        {profile.name}
                    </h1>
                    {profile.headline && (
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            {profile.headline}
                        </p>
                    )}
                </div>
            </div>

            {profile.bio && (
                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    {profile.bio}
                </p>
            )}

            <section className="space-y-3">
                <SectionHeading icon={Mail} title="Contact & basics" />
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <DetailRow icon={Mail} label="Email" value={profile.email} />
                    <DetailRow icon={Phone} label="Phone" value={profile.phoneNumber} />
                    <DetailRow icon={MapPin} label="Location" value={locationText} />
                    <DetailRow icon={Calendar} label="Date of birth" value={profile.dateOfBirth} />
                    <DetailRow
                        icon={Briefcase}
                        label="Status"
                        value={profile.employmentStatus}
                    />
                    <DetailRow
                        icon={Briefcase}
                        label="Experience"
                        value={
                            profile.yearsOfExperience !== undefined
                                ? `${profile.yearsOfExperience} years`
                                : undefined
                        }
                    />
                </div>
            </section>

            {profile.education.length > 0 && (
                <section className="space-y-3">
                    <SectionHeading icon={GraduationCap} title="Education" />
                    <div className="space-y-3">
                        {profile.education.map((edu, index) => (
                            <div
                                key={index}
                                className="rounded-lg border border-slate-200 p-4 dark:border-slate-800"
                            >
                                <p className="font-medium text-slate-900 dark:text-slate-100">
                                    {edu.degree ? `${edu.degree} · ` : ""}
                                    {edu.fieldOfStudy}
                                </p>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    {edu.institution}
                                    {edu.startYear && edu.endYear
                                        ? ` · ${edu.startYear} – ${edu.endYear}`
                                        : ""}
                                </p>
                                {edu.cgpaOrPercentage !== undefined && (
                                    <p className="text-sm text-slate-500 dark:text-slate-400">
                                        CGPA/Percentage: {edu.cgpaOrPercentage}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {profile.experience.length > 0 && (
                <section className="space-y-3">
                    <SectionHeading icon={Briefcase} title="Experience" />
                    <div className="space-y-3">
                        {profile.experience.map((exp, index) => (
                            <div
                                key={index}
                                className="rounded-lg border border-slate-200 p-4 dark:border-slate-800"
                            >
                                <p className="font-medium text-slate-900 dark:text-slate-100">
                                    {exp.role} · {exp.company}
                                </p>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    {exp.startDate} – {exp.isCurrent ? "Present" : exp.endDate}
                                </p>
                                {exp.description && (
                                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                                        {exp.description}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {profile.skills.length > 0 && (
                <section className="space-y-3">
                    <SectionHeading icon={Settings2} title="Skills" />
                    <div className="flex flex-wrap gap-2">
                        {profile.skills.map((skill) => (
                            <Badge
                                key={skill}
                                variant="secondary"
                                className="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                            >
                                {skill}
                            </Badge>
                        ))}
                    </div>
                </section>
            )}

            {profile.projects.length > 0 && (
                <section className="space-y-3">
                    <SectionHeading icon={FolderGit2} title="Projects" />
                    <div className="space-y-3">
                        {profile.projects.map((project, index) => (
                            <div
                                key={index}
                                className="rounded-lg border border-slate-200 p-4 dark:border-slate-800"
                            >
                                <div className="flex items-center justify-between gap-2">
                                    <p className="font-medium text-slate-900 dark:text-slate-100">
                                        {project.title}
                                    </p>
                                    {project.link && (
                                        <a
                                            href={project.link}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-xs font-medium text-blue-600 hover:underline dark:text-blue-400"
                                        >
                                            View
                                        </a>
                                    )}
                                </div>
                                {project.description && (
                                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                                        {project.description}
                                    </p>
                                )}
                                {project.techStack && project.techStack.length > 0 && (
                                    <div className="mt-2 flex flex-wrap gap-1.5">
                                        {project.techStack.map((tech) => (
                                            <Badge
                                                key={tech}
                                                variant="secondary"
                                                className="bg-slate-100 text-xs text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                                            >
                                                {tech}
                                            </Badge>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {profile.certifications.length > 0 && (
                <section className="space-y-3">
                    <SectionHeading icon={Award} title="Certifications" />
                    <div className="space-y-3">
                        {profile.certifications.map((cert, index) => (
                            <div
                                key={index}
                                className="rounded-lg border border-slate-200 p-4 dark:border-slate-800"
                            >
                                <div className="flex items-center justify-between gap-2">
                                    <p className="font-medium text-slate-900 dark:text-slate-100">
                                        {cert.name}
                                    </p>
                                    {cert.credentialLink && (
                                        <a
                                            href={cert.credentialLink}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-xs font-medium text-blue-600 hover:underline dark:text-blue-400"
                                        >
                                            View
                                        </a>
                                    )}
                                </div>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    {cert.issuingBody}
                                    {cert.date ? ` · ${cert.date}` : ""}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {profile.jobPreferences && (
                <section className="space-y-3">
                    <SectionHeading icon={Settings2} title="Job preferences" />
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        <DetailRow
                            icon={Briefcase}
                            label="Desired role"
                            value={profile.jobPreferences.desiredRole}
                        />
                        <DetailRow
                            icon={Briefcase}
                            label="Employment type"
                            value={profile.jobPreferences.employmentType}
                        />
                        <DetailRow
                            icon={Briefcase}
                            label="Work mode"
                            value={profile.jobPreferences.workMode}
                        />
                        <DetailRow
                            icon={Briefcase}
                            label="Expected salary"
                            value={
                                profile.jobPreferences.expectedSalary !== undefined
                                    ? `₹${profile.jobPreferences.expectedSalary.toLocaleString()}`
                                    : undefined
                            }
                        />
                        <DetailRow
                            icon={Calendar}
                            label="Notice period"
                            value={
                                profile.jobPreferences.noticePeriodDays !== undefined
                                    ? `${profile.jobPreferences.noticePeriodDays} days`
                                    : undefined
                            }
                        />
                        {profile.jobPreferences.preferredLocations &&
                            profile.jobPreferences.preferredLocations.length > 0 && (
                                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 sm:col-span-2">
                                    <MapPin className="h-4 w-4 shrink-0 text-slate-400 dark:text-slate-500" />
                                    <span className="text-slate-500 dark:text-slate-400">
                                        Preferred locations:
                                    </span>
                                    <span className="text-slate-900 dark:text-slate-100">
                                        {profile.jobPreferences.preferredLocations.join(", ")}
                                    </span>
                                </div>
                            )}
                    </div>
                </section>
            )}

            {(profile.linkedin ||
                profile.github ||
                profile.portfolio ||
                profile.resumeUrl) && (
                    <section className="space-y-3">
                        <SectionHeading icon={Link2} title="Links" />
                        <div className="flex flex-wrap gap-2">
                            <LinkPill icon={Linkedin} label="LinkedIn" href={profile.linkedin} />
                            <LinkPill icon={Github} label="GitHub" href={profile.github} />
                            <LinkPill icon={Globe} label="Portfolio" href={profile.portfolio} />
                            <LinkPill icon={FileText} label="Resume" href={profile.resumeUrl} />
                        </div>
                    </section>
                )}
        </div>
    );
}