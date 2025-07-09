// utils/constants.js
export const JOB_CATEGORIES = {
  0: "Web Development",
  1: "Mobile Development",
  2: "UI/UX Design",
  3: "Content Writing",
  4: "Digital Marketing",
  5: "Data Science",
  6: "Blockchain Development",
  7: "Graphic Design",
  8: "Video Editing",
  9: "Translation",
  10: "Photography",
  11: "Music & Audio",
  12: "Animation",
  13: "Game Development",
  14: "DevOps & Cloud",
  15: "AI & Machine Learning",
};

export const JOB_STATUS = {
  0: "Posted",
  1: "In Progress",
  2: "Submitted",
  3: "Completed",
  4: "Cancelled",
  5: "Disputed",
};

export const USER_TYPES = {
  0: "Client",
  1: "Freelancer",
  2: "Both",
};

export const NETWORKS = {
  1: "Ethereum Mainnet",
  3: "Ropsten Testnet",
  4: "Rinkeby Testnet",
  5: "Goerli Testnet",
  137: "Polygon Mainnet",
  80001: "Mumbai Testnet",
  56: "BSC Mainnet",
  97: "BSC Testnet",
};

export const SUPPORTED_NETWORKS = [1, 3, 4, 5, 137, 80001];

export const PLATFORM_FEE = 0.025; // 2.5%
export const SECURITY_DEPOSIT_PERCENTAGE = 0.1; // 10%

export const SKILL_CATEGORIES = {
  Programming: [
    "JavaScript",
    "Python",
    "Java",
    "C++",
    "React",
    "Node.js",
    "PHP",
    "Ruby",
  ],
  Design: [
    "UI/UX",
    "Graphic Design",
    "Web Design",
    "Logo Design",
    "Photoshop",
    "Figma",
  ],
  Marketing: [
    "SEO",
    "Social Media",
    "Content Marketing",
    "Email Marketing",
    "PPC",
  ],
  Writing: [
    "Content Writing",
    "Copywriting",
    "Technical Writing",
    "Blog Writing",
  ],
  Data: ["Data Analysis", "Machine Learning", "SQL", "Python", "R", "Excel"],
  Other: [
    "Virtual Assistant",
    "Customer Service",
    "Project Management",
    "Translation",
  ],
};

export const EXPERIENCE_LEVELS = {
  entry: "Entry Level",
  intermediate: "Intermediate",
  expert: "Expert",
};

export const JOB_DURATION = {
  short: "Less than 1 month",
  medium: "1-3 months",
  long: "3-6 months",
  ongoing: "More than 6 months",
};
