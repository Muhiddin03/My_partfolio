/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Profile {
  name: string;
  title: string;
  bio: string;
  experienceYears: number;
  telegram: string;
  linkedin: string;
  github: string;
  email: string;
  phone: string;
  avatarUrl: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string; // e.g. "Frontend", "Backend", "Dizayn", "Boshqa"
  level: number; // 0 - 100
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  startYear: string;
  endYear: string;
  description: string;
  current: boolean;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  imageUrls?: string[]; // Up to 4 images for slideshow
  videoUrl: string;
  liveUrl: string;
  tags: string[];
  date: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  iconName: string; // lucide icon name
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  date?: string;
  imageUrl?: string;
}

export interface Workplace {
  id: string;
  company: string;
  role: string;
  duration: string;
  description: string;
  imageUrl?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  date: string;
  read: boolean;
}

export interface PortfolioData {
  profile: Profile;
  skills: Skill[];
  education: Education[];
  projects: Project[];
  services?: Service[];
  achievements?: Achievement[];
  workplaces?: Workplace[];
}
