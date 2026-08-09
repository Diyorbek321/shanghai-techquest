import type { LessonQuizRecord } from './backendQuiz.m1a';

// Hand-authored MCQs derived from the lesson decks' TEKSHIRUV slides.
//
// Scope: backend lessons 90..96 (`backend-dars-90` .. `backend-dars-96`), 5 questions each = 35.
// Every prompt is a light rewrite of the curriculum author's original open recap question so that
// it has exactly one defensible answer. Distractors are real beginner misconceptions for that exact
// topic — 403 vs 404 leaking existence, UUID/base64 as "IDOR fix", select_related and
// prefetch_related swapped, load test called a smoke test, "vazifa" instead of "natija" in a CV.
//
// `explanation` is shown to the student AFTER they answer; it is the teaching moment.

export const backendQuizB12: LessonQuizRecord[] = [
  // ───────────────────────────────── Dars 90 — Auth & Review ─────────────────────────────────
  {
    lessonKey: 'backend-dars-90',
    order: 1,
    prompt: 'IDOR zaifligi nima?',
    choices: [
      'Parolni ochiq matnda, xeshlamasdan saqlash',
      "URL yoki so'rovdagi id'ni almashtirib, boshqa foydalanuvchining obyektiga kirib olish imkoni",
      "Ma'lumotlar bazasida indeks yo'qligi sababli so'rovlarning sekinlashishi",
      "Bitta IP dan juda ko'p so'rov yuborib serverni bo'g'ib qo'yish",
    ],
    correctIndex: 1,
    explanation:
      "IDOR — Insecure Direct Object Reference: server obyektni id bo'yicha beradi-yu, «bu obyekt shu foydalanuvchiniki mi?» degan savolni bermaydi. /orders/17/ ni /orders/18/ ga o'zgartirgan odam begona ma'lumotni ko'radi.",
  },
  {
    lessonKey: 'backend-dars-90',
    order: 2,
    prompt:
      "Foydalanuvchi o'ziga tegishli bo'lmagan obyektni so'raganda nega 403 emas, 404 qaytarish tavsiya qilinadi?",
    choices: [
      '404 javobi serverga kamroq yuk beradi va tezroq qaytadi',
      "403 ni ba'zi brauzerlar ko'rsatmaydi, shuning uchun 404 ishonchliroq",
      "403 obyekt borligini oshkor qiladi, 404 esa uning bor-yo'qligini bildirmaydi",
      "403 faqat tizimga kirmagan foydalanuvchilar uchun ishlatiladi, boshqa holatda noto'g'ri",
    ],
    correctIndex: 2,
    explanation:
      "403 javobining o'zi ma'lumot sizdirib qo'yadi: hujumchi id'larni ketma-ket sinab, qaysi id mavjudligini aniqlab oladi. 404 esa «yo'q obyekt» bilan «sizga ruxsat yo'q» ni bir xil ko'rsatadi. 70-darsdagi 403 — obyekt queryset'da ochiq turgandagi DRF standarti; bu yerda esa uni ataylab o'zgartiramiz: get_queryset() ni request.user bo'yicha filtrlaymiz va DRF begona id uchun o'zi 404 beradi.",
  },
  {
    lessonKey: 'backend-dars-90',
    order: 3,
    prompt: 'Throttling (so\'rov cheklash) nimadan himoya qiladi?',
    choices: [
      "Bir foydalanuvchi yoki IP dan vaqt birligida keladigan so'rovlar sonini cheklab, brute-force va suiiste'moldan",
      "SQL in'ektsiyasidan — xavfli belgilarni so'rovdan olib tashlab",
      'Parol o\'g\'irlanishidan — parolni avtomatik xeshlab',
      "Katta javoblardan — JSON hajmini siqib, tarmoqni tejab",
    ],
    correctIndex: 0,
    explanation:
      "Throttling faqat bitta narsani qiladi: so'rovlar chastotasini cheklaydi. Bu login formasini soatiga minglab marta sinashni (brute-force) va API'ni suiiste'mol qilishni amalda imkonsiz qiladi.",
  },
  {
    lessonKey: 'backend-dars-90',
    order: 4,
    prompt: "Bir nechta yozuv amalini bitta tranzaksiyaga (atomic) o'rash nima uchun kerak?",
    choices: [
      "So'rovlarni keshlab, bazaga murojaatni tezlashtirish uchun",
      "Boshqa foydalanuvchilarga o'sha jadvalni o'qishni butunlay taqiqlash uchun",
      "Har bir o'zgarishdan oldin bazani avtomatik zaxiralash uchun",
      "Amallarning yo hammasi bajarilishi, yo hech biri bajarilmasligi uchun — yarim holat qolmasin",
    ],
    correctIndex: 3,
    explanation:
      "Tranzaksiya atomiklikni beradi. Pul o'tkazishda hisobdan yechildi-yu, ikkinchi hisobga qo'shishda xato chiqsa, tranzaksiya ikkala amalni ham bekor qiladi va pul yo'qolmaydi.",
  },
  {
    lessonKey: 'backend-dars-90',
    order: 5,
    prompt: 'ORM dagi select_related() aynan nima qiladi?',
    choices: [
      "Bog'liq ForeignKey obyektni JOIN orqali xuddi shu so'rovda birga olib keladi",
      "Jadvaldan faqat siz sanab o'tgan ustunlarni tanlaydi, qolganini tashlab ketadi",
      'Natijani xotira keshiga yozib qo\'yadi va keyingi safar bazaga bormaydi',
      "Bog'liq obyektlar uchun alohida ikkinchi so'rov yuborib, natijani Python'da birlashtiradi",
    ],
    correctIndex: 0,
    explanation:
      "select_related() — SQL JOIN. Oxirgi variant esa prefetch_related() ning ta'rifi: u ManyToMany va teskari bog'lanishlar uchun alohida so'rov qiladi.",
  },

  // ────────────────────────────────────── Dars 91 — Testlar ──────────────────────────────────────
  {
    lessonKey: 'backend-dars-91',
    order: 1,
    prompt: 'Test piramidasi testlar nisbatini qanday tavsiya qiladi?',
    choices: [
      "Ko'p E2E, o'rtacha API, kam unit test",
      "Har uch turdan taxminan teng miqdorda",
      "Ko'p unit, o'rtacha API, kam E2E test",
      "Faqat E2E test — u butun tizimni tekshirgani uchun qolganlari ortiqcha",
    ],
    correctIndex: 2,
    explanation:
      "Unit testlar arzon, tez va aniq joyni ko'rsatadi — shuning uchun ular piramidaning keng asosi. E2E testlar sekin va mo'rt, shuning uchun ular faqat eng muhim oqimlar uchun, uchida qoladi.",
  },
  {
    lessonKey: 'backend-dars-91',
    order: 2,
    prompt: 'pytest dagi @pytest.mark.parametrize nima uchun kerak?',
    choices: [
      'Testlarni bir nechta protsessorda parallel ishga tushirish uchun',
      'Testga tasodifiy kirish qiymatlarini avtomatik generatsiya qilish uchun',
      'Test funksiyasiga fixture (tayyorlangan obyekt) ulash uchun',
      "Bitta test funksiyasini turli «kirish → kutilgan natija» juftliklari bilan qayta-qayta ishga tushirish uchun",
    ],
    correctIndex: 3,
    explanation:
      "parametrize bir xil kodni nusxalashdan qutqaradi: 5 juftlik bersangiz, pytest 5 ta alohida test sifatida hisoblaydi va qaysi biri yiqilganini aniq aytadi.",
  },
  {
    lessonKey: 'backend-dars-91',
    order: 3,
    prompt: 'IDOR testi aynan nimani tekshiradi?',
    choices: [
      "Noto'g'ri parol kiritilganda tizimga kira olmaslikni",
      "A foydalanuvchi tokeni bilan B foydalanuvchining obyektiga so'rov yuborilganda ma'lumot berilmasligini (get_queryset() filtrlangani uchun 404)",
      "Token muddati tugagach so'rov 401 qaytishini",
      "Juda ko'p so'rov yuborilganda 429 qaytishini",
    ],
    correctIndex: 1,
    explanation:
      "IDOR testi autentifikatsiyani emas, AVTORIZATSIYAni sinaydi: token to'g'ri, foydalanuvchi haqiqiy — lekin obyekt uniki emas. Shuning uchun testda ikkita foydalanuvchi yaratiladi.",
  },
  {
    lessonKey: 'backend-dars-91',
    order: 4,
    prompt: "Quyidagilardan qaysi biri aynan IDOR zaifligiga misol bo'ladi?",
    choices: [
      "/api/orders/17/ dagi 17 ni 18 ga almashtirib, begona mijozning buyurtmasini ochish",
      "Izoh maydoniga <script> yozib yuborish",
      "Login formasiga parolni 1000 marta taxmin qilib sinash",
      "Qidiruv maydoniga ' OR 1=1 -- deb yozish",
    ],
    correctIndex: 0,
    explanation:
      "Qolgan uchtasi — XSS, brute-force va SQL in'ektsiyasi: ular boshqa zaifliklar. IDOR'da so'rov mutlaqo «normal», faqat id begona obyektga tegishli.",
  },
  {
    lessonKey: 'backend-dars-91',
    order: 5,
    prompt:
      "Pul o'tkazishda hisobdan yechish bajarildi, lekin ikkinchi hisobga qo'shishda xato chiqdi. Kod transaction.atomic ichida bo'lsa nima bo'ladi?",
    choices: [
      'Faqat xato bergan ikkinchi amal avtomatik qayta urinib ko\'riladi',
      "Birinchi amal saqlanib qoladi, ikkinchisi navbatga qo'yiladi",
      "Ikkala amal ham bekor qilinadi — baza tranzaksiyadan oldingi holatiga qaytadi",
      'Xato logga yoziladi, lekin birinchi amalning natijasi bazada qoladi',
    ],
    correctIndex: 2,
    explanation:
      "Tranzaksiya «hammasi yoki hech nima» qoidasiga bo'ysunadi: xato chiqsa rollback bo'ladi. Aynan shuning uchun pul yoki ombor qoldig'i bilan ishlaydigan har qanday ko'p bosqichli amal atomic ichida yoziladi.",
  },

  // ───────────────────────────────────── Dars 92 — Hujjatlash ─────────────────────────────────────
  {
    lessonKey: 'backend-dars-92',
    order: 1,
    prompt: 'OpenAPI nima?',
    choices: [
      "Autentifikatsiya protokoli — OAuth ning yangi nomi",
      "REST API tuzilishini mashina o'qiy oladigan standart formatda tavsiflash usuli",
      "API so'rovlarini keshlab beradigan maxsus server",
      "Internetdagi bepul ochiq API'lar katalogi",
    ],
    correctIndex: 1,
    explanation:
      "OpenAPI — bu sxema (endpointlar, parametrlar, javob shakllari) uchun standart. Aynan shu sxemadan Swagger UI kabi vositalar jonli, bosib ko'rish mumkin bo'lgan hujjat yasaydi. OAuth bilan aloqasi yo'q.",
  },
  {
    lessonKey: 'backend-dars-92',
    order: 2,
    prompt: 'N+1 muammosini amalda qanday topasiz?',
    choices: [
      'Sahifa necha soniyada ochilishini sekundomer bilan o\'lchab',
      "Serverning RAM sarfini kuzatib",
      "Bazadagi jadval hajmini tekshirib",
      "connection.queries yoki django-debug-toolbar bilan bitta sahifada nechta SQL so'rov ketganini sanab",
    ],
    correctIndex: 3,
    explanation:
      "N+1 ni faqat SO'ROVLAR SONI ko'rsatadi. 10 ta postni muallifi bilan chiqarsangiz, select_related'siz 11 ta so'rov (1 + 10) ketadi, select_related bilan esa atigi 1 ta. Sekundomer sekinlikni ko'rsatadi, lekin sababini aytmaydi.",
  },
  {
    lessonKey: 'backend-dars-92',
    order: 3,
    prompt: 'Indeks odatda qaysi ustunlarga qo\'yiladi?',
    choices: [
      "WHERE, JOIN va ORDER BY da tez-tez ishlatiladigan ustunlarga",
      "Jadvaldagi barcha ustunlarga — indeks qancha ko'p bo'lsa, shuncha yaxshi",
      "Faqat uzun matnli (TextField) ustunlarga",
      "Faqat birlamchi kalitga — boshqasiga indeks kerak emas",
    ],
    correctIndex: 0,
    explanation:
      "Indeks o'qishni tezlashtiradi, lekin har bir INSERT/UPDATE ni sekinlashtiradi va joy egallaydi. Shuning uchun u qidiruv, JOIN va tartiblashda haqiqatan ishlatiladigan ustunlarga qo'yiladi.",
  },
  {
    lessonKey: 'backend-dars-92',
    order: 4,
    prompt: 'Test piramidasida E2E testlar nega kam bo\'ladi?',
    choices: [
      "Ular hech qanday xatoni topa olmaydi",
      "Ular sekin ishlaydi va mo'rt — kichik o'zgarishdan ham yiqiladi",
      'Ularni backend loyihasida texnik jihatdan yozib bo\'lmaydi',
      "Ular faqat frontend uchun mo'ljallangan",
    ],
    correctIndex: 1,
    explanation:
      "E2E testlar butun tizimni tekshirgani uchun qimmatli, lekin sekin va tez-tez «shovqin» beradi. Shuning uchun ular faqat eng muhim oqimlar uchun yoziladi, qolgani unit va API testlarga tushadi.",
  },
  {
    lessonKey: 'backend-dars-92',
    order: 5,
    prompt: 'IDOR ga qarshi eng ishonchli himoya qaysi?',
    choices: [
      "URL'dagi id o'rniga UUID ishlatish",
      "Frontendda begona obyektlarga havolalarni ko'rsatmaslik",
      "get_queryset() ni request.user bo'yicha filtrlab, boshqaning obyekti ro'yxatga umuman tushmasligini ta'minlash",
      "id ni base64 bilan kodlab yuborish",
    ],
    correctIndex: 2,
    explanation:
      "UUID, base64 va yashirilgan havola — bu «noaniqlik orqali xavfsizlik»: id baribir so'rovda ko'rinadi. Yagona ishonchli yechim — bazadan olishning o'zida foydalanuvchi bo'yicha filtrlash. Yon natijasi ham foydali: filtrlangan queryset'da begona id get_object() bosqichida Http404 beradi, ya'ni javob 403 emas, 404 bo'ladi — 90-darsdagi talab va 91-darsdagi IDOR testi aynan shuni kutadi.",
  },

  // ─────────────────────────────────────── Dars 93 — Deploy ───────────────────────────────────────
  {
    lessonKey: 'backend-dars-93',
    order: 1,
    prompt: 'Smoke test nima?',
    choices: [
      "Deploy'dan keyin asosiy oqimlarni tez tekshirib chiqish: sayt ochiladimi, login ishlaydimi, asosiy endpoint javob beradimi",
      "Serverga katta yuklama berib, chidamliligini o'lchash",
      "CI'da barcha unit testlarni ishga tushirish",
      'Kodni xavfsizlik zaifliklariga avtomatik skanerlash',
    ],
    correctIndex: 0,
    explanation:
      "Smoke test chuqur emas, keng: u «umuman tirikmi?» degan savolga bir necha daqiqada javob beradi. Yuklama sinovi (load test) va zaiflik skaneri — butunlay boshqa vositalar.",
  },
  {
    lessonKey: 'backend-dars-93',
    order: 2,
    prompt: "Ishlab chiqarish muhitida (prod) nega print() emas, logging ishlatiladi?",
    choices: [
      "print() prod muhitida umuman ishlamaydi va NameError beradi",
      'logging kodni tezlashtiradi, print esa sekinlashtiradi',
      "print() faqat Python 2 da mavjud edi",
      "logging xabarga daraja, vaqt va manbani qo'shadi hamda uni faylga yoki Sentry'ga yo'naltirish mumkin; print esa hech qayerda saqlanmay yo'qoladi",
    ],
    correctIndex: 3,
    explanation:
      "print() shunchaki oqimga matn tashlaydi — filtrlab ham, saqlab ham bo'lmaydi. logging'da esa daraja bor: standart sozlamada logging.warning() va undan yuqorisi ko'rinadi, logging.info() esa ko'rinmaydi — ya'ni shovqin darajasini o'zingiz boshqarasiz.",
  },
  {
    lessonKey: 'backend-dars-93',
    order: 3,
    prompt: 'Nega zaxira nusxadan (backup) tiklashni oldindan sinab ko\'rish kerak?',
    choices: [
      'Sinov zaxira faylining hajmini kichraytiradi',
      'Sinov bazaning ishlash tezligini oshiradi',
      "Sinalmagan zaxira buzuq yoki chala bo'lishi mumkin — bu esa faqat halokat kunida ma'lum bo'ladi",
      "Sinalmagan zaxira fayli ma'lum muddatdan keyin avtomatik o'chib ketadi",
    ],
    correctIndex: 2,
    explanation:
      "«Zaxira bor» degani «tiklana oladi» degani emas: skript sukut bilan xato berayotgan, jadval tushib qolgan yoki fayl bo'sh bo'lishi mumkin. Sinalmagan zaxira — zaxira emas.",
  },
  {
    lessonKey: 'backend-dars-93',
    order: 4,
    prompt: 'N+1 muammosi nima?',
    choices: [
      "Bazaga bir vaqtning o'zida N+1 ta ulanish ochilishi",
      "Ro'yxat uchun 1 ta so'rov ketib, so'ng har bir element uchun yana bittadan qo'shimcha so'rov ketishi",
      "Bitta og'ir so'rovning N+1 marta sekinlashishi",
      "Jadvalda N+1 ta ortiqcha ustun bo'lib qolishi",
    ],
    correctIndex: 1,
    explanation:
      "Nomi ham shundan: 1 ta ro'yxat so'rovi + N ta bog'liq obyekt so'rovi. 10 ta post uchun bu 11 ta so'rov degani; select_related() bilan hammasi bitta JOIN'ga aylanadi.",
  },
  {
    lessonKey: 'backend-dars-93',
    order: 5,
    prompt: 'Test piramidasining eng keng — asos qismida qaysi testlar turadi?',
    choices: [
      'E2E testlar',
      "Qo'lda tekshirish",
      'API (integratsion) testlar',
      'Unit testlar',
    ],
    correctIndex: 3,
    explanation:
      "Asosda unit testlar turadi: ular soniyalarda ishlaydi, arzon va xato qaysi funksiyada ekanini aniq ko'rsatadi. Yuqoriga chiqqan sari testlar qimmatlashadi va kamayadi.",
  },

  // ───────────────────────────────────── Dars 94 — Portfolio & CV ─────────────────────────────────
  {
    lessonKey: 'backend-dars-94',
    order: 1,
    prompt: 'GitHub Profile README qanday yaratiladi?',
    choices: [
      "GitHub sozlamalaridagi «Bio» maydoniga matn yozib qo'yiladi",
      "Foydalanuvchi nomi bilan bir xil nomdagi repo ochiladi (masalan, ali/ali) va unga README.md qo'yiladi",
      "«profile» nomli repo ochilib, unga README.md joylanadi",
      "Eng ko'p yulduz olgan repo'ning README'si avtomatik profilda ko'rsatiladi",
    ],
    correctIndex: 1,
    explanation:
      "GitHub faqat bitta maxsus holatni taniydi: repo nomi login'ingiz bilan aynan bir xil bo'lsa, uning README.md fayli profil sahifangizning tepasida chiqadi. «profile» nomli repo bu ishni qilmaydi.",
  },
  {
    lessonKey: 'backend-dars-94',
    order: 2,
    prompt: "Loyiha README'sining eng boshida nima turishi kerak?",
    choices: [
      "Loyiha nima qilishi — bir-ikki jumlada, aniq va sodda",
      "Muallif haqida ma'lumot va aloqa uchun kontaktlar",
      "O'rnatish buyruqlarining to'liq ro'yxati",
      'Litsenziya matni',
    ],
    correctIndex: 0,
    explanation:
      "README'ni ochgan odam birinchi 5 soniyada «bu nima?» degan savolga javob olishi kerak. Kontakt, o'rnatish va litsenziya — muhim, lekin ular pastroqda turadi.",
  },
  {
    lessonKey: 'backend-dars-94',
    order: 3,
    prompt: "CV'dagi tajriba bo'limida nima yozish tavsiya qilinadi?",
    choices: [
      "Bajarilgan vazifa: «REST API yozdim, testlar yozdim»",
      "Ishlatilgan texnologiyalar ro'yxatining o'zi kifoya",
      "Raqam bilan o'lchangan natija: «javob vaqtini 800 ms dan 200 ms ga tushirdim»",
      "Lavozim nomi va ish joyida ishlagan muddat yetarli",
    ],
    correctIndex: 2,
    explanation:
      "«Nima qildim» emas, «nima o'zgardi» muhim. Raqam sizni bir xil CV'lar orasidan ajratib turadi, chunki uni o'ylab topib bo'lmaydi — uni tushuntirib berish kerak bo'ladi.",
  },
  {
    lessonKey: 'backend-dars-94',
    order: 4,
    prompt: "Yangi deploy'dan keyin birinchi navbatda nima qilinadi?",
    choices: [
      "Bazani tozalab, seed ma'lumotlar qaytadan yuklanadi",
      "Eski loglar butunlay o'chirib tashlanadi",
      "DEBUG = True qilib qo'yiladi, toki xatolar brauzerda ko'rinsin",
      "Smoke test: bosh sahifa, login va bitta asosiy endpoint qo'lda ochib ko'riladi, so'ng loglar tekshiriladi",
    ],
    correctIndex: 3,
    explanation:
      "Deploy'dan keyingi birinchi qadam — tizim tirikligini tasdiqlash. Prod'da DEBUG = True qilish esa xavfli: u maxfiy sozlamalar va kod parchalarini begonaga ko'rsatib qo'yadi.",
  },
  {
    lessonKey: 'backend-dars-94',
    order: 5,
    prompt: 'drf-spectacular loyihaga nima beradi?',
    choices: [
      "API so'rovlarini avtomatik keshlaydi",
      "Kod asosida OpenAPI sxemasini hosil qilib, /api/docs/ da jonli Swagger UI ko'rsatadi",
      'API uchun testlarni avtomatik yozib beradi',
      'Foydalanuvchilar uchun JWT tokenlar generatsiya qiladi',
    ],
    correctIndex: 1,
    explanation:
      "drf-spectacular hujjatni serializer va view'laringizdan o'qib chiqadi — ya'ni hujjat kod bilan birga yangilanadi va eskirmaydi. Test yozish yoki token berish uning vazifasi emas.",
  },

  // ─────────────────────────────── Dars 95 — Intervyuga tayyorgarlik ───────────────────────────────
  {
    lessonKey: 'backend-dars-95',
    order: 1,
    prompt:
      "Intervyu savoli: 10 ta postni har birining teglari (ManyToMany) bilan chiqaryapsiz va `prefetch_related('teglar')` yozdingiz. Nechta SQL so'rov ketadi?",
    choices: [
      "11 ta — ro'yxat uchun 1 ta va har bir post uchun 1 tadan",
      '1 ta — JOIN hammasini bitta so\'rovga jamlaydi',
      "2 ta — biri postlar uchun, ikkinchisi ularning barcha teglari uchun",
      '10 ta — har bir post uchun bittadan',
    ],
    correctIndex: 2,
    explanation:
      "prefetch_related JOIN qilmaydi: avval postlarni oladi, so'ng ularning id'lari bo'yicha barcha teglarni BITTA qo'shimcha so'rovda olib, bog'lashni Python'da bajaradi — jami 2 ta. Prefetchsiz 1 + 10 = 11 ta bo'lardi. 1 ta — bu select_related (JOIN) natijasi, lekin u ManyToMany'da umuman ishlamaydi.",
  },
  {
    lessonKey: 'backend-dars-95',
    order: 2,
    prompt: 'Intervyuda bilmagan savolingizga qanday javob berish to\'g\'ri?',
    choices: [
      "Ishonchli ohangda taxminiy javob aytish — asosiysi jim qolmaslik",
      "Mavzuni o'zgartirib, o'zingiz yaxshi bilgan narsaga burib yuborish",
      "«Bilmayman» deb qisqa javob berib, keyingi savolga o'tishni so'rash",
      "«Bu bilan ishlamaganman, lekin tushunishimcha… va buni qanday o'rganishimni bilaman» deb halol javob berish",
    ],
    correctIndex: 3,
    explanation:
      "Intervyu oluvchi bilimingizni ham, halolligingizni ham sinaydi. Uydirma javob darrov sezilib qoladi va ishonchni yo'qotadi; halol javob esa fikrlash usulingizni va o'rganish qobiliyatingizni ko'rsatadi.",
  },
  {
    lessonKey: 'backend-dars-95',
    order: 3,
    prompt:
      "Intervyuda holat beriladi: foydalanuvchining JWT tokeni yaroqli va muddati tugamagan, lekin u faqat adminlarga ochiq endpointga murojaat qildi. Server qaysi statusni qaytarishi kerak?",
    choices: [
      '403 Forbidden',
      '401 Unauthorized',
      '400 Bad Request',
      '500 Internal Server Error',
    ],
    correctIndex: 0,
    explanation:
      "Token yaroqli — server foydalanuvchini tanidi, ya'ni autentifikatsiya muvaffaqiyatli o'tdi va 401 mos kelmaydi. Muammo avtorizatsiyada: «tanishdik, lekin bu sizga mumkin emas» — 403. Token umuman yuborilmaganida yoki eskirganida esa javob 401 bo'lardi. So'rov sintaksisi to'g'ri, server ham sinmagan — demak 400 ham, 500 ham emas.",
  },
  {
    lessonKey: 'backend-dars-95',
    order: 4,
    prompt: 'Nega CV ni 1 sahifada saqlash tavsiya qilinadi?',
    choices: [
      "ATS tizimlari ikki sahifali fayllarni o'qiy olmaydi",
      "Recruiter har bir CV'ga bir necha soniya sarflaydi — eng kuchli ma'lumot birinchi sahifada bo'lishi kerak",
      "Uzunroq CV yuborish ish e'lonlari qoidalarini buzish hisoblanadi",
      "PDF faylning hajmi kichik bo'lishi shart",
    ],
    correctIndex: 1,
    explanation:
      "Cheklov texnik emas, diqqat bilan bog'liq: birinchi skanerlash bir necha soniya davom etadi. 1 sahifa sizni eng muhim natijalarni tanlashga majbur qiladi.",
  },
  {
    lessonKey: 'backend-dars-95',
    order: 5,
    prompt: 'Smoke test qachon o\'tkaziladi?',
    choices: [
      "Har bir deploy'dan darrov keyin, jonli muhitning o'zida",
      'Kod yozishdan oldin, TDD ning birinchi bosqichida',
      'Oyiga bir marta, rejalashtirilgan tartibda',
      "Faqat loyiha butunlay tugagach, bir martagina",
    ],
    correctIndex: 0,
    explanation:
      "Smoke test — deploy'ning yakuniy qadami: yangi versiya chiqdi, endi asosiy oqimlar hali ham ishlayotganini tekshiramiz. Uni oldindan yoki oyda bir marta qilishning ma'nosi yo'q.",
  },

  // ────────────────────────────────────── Dars 96 — Bitiruv ──────────────────────────────────────
  {
    lessonKey: 'backend-dars-96',
    order: 1,
    prompt: 'Loyiha taqdimoti nimadan boshlanadi?',
    choices: [
      "Ishlatilgan texnologiyalar ro'yxatidan",
      'Papkalar tuzilishi va kod sxemasidan',
      'Loyiha qaysi muammoni hal qilishidan',
      "O'zingiz haqingizdagi uzun tanishtiruvdan",
    ],
    correctIndex: 2,
    explanation:
      "Tinglovchi avval «nima uchun bu kerak?» degan savolga javob olishi kerak: muammo → yechim → demo → texnik qarorlar → o'rganganlar. Texnologiyalar ro'yxati muammosiz hech kimga qiziq emas.",
  },
  {
    lessonKey: 'backend-dars-96',
    order: 2,
    prompt: 'Jonli demo\'ni taqdimotdan oldin necha marta sinash kerak?',
    choices: [
      "1 marta yetarli — ortig'i vaqtni behuda sarflash",
      "Umuman sinash shart emas, jonli qilingani ishonchliroq chiqadi",
      'Faqat internet sekin bo\'lsa sinaladi',
      "Kamida 3 marta — va internet yoki server ishlamay qolsa deb, zaxira skrinshot/video tayyorlab qo'yiladi",
    ],
    correctIndex: 3,
    explanation:
      "Demo eng ko'p buziladigan qism: internet, token muddati, bo'sh baza. Bir necha marta to'liq mashq va zaxira skrinshot taqdimotni omadga bog'lab qo'ymaydi.",
  },
  {
    lessonKey: 'backend-dars-96',
    order: 3,
    prompt: 'Kurs tugagach malakani saqlab qolish uchun nima tavsiya qilinadi?',
    choices: [
      "Har kuni kamida 30 daqiqa kod yozish va har 2-3 oyda yangi loyiha qilish",
      "Ish topilgunga qadar kod yozishni to'xtatib turish",
      'Faqat nazariy kitoblarni o\'qib borish',
      "Python'ni yig'ishtirib, darhol boshqa tilga o'tish",
    ],
    correctIndex: 0,
    explanation:
      "Ko'nikma mashqsiz tez unutiladi. Kichik, lekin muntazam amaliyot va yangi loyihalar — GitHub faolligingizni ham, bilimingizni ham tirik saqlaydi.",
  },
  {
    lessonKey: 'backend-dars-96',
    order: 4,
    prompt:
      "10 ta postni har birining muallifi bilan chiqarmoqchisiz. select_related('author') ishlatilsa nechta SQL so'rov ketadi?",
    choices: [
      "11 ta — ro'yxat uchun 1 ta va har bir post uchun 1 tadan",
      '1 ta — JOIN orqali post va muallif birga olinadi',
      '10 ta — har bir post uchun bittadan',
      '20 ta — har bir post uchun ikkitadan',
    ],
    correctIndex: 1,
    explanation:
      "select_related() SQL JOIN qiladi, shuning uchun hamma narsa bitta so'rovda keladi. 11 ta — bu aynan select_related'siz holat, ya'ni N+1 muammosining o'zi.",
  },
  {
    lessonKey: 'backend-dars-96',
    order: 5,
    prompt: "Portfolio loyihasining README'sida nimalar bo'lishi kerak?",
    choices: [
      "Faqat loyiha nomi va muallif ismi",
      "Butun kod tuzilishining fayl-fayl batafsil tavsifi",
      "Faqat `pip install -r requirements.txt` buyrug'i",
      "Loyiha nima qilishi, demo havolasi, skrinshot va sinab ko'rilgan ishga tushirish buyruqlari",
    ],
    correctIndex: 3,
    explanation:
      "README begona odam loyihani 5 daqiqada tushunib, ishga tushira olishi uchun yoziladi. Buyruqlarni albatta toza papkada sinab ko'ring — sinalmagan buyruq README'dagi eng ko'p uchraydigan xato.",
  },
];
