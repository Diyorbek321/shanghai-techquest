// Second set of questions for backend lessons 1..3 (orders 6..10), bringing each to 10 —
// enough for a full Jonli viktorina round (src/server/live). Same rules as backendQuiz.m1a.ts:
// strictly inside the lesson's own topic, one defensible answer, distractors drawn from real
// beginner mistakes. Every code-output answer was checked by running it on Python 3.10.
import type { LessonQuizRecord } from './backendQuiz.m1a';

export const backendQuizM1c: LessonQuizRecord[] = [
  // ─────────────────────────────── Dars 01 — Dasturlashga kirish ───────────────────────────────
  {
    lessonKey: 'backend-dars-01',
    order: 6,
    prompt: `print("Salom", "dunyo") ekranga nima chiqaradi?`,
    choices: ['Salomdunyo', 'Salom dunyo', 'Salom, dunyo', 'Xatolik: print() faqat bitta matn oladi'],
    correctIndex: 1,
    explanation: `print() ga vergul bilan bir nechta qiymat berish mumkin — u ularni orasiga bitta bo'sh joy qo'yib chiqaradi. Vergulning o'zi ekranga chiqmaydi.`,
  },
  {
    lessonKey: 'backend-dars-01',
    order: 7,
    prompt: `Ketma-ket ikki satr yozildi: print("A") va undan keyin print("B"). Natija qanday ko'rinadi?`,
    choices: ['AB — bir qatorda, yopishib', 'A B — bir qatorda, bo\'sh joy bilan', 'A va B — ikki alohida qatorda', 'Faqat B — ikkinchisi birinchisini o\'chiradi'],
    correctIndex: 2,
    explanation: `Har bir print() o'z ishini tugatgach yangi qatorga o'tadi. Shuning uchun ikkita print() — ikkita alohida qator.`,
  },
  {
    lessonKey: 'backend-dars-01',
    order: 8,
    prompt: `print("2 + 3") ekranga nima chiqaradi?`,
    choices: ['5', '23', 'Xatolik chiqadi', '2 + 3'],
    correctIndex: 3,
    explanation: `Qo'shtirnoq ichidagi hamma narsa — oddiy matn, Python uni hisoblamaydi. 5 ni ko'rish uchun qo'shtirnoqsiz yozish kerak: print(2 + 3).`,
  },
  {
    lessonKey: 'backend-dars-01',
    order: 9,
    prompt: `Faylda ikki satr bor: birinchisi # print("A"), ikkinchisi print("B"). Ekranga nima chiqadi?`,
    choices: ['Faqat B', 'Avval A, keyin B', 'Faqat A', 'Hech narsa — # butun faylni o\'chiradi'],
    correctIndex: 0,
    explanation: `# faqat O'Z satrini izohga aylantiradi. Birinchi satr bajarilmaydi, ikkinchisi esa odatdagidek ishlaydi — ekranda faqat B.`,
  },
  {
    lessonKey: 'backend-dars-01',
    order: 10,
    prompt: `Print("Salom") — katta P harfi bilan — yozilsa nima bo'ladi?`,
    choices: [
      'Salom chiqadi — harfning katta-kichikligi farqsiz',
      'SALOM katta harflarda chiqadi',
      'Python avtomatik tuzatib, print() ni bajaradi',
      'Xatolik: Python katta va kichik harfni farqlaydi, Print degan buyruq yo\'q',
    ],
    correctIndex: 3,
    explanation: `Python uchun Print va print — ikki xil nom. Faqat kichik harfli print() mavjud, shuning uchun Print("Salom") NameError beradi.`,
  },

  // ─────────────────────────────── Dars 02 — O'zgaruvchilar ───────────────────────────────
  {
    lessonKey: 'backend-dars-02',
    order: 6,
    prompt: `x = 5; x = 8; print(x) — natija qanday?`,
    choices: ['5', '13', '8', '5 va 8'],
    correctIndex: 2,
    explanation: `O'zgaruvchi bitta quti: yangi qiymat solinsa, eskisi o'rniga tushadi. Oxirgi yozilgan 8 qoladi — qiymatlar qo'shilmaydi ham, yig'ilmaydi ham.`,
  },
  {
    lessonKey: 'backend-dars-02',
    order: 7,
    prompt: `a = 3; b = a; a = 10; print(b) — natija qanday?`,
    choices: ['3', '10', '13', 'Xatolik: b ga son berilmagan'],
    correctIndex: 0,
    explanation: `b = a yozilgan PAYTDA a ichida 3 bor edi, b o'sha 3 ni oldi. Keyin a ga 10 solinishi b ni o'zgartirmaydi.`,
  },
  {
    lessonKey: 'backend-dars-02',
    order: 8,
    prompt: `ism = "Ali"; print("Salom, ism") — ekranga nima chiqadi?`,
    choices: ['Salom, Ali', 'Salom, ism', 'Salom, "Ali"', 'Xatolik chiqadi'],
    correctIndex: 1,
    explanation: `ism so'zi qo'shtirnoq ICHIDA — demak bu shunchaki matn, o'zgaruvchi emas. Qiymatni chiqarish uchun f-string kerak: print(f"Salom, {ism}").`,
  },
  {
    lessonKey: 'backend-dars-02',
    order: 9,
    prompt: `ism = "Vali"; print("Salom, {ism}!") — f harfi unutilgan. Natija?`,
    choices: ['Salom, Vali!', 'Xatolik: f yo\'q', 'Salom, {ism}!', 'Salom, !'],
    correctIndex: 2,
    explanation: `{ } faqat f-string ichida qiymat bilan almashtiriladi. f bo'lmasa, bu oddiy matn va jingalak qavslar ham, ism so'zi ham o'zgarishsiz chiqadi.`,
  },
  {
    lessonKey: 'backend-dars-02',
    order: 10,
    prompt: `Ism = "Ali"; print(ism) — natija qanday?`,
    choices: [
      'Ali',
      'ism',
      'Ism',
      'Xatolik: Ism va ism — ikki xil nom, ism yaratilmagan',
    ],
    correctIndex: 3,
    explanation: `O'zgaruvchi nomlarida katta-kichik harf muhim: Ism yaratildi, lekin ism emas. Python ism ni topolmay NameError beradi.`,
  },

  // ─────────────────────────────── Dars 03 — Ma'lumot turlari ───────────────────────────────
  {
    lessonKey: 'backend-dars-03',
    order: 6,
    prompt: `type(3.0) nima qaytaradi?`,
    choices: [`<class 'int'>`, `<class 'float'>`, `<class 'str'>`, `<class 'bool'>`],
    correctIndex: 1,
    explanation: `Nuqtasi bor son — float, hatto nuqtadan keyin 0 bo'lsa ham. 3 — int, 3.0 — float: qiymati teng, turi esa boshqa.`,
  },
  {
    lessonKey: 'backend-dars-03',
    order: 7,
    prompt: `print(int("7") + 3) natijasi qanday?`,
    choices: ['10', '73', '7 3', 'Xatolik: matnga son qo\'shib bo\'lmaydi'],
    correctIndex: 0,
    explanation: `int("7") matnni haqiqiy 7 soniga aylantiradi, keyin oddiy qo'shish bajariladi: 7 + 3 = 10.`,
  },
  {
    lessonKey: 'backend-dars-03',
    order: 8,
    prompt: `print(int(3.9)) nima chiqaradi?`,
    choices: ['4', '3.9', '3', 'Xatolik: kasr sonni int ga aylantirib bo\'lmaydi'],
    correctIndex: 2,
    explanation: `int() kasr qismini yaxlitlamaydi — shunchaki tashlab yuboradi. Shuning uchun 3.9 dan 4 emas, 3 chiqadi.`,
  },
  {
    lessonKey: 'backend-dars-03',
    order: 9,
    prompt: `Quyidagilardan qaysi biri bool turidagi qiymat?`,
    choices: [`"True"`, '1', `"rost"`, 'True'],
    correctIndex: 3,
    explanation: `bool turida faqat ikki qiymat bor: True va False — qo'shtirnoqsiz va katta harf bilan. "True" qo'shtirnoqda bo'lgani uchun str, 1 esa int.`,
  },
  {
    lessonKey: 'backend-dars-03',
    order: 10,
    prompt: `int("3.5") yozilsa nima bo'ladi?`,
    choices: ['3', 'Xatolik (ValueError): "3.5" butun son matni emas', '4', '3.5'],
    correctIndex: 1,
    explanation: `int() faqat butun son ko'rinishidagi matnni qabul qiladi. Nuqtali matn uchun avval float() kerak: int(float("3.5")) → 3.`,
  },
];
