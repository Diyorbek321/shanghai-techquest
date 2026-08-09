import { PrismaClient, Prisma, Track, Role, Difficulty } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { problems as easyA } from './problemsData/easy-a';
import { problems as easyB } from './problemsData/easy-b';
import { problems as easyC } from './problemsData/easy-c';
import { problems as easyD } from './problemsData/easy-d';
import { problems as mediumA } from './problemsData/medium-a';
import { problems as mediumB } from './problemsData/medium-b';
import { problems as mediumC } from './problemsData/medium-c';
import { problems as mediumD } from './problemsData/medium-d';
import { problems as hardA } from './problemsData/hard-a';
import { problems as hardB } from './problemsData/hard-b';
import { problems as hardC } from './problemsData/hard-c';
import { problems as hardD } from './problemsData/hard-d';
import { problems as expertA } from './problemsData/expert-a';
import { problems as expertB } from './problemsData/expert-b';
import { problems as expertC } from './problemsData/expert-c';
import { problems as expertD } from './problemsData/expert-d';
import { problems as masterA } from './problemsData/master-a';
import { problems as masterB } from './problemsData/master-b';
import { problems as masterC } from './problemsData/master-c';
import { backendLessons } from './lessonsData/backend';
import { backendLessonProblems } from './lessonsData/backendProblems';
import { backendLessonQuiz } from './lessonsData/backendQuiz';
import { syncLessonAssignments } from '../src/server/lessons/syncAssignments';
import { DEFAULT_PROJECT_RUBRIC } from '../src/server/lessons/rubric';
import { avatarUrlForEmail } from '../src/server/avatar';

const generatedProblems = [
  ...easyA, ...easyB, ...easyC, ...easyD,
  ...mediumA, ...mediumB, ...mediumC, ...mediumD,
  ...hardA, ...hardB, ...hardC, ...hardD,
  ...expertA, ...expertB, ...expertC, ...expertD,
  ...masterA, ...masterB, ...masterC,
].map((p) => ({ ...p, difficulty: p.difficulty as Difficulty }));

const prisma = new PrismaClient();

const DEMO_PASSWORD = 'password123';

// Real per-module mission content, mirrored 1:1 against the moduleKeys in
// FrontendCourse.tsx / OfficeCourse.tsx / RoboticsLab.tsx so every campaign-path
// node has a real Assignment (instructions + requirements + submission + grading)
// instead of dumping students into an unrelated generic CodeLab.
type FrontendModuleTask = { moduleKey: string; title: string; desc: string; xp: number; kind: 'lesson' | 'boss' };

const FRONTEND_MODULE_TASKS: FrontendModuleTask[] = [
  { moduleKey: 'html-foundations', title: 'HTML Asoslari', desc: "Sahifaning strukturaviy to'rini quring.", xp: 150, kind: 'lesson' },
  { moduleKey: 'css-cyber-styling', title: 'CSS Kiber-Uslub', desc: 'Neon estetika va flex tartiblarni joriy eting.', xp: 200, kind: 'lesson' },
  { moduleKey: 'js-logic-gates', title: 'JS Mantiq Darvozalari', desc: "DOM'ni buzib kiring va interaktivlikni ulang.", xp: 350, kind: 'lesson' },
  { moduleKey: 'boss-responsive-hydra', title: 'BOSS: Moslashuvchan Gidra', desc: "3 ta qurilma o'lchamida joylashuv xatolarini yengib chiqing.", xp: 1000, kind: 'boss' },
  { moduleKey: 'react-components', title: 'React Komponentlari', desc: 'Modulli UI komponentlarini yarating.', xp: 400, kind: 'lesson' },
  { moduleKey: 'react-hooks-state', title: 'React Hooklari va Holat Boshqaruvi', desc: "useState, useEffect va maxsus hooklar bilan dinamik interfeys quring.", xp: 450, kind: 'lesson' },
  { moduleKey: 'typescript-types', title: 'TypeScript Turlar Olami', desc: "Interfeyslar, generiklar va turlar xavfsizligini o'rganing.", xp: 400, kind: 'lesson' },
  { moduleKey: 'git-github-mastery', title: 'Git va GitHub Ustaligi', desc: "Branch, commit va pull request ish jarayonini egallang.", xp: 300, kind: 'lesson' },
  { moduleKey: 'boss-merge-conflict-beast', title: "BOSS: Merge Conflict Yirtqichi", desc: "Murakkab birlashtirish ziddiyatlarini yengib, tarixni saqlab qoling.", xp: 900, kind: 'boss' },
  { moduleKey: 'api-fetch-requests', title: "API va Fetch So'rovlari", desc: "REST API bilan ishlash, async/await va xatoliklarni boshqarish.", xp: 400, kind: 'lesson' },
  { moduleKey: 'tailwind-utility-first', title: 'Tailwind CSS Utility-First Yondashuv', desc: "Tezkor va moslashuvchan uslublashtirish tizimini o'zlashtiring.", xp: 300, kind: 'lesson' },
  { moduleKey: 'react-router-navigation', title: 'React Router Navigatsiyasi', desc: "Ko'p sahifali ilovalar uchun marshrutlashni sozlang.", xp: 350, kind: 'lesson' },
  { moduleKey: 'forms-validation', title: 'Formalar va Validatsiya', desc: "Foydalanuvchi kiritmalarini tekshirish va xatoliklarni ko'rsatish.", xp: 350, kind: 'lesson' },
  { moduleKey: 'boss-form-dragon', title: 'BOSS: Forma Ajdahosi', desc: "Ko'p bosqichli, murakkab validatsiyali formani mag'lub eting.", xp: 1100, kind: 'boss' },
  { moduleKey: 'state-management', title: 'Holatni Global Boshqarish', desc: "Context API va Redux yordamida murakkab holatni boshqaring.", xp: 500, kind: 'lesson' },
  { moduleKey: 'animations-framer-motion', title: 'Animatsiyalar (Framer Motion)', desc: "Silliq o'tishlar va interaktiv animatsiyalar yarating.", xp: 350, kind: 'lesson' },
  { moduleKey: 'web-performance', title: 'Veb Unumdorlikni Optimallashtirish', desc: "Lazy loading, bundle hajmi va renderlash tezligini yaxshilang.", xp: 450, kind: 'lesson' },
  { moduleKey: 'testing-jest-rtl', title: 'Testlash (Jest va RTL)', desc: "Komponentlaringiz uchun ishonchli avtomatik testlar yozing.", xp: 400, kind: 'lesson' },
  { moduleKey: 'boss-deploy-gauntlet', title: "BOSS: Ishga Tushirish Sinovi", desc: "Ilovangizni CI/CD orqali ishlab chiqarish muhitiga xavfsiz chiqaring.", xp: 1200, kind: 'boss' },
  { moduleKey: 'capstone-portfolio', title: 'Yakuniy Loyiha: Portfolio Sayti', desc: "O'rgangan barcha ko'nikmalaringizni birlashtirib, portfolio sayt yarating.", xp: 800, kind: 'lesson' },
];

function frontendTaskDescription(desc: string, kind: 'lesson' | 'boss'): string {
  if (kind === 'boss') {
    return `${desc}\n\nMaqsad: Boss jangi — oldingi bir necha modulda o'rgangan barcha ko'nikmalaringizni birlashtirib, murakkab, ko'p bosqichli muammoni hal qiling.\n\nTalablar:\n- Barcha asosiy stsenariylarni va chekka holatlarni qamrab oling.\n- Kodni tushunarli tuzilishga solib chiqing, konsolda xatolik qoldirmang.\n- Duch kelgan qiyinchilik va uni qanday yechganingizni qisqacha yozing.\n\nTopshirish: GitHub repo havolasi va jonli demo (Vercel/Netlify) havolasi majburiy.`;
  }
  return `${desc}\n\nMaqsad: Ushbu mavzuni amaliyotda qo'llab, kamida bitta ishlaydigan komponent yoki sahifa yarating.\n\nTalablar:\n- Mavzuga oid asosiy texnikalarni real kodda qo'llang.\n- Kodni GitHub repozitoriyga joylashtiring, tushunarli commit tarixini saqlang.\n- README faylida nima qilinganini 3-5 gapda tushuntiring.\n\nTopshirish: GitHub repo havolasini yuboring, ixtiyoriy ravishda jonli demo havolasini ham qo'shishingiz mumkin.`;
}

type OfficeModuleTask = { moduleKey: string; title: string; desc: string; xp: number; kind: 'foundation' | 'word' | 'excel' | 'excel_boss' | 'ppt' | 'outlook' | 'access' | 'capstone' };

