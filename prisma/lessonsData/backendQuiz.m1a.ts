// Hand-authored MCQs derived from the lesson decks' TEKSHIRUV slides.
//
// Scope: backend lessons 1..6 (`backend-dars-01` .. `backend-dars-06`), 5 questions each = 30.
// Every prompt is a light rewrite of the original open recap question so that it has exactly one
// defensible answer. Distractors are real beginner misconceptions for that exact topic — index-1
// counting, `//` rounding, `%` as percent, `input()` guessing the type, methods mutating in place —
// so a wrong pick is diagnostic rather than decorative.
//
// `explanation` is shown to the student AFTER they answer; it is the teaching moment.

/**
 * One auto-gradable multiple-choice recap question attached to a lesson.
 *
 * Not declared in `./types.ts` (that file describes the deck-extracted shapes only), so the
 * contract lives here and is imported by the seeding code.
 */
export interface LessonQuizRecord {
  /** Lesson `key` this question belongs to, e.g. `backend-dars-01`. */
  lessonKey: string;
  /** 1..5 — position of the question inside the lesson. Unique per lesson. */
  order: number;
  /** The question text, in Uzbek. */
  prompt: string;
  /** Exactly four answer options, in Uzbek. */
  choices: [string, string, string, string];
  /** 0-based index into `choices` of the single correct option. Never sent to a student pre-answer. */
  correctIndex: number;
  /** 1-2 Uzbek sentences explaining WHY the correct answer is correct. Shown after answering. */
  explanation: string;
}

