import type { LessonQuizRecord } from './backendQuiz.m1a';

// Hand-authored MCQs derived from the lesson decks' TEKSHIRUV slides.
//
// Scope: backend lessons 69..75 (`backend-dars-69` .. `backend-dars-75`), 5 questions each = 35.
// Mavzular: Permissions, Bog'lanishlar 1-2 (nested / M2M), REST API loyiha, Test asoslari,
// pytest / Django test, Debugging & TDD.
//
// Har bir prompt — kurs muallifining asl takrorlash savoli, faqat yagona to'g'ri javob chiqishi
// uchun yengil qayta yozilgan. Distraktorlar shu mavzudagi haqiqiy boshlang'ich xatolar:
// 401/403 ni almashtirish, ForeignKey to'liq obyekt bo'lib chiqadi deb o'ylash,
// select_related/prefetch_related ni teskari ishlatish, read_only/write_only ni chalkashtirish,
// TDD siklini GREEN dan boshlash, traceback'ni boshidan o'qish.
//
// `explanation` javob berilgandan KEYIN ko'rsatiladi — asosiy o'rgatuvchi qism o'sha.
//
// assert / traceback bilan bog'liq savollarning javoblari Piston sandbox'ida (python 3.10.0)
// haqiqiy kod ishga tushirilib tekshirilgan.