const OFFICE_MODULE_TASKS: OfficeModuleTask[] = [
  { moduleKey: 'os-basics', title: 'Kompyuter va Operatsion Tizim Asoslari', desc: "Kompyuterni yoqish, ish stoli, oynalar va asosiy klaviatura/sichqoncha ko'nikmalarini o'rganing.", xp: 100, kind: 'foundation' },
  { moduleKey: 'files-folders', title: 'Fayllar va Papkalar Bilan Ishlash', desc: "Fayl va papkalarni yaratish, nomlash, ko'chirish va arxivlashni mashq qiling.", xp: 100, kind: 'foundation' },
  { moduleKey: 'internet-browser-basics', title: 'Internet va Brauzer Asoslari', desc: "Brauzerda xavfsiz va samarali qidirish, ko'p tab bilan ishlashni o'rganing.", xp: 100, kind: 'foundation' },
  { moduleKey: 'digital-safety', title: 'Raqamli Xavfsizlik va Gigiyena', desc: "Kuchli parollar, fishingni aniqlash va shaxsiy ma'lumotlaringizni himoya qilishni o'rganing.", xp: 120, kind: 'foundation' },
  { moduleKey: 'cloud-storage-basics', title: 'Bulutli Xotira va Fayl Almashish', desc: "Google Drive/OneDrive'da fayl saqlash, yuklash va ulashishni mashq qiling.", xp: 100, kind: 'foundation' },
  { moduleKey: 'word-basics', title: 'Word: Birinchi Hujjat', desc: "Word'ni ochish, matn kiritish, saqlash va asosiy formatlashni o'rganing.", xp: 150, kind: 'word' },
  { moduleKey: 'word-doc-design', title: 'Word: Professional Hujjat Dizayni', desc: "Uslublar, bo'limlar va avtomatik jadvallarni egallang.", xp: 250, kind: 'word' },
  { moduleKey: 'word-long-documents', title: 'Word: Uzun Hujjatlar va Tarkib Jadvali', desc: "Sarlavhalar, havolalar va avtomatik tarkib jadvalini boshqaring.", xp: 350, kind: 'word' },
  { moduleKey: 'word-mail-merge', title: "Word: Pochta Birlashtirish", desc: "Ko'plab hujjatlarni bitta shablondan avtomatik yarating.", xp: 300, kind: 'word' },
  { moduleKey: 'word-collaboration-review', title: "Word: Hamkorlikda Ishlash va Tekshirish", desc: "O'zgarishlarni kuzatish, sharhlar va hamkorlikda tahrirlashni o'zlashtiring.", xp: 300, kind: 'word' },
  { moduleKey: 'excel-basics', title: 'Excel: Birinchi Jadval', desc: "Katakchalar, formulalar (SUM, AVERAGE) va oddiy formatlashdan boshlang.", xp: 150, kind: 'excel' },
  { moduleKey: 'excel-data-mastery', title: "Excel: Ma'lumotlar va Mantiqni Egallash", desc: 'Formulalar, VLOOKUP va mantiqiy funksiyalar.', xp: 400, kind: 'excel' },
  { moduleKey: 'excel-formulas-deep-dive', title: 'Excel: Chuqurlashtirilgan Formulalar', desc: "INDEX/MATCH, massiv formulalar va shartli mantiqni egallang.", xp: 450, kind: 'excel' },
  { moduleKey: 'excel-pivot-charts', title: 'Excel: Pivot Jadvallar va Diagrammalar', desc: "Katta ma'lumotlar to'plamlarini vizual hisobotlarga aylantiring.", xp: 500, kind: 'excel' },
  { moduleKey: 'excel-advanced-analytics', title: "Excel: Ilg'or Ma'lumotlar Tahlili", desc: "Pivot jadvallar, Power Query va boshqaruv panellari.", xp: 600, kind: 'excel_boss' },
  { moduleKey: 'excel-power-query-dashboards', title: "Excel: Power Query va Boshqaruv Panellari", desc: "Turli manbalardagi ma'lumotlarni birlashtirib, jonli panel yarating.", xp: 650, kind: 'excel_boss' },
  { moduleKey: 'excel-macros-automation', title: 'Excel: Makrolar va Avtomatlashtirish', desc: "VBA makrolar yordamida takroriy vazifalarni avtomatlashtiring.", xp: 550, kind: 'excel' },
  { moduleKey: 'ppt-basics', title: 'PowerPoint: Birinchi Slayd', desc: "Birinchi slaydlaringizni yarating: matn, rasm va oddiy dizayn asoslari.", xp: 150, kind: 'ppt' },
  { moduleKey: 'ppt-narrative-design', title: 'PowerPoint: Naratsiya va Dizayn', desc: "Yuqori ta'sirli rahbariyat taqdimotlarini yarating.", xp: 300, kind: 'ppt' },
  { moduleKey: 'ppt-animations-transitions', title: "PowerPoint: Animatsiya va O'tishlar", desc: "Professional animatsiyalar bilan taqdimotni jonlantiring.", xp: 350, kind: 'ppt' },
  { moduleKey: 'ppt-infographics', title: 'PowerPoint: Infografika va Vizual Hikoyalar', desc: "Murakkab ma'lumotlarni oddiy va ta'sirli vizuallarga aylantiring.", xp: 400, kind: 'ppt' },
  { moduleKey: 'outlook-email-calendar', title: "Outlook: Elektron Pochta va Kalendar Boshqaruvi", desc: "Xat qutisi, uchrashuvlar va vazifalarni samarali boshqaring.", xp: 300, kind: 'outlook' },
  { moduleKey: 'access-database-basics', title: "Access: Ma'lumotlar Bazasi Asoslari", desc: "Jadvallar, so'rovlar va formalar yordamida ma'lumotlarni tashkil eting.", xp: 450, kind: 'access' },
  { moduleKey: 'office-capstone-certificate', title: 'Yakuniy Sertifikat Loyihasi', desc: "Barcha Ofis dasturlarini birlashtirgan yakuniy ish topshirig'ini bajaring.", xp: 800, kind: 'capstone' },
];

function officeTaskDescription(desc: string, kind: OfficeModuleTask['kind']): string {
  const talablar =
    kind === 'capstone'
      ? "- Word, Excel va PowerPoint'dan kamida ikkitasini birlashtirgan yakuniy ishni tayyorlang.\n- Format, dizayn va tarkib professional darajada bo'lishi kerak.\n- Ishingizni qisqa taqdimot yoki hisobot ko'rinishida rasmiylashtiring."
      : kind === 'excel_boss'
        ? "- Berilgan (yoki o'zingiz tanlagan) ma'lumotlar asosida tahliliy hisobot yoki boshqaruv paneli yarating.\n- Kamida 2 xil vositadan (masalan Pivot Table + formula) foydalaning.\n- Natijani tushunarli va vizual jihatdan tartibli qiling."
        : "- Tayyor faylni (.docx, .xlsx yoki .pptx) yarating va mavzuga oid asosiy vositalardan foydalaning.\n- Fayl nomi va ichki tuzilishi tushunarli bo'lishi kerak.\n- Ishingizni topshirishdan oldin xatoliklarga tekshirib chiqing.";
  return `${desc}\n\nMaqsad: Ushbu ko'nikmani amaliy topshiriq orqali mustahkamlang.\n\nTalablar:\n${talablar}\n\nTopshirish: Tayyor faylni yuklang (.docx/.xlsx/.pptx/.pdf) yoki fayl bulutda bo'lsa, uning havolasini "Demo manzili" maydoniga qo'shing.`;
}

const ROBOTICS_MISSION = {
  moduleKey: 'robotics-perimeter-patrol',
  title: 'Missiya: Perimetr Patruli',
  xp: 150,
  description:
    "Roverni qizil to'siqlarga urilmasdan to'siqlar trassasi bo'ylab harakatlantirishga sozlang. Yaqinlikni kuzatish uchun ultratovush sensoridan (readSensor()) foydalaning.\n\nMaqsad: Simulyatorda to'liq bir aylanani to'siqlarga urilmasdan yakunlaydigan protokol yozing.\n\nTalablar:\n- Ultratovush sensoridan foydalanib to'siqqa yaqinlashganda tezlikni kamaytiring yoki yo'nalishni o'zgartiring.\n- Kodni Sxema Dizayneri'da sinab, jurnalda xatoliklar qolmasligiga ishonch hosil qiling.\n- Loyiha faylini eksport qilib, qisqacha izoh bilan topshiring.\n\nTopshirish: Eksport qilingan loyiha faylini yuklang yoki GitHub repo havolasini yuboring.",
};

async function upsertUser(params: {
  email: string;
  name: string;
  role: Role;
  track: Track | null;
  xp?: number;
  coins?: number;
  level?: number;
  title?: string;
  streak?: number;
}) {
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);
  return prisma.user.upsert({
    where: { email: params.email },
    update: {},
    create: {
      email: params.email,
      passwordHash,
      name: params.name,
      role: params.role,
      track: params.track,
      xp: params.xp ?? 0,
      coins: params.coins ?? 0,
      level: params.level ?? 1,
      title: params.title,
      streak: params.streak ?? 0,
      avatarUrl: avatarUrlForEmail(params.email),
    },
  });
}

