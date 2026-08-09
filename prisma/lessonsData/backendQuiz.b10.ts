import type { LessonQuizRecord } from './backendQuiz.m1a';

// Hand-authored MCQs derived from the lesson decks' TEKSHIRUV slides.
//
// Scope: backend lessons 76..82 (`backend-dars-76` .. `backend-dars-82`), 5 questions each = 35.
// Block covers Environment/.env, Redis & caching, Celery, Docker, Dockerfile, docker-compose and
// server/SSH basics. Every prompt is a light rewrite of the curriculum author's original open recap
// question so it has exactly one defensible answer.
//
// Distractors encode the misconceptions students in this block actually hold: Docker == virtual
// machine, image/container swapped, volume == extra RAM, `.delay()` == "wait N seconds",
// `.dockerignore` == `.gitignore`, broker == worker, `depends_on` == "waits until ready",
// services find each other on `localhost`, private key goes to the server, coverage == "% of tests
// that passed", CMD == RUN, and ".env is safe in a private repo".

export const backendQuizB10: LessonQuizRecord[] = [
  // ───────────────────────── Dars 76 — Environment & Settings ─────────────────────────
  {
    lessonKey: 'backend-dars-76',
    order: 1,
    prompt: 'Nima uchun SECRET_KEY kabi maxfiy kalitlar kod ichida emas, .env faylda saqlanadi?',
    choices: [
      'Chunki .env fayldan o\'qish settings.py dan o\'qishdan tezroq ishlaydi',
      'Chunki .env fayl qiymatlarni avtomatik shifrlab qo\'yadi',
      'Chunki kod Git\'ga tushadi — kalit kodda qolsa, repoga kirgan har kim uni ko\'radi',
      'Chunki .env\'ni .gitignore\'ga qo\'shish kodda qolgan kalitni Git tarixidan ham o\'chirib yuboradi',
    ],
    correctIndex: 2,
    explanation:
      'Kalit kodda qolsa, u Git tarixiga tushadi va repoga kirish huquqi bor har kim (kelajakda ham) uni o\'qiy oladi. .env hech narsani shifrlamaydi — u shunchaki Git\'dan tashqarida qoladigan fayl.',
  },
  {
    lessonKey: 'backend-dars-76',
    order: 2,
    prompt: '.env va .env.example fayllari orasidagi asosiy farq nima?',
    choices: [
      '.env\'da haqiqiy qiymatlar bo\'ladi va u Git\'ga kirmaydi; .env.example\'da faqat kalit nomlari bo\'lib, u Git\'ga kiradi',
      '.env.example Git\'ga kirmaydi, .env esa jamoa uchun Git\'ga qo\'shiladi',
      'Ikkalasi ham Git\'ga kiradi — .env.example shunchaki .env ning zaxira nusxasi',
      '.env lokal ishlash uchun, .env.example esa serverdagi haqiqiy kalitlar uchun',
    ],
    correctIndex: 0,
    explanation:
      '.env — sizning shaxsiy, haqiqiy qiymatlaringiz, u .gitignore\'da bo\'ladi. .env.example esa qaysi o\'zgaruvchilar kerakligini ko\'rsatuvchi bo\'sh namuna — yangi dasturchi shuni nusxalab o\'z .env\'ini to\'ldiradi.',
  },
  {
    lessonKey: 'backend-dars-76',
    order: 3,
    prompt: 'Ishlab chiqarish (prod) serverida DEBUG=True qoldirish nima uchun xavfli?',
    choices: [
      'Sayt sekinroq ishlaydi, boshqa hech qanday zarari yo\'q',
      'Xatolik yuz berganda Django begonaga to\'liq traceback, kod parchalari va sozlamalarni ko\'rsatib qo\'yadi',
      'Migratsiyalar har so\'rovda avtomatik bajarilib, bazani buzadi',
      'DEBUG=True bo\'lsa Django statik fayllarni umuman uzatmaydi',
    ],
    correctIndex: 1,
    explanation:
      'DEBUG=True dagi xatolik sahifasi hujumchi uchun tayyor xarita: u yerda fayl yo\'llari, kod satrlari va sozlamalar qiymatlari ko\'rinadi. Bu tezlik masalasi emas — bu xavfsizlik teshigi.',
  },
  {
    lessonKey: 'backend-dars-76',
    order: 4,
    prompt:
      'Dasturchi avval funksiyani yozdi, keyin unga test yozdi va test birinchi ishga tushishdayoq yashil bo\'ldi. TDD nuqtai nazaridan bu yerda qanday xavf bor?',
    choices: [
      'Xavf yo\'q — test yashil bo\'lgandan keyin tartibning ahamiyati qolmaydi',
      'Test sekin ishlaydi, chunki kod undan oldin yozilgan',
      'pytest koddan keyin yozilgan testlarni hisobga olmaydi',
      'Test hech qachon yiqilganini ko\'rmadik — u noto\'g\'ri narsani yoki umuman hech narsani tekshirayotgan bo\'lishi mumkin, buni endi bilib bo\'lmaydi',
    ],
    correctIndex: 3,
    explanation:
      'RED bosqichi testning O\'ZINI tekshiradigan yagona qadam: test avval yiqilib, kod qo\'shilgandan keyin yashil bo\'lsa, uni aynan shu kod yashil qilganiga ishonch hosil qilamiz. Hech qachon qizarmagan test yolg\'on xotirjamlik beradi — masalan assert satri unutilgan yoki noto\'g\'ri obyektni tekshirayotgan test ham yashil turaveradi. Siklning o\'zi 75-darsda: RED → GREEN → REFACTOR.',
  },
  {
    lessonKey: 'backend-dars-76',
    order: 5,
    prompt: 'pytest\'da fixture nima?',
    choices: [
      'Testlar uchun qayta ishlatiladigan tayyorgarlik — pytest uni testga argument sifatida uzatadi',
      'Testning oxirida yoziladigan assert satri',
      'Test funksiyasi nomi oldiga qo\'yiladigan majburiy test_ prefiksi',
      'Haqiqiy bazada doimiy turadigan namuna yozuv',
    ],
    correctIndex: 0,
    explanation:
      'Fixture — «Arrange» bosqichini bir marta yozib, ko\'p testda ishlatish usuli. Test funksiyasi fixture nomini argument qilib olsa, pytest uni o\'zi tayyorlab beradi; umumiylari conftest.py\'da turadi.',
  },

  // ───────────────────────────── Dars 77 — Redis & Caching ─────────────────────────────
  {
    lessonKey: 'backend-dars-77',
    order: 1,
    prompt: 'Cache (kesh) nima uchun kerak?',
    choices: [
      'Ma\'lumotni bazadan Redis\'ga butunlay ko\'chirib, bazadan voz kechish uchun',
      'Bir marta hisoblangan qimmat natijani saqlab, keyingi so\'rovlarda bazaga bormasdan tez qaytarish uchun',
      'Foydalanuvchi ma\'lumotlarini doimiy saqlash uchun — baza o\'rniga',
      'Python kodini oldindan kompilyatsiya qilib, ishga tushishni tezlashtirish uchun',
    ],
    correctIndex: 1,
    explanation:
      'Kesh — bazaning o\'rnini bosuvchi omborxona emas, balki tezkor nusxa. Haqiqat manbai baribir bazada qoladi; kesh yo\'qolsa ilova sekinlashadi, lekin ma\'lumot yo\'qolmaydi.',
  },
  {
    lessonKey: 'backend-dars-77',
    order: 2,
    prompt: 'Cache yozuvidagi TTL nimani bildiradi?',
    choices: [
      'Cache\'ga sig\'adigan yozuvlarning maksimal soni',
      'Redis serverga ulanish uchun kutish limiti (timeout)',
      'So\'rovning bajarilishiga ketgan vaqt',
      'Yozuvning yashash muddati — shu vaqt o\'tgach yozuv cache\'dan o\'zi o\'chadi',
    ],
    correctIndex: 3,
    explanation:
      'TTL (time to live) — yozuv necha soniya cache\'da turishi. Har bir yozuvga TTL qo\'yish shart: aks holda eskirgan ma\'lumot cache\'da cheksiz qolib ketadi.',
  },
  {
    lessonKey: 'backend-dars-77',
    order: 3,
    prompt: 'Cache invalidation nima uchun qiyin hisoblanadi?',
    choices: [
      'Redis cache.delete() metodini qo\'llab-quvvatlamaydi, faqat butun bazani tozalash mumkin',
      'Cache\'ni tozalash uchun Redis serverni qayta ishga tushirish kerak',
      'Ma\'lumot bazada o\'zgarganda cache\'dagi eski nusxa o\'zi yangilanmaydi — uni qaerda va qachon o\'chirishni dasturchi o\'zi topishi kerak',
      'TTL qo\'yilgan bo\'lsa invalidation umuman kerak bo\'lmaydi',
    ],
    correctIndex: 2,
    explanation:
      'Baza va cache bir-biridan xabarsiz: yozuv o\'zgargan zahoti cache eskiradi va foydalanuvchi noto\'g\'ri javob oladi. TTL faqat kechikish bilan qutqaradi — darhol to\'g\'ri javob kerak bo\'lsa, o\'zgarish joyida cache.delete() qilish kerak.',
  },
  {
    lessonKey: 'backend-dars-77',
    order: 4,
    prompt: '.env fayl loyihada nima uchun kerak?',
    choices: [
      'Maxfiy va muhitga bog\'liq qiymatlarni koddan tashqarida, Git\'ga tushmaydigan faylda saqlash uchun',
      'Virtual muhit yaratish uchun — venv o\'rniga',
      'Loyihaning Python paketlari ro\'yxatini saqlash uchun — requirements.txt o\'rniga',
      'Sozlamalarni avtomatik shifrlab, serverga xavfsiz yuborish uchun',
    ],
    correctIndex: 0,
    explanation:
      '.env — bu muhit o\'zgaruvchilari fayli: SECRET_KEY, baza paroli, DEBUG kabi qiymatlar shu yerda turadi va kodga env() orqali keladi. U virtual muhitga ham, paketlar ro\'yxatiga ham aloqasi yo\'q.',
  },
  {
    lessonKey: 'backend-dars-77',
    order: 5,
    prompt: 'Test coverage ko\'rsatkichi nimani o\'lchaydi?',
    choices: [
      'Yozilgan testlarning necha foizi muvaffaqiyatli o\'tganini',
      'Testlar ishga tushganda kodning necha foiz satri bajarilganini',
      'Kodda nechta xato qolganini',
      'Kod sifatiga qo\'yilgan umumiy bahoni',
    ],
    correctIndex: 1,
    explanation:
      'Coverage — testlar kodning qaysi satrlariga umuman tegmaganini ko\'rsatadi. 100% coverage «xato yo\'q» degani emas: satr bajarilgani bilan uning natijasi tekshirilmagan bo\'lishi mumkin.',
  },

  // ───────────────────────────────── Dars 78 — Celery ─────────────────────────────────
  {
    lessonKey: 'backend-dars-78',
    order: 1,
    prompt: 'Uzoq davom etadigan ishni fon vazifasiga (background task) chiqarishdan maqsad nima?',
    choices: [
      'Vazifaning o\'zi tezroq bajariladi',
      'Bazaga yozish tezlashadi',
      'Serverga kelayotgan so\'rovlar soni avtomatik ko\'payadi',
      'Foydalanuvchi natijani kutib o\'tirmaydi — so\'rovga darhol javob qaytariladi, ish esa keyin bajariladi',
    ],
    correctIndex: 3,
    explanation:
      'Fon vazifasi ishni tezlashtirmaydi — u baribir 3 soniya ketadi. Farqi shundaki, bu 3 soniya so\'rov ichida emas, worker\'da o\'tadi va foydalanuvchi darhol javob oladi.',
  },
  {
    lessonKey: 'backend-dars-78',
    order: 2,
    prompt: 'Celery\'dagi broker nima vazifani bajaradi?',
    choices: [
      'Navbatdagi vazifalarni haqiqatda bajaradigan jarayon',
      'Vazifalar navbatini saqlaydigan oraliq xizmat (odatda Redis) — ilova unga qo\'yadi, worker undan oladi',
      'Celery sozlamalari yoziladigan Django fayli',
      'Natijani foydalanuvchiga yuboradigan email server',
    ],
    correctIndex: 1,
    explanation:
      'Broker — vazifalar turadigan «pochta qutisi». Vazifani bajaradigan jarayon esa worker: ular ikki xil narsa va odatda alohida ishga tushiriladi.',
  },
  {
    lessonKey: 'backend-dars-78',
    order: 3,
    prompt: 'Nima uchun Celery vazifasiga model obyektining o\'zi emas, uning ID\'si uzatiladi?',
    choices: [
      'Vazifa argumentlari navbatga serializatsiya qilinadi va worker uni keyinroq bajaradi — ID bo\'lsa worker bazadan eng yangi holatni o\'qiydi',
      'ID kamroq joy egallaydi, boshqa hech qanday farqi yo\'q',
      'Celery argument sifatida faqat butun sonlarni qabul qiladi',
      'Obyekt uzatilsa bazadagi yozuv o\'chib ketadi',
    ],
    correctIndex: 0,
    explanation:
      'Vazifa navbatda kutib turadi — worker uni bir necha soniya keyin ochadi. ID uzatilsa worker o\'sha paytdagi haqiqiy yozuvni oladi; obyekt uzatilsa esa u eskirgan «foto» bo\'lib qoladi.',
  },
  {
    lessonKey: 'backend-dars-78',
    order: 4,
    prompt: 'Cache yozuviga qo\'yiladigan TTL nimani belgilaydi?',
    choices: [
      'Redis xotirasining maksimal hajmini',
      'Cache\'dan o\'qish tezligini',
      'Yozuv cache\'da necha soniya saqlanishini — muddat tugagach u o\'chadi',
      'Bir kalitga yozish mumkin bo\'lgan maksimal marta sonini',
    ],
    correctIndex: 2,
    explanation:
      'TTL — yozuvning muddati. U tugagach Redis yozuvni o\'zi olib tashlaydi va keyingi cache.get() None qaytaradi, ya\'ni ma\'lumot yana bazadan qayta olinadi.',
  },
  {
    lessonKey: 'backend-dars-78',
    order: 5,
    prompt: '.env fayli Git repozitoriyasiga qo\'shiladimi?',
    choices: [
      'Ha — aks holda boshqa dasturchilar loyihani umuman ishga tushira olmaydi',
      'Ha, agar repozitoriya private bo\'lsa — unda xavfsiz',
      'Yo\'q — Git nuqta bilan boshlanadigan fayllarni saqlay olmaydi',
      'Yo\'q — .env .gitignore\'ga qo\'shiladi, Git\'ga faqat .env.example tushadi',
    ],
    correctIndex: 3,
    explanation:
      '.env hech qachon Git\'ga qo\'shilmaydi: private repo ham xodimlar, integratsiyalar va kelajakdagi ochilish orqali sizib chiqishi mumkin. Boshqa dasturchilar uchun .env.example yetarli.',
  },

  // ───────────────────────────── Dars 79 — Docker asoslari ─────────────────────────────
  {
    lessonKey: 'backend-dars-79',
    order: 1,
    prompt: 'Docker asosan qaysi muammoni hal qiladi?',
    choices: [
      'Ilovani barcha bog\'liqliklari va muhiti bilan qadoqlaydi — u har qanday mashinada bir xil ishlaydi',
      'Kodni avtomatik optimallashtirib, tezroq ishlashini ta\'minlaydi',
      'Kodni xatolardan tozalab, testlarni o\'zi yozib beradi',
      'Har bir ilova uchun to\'liq operatsion tizimli virtual mashina yaratadi',
    ],
    correctIndex: 0,
    explanation:
      'Docker «menda ishlayapti» muammosini yechadi: Python versiyasi, kutubxonalar va sozlamalar image ichida qotirilgan. U virtual mashina emas — konteynerlar host yadrosini ulashadi, shuning uchun ancha yengil.',
  },
  {
    lessonKey: 'backend-dars-79',
    order: 2,
    prompt: 'Image va container orasidagi farq nima?',
    choices: [
      'Container — o\'zgarmas shablon, image esa undan ishga tushirilgan nusxa',
      'Bitta image\'dan faqat bitta container yaratish mumkin',
      'Image — o\'zgarmas shablon, container — o\'sha image\'dan ishga tushirilgan tirik nusxa',
      'Image Linux uchun, container esa Windows uchun mo\'ljallangan',
    ],
    correctIndex: 2,
    explanation:
      'Image — retsept bo\'yicha bir marta qurilgan va o\'zgarmaydigan shablon. Container — undan yaratilgan ishlayotgan nusxa; bitta image\'dan istagancha container ko\'tarish mumkin.',
  },
  {
    lessonKey: 'backend-dars-79',
    order: 3,
    prompt: 'Baza konteyneriga volume nima uchun ulanadi?',
    choices: [
      'Konteynerga qo\'shimcha operativ xotira (RAM) berish uchun',
      'Konteynerlar orasidagi tarmoqni sozlash uchun',
      'Image hajmini kichraytirish uchun',
      'Ma\'lumot konteyner tashqarisida saqlanishi va konteyner o\'chirilganda yo\'qolmasligi uchun',
    ],
    correctIndex: 3,
    explanation:
      'Konteyner ichidagi fayllar konteyner bilan birga o\'chadi. Volume — host\'da yashaydigan doimiy saqlash joyi, shuning uchun baza uchun u majburiy.',
  },
  {
    lessonKey: 'backend-dars-79',
    order: 4,
    prompt: 'Celery broker deganda nima tushuniladi?',
    choices: [
      'Navbatdan vazifa olib, uni bajaradigan worker jarayoni',
      'Vazifalar navbati saqlanadigan xizmat — odatda Redis',
      'Celery natijalarini ko\'rsatuvchi veb-panel',
      'Funksiyani vazifaga aylantiruvchi @shared_task dekoratori',
    ],
    correctIndex: 1,
    explanation:
      'Broker — vazifalar saqlanadigan navbat (Redis). Worker undan vazifa olib bajaradi, @shared_task esa funksiyani vazifa sifatida e\'lon qiladi — uchtasi turli rol.',
  },
  {
    lessonKey: 'backend-dars-79',
    order: 5,
    prompt: 'Cache invalidation nima demak?',
    choices: [
      'Redis serverni to\'xtatib, butun cache\'ni tozalash',
      'Cache\'ga yangi kalit qo\'shish',
      'Ma\'lumot o\'zgarganda cache\'dagi eskirgan nusxani o\'chirish yoki yangilash',
      'TTL ni cheksizga o\'rnatib, yozuv o\'chmasligini ta\'minlash',
    ],
    correctIndex: 2,
    explanation:
      'Invalidation — «bu yozuv endi yaroqsiz» deb belgilash. Ma\'lumot yangilanganda cache.delete() chaqirilmasa, foydalanuvchi eski javobni ko\'raveradi.',
  },

  // ──────────────────────────────── Dars 80 — Dockerfile ────────────────────────────────
  {
    lessonKey: 'backend-dars-80',
    order: 1,
    prompt: 'Dockerfile nima?',
    choices: [
      'Ishga tushgan konteynerning loglari yoziladigan fayl',
      'Image qurish bosqichlari ketma-ket yozilgan matnli retsept',
      'Bir nechta xizmat ta\'riflangan yaml fayl',
      'Konteyner ma\'lumotlari saqlanadigan volume papkasi',
    ],
    correctIndex: 1,
    explanation:
      'Dockerfile — bitta image qanday qurilishini tavsiflaydi: FROM, COPY, RUN, CMD. Bir nechta xizmatni birga ishga tushirish esa docker-compose.yml ning vazifasi.',
  },
  {
    lessonKey: 'backend-dars-80',
    order: 2,
    prompt: 'Nima uchun Dockerfile\'da requirements.txt loyiha kodidan OLDIN nusxalanadi?',
    choices: [
      'Kod o\'zgarganda paketlar qatlami cache\'dan olinadi va pip install qaytadan ishlamaydi — qurish ancha tez bo\'ladi',
      'Aks holda pip paketlarni topa olmay xatolik beradi',
      'Chunki COPY buyrug\'ini Dockerfile\'da faqat bir marta ishlatish mumkin',
      'Bu tayyor image hajmini sezilarli kichraytiradi',
    ],
    correctIndex: 0,
    explanation:
      'Har bir Dockerfile satri alohida qatlam va Docker o\'zgarmagan qatlamlarni cache\'dan oladi. Kod har kuni o\'zgaradi, requirements esa kamdan-kam — shuning uchun uni oldin qo\'yish qurishni bir necha o\'n barobar tezlashtiradi.',
  },
  {
    lessonKey: 'backend-dars-80',
    order: 3,
    prompt: '.dockerignore fayli nima qiladi?',
    choices: [
      'Konteyner ishlayotganda ko\'rsatilgan fayllarni o\'qishni taqiqlaydi',
      'Git\'ga qaysi fayllar tushmasligini belgilaydi',
      'Sanab o\'tilgan fayllarni (.venv, .git kabi) image\'ga nusxalanishidan chiqarib tashlaydi',
      'Dockerfile\'dagi keraksiz buyruqlarni o\'tkazib yuboradi',
    ],
    correctIndex: 2,
    explanation:
      '.dockerignore qurish kontekstidan fayllarni olib tashlaydi: image yengilroq bo\'ladi va qurish tezlashadi. Git bilan ishlaydigan fayl — bu .gitignore, ular alohida ro\'yxatlar.',
  },
  {
    lessonKey: 'backend-dars-80',
    order: 4,
    prompt: 'Docker\'da volume nima uchun ishlatiladi?',
    choices: [
      'Bazani image ichiga qo\'shib, uni birga tarqatish uchun',
      'Konteynerga tashqi tarmoq portini ochish uchun',
      'Konteyner ichidagi fayllarni faqat o\'qish rejimiga o\'tkazish uchun',
      'Konteyner o\'chirilsa ham ma\'lumot saqlanib qolishi uchun — u konteyner tashqarisida yashaydi',
    ],
    correctIndex: 3,
    explanation:
      'Volume — konteyner hayotidan uzoqroq yashaydigan saqlash joyi. Portni ochish -p bayrog\'i orqali bo\'ladi, ma\'lumotni esa hech qachon image ichiga qotirmaydilar.',
  },
  {
    lessonKey: 'backend-dars-80',
    order: 5,
    prompt: 'Celery vazifasida .delay() nima qiladi?',
    choices: [
      'Vazifani darhol bajarmasdan brokerdagi navbatga qo\'yadi — uni keyin worker bajaradi',
      'Ko\'rsatilgan soniya kutib turadi va so\'ng vazifani shu yerda bajaradi',
      'Vazifani navbatdan bekor qiladi',
      'Vazifa tugashini kutib, natijasini qaytaradi',
    ],
    correctIndex: 0,
    explanation:
      'Nomiga qaramay .delay() hech narsani kutmaydi: u vazifani navbatga tashlab, darhol qaytadi. Shuning uchun so\'rov sekinlashmaydi va natija o\'sha zahoti mavjud bo\'lmaydi.',
  },

  // ─────────────────────────────── Dars 81 — docker-compose ───────────────────────────────
  {
    lessonKey: 'backend-dars-81',
    order: 1,
    prompt: 'docker-compose nima uchun kerak?',
    choices: [
      'Dockerfile o\'rnini bosadi — u bilan image qurish umuman kerak emas',
      'Bir nechta image\'ni bitta katta image\'ga birlashtirish uchun',
      'Konteynerlarni bulutli serverga avtomatik joylashtirish uchun',
      'Bir nechta xizmatni (ilova, baza, Redis) bitta faylda ta\'riflab, bitta buyruq bilan birga ishga tushirish uchun',
    ],
    correctIndex: 3,
    explanation:
      'compose — ko\'p konteynerli tizimni tavsiflash usuli: docker compose up butun tizimni ko\'taradi. U Dockerfile o\'rnini bosmaydi — aksincha, o\'z xizmatingiz uchun Dockerfile\'ga murojaat qiladi.',
  },
  {
    lessonKey: 'backend-dars-81',
    order: 2,
    prompt: 'compose ichidagi xizmatlar bir-biriga qanday murojaat qiladi?',
    choices: [
      'localhost orqali — hammasi bitta mashinada turadi',
      'Har safar o\'zgarib turadigan konteyner IP manzili orqali',
      'compose faylda yozilgan xizmat NOMI orqali — masalan DB_HOST=db',
      'Umumiy volume ichiga fayl yozib, shu orqali xabar almashib',
    ],
    correctIndex: 2,
    explanation:
      'compose xizmatlar uchun umumiy tarmoq yaratadi va har bir xizmat nomini DNS nomiga aylantiradi. Ilova konteyneri ichida localhost — o\'sha konteynerning o\'zi, baza emas.',
  },
  {
    lessonKey: 'backend-dars-81',
    order: 3,
    prompt: 'depends_on baza to\'liq tayyor bo\'lishini kafolatlaydimi?',
    choices: [
      'Ha — ilova baza so\'rovlarni qabul qila boshlagunicha kutadi',
      'Yo\'q — u faqat ishga tushirish TARTIBINI beradi; haqiqiy tayyorlik uchun healthcheck kerak',
      'Ha, lekin faqat PostgreSQL xizmatlari uchun',
      'Yo\'q — u ishga tushirish tartibiga ham ta\'sir qilmaydi',
    ],
    correctIndex: 1,
    explanation:
      'depends_on faqat «avval shu konteyner ishga tushsin» deydi — konteyner ko\'tarilgani bilan Postgres ichida hali initsializatsiya ketayotgan bo\'lishi mumkin. Shuning uchun healthcheck (yoki condition: service_healthy) qo\'shiladi.',
  },
  {
    lessonKey: 'backend-dars-81',
    order: 4,
    prompt: 'Dockerfile\'da requirements.txt kodidan oldin nusxalanishining sababi nima?',
    choices: [
      'Docker qatlam cache\'idan foydalanadi — kod o\'zgarganda pip install qayta bajarilmaydi',
      'Chunki COPY katta papkalarni faqat oxirida qabul qiladi',
      'Chunki pip faqat bo\'sh papkada ishlay oladi',
      'Bu konteynerning ishga tushish (start) tezligini oshiradi',
    ],
    correctIndex: 0,
    explanation:
      'Bu qurish (build) vaqtiga tegishli optimizatsiya, ishga tushish tezligiga emas. Kod qatlami o\'zgarsa ham undan yuqoridagi paketlar qatlami cache\'da qolaveradi.',
  },
  {
    lessonKey: 'backend-dars-81',
    order: 5,
    prompt: 'compose faylda baza xizmatiga volume ulanmasa, konteyner o\'chirilganda nima bo\'ladi?',
    choices: [
      'Baza umuman ishga tushmaydi',
      'Ma\'lumot saqlanadi, faqat baza sekinroq ishlaydi',
      'Bazadagi barcha ma\'lumot konteyner bilan birga yo\'qoladi',
      'Ma\'lumot avtomatik ravishda image ichiga yozib qo\'yiladi',
    ],
    correctIndex: 2,
    explanation:
      'Volume\'siz baza fayllari konteynerning o\'zgaruvchan qatlamida turadi va konteyner o\'chirilishi bilan yo\'q bo\'ladi. Image esa qurishdan keyin o\'zgarmaydi — unga hech narsa yozilmaydi.',
  },

  // ─────────────────────────────── Dars 82 — Server asoslari ───────────────────────────────
  {
    lessonKey: 'backend-dars-82',
    order: 1,
    prompt: 'SSH nima uchun kerak?',
    choices: [
      'Uzoqdagi serverga shifrlangan aloqa orqali ulanib, uning terminalida buyruq bajarish uchun',
      'Serverdagi saytni internetga ochib berish uchun',
      'Fayllarni brauzer orqali serverga yuklash uchun',
      'Serverdagi bazani avtomatik zaxiralash uchun',
    ],
    correctIndex: 0,
    explanation:
      'SSH — serverga masofadan xavfsiz kirish kanali: siz o\'z terminalingizda yozasiz, buyruq esa serverda bajariladi. Saytni tashqariga ochish — Nginx kabi veb-serverning vazifasi.',
  },
  {
    lessonKey: 'backend-dars-82',
    order: 2,
    prompt: 'SSH kalit juftligidan qaysi biri serverga ko\'chiriladi?',
    choices: [
      'Maxfiy (private) kalit — server uni tekshirishi kerak',
      'Ikkala kalit ham ko\'chiriladi',
      'Hech biri — har ulanishda yangi kalit generatsiya qilinadi',
      'Ochiq (public) kalit; maxfiy kalit esa faqat sizning kompyuteringizda qoladi',
    ],
    correctIndex: 3,
    explanation:
      'Serverga ochiq kalit qo\'yiladi (~/.ssh/authorized_keys) — u bilan faqat tekshirish mumkin, kirish mumkin emas. Maxfiy kalit hech qachon, hech qayerga uzatilmaydi.',
  },
  {
    lessonKey: 'backend-dars-82',
    order: 3,
    prompt: 'Linux serverida systemctl buyrug\'i nima qiladi?',
    choices: [
      'Tizimga yangi paketlar o\'rnatadi',
      'Xizmatlarni (service) ishga tushiradi, to\'xtatadi, holatini ko\'rsatadi va avtoyuklashga qo\'yadi',
      'Fayl va papkalarning kirish huquqlarini o\'zgartiradi',
      'Serverni qayta ishga tushirishning yagona usuli',
    ],
    correctIndex: 1,
    explanation:
      'systemctl — systemd xizmatlarini boshqarish vositasi: start, stop, restart, status, enable. Paket o\'rnatish apt\'ning, huquqlar esa chmod\'ning vazifasi.',
  },
  {
    lessonKey: 'backend-dars-82',
    order: 4,
    prompt: 'docker compose up buyrug\'i nima qiladi?',
    choices: [
      'Faqat image quradi, lekin hech qanday konteyner ishga tushirmaydi',
      'Ishlab turgan konteynerlarni to\'xtatib, ularni o\'chiradi',
      'compose faylda ta\'riflangan barcha xizmatlarni (kerak bo\'lsa image qurib) ishga tushiradi',
      'Mahalliy image\'ni Docker Hub\'ga yuklaydi',
    ],
    correctIndex: 2,
    explanation:
      'up — tizimni ko\'tarish buyrug\'i: tarmoq va volume\'lar yaratiladi, kerakli image\'lar qurilib yoki yuklab olinib, barcha konteynerlar birga ishga tushadi. To\'xtatish uchun docker compose down ishlatiladi.',
  },
  {
    lessonKey: 'backend-dars-82',
    order: 5,
    prompt: 'Dockerfile\'dagi CMD buyrug\'i nimani belgilaydi?',
    choices: [
      'Image qurish paytida bajariladigan buyruqni — RUN bilan bir xil ishlaydi',
      'Yaratiladigan konteynerning nomini',
      'Konteyner ichidagi ishchi papkani',
      'Konteyner ishga tushganda bajariladigan standart buyruqni',
    ],
    correctIndex: 3,
    explanation:
      'RUN qurish vaqtida ishlaydi va natijasi image qatlamiga yoziladi; CMD esa qurishda bajarilmaydi — u konteyner start bo\'lganda ishga tushadigan asosiy jarayonni ko\'rsatadi. Ishchi papkani WORKDIR belgilaydi.',
  },
];