export const backendQuizB09: LessonQuizRecord[] = [
  // ────────────────────────────── Dars 69 — Permissions ──────────────────────────────
  {
    lessonKey: 'backend-dars-69',
    order: 1,
    prompt: '401 va 403 status kodlari orasidagi asosiy farq nima?',
    choices: [
      '401 — server ichki xatosi, 403 — sahifa topilmadi',
      '401 — kimligingiz aniqlanmadi (token yo\'q yoki yaroqsiz), 403 — kimligingiz ma\'lum, lekin bu amalga ruxsatingiz yo\'q',
      '401 — so\'rov noto\'g\'ri tuzilgan, 403 — server band',
      'Ikkalasi ham bir xil ma\'noni bildiradi, DRF ularni tasodifiy tanlaydi',
    ],
    correctIndex: 1,
    explanation:
      '401 Unauthorized — «siz kimsiz?» degan savolga javob yo\'q: token yuborilmagan yoki yaroqsiz. 403 Forbidden — server sizni tanidi, lekin aynan shu amalni bajarishga ruxsat bermaydi.',
  },
  {
    lessonKey: 'backend-dars-69',
    order: 2,
    prompt: 'DRF\'dagi permissions.SAFE_METHODS ichida qaysi HTTP metodlar bor?',
    choices: [
      'GET, HEAD, OPTIONS — ma\'lumotni o\'zgartirmaydigan metodlar',
      'POST, PUT, DELETE — ya\'ni himoyalanishi kerak bo\'lgan metodlar',
      'HTTPS orqali yuborilgan har qanday metod',
      'Faqat tizimga kirgan foydalanuvchi yuborishi mumkin bo\'lgan metodlar',
    ],
    correctIndex: 0,
    explanation:
      'SAFE_METHODS — bu faqat o\'qiydigan, hech narsani o\'zgartirmaydigan metodlar to\'plami: GET, HEAD, OPTIONS. Shuning uchun «hamma o\'qiy oladi, faqat egasi o\'zgartiradi» qoidasi odatda `if request.method in SAFE_METHODS: return True` bilan yoziladi.',
  },
  {
    lessonKey: 'backend-dars-69',
    order: 3,
    prompt: 'Custom permission klassidagi has_object_permission() metodi qachon chaqiriladi?',
    choices: [
      'Har qanday so\'rovda, has_permission() dan oldin',
      'Faqat POST so\'rovlarda, obyekt yaratilishidan oldin',
      'View aniq bir obyektni get_object() orqali olgandan keyin — ya\'ni detail so\'rovlarda',
      'Har bir so\'rovda, jumladan list endpointida ro\'yxatdagi har bir obyekt uchun',
    ],
    correctIndex: 2,
    explanation:
      'Avval has_permission() ishlaydi, keyin view get_object() bilan bitta obyektni oladi va faqat shundan so\'ng has_object_permission() chaqiriladi. List endpointida u umuman chaqirilmaydi — ro\'yxatni cheklash uchun get_queryset() ni filtrlash kerak.',
  },
  {
    lessonKey: 'backend-dars-69',
    order: 4,
    prompt: 'JWT autentifikatsiyasida access token odatda qancha yashaydi?',
    choices: [
      'Foydalanuvchi parolini o\'zgartirmaguncha — muddati yo\'q',
      'Qisqa muddat (odatda bir necha daqiqa) — keyin refresh token bilan yangisi olinadi',
      'Refresh token bilan bir xil muddat — ikkalasi birga tugaydi',
      'Brauzer yopilgunicha — token sessiyaga bog\'langan',
    ],
    correctIndex: 1,
    explanation:
      'Access token qasddan qisqa muddatli qilinadi: o\'g\'irlansa ham zarar oynasi kichik bo\'ladi. Uzoq yashaydigan refresh token esa yangi access token olish uchun ishlatiladi va serverda bekor qilinishi mumkin.',
  },
  {
    lessonKey: 'backend-dars-69',
    order: 5,
    prompt: 'Serializer maydonidagi write_only=True nima qiladi?',
    choices: [
      'Maydonni majburiy qiladi — bo\'sh yuborib bo\'lmaydi',
      'Maydonni bazada faqat bir marta yozib, keyin o\'zgartirishni taqiqlaydi',
      'Maydon javobda chiqadi, lekin kelgan so\'rovdan o\'qilmaydi',
      'Maydon so\'rovda qabul qilinadi va saqlanadi, lekin javobga umuman chiqmaydi',
    ],
    correctIndex: 3,
    explanation:
      'write_only=True — «ichkariga kiradi, tashqariga chiqmaydi». Aynan shuning uchun parol maydoni doim write_only qilinadi: foydalanuvchi uni yuboradi, lekin API javobida hech qachon ko\'rinmaydi. Teskarisi — read_only.',
  },

  // ───────────────────────── Dars 70 — Bog'lanishlar 1 (nested) ─────────────────────────
  {
    lessonKey: 'backend-dars-70',
    order: 1,
    prompt:
      'ModelSerializer\'da hech narsa sozlanmasa, ForeignKey maydon JSON javobida qanday ko\'rinadi?',
    choices: [
      'Bog\'langan obyektning id raqami sifatida, masalan "kategoriya": 1',
      'Bog\'langan obyektning barcha maydonlari bilan to\'liq JSON obyekt sifatida',
      'Bog\'langan obyektning __str__() natijasi — matn sifatida',
      'Umuman chiqmaydi — bog\'lanishlarni qo\'lda qo\'shish kerak',
    ],
    correctIndex: 0,
    explanation:
      'Standart holda DRF ForeignKey uchun PrimaryKeyRelatedField ishlatadi, ya\'ni faqat id raqamini beradi. Nomni ko\'rsatish uchun StringRelatedField, SlugRelatedField yoki nested serializer kerak.',
  },
  {
    lessonKey: 'backend-dars-70',
    order: 2,
    prompt: 'StringRelatedField bog\'langan obyektdan nimani ko\'rsatadi?',
    choices: [
      'Modeldagi birinchi CharField maydonini',
      'id raqamini matnga aylantirib, masalan "1"',
      'Obyektning __str__() metodi qaytargan matnni',
      'Obyektning barcha maydonlarini vergul bilan ajratilgan matn ko\'rinishida',
    ],
    correctIndex: 2,
    explanation:
      'StringRelatedField shunchaki str(obyekt) ni chaqiradi, ya\'ni modelning __str__() metodiga tayanadi. Shuning uchun modelda __str__() ni yaxshi yozgan bo\'lsangiz, API javobi ham darrov o\'qilishi oson bo\'ladi.',
  },
  {
    lessonKey: 'backend-dars-70',
    order: 3,
    prompt: 'Serializer maydonidagi read_only=True nima qiladi?',
    choices: [
      'Maydonni bazada o\'zgarmas qiladi — modelda ham yangilab bo\'lmaydi',
      'Maydon javobda chiqadi, lekin kelgan ma\'lumotdan o\'qilmaydi va saqlashda e\'tiborga olinmaydi',
      'Maydon na javobda chiqadi, na so\'rovdan o\'qiladi — u butunlay yashiriladi',
      'Serializer faqat GET so\'rovlarida ishlashini ta\'minlaydi',
    ],
    correctIndex: 1,
    explanation:
      'read_only=True maydonni chiqishga qoldiradi, lekin kiruvchi ma\'lumotdan butunlay chetlab o\'tadi — validated_data ichiga tushmaydi. Model darajasida esa maydon bemalol o\'zgaraveradi (masalan, perform_create ichida).',
  },
  {
    lessonKey: 'backend-dars-70',
    order: 4,
    prompt:
      'Foydalanuvchi to\'g\'ri JWT token bilan kirgan, lekin BOSHQA odamning postini o\'chirmoqchi. ViewSet\'da `queryset = Post.objects.all()` — ya\'ni post ro\'yxatda ham ko\'rinib turadi, uni faqat has_object_permission() himoya qiladi. DRF qaysi statusni qaytaradi?',
    choices: [
      '401 Unauthorized',
      '404 Not Found',
      '400 Bad Request',
      '403 Forbidden',
    ],
    correctIndex: 3,
    explanation:
      'Shart aniq: obyekt queryset\'da bor, demak get_object() uni TOPADI — shuning uchun 404 emas. Token yaroqli, foydalanuvchi tanildi — demak 401 ham emas. has_object_permission() False qaytargani uchun DRF 403 Forbidden beradi. Endi muhim farqni yodda tuting: 403 javobining o\'zi «bunday obyekt bor, lekin sizniki emas» degan ma\'lumotni sizdiradi. Shuning uchun kursning tavsiya qiladigan yechimi (90-92-darslar) — get_queryset() ni request.user bo\'yicha filtrlash: shunda begona post na ro\'yxatga, na get_object() ga tushadi va DRF o\'zi 404 qaytaradi. Qoida: obyekt ko\'rinadigan bo\'lsa — 403, filtrlab yashirilgan bo\'lsa — 404.',
  },
  {
    lessonKey: 'backend-dars-70',
    order: 5,
    prompt: 'JWT tokenning payload qismi shifrlanganmi?',
    choices: [
      'Yo\'q — u faqat base64 bilan kodlangan, tokenni ushlagan har kim o\'qiy oladi',
      'Ha — SECRET_KEY bilan shifrlangan, faqat server ocha oladi',
      'Ha — imzo (signature) payload\'ni shifrlab qo\'yadi',
      'HTTPS orqali yuborilganda shifrlanadi, HTTP\'da esa ochiq qoladi',
    ],
    correctIndex: 0,
    explanation:
      'JWT payload — bu oddiy base64, uni istalgan sayt bir soniyada ochib beradi. Imzo faqat tokenni O\'ZGARTIRISHDAN himoya qiladi, yashirmaydi — shuning uchun payload\'ga parol yoki maxfiy ma\'lumot yozilmaydi.',
  },

  // ──────────────────────── Dars 71 — Bog'lanishlar 2 (M2M) ────────────────────────
  {
    lessonKey: 'backend-dars-71',
    order: 1,
    prompt: 'ManyToMany maydonni serializer\'da qo\'lda e\'lon qilganda nimani yozish shart?',
    choices: [
      'read_only=True — aks holda saqlash ishlamaydi',
      'source=\'...\' orqali bog\'lanish nomini ko\'rsatish',
      'many=True — maydon ro\'yxat ekanini bildirish uchun',
      'Hech narsa — DRF M2M ekanini o\'zi aniqlab, avtomatik ro\'yxat qiladi',
    ],
    correctIndex: 2,
    explanation:
      'M2M — bu bitta obyekt emas, ro\'yxat, shuning uchun TegSerializer(many=True) deb yozilishi shart. many=True siz DRF bitta obyekt kutadi va ro\'yxat kelganda xato beradi.',
  },
  {
    lessonKey: 'backend-dars-71',
    order: 2,
    prompt:
      'Serializer\'da `izohlar_soni = serializers.SerializerMethodField()` deb yozdingiz. Uni to\'ldiruvchi metod qanday nomlanishi kerak?',
    choices: [
      'izohlar_soni() — maydon nomi bilan bir xil',
      'get_izohlar_soni()',
      'get_field() — DRF maydon nomini o\'zi uzatadi',
      'izohlar_soni_get()',
    ],
    correctIndex: 1,
    explanation:
      'SerializerMethodField sukut bo\'yicha get_<maydon nomi> shaklidagi metodni qidiradi, ya\'ni get_izohlar_soni(self, obj). Metod obyektni argument qilib oladi va qaytargan qiymati o\'sha maydonga tushadi.',
  },
  {
    lessonKey: 'backend-dars-71',
    order: 3,
    prompt: 'select_related() va prefetch_related() orasidagi farq nima?',
    choices: [
      'select_related M2M uchun, prefetch_related ForeignKey uchun',
      'Ikkalasi bir xil ishlaydi, faqat nomi Django versiyalariga qarab farq qiladi',
      'select_related natijani keshga yozadi, prefetch_related esa bazadan qayta o\'qiydi',
      'select_related — SQL JOIN bilan bitta so\'rov (FK va OneToOne uchun), prefetch_related — qo\'shimcha so\'rov bilan Python tomonda birlashtirish (M2M va teskari FK uchun)',
    ],
    correctIndex: 3,
    explanation:
      'select_related bitta JOIN qiladi, shuning uchun u faqat «bitta obyektga» olib boradigan bog\'lanishlarda — FK va OneToOne\'da ishlaydi. Ro\'yxat qaytaradigan M2M va teskari FK uchun JOIN yaramaydi, shu sababli prefetch_related alohida so\'rov yuborib, natijani xotirada bog\'laydi.',
  },
  {
    lessonKey: 'backend-dars-71',
    order: 4,
    prompt: 'Nested serializer odatda nima uchun read_only=True qilib qo\'yiladi?',
    choices: [
      'Nested serializer o\'zi create()/update() ni bilmaydi — read_only qilinmasa yozishda xato chiqadi',
      'Nested serializer read_only bo\'lmasa javobda umuman chiqmaydi',
      'read_only nested ma\'lumotni tezroq yuklaydi va N+1 muammosini hal qiladi',
      'Bu DRF talabi — barcha nested maydonlar majburan read_only bo\'lishi kerak',
    ],
    correctIndex: 0,
    explanation:
      'DRF ichma-ich yozishni (writable nested) avtomatik bajara olmaydi: create()/update() ni o\'zingiz yozmasangiz xato beradi. Amaliy yechim — o\'qish uchun nested read_only maydon, yozish uchun esa alohida id maydoni (masalan `kategoriya_id`).',
  },
  {
    lessonKey: 'backend-dars-71',
    order: 5,
    prompt:
      'IsOwnerOrReadOnly permission yozdingiz. GET /api/postlar/ (ro\'yxat) so\'rovida has_object_permission() chaqiriladimi?',
    choices: [
      'Ha — ro\'yxatdagi har bir obyekt uchun bittadan chaqiriladi',
      'Ha — lekin faqat birinchi obyekt uchun bir marta',
      'Yo\'q — u faqat aniq obyekt olinganda (detail so\'rovlarda) chaqiriladi, ro\'yxatni get_queryset() bilan filtrlash kerak',
      'Yo\'q — chunki GET umuman permission tekshiruvidan o\'tmaydi',
    ],
    correctIndex: 2,
    explanation:
      'List endpointida get_object() chaqirilmaydi, demak has_object_permission() ham ishlamaydi. Foydalanuvchi faqat o\'z yozuvlarini ko\'rishi kerak bo\'lsa, get_queryset() ni `filter(muallif=self.request.user)` bilan cheklang.',
  },

  // ──────────────────── Dars 72 — REST API loyiha (MINI-LOYIHA) ────────────────────
  {
    lessonKey: 'backend-dars-72',
    order: 1,
    prompt: 'Yangi REST API loyihasini loyihalashni nimadan boshlash to\'g\'ri?',
    choices: [
      'Darrov birinchi ViewSet\'ni yozishdan — modellar keyin o\'zi ma\'lum bo\'ladi',
      'Endpoint jadvalidan: qaysi URL, qaysi metod, nima qaytaradi — keyin modellarni yozishdan',
      'Deploy va baza sozlamalarini tayyorlashdan',
      'Frontend dizaynini chizishdan — API o\'shanga moslanadi',
    ],
    correctIndex: 1,
    explanation:
      'Endpoint jadvali — bu API shartnomasi: u kerakli modellarni, maydonlarni va ruxsatlarni o\'zi ko\'rsatib beradi. Kodni jadvalsiz boshlasangiz, yarim yo\'lda modellarni qayta yozishga to\'g\'ri keladi.',
  },
  {
    lessonKey: 'backend-dars-72',
    order: 2,
    prompt: 'Model Meta klassidagi abstract = True nima qiladi?',
    choices: [
      'Modelni majburiy meros qilinadigan qiladi va barcha maydonlarni to\'ldirishni talab qiladi',
      'Jadval yaratiladi, lekin unga obyekt qo\'shib bo\'lmaydi',
      'Migratsiyalarni tezlashtiradi va jadvalni keshlaydi',
      'Bu model uchun bazada jadval yaratilmaydi — u faqat boshqa modellar meros oladigan asos bo\'lib qoladi',
    ],
    correctIndex: 3,
    explanation:
      'abstract = True modelni «shablon»ga aylantiradi: migratsiyada uning jadvali umuman paydo bo\'lmaydi, maydonlari esa undan meros olgan har bir modelning o\'z jadvaliga ko\'chiriladi. Shuning uchun yaratilgan_vaqt/yangilangan_vaqt kabi umumiy maydonlar bir marta yoziladi.',
  },
  {
    lessonKey: 'backend-dars-72',
    order: 3,
    prompt: 'Mahsulot narxini saqlash uchun qaysi model maydoni to\'g\'ri?',
    choices: [
      'FloatField — kasr son uchun eng tabiiy tanlov',
      'DecimalField(max_digits=..., decimal_places=2)',
      'IntegerField — narxni tiyinlarda saqlash Django uchun standart',
      'CharField — narx baribir matn ko\'rinishida chiqadi',
    ],
    correctIndex: 1,
    explanation:
      'FloatField ikkilik kasr bo\'lgani uchun pulda yaxlitlash xatolari to\'planadi (0.1 + 0.2 aynan 0.3 bo\'lmaydi). DecimalField qiymatni aniq o\'nlik ko\'rinishda saqlaydi, shuning uchun pul doim Decimal bilan ishlanadi.',
  },
  {
    lessonKey: 'backend-dars-72',
    order: 4,
    prompt: 'prefetch_related() qaysi holatda kerak bo\'ladi?',
    choices: [
      'Har qanday queryset\'da — u umumiy tezlashtirish vositasi',
      'Faqat bitta obyektni id bo\'yicha olayotganda',
      'Postlar ro\'yxatini olib, har bir postning teglarini (M2M) yoki izohlarini ko\'rsatayotganda',
      'Faqat ForeignKey orqali bog\'langan bitta obyektni olayotganda',
    ],
    correctIndex: 2,
    explanation:
      'prefetch_related ro\'yxat qaytaradigan bog\'lanishlar — M2M va teskari FK uchun mo\'ljallangan. Usiz har bir post uchun alohida so\'rov ketadi (N+1), prefetch bilan esa hammasi bitta qo\'shimcha so\'rovda olinadi.',
  },
  {
    lessonKey: 'backend-dars-72',
    order: 5,
    prompt:
      'Nested serializer read_only qilinmagan holda POST bilan yangi obyekt yuborsangiz odatda nima bo\'ladi?',
    choices: [
      'DRF ichma-ich obyektni ham avtomatik yaratib beradi',
      'So\'rov jimgina qabul qilinadi, lekin nested qism e\'tiborsiz qoldiriladi',
      'Nested maydon avtomatik id\'ga aylanadi',
      'DRF create() ni o\'zi bajara olmay xato beradi — writable nested uchun create()/update() ni qo\'lda yozish kerak',
    ],
    correctIndex: 3,
    explanation:
      'DRF ochiq aytadi: writable nested serializer uchun create()/update() ni o\'zingiz yozishingiz kerak. Shuning uchun amalda o\'qish uchun nested read_only maydon, yozish uchun esa alohida id maydoni ishlatiladi.',
  },

  // ─────────────────────────── Dars 73 — Test asoslari ───────────────────────────
  {
    lessonKey: 'backend-dars-73',
    order: 1,
    prompt: 'Avtomatik testlar birinchi navbatda nima uchun yoziladi?',
    choices: [
      'Kodni tezroq ishlashini ta\'minlash uchun',
      'Kodda xato bo\'lsa, testlar uni o\'zi topib tuzatib qo\'yadi',
      'Kodni o\'zgartirganda eski funksional buzilmaganini har safar qo\'lda emas, avtomatik tekshirish uchun',
      'Faqat o\'qituvchi yoki mijoz talab qilgani uchun — kodga ta\'siri yo\'q',
    ],
    correctIndex: 2,
    explanation:
      'Test — bu kodni tekshiruvchi kod: bir marta yoziladi, keyin har o\'zgarishdan so\'ng soniyalarda qayta ishlaydi. U xatoni tuzatmaydi, lekin regressiyani — «bir joyni tuzatdim, boshqasi buzildi» holatini darhol ko\'rsatadi.',
  },
  {
    lessonKey: 'backend-dars-73',
    order: 2,
    prompt:
      'Quyidagi kod ishga tushirilsa nima bo\'ladi?\n\ndef ikkilantir(x):\n    return x * 2\n\nprint("boshlandi")\nassert ikkilantir(3) == 7\nprint("tugadi")',
    choices: [
      'Ikkala print ham chiqadi, assert faqat ogohlantirish beradi',
      '"boshlandi" chiqadi, so\'ng AssertionError bilan dastur to\'xtaydi — "tugadi" chiqmaydi',
      'Hech narsa chiqmaydi, dastur birinchi satrdayoq to\'xtaydi',
      'assert qiymatni to\'g\'rilab, ikkilantir(3) ni 7 ga tenglashtiradi',
    ],
    correctIndex: 1,
    explanation:
      'assert shartni tekshiradi: rost bo\'lsa hech narsa qilmaydi, yolg\'on bo\'lsa AssertionError ko\'tarib dasturni to\'xtatadi. 3 * 2 = 6, 7 emas — shuning uchun "boshlandi" chiqib, keyingi satr umuman bajarilmaydi.',
  },
  {
    lessonKey: 'backend-dars-73',
    order: 3,
    prompt: 'Test tuzilishidagi AAA qisqartmasi nimani anglatadi?',
    choices: [
      'Assert → Act → Arrange — tekshiruv doim birinchi yoziladi',
      'Add → Analyze → Approve',
      'Arrange (tayyorla) → Act (tekshirilayotgan kodni bajar) → Assert (natijani tekshir)',
      'Automate → Assert → Archive',
    ],
    correctIndex: 2,
    explanation:
      'AAA testni uch aniq bosqichga bo\'ladi: avval kerakli ma\'lumot tayyorlanadi, keyin sinaladigan funksiya BIR marta chaqiriladi, oxirida natija tekshiriladi. Shu tartib testni o\'qishni ham, buzilganda sababini topishni ham osonlashtiradi.',
  },
  {
    lessonKey: 'backend-dars-73',
    order: 4,
    prompt:
      'Modelga Meta ichida abstract = True qo\'yib migratsiya qilsangiz, bazada nima paydo bo\'ladi?',
    choices: [
      'Shu model uchun hech qanday jadval yaratilmaydi',
      'Bo\'sh jadval yaratiladi, lekin unga yozib bo\'lmaydi',
      'Faqat id ustuni bor jadval yaratiladi',
      'Jadval yaratiladi va undan meros olgan modellar bir xil jadvalni baham ko\'radi',
    ],
    correctIndex: 0,
    explanation:
      'Abstract model — bu faqat maydonlar to\'plami, jadval emas. Migratsiyada u umuman ko\'rinmaydi; maydonlari esa undan meros olgan har bir konkret modelning O\'Z jadvaliga alohida ustun bo\'lib tushadi.',
  },
  {
    lessonKey: 'backend-dars-73',
    order: 5,
    prompt:
      'SerializerMethodField uchun metod nomi noto\'g\'ri yozilsa (masalan, maydon `holati`, metod `holati()`), nima bo\'ladi?',
    choices: [
      'Maydon qiymati None bo\'lib chiqadi, xato bo\'lmaydi',
      'DRF metodni nomi bo\'yicha emas, tartibi bo\'yicha topadi — muammo yo\'q',
      'DRF get_holati() ni topa olmay xato beradi — metod get_<maydon nomi> deb nomlanishi kerak',
      'Maydon javobdan jimgina olib tashlanadi',
    ],
    correctIndex: 2,
    explanation:
      'SerializerMethodField har doim get_<maydon nomi> shaklidagi metodni qidiradi. Nomi mos kelmasa DRF metodni topa olmaydi va serializer xato beradi — bu boshlang\'ichlarda eng ko\'p uchraydigan xatolardan biri.',
  },

  // ────────────────────── Dars 74 — pytest / Django test ──────────────────────
  {
    lessonKey: 'backend-dars-74',
    order: 1,
    prompt: 'pytest\'dagi fixture nima?',
    choices: [
      'Test natijasini tekshiruvchi maxsus funksiya — assert\'ning kuchliroq varianti',
      'Haqiqiy bazada oldindan tayyorlab qo\'yilgan ma\'lumotlar to\'plami',
      'Butun loyiha uchun bir marta o\'qiladigan sozlama fayli',
      'Testga tayyorgarlik qaytaruvchi funksiya — testga argument sifatida uzatiladi va qayta ishlatiladi',
    ],
    correctIndex: 3,
    explanation:
      '@pytest.fixture bilan belgilangan funksiya kerakli obyektni (foydalanuvchi, client, test ma\'lumoti) tayyorlab qaytaradi. Test funksiyasi uning nomini argument qilib yozsa, pytest fixture\'ni o\'zi chaqirib, natijani uzatadi — bir tayyorgarlik ko\'p testda ishlatiladi.',
  },
  {
    lessonKey: 'backend-dars-74',
    order: 2,
    prompt: '@pytest.mark.django_db dekoratori testga nima beradi?',
    choices: [
      'Testga vaqtinchalik test bazasi bilan ishlash ruxsatini — o\'zgarishlar test oxirida bekor qilinadi',
      'Testni loyihaning haqiqiy bazasiga ulaydi',
      'Migratsiyalarni avtomatik yaratadi',
      'Baza so\'rovlarini keshlab, testni tezlashtiradi',
    ],
    correctIndex: 0,
    explanation:
      'pytest-django sukut bo\'yicha bazaga tegishni taqiqlaydi. Bu dekorator testni alohida yaratilgan test bazasiga ulaydi va har test tranzaksiyada bajarilib, oxirida qaytariladi — shuning uchun testlar bir-biriga va haqiqiy ma\'lumotga ta\'sir qilmaydi.',
  },
  {
    lessonKey: 'backend-dars-74',
    order: 3,
    prompt: 'DRF\'ning APIClient klassi nima uchun kerak?',
    choices: [
      'Brauzerni avtomatlashtirib, sahifalarni bosib chiqish uchun',
      'Frontend uchun API bilan ishlaydigan JS kodini generatsiya qilish uchun',
      'requests kutubxonasi orqali ishlab turgan serverga haqiqiy so\'rov yuborish uchun',
      'Serverni ishga tushirmasdan turib, kod ichidan endpointga HTTP so\'rov yuborib, javobni tekshirish uchun',
    ],
    correctIndex: 3,
    explanation:
      'APIClient so\'rovni Django\'ning ichki qatlamlari orqali o\'tkazadi — runserver ham, tarmoq ham kerak emas. Shuning uchun `client.post(\'/api/postlar/\', data)` deb yozib, response.status_code va response.data ni bevosita tekshirish mumkin.',
  },
  {
    lessonKey: 'backend-dars-74',
    order: 4,
    prompt: 'AAA tuzilishiga ko\'ra, testning Act bosqichida nima qilinadi?',
    choices: [
      'Sinalayotgan funksiya yoki endpoint aynan bir marta chaqiriladi',
      'Kerakli ma\'lumotlar va obyektlar tayyorlanadi',
      'Natija kutilgan qiymat bilan assert orqali solishtiriladi',
      'Test tugagach yaratilgan ma\'lumotlar bazadan tozalanadi',
    ],
    correctIndex: 0,
    explanation:
      'Act — testning markazi: tekshirilayotgan xatti-harakat bajariladi, xolos. Tayyorgarlik Arrange\'da, tekshiruv esa Assert\'da qoladi; bir testda ikkita Act bo\'lsa, yiqilganda qaysi biri aybdor ekani noaniq bo\'lib qoladi.',
  },
  {
    lessonKey: 'backend-dars-74',
    order: 5,
    prompt:
      'Test ichida `assert javob.status_code == 201, "post yaratilmadi"` deb yozildi, lekin status 400 keldi. Nima bo\'ladi?',
    choices: [
      'Test o\'tadi, konsolga faqat ogohlantirish chiqadi',
      'Test AssertionError bilan yiqiladi va xabar sifatida "post yaratilmadi" ko\'rsatiladi',
      'assert 400 ni 201 ga aylantirib, testni to\'g\'rilaydi',
      'Vergul sintaksis xatosi beradi — assert\'ga ikkinchi argument berib bo\'lmaydi',
    ],
    correctIndex: 1,
    explanation:
      'assert\'ning ikkinchi argumenti — shart bajarilmaganda AssertionError bilan chiqadigan xabar. U testni yiqilganda «nima kutilgan edi» degan savolga darhol javob beradi, shuning uchun mazmunli xabar yozish odat qilinadi.',
  },

  // ───────────────────────── Dars 75 — Debugging & TDD ─────────────────────────
  {
    lessonKey: 'backend-dars-75',
    order: 1,
    prompt: 'Kod ichiga breakpoint() yozsangiz nima bo\'ladi?',
    choices: [
      'Dastur shu satrgacha ishlab, to\'xtaydi va interaktiv debugger ochiladi — o\'zgaruvchilarni ko\'rib, qadamma-qadam yurish mumkin',
      'Shu satrdan keyingi kod butunlay o\'chirib qo\'yiladi',
      'O\'sha joydagi barcha o\'zgaruvchilar konsolga print qilinadi va dastur davom etadi',
      'Xatolik joyi avtomatik topilib, tuzatib beriladi',
    ],
    correctIndex: 0,
    explanation:
      'breakpoint() dasturni aynan o\'sha nuqtada to\'xtatib, pdb debugger\'ini ochadi. U yerda p bilan qiymatni ko\'rish, n bilan keyingi satrga o\'tish, s bilan funksiya ichiga kirish va c bilan davom ettirish mumkin — print() dan ancha kuchli.',
  },
  {
    lessonKey: 'backend-dars-75',
    order: 2,
    prompt: 'TDD sikli qanday tartibda boradi?',
    choices: [
      'REFACTOR → RED → GREEN',
      'GREEN (kod yozish) → RED (testda xato topish) → REFACTOR',
      'RED (yiqiladigan test yozish) → GREEN (uni o\'tkazadigan eng sodda kod) → REFACTOR (kodni tozalash)',
      'RED → REFACTOR → GREEN',
    ],
    correctIndex: 2,
    explanation:
      'Avval ataylab yiqiladigan test yoziladi — bu testning haqiqatan biror narsani tekshirayotganini isbotlaydi. Keyin uni o\'tkazadigan eng sodda kod yoziladi, va faqat testlar yashil bo\'lgandan so\'ng kod xotirjam tozalanadi.',
  },
  {
    lessonKey: 'backend-dars-75',
    order: 3,
    prompt: 'Uzun traceback chiqqanda uni qayerdan o\'qish kerak?',
    choices: [
      'Boshidan — birinchi satrda asl sabab yoziladi',
      'Faqat fayl nomlari va satr raqamlariga qarash kifoya',
      'O\'rtasidan — kutubxona ichidagi satrlardan',
      'Oxiridan — eng pastdagi satrda xato turi va asl sababi yoziladi',
    ],
    correctIndex: 3,
    explanation:
      'Traceback yuqoridan pastga qarab chaqiruvlar zanjirini ko\'rsatadi, eng pastda esa haqiqiy xato turi va xabari turadi (masalan ZeroDivisionError: division by zero). Shuning uchun avval oxirgi satrni, keyin o\'z kodingizga tegishli eng pastki chaqiruvni o\'qing.',
  },
  {
    lessonKey: 'backend-dars-75',
    order: 4,
    prompt: 'Bir xil test foydalanuvchisi 6 ta testda kerak. Fixture bu yerda qanday yordam beradi?',
    choices: [
      'Fixture testlarni parallel ishga tushirib, vaqtni tejaydi',
      'Foydalanuvchini yaratish kodi bir marta fixture\'da yoziladi, testlar esa uni argument sifatida so\'raydi',
      'Fixture foydalanuvchini haqiqiy bazada doimiy saqlab qo\'yadi',
      'Fixture testlarni bir-biriga bog\'lab, avvalgi testdan qolgan obyektni keyingisiga uzatadi',
    ],
    correctIndex: 1,
    explanation:
      'Fixture — takrorlanadigan tayyorgarlikni bitta joyga chiqarish usuli; umumiylari conftest.py\'ga yoziladi. Har test uni chaqirganda toza nusxa oladi, shuning uchun testlar bir-biriga bog\'lanib qolmaydi.',
  },
  {
    lessonKey: 'backend-dars-75',
    order: 5,
    prompt:
      'Testda avval foydalanuvchi va post yaratildi, so\'ng client.delete(...) chaqirildi, oxirida status tekshirildi. Bu qismlar AAA bo\'yicha qanday nomlanadi?',
    choices: [
      'Assert → Arrange → Act',
      'Act → Arrange → Assert',
      'Arrange → Act → Assert',
      'Arrange → Assert → Act',
    ],
    correctIndex: 2,
    explanation:
      'Ma\'lumot tayyorlash — Arrange, sinalayotgan amalni bajarish (delete so\'rovi) — Act, natijani tekshirish — Assert. Testni shu tartibda yozish uni o\'qishni osonlashtiradi va yiqilganda sababni tez topishga yordam beradi.',
  },
];
