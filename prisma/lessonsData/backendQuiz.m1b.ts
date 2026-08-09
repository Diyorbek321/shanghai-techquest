// Hand-authored MCQs derived from the lesson decks' TEKSHIRUV slides.
//
// Backend lessons 7..12 (Oy-1, hafta 3-4): shartli operatorlar, mantiqiy
// operatorlar, while, for/range, list, tuple + mini-loyiha.
//
// Har bir savol asl TEKSHIRUV savolining ma'nosini saqlaydi, faqat yagona
// to'g'ri javobga ega bo'lishi uchun qayta yozilgan. Chalg'ituvchi javoblar —
// aynan shu mavzudagi haqiqiy boshlang'ich xatolar (indeks 1 dan boshlanadi,
// range oxirgi sonni ham beradi, sort()/append() yangi ro'yxat qaytaradi va h.k.).

/**
 * One auto-gradable multiple-choice recap question attached to a lesson.
 *
 * `correctIndex` and `explanation` must never be serialized to a student before
 * they answer — redact them at the API boundary the way `judge.ts` redacts
 * hidden test cases.
 */
export interface LessonQuizRecord {
  /** Lesson key, e.g. `backend-dars-07`. */
  lessonKey: string;
  /** 1..5 — position of the question inside its lesson. */
  order: number;
  prompt: string;
  /** Exactly four Uzbek answer options. */
  choices: [string, string, string, string];
  /** 0..3 — index into `choices`. */
  correctIndex: number;
  /** Shown after answering: WHY the right answer is right. */
  explanation: string;
}

