import type { LessonQuizRecord } from './backendQuiz.m1a';
// Hand-authored MCQs derived from the lesson decks' TEKSHIRUV slides.
//
// Scope: backend lessons 55..61 (`backend-dars-55` .. `backend-dars-61`), 5 questions each = 35.
// Mavzular: Django modellari, ORM, admin panel, template, forma va DRF serializer'ining birinchi qadami.
// Har bir prompt — kurs muallifining ochiq savoli, faqat bitta himoyalanadigan javob qoladigan
// qilib yengil qayta yozilgan. Chalg'ituvchilar — shu mavzudagi haqiqiy boshlang'ich xatolar:
// makemigrations/migrate ni almashtirish, filter va get ni chalkashtirish, {% extends %} ni
// {% include %} deb o'ylash, save() siz ham baza yangilanadi deb hisoblash, CSRF ni XSS bilan
// aralashtirish.

export const backendQuizB07: LessonQuizRecord[] = [
  // ───────────────────────────────── Dars 55 — Modellar ─────────────────────────────────
  {
    lessonKey: 'backend-dars-55',
    order: 1,
    prompt: 'Django\'da model nima?',
    choices: [
      'Ma\'lumotni chiroyli ko\'rsatuvchi HTML shablon',
      'So\'rovni qabul qilib javob qaytaradigan funksiya',
      'Python class — Django undan ma\'lumotlar bazasida jadval yasaydi',
      'Bazada allaqachon mavjud jadvalning faqat o\'qish uchun nusxasi',
    ],
    correctIndex: 2,
    explanation:
      'Model — oddiy Python class: har bir maydon jadvalning ustuniga aylanadi. Siz SQL yozmaysiz, Django class\'dan jadvalni o\'zi yasaydi.',
  },
  {
    lessonKey: 'backend-dars-55',
    order: 2,
    prompt: 'makemigrations va migrate o\'rtasidagi asosiy farq nima?',
    choices: [
      'makemigrations bazani darhol o\'zgartiradi, migrate esa faqat fayl yozib qo\'yadi',
      'makemigrations o\'zgarish rejasini faylga yozadi, migrate esa o\'sha rejani bazada bajaradi',
      'Ikkalasi ham bir xil ishni qiladi, shunchaki nomi boshqacha',
      'makemigrations modelni yozadi, migrate esa serverni ishga tushiradi',
    ],
    correctIndex: 1,
    explanation:
      'makemigrations bazaga umuman tegmaydi — u faqat migratsiya faylini (rejani) yaratadi. Bazani haqiqatda o\'zgartiradigan buyruq — migrate.',
  },
  {
    lessonKey: 'backend-dars-55',
    order: 3,
    prompt: 'Maydonda null=True va blank=True farqi nima?',
    choices: [
      'Ikkalasi ham bir xil — bazada NULL bo\'lishiga ruxsat beradi',
      'null=True formada bo\'sh qoldirishga, blank=True bazada NULL bo\'lishiga ruxsat beradi',
      'blank=True maydonni jadvaldan butunlay olib tashlaydi',
      'null=True bazada NULL bo\'lishiga, blank=True formada bo\'sh qoldirishga ruxsat beradi',
    ],
    correctIndex: 3,
    explanation:
      'null — bazaviy sozlama (ustunda NULL bo\'lishi mumkinmi), blank — validatsiya sozlamasi (formada bo\'sh qoldirsa bo\'ladimi). Ular turli qatlamlarga tegishli, shuning uchun ko\'pincha ikkalasi birga yoziladi.',
  },
  {
    lessonKey: 'backend-dars-55',
    order: 4,
    prompt: 'Django view funksiyasi natijada nima qaytarishi shart?',
    choices: [
      'HttpResponse (yoki undan meros olgan javob obyekti, masalan render() natijasi)',
      'Oddiy Python matn (str) qaytarsa ham Django uni javobga aylantiradi',
      'Model obyektining o\'zini — Django uni avtomatik HTML qiladi',
      'Hech narsa: view ichida print() qilsangiz brauzerda ko\'rinadi',
    ],
    correctIndex: 0,
    explanation:
      'View — request oladigan va HttpResponse qaytaradigan funksiya. str qaytarsangiz yoki hech narsa qaytarmasangiz Django xato beradi; print() esa brauzerga emas, terminalga yozadi.',
  },
  {
    lessonKey: 'backend-dars-55',
    order: 5,
    prompt: 'Loyihaning urls.py faylidagi include() nima qiladi?',
    choices: [
      'Bitta shablon ichiga boshqa HTML shablonning mazmunini qo\'shadi',
      'App\'ni INSTALLED_APPS ro\'yxatiga qo\'shib qo\'yadi',
      'Python modulini import qiladi, xuddi import kabi',
      'Boshqa fayldagi urlpatterns\'ni shu manzil ostiga ulaydi',
    ],
    correctIndex: 3,
    explanation:
      'include() marshrutlarni bo\'lib tashlaydi: loyiha urls.py app\'ning urls.py fayliga yo\'llanma beradi. Shablon ichiga shablon qo\'shadigan narsa — bu boshqa vosita, {% include %} tegi.',
  },

  // ─────────────────────────────────── Dars 56 — ORM ───────────────────────────────────
  {
    lessonKey: 'backend-dars-56',
    order: 1,
    prompt: 'filter() va get() o\'rtasidagi farq nima?',
    choices: [
      'filter() bitta obyekt, get() esa obyektlar ro\'yxatini qaytaradi',
      'filter() QuerySet qaytaradi (0, 1 yoki ko\'p obyekt), get() esa aynan bitta obyekt qaytaradi',
      'Ikkalasi ham ro\'yxat qaytaradi, get() shunchaki tezroq ishlaydi',
      'filter() hech narsa topmasa xato beradi, get() esa bo\'sh natija qaytaradi',
    ],
    correctIndex: 1,
    explanation:
      'filter() — to\'plam qaytaradi va hech narsa topmasa bo\'sh QuerySet beradi. get() — bitta obyekt qaytaradi va topmasa (yoki bir nechta topsa) xato ko\'taradi.',
  },
  {
    lessonKey: 'backend-dars-56',
    order: 2,
    prompt: 'Obyekt maydonini o\'zgartirgandan keyin save() nima uchun chaqiriladi?',
    choices: [
      'save() migratsiya faylini yaratadi',
      'save() natijani diskdagi matn fayliga yozib qo\'yadi',
      'O\'zgarish shu paytgacha faqat Python obyektida edi; save() uni bazaga yozadi',
      'save() faqat yangi obyekt yaratganda kerak, mavjudini o\'zgartirsa baza o\'zi yangilanadi',
    ],
    correctIndex: 2,
    explanation:
      'post.title = "..." faqat xotiradagi obyektni o\'zgartiradi. Baza esa save() chaqirilgandagina UPDATE so\'rovini oladi — save() unutilsa o\'zgarish yo\'qoladi.',
  },
  {
    lessonKey: 'backend-dars-56',
    order: 3,
    prompt: 'title__icontains="python" lookup\'i qanday yozuvlarni topadi?',
    choices: [
      'title qiymati aynan "python" ga teng bo\'lganlarini',
      'title ichida "python" bo\'lganlarini — katta-kichik harfga qaramasdan',
      'title ichida "python" bo\'lganlarini, lekin harf registri aniq mos kelsa',
      'title aynan "python" bilan boshlanadiganlarini',
    ],
    correctIndex: 1,
    explanation:
      'contains — «ichida bor», oldidagi i — «katta-kichik harf ahamiyatsiz». Shuning uchun "Python darslari" ham, "PYTHON" ham topiladi; aniq tenglik uchun __exact, boshlanishi uchun __startswith ishlatiladi.',
  },
  {
    lessonKey: 'backend-dars-56',
    order: 4,
    prompt: 'makemigrations buyrug\'i aslida nima qiladi?',
    choices: [
      'Bazadagi mavjud jadvallardan model class\'larini yozib beradi',
      'Barcha tayyor migratsiyalarni bazada bajaradi',
      'Modeldagi o\'zgarishlardan migratsiya faylini yaratadi, bazaga tegmaydi',
      'Jadvalni darhol bazada yaratib qo\'yadi',
    ],
    correctIndex: 2,
    explanation:
      'makemigrations — «rejani yoz» buyrug\'i: u migrations/ papkasida yangi fayl hosil qiladi. Baza o\'sha reja migrate bilan bajarilgandagina o\'zgaradi.',
  },
  {
    lessonKey: 'backend-dars-56',
    order: 5,
    prompt: 'ORM so\'rovi natijasini brauzerda ko\'rsatmoqchisiz. View oxirida nima qaytarasiz?',
    choices: [
      'QuerySet\'ning o\'zini return qilaman — Django uni HTML qilib beradi',
      'Natijani print() bilan chiqaraman, u brauzerda ko\'rinadi',
      'Natijani dict qilib return qilaman',
      'render() (yoki boshqa HttpResponse) — natijani unga context sifatida beraman',
    ],
    correctIndex: 3,
    explanation:
      'View faqat HttpResponse qaytara oladi. QuerySet yoki dict\'ni to\'g\'ridan-to\'g\'ri qaytarish xatoga olib keladi — uni render() ga context qilib uzatish kerak.',
  },

  // ───────────────────────────────── Dars 57 — Admin panel ─────────────────────────────────
  {
    lessonKey: 'backend-dars-57',
    order: 1,
    prompt: 'Django admin paneliga birinchi marta qanday kiriladi?',
    choices: [
      'createsuperuser bilan admin foydalanuvchi yaratib, /admin/ manzilidan kiriladi',
      'settings.py da ADMIN = True yozib, keyin serverni qayta ishga tushirib',
      'startapp admin buyrug\'i bilan admin app\'ini yaratib',
      'Ro\'yxatdan o\'tgan har qanday oddiy foydalanuvchi /admin/ ga kira oladi',
    ],
    correctIndex: 0,
    explanation:
      'Admin panel Django\'da tayyor turadi, faqat unga kiradigan odam kerak: python manage.py createsuperuser. Oddiy foydalanuvchi /admin/ ga kira olmaydi — is_staff huquqi bo\'lishi shart.',
  },
  {
    lessonKey: 'backend-dars-57',
    order: 2,
    prompt: 'Yaratgan modelingiz admin panelda ko\'rinishi uchun nima qilinadi?',
    choices: [
      'models.py da Meta ichiga admin = True yoziladi',
      'INSTALLED_APPS ro\'yxatiga model nomi qo\'shiladi',
      'makemigrations va migrate qilish yetarli — model o\'zi paydo bo\'ladi',
      'admin.py da admin.site.register(Model) yoziladi',
    ],
    correctIndex: 3,
    explanation:
      'Migratsiya faqat jadval yaratadi, panelga aloqasi yo\'q. Model admin.py da register qilinmaguncha panelda ko\'rinmaydi.',
  },
  {
    lessonKey: 'backend-dars-57',
    order: 3,
    prompt: 'ModelAdmin ichidagi list_display nimani belgilaydi?',
    choices: [
      'Ro\'yxat sahifasida qaysi maydonlar ustun bo\'lib ko\'rinishini',
      'Yuqoridagi qidiruv maydoni qaysi ustunlar bo\'yicha qidirishini',
      'O\'ng tomondagi filtr panelida qaysi maydonlar chiqishini',
      'Tahrirlash formasida qaysi maydonlarni to\'ldirish mumkinligini',
    ],
    correctIndex: 0,
    explanation:
      'list_display — ro\'yxat jadvalining ustunlari. Qidiruv uchun search_fields, yon filtr uchun list_filter, formadagi maydonlar uchun esa fields ishlatiladi.',
  },
  {
    lessonKey: 'backend-dars-57',
    order: 4,
    prompt: 'Post.objects.get(author="Ali") so\'roviga 2 ta yozuv mos kelsa nima bo\'ladi?',
    choices: [
      'Birinchi mos kelgan obyekt qaytariladi',
      'Ikkalasi ro\'yxat sifatida qaytariladi',
      'Xato ko\'tariladi — get() faqat bitta natijani qabul qiladi',
      'None qaytariladi',
    ],
    correctIndex: 2,
    explanation:
      'get() «aynan bitta» degani: nol natija ham, ikkita natija ham xato hisoblanadi. Bir nechta bo\'lishi mumkin bo\'lgan joyda filter() ishlatiladi.',
  },
  {
    lessonKey: 'backend-dars-57',
    order: 5,
    prompt: 'Modelga yangi maydon qo\'shdingiz. Panelda ishlashi uchun keyingi qadam qanday?',
    choices: [
      'Faqat serverni qayta ishga tushirish yetarli',
      'Faqat migrate qilish — makemigrations kerak emas',
      'admin.py da modelni qaytadan register qilish',
      'Avval makemigrations, keyin migrate qilish',
    ],
    correctIndex: 3,
    explanation:
      'Har qanday model o\'zgarishi ikki qadam talab qiladi: makemigrations rejani yozadi, migrate uni bazada bajaradi. Bazada ustun bo\'lmasa panel xato beradi.',
  },

  // ───────────────────────────────── Dars 58 — Templates ─────────────────────────────────
  {
    lessonKey: 'backend-dars-58',
    order: 1,
    prompt: 'render(request, "app/post.html", context) nima qiladi?',
    choices: [
      'Shablonni context bilan to\'ldirib, tayyor HTML\'ni HttpResponse ichida qaytaradi',
      'HTML faylni o\'zgarishsiz holda brauzerga nusxalaydi',
      'Yangi shablon fayl yaratadi va unga context yozadi',
      'Shablonni oddiy matn (str) qilib qaytaradi, javobni o\'zingiz yasaysiz',
    ],
    correctIndex: 0,
    explanation:
      'render() uch ishni birga bajaradi: shablonni topadi, context\'dagi qiymatlar bilan to\'ldiradi va natijani HttpResponse qilib qaytaradi — shuning uchun uni to\'g\'ridan-to\'g\'ri return qilish mumkin.',
  },
  {
    lessonKey: 'backend-dars-58',
    order: 2,
    prompt: 'Shablonda {{ }} va {% %} farqi nima?',
    choices: [
      'Ikkalasi ham bir xil ishlaydi, yozuv uslubi turlicha',
      '{{ }} qiymatni ekranga chiqaradi, {% %} esa mantiqni bajaradi (for, if, extends)',
      '{{ }} mantiqni bajaradi, {% %} esa qiymatni chiqaradi',
      '{{ }} ichida istalgan Python kodni yozish mumkin',
    ],
    correctIndex: 1,
    explanation:
      '{{ post.title }} — qiymat chiqarish, {% for post in posts %} — mantiq. Django shabloni to\'liq Python emas: {{ }} ichida hisoblash yoki funksiya chaqirish yozilmaydi.',
  },
  {
    lessonKey: 'backend-dars-58',
    order: 3,
    prompt: '{% extends "base.html" %} nima uchun ishlatiladi?',
    choices: [
      'base.html faylining mazmunini shu joyga qo\'shib qo\'yish uchun',
      'CSS faylni sahifaga ulash uchun',
      'Python class merosini shablonda e\'lon qilish uchun',
      'Umumiy karkasni base.html\'da bir marta yozib, sahifalar uni meros olishi uchun',
    ],
    correctIndex: 3,
    explanation:
      '{% extends %} — HTML uchun DRY: takrorlanuvchi <head>, menyu va footer base.html\'da turadi, sahifa esa faqat {% block %} ichini to\'ldiradi. Boshqa fayl mazmunini o\'sha joyga qo\'shish — bu {% include %}.',
  },
  {
    lessonKey: 'backend-dars-58',
    order: 4,
    prompt: 'App\'ning admin.py faylida odatda nima yoziladi?',
    choices: [
      'Modellar admin panelida ko\'rinishi uchun ro\'yxatga olinadi va ModelAdmin sozlanadi',
      'Model maydonlari e\'lon qilinadi',
      'App\'ning URL manzillari yoziladi',
      'Superuser yaratiladi',
    ],
    correctIndex: 0,
    explanation:
      'admin.py — panelning sozlamalar fayli: register va ModelAdmin shu yerda. Maydonlar models.py da, manzillar urls.py da, superuser esa terminalda createsuperuser bilan yaratiladi.',
  },
  {
    lessonKey: 'backend-dars-58',
    order: 5,
    prompt: 'QuerySet nima?',
    choices: [
      'Django yozgan SQL so\'rovining matn ko\'rinishi',
      'Bazadan olingan bitta model obyekti',
      'Model obyektlari to\'plami — masalan filter() qaytaradigan natija',
      'Bazadan olingan lug\'atlar (dict) ro\'yxati',
    ],
    correctIndex: 2,
    explanation:
      'QuerySet — model obyektlaridan iborat to\'plam: uni {% for %} bilan aylanib chiqish mumkin. U dict emas, balki to\'liq huquqli obyektlar — post.title kabi maydonlarga murojaat qilinadi.',
  },

  // ─────────────────────────────────── Dars 59 — Forms ───────────────────────────────────
  {
    lessonKey: 'backend-dars-59',
    order: 1,
    prompt: 'ModelForm oddiy Form o\'rniga nima uchun ishlatiladi?',
    choices: [
      'U formani CSS bilan chiroyli dizayn qilib beradi',
      'U ma\'lumotni faqat ko\'rsatadi, saqlash uchun ishlatilmaydi',
      'U model uchun bazada jadval yaratadi',
      'U maydonlar va validatsiyani modeldan avtomatik oladi, save() esa obyektni yozadi',
    ],
    correctIndex: 3,
    explanation:
      'ModelForm modelga qarab maydonlarni va tekshiruvlarni o\'zi yasaydi — bir maydon nomini ikki joyda takrorlamaysiz. form.save() esa to\'g\'ridan-to\'g\'ri model obyektini bazaga yozadi.',
  },
  {
    lessonKey: 'backend-dars-59',
    order: 2,
    prompt: 'form.is_valid() nima qiladi?',
    choices: [
      'Kelgan ma\'lumotni tekshiradi va True/False qaytaradi, xatolarni form.errors ga yig\'adi',
      'Ma\'lumotni tekshiradi va to\'g\'ri bo\'lsa darhol bazaga saqlaydi',
      'HTML forma tegi to\'g\'ri yozilganini tekshiradi',
      'Ma\'lumot noto\'g\'ri bo\'lsa dasturni xato bilan to\'xtatadi',
    ],
    correctIndex: 0,
    explanation:
      'is_valid() faqat tekshiradi — u hech narsani saqlamaydi va xato ko\'tarmaydi. Saqlash uchun undan keyin alohida save() chaqiriladi.',
  },
  {
    lessonKey: 'backend-dars-59',
    order: 3,
    prompt: 'CSRF token qanday hujumdan himoya qiladi?',
    choices: [
      'SQL injection — so\'rovga zararli SQL qo\'shilishidan',
      'Boshqa saytdan foydalanuvchi nomidan yuborilgan soxta POST so\'rovdan',
      'Sahifaga zararli JavaScript joylashtirilishidan',
      'Parolning ochiq matnda saqlanishidan',
    ],
    correctIndex: 1,
    explanation:
      'CSRF — «sizning brauzeringiz, sizning seansingiz, lekin so\'rovni siz yubormagansiz» hujumi. Token har formaga maxfiy qiymat qo\'yadi, begona sayt esa uni bilmaydi.',
  },
  {
    lessonKey: 'backend-dars-59',
    order: 4,
    prompt: 'render() chaqiruvi qanday turdagi qiymat qaytaradi?',
    choices: [
      'Shablon fayl nomini (str)',
      'Context lug\'atini (dict)',
      'HttpResponse obyektini',
      'Tayyor HTML matnini (str)',
    ],
    correctIndex: 2,
    explanation:
      'render() HTML matnini emas, HttpResponse obyektini qaytaradi — shuning uchun uni view\'dan to\'g\'ridan-to\'g\'ri return qilish mumkin.',
  },
  {
    lessonKey: 'backend-dars-59',
    order: 5,
    prompt: 'Yangi Post modelini admin panelida ko\'rish uchun admin.py ga aynan nima yoziladi?',
    choices: [
      'class Post(models.Model): ...',
      'path("admin/", admin.site.urls)',
      'admin.site.register(Post)',
      'from .models import Post — import qilish yetarli',
    ],
    correctIndex: 2,
    explanation:
      'Import qilishning o\'zi modelni panelga qo\'shmaydi — register(Post) chaqirilishi shart. path("admin/", ...) loyihaning urls.py fayliga tegishli.',
  },

  // ───────────────────────────────── Dars 60 — Blog loyiha ─────────────────────────────────
  {
    lessonKey: 'backend-dars-60',
    order: 1,
    prompt: 'CRUD qisqartmasi qaysi to\'rt amalni bildiradi?',
    choices: [
      'Create, Run, Update, Deploy',
      'Create, Read, Update, Delete',
      'Copy, Read, Undo, Delete',
      'Control, Route, URL, Data',
    ],
    correctIndex: 1,
    explanation:
      'CRUD — ma\'lumot ustidagi to\'rt asosiy amal: yaratish, o\'qish, yangilash, o\'chirish. Blogda ular 5 ta view va 5 ta URL bilan qoplanadi.',
  },
  {
    lessonKey: 'backend-dars-60',
    order: 2,
    prompt: 'get_object_or_404(Post, id=5) nima uchun oddiy Post.objects.get(id=5) dan afzal?',
    choices: [
      'Obyekt topilmasa yangisini yaratib beradi',
      'Obyekt topilmasa None qaytaradi va sahifa bo\'sh ochiladi',
      'U 404 sahifasining dizaynini o\'zi chizadi',
      'Obyekt topilmasa 500 xatosi emas, to\'g\'ri 404 javobi qaytariladi',
    ],
    correctIndex: 3,
    explanation:
      'Oddiy get() topolmasa DoesNotExist ko\'taradi va foydalanuvchi «server xatosi» (500) ni ko\'radi. Aslida bu server xatosi emas — resurs yo\'q, ya\'ni 404.',
  },
  {
    lessonKey: 'backend-dars-60',
    order: 3,
    prompt: 'Tahrirlash view\'ida PostForm(request.POST, instance=post) dagi instance=post nima qiladi?',
    choices: [
      'Formani mavjud post bilan bog\'laydi — save() yangi yozuv emas, o\'shani yangilaydi',
      'Post\'ning nusxasini yaratib, uni tahrirlaydi',
      'Formani faqat ko\'rsatish rejimiga o\'tkazadi, saqlab bo\'lmaydi',
      'Postni bazadan o\'chiradi va o\'rniga yangisini yozadi',
    ],
    correctIndex: 0,
    explanation:
      'instance siz save() har safar YANGI yozuv yaratadi — bu tahrirlashdagi eng ko\'p uchraydigan xato. instance=post forma qaysi qatorni yangilashini aytadi.',
  },
  {
    lessonKey: 'backend-dars-60',
    order: 4,
    prompt: 'POST formasida {% csrf_token %} yozilmasa nima bo\'ladi?',
    choices: [
      'Forma ishlaydi, lekin sekinroq yuboriladi',
      'Ma\'lumot saqlanadi, faqat validatsiya o\'tkazilmaydi',
      'So\'rov 403 Forbidden bilan rad etiladi',
      'Sahifaning GET orqali ochilishi ham to\'xtaydi',
    ],
    correctIndex: 2,
    explanation:
      'Django CSRF himoyasi yoqilgan holda keladi: tokensiz POST so\'rov 403 bilan qaytariladi. GET so\'rovlarga esa bu ta\'sir qilmaydi.',
  },
  {
    lessonKey: 'backend-dars-60',
    order: 5,
    prompt: 'Blogning barcha sahifalarida bir xil menyu va footer bo\'lishini eng to\'g\'ri qanday ta\'minlaysiz?',
    choices: [
      'Menyu HTML\'ini har bir shablon fayliga nusxalab yozib chiqaman',
      'base.html yozib, sahifalarni {% extends %} bilan undan meros olaman',
      'Menyuni faqat CSS yordamida chizaman',
      'Menyuni har view\'da context orqali matn sifatida uzataman',
    ],
    correctIndex: 1,
    explanation:
      'Nusxalash — menyuni o\'zgartirganda hamma faylni qayta tahrirlash demak. base.html + {% extends %} + {% block %} bu takrorlanishni bitta joyga yig\'adi.',
  },

  // ───────────────────────────────── Dars 61 — DRF kirish ─────────────────────────────────
  {
    lessonKey: 'backend-dars-61',
    order: 1,
    prompt: 'DRF\'da Serializer nima qiladi?',
    choices: [
      'Model obyektini JSON\'ga (va JSON\'ni obyektga) o\'giradi hamda kirayotgan ma\'lumotni tekshiradi',
      'HTML shablonni to\'ldirib, tayyor sahifa qaytaradi',
      'Bazada yangi jadval yaratadi',
      'URL manzilini kerakli view\'ga yo\'naltiradi',
    ],
    correctIndex: 0,
    explanation:
      'Serializer — tarjimon: obyekt ↔ JSON. Yo\'l-yo\'lakay u ModelForm kabi validatsiya ham qiladi, shuning uchun kiruvchi ma\'lumotga ishonmasdan is_valid() chaqiriladi.',
  },
  {
    lessonKey: 'backend-dars-61',
    order: 2,
    prompt: 'Serializer\'ga many=True argumenti qachon beriladi?',
    choices: [
      'Model maydonlari ko\'p bo\'lganda',
      'Modelda ForeignKey bo\'lganda',
      'Bir nechta obyekt — masalan QuerySet — serializatsiya qilinayotganda',
      'Har doim: usiz serializer umuman ishlamaydi',
    ],
    correctIndex: 2,
    explanation:
      'many=True «bitta emas, to\'plam» degani: PostSerializer(posts, many=True) natijada JSON massiv beradi. Bitta obyekt uchun u yozilmaydi.',
  },
  {
    lessonKey: 'backend-dars-61',
    order: 3,
    prompt: 'PostSerializer(post) va PostSerializer(data=so\'rov_malumoti) farqi nima?',
    choices: [
      'Farqi yo\'q, ikkalasi ham bir xil natija beradi',
      'Birinchisi chiqish uchun (.data), ikkinchisi kirish uchun — is_valid() dan keyin save() qilinadi',
      'data= variant tezroq ishlaydi, shuning uchun afzal',
      'data= faqat many=True bilan birga ishlatiladi',
    ],
    correctIndex: 1,
    explanation:
      'Pozitsion argument — mavjud obyektni JSON\'ga aylantirish (chiqish). data= — tashqaridan kelgan ma\'lumot (kirish), unga ishonmasdan avval is_valid() chaqiriladi.',
  },
  {
    lessonKey: 'backend-dars-61',
    order: 4,
    prompt: 'API\'da mavjud bo\'lmagan id so\'ralganda get_object_or_404 nima uchun kerak?',
    choices: [
      'Chunki u yo\'q obyektni qidirishni tezlashtiradi',
      'Chunki mijoz «server buzildi» (500) emas, «bunday resurs yo\'q» (404) javobini olishi kerak',
      'Chunki usiz serializer ishlamaydi',
      'Chunki u bo\'sh JSON obyekt {} qaytaradi',
    ],
    correctIndex: 1,
    explanation:
      'HTTP status kodi mijozga nima bo\'lganini aytadi: 404 — resurs topilmadi, 500 — bizning kodimiz sindi. Ushlanmagan DoesNotExist noto\'g\'ri xabar — 500 — beradi.',
  },
  {
    lessonKey: 'backend-dars-61',
    order: 5,
    prompt: 'CSRF hujumida hujumchi aslida nima qiladi?',
    choices: [
      'Sahifaga zararli JavaScript joylashtirib, boshqa foydalanuvchilarda ishga tushiradi',
      'Serverga juda ko\'p so\'rov yuborib, uni ishdan chiqaradi',
      'So\'rov maydoniga SQL qo\'shib, butun jadvalni o\'qib oladi',
      'O\'z saytidan foydalanuvchining ochiq seansidan foydalanib, uning nomidan so\'rov yuboradi',
    ],
    correctIndex: 3,
    explanation:
      'CSRF\'da hujumchi sizning cookie\'ngizni o\'g\'irlamaydi — brauzer uni o\'zi qo\'shib yuboradi. Sahifaga JS joylash — XSS, so\'rov bilan bosish — DDoS, SQL qo\'shish — SQL injection.',
  },
];