export const backendQuizM1a: LessonQuizRecord[] = [
  // ─────────────────────────────── Dars 01 — Dasturlashga kirish ───────────────────────────────
  {
    lessonKey: 'backend-dars-01',
    order: 1,
    prompt: 'print() buyrug\'i nima qiladi?',
    choices: [
      'Qavs ichidagi qiymatni ekranga chiqaradi',
      'Foydalanuvchidan klaviatura orqali ma\'lumot oladi',
      'Qiymatni xotirada saqlab qo\'yadi, lekin ko\'rsatmaydi',
      'Kodni printerga yuborib, qog\'ozga chop etadi',
    ],
    correctIndex: 0,
    explanation:
      'print() — chiqarish buyrug\'i: qavs ichiga nima yozsangiz, o\'shani ekranga ko\'rsatadi. Nomi «chop etish» degani bo\'lsa ham, u printer bilan ham, xotirada saqlash bilan ham ishlamaydi.',
  },
  {
    lessonKey: 'backend-dars-01',
    order: 2,
    prompt: 'Satr boshidagi # belgisi nima qiladi?',
    choices: [
      'Satrni ekranga print() kabi chiqaradi',
      'Satrni Python baribir bajaradi, faqat rangi o\'zgaradi',
      'Satrni izohga aylantiradi — Python uni umuman bajarmaydi',
      'Satrni sarlavhaga aylantirib, yirik shriftda ko\'rsatadi',
    ],
    correctIndex: 2,
    explanation:
      '# dan keyingi hamma narsa izoh: u faqat odam o\'qishi uchun yoziladi va Python uni butunlay tashlab ketadi. Muharrirda rangi o\'zgargani — bu shunchaki ko\'rinish, kod bajarilmaydi.',
  },
  {
    lessonKey: 'backend-dars-01',
    order: 3,
    prompt: 'print(Salom) deb — ya\'ni matnni qo\'shtirnoqsiz — yozsak nima bo\'ladi?',
    choices: [
      'Ekranga Salom chiqadi, qo\'shtirnoq shunchaki bezak',
      'Xatolik chiqadi: Python «Salom» ni o\'zgaruvchi nomi deb qidiradi',
      'Python qo\'shtirnoqni o\'zi qo\'shib qo\'yadi',
      'Satr izoh deb hisoblanadi va e\'tiborsiz qoldiriladi',
    ],
    correctIndex: 1,
    explanation:
      'Qo\'shtirnoq Pythonga «bu matn» deb aytadi. Qo\'shtirnoqsiz Salom — bu nom, Python esa shunday nomli o\'zgaruvchini topolmay NameError beradi.',
  },
  {
    lessonKey: 'backend-dars-01',
    order: 4,
    prompt: 'Algoritm nima? Eng to\'g\'ri ta\'rifni tanlang.',
    choices: [
      'Faqat matematiklar ishlatadigan maxsus hisoblash formulasi',
      'Python tilida yozilgan va saqlangan tayyor dastur fayli',
      'Kompyuter ichidagi elektron qism — u buyruqlarni bajaradi',
      'Natijaga olib boradigan aniq qadamlar ketma-ketligi',
    ],
    correctIndex: 3,
    explanation:
      'Algoritm — bu til emas, fayl ham emas: u shunchaki «avval buni, keyin buni» degan aniq qadamlar. Choy damlash retsepti ham algoritm; dastur esa o\'sha algoritmning kompyuter tilidagi yozuvi.',
  },
  {
    lessonKey: 'backend-dars-01',
    order: 5,
    prompt: 'Python fayldagi kodni qanday tartibda bajaradi?',
    choices: [
      'Yuqoridan pastga qarab, satrma-satr',
      'Pastdan yuqoriga qarab, oxirgi satrdan boshlab',
      'Avval barcha print() larni, keyin qolgan satrlarni',
      'Tartib muhim emas — Python o\'zi qulay tartibni tanlaydi',
    ],
    correctIndex: 0,
    explanation:
      'Python faylni tepadan pastga, bitta-bitta satr bo\'ylab o\'qiydi va shu tartibda bajaradi. Shuning uchun o\'zgaruvchini ishlatishdan OLDIN uni yaratish shart.',
  },

  // ────────────────────────────────── Dars 02 — O'zgaruvchilar ──────────────────────────────────
  {
    lessonKey: 'backend-dars-02',
    order: 1,
    prompt: 'Pythonda = belgisi nima qiladi?',
    choices: [
      'Ikki tomon tengligini tekshiradi va True yoki False qaytaradi',
      'O\'ngdagi qiymatni chapdagi o\'zgaruvchiga yozib qo\'yadi',
      'Chapdagi qiymatni o\'ngdagi o\'zgaruvchiga yozib qo\'yadi',
      'Ikki tomondagi sonlarni qo\'shadi',
    ],
    correctIndex: 1,
    explanation:
      'Matematikada = «teng» degani, Pythonda esa u — o\'zlashtirish: yosh = 15 «yosh qutisiga 15 ni sol» demakdir. Tenglikni tekshirish uchun keyinroq boshqa belgi ishlatiladi.',
  },
  {
    lessonKey: 'backend-dars-02',
    order: 2,
    prompt: 'input() foydalanuvchi kiritgan qiymatni qaysi turda qaytaradi?',
    choices: [
      'Har doim int (butun son) turida',
      'Foydalanuvchi raqam yozsa int, harf yozsa str turida',
      'Turi yo\'q — u to\'g\'ridan-to\'g\'ri ekranga chiqadi',
      'Har doim str (matn) turida',
    ],
    correctIndex: 3,
    explanation:
      'input() nima yozilganidan qat\'i nazar HAR DOIM matn qaytaradi — «25» ham matn. Shuning uchun u bilan hisoblash uchun qiymatni songa aylantirish kerak bo\'ladi.',
  },
  {
    lessonKey: 'backend-dars-02',
    order: 3,
    prompt: '«1-ism» o\'zgaruvchi nomi nima uchun xato?',
    choices: [
      'Nom raqam bilan boshlangan va ichida chiziqcha bor',
      'Nom o\'zbek tilida yozilgani uchun',
      'Nom juda qisqa bo\'lgani uchun',
      'Nom qo\'shtirnoq ichiga olinmagani uchun',
    ],
    correctIndex: 0,
    explanation:
      'O\'zgaruvchi nomi harf yoki _ bilan boshlanishi kerak va ichida faqat harf, raqam, _ bo\'ladi. To\'g\'ri variant: birinchi_ism. Nomning tili yoki uzunligi muhim emas.',
  },
  {
    lessonKey: 'backend-dars-02',
    order: 4,
    prompt: 'f-string (masalan f"Salom, {ism}!") nima uchun ishlatiladi?',
    choices: [
      'Matnni katta harflarga aylantirish uchun',
      'Matnni float (kasr son) turiga o\'girish uchun',
      'Matn ichiga o\'zgaruvchi qiymatini {} orqali qo\'yish uchun',
      'Matnni ekranga tezroq chiqarish uchun',
    ],
    correctIndex: 2,
    explanation:
      'f harfi «format» degani, «float» emas. f qo\'yilgan matn ichida {ism} yozsangiz, Python uni o\'zgaruvchining haqiqiy qiymati bilan almashtiradi.',
  },
  {
    lessonKey: 'backend-dars-02',
    order: 5,
    prompt: 'print() qavsi ichiga nima yozish mumkin?',
    choices: [
      'Faqat qo\'shtirnoq ichidagi matn',
      'Matn ham, son ham, o\'zgaruvchi nomi ham',
      'Faqat o\'zgaruvchi nomi',
      'Faqat son',
    ],
    correctIndex: 1,
    explanation:
      'print() qavsiga chiqarmoqchi bo\'lgan har qanday qiymat yoziladi. O\'zgaruvchi nomini yozsangiz, uning ichidagi qiymat chiqadi — nomning o\'zi emas.',
  },

  // ───────────────────────────────── Dars 03 — Ma'lumot turlari ─────────────────────────────────
  {
    lessonKey: 'backend-dars-03',
    order: 1,
    prompt: 'int va float turlarining farqi nimada?',
    choices: [
      'int kichik sonlar uchun, float esa juda katta sonlar uchun',
      'int musbat sonlar uchun, float esa manfiy sonlar uchun',
      'int qo\'shtirnoq ichidagi son, float esa qo\'shtirnoqsiz son',
      'int — butun son (5), float — kasr qismi bor son (5.0 yoki 1.72)',
    ],
    correctIndex: 3,
    explanation:
      'Farq faqat nuqtada: int butun (5, -20), float esa kasrli (5.0, 1.72). Sonning kattaligi ham, ishorasi ham turni belgilamaydi.',
  },
  {
    lessonKey: 'backend-dars-03',
    order: 2,
    prompt: 'print("5" + "5") nima chiqaradi?',
    choices: [
      '10 — Python qo\'shtirnoqni e\'tiborsiz qoldiradi',
      '55 — ikkala qiymat ham matn, + ularni birlashtiradi',
      'Xatolik — matnni matnga qo\'shib bo\'lmaydi',
      '10.0 — natija float bo\'ladi',
    ],
    correctIndex: 1,
    explanation:
      'Qo\'shtirnoq ichidagi 5 — bu son emas, matn. Matnlar uchun + qo\'shish emas, ulash (birlashtirish) amali, shuning uchun natija 55 matni chiqadi.',
  },
  {
    lessonKey: 'backend-dars-03',
    order: 3,
    prompt: 'type(x) nima qaytaradi?',
    choices: [
      'x ning turini (int, str, float, bool)',
      'x ning uzunligini — nechta belgidan iboratligini',
      'x ning qiymatini ekranga chiqaradi',
      'x ni matn turiga aylantiradi',
    ],
    correctIndex: 0,
    explanation:
      'type() faqat «bu nima turdagi qiymat?» degan savolga javob beradi. U hech narsani o\'zgartirmaydi va o\'zi ekranga chiqarmaydi — ko\'rish uchun print(type(x)) yozish kerak.',
  },
  {
    lessonKey: 'backend-dars-03',
    order: 4,
    prompt: 'input() bilan olingan yoshni 1 ga oshirmoqchisiz. To\'g\'ri yo\'l qaysi?',
    choices: [
      'Hech narsa kerak emas — Python raqamni o\'zi tushunadi',
      'type(yosh) + 1 deb yozish kerak',
      'yosh = int(input(...)) qilib, keyin yosh + 1 deb yozish',
      'str(yosh) + 1 deb yozish kerak',
    ],
    correctIndex: 2,
    explanation:
      'input() matn qaytargani uchun avval int() bilan songa aylantirish shart. type() turni faqat aytadi, o\'zgartirmaydi; str() esa aksincha, matnga o\'giradi.',
  },
  {
    lessonKey: 'backend-dars-03',
    order: 5,
    prompt: 'Quyidagi o\'zgaruvchi nomlaridan qaysi biri qoidalarga to\'liq mos?',
    choices: [
      '2-talaba',
      'talaba yoshi',
      'talaba-yoshi',
      'talaba_yoshi',
    ],
    correctIndex: 3,
    explanation:
      'Nom raqam bilan boshlanmasligi, ichida bo\'sh joy va chiziqcha bo\'lmasligi kerak — so\'zlarni ajratish uchun pastki chiziq _ ishlatiladi. Shu bilan birga nom ma\'noli bo\'lgani yaxshi.',
  },

  // ─────────────────────────────── Dars 04 — Arifmetik operatorlar ───────────────────────────────
  {
    lessonKey: 'backend-dars-04',
    order: 1,
    prompt: '7 / 2 va 7 // 2 mos ravishda nima beradi?',
    choices: [
      '3.5 va 3',
      '3 va 3.5',
      '3.5 va 4',
      'Ikkalasi ham 3.5',
    ],
    correctIndex: 0,
    explanation:
      '/ har doim kasr (float) natija beradi — 3.5. // esa butun bo\'lish: kasr qismini yaxlitlamay tashlab yuboradi, shuning uchun 4 emas, 3 chiqadi.',
  },
  {
    lessonKey: 'backend-dars-04',
    order: 2,
    prompt: '% amali nima qaytaradi?',
    choices: [
      'Sondan foiz oladi — 50 % 10 bu 50 ning 10 foizi',
      'Bo\'linmaning butun qismini',
      'Bo\'lishdan keyin qolgan qoldiqni',
      'Sonni 100 ga bo\'ladi',
    ],
    correctIndex: 2,
    explanation:
      'Pythonda % — foiz emas, qoldiq: 7 % 2 = 1, chunki 7 ni 2 ga bo\'lganda 1 qoladi. Shuning uchun son % 2 == 0 bo\'lsa, u juft son.',
  },
  {
    lessonKey: 'backend-dars-04',
    order: 3,
    prompt: '2 ** 5 nechchi?',
    choices: [
      '10',
      '32',
      '25',
      '64',
    ],
    correctIndex: 1,
    explanation:
      '** — daraja amali: 2 ** 5 bu 2 ni 5 marta ko\'paytirish (2·2·2·2·2 = 32). 10 — bu 2*5, 25 esa 5 ** 2, ya\'ni asos bilan daraja almashtirib yuborilgan.',
  },
  {
    lessonKey: 'backend-dars-04',
    order: 4,
    prompt: 'int() qaysi holatda kerak bo\'ladi?',
    choices: [
      'Har bir o\'zgaruvchini yaratishdan oldin, turini e\'lon qilish uchun',
      'Sonni ekranga chiqarishdan oldin, har safar',
      'Kasr sonni eng yaqin butun songa yaxlitlash uchun',
      'input() qaytargan matnni son sifatida hisoblashda ishlatish uchun',
    ],
    correctIndex: 3,
    explanation:
      'int() ning asosiy vazifasi — matnni songa aylantirish, ayniqsa input() dan keyin. E\'tibor bering: int(3.9) 4 emas, 3 beradi — u yaxlitlamaydi, kasr qismini tashlaydi.',
  },
  {
    lessonKey: 'backend-dars-04',
    order: 5,
    prompt: 'Quyidagi o\'zgaruvchi nomlaridan qaysi biri Pythonda xatolikka olib keladi?',
    choices: [
      'jami_narx',
      'son2',
      '2_son',
      '_natija',
    ],
    correctIndex: 2,
    explanation:
      'Nom raqam bilan BOSHLANA olmaydi, lekin ichida raqam bo\'lishi mumkin — shuning uchun son2 to\'g\'ri, 2_son esa xato. Pastki chiziq bilan boshlash ham ruxsat etiladi.',
  },

  // ────────────────────────────────── Dars 05 — Satrlar (1) ──────────────────────────────────
  {
    lessonKey: 'backend-dars-05',
    order: 1,
    prompt: 'Satrdagi birinchi harfning indeksi nechchi?',
    choices: [
      '0',
      '1',
      '-1',
      'Satr uzunligiga teng',
    ],
    correctIndex: 0,
    explanation:
      'Pythonda sanoq 0 dan boshlanadi, shuning uchun "SALOM" so\'zida S — s[0], A — s[1]. Odatdagi «birinchi = 1» hisobi bu yerda ishlamaydi.',
  },
  {
    lessonKey: 'backend-dars-05',
    order: 2,
    prompt: 's = "SALOM" bo\'lsa, s[-1] nima beradi?',
    choices: [
      'Xatolik — manfiy indeks bo\'lmaydi',
      'Birinchi harfni, ya\'ni S ni',
      'Oxirgidan oldingi harfni, ya\'ni O ni',
      'Oxirgi harfni, ya\'ni M ni',
    ],
    correctIndex: 3,
    explanation:
      'Manfiy indeks oxiridan sanaydi: -1 oxirgi harf, -2 undan oldingisi. Bu satr uzunligini bilmasdan oxirgi belgini olishning eng qisqa yo\'li.',
  },
  {
    lessonKey: 'backend-dars-05',
    order: 3,
    prompt: '"SALOM"[1:3] nima chiqaradi?',
    choices: [
      'ALO',
      'AL',
      'SA',
      'SAL',
    ],
    correctIndex: 1,
    explanation:
      'Kesishda boshlanish indeksi kiradi, tugash indeksi esa KIRMAYDI: 1 va 2 indeksli harflar olinadi — A va L. Shuning uchun ALO emas, AL chiqadi.',
  },
  {
    lessonKey: 'backend-dars-05',
    order: 4,
    prompt: '7 % 2 nechchi va bu nimani bildiradi?',
    choices: [
      '3.5 — bo\'linma kasr chiqdi',
      '3 — bo\'linmaning butun qismi',
      '1 — qoldiq bor, demak 7 toq son',
      '0 — qoldiq yo\'q, demak 7 juft son',
    ],
    correctIndex: 2,
    explanation:
      '7 ni 2 ga bo\'lganda 3 ta juftlik chiqadi va 1 ta ortadi, ya\'ni qoldiq 1. Qoldiq 0 bo\'lmagani uchun son toq.',
  },
  {
    lessonKey: 'backend-dars-05',
    order: 5,
    prompt: 'int() va str() funksiyalarining farqi nimada?',
    choices: [
      'int() qiymatni butun songa, str() esa matnga aylantiradi',
      'int() sonni yaxlitlaydi, str() esa uning uzunligini beradi',
      'int() faqat musbat, str() faqat manfiy qiymatlar bilan ishlaydi',
      'int() qiymatning turini tekshiradi, str() esa uni ekranga chiqaradi',
    ],
    correctIndex: 0,
    explanation:
      'Ikkalasi ham turni o\'zgartiradi, faqat qarama-qarshi yo\'nalishda: int("25") → 25 (son), str(25) → "25" (matn). Turni tekshirish — bu type() ning vazifasi.',
  },

  // ────────────────────────────────── Dars 06 — Satrlar (2) ──────────────────────────────────
  {
    lessonKey: 'backend-dars-06',
    order: 1,
    prompt: 's = "ali" edi. s.upper() bajarilgandan keyin print(s) nima chiqaradi?',
    choices: [
      'ALI — metod satrni katta harflarga o\'zgartirib qo\'yadi',
      'ali — metod asl satrni o\'zgartirmaydi, faqat yangisini qaytaradi',
      'Xatolik — natija hech qayerga saqlanmadi',
      'Bo\'sh satr',
    ],
    correctIndex: 1,
    explanation:
      'Satr metodlari asl satrga tegmaydi — ular YANGI satr qaytaradi. Natijani ko\'rish uchun uni saqlash kerak: s = s.upper().',
  },
  {
    lessonKey: 'backend-dars-06',
    order: 2,
    prompt: 'split() nima qaytaradi?',
    choices: [
      'So\'zlardan iborat ro\'yxatni',
      'So\'zlar sonini — butun son ko\'rinishida',
      'Bo\'sh joylari olib tashlangan bitta satrni',
      'Har bir harfni alohida element qilib',
    ],
    correctIndex: 0,
    explanation:
      'split() gapni bo\'sh joylar bo\'yicha kesib, so\'zlar ro\'yxatini beradi: "men keldim".split() → ["men", "keldim"]. So\'zlar sonini bilish uchun o\'sha ro\'yxatga len() qo\'llanadi.',
  },
  {
    lessonKey: 'backend-dars-06',
    order: 3,
    prompt: 'strip() nima qiladi?',
    choices: [
      'Satr ichidagi BARCHA bo\'sh joylarni olib tashlaydi',
      'Satrni so\'zlarga bo\'lib chiqadi',
      'Satrdagi harflarni kichik harfga aylantiradi',
      'Satr boshi va oxiridagi ortiqcha bo\'sh joylarni olib tashlaydi',
    ],
    correctIndex: 3,
    explanation:
      'strip() faqat chekkalarni tozalaydi: " ALI ".strip() → "ALI", lekin "men keldim" ichidagi bo\'sh joy o\'z joyida qoladi. Shuning uchun u input() dan kelgan qiymatni tozalashda ishlatiladi.',
  },
  {
    lessonKey: 'backend-dars-06',
    order: 4,
    prompt: 's = "python" bo\'lsa, s[-1] nima beradi?',
    choices: [
      'p',
      'o',
      'n',
      'Xatolik',
    ],
    correctIndex: 2,
    explanation:
      '-1 indeksi oxirgi belgini bildiradi, "python" so\'zining oxirgi harfi esa n. Birinchi harfni olish uchun s[0] yozilardi.',
  },
  {
    lessonKey: 'backend-dars-06',
    order: 5,
    prompt: '10 // 3 va 10 % 3 mos ravishda nechchi?',
    choices: [
      '3.33 va 1',
      '3 va 1',
      '1 va 3',
      '3 va 3.33',
    ],
    correctIndex: 1,
    explanation:
      '// butun bo\'linmani beradi (3 ta uchlik sig\'adi), % esa qoldiqni (10 − 9 = 1). Kasrli 3.33 natijani faqat oddiy / amali beradi.',
  },
];
