import { PrismaClient, Track, Role, Difficulty } from '@prisma/client';
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

const generatedProblems = [
  ...easyA, ...easyB, ...easyC, ...easyD,
  ...mediumA, ...mediumB, ...mediumC, ...mediumD,
  ...hardA, ...hardB, ...hardC, ...hardD,
  ...expertA, ...expertB, ...expertC, ...expertD,
  ...masterA, ...masterB, ...masterC,
].map((p) => ({ ...p, difficulty: p.difficulty as Difficulty }));

const prisma = new PrismaClient();

const DEMO_PASSWORD = 'password123';

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
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(params.email)}`,
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

  const frontendClass = await prisma.classGroup.create({
    data: {
      title: 'Frontend Veb Ustaligi',
      track: Track.FRONTEND,
      teacherId: teacher.id,
      schedule: 'Dush/Chor soat 10:00',
    },
  });
  const roboticsClass = await prisma.classGroup.create({
    data: {
      title: 'Robototexnika Muhandisligi 101',
      track: Track.ROBOTICS,
      teacherId: teacher.id,
      schedule: 'Sesh/Pay soat 14:00',
    },
  });
  const officeClass = await prisma.classGroup.create({
    data: {
      title: 'Ofis Unumdorligi',
      track: Track.OFFICE,
      teacherId: teacher.id,
      schedule: 'Juma soat 13:00',
    },
  });

  await prisma.enrollment.createMany({
    data: [
      { userId: frontendStudent.id, classId: frontendClass.id },
      { userId: roboticsStudent.id, classId: roboticsClass.id },
      { userId: officeStudent.id, classId: officeClass.id },
    ],
    skipDuplicates: true,
  
  });

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
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