export const backendQuizM1b: LessonQuizRecord[] = [
  // ── Dars 07 — Shartli operatorlar ─────────────────────────────────────────
  {
    lessonKey: "backend-dars-07",
    order: 1,
    prompt: "Python'da = va == belgilari o'rtasidagi farq nima?",
    choices: [
      "= o'zgaruvchiga qiymat beradi, == esa ikki qiymatning tengligini tekshiradi",
      "= tenglikni tekshiradi, == esa o'zgaruvchiga qiymat beradi",
      "Ikkalasi bir xil ishlaydi, == shunchaki uzunroq yozuv",
      "= faqat sonlar uchun, == faqat matnlar uchun ishlatiladi",
    ],
    correctIndex: 0,
    explanation:
      "= — biriktirish: yosh = 18 o'zgaruvchiga qiymat yozadi. == — taqqoslash: yosh == 18 esa True yoki False qaytaradi. Shuning uchun if ichida doim == ishlatiladi.",
  },
  {
    lessonKey: "backend-dars-07",
    order: 2,
    prompt: "if / elif zanjirida elif sharti qachon tekshiriladi?",
    choices: [
      "Har doim — if sharti True bo'lganda ham tekshiriladi",
      "Faqat undan oldingi barcha shartlar False bo'lganda",
      "Faqat else bloki bajarilgandan keyin",
      "Faqat elif ichida == ishlatilgan bo'lsa",
    ],
    correctIndex: 1,
    explanation:
      "Python shartlarni yuqoridan pastga tekshiradi va birinchi True topilishi bilan to'xtaydi. Shuning uchun if sharti bajarilsa, elif umuman tekshirilmaydi.",
  },
  {
    lessonKey: "backend-dars-07",
    order: 3,
    prompt:
      "if satridan keyingi 4 ta bo'sh joy (indentatsiya) Python uchun nimani anglatadi?",
    choices: [
      "Faqat kodni chiroyli ko'rsatadi, Python uni e'tiborsiz qoldiradi",
      "O'sha satrda izoh boshlanganini bildiradi",
      "O'sha satrlar if blokiga tegishli ekanini — ya'ni shart bajarilsagina ishlashini",
      "Kod tezroq bajarilishini ta'minlaydi",
    ],
    correctIndex: 2,
    explanation:
      "Boshqa tillardagi { } o'rniga Python bloklarni aynan indentatsiya bilan ajratadi. Bo'sh joyni olib tashlasangiz, satr if dan chiqib ketadi va shart False bo'lganda ham bajariladi.",
  },
  {
    lessonKey: "backend-dars-07",
    order: 4,
    prompt: "gap = \"men kod yozaman\" bo'lsa, gap.split() nima qaytaradi?",
    choices: [
      "\"men kod yozaman\" — o'zgarmagan satrning o'zi",
      "3 — so'zlar soni",
      "\"men\" — faqat birinchi so'z",
      "['men', 'kod', 'yozaman'] — so'zlardan iborat ro'yxat",
    ],
    correctIndex: 3,
    explanation:
      "split() satrni bo'sh joylar bo'yicha bo'lib, ro'yxat qaytaradi. So'zlar soni kerak bo'lsa, o'sha ro'yxatni len() ga berish kerak: len(gap.split()).",
  },
  {
    lessonKey: "backend-dars-07",
    order: 5,
    prompt: "s = \"SALOM\" bo'lsa, s[0] va s[-1] navbati bilan nima beradi?",
    choices: [
      "\"S\" va \"M\"",
      "\"S\" va \"O\"",
      "\"A\" va \"M\"",
      "\"S\" va xato — Python'da manfiy indeks bo'lmaydi",
    ],
    correctIndex: 0,
    explanation:
      "Indeks 0 dan boshlanadi, shuning uchun s[0] — birinchi harf \"S\". Manfiy indeks oxiridan sanaydi va s[-1] aynan oxirgi harfni, ya'ni \"M\" ni beradi.",
  },

  // ── Dars 08 — Mantiqiy operatorlar ────────────────────────────────────────
  {
    lessonKey: "backend-dars-08",
    order: 1,
    prompt: "and va or operatorlarining natijasi qanday farq qiladi?",
    choices: [
      "and — kamida bitta shart True bo'lsa yetarli; or — ikkalasi ham True bo'lishi kerak",
      "and — ikkala shart ham True bo'lsagina True; or — kamida bittasi True bo'lsa True",
      "and sonlar uchun, or esa matnlar uchun ishlatiladi",
      "Ikkalasi bir xil ishlaydi, faqat yozilishi boshqacha",
    ],
    correctIndex: 1,
    explanation:
      "and — «ikkalasi ham kerak», or — «bittasi yetarli». Chipta narxini yozayotganda «yoshi 18 dan katta VA talaba» uchun and, «bolami YOKI nafaqaxo'r» uchun or ishlatiladi.",
  },
  {
    lessonKey: "backend-dars-08",
    order: 2,
    prompt: "not True ifodasining natijasi nima?",
    choices: [
      "True — not qiymatni o'zgartirmaydi, faqat tekshiradi",
      "0",
      "False",
      "Xato — not faqat sonlar bilan ishlaydi",
    ],
    correctIndex: 2,
    explanation:
      "not mantiqiy qiymatni teskarisiga aylantiradi: not True → False, not False → True. Shuning uchun if not topildi: kabi yozuv «topilmagan bo'lsa» degani.",
  },
  {
    lessonKey: "backend-dars-08",
    order: 3,
    prompt: "if 18 <= yosh <= 60: sharti qachon True bo'ladi?",
    choices: [
      "yosh 18 dan katta yoki teng VA 60 dan kichik yoki teng bo'lganda",
      "yosh aynan 18 yoki aynan 60 ga teng bo'lganda",
      "yosh 18 dan kichik YOKI 60 dan katta bo'lganda",
      "Bunday yozuv Python'da ishlamaydi — har doim and yozish shart",
    ],
    correctIndex: 0,
    explanation:
      "Python zanjirli taqqoslashni tushunadi: 18 <= yosh <= 60 aynan 18 <= yosh and yosh <= 60 bilan bir xil. Ikkala chegara ham qo'shiladi, chunki <= ishlatilgan.",
  },
  {
    lessonKey: "backend-dars-08",
    order: 4,
    prompt:
      "if / elif zanjirida bir nechta shart bir vaqtda True bo'lsa, qaysi blok bajariladi?",
    choices: [
      "True bo'lgan barcha shartlarning bloklari ketma-ket bajariladi",
      "Oxirgi True bo'lgan shartning bloki",
      "Birinchi True bo'lgan shartning bloki, qolgan shartlar umuman tekshirilmaydi",
      "else bloki bajariladi, chunki shartlar to'qnashdi",
    ],
    correctIndex: 2,
    explanation:
      "Zanjirdan faqat bitta blok ishlaydi — birinchi mos kelgani. Shu sababli shartlarni eng qattig'idan eng yumshog'iga qarab tartiblash kerak.",
  },
  {
    lessonKey: "backend-dars-08",
    order: 5,
    prompt:
      "gap = \"salom dunyo do'stlar\" bo'lsa, so'zlar sonini olish uchun qaysi yozuv to'g'ri?",
    choices: [
      "len(gap)",
      "gap.count(' ')",
      "gap.split()",
      "len(gap.split())",
    ],
    correctIndex: 3,
    explanation:
      "split() so'zlar ro'yxatini beradi, len() esa o'sha ro'yxat uzunligini — ya'ni so'zlar sonini. len(gap) belgilar sonini sanaydi, gap.count(' ') esa bo'sh joylarni sanab, bitta kam natija beradi.",
  },

  // ── Dars 09 — while sikli ─────────────────────────────────────────────────
  {
    lessonKey: "backend-dars-09",
    order: 1,
    prompt: "while sikli qachon to'xtaydi?",
    choices: [
      "Sikl tanasi bir marta bajarilib bo'lgach",
      "Navbatdagi tekshiruvda sharti False bo'lib qolganda",
      "10 marta aylanganidan keyin avtomatik ravishda",
      "Faqat ichida break yozilgan bo'lsagina",
    ],
    correctIndex: 1,
    explanation:
      "while har aylanish oldidan shartni qayta tekshiradi va u False bo'lishi bilan to'xtaydi. break — bu qo'shimcha imkoniyat, majburiy shart emas.",
  },
  {
    lessonKey: "backend-dars-09",
    order: 2,
    prompt: "break va continue o'rtasidagi farq nima?",
    choices: [
      "break siklni butunlay to'xtatadi, continue esa faqat shu aylanishni tashlab, keyingisiga o'tadi",
      "break shu aylanishni tashlaydi, continue esa siklni butunlay to'xtatadi",
      "Ikkalasi ham siklni to'xtatadi, farqi yo'q",
      "break butun dasturni yopadi, continue esa uni boshidan qayta ishga tushiradi",
    ],
    correctIndex: 0,
    explanation:
      "break sikldan butunlay chiqadi va boshqaruv sikldan keyingi satrga o'tadi. continue esa sikl tanasining qolgan qismini tashlab, darhol keyingi aylanishga o'tadi — sikl davom etaveradi.",
  },
  {
    lessonKey: "backend-dars-09",
    order: 3,
    prompt: "while siklining cheksiz aylanib qolishiga eng ko'p nima sabab bo'ladi?",
    choices: [
      "Shartda == o'rniga = yozib qo'yilgani",
      "Sikl ichida print() yozilmagani",
      "Sikl tanasida shartga ta'sir qiluvchi qiymat o'zgartirilmagani (masalan i += 1 unutilgani)",
      "while so'zidan keyin qavs qo'yilmagani",
    ],
    correctIndex: 2,
    explanation:
      "while sharti faqat sikl ichida biror qiymat o'zgarsagina False bo'la oladi. i += 1 unutilsa, i har doim bir xil qolib, shart abadiy True bo'lib turadi.",
  },
  {
    lessonKey: "backend-dars-09",
    order: 4,
    prompt:
      "yosh = 20 va talaba = False bo'lsa, yosh > 18 and talaba ifodasi nima qaytaradi?",
    choices: [
      "True — chunki yosh 18 dan katta",
      "Xato — bir ifodada son taqqoslash va True/False ni aralashtirib bo'lmaydi",
      "20 — birinchi ifodaning qiymati",
      "False — and uchun ikkala tomon ham True bo'lishi shart",
    ],
    correctIndex: 3,
    explanation:
      "and da bitta False butun ifodani False qiladi. yosh > 18 → True bo'lsa ham, talaba False bo'lgani uchun natija False bo'ladi.",
  },
  {
    lessonKey: "backend-dars-09",
    order: 5,
    prompt:
      "Baho qo'yishda nega if ball > 50 shartini elif ball > 90 dan OLDIN yozish xato bo'ladi?",
    choices: [
      "Python shartlarni pastdan yuqoriga qarab tekshirgani uchun",
      "elif > belgisi bilan ishlamagani uchun",
      "Hech qanday farqi yo'q — Python eng aniq shartni o'zi tanlaydi",
      "95 ball olgan talaba ham birinchi mos kelgan ball > 50 blokiga tushib qoladi, qolgan shartlar esa tekshirilmaydi",
    ],
    correctIndex: 3,
    explanation:
      "Zanjir birinchi True da to'xtaydi, shuning uchun eng qattiq shart (ball > 90) eng tepada turishi kerak. Aks holda kuchli talaba ham past bahoga tushib qoladi.",
  },

  // ── Dars 10 — for sikli va range() ────────────────────────────────────────
  {
    lessonKey: "backend-dars-10",
    order: 1,
    prompt: "for i in range(5): sikli i ga qaysi qiymatlarni beradi?",
    choices: [
      "1, 2, 3, 4, 5",
      "0, 1, 2, 3, 4",
      "0, 1, 2, 3, 4, 5",
      "Faqat 5 sonini",
    ],
    correctIndex: 1,
    explanation:
      "range(5) noldan boshlanadi va 5 gacha boradi — 5 ning o'zi kirmaydi. Jami 5 ta son chiqadi: 0 dan 4 gacha.",
  },
  {
    lessonKey: "backend-dars-10",
    order: 2,
    prompt: "for va while orasidan qaysi birini tanlashni nima hal qiladi?",
    choices: [
      "Necha marta takrorlanishi oldindan ma'lum bo'lsa for, noma'lum bo'lsa while",
      "for faqat sonlar bilan, while faqat matnlar bilan ishlaydi",
      "while har doim tezroq, shuning uchun doim while tanlanadi",
      "for eng ko'pi bilan 10 marta aylana oladi, undan ko'pi uchun while kerak",
    ],
    correctIndex: 0,
    explanation:
      "Ko'paytirish jadvali kabi aniq sonli takrorlash uchun for qulay va xavfsiz — sanoqchi avtomatik oshadi. «Foydalanuvchi 0 kiritgunicha» kabi noma'lum holatlarda esa while kerak.",
  },
  {
    lessonKey: "backend-dars-10",
    order: 3,
    prompt: "range(1, 10, 3) qaysi sonlarni chiqaradi?",
    choices: [
      "1, 4, 7, 10",
      "1, 2, 3 — uchinchi son nechta son chiqishini bildiradi",
      "3, 6, 9",
      "1, 4, 7",
    ],
    correctIndex: 3,
    explanation:
      "Uchinchi argument — qadam: 1 dan boshlab har safar 3 qo'shiladi. Keyingi son 10 bo'lardi, lekin range oxirgi chegarani kiritmaydi, shuning uchun sikl 7 da tugaydi.",
  },
  {
    lessonKey: "backend-dars-10",
    order: 4,
    prompt: "for sikli ichida break bajarilsa nima bo'ladi?",
    choices: [
      "Faqat shu aylanish tashlanadi, sikl keyingi element bilan davom etadi",
      "Butun dastur to'xtaydi",
      "Sikl darhol to'xtaydi va boshqaruv sikldan keyingi satrga o'tadi",
      "range() boshidan qayta hisoblanadi",
    ],
    correctIndex: 2,
    explanation:
      "break qolgan elementlarni umuman ko'rmasdan sikldan chiqadi. Faqat bitta aylanishni tashlab ketish kerak bo'lsa, continue ishlatiladi.",
  },
  {
    lessonKey: "backend-dars-10",
    order: 5,
    prompt: "s = \"PYTHON\" bo'lsa, s[1:4] nima beradi?",
    choices: ["\"YTHO\"", "\"YTH\"", "\"PYT\"", "\"HON\""],
    correctIndex: 1,
    explanation:
      "Kesish 1-indeksdan boshlanadi (\"Y\") va 4-indeksgacha boradi — 4 ning o'zi kirmaydi. Shuning uchun 1, 2, 3 indekslar: \"YTH\".",
  },

  // ── Dars 11 — List (ro'yxat) ──────────────────────────────────────────────
  {
    lessonKey: "backend-dars-11",
    order: 1,
    prompt: "append() va insert() metodlari o'rtasidagi farq nima?",
    choices: [
      "append elementni ro'yxat oxiriga qo'shadi, insert esa ko'rsatilgan indeksga qo'yadi",
      "append boshiga, insert esa oxiriga qo'shadi",
      "append bitta element qo'sha oladi, insert esa faqat butun ro'yxat qo'shadi",
      "append yangi ro'yxat qaytaradi, insert esa eskisini o'zgartiradi",
    ],
    correctIndex: 0,
    explanation:
      "append(x) har doim oxiriga yozadi, insert(i, x) esa x ni i-indeksga qo'yib, qolganlarini bir qadam o'ngga suradi. Ikkalasi ham ro'yxatning O'ZINI o'zgartiradi.",
  },
  {
    lessonKey: "backend-dars-11",
    order: 2,
    prompt: "a = [10, 20, 30] bo'lsa, a.remove(20) nima qiladi?",
    choices: [
      "20-indeksdagi elementni o'chiradi",
      "Ro'yxatdan 20 QIYMATINI topib, birinchi uchraganini o'chiradi",
      "Oxirgi elementni o'chirib, uni qaytaradi",
      "Ro'yxatning birinchi 20 ta elementini o'chiradi",
    ],
    correctIndex: 1,
    explanation:
      "remove() indeks bilan emas, qiymat bilan ishlaydi — natijada [10, 30] qoladi. Indeks bo'yicha o'chirish kerak bo'lsa, a.pop(1) yoki del a[1] ishlatiladi.",
  },
  {
    lessonKey: "backend-dars-11",
    order: 3,
    prompt: "a = [3, 1, 2] bo'lsa, a.sort() nima qaytaradi?",
    choices: [
      "Tartiblangan yangi ro'yxat [1, 2, 3] ni",
      "Ro'yxat uzunligini, ya'ni 3 ni",
      "None — u ro'yxatning o'zini joyida tartiblaydi",
      "Ro'yxatdagi eng kichik elementni",
    ],
    correctIndex: 2,
    explanation:
      "sort() ro'yxatni joyida o'zgartiradi va None qaytaradi — shuning uchun a = a.sort() yozsangiz, a ichida None qolib ketadi. Yangi ro'yxat kerak bo'lsa sorted(a) ishlatiladi.",
  },
  {
    lessonKey: "backend-dars-11",
    order: 4,
    prompt: "range(1, 5) nechta son beradi va ular qaysilar?",
    choices: [
      "5 ta — 1 dan 5 gacha",
      "6 ta — 0 dan 5 gacha",
      "3 ta — 2, 3, 4",
      "4 ta — 1, 2, 3, 4",
    ],
    correctIndex: 3,
    explanation:
      "range(a, b) a dan boshlanadi, lekin b ning o'ziga yetmaydi. Shuning uchun 1, 2, 3, 4 — jami 4 ta son.",
  },
  {
    lessonKey: "backend-dars-11",
    order: 5,
    prompt:
      "i = 0 deb qo'yib, keyin while i < 5: ichida faqat print(i) yozilsa, kod nima qiladi?",
    choices: [
      "0 dan 4 gacha sonlarni chiqarib to'xtaydi",
      "Hech narsa chiqarmaydi",
      "0 ni cheksiz marta chiqaradi, chunki i hech qachon o'zgarmaydi",
      "Xato beradi, chunki while ichida if bo'lishi shart",
    ],
    correctIndex: 2,
    explanation:
      "Sikl tanasida i ga tegilmagani uchun shart i < 5 abadiy True bo'lib qoladi. Uni to'g'rilash uchun print(i) dan keyin i += 1 yozish kerak.",
  },

  // ── Dars 12 — Tuple + Loyiha ──────────────────────────────────────────────
  {
    lessonKey: "backend-dars-12",
    order: 1,
    prompt: "Tuple va list o'rtasidagi asosiy farq nima?",
    choices: [
      "Tuple yaratilgandan keyin o'zgartirilmaydi, list esa o'zgartiriladi",
      "Tuple faqat sonlarni, list faqat matnlarni saqlaydi",
      "Tuple'da indeks 1 dan, list'da 0 dan boshlanadi",
      "Tuple ko'pi bilan 2 ta element saqlay oladi",
    ],
    correctIndex: 0,
    explanation:
      "Tuple — o'zgarmas (immutable) to'plam: unda append yoki remove yo'q. Indekslash, len() va for bilan yurish esa ikkalasida ham bir xil — 0 dan boshlanadi.",
  },
  {
    lessonKey: "backend-dars-12",
    order: 2,
    prompt: "Qaysi holatda list o'rniga tuple ishlatgan ma'qul?",
    choices: [
      "Ro'yxatga dastur davomida tez-tez yangi element qo'shilganda",
      "Ma'lumot dastur davomida umuman o'zgarmasligi kerak bo'lganda — masalan hafta kunlari",
      "Elementlar soni 10 tadan ko'p bo'lganda",
      "Ichida faqat sonlar saqlanganda",
    ],
    correctIndex: 1,
    explanation:
      "Tuple ma'lumotni tasodifiy o'zgartirishdan himoya qiladi. Hafta kunlari yoki oy nomlari kabi qat'iy ro'yxatlar uchun aynan shu kerak; element qo'shiladigan joyda esa list ishlatiladi.",
  },
  {
    lessonKey: "backend-dars-12",
    order: 3,
    prompt: "while True: siklidan qanday chiqiladi?",
    choices: [
      "Sikl ichida True ni False ga o'zgartirib qo'yish orqali",
      "Hech qanday yo'li yo'q — u har doim cheksiz ishlaydi",
      "Sikl ichida continue yozib",
      "Kerakli shart bajarilganda sikl ichida break yozib",
    ],
    correctIndex: 3,
    explanation:
      "while True sharti hech qachon o'zgarmaydi, shuning uchun yagona chiqish yo'li — break. continue esa siklni to'xtatmaydi, faqat keyingi aylanishga o'tkazadi.",
  },
  {
    lessonKey: "backend-dars-12",
    order: 4,
    prompt: "a = [1, 2] bo'lsa, a.append(3) nima qaytaradi?",
    choices: [
      "Yangi element qo'shilgan [1, 2, 3] ro'yxatini",
      "Ro'yxatning yangi uzunligini, ya'ni 3 ni",
      "None — u ro'yxatning o'zini joyida o'zgartiradi",
      "Qo'shilgan elementning indeksini, ya'ni 2 ni",
    ],
    correctIndex: 2,
    explanation:
      "append() ro'yxatni joyida o'zgartirib, None qaytaradi. Shuning uchun a = a.append(3) yozilsa, a ichida ro'yxat emas, None qolib ketadi — shunchaki a.append(3) yozish kerak.",
  },
  {
    lessonKey: "backend-dars-12",
    order: 5,
    prompt: "range(1, 5) va random.randint(1, 5) o'rtasida farq bormi?",
    choices: [
      "Farqi yo'q — ikkalasi ham 1 dan 5 gacha sonlarni beradi",
      "range 1, 2, 3, 4 ketma-ketligini beradi (5 kirmaydi), randint esa 1 va 5 ni ham qamrab, bitta tasodifiy son qaytaradi",
      "range tasodifiy son beradi, randint esa ketma-ketlik",
      "randint ham ketma-ketlik beradi, lekin teskari tartibda",
    ],
    correctIndex: 1,
    explanation:
      "range — takrorlash uchun ketma-ketlik va oxirgi chegarani kiritmaydi. randint — bitta tasodifiy son va ikkala chegarani ham qamrab oladi, shuning uchun «Sonni top» o'yinida aynan u ishlatiladi.",
  },
];
