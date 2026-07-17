import React, { useState, useEffect } from "react";
import {
  PortfolioData,
  Profile,
  Skill,
  Education,
  Project,
  ContactMessage,
  Service,
  Workplace,
  Achievement,
} from "../types";
import {
  loginAdmin,
  savePortfolio,
  fetchMessages,
  markMessageAsRead,
  deleteMessage,
  uploadFile,
} from "../lib/api";
import {
  Lock,
  Unlock,
  LogOut,
  User,
  Cpu,
  GraduationCap,
  Briefcase,
  Mail,
  Trash2,
  Check,
  Plus,
  Upload,
  Eye,
  Settings,
  AlertCircle,
  FileText,
  Clock,
  Phone,
  Link as LinkIcon,
  Award,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface AdminPanelProps {
  portfolioData: PortfolioData;
  setPortfolioData: (data: PortfolioData) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (loggedIn: boolean) => void;
  token: string;
  setToken: (token: string) => void;
}

type Tab =
  | "profile"
  | "services"
  | "skills"
  | "workplaces"
  | "education"
  | "projects"
  | "achievements"
  | "messages";

export default function AdminPanel({
  portfolioData,
  setPortfolioData,
  isLoggedIn,
  setIsLoggedIn,
  token,
  setToken,
}: AdminPanelProps) {
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Messages State
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  // Form States
  const [profileForm, setProfileForm] = useState<Profile>({ ...portfolioData.profile });
  const [skills, setSkills] = useState<Skill[]>([...portfolioData.skills]);
  const [education, setEducation] = useState<Education[]>([...portfolioData.education]);
  const [projects, setProjects] = useState<Project[]>([...portfolioData.projects]);
  const [services, setServices] = useState<Service[]>([...(portfolioData.services || [])]);
  const [workplaces, setWorkplaces] = useState<Workplace[]>([...(portfolioData.workplaces || [])]);
  const [achievements, setAchievements] = useState<Achievement[]>([...(portfolioData.achievements || [])]);

  // Modals / Temporary Add Forms
  const [newSkill, setNewSkill] = useState<Omit<Skill, "id">>({ name: "", category: "", level: 80 });
  const [newEdu, setNewEdu] = useState<Omit<Education, "id">>({
    institution: "",
    degree: "",
    startYear: "",
    endYear: "",
    description: "",
    current: false,
  });
  const [newProj, setNewProj] = useState<Omit<Project, "id">>({
    title: "",
    description: "",
    imageUrl: "",
    videoUrl: "",
    liveUrl: "",
    tags: [],
    date: new Date().toISOString().substring(0, 7),
  });
  const [newProjImages, setNewProjImages] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const [newService, setNewService] = useState<Omit<Service, "id">>({
    title: "",
    description: "",
    iconName: "Code",
  });

  const [newWorkplace, setNewWorkplace] = useState<Omit<Workplace, "id">>({
    company: "",
    role: "",
    duration: "",
    description: "",
    imageUrl: "",
  });

  const [newAchievement, setNewAchievement] = useState<Omit<Achievement, "id">>({
    title: "",
    description: "",
    date: "",
    imageUrl: "",
  });

  // Track file uploading state
  const [isUploading, setIsUploading] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    // Keep local states in sync when portfolioData loads initially
    setProfileForm({ ...portfolioData.profile });
    setSkills([...portfolioData.skills]);
    setEducation([...portfolioData.education]);
    setProjects([...portfolioData.projects]);
    setServices([...(portfolioData.services || [])]);
    setWorkplaces([...(portfolioData.workplaces || [])]);
    setAchievements([...(portfolioData.achievements || [])]);
  }, [portfolioData]);

  // Load Messages if logged in
  useEffect(() => {
    if (isLoggedIn && token) {
      loadMessages();
    }
  }, [isLoggedIn, token]);

  const loadMessages = async () => {
    setIsLoadingMessages(true);
    try {
      const data = await fetchMessages(token);
      setMessages(data);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const receivedToken = await loginAdmin(password);
      setToken(receivedToken);
      setIsLoggedIn(true);
      setPassword("");
    } catch (err: any) {
      setError(err.message || "Parol noto'g'ri!");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setToken("");
  };

  // Generic file uploader handler
  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldKey: string,
    onSuccess: (url: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading((prev) => ({ ...prev, [fieldKey]: true }));
    setError("");

    try {
      const result = await uploadFile(file, token);
      onSuccess(result.url);
      setSuccess("Fayl muvaffaqiyatli serverga yuklandi!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(err.message || "Fayl yuklashda xatolik.");
    } finally {
      setIsUploading((prev) => ({ ...prev, [fieldKey]: false }));
    }
  };

  // Global Save of the Portfolio
  const handleSavePortfolio = async (updatedData: PortfolioData) => {
    setIsSaving(true);
    setError("");
    setSuccess("");
    try {
      await savePortfolio(updatedData, token);
      setPortfolioData(updatedData);
      setSuccess("O'zgarishlar muvaffaqiyatli saqlandi va platformada e'lon qilindi!");
      setTimeout(() => setSuccess(""), 5000);
    } catch (err: any) {
      setError(err.message || "Ma'lumotlarni saqlashda xatolik.");
    } finally {
      setIsSaving(false);
    }
  };

  // --- Profile handlers ---
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfileForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.type === "number" ? parseInt(e.target.value) || 0 : e.target.value,
    }));
  };

  const saveProfileChanges = () => {
    const updated = {
      ...portfolioData,
      profile: profileForm,
    };
    handleSavePortfolio(updated);
  };

  // --- Skills Handlers ---
  const handleAddSkill = () => {
    if (!newSkill.name) return;
    const added: Skill = {
      id: "skill_" + Date.now(),
      ...newSkill,
      category: newSkill.category?.trim() || "Boshqa",
    };
    const updatedSkills = [...skills, added];
    setSkills(updatedSkills);
    setNewSkill({ name: "", category: "", level: 80 });

    const updatedPortfolio = {
      ...portfolioData,
      skills: updatedSkills,
    };
    handleSavePortfolio(updatedPortfolio);
  };

  const handleDeleteSkill = (id: string) => {
    const updatedSkills = skills.filter((s) => s.id !== id);
    setSkills(updatedSkills);
    const updatedPortfolio = {
      ...portfolioData,
      skills: updatedSkills,
    };
    handleSavePortfolio(updatedPortfolio);
  };

  // --- Services Handlers ---
  const handleAddService = () => {
    if (!newService.title || !newService.description) return;
    const added: Service = {
      id: "srv_" + Date.now(),
      ...newService,
    };
    const updatedServices = [...services, added];
    setServices(updatedServices);
    setNewService({ title: "", description: "", iconName: "Code" });

    const updatedPortfolio = {
      ...portfolioData,
      services: updatedServices,
    };
    handleSavePortfolio(updatedPortfolio);
  };

  const handleDeleteService = (id: string) => {
    const updatedServices = services.filter((s) => s.id !== id);
    setServices(updatedServices);
    const updatedPortfolio = {
      ...portfolioData,
      services: updatedServices,
    };
    handleSavePortfolio(updatedPortfolio);
  };

  // --- Workplaces Handlers ---
  const handleAddWorkplace = () => {
    if (!newWorkplace.company || !newWorkplace.role || !newWorkplace.duration) return;
    const added: Workplace = {
      id: "wrk_" + Date.now(),
      ...newWorkplace,
    };
    const updatedWorkplaces = [...workplaces, added];
    setWorkplaces(updatedWorkplaces);
    setNewWorkplace({
      company: "",
      role: "",
      duration: "",
      description: "",
      imageUrl: "",
    });

    const updatedPortfolio = {
      ...portfolioData,
      workplaces: updatedWorkplaces,
    };
    handleSavePortfolio(updatedPortfolio);
  };

  const handleDeleteWorkplace = (id: string) => {
    const updatedWorkplaces = workplaces.filter((w) => w.id !== id);
    setWorkplaces(updatedWorkplaces);
    const updatedPortfolio = {
      ...portfolioData,
      workplaces: updatedWorkplaces,
    };
    handleSavePortfolio(updatedPortfolio);
  };

  // --- Achievements Handlers ---
  const handleAddAchievement = () => {
    if (!newAchievement.title || !newAchievement.description) return;
    const added: Achievement = {
      id: "ach_" + Date.now(),
      ...newAchievement,
    };
    const updatedAchievements = [...achievements, added];
    setAchievements(updatedAchievements);
    setNewAchievement({
      title: "",
      description: "",
      date: "",
      imageUrl: "",
    });

    const updatedPortfolio = {
      ...portfolioData,
      achievements: updatedAchievements,
    };
    handleSavePortfolio(updatedPortfolio);
  };

  const handleDeleteAchievement = (id: string) => {
    const updatedAchievements = achievements.filter((a) => a.id !== id);
    setAchievements(updatedAchievements);
    const updatedPortfolio = {
      ...portfolioData,
      achievements: updatedAchievements,
    };
    handleSavePortfolio(updatedPortfolio);
  };

  // --- Education Handlers ---
  const handleAddEdu = () => {
    if (!newEdu.institution || !newEdu.degree || !newEdu.startYear) return;
    const added: Education = {
      id: "edu_" + Date.now(),
      ...newEdu,
    };
    const updatedEdu = [...education, added];
    setEducation(updatedEdu);
    setNewEdu({
      institution: "",
      degree: "",
      startYear: "",
      endYear: "",
      description: "",
      current: false,
    });

    const updatedPortfolio = {
      ...portfolioData,
      education: updatedEdu,
    };
    handleSavePortfolio(updatedPortfolio);
  };

  const handleDeleteEdu = (id: string) => {
    const updatedEdu = education.filter((e) => e.id !== id);
    setEducation(updatedEdu);
    const updatedPortfolio = {
      ...portfolioData,
      education: updatedEdu,
    };
    handleSavePortfolio(updatedPortfolio);
  };

  // --- Projects Handlers ---
  const handleAddProject = () => {
    if (!newProj.title || !newProj.description) return;

    // Process tags
    const processedTags = tagInput
      ? tagInput.split(",").map((t) => t.trim()).filter(Boolean)
      : [];

    const added: Project = {
      id: "proj_" + Date.now(),
      ...newProj,
      imageUrl: newProjImages[0] || newProj.imageUrl || "",
      imageUrls: newProjImages.length > 0 ? newProjImages : undefined,
      tags: processedTags.length > 0 ? processedTags : ["Boshqa"],
    };

    const updatedProjects = [added, ...projects]; // Add to top
    setProjects(updatedProjects);

    // Reset form
    setNewProj({
      title: "",
      description: "",
      imageUrl: "",
      videoUrl: "",
      liveUrl: "",
      tags: [],
      date: new Date().toISOString().substring(0, 7),
    });
    setNewProjImages([]);
    setTagInput("");

    const updatedPortfolio = {
      ...portfolioData,
      projects: updatedProjects,
    };
    handleSavePortfolio(updatedPortfolio);
  };

  const handleDeleteProject = (id: string) => {
    const updatedProjects = projects.filter((p) => p.id !== id);
    setProjects(updatedProjects);
    const updatedPortfolio = {
      ...portfolioData,
      projects: updatedProjects,
    };
    handleSavePortfolio(updatedPortfolio);
  };

  // Add individual image to the multi-image array for project being added
  const handleAddProjectImage = (url: string) => {
    if (newProjImages.length >= 4) {
      setError("Maksimal 4 ta rasm yuklash mumkin!");
      setTimeout(() => setError(""), 3000);
      return;
    }
    setNewProjImages((prev) => [...prev, url]);
  };

  const handleRemoveProjectImage = (idx: number) => {
    setNewProjImages((prev) => prev.filter((_, i) => i !== idx));
  };

  // --- Visitor Inbox Message Actions ---
  const handleMarkAsRead = async (id: string) => {
    const success = await markMessageAsRead(id, token);
    if (success) {
      setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, read: true } : m)));
    }
  };

  const handleDeleteMessage = async (id: string) => {
    const success = await deleteMessage(id, token);
    if (success) {
      setMessages((prev) => prev.filter((m) => m.id !== id));
    }
  };

  // --- LOGIN SCREEN IF NOT AUTHENTICATED ---
  if (!isLoggedIn) {
    return (
      <div className="w-full h-[60vh] flex flex-col items-center justify-center text-brand-text px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md p-8 bg-brand-card border border-brand-border rounded-3xl shadow-sm space-y-6"
        >
          <div className="text-center">
            <div className="w-14 h-14 bg-brand-primary/10 text-brand-primary border border-brand-primary/20 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-brand-text font-bold">Admin Panel</h2>
            <p className="text-brand-muted text-xs mt-2">
              Portfolio ma'lumotlarini tahrirlash uchun parolni kiriting.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-brand-muted uppercase tracking-widest font-bold">
                Maxfiy parol
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Parolni kiriting..."
                className="w-full px-4 py-3 bg-brand-bg border border-[#E5DEC9] rounded-xl text-xs focus:outline-none focus:border-brand-primary text-brand-text placeholder-slate-400 font-medium"
              />
            </div>

            {error && (
              <div className="p-3.5 rounded-xl bg-brand-red/10 border border-brand-red/25 text-brand-red text-xs flex items-center gap-2 font-medium">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-full bg-brand-primary hover:bg-brand-primary-dark text-white font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow-md"
            >
              <Unlock className="w-4 h-4" />
              Kirish
            </button>
          </form>

          <div className="text-center pt-2 border-t border-[#E5DEC9]">
            <p className="text-[10px] text-brand-muted uppercase tracking-widest font-semibold">
              Standart parol: <span className="font-mono bg-brand-bg border border-[#E5DEC9] px-2 py-1 rounded-lg text-brand-primary ml-1 font-bold">admin123</span>
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  // --- FULL FULL-STACK ADMIN PANEL INTERFACE ---
  return (
    <div className="h-full flex flex-col">
      <div className="w-full h-full flex flex-col overflow-y-auto hide-scrollbar">
        
        {/* Admin Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-[#E5DEC9] mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-brand-primary/10 text-brand-primary border border-brand-primary/15">
                <Settings className="w-4.5 h-4.5" />
              </span>
              <h1 className="text-xl sm:text-2xl font-serif font-bold text-brand-text font-bold">
                Portfolioni <span className="italic text-brand-primary font-serif">Tahrirlash</span>
              </h1>
            </div>
            <p className="text-brand-muted text-xs mt-0.5">
              Loyihalaringiz, xizmatlar, malaka va shaxsiy profilingizni osongina boshqaring.
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-red/10 border border-brand-red/15 text-brand-red hover:bg-brand-red hover:text-white text-[10px] uppercase tracking-wider font-bold cursor-pointer transition-all duration-300"
          >
            <LogOut className="w-3 h-3" />
            Chiqish
          </button>
        </div>

        {/* Success / Error global alerts */}
        {error && (
          <div className="p-3.5 rounded-xl bg-brand-red/10 border border-brand-red/20 text-brand-red text-xs flex items-center gap-2 mb-4 font-semibold">
            <AlertCircle className="w-4.5 h-4.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="p-3.5 rounded-xl bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-xs flex items-center gap-2 mb-4 font-semibold">
            <Check className="w-4.5 h-4.5 flex-shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Tab System layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left-Side tabs buttons list */}
          <div className="lg:col-span-3 flex flex-row lg:flex-col gap-1 overflow-x-auto lg:overflow-x-visible pb-1.5 lg:pb-0 bg-brand-card border border-[#E5DEC9] p-1.5 rounded-xl shadow-xs">
            {[
              { id: "profile", label: "Profil Sozlamalari", icon: <User className="w-3.5 h-3.5" /> },
              { id: "services", label: "Xizmatlar", icon: <Settings className="w-3.5 h-3.5" /> },
              { id: "skills", label: "Ko'nikmalar", icon: <Cpu className="w-3.5 h-3.5" /> },
              { id: "workplaces", label: "Ish Joylari (Tajriba)", icon: <Briefcase className="w-3.5 h-3.5" /> },
              { id: "education", label: "Ta'lim", icon: <GraduationCap className="w-3.5 h-3.5" /> },
              { id: "projects", label: "Loyihalar", icon: <FileText className="w-3.5 h-3.5" /> },
              { id: "achievements", label: "Yutuqlar", icon: <Award className="w-3.5 h-3.5" /> },
              { id: "messages", label: `Xabarlar (${messages.filter((m) => !m.read).length})`, icon: <Mail className="w-3.5 h-3.5" /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-[10px] uppercase tracking-wider font-semibold transition-all whitespace-nowrap cursor-pointer text-left w-full border ${
                  activeTab === tab.id
                    ? "bg-brand-primary text-white border-brand-primary font-bold shadow-xs"
                    : "text-brand-muted border-transparent hover:text-brand-text font-bold hover:bg-white/40"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Right-Side Tab View Workspace */}
          <div className="lg:col-span-9 bg-brand-card border border-[#E5DEC9] p-5 sm:p-8 rounded-2xl min-h-[50vh] shadow-sm">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="w-full"
              >
            {/* TABS: PROFILE EDITOR */}
            {activeTab === "profile" && (
              <div className="space-y-6">
                <div className="border-b border-[#E5DEC9] pb-4">
                  <h2 className="text-lg font-serif font-bold text-brand-text font-bold">Profil ma'lumotlarini o'zgartirish</h2>
                  <p className="text-xs text-brand-muted mt-0.5">Asosiy sahifadagi ism-sharif, sarlavha, bio va aloqa kanallari.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-brand-muted uppercase tracking-widest font-bold">To'liq ism-sharif</label>
                    <input
                      type="text"
                      name="name"
                      value={profileForm.name}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-2.5 bg-brand-bg border border-[#E5DEC9] rounded-xl text-xs focus:outline-none focus:border-brand-primary text-brand-text"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-brand-muted uppercase tracking-widest font-bold">Kasbiy sarlavha</label>
                    <input
                      type="text"
                      name="title"
                      value={profileForm.title}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-2.5 bg-brand-bg border border-[#E5DEC9] rounded-xl text-xs focus:outline-none focus:border-brand-primary text-brand-text"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-brand-muted uppercase tracking-widest font-bold">Men haqimda qisqacha (Bio)</label>
                  <textarea
                    name="bio"
                    rows={4}
                    value={profileForm.bio}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-2.5 bg-brand-bg border border-[#E5DEC9] rounded-xl text-xs focus:outline-none focus:border-brand-primary text-brand-text resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-brand-muted uppercase tracking-widest font-bold">Tajriba muddati (yillarda)</label>
                    <input
                      type="number"
                      name="experienceYears"
                      value={profileForm.experienceYears}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-2.5 bg-brand-bg border border-[#E5DEC9] rounded-xl text-xs focus:outline-none focus:border-brand-primary text-brand-text"
                    />
                  </div>

                  {/* Profile Avatar Uploader */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-brand-muted uppercase tracking-widest font-bold">Profil rasmini yuklash</label>
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-1.5 px-4 py-2.5 bg-brand-bg hover:bg-white/40 border border-[#E5DEC9] rounded-xl text-[10px] uppercase tracking-wider font-bold text-brand-text opacity-90 cursor-pointer transition-all duration-300">
                        <Upload className="w-3.5 h-3.5 text-brand-primary" />
                        Rasm yuklash
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) =>
                            handleFileUpload(e, "avatar", (url) =>
                              setProfileForm((prev) => ({ ...prev, avatarUrl: url }))
                            )
                          }
                        />
                      </label>
                      {isUploading["avatar"] && <span className="text-[10px] font-mono text-brand-primary animate-pulse">Yuklanmoqda...</span>}
                      {profileForm.avatarUrl && (
                        <div className="flex items-center gap-2">
                          <img src={profileForm.avatarUrl} className="w-8 h-8 rounded-full object-cover border border-[#E5DEC9]" alt="" />
                          <span className="text-[10px] font-mono text-brand-muted truncate max-w-[120px]">
                            {profileForm.avatarUrl.split("/").pop()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="border-t border-[#E5DEC9] pt-6 space-y-4">
                  <h3 className="text-sm uppercase tracking-wider font-bold text-brand-primary">Aloqa va Ijtimoiy tarmoqlar</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-brand-muted uppercase tracking-widest font-bold">Telegram havola</label>
                      <input
                        type="text"
                        name="telegram"
                        value={profileForm.telegram}
                        onChange={handleProfileChange}
                        placeholder="https://t.me/username"
                        className="w-full px-4 py-2.5 bg-brand-bg border border-[#E5DEC9] rounded-xl text-xs focus:outline-none focus:border-brand-primary text-brand-text"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-brand-muted uppercase tracking-widest font-bold">LinkedIn havola</label>
                      <input
                        type="text"
                        name="linkedin"
                        value={profileForm.linkedin}
                        onChange={handleProfileChange}
                        placeholder="https://linkedin.com/in/username"
                        className="w-full px-4 py-2.5 bg-brand-bg border border-[#E5DEC9] rounded-xl text-xs focus:outline-none focus:border-brand-primary text-brand-text"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-brand-muted uppercase tracking-widest font-bold">GitHub havola</label>
                      <input
                        type="text"
                        name="github"
                        value={profileForm.github}
                        onChange={handleProfileChange}
                        placeholder="https://github.com/username"
                        className="w-full px-4 py-2.5 bg-brand-bg border border-[#E5DEC9] rounded-xl text-xs focus:outline-none focus:border-brand-primary text-brand-text"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-brand-muted uppercase tracking-widest font-bold">Email manzil</label>
                      <input
                        type="email"
                        name="email"
                        value={profileForm.email}
                        onChange={handleProfileChange}
                        className="w-full px-4 py-2.5 bg-brand-bg border border-[#E5DEC9] rounded-xl text-xs focus:outline-none focus:border-brand-primary text-brand-text"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-brand-muted uppercase tracking-widest font-bold">Telefon raqam</label>
                      <input
                        type="text"
                        name="phone"
                        value={profileForm.phone}
                        onChange={handleProfileChange}
                        className="w-full px-4 py-2.5 bg-brand-bg border border-[#E5DEC9] rounded-xl text-xs focus:outline-none focus:border-brand-primary text-brand-text"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#E5DEC9]">
                  <button
                    onClick={saveProfileChanges}
                    disabled={isSaving}
                    className="px-6 py-3.5 rounded-full bg-brand-primary hover:bg-brand-primary-dark disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold text-[10px] uppercase tracking-widest transition-all duration-300 flex items-center gap-2 cursor-pointer shadow-md"
                  >
                    <Check className="w-4 h-4" />
                    {isSaving ? "Saqlanmoqda..." : "Profilni saqlash"}
                  </button>
                </div>
              </div>
            )}

            {/* TABS: SERVICES */}
            {activeTab === "services" && (
              <div className="space-y-8">
                <div className="border-b border-[#E5DEC9] pb-4">
                  <h2 className="text-lg font-serif font-bold text-brand-text font-bold">Xizmatlarni boshqarish</h2>
                  <p className="text-xs text-brand-muted mt-0.5">Mijozlarga taklif etadigan barcha yo'nalishlar (IT, Robototexnika va boshqalar).</p>
                </div>

                {/* Add new service */}
                <div className="p-5 rounded-2xl bg-brand-bg border border-[#E5DEC9] space-y-4">
                  <h3 className="text-xs font-mono uppercase tracking-widest text-brand-text opacity-90 font-bold">Yangi xizmat qo'shish</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-brand-muted uppercase tracking-widest font-bold">Sarlavha</label>
                      <input
                        type="text"
                        placeholder="Masalan: Konsultatsiya xizmati"
                        value={newService.title}
                        onChange={(e) => setNewService((prev) => ({ ...prev, title: e.target.value }))}
                        className="w-full px-3 py-2 bg-brand-card border border-[#E5DEC9] rounded-xl text-xs focus:outline-none focus:border-brand-primary text-brand-text"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-brand-muted uppercase tracking-widest font-bold">Ikonka (Lucide Icon)</label>
                      <select
                        value={newService.iconName}
                        onChange={(e) => setNewService((prev) => ({ ...prev, iconName: e.target.value }))}
                        className="w-full px-3 py-2 bg-brand-card border border-[#E5DEC9] rounded-xl text-xs focus:outline-none focus:border-brand-primary text-brand-text font-bold"
                      >
                        <option value="Briefcase">Briefcase (Xizmat/Ish)</option>
                        <option value="Star">Star (Alohida taklif)</option>
                        <option value="Heart">Heart (G'amxo'rlik/Sog'liq)</option>
                        <option value="Palette">Palette (Dizayn/Ijod)</option>
                        <option value="BookOpen">BookOpen (Ta'lim/Maslahat)</option>
                        <option value="Scale">Scale (Huquq)</option>
                        <option value="Camera">Camera (Foto/Video)</option>
                        <option value="Users">Users (Jamoa/Mijozlar)</option>
                        <option value="Code">Code (Dasturlash)</option>
                        <option value="Globe">Globe (Veb-sayt)</option>
                        <option value="Cpu">Cpu (Texnika)</option>
                        <option value="Smartphone">Smartphone (Ilova)</option>
                        <option value="Settings">Settings (Tizimlar)</option>
                        <option value="Award">Award (Mukofotlar)</option>
                        <option value="Sparkles">Sparkles (Maxsus xizmat)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-brand-muted uppercase tracking-widest font-bold">Tavsif (Description)</label>
                    <textarea
                      placeholder="Mijozga nimalar qilib bera olasiz, barchasini batafsil tushuntiring..."
                      rows={3}
                      value={newService.description}
                      onChange={(e) => setNewService((prev) => ({ ...prev, description: e.target.value }))}
                      className="w-full px-3 py-2 bg-brand-card border border-[#E5DEC9] rounded-xl text-xs focus:outline-none focus:border-brand-primary text-brand-text resize-none"
                    />
                  </div>

                  <button
                    onClick={handleAddService}
                    disabled={isSaving}
                    className="px-4 py-2.5 rounded-full bg-brand-primary hover:bg-brand-primary-dark text-white font-bold text-[10px] uppercase tracking-widest transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Xizmatni qo'shish
                  </button>
                </div>

                {/* Services current list */}
                <div className="space-y-4">
                  <h3 className="text-xs font-mono uppercase tracking-widest text-brand-text opacity-90 font-bold">Faol Xizmatlar ro'yxati</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {services.map((srv) => (
                      <div key={srv.id} className="p-5 rounded-2xl bg-brand-bg border border-[#E5DEC9] flex flex-col justify-between gap-4 hover:border-brand-primary/30 transition-all shadow-sm">
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] text-brand-primary font-mono font-bold bg-brand-primary/10 border border-brand-primary/15 px-2.5 py-1 rounded-full">
                              Ikonka: {srv.iconName}
                            </span>
                            <button
                              onClick={() => handleDeleteService(srv.id)}
                              className="p-1.5 rounded-full text-brand-red hover:bg-brand-red/10 cursor-pointer transition-all shrink-0"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <h4 className="font-serif text-base font-bold text-brand-text font-bold mt-2.5">{srv.title}</h4>
                          <p className="text-xs text-brand-muted mt-2 leading-relaxed">{srv.description}</p>
                        </div>
                      </div>
                    ))}
                    {services.length === 0 && (
                      <div className="text-center py-8 text-brand-muted text-sm col-span-full font-medium">Hali hech qanday xizmat turi qo'shilmagan.</div>
                    )}
                  </div>
                </div>

              </div>
            )}

            {/* TABS: SKILLS MANAGER */}
            {activeTab === "skills" && (
              <div className="space-y-8">
                <div className="border-b border-[#E5DEC9] pb-4">
                  <h2 className="text-lg font-serif font-bold text-brand-text font-bold">Texnologiyalar va Ko'nikmalar</h2>
                  <p className="text-xs text-brand-muted mt-0.5">Kasbingizga oid bilim, ko'nikma va vositalaringiz hamda ularni qay darajada egallaganingiz.</p>
                </div>

                {/* Add new skill form */}
                <div className="p-5 rounded-2xl bg-brand-bg border border-[#E5DEC9] space-y-4">
                  <h3 className="text-xs font-mono uppercase tracking-widest text-brand-text opacity-90 font-bold">Yangi ko'nikma qo'shish</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-brand-muted uppercase tracking-widest font-bold">Nomi</label>
                      <input
                        type="text"
                        placeholder="Masalan: Photoshop, Ingliz tili, Muzokara..."
                        value={newSkill.name}
                        onChange={(e) => setNewSkill((prev) => ({ ...prev, name: e.target.value }))}
                        className="w-full px-3 py-2 bg-brand-card border border-[#E5DEC9] rounded-xl text-xs focus:outline-none focus:border-brand-primary text-brand-text"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-brand-muted uppercase tracking-widest font-bold">Turkum (Category)</label>
                      <input
                        type="text"
                        list="skill-category-suggestions"
                        placeholder="Masalan: Dizayn, Tibbiyot, Huquq, Oshpazlik..."
                        value={newSkill.category}
                        onChange={(e) => setNewSkill((prev) => ({ ...prev, category: e.target.value }))}
                        className="w-full px-3 py-2 bg-brand-card border border-[#E5DEC9] rounded-xl text-xs focus:outline-none focus:border-brand-primary text-brand-text font-bold"
                      />
                      <datalist id="skill-category-suggestions">
                        {Array.from(new Set(skills.map((s) => s.category).filter(Boolean))).map((cat) => (
                          <option key={cat} value={cat} />
                        ))}
                      </datalist>
                      <p className="text-[9px] text-brand-muted leading-relaxed">Istalgan turkum nomini yozishingiz mumkin — bu maydon sizning kasbingizga moslashadi.</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-brand-muted uppercase tracking-widest font-bold">
                        Daraja (%): <span className="text-brand-primary font-bold">{newSkill.level}</span>
                      </label>
                      <input
                        type="range"
                        min="10"
                        max="100"
                        step="5"
                        value={newSkill.level}
                        onChange={(e) => setNewSkill((prev) => ({ ...prev, level: parseInt(e.target.value) }))}
                        className="w-full accent-brand-green mt-2"
                      />
                    </div>
                  </div>
                  <button
                    onClick={handleAddSkill}
                    disabled={isSaving}
                    className="px-4 py-2.5 rounded-full bg-brand-primary hover:bg-brand-primary-dark text-white font-bold text-[10px] uppercase tracking-widest transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Ro'yxatga qo'shish
                  </button>
                </div>

                {/* Skills list table */}
                <div className="space-y-3">
                  <h3 className="text-xs font-mono uppercase tracking-widest text-brand-text opacity-90 font-bold">Amaldagi ko'nikmalar</h3>
                  <div className="overflow-x-auto rounded-2xl border border-[#E5DEC9] bg-brand-bg shadow-sm">
                    <table className="w-full border-collapse text-left text-xs text-brand-text">
                      <thead>
                        <tr className="border-b border-[#E5DEC9] bg-white/20 text-brand-muted text-[10px] uppercase tracking-widest font-mono font-bold">
                          <th className="p-4">Nomi</th>
                          <th className="p-4">Kategoriya</th>
                          <th className="p-4 text-center">Daraja</th>
                          <th className="p-4 text-right">O'chirish</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E5DEC9]">
                        {skills.map((skill) => (
                          <tr key={skill.id} className="hover:bg-white/40 transition-colors">
                            <td className="p-4 font-bold text-slate-900">{skill.name}</td>
                            <td className="p-4 text-[10px] uppercase tracking-wider font-semibold">
                              <span className="px-2.5 py-1 rounded-full bg-brand-card border border-[#E5DEC9] text-brand-text opacity-90 font-bold">
                                {skill.category}
                              </span>
                            </td>
                            <td className="p-4 text-center font-mono font-bold text-brand-primary">{skill.level}%</td>
                            <td className="p-4 text-right">
                              <button
                                onClick={() => handleDeleteSkill(skill.id)}
                                className="p-1.5 rounded-full text-brand-red hover:bg-brand-red/10 cursor-pointer transition-colors"
                                title="O'chirish"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                        {skills.length === 0 && (
                          <tr>
                            <td colSpan={4} className="p-8 text-center text-brand-muted font-medium">Hali hech qanday ko'nikma qo'shilmagan.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}

            {/* TABS: WORKPLACES (TAJRIBA) */}
            {activeTab === "workplaces" && (
              <div className="space-y-8">
                <div className="border-b border-[#E5DEC9] pb-4">
                  <h2 className="text-lg font-serif font-bold text-brand-text font-bold">Ish joylarini boshqarish</h2>
                  <p className="text-xs text-brand-muted mt-0.5">Siz mehnat qilgan yoki hozir ishlayotgan tashkilot, kompaniya yoki muassasalar.</p>
                </div>

                {/* Add new workplace */}
                <div className="p-5 rounded-2xl bg-brand-bg border border-[#E5DEC9] space-y-4">
                  <h3 className="text-xs font-mono uppercase tracking-widest text-brand-text opacity-90 font-bold">Yangi ish joyini qo'shish</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-brand-muted uppercase tracking-widest font-bold">Kompaniya / O'quv markazi nomi</label>
                      <input
                        type="text"
                        placeholder="Masalan: ABC kompaniyasi"
                        value={newWorkplace.company}
                        onChange={(e) => setNewWorkplace((prev) => ({ ...prev, company: e.target.value }))}
                        className="w-full px-3 py-2 bg-brand-card border border-[#E5DEC9] rounded-xl text-xs focus:outline-none focus:border-brand-primary text-brand-text"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-brand-muted uppercase tracking-widest font-bold">Lavozimingiz (Role)</label>
                      <input
                        type="text"
                        placeholder="Masalan: Loyiha menejeri"
                        value={newWorkplace.role}
                        onChange={(e) => setNewWorkplace((prev) => ({ ...prev, role: e.target.value }))}
                        className="w-full px-3 py-2 bg-brand-card border border-[#E5DEC9] rounded-xl text-xs focus:outline-none focus:border-brand-primary text-brand-text"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-brand-muted uppercase tracking-widest font-bold">Ishlagan davringiz (Duration)</label>
                      <input
                        type="text"
                        placeholder="Masalan: 3 yildan beri yoki 2021-2024"
                        value={newWorkplace.duration}
                        onChange={(e) => setNewWorkplace((prev) => ({ ...prev, duration: e.target.value }))}
                        className="w-full px-3 py-2 bg-brand-card border border-[#E5DEC9] rounded-xl text-xs focus:outline-none focus:border-brand-primary text-brand-text"
                      />
                    </div>

                    {/* Workplace logo uploader */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-brand-muted uppercase tracking-widest font-bold">Tashkilot logotipi / rasm</label>
                      <div className="flex items-center gap-2">
                        <label className="flex items-center gap-1.5 px-3 py-2 bg-brand-card border border-[#E5DEC9] rounded-xl text-[10px] uppercase tracking-wider font-bold text-brand-text opacity-90 cursor-pointer hover:bg-white/40">
                          <Upload className="w-3.5 h-3.5 text-brand-primary" />
                          Rasm tanlash
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) =>
                              handleFileUpload(e, "workplaceImage", (url) =>
                                setNewWorkplace((prev) => ({ ...prev, imageUrl: url }))
                              )
                            }
                          />
                        </label>
                        {isUploading["workplaceImage"] && <span className="text-[10px] font-mono text-brand-primary animate-pulse">Yuklanmoqda...</span>}
                        {newWorkplace.imageUrl && (
                          <img src={newWorkplace.imageUrl} className="w-8 h-8 rounded-lg object-cover border border-[#E5DEC9]" alt="" />
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-brand-muted uppercase tracking-widest font-bold">Tafsilotlar (Siz erishgan yutuqlar, olib borgan loyihalaringiz)</label>
                    <textarea
                      placeholder="Masalan: Ushbu joyda erishgan asosiy natijalaringiz va mas'uliyatlaringiz..."
                      rows={3}
                      value={newWorkplace.description}
                      onChange={(e) => setNewWorkplace((prev) => ({ ...prev, description: e.target.value }))}
                      className="w-full px-3 py-2 bg-brand-card border border-[#E5DEC9] rounded-xl text-xs focus:outline-none focus:border-brand-primary text-brand-text resize-none"
                    />
                  </div>

                  <button
                    onClick={handleAddWorkplace}
                    disabled={isSaving}
                    className="px-4 py-2.5 rounded-full bg-brand-primary hover:bg-brand-primary-dark text-white font-bold text-[10px] uppercase tracking-widest transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Ish joyini qo'shish
                  </button>
                </div>

                {/* Workplaces current list */}
                <div className="space-y-4">
                  <h3 className="text-xs font-mono uppercase tracking-widest text-brand-text opacity-90 font-bold">Mavjud ish joylari</h3>
                  <div className="space-y-3">
                    {workplaces.map((work) => (
                      <div key={work.id} className="p-5 rounded-2xl bg-brand-bg border border-[#E5DEC9] flex items-start justify-between gap-4 hover:border-brand-primary/20 transition-all shadow-sm">
                        <div className="flex gap-4">
                          {work.imageUrl && (
                            <img
                              src={work.imageUrl}
                              alt=""
                              className="w-12 h-12 rounded-xl object-cover border border-[#E5DEC9] bg-white shrink-0"
                              referrerPolicy="no-referrer"
                            />
                          )}
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-[10px] text-brand-primary font-mono font-bold bg-brand-primary/10 border border-brand-primary/15 px-2.5 py-1 rounded-full uppercase tracking-widest">
                                {work.duration}
                              </span>
                            </div>
                            <h4 className="font-serif text-base font-bold text-brand-text font-bold mt-2">{work.company}</h4>
                            <p className="text-xs text-brand-red font-bold mt-0.5">{work.role}</p>
                            {work.description && <p className="text-xs text-brand-muted mt-2 leading-relaxed">{work.description}</p>}
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteWorkplace(work.id)}
                          className="p-1.5 rounded-full text-brand-red hover:bg-brand-red/10 cursor-pointer flex-shrink-0 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    {workplaces.length === 0 && (
                      <div className="text-center py-8 text-brand-muted text-sm font-medium">Hali ish joyi kiritilmagan.</div>
                    )}
                  </div>
                </div>

              </div>
            )}

            {/* TABS: EDUCATION TIMELINE MANAGER */}
            {activeTab === "education" && (
              <div className="space-y-8">
                <div className="border-b border-[#E5DEC9] pb-4">
                  <h2 className="text-lg font-serif font-bold text-brand-text font-bold">Ta'lim tarixi</h2>
                  <p className="text-xs text-brand-muted mt-0.5">Universitetlar, litseylar hamda grant yutib o'qigan markazlaringiz.</p>
                </div>

                {/* Add new education */}
                <div className="p-5 rounded-2xl bg-brand-bg border border-[#E5DEC9] space-y-4">
                  <h3 className="text-xs font-mono uppercase tracking-widest text-brand-text opacity-90 font-bold">Yangi ta'lim muassasasini qo'shish</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-brand-muted uppercase tracking-widest font-bold">O'quv maskani nomi</label>
                      <input
                        type="text"
                        placeholder="Masalan: NAMDU"
                        value={newEdu.institution}
                        onChange={(e) => setNewEdu((prev) => ({ ...prev, institution: e.target.value }))}
                        className="w-full px-3 py-2 bg-brand-card border border-[#E5DEC9] rounded-xl text-xs focus:outline-none focus:border-brand-primary text-brand-text"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-brand-muted uppercase tracking-widest font-bold">Yo'nalish / Mutaxassislik</label>
                      <input
                        type="text"
                        placeholder="Masalan: Fizika yo'nalishi"
                        value={newEdu.degree}
                        onChange={(e) => setNewEdu((prev) => ({ ...prev, degree: e.target.value }))}
                        className="w-full px-3 py-2 bg-brand-card border border-[#E5DEC9] rounded-xl text-xs focus:outline-none focus:border-brand-primary text-brand-text"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-brand-muted uppercase tracking-widest font-bold">Boshlangan yili</label>
                      <input
                        type="text"
                        placeholder="Masalan: 2021"
                        value={newEdu.startYear}
                        onChange={(e) => setNewEdu((prev) => ({ ...prev, startYear: e.target.value }))}
                        className="w-full px-3 py-2 bg-brand-card border border-[#E5DEC9] rounded-xl text-xs focus:outline-none focus:border-brand-primary text-brand-text"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-brand-muted uppercase tracking-widest font-bold">Tugallangan yili</label>
                      <input
                        type="text"
                        placeholder="Masalan: 2025"
                        disabled={newEdu.current}
                        value={newEdu.endYear}
                        onChange={(e) => setNewEdu((prev) => ({ ...prev, endYear: e.target.value }))}
                        className="w-full px-3 py-2 bg-brand-card border border-[#E5DEC9] rounded-xl text-xs focus:outline-none focus:border-brand-primary text-brand-text disabled:opacity-45"
                      />
                    </div>
                    <div className="flex items-center gap-2 pt-6">
                      <input
                        type="checkbox"
                        id="currentEdu"
                        checked={newEdu.current}
                        onChange={(e) => setNewEdu((prev) => ({ ...prev, current: e.target.checked, endYear: e.target.checked ? "" : prev.endYear }))}
                        className="accent-brand-green"
                      />
                      <label htmlFor="currentEdu" className="text-xs text-brand-text opacity-90 font-bold cursor-pointer">Hozir o'qiyman</label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-brand-muted uppercase tracking-widest font-bold">Tafsilotlar (Qisqacha tavsif)</label>
                    <textarea
                      placeholder="Tafsilotlar..."
                      rows={2}
                      value={newEdu.description}
                      onChange={(e) => setNewEdu((prev) => ({ ...prev, description: e.target.value }))}
                      className="w-full px-3 py-2 bg-brand-card border border-[#E5DEC9] rounded-xl text-xs focus:outline-none focus:border-brand-primary text-brand-text resize-none"
                    />
                  </div>

                  <button
                    onClick={handleAddEdu}
                    disabled={isSaving}
                    className="px-4 py-2.5 rounded-full bg-brand-primary hover:bg-brand-primary-dark text-white font-bold text-[10px] uppercase tracking-widest transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Malakani qo'shish
                  </button>
                </div>

                {/* Educations current list */}
                <div className="space-y-4">
                  <h3 className="text-xs font-mono uppercase tracking-widest text-brand-text opacity-90 font-bold">Mavjud ta'lim tarixi</h3>
                  <div className="space-y-3">
                    {education.map((edu) => (
                      <div key={edu.id} className="p-5 rounded-2xl bg-brand-bg border border-[#E5DEC9] flex items-start justify-between gap-4 hover:border-brand-primary/20 transition-all shadow-sm">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-brand-primary font-mono font-bold bg-brand-primary/10 border border-brand-primary/15 px-2.5 py-1 rounded-full uppercase tracking-widest">
                              {edu.startYear} — {edu.current ? "Hozirgacha" : edu.endYear}
                            </span>
                          </div>
                          <h4 className="font-serif text-base font-bold text-brand-text font-bold mt-2.5">{edu.institution}</h4>
                          <p className="text-xs text-brand-red font-bold mt-0.5">{edu.degree}</p>
                          {edu.description && <p className="text-xs text-brand-muted mt-2 leading-relaxed">{edu.description}</p>}
                        </div>
                        <button
                          onClick={() => handleDeleteEdu(edu.id)}
                          className="p-1.5 rounded-full text-brand-red hover:bg-brand-red/10 cursor-pointer flex-shrink-0 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    {education.length === 0 && (
                      <div className="text-center py-8 text-brand-muted text-sm font-medium">Hali o'quv yurtlari qo'shilmagan.</div>
                    )}
                  </div>
                </div>

              </div>
            )}

            {/* TABS: PROJECTS UPLOADER */}
            {activeTab === "projects" && (
              <div className="space-y-8">
                <div className="border-b border-[#E5DEC9] pb-4">
                  <h2 className="text-lg font-serif font-bold text-brand-text font-bold">Loyihalarni joylash va boshqarish</h2>
                  <p className="text-xs text-brand-muted mt-0.5">Arduino robotlar, veb-ilova va bot namunalarini bir necha soniyada platformaga yuklang.</p>
                </div>

                {/* Add new project uploader card */}
                <div className="p-5 rounded-2xl bg-brand-bg border border-[#E5DEC9] space-y-4">
                  <h3 className="text-xs font-mono uppercase tracking-widest text-brand-text opacity-90 font-bold">Yangi loyiha yuklash</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-brand-muted uppercase tracking-widest font-bold">Loyiha sarlavhasi *</label>
                      <input
                        type="text"
                        placeholder="Masalan: Loyiha nomi"
                        value={newProj.title}
                        onChange={(e) => setNewProj((prev) => ({ ...prev, title: e.target.value }))}
                        className="w-full px-3 py-2 bg-brand-card border border-[#E5DEC9] rounded-xl text-xs focus:outline-none focus:border-brand-primary text-brand-text"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-brand-muted uppercase tracking-widest font-bold">Yuklangan sanasi *</label>
                      <input
                        type="month"
                        value={newProj.date}
                        onChange={(e) => setNewProj((prev) => ({ ...prev, date: e.target.value }))}
                        className="w-full px-3 py-2 bg-brand-card border border-[#E5DEC9] rounded-xl text-xs focus:outline-none focus:border-brand-primary text-brand-text font-bold"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-brand-muted uppercase tracking-widest font-bold">Tavsif (Loyiha nimalardan iborat) *</label>
                    <textarea
                      placeholder="Loyiha nimadan iborat, qanday muammoni hal qildi, qanday natijaga erishildi — batafsil yozing..."
                      rows={3}
                      value={newProj.description}
                      onChange={(e) => setNewProj((prev) => ({ ...prev, description: e.target.value }))}
                      className="w-full px-3 py-2 bg-brand-card border border-[#E5DEC9] rounded-xl text-xs focus:outline-none focus:border-brand-primary text-brand-text resize-none"
                    />
                  </div>

                  {/* Multi-Image and Video Fast Uploaders */}
                  <div className="p-5 rounded-2xl bg-brand-card border border-[#E5DEC9] space-y-4">
                    
                    {/* Multi image uploader */}
                    <div className="space-y-3">
                      <span className="text-[10px] font-mono text-brand-primary uppercase tracking-widest font-bold block">
                        Loyiha rasmlari (Slideshow uchun maksimal 4 ta rasm)
                      </span>
                      
                      <div className="flex items-center gap-3 flex-wrap">
                        <label className="flex items-center gap-1 px-3 py-2 bg-brand-bg border border-[#E5DEC9] rounded-xl text-[10px] uppercase tracking-wider font-bold text-brand-text opacity-90 cursor-pointer hover:bg-white/40">
                          <Upload className="w-3.5 h-3.5 text-brand-primary" />
                          Rasm qo'shish ({newProjImages.length}/4)
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            disabled={newProjImages.length >= 4}
                            onChange={(e) =>
                              handleFileUpload(e, "project_multi_image", (url) =>
                                handleAddProjectImage(url)
                              )
                            }
                          />
                        </label>
                        {isUploading["project_multi_image"] && <span className="text-[10px] font-mono text-brand-primary animate-pulse">Yuklanmoqda...</span>}
                      </div>

                      {/* Preview thumbnails */}
                      {newProjImages.length > 0 && (
                        <div className="grid grid-cols-4 gap-3 pt-2">
                          {newProjImages.map((imgUrl, idx) => (
                            <div key={idx} className="relative aspect-video rounded-lg border border-[#E5DEC9] overflow-hidden bg-brand-bg">
                              <img src={imgUrl} className="w-full h-full object-cover" alt="" />
                              <button
                                type="button"
                                onClick={() => handleRemoveProjectImage(idx)}
                                className="absolute top-1 right-1 w-5 h-5 bg-brand-red text-white text-[10px] flex items-center justify-center rounded-full hover:bg-brand-red-light transition-colors shadow"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-[#E5DEC9] pt-4">
                      {/* Video link */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-mono text-brand-muted uppercase tracking-widest font-bold">Video havola (.mp4)</label>
                        <div className="flex items-center gap-2">
                          <label className="flex items-center gap-1 px-3 py-2 bg-brand-bg border border-[#E5DEC9] rounded-xl text-[10px] uppercase tracking-wider font-bold text-brand-text opacity-90 cursor-pointer hover:bg-white/40 shrink-0">
                            <Upload className="w-3.5 h-3.5 text-brand-primary" />
                            Video yuklash
                            <input
                              type="file"
                              accept="video/*"
                              className="hidden"
                              onChange={(e) =>
                                handleFileUpload(e, "videoUrl", (url) =>
                                  setNewProj((prev) => ({ ...prev, videoUrl: url }))
                                )
                              }
                            />
                          </label>
                          {isUploading["videoUrl"] && <span className="text-[10px] font-mono text-brand-primary animate-pulse">Yuklanmoqda...</span>}
                        </div>
                        {newProj.videoUrl && (
                          <input
                            type="text"
                            readOnly
                            value={newProj.videoUrl}
                            className="w-full px-2.5 py-1.5 bg-brand-bg border border-[#E5DEC9] rounded-xl text-[9px] font-mono text-brand-muted"
                          />
                        )}
                      </div>

                      {/* Live Url */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-mono text-brand-muted uppercase tracking-widest font-bold">Veb-sayt URL havolasi</label>
                        <input
                          type="text"
                          placeholder="https://loyiha-manzili.uz"
                          value={newProj.liveUrl}
                          onChange={(e) => setNewProj((prev) => ({ ...prev, liveUrl: e.target.value }))}
                          className="w-full px-3 py-2 bg-brand-bg border border-[#E5DEC9] rounded-xl text-xs focus:outline-none focus:border-brand-primary text-brand-text font-medium"
                        />
                      </div>
                    </div>

                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-brand-muted uppercase tracking-widest font-bold">Teglar / Texnologiyalar (Vergul bilan ajrating)</label>
                    <input
                      type="text"
                      placeholder="Vergul bilan ajratilgan teglar, masalan: Dizayn, 2024, Mijoz loyihasi"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      className="w-full px-3 py-2 bg-brand-card border border-[#E5DEC9] rounded-xl text-xs focus:outline-none focus:border-brand-primary text-brand-text"
                    />
                  </div>

                  <button
                    onClick={handleAddProject}
                    disabled={isSaving}
                    className="px-4 py-2.5 rounded-full bg-brand-primary hover:bg-brand-primary-dark text-white font-bold text-[10px] uppercase tracking-widest transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Loyihani yuklash
                  </button>
                </div>

                {/* Saved projects management list */}
                <div className="space-y-4">
                  <h3 className="text-xs font-mono uppercase tracking-widest text-brand-text opacity-90 font-bold">Saytdagi loyihalar</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {projects.map((proj) => (
                      <div key={proj.id} className="p-4 rounded-2xl bg-brand-bg border border-[#E5DEC9] flex flex-col justify-between hover:border-brand-primary/20 transition-all shadow-sm">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] font-mono text-brand-muted uppercase tracking-wider">{proj.date}</span>
                            <button
                              onClick={() => handleDeleteProject(proj.id)}
                              className="p-1 rounded-full text-brand-red hover:bg-brand-red/10 cursor-pointer transition-colors"
                              title="Loyihani o'chirish"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          
                          {proj.imageUrl && (
                            <img
                              src={proj.imageUrl}
                              alt=""
                              className="w-full aspect-video object-cover rounded-xl bg-slate-100 border border-[#E5DEC9]"
                              referrerPolicy="no-referrer"
                            />
                          )}

                          <h4 className="font-serif text-base font-bold text-brand-text font-bold mt-2.5">{proj.title}</h4>
                          <p className="text-xs text-brand-muted line-clamp-2 leading-relaxed">{proj.description}</p>
                          {proj.imageUrls && proj.imageUrls.length > 0 && (
                            <div className="text-[9px] font-mono text-brand-primary bg-brand-primary/5 border border-brand-primary/10 px-2 py-0.5 rounded-full inline-block font-bold">
                              Slideshow: {proj.imageUrls.length} ta rasm yuklangan
                            </div>
                          )}
                        </div>
                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#E5DEC9] text-[9px] font-mono">
                          <span className="text-brand-muted truncate max-w-[120px] uppercase tracking-wider font-bold">{proj.tags.join(", ")}</span>
                          {proj.liveUrl && (
                            <a href={proj.liveUrl} target="_blank" rel="noreferrer" className="text-brand-primary hover:text-brand-primary-dark flex items-center gap-0.5 font-bold">
                              Ko'rish <LinkIcon className="w-2.5 h-2.5" />
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                    {projects.length === 0 && (
                      <div className="text-center py-12 text-brand-muted text-sm col-span-full">Portfolioda hali loyihalar kiritilmagan.</div>
                    )}
                  </div>
                </div>

              </div>
            )}

            {/* TABS: ACHIEVEMENTS (YUTUQLAR) */}
            {activeTab === "achievements" && (
              <div className="space-y-8">
                <div className="border-b border-[#E5DEC9] pb-4">
                  <h2 className="text-lg font-serif font-bold text-brand-text font-bold">Yutuqlar va Sertifikatlar</h2>
                  <p className="text-xs text-brand-muted mt-0.5">Xakatonda olgan 1-o'riningiz, transformer grandlari yoki talabalaringiz yutuqlari.</p>
                </div>

                {/* Add new achievement */}
                <div className="p-5 rounded-2xl bg-brand-bg border border-[#E5DEC9] space-y-4">
                  <h3 className="text-xs font-mono uppercase tracking-widest text-brand-text opacity-90 font-bold">Yangi yutuq / Grand qo'shish</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-brand-muted uppercase tracking-widest font-bold">Sarlavha</label>
                      <input
                        type="text"
                        placeholder="Masalan: Hakaton 1-o'rin sohibi"
                        value={newAchievement.title}
                        onChange={(e) => setNewAchievement((prev) => ({ ...prev, title: e.target.value }))}
                        className="w-full px-3 py-2 bg-brand-card border border-[#E5DEC9] rounded-xl text-xs focus:outline-none focus:border-brand-primary text-brand-text"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-brand-muted uppercase tracking-widest font-bold">Sana / Yil</label>
                      <input
                        type="text"
                        placeholder="Masalan: 2024-yil"
                        value={newAchievement.date || ""}
                        onChange={(e) => setNewAchievement((prev) => ({ ...prev, date: e.target.value }))}
                        className="w-full px-3 py-2 bg-brand-card border border-[#E5DEC9] rounded-xl text-xs focus:outline-none focus:border-brand-primary text-brand-text"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-brand-muted uppercase tracking-widest font-bold">Yutuq tavsifi (Batafsil)</label>
                    <textarea
                      placeholder="Algorithm o'quv markazida o'tkazilgan hakatonda g'olib bo'ldim va bepul ta'lim oldim..."
                      rows={3}
                      value={newAchievement.description}
                      onChange={(e) => setNewAchievement((prev) => ({ ...prev, description: e.target.value }))}
                      className="w-full px-3 py-2 bg-brand-card border border-[#E5DEC9] rounded-xl text-xs focus:outline-none focus:border-brand-primary text-brand-text resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-brand-muted uppercase tracking-widest font-bold">Sertifikat / Yutuq rasmi (Ixtiyoriy)</label>
                    <div className="flex items-center gap-3 flex-wrap">
                      <label className="flex items-center gap-2 px-4 py-2 bg-brand-bg border border-[#E5DEC9] rounded-xl text-[10px] uppercase tracking-wider font-bold text-brand-text opacity-90 cursor-pointer hover:bg-white/40">
                        <Upload className="w-3.5 h-3.5 text-brand-primary" />
                        Yuklash
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) =>
                            handleFileUpload(e, "achievement_image", (url) =>
                              setNewAchievement((prev) => ({ ...prev, imageUrl: url }))
                            )
                          }
                        />
                      </label>
                      {isUploading["achievement_image"] && <span className="text-[10px] font-mono text-brand-primary animate-pulse">Yuklanmoqda...</span>}
                      {newAchievement.imageUrl && (
                        <div className="relative w-24 aspect-video rounded-lg border border-[#E5DEC9] overflow-hidden bg-brand-bg">
                          <img src={newAchievement.imageUrl} className="w-full h-full object-cover" alt="" />
                          <button
                            type="button"
                            onClick={() => setNewAchievement((prev) => ({ ...prev, imageUrl: "" }))}
                            className="absolute inset-0 bg-black/50 text-white text-[9px] font-bold flex items-center justify-center hover:bg-black/70 transition-colors"
                          >
                            O'chirish
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={handleAddAchievement}
                    disabled={isSaving}
                    className="px-4 py-2.5 rounded-full bg-brand-primary hover:bg-brand-primary-dark text-white font-bold text-[10px] uppercase tracking-widest transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Yutuqni qo'shish
                  </button>
                </div>

                {/* Achievements current list */}
                <div className="space-y-4">
                  <h3 className="text-xs font-mono uppercase tracking-widest text-brand-text opacity-90 font-bold">Kiritilgan yutuqlar</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {achievements.map((ach) => (
                      <div key={ach.id} className="p-5 rounded-2xl bg-brand-bg border border-[#E5DEC9] flex flex-col justify-between gap-4 hover:border-brand-primary/20 transition-all shadow-sm">
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] text-brand-primary font-mono font-bold bg-brand-primary/10 border border-brand-primary/15 px-2.5 py-1 rounded-full">
                              {ach.date || "Yaqinda"}
                            </span>
                            <button
                              onClick={() => handleDeleteAchievement(ach.id)}
                              className="p-1.5 rounded-full text-brand-red hover:bg-brand-red/10 cursor-pointer transition-all shrink-0"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          
                          {ach.imageUrl && (
                            <div className="mt-3 aspect-video rounded-xl overflow-hidden border border-[#E5DEC9] bg-brand-card">
                              <img src={ach.imageUrl} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
                            </div>
                          )}

                          <h4 className="font-serif text-base font-bold text-brand-text font-bold mt-2.5">{ach.title}</h4>
                          <p className="text-xs text-brand-muted mt-2 leading-relaxed">{ach.description}</p>
                        </div>
                      </div>
                    ))}
                    {achievements.length === 0 && (
                      <div className="text-center py-8 text-brand-muted text-sm col-span-full font-medium">Hali yutuqlar kiritilmagan.</div>
                    )}
                  </div>
                </div>

              </div>
            )}

            {/* TABS: VISITOR MESSAGES */}
            {activeTab === "messages" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-[#E5DEC9] pb-4">
                  <div>
                    <h2 className="text-lg font-serif font-bold text-brand-text font-bold">Mijozlardan kelgan xabarlar</h2>
                    <p className="text-xs text-brand-muted mt-0.5">Mijozlar tomonidan qoldirilgan barcha xabarlar shu yerda to'planadi.</p>
                  </div>
                  <button
                    onClick={loadMessages}
                    className="px-4 py-2 rounded-full bg-brand-bg border border-[#E5DEC9] hover:bg-white/40 text-[10px] font-mono font-bold uppercase tracking-wider text-brand-text opacity-90 transition-all"
                  >
                    Yangilash
                  </button>
                </div>

                {isLoadingMessages ? (
                  <div className="text-center py-12 font-mono text-xs text-brand-primary animate-pulse font-bold">
                    Yuklanmoqda...
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`p-5 rounded-2xl border flex flex-col justify-between gap-4 transition-all ${
                          msg.read
                            ? "bg-brand-bg border-[#E5DEC9] text-brand-muted"
                            : "bg-white border-brand-primary/30 text-brand-text shadow-sm"
                        }`}
                      >
                        <div className="space-y-3">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              {!msg.read && (
                                <span className="w-2.5 h-2.5 rounded-full bg-brand-primary animate-pulse" title="Yangi xabar" />
                              )}
                              <h4 className="font-serif font-bold text-brand-text font-bold">{msg.name}</h4>
                            </div>
                            
                            {/* Timestamp */}
                            <span className="text-[10px] font-mono text-brand-muted flex items-center gap-1 font-bold">
                              <Clock className="w-3.5 h-3.5" />
                              {new Date(msg.date).toLocaleString("uz-UZ")}
                            </span>
                          </div>

                          <p className="text-xs bg-brand-bg p-4 rounded-xl border border-[#E5DEC9] text-brand-text opacity-90 whitespace-pre-wrap leading-relaxed font-medium">
                            {msg.message}
                          </p>

                          {/* Contact Channels */}
                          <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono text-brand-muted pt-1 font-bold">
                            {msg.email && (
                              <span className="flex items-center gap-1 bg-brand-bg px-2 py-0.5 rounded-md border border-[#E5DEC9]">
                                <Mail className="w-3.5 h-3.5 text-brand-muted" />
                                {msg.email}
                              </span>
                            )}
                            {msg.phone && (
                              <span className="flex items-center gap-1 bg-brand-bg px-2 py-0.5 rounded-md border border-[#E5DEC9]">
                                <Phone className="w-3.5 h-3.5 text-brand-muted" />
                                {msg.phone}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-end gap-2 border-t border-[#E5DEC9] pt-3">
                          {!msg.read && (
                            <button
                              onClick={() => handleMarkAsRead(msg.id)}
                              className="px-3.5 py-2 rounded-full bg-brand-primary hover:bg-brand-primary-dark text-white text-[10px] font-mono uppercase tracking-wider font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-sm"
                            >
                              <Check className="w-3.5 h-3.5" />
                              O'qildi deb belgilash
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteMessage(msg.id)}
                            className="p-2 rounded-full bg-brand-card hover:bg-brand-red/10 text-brand-red text-xs cursor-pointer transition-colors border border-[#E5DEC9]"
                            title="Xabarni o'chirish"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                    {messages.length === 0 && (
                      <div className="text-center py-12 text-brand-muted text-sm font-medium">Hali hech qanday xabarlar kelmagan.</div>
                    )}
                  </div>
                )}
              </div>
            )}

              </motion.div>
            </AnimatePresence>
          </div>

        </div>

      </div>
    </div>
  );
}
