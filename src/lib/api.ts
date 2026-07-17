import { PortfolioData, ContactMessage } from "../types";

const API_URL = import.meta.env.VITE_API_URL || "";

export async function fetchPortfolio(): Promise<PortfolioData> {
  const res = await fetch(`${API_URL}/api/portfolio`);
  if (!res.ok) {
    throw new Error("Portfolio ma'lumotlarini yuklab bo'lmadi.");
  }
  return res.json();
}

export async function savePortfolio(data: PortfolioData, token: string): Promise<boolean> {
  const res = await fetch(`${API_URL}/api/portfolio`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Nomalum xatolik" }));
    throw new Error(err.error || "Saqlashda xatolik yuz berdi.");
  }
  return true;
}

export async function loginAdmin(password: string): Promise<string> {
  const res = await fetch(`${API_URL}/api/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ password }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Nomalum xatolik" }));
    throw new Error(err.error || "Parol noto'g'ri!");
  }
  const data = await res.json();
  return data.token;
}

export async function submitMessage(message: {
  name: string;
  email: string;
  phone: string;
  message: string;
}): Promise<boolean> {
  const res = await fetch(`${API_URL}/api/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Nomalum xatolik" }));
    throw new Error(err.error || "Xabar yuborishda xatolik yuz berdi.");
  }
  return true;
}

export async function fetchMessages(token: string): Promise<ContactMessage[]> {
  const res = await fetch(`${API_URL}/api/messages`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    throw new Error("Xabarlarni yuklab bo'lmadi.");
  }
  return res.json();
}

export async function markMessageAsRead(id: string, token: string): Promise<boolean> {
  const res = await fetch(`${API_URL}/api/messages/${id}/read`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.ok;
}

export async function deleteMessage(id: string, token: string): Promise<boolean> {
  const res = await fetch(`${API_URL}/api/messages/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.ok;
}

export async function uploadFile(
  file: File,
  token: string
): Promise<{ url: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      try {
        const base64Data = reader.result as string;
        const res = await fetch(`${API_URL}/api/upload`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            fileName: file.name,
            fileType: file.type,
            base64Data,
          }),
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({ error: "Nomalum xatolik" }));
          throw new Error(err.error || "Fayl yuklashda xatolik.");
        }

        const data = await res.json();
        resolve(data);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = (error) => reject(error);
  });
}
