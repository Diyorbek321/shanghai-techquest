import type { LessonQuizRecord } from './backendQuiz.m1a';

// Hand-authored MCQs derived from the lesson decks' TEKSHIRUV slides.
//
// Scope: backend lessons 62..68 (`backend-dars-62` .. `backend-dars-68`), 5 questions each = 35.
// Every prompt is a light rewrite of the curriculum author's original open recap question so that it
// has exactly one defensible answer. Distractors are real DRF beginner misconceptions — Response ==
// HttpResponse, Router == tarmoq routeri, `-` prefiks maydonni o'chiradi, JWT «shifrlangan»,
// parol «shifrlanib» saqlanadi — so a wrong pick is diagnostic.
//
// `explanation` is shown to the student AFTER they answer; it is the teaching moment.

export const backendQuizB08: LessonQuizRecord[] = [
  // ───────────────────────────────── Dars 62 — API View ─────────────────────────────────
  {
    lessonKey: 'backend-dars-62',
    order: 1,
    prompt: 'DRF\'dagi APIView nima?',
    choices: [
      'Serializer\'ning DRF\'dagi boshqacha nomi',
      'urls.py ichida yo\'l e\'lon qiladigan yordamchi funksiya',
      'HTTP metodlari klass metodlari sifatida yoziladigan DRF view klassi',
      'Modelni bazaga saqlab beradigan maxsus klass',
    ],
    correctIndex: 2,
    explanation:
      'APIView — DRF ning klass ko\'rinishidagi view\'i: GET so\'rovi uchun get(), POST uchun post() metodini yozasiz. U ma\'lumot tarjimasi (serializer) bilan ham, modelni saqlash bilan ham o\'zi shug\'ullanmaydi.',
  },
  {
    lessonKey: 'backend-dars-62',
    order: 2,
    prompt: 'DRF\'ning Response\'i oddiy HttpResponse\'dan nimasi bilan farq qiladi?',
    choices: [
      'Response Python obyektini oladi va so\'rovga qarab formatni (JSON yoki Browsable API) o\'zi tanlaydi',
      'Hech qanday farqi yo\'q — bu bir narsaning ikki nomi',
      'Response faqat xatolik qaytarish uchun, muvaffaqiyatda HttpResponse yoziladi',
      'HttpResponse tezroq ishlaydi, chunki u ma\'lumotni siqib yuboradi',
    ],
    correctIndex: 0,
    explanation:
      'Response\'ga tayyor dict yoki serializer.data ni berasiz — DRF uni so\'rovga qarab JSON qilib yoki brauzerda Browsable API sahifasi qilib chiqaradi. HttpResponse esa siz bergan tayyor matnni o\'zgarishsiz yuboradi.',
  },
  {
    lessonKey: 'backend-dars-62',
    order: 3,
    prompt: 'urls.py da view klassini yozganda .as_view() nima uchun shart?',
    choices: [
      'View\'ni brauzerda ko\'rinadigan (ochiladigan) qilib qo\'yadi',
      'path() funksiya kutadi — .as_view() klassni o\'sha chaqiriladigan view funksiyasiga aylantiradi',
      'View uchun URL manzilni avtomatik o\'ylab topadi',
      'View ichidagi template\'ni oldindan render qilib qo\'yadi',
    ],
    correctIndex: 1,
    explanation:
      'path() ikkinchi argument sifatida chaqirsa bo\'ladigan obyekt — ya\'ni funksiya kutadi, klassning o\'zini emas. .as_view() aynan shu o\'ramni yasab beradi; uni unutsangiz Django darrov xato beradi.',
  },
  {
    lessonKey: 'backend-dars-62',
    order: 4,
    prompt: 'Serializer\'ga many=True ni qachon berish kerak?',
    choices: [
      'Modelda maydonlar soni ko\'p bo\'lganda',
      'Modelda ManyToManyField bo\'lganda',
      'Loyihada bir nechta serializer ishlatilganda',
      'Bitta obyekt emas, obyektlar ro\'yxati (queryset) serialize qilinayotganda',
    ],
    correctIndex: 3,
    explanation:
      'many=True serializer\'ga «senga ro\'yxat kelyapti» deb aytadi va natijada JSON massiv chiqadi. Bu modeldagi maydonlar soniga ham, ManyToMany bog\'lanishga ham aloqador emas.',
  },
  {
    lessonKey: 'backend-dars-62',
    order: 5,
    prompt: 'get_object_or_404(Post, pk=5) chaqirilganda Post topilmasa nima bo\'ladi?',
    choices: [
      'Http404 ko\'tariladi va mijozga 404 status kodi qaytadi',
      'None qaytadi, keyingi satrlar shu None bilan ishlashda davom etadi',
      'pk=5 bo\'lgan yangi bo\'sh obyekt yaratiladi',
      'Server 500 Internal Server Error qaytaradi',
    ],
    correctIndex: 0,
    explanation:
      'get_object_or_404 obyekt bo\'lmasa Http404 ko\'taradi va Django uni toza 404 javobiga aylantiradi. Shuning uchun .get() dan keyin qo\'lda «if obyekt is None» yozib o\'tirish shart emas.',
  },

  // ──────────────────────────── Dars 63 — ViewSets & Routers ────────────────────────────
  {
    lessonKey: 'backend-dars-63',
    order: 1,
    prompt: 'queryset va serializer_class berilgan ModelViewSet qaysi amallarni tayyor holda beradi?',
    choices: [
      'Faqat o\'qishni: list va retrieve',
      'To\'liq CRUD: list, retrieve, create, update, partial_update va destroy',
      'Faqat list, create va destroy — yangilash qo\'lda yoziladi',
      'Hech qanday amalni: har birini o\'zingiz metod qilib yozishingiz kerak',
    ],
    correctIndex: 1,
    explanation:
      'ModelViewSet — bu to\'liq CRUD to\'plami: ro\'yxat, bitta obyekt, yaratish, to\'liq va qisman yangilash hamda o\'chirish. Shuning uchun 40 satrlik APIView kodi 5 satrga qisqaradi.',
  },
  {
    lessonKey: 'backend-dars-63',
    order: 2,
    prompt: 'router.register(\'posts\', PostViewSet) yozilganda Router nima qiladi?',
    choices: [
      'So\'rovni to\'g\'ri serverga yo\'naltiradi, tarmoq routeri kabi',
      'PostViewSet o\'rniga view funksiyalarini o\'zi yozib beradi',
      'Model maydonlaridan URL manzil matnini yasaydi',
      'ViewSet amallariga mos URL naqshlarini (posts/ va posts/<pk>/) avtomatik hosil qiladi',
    ],
    correctIndex: 3,
    explanation:
      'DRF Router — bu urls.py yordamchisi: registerlangan ViewSet uchun ro\'yxat va bitta obyekt manzillarini o\'zi yasab, router.urls ichiga solib beradi. U tarmoq qurilmasi bilan hech qanday aloqasi yo\'q.',
  },
  {
    lessonKey: 'backend-dars-63',
    order: 3,
    prompt: 'ViewSet ichida @action dekoratori nimaga kerak?',
    choices: [
      'Standart CRUD\'dan tashqari qo\'shimcha endpoint qo\'shish uchun (masalan posts/1/like/)',
      'Modelga yangi metod qo\'shib, uni bazaga saqlash uchun',
      'ViewSet\'da faqat POST metodini yoqib qo\'yish uchun',
      'Amalni bazada tranzaksiya ichida bajarish uchun',
    ],
    correctIndex: 0,
    explanation:
      '@action Router\'ga «bu metod ham alohida URL bo\'lsin» deb aytadi, shuning uchun like, publish kabi nostandart amallar ham avtomatik manzil oladi. U tranzaksiya ham, model metodi ham emas.',
  },
  {
    lessonKey: 'backend-dars-63',
    order: 4,
    prompt: 'APIView ichida GET so\'rovini qanday qayta ishlaymiz?',
    choices: [
      'Metod ustiga @get dekoratorini qo\'yamiz',
      'urls.py da path() ga method=\'GET\' argumentini beramiz',
      'Klass ichida def get(self, request): metodini yozamiz',
      'Bitta metod ichida if request.method == \'GET\' deb tekshiramiz',
    ],
    correctIndex: 2,
    explanation:
      'APIView\'da HTTP metodi bevosita klass metodining nomiga aylanadi: get(), post(), put(), delete(). Funksiya-view\'lardagi if request.method tekshiruvi endi kerak emas — marshrutlashni DRF o\'zi qiladi.',
  },
  {
    lessonKey: 'backend-dars-63',
    order: 5,
    prompt: 'Serializer API\'da qanday vazifani bajaradi?',
    choices: [
      'Ma\'lumotni shifrlab, tarmoqda o\'qib bo\'lmaydigan qiladi',
      'Faqat bazadan o\'qiydi, kiruvchi ma\'lumot bilan ishlamaydi',
      'HTML forma yasab, uni sahifada ko\'rsatadi',
      'Obyektni JSON\'ga va JSON\'ni obyektga aylantiradi, kirishda esa validatsiya qiladi',
    ],
    correctIndex: 3,
    explanation:
      'Serializer — ikki tomonlama tarjimon: chiqishda Serializer(obyekt).data JSON beradi, kirishda Serializer(data=…).is_valid() ma\'lumotni tekshiradi. Shifrlash ham, HTML render ham uning ishi emas.',
  },

  // ───────────────────────────────── Dars 64 — CRUD API 1 ─────────────────────────────────
  {
    lessonKey: 'backend-dars-64',
    order: 1,
    prompt: 'list va retrieve amallari nimasi bilan farq qiladi?',
    choices: [
      'list obyektlar massivini qaytaradi, retrieve esa id bo\'yicha bitta obyektni',
      'list GET so\'rovi uchun, retrieve esa POST so\'rovi uchun',
      'list bazadan oladi, retrieve esa keshdan oladi',
      'Farqi yo\'q — ikkalasi ham bir xil javob qaytaradi',
    ],
    correctIndex: 0,
    explanation:
      'list — /posts/ manziliga tushadi va JSON massiv beradi; retrieve — /posts/5/ ga tushadi va bitta obyekt beradi. Mijoz uchun bu farq muhim: massivni obyekt deb o\'qishga urinsa, ilova sinadi.',
  },
  {
    lessonKey: 'backend-dars-64',
    order: 2,
    prompt: 'POST so\'rovi bilan yangi obyekt muvaffaqiyatli yaratilganda qaysi status kod qaytarilishi kerak?',
    choices: [
      '200 OK',
      '204 No Content',
      '201 Created',
      '302 Found',
    ],
    correctIndex: 2,
    explanation:
      'Yaratish uchun maxsus kod bor — 201 Created, va javob tanasida yangi yaratilgan obyekt qaytariladi. 200 ham «ishladi» degani, lekin mijozga aynan yangi resurs paydo bo\'lganini aytmaydi.',
  },
  {
    lessonKey: 'backend-dars-64',
    order: 3,
    prompt: 'serializer.is_valid(raise_exception=True) yozilsa, ma\'lumot noto\'g\'ri bo\'lganda nima bo\'ladi?',
    choices: [
      'Xatolar konsolga chiqadi, mijozga esa baribir 200 ketadi',
      'Noto\'g\'ri maydonlar e\'tiborsiz qoldirilib, obyekt baribir saqlanadi',
      'Server 500 Internal Server Error qaytaradi',
      'DRF xatoni tutib, xatolar ro\'yxati bilan 400 Bad Request qaytaradi',
    ],
    correctIndex: 3,
    explanation:
      'raise_exception=True ValidationError ko\'taradi, DRF esa uni o\'zi tutib, serializer.errors bilan birga 400 javobiga aylantiradi. Shu sabab qo\'lda «if not is_valid(): return Response(…, 400)» yozish shart emas.',
  },
  {
    lessonKey: 'backend-dars-64',
    order: 4,
    prompt: 'urls.py da Router ishlatishning asosiy foydasi nima?',
    choices: [
      'ViewSet amallariga mos URL naqshlarini qo\'lda yozmasdan avtomatik oladi',
      'Har bir so\'rovni eng bo\'sh serverga taqsimlaydi',
      'URL manzillarni xavfsizlik uchun shifrlab qo\'yadi',
      'Barcha URL manzillarni bazaga jadval qilib saqlaydi',
    ],
    correctIndex: 0,
    explanation:
      'Router registerlangan ViewSet uchun ro\'yxat va bitta obyekt manzillarini o\'zi yasaydi, siz esa faqat prefiks beribsiz. Bu URL\'larni shifrlash yoki yukni taqsimlash bilan aralashtirilmasin.',
  },
  {
    lessonKey: 'backend-dars-64',
    order: 5,
    prompt: 'path(\'posts/\', PostListAPIView.as_view()) da .as_view() ni tushirib qoldirsak nima bo\'ladi?',
    choices: [
      'Hammasi ishlayveradi, .as_view() ixtiyoriy qisqartma',
      'Endpoint faqat GET uchun ishlaydi, POST ishlamay qoladi',
      'Django klassni chaqira olmaydi va URL sozlamasida xato beradi',
      'Endpoint ishlaydi, lekin Browsable API sahifasi ochilmaydi',
    ],
    correctIndex: 2,
    explanation:
      'path() ga chaqirsa bo\'ladigan view kerak; klassning o\'zi bunday emas. .as_view() klassni funksiyaga o\'rab beradi — bu eng ko\'p unutiladigan qadam va xato darrov URL sozlamasida chiqadi.',
  },

  // ───────────────────────────────── Dars 65 — CRUD API 2 ─────────────────────────────────
  {
    lessonKey: 'backend-dars-65',
    order: 1,
    prompt: 'PUT va PATCH o\'rtasidagi asosiy farq nima?',
    choices: [
      'PUT obyektni yangilaydi, PATCH esa yangisini yaratadi',
      'PUT obyektni to\'liq almashtiradi (barcha maydon kerak), PATCH esa faqat yuborilgan maydonlarni o\'zgartiradi',
      'PUT faqat admin uchun, PATCH oddiy foydalanuvchi uchun',
      'Farqi yo\'q — DRF ikkalasini bir xil qayta ishlaydi',
    ],
    correctIndex: 1,
    explanation:
      'PUT — «mana to\'liq yangi holat» degani, shuning uchun majburiy maydonlarni yubormasangiz validatsiya xato beradi. PATCH esa qisman: faqat o\'zgartirmoqchi bo\'lgan maydonni yuborasiz.',
  },
  {
    lessonKey: 'backend-dars-65',
    order: 2,
    prompt: 'Serializer(post, data=request.data, partial=True) dagi partial=True nima qiladi?',
    choices: [
      'Obyektni yarim saqlaydi: bir qismini bazaga yozib, qolganini tashlab yuboradi',
      'Validatsiyani butunlay o\'chirib qo\'yadi',
      'Yuborilmagan maydonlarni majburiy deb hisoblamaydi — PATCH uchun aynan shu kerak',
      'Serializer\'dagi maydonlarning faqat yarmini JSON\'ga chiqaradi',
    ],
    correctIndex: 2,
    explanation:
      'partial=True bilan serializer yetishmayotgan maydonlarga «majburiy» talabini qo\'ymaydi va faqat kelganini yangilaydi. Qolgan tekshiruvlar (tur, uzunlik va h.k.) o\'z kuchida qoladi.',
  },
  {
    lessonKey: 'backend-dars-65',
    order: 3,
    prompt: 'Obyekt muvaffaqiyatli o\'chirilganda DELETE odatda qaysi javobni qaytaradi?',
    choices: [
      '204 No Content — javob tanasi bo\'sh bo\'ladi',
      '200 OK va o\'chirilgan obyekt JSON ko\'rinishida',
      '404 Not Found, chunki obyekt endi mavjud emas',
      '201 Created, chunki amal bajarildi',
    ],
    correctIndex: 0,
    explanation:
      'O\'chirish muvaffaqiyatli bo\'lsa qaytaradigan ma\'lumot qolmaydi — shuning uchun 204 No Content va bo\'sh tana. O\'chirilgandan keyin 404 qaytarish xato: 404 obyekt topilmagan holat uchun.',
  },
  {
    lessonKey: 'backend-dars-65',
    order: 4,
    prompt: 'POST so\'rovi bilan obyekt yaratildi. To\'g\'ri javob qanday bo\'ladi?',
    choices: [
      '200 OK va bo\'sh tana',
      '204 No Content, chunki mijozda ma\'lumot bor',
      '400 Bad Request, agar barcha maydon to\'ldirilmagan bo\'lsa ham',
      '201 Created va yaratilgan obyektning JSON ko\'rinishi',
    ],
    correctIndex: 3,
    explanation:
      'Yaratishning standart javobi — 201 Created, tanasida esa serializer.data, ya\'ni id bilan birga yangi obyekt. Mijoz shu id ni keyingi so\'rovlarda ishlatadi.',
  },
  {
    lessonKey: 'backend-dars-65',
    order: 5,
    prompt: 'ModelViewSet CRUD\'ning qaysi qismini o\'zi qoplaydi?',
    choices: [
      'Faqat o\'qish amallarini, yozish amallari qo\'lda yoziladi',
      'O\'qish, yaratish, to\'liq va qisman yangilash hamda o\'chirish — barchasini',
      'Faqat yaratish va o\'chirishni',
      'Faqat qidiruv va tartiblashni',
    ],
    correctIndex: 1,
    explanation:
      'ModelViewSet list, retrieve, create, update, partial_update va destroy amallarini birdan beradi — ya\'ni PUT, PATCH va DELETE ham tayyor. Sizga faqat queryset va serializer_class kerak.',
  },

  // ─────────────────────────── Dars 66 — Filtrlash & Pagination ───────────────────────────
  {
    lessonKey: 'backend-dars-66',
    order: 1,
    prompt: 'Bazada 10 000 ta post bor. Pagination nima uchun kerak?',
    choices: [
      'Bazadagi yozuvlar sonini kamaytirib, joyni tejaydi',
      'Javobni gzip bilan siqib, hajmini kichraytiradi',
      'Frontendda sahifa dizayni chiroyli chiqishi uchun kerak, backendga aloqasi yo\'q',
      'Hammasini bir javobda yubormay, bo\'lib-bo\'lib beradi — server ham, mijoz ham qotib qolmaydi',
    ],
    correctIndex: 3,
    explanation:
      'Pagination bitta javobga tushadigan yozuvlar sonini cheklaydi va count, next, previous, results bilan qaytaradi. Bu bazani kichraytirmaydi — shunchaki har safar kerakli bo\'lakni oladi.',
  },
  {
    lessonKey: 'backend-dars-66',
    order: 2,
    prompt: 'ViewSet\'da search_fields = [\'title\', \'body\'] nima beradi?',
    choices: [
      '?search=… so\'rovi bilan shu maydonlar ichidan matn bo\'yicha qidirish imkonini beradi',
      'Shu maydonlar qiymatiga aniq teng bo\'lgan yozuvlarnigina qoldiradi',
      'Natijani shu maydonlar bo\'yicha tartiblaydi',
      'Bazada shu maydonlar uchun indeks yaratadi',
    ],
    correctIndex: 0,
    explanation:
      'search_fields — SearchFilter uchun: ?search=python so\'rovi shu maydonlar ichidan matn qismini qidiradi. Aniq tenglik filtri filterset_fields, tartiblash esa ordering_fields ishi.',
  },
  {
    lessonKey: 'backend-dars-66',
    order: 3,
    prompt: '?ordering=-yaratilgan so\'rovidagi minus belgisi nimani anglatadi?',
    choices: [
      'yaratilgan maydonini javobdan chiqarib tashlaydi',
      'Tartiblashni kamayish bo\'yicha qiladi — eng yangi yozuv birinchi chiqadi',
      'yaratilgan maydoni bo\'sh bo\'lgan yozuvlarni filtrlab tashlaydi',
      'Tartiblashni o\'sish bo\'yicha qiladi — eng eski yozuv birinchi chiqadi',
    ],
    correctIndex: 1,
    explanation:
      'Django ORM\'dagi order_by(\'-yaratilgan\') kabi, minus prefiksi teskari (kamayish) tartibni bildiradi. Minussiz ?ordering=yaratilgan bo\'lsa, eng eski yozuv birinchi bo\'ladi.',
  },
  {
    lessonKey: 'backend-dars-66',
    order: 4,
    prompt: 'Postning faqat sarlavhasini o\'zgartirmoqchisiz. Qaysi metod to\'g\'ri va nima uchun?',
    choices: [
      'PUT — u ham bitta maydonni yuborishga ruxsat beradi',
      'POST — chunki ma\'lumot yuborilyapti',
      'PATCH — u qisman yangilaydi, PUT esa barcha maydonlarni talab qiladi',
      'Ikkalasi ham bir xil, farqi yo\'q',
    ],
    correctIndex: 2,
    explanation:
      'PATCH aynan qisman yangilash uchun: faqat title ni yuborasiz, qolgani tegilmaydi. PUT esa to\'liq almashtirish — majburiy maydonlarni yubormasangiz 400 olasiz.',
  },
  {
    lessonKey: 'backend-dars-66',
    order: 5,
    prompt: 'Yangi obyekt yaratildi. Server 201 mi yoki 200 mi qaytarishi kerak?',
    choices: [
      '200 OK — chunki so\'rov muvaffaqiyatli tugadi',
      '204 No Content — obyekt saqlanib bo\'ldi',
      '201 Created — yangi resurs paydo bo\'lganini bildiradi',
      'Ikkalasi bir xil ma\'noda, farqi yo\'q',
    ],
    correctIndex: 2,
    explanation:
      '201 Created — «yangi resurs yaratildi» degan aniq signal, mijoz shunga qarab yangi id ni oladi. 200 OK umumiy «ishladi» javobi bo\'lib, yaratish faktini bildirmaydi.',
  },

  // ───────────────────────────────── Dars 67 — Auth 1 ─────────────────────────────────
  {
    lessonKey: 'backend-dars-67',
    order: 1,
    prompt: 'Foydalanuvchi paroli bazada qanday saqlanadi?',
    choices: [
      'Ochiq matnda, chunki bazaga faqat administrator kira oladi',
      'Base64 bilan kodlangan holda, keyin kerak bo\'lsa ochib olinadi',
      'Shifrlanadi va tekshirishda kalit bilan qayta ochiladi',
      'Hash (qaytarib bo\'lmaydigan barmoq izi) holida — create_user() yoki set_password() buni o\'zi qiladi',
    ],
    correctIndex: 3,
    explanation:
      'Django parolni tuz (salt) bilan hash qiladi va hech qachon asl holiga qaytarmaydi: kirishda kiritilgan parol qayta hash qilinib, taqqoslanadi. Base64 — bu kodlash, shifrlash emas, uni har kim ochib o\'qiy oladi.',
  },
  {
    lessonKey: 'backend-dars-67',
    order: 2,
    prompt: 'Register serializer\'ida parol maydoniga write_only=True qo\'yilsa nima bo\'ladi?',
    choices: [
      'Maydon kirishda qabul qilinadi, lekin javob JSON\'iga hech qachon chiqmaydi',
      'Maydon majburiy bo\'lib qoladi',
      'Maydon faqat bazaga yoziladi va yangilashda o\'zgartirib bo\'lmaydi',
      'Maydonni faqat admin panelidagi foydalanuvchilar ko\'ra oladi',
    ],
    correctIndex: 0,
    explanation:
      'write_only maydonni faqat kiruvchi ma\'lumot uchun qoldiradi: serializer.data ichida parol qaytmaydi. Aks holda ro\'yxatdan o\'tish javobida parolni butun dunyoga qaytargan bo\'lasiz.',
  },
  {
    lessonKey: 'backend-dars-67',
    order: 3,
    prompt: 'Authentication va authorization farqi nimada?',
    choices: [
      'Authentication — parolni shifrlash, authorization — uni tekshirish',
      'Authentication — «siz kimsiz?», authorization — «sizga bunga ruxsat bormi?»',
      'Authentication — frontend ishi, authorization — backend ishi',
      'Bu bir tushunchaning ikki nomi, faqat turli frameworklarda',
    ],
    correctIndex: 1,
    explanation:
      'Avval kimligingiz aniqlanadi (login, token), keyin shu shaxsga aniq amalga ruxsat bor-yo\'qligi tekshiriladi. Tizimga kirgan bo\'lish — boshqaning postini o\'chirishga huquq bermaydi.',
  },
  {
    lessonKey: 'backend-dars-67',
    order: 4,
    prompt: 'API javobida pagination bo\'lmasa, 10 000 yozuvli endpointda asosiy muammo nima bo\'ladi?',
    choices: [
      'Baza jadvali buziladi',
      'Status kod 400 qaytadi',
      'Serializer validatsiyani o\'tkaza olmaydi',
      'Bitta javob juda katta bo\'lib, so\'rov sekinlashadi va mobil ilova qotib qoladi',
    ],
    correctIndex: 3,
    explanation:
      'Pagination bo\'lmasa server hamma yozuvni bir zumda JSON qilib yuborishga majbur bo\'ladi — bu xotira, tarmoq va mijoz uchun og\'ir. Shuning uchun pagination haqiqiy API\'da majburiy hisoblanadi.',
  },
  {
    lessonKey: 'backend-dars-67',
    order: 5,
    prompt: 'Yangilashda partial=True berilsa, serializer o\'zini qanday tutadi?',
    choices: [
      'Barcha maydonlarni baribir majburiy deb tekshiradi',
      'Yuborilmagan maydonlarni talab qilmaydi va ularni eski qiymatida qoldiradi',
      'Yuborilmagan maydonlarni bo\'sh qiymat bilan almashtiradi',
      'Ma\'lumotni umuman tekshirmasdan saqlaydi',
    ],
    correctIndex: 1,
    explanation:
      'partial=True — PATCH uchun rejim: faqat kelgan maydonlar tekshiriladi va yangilanadi, qolganiga tegilmaydi. Bu validatsiyani o\'chirish degani emas — kelgan qiymatlar baribir tekshiriladi.',
  },

  // ──────────────────────────────── Dars 68 — Auth 2 (JWT) ────────────────────────────────
  {
    lessonKey: 'backend-dars-68',
    order: 1,
    prompt: 'Login qilgandan keyin ham har bir so\'rovda token yuborish nega kerak?',
    choices: [
      'Token so\'rovni tezlashtiradi va bazaga murojaatni kamaytiradi',
      'HTTP stateless — server oldingi so\'rovni eslamaydi, shuning uchun har safar kimligimizni tasdiqlaymiz',
      'Token so\'rov tanasidagi ma\'lumotni shifrlaydi',
      'Token bo\'lmasa brauzer so\'rovni umuman yubormaydi',
    ],
    correctIndex: 1,
    explanation:
      'HTTP holatni saqlamaydi: har bir so\'rov server uchun mutlaqo yangi. Shuning uchun Authorization: Bearer <token> sarlavhasi har so\'rovda «men falonchiman» degan pasport vazifasini bajaradi.',
  },
  {
    lessonKey: 'backend-dars-68',
    order: 2,
    prompt: 'Access token va refresh token qanday farq qiladi?',
    choices: [
      'Access token serverda saqlanadi, refresh token mijozda',
      'Access token faqat GET uchun, refresh token yozish amallari uchun',
      'Access qisqa muddatli va har so\'rovda yuboriladi, refresh uzoq muddatli va faqat yangi access olish uchun ishlatiladi',
      'Ikkalasi bir xil, faqat nomi boshqacha',
    ],
    correctIndex: 2,
    explanation:
      'Access token qisqa yashaydi — o\'g\'irlansa ham zarari cheklangan. Muddati tugagach, refresh token bilan yangi access olinadi va foydalanuvchi qayta login qilmaydi.',
  },
  {
    lessonKey: 'backend-dars-68',
    order: 3,
    prompt: 'JWT ning payload qismi shifrlanganmi?',
    choices: [
      'Yo\'q — u shunchaki base64 bilan kodlangan, kalitsiz ham o\'qib bo\'ladi',
      'Ha, uni faqat server maxfiy kalit bilan ocha oladi',
      'Ha, chunki token HTTPS orqali yuboriladi',
      'Faqat parol yozilgan bo\'lsa shifrlanadi',
    ],
    correctIndex: 0,
    explanation:
      'Payload base64 bilan kodlangan, ya\'ni tokenni ushlagan har kim uni ochib o\'qiy oladi (biz buni sinab ham ko\'rdik). Imzo faqat tokenni o\'zgartirishdan himoya qiladi — shuning uchun payloadga parol yoki maxfiy ma\'lumot yozilmaydi.',
  },
  {
    lessonKey: 'backend-dars-68',
    order: 4,
    prompt: 'Parolni bazada saqlash haqidagi qaysi fikr to\'g\'ri?',
    choices: [
      'Parolni JWT payloadiga yozib qo\'ysa, bazada saqlash shart emas',
      'Parolni shifrlab saqlash kerak, chunki uni foydalanuvchiga qaytarish kerak bo\'ladi',
      'Parolni ochiq saqlasa ham bo\'ladi, agar HTTPS ishlatilsa',
      'Parol hash holida saqlanadi va hech qachon asl ko\'rinishga qaytarilmaydi',
    ],
    correctIndex: 3,
    explanation:
      'Hash bir tomonlama: kirishda kiritilgan parol qayta hash qilinib, saqlangani bilan solishtiriladi. HTTPS faqat yo\'ldagi ma\'lumotni himoya qiladi, baza o\'g\'irlansa ochiq parollar darrov oshkor bo\'ladi.',
  },
  {
    lessonKey: 'backend-dars-68',
    order: 5,
    prompt: 'search_fields ro\'yxatini ViewSet\'ga qo\'shsak, mijoz undan qanday foydalanadi?',
    choices: [
      '?ordering=matn so\'rovi bilan tartiblaydi',
      'Hech qanday so\'rovsiz — natija avtomatik filtrlanadi',
      '?search=matn so\'rovi bilan shu maydonlar ichidan matn qidiradi',
      'Faqat admin panelidagi qidiruv oynasida ishlaydi',
    ],
    correctIndex: 2,
    explanation:
      'SearchFilter ?search= parametrini o\'qib, search_fields dagi maydonlar ichidan mos matnni qidiradi. Parametr yuborilmasa, ro\'yxat odatdagidek to\'liq qaytadi.',
  },
];
