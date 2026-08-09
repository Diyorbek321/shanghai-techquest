import type { LessonQuizRecord } from './backendQuiz.m1a';

// Hand-authored MCQs derived from the lesson decks' TEKSHIRUV slides.
//
// Scope: backend lessons 48..54 (`backend-dars-48` .. `backend-dars-54`), 5 questions each = 35.
// Every prompt is a light rewrite of the curriculum author's original open recap question so that it
// has exactly one defensible answer. Distractors are real beginner misconceptions for that exact
// topic — UNIQUE confused with NOT NULL, migratsiya confused with backup, `git push` confused with
// `git add`/`git pull`, 401 swapped with 403, `include()` confused with the `{% include %}` template
// tag, `request.GET` confused with «so'rov GET metodidami» — so a wrong pick is diagnostic.
//
// Runnable facts (fetchall return shape, UNIQUE violation, parametrli so'rov vs f-string injection,
// JSON kalitlarining qo'shtirnog'i) were verified by executing code in the Piston sandbox.
//
// `explanation` is shown to the student AFTER they answer; it is the teaching moment.

export const backendQuizB06: LessonQuizRecord[] = [
  // ───────────────────────────────── Dars 48 — DB loyiha ─────────────────────────────────
  {
    lessonKey: 'backend-dars-48',
    order: 1,
    prompt: 'Nima uchun baza bilan ishlaydigan kodni alohida modulga (masalan db.py) chiqaramiz?',
    choices: [
      'Chunki alohida modulda ulanish (connection) avtomatik yopiladi va commit() yozish shart bo\'lmay qoladi',
      'Chunki alohida faylda SQL so\'rovlari avtomatik parametrli bo\'lib qoladi',
      'Chunki baza kodi bir joyda to\'planadi — bazani almashtirish yoki so\'rovni tuzatish oson bo\'ladi',
      'Chunki bu dastur ishlash tezligini bir necha barobar oshiradi',
    ],
    correctIndex: 2,
    explanation:
      'Baza kodini bitta modulga chiqarsangiz, menyu va mantiq qismi «qanday saqlanishini» bilmaydi — SQLite\'dan PostgreSQL\'ga o\'tsangiz faqat shu modulni o\'zgartirasiz. Bu tezlik uchun emas, tartib va o\'zgartirish qulayligi uchun qilinadi.',
  },
  {
    lessonKey: 'backend-dars-48',
    order: 2,
    prompt: 'Jadval ustuniga UNIQUE cheklovi qo\'yilgan bo\'lsa, u nimaga yo\'l qo\'ymaydi?',
    choices: [
      'Shu ustunda bir xil qiymatning ikki marta saqlanishiga',
      'Shu ustunning bo\'sh (NULL) qolishiga',
      'Shu ustundagi qiymatning keyinchalik UPDATE bilan o\'zgarishiga',
      'Jadvalda ikkitadan ortiq qator bo\'lishiga',
    ],
    correctIndex: 0,
    explanation:
      'UNIQUE — takrorlanishga qarshi: mavjud qiymatni yana kiritmoqchi bo\'lsangiz, baza IntegrityError beradi va yozuv saqlanmaydi. Bo\'sh qiymatni taqiqlash esa boshqa cheklov — NOT NULL ning ishi.',
  },
  {
    lessonKey: 'backend-dars-48',
    order: 3,
    prompt: 'Loyihada «migratsiya» deganda nima tushuniladi?',
    choices: [
      'Bazadagi ma\'lumotlarning zaxira (backup) nusxasini olish',
      'Baza tuzilishidagi o\'zgarishni (jadval qo\'shish, ustun qo\'shish) qadam-qadam yozib boruvchi skript',
      'Ma\'lumotlarni bir serverdan boshqasiga ko\'chirish',
      'Jadvaldagi barcha yozuvlarni o\'chirib, bazani noldan boshlash',
    ],
    correctIndex: 1,
    explanation:
      'Migratsiya — sxemaning versiyalangan tarixi: har bir o\'zgarish alohida qadam sifatida saqlanadi va jamoadagi hammaning bazasiga bir xil tartibda qo\'llanadi. Ma\'lumot ko\'chirish yoki backup — mutlaqo boshqa amallar.',
  },
  {
    lessonKey: 'backend-dars-48',
    order: 4,
    prompt: 'Foydalanuvchi kiritgan email bo\'yicha qidiruvda SQL injection\'dan qaysi qator himoyalaydi?',
    choices: [
      'cur.execute(f"SELECT * FROM users WHERE email = \'{email}\'")',
      'cur.execute("SELECT * FROM users WHERE email = \'" + email + "\'")',
      'cur.execute("SELECT * FROM users WHERE email = \'%s\'" % email)',
      'cur.execute("SELECT * FROM users WHERE email = ?", (email,))',
    ],
    correctIndex: 3,
    explanation:
      'Faqat oxirgi variantda qiymat so\'rov matniga yopishtirilmaydi — u alohida parametr sifatida uzatiladi va baza uni har doim oddiy matn deb qabul qiladi. Birinchi uchtasida email o\'rniga \' OR 1=1 -- yozilsa, so\'rov butun jadvalni qaytaradi.',
  },
  {
    lessonKey: 'backend-dars-48',
    order: 5,
    prompt: 'SELECT so\'rovidan keyin cur.fetchall() nima qaytaradi?',
    choices: [
      'Faqat birinchi qatorni — bitta tuple ko\'rinishida',
      'Barcha qatorlarni tuple\'lar ro\'yxati sifatida; natija bo\'lmasa bo\'sh ro\'yxat',
      'Natija bo\'lmasa None, aks holda qatorlar ro\'yxatini',
      'Har doim lug\'atlar (dict) ro\'yxatini — ustun nomlari kalit bo\'ladi',
    ],
    correctIndex: 1,
    explanation:
      'fetchall() — list of tuples: har bir qator bitta tuple. Hech narsa topilmasa u None emas, bo\'sh ro\'yxat [] qaytaradi, shuning uchun natijani for bilan aylantirish xavfsiz. Bitta qator kerak bo\'lsa fetchone() ishlatiladi, u esa bo\'sh natijada None beradi.',
  },

  // ────────────────────────── Dars 49 — Web qanday ishlaydi ──────────────────────────
  {
    lessonKey: 'backend-dars-49',
    order: 1,
    prompt: 'Client va server o\'rtasidagi munosabat qanday?',
    choices: [
      'Client so\'rov yuboradi, server uni qayta ishlab javob qaytaradi',
      'Server so\'rov yuboradi, client javob qaytaradi',
      'Client — bu sayt, server — bu brauzer',
      'Ikkalasi ham bir vaqtda so\'rov yuboradi, kim tezroq bo\'lsa o\'shanikisi bajariladi',
    ],
    correctIndex: 0,
    explanation:
      'Web — so\'rov va javob almashinuvi: tashabbus har doim client tomonda (brauzer, mobil ilova), server esa faqat kelgan so\'rovga javob beradi. Brauzer — client, saytni saqlab turgan kompyuter — server.',
  },
  {
    lessonKey: 'backend-dars-49',
    order: 2,
    prompt: 'DNS ning asosiy vazifasi nima?',
    choices: [
      'Sayt fayllarini saqlab turadi va ularni brauzerga yuboradi',
      'So\'rovni shifrlab, uni o\'qib bo\'lmaydigan qiladi',
      'Internet tezligini oshirish uchun sahifalarni keshlaydi',
      'Domen nomini (example.uz) IP manzilga aylantiradi',
    ],
    correctIndex: 3,
    explanation:
      'DNS — internetning telefon kitobi: kompyuterlar bir-birini IP manzil orqali topadi, odam esa nomni eslab qoladi. DNS shu ikkisini bog\'laydi; fayl saqlash hosting\'ning, shifrlash esa HTTPS ning ishi.',
  },
  {
    lessonKey: 'backend-dars-49',
    order: 3,
    prompt: 'Frontend va backend o\'rtasidagi asosiy farq nima?',
    choices: [
      'Frontend serverda, backend esa brauzerda ishlaydi',
      'Frontend — dizaynerning ishi, backend — dasturchining ishi; texnik farqi yo\'q',
      'Frontend brauzerda ko\'rinishni chizadi, backend serverda mantiq va ma\'lumot bilan ishlaydi',
      'Frontend ham, backend ham to\'g\'ridan-to\'g\'ri bazaga ulanadi, farqi faqat ishlatiladigan tilda',
    ],
    correctIndex: 2,
    explanation:
      'Foydalanuvchi ko\'radigan qism — frontend, u brauzerda ishlaydi; qoidalar, hisob-kitob va ma\'lumot esa serverda — backend\'da. Bazaga faqat backend murojaat qiladi, aks holda parol va so\'rovlar brauzerda ochiq qolar edi.',
  },
  {
    lessonKey: 'backend-dars-49',
    order: 4,
    prompt: 'Foydalanuvchi qidiruv maydoniga \' OR 1=1 -- deb yozdi. Qaysi holatda bu hujum ishlamaydi?',
    choices: [
      'Agar so\'rov f-string bilan tuzilgan, lekin qiymat qo\'shtirnoq ichiga olingan bo\'lsa',
      'Agar qiymat so\'rovga parametr sifatida uzatilgan bo\'lsa: execute(sql, (qiymat,))',
      'Agar so\'rovdan keyin commit() chaqirilsa',
      'Agar kiritilgan matndan bo\'sh joylar olib tashlansa',
    ],
    correctIndex: 1,
    explanation:
      'Parametrli so\'rovda baza qiymatni hech qachon SQL kodi deb o\'qimaydi — u shunchaki qidirilayotgan matn bo\'lib qoladi va natija bo\'sh chiqadi. Qo\'shtirnoq qo\'shish yoki bo\'sh joy tozalash himoya emas: hujumchi qo\'shtirnoqni o\'zi yopib ketadi.',
  },
  {
    lessonKey: 'backend-dars-49',
    order: 5,
    prompt: 'git push buyrug\'i nima qiladi?',
    choices: [
      'O\'zgargan fayllarni staging\'ga qo\'shadi',
      'O\'zgarishlarni izoh bilan lokal tarixga yozib qo\'yadi',
      'GitHub\'dagi yangi o\'zgarishlarni kompyuteringizga yuklab oladi',
      'Lokal commit\'laringizni masofaviy repozitoriyga (GitHub\'ga) yuboradi',
    ],
    correctIndex: 3,
    explanation:
      'push — allaqachon commit qilingan ishni GitHub\'ga uzatadi; commit qilinmagan o\'zgarish push bilan ketmaydi. Staging uchun git add, tarixga yozish uchun git commit, GitHub\'dan olish uchun esa git pull ishlatiladi.',
  },

  // ───────────────────────────── Dars 50 — HTTP protokoli ─────────────────────────────
  {
    lessonKey: 'backend-dars-50',
    order: 1,
    prompt: 'GET va POST metodlari orasidagi asosiy farq nima?',
    choices: [
      'GET tez, POST esa sekin ishlaydi — natija esa bir xil',
      'GET faqat matn, POST esa faqat rasm va fayl yuborish uchun ishlatiladi',
      'GET ma\'lumotni o\'qish uchun (parametrlar URL\'da), POST esa yangi ma\'lumot yuborish/yaratish uchun (ma\'lumot body\'da)',
      'GET brauzerdan, POST esa faqat serverdan yuboriladi',
    ],
    correctIndex: 2,
    explanation:
      'GET — «menga ko\'rsat», u serverda hech narsani o\'zgartirmaydi va parametrlari URL\'da ko\'rinib turadi. POST — «mana, saqlab qo\'y», ma\'lumot so\'rov tanasida (body) ketadi, shuning uchun parol va uzun formalar POST bilan yuboriladi.',
  },
  {
    lessonKey: 'backend-dars-50',
    order: 2,
    prompt: '404 status kodi nimani anglatadi?',
    choices: [
      'So\'ralgan manzil bo\'yicha resurs topilmadi',
      'Serverning o\'z kodida xatolik yuz berdi',
      'Sizda bu resursga kirish huquqi yo\'q',
      'Internet aloqasi uzilgan va so\'rov serverga umuman yetib bormadi',
    ],
    correctIndex: 0,
    explanation:
      '404 — 4xx oilasidan, ya\'ni client xatosi: server ishlayapti va javob berdi, lekin so\'ralgan manzilda hech narsa yo\'q. Serverdagi kod xatosi 500, ruxsat yo\'qligi esa 403 bilan bildiriladi.',
  },
  {
    lessonKey: 'backend-dars-50',
    order: 3,
    prompt: '401 va 403 status kodlari qanday farq qiladi?',
    choices: [
      '401 — server xatosi, 403 — client xatosi',
      '401 — resurs topilmadi, 403 — server juda band',
      '401 — kirish huquqingiz yo\'q, 403 — tizimga kirmagansiz',
      '401 — tizimga kirmagansiz (kim ekaningiz noma\'lum), 403 — kim ekaningiz ma\'lum, lekin huquqingiz yo\'q',
    ],
    correctIndex: 3,
    explanation:
      '401 «o\'zingizni tanishtiring» degani — token yoki login yo\'q. 403 esa «tanidim, lekin ruxsat yo\'q» — masalan oddiy foydalanuvchi admin sahifasini so\'rasa. Ikkalasi ham 4xx, ya\'ni client tomonidagi muammo.',
  },
  {
    lessonKey: 'backend-dars-50',
    order: 4,
    prompt: 'Brauzerga example.uz deb yozdingiz. HTTP so\'rov yuborilishidan oldin DNS qanday vazifani bajaradi?',
    choices: [
      'Sahifaning HTML faylini yuklab beradi',
      'Nomni serverning IP manziliga aylantirib beradi',
      'So\'rovni shifrlab, xavfsiz kanal ochadi',
      'Serverning qaysi portda ishlashini tanlab beradi',
    ],
    correctIndex: 1,
    explanation:
      'DNS faqat bitta ish qiladi — nomdan IP manzilga aylantiradi; shundan keyingina brauzer o\'sha IP\'ga HTTP so\'rov yuboradi. HTML kontentni server, shifrlashni esa HTTPS/TLS ta\'minlaydi.',
  },
  {
    lessonKey: 'backend-dars-50',
    order: 5,
    prompt: 'Client-server modelida HTTP muloqotini har doim kim boshlaydi?',
    choices: [
      'Client — brauzer yoki ilova so\'rov yuboradi, server esa javob beradi',
      'Server — u yangilik bo\'lganda o\'zi brauzerga xabar yuboradi',
      'DNS server — u so\'rovni boshlab, keyin brauzerga uzatadi',
      'Navbat bilan: bir marta client, keyingi safar server boshlaydi',
    ],
    correctIndex: 0,
    explanation:
      'HTTP — so\'rov-javob protokoli: server hech qachon o\'zidan so\'rov boshlamaydi, u faqat kelgan so\'rovga javob qaytaradi. Shuning uchun sahifadagi ma\'lumot yangilanishi uchun client qayta so\'rov yuborishi kerak.',
  },

  // ────────────────────────────── Dars 51 — REST & API ──────────────────────────────
  {
    lessonKey: 'backend-dars-51',
    order: 1,
    prompt: 'API nima?',
    choices: [
      'Ma\'lumotlar bazasining boshqacha nomi',
      'Saytning foydalanuvchi ko\'radigan dizayn qismi',
      'Dasturlash tilining bir turi',
      'Dasturlar bir-biri bilan muloqot qiladigan eshik — qanday so\'rov yuborish va qanday javob kelishi kelishilgan interfeys',
    ],
    correctIndex: 3,
    explanation:
      'API — ikki dastur orasidagi shartnoma: «shu manzilga shunday so\'rov yuborsang, shunday javob olasan». Backend dasturchining asosiy mahsuloti — aynan shu eshik, uning orqasida esa mantiq va baza turadi.',
  },
  {
    lessonKey: 'backend-dars-51',
    order: 2,
    prompt: 'REST qoidalariga ko\'ra barcha foydalanuvchilar ro\'yxatini olish uchun qaysi so\'rov to\'g\'ri?',
    choices: [
      'GET /getUsers',
      'POST /users/getAll',
      'GET /users',
      'GET /user/list?action=get',
    ],
    correctIndex: 2,
    explanation:
      'REST\'da URL\'da faqat resurs oti (ko\'plikda) turadi, harakat esa HTTP metod bilan bildiriladi — o\'qish uchun GET. URL ichiga getUsers kabi fe\'l yozish REST qoidasini buzadi, chunki metod allaqachon «nima qilishni» aytib turibdi.',
  },
  {
    lessonKey: 'backend-dars-51',
    order: 3,
    prompt: 'JSON formatida kalitlar qanday yoziladi?',
    choices: [
      'Har doim qo\'sh qo\'shtirnoq ichida: {"ism": "Ali"}',
      'Bir tirnoq ichida: {\'ism\': \'Ali\'}',
      'Qo\'shtirnoqsiz, Python lug\'ati kabi: {ism: "Ali"}',
      'Kalitlar faqat katta harflar bilan: {"ISM": "Ali"}',
    ],
    correctIndex: 0,
    explanation:
      'JSON standarti kalitni ham, matn qiymatini ham faqat qo\'sh qo\'shtirnoqda talab qiladi — bir tirnoq bilan yozilsa json.loads() JSONDecodeError beradi. Python lug\'atiga o\'xshasa ham, JSON — alohida matn formati.',
  },
  {
    lessonKey: 'backend-dars-51',
    order: 4,
    prompt: '404 va 500 status kodlari qanday farq qiladi?',
    choices: [
      '404 — server ichida xatolik, 500 — resurs topilmadi',
      '404 — client so\'ragan resurs mavjud emas, 500 — server kodida xatolik yuz berdi',
      '404 — internet yo\'q, 500 — sayt butunlay yopilgan',
      'Ikkalasi ham server xatosi, farqi faqat og\'irlik darajasida',
    ],
    correctIndex: 1,
    explanation:
      '4xx — client tomonining muammosi (noto\'g\'ri manzil so\'radi), 5xx — serverning o\'z aybi (kodda xato, baza ishlamayapti). Shuning uchun 500 ni ko\'rsangiz, tuzatish kerak bo\'lgan joy — sizning backend kodingiz.',
  },
  {
    lessonKey: 'backend-dars-51',
    order: 5,
    prompt: 'DNS ishlamay qolsa, saytga to\'g\'ridan-to\'g\'ri IP manzil orqali kirish mumkinmi?',
    choices: [
      'Yo\'q, DNS\'siz brauzerdan umuman so\'rov ketmaydi',
      'Yo\'q, IP manzil faqat serverlarning o\'zaro aloqasi uchun ishlatiladi',
      'Ha — DNS faqat nomni IP\'ga aylantiradi, IP allaqachon ma\'lum bo\'lsa u kerak emas',
      'Ha, lekin faqat HTTPS orqali kirilganda',
    ],
    correctIndex: 2,
    explanation:
      'So\'rov aslida IP manzilga yuboriladi; DNS shunchaki nomdan IP\'ni topib beruvchi bosqich. IP ma\'lum bo\'lsa bu bosqich tushib qoladi, shuning uchun IP bilan kirish ishlaydi.',
  },

  // ───────────────────────────── Dars 52 — Django kirish ─────────────────────────────
  {
    lessonKey: 'backend-dars-52',
    order: 1,
    prompt: 'Django nima uchun kerak?',
    choices: [
      'U Python kodini kompilyatsiya qilib, dasturni tezroq ishlatadi',
      'U web-ilova uchun kerak bo\'ladigan tayyor qismlarni beradi — routing, baza bilan ishlash, admin panel, xavfsizlik',
      'U ma\'lumotlar bazasi bo\'lib, PostgreSQL o\'rnini bosadi',
      'U sayt dizayni uchun tayyor CSS shablonlar to\'plami',
    ],
    correctIndex: 1,
    explanation:
      'Django — framework: HTTP so\'rovni qabul qilish, URL\'ni kodga bog\'lash, bazaga murojaat va admin panel kabi ishlar allaqachon yozib qo\'yilgan. Siz esa faqat loyihangizga xos mantiqni yozasiz, hammasini noldan qurmaysiz.',
  },
  {
    lessonKey: 'backend-dars-52',
    order: 2,
    prompt: 'manage.py fayli nima uchun kerak?',
    choices: [
      'Unda loyihaning barcha sozlamalari (baza, til, DEBUG) saqlanadi',
      'Unda saytning barcha URL manzillari ro\'yxati yoziladi',
      'Unda Django kutubxonasining o\'z kodi joylashgan',
      'U orqali loyiha buyruqlari ishga tushiriladi: runserver, migrate, startapp',
    ],
    correctIndex: 3,
    explanation:
      'manage.py — loyihaning boshqaruv pulti: barcha buyruqlar python manage.py <buyruq> ko\'rinishida shu fayl orqali beriladi. Sozlamalar settings.py da, manzillar esa urls.py da turadi.',
  },
  {
    lessonKey: 'backend-dars-52',
    order: 3,
    prompt: 'Nima uchun ishlab chiqarish (prod) serverida DEBUG = False bo\'lishi shart?',
    choices: [
      'Chunki DEBUG = True bo\'lsa, xatolik sahifasi kod parchalari, fayl yo\'llari va sozlamalarni har qanday tashrifchiga ko\'rsatib qo\'yadi',
      'Chunki DEBUG = True bo\'lsa, baza avtomatik tozalanib ketadi',
      'Chunki DEBUG = True bo\'lsa, admin panel butunlay ochilmaydi',
      'Chunki DEBUG = True faqat Windows\'da ishlaydi',
    ],
    correctIndex: 0,
    explanation:
      'DEBUG = True bilan Django xatolik yuz berganda batafsil sahifa chiqaradi — u yerda kod, fayl yo\'llari va sozlamalar ko\'rinadi, bu esa hujumchi uchun tayyor xarita. Ishlab chiqishda qulay, prod\'da esa xavfsizlik teshigi.',
  },
  {
    lessonKey: 'backend-dars-52',
    order: 4,
    prompt: 'REST API\'da «yaratish», «o\'chirish» kabi harakat qayerda ko\'rsatiladi?',
    choices: [
      'URL oxiridagi fe\'lda: /users/create, /users/delete',
      'So\'rov body\'sidagi "action" kalitida',
      'HTTP metodida: POST yaratadi, DELETE o\'chiradi',
      'So\'rov header\'idagi maxsus X-Action maydonida',
    ],
    correctIndex: 2,
    explanation:
      'REST\'ning asosiy g\'oyasi shu: URL nimani (resursni), metod esa nima qilishni bildiradi. Shuning uchun bitta /users manzili GET bilan ro\'yxat beradi, POST bilan yangi yozuv yaratadi.',
  },
  {
    lessonKey: 'backend-dars-52',
    order: 5,
    prompt: 'Django loyihasida mavjud bo\'lmagan manzilga kirsangiz, server qaysi status kodni qaytaradi?',
    choices: [
      '200 — sahifa bo\'sh bo\'lsa ham so\'rov bajarildi',
      '500 — Django manzilni topolmay xatolik beradi',
      '403 — manzil ro\'yxatda yo\'q, demak taqiqlangan',
      '404 — so\'ralgan resurs topilmadi',
    ],
    correctIndex: 3,
    explanation:
      'Django urls.py dagi hech bir naqsh mos kelmasa 404 qaytaradi — bu «topilmadi» degani va client xatosi hisoblanadi. 500 esa view ichidagi kod xato bergandagina chiqadi.',
  },

  // ──────────────────────────── Dars 53 — App va Routing ────────────────────────────
  {
    lessonKey: 'backend-dars-53',
    order: 1,
    prompt: 'Django\'da project va app o\'rtasidagi farq nima?',
    choices: [
      'App — bu bitta HTML sahifa, project — sahifalar to\'plami',
      'Project — bitta vazifani bajaruvchi modul, app — butun sayt',
      'Project — butun saytning sozlamalari va umumiy qismi, app — bitta vazifani bajaruvchi modul; bitta projectda bir nechta app bo\'ladi',
      'Farqi yo\'q — bu bir narsaning ikki xil nomi',
    ],
    correctIndex: 2,
    explanation:
      'startproject butun saytni (settings.py, asosiy urls.py) yaratadi, startapp esa uning ichidagi bitta bo\'limni — masalan blog, shop, users. Bir project ichida app\'lar ko\'p bo\'lishi mumkin, teskarisi emas.',
  },
  {
    lessonKey: 'backend-dars-53',
    order: 2,
    prompt: 'Django\'ning MVT arxitekturasi qanday ochiladi?',
    choices: [
      'Model — View — Template',
      'Model — View — Controller',
      'Main — View — Template',
      'Model — Validation — Test',
    ],
    correctIndex: 0,
    explanation:
      'Django MVT ishlatadi: Model — ma\'lumot, View — mantiq, Template — ko\'rinish. Ko\'p tanish bo\'lgan MVC\'dagi Controller vazifasini bu yerda Django\'ning o\'zi (URL tizimi) bajaradi, shuning uchun alohida Controller yo\'q.',
  },
  {
    lessonKey: 'backend-dars-53',
    order: 3,
    prompt: 'Project\'ning urls.py faylidagi include() nima qiladi?',
    choices: [
      'App\'ni INSTALLED_APPS ro\'yxatiga qo\'shib qo\'yadi',
      'So\'rovni app\'ning o\'z urls.py fayliga uzatadi — manzillar shu yerda davom etadi',
      'Bitta template ichiga boshqa template\'ni qo\'shadi',
      'Faylni oddiy import kabi yuklaydi, boshqa hech qanday ta\'siri yo\'q',
    ],
    correctIndex: 1,
    explanation:
      'include() manzillar daraxtini shoxlarga bo\'ladi: path(\'blog/\', include(\'blog.urls\')) — blog/ bilan boshlangan hamma so\'rov blog app\'ining urls.py fayliga topshiriladi. App\'ni ro\'yxatga qo\'shish settings.py dagi INSTALLED_APPS ning, template qo\'shish esa {% include %} tegining ishi.',
  },
  {
    lessonKey: 'backend-dars-53',
    order: 4,
    prompt: 'Django serverini ishga tushirish uchun qaysi buyruq to\'g\'ri?',
    choices: [
      'python settings.py runserver',
      'python manage.py startserver',
      'python urls.py runserver',
      'python manage.py runserver',
    ],
    correctIndex: 3,
    explanation:
      'Barcha Django buyruqlari manage.py orqali beriladi, serverni ishga tushiradigan buyruq esa runserver deb ataladi. settings.py va urls.py — bu shunchaki sozlama fayllari, ular to\'g\'ridan-to\'g\'ri ishga tushirilmaydi.',
  },
  {
    lessonKey: 'backend-dars-53',
    order: 5,
    prompt: 'REST qoidasiga ko\'ra talabalar resursining manzili qanday yoziladi?',
    choices: [
      '/students — ot, ko\'plik shaklda',
      '/student — ot, birlik shaklda',
      '/getStudents — fe\'l bilan',
      '/STUDENTS — katta harflar bilan',
    ],
    correctIndex: 0,
    explanation:
      'REST\'da resurs oti ko\'plikda yoziladi: /students butun ro\'yxatni, /students/5 esa bitta talabani bildiradi. Fe\'l ishlatilmaydi, chunki harakatni HTTP metod aytadi.',
  },

  // ──────────────────────────────── Dars 54 — Views ────────────────────────────────
  {
    lessonKey: 'backend-dars-54',
    order: 1,
    prompt: 'Django\'da funksiya-view ning birinchi parametri nima bo\'ladi?',
    choices: [
      'request — kelgan so\'rov haqidagi barcha ma\'lumot shu obyektda',
      'response — javob obyekti, uni to\'ldirib qaytaramiz',
      'self — chunki view sinf metodi hisoblanadi',
      'url — foydalanuvchi kirgan manzil matni',
    ],
    correctIndex: 0,
    explanation:
      'Django har bir view\'ni chaqirganda unga HttpRequest obyektini birinchi argument qilib uzatadi — metod, headerlar, query parametrlar hammasi shu yerda. Javobni esa siz o\'zingiz yaratib return qilasiz.',
  },
  {
    lessonKey: 'backend-dars-54',
    order: 2,
    prompt: 'urls.py da path(\'talaba/<int:id>/\', views.talaba) yozilgan. id qiymati view\'ga qanday yetib keladi?',
    choices: [
      'Uni view ichida request.path ni bo\'lib, qo\'lda ajratib olish kerak',
      'U global o\'zgaruvchi sifatida avtomatik paydo bo\'ladi',
      'U view\'ga argument bo\'lib keladi: def talaba(request, id) — nom URL\'dagi nom bilan bir xil bo\'lishi shart',
      'U request.GET[\'id\'] orqali olinadi',
    ],
    correctIndex: 2,
    explanation:
      'Django <int:id> dagi qiymatni ajratib olib, view\'ga nomli argument sifatida uzatadi, shuning uchun funksiya def talaba(request, id) deb yozilishi kerak. Nom mos kelmasa Django TypeError beradi. request.GET esa boshqa narsa — u ? dan keyingi parametrlar uchun.',
  },
  {
    lessonKey: 'backend-dars-54',
    order: 3,
    prompt: 'request.GET nimani saqlaydi?',
    choices: [
      'So\'rov GET metodi bilan kelganmi yoki yo\'qmi — True yoki False qiymatini',
      'URL\'dagi ? belgisidan keyingi query parametrlarni (masalan ?q=python&page=2)',
      'Bazadan olingan barcha yozuvlarni',
      'Formada yuborilgan barcha maydonlarni, metodidan qat\'i nazar',
    ],
    correctIndex: 1,
    explanation:
      'request.GET — URL\'ning savol belgisidan keyingi qismidan yig\'ilgan lug\'atsimon obyekt; parametr bo\'lmasligi mumkin bo\'lgani uchun request.GET.get(\'q\', \'\') deb zaxira qiymat bilan olish xavfsiz. POST bilan kelgan forma ma\'lumoti esa request.POST da bo\'ladi.',
  },
  {
    lessonKey: 'backend-dars-54',
    order: 4,
    prompt: 'blog app\'ining manzillarini project\'ga ulash uchun asosiy urls.py da qaysi qator to\'g\'ri?',
    choices: [
      'path(\'blog/\', \'blog.urls\')',
      'path(\'blog/\', import blog.urls)',
      'include(\'blog/\', path(\'blog.urls\'))',
      'path(\'blog/\', include(\'blog.urls\'))',
    ],
    correctIndex: 3,
    explanation:
      'path() ikkinchi argument sifatida yo view funksiyasini, yo include(...) natijasini kutadi — modul nomini oddiy matn ko\'rinishida bersangiz ishlamaydi. include() app\'ning urls.py faylidagi barcha manzillarni blog/ prefiksi ostiga ulaydi.',
  },
  {
    lessonKey: 'backend-dars-54',
    order: 5,
    prompt: 'MVT sxemasida so\'rov qanday yo\'l bosib o\'tadi?',
    choices: [
      'Template → Model → View → Javob',
      'View → URL → Model → Javob',
      'URL → View → (Model va Template) → Javob',
      'Model → URL → Template → Javob',
    ],
    correctIndex: 2,
    explanation:
      'So\'rov avval URL tizimiga tushadi, u mos View\'ni topadi; View kerak bo\'lsa Model orqali ma\'lumot oladi va Template bilan sahifani yig\'ib, javob qaytaradi. Ya\'ni boshqaruv markazi — View, kirish nuqtasi esa URL.',
  },
];
