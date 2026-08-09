import type { LessonQuizRecord } from './backendQuiz.m1a';

// Hand-authored MCQs derived from the lesson decks' TEKSHIRUV slides.
//
// Scope: backend lessons 41..47 (`backend-dars-41` .. `backend-dars-47`), 5 questions each = 35.
// Sections: SQL (41-45) va Python + DB (46-47).
//
// Har bir prompt — kurs muallifining asl ochiq savoli, bitta aniq javobi bo'ladigan qilib yengil
// qayta yozilgan. Distraktorlar — shu mavzudagi HAQIQIY boshlang'ich xatolar: DELETE ni DROP bilan
// aralashtirish, `= NULL` yozish, HAVING o'rniga WHERE, FK ni PK deb o'ylash, `?` va `%s` ni
// almashtirish, commit() ni unutish, f-string bilan so'rov qurish.
//
// Faktik javoblar (COUNT(*) vs COUNT(ustun), `= NULL`, PRIMARY KEY dublikati, WHERE'siz
// DELETE/UPDATE, INNER vs LEFT JOIN, HAVING, DISTINCT, fetchone/fetchall, commit'siz INSERT,
// SQL injection) sqlite3 orqali Piston sandbox'da bajarib tekshirilgan.

export const backendQuizB05: LessonQuizRecord[] = [
  // ─────────────────────── Dars 41 — Ma'lumot o'zgartirish (INSERT/UPDATE/DELETE) ───────────────────────
  {
    lessonKey: 'backend-dars-41',
    order: 1,
    prompt: 'PRIMARY KEY ustuni jadvalga nima beradi?',
    choices: [
      'Jadvaldagi eng birinchi ustunni bildiradi, boshqa vazifasi yo\'q',
      'Qatorlarni avtomatik alifbo bo\'yicha tartiblab saqlaydi',
      'Har bir qatorni yagona qilib ajratadi: qiymat takrorlanmaydi va NULL bo\'lolmaydi',
      'Bu ustun boshqa jadvalning qatoriga ishora qilishini bildiradi',
    ],
    correctIndex: 2,
    explanation:
      'PRIMARY KEY — qatorning pasporti: qiymat noyob bo\'lishi va bo\'sh qolmasligi shart. Bir xil qiymatni ikkinchi marta kiritmoqchi bo\'lsangiz, baza INSERT ni rad etib xatolik beradi. Boshqa jadvalga ishora qilish — bu FOREIGN KEY ning vazifasi.',
  },
  {
    lessonKey: 'backend-dars-41',
    order: 2,
    prompt: 'DELETE FROM talabalar; — WHERE\'siz yozilsa nima bo\'ladi?',
    choices: [
      'Jadvaldagi BARCHA qatorlar o\'chadi, jadvalning o\'zi bo\'sh holda qoladi',
      'Baza xavfsizlik uchun xatolik beradi va hech narsa o\'chmaydi',
      'Jadval ustunlari bilan birga butunlay yo\'q qilinadi',
      'Faqat birinchi qator o\'chadi, qolganlari joyida qoladi',
    ],
    correctIndex: 0,
    explanation:
      'WHERE — bu shart; u yo\'q bo\'lsa shart hamma qatorga to\'g\'ri keladi va hammasi o\'chadi. Jadvalning o\'zini yo\'q qiladigan buyruq boshqa — DROP TABLE. Shuning uchun o\'chirishdan oldin o\'sha WHERE bilan SELECT yozib tekshiring.',
  },
  {
    lessonKey: 'backend-dars-41',
    order: 3,
    prompt: 'CREATE TABLE da ustun turini SERIAL deb yozsak, u nima qiladi?',
    choices: [
      'Ustunga faqat matn saqlanishini va u ketma-ket yozilishini bildiradi',
      'Har yangi qator uchun butun sonni avtomatik 1 ga oshirib o\'zi qo\'yib beradi',
      'Ustunni avtomatik ravishda PRIMARY KEY qilib e\'lon qiladi',
      'Mavjud qatorlarni ustun qiymati bo\'yicha qayta raqamlab chiqadi',
    ],
    correctIndex: 1,
    explanation:
      'SERIAL — «avtomatik o\'suvchi butun son»: INSERT da bu ustunni yozmaysiz, baza 1, 2, 3 deb o\'zi qo\'yadi. U noyoblikni o\'zi kafolatlamaydi — shuning uchun odatda `id SERIAL PRIMARY KEY` deb ikkalasi birga yoziladi.',
  },
  {
    lessonKey: 'backend-dars-41',
    order: 4,
    prompt: 'SELECT so\'rovidagi bo\'laklarning to\'g\'ri tartibi qaysi?',
    choices: [
      'FROM → SELECT → WHERE → LIMIT → ORDER BY',
      'SELECT → WHERE → FROM → ORDER BY → LIMIT',
      'SELECT → FROM → ORDER BY → WHERE → LIMIT',
      'SELECT → FROM → WHERE → ORDER BY → LIMIT',
    ],
    correctIndex: 3,
    explanation:
      'SQL da bu tartib qat\'iy: avval nima kerakligi (SELECT), qayerdan (FROM), qaysi shart bilan (WHERE), qanday tartibda (ORDER BY) va nechtasi (LIMIT). Tartibni buzsangiz baza so\'rovni umuman tushunmay sintaksis xatosi beradi.',
  },
  {
    lessonKey: 'backend-dars-41',
    order: 5,
    prompt: 'git clone qaysi holatda ishlatiladi?',
    choices: [
      'Lokal o\'zgarishlarni GitHub\'dagi repozitoriyga yuborish uchun',
      'Bo\'sh papkada butunlay yangi repozitoriy boshlash uchun',
      'GitHub\'dagi mavjud repozitoriyni birinchi marta o\'z kompyuteringizga nusxalash uchun',
      'Serverdagi yangi commitlarni allaqachon mavjud papkangizga tortish uchun',
    ],
    correctIndex: 2,
    explanation:
      'clone — «birinchi marta yuklab olish»: repozitoriy hali kompyuteringizda yo\'q bo\'lganda ishlatiladi va tayyor papka yaratadi. Papka allaqachon bor bo\'lsa git pull, yangi loyiha ochsangiz git init, yuborish uchun esa git push kerak.',
  },

  // ─────────────────────── Dars 42 — Filtrlash chuqur (LIKE / IN / BETWEEN / IS NULL) ───────────────────────
  {
    lessonKey: 'backend-dars-42',
    order: 1,
    prompt: 'WHERE ism LIKE \'Ali%\' sharti qanday ismlarni topadi?',
    choices: [
      'Ichida «Ali» bo\'lgan barcha ismlarni, masalan «Valijon»',
      '«Ali» bilan BOSHLANADIGAN ismlarni, masalan «Ali» va «Alisher»',
      '«Ali» bilan TUGAYDIGAN ismlarni, masalan «Muhammadali»',
      'Faqat roppa-rosa «Ali%» degan matnni — % oddiy belgi',
    ],
    correctIndex: 1,
    explanation:
      '% — «bu yerda istalgan belgilar bo\'lishi mumkin» degani. Shuning uchun \'Ali%\' — boshi Ali, \'%Ali\' — oxiri Ali, \'%Ali%\' — istalgan joyida Ali.',
  },
  {
    lessonKey: 'backend-dars-42',
    order: 2,
    prompt: 'Ustunda qiymat yo\'q (NULL) qatorlarni qanday topamiz?',
    choices: [
      'WHERE ball = NULL',
      'WHERE ball = \'NULL\'',
      'WHERE ball = \'\'',
      'WHERE ball IS NULL',
    ],
    correctIndex: 3,
    explanation:
      'NULL — «qiymat noma\'lum» degani, shuning uchun u hech narsaga, hatto NULL ga ham teng emas: `= NULL` har doim 0 ta qator qaytaradi (buni bazada bajarib tekshirdik). Faqat IS NULL / IS NOT NULL ishlaydi; \'NULL\' va \'\' esa oddiy matnlar, NULL emas.',
  },
  {
    lessonKey: 'backend-dars-42',
    order: 3,
    prompt: 'SELECT DISTINCT shahar FROM talabalar — DISTINCT nima qiladi?',
    choices: [
      'Takrorlanuvchi qiymatlarni jadvalning o\'zidan o\'chirib tashlaydi',
      'Natijani alifbo tartibida chiqaradi',
      'Har xil qiymatni natijada faqat bir marta ko\'rsatadi, jadval o\'zgarmaydi',
      'Faqat boshqa qatorlarda umuman uchramaydigan qiymatlarni chiqaradi',
    ],
    correctIndex: 2,
    explanation:
      'DISTINCT — bu faqat natijani ko\'rsatish usuli: 100 ta talaba 3 xil shahardan bo\'lsa, u 3 ta satr qaytaradi, lekin jadvaldagi 100 ta qator joyida qoladi. Tartiblash uchun alohida ORDER BY yozish kerak.',
  },
  {
    lessonKey: 'backend-dars-42',
    order: 4,
    prompt: 'UPDATE talabalar SET guruh = \'A\'; — WHERE\'siz yozilsa nima bo\'ladi?',
    choices: [
      'Faqat birinchi qator o\'zgaradi',
      'Xatolik chiqadi, chunki UPDATE\'da WHERE majburiy',
      'Guruhi \'A\' bo\'lgan yangi qator qo\'shiladi',
      'Jadvaldagi barcha qatorlarning guruhi \'A\' bo\'lib qoladi',
    ],
    correctIndex: 3,
    explanation:
      'WHERE\'siz shart hamma qatorga to\'g\'ri keladi — bazada sinab ko\'rdik: uchta qatorning uchalasi ham o\'zgardi. Baza sizni ogohlantirmaydi, shuning uchun UPDATE dan oldin o\'sha shartni SELECT bilan tekshirish odat bo\'lsin.',
  },
  {
    lessonKey: 'backend-dars-42',
    order: 5,
    prompt: 'Eng yuqori ballli 3 ta talabani chiqarmoqchi edingiz, lekin `SELECT ism, ball FROM talabalar ORDER BY ball LIMIT 3;` so\'rovi eng PAST ballilarni qaytardi. Xato qayerda?',
    choices: [
      'LIMIT 3 ni ORDER BY dan oldin yozish kerak edi',
      'ORDER BY yo\'nalish yozilmasa ASC (o\'sish) deb hisoblaydi — kattadan kichikka uchun `ORDER BY ball DESC` yozilishi kerak',
      'ball ustuni matn turida saqlangani uchun ORDER BY uni to\'g\'ri solishtira olmaydi',
      'LIMIT har doim jadval boshidan 3 qator oladi, buni OFFSET bilan tuzatish kerak',
    ],
    correctIndex: 1,
    explanation:
      'Bazada sinab ko\'rdik (5 ta talaba: Dilnoza 100, Ali 90, Nodira 82, Vali 75, Sardor 60). `ORDER BY ball LIMIT 3` → Sardor 60, Vali 75, Nodira 82; `ORDER BY ball DESC LIMIT 3` → Dilnoza 100, Ali 90, Nodira 82. Demak yo\'nalish yozilmasa ASC standart bo\'ladi, DESC esa kamayish tartibi. Tartiblash LIMIT dan OLDIN bajariladi — shuning uchun «eng yuqori 3 ta» aynan `ORDER BY ball DESC LIMIT 3` bilan olinadi.',
  },

  // ─────────────────────────────────── Dars 43 — JOIN ───────────────────────────────────
  {
    lessonKey: 'backend-dars-43',
    order: 1,
    prompt: 'Talabalar jadvalida 3 ta talaba bor, ulardan bittasining bahosi yo\'q. INNER JOIN va LEFT JOIN natijasi qanday farq qiladi?',
    choices: [
      'INNER JOIN faqat bahosi borlarni beradi, LEFT JOIN esa bahosizni ham NULL bilan qo\'shib beradi',
      'Ikkalasi bir xil natija beradi, faqat yozilishi boshqacha',
      'INNER JOIN barcha talabani beradi, LEFT JOIN esa faqat mos kelganlarini',
      'LEFT JOIN bahosi yo\'q talabani butunlay tashlab ketadi',
    ],
    correctIndex: 0,
    explanation:
      'INNER JOIN — «faqat juftlik topilganlar», LEFT JOIN — «chapdagi hamma qator qoladi, juftlik topilmasa o\'ng tomon NULL bo\'ladi». Bazada tekshirdik: 3 ta talabadan 2 tasining bahosi bor edi — INNER 2 satr, LEFT 3 satr qaytardi va Dilnozaning bahosi NULL bo\'ldi.',
  },
  {
    lessonKey: 'backend-dars-43',
    order: 2,
    prompt: 'Foreign key (tashqi kalit) nima?',
    choices: [
      'Jadvalning har bir qatorini noyob qiladigan asosiy ustun',
      'Boshqa jadvalning kalitiga ishora qiluvchi va bog\'liqlikni ta\'minlovchi ustun',
      'Qidiruvni tezlashtirish uchun quriladigan indeks',
      'Boshqa serverdagi bazaga ulanish uchun kerak bo\'ladigan maxfiy kalit',
    ],
    correctIndex: 1,
    explanation:
      'Foreign key — bir jadvaldagi ustun boshqa jadvalning PRIMARY KEY iga ishora qiladi (REFERENCES talaba(id)). U tufayli baza mavjud bo\'lmagan talabaga baho qo\'yishga yo\'l qo\'ymaydi. Qatorni noyob qiladigan ustun — bu PRIMARY KEY.',
  },
  {
    lessonKey: 'backend-dars-43',
    order: 3,
    prompt: 'JOIN dagi ON bo\'lagi nimani belgilaydi?',
    choices: [
      'Natijada qaysi ustunlar ko\'rinishini',
      'Natija qaysi ustun bo\'yicha tartiblanishini',
      'Ikki jadval qaysi ustunlar mosligi bo\'yicha bog\'lanishini',
      'Natijadan nechta qator olinishini',
    ],
    correctIndex: 2,
    explanation:
      'ON — bog\'lanish sharti: `ON t.id = b.talaba_id` bazaga qaysi qator qaysi qatorga tegishli ekanini aytadi. Qaysi ustunlar chiqishini SELECT, tartibni ORDER BY, sonini LIMIT belgilaydi.',
  },
  {
    lessonKey: 'backend-dars-43',
    order: 4,
    prompt: 'LEFT JOIN dan keyin WHERE b.id IS NULL yozilsa, natijada nima chiqadi?',
    choices: [
      'Ikkala jadvalda ham mos juftligi bor qatorlar',
      'Barcha qatorlar — bu shart hech narsani o\'zgartirmaydi',
      'Ikkinchi jadvaldagi barcha qatorlar',
      'Chap jadvaldagi juftlik topilmagan qatorlar, ya\'ni «bog\'lanmaganlar»',
    ],
    correctIndex: 3,
    explanation:
      'LEFT JOIN da juftlik topilmagan qatorlarda o\'ng jadval ustunlari NULL bo\'ladi, shuning uchun IS NULL aynan o\'shalarni ajratib beradi. Bazada sinab ko\'rdik — bahosi yo\'q Dilnoza chiqdi. Bu «hech kimga biriktirilmaganlarni top» naqshi.',
  },
  {
    lessonKey: 'backend-dars-43',
    order: 5,
    prompt: 'PRIMARY KEY qo\'yilgan id ustuniga allaqachon mavjud qiymatni yana kiritmoqchi bo\'lsak nima bo\'ladi?',
    choices: [
      'INSERT rad etiladi va baza xatolik qaytaradi',
      'Qo\'shiladi, chunki qolgan ustunlar qiymati boshqacha',
      'Eski qator yangisi bilan avtomatik almashtiriladi',
      'Qo\'shiladi, lekin id avtomatik keyingi bo\'sh raqamga o\'zgartiriladi',
    ],
    correctIndex: 0,
    explanation:
      'PRIMARY KEY noyoblikni majburlaydi: sinab ko\'rganimizda baza IntegrityError berdi va qator qo\'shilmadi. Baza qiymatni o\'zi tuzatib ham, eski qatorni bosib ketib ham qo\'ymaydi — buni siz hal qilishingiz kerak.',
  },

  // ───────────────────────────── Dars 44 — Guruhlash (GROUP BY) ─────────────────────────────
  {
    lessonKey: 'backend-dars-44',
    order: 1,
    prompt: 'SELECT guruh, COUNT(*) FROM talabalar GROUP BY guruh — GROUP BY bu yerda nima qiladi?',
    choices: [
      'Qatorlarni guruh nomi bo\'yicha tartiblab chiqaradi',
      'Bir xil guruhdagi qatorlarni birlashtiradi va har guruh uchun bitta natija satri beradi',
      'Takrorlanuvchi guruh nomlarini natijadan olib tashlaydi',
      'Faqat eng ko\'p talabasi bor guruhni qoldiradi',
    ],
    correctIndex: 1,
    explanation:
      'GROUP BY qatorlarni qutilarga ajratadi, agregat funksiya esa har qutidan bitta son chiqaradi: A guruhi 2 ta, B guruhi 1 ta. Tartiblash — ORDER BY, takrorni olib tashlash — DISTINCT ning vazifasi.',
  },
  {
    lessonKey: 'backend-dars-44',
    order: 2,
    prompt: 'WHERE va HAVING orasidagi asosiy farq nima?',
    choices: [
      'Ikkalasi bir xil, HAVING shunchaki yangiroq yozuv shakli',
      'WHERE faqat sonlar bilan, HAVING faqat matnlar bilan ishlaydi',
      'WHERE guruhlashdan oldin alohida qatorlarni, HAVING guruhlashdan keyin guruhlarni filtrlaydi',
      'HAVING guruhlashdan oldin, WHERE esa keyin ishlaydi',
    ],
    correctIndex: 2,
    explanation:
      'WHERE guruh tuzilmasidan oldin ishlagani uchun COUNT/AVG kabi agregat natijani ko\'rmaydi — shuning uchun «talabasi 1 tadan ko\'p guruhlar» sharti HAVING COUNT(*) > 1 deb yoziladi. Xohlasangiz ikkalasini bitta so\'rovda ishlatish mumkin.',
  },
  {
    lessonKey: 'backend-dars-44',
    order: 3,
    prompt: '4 ta qatorli jadvalda ball ustunining 2 tasi NULL. COUNT(*) va COUNT(ball) nima qaytaradi?',
    choices: [
      'Ikkalasi ham 4 — COUNT NULL ni ham sanaydi',
      'Ikkalasi ham 2 — COUNT hech qachon NULL ni sanamaydi',
      'COUNT(*) 2, COUNT(ball) 4',
      'COUNT(*) 4, COUNT(ball) 2',
    ],
    correctIndex: 3,
    explanation:
      'COUNT(*) qatorlarni sanaydi, COUNT(ustun) esa o\'sha ustundagi NULL bo\'lmagan qiymatlarni sanaydi — bazada bajarib tekshirdik: 4 va 2. «Nechta talaba bor» uchun COUNT(*), «nechtasining bahosi qo\'yilgan» uchun COUNT(ball).',
  },
  {
    lessonKey: 'backend-dars-44',
    order: 4,
    prompt: 'LEFT JOIN qatorlarni qanday tanlaydi?',
    choices: [
      'Chap jadvaldagi barcha qatorni oladi, o\'ngda juftlik yo\'q bo\'lsa NULL qo\'yadi',
      'Faqat ikkala jadvalda ham juftligi bor qatorlarni oladi',
      'O\'ng jadvaldagi barcha qatorni oladi, chapda juftlik yo\'q bo\'lsa NULL qo\'yadi',
      'Ikki jadvalning qatorlarini ketma-ket ulab, birining tagiga ikkinchisini qo\'yadi',
    ],
    correctIndex: 0,
    explanation:
      'LEFT JOIN da chap (FROM dan keyingi) jadval to\'liq saqlanadi — shuning uchun bahosi yo\'q talaba ham ro\'yxatda qoladi, faqat baho ustuni NULL bo\'ladi. Faqat mos kelganlarini olish — INNER JOIN.',
  },
  {
    lessonKey: 'backend-dars-44',
    order: 5,
    prompt: 'WHERE ism LIKE \'%a%\' sharti nimani topadi?',
    choices: [
      'Faqat «a» harfi bilan boshlanadigan ismlarni',
      'Faqat «a» harfi bilan tugaydigan ismlarni',
      'Ismning istalgan joyida «a» harfi uchraydigan qatorlarni',
      'Ichida faqat bitta «a» harfi bor ismlarni',
    ],
    correctIndex: 2,
    explanation:
      'Ikki tomondagi % «oldin ham, keyin ham istalgan belgilar bo\'lishi mumkin» degani, shuning uchun harf qayerda turishidan qat\'i nazar topiladi. Nechta marta uchrashi esa umuman ahamiyatsiz.',
  },

  // ───────────────────────────── Dars 45 — DB dizayni ─────────────────────────────
  {
    lessonKey: 'backend-dars-45',
    order: 1,
    prompt: 'Normalizatsiya (takrorlanuvchi ma\'lumotni alohida jadvalga chiqarish) nima uchun kerak?',
    choices: [
      'Bir ma\'lumot bir joyda saqlanib, dublikat va qarama-qarshi qiymatlar kelib chiqmasligi uchun',
      'Barcha ma\'lumotni bitta katta jadvalga yig\'ib, so\'rovlarni soddalashtirish uchun',
      'Ustun va jadval nomlarini yagona uslubda yozish qoidasi shu',
      'Bazaning zaxira nusxasini avtomatik olish uchun',
    ],
    correctIndex: 0,
    explanation:
      'Guruh nomi 500 ta qatorda takrorlansa, uni o\'zgartirganda bir nechtasi eskiligicha qolib ketishi mumkin — baza o\'ziga zid bo\'lib qoladi. Alohida jadvalda esa nom bitta joyda turadi, qolgan jadvallar unga FK bilan ishora qiladi.',
  },
  {
    lessonKey: 'backend-dars-45',
    order: 2,
    prompt: 'Bir talaba ko\'p kursga yozilishi, bir kursda ko\'p talaba bo\'lishi mumkin. Bu M:N munosabat qanday quriladi?',
    choices: [
      'Talaba jadvaliga kurs_id, kurs jadvaliga talaba_id ustunini qo\'shib',
      'Talaba jadvalidagi bitta ustunda kurs id larini vergul bilan ro\'yxat qilib saqlab',
      'Ikkala jadvalning PRIMARY KEY ini bir xil qilib',
      'Uchinchi — bog\'lovchi jadval ochib, unga ikkala tomonning FK sini qo\'yib',
    ],
    correctIndex: 3,
    explanation:
      'M:N ni ikki jadvalning o\'zida ifodalab bo\'lmaydi — har bir juftlik uchun alohida qator kerak, shuning uchun `talaba_kurs(talaba_id, kurs_id)` jadvali ochiladi. Bitta katakka vergulli ro\'yxat yozish esa JOIN ni ham, qidiruvni ham buzadi.',
  },
  {
    lessonKey: 'backend-dars-45',
    order: 3,
    prompt: 'Indeks nima qiladi va uning kamchiligi nima?',
    choices: [
      'Qidiruvni tezlashtiradi, lekin joy egallaydi va INSERT/UPDATE ni sekinlashtiradi',
      'Barcha amalni tezlashtiradi, hech qanday kamchiligi yo\'q',
      'Ustundagi qiymatlar takrorlanishini taqiqlaydi, lekin qidiruvga ta\'sir qilmaydi',
      'Ma\'lumotni siqib joy tejaydi, lekin o\'qishni sekinlashtiradi',
    ],
    correctIndex: 0,
    explanation:
      'Indeks — kitobning mundarijasi kabi: o\'qishni tezlashtiradi, ammo har yangi yozuvda mundarijani ham yangilash kerak bo\'ladi. Shuning uchun uni hamma ustunga emas, WHERE va JOIN da tez-tez ishlatiladigan ustunlarga qo\'yiladi. Takrorlanishni taqiqlash — UNIQUE ning vazifasi.',
  },
  {
    lessonKey: 'backend-dars-45',
    order: 4,
    prompt: 'Har bir guruhda nechta talaba borligini bitta so\'rov bilan chiqarmoqchisiz. Qaysi so\'rov to\'g\'ri?',
    choices: [
      'SELECT guruh, COUNT(*) FROM talabalar',
      'SELECT guruh, COUNT(*) FROM talabalar ORDER BY guruh',
      'SELECT guruh, COUNT(*) FROM talabalar GROUP BY guruh',
      'SELECT DISTINCT guruh, COUNT(*) FROM talabalar',
    ],
    correctIndex: 2,
    explanation:
      'Agregat funksiyani ustun bilan birga chiqarish uchun o\'sha ustun GROUP BY da bo\'lishi shart — aks holda baza qaysi guruhni sanashni bilmaydi. ORDER BY faqat tartiblaydi, DISTINCT esa guruhga bo\'lmaydi.',
  },
  {
    lessonKey: 'backend-dars-45',
    order: 5,
    prompt: 'Bir guruhda ko\'p talaba bor (1:N). Foreign key qaysi jadvalga qo\'yiladi?',
    choices: [
      '«Bir» tomondagi guruh jadvaliga — u talaba_id ni saqlaydi',
      '«Ko\'p» tomondagi talaba jadvaliga — u guruh_id ni saqlaydi',
      'Ikkala jadvalga ham, bir-biriga ishora qilishi uchun',
      'Alohida uchinchi bog\'lovchi jadvalga',
    ],
    correctIndex: 1,
    explanation:
      'Har bir talabaning guruhi bitta, shuning uchun guruh_id talaba qatoriga bemalol sig\'adi. Aksincha qilsak, guruh qatoriga o\'nlab talaba id sini tiqishga to\'g\'ri kelardi — bu esa noto\'g\'ri dizayn. Bog\'lovchi jadval faqat M:N uchun kerak.',
  },

  // ───────────────────────────── Dars 46 — SQLite (Python + DB) ─────────────────────────────
  {
    lessonKey: 'backend-dars-46',
    order: 1,
    prompt: 'Python\'dan INSERT bajardingiz, lekin conn.commit() yozmadingiz va dastur tugadi. Nima bo\'ladi?',
    choices: [
      'Yozuv bazada saqlanadi — commit() faqat tezlik uchun',
      'Yozuv saqlanmaydi: dastur yopilganda o\'zgarish bekor qilinadi',
      'Yozuv saqlanadi, lekin uni faqat shu dastur ko\'ra oladi',
      'execute() xatolik beradi va INSERT umuman bajarilmaydi',
    ],
    correctIndex: 1,
    explanation:
      'execute() o\'zgarishni faqat tranzaksiya ichida bajaradi, commit() esa uni diskka doimiy yozadi. Sinab ko\'rdik: commit\'siz qo\'shilgan qator faylni qayta ochganda yo\'q edi. Shuning uchun har INSERT/UPDATE/DELETE dan keyin commit() unutilmasin.',
  },
  {
    lessonKey: 'backend-dars-46',
    order: 2,
    prompt: 'cursor.fetchone() va cursor.fetchall() nima qaytaradi?',
    choices: [
      'fetchone() — ro\'yxat, fetchall() — bitta tuple',
      'Ikkalasi ham tuple\'lar ro\'yxatini, farqi faqat tezlikda',
      'fetchone() — bitta tuple (qator bo\'lmasa None), fetchall() — tuple\'lar ro\'yxati',
      'fetchone() — birinchi ustun qiymatini, fetchall() — barcha ustun nomlarini',
    ],
    correctIndex: 2,
    explanation:
      'fetchone() natijadan bitta qatorni tuple ko\'rinishida oladi va qator qolmasa None qaytaradi, fetchall() esa qolgan hamma qatorni list ichida beradi. Bir ustun so\'rasangiz ham qator tuple bo\'lib qoladi: ("Ali",) — qiymat uchun [0] indeksi kerak.',
  },
  {
    lessonKey: 'backend-dars-46',
    order: 3,
    prompt: 'sqlite3 da cursor nima?',
    choices: [
      'Baza fayli saqlanadigan papka yo\'li',
      'So\'rovni bajaradigan va natija qatorlarini o\'qib beradigan obyekt',
      'Bazaga ulanishni ochadigan funksiya',
      'Jadvalda hozir turgan qatorning tartib raqami',
    ],
    correctIndex: 1,
    explanation:
      'Ish zanjiri shunday: connect() ulanishni ochadi, conn.cursor() esa so\'rov yuboradigan «ishchi»ni yaratadi — u execute() bilan so\'rovni bajaradi va fetch* bilan natijani beradi.',
  },
  {
    lessonKey: 'backend-dars-46',
    order: 4,
    prompt: 'Qidiruv sekin ishlayapti. Indeks qo\'shish nimaga yordam beradi?',
    choices: [
      'Baza kerakli qatorni butun jadvalni ko\'zdan kechirmasdan tez topadi',
      'INSERT va UPDATE amallarini ham tezlashtiradi',
      'Jadvaldagi takrorlanuvchi qatorlarni avtomatik birlashtiradi',
      'Ma\'lumotni siqib, fayl hajmini kichraytiradi',
    ],
    correctIndex: 0,
    explanation:
      'Indekssiz baza jadvalni boshdan-oyoq o\'qib chiqadi; indeks esa mundarija kabi kerakli qatorga to\'g\'ridan-to\'g\'ri olib boradi. Buning evaziga fayl kattalashadi va yozish amallari biroz sekinlashadi.',
  },
  {
    lessonKey: 'backend-dars-46',
    order: 5,
    prompt: 'GROUP BY va HAVING bitta so\'rovda qanday vazifa bajaradi?',
    choices: [
      'GROUP BY guruhlarni filtrlaydi, HAVING ularni tartiblaydi',
      'Ikkalasi ham qatorlarni filtrlaydi, HAVING shunchaki qisqaroq shakl',
      'GROUP BY qatorlarni tartiblaydi, HAVING agregat funksiyani hisoblaydi',
      'GROUP BY qatorlarni guruhlarga bo\'ladi, HAVING esa tayyor guruhlardan keraklisini tanlaydi',
    ],
    correctIndex: 3,
    explanation:
      'Avval GROUP BY guruhlarni tuzadi va agregat funksiya har guruh uchun sonni hisoblaydi, keyin HAVING o\'sha sonlarga qarab guruhlarni saralaydi — masalan HAVING COUNT(*) > 1. Alohida qatorlarni guruhlashdan oldin filtrlash uchun esa WHERE ishlatiladi.',
  },

  // ───────────────────── Dars 47 — PostgreSQL va SQL injection (Python + DB) ─────────────────────
  {
    lessonKey: 'backend-dars-47',
    order: 1,
    prompt: 'SQL injection nima?',
    choices: [
      'Serverga juda ko\'p so\'rov yuborib, bazani ishdan chiqarish',
      'Foydalanuvchi kiritgan matn so\'rovga yopishtirilib, SQL kodning bir qismiga aylanib qolishi',
      'Parolni ketma-ket taxmin qilib, bazaga kirib olish',
      'Baza serveriga zararli fayl yuklab qo\'yish',
    ],
    correctIndex: 1,
    explanation:
      'f-string bilan qurilgan so\'rovda foydalanuvchi ma\'lumot emas, buyruq yozib yuborishi mumkin. Sinab ko\'rdik: ism o\'rniga `\' OR 1=1 --` yozilganda so\'rov jadvaldagi hamma qatorni qaytardi — ya\'ni hujumchi begona ma\'lumotni ko\'rdi.',
  },
  {
    lessonKey: 'backend-dars-47',
    order: 2,
    prompt: 'SQL injection dan qanday himoyalanamiz?',
    choices: [
      'f-string ichida qiymatni qo\'shtirnoqqa olib qo\'yamiz',
      'Kiritilgan matndan bo\'shliq va tirnoqlarni olib tashlaymiz',
      'Qiymatni so\'rovga yopishtirmay, parametr sifatida uzatamiz: execute(sql, (qiymat,))',
      'So\'rovni faqat katta harflarda yozamiz',
    ],
    correctIndex: 2,
    explanation:
      'Parametrli so\'rovda baza avval so\'rov tuzilishini tayyorlaydi, keyin qiymatni faqat MA\'LUMOT sifatida qo\'yadi — u hech qachon buyruqqa aylanmaydi. Tekshirdik: `\' OR 1=1 --` parametr sifatida uzatilganda 0 ta qator qaytdi. Qo\'lda tozalash esa har doim teshik qoldiradi.',
  },
  {
    lessonKey: 'backend-dars-47',
    order: 3,
    prompt: 'Parametrli so\'rovda o\'rin belgisi (placeholder) SQLite va PostgreSQL uchun qanday yoziladi?',
    choices: [
      'SQLite\'da ? , PostgreSQL (psycopg) da %s',
      'Ikkalasida ham ?',
      'Ikkalasida ham {} — f-string kabi',
      'SQLite\'da %s , PostgreSQL da ?',
    ],
    correctIndex: 0,
    explanation:
      'Kod deyarli bir xil bo\'lsa-da, kutubxonalar belgisi farq qiladi: sqlite3 `?` ni, psycopg esa `%s` ni kutadi. Qiymatlar ikkalasida ham execute ning ikkinchi argumentida tuple bo\'lib uzatiladi.',
  },
  {
    lessonKey: 'backend-dars-47',
    order: 4,
    prompt: 'Python\'dan PostgreSQL\'ga UPDATE yubordingiz. conn.commit() nima uchun kerak?',
    choices: [
      'Ulanishni yopib, resurslarni bo\'shatish uchun',
      'So\'rovni sintaksis xatosiga tekshirish uchun',
      'Natija qatorlarini o\'qib olish uchun',
      'Tranzaksiyani yakunlab, o\'zgarishni bazaga doimiy yozib qo\'yish uchun',
    ],
    correctIndex: 3,
    explanation:
      'O\'zgartiruvchi so\'rovlar tranzaksiya ichida turadi va commit() ularni tasdiqlaydi; commit\'siz ulanish yopilsa o\'zgarish bekor bo\'ladi. Ulanishni yopish uchun close(), natija olish uchun fetch* ishlatiladi.',
  },
  {
    lessonKey: 'backend-dars-47',
    order: 5,
    prompt: 'Quyidagilardan qaysi biri jadval normallashtirilmaganining belgisi?',
    choices: [
      'Har bir qatorda guruh nomi va o\'qituvchi ismi to\'liq takrorlanib yozilgan',
      'Jadvalda id nomli PRIMARY KEY ustuni bor',
      'Jadval boshqa jadvalga foreign key bilan bog\'langan',
      'Jadvalda tez-tez qidiriladigan ustunga indeks qo\'yilgan',
    ],
    correctIndex: 0,
    explanation:
      'Bir xil matnning yuzlab qatorda takrorlanishi — normalizatsiya kerakligining asosiy belgisi: uni alohida jadvalga chiqarib, FK bilan bog\'lash kerak. PRIMARY KEY, foreign key va indeks esa aksincha, to\'g\'ri dizayn alomatlari.',
  },
];
