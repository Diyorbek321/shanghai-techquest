import type { LessonQuizRecord } from './backendQuiz.m1a';

// Hand-authored MCQs derived from the lesson decks' TEKSHIRUV slides.
//
// Scope: backend lessons 27..33 (`backend-dars-27` .. `backend-dars-33`), 5 questions each = 35.
// Every prompt is a light rewrite of the curriculum author's original open recap question so that
// it has exactly one defensible answer. Distractors are real beginner misconceptions for that exact
// topic — self as "obyektning nomi", super() as "ota classni nusxalash", `_` vs `__` privacy,
// property still needing qavs, generator being re-iterable, `yield` returning a list, decorator
// mutating the original function — so a wrong pick is diagnostic rather than decorative.
//
// Every runnable claim in this file was checked against the Piston sandbox (python 3.10.0).
export const backendQuizB03: LessonQuizRecord[] = [
  // ───────────────────────── Dars 27 — Amaliyot: modellashtirish ─────────────────────────
  {
    lessonKey: 'backend-dars-27',
    order: 1,
    prompt:
      'Real obyektni class bilan modellashtirayotganda, tavsifdagi otlar (marka, zaryad) va fe\'llar (qo\'ng\'iroq qilish) nimaga aylanadi?',
    choices: [
      'Otlar ham, fe\'llar ham atributga aylanadi — metod faqat __init__ bo\'ladi',
      'Otlar — atribut, fe\'llar — metod',
      'Otlar — metod, fe\'llar — atribut',
      'Otlar — alohida class, fe\'llar — o\'sha classning atributi',
    ],
    correctIndex: 1,
    explanation:
      'Modellashtirishning eng oddiy qoidasi: obyekt NIMAGA ega bo\'lsa (ot) — u atribut, obyekt NIMA QILSA (fe\'l) — u metod. «Telefon» uchun marka va zaryad — atribut, qongiroq() — metod.',
  },
  {
    lessonKey: 'backend-dars-27',
    order: 2,
    prompt: 'Classga __str__ metodini qo\'shsak, u nima qiladi?',
    choices: [
      'Obyektning barcha atributlarini avtomatik matnga aylantiradi — biz hech narsa yozmaymiz',
      'Obyekt yaratilganda ishga tushib, atributlarni o\'rnatadi',
      'print(obyekt) qilganda obyekt qanday matn ko\'rinishida chiqishini belgilaydi',
      'Obyektni matn (str) turiga butunlay o\'zgartirib qo\'yadi',
    ],
    correctIndex: 2,
    explanation:
      '__str__ — obyektning «chiroyli ko\'rinishi»: print(k) yoki str(k) chaqirilganda Python aynan shu metodni ishlatadi. Obyektning o\'zi obyektligicha qoladi, faqat ko\'rinishi o\'zgaradi.',
  },
  {
    lessonKey: 'backend-dars-27',
    order: 3,
    prompt:
      'O\'zimiz yaratgan class obyektlarini oddiy ro\'yxatga solib, keyin sikl bilan aylanib chiqsa bo\'ladimi?',
    choices: [
      'Ha — obyekt ham son yoki matn kabi oddiy element, ro\'yxatga bemalol tushadi',
      'Yo\'q — ro\'yxatga faqat son, matn va mantiqiy qiymatlarni solish mumkin',
      'Ha, lekin avval har bir obyektni str() bilan matnga aylantirish shart',
      'Yo\'q — obyektlar uchun faqat lug\'at (dict) ishlatiladi',
    ],
    correctIndex: 0,
    explanation:
      'Python\'da hamma narsa obyekt, shuning uchun ro\'yxat ichida ham obyekt saqlanaveradi. Sikl bilan aylanib, har birining atributini o\'qib yoki metodini chaqirib, shartga ko\'ra filtrlash mumkin.',
  },
  {
    lessonKey: 'backend-dars-27',
    order: 4,
    prompt: 'Class ichidagi metodning birinchi parametri nima bo\'ladi va u nimani bildiradi?',
    choices: [
      'self — bu classning nomini bildiradi',
      'name — obyektning ismini bildiradi',
      'class — hozirgi classga ishora qiladi',
      'self — metod chaqirilayotgan aynan o\'sha obyektning o\'ziga ishora qiladi',
    ],
    correctIndex: 3,
    explanation:
      'Har bir metodning birinchi parametri self bo\'lib, u «qaysi obyekt ustida ishlayapmiz» degan savolga javob beradi. Aynan self orqali obyektning atributlariga (self.marka) murojaat qilamiz.',
  },
  {
    lessonKey: 'backend-dars-27',
    order: 5,
    prompt: 'Class bilan obyekt orasidagi farq nima?',
    choices: [
      'Class — chizma (shablon), obyekt — o\'sha chizma bo\'yicha yasalgan aniq nusxa',
      'Class — bitta nusxa, obyekt — o\'sha classning yangi nomi',
      'Class va obyekt — bir xil narsa, faqat ikki xil atalishi',
      'Class — obyektlarni saqlaydigan ro\'yxat, obyekt — uning elementi',
    ],
    correctIndex: 0,
    explanation:
      'Class — «Telefon qanday bo\'ladi?» degan tavsif, obyekt esa Telefon("Samsung", 80) — shu tavsif bo\'yicha yaratilgan real narsa. Bitta classdan istagancha obyekt yasash mumkin va ularning atribut qiymatlari har xil bo\'ladi.',
  },

  // ───────────────────────────── Dars 28 — Inheritance (meros) ─────────────────────────────
  {
    lessonKey: 'backend-dars-28',
    order: 1,
    prompt:
      '«Talaba» va «O\'qituvchi» classlarida ism va yosh takrorlanyapti. Inheritance bu yerda nima beradi?',
    choices: [
      'Ikkala classni bitta classga birlashtiradi — endi faqat bitta class qoladi',
      'Takrorlangan kodni nusxalab, har ikkala classga avtomatik ko\'chirib qo\'yadi',
      'Umumiy qismni «Odam» classida bir marta yozib, ikkalasi ham undan tayyor holda oladi',
      'Kodni tezroq ishlashini ta\'minlaydi, takrorlanishga aloqasi yo\'q',
    ],
    correctIndex: 2,
    explanation:
      'class Talaba(Odam) yozilganda Talaba Odam\'ning barcha atribut va metodlarini meros qilib oladi — ularni qayta yozish shart emas. Umumiy qismni bitta joyda tuzatish yetarli bo\'ladi.',
  },
  {
    lessonKey: 'backend-dars-28',
    order: 2,
    prompt: 'Bola classning __init__ ichida super().__init__(...) nima qiladi?',
    choices: [
      'Ota classdan yangi, alohida obyekt yaratadi',
      'Ota classning __init__ ini ishga tushiradi — ota o\'rnatadigan atributlar ham o\'rnatiladi',
      'Ota classning kodini bola class ichiga nusxalab yozib qo\'yadi',
      'Bola classni ota classga aylantiradi',
    ],
    correctIndex: 1,
    explanation:
      'super() — otaga murojaat. Bola o\'z __init__ ini yozganda ota __init__ i avtomatik ishlamaydi; super().__init__(ism) ni chaqirmasa, self.ism umuman o\'rnatilmay, keyin AttributeError chiqadi.',
  },
  {
    lessonKey: 'backend-dars-28',
    order: 3,
    prompt: 'Override (qayta yozish) nima?',
    choices: [
      'Bir class ichida ikkita bir xil nomli atribut e\'lon qilish',
      'Ota classning metodini o\'chirib tashlab, uni ishlatib bo\'lmaydigan qilish',
      'Metodga qo\'shimcha parametr qo\'shish',
      'Ota classdan meros olingan metodni bola classda o\'z versiyasi bilan qayta yozish',
    ],
    correctIndex: 3,
    explanation:
      'Bola classda ota bilan bir xil nomli metod yozilsa, obyekt uchun aynan bolaniki ishlaydi — masalan Mushuk.ovoz() Hayvon.ovoz() o\'rniga. Ota versiyasi yo\'qolmaydi: super().ovoz() bilan uni ham chaqirsa bo\'ladi.',
  },
  {
    lessonKey: 'backend-dars-28',
    order: 4,
    prompt: '__str__ metodi ichida nima qilish kerak — print qilish kerakmi yoki qaytarish kerakmi?',
    choices: [
      'Matnni return bilan QAYTARISH kerak, aks holda TypeError chiqadi',
      'Matnni print() bilan chiqarish kerak, return yozilmaydi',
      'Hech narsa qaytarmasa ham bo\'ladi — Python o\'zi standart matn ko\'rsatadi',
      'Obyektning o\'zini (self) qaytarish kerak',
    ],
    correctIndex: 0,
    explanation:
      '__str__ MATN QAYTARISHI shart: ichida print yozilsa, metod None qaytaradi va Python «__str__ returned non-string (type NoneType)» deb TypeError beradi.',
  },
  {
    lessonKey: 'backend-dars-28',
    order: 5,
    prompt: 'Atribut bilan metodning farqi nimada?',
    choices: [
      'Atribut classga tegishli, metod esa faqat obyektga tegishli',
      'Atribut — obyektning qiymati (self.ism), metod — obyektning harakati, qavs bilan chaqiriladi',
      'Atribut — self bilan yoziladi, metod esa self\'siz yoziladi',
      'Atribut faqat sonlarni, metod esa faqat matnlarni saqlaydi',
    ],
    correctIndex: 1,
    explanation:
      'Atribut — obyekt saqlaydigan ma\'lumot: t.ism. Metod — obyekt bajaradigan ish, u funksiya bo\'lgani uchun qavs bilan chaqiriladi: t.salomlash(). Qavsni unutsangiz, metod bajarilmay, funksiyaning o\'zi qaytadi.',
  },

  // ──────────────────────── Dars 29 — Encapsulation & Abstraction ────────────────────────
  {
    lessonKey: 'backend-dars-29',
    order: 1,
    prompt: '_balans va __balans yozuvlari orasidagi farq nima?',
    choices: [
      '_balans — Python tomonidan qat\'iy taqiqlanadi, __balans — shunchaki kelishuv',
      'Ikkalasi ham bir xil: Python ikkalasini ham tashqaridan o\'qishga to\'liq ruxsat beradi',
      '_balans — «ichki, tegmang» degan kelishuv, __balans esa nom o\'zgarishiga (mangling) uchraydi va to\'g\'ridan-to\'g\'ri o\'qilmaydi',
      '_balans faqat o\'qish uchun, __balans esa faqat yozish uchun ochiq',
    ],
    correctIndex: 2,
    explanation:
      'h._balans bemalol o\'qiladi — bu faqat dasturchilar o\'rtasidagi kelishuv. h.__balans esa AttributeError beradi, chunki Python uni ichkarida _ClassNomi__balans deb qayta nomlaydi (name mangling).',
  },
  {
    lessonKey: 'backend-dars-29',
    order: 2,
    prompt: '@property dekoratori metodga nima beradi?',
    choices: [
      'Metodni atribut kabi, qavssiz o\'qish imkonini beradi: t.harorat',
      'Metodni tashqaridan umuman chaqirib bo\'lmaydigan qiladi',
      'Metodni tezlashtiradi va natijasini xotirada saqlab qo\'yadi',
      'Metodni avtomatik ravishda __init__ ichida chaqirib qo\'yadi',
    ],
    correctIndex: 0,
    explanation:
      '@property bilan belgilangan metod atributdek ko\'rinadi — t.harorat() emas, t.harorat deb yoziladi. Shu sababli ichkarida hisob-kitob yoki tekshiruv bo\'lsa ham, tashqi kod uchun oddiy atributdek tuyuladi.',
  },
  {
    lessonKey: 'backend-dars-29',
    order: 3,
    prompt: '@property yozilgan, lekin unga mos @setter yozilmagan bo\'lsa, obyektga qiymat berishga urinsak nima bo\'ladi?',
    choices: [
      'Qiymat bemalol o\'rnatiladi — setter shunchaki qulaylik uchun',
      'AttributeError chiqadi: property faqat o\'qish uchun (read-only) bo\'lib qoladi',
      'Python avtomatik setter yasab beradi',
      'Eski qiymat saqlanib qoladi, xatolik ham chiqmaydi — kod jimgina ishlayveradi',
    ],
    correctIndex: 1,
    explanation:
      'Setter\'siz property — read-only. t.v = 10 deb yozilsa, Python «can\'t set attribute» deb AttributeError beradi. Yozishga ruxsat berish uchun @v.setter kerak va tekshiruvni aynan o\'sha yerga qo\'yiladi.',
  },
  {
    lessonKey: 'backend-dars-29',
    order: 4,
    prompt: 'Bola class o\'z __init__ ini yozgan bo\'lsa, super().__init__() ni chaqirmaslik nimaga olib keladi?',
    choices: [
      'Hech narsaga — Python ota __init__ ini baribir o\'zi chaqiradi',
      'Kod umuman ishga tushmaydi, sintaksis xatosi chiqadi',
      'Ota classdagi metodlar ham meros bo\'lmay qoladi',
      'Ota __init__ o\'rnatadigan atributlar o\'rnatilmaydi va ularga murojaat qilganda AttributeError chiqadi',
    ],
    correctIndex: 3,
    explanation:
      'Bola o\'z __init__ ini yozishi bilan ota __init__ i BEKOR qilinadi (override). Metodlar meros bo\'lib qolaveradi, lekin self.ism kabi atributlar o\'rnatilmaydi — shuning uchun super().__init__(...) ni chaqirish SHART.',
  },
  {
    lessonKey: 'backend-dars-29',
    order: 5,
    prompt: '__str__ metodi qachon avtomatik chaqiriladi?',
    choices: [
      'Obyekt yaratilgan paytda, __init__ dan keyin darrov',
      'Obyektning har bir atributi o\'zgarganda',
      'print(obyekt) yoki str(obyekt) yozilganda',
      'Obyekt ro\'yxatga qo\'shilganda',
    ],
    correctIndex: 2,
    explanation:
      'Python obyektni matnga aylantirishi kerak bo\'lganda — ya\'ni print() yoki str() da — __str__ ni o\'zi chaqiradi. Uni qo\'lda k.__str__() deb yozish shart emas.',
  },

  // ───────────────────────── Dars 30 — Polymorphism & Magic ─────────────────────────
  {
    lessonKey: 'backend-dars-30',
    order: 1,
    prompt: 'Polimorfizm nima?',
    choices: [
      'Bitta classdan bir vaqtda bir nechta obyekt yaratish imkoniyati',
      'Bir xil nomli metod turli classlarda o\'zicha ishlashi — chaqiruv bir xil, natija har xil',
      'Bitta class ichida bir nechta __init__ yozish imkoniyati',
      'Obyektni bir turdan boshqa turga aylantirish',
    ],
    correctIndex: 1,
    explanation:
      'Kvadrat ham, Doira ham yuza() metodiga ega — biz shakl.yuza() deb yozamiz va qaysi class ekanini bilishimiz shart emas. Ichki hisob har xil, chaqiruv esa bir xil: shu polimorfizm.',
  },
  {
    lessonKey: 'backend-dars-30',
    order: 2,
    prompt: '__str__ va __repr__ ning farqi nimada?',
    choices: [
      '__str__ dasturchi uchun, __repr__ esa oddiy foydalanuvchi uchun',
      '__str__ matn qaytaradi, __repr__ esa obyektning o\'zini qaytaradi',
      '__str__ odam o\'qishi uchun chiroyli matn, __repr__ dasturchi uchun aniq tasvir; faqat bittasi yozilsa — __repr__ afzal',
      'Ikkalasi bir xil ishlaydi, __repr__ eski Python\'dan qolgan',
    ],
    correctIndex: 2,
    explanation:
      '__str__ print() uchun, __repr__ esa nosozlikni tuzatish uchun. Faqat __str__ yozilgan obyektni ro\'yxat ichida chop etsangiz, <__main__.Q object at 0x...> chiqadi — chunki ro\'yxat elementlari uchun __repr__ ishlatiladi.',
  },
  {
    lessonKey: 'backend-dars-30',
    order: 3,
    prompt: 'Classga __len__ metodini yozish nima imkon beradi?',
    choices: [
      'Obyekt ustida len(obyekt) deb yozish imkonini beradi',
      'Obyektning atributlari sonini avtomatik hisoblab beradi',
      'Obyektni sikl bilan aylanib chiqish imkonini beradi',
      'Obyektning xotirada egallagan hajmini qaytaradi',
    ],
    correctIndex: 0,
    explanation:
      'len(savat) yozilganda Python savat.__len__() ni chaqiradi — shuning uchun o\'z classimiz ham ro\'yxat kabi tuyuladi. Nimani sanashni biz o\'zimiz belgilaymiz (masalan, ichidagi mahsulotlar sonini).',
  },
  {
    lessonKey: 'backend-dars-30',
    order: 4,
    prompt: '@property bilan belgilangan metodni tashqaridan qanday chaqiramiz?',
    choices: [
      'obyekt.metod() — oddiy metod kabi, qavs bilan',
      'property(obyekt.metod) deb o\'rab',
      'obyekt.metod — qavssiz, atribut kabi',
      'obyekt.__metod__ ko\'rinishida',
    ],
    correctIndex: 2,
    explanation:
      '@property ning butun maqsadi — qavsdan qutulish: t.to_liq_ism deb yoziladi. Qavs qo\'yilsa, allaqachon qaytgan qiymat (masalan, matn) chaqirilmoqchi bo\'lib, TypeError chiqadi.',
  },
  {
    lessonKey: 'backend-dars-30',
    order: 5,
    prompt: 'super() odatda qaysi vaziyatda ishlatiladi?',
    choices: [
      'Har qanday funksiyani boshqa funksiyadan chaqirmoqchi bo\'lganda',
      'Bir class ichida ikkita metodni bog\'lash uchun',
      'Obyektni nusxalash (copy) kerak bo\'lganda',
      'Meros olingan classda ota versiyani chaqirish kerak bo\'lganda — ko\'pincha __init__ da yoki override qilingan metod ichida',
    ],
    correctIndex: 3,
    explanation:
      'super() faqat inheritance kontekstida ma\'noga ega: u ota classga murojaat qiladi. Eng ko\'p uchraydigan joyi — bolaning __init__ i va otaning ishini ham saqlab qolmoqchi bo\'lgan override qilingan metod.',
  },

  // ───────────────────────────── Dars 31 — Comprehensions ─────────────────────────────
  {
    lessonKey: 'backend-dars-31',
    order: 1,
    prompt: 'List comprehension\'ning asosiy tuzilishi qanday?',
    choices: [
      '[for x in ketma_ketlik: ifoda]',
      '[ifoda for x in ketma_ketlik]',
      '[for x in ketma_ketlik ifoda]',
      '(ifoda for x in ketma_ketlik)',
    ],
    correctIndex: 1,
    explanation:
      'Avval element ustida qilinadigan IFODA, keyin for qismi keladi: [x*x for x in range(1,6)] → [1, 4, 9, 16, 25]. Kvadrat qavs — list; dumaloq qavs esa list emas, generator ifodasi bo\'ladi.',
  },
  {
    lessonKey: 'backend-dars-31',
    order: 2,
    prompt: 'Comprehension\'da elementlarni FILTRLASH uchun if qayerda turadi?',
    choices: [
      'for dan oldin: [if x % 2 == 0 x for x in range(10)]',
      'Ifodadan oldin, else bilan birga: [x if x % 2 == 0 else 0 for x in range(10)]',
      'for qismidan keyin, oxirida: [x for x in range(10) if x % 2 == 0]',
      'Qavsdan tashqarida, alohida satrda',
    ],
    correctIndex: 2,
    explanation:
      'Oxirdagi if — filtr: shartga mos kelmagan element ro\'yxatga umuman tushmaydi ([0, 2, 4, 6, 8]). Ifodadan oldingi if/else esa filtr emas — u har bir element uchun tanlov qiladi va uzunlik o\'zgarmaydi — 10 ta element kirsa, 10 tasi chiqadi ([0, 0, 2, 0, 4, 0, 6, 0, 8, 0]).',
  },
  {
    lessonKey: 'backend-dars-31',
    order: 3,
    prompt: 'So\'zlar ro\'yxatidan {so\'z: uzunlik} lug\'atini comprehension bilan qanday yasaymiz?',
    choices: [
      '{s: len(s) for s in sozlar}',
      '[s: len(s) for s in sozlar]',
      '{s, len(s) for s in sozlar}',
      'dict[s: len(s) for s in sozlar]',
    ],
    correctIndex: 0,
    explanation:
      'Dict comprehension figurali qavs ichida kalit: qiymat juftligini talab qiladi — {s: len(s) for s in ["ol","olma"]} → {\'ol\': 2, \'olma\': 4}. Figurali qavs ichida ikki nuqta bo\'lmasa, natija dict emas, set bo\'ladi.',
  },
  {
    lessonKey: 'backend-dars-31',
    order: 4,
    prompt:
      'Kvadrat va Doira classlarining ikkalasida ham yuza() metodi bor. Ularni bitta ro\'yxatga solib, sikl bilan shakl.yuza() deb chaqirsak, bu nima deb ataladi?',
    choices: [
      'Inheritance — chunki ikkala class ham Shakl classidan meros olgan',
      'Encapsulation — chunki hisob-kitob class ichida yashiringan',
      'Comprehension — chunki sikl bilan aylanib chiqilyapti',
      'Polimorfizm — bir xil chaqiruv, class turiga qarab turli natija',
    ],
    correctIndex: 3,
    explanation:
      'Chaqiruv bir xil (shakl.yuza()), lekin bajariladigan kod obyektning classiga qarab tanlanadi — bu polimorfizm. Inheritance — uni qulay qiladigan vosita, lekin bu yerdagi hodisaning nomi emas.',
  },
  {
    lessonKey: 'backend-dars-31',
    order: 5,
    prompt: '@property asosan nima uchun kerak?',
    choices: [
      'Atributni tashqi kod uchun oddiy ko\'rinishda qoldirib, ichkarida hisob yoki tekshiruv qilish uchun',
      'Atributni tezroq o\'qish uchun',
      'Atributni butunlay o\'chirib tashlash uchun',
      'Bitta atributni bir nechta classga ulash uchun',
    ],
    correctIndex: 0,
    explanation:
      'Tashqi kod t.to_liq_ism deb yozaveradi, ichkarida esa ism va familiyani birlashtirish yoki @setter\'da -273 dan past haroratni rad etish mumkin. Ya\'ni tashqi interfeys o\'zgarmaydi, nazorat esa qo\'limizda qoladi.',
  },

  // ─────────────────────────────── Dars 32 — Generatorlar ───────────────────────────────
  {
    lessonKey: 'backend-dars-32',
    order: 1,
    prompt: 'Generator bilan list orasidagi asosiy farq nima?',
    choices: [
      'Generator faqat sonlar bilan ishlaydi, list esa istalgan tur bilan',
      'Generator listdan tezroq, chunki u barcha elementni oldindan tayyorlab qo\'yadi',
      'List barcha elementni darrov xotiraga yig\'adi, generator esa elementni faqat kerak bo\'lganda birma-bir yasaydi',
      'Generatorni o\'zgartirsa bo\'ladi, listni esa o\'zgartirib bo\'lmaydi',
    ],
    correctIndex: 2,
    explanation:
      'Generator «dangasa»: 1 million elementli list xotirani to\'ldiradi, generator esa bir vaqtda faqat bitta elementni ushlab turadi. Shuning uchun katta ma\'lumot bilan ishlaganda generator xotirani sezilarli tejaydi.',
  },
  {
    lessonKey: 'backend-dars-32',
    order: 2,
    prompt: 'Funksiya ichida yield va return ning farqi nima?',
    choices: [
      'yield funksiyani PAUZA qiladi va keyin o\'sha joydan davom etadi, return esa funksiyani butunlay tugatadi',
      'yield ham, return ham funksiyani tugatadi — faqat yield ro\'yxat qaytaradi',
      'yield qiymatlarni ro\'yxatga yig\'ib, oxirida hammasini birdan qaytaradi',
      'yield faqat sikl ichida, return faqat sikldan tashqarida yoziladi',
    ],
    correctIndex: 0,
    explanation:
      'yield qiymatni berib, funksiyaning holatini saqlab pauza qiladi — keyingi so\'rovda o\'sha satrdan davom etadi. Shu sababli generatordagi print\'lar birdan emas, har bir next() da navbat bilan chiqadi.',
  },
  {
    lessonKey: 'backend-dars-32',
    order: 3,
    prompt: 'Bir generatorni sikl bilan ikki marta aylanib chiqsak, ikkinchi safar nima bo\'ladi?',
    choices: [
      'Xuddi list kabi, elementlar yana boshidan takrorlanadi',
      'Xatolik (StopIteration) chiqib, dastur to\'xtaydi',
      'Generator avtomatik ravishda boshiga qaytadi',
      'Hech narsa chiqmaydi — generator tugagan, ikkinchi aylanish bo\'sh o\'tadi',
    ],
    correctIndex: 3,
    explanation:
      'Generator bir martalik: g = (x*x for x in range(4)) uchun list(g) birinchi safar [0, 1, 4, 9], ikkinchi safar esa [] beradi. Qayta kerak bo\'lsa, generatorni qaytadan yaratish yoki natijani listga saqlash kerak.',
  },
  {
    lessonKey: 'backend-dars-32',
    order: 4,
    prompt: '[x for x in range(10) if x % 2 == 0] ifodasining natijasi qanday bo\'ladi?',
    choices: [
      '[0, 1, 2, 3, 4]',
      '[0, 2, 4, 6, 8]',
      '[2, 4, 6, 8, 10]',
      '[1, 3, 5, 7, 9]',
    ],
    correctIndex: 1,
    explanation:
      'range(10) 0 dan 9 gacha beradi, oxirdagi if esa faqat juftlarini o\'tkazadi — natija [0, 2, 4, 6, 8]. 0 ham juft son, 10 esa range(10) ga umuman kirmaydi.',
  },
  {
    lessonKey: 'backend-dars-32',
    order: 5,
    prompt: 'Classga yozilgan __len__ metodi nima qiladi?',
    choices: [
      'Obyektning uzunligini avtomatik hisoblab, atribut sifatida saqlaydi',
      'Obyektni ro\'yxatga aylantiradi',
      'len(obyekt) chaqirilganda ishga tushib, biz belgilagan sonni qaytaradi',
      'Obyektdagi barcha metodlar sonini qaytaradi',
    ],
    correctIndex: 2,
    explanation:
      '__len__ — magic metod: len(savat) yozilganda Python uni o\'zi chaqiradi. Nimani sanashni biz yozamiz, shuning uchun generatorda __len__ yo\'q — len(generator) «object of type generator has no len()» xatosini beradi.',
  },

  // ───────────────────────────── Dars 33 — Decorator & Closure ─────────────────────────────
  {
    lessonKey: 'backend-dars-33',
    order: 1,
    prompt: 'Closure nima?',
    choices: [
      'Funksiyani majburan yopib, chaqirilishini taqiqlash',
      'Ichki funksiya tashqi funksiyaning o\'zgaruvchisini eslab qolishi — tashqi funksiya tugagandan keyin ham',
      'Faylni ishlatib bo\'lgach close() bilan yopish',
      'Bitta funksiyani boshqa funksiya ichida shunchaki e\'lon qilish',
    ],
    correctIndex: 1,
    explanation:
      'hisoblagich() qaytargan ichki funksiya son o\'zgaruvchisini «yodida saqlaydi»: c() ketma-ket 1, 2, 3 beradi. Yangi c2 = hisoblagich() esa o\'zining alohida son\'i bilan yana 1 dan boshlanadi.',
  },
  {
    lessonKey: 'backend-dars-33',
    order: 2,
    prompt: 'Funksiya ustidagi @dekorator yozuvi aslida nimaning qisqartmasi?',
    choices: [
      'dekorator(f()) — ya\'ni funksiyani chaqirib, natijasini uzatish',
      'f = f(dekorator) — funksiyaga dekoratorni parametr sifatida berish',
      'import dekorator — dekoratorni fayldan chaqirish',
      'f = dekorator(f) — funksiyani dekoratorga berib, natijani o\'sha nom bilan almashtirish',
    ],
    correctIndex: 3,
    explanation:
      '@dekorator — sof sintaktik qulaylik: f = dekorator(f) bilan bir xil. Asl funksiya kodiga tegilmaydi, shunchaki f nomi endi dekorator qaytargan wrapper\'ga ishora qiladi.',
  },
  {
    lessonKey: 'backend-dars-33',
    order: 3,
    prompt: 'Decorator ichidagi wrapper ustiga @functools.wraps(func) qo\'yilmasa nima bo\'ladi?',
    choices: [
      'Bezatilgan funksiya umuman ishlamay qoladi',
      'Bezatilgan funksiyaning __name__ i «wrapper» bo\'lib qoladi — asl nomi va hujjati yo\'qoladi',
      'Decorator parametrli funksiyalar bilan ishlay olmaydi',
      'Decorator faqat bir marta ishlaydi, keyingi chaqiruvlarda o\'tkazib yuboriladi',
    ],
    correctIndex: 1,
    explanation:
      '@wraps\'siz salom.__name__ «wrapper» deb chiqadi, @wraps bilan esa «xayr» — asl nom saqlanadi. Funksiya baribir ishlaydi, lekin nom va docstring yo\'qolgani nosozlikni tuzatishni qiyinlashtiradi.',
  },
  {
    lessonKey: 'backend-dars-33',
    order: 4,
    prompt:
      'Funksiya ichida yield ishlatilsa, uni chaqirganimizda (f()) darhol nima qaytadi?',
    choices: [
      'Barcha yield qiymatlaridan iborat tayyor ro\'yxat',
      'Birinchi yield qiymatining o\'zi',
      'Generator obyekti — funksiya tanasidagi kod hali umuman ishlamagan bo\'ladi',
      'None, chunki return yozilmagan',
    ],
    correctIndex: 2,
    explanation:
      'yield bo\'lgan funksiya chaqirilganda tanasi ishga tushmaydi — faqat generator obyekti qaytadi. Ichidagi birinchi print ham next() chaqirilganidan keyingina chiqadi; return esa qiymat bermay, generatorni tugatadi.',
  },
  {
    lessonKey: 'backend-dars-33',
    order: 5,
    prompt: 'Comprehension\'da faqat kerakli elementlarni qoldirish (filtrlash) uchun if qayerga yoziladi?',
    choices: [
      'for qismidan keyin, ifodaning oxirida',
      'Ifodadan oldin, albatta else bilan birga',
      'for so\'zidan oldin, in dan keyin',
      'Comprehension\'da filtr umuman qilib bo\'lmaydi — buni keyin alohida sikl bilan qilish kerak',
    ],
    correctIndex: 0,
    explanation:
      'Filtr har doim oxirda turadi: [x for x in range(10) if x % 2 == 0] → [0, 2, 4, 6, 8]. Ifodadan oldingi if esa else talab qiladi va filtrlamaydi — u faqat har bir element uchun qiymat tanlaydi.',
  },
];
