# LangSphere AI — Administrator & Developer Guide

This guide details administrative tasks, database seeding, content management, environment setup, and system monitoring for **LangSphere AI**.

---

## 🛠️ System Requirements & Prerequisites

- **Node.js**: v18.0.0 or higher
- **Package Manager**: npm v9+
- **Database**: PostgreSQL v14+
- **TypeScript**: v5.0+
- **Prisma CLI**: v7.9.1+

---

## 🗄️ Database Management & Schema Maintenance

LangSphere AI uses **Prisma ORM** with a PostgreSQL database.

### 1. Database Connection String
Configure your PostgreSQL connection in `backend-ts/.env`:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/langsphere_db?schema=public"
JWT_SECRET="your_production_jwt_secret_key"
GEMINI_API_KEY="your_gemini_api_key_here"
PORT=5005
```

### 2. Running Migrations & Syncing Schema
To apply schema changes to PostgreSQL:
```bash
cd backend-ts
npx prisma db push
npx prisma generate
```

### 3. Re-seeding Content
To repopulate default curriculum, stories, roles, and shop rewards:
```bash
cd backend-ts
npx tsx prisma/seed.ts
```

This seeds:
- 4 Languages (`en`, `ta`, `hi`, `te`)
- Courses for Beginner, Intermediate, Advanced levels
- Modules, Topics, Lessons, Exercises, and Quizzes
- 26 Shop Items (Themes, Avatars, Frames, Titles, Boosters, Badges)
- Cultural Stories with pages and translations

---

## 👥 User & Role Administration

LangSphere AI supports role-based access control with `student` and `admin` roles defined in the `Role` table.

### Granting Admin Role to a User
Using Prisma Studio:
```bash
cd backend-ts
npx prisma studio
```
Navigate to the `User` table, select the target user, and set their `roleId` to the `admin` role ID.

---

## 🛍️ Managing Shop Items

Shop items are stored in the `Reward` table:
```prisma
model Reward {
  id          String   @id @default(uuid())
  name        String
  description String
  cost        Int
  category    String   @default("misc") // themes, avatars, frames, titles, boosters, badges
  icon        String?
}
```

To add a new shop item via Prisma Studio or SQL:
```sql
INSERT INTO "Reward" ("id", "name", "description", "cost", "category", "icon", "createdAt")
VALUES (gen_random_uuid(), 'Gold Dragon Avatar', 'Legendary dragon avatar', 500, 'avatars', '🐉', NOW());
```

---

## 🤖 Configuring Gemini AI Credentials

LangSphere AI integrates with Google Gemini AI (`@google/genai`) for AI Tutor, Handwriting evaluation, and Vision OCR.

1. Obtain an API Key from Google AI Studio.
2. Update `backend-ts/.env`:
   ```env
   GEMINI_API_KEY="AIzaSy..."
   ```
3. Restart the backend process:
   ```bash
   pkill -f "tsx src/server.ts"
   npx tsx src/server.ts
   ```

If no key is configured, backend services automatically provide friendly fallback notices without throwing application exceptions.

---

## 📊 System Health Monitoring & Diagnostics

### Health Check Endpoint
```bash
curl http://localhost:5005/health
# Response: {"status":"OK","environment":"development"}
```

### Database Connectivity Check
```bash
npx prisma db execute --stdin <<EOF
SELECT count(*) FROM "User";
EOF
```
