var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_fs = __toESM(require("fs"), 1);
var import_vite = require("vite");
var import_dotenv = __toESM(require("dotenv"), 1);
import_dotenv.default.config();
var app = (0, import_express.default)();
var PORT = 3e3;
app.use(import_express.default.json({ limit: "100mb" }));
app.use(import_express.default.urlencoded({ limit: "100mb", extended: true }));
var DATA_DIR = import_path.default.join(process.cwd(), "data");
var PORTFOLIO_PATH = import_path.default.join(DATA_DIR, "portfolio.json");
var MESSAGES_PATH = import_path.default.join(DATA_DIR, "messages.json");
var UPLOADS_DIR = import_path.default.join(process.cwd(), "public", "uploads");
if (!import_fs.default.existsSync(DATA_DIR)) {
  import_fs.default.mkdirSync(DATA_DIR, { recursive: true });
}
if (!import_fs.default.existsSync(UPLOADS_DIR)) {
  import_fs.default.mkdirSync(UPLOADS_DIR, { recursive: true });
}
app.use("/uploads", import_express.default.static(UPLOADS_DIR));
var getAdminPassword = () => {
  return process.env.ADMIN_PASSWORD || "admin123";
};
var authenticateAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ error: "Ruxsat etilmadi: Token topilmadi." });
    return;
  }
  const token = authHeader.replace("Bearer ", "");
  if (token === getAdminPassword()) {
    next();
  } else {
    res.status(403).json({ error: "Ruxsat etilmadi: Noto'g'ri parol." });
  }
};
app.get("/api/portfolio", (req, res) => {
  try {
    if (import_fs.default.existsSync(PORTFOLIO_PATH)) {
      const data = import_fs.default.readFileSync(PORTFOLIO_PATH, "utf-8");
      res.json(JSON.parse(data));
    } else {
      res.status(404).json({ error: "Portfolio ma'lumotlari topilmadi." });
    }
  } catch (error) {
    console.error("GET /api/portfolio xatolik:", error);
    res.status(500).json({ error: "Server ichki xatoligi" });
  }
});
app.post("/api/portfolio", authenticateAdmin, (req, res) => {
  try {
    const data = req.body;
    import_fs.default.writeFileSync(PORTFOLIO_PATH, JSON.stringify(data, null, 2), "utf-8");
    res.json({ success: true, message: "Portfolio muvaffaqiyatli yangilandi!" });
  } catch (error) {
    console.error("POST /api/portfolio xatolik:", error);
    res.status(500).json({ error: "Server ichki xatoligi" });
  }
});
app.post("/api/login", (req, res) => {
  try {
    const { password } = req.body;
    if (password === getAdminPassword()) {
      res.json({ success: true, token: password });
    } else {
      res.status(401).json({ success: false, error: "Noto'g'ri parol!" });
    }
  } catch (error) {
    console.error("POST /api/login xatolik:", error);
    res.status(500).json({ error: "Server ichki xatoligi" });
  }
});
app.post("/api/messages", (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    if (!name || !message) {
      res.status(400).json({ error: "Ism va xabar maydonlari to'ldirilishi shart." });
      return;
    }
    let messages = [];
    if (import_fs.default.existsSync(MESSAGES_PATH)) {
      messages = JSON.parse(import_fs.default.readFileSync(MESSAGES_PATH, "utf-8"));
    }
    const newMessage = {
      id: "msg_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9),
      name,
      email: email || "",
      phone: phone || "",
      message,
      date: (/* @__PURE__ */ new Date()).toISOString(),
      read: false
    };
    messages.unshift(newMessage);
    import_fs.default.writeFileSync(MESSAGES_PATH, JSON.stringify(messages, null, 2), "utf-8");
    res.json({ success: true, message: "Xabaringiz muvaffaqiyatli yuborildi!" });
  } catch (error) {
    console.error("POST /api/messages xatolik:", error);
    res.status(500).json({ error: "Xabar yuborishda xatolik yuz berdi." });
  }
});
app.get("/api/messages", authenticateAdmin, (req, res) => {
  try {
    if (import_fs.default.existsSync(MESSAGES_PATH)) {
      const messages = JSON.parse(import_fs.default.readFileSync(MESSAGES_PATH, "utf-8"));
      res.json(messages);
    } else {
      res.json([]);
    }
  } catch (error) {
    console.error("GET /api/messages xatolik:", error);
    res.status(500).json({ error: "Xabarlarni yuklashda xatolik." });
  }
});
app.post("/api/messages/:id/read", authenticateAdmin, (req, res) => {
  try {
    const { id } = req.params;
    if (!import_fs.default.existsSync(MESSAGES_PATH)) {
      res.status(404).json({ error: "Xabarlar topilmadi." });
      return;
    }
    let messages = JSON.parse(import_fs.default.readFileSync(MESSAGES_PATH, "utf-8"));
    messages = messages.map((m) => m.id === id ? { ...m, read: true } : m);
    import_fs.default.writeFileSync(MESSAGES_PATH, JSON.stringify(messages, null, 2), "utf-8");
    res.json({ success: true });
  } catch (error) {
    console.error("POST /api/messages/:id/read xatolik:", error);
    res.status(500).json({ error: "Amalni bajarib bo'lmadi." });
  }
});
app.delete("/api/messages/:id", authenticateAdmin, (req, res) => {
  try {
    const { id } = req.params;
    if (!import_fs.default.existsSync(MESSAGES_PATH)) {
      res.status(404).json({ error: "Xabarlar topilmadi." });
      return;
    }
    let messages = JSON.parse(import_fs.default.readFileSync(MESSAGES_PATH, "utf-8"));
    messages = messages.filter((m) => m.id !== id);
    import_fs.default.writeFileSync(MESSAGES_PATH, JSON.stringify(messages, null, 2), "utf-8");
    res.json({ success: true, message: "Xabar muvaffaqiyatli o'chirildi." });
  } catch (error) {
    console.error("DELETE /api/messages/:id xatolik:", error);
    res.status(500).json({ error: "O'chirishda xatolik." });
  }
});
app.post("/api/upload", authenticateAdmin, (req, res) => {
  try {
    const { fileName, fileType, base64Data } = req.body;
    if (!fileName || !base64Data) {
      res.status(400).json({ error: "Fayl nomi va tarkibi taqdim etilishi shart." });
      return;
    }
    const cleanBase64 = base64Data.replace(/^data:.*?;base64,/, "");
    const buffer = Buffer.from(cleanBase64, "base64");
    const safeName = `${Date.now()}_${fileName.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const filePath = import_path.default.join(UPLOADS_DIR, safeName);
    import_fs.default.writeFileSync(filePath, buffer);
    res.json({ url: `/uploads/${safeName}` });
  } catch (error) {
    console.error("POST /api/upload xatolik:", error);
    res.status(500).json({ error: "Faylni yuklashda xatolik yuz berdi." });
  }
});
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
