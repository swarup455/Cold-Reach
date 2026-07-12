import api from "./axiosInstance";

export interface Education {
    level: string;
    degree?: string;
    institution: string;
    fieldOfStudy?: string;
    startYear?: number;
    endYear?: number;
    cgpaOrPercentage?: number;
}

export interface Experience {
    company: string;
    role: string;
    startDate: string;
    endDate?: string;
    isCurrent: boolean;
    description?: string;
}

export interface Project {
    title: string;
    description?: string;
    techStack?: string[];
    link?: string;
}

export interface Certification {
    name: string;
    issuingBody?: string;
    date?: string;
    credentialLink?: string;
}

export interface JobPreferences {
    desiredRole?: string;
    employmentType?: string;
    workMode?: string;
    expectedSalary?: number;
    noticePeriodDays?: number;
    preferredLocations?: string[];
}

export interface Profile {
    _id: string;
    name: string;
    email: string;
    isProfileComplete: boolean;
    gmailConnected: boolean;

    profilePhoto?: string;
    phoneNumber?: string;
    location?: {
        city?: string;
        state?: string;
        country?: string;
    };
    dateOfBirth?: string;

    headline?: string;
    bio?: string;
    yearsOfExperience?: number;
    employmentStatus?: "employed" | "open-to-work" | "student" | "fresher";

    education: Education[];
    experience: Experience[];
    skills: string[];
    projects: Project[];
    certifications: Certification[];

    linkedin?: string;
    github?: string;
    portfolio?: string;
    resumeUrl?: string;

    jobPreferences?: JobPreferences;
}

export interface UpdateProfilePayload {
    profilePhoto?: File | string;
    resumeUrl?: File | string;
    phoneNumber?: string;
    dateOfBirth?: string;
    headline?: string;
    bio?: string;
    yearsOfExperience?: number;
    employmentStatus?: string;
    linkedin?: string;
    github?: string;
    portfolio?: string;
    location?: Profile["location"];
    education?: Education[];
    experience?: Experience[];
    skills?: string[];
    projects?: Project[];
    certifications?: Certification[];
    jobPreferences?: JobPreferences;
}

const JSON_FIELDS = [
    "location",
    "education",
    "experience",
    "skills",
    "projects",
    "certifications",
    "jobPreferences",
];

function buildProfileFormData(payload: UpdateProfilePayload): FormData {
    const formData = new FormData();

    for (const [key, value] of Object.entries(payload)) {
        if (value === undefined || value === null) continue;

        if (key === "profilePhoto" || key === "resumeUrl") {
            if (value instanceof File) {
                formData.append(key === "profilePhoto" ? "profilePhoto" : "resume", value);
            } else {
                formData.append(key, value as string);
            }
            continue;
        }

        if (JSON_FIELDS.includes(key)) {
            formData.append(key, JSON.stringify(value));
            continue;
        }

        formData.append(key, String(value));
    }

    return formData;
}

export const updateProfile = async (payload: UpdateProfilePayload) => {
    const formData = buildProfileFormData(payload);

    const res = await api.patch("/auth/update-profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data.data as Profile;
};