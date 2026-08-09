import type { LessonQuizRecord } from './backendQuiz.m1a';

// Hand-authored MCQs derived from the lesson decks' TEKSHIRUV slides.
//
// Scope: backend lessons 83..89 (`backend-dars-83` .. `backend-dars-89`), 5 questions each = 35.
// Every prompt is a light rewrite of the curriculum author's original open recap question so that
// it has exactly one defensible answer. Distractors are real beginner misconceptions for that exact
// topic — Nginx "Python kodini tezlashtiradi", depends_on "tayyorlikni kutadi", maxfiy kalitni
// serverga yuklash, CI/CD aralashuvi, entity = jadvaldagi qator, seed = random seed — so a wrong
// pick is diagnostic rather than decorative.
//
// `explanation` is shown to the student AFTER they answer; it is the teaching moment.

export const backendQuizB11: LessonQuizRecord[] = [
  // ───────────────────────────── Dars 83 — Gunicorn & Nginx ─────────────────────────────
  {
    lessonKey: 'backend-dars-83',
    order: 1,
    prompt: 'WSGI nima?',
    choices: [
      'Python web-ilova bilan web-server o\'rtasidagi standart interfeys',
      'Python paketlarini serverga o\'rnatuvchi vosita',
      'Django\'ning shablon (template) tili',
      'HTTPS sertifikatlarini saqlash formati',
    ],
    correctIndex: 0,
    explanation:
      'WSGI — kelishuv (interfeys): server so\'rovni Python ilovaga qanday uzatishi va javobni qanday olishi shu standart bilan belgilanadi. Aynan shu tufayli Gunicorn Django kodini o\'zgartirmasdan ishga tushira oladi.',
  },
  {
    lessonKey: 'backend-dars-83',
    order: 2,
    prompt: 'Prod\'da Gunicorn oldiga Nginx qo\'yishning asosiy sababi nima?',
    choices: [
      'U Python kodini kompilyatsiya qilib, ilovani tezroq bajaradi',
      'U Gunicorn o\'rniga Python kodini o\'zi ishga tushiradi',
      'U oldinda turadi: static fayllarni o\'zi beradi, qolgan so\'rovlarni Gunicorn\'ga uzatadi',
      'U ma\'lumotlar bazasini o\'z ichida saqlab, so\'rovlarni kamaytiradi',
    ],
    correctIndex: 2,
    explanation:
      'Nginx — reverse proxy: rasm, CSS va JS kabi statik fayllarni Python\'ga umuman tegmasdan o\'zi qaytaradi, dinamik so\'rovlarnigina Gunicorn\'ga uzatadi. U Python kodini bajarmaydi va uni «tezlashtirmaydi».',
  },
  {
    lessonKey: 'backend-dars-83',
    order: 3,
    prompt: 'collectstatic buyrug\'i nima qiladi?',
    choices: [
      'Static fayllarni siqib (minify qilib) hajmini kichraytiradi',
      'Barcha app va admin static fayllarini bitta joyga — STATIC_ROOT ga yig\'adi',
      'Static fayllarni ma\'lumotlar bazasiga yozib qo\'yadi',
      'Static fayllarni brauzer keshiga oldindan yuklaydi',
    ],
    correctIndex: 1,
    explanation:
      'collectstatic har bir app ichida sochilib yotgan static fayllarni STATIC_ROOT papkasiga nusxalaydi, toki Nginx ularni bitta papkadan bera olsin. DEBUG=False bo\'lganda bu qadam majburiy — aks holda CSS/JS ko\'rinmaydi.',
  },
  {
    lessonKey: 'backend-dars-83',
    order: 4,
    prompt: 'SSH kalit juftligida qaysi kalit serverga ko\'chiriladi?',
    choices: [
      'Maxfiy (private) kalit — server uni tekshirishi kerak',
      'Ikkala kalit ham serverga ko\'chiriladi',
      'Hech qaysi kalit ko\'chirilmaydi, faqat parol ishlatiladi',
      'Ochiq (public) kalit — maxfiy kalit esa faqat sizda qoladi',
    ],
    correctIndex: 3,
    explanation:
      'Serverga faqat OCHIQ kalit qo\'yiladi (~/.ssh/authorized_keys), maxfiy kalit esa hech qachon kompyuteringizdan chiqmaydi. Maxfiy kalitni serverga yuklash — butun himoyani yo\'qqa chiqaradigan xato.',
  },
  {
    lessonKey: 'backend-dars-83',
    order: 5,
    prompt: 'docker-compose\'dagi depends_on nimani kafolatlaydi?',
    choices: [
      'Bog\'liq xizmat to\'liq tayyor bo\'lguncha kutadi',
      'Xizmatlar o\'rtasida umumiy tarmoq yaratadi',
      'Faqat ishga tushirish TARTIBINI beradi — tayyorlikni kafolatlamaydi',
      'Bog\'liq xizmat yiqilsa, uni avtomatik qayta ishga tushiradi',
    ],
    correctIndex: 2,
    explanation:
      'depends_on faqat «avval db, keyin web» deb tartib belgilaydi: konteyner ishga tushgan bo\'lishi mumkin, lekin Postgres hali ulanishga tayyor bo\'lmasligi mumkin. Haqiqiy tayyorlik uchun healthcheck kerak.',
  },

  // ───────────────────────────── Dars 84 — Deploy & CI/CD ─────────────────────────────
  {
    lessonKey: 'backend-dars-84',
    order: 1,
    prompt: 'PaaS (Railway, Render) va VPS o\'rtasidagi asosiy farq nima?',
    choices: [
      'PaaS\'da SSH orqali serverni o\'zingiz sozlaysiz, VPS\'da esa git push qilasiz',
      'PaaS\'da platforma serverni o\'zi boshqaradi — siz kodni push qilasiz; VPS\'da hamma sozlash sizning zimmangizda',
      'PaaS — bu ma\'lumotlar bazasi turi, VPS esa web-server turi',
      'PaaS faqat statik saytlar uchun, VPS esa faqat Python uchun ishlaydi',
    ],
    correctIndex: 1,
    explanation:
      'PaaS\'da OS, web-server va deploy jarayoni platforma zimmasida — siz faqat kodni push qilasiz. VPS\'da esa Nginx, Gunicorn, firewall va yangilanishlarni o\'zingiz sozlaysiz; shuning uchun birinchi loyihalarga PaaS qulayroq.',
  },
  {
    lessonKey: 'backend-dars-84',
    order: 2,
    prompt: 'CI (Continuous Integration) aynan nima qiladi?',
    choices: [
      'Har push\'da kodni avtomatik serverga chiqarib, prod\'ni yangilaydi',
      'Kodni avtomatik yozib beradi va xatolarni o\'zi tuzatadi',
      'Kod uslubini tekshirib, faylni formatlab qo\'yadi, xolos',
      'Har push va PR\'da testlar hamda tekshiruvlarni avtomatik ishga tushiradi',
    ],
    correctIndex: 3,
    explanation:
      'CI — har o\'zgarishda testlarni avtomatik ishga tushirib, buzilgan kodni darhol ko\'rsatadi. Kodni serverga chiqarish — bu allaqachon CD, boshqa bosqich.',
  },
  {
    lessonKey: 'backend-dars-84',
    order: 3,
    prompt: 'manage.py check --deploy nima qiladi?',
    choices: [
      'Prod uchun xavfli sozlamalarni topib, ogohlantirishlar ro\'yxatini beradi',
      'Loyihani serverga deploy qiladi',
      'Barcha testlarni ishga tushiradi',
      'Bajarilmagan migratsiyalarni topib, ularni qo\'llaydi',
    ],
    correctIndex: 0,
    explanation:
      'check --deploy hech narsa deploy qilmaydi — u DEBUG, SECRET_KEY, ALLOWED_HOSTS, HTTPS kabi prod sozlamalarini tekshirib, muammolarni sanab beradi. Deploy\'dan oldin bu ro\'yxatni tozalash kerak.',
  },
  {
    lessonKey: 'backend-dars-84',
    order: 4,
    prompt: 'DEBUG=False bilan deploy qilganingizdan keyin saytda CSS va JS yo\'qoldi. Eng ehtimolli sabab nima?',
    choices: [
      'SECRET_KEY noto\'g\'ri yozilgan',
      'Brauzer keshi eskirgan — Ctrl+F5 bosish kifoya',
      'collectstatic bajarilmagan, shuning uchun STATIC_ROOT bo\'sh',
      'DEBUG=False static fayllarni butunlay o\'chiradi, buni tuzatib bo\'lmaydi',
    ],
    correctIndex: 2,
    explanation:
      'DEBUG=True bo\'lganda Django static fayllarni o\'zi berib turadi; DEBUG=False bo\'lishi bilan bu to\'xtaydi va fayllarni Nginx (yoki WhiteNoise) STATIC_ROOT dan berishi kerak. Shuning uchun deploy\'da collectstatic majburiy qadam.',
  },
  {
    lessonKey: 'backend-dars-84',
    order: 5,
    prompt: 'Yangi VPS\'ga parolsiz SSH bilan kirish uchun nima qilinadi?',
    choices: [
      'Maxfiy kalit fayli serverga scp bilan yuklanadi',
      'Ochiq kalit serverdagi ~/.ssh/authorized_keys fayliga qo\'shiladi',
      'Server paroli loyihaning .env fayliga yoziladi',
      'root foydalanuvchining paroli butunlay o\'chirib tashlanadi',
    ],
    correctIndex: 1,
    explanation:
      'Server sizning ochiq kalitingizni authorized_keys da saqlaydi va ulanishda maxfiy kalitingiz bilan imzolangan javobni tekshiradi. Maxfiy kalit serverga hech qachon yuborilmaydi.',
  },

  // ───────────────────────────── Dars 85 — Loyiha rejasi ─────────────────────────────
  {
    lessonKey: 'backend-dars-85',
    order: 1,
    prompt: 'MVP (Minimum Viable Product) nima?',
    choices: [
      'Loyihaning yarim tayyor, hali ishlamaydigan demo versiyasi',
      'Eng ko\'p funksiyaga ega, to\'liq tugallangan versiya',
      'Eng kichik, lekin TUGALLANGAN va foydalanuvchiga real foyda beradigan versiya',
      'Faqat dizayn maketi — kod hali yozilmagan bosqich',
    ],
    correctIndex: 2,
    explanation:
      'MVP «kichik» degani «chala» degani emas: bitta asosiy oqim boshidan oxirigacha ishlashi kerak. Portfolio uchun ham aynan tugallangan kichik loyiha yarim tayyor kattasidan kuchliroq.',
  },
  {
    lessonKey: 'backend-dars-85',
    order: 2,
    prompt: 'User story qanday shaklda yoziladi?',
    choices: [
      'KIM sifatida, NIMA qilmoqchiman, NIMA UCHUN',
      'Qaysi jadval, qaysi endpoint, qaysi HTTP metod',
      'Foydalanuvchining tarjimai holi va qiziqishlari haqida hikoya',
      'Xatolik hisoboti: nima kutilgan, nima bo\'lgan, qanday takrorlanadi',
    ],
    correctIndex: 0,
    explanation:
      'User story foydalanuvchi tilida yoziladi: «O\'quvchi sifatida kursga yozilmoqchiman, chunki darslarga kirish kerak». Jadval va endpoint — bu yechim, u keyin, dizayn bosqichida paydo bo\'ladi.',
  },
  {
    lessonKey: 'backend-dars-85',
    order: 3,
    prompt: 'MoSCoW\'dagi WON\'T ro\'yxati nima uchun kerak?',
    choices: [
      'Texnik jihatdan umuman bajarib bo\'lmaydigan ishlarni sanab qo\'yish uchun',
      'Loyihada topilgan xatoliklarni yig\'ib borish uchun',
      'Keyingi sprintda majburiy bajariladigan ishlarni belgilash uchun',
      'Bu versiyada QILINMAYDIGAN ishlarni ochiq yozib, loyiha doirasi kengayib ketishini to\'xtatish uchun',
    ],
    correctIndex: 3,
    explanation:
      'WON\'T — «hozircha yo\'q» ro\'yxati: u imkonsiz ishlar emas, ongli ravishda keyinga qoldirilgan ishlar. Yozib qo\'yilmasa, loyiha doirasi sekin-asta kengayib, MVP hech qachon tugamaydi.',
  },
  {
    lessonKey: 'backend-dars-85',
    order: 4,
    prompt: 'CI sozlangan loyihaga testni buzadigan kod push qilinsa nima bo\'ladi?',
    choices: [
      'Hech narsa — CI faqat prod\'ga deploy qilinganda ishlaydi',
      'CI avtomatik ishga tushib testlarni bajaradi va push/PR "failed" deb belgilanadi',
      'Buzilgan test avtomatik o\'chirib tashlanadi',
      'Kod CI tomonidan avtomatik tuzatilib, qayta commit qilinadi',
    ],
    correctIndex: 1,
    explanation:
      'CI\'ning butun maqsadi — xatoni push paytida, prod\'ga yetib bormasdan oldin ushlash. U kodni tuzatmaydi ham, testni o\'chirmaydi ham; faqat halol natijani ko\'rsatadi.',
  },
  {
    lessonKey: 'backend-dars-85',
    order: 5,
    prompt: 'check --deploy asosan nimani tekshiradi?',
    choices: [
      'Kod uslubi PEP8 ga mos yozilganini',
      'Domen va internet aloqasi ishlayotganini',
      'Modellar va migratsiyalar bir-biriga mosligini',
      'Prod uchun xavfsizlikka oid sozlamalarni: DEBUG, SECRET_KEY, ALLOWED_HOSTS, HTTPS',
    ],
    correctIndex: 3,
    explanation:
      'check --deploy — bu xavfsizlik nazorati ro\'yxati: u DEBUG=True qolib ketgani yoki ALLOWED_HOSTS bo\'shligi kabi prod uchun xavfli holatlarni aytadi. Kod uslubi yoki migratsiyalar — boshqa vositalarning ishi.',
  },

  // ───────────────────────────── Dars 86 — DB dizayn ─────────────────────────────
  {
    lessonKey: 'backend-dars-86',
    order: 1,
    prompt: 'Talablar hujjatidan entity\'larni qanday topamiz?',
    choices: [
      'Matndagi OTLARni ajratib olamiz — ular entity nomzodlari',
      'Matndagi FE\'LLARni ajratib olamiz — ular entity nomzodlari',
      'Avval endpoint ro\'yxatini yozib, ularning nomidan olamiz',
      'Django admin panelini ochib, u yerdagi bo\'limlardan olamiz',
    ],
    correctIndex: 0,
    explanation:
      'Otlar («o\'quvchi», «kurs», «band») — entity nomzodlari, fe\'llar («yoziladi», «band qiladi») esa munosabat va amallarni ko\'rsatadi. Shuning uchun avval otlarni belgilab, keyin ular orasidagi bog\'lanishlarni chizamiz.',
  },
  {
    lessonKey: 'backend-dars-86',
    order: 2,
    prompt: 'M:N munosabatda bog\'lanishning o\'zida qo\'shimcha ma\'lumot (masalan, yozilgan sana yoki baho) saqlash kerak bo\'lsa nima qilinadi?',
    choices: [
      'Oddiy ManyToManyField yetarli, sanani ikki jadvaldan biriga qo\'shib qo\'yiladi',
      'Munosabat 1:N ga aylantiriladi va ortiqcha jadval yaratilmaydi',
      'Qo\'shimcha ma\'lumot JSON maydonida saqlanadi',
      'Bog\'lanish uchun alohida entity (junction / through model) yaratiladi',
    ],
    correctIndex: 3,
    explanation:
      'Sana yoki baho na o\'quvchiga, na kursga tegishli — u aynan «o\'quvchi + kurs» juftligiga tegishli. Shuning uchun oraliq entity (Django\'da through model) yaratiladi va qo\'shimcha maydonlar shu yerga qo\'yiladi.',
  },
  {
    lessonKey: 'backend-dars-86',
    order: 3,
    prompt: 'Modelda foydalanuvchiga bog\'lanish yozayotganda nima uchun settings.AUTH_USER_MODEL ishlatiladi?',
    choices: [
      'U parolni shifrlash algoritmini belgilaydi',
      'U login sahifasining manzilini belgilaydi',
      'Loyihada qaysi User modeli faol bo\'lsa, bog\'lanish o\'shanga ketadi — model almashsa kod buzilmaydi',
      'U admin panelga kim kira olishini belgilaydi',
    ],
    correctIndex: 2,
    explanation:
      'User modelini to\'g\'ridan-to\'g\'ri import qilsangiz, keyinchalik custom User modelga o\'tishda hamma ForeignKey buziladi. settings.AUTH_USER_MODEL orqali bog\'lansangiz, Django faol modelni o\'zi topadi.',
  },
  {
    lessonKey: 'backend-dars-86',
    order: 4,
    prompt: 'Yakuniy loyiha uchun MVP doirasini belgilashda qaysi yondashuv to\'g\'ri?',
    choices: [
      'Iloji boricha ko\'p funksiyani yarim tayyor holda qilib qo\'yish',
      'Bitta asosiy foydalanuvchi oqimini boshidan oxirigacha to\'liq ishlaydigan qilish',
      'Avval dizaynni mukammal qilib, kodni oxiriga qoldirish',
      'Faqat ma\'lumotlar bazasini qurib, API\'ni keyingi loyihaga qoldirish',
    ],
    correctIndex: 1,
    explanation:
      'MVP — kesib qisqartirilgan, lekin ishlaydigan mahsulot: bitta oqim (masalan, «ro\'yxatdan o\'tish → kitob band qilish → tarixni ko\'rish») to\'liq ishlashi kerak. Yarim tayyor o\'nta funksiya portfolioda hech narsa isbotlamaydi.',
  },
  {
    lessonKey: 'backend-dars-86',
    order: 5,
    prompt: 'Quyidagilardan qaysi biri to\'g\'ri yozilgan user story?',
    choices: [
      'O\'quvchi sifatida kursga yozilmoqchiman, chunki darslarga kira olishim kerak',
      'Course jadvaliga student_id ustunini qo\'shish kerak',
      'POST /api/enrollments endpointini yozish',
      'Yozilish tugmasi bosilganda 500 xatolik chiqmoqda',
    ],
    correctIndex: 0,
    explanation:
      'User story uch qismdan iborat: KIM (o\'quvchi), NIMA (kursga yozilish), NIMA UCHUN (darslarga kirish). Qolgan variantlar — texnik vazifa, endpoint va bug hisoboti, bular user story emas.',
  },

  // ───────────────────────────── Dars 87 — Setup & Modellar ─────────────────────────────
  {
    lessonKey: 'backend-dars-87',
    order: 1,
    prompt: 'Sozlamalar nima uchun base / dev / prod fayllariga bo\'linadi?',
    choices: [
      'Django ishga tushganda dev yoki prod faylini muhitga qarab o\'zi tanlab oladi',
      'Django 4-versiyadan boshlab buni majburiy qilgan',
      'Har bir app o\'z alohida sozlama fayliga ega bo\'lishi uchun',
      'Ishlab chiqish va prod turli qiymatlarni talab qiladi (DEBUG, baza, hostlar), umumiy qism esa base\'da bir marta yoziladi',
    ],
    correctIndex: 3,
    explanation:
      'Dev\'da DEBUG=True va SQLite qulay, prod\'da esa DEBUG=False, Postgres va qat\'iy ALLOWED_HOSTS kerak. Umumiy qismni base\'da saqlab, farqlarni dev/prod\'ga ajratish — bitta faylda if\'lar yozishdan ancha xavfsiz.',
  },
  {
    lessonKey: 'backend-dars-87',
    order: 2,
    prompt: 'Django\'da management command nima?',
    choices: [
      'Admin paneldagi tugma orqali ishga tushadigan amal',
      'manage.py orqali chaqiriladigan, o\'zingiz yozgan buyruq',
      'Migratsiyaning maxsus bir turi',
      'Terminalda yozilgan har qanday bash skript',
    ],
    correctIndex: 1,
    explanation:
      'management/commands/ ichiga fayl yozsangiz, u `python manage.py <nom>` bilan ishga tushadi va Django sozlamalari hamda ORM\'ga to\'liq kirish oladi. Aynan shuning uchun seed, hisobot, tozalash kabi ishlar shu ko\'rinishda yoziladi.',
  },
  {
    lessonKey: 'backend-dars-87',
    order: 3,
    prompt: 'Seed buyrug\'i nima uchun kerak?',
    choices: [
      'Ma\'lumotlar bazasini zaxiralash (backup) uchun',
      'Bajarilmagan migratsiyalarni ishga tushirish uchun',
      'Bazani sinov ma\'lumotlari bilan to\'ldirib, bo\'sh baza bilan ishlashdan qutqarish uchun',
      'Tasodifiy sonlar generatoriga boshlang\'ich qiymat berish uchun',
    ],
    correctIndex: 2,
    explanation:
      'Seed — bazaga namunaviy foydalanuvchi, kurs, buyurtma kabi ma\'lumotlarni bir buyruq bilan solib beradi. Shuning uchun loyihani klon qilgan yangi dasturchi ham darhol ishlaydigan sahifalarni ko\'radi.',
  },
  {
    lessonKey: 'backend-dars-87',
    order: 4,
    prompt: '«O\'quvchi kursga yoziladi va har dars uchun baho oladi» — shu talabda entity nomzodlari qaysilari?',
    choices: [
      'O\'quvchi, Kurs, Dars, Baho',
      'yoziladi, oladi',
      'O\'quvchi va har',
      'Kursga, dars uchun',
    ],
    correctIndex: 0,
    explanation:
      'Entity\'lar — otlar: O\'quvchi, Kurs, Dars, Baho. «yoziladi» va «oladi» fe\'llari esa entity emas, ular munosabatlarni ko\'rsatadi.',
  },
  {
    lessonKey: 'backend-dars-87',
    order: 5,
    prompt: 'MoSCoW nima?',
    choices: [
      'Django loyihasining tavsiya etilgan papka strukturasi',
      'Talablarni Must / Should / Could / Won\'t bo\'yicha ustuvorlashtirish usuli',
      'Ma\'lumotlar bazasi normalizatsiyasining bir darajasi',
      'Agile\'da sprint uzunligini hisoblash formulasi',
    ],
    correctIndex: 1,
    explanation:
      'MoSCoW har bir talabni to\'rt guruhga ajratadi: Must (majburiy), Should (kerak), Could (bo\'lsa yaxshi), Won\'t (hozircha yo\'q). Bu MVP doirasini aniq belgilashning eng oddiy usuli.',
  },

  // ───────────────────────────── Dars 88 — API — asosiy ─────────────────────────────
  {
    lessonKey: 'backend-dars-88',
    order: 1,
    prompt:
      'Post modelida `muallif = ForeignKey(User)` va `teglar = ManyToManyField(Teg)` bor. Postlar ro\'yxatini muallifi va teglari bilan birga chiqarmoqchisiz. Queryset qanday yozilishi kerak?',
    choices: [
      'Post.objects.select_related(\'muallif\', \'teglar\')',
      'Post.objects.prefetch_related(\'muallif\', \'teglar\')',
      'Post.objects.select_related(\'muallif\').prefetch_related(\'teglar\')',
      'Post.objects.all() — DRF serializer bog\'lanishlarni o\'zi optimallashtiradi',
    ],
    correctIndex: 2,
    explanation:
      'Har bir bog\'lanishga o\'z quroli: ForeignKey «bitta tomonga» olib boradi, shuning uchun JOIN mantiqiy — select_related. ManyToMany\'ni select_related\'ga bersangiz Django hatto so\'rov yubormasdan xato beradi: `FieldError: Invalid field name(s) given in select_related: \'teglar\'`. Teglar uchun prefetch_related alohida so\'rov yuborib, natijani Python\'da bog\'laydi. Ikkalasini zanjir qilib yozish — odatiy amaliy yechim.',
  },
  {
    lessonKey: 'backend-dars-88',
    order: 2,
    prompt: 'Router\'ga ViewSet ro\'yxatdan o\'tkazayotganda basename qachon majburiy bo\'ladi?',
    choices: [
      'ViewSet\'da queryset atributi yo\'q bo\'lib, faqat get_queryset() yozilgan bo\'lsa',
      'Har doim — basename\'siz register() umuman ishlamaydi',
      'Faqat ModelViewSet\'dan foydalanilganda',
      'URL\'dagi prefiksni o\'zgartirmoqchi bo\'lganingizda',
    ],
    correctIndex: 0,
    explanation:
      'Router URL nomlarini odatda queryset.model dan avtomatik oladi; queryset atributi bo\'lmasa, u nom o\'ylab topa olmaydi va basename so\'raydi. URL prefiksi esa register()ning birinchi argumenti bilan belgilanadi, basename bilan emas.',
  },
  {
    lessonKey: 'backend-dars-88',
    order: 3,
    prompt: 'Foydalanuvchi faqat o\'z yozuvlarini ko\'rishi uchun filtrni nima uchun get_queryset() ichida yozish ishonchli?',
    choices: [
      'Chunki u so\'rovni bir necha barobar tezlashtiradi',
      'Chunki u SQL injection hujumidan himoya qiladi',
      'Chunki u filtrni frontend kodidan yashiradi',
      'Chunki u har so\'rovda qayta hisoblanadi va request.user ga qarab bazadan chegaralangan natija oladi',
    ],
    correctIndex: 3,
    explanation:
      'queryset atributi klass yuklanganda bir marta hisoblanadi va request haqida hech narsa bilmaydi. get_queryset() esa har so\'rovda chaqiriladi, shuning uchun .filter(user=self.request.user) cheklovi bazaning o\'zida qo\'llanadi va begona yozuv umuman kelmaydi.',
  },
  {
    lessonKey: 'backend-dars-88',
    order: 4,
    prompt: 'DJANGO_SETTINGS_MODULE muhit o\'zgaruvchisi nima qiladi?',
    choices: [
      'Django\'ning qaysi versiyasidan foydalanishni belgilaydi',
      'Django qaysi sozlama modulini yuklashini belgilaydi (masalan, config.settings.prod)',
      'Import yo\'llarini belgilaydi, xuddi PYTHONPATH kabi',
      'Faqat log fayllariga yoziladi, hech narsaga ta\'sir qilmaydi',
    ],
    correctIndex: 1,
    explanation:
      'Sozlamalarni base/dev/prod ga bo\'lgach, Django qaysi birini o\'qishini shu o\'zgaruvchidan biladi. Serverda uni config.settings.prod ga qo\'yish — dev sozlamalari prod\'ga tushib qolishining oldini oladi.',
  },
  {
    lessonKey: 'backend-dars-88',
    order: 5,
    prompt: 'Ma\'lumotlar bazasi dizaynida entity nimani anglatadi?',
    choices: [
      'Modeldagi bitta maydon (ustun)',
      'Ikki jadval o\'rtasidagi bog\'lanish',
      'Saqlanadigan obyekt TURI — odatda alohida jadval (masalan, Kitob)',
      'Jadvaldagi bitta aniq qator (masalan, «Alisher Navoiy asarlari» kitobi)',
    ],
    correctIndex: 2,
    explanation:
      'Entity — tur, ya\'ni jadval (Kitob); jadvaldagi bitta qator esa o\'sha entity\'ning nusxasi (instance). Bu ikkisini aralashtirib yuborish ER diagrammada eng ko\'p uchraydigan xato.',
  },

  // ───────────────────────────── Dars 89 — Biznes logika ─────────────────────────────
  {
    lessonKey: 'backend-dars-89',
    order: 1,
    prompt: 'Bir nechta o\'zgarish birga bajarilishi kerak bo\'lganda tranzaksiya (@transaction.atomic) nima uchun kerak?',
    choices: [
      'U so\'rovni tezlashtiradi, chunki barcha SQL bitta paketda ketadi',
      'U bir vaqtning o\'zida ko\'p foydalanuvchi kirishiga imkon beradi',
      'U xatolik yuz berganda uni logga yozib qo\'yadi',
      'Amallarning YO hammasi bajariladi, YO hech biri — o\'rtada uzilib qolgan holat qolmaydi',
    ],
    correctIndex: 3,
    explanation:
      'Tranzaksiya atomiklikni beradi: agar ikkinchi amal xato bersa, birinchisi ham qaytariladi (rollback). Aks holda baza «pul yechildi, lekin buyurtma yaratilmadi» kabi buzuq holatda qolib ketadi.',
  },
  {
    lessonKey: 'backend-dars-89',
    order: 2,
    prompt: 'select_for_update() nimadan himoya qiladi?',
    choices: [
      'SQL injection hujumidan',
      'Ikki so\'rov bir vaqtda bir xil qatorni o\'qib, bir-birining o\'zgarishini bosib ketishidan (race condition)',
      'Ma\'lumot yo\'qolishidan — u avtomatik zaxira nusxa oladi',
      'Sekin so\'rovlardan — u indeks qo\'shib beradi',
    ],
    correctIndex: 1,
    explanation:
      'select_for_update() qatorni tranzaksiya tugagunicha qulflaydi, shuning uchun ikkinchi so\'rov navbat kutadi. Aynan shu bilan «oxirgi bitta joyni ikki kishi band qildi» kabi holatlar oldi olinadi.',
  },
  {
    lessonKey: 'backend-dars-89',
    order: 3,
    prompt: 'Biznes mantiqni view\'dan services.py ga ajratishning asosiy sababi nima?',
    choices: [
      'Mantiq HTTP\'dan mustaqil bo\'lib qoladi: uni qayta ishlatish ham, test qilish ham oson bo\'ladi',
      'Django bunday tuzilmani majbur qiladi',
      'Kod bir necha barobar tezroq ishlay boshlaydi',
      'services.py dagi funksiyalar Django tomonidan avtomatik tranzaksiyaga o\'raladi',
    ],
    correctIndex: 0,
    explanation:
      'services.py dagi funksiyani chaqirish uchun request ham, URL ham kerak emas — uni to\'g\'ridan-to\'g\'ri testdan, management command\'dan yoki Celery task\'dan chaqirish mumkin. View esa faqat so\'rovni qabul qilib, javob qaytarish bilan shug\'ullanadi.',
  },
  {
    lessonKey: 'backend-dars-89',
    order: 4,
    prompt: 'ViewSet\'da queryset o\'rniga faqat get_queryset() yozdingiz va router\'da register() chaqirdingiz. Nima bo\'ladi?',
    choices: [
      'Hammasi ishlaydi — router nomni get_queryset() ni chaqirib aniqlaydi',
      'Endpoint ishlaydi, lekin faqat GET so\'rovlarini qabul qiladi',
      'Xatolik chiqadi: basename ko\'rsatilishi kerak',
      'Django avtomatik ravishda ViewSet klass nomini basename qilib oladi',
    ],
    correctIndex: 2,
    explanation:
      'Router URL nomlarini queryset.model dan oladi; queryset atributi yo\'q bo\'lsa, u nomni aniqlay olmay xato beradi. Yechim — register(\'books\', BookViewSet, basename=\'book\') deb yozish.',
  },
  {
    lessonKey: 'backend-dars-89',
    order: 5,
    prompt: 'Yangi jamoadosh loyihani klon qildi, migratsiyalarni bajardi, lekin baza bo\'sh va hech bir sahifani sinab ko\'rolmayapti. Eng to\'g\'ri yechim qaysi?',
    choices: [
      'Seed management command yozib, u namunaviy ma\'lumotlarni bir buyruq bilan yaratsin',
      'Prod bazasining to\'liq dumpini unga yuborish',
      'Ma\'lumotlarni admin panelda qo\'lda kiritib chiqish',
      'Migratsiyalarni o\'chirib, qaytadan makemigrations qilish',
    ],
    correctIndex: 0,
    explanation:
      'Migratsiyalar faqat jadval strukturasini yaratadi, ma\'lumot solmaydi — buning uchun seed buyrug\'i kerak. Prod dumpini tarqatish esa real foydalanuvchi ma\'lumotlarini oshkor qilgani uchun xavfli.',
  },
];