async function main() {
  const teacher = await upsertUser({
    email: 'teacher@techquest.dev',
    name: 'Sardor Nazarov',
    role: Role.TEACHER,
    track: null,
    title: "Bosh o'qituvchi",
  });

  await upsertUser({
    email: 'admin@techquest.dev',
    name: 'Botir Yusupov',
    role: Role.ADMIN,
    track: null,
    title: 'Tizim administratori',
  });

  const frontendStudent = await upsertUser({
    email: 'frontend@techquest.dev',
    name: 'Aziz Rahimov',
    role: Role.STUDENT,
    track: Track.FRONTEND,
    xp: 2450,
    coins: 1500,
    level: 14,
    title: 'Frontend shogirdi',
    streak: 12,
  });

  const roboticsStudent = await upsertUser({
    email: 'robotics@techquest.dev',
    name: 'Malika Yusupova',
    role: Role.STUDENT,
    track: Track.ROBOTICS,
    xp: 1200,
    coins: 800,
    level: 8,
    title: 'Robototexnika kursanti',
    streak: 4,
  });

  const officeStudent = await upsertUser({
    email: 'office@techquest.dev',
    name: 'Jasur Toshkentov',
    role: Role.STUDENT,
    track: Track.OFFICE,
    xp: 900,
    coins: 600,
    level: 6,
    title: 'Ofis tahlilchisi',
    streak: 2,
  });

  // ClassGroup has no natural unique key, so re-seeding is guarded by title —
  // without this every `npm run db:seed` stacks another copy of every class.
  async function upsertClass(data: { title: string; track: Track; schedule: string }) {
    const existing = await prisma.classGroup.findFirst({ where: { title: data.title, track: data.track } });
    return existing ?? prisma.classGroup.create({ data: { ...data, teacherId: teacher.id } });
  }

  const frontendClass = await upsertClass({
    title: 'Frontend Veb Ustaligi',
    track: Track.FRONTEND,
    schedule: 'Dush/Chor soat 10:00',
  });
  const roboticsClass = await upsertClass({
    title: 'Robototexnika Muhandisligi 101',
    track: Track.ROBOTICS,
    schedule: 'Sesh/Pay soat 14:00',
  });
  const officeClass = await upsertClass({
    title: 'Ofis Unumdorligi',
    track: Track.OFFICE,
    schedule: 'Juma soat 13:00',
  });

  await prisma.enrollment.createMany({
    data: [
      { userId: frontendStudent.id, classId: frontendClass.id },
      { userId: roboticsStudent.id, classId: roboticsClass.id },
      { userId: officeStudent.id, classId: officeClass.id },
    ],
    skipDuplicates: true,

  });

  // Python Backend: the 96 taught lessons extracted from the slide decks by
  // scripts/extractLessons.ts. Homework comes from each deck's UY VAZIFASI
  // slide, so it matches exactly what the teacher presents in class.
  for (const lesson of backendLessons) {
    const { key, ...fields } = lesson;
    const data = { ...fields, track: Track.BACKEND };
    await prisma.lesson.upsert({ where: { key }, update: data, create: { key, ...data } });
  }

  // Bonus practice attached to each backend lesson's MAKE tiers. Python-only, so
  // starterCodeJs/Cpp stay null and the API's computed `languages` array offers
  // just Python. Upserted on the unique `key`, so re-running the seed updates the
  // rows in place and never duplicates them.
  //
  // A malformed test case is worse than a missing one: a case with no
  // `expectedStdout` field would grade every submission against `undefined`, and
  // a problem with only hidden cases gives the student nothing to check against
  // before submitting. Both are validated BEFORE anything is written, and a bad
  // record aborts the whole seed rather than being skipped quietly.
  for (const problem of backendLessonProblems) {
    if (!Array.isArray(problem.testCases) || problem.testCases.length === 0) {
      throw new Error(`Masala "${problem.key}": kamida bitta test case bo'lishi kerak.`);
    }
    problem.testCases.forEach((testCase, index) => {
      const where = `Masala "${problem.key}" test #${index + 1}`;
      if (typeof testCase.stdin !== 'string') {
        throw new Error(`${where}: "stdin" matn bo'lishi kerak.`);
      }
      if (typeof testCase.expectedStdout !== 'string') {
        throw new Error(`${where}: "expectedStdout" matn bo'lishi kerak.`);
      }
      if (typeof testCase.hidden !== 'boolean') {
        throw new Error(`${where}: "hidden" true yoki false bo'lishi kerak.`);
      }
      if (typeof testCase.label !== 'string' || testCase.label.trim() === '') {
        throw new Error(`${where}: "label" bo'sh bo'lmagan matn bo'lishi kerak.`);
      }
    });
    if (!problem.testCases.some((testCase) => !testCase.hidden)) {
      throw new Error(
        `Masala "${problem.key}": kamida bitta ochiq (hidden: false) test case bo'lishi kerak.`
      );
    }
  }

  let lessonProblemsSynced = 0;
  if (backendLessonProblems.length > 0) {
    const lessonIdByKey = new Map(
      (await prisma.lesson.findMany({ where: { track: Track.BACKEND }, select: { id: true, key: true } })).map(
        (lesson) => [lesson.key, lesson.id]
      )
    );
    for (const problem of backendLessonProblems) {
      const lessonId = lessonIdByKey.get(problem.lessonKey);
      if (!lessonId) {
        // eslint-disable-next-line no-console
        console.warn(
          `Lesson problem "${problem.key}" references unknown lesson "${problem.lessonKey}" — skipped.`
        );
        continue;
      }
      const data = {
        lessonId,
        title: problem.title,
        description: problem.description,
        difficulty: problem.difficulty as Difficulty,
        points: problem.points,
        tags: problem.tags,
        starterCodePy: problem.starterCodePy,
        starterCodeJs: null,
        starterCodeCpp: null,
        // Prisma types Json input as an index-signature value; the typed
        // ProblemTestCase[] is structurally compatible but needs the cast.
        testCases: problem.testCases as unknown as Prisma.InputJsonValue,
      };
      await prisma.problem.upsert({ where: { key: problem.key }, update: data, create: { key: problem.key, ...data } });
      lessonProblemsSynced += 1;
    }
  }

  // Backend lesson keys, reused by the quiz and the project-rubric sync below.
  const backendLessonIdByKey = new Map(
    (await prisma.lesson.findMany({ where: { track: Track.BACKEND }, select: { id: true, key: true } })).map(
      (lesson) => [lesson.key, lesson.id] as const
    )
  );

  // TEKSHIRUV recap questions, turned into auto-gradable multiple choice.
  // Upserted on the unique (lessonId, order) pair, so re-running the seed
  // updates each question in place and never duplicates it.
  //
  // A wrong `correctIndex` would silently teach students the wrong answer, so
  // the shape is validated BEFORE anything is written and a bad record aborts
  // the whole seed rather than being skipped quietly.
  for (const question of backendLessonQuiz) {
    const where = `${question.lessonKey} #${question.order}`;
    if (question.choices.length !== 4) {
      throw new Error(
        `Quiz savoli ${where}: 4 ta variant kutilgan edi, ${question.choices.length} ta topildi.`
      );
    }
    if (!Number.isInteger(question.correctIndex) || question.correctIndex < 0 || question.correctIndex > 3) {
      throw new Error(
        `Quiz savoli ${where}: correctIndex 0..3 oralig'ida bo'lishi kerak, ${question.correctIndex} topildi.`
      );
    }
    if (!backendLessonIdByKey.has(question.lessonKey)) {
      throw new Error(`Quiz savoli ${where}: "${question.lessonKey}" darsi topilmadi.`);
    }
  }

  let quizQuestionsSynced = 0;
  for (const question of backendLessonQuiz) {
    const lessonId = backendLessonIdByKey.get(question.lessonKey);
    if (!lessonId) continue; // unreachable — validated above; keeps the type narrow.
    const data = {
      lessonId,
      order: question.order,
      prompt: question.prompt,
      choices: [...question.choices],
      correctIndex: question.correctIndex,
      explanation: question.explanation,
    };
    await prisma.quizQuestion.upsert({
      where: { lessonId_order: { lessonId, order: question.order } },
      update: data,
      create: data,
    });
    quizQuestionsSynced += 1;
  }

  // Every project lesson gets the shared default grading rubric so the teacher
  // portal always has criteria to score against. Upserted on the unique
  // lessonId; a lesson-specific rubric edited later is overwritten on re-seed,
  // which is the same in-place-update contract as the lessons themselves.
  const projectLessons = await prisma.lesson.findMany({ where: { kind: 'project' }, select: { id: true } });
  const rubricCriteria = DEFAULT_PROJECT_RUBRIC.map((criterion) => ({ ...criterion })) as unknown as Prisma.InputJsonValue;
  for (const lesson of projectLessons) {
    await prisma.projectRubric.upsert({
      where: { lessonId: lesson.id },
      update: { criteria: rubricCriteria },
      create: { lessonId: lesson.id, criteria: rubricCriteria },
    });
  }
  const projectRubricsSynced = projectLessons.length;

  const backendStudent = await upsertUser({
    email: 'backend@techquest.dev',
    name: 'Nodira Karimova',
    role: Role.STUDENT,
    track: Track.BACKEND,
    xp: 1500,
    coins: 900,
    level: 9,
    title: 'Backend kursanti',
    streak: 6,
  });

  // Started four weeks ago so the demo account has both past and future deadlines.
  const backendStart = new Date(Date.now() - 28 * 24 * 60 * 60 * 1000);
  backendStart.setUTCHours(0, 0, 0, 0);

  const backendClass =
    (await prisma.classGroup.findFirst({ where: { track: Track.BACKEND, title: 'Python Backend Dasturlash' } })) ??
    (await prisma.classGroup.create({
      data: {
        title: 'Python Backend Dasturlash',
        track: Track.BACKEND,
        teacherId: teacher.id,
        schedule: 'Dush/Chor/Juma soat 16:00',
        startDate: backendStart,
        lessonDays: [1, 3, 5],
      },
    }));

  await prisma.enrollment.createMany({
    data: [{ userId: backendStudent.id, classId: backendClass.id }],
    skipDuplicates: true,
  });

  const backendSync = await syncLessonAssignments(prisma, backendClass.id);
  // eslint-disable-next-line no-console
  console.log(
    `Backend darslari: ${backendLessons.length} ta dars, ${backendSync.created} ta yangi / ${backendSync.updated} ta yangilangan uy vazifasi.`
  );

  const inDays = (n: number) => new Date(Date.now() + n * 24 * 60 * 60 * 1000);

  const [frontendAssignment1, frontendAssignment2] = await Promise.all([
    prisma.assignment.create({
      data: {
        title: 'Moslashuvchan Profil Kartochkasi Yaratish',
        description: "HTML/CSS Flexbox yordamida moslashuvchan profil kartochkasi komponentini yarating.",
        track: Track.FRONTEND,
        classId: frontendClass.id,
        dueDate: inDays(3),
        xpReward: 350,
      },
    }),
    prisma.assignment.create({
      data: {
        title: 'BOSS: Moslashuvchan Gidra',
        description: "3 xil qurilma o'lchamidagi joylashuv xatolarini yo'q qiling.",
        track: Track.FRONTEND,
        classId: frontendClass.id,
        dueDate: inDays(10),
        xpReward: 1000,
      },
    }),
  ]);

  const roboticsAssignment = await prisma.assignment.create({
    data: {
      title: 'Arduino bilan LEDni Yoqib-O\'chirish',
      description: "LED sxemasini ulang va yonib-o'chish ketma-ketligini dasturlang.",
      track: Track.ROBOTICS,
      classId: roboticsClass.id,
      dueDate: inDays(5),
      xpReward: 250,
    },
  });

  const officeAssignment = await prisma.assignment.create({
    data: {
      title: "VLOOKUP Ustaligi Ish Varag'i",
      description: "Excelda VLOOKUP asosidagi ishlaydigan qidiruv panelini yarating.",
      track: Track.OFFICE,
      classId: officeClass.id,
      dueDate: inDays(7),
      xpReward: 400,
    },
  });

  await prisma.submission.create({
    data: {
      assignmentId: frontendAssignment1.id,
      userId: frontendStudent.id,
      status: 'GRADED',
      content: 'https://codepen.io/example/profile-card',
      submittedAt: inDays(-1),
    },
  });

  await prisma.grade.createMany({
    data: [
      { userId: frontendStudent.id, assignmentId: frontendAssignment1.id, subject: 'Frontend Asoslari', score: 92, maxScore: 100 },
      { userId: roboticsStudent.id, assignmentId: roboticsAssignment.id, subject: 'Robototexnika 101', score: 85, maxScore: 100 },
      { userId: officeStudent.id, assignmentId: officeAssignment.id, subject: 'Ofis Dasturlari', score: 78, maxScore: 100 },
    ],
    skipDuplicates: true,
  
  });

  await prisma.homework.createMany({
    data: [
      { userId: frontendStudent.id, track: Track.FRONTEND, title: 'Flexbox Konspektlarini Takrorlash', course: 'Frontend Asoslari', dueDate: inDays(2) },
      { userId: frontendStudent.id, track: Track.FRONTEND, title: 'CSS Ustaligi Testi', course: 'CSS Ustaligi', dueDate: inDays(4) },
      { userId: roboticsStudent.id, track: Track.ROBOTICS, title: "ESP8266 Texnik Hujjatini O'qish", course: 'Robototexnika 101', dueDate: inDays(3) },
      { userId: officeStudent.id, track: Track.OFFICE, title: "Pivot Jadvallarni Mashq Qilish", course: "Excel Ma'lumotlar Ustaligi", dueDate: inDays(3) },
    ],
    skipDuplicates: true,
  
  });

  await prisma.attendance.createMany({
    data: [
      { userId: frontendStudent.id, classId: frontendClass.id, date: inDays(-7), status: 'PRESENT' },
      { userId: frontendStudent.id, classId: frontendClass.id, date: inDays(-5), status: 'PRESENT' },
      { userId: frontendStudent.id, classId: frontendClass.id, date: inDays(-2), status: 'LATE' },
      { userId: roboticsStudent.id, classId: roboticsClass.id, date: inDays(-4), status: 'PRESENT' },
      { userId: officeStudent.id, classId: officeClass.id, date: inDays(-3), status: 'EXCUSED' },
    ],
    skipDuplicates: true,
  
  });

  await prisma.notification.createMany({
    data: [
      { userId: frontendStudent.id, type: 'SUCCESS', title: 'Vazifa baholandi', body: "Sizning Moslashuvchan Profil Kartochkangiz 92/100 ball oldi." },
      { userId: frontendStudent.id, type: 'INFO', title: 'Yangi Boss jangi ochildi', body: "Moslashuvchan Gidra sizni jangga chaqirmoqda." },
      { userId: roboticsStudent.id, type: 'WARNING', title: 'Robototexnika laboratoriyasi texnik xizmati', body: 'Apparat laboratoriyasi shu juma kuni texnik xizmat uchun yopiladi.' },
      { userId: officeStudent.id, type: 'INFO', title: "Yangi shablonlar to'plami", body: "Korporativ Hisobot To'plami shablonlari qo'shildi." },
    ],
    skipDuplicates: true,
  
  });

  await prisma.calendarEvent.createMany({
    data: [
      { title: 'Frontend Asoslari Ma\'ruzasi', track: Track.FRONTEND, classId: frontendClass.id, type: 'CLASS', startsAt: inDays(1) },
      { title: 'Frontend BOSS Muddati', track: Track.FRONTEND, classId: frontendClass.id, type: 'DEADLINE', startsAt: inDays(10) },
      { title: "Robototexnika Jamoa Yig'ilishi", track: Track.ROBOTICS, classId: roboticsClass.id, type: 'EVENT', startsAt: inDays(2) },
      { title: 'Ofis Dasturlari Sertifikat Imtihoni', track: Track.OFFICE, classId: officeClass.id, type: 'EXAM', startsAt: inDays(14) },
      { title: "Kampus Bo'ylab Xakaton", track: null, type: 'EVENT', startsAt: inDays(20) },
    ],
    skipDuplicates: true,
  
  });

  const universalQuest1 = await prisma.quest.create({
    data: { title: 'Birinchi Qadamlar', xpReward: 500, track: null },
  });
  const universalQuest2 = await prisma.quest.create({
    data: { title: 'Arenaga Kirish', xpReward: 1000, track: null },
  });
  const frontendQuest = await prisma.quest.create({
    data: { title: 'JavaScript Asoslarini Egallash', xpReward: 400, track: Track.FRONTEND, chapterId: 'chapter_2' },
  });

  await prisma.userQuest.createMany({
    data: [
      { userId: frontendStudent.id, questId: universalQuest1.id, completed: true, completedAt: inDays(-10) },
      { userId: frontendStudent.id, questId: universalQuest2.id, completed: false },
      { userId: frontendStudent.id, questId: frontendQuest.id, completed: false },
      { userId: roboticsStudent.id, questId: universalQuest1.id, completed: true, completedAt: inDays(-8) },
      { userId: officeStudent.id, questId: universalQuest1.id, completed: true, completedAt: inDays(-6) },
    ],
    skipDuplicates: true,
  
  });

  // Frontend course module progress, matching the FrontendCourse.tsx static roadmap
  await prisma.moduleProgress.createMany({
    data: [
      { userId: frontendStudent.id, track: Track.FRONTEND, moduleKey: 'html-foundations', progress: 100, unlocked: true },
      { userId: frontendStudent.id, track: Track.FRONTEND, moduleKey: 'css-cyber-styling', progress: 100, unlocked: true },
      { userId: frontendStudent.id, track: Track.FRONTEND, moduleKey: 'js-logic-gates', progress: 40, unlocked: true },
      { userId: frontendStudent.id, track: Track.FRONTEND, moduleKey: 'boss-responsive-hydra', progress: 0, unlocked: false },
      { userId: frontendStudent.id, track: Track.FRONTEND, moduleKey: 'react-components', progress: 0, unlocked: false },
    ],
    skipDuplicates: true,
  
  });

  // Office course module progress, matching the OfficeCourse.tsx static curriculum
  await prisma.moduleProgress.createMany({
    data: [
      { userId: officeStudent.id, track: Track.OFFICE, moduleKey: 'os-basics', progress: 100, unlocked: true },
      { userId: officeStudent.id, track: Track.OFFICE, moduleKey: 'files-folders', progress: 100, unlocked: true },
      { userId: officeStudent.id, track: Track.OFFICE, moduleKey: 'internet-browser-basics', progress: 100, unlocked: true },
      { userId: officeStudent.id, track: Track.OFFICE, moduleKey: 'digital-safety', progress: 100, unlocked: true },
      { userId: officeStudent.id, track: Track.OFFICE, moduleKey: 'cloud-storage-basics', progress: 100, unlocked: true },
      { userId: officeStudent.id, track: Track.OFFICE, moduleKey: 'word-basics', progress: 100, unlocked: true },
      { userId: officeStudent.id, track: Track.OFFICE, moduleKey: 'word-doc-design', progress: 100, unlocked: true },
      { userId: officeStudent.id, track: Track.OFFICE, moduleKey: 'excel-basics', progress: 100, unlocked: true },
      { userId: officeStudent.id, track: Track.OFFICE, moduleKey: 'excel-data-mastery', progress: 65, unlocked: true },
      { userId: officeStudent.id, track: Track.OFFICE, moduleKey: 'ppt-basics', progress: 0, unlocked: false },
      { userId: officeStudent.id, track: Track.OFFICE, moduleKey: 'excel-advanced-analytics', progress: 0, unlocked: false },
    ],
    skipDuplicates: true,

  });

  // Real per-module missions: every campaign-path node (frontend, office, robotics)
  // gets a real Assignment with instructions/requirements, so "Missiyani boshlash"
  // opens a real task instead of a disconnected generic CodeLab. Self-paced, so the
  // due date is set far out rather than tied to a class deadline.
  const selfPacedDueDate = inDays(365);
  await prisma.assignment.createMany({
    data: [
      ...FRONTEND_MODULE_TASKS.map((m) => ({
        title: m.title,
        description: frontendTaskDescription(m.desc, m.kind),
        track: Track.FRONTEND,
        dueDate: selfPacedDueDate,
        xpReward: m.xp,
        moduleKey: m.moduleKey,
      })),
      ...OFFICE_MODULE_TASKS.map((m) => ({
        title: m.title,
        description: officeTaskDescription(m.desc, m.kind),
        track: Track.OFFICE,
        dueDate: selfPacedDueDate,
        xpReward: m.xp,
        moduleKey: m.moduleKey,
      })),
      {
        title: ROBOTICS_MISSION.title,
        description: ROBOTICS_MISSION.description,
        track: Track.ROBOTICS,
        dueDate: selfPacedDueDate,
        xpReward: ROBOTICS_MISSION.xp,
        moduleKey: ROBOTICS_MISSION.moduleKey,
      },
    ],
    skipDuplicates: true,
  });

  await prisma.building.createMany({
    data: [
      { userId: frontendStudent.id, type: 'TECH', position: [0, 0, 0], color: '#00D9FF', secondaryColor: '#FFFFFF', name: 'HTML Yadrosi', level: 2 },
      { userId: frontendStudent.id, type: 'TECH', position: [6, 0, 6], color: '#B026FF', secondaryColor: '#FFFFFF', name: 'JavaScript Markazi', level: 1 },
      { userId: frontendStudent.id, type: 'RESIDENTIAL', position: [0, 0, 10], color: '#00FF88', secondaryColor: '#FFFFFF', name: 'Fuqarolar Minorasi', level: 1 },
    ],
    skipDuplicates: true,
  
  });

  // Achievement catalog
  await prisma.achievement.createMany({
    data: [
      { key: 'first-blood', name: 'Birinchi Qon', description: 'Sinfda birinchi bo\'lib topshiriq yubordi', rarity: 'COMMON', category: 'PROGRAMMING', conditionType: 'FIRST_SUBMISSION', conditionValue: 1 },
      { key: 'night-owl', name: 'Tungi Boyqush', description: 'Yarim tundan keyin 5 ta missiya topshirdi', rarity: 'EPIC', category: 'SPECIAL', conditionType: 'MIDNIGHT_SUBMISSIONS', conditionValue: 5 },
      { key: 'code-ninja', name: 'Kod Nindzyasi', description: '10 ta algoritm masalasida benuqson yechim topdi', rarity: 'LEGENDARY', category: 'PROGRAMMING', conditionType: 'PROBLEM_SUBMISSIONS_PASSED', conditionValue: 10 },
      { key: 'bug-hunter', name: 'Xatolar Ovchisi', description: '10 ta topshiriq yubordi', rarity: 'RARE', category: 'PROGRAMMING', conditionType: 'SUBMISSIONS_COUNT', conditionValue: 10 },
      { key: 'helping-hand', name: 'Yordamchi Qo\'l', description: 'Do\'stlarga 20 ta xabar yubordi', rarity: 'RARE', category: 'SOCIAL', conditionType: 'DIRECT_MESSAGES_SENT', conditionValue: 20 },

      { key: 'problem-solver-25', name: 'Masala Yechuvchi', description: "25 ta masalani muvaffaqiyatli yechdi", rarity: 'RARE', category: 'PROGRAMMING', conditionType: 'PROBLEM_SUBMISSIONS_PASSED', conditionValue: 25 },
      { key: 'problem-solver-50', name: 'Algoritm Ustasi', description: "50 ta masalani muvaffaqiyatli yechdi", rarity: 'EPIC', category: 'PROGRAMMING', conditionType: 'PROBLEM_SUBMISSIONS_PASSED', conditionValue: 50 },
      { key: 'problem-solver-100', name: 'Kod Afsonasi', description: "100 ta masalani muvaffaqiyatli yechdi", rarity: 'LEGENDARY', category: 'PROGRAMMING', conditionType: 'PROBLEM_SUBMISSIONS_PASSED', conditionValue: 100 },

      { key: 'diligent-30', name: 'Tirishqoq Talaba', description: '30 ta topshiriq yubordi', rarity: 'EPIC', category: 'PROGRAMMING', conditionType: 'SUBMISSIONS_COUNT', conditionValue: 30 },
      { key: 'diligent-75', name: 'Charchamas Dasturchi', description: '75 ta topshiriq yubordi', rarity: 'LEGENDARY', category: 'PROGRAMMING', conditionType: 'SUBMISSIONS_COUNT', conditionValue: 75 },

      { key: 'xp-1000', name: 'Boshlang\'ich Qahramon', description: '1000 XP to\'pladi', rarity: 'COMMON', category: 'PROGRAMMING', conditionType: 'XP_REACHED', conditionValue: 1000 },
      { key: 'xp-5000', name: 'Tajribali Jangchi', description: '5000 XP to\'pladi', rarity: 'RARE', category: 'PROGRAMMING', conditionType: 'XP_REACHED', conditionValue: 5000 },
      { key: 'xp-15000', name: 'Elita Dasturchi', description: '15000 XP to\'pladi', rarity: 'EPIC', category: 'PROGRAMMING', conditionType: 'XP_REACHED', conditionValue: 15000 },
      { key: 'xp-50000', name: 'TechQuest Afsonasi', description: '50000 XP to\'pladi', rarity: 'LEGENDARY', category: 'PROGRAMMING', conditionType: 'XP_REACHED', conditionValue: 50000 },

      { key: 'level-10', name: "O'nlik Chegara", description: '10-darajaga yetdi', rarity: 'COMMON', category: 'PROGRAMMING', conditionType: 'LEVEL_REACHED', conditionValue: 10 },
      { key: 'level-25', name: 'Yuksalgan Ustoz', description: '25-darajaga yetdi', rarity: 'RARE', category: 'PROGRAMMING', conditionType: 'LEVEL_REACHED', conditionValue: 25 },
      { key: 'level-50', name: 'Cho\'qqi Zabtchisi', description: '50-darajaga yetdi', rarity: 'EPIC', category: 'PROGRAMMING', conditionType: 'LEVEL_REACHED', conditionValue: 50 },

      { key: 'streak-7', name: 'Haftalik Seriya', description: '7 kunlik seriyaga yetdi', rarity: 'COMMON', category: 'SPECIAL', conditionType: 'STREAK_REACHED', conditionValue: 7 },
      { key: 'streak-30', name: 'Oylik Sadoqat', description: '30 kunlik seriyaga yetdi', rarity: 'RARE', category: 'SPECIAL', conditionType: 'STREAK_REACHED', conditionValue: 30 },
      { key: 'streak-100', name: 'Chidamlilik Afsonasi', description: '100 kunlik seriyaga yetdi', rarity: 'LEGENDARY', category: 'SPECIAL', conditionType: 'STREAK_REACHED', conditionValue: 100 },

      { key: 'elo-1300', name: "Arena Yangi Boshlovchisi", description: 'ELO reytingi 1300 ga yetdi', rarity: 'COMMON', category: 'SPEED', conditionType: 'ELO_REACHED', conditionValue: 1300 },
      { key: 'elo-1600', name: 'Arena Veterani', description: 'ELO reytingi 1600 ga yetdi', rarity: 'RARE', category: 'SPEED', conditionType: 'ELO_REACHED', conditionValue: 1600 },
      { key: 'elo-2000', name: 'Arena Chempioni', description: 'ELO reytingi 2000 ga yetdi', rarity: 'LEGENDARY', category: 'SPEED', conditionType: 'ELO_REACHED', conditionValue: 2000 },

      { key: 'battles-won-5', name: 'Kod Jangchisi', description: "5 ta jangda g'alaba qozondi", rarity: 'RARE', category: 'SPEED', conditionType: 'BATTLES_WON', conditionValue: 5 },
      { key: 'battles-won-20', name: 'Arena Yirtqichi', description: "20 ta jangda g'alaba qozondi", rarity: 'EPIC', category: 'SPEED', conditionType: 'BATTLES_WON', conditionValue: 20 },
      { key: 'battles-won-50', name: "Yengilmas Gladiator", description: "50 ta jangda g'alaba qozondi", rarity: 'LEGENDARY', category: 'SPEED', conditionType: 'BATTLES_WON', conditionValue: 50 },

      { key: 'coins-2000', name: 'Tejamkor', description: "2000 tanga to'pladi", rarity: 'COMMON', category: 'SPECIAL', conditionType: 'COINS_BALANCE', conditionValue: 2000 },
      { key: 'coins-10000', name: 'Kiber Boyvachcha', description: "10000 tanga to'pladi", rarity: 'EPIC', category: 'SPECIAL', conditionType: 'COINS_BALANCE', conditionValue: 10000 },

      { key: 'collector-5', name: "Kolleksioner", description: "5 ta buyum sotib oldi", rarity: 'RARE', category: 'SPECIAL', conditionType: 'SHOP_ITEMS_OWNED', conditionValue: 5 },
      { key: 'collector-15', name: "Buyumlar Ustasi", description: "15 ta buyum sotib oldi", rarity: 'LEGENDARY', category: 'SPECIAL', conditionType: 'SHOP_ITEMS_OWNED', conditionValue: 15 },

      { key: 'social-butterfly-5', name: "Ijtimoiy Kapalak", description: "5 ta do'st orttirdi", rarity: 'RARE', category: 'SOCIAL', conditionType: 'FRIENDS_COUNT', conditionValue: 5 },
      { key: 'social-butterfly-15', name: "Jamiyat Yulduzi", description: "15 ta do'st orttirdi", rarity: 'LEGENDARY', category: 'SOCIAL', conditionType: 'FRIENDS_COUNT', conditionValue: 15 },

      { key: 'team-player', name: 'Jamoa O\'yinchisi', description: 'Jamoaga qo\'shildi', rarity: 'COMMON', category: 'SOCIAL', conditionType: 'TEAM_JOINED', conditionValue: 1 },

      { key: 'quest-master-10', name: 'Missiya Ustasi', description: "10 ta missiyani bajardi", rarity: 'RARE', category: 'PROGRAMMING', conditionType: 'QUESTS_COMPLETED', conditionValue: 10 },
      { key: 'quest-master-30', name: 'Missiyalar Afsonasi', description: "30 ta missiyani bajardi", rarity: 'LEGENDARY', category: 'PROGRAMMING', conditionType: 'QUESTS_COMPLETED', conditionValue: 30 },

      { key: 'homework-hero-10', name: 'Uy Vazifasi Qahramoni', description: "10 ta uy vazifasini bajardi", rarity: 'RARE', category: 'SPECIAL', conditionType: 'HOMEWORK_COMPLETED', conditionValue: 10 },

      { key: 'excellence-5', name: "A'lochi", description: "5 ta baho 90% dan yuqori bo'ldi", rarity: 'EPIC', category: 'SECRET', conditionType: 'GRADES_ABOVE_90', conditionValue: 5 },
      { key: 'excellence-15', name: "Mukammallik Timsoli", description: "15 ta baho 90% dan yuqori bo'ldi", rarity: 'LEGENDARY', category: 'SECRET', conditionType: 'GRADES_ABOVE_90', conditionValue: 15 },
    ],
    skipDuplicates: true,
  });

  // Shop item catalog
  await prisma.item.createMany({
    data: [
      { key: 'neon-visor-frame', name: 'Neon Vizor', type: 'FRAME', price: 500, rarity: 'RARE' },
      { key: 'cyber-shield-frame', name: 'Kibernetik Qalqon', type: 'FRAME', price: 1200, rarity: 'EPIC' },
      { key: 'holographic-crown-frame', name: 'Golografik Toj Ramkasi', type: 'FRAME', price: 1000, rarity: 'EPIC' },
      { key: 'pixel-samurai-frame', name: 'Piksel Samuray Ramkasi', type: 'FRAME', price: 700, rarity: 'RARE' },
      { key: 'quantum-halo-frame', name: 'Kvant Halo Ramkasi', type: 'FRAME', price: 2000, rarity: 'LEGENDARY' },
      { key: 'circuit-board-frame', name: 'Sxema Taxtasi Ramkasi', type: 'FRAME', price: 250, rarity: 'COMMON' },
      { key: 'dragon-scale-frame', name: 'Ajdaho Tangachasi Ramkasi', type: 'FRAME', price: 1100, rarity: 'EPIC' },
      { key: 'ice-crystal-frame', name: 'Muz Kristali Ramkasi', type: 'FRAME', price: 650, rarity: 'RARE' },
      { key: 'golden-laurel-frame', name: 'Oltin Laurel Ramkasi', type: 'FRAME', price: 1800, rarity: 'LEGENDARY' },
      { key: 'void-walker-frame', name: 'Bo\'shliq Sayohatchisi Ramkasi', type: 'FRAME', price: 950, rarity: 'EPIC' },
      { key: 'rainbow-prism-frame', name: 'Kamalak Prizma Ramkasi', type: 'FRAME', price: 600, rarity: 'RARE' },

      { key: 'dark-theme', name: "Qorong'u Rejim Mavzusi", type: 'THEME', price: 300, rarity: 'COMMON' },
      { key: 'neon-theme', name: 'Neon Mavzu', type: 'THEME', price: 800, rarity: 'RARE' },
      { key: 'sunset-theme', name: 'Quyosh Botishi Mavzusi', type: 'THEME', price: 500, rarity: 'RARE' },
      { key: 'matrix-theme', name: 'Matritsa Mavzusi', type: 'THEME', price: 900, rarity: 'EPIC' },
      { key: 'ocean-theme', name: 'Okean Mavzusi', type: 'THEME', price: 350, rarity: 'COMMON' },
      { key: 'retro-wave-theme', name: "Retro To'lqin Mavzusi", type: 'THEME', price: 850, rarity: 'EPIC' },
      { key: 'minimal-theme', name: 'Minimalist Mavzu', type: 'THEME', price: 300, rarity: 'COMMON' },
      { key: 'galaxy-theme', name: 'Galaktika Mavzusi', type: 'THEME', price: 1500, rarity: 'LEGENDARY' },
      { key: 'forest-theme', name: "O'rmon Mavzusi", type: 'THEME', price: 320, rarity: 'COMMON' },

      { key: 'xp-boost', name: 'XP Kuchaytirgichi', type: 'BOOST', price: 600, rarity: 'RARE' },
      { key: 'speed-boost', name: 'Tezlik Kuchaytirgichi', type: 'BOOST', price: 400, rarity: 'COMMON' },
      { key: 'double-xp-boost', name: 'Ikkilangan XP Kuchaytirgichi', type: 'BOOST', price: 1200, rarity: 'EPIC' },
      { key: 'coin-magnet-boost', name: 'Tanga Magniti', type: 'BOOST', price: 550, rarity: 'RARE' },
      { key: 'focus-boost', name: 'Diqqat Kuchaytirgichi', type: 'BOOST', price: 300, rarity: 'COMMON' },
      { key: 'streak-shield-boost', name: 'Seriya Qalqoni', type: 'BOOST', price: 700, rarity: 'RARE' },
      { key: 'battle-rage-boost', name: "Jang G'azabi Kuchaytirgichi", type: 'BOOST', price: 950, rarity: 'EPIC' },
      { key: 'lucky-boost', name: 'Omad Kuchaytirgichi', type: 'BOOST', price: 600, rarity: 'RARE' },
      { key: 'mega-xp-boost', name: 'Mega XP Kuchaytirgichi', type: 'BOOST', price: 2200, rarity: 'LEGENDARY' },

      { key: 'plasma-glass-material', name: 'Plazma Shisha', type: 'MATERIAL', price: 900, rarity: 'EPIC' },
      { key: 'cyber-steel-material', name: "Kiber Po'lat", type: 'MATERIAL', price: 350, rarity: 'COMMON' },
      { key: 'titanium-alloy-material', name: 'Titan Qotishmasi', type: 'MATERIAL', price: 550, rarity: 'RARE' },
      { key: 'holographic-panel-material', name: 'Golografik Panel', type: 'MATERIAL', price: 1000, rarity: 'EPIC' },
      { key: 'neon-concrete-material', name: 'Neon Beton', type: 'MATERIAL', price: 300, rarity: 'COMMON' },
      { key: 'carbon-fiber-material', name: 'Karbon Tola', type: 'MATERIAL', price: 650, rarity: 'RARE' },
      { key: 'solar-glass-material', name: 'Quyosh Shishasi', type: 'MATERIAL', price: 900, rarity: 'EPIC' },
      { key: 'diamond-composite-material', name: 'Olmos Kompoziti', type: 'MATERIAL', price: 2000, rarity: 'LEGENDARY' },
      { key: 'reinforced-alloy-material', name: 'Mustahkamlangan Qotishma', type: 'MATERIAL', price: 280, rarity: 'COMMON' },

      { key: 'power-grid-upgrade', name: 'Energiya Tarmog\'i Yangilanishi', type: 'UPGRADE', price: 800, rarity: 'RARE' },
      { key: 'traffic-ai-upgrade', name: 'Transport AI Yangilanishi', type: 'UPGRADE', price: 1300, rarity: 'EPIC' },
      { key: 'security-drone-upgrade', name: 'Xavfsizlik Droni Yangilanishi', type: 'UPGRADE', price: 1200, rarity: 'EPIC' },
      { key: 'water-recycling-upgrade', name: 'Suv Qayta Ishlash Yangilanishi', type: 'UPGRADE', price: 750, rarity: 'RARE' },
      { key: 'solar-grid-upgrade', name: 'Quyosh Tarmog\'i Yangilanishi', type: 'UPGRADE', price: 1900, rarity: 'LEGENDARY' },
      { key: 'night-lighting-upgrade', name: 'Tungi Yoritish Yangilanishi', type: 'UPGRADE', price: 400, rarity: 'COMMON' },
      { key: 'public-transport-upgrade', name: 'Jamoat Transporti Yangilanishi', type: 'UPGRADE', price: 850, rarity: 'RARE' },
      { key: 'smart-waste-upgrade', name: 'Aqlli Chiqindi Yangilanishi', type: 'UPGRADE', price: 350, rarity: 'COMMON' },

      { key: 'architect-title', name: 'Arxitektor Unvoni', type: 'TITLE', price: 1500, rarity: 'LEGENDARY' },
      { key: 'code-master-title', name: 'Kod Ustasi Unvoni', type: 'TITLE', price: 1600, rarity: 'LEGENDARY' },
      { key: 'night-owl-title', name: 'Tungi Boyqush Unvoni', type: 'TITLE', price: 1000, rarity: 'EPIC' },
      { key: 'speedster-title', name: 'Tezkor Unvoni', type: 'TITLE', price: 700, rarity: 'RARE' },
      { key: 'guardian-title', name: "Qo'riqchi Unvoni", type: 'TITLE', price: 950, rarity: 'EPIC' },
      { key: 'pioneer-title', name: 'Kashfiyotchi Unvoni', type: 'TITLE', price: 400, rarity: 'COMMON' },
      { key: 'legend-title', name: 'Afsona Unvoni', type: 'TITLE', price: 2500, rarity: 'LEGENDARY' },
      { key: 'mentor-title', name: 'Ustoz Unvoni', type: 'TITLE', price: 1100, rarity: 'EPIC' },
      { key: 'champion-title', name: 'Chempion Unvoni', type: 'TITLE', price: 2000, rarity: 'LEGENDARY' },

      { key: 'cyberpunk-skyscraper-blueprint', name: 'Kiberpank Osmono\'par Chizmasi', type: 'BLUEPRINT', price: 2500, rarity: 'LEGENDARY' },
      { key: 'zen-garden-blueprint', name: 'Zen Bog\'i Pavilyoni Chizmasi', type: 'BLUEPRINT', price: 1800, rarity: 'EPIC' },
      { key: 'floating-garden-blueprint', name: "Suzuvchi Bog' Chizmasi", type: 'BLUEPRINT', price: 1700, rarity: 'EPIC' },
      { key: 'underwater-dome-blueprint', name: 'Suv Osti Gumbazi Chizmasi', type: 'BLUEPRINT', price: 2800, rarity: 'LEGENDARY' },
      { key: 'sky-bridge-blueprint', name: "Osmon Ko'prigi Chizmasi", type: 'BLUEPRINT', price: 1600, rarity: 'EPIC' },
      { key: 'neon-market-blueprint', name: 'Neon Bozor Chizmasi', type: 'BLUEPRINT', price: 1000, rarity: 'RARE' },
      { key: 'crystal-tower-blueprint', name: 'Kristall Minora Chizmasi', type: 'BLUEPRINT', price: 2600, rarity: 'LEGENDARY' },
      { key: 'solar-farm-blueprint', name: 'Quyosh Fermasi Chizmasi', type: 'BLUEPRINT', price: 1100, rarity: 'RARE' },
      { key: 'holographic-park-blueprint', name: 'Golografik Park Chizmasi', type: 'BLUEPRINT', price: 1500, rarity: 'EPIC' },
    ],
    skipDuplicates: true,
  });

  // Problems catalog
  await prisma.problem.createMany({
    data: [
      {
        key: 'sum-two-numbers',
        title: "Ikki Sonni Qo'shish",
        difficulty: 'EASY',
        points: 10,
        tags: ['Matematika', 'Asosiy'],
        description: "Ikkita sonni kiritma sifatida oladigan va ularning yig'indisini qaytaradigan funksiya yozing.\n\n**1-misol:**\nKiritma: a = 5, b = 3\nNatija: 8\n\n**2-misol:**\nKiritma: a = -2, b = 10\nNatija: 8",
        starterCodeJs: 'function sum(a, b) {\n  // your code here\n}',
        starterCodePy: 'def sum(a, b):\n    # your code here\n    pass',
        starterCodeCpp: 'int sum(int a, int b) {\n    // your code here\n}',
      },
      {
        key: 'reverse-string',
        title: 'Satrni Teskari Qilish',
        difficulty: 'EASY',
        points: 15,
        tags: ['Satrlar'],
        description: "Satrni teskari qiladigan funksiya yozing. Kiritma satr belgilar massivi sifatida berilgan.\n\n**1-misol:**\nKiritma: s = [\"h\",\"e\",\"l\",\"l\",\"o\"]\nNatija: [\"o\",\"l\",\"l\",\"e\",\"h\"]",
        starterCodeJs: 'function reverseString(s) {\n  // your code here\n}',
        starterCodePy: 'def reverseString(s):\n    # your code here\n    pass',
        starterCodeCpp: 'void reverseString(vector<char>& s) {\n    // your code here\n}',
      },
      {
        key: 'two-sum',
        title: 'Ikki Sonning Yig\'indisi',
        difficulty: 'MEDIUM',
        points: 30,
        tags: ['Massivlar', 'Xesh Jadval'],
        description: "nums butun sonlar massivi va target butun soni berilgan holda, yig'indisi target ga teng bo'ladigan ikkita sonning indekslarini qaytaring.\n\n**1-misol:**\nKiritma: nums = [2,7,11,15], target = 9\nNatija: [0,1]\nIzoh: nums[0] + nums[1] == 9 bo'lgani uchun [0, 1] qaytariladi.",
        starterCodeJs: 'function twoSum(nums, target) {\n  // your code here\n}',
        starterCodePy: 'def twoSum(nums, target):\n    # your code here\n    pass',
        starterCodeCpp: 'vector<int> twoSum(vector<int>& nums, int target) {\n    // your code here\n}',
      },
      ...generatedProblems,
    ],
    skipDuplicates: true,
  });

  // Guilds/teams
  await prisma.team.createMany({
    data: [
      { name: 'Cyber Sentinels', motto: 'Kod orqali himoya qilamiz', tag: 'CYBS', color: '#00D9FF' },
      { name: 'Neon Knights', motto: "Tunni yorug'lik bilan zabt etamiz", tag: 'NEON', color: '#B026FF' },
      { name: 'Logic Lords', motto: "Mantiq bilan g'alaba qozonamiz", tag: 'LGCL', color: '#FF9500' },
      { name: 'Kod Betaqveronlari', motto: 'Har bir bug bizning dushmanimiz', tag: 'BETA', color: '#FF3366' },
      { name: 'Silikon Sulton', motto: 'Protsessorlar bizga bo\'ysunadi', tag: 'SLCN', color: '#00FFAA' },
      { name: 'Kvant Qirg\'oqchilari', motto: 'Bitlarni talon-toroj qilamiz', tag: 'QNTM', color: '#7B2FFF' },
      { name: 'Baytlar Brigadasi', motto: 'Har bir bayt jangda', tag: 'BYTE', color: '#FFAA00' },
      { name: "Xakerlar Ittifoqi", motto: "Bilim - eng katta kuch", tag: 'HACK', color: '#00D9FF' },
      { name: 'Tungi Kodchilar', motto: "Quyosh botganda kuchimiz oshadi", tag: 'NCTD', color: '#6A0DAD' },
      { name: 'Algoritm Ashaddiylari', motto: 'Murakkablik bizni qo\'rqitmaydi', tag: 'ALGO', color: '#FF6B35' },
      { name: 'Debug Legioni', motto: 'Har bir xatoni yo\'q qilamiz', tag: 'DBUG', color: '#39FF14' },
      { name: "Ma'lumotlar Ustalari", motto: "Ma'lumot - yangi oltin", tag: 'DATA', color: '#FFD700' },
      { name: 'Rekursiya Ritsarlari', motto: "O'zimizga qaytamiz, g'alaba bilan", tag: 'RECR', color: '#FF1493' },
      { name: 'Kiber Feniks', motto: "Har bir mag'lubiyatdan kuchliroq qaytamiz", tag: 'PHNX', color: '#FF4500' },
      { name: 'Sinf Sardorlari', motto: "Yetakchilik - bizning yo'limiz", tag: 'CHFT', color: '#4169E1' },
      { name: 'Neyron Tarmoq', motto: "Birgalikda o'rganamiz, birgalikda g'alaba qozonamiz", tag: 'NRNT', color: '#00CED1' },
      { name: 'Piksel Payg\'ambarlari', motto: 'Kelajakni biz chizamiz', tag: 'PXPR', color: '#DA70D6' },
      { name: 'Kripto Qasoskorlari', motto: "Xavfsizlik - bizning missiyamiz", tag: 'CRYP', color: '#32CD32' },
      { name: 'Server Sardorlari', motto: '99.9% uptime, 100% g\'alaba', tag: 'SRVR', color: '#FF8C00' },
      { name: 'Git Gvardiyasi', motto: "Har bir commit - g'alaba sari qadam", tag: 'GITG', color: '#8A2BE2' },
    ],
    skipDuplicates: true,
  });

  await prisma.dailyExercise.createMany({
    data: [
      { key: 'daily-os-basics', track: Track.OFFICE, moduleKey: 'os-basics', prompt: "Ish stolida 2 ta oynani yonma-yon joylashtiring (Snap) va orasida Alt+Tab bilan almashing.", estMinutes: 5, xpReward: 20 },
      { key: 'daily-files-folders', track: Track.OFFICE, moduleKey: 'files-folders', prompt: "'Amaliyot' papkasini yarating, ichiga 3 ta bo'sh matn fayli qo'shing va ularni raqamlab nomlang.", estMinutes: 5, xpReward: 20 },
      { key: 'daily-internet-browser-basics', track: Track.OFFICE, moduleKey: 'internet-browser-basics', prompt: 'Google\'da qo\'shtirnoq (" ") operatoridan foydalanib aniq bir iborani qidiring va natijani skrinshot qiling.', estMinutes: 5, xpReward: 20 },
      { key: 'daily-digital-safety', track: Track.OFFICE, moduleKey: 'digital-safety', prompt: "Joriy parolingiz kuchini baholang (uzunlik, raqam, belgi) va zaif tomonlarini yozib chiqing.", estMinutes: 8, xpReward: 25 },
      { key: 'daily-cloud-storage-basics', track: Track.OFFICE, moduleKey: 'cloud-storage-basics', prompt: "Bitta faylni Google Drive/OneDrive'ga yuklab, uni 'faqat ko'rish' huquqi bilan ustozga ulashing.", estMinutes: 8, xpReward: 25 },
      { key: 'daily-word-basics', track: Track.OFFICE, moduleKey: 'word-basics', prompt: "Word'da 5 gapli matn yozing, 2 tasini qalin (Bold), 1 tasini rangli qiling.", estMinutes: 5, xpReward: 20 },
      { key: 'daily-word-doc-design', track: Track.OFFICE, moduleKey: 'word-doc-design', prompt: "Bitta paragrafga 'Heading 1' uslubini qo'llang va sahifaga 3x3 jadval qo'shing.", estMinutes: 8, xpReward: 30 },
      { key: 'daily-word-long-documents', track: Track.OFFICE, moduleKey: 'word-long-documents', prompt: "3 ta sarlavha (Heading) yarating va ular asosida avtomatik Tarkib Jadvalini kiriting.", estMinutes: 10, xpReward: 35 },
      { key: 'daily-word-mail-merge', track: Track.OFFICE, moduleKey: 'word-mail-merge', prompt: "5 qatorli oddiy Excel ro'yxati yarating va Word'da unga Mail Merge orqali bog'lang.", estMinutes: 10, xpReward: 35 },
      { key: 'daily-excel-basics', track: Track.OFFICE, moduleKey: 'excel-basics', prompt: "10 qatorli sonlar ustunini kiriting va =SUM hamda =AVERAGE formulalarini qo'llang.", estMinutes: 5, xpReward: 20 },
      { key: 'daily-excel-data-mastery', track: Track.OFFICE, moduleKey: 'excel-data-mastery', prompt: "Ikkita ustunli jadval yarating va VLOOKUP yordamida uchinchi ustunga mos qiymatni chiqaring.", estMinutes: 10, xpReward: 35 },
      { key: 'daily-excel-formulas-deep-dive', track: Track.OFFICE, moduleKey: 'excel-formulas-deep-dive', prompt: "IFERROR bilan o'ralgan bitta formula yozing (masalan, nolga bo'linishni tekshiring).", estMinutes: 8, xpReward: 30 },
      { key: 'daily-excel-pivot-charts', track: Track.OFFICE, moduleKey: 'excel-pivot-charts', prompt: "15 qatorli namuna ma'lumotdan Pivot Table yasang va uni doiraviy diagrammaga aylantiring.", estMinutes: 10, xpReward: 35 },
      { key: 'daily-excel-macros-automation', track: Track.OFFICE, moduleKey: 'excel-macros-automation', prompt: "Macro Recorder'ni yoqib, bitta katakchani formatlash amalini (rang+shrift) yozib oling.", estMinutes: 8, xpReward: 30 },
      { key: 'daily-ppt-basics', track: Track.OFFICE, moduleKey: 'ppt-basics', prompt: "3 slaydli oddiy taqdimot yarating: sarlavha, kontent, xulosa.", estMinutes: 5, xpReward: 20 },
      { key: 'daily-ppt-narrative-design', track: Track.OFFICE, moduleKey: 'ppt-narrative-design', prompt: "Bitta slaydda ortiqcha matnni olib tashlab, faqat 3 kalit so'z va bitta rasm qoldiring.", estMinutes: 8, xpReward: 30 },
      { key: 'daily-ppt-animations-transitions', track: Track.OFFICE, moduleKey: 'ppt-animations-transitions', prompt: "Bitta slaydga 'Fade' o'tishini va bitta elementga 'Entrance' animatsiyasini qo'llang.", estMinutes: 5, xpReward: 20 },
      { key: 'daily-ppt-infographics', track: Track.OFFICE, moduleKey: 'ppt-infographics', prompt: "Bitta SmartArt jarayon diagrammasi qo'shing va 3 bosqichni to'ldiring.", estMinutes: 8, xpReward: 30 },
      { key: 'daily-outlook-email-calendar', track: Track.OFFICE, moduleKey: 'outlook-email-calendar', prompt: "O'qituvchingizga rasmiy uslubda 3 jumlali email qoralamasi yozing (Drafts'da saqlang).", estMinutes: 5, xpReward: 20 },
      { key: 'daily-access-database-basics', track: Track.OFFICE, moduleKey: 'access-database-basics', prompt: "Bitta jadval yarating ('Kitoblar': nomi, muallifi, yili) va 3 qator ma'lumot kiriting.", estMinutes: 10, xpReward: 35 },

      { key: 'daily-html-foundations', track: Track.FRONTEND, moduleKey: 'html-foundations', prompt: "Yangi HTML fayl yarating: <header>, <main>, <footer> teglaridan foydalanib sahifa skeletini tuzing.", estMinutes: 5, xpReward: 20 },
      { key: 'daily-css-cyber-styling', track: Track.FRONTEND, moduleKey: 'css-cyber-styling', prompt: "Bitta div elementga flexbox bilan markazlashtirilgan joylashuv va neon soya (box-shadow) qo'shing.", estMinutes: 5, xpReward: 20 },
      { key: 'daily-js-logic-gates', track: Track.FRONTEND, moduleKey: 'js-logic-gates', prompt: "Tugma bosilganda matnni almashtiruvchi oddiy JavaScript funksiyasini yozing (addEventListener).", estMinutes: 8, xpReward: 30 },
      { key: 'daily-react-components', track: Track.FRONTEND, moduleKey: 'react-components', prompt: "Ikkita prop qabul qiluvchi (masalan, title, onClick) oddiy React komponentini yarating.", estMinutes: 8, xpReward: 30 },
      { key: 'daily-react-hooks-state', track: Track.FRONTEND, moduleKey: 'react-hooks-state', prompt: "useState bilan sanagich (counter) komponentini yozing: +1/-1 tugmalari.", estMinutes: 8, xpReward: 30 },
      { key: 'daily-typescript-types', track: Track.FRONTEND, moduleKey: 'typescript-types', prompt: "Bitta interfeys (masalan, User: id, name, email) yozing va uni funksiyaga argument sifatida qo'llang.", estMinutes: 8, xpReward: 30 },
      { key: 'daily-git-github-mastery', track: Track.FRONTEND, moduleKey: 'git-github-mastery', prompt: "Yangi branch yarating, bitta faylni o'zgartirib commit qiling va push qiling.", estMinutes: 10, xpReward: 35 },
      { key: 'daily-api-fetch-requests', track: Track.FRONTEND, moduleKey: 'api-fetch-requests', prompt: "fetch() yordamida ochiq API'dan ma'lumot olib, konsolga chiqaring.", estMinutes: 10, xpReward: 35 },
      { key: 'daily-tailwind-utility-first', track: Track.FRONTEND, moduleKey: 'tailwind-utility-first', prompt: "Bitta kartani faqat Tailwind klasslari bilan (padding, rounded, shadow) uslublang.", estMinutes: 5, xpReward: 20 },
      { key: 'daily-react-router-navigation', track: Track.FRONTEND, moduleKey: 'react-router-navigation', prompt: "Ikki sahifali (Home/About) oddiy marshrutlashni sozlang.", estMinutes: 10, xpReward: 35 },
      { key: 'daily-forms-validation', track: Track.FRONTEND, moduleKey: 'forms-validation', prompt: "Email maydoni bo'sh yoki noto'g'ri formatda bo'lsa xato xabarini ko'rsatuvchi forma yozing.", estMinutes: 10, xpReward: 35 },
      { key: 'daily-state-management', track: Track.FRONTEND, moduleKey: 'state-management', prompt: "Context API yordamida ikki komponent orasida oddiy holatni (masalan, tema: dark/light) ulashing.", estMinutes: 10, xpReward: 35 },
      { key: 'daily-animations-framer-motion', track: Track.FRONTEND, moduleKey: 'animations-framer-motion', prompt: "Framer Motion bilan bitta elementga hover animatsiyasi (scale) qo'shing.", estMinutes: 5, xpReward: 20 },
      { key: 'daily-web-performance', track: Track.FRONTEND, moduleKey: 'web-performance', prompt: 'Bitta rasmga lazy loading (loading="lazy") qo\'llang va sahifa yuklanish tezligini solishtiring.', estMinutes: 8, xpReward: 30 },
      { key: 'daily-testing-jest-rtl', track: Track.FRONTEND, moduleKey: 'testing-jest-rtl', prompt: "Oddiy funksiya (masalan, sum(a,b)) uchun bitta Jest testi yozing.", estMinutes: 8, xpReward: 30 },
    ],
    skipDuplicates: true,
  });

  const cyberSentinels = await prisma.team.findUniqueOrThrow({ where: { tag: 'CYBS' } });

  await prisma.user.update({
    where: { id: frontendStudent.id },
    data: { teamId: cyberSentinels.id, teamRole: 'MEMBER' },
  });

  // eslint-disable-next-line no-console
  console.log('Seed complete. Demo accounts (password: %s):', DEMO_PASSWORD);
  // eslint-disable-next-line no-console
  console.log('  teacher@techquest.dev / admin@techquest.dev');
  // eslint-disable-next-line no-console
  console.log('  frontend@techquest.dev (FRONTEND) / robotics@techquest.dev (ROBOTICS) / office@techquest.dev (OFFICE)');
  // eslint-disable-next-line no-console
  console.log('  backend@techquest.dev (BACKEND)');
  const problemLessonsCovered = new Set(backendLessonProblems.map((problem) => problem.lessonKey)).size;
  const testCaseCount = backendLessonProblems.reduce((total, problem) => total + problem.testCases.length, 0);
  const quizLessonsCovered = new Set(backendLessonQuiz.map((question) => question.lessonKey)).size;
  // eslint-disable-next-line no-console
  console.log(
    '  Backend lesson practice problems synced: %d (%d ta darsda, %d ta test case)',
    lessonProblemsSynced,
    problemLessonsCovered,
    testCaseCount
  );
  // eslint-disable-next-line no-console
  console.log(
    '  Backend lesson quiz questions synced: %d (%d / %d ta dars qamrab olingan)',
    quizQuestionsSynced,
    quizLessonsCovered,
    backendLessons.length
  );
  // eslint-disable-next-line no-console
  console.log('  Project rubrics synced: %d', projectRubricsSynced);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
