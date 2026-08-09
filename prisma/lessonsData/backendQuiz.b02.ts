import type { LessonQuizRecord } from './backendQuiz.m1a';

// Hand-authored MCQs derived from the lesson decks' TEKSHIRUV slides.
//
// Scope: backend lessons 20..26 (`backend-dars-20` .. `backend-dars-26`), 5 questions each = 35.
// Each prompt is a light rewrite of the curriculum author's original open recap question so that it
// has exactly one defensible answer. Distractors are real beginner misconceptions for that exact
// topic — `.days` vs `.day`, importing `fayl.py` with the extension, `w` "qo'shadi", `finally` only
// on error, `self` as the class name, calling a method without parentheses — so a wrong pick is
// diagnostic.
//
// Every factually checkable answer here (datetime/timedelta types, `*args` turi, json.dumps vs
// dump, ensure_ascii, JSON true -> Python True, `w`/`a` rejimlari, bound method repr, finally)
// was verified by executing the snippet in the Piston sandbox before `correctIndex` was set.

export const backendQuizB02: LessonQuizRecord[] = [
  // ───────────────────────────────── Dars 20 — Modullar 2 ─────────────────────────────────
  {
    lessonKey: 'backend-dars-20',
    order: 1,
    prompt: 'datetime.now() nima qaytaradi?',
    choices: [
      'Faqat bugungi sanani — soat va daqiqasiz',
      'Vaqtni tayyor matn ko\'rinishida, masalan "02.08.2026 14:30"',
      'Sana va vaqt birga saqlangan datetime obyektini',
      '1970-yildan beri o\'tgan sekundlar sonini',
    ],
    correctIndex: 2,
    explanation:
      'datetime.now() datetime turidagi obyekt qaytaradi — unda yil, oy, kun ham, soat, daqiqa, sekund ham bor. Faqat sana kerak bo\'lsa date.today(), matn kerak bo\'lsa strftime() ishlatiladi.',
  },
  {
    lessonKey: 'backend-dars-20',
    order: 2,
    prompt:
      'a va b — ikkita sana. Ular orasidagi kun sonini olish uchun qaysi ifoda to\'g\'ri?',
    choices: [
      '(a - b).days',
      '(a - b) — ayirmaning o\'zi butun son bo\'lib chiqadi',
      '(a - b).day',
      'len(a - b)',
    ],
    correctIndex: 0,
    explanation:
      'Ikki sanani ayirsak timedelta obyekti hosil bo\'ladi, son emas. Undan kun sonini .days atributi beradi — .day emas, chunki .day bitta sananing oy ichidagi kunini bildiradi.',
  },
  {
    lessonKey: 'backend-dars-20',
    order: 3,
    prompt:
      'Yoningizda yordamchi.py fayli bor va undagi salomlash() funksiyasini asosiy faylga olib kelmoqchisiz. Qaysi yozuv to\'g\'ri?',
    choices: [
      'from yordamchi.py import salomlash',
      'import "yordamchi.py"',
      'pip install yordamchi',
      'from yordamchi import salomlash',
    ],
    correctIndex: 3,
    explanation:
      'Import qilishda modul nomi yoziladi, fayl nomi emas — shuning uchun .py kengaytmasi tushib qoladi va qo\'shtirnoq qo\'yilmaydi. pip esa faqat internetdagi tashqi paketlar uchun, o\'z faylingiz uchun emas.',
  },
  {
    lessonKey: 'backend-dars-20',
    order: 4,
    prompt: 'random.choice([1, 2, 3]) nima qiladi?',
    choices: [
      'Ro\'yxat elementlarini tasodifiy tartibda aralashtiradi',
      'Ro\'yxatdan tasodifiy bitta elementni tanlab qaytaradi',
      '1 va 3 oralig\'ida tasodifiy butun son o\'ylab topadi',
      'Ro\'yxatdan bir nechta tasodifiy elementni ro\'yxat qilib qaytaradi',
    ],
    correctIndex: 1,
    explanation:
      'choice() — «tanlash» degani: u tayyor ketma-ketlikdan aynan bitta elementni qaytaradi. Aralashtirish random.shuffle(), oraliqdan son random.randint(), bir nechta element esa random.sample() vazifasi.',
  },
  {
    lessonKey: 'backend-dars-20',
    order: 5,
    prompt: 'def f(*args): ... deb yozsak, funksiya ichida args qanday turda bo\'ladi?',
    choices: [
      'tuple',
      'list',
      'dict',
      'str — barcha argumentlar bitta matnga birlashadi',
    ],
    correctIndex: 0,
    explanation:
      'Yulduzcha bilan yig\'ilgan argumentlar har doim tuple bo\'lib keladi: type(args).__name__ «tuple» beradi. Dict bo\'lib keladigani — **kwargs.',
  },

  // ────────────────────────────── Dars 21 — pip va paketlar ──────────────────────────────
  {
    lessonKey: 'backend-dars-21',
    order: 1,
    prompt: 'pip aslida nima qiladi?',
    choices: [
      'Kompyuterga Python\'ning o\'zini o\'rnatadi',
      'Kodingizni tezlashtirib, mashina tiliga o\'giradi',
      'Loyihangizdagi .py fayllarni bir-biriga import qiladi',
      'PyPI omboridan tashqi paketni yuklab, kompyuteringizga o\'rnatadi',
    ],
    correctIndex: 3,
    explanation:
      'pip — paket menejeri: u internetdagi PyPI omboriga borib, kerakli kutubxonani yuklab o\'rnatadi. Python bilan birga kelgan modullar (datetime, random) uchun pip kerak emas — ular allaqachon bor.',
  },
  {
    lessonKey: 'backend-dars-21',
    order: 2,
    prompt: 'requirements.txt fayli nima uchun kerak?',
    choices: [
      'Paketlarning kodini o\'z ichida saqlab, loyiha bilan birga tashiydi',
      'Loyiha ishlashi uchun zarur paketlar ro\'yxatini saqlaydi — boshqa kompyuterda pip install -r bilan hammasi tiklanadi',
      'Loyihani ishga tushiradigan buyruqlar yozib qo\'yiladigan fayl',
      'Kerakli Python versiyasini avtomatik o\'rnatadi',
    ],
    correctIndex: 1,
    explanation:
      'requirements.txt — bu shunchaki nomlar va versiyalar ro\'yxati, paketlarning o\'zi emas. Uni ko\'rgan boshqa dasturchi pip install -r requirements.txt deb aynan siznikidek muhitni tiklaydi.',
  },
  {
    lessonKey: 'backend-dars-21',
    order: 3,
    prompt: 'requests bilan so\'rov yubordik. javob.json() nima qaytaradi?',
    choices: [
      'Javob tanasini o\'qib, uni Python dict (yoki list) ga aylantirib beradi',
      'Javobni JSON matn — ya\'ni str ko\'rinishida beradi',
      'Javobni .json faylga saqlaydi',
      'So\'rov muvaffaqiyatli bo\'lgan-bo\'lmaganini bildiruvchi status_code ni beradi',
    ],
    correctIndex: 0,
    explanation:
      '.json() JSON matnni Python obyektiga o\'giradi — natijani darhol javob["kalit"] deb ishlatish mumkin. Xom matn kerak bo\'lsa javob.text, holat kodi kerak bo\'lsa javob.status_code ishlatiladi.',
  },
  {
    lessonKey: 'backend-dars-21',
    order: 4,
    prompt: 'os.path.exists("data.txt") nima qiladi?',
    choices: [
      'Fayl bo\'lmasa, uni yaratib qo\'yadi',
      'Faylni ochib, mazmunini qaytaradi',
      'Shu yo\'lda fayl yoki papka bor-yo\'qligini tekshirib, True yoki False qaytaradi',
      'Fayl hajmini baytlarda qaytaradi',
    ],
    correctIndex: 2,
    explanation:
      'exists() faqat tekshiradi va True/False qaytaradi — hech narsani yaratmaydi, ochmaydi. Shuning uchun uni faylni o\'qishdan oldin xatolikning oldini olish uchun ishlatamiz.',
  },
  {
    lessonKey: 'backend-dars-21',
    order: 5,
    prompt: 'import math va from math import sqrt o\'rtasidagi asosiy farq nima?',
    choices: [
      'Farqi yo\'q — ikkalasi ham bir xil ishlaydi, shunchaki yozilishi boshqacha',
      'Birinchisida modul butunicha keladi va math.sqrt() deb chaqiriladi, ikkinchisida esa faqat sqrt nomi keladi va to\'g\'ridan-to\'g\'ri sqrt() deyiladi',
      'import faqat Python bilan kelgan modullar uchun, from ... import esa faqat o\'z fayllaringiz uchun',
      'from ... import butun modulni yuklamaydi, shuning uchun dastur sezilarli darajada tez ishlaydi',
    ],
    correctIndex: 1,
    explanation:
      'import math modul nomini olib keladi, shuning uchun har safar math. prefiksi kerak. from math import sqrt esa faqat kerakli nomni sizning fayl nomlaringiz orasiga qo\'yadi — modul baribir to\'liq yuklanadi.',
  },

  // ────────────────────────── Dars 22 — Fayllar bilan ishlash ──────────────────────────
  {
    lessonKey: 'backend-dars-22',
    order: 1,
    prompt: 'open(fayl, "w") va open(fayl, "a") rejimlari orasidagi farq nima?',
    choices: [
      '"w" yozish uchun, "a" esa o\'qish uchun ochadi',
      'Ikkalasi ham oxiriga qo\'shadi, faqat "w" tezroq ishlaydi',
      '"w" faylning eski mazmunini butunlay o\'chiradi, "a" esa yozganingizni oxiriga qo\'shadi',
      '"a" fayl mavjud bo\'lmasa xatolik beradi, "w" esa yaratadi',
    ],
    correctIndex: 2,
    explanation:
      '"w" fayl ochilishi bilanoq uni bo\'shatib yuboradi — eski matn qaytarib bo\'lmaydigan darajada yo\'qoladi. "a" esa hech narsani o\'chirmaydi va fayl yo\'q bo\'lsa uni o\'zi yaratadi.',
  },
  {
    lessonKey: 'backend-dars-22',
    order: 2,
    prompt: 'Faylni with open(...) as f: ko\'rinishida ochishning asosiy foydasi nima?',
    choices: [
      'Fayl tezroq o\'qiladi',
      'encoding avtomatik utf-8 bo\'lib qoladi',
      'Fayl mavjud bo\'lmasa, with uni o\'zi yaratadi',
      'Blok tugagach fayl avtomatik yopiladi — hatto ichida xatolik yuz bersa ham',
    ],
    correctIndex: 3,
    explanation:
      'with — fayl yopilishini kafolatlaydi, shuning uchun f.close() ni unutish muammosi umuman yo\'qoladi. Tezlik ham, encoding ham with bilan o\'zgarmaydi: utf-8 ni baribir qo\'lda yozish kerak.',
  },
  {
    lessonKey: 'backend-dars-22',
    order: 3,
    prompt:
      'Katta faylni f.read() bilan bir yo\'la o\'qish o\'rniga for satr in f: deb satr-satr o\'qishning afzalligi nima?',
    choices: [
      'Butun fayl bir vaqtda xotiraga yuklanmaydi, shuning uchun juda katta fayl bilan ham ishlaydi',
      'Satrlar avtomatik alifbo tartibida keladi',
      'Har bir satr oxiridagi \\n avtomatik olib tashlanadi',
      'Faylni o\'qish bilan bir vaqtda unga yozish ham mumkin bo\'ladi',
    ],
    correctIndex: 0,
    explanation:
      'Sikl faylni bo\'lak-bo\'lak o\'qiydi, shuning uchun xotira band bo\'lmaydi. Satr oxiridagi \\n esa saqlanib qoladi — uni o\'zingiz .strip() bilan olib tashlashingiz kerak.',
  },
  {
    lessonKey: 'backend-dars-22',
    order: 4,
    prompt: 'Terminalda pip install requests deb yozsak nima sodir bo\'ladi?',
    choices: [
      'Loyihadagi requests.py faylimiz asosiy faylga import qilinadi',
      'requests paketi internetdan yuklab olinib, kompyuteringizga o\'rnatiladi',
      'requests paketi kodda ishlatilishi uchun requirements.txt ga qo\'shiladi, xolos',
      'Faqat paket bor-yo\'qligi tekshiriladi',
    ],
    correctIndex: 1,
    explanation:
      'pip install paketni haqiqatan yuklab o\'rnatadi — shundan keyingina import requests ishlaydi. requirements.txt esa avtomatik yangilanmaydi, uni alohida yozish kerak.',
  },
  {
    lessonKey: 'backend-dars-22',
    order: 5,
    prompt: 'os.path.exists("kundalik.txt") aynan nimani tekshiradi?',
    choices: [
      'Fayl ichida matn bor-yo\'qligini',
      'Faylni o\'qish huquqimiz bor-yo\'qligini',
      'Faylni ochish mumkinligini va uni darhol ochib beradi',
      'Shu nomdagi fayl yoki papka diskda mavjudligini',
    ],
    correctIndex: 3,
    explanation:
      'exists() faqat «bormi?» degan savolga True/False bilan javob beradi — fayl bo\'sh bo\'lsa ham True qaytaradi. Faylni ochish uchun baribir open() kerak.',
  },

  // ───────────────────────────────── Dars 23 — JSON va CSV ─────────────────────────────────
  {
    lessonKey: 'backend-dars-23',
    order: 1,
    prompt: 'json.dump va json.dumps orasidagi farq nima?',
    choices: [
      'dump ma\'lumotni ochiq faylga yozadi, dumps esa uni matn (str) qilib qaytaradi',
      'dump bitta dict uchun, dumps esa bir nechta dict\'dan iborat ro\'yxat uchun',
      'dump fayldan o\'qiydi, dumps esa faylga yozadi',
      'Ikkalasi ham faylga yozadi, dumps — shunchaki qisqartirilgan nomi',
    ],
    correctIndex: 0,
    explanation:
      'Oxiridagi «s» — string degani: dumps() natijani matn qilib qaytaradi, dump() esa uni to\'g\'ridan-to\'g\'ri faylga yozadi. O\'qish tomonida ham xuddi shunday: load fayldan, loads matndan.',
  },
  {
    lessonKey: 'backend-dars-23',
    order: 2,
    prompt: 'O\'zbekcha matnni JSON\'ga saqlaganda ensure_ascii=False nima uchun yoziladi?',
    choices: [
      'JSON fayl hajmini kichraytirish uchun',
      'Kalitlarni alifbo tartibida saqlash uchun',
      'Harflar \\u02bb kabi kodlarga aylanmasdan, o\'z ko\'rinishida yozilishi uchun',
      'Fayl utf-8 da ochilishi kafolatlansin uchun — usiz kodlash xatosi chiqadi',
    ],
    correctIndex: 2,
    explanation:
      'Standart holatda json «Gʻayrat» ni "G\\u02bbayrat" qilib yozadi — fayl baribir to\'g\'ri, lekin odam o\'qiy olmaydi. ensure_ascii=False harflarni o\'z holicha qoldiradi; encoding esa alohida, open() da beriladi.',
  },
  {
    lessonKey: 'backend-dars-23',
    order: 3,
    prompt: 'JSON faylda "ok": true yozilgan. json.load() dan keyin bu qiymat Python\'da nima bo\'ladi?',
    choices: [
      '"true" — qo\'shtirnoqdagi matn',
      '1 — butun son',
      'true — Python\'da ham xuddi shunday kichik harf bilan qoladi',
      'True — Python\'ning mantiqiy qiymati',
    ],
    correctIndex: 3,
    explanation:
      'JSON true/false/null ni kichik harf bilan yozadi, Python esa True/False/None deb bosh harf bilan yozadi — json moduli o\'qiyotganda buni o\'zi almashtiradi. Shuning uchun natija bool turida chiqadi.',
  },
  {
    lessonKey: 'backend-dars-23',
    order: 4,
    prompt:
      'JSON faylni yozayotganda o\'rtada xatolik yuz berdi. with open(...) ishlatilgan bo\'lsa nima bo\'ladi?',
    choices: [
      'Fayl ochiq qolib ketadi, chunki with faqat xatosiz holatda yopadi',
      'Fayl baribir avtomatik yopiladi',
      'Yozilgan hamma narsa bekor qilinib, fayl eski holiga qaytadi',
      'Xatolik with tomonidan tutib olinadi va dastur davom etadi',
    ],
    correctIndex: 1,
    explanation:
      'with blokdan chiqishda — xato bilanmi yoki xatosizmi — faylni albatta yopadi. Ammo u xatoni tutmaydi va yozilganini orqaga qaytarmaydi: xato baribir yuqoriga uzatiladi.',
  },
  {
    lessonKey: 'backend-dars-23',
    order: 5,
    prompt:
      'Loyihangizni do\'stingizga berdingiz, u ishga tushirolmayapti. requirements.txt bu yerda qanday yordam beradi?',
    choices: [
      'Loyihani ishga tushirish bo\'yicha yo\'riqnoma sifatida — ichida buyruqlar yozilgan',
      'U bilan do\'stingiz Python\'ning kerakli versiyasini o\'rnatadi',
      'Unda kerakli paketlar ro\'yxati bor — pip install -r requirements.txt bilan hammasi bir buyruqda o\'rnatiladi',
      'Uning ichida paketlarning kodi bor, shuning uchun internet ham kerak emas',
    ],
    correctIndex: 2,
    explanation:
      'Muammo odatda paket yetishmasligida bo\'ladi. requirements.txt kerakli paketlar va versiyalarni sanab beradi, pip esa -r bayrog\'i bilan ro\'yxatdagi hammasini birdaniga o\'rnatadi.',
  },

  // ────────────────────────── Dars 24 — Xatoliklar + Loyiha ──────────────────────────
  {
    lessonKey: 'backend-dars-24',
    order: 1,
    prompt: 'try/except nima uchun kerak?',
    choices: [
      'Kodni tekshirib, undagi xatolarni avtomatik to\'g\'irlash uchun',
      'Xato yuz berganda dastur qulab tushmasin va biz uni boshqarib, o\'z javobimizni bera olaylik',
      'Kodni tezroq ishlashga majburlash uchun',
      'Xatolarni fayl yoki log\'ga yozib borish uchun',
    ],
    correctIndex: 1,
    explanation:
      'try/except xatoni yo\'qotmaydi va tuzatmaydi — u shunchaki xatoni tutib oladi, shunda dastur to\'xtab qolish o\'rniga foydalanuvchiga tushunarli xabar berib davom etadi.',
  },
  {
    lessonKey: 'backend-dars-24',
    order: 2,
    prompt: 'finally bloki qachon bajariladi?',
    choices: [
      'Xato bo\'ldimi yo\'qmi — har holda bajariladi',
      'Faqat xato yuz berganda',
      'Faqat hech qanday xato bo\'lmaganda',
      'Faqat except bloki xatoni tuta olmaganda',
    ],
    correctIndex: 0,
    explanation:
      'finally — «yakunlovchi tozalash» bloki: u xato bo\'lsa ham, bo\'lmasa ham ishlaydi (masalan faylni yopish uchun). Faqat xatosiz holatda ishlaydigani — else bloki.',
  },
  {
    lessonKey: 'backend-dars-24',
    order: 3,
    prompt: 'Xato turini yozmasdan bo\'sh except: qo\'yish nega yomon?',
    choices: [
      'U sintaksis xatosi — Python bunday yozuvni qabul qilmaydi',
      'U faqat birinchi uchragan xatoni tutadi, keyingilarini o\'tkazib yuboradi',
      'U mutlaqo hamma xatoni yutib yuboradi — jumladan sizning kodingizdagi haqiqiy xatoni ham, va muammo yashirin qoladi',
      'U dasturni sezilarli darajada sekinlashtiradi',
    ],
    correctIndex: 2,
    explanation:
      'Bo\'sh except hatto siz kutmagan xatolarni ham — nomdagi xato, indeks xatosi — jimgina yutib yuboradi va dastur noto\'g\'ri natija bilan davom etadi. Shuning uchun har doim aniq tur yoziladi: except ValueError:',
  },
  {
    lessonKey: 'backend-dars-24',
    order: 4,
    prompt: 'To-do ro\'yxatini faylga saqlamoqchisiz. json.dump va json.dumps dan qaysi biri bu ishga to\'g\'ri keladi va nega?',
    choices: [
      'dumps — u ma\'lumotni to\'g\'ridan-to\'g\'ri faylga yozadi',
      'Ikkalasi ham bir xil, farqi yo\'q',
      'dumps — chunki u faylni ham o\'zi ochib beradi',
      'dump — u ochilgan faylga yozadi; dumps esa faqat matn qaytaradi, uni keyin o\'zingiz yozishingiz kerak',
    ],
    correctIndex: 3,
    explanation:
      'json.dump(data, f) ochiq fayl obyektini ikkinchi argument sifatida oladi va o\'sha yerga yozadi. json.dumps(data) esa hech qanday fayl bilan ishlamaydi — u faqat str qaytaradi.',
  },
  {
    lessonKey: 'backend-dars-24',
    order: 5,
    prompt: 'Ichida ma\'lumot bor faylni "w" rejimida ochsak, eski mazmun nima bo\'ladi?',
    choices: [
      'Fayl ochilishi bilanoq bo\'shatiladi — eski mazmun butunlay yo\'qoladi',
      'Yangi yozuvlar eski mazmundan keyin qo\'shiladi',
      'Eski mazmun saqlanib qoladi, faqat siz yozgan qismi ustiga yoziladi',
      'Python eski nusxani .bak fayl qilib saqlab qo\'yadi',
    ],
    correctIndex: 0,
    explanation:
      '"w" rejimi faylni open() chaqirilgan zahoti tozalaydi — hatto siz hech narsa yozmasangiz ham fayl bo\'sh qoladi. Eski ma\'lumotni saqlash kerak bo\'lsa "a" rejimidan foydalaning.',
  },

  // ───────────────────────────── Dars 25 — Class va Object ─────────────────────────────
  {
    lessonKey: 'backend-dars-25',
    order: 1,
    prompt: 'Class va obyekt orasidagi farq nima?',
    choices: [
      'Class katta, obyekt esa kichik class',
      'Class ma\'lumot saqlaydi, obyekt esa funksiyalarni saqlaydi',
      'Bu bir narsaning ikki xil nomi',
      'Class — qolip (chizma), obyekt — shu qolip asosida yasalgan aniq nusxa',
    ],
    correctIndex: 3,
    explanation:
      'Class hech qanday ma\'lumot saqlamaydi — u faqat «Talaba nimalardan iborat» degan chizma. Talaba("Ali", 20) deb yozganingizda esa haqiqiy, o\'z qiymatlariga ega obyekt paydo bo\'ladi va bitta classdan istagancha obyekt yasash mumkin.',
  },
  {
    lessonKey: 'backend-dars-25',
    order: 2,
    prompt: '__init__ metodi qachon chaqiriladi?',
    choices: [
      'Class ichidagi har bir metod chaqirilganda',
      'Talaba("Ali", 20) deb yangi obyekt yaratilganda — avtomatik',
      'Faqat biz uni o\'zimiz obj.__init__() deb chaqirganimizda',
      'Fayl import qilingan zahoti, bir marta',
    ],
    correctIndex: 1,
    explanation:
      '__init__ — konstruktor: Python obyekt yaratilishi bilan uni o\'zi chaqiradi va argumentlarni unga uzatadi. Uni qo\'lda chaqirish shart emas.',
  },
  {
    lessonKey: 'backend-dars-25',
    order: 3,
    prompt: 'Metod ichidagi self nimani bildiradi?',
    choices: [
      'Class nomining qisqartmasi',
      'Barcha obyektlar uchun umumiy global o\'zgaruvchi',
      'Metod hozir ishlayotgan aynan o\'sha obyektning o\'ziga ishora',
      'Python\'ning majburiy kalit so\'zi, hech qanday qiymati yo\'q',
    ],
    correctIndex: 2,
    explanation:
      'self — hozir ishlanayotgan obyekt. Shuning uchun self.ism = ism deb yozsak, qiymat aynan o\'sha obyektda saqlanadi va boshqa obyektlarga aralashib ketmaydi.',
  },
  {
    lessonKey: 'backend-dars-25',
    order: 4,
    prompt:
      'Foydalanuvchi yoshni so\'raganda «yigirma» deb yozdi va int() qulab tushdi. Bunday holatda nima ishlatiladi?',
    choices: [
      'int() ni try/except ValueError bilan o\'rab, xato holatiga do\'stona xabar berish',
      'Kodni # bilan izohga aylantirib qo\'yish',
      'int() o\'rniga float() ishlatish',
      'Dasturni qayta ishga tushirishni foydalanuvchidan so\'rash',
    ],
    correctIndex: 0,
    explanation:
      'try/except — foydalanuvchi kiritgan noto\'g\'ri ma\'lumot dasturni qulatmasligi uchun asosiy vosita. float("yigirma") ham xuddi shunday ValueError beradi, shuning uchun tur almashtirish yechim emas.',
  },
  {
    lessonKey: 'backend-dars-25',
    order: 5,
    prompt: 'json.load(f) nima qaytaradi?',
    choices: [
      'Fayl mazmunini JSON matn — str ko\'rinishida',
      'Fayldagi JSON\'ni o\'qib, uni Python obyektiga (odatda dict yoki list) aylantirib qaytaradi',
      'Ochilgan fayl obyektini',
      'Hech narsa — u faqat faylni Python xotirasiga yuklaydi',
    ],
    correctIndex: 1,
    explanation:
      'load() JSON matnni darhol tanish Python turlariga o\'giradi, shuning uchun natijani ma\'lumot["kalit"] deb ishlatish mumkin. Matn ko\'rinishida o\'qish kerak bo\'lsa oddiy f.read() yetarli.',
  },

  // ───────────────────────────── Dars 26 — Atribut va metod ─────────────────────────────
  {
    lessonKey: 'backend-dars-26',
    order: 1,
    prompt: 'Atribut va metod orasidagi farq nima?',
    choices: [
      'Atribut class ichida, metod esa class tashqarisida yoziladi',
      'Atribut o\'zgarmas, metod esa o\'zgaruvchan qiymat',
      'Atribut — obyektning ma\'lumoti (ot: ism, tezlik), metod — obyektning harakati (fe\'l: tezlash, to\'xta)',
      'Metod — bu faqat __init__, qolgan hammasi atribut',
    ],
    correctIndex: 2,
    explanation:
      'Atribut nimadir «bor» ekanini, metod nimadir «qila oladi» ekanini bildiradi. Ikkalasi ham class ichida yoziladi va atributning qiymati ham bemalol o\'zgarishi mumkin.',
  },
  {
    lessonKey: 'backend-dars-26',
    order: 2,
    prompt: 'mashina.tezlash — qavssiz yozdik. Nima bo\'ladi?',
    choices: [
      'Metod baribir bajariladi, qavs shunchaki odat',
      'Xatolik chiqadi: Python qavssiz metodni tanimaydi',
      'Metod bajariladi, faqat natijasini qaytarmaydi',
      'Metod bajarilmaydi — Python shunchaki metodning o\'ziga ishora qaytaradi, tezlik o\'zgarmaydi',
    ],
    correctIndex: 3,
    explanation:
      'Qavs — «bajar» degan buyruq. Qavssiz yozilsa xato ham chiqmaydi, ish ham bajarilmaydi: ekranga <bound method ...> ko\'rinishidagi narsa chiqadi va bu eng qiyin topiladigan xatolardan biri.',
  },
  {
    lessonKey: 'backend-dars-26',
    order: 3,
    prompt: 'Metod ichida obyektning tezlik atributiga qanday murojaat qilinadi?',
    choices: [
      'self.tezlik',
      'Shunchaki tezlik — metod ichida atribut nomi o\'z-o\'zidan ko\'rinadi',
      'Mashina.tezlik — class nomi orqali',
      'global tezlik deb e\'lon qilib',
    ],
    correctIndex: 0,
    explanation:
      'Atribut obyektda saqlanadi, shuning uchun unga faqat self orqali yetib boriladi. self\'siz yozilgan tezlik — bu oddiy lokal o\'zgaruvchi bo\'lib, metod tugashi bilan yo\'qoladi.',
  },
  {
    lessonKey: 'backend-dars-26',
    order: 4,
    prompt: 'Mashina("Nexia") deb yozganimizda birinchi bo\'lib nima ishlaydi?',
    choices: [
      'Class ichidagi birinchi yozilgan metod',
      'Hech narsa — obyekt bo\'sh yaratiladi, atributlarni keyin o\'zimiz qo\'shamiz',
      '__init__ metodi — u obyektga boshlang\'ich atributlarni beradi',
      'Class ichidagi barcha metodlar navbat bilan',
    ],
    correctIndex: 2,
    explanation:
      '__init__ obyekt yaratilishi bilan avtomatik ishlaydi va qavs ichidagi argumentlarni oladi. Qolgan metodlar esa faqat siz ularni chaqirganingizda ishlaydi.',
  },
  {
    lessonKey: 'backend-dars-26',
    order: 5,
    prompt: 'try/except dasturni aynan nimadan saqlaydi?',
    choices: [
      'Kodda sintaksis xatosi qolib ketishidan',
      'Foydalanuvchi noto\'g\'ri ma\'lumot kiritishining o\'zidan',
      'Fayllarning tasodifan o\'chib ketishidan',
      'Xato yuz berganda dasturning to\'satdan to\'xtab, ishdan chiqishidan',
    ],
    correctIndex: 3,
    explanation:
      'try/except ish vaqtida yuzaga keladigan xatoni tutadi va dastur qulash o\'rniga davom etadi. Sintaksis xatosini esa u tuta olmaydi — bunday kod umuman ishga tushmaydi.',
  },
];
