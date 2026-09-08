import { tool } from "ai";
import { z } from "zod";

import dataJson from "@/data/data.json";
import skillsJson from "@/data/skills.json";
import workJson from "@/data/work.json";
import projectsJson from "@/data/projects.json";
import clubsJson from "@/data/clubs.json";
import contactJson from "@/data/contact.json";
import achievementsJson from "@/data/achievements.json";

// ─── 1. Personal Bio & Background ───
export const getPersonalInfoTool = tool({
  description:
    "Retrieve Gyanendra Prakash's personal information, bio, summary, location, hackathon achievements, and background details.",
  inputSchema: z.object({}),
  execute: async () => {
    return {
      name: dataJson.name,
      initials: dataJson.initials,
      location: dataJson.location,
      headline: dataJson.description,
      summary: dataJson.summary,
      hackathonWins: 3,
      homeServer: "Self-hosted cloud Hermes AI agent & repurposed desktop PC Linux server",
    };
  },
});

// ─── 2. Education History ───
export const getEducationTool = tool({
  description:
    "Retrieve Gyanendra Prakash's educational background, university degree, high school, and percentage/marks.",
  inputSchema: z.object({}),
  execute: async () => {
    return {
      education: dataJson.education.map((edu) => ({
        institution: edu.school,
        degree: edu.degree,
        startYear: edu.start,
        endYear: edu.end,
        website: edu.href,
      })),
    };
  },
});

// ─── 3. Skills & Technologies ───
export const getSkillsTool = tool({
  description:
    "Retrieve Gyanendra's technical skills, categorized by Web/Frontend, AI/ML/Data, Backend/DevOps, and Core Stack.",
  inputSchema: z.object({
    category: z
      .string()
      .optional()
      .describe("Optional category to filter: 'core', 'web', 'ai', 'devops', or 'all'"),
  }),
  execute: async ({ category }: { category?: string }) => {
    const coreStack = [
      "Python",
      "React",
      "Next.js",
      "LLMs & Autonomous AI Agents",
      "TypeScript",
      "Docker",
    ];

    const webFrontend = (skillsJson.skills || []).map((s: any) => s.name);
    const backendDataAI = (skillsJson.skillsw || []).map((s: any) => s.name);
    const devOpsTools = (skillsJson.skillsb || []).map((s: any) => s.name);
    const mobileHardware = (skillsJson.skillswf || []).map((s: any) => s.name);

    if (category === "core") {
      return { coreStack };
    }

    return {
      coreStack,
      webFrontend,
      backendDataAI,
      devOpsTools,
      mobileHardware,
    };
  },
});

// ─── 4. Work Experience ───
export const getWorkExperienceTool = tool({
  description:
    "Retrieve Gyanendra's professional work experience, past internships, roles, companies, and responsibilities. Note: He is not currently employed anywhere — his last internship was at Hypotenuse Analytics which ended August 2026.",
  inputSchema: z.object({}),
  execute: async () => {
    return {
      currentStatus: "Not currently employed. Last internship completed Aug 2026.",
      experience: workJson.work.map((job) => ({
        company: job.company,
        role: job.title,
        status: job.badges || [],
        duration: `${job.start} — ${job.end}`,
        location: job.location,
        responsibilities: job.description,
        links: job.links,
      })),
    };
  },
});

// ─── 5. Projects & Case Studies ───
export const getProjectsTool = tool({
  description:
    "Retrieve Gyanendra's technical projects, live demos, GitHub repositories, technologies used, and case study outcomes.",
  inputSchema: z.object({
    projectTitle: z
      .string()
      .optional()
      .describe("Optional title or keyword to filter for a specific project"),
  }),
  execute: async ({ projectTitle }: { projectTitle?: string }) => {
    if (projectTitle) {
      const filtered = projectsJson.projects.filter((p) =>
        p.title.toLowerCase().includes(projectTitle.toLowerCase())
      );
      if (filtered.length > 0) return { projects: filtered };
    }
    return {
      projects: projectsJson.projects,
    };
  },
});

// ─── 6. Leadership & Club Roles ───
export const getClubsAndLeadershipTool = tool({
  description:
    "Retrieve Gyanendra's campus leadership roles, student bodies, clubs, events organized, and platforms shipped.",
  inputSchema: z.object({}),
  execute: async () => {
    return {
      currentLeadership: {
        role: "Volunteer Tech Lead",
        organization: "Dean Career Cloud (DCC), SCSET, Bennett University",
        duration: "Aug 2025 — Present",
        website: "https://dcc-wesbite.vercel.app/",
        metrics: "25+ mentorship sessions, 10+ industry partners",
        description:
          "Volunteering as Tech Lead to engineer the official career development web platform for SCSET, Bennett University, featuring algorithmic bootcamps, MAANG 1-on-1 mentorship pipelines, and ATS clinics.",
      },
      executiveRole: {
        role: "Chief Technical Officer",
        organization: "Artificial Intelligence Society (AIS), Bennett University",
        duration: "Aug 2025 — May 2026",
        metrics: "6+ events organized, 1 official society site shipped",
        website: "https://ais-web-two.vercel.app/",
      },
      clubHistory: clubsJson.map((club) => ({
        organization: club.organization,
        roles: club.post,
        links: club.links,
      })),
    };
  },
});

// ─── 7. Contact Information ───
export const getContactInfoTool = tool({
  description:
    "Retrieve Gyanendra's contact details, email address, phone, location, and social profile links (GitHub, LinkedIn, LeetCode, X).",
  inputSchema: z.object({}),
  execute: async () => {
    return {
      email: contactJson.contact.email,
      phone: contactJson.contact.tel,
      location: "Mohali, Punjab / Greater Noida, India",
      socialLinks: {
        github: contactJson.contact.social.GitHub.url,
        linkedin: contactJson.contact.social.LinkedIn.url,
        x: contactJson.contact.social.X.url,
        leetcode: "https://leetcode.com/u/gyaanendra/",
        resume: "/resume.pdf",
      },
    };
  },
});

// ─── 8. Hackathons & Achievements ───
export const getAchievementsTool = tool({
  description:
    "Retrieve details strictly about Gyanendra's verified hackathon wins, podiums, and engineering competition awards.",
  inputSchema: z.object({}),
  execute: async () => {
    return {
      totalAchievements: achievementsJson.achievements.length,
      achievements: achievementsJson.achievements.map((act) => ({
        name: act.title,
        dates: act.dates,
        location: act.location,
        achievement: act.achievement || "Winner / Finalist",
      })),
    };
  },
});

// Combined tools map for the AI Agent
export const portfolioTools = {
  getPersonalInfo: getPersonalInfoTool,
  getEducation: getEducationTool,
  getSkills: getSkillsTool,
  getWorkExperience: getWorkExperienceTool,
  getProjects: getProjectsTool,
  getClubsAndLeadership: getClubsAndLeadershipTool,
  getContactInfo: getContactInfoTool,
  getAchievements: getAchievementsTool,
};
