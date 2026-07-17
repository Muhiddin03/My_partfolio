# Shaxsiy Portfolio + Admin Panel

Bu — istalgan kasb egasi uchun mos, to'liq ishlaydigan shaxsiy portfolio sayti. Saytning barcha matnlari, rasmlari, ko'nikmalari, loyihalari, xizmatlari va ta'lim/tajriba ma'lumotlari **kod ichiga yozilmagan** — ular Admin panel orqali istalgan vaqtda o'zgartiriladi. Shu sababli sayt nafaqat dasturchi yoki IT mutaxassisi, balki dizayner, o'qituvchi, shifokor, huquqshunos, oshpaz, fotograf — har qanday kasb egasi uchun ham bab-baravar mos keladi.

## 1. Loyihani kompyuteringizda ishga tushirish

**Kerakli dastur:** Node.js (18 yoki undan yuqori versiya). Yuklab olish: https://nodejs.org

1. Loyiha papkasini oching va terminalda quyidagi buyruqni bering (kutubxonalarni o'rnatish uchun, faqat bir marta kerak):
   ```
   npm install
   ```
2. `.env.example` faylidan nusxa olib, `.env` nomli fayl yarating va ichidagi `ADMIN_PASSWORD` qiymatini o'zingiz xohlagan parolga o'zgartiring (standart holatda parol `admin123`).
3. Saytni ishga tushiring:
   ```
   npm run dev
   ```
4. Brauzeringizda quyidagi manzilni oching: **http://localhost:3000**

Sayt ma'lumotlari `data/portfolio.json` faylida, kelgan xabarlar esa `data/messages.json` faylida saqlanadi — bular oddiy matn fayllar, alohida bazaga ehtiyoj yo'q.

## 2. Ma'lumotlarni qanday to'ldirish / o'zgartirish kerak (Admin panel)

Saytning **pastki o'ng burchagida** kichkina "Admin Panel" tugmasi bor — shu yerdan kirasiz. (Mobil qurilmada sayt nomiga/logotipiga ketma-ket 3 marta bosish orqali ham ochish mumkin.)

Birinchi marta kirganda parolni so'raydi — bu `.env` faylida (yoki serverdagi `ADMIN_PASSWORD`da) ko'rsatgan parolingiz.

Admin panel ichida quyidagi bo'limlarni to'ldirasiz — **hech qanday dasturlash bilimi shart emas**:

| Bo'lim | Nima uchun |
|---|---|
| **Profil** | Ism, kasbingiz nomi (masalan "Shifokor", "Dizayner", "Advokat"), o'zingiz haqingizda matn, rasm (avatar), telefon, email, ijtimoiy tarmoqlar |
| **Xizmatlar** | Siz taklif qiladigan xizmatlar ro'yxati (nomi, tavsifi, ikonka) |
| **Ko'nikmalar** | Bilim va ko'nikmalaringiz, foiz darajasi bilan. Turkum nomini o'zingiz xohlagancha yozishingiz mumkin (masalan "Dizayn", "Tibbiyot", "Tillar" va h.k.) |
| **Loyihalar** | Ishlaringiz namunalari — rasm(lar), video, tavsif, havola |
| **Tajriba (ish joylari)** | Qayerda ishlaganingiz, lavozimingiz, muddat |
| **Ta'lim** | O'qigan joylaringiz, darajangiz |
| **Yutuqlar** | Sertifikat, mukofot va boshqa yutuqlar |
| **Xabarlar** | "Bog'lanish" formasi orqali kelgan xabarlarni shu yerdan ko'rasiz |

Har qanday o'zgarish "Saqlash" tugmasi bosilgach darhol saytda ko'rinadi.

## 3. Rang va dizaynni o'zgartirish

Saytning barcha ranglari **bitta joyda** — `src/index.css` faylining boshida — belgilangan:

```css
--color-brand-green: #0f6e5c;       /* asosiy rang */
--color-brand-green-light: #14a085; /* asosiy rangning ochroq varianti (hover holatlar uchun) */
--color-brand-red: #c2743a;         /* ikkinchi (urg'u) rang */
--color-brand-cream: #faf8f4;       /* fon rangi */
```

Shu qiymatlarni (masalan boshqa HEX kod bilan) almashtirsangiz, butun sayt — tugmalar, chiziqlar, matnlar, soyalar — avtomatik yangi rangga o'tadi. Boshqa hech qayerda rang o'zgartirishga hojat yo'q.

## 4. Saytni internetga chiqarish (deploy)

Loyihani ishlab chiqarish (production) uchun tayyorlash:
```
npm run build
npm run start
```
Bu buyruqlar saytni optimallashtirib, 3000-portda ishga tushiradi. Keyin uni istalgan server (VPS, Render, Railway va h.k.)da joylashtirishingiz mumkin. Deploy qilishda `ADMIN_PASSWORD` muhit o'zgaruvchisini albatta o'rnating, aks holda standart parol ishlatiladi.

## 5. Muhim eslatmalar

- Rasm va videolarni Admin panel orqali yuklaganingizda ular `public/uploads` papkasida saqlanadi.
- Parolni hech kimga bermang va standart `admin123` parolini albatta o'zgartiring.
- Ma'lumotlar `data/portfolio.json` faylida saqlangani uchun, saytni ko'chirishdan oldin shu faylning zaxira nusxasini olib qo'yish tavsiya etiladi.
