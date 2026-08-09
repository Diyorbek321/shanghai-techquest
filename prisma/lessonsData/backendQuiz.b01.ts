import type { LessonQuizRecord } from './backendQuiz.m1a';

// Hand-authored MCQs derived from the lesson decks' TEKSHIRUV slides.
//
// Scope: backend lessons 13..19 (`backend-dars-13` .. `backend-dars-19`), 5 questions each = 35.
// Every prompt is a light rewrite of the curriculum author's original open recap question so that
// it has exactly one defensible answer. Distractors are real beginner misconceptions for that
// exact topic — dict indekslanadi deb o'ylash, get() ni KeyError beradi deyish, {} ni bo'sh set
// deb bilish, `def` yozilishi bilan kod ishga tushadi deb o'ylash, return o'rniga print ishlatish,
// randint(a, b) ni range kabi b-siz deb hisoblash — shuning uchun noto'g'ri tanlov diagnostik.
//
// Har bir kod natijasi Piston (python 3.10.0) sandboxida ishga tushirib tekshirilgan.
// `explanation` javobdan KEYIN ko'rsatiladi — asosiy o'rgatuvchi qism o'sha.

export const backendQuizB01: LessonQuizRecord[] = [
  // ───────────────────────────────── Dars 13 — Dictionary 1 ─────────────────────────────────
  {
    lessonKey: 'backend-dars-13',
    order: 1,
    prompt: 'Dict va list o\'rtasidagi asosiy farq nima?',
    choices: [
      'List elementlarga tartib raqami (indeks) bilan, dict esa kalit (nom) bilan murojaat qiladi',
      'List faqat sonlarni, dict esa faqat matnlarni saqlaydi',
      'Dict ham list kabi indeks bilan ishlaydi, faqat qavslari boshqacha',
      'Listga yangi element qo\'shib bo\'lmaydi, dictga esa qo\'shsa bo\'ladi',
    ],
    correctIndex: 0,
    explanation:
      'Listda element o\'rni muhim — a[0], a[1]. Dictda esa o\'rin emas, KALIT muhim: d["ism"]. Ikkalasi ham istalgan turdagi qiymatni saqlaydi va ikkalasiga ham yangi element qo\'shsa bo\'ladi.',
  },
  {
    lessonKey: 'backend-dars-13',
    order: 2,
    prompt: 'd = {"ism": "Ali"} bo\'lsa, d["yosh"] deb yozsak nima bo\'ladi?',
    choices: [
      'None qaytaradi va dastur davom etadi',
      'Bo\'sh matn ("") qaytaradi',
      'KeyError xatoligi chiqadi va dastur to\'xtaydi',
      '"yosh" kaliti avtomatik yaratilib, qiymati 0 bo\'ladi',
    ],
    correctIndex: 2,
    explanation:
      'Yo\'q kalitni kvadrat qavs bilan so\'rash KeyError beradi — Python o\'zi kalit yaratmaydi ham, None qaytarmaydi ham. Shuning uchun so\'rashdan oldin `if "yosh" in d:` deb tekshiriladi.',
  },
  {
    lessonKey: 'backend-dars-13',
    order: 3,
    prompt: 'd = {"a": 1} lug\'atida d["yangi"] = 5 satri nima qiladi?',
    choices: [
      'Xatolik beradi, chunki "yangi" kaliti hali mavjud emas',
      '"yangi" kaliti yo\'qligi uchun uni 5 qiymati bilan qo\'shadi',
      'Lug\'atdagi barcha eski kalitlarni o\'chirib, faqat "yangi" ni qoldiradi',
      'Faqat vaqtinchalik qiymat yaratadi, lug\'atning o\'zi o\'zgarmaydi',
    ],
    correctIndex: 1,
    explanation:
      'd[k] = v bitta satrda ikki vazifani bajaradi: kalit yo\'q bo\'lsa — qo\'shadi, bor bo\'lsa — eski qiymatni almashtiradi. Boshqa kalitlarga u umuman tegmaydi.',
  },
  {
    lessonKey: 'backend-dars-13',
    order: 4,
    prompt: 'Tuple list\'dan nimasi bilan farq qiladi?',
    choices: [
      'Tuple faqat 2 ta element saqlay oladi, list esa istalgancha',
      'Tuple elementlariga indeks bilan murojaat qilib bo\'lmaydi',
      'Tuple faqat bir xil turdagi qiymatlarni qabul qiladi',
      'Tuple yaratilgandan keyin o\'zgartirilmaydi — element qo\'shib ham, almashtirib ham bo\'lmaydi',
    ],
    correctIndex: 3,
    explanation:
      'Tuple — o\'zgarmas (immutable) ro\'yxat: t[0] bilan o\'qish mumkin, lekin t[0] = 5 yoki append() xatolik beradi. Uzunligi va element turlariga esa hech qanday cheklov yo\'q.',
  },
  {
    lessonKey: 'backend-dars-13',
    order: 5,
    prompt: 'a = [1, 2] bo\'lsa, print(a.append(3)) nimani chiqaradi?',
    choices: [
      'None — chunki append() ro\'yxatni joyida o\'zgartiradi va hech nima qaytarmaydi',
      '[1, 2, 3] — yangilangan ro\'yxatni qaytaradi',
      '3 — qo\'shilgan elementni qaytaradi',
      '2 — qo\'shishdan oldingi uzunlikni qaytaradi',
    ],
    correctIndex: 0,
    explanation:
      'append() ro\'yxatning O\'ZINI o\'zgartiradi va None qaytaradi. Shuning uchun a = a.append(3) deb yozish — juda keng tarqalgan xato: a None bo\'lib qoladi.',
  },

  // ───────────────────────────────── Dars 14 — Dictionary 2 ─────────────────────────────────
  {
    lessonKey: 'backend-dars-14',
    order: 1,
    prompt: 'd.items() nimani beradi va u odatda qayerda ishlatiladi?',
    choices: [
      'Faqat kalitlarni beradi — qiymatlarni alohida d[k] bilan olish kerak',
      'Lug\'atdagi elementlar sonini beradi, len(d) kabi',
      'Har bir (kalit, qiymat) juftligini beradi — `for k, v in d.items():` uchun',
      'Faqat qiymatlarni beradi, kalitlar tashlab yuboriladi',
    ],
    correctIndex: 2,
    explanation:
      'items() (kalit, qiymat) juftliklarini qaytaradi, shuning uchun sikl sarlavhasida ikkita nom yoziladi: for k, v in d.items(). Faqat kalitlar uchun d.keys(), faqat qiymatlar uchun d.values() bor.',
  },
  {
    lessonKey: 'backend-dars-14',
    order: 2,
    prompt: 'Kalit lug\'atda YO\'Q bo\'lsa, d.get("x") va d["x"] qanday farq qiladi?',
    choices: [
      'Ikkalasi ham KeyError beradi, get() shunchaki qisqaroq yozuv',
      'get() None qaytaradi, d["x"] esa KeyError bilan dasturni to\'xtatadi',
      'get() yo\'q kalitni avtomatik qo\'shib qo\'yadi, d["x"] esa qo\'shmaydi',
      'get() ikkalasi bir xil, faqat get() tezroq ishlaydi',
    ],
    correctIndex: 1,
    explanation:
      'd["x"] yo\'q kalitda KeyError beradi, d.get("x") esa None qaytarib dasturni davom ettiradi. Zaxira qiymat kerak bo\'lsa — d.get("x", 0) deb ikkinchi argument beriladi.',
  },
  {
    lessonKey: 'backend-dars-14',
    order: 3,
    prompt: 'd = {"user": {"ism": "Ali", "til": ["uz", "en"]}} bo\'lsa, "uz" ni qanday olamiz?',
    choices: [
      'd["user", "til", 0]',
      'd.user.til[0]',
      'd["uz"]',
      'd["user"]["til"][0]',
    ],
    correctIndex: 3,
    explanation:
      'Ichma-ich tuzilmada har bir qatlam alohida qavs bilan ochiladi: avval dict kaliti, keyin yana dict kaliti, keyin list indeksi. Nuqta bilan murojaat (d.user) Pythonda dict uchun ishlamaydi.',
  },
  {
    lessonKey: 'backend-dars-14',
    order: 4,
    prompt: 'Bitta lug\'atda bir xil kalit ikki marta yozilsa, masalan {"x": 1, "x": 5}, natija qanday bo\'ladi?',
    choices: [
      'Kalit takrorlanmaydi — oxirgi qiymat qoladi: {"x": 5}',
      'Ikkala qiymat ham saqlanadi: {"x": [1, 5]}',
      'Xatolik chiqadi: DuplicateKeyError',
      'Birinchi qiymat qoladi: {"x": 1}',
    ],
    correctIndex: 0,
    explanation:
      'Lug\'atda kalit yagona bo\'ladi. Bir xil kalit qayta yozilsa, u yangi element yaratmaydi — mavjudining qiymatini almashtiradi, ya\'ni oxirgisi g\'olib chiqadi.',
  },
  {
    lessonKey: 'backend-dars-14',
    order: 5,
    prompt: '`for i in range(1, 5):` sikli necha marta aylanadi?',
    choices: [
      '5 marta — 1 dan 5 gacha, 5 ham kiradi',
      '4 marta — i qiymatlari 1, 2, 3, 4',
      '3 marta — chegaralarning ikkalasi ham tashlab ketiladi',
      '6 marta — 0 dan boshlab 5 gacha',
    ],
    correctIndex: 1,
    explanation:
      'range(a, b) a dan boshlanadi, lekin b ni OLMAYDI. Shuning uchun range(1, 5) → 1, 2, 3, 4 — jami 4 ta qadam.',
  },

  // ──────────────────────────────── Dars 15 — Set (to'plam) ────────────────────────────────
  {
    lessonKey: 'backend-dars-15',
    order: 1,
    prompt: 'Set list\'dan nimasi bilan farq qiladi?',
    choices: [
      'Setda elementlar tartiblangan holda saqlanadi, listda esa aralash',
      'Set faqat sonlarni saqlaydi, list esa istalgan turni',
      'Setda bir xil element ikki marta turolmaydi va indeks bilan murojaat qilinmaydi',
      'Setga yangi element qo\'shib bo\'lmaydi, u o\'zgarmas',
    ],
    correctIndex: 2,
    explanation:
      'Set — takrorlanmas va tartibsiz to\'plam: bir xil qiymat faqat bir marta saqlanadi va s[0] deb murojaat qilinmaydi. Lekin u o\'zgaruvchan — s.add(x) bilan element qo\'shsa bo\'ladi.',
  },
  {
    lessonKey: 'backend-dars-15',
    order: 2,
    prompt: 'a = [1, 2, 2, 3] bo\'lsa, list(set(a)) nima qiladi?',
    choices: [
      'Ro\'yxatni o\'sish tartibida tartiblaydi, dublikatlar joyida qoladi',
      'Ro\'yxatni matnga aylantiradi',
      'Faqat takrorlangan elementlarni qoldiradi: [2]',
      'Dublikatlarni olib tashlaydi — 3 ta noyob element qoladi',
    ],
    correctIndex: 3,
    explanation:
      'set() takrorlarni yo\'qotadi, list() esa natijani yana ro\'yxatga qaytaradi — dublikatlarni olib tashlashning eng qisqa yo\'li. Diqqat: set tartibsiz, shuning uchun bu usul tartibni saqlashga kafolat bermaydi.',
  },
  {
    lessonKey: 'backend-dars-15',
    order: 3,
    prompt: 'a = {1, 2, 3} va b = {2, 3, 4} bo\'lsa, a & b nima beradi?',
    choices: [
      '{2, 3} — faqat ikkalasida ham bor elementlar (kesishma)',
      '{1, 2, 3, 4} — ikkala to\'plamning barcha elementlari',
      '{1} — faqat a da bor, b da yo\'q elementlar',
      '{1, 4} — faqat bittasida uchraydigan elementlar',
    ],
    correctIndex: 0,
    explanation:
      '& — kesishma: ikkala to\'plamda ham UCHRAYDIGAN elementlar. Birlashma uchun |, ayirma uchun − ishlatiladi.',
  },
  {
    lessonKey: 'backend-dars-15',
    order: 4,
    prompt: 'd = {"non": 5000} bo\'lsa, d.items() nima qaytaradi?',
    choices: [
      'Faqat kalitlar ro\'yxatini: ["non"]',
      'Faqat qiymatlar ro\'yxatini: [5000]',
      'Elementlar sonini: 1',
      '(kalit, qiymat) juftliklarini: dict_items([(\'non\', 5000)])',
    ],
    correctIndex: 3,
    explanation:
      'items() har bir elementni (kalit, qiymat) juftligi ko\'rinishida beradi. Aynan shuning uchun uni `for k, v in d.items():` deb ikki nomga ajratib olamiz.',
  },
  {
    lessonKey: 'backend-dars-15',
    order: 5,
    prompt: 'Nima uchun lug\'atda bir xil kalit ikki marta bo\'la olmaydi?',
    choices: [
      'Kalit — qiymatni topish uchun yagona manzil; ikkita bir xil manzil bo\'lsa, qaysi qiymat kerakligi noaniq bo\'lib qoladi',
      'Chunki takroriy kalit yozilsa Python darrov «duplicate key» xatosini beradi',
      'Chunki kalitlar faqat matn bo\'lishi shart, matnlar esa har doim noyob',
      'Chunki kalitlar avtomatik alifbo tartibida saqlanadi, tartib esa takrorga yo\'l qo\'ymaydi',
    ],
    correctIndex: 0,
    explanation:
      'Dictda kalit — qiymatga olib boradigan yagona manzil. Shuning uchun takroriy kalit yozilsa yangi element paydo bo\'lmaydi, shunchaki eski qiymat almashadi.',
  },

  // ──────────────────────────────── Dars 16 — Funksiyalar 1 ────────────────────────────────
  {
    lessonKey: 'backend-dars-16',
    order: 1,
    prompt: 'Faylda faqat `def salom(): print("Salom")` yozilgan bo\'lsa, dastur ishga tushganda ekranda nima chiqadi?',
    choices: [
      'Salom — def satri o\'qilishi bilan ichidagi kod bajariladi',
      'Hech nima — funksiya faqat e\'lon qilingan, chaqirilmagan',
      'Xatolik — funksiya chaqirilmagani uchun Python ogohlantiradi',
      'Salom, lekin faqat fayl oxirida bir marta',
    ],
    correctIndex: 1,
    explanation:
      'def — bu shunchaki «shunday funksiya bor» degan e\'lon: Python ichidagi kodni eslab qo\'yadi, xolos. Kod faqat salom() deb chaqirilganda ishga tushadi.',
  },
  {
    lessonKey: 'backend-dars-16',
    order: 2,
    prompt: '`def salom(ism): ...` deb yozib, keyin salom("Ali") deb chaqirdik. Bu yerda qaysi biri parametr, qaysi biri argument?',
    choices: [
      '"Ali" — parametr, ism — argument',
      'Ikkalasi ham argument, «parametr» so\'zi faqat matematikada ishlatiladi',
      'ism — parametr (e\'londagi nom), "Ali" — argument (chaqiruvdagi haqiqiy qiymat)',
      'ism — argument, "Ali" esa qaytariladigan qiymat',
    ],
    correctIndex: 2,
    explanation:
      'Parametr — funksiya e\'lonidagi bo\'sh joy (nom), argument — chaqirganda o\'sha joyga solingan haqiqiy qiymat. Ya\'ni ism parametr, "Ali" argument.',
  },
  {
    lessonKey: 'backend-dars-16',
    order: 3,
    prompt: 'DRY tamoyili nimani anglatadi?',
    choices: [
      'Kodni imkon qadar qisqa satrlarda yozish — har bir satr 50 belgidan oshmasin',
      'Bir xil kodni takrorlamaslik — takrorlanayotgan qismni funksiyaga ajratish',
      'Har bir funksiyaga albatta izoh yozish',
      'O\'zgaruvchilarga faqat inglizcha nom berish',
    ],
    correctIndex: 1,
    explanation:
      'DRY — «Don\'t Repeat Yourself», ya\'ni o\'zingizni takrorlamang. Bir xil kodni ikkinchi marta yozayotgan bo\'lsangiz, uni funksiyaga chiqarish kerak: tuzatish ham bir joyda bo\'ladi.',
  },
  {
    lessonKey: 'backend-dars-16',
    order: 4,
    prompt: 'x = {} deb yozsak, x qanday tur bo\'ladi?',
    choices: [
      'set — bo\'sh to\'plam',
      'list — bo\'sh ro\'yxat',
      'tuple — bo\'sh juftlik',
      'dict — bo\'sh lug\'at; bo\'sh set uchun set() yoziladi',
    ],
    correctIndex: 3,
    explanation:
      'Bo\'sh {} har doim dict. Bo\'sh to\'plam kerak bo\'lsa set() deb yoziladi — {} figurali qavsi Pythonda lug\'atga band qilingan.',
  },
  {
    lessonKey: 'backend-dars-16',
    order: 5,
    prompt: 'd = {"non": 5000} bo\'lsa, d.get("sut", 0) nima qaytaradi?',
    choices: [
      'KeyError — chunki "sut" kaliti mavjud emas',
      'None — ikkinchi argument e\'tiborga olinmaydi',
      '0 — "sut" kaliti yo\'q, shuning uchun zaxira qiymat qaytadi',
      '5000 — lug\'atdagi yagona qiymat',
    ],
    correctIndex: 2,
    explanation:
      'get() ning ikkinchi argumenti — zaxira qiymat: kalit topilmasa xatolik o\'rniga o\'sha qaytadi. Bu summa hisoblash yoki hisoblagichlarda 0 dan boshlash uchun juda qulay.',
  },

  // ──────────────────────────────── Dars 17 — Funksiyalar 2 ────────────────────────────────
  {
    lessonKey: 'backend-dars-17',
    order: 1,
    prompt: 'print va return o\'rtasidagi farq nima?',
    choices: [
      'Ikkalasi bir xil, return shunchaki funksiya ichidagi print',
      'print qiymatni ekranga chiqaradi, return esa qiymatni dasturga qaytaradi va uni keyingi hisobda ishlatsa bo\'ladi',
      'print funksiyani tugatadi, return esa davom ettiradi',
      'return ekranga chiqaradi, print esa qiymatni saqlab qo\'yadi',
    ],
    correctIndex: 1,
    explanation:
      'print faqat ko\'rsatadi — natijasi None. return esa qiymatni chaqirilgan joyga uzatadi, shuning uchun s = qoshish(2, 3) deb saqlab, keyin ishlatish mumkin.',
  },
  {
    lessonKey: 'backend-dars-17',
    order: 2,
    prompt: 'Ichida return yo\'q funksiyani chaqirsak, u nima qaytaradi?',
    choices: [
      '0',
      'Bo\'sh matn ("")',
      'None',
      'Funksiya ichidagi oxirgi qiymatni',
    ],
    correctIndex: 2,
    explanation:
      'return yozilmagan funksiya avtomatik None qaytaradi. Shuning uchun ichida faqat print bo\'lgan funksiyaning natijasini o\'zgaruvchiga saqlasangiz, o\'sha o\'zgaruvchi None bo\'ladi.',
  },
  {
    lessonKey: 'backend-dars-17',
    order: 3,
    prompt: 'Default qiymatli parametr funksiya e\'lonida qayerda turishi kerak?',
    choices: [
      'Har doim oxirida — default\'siz parametrdan keyin, aks holda SyntaxError chiqadi',
      'Har doim boshida, oddiy parametrlardan oldin',
      'Qayerda bo\'lsa ham farqi yo\'q, Python o\'zi tartiblab oladi',
      'Faqat yakka o\'zi bo\'lishi mumkin — boshqa parametrlar bilan birga ishlatilmaydi',
    ],
    correctIndex: 0,
    explanation:
      'Default\'li parametrlar oxirida turadi: `def f(a, b=1)` to\'g\'ri, `def f(a=1, b)` esa «non-default argument follows default argument» SyntaxError beradi.',
  },
  {
    lessonKey: 'backend-dars-17',
    order: 4,
    prompt: '`def yuza(r):` deb e\'lon qilingan funksiyani qanday chaqiramiz?',
    choices: [
      'def yuza(5)',
      'call yuza(5)',
      'yuza = 5',
      'yuza(5) — nomdan keyin qavs, qavs ichida argument',
    ],
    correctIndex: 3,
    explanation:
      'Funksiya nomi + qavs = chaqiruv. def faqat e\'lon paytida yoziladi, chaqirishda esa yozilmaydi; qavssiz `yuza` esa funksiyaning o\'zini bildiradi, uni ishga tushirmaydi.',
  },
  {
    lessonKey: 'backend-dars-17',
    order: 5,
    prompt: 'Funksiya ichida ro\'yxatdagi noyob elementlar sonini qaytarmoqchimiz. Qaysi ifoda to\'g\'ri?',
    choices: [
      'return len(list(set(a)))',
      'return len(a)',
      'return set(len(a))',
      'return list(a).count()',
    ],
    correctIndex: 0,
    explanation:
      'set(a) dublikatlarni olib tashlaydi, len() esa qolganini sanaydi. len(a) esa takrorlar bilan birga hamma elementni sanab, noto\'g\'ri natija beradi.',
  },

  // ──────────────────────────────── Dars 18 — Funksiyalar 3 ────────────────────────────────
  {
    lessonKey: 'backend-dars-18',
    order: 1,
    prompt: '*args va **kwargs o\'rtasidagi farq nima?',
    choices: [
      '*args nomli argumentlarni, **kwargs esa oddiy argumentlarni yig\'adi',
      '*args oddiy (positional) argumentlarni tuple qilib, **kwargs esa nomli argumentlarni dict qilib yig\'adi',
      '*args faqat sonlar uchun, **kwargs faqat matnlar uchun',
      'Ikkalasi bir xil, yozilishi bir yulduzcha va ikki yulduzcha bilan farq qiladi xolos',
    ],
    correctIndex: 1,
    explanation:
      'f(1, 2) chaqirilganda args = (1, 2) — tuple; f(ism="Ali") chaqirilganda kwargs = {"ism": "Ali"} — dict. Ya\'ni bittasi tartibli qiymatlarni, ikkinchisi nomli qiymatlarni yig\'adi.',
  },
  {
    lessonKey: 'backend-dars-18',
    order: 2,
    prompt: 'Funksiya ichida yaratilgan o\'zgaruvchini funksiyadan tashqarida print qilsak nima bo\'ladi?',
    choices: [
      'Uning oxirgi qiymati chiqadi — funksiya tugagach ham u saqlanib qoladi',
      'None chiqadi',
      'NameError chiqadi — u local, funksiyadan tashqarida mavjud emas',
      'Avtomatik 0 qiymati bilan chiqadi',
    ],
    correctIndex: 2,
    explanation:
      'Funksiya ichidagi o\'zgaruvchi local: funksiya tugashi bilan yo\'qoladi. Natija tashqarida kerak bo\'lsa, uni return bilan qaytarish kerak.',
  },
  {
    lessonKey: 'backend-dars-18',
    order: 3,
    prompt: 'lambda nima uchun kerak?',
    choices: [
      'Funksiyani tezroq ishlashga majburlash uchun',
      'Bir necha satrli katta funksiyalarni def o\'rniga yozish uchun',
      'Funksiyani global o\'zgaruvchilarga ulash uchun',
      'Bir satrli kichik funksiyani joyida yozish uchun — asosan sorted/map/filter\'ning key argumentida',
    ],
    correctIndex: 3,
    explanation:
      'lambda — nom qo\'yishga arzimaydigan, bir ifodadan iborat kichik funksiya: sorted(a, key=lambda s: len(s)). Katta mantiq uchun baribir def ishlatiladi va lambda tezlik bermaydi.',
  },
  {
    lessonKey: 'backend-dars-18',
    order: 4,
    prompt: 'Funksiya natijasini boshqa hisobda ishlatmoqchimiz. Uni return o\'rniga print qilsak nima bo\'ladi?',
    choices: [
      'Farqi yo\'q — print qilingan qiymat ham o\'zgaruvchiga tushadi',
      'Xatolik chiqadi: funksiya ichida print ishlatib bo\'lmaydi',
      'Natija ekranda ko\'rinadi, lekin funksiya None qaytargani uchun uni o\'zgaruvchiga saqlab ishlata olmaymiz',
      'Natija saqlanadi, lekin ekranda ko\'rinmaydi',
    ],
    correctIndex: 2,
    explanation:
      'print — bu odam uchun, return — dastur uchun. print qilgan funksiya baribir None qaytaradi, shuning uchun natija = f() deb saqlasangiz, natija None bo\'lib qoladi.',
  },
  {
    lessonKey: 'backend-dars-18',
    order: 5,
    prompt: 'Loyihada bir xil 5 satrlik hisob 4 ta joyda takrorlanmoqda. DRY tamoyiliga ko\'ra nima qilish kerak?',
    choices: [
      'Har bir nusxaga izoh yozib qo\'yish yetarli',
      'O\'sha kodni funksiyaga chiqarib, 4 joyda uni chaqirish',
      'Kodni 4 ta alohida faylga bo\'lib yuborish',
      'Takrorlangan satrlarni qisqartirib, bitta uzun satrga birlashtirish',
    ],
    correctIndex: 1,
    explanation:
      'DRY — takrorlanayotgan kod bitta funksiyaga chiqariladi. Shunda mantiqni tuzatish kerak bo\'lsa, uni 4 joyda emas, bir joyda o\'zgartirasiz.',
  },

  // ───────────────────────────────── Dars 19 — Modullar 1 ─────────────────────────────────
  {
    lessonKey: 'backend-dars-19',
    order: 1,
    prompt: '`import math` va `from math import sqrt` o\'rtasidagi farq nima?',
    choices: [
      'Birinchisi butun modulni ulaydi (math.sqrt deb yoziladi), ikkinchisi faqat sqrt nomini ulaydi (sqrt deb yoziladi)',
      'Ikkalasi ham bir xil — istagan holatda math.sqrt deb yozish mumkin',
      'from math import sqrt butun modulni ulaydi, import math esa faqat nomini',
      'import math faqat fayl boshida, from math import sqrt esa faqat funksiya ichida yoziladi',
    ],
    correctIndex: 0,
    explanation:
      'import math butun modulni beradi — math.sqrt(16) deb yoziladi. from math import sqrt esa faqat sqrt nomini keltiradi: sqrt(16) ishlaydi, math.sqrt(16) esa NameError beradi, chunki math nomi ulanmagan.',
  },
  {
    lessonKey: 'backend-dars-19',
    order: 2,
    prompt: 'random.randint(1, 6) qaysi sonlarni berishi mumkin?',
    choices: [
      '1, 2, 3, 4, 5 — 6 chiqmaydi, range kabi',
      '1, 2, 3, 4, 5, 6 — ikkala chegara ham kiradi',
      '2, 3, 4, 5 — chegaralarning ikkalasi ham tashlanadi',
      '0 dan 6 gacha, 0 ham chiqishi mumkin',
    ],
    correctIndex: 1,
    explanation:
      'randint(a, b) — kamdan-kam uchraydigan holat: ikkala chegara ham qo\'shiladi. range(1, 6) esa 6 ni olmaydi — shuning uchun zar uchun randint(1, 6) yoziladi.',
  },
  {
    lessonKey: 'backend-dars-19',
    order: 3,
    prompt: 'random.choice(["tosh", "qaychi", "qog\'oz"]) nima qiladi?',
    choices: [
      'Ro\'yxatni tasodifiy tartibda aralashtirib, butun ro\'yxatni qaytaradi',
      'Ro\'yxatning birinchi elementini qaytaradi',
      'Ro\'yxat elementlaridan tasodifiy bittasini tanlab qaytaradi',
      'Ro\'yxat elementi indeksini — 0, 1 yoki 2 ni qaytaradi',
    ],
    correctIndex: 2,
    explanation:
      'choice() ketma-ketlikdan tasodifiy BITTA elementni qaytaradi — indeksni emas, elementning o\'zini. Butun ro\'yxatni aralashtirish uchun random.shuffle() ishlatiladi.',
  },
  {
    lessonKey: 'backend-dars-19',
    order: 4,
    prompt: '*args funksiya e\'lonida nima uchun kerak?',
    choices: [
      'Argumentlarni majburan songa aylantirish uchun',
      'Argumentlarga default qiymat berish uchun',
      'Funksiyani boshqa modulga ko\'chirish uchun',
      'Oldindan nechta argument kelishi noma\'lum bo\'lganda ularning hammasini tuple qilib qabul qilish uchun',
    ],
    correctIndex: 3,
    explanation:
      '*args bilan funksiya istalgancha argument qabul qiladi va ular ichkarida tuple bo\'lib turadi. Aynan shuning uchun sum_all(1, 2) ham, sum_all(1, 2, 3, 4) ham ishlaydi.',
  },
  {
    lessonKey: 'backend-dars-19',
    order: 5,
    prompt: 'natija = f() deb yozdik, lekin f() ichida return yo\'q. natija nimaga teng bo\'ladi?',
    choices: [
      'None',
      '0',
      'f funksiyasining o\'zi',
      'Funksiya ichida print qilingan matn',
    ],
    correctIndex: 0,
    explanation:
      'return\'siz funksiya har doim None qaytaradi — hatto ichida print bo\'lsa ham, print qilingan matn qaytmaydi. Natija kerak bo\'lsa, return yozish shart.',
  },
];
