import type { LessonQuizRecord } from './backendQuiz.m1a';
// Hand-authored MCQs derived from the lesson decks' TEKSHIRUV slides.
//
// Scope: backend lessons 34..40 (`backend-dars-34` .. `backend-dars-40`), 5 questions each = 35.
// Mavzular: virtual muhit → PEP 8 & type hints → OOP mini-loyiha → Git → branch/merge → GitHub → SQL SELECT.
//
// Har bir prompt — kurs muallifining asl ochiq savolining yengil qayta yozilgan, bitta aniq javobli
// varianti. Distraktorlar shu mavzudagi haqiqiy boshlang'ich xatolar: «venv paketni tezlashtiradi»,
// «type hints xato bo'lsa dastur ishlamaydi», «git add commit qiladi», «merge'dan oldin branchda
// turish kerak», «WHERE ustunni tanlaydi», «ORDER BY DESC eng kichigidan boshlaydi».
//
// Python/SQL javoblari Piston sandboxda haqiqatan ishga tushirib tekshirilgan.

export const backendQuizB04: LessonQuizRecord[] = [
  // ───────────────────────────────── Dars 34 — Virtual muhit ─────────────────────────────────
  {
    lessonKey: 'backend-dars-34',
    order: 1,
    prompt: 'Virtual muhit (venv) asosan qaysi muammoni hal qiladi?',
    choices: [
      'Kodni tezroq ishlatadi, chunki Python faqat kerakli paketlarni yuklaydi',
      'Kodni boshqa dasturchilardan yashirib, himoyalab qo\'yadi',
      'Har loyihaga o\'z paketlari va ularning o\'z versiyalarini beradi — loyihalar to\'qnashmaydi',
      'Internetsiz ishlash imkonini beradi, paketlar oldindan ichida turadi',
    ],
    correctIndex: 2,
    explanation:
      'venv — izolyatsiya vositasi: A loyihaga Django 3, B loyihaga Django 5 kerak bo\'lsa, ikkalasi ham o\'z muhitida tinch yashaydi. U tezlik ham, himoya ham emas — faqat paketlarni ajratadi.',
  },
  {
    lessonKey: 'backend-dars-34',
    order: 2,
    prompt: 'Virtual muhit hozir faolligini eng ishonchli qanday bilamiz?',
    choices: [
      'Terminal satri boshida muhit nomi, masalan (.venv), paydo bo\'ladi',
      'Loyiha papkasida .venv papkasi turgan bo\'lsa — demak muhit faol',
      'python fayl.py buyrug\'i xatosiz ishlasa — demak muhit faol',
      'requirements.txt fayli mavjud bo\'lsa — demak muhit faol',
    ],
    correctIndex: 0,
    explanation:
      'activate qilgandan keyin terminal satri oldiga (.venv) yozuvi qo\'shiladi — bu yagona to\'g\'ridan-to\'g\'ri belgi. .venv papkasining mavjudligi muhit yaratilganini bildiradi, lekin faolligini emas: activate qilmasangiz pip global Python\'ga o\'rnatadi.',
  },
  {
    lessonKey: 'backend-dars-34',
    order: 3,
    prompt: '.venv papkasi Git repozitoriysiga qo\'shiladimi?',
    choices: [
      'Ha, aks holda boshqa dasturchi loyihani ishga tushira olmaydi',
      'Ha, lekin faqat bir marta — birinchi commit\'da',
      'Yo\'q, uning o\'rniga .venv ichidagi paketlar ro\'yxatini qo\'lda README\'ga yozamiz',
      'Yo\'q — .venv .gitignore\'ga kiritiladi, uning o\'rniga requirements.txt commit qilinadi',
    ],
    correctIndex: 3,
    explanation:
      '.venv — o\'nlab megabayt, operatsion tizimga bog\'liq, qayta tiklanadigan papka. Git\'ga faqat requirements.txt kiradi; sherigingiz venv yaratib, pip install -r requirements.txt bilan aynan o\'sha muhitni tiklaydi.',
  },
  {
    lessonKey: 'backend-dars-34',
    order: 4,
    prompt: 'Decorator funksiya bilan aslida nima qiladi?',
    choices: [
      'Funksiya kodini ichidan o\'zgartirib, yangi satrlar qo\'shib qo\'yadi',
      'Funksiyani o\'rab, uning oldi/ketidan qo\'shimcha ish bajaradi — asl kodga tegmaydi',
      'Funksiyani tezlashtiradi, chunki natijasini doim keshlab qo\'yadi',
      'Funksiyani boshqa faylga ko\'chirib, import qilinadigan qiladi',
    ],
    correctIndex: 1,
    explanation:
      '@dekorator — bu f = dekorator(f) ning qisqa yozuvi: asl funksiya o\'zgarmaydi, u shunchaki wrapper ichiga o\'raladi. Keshlash — decorator bilan qilish mumkin bo\'lgan ishlardan biri, decorator\'ning o\'zi emas.',
  },
  {
    lessonKey: 'backend-dars-34',
    order: 5,
    prompt: 'Generator xotirani nima hisobiga tejaydi?',
    choices: [
      'Elementlarni siqilgan holda saqlaydi, kerak bo\'lganda ochadi',
      'Elementlarni diskka yozib, xotiradan chiqarib tashlaydi',
      'Barcha elementlarni oldindan yasamaydi — har birini faqat so\'ralgan payt hisoblaydi',
      'Faqat kichik sonlar bilan ishlaydi, katta ma\'lumotni qabul qilmaydi',
    ],
    correctIndex: 2,
    explanation:
      'list barcha elementni darrov xotiraga yig\'adi, generator esa yield\'da pauza qilib turadi va navbatdagi elementni faqat so\'ralganda yasaydi. Shuning uchun million elementli generator bir necha o\'nlab bayt joy egallaydi, xuddi shu list esa megabaytlarni.',
  },

  // ────────────────────────────── Dars 35 — PEP8 & Type hints ──────────────────────────────
  {
    lessonKey: 'backend-dars-35',
    order: 1,
    prompt: 'PEP 8 nima?',
    choices: [
      'Python tilining 8-versiyasi',
      'Python kodini yozish uslubi bo\'yicha rasmiy tavsiyalar to\'plami',
      'Python sintaksisining qat\'iy qoidalari — buzilsa kod ishlamaydi',
      'Python paketlarini o\'rnatish uchun standart vosita',
    ],
    correctIndex: 1,
    explanation:
      'PEP 8 — uslub bo\'yicha kelishuv: 4 bo\'sh joy, snake_case funksiya uchun, CamelCase class uchun. U sintaksis emas — PEP 8 ga zid yozilgan kod ham bemalol ishlaydi, faqat o\'qish qiyinlashadi.',
  },
  {
    lessonKey: 'backend-dars-35',
    order: 2,
    prompt: 'def f(x: int) -> int deb yozib, funksiyaga matn bersak nima bo\'ladi?',
    choices: [
      'Python darhol TypeError beradi va dastur to\'xtaydi',
      'Python matnni avtomatik songa aylantirishga urinadi',
      'Funksiya chaqirilmaydi, o\'rniga None qaytadi',
      'Hech qanday xato bo\'lmaydi — type hints ishlash paytida tekshirilmaydi',
    ],
    correctIndex: 3,
    explanation:
      'Type hints — bu izoh, majburiyat emas: Python ularni ishlash paytida umuman tekshirmaydi. Ular IDE va mypy kabi vositalar uchun, ular sizga xatoni kod yozayotgan paytingizdayoq ko\'rsatadi.',
  },
  {
    lessonKey: 'backend-dars-35',
    order: 3,
    prompt: 'black va flake8 orasidagi asosiy farq nima?',
    choices: [
      'black faylni o\'zi qayta formatlaydi, flake8 esa faqat muammolarni ro\'yxat qilib ko\'rsatadi',
      'black uslubni, flake8 esa kod tezligini tekshiradi',
      'black eski Python uchun, flake8 yangi Python uchun mo\'ljallangan',
      'Ikkalasi bir xil ish qiladi, faqat nomlari boshqacha',
    ],
    correctIndex: 0,
    explanation:
      'black — formatter: u kodni jimgina o\'zgartirib, yagona uslubga soladi. flake8 — linter: u hech narsani o\'zgartirmaydi, faqat «shu satrda muammo bor» deb aytadi. Shuning uchun loyihada ikkalasi birga ishlatiladi.',
  },
  {
    lessonKey: 'backend-dars-35',
    order: 4,
    prompt: 'Virtual muhitni activate qilmasdan pip install django yozsak nima bo\'ladi?',
    choices: [
      'pip xato beradi: «virtual muhit topilmadi»',
      'Paket loyiha papkasiga o\'rnatiladi, lekin ishlamaydi',
      'Paket global Python\'ga o\'rnatiladi va boshqa loyihalarga ham ta\'sir qiladi',
      'Paket .venv papkasiga baribir o\'rnatiladi — pip uni o\'zi topadi',
    ],
    correctIndex: 2,
    explanation:
      'Muhit faol bo\'lmasa pip tizimdagi global Python\'ga o\'rnatadi. Shu tarzda loyihalar bir-birining paket versiyasini buzadi — venv aynan shuning oldini olish uchun bor.',
  },
  {
    lessonKey: 'backend-dars-35',
    order: 5,
    prompt: 'Quyidagi kod ekranga nima chiqaradi?\n\ndef hisoblagich():\n    son = 0\n    def ichki():\n        nonlocal son\n        son += 1\n        return son\n    return ichki\n\nc = hisoblagich()\nprint(c(), c())\nc2 = hisoblagich()\nprint(c2())',
    choices: [
      '1 1 keyin 1 — son har chaqiruvda qaytadan 0 dan boshlanadi',
      '1 2 keyin 3 — son barcha hisoblagichlar uchun umumiy bo\'ladi',
      'UnboundLocalError — ichki funksiya tashqi funksiyaning o\'zgaruvchisini o\'zgartira olmaydi',
      '1 2 keyin 1 — c o\'z sonini eslab qoladi, c2 esa yangi, alohida son bilan boshlanadi',
    ],
    correctIndex: 3,
    explanation:
      'Piston (Python 3.10) chiqargan natija aynan shunday:\n1 2\n1\nTashqi funksiya tugagandan keyin ham ichki funksiya uning son o\'zgaruvchisini «yopib olib» eslab qoladi — shuning uchun c() ketma-ket 1, 2 beradi. Lekin har bir hisoblagich() chaqiruvi YANGI son yaratadi, shuning uchun c2() yana 1 dan boshlaydi. nonlocal bo\'lmasa esa haqiqatan UnboundLocalError chiqardi.',
  },

  // ──────────────────────────────── Dars 36 — OOP loyiha ────────────────────────────────
  {
    lessonKey: 'backend-dars-36',
    order: 1,
    prompt: 'Nima uchun har bir class bitta mas\'uliyatga ega bo\'lishi kerak?',
    choices: [
      'Bitta joyni o\'zgartirganda butun tizim buzilmaydi va classni sinash oson bo\'ladi',
      'Har bir class alohida faylda turishi shart, fayl esa bitta vazifani bajaradi',
      'Ko\'p mas\'uliyatli class dastur tezligini sezilarli pasaytiradi',
      'Faqat bitta mas\'uliyatli classdan meros olish mumkin',
    ],
    correctIndex: 0,
    explanation:
      'Model, mantiq, saqlash va interfeys alohida classlarda bo\'lsa, saqlash usulini almashtirganda qolgan kodga tegmaysiz. Bu tezlik masalasi emas va «bitta faylga bitta class» qoidasi ham emas — Pythonda bitta faylda nechta class bo\'lsa ham mayli; gap o\'zgarishning ta\'sir doirasini kichraytirishda.',
  },
  {
    lessonKey: 'backend-dars-36',
    order: 2,
    prompt: '@dataclass dekoratori class uchun nimani avtomatik yozib beradi?',
    choices: [
      'Obyektni faylga saqlash va fayldan o\'qish metodlarini',
      'Atributlar turini ishlash paytida tekshiruvchi kodni',
      '__init__, __repr__ va __eq__ metodlarini',
      'Class uchun to\'liq CRUD (qo\'shish, o\'qish, o\'zgartirish, o\'chirish) metodlarini',
    ],
    correctIndex: 2,
    explanation:
      '@dataclass e\'lon qilingan maydonlar asosida konstruktor, chiroyli repr va tenglik solishtirishni o\'zi yozadi. Lekin u turlarni tekshirmaydi va saqlash kodini yozmaydi — buni siz yozasiz.',
  },
  {
    lessonKey: 'backend-dars-36',
    order: 3,
    prompt: 'Obyektlar ro\'yxatini JSON faylga saqlamoqchimiz. To\'g\'ri yo\'l qaysi?',
    choices: [
      'json.dump(obyektlar, f) — json modul har qanday obyektni o\'zi tushunadi',
      'Har obyektni avval dict\'ga aylantirib (asdict yoki __dict__), keyin json.dump qilamiz',
      'Obyektni str() qilib, matn sifatida yozamiz — keyin int() kabi qayta tiklaymiz',
      'JSON obyektlarni saqlay olmaydi, faqat CSV ishlatish kerak',
    ],
    correctIndex: 1,
    explanation:
      'json moduli faqat oddiy turlarni (dict, list, str, son, bool, None) biladi; o\'z classingiz obyektini bersangiz TypeError chiqadi. Shuning uchun avval dataclasses.asdict() yoki obj.__dict__ bilan dict\'ga o\'tkaziladi.',
  },
  {
    lessonKey: 'backend-dars-36',
    order: 4,
    prompt: 'PEP 8 bo\'yicha ikki so\'zdan iborat funksiya nomi qanday yoziladi?',
    choices: [
      'AddBook',
      'addBook',
      'ADD_BOOK',
      'add_book',
    ],
    correctIndex: 3,
    explanation:
      'PEP 8 da funksiya va o\'zgaruvchi nomlari snake_case — kichik harf va pastki chiziq bilan. CamelCase classlar uchun, BOSH_HARF esa o\'zgarmas (konstanta) uchun ishlatiladi.',
  },
  {
    lessonKey: 'backend-dars-36',
    order: 5,
    prompt: 'Loyihani GitHub\'ga tayyorlayapsiz. requirements.txt fayli nima uchun kerak?',
    choices: [
      'Loyihani ishga tushirish uchun kerakli paketlar va ularning versiyalarini ro\'yxatlaydi',
      'Loyihaning barcha Python fayllarini ro\'yxatlab, import tartibini belgilaydi',
      'Git\'ga qaysi fayllar yuklanmasligini ko\'rsatadi',
      'Loyihaning topshiriq talablarini matn ko\'rinishida saqlaydi',
    ],
    correctIndex: 0,
    explanation:
      'requirements.txt — muhitni qayta tiklash retsepti: pip install -r requirements.txt buyrug\'i bilan boshqa kompyuterda aynan shu paketlar o\'rnatiladi. Qaysi fayl Git\'ga tushmasligini esa .gitignore hal qiladi.',
  },

  // ──────────────────────────────── Dars 37 — Git asoslari ────────────────────────────────
  {
    lessonKey: 'backend-dars-37',
    order: 1,
    prompt: 'git add fayl.py buyrug\'i aslida nima qiladi?',
    choices: [
      'Faylni Git tarixiga saqlaydi — commit qilishning hojati qolmaydi',
      'Faylni staging area\'ga qo\'yadi, ya\'ni keyingi commit uchun belgilaydi',
      'Faylni GitHub\'ga yuklaydi',
      'Faylni loyihaga yaratadi (fayl mavjud bo\'lmasa ham)',
    ],
    correctIndex: 1,
    explanation:
      'git add — tayyorlash qadami: o\'zgarish staging area\'ga tushadi, tarixga esa hali yozilmaydi. Uni saqlaydigan buyruq — git commit; GitHub\'ga yuborish esa umuman boshqa buyruq, git push.',
  },
  {
    lessonKey: 'backend-dars-37',
    order: 2,
    prompt: 'Staging area nimaga kerak?',
    choices: [
      'O\'zgargan fayllardan qaysilarini shu commit\'ga kiritishni tanlash imkonini beradi',
      'Fayllarning zaxira nusxasini saqlab turadi, xato qilsangiz tiklash uchun',
      'Kodni commit\'dan oldin xatoga tekshirib chiqadi',
      'Fayllarni GitHub\'ga yuborishdan oldin siqib, hajmini kichraytiradi',
    ],
    correctIndex: 0,
    explanation:
      'Bir vaqtda 5 ta faylni o\'zgartirgan bo\'lsangiz ham, staging area orqali faqat 2 tasini tanlab, mantiqan bir butun commit yasay olasiz. Bu tarixni o\'qiladigan qiladi.',
  },
  {
    lessonKey: 'backend-dars-37',
    order: 3,
    prompt: 'Quyidagilardan qaysi biri yaxshi commit xabari?',
    choices: [
      'update',
      'ishladi nihoyat!!!',
      'feat: foydalanuvchi ro\'yxatdan o\'tish formasi qo\'shildi',
      'main.py, utils.py va models.py fayllari o\'zgartirildi',
    ],
    correctIndex: 2,
    explanation:
      'Yaxshi xabar nima o\'zgarganini va nima uchun o\'zgarganini qisqa aytadi — «feat: ...» shakli aynan shunga xizmat qiladi. Qaysi fayllar tegilganini Git o\'zi biladi, uni takrorlash foydasiz.',
  },
  {
    lessonKey: 'backend-dars-37',
    order: 4,
    prompt: '@dataclass ishlatilgan classda quyidagilardan qaysi biri AVTOMATIK yozilmaydi?',
    choices: [
      '__init__',
      '__repr__',
      '__eq__',
      '__lt__ (kichik/katta solishtirish)',
    ],
    correctIndex: 3,
    explanation:
      'Oddiy @dataclass konstruktor, repr va tenglikni beradi, lekin tartiblash uchun kerakli solishtirish metodlarini yozmaydi. Ular kerak bo\'lsa @dataclass(order=True) deb aytish lozim.',
  },
  {
    lessonKey: 'backend-dars-37',
    order: 5,
    prompt: 'PEP 8 bo\'yicha class nomi qanday yoziladi?',
    choices: [
      'kutubxona_hisobi',
      'KutubxonaHisobi',
      'kutubxonaHisobi',
      'KUTUBXONA_HISOBI',
    ],
    correctIndex: 1,
    explanation:
      'Class nomlari CamelCase — har so\'z bosh harf bilan, chiziqchasiz. snake_case funksiya va o\'zgaruvchilar uchun qoldiriladi, shuning uchun kodga qarabgina class qayerdaligi ko\'rinib turadi.',
  },

  // ─────────────────────────────── Dars 38 — Branch va merge ───────────────────────────────
  {
    lessonKey: 'backend-dars-38',
    order: 1,
    prompt: 'Branch nima uchun kerak?',
    choices: [
      'Loyihaning zaxira nusxasini boshqa papkada saqlash uchun',
      'Kodni bir necha dasturchi orasida bo\'lib berish uchun — har kimga o\'z fayllari',
      'Eski commit\'larni o\'chirib, tarixni tozalash uchun',
      'main\'dagi ishlaydigan kodga tegmasdan, yangi funksiyani alohida yo\'nalishda sinash uchun',
    ],
    correctIndex: 3,
    explanation:
      'Branch — parallel yo\'nalish: siz unda bemalol tajriba qilasiz, main esa toza va ishlaydigan holatda qoladi. Tayyor bo\'lgach merge qilasiz, chiqmasa branchni shunchaki o\'chirib tashlaysiz.',
  },
  {
    lessonKey: 'backend-dars-38',
    order: 2,
    prompt: 'feature branchdagi ishni main\'ga qo\'shmoqchisiz. git merge dan oldin qaysi branchda turishingiz kerak?',
    choices: [
      'feature branchda — merge o\'zgarishlarni o\'sha yerdan itaradi',
      'main branchda — merge o\'zgarishlarni siz turgan branchga olib keladi',
      'Farqi yo\'q, Git o\'zi to\'g\'ri yo\'nalishni aniqlaydi',
      'Yangi, uchinchi branchda — ikkalasi ham buzilmasligi uchun',
    ],
    correctIndex: 1,
    explanation:
      'git merge <nom> «<nom> ni MEN turgan branchga qo\'sh» degani. Shuning uchun avval git switch main, keyin git merge feature — teskarisini qilsangiz main\'ni feature\'ga qo\'shib qo\'yasiz.',
  },
  {
    lessonKey: 'backend-dars-38',
    order: 3,
    prompt: 'Merge konflikti qachon yuz beradi?',
    choices: [
      'Ikki branchda bitta faylning aynan bir joyi turlicha o\'zgartirilganda',
      'Ikki branchda umuman turli fayllar o\'zgartirilganda',
      'Branch nomi main bilan bir xil bo\'lib qolganda',
      'Branchda commit soni main\'dagidan ko\'p bo\'lganda',
    ],
    correctIndex: 0,
    explanation:
      'Git turli fayllarni yoki bitta faylning turli joylarini o\'zi muammosiz birlashtiradi. Faqat aynan bir satr ikki xil o\'zgarganda «qaysi birini qoldiray?» deb sizdan so\'raydi — bu xato emas, oddiy hol.',
  },
  {
    lessonKey: 'backend-dars-38',
    order: 4,
    prompt: 'Faylni o\'zgartirib, git add fayl.py qildingiz va kompyuterni o\'chirdingiz. O\'zgarish Git tarixida saqlanganmi?',
    choices: [
      'Ha — git add tarixga yozib qo\'yadi',
      'Ha, lekin faqat 24 soat davomida',
      'Yo\'q — u faqat staging area\'da, tarixga tushishi uchun git commit kerak',
      'Yo\'q — git add ni qayta ishlatmaguningizcha fayl umuman yo\'qoladi',
    ],
    correctIndex: 2,
    explanation:
      'git add — «bu o\'zgarish keyingi commit\'ga kiradi» degan belgi, xolos. Tarixdagi qaytib bo\'ladigan nuqta faqat git commit paytida yaratiladi.',
  },
  {
    lessonKey: 'backend-dars-38',
    order: 5,
    prompt: '@dataclass qaysi metodlar to\'plamini yozib beradi?',
    choices: [
      '__str__, __len__ va __add__',
      '__enter__ va __exit__',
      'save() va load()',
      '__init__, __repr__ va __eq__',
    ],
    correctIndex: 3,
    explanation:
      '@dataclass e\'lon qilingan maydonlardan konstruktor, repr va tenglik solishtirishni yasaydi. __str__ ni u yozmaydi — lekin __str__ bo\'lmasa, print() avtomatik __repr__ ga murojaat qiladi, shuning uchun chiqish baribir chiroyli ko\'rinadi.',
  },

  // ───────────────────────────────────── Dars 39 — GitHub ─────────────────────────────────────
  {
    lessonKey: 'backend-dars-39',
    order: 1,
    prompt: 'git push va git pull orasidagi farq nima?',
    choices: [
      'push commit yasaydi, pull esa commit\'ni bekor qiladi',
      'push branch yaratadi, pull esa branchlarni birlashtiradi',
      'push kompyuterdagi commit\'larni GitHub\'ga yuboradi, pull GitHub\'dagilarni kompyuterga oladi',
      'push faqat main branch bilan, pull esa faqat boshqa branchlar bilan ishlaydi',
    ],
    correctIndex: 2,
    explanation:
      'Ikkalasi ham lokal repozitoriy bilan GitHub o\'rtasidagi almashinuv, faqat yo\'nalishi teskari: push — yuborish, pull — olib kelish. Shuning uchun odat: ish boshida pull, ish oxirida push.',
  },
  {
    lessonKey: 'backend-dars-39',
    order: 2,
    prompt: 'git clone qachon ishlatiladi?',
    choices: [
      'Har safar GitHub\'dagi yangi o\'zgarishlarni olib kelish uchun',
      'Loyihaning nusxasini bir papkadan boshqasiga ko\'chirish uchun',
      'Lokal loyihani GitHub\'da birinchi marta yaratish uchun',
      'GitHub\'dagi mavjud repozitoriyni kompyuterga birinchi marta tushirib olish uchun',
    ],
    correctIndex: 3,
    explanation:
      'clone — boshlanish buyrug\'i: repozitoriy hali kompyuteringizda yo\'q bo\'lganda uni butun tarixi bilan tushiradi. Repozitoriy allaqachon bor bo\'lsa yangilanishni git pull olib keladi, clone emas.',
  },
  {
    lessonKey: 'backend-dars-39',
    order: 3,
    prompt: 'README.md faylida eng muhim narsa nima?',
    choices: [
      'Loyihaning barcha kod satrlarining batafsil izohi',
      'Loyiha nima qilishi va uni qanday ishga tushirish — buyruqlari bilan',
      'Muallifning shaxsiy ma\'lumotlari va aloqa raqami',
      'Kelajakda qo\'shmoqchi bo\'lgan g\'oyalar ro\'yxati',
    ],
    correctIndex: 1,
    explanation:
      'README\'ni o\'qiydigan odamning birinchi savoli — «bu nima qiladi va men uni qanday ishga tushiraman?». Shuning uchun tavsif va aniq buyruqlar (o\'rnatish, ishga tushirish) birinchi o\'rinda turadi.',
  },
  {
    lessonKey: 'backend-dars-39',
    order: 4,
    prompt: 'git switch -c yangi-branch qilganingizda kompyuteringizda yangi papka paydo bo\'ladimi?',
    choices: [
      'Yo\'q — papka o\'sha, Git shu papka ichidagi fayllar mazmunini almashtiradi',
      'Ha — har branch uchun alohida papka yaratiladi',
      'Ha, lekin faqat merge qilganingizdan keyin',
      'Yo\'q — branch faqat GitHub saytida mavjud bo\'ladi, lokalda emas',
    ],
    correctIndex: 0,
    explanation:
      'Branch — papka nusxasi emas, tarixdagi ko\'rsatkich. switch qilganingizda Git ayni o\'sha ish papkasidagi fayllarni o\'sha branch holatiga keltiradi — shuning uchun switch qilishdan oldin ishni commit qilish kerak.',
  },
  {
    lessonKey: 'backend-dars-39',
    order: 5,
    prompt: 'Staging area — bu nima?',
    choices: [
      'GitHub\'dagi kod tekshiriladigan maxsus branch',
      'Commit qilingan, lekin hali push qilinmagan o\'zgarishlar joyi',
      'git add qilingan, ya\'ni keyingi commit\'ga tayyorlangan o\'zgarishlar joyi',
      'Konflikt yuz berganda o\'zgarishlar vaqtincha saqlanadigan joy',
    ],
    correctIndex: 2,
    explanation:
      'Staging area — ish papkasi bilan tarix orasidagi oraliq bosqich: git add o\'zgarishni shu yerga qo\'yadi, git commit esa shu yerdagilarni tarixga yozadi. Commit qilinganu push qilinmagan o\'zgarishlar esa allaqachon lokal tarixda turadi.',
  },

  // ─────────────────────────── Dars 40 — DB asoslari & SELECT ───────────────────────────
  {
    lessonKey: 'backend-dars-40',
    order: 1,
    prompt: 'Ma\'lumotlar bazasidagi jadval, ustun va qator nimani anglatadi?',
    choices: [
      'Jadval — bir turdagi ma\'lumotlar to\'plami, ustun — maydon (masalan ism), qator — bitta yozuv',
      'Jadval — butun baza, ustun — bitta yozuv, qator — maydon nomi',
      'Jadval — fayl nomi, ustun — qatorlar soni, qator — jadvaldagi ustunlar soni',
      'Jadval — so\'rov natijasi, ustun va qator esa faqat ekranda ko\'rsatish shakli',
    ],
    correctIndex: 0,
    explanation:
      'talaba jadvalida ustunlar — id, ism, ball kabi maydonlar; har bir qator esa bitta aniq talaba. Bazada bir nechta jadval bo\'ladi, ya\'ni jadval bazaning o\'zi emas.',
  },
  {
    lessonKey: 'backend-dars-40',
    order: 2,
    prompt: 'SELECT ism FROM talaba WHERE ball > 80 so\'rovida WHERE nima qiladi?',
    choices: [
      'Qaysi ustunlar ko\'rsatilishini tanlaydi',
      'Faqat sharti to\'g\'ri chiqqan qatorlarni qoldiradi',
      'Natijani ball bo\'yicha tartiblaydi',
      'Ball ustunini 80 dan katta qilib o\'zgartiradi',
    ],
    correctIndex: 1,
    explanation:
      'WHERE — qatorlar filtri: jadvaldagi har qatorni tekshirib, sharti bajarilganlarini qoldiradi. Qaysi ustun chiqishini SELECT dan keyingi ro\'yxat, tartiblashni esa ORDER BY hal qiladi.',
  },
  {
    lessonKey: 'backend-dars-40',
    order: 3,
    prompt: 'ORDER BY ball DESC nimani anglatadi?',
    choices: [
      'Ball ustunini natijadan olib tashlaydi',
      'Ballni kamaytirib, qiymatlarini o\'zgartiradi',
      'Natijani ball bo\'yicha eng kichigidan eng kattasiga qarab tartiblaydi',
      'Natijani ball bo\'yicha eng kattasidan eng kichigiga qarab tartiblaydi',
    ],
    correctIndex: 3,
    explanation:
      'DESC — descending, ya\'ni kamayish tartibi: eng katta qiymat birinchi turadi. O\'sish tartibi ASC bo\'lib, u standart — hech narsa yozmasangiz ham shu ishlaydi. «Eng katta 5 ta» uchun ORDER BY ... DESC LIMIT 5 yoziladi.',
  },
  {
    lessonKey: 'backend-dars-40',
    order: 4,
    prompt: 'git push nima qiladi?',
    choices: [
      'Faylni staging area\'ga qo\'yadi',
      'GitHub\'dagi o\'zgarishlarni kompyuteringizga tushiradi',
      'Lokal commit\'laringizni GitHub\'dagi repozitoriyga yuboradi',
      'O\'zgarishlarni saqlab, yangi commit yaratadi',
    ],
    correctIndex: 2,
    explanation:
      'push faqat allaqachon commit qilingan narsani yuboradi — commit qilmagan o\'zgarish GitHub\'ga bormaydi. Teskari yo\'nalish — git pull.',
  },
  {
    lessonKey: 'backend-dars-40',
    order: 5,
    prompt: 'feature branchni main\'ga merge qildingiz. Branchda yozgan commit\'laringizga nima bo\'ladi?',
    choices: [
      'Ular main tarixiga qo\'shiladi — branchni o\'chirsangiz ham kod main\'da qoladi',
      'Ular yo\'qoladi, faqat oxirgi commit main\'ga o\'tadi',
      'Ular faqat branchda qoladi, main\'da esa fayllar nusxasi paydo bo\'ladi',
      'Ular main\'ga o\'tadi, lekin branchni o\'chirsangiz kod ham o\'chib ketadi',
    ],
    correctIndex: 0,
    explanation:
      'Merge branchdagi ishni main tarixiga qo\'shadi, shundan keyin branchning o\'zi shunchaki keraksiz nom bo\'lib qoladi. Aynan shuning uchun merge\'dan keyin branchni bemalol o\'chirib tashlash odat.',
  },
];
