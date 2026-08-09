/**
 * Hand-authored practice problems for backend lessons 76-82 (Oy-7).
 *
 * Only lessons with a genuinely auto-gradable pure-Python exercise underneath the topic
 * get problems here; infrastructure-only lessons keep their rubric-graded homework.
 * Grading is exact-output, so every `expectedStdout` below was captured from a real run of
 * a reference solution on the Piston sandbox (python 3.10.0) against the stored `stdin`.
 */
import type { LessonProblemRecord } from './types';

// Hand-authored practice, test cases verified against the Piston sandbox.
export const backendProblemsP10: LessonProblemRecord[] = [
  {
    "lessonKey": "backend-dars-76",
    "key": "backend-dars-76-easy",
    "title": ".env dan qiymat o'qish",
    "difficulty": "EASY",
    "points": 10,
    "tags": [
      "python",
      "env",
      "lug'at"
    ],
    "description": "`.env` fayl — har bir qatori `KALIT=QIYMAT` ko'rinishidagi sozlamalar ro'yxati. Dastur kerakli kalitni topib, uning qiymatini chiqarishi kerak.\n\nKiritish (stdin):\n- 1-qator: `n` — sozlamalar soni.\n- keyingi `n` qator: `KALIT=QIYMAT` (ortiqcha bo'sh joysiz).\n- oxirgi qator: qidirilayotgan kalit.\n\nChiqarish: bitta qator — topilgan qiymat. Agar bunday kalit bo'lmasa, `TOPILMADI` so'zini chiqaring.\n\nDiqqat: qiymat ichida ham `=` uchrashi mumkin — faqat BIRINCHI `=` ajratuvchi hisoblanadi. Qiymat bo'sh ham bo'lishi mumkin.\n\nMisol — kiritish:\n```\n3\nDEBUG=False\nSECRET_KEY=abc123\nDB_HOST=localhost\nSECRET_KEY\n```\nChiqish:\n```\nabc123\n```",
    "starterCodePy": "# n ta KALIT=QIYMAT qatorini o'qib, lug'atga yig'ing.\n# Faqat birinchi '=' bo'yicha ajrating (partition yordam beradi).\n# Oxirgi qator — qidirilayotgan kalit; topilmasa TOPILMADI chiqaring.\n",
    "testCases": [
      {
        "stdin": "3\nDEBUG=False\nSECRET_KEY=abc123\nDB_HOST=localhost\nSECRET_KEY\n",
        "expectedStdout": "abc123\n",
        "hidden": false,
        "label": "Misoldagi kalit"
      },
      {
        "stdin": "2\nDEBUG=True\nDB_PORT=5432\nDB_PORT\n",
        "expectedStdout": "5432\n",
        "hidden": false,
        "label": "Boshqa sozlama"
      },
      {
        "stdin": "2\nA=1\nB=2\nC\n",
        "expectedStdout": "TOPILMADI\n",
        "hidden": true,
        "label": "Ro'yxatdagi kalitlardan boshqasi so'raldi"
      },
      {
        "stdin": "1\nDATABASE_URL=postgres://user:pass@db:5432/app?ssl=1\nDATABASE_URL\n",
        "expectedStdout": "postgres://user:pass@db:5432/app?ssl=1\n",
        "hidden": true,
        "label": "Uzun qiymat"
      },
      {
        "stdin": "2\nSECRET_KEY=\nDEBUG=False\nSECRET_KEY\n",
        "expectedStdout": "\n",
        "hidden": true,
        "label": "Qiymat qismi qisqa"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-76",
    "key": "backend-dars-76-medium",
    "title": ".env faylni tozalab o'qish",
    "difficulty": "MEDIUM",
    "points": 20,
    "tags": [
      "python",
      "env",
      "matn"
    ],
    "description": "Haqiqiy `.env` fayl ichida izohlar, bo'sh qatorlar va ortiqcha bo'sh joylar bo'ladi. Dastur uni tozalab o'qishi kerak.\n\nKiritish (stdin):\n- 1-qator: `n` — fayldagi qatorlar soni.\n- keyingi `n` qator: faylning xom qatorlari.\n\nQatorni QABUL QILMANG, agar:\n- qator bo'sh yoki faqat bo'sh joydan iborat bo'lsa;\n- bo'sh joylar olib tashlanganda `#` bilan boshlansa (izoh);\n- ichida umuman `=` bo'lmasa.\n\nQabul qilingan qatorda: faqat birinchi `=` bo'yicha ajrating, kalit va qiymatning ikki chetidagi bo'sh joylarni olib tashlang. Agar qiymat `\"` yoki `'` bilan boshlanib, AYNAN o'sha belgi bilan tugasa (uzunligi kamida 2), bu ikki tirnoqni olib tashlang.\n\nChiqarish: har bir qabul qilingan sozlama uchun `KALIT=QIYMAT` (kiritish tartibida), oxirida esa `Jami: X` — qabul qilingan sozlamalar soni.\n\nMisol — kiritish:\n```\n6\n# Baza sozlamalari\nDB_HOST = localhost\n\nDB_NAME=\"my app\"\nnotanish_qator\nDB_PORT=5432\n```\nChiqish:\n```\nDB_HOST=localhost\nDB_NAME=my app\nDB_PORT=5432\nJami: 3\n```",
    "starterCodePy": "# Har bir qatorni strip() qiling, bo'sh va '#' bilan boshlanadiganlarini tashlab yuboring.\n# '=' bo'lmagan qator ham hisobga olinmaydi.\n# Qiymat chetidagi bir xil tirnoqlarni olib tashlang, oxirida Jami: X chiqaring.\n",
    "testCases": [
      {
        "stdin": "6\n# Baza sozlamalari\nDB_HOST = localhost\n\nDB_NAME=\"my app\"\nnotanish_qator\nDB_PORT=5432\n",
        "expectedStdout": "DB_HOST=localhost\nDB_NAME=my app\nDB_PORT=5432\nJami: 3\n",
        "hidden": false,
        "label": "Misoldagi fayl"
      },
      {
        "stdin": "4\n   \nSECRET_KEY = 'maxfiy kalit'\n   # izoh\nDEBUG=False\n",
        "expectedStdout": "SECRET_KEY=maxfiy kalit\nDEBUG=False\nJami: 2\n",
        "hidden": false,
        "label": "Bo'sh joyli va izohli qatorlar"
      },
      {
        "stdin": "3\n# faqat izohlar\n# yana izoh\n\n",
        "expectedStdout": "Jami: 0\n",
        "hidden": true,
        "label": "Sozlamasiz fayl"
      },
      {
        "stdin": "5\nDATABASE_URL=\"postgres://u:p@db:5432/app\"\nA=  1  \nB=\"\"\n#C=3\nD = \"  bo'sh joyli\"\n",
        "expectedStdout": "DATABASE_URL=postgres://u:p@db:5432/app\nA=1\nB=\nD=  bo'sh joyli\nJami: 4\n",
        "hidden": true,
        "label": "Tirnoq va bo'sh joy aralash"
      },
      {
        "stdin": "3\nE = \"  #izoh emas\"\nF='  chap chet'\nG=  \"toza\"  \n",
        "expectedStdout": "E=  #izoh emas\nF=  chap chet\nG=toza\nJami: 3\n",
        "hidden": true,
        "label": "Tirnoq ichidagi belgilar o'z holicha qoladi"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-76",
    "key": "backend-dars-76-hard",
    "title": ".env.example yasash",
    "difficulty": "HARD",
    "points": 35,
    "tags": [
      "python",
      "env",
      "xavfsizlik"
    ],
    "description": "`.env` Git'ga kirmaydi, `.env.example` esa kiradi. Shuning uchun `.env.example` ichida maxfiy qiymatlar BO'LMASLIGI kerak — faqat kalit nomi qoladi.\n\nKiritish (stdin):\n- 1-qator: `n` — sozlamalar soni.\n- keyingi `n` qator: `KALIT=QIYMAT` (toza, ortiqcha bo'sh joysiz).\n\nKalit MAXFIY hisoblanadi, agar uning KATTA harfga o'girilgan nomi ichida quyidagi bo'laklardan kamida bittasi bo'lsa: `SECRET`, `PASSWORD`, `TOKEN`, `KEY`, `API`.\n\nChiqarish (kiritish tartibida):\n- maxfiy kalit uchun — `KALIT=` (qiymatsiz);\n- oddiy kalit uchun — `KALIT=QIYMAT`;\n- oxirgi qator: `Maxfiy: X` — maxfiy kalitlar soni.\n\nMisol — kiritish:\n```\n4\nDEBUG=False\nSECRET_KEY=super-maxfiy\nDB_HOST=localhost\nAPI_TOKEN=xyz\n```\nChiqish:\n```\nDEBUG=False\nSECRET_KEY=\nDB_HOST=localhost\nAPI_TOKEN=\nMaxfiy: 2\n```",
    "starterCodePy": "# Kalit nomini upper() qilib, maxfiy bo'laklardan birini o'z ichiga oladimi — tekshiring.\n# Maxfiy bo'lsa qiymatni chiqarmang, oxirida Maxfiy: X ni chiqaring.\n",
    "testCases": [
      {
        "stdin": "4\nDEBUG=False\nSECRET_KEY=super-maxfiy\nDB_HOST=localhost\nAPI_TOKEN=xyz\n",
        "expectedStdout": "DEBUG=False\nSECRET_KEY=\nDB_HOST=localhost\nAPI_TOKEN=\nMaxfiy: 2\n",
        "hidden": false,
        "label": "Misoldagi fayl"
      },
      {
        "stdin": "3\nDB_PORT=5432\nDB_PASSWORD=12345\nALLOWED_HOSTS=example.uz\n",
        "expectedStdout": "DB_PORT=5432\nDB_PASSWORD=\nALLOWED_HOSTS=example.uz\nMaxfiy: 1\n",
        "hidden": false,
        "label": "Parolli sozlama"
      },
      {
        "stdin": "3\nDEBUG=True\nDB_HOST=localhost\nTIME_ZONE=Asia/Tashkent\n",
        "expectedStdout": "DEBUG=True\nDB_HOST=localhost\nTIME_ZONE=Asia/Tashkent\nMaxfiy: 0\n",
        "hidden": true,
        "label": "Barcha sozlamalar ochiq"
      },
      {
        "stdin": "4\napi_key=abc\nMONKEY_NAME=Kesha\nstripe_token=tok_1\nLOG_LEVEL=info\n",
        "expectedStdout": "api_key=\nMONKEY_NAME=\nstripe_token=\nLOG_LEVEL=info\nMaxfiy: 3\n",
        "hidden": true,
        "label": "Kalit nomlari har xil registrda"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-77",
    "key": "backend-dars-77-easy",
    "title": "Kesh: HIT va MISS",
    "difficulty": "EASY",
    "points": 10,
    "tags": [
      "python",
      "cache",
      "lug'at"
    ],
    "description": "Kesh — bir marta olingan javobni eslab qolish. Kalit birinchi marta so'ralganda kesh uni bilmaydi (MISS), keyingi safar esa darhol qaytaradi (HIT).\n\nKiritish (stdin):\n- 1-qator: `n` — so'rovlar soni.\n- keyingi `n` qator: har birida bitta kalit.\n\nChiqarish: har bir so'rov uchun bitta qator — kalit oldin so'ralmagan bo'lsa `MISS: <kalit>`, aks holda `HIT: <kalit>`. Oxirida yakuniy qator: `Jami: <hit> HIT, <miss> MISS`.\n\nMisol — kiritish:\n```\n5\nuser:1\nuser:1\nuser:2\nuser:1\nuser:3\n```\nChiqish:\n```\nMISS: user:1\nHIT: user:1\nMISS: user:2\nHIT: user:1\nMISS: user:3\nJami: 2 HIT, 3 MISS\n```",
    "starterCodePy": "# Ko'rilgan kalitlarni to'plamda saqlang.\n# Har so'rov uchun MISS yoki HIT chiqaring, oxirida ikkala sonni bering.\n",
    "testCases": [
      {
        "stdin": "5\nuser:1\nuser:1\nuser:2\nuser:1\nuser:3\n",
        "expectedStdout": "MISS: user:1\nHIT: user:1\nMISS: user:2\nHIT: user:1\nMISS: user:3\nJami: 2 HIT, 3 MISS\n",
        "hidden": false,
        "label": "Misoldagi so'rovlar"
      },
      {
        "stdin": "4\na\nb\na\nb\n",
        "expectedStdout": "MISS: a\nMISS: b\nHIT: a\nHIT: b\nJami: 2 HIT, 2 MISS\n",
        "hidden": false,
        "label": "Ikkita kalit navbatma-navbat"
      },
      {
        "stdin": "3\nx\ny\nz\n",
        "expectedStdout": "MISS: x\nMISS: y\nMISS: z\nJami: 0 HIT, 3 MISS\n",
        "hidden": true,
        "label": "Kalitlar takrorlanmadi"
      },
      {
        "stdin": "6\nkitob:10\nkitob:10\nkitob:10\nkitob:11\nkitob:10\nkitob:11\n",
        "expectedStdout": "MISS: kitob:10\nHIT: kitob:10\nHIT: kitob:10\nMISS: kitob:11\nHIT: kitob:10\nHIT: kitob:11\nJami: 4 HIT, 2 MISS\n",
        "hidden": true,
        "label": "Bir kalit ko'p marta"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-77",
    "key": "backend-dars-77-medium",
    "title": "TTL bilan kesh",
    "difficulty": "MEDIUM",
    "points": 20,
    "tags": [
      "python",
      "cache",
      "ttl"
    ],
    "description": "Keshdagi ma'lumot abadiy yashamaydi — unga TTL (yashash muddati) beriladi. Muddat tugagach kesh uni unutadi.\n\nKiritish (stdin):\n- 1-qator: `n` — buyruqlar soni.\n- keyingi `n` qator, ikki ko'rinishdan biri:\n  - `<vaqt> SET <kalit> <qiymat> <ttl>` — kalitni saqlash;\n  - `<vaqt> GET <kalit>` — kalitni so'rash.\n\n`vaqt` va `ttl` — butun sonlar (soniya). Vaqt kamaymaydi. `SET` qilingan qiymat `vaqt_now < set_vaqt + ttl` shart bajarilgunicha yaroqli. Bir kalitni qayta `SET` qilish eski qiymatni ham, muddatni ham yangilaydi.\n\nChiqarish: faqat `GET` uchun. Qiymat yaroqli bo'lsa `<kalit>=<qiymat>`, aks holda (hech qachon saqlanmagan yoki muddati tugagan) `MISS: <kalit>`. `SET` hech narsa chiqarmaydi.\n\nMisol — kiritish:\n```\n5\n1 SET profil Ali 10\n2 GET profil\n11 GET profil\n12 SET profil Vali 5\n13 GET profil\n```\nChiqish:\n```\nprofil=Ali\nMISS: profil\nprofil=Vali\n```",
    "starterCodePy": "# Har bir kalit uchun qiymat va tugash vaqtini (set_vaqt + ttl) saqlang.\n# GET da hozirgi vaqt tugash vaqtidan kichik bo'lsa qiymatni, aks holda MISS ni chiqaring.\n",
    "testCases": [
      {
        "stdin": "5\n1 SET profil Ali 10\n2 GET profil\n11 GET profil\n12 SET profil Vali 5\n13 GET profil\n",
        "expectedStdout": "profil=Ali\nMISS: profil\nprofil=Vali\n",
        "hidden": false,
        "label": "Misoldagi buyruqlar"
      },
      {
        "stdin": "4\n0 SET narx 1500 3\n1 GET narx\n2 GET narx\n5 GET narx\n",
        "expectedStdout": "narx=1500\nnarx=1500\nMISS: narx\n",
        "hidden": false,
        "label": "Bitta kalitni bir necha marta so'rash"
      },
      {
        "stdin": "3\n1 GET yoq\n2 SET yoq bor 1\n2 GET yoq\n",
        "expectedStdout": "MISS: yoq\nyoq=bor\n",
        "hidden": true,
        "label": "Saqlanmagan kalit so'raldi"
      },
      {
        "stdin": "6\n0 SET a 1 5\n3 SET a 2 5\n7 GET a\n8 SET b 9 1\n9 GET b\n9 GET a\n",
        "expectedStdout": "a=2\nMISS: b\nMISS: a\n",
        "hidden": true,
        "label": "Ikki kalit, muddatlar boshqacha"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-77",
    "key": "backend-dars-77-hard",
    "title": "LRU kesh",
    "difficulty": "HARD",
    "points": 35,
    "tags": [
      "python",
      "cache",
      "lru"
    ],
    "description": "Kesh xotirasi cheksiz emas. Joy tugaganda Redis-ga o'xshab eng UZOQ vaqt ishlatilmagan (LRU) kalit chiqarib tashlanadi.\n\nKiritish (stdin):\n- 1-qator: `C` — kesh sig'imi (kalitlar soni, `C >= 1`).\n- 2-qator: `n` — buyruqlar soni.\n- keyingi `n` qator: `SET <kalit> <qiymat>` yoki `GET <kalit>`.\n\nQoidalar:\n- `GET` topilsa `<kalit>=<qiymat>` chiqaradi va bu kalitni ENG YANGI ishlatilganga aylantiradi; topilmasa `MISS: <kalit>` chiqaradi va tartibni o'zgartirmaydi.\n- `SET` kalitni saqlaydi (bor bo'lsa qiymatini yangilaydi) va uni eng yangi ishlatilganga aylantiradi.\n- `SET` yangi kalit qo'shayotganda kesh to'la bo'lsa, avval eng uzoq ishlatilmagan kalit chiqariladi va `Chiqarildi: <kalit>` qatori bosiladi.\n- Oxirida bitta qator: `Keshda: ` va keshdagi kalitlar eng eskidan eng yangisiga qarab, bitta bo'sh joy bilan ajratib. Kesh bo'sh bo'lsa `Keshda: -`.\n\nMisol — kiritish:\n```\n2\n6\nSET a 1\nSET b 2\nGET a\nSET c 3\nGET b\nGET c\n```\nChiqish:\n```\na=1\nChiqarildi: b\nMISS: b\nc=3\nKeshda: a c\n```",
    "starterCodePy": "# Tartibni saqlash uchun oddiy lug'at + kalitlar ro'yxatidan foydalanishingiz mumkin.\n# Har bir muvaffaqiyatli GET va har bir SET kalitni ro'yxat oxiriga ko'chiradi.\n# Sig'im to'lganda ro'yxat boshidagi kalitni chiqarib tashlang.\n",
    "testCases": [
      {
        "stdin": "2\n6\nSET a 1\nSET b 2\nGET a\nSET c 3\nGET b\nGET c\n",
        "expectedStdout": "a=1\nChiqarildi: b\nMISS: b\nc=3\nKeshda: a c\n",
        "hidden": false,
        "label": "Misoldagi buyruqlar"
      },
      {
        "stdin": "3\n5\nSET x 10\nSET y 20\nSET z 30\nGET x\nGET y\n",
        "expectedStdout": "x=10\ny=20\nKeshda: z x y\n",
        "hidden": false,
        "label": "Sig'im yetarli"
      },
      {
        "stdin": "1\n4\nSET a 1\nSET b 2\nGET a\nGET b\n",
        "expectedStdout": "Chiqarildi: a\nMISS: a\nb=2\nKeshda: b\n",
        "hidden": true,
        "label": "Kichik sig'im"
      },
      {
        "stdin": "2\n6\nSET a 1\nSET b 2\nSET a 9\nSET c 3\nGET a\nGET b\n",
        "expectedStdout": "Chiqarildi: b\na=9\nMISS: b\nKeshda: c a\n",
        "hidden": true,
        "label": "Mavjud kalit qayta yozildi"
      },
      {
        "stdin": "3\n4\nGET yoq\nSET k 1\nGET k\nGET k\n",
        "expectedStdout": "MISS: yoq\nk=1\nk=1\nKeshda: k\n",
        "hidden": true,
        "label": "Bo'sh keshdan so'rov"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-78",
    "key": "backend-dars-78-easy",
    "title": "Vazifalar navbati",
    "difficulty": "EASY",
    "points": 10,
    "tags": [
      "python",
      "navbat",
      "fon-vazifa"
    ],
    "description": "Celery'da uzoq ish darhol bajarilmaydi — u NAVBATGA qo'yiladi, worker esa uni kelgan tartibda (birinchi kirgan birinchi chiqadi) oladi. Shu mantiqni sodda ko'rinishda yozing.\n\nKiritish (stdin):\n- 1-qator: `n` — buyruqlar soni.\n- keyingi `n` qator: `ADD <nom>` (navbatga qo'yish) yoki `RUN` (bitta vazifani bajarish).\n\nChiqarish:\n- `ADD <nom>` uchun: `Navbatga qo'shildi: <nom>`;\n- `RUN` uchun: navbat bo'sh bo'lmasa `Bajarildi: <nom>` (eng oldin qo'yilgani), bo'sh bo'lsa `Navbat bo'sh`;\n- oxirida: `Kutayotgan vazifalar: X` — navbatda qolganlar soni.\n\nMisol — kiritish:\n```\n5\nADD email\nADD hisobot\nRUN\nRUN\nRUN\n```\nChiqish:\n```\nNavbatga qo'shildi: email\nNavbatga qo'shildi: hisobot\nBajarildi: email\nBajarildi: hisobot\nNavbat bo'sh\nKutayotgan vazifalar: 0\n```",
    "starterCodePy": "# Navbat uchun ro'yxatdan foydalaning: ADD oxiriga qo'shadi, RUN boshidan oladi.\n# Oxirida navbatda nechta vazifa qolganini chiqaring.\n",
    "testCases": [
      {
        "stdin": "5\nADD email\nADD hisobot\nRUN\nRUN\nRUN\n",
        "expectedStdout": "Navbatga qo'shildi: email\nNavbatga qo'shildi: hisobot\nBajarildi: email\nBajarildi: hisobot\nNavbat bo'sh\nKutayotgan vazifalar: 0\n",
        "hidden": false,
        "label": "Misoldagi buyruqlar"
      },
      {
        "stdin": "4\nADD rasm\nRUN\nADD sms\nADD push\n",
        "expectedStdout": "Navbatga qo'shildi: rasm\nBajarildi: rasm\nNavbatga qo'shildi: sms\nNavbatga qo'shildi: push\nKutayotgan vazifalar: 2\n",
        "hidden": false,
        "label": "Navbatda vazifa qoldi"
      },
      {
        "stdin": "3\nRUN\nRUN\nRUN\n",
        "expectedStdout": "Navbat bo'sh\nNavbat bo'sh\nNavbat bo'sh\nKutayotgan vazifalar: 0\n",
        "hidden": true,
        "label": "Faqat bajarish buyruqlari"
      },
      {
        "stdin": "6\nADD a\nADD b\nADD c\nRUN\nADD d\nRUN\n",
        "expectedStdout": "Navbatga qo'shildi: a\nNavbatga qo'shildi: b\nNavbatga qo'shildi: c\nBajarildi: a\nNavbatga qo'shildi: d\nBajarildi: b\nKutayotgan vazifalar: 2\n",
        "hidden": true,
        "label": "Tartib muhim"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-78",
    "key": "backend-dars-78-medium",
    "title": "Qayta urinish (retry)",
    "difficulty": "MEDIUM",
    "points": 20,
    "tags": [
      "python",
      "retry",
      "fon-vazifa"
    ],
    "description": "Fon vazifasi yiqilishi mumkin (masalan, email serveri javob bermadi). Celery bunday vazifani belgilangan marta QAYTA urinib ko'radi, keyin esa bekor qiladi.\n\nKiritish (stdin):\n- 1-qator: `R` — qo'shimcha urinishlar soni. Ya'ni vazifa jami eng ko'pi bilan `R + 1` marta urinib ko'riladi.\n- 2-qator: `n` — vazifalar soni.\n- keyingi `n` qator: `<nom> <natijalar>` — `natijalar` faqat `F` (yiqildi) va `S` (muvaffaqiyat) harflaridan iborat satr. Uning `k`-harfi `k`-urinish natijasi. Satr uzunligi har doim kamida `R + 1` ga teng.\n\nVazifa birinchi `S` da to'xtaydi. Agar `R + 1` urinishning hammasi `F` bo'lsa — bekor qilinadi.\n\nChiqarish: har bir vazifa uchun bitta qator:\n- `<nom>: <k>-urinishda bajarildi` — `k` muvaffaqiyatli urinish raqami (1 dan boshlanadi);\n- `<nom>: <R+1> urinishdan keyin bekor qilindi`.\n\nMisol — kiritish:\n```\n2\n3\nemail FFS\nhisobot SFF\nrasm FFF\n```\nChiqish:\n```\nemail: 3-urinishda bajarildi\nhisobot: 1-urinishda bajarildi\nrasm: 3 urinishdan keyin bekor qilindi\n```",
    "starterCodePy": "# Har bir vazifa uchun eng ko'pi bilan R + 1 ta urinishni ko'rib chiqing.\n# Birinchi 'S' uchraganda to'xtang va urinish raqamini chiqaring.\n",
    "testCases": [
      {
        "stdin": "2\n3\nemail FFS\nhisobot SFF\nrasm FFF\n",
        "expectedStdout": "email: 3-urinishda bajarildi\nhisobot: 1-urinishda bajarildi\nrasm: 3 urinishdan keyin bekor qilindi\n",
        "hidden": false,
        "label": "Misoldagi vazifalar"
      },
      {
        "stdin": "1\n2\nsms FS\npush FF\n",
        "expectedStdout": "sms: 2-urinishda bajarildi\npush: 2 urinishdan keyin bekor qilindi\n",
        "hidden": false,
        "label": "Bitta qo'shimcha urinish"
      },
      {
        "stdin": "0\n3\na S\nb F\nc S\n",
        "expectedStdout": "a: 1-urinishda bajarildi\nb: 1 urinishdan keyin bekor qilindi\nc: 1-urinishda bajarildi\n",
        "hidden": true,
        "label": "Qo'shimcha urinishsiz rejim"
      },
      {
        "stdin": "3\n2\nbackup FFFS\nclean FFFF\n",
        "expectedStdout": "backup: 4-urinishda bajarildi\nclean: 4 urinishdan keyin bekor qilindi\n",
        "hidden": true,
        "label": "Uzoq urinishlar zanjiri"
      },
      {
        "stdin": "2\n1\nsync FFSSS\n",
        "expectedStdout": "sync: 3-urinishda bajarildi\n",
        "hidden": true,
        "label": "Natijalar satri chegaradan uzun"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-80",
    "key": "backend-dars-80-easy",
    "title": ".dockerignore filtri",
    "difficulty": "EASY",
    "points": 10,
    "tags": [
      "python",
      "docker",
      "fnmatch"
    ],
    "description": "`.dockerignore` image ichiga tushmasligi kerak bo'lgan fayllarni chiqarib tashlaydi — `.venv`, `.git`, `.pyc` fayllar image'ni bekorga og'irlashtiradi.\n\nKiritish (stdin):\n- 1-qator: `p` — shablonlar soni;\n- keyingi `p` qator: shablonlar (masalan `*.pyc`, `.git`);\n- keyingi qator: `f` — fayllar soni;\n- keyingi `f` qator: fayl yo'llari.\n\nFayl CHIQARIB TASHLANADI, agar kamida bitta `shablon` uchun quyidagilardan biri to'g'ri bo'lsa:\n- `fnmatch(yo'l, shablon)` rost (standart kutubxonadagi `from fnmatch import fnmatch`);\n- yo'l `shablon + \"/\"` bilan boshlanadi (ya'ni fayl o'sha papka ichida).\n\nChiqarish: image'ga tushadigan fayllar kiritish tartibida, har biri alohida qatorda; oxirida `Nusxalanadi: X`.\n\nMisol — kiritish:\n```\n3\n*.pyc\n.git\n.venv\n5\nmanage.py\napp/views.py\napp/views.pyc\n.git/config\n.venv/lib/os.py\n```\nChiqish:\n```\nmanage.py\napp/views.py\nNusxalanadi: 2\n```",
    "starterCodePy": "from fnmatch import fnmatch\n\n# Shablonlar va fayllarni o'qing.\n# Har bir fayl uchun: biror shablonga fnmatch mos kelsa yoki yo'l shablon + '/' bilan\n# boshlansa — u chiqarib tashlanadi. Qolganlarini chiqaring va sanang.\n",
    "testCases": [
      {
        "stdin": "3\n*.pyc\n.git\n.venv\n5\nmanage.py\napp/views.py\napp/views.pyc\n.git/config\n.venv/lib/os.py\n",
        "expectedStdout": "manage.py\napp/views.py\nNusxalanadi: 2\n",
        "hidden": false,
        "label": "Misoldagi ro'yxat"
      },
      {
        "stdin": "2\n*.log\nmedia\n4\napp.py\ndebug.log\nmedia/rasm.png\nREADME.md\n",
        "expectedStdout": "app.py\nREADME.md\nNusxalanadi: 2\n",
        "hidden": false,
        "label": "Log va papka shabloni"
      },
      {
        "stdin": "1\n*.tmp\n3\na.py\nb.py\nc.py\n",
        "expectedStdout": "a.py\nb.py\nc.py\nNusxalanadi: 3\n",
        "hidden": true,
        "label": "Hech narsa mos kelmadi"
      },
      {
        "stdin": "2\n*\nnode_modules\n2\nmain.py\nnode_modules/x.js\n",
        "expectedStdout": "Nusxalanadi: 0\n",
        "hidden": true,
        "label": "Keng qamrovli shablon"
      },
      {
        "stdin": "3\n.venv\n__pycache__\n*.sqlite3\n4\n__pycache__/main.cpython-310.pyc\ndb.sqlite3\nsrc/app.py\n.venv/bin/python\n",
        "expectedStdout": "src/app.py\nNusxalanadi: 1\n",
        "hidden": true,
        "label": "Aralash yo'llar"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-80",
    "key": "backend-dars-80-medium",
    "title": "Qatlam keshi",
    "difficulty": "MEDIUM",
    "points": 20,
    "tags": [
      "python",
      "docker",
      "cache"
    ],
    "description": "Dockerfile'ning har bir satri — alohida qatlam. Docker qatlamni keshdan oladi, lekin qaysidir qatlam o'zgarsa, undan KEYINGI hamma qatlam qaytadan quriladi. Aynan shuning uchun `requirements.txt` koddan oldin nusxalanadi.\n\nKiritish (stdin):\n- 1-qator: `n` — Dockerfile satrlari soni;\n- keyingi `n` qator: `COPY <manba> <maqsad>` yoki `RUN <buyruq>` (buyruq ichida bo'sh joy bo'lishi mumkin);\n- keyingi qator: `m` — o'zgargan fayllar soni;\n- keyingi `m` qator: o'zgargan fayl nomlari.\n\nQoidalar:\n- `COPY` qatlami buziladi, agar uning `<manba>`si o'zgargan fayllar ro'yxatida bo'lsa, YOKI `<manba>` `.` bo'lsa va o'zgargan fayl umuman bo'lsa (`m > 0`);\n- `RUN` qatlami o'zi buzilmaydi;\n- biror qatlam buzilsa, undan keyingi BARCHA qatlamlar ham qayta quriladi.\n\nChiqarish: har bir qatlam uchun `<i>: CACHED` yoki `<i>: QAYTA QURILADI` (`i` 1 dan boshlanadi), oxirida `Qayta quriladi: X ta qatlam`.\n\nMisol — kiritish:\n```\n4\nCOPY requirements.txt /app/\nRUN pip install -r requirements.txt\nCOPY . /app/\nRUN python manage.py collectstatic\n2\nviews.py\nurls.py\n```\nChiqish:\n```\n1: CACHED\n2: CACHED\n3: QAYTA QURILADI\n4: QAYTA QURILADI\nQayta quriladi: 2 ta qatlam\n```",
    "starterCodePy": "# Qatlamlarni tepadan pastga ko'rib chiqing va 'buzildi' bayrog'ini saqlang.\n# Bayroq bir marta ko'tarilsa, qolgan hamma qatlam qayta quriladi.\n",
    "testCases": [
      {
        "stdin": "4\nCOPY requirements.txt /app/\nRUN pip install -r requirements.txt\nCOPY . /app/\nRUN python manage.py collectstatic\n2\nviews.py\nurls.py\n",
        "expectedStdout": "1: CACHED\n2: CACHED\n3: QAYTA QURILADI\n4: QAYTA QURILADI\nQayta quriladi: 2 ta qatlam\n",
        "hidden": false,
        "label": "Misoldagi Dockerfile"
      },
      {
        "stdin": "4\nCOPY requirements.txt /app/\nRUN pip install -r requirements.txt\nCOPY . /app/\nRUN python manage.py collectstatic\n1\nrequirements.txt\n",
        "expectedStdout": "1: QAYTA QURILADI\n2: QAYTA QURILADI\n3: QAYTA QURILADI\n4: QAYTA QURILADI\nQayta quriladi: 4 ta qatlam\n",
        "hidden": false,
        "label": "Boshqa fayl o'zgardi"
      },
      {
        "stdin": "3\nCOPY manage.py /app/\nRUN echo salom\nCOPY . /app/\n0\n",
        "expectedStdout": "1: CACHED\n2: CACHED\n3: CACHED\nQayta quriladi: 0 ta qatlam\n",
        "hidden": true,
        "label": "O'zgargan fayl yo'q"
      },
      {
        "stdin": "5\nRUN apt-get update\nCOPY setup.py /app/\nRUN pip install -e .\nCOPY src /app/src\nRUN pytest\n2\nsrc\nREADME.md\n",
        "expectedStdout": "1: CACHED\n2: CACHED\n3: CACHED\n4: QAYTA QURILADI\n5: QAYTA QURILADI\nQayta quriladi: 2 ta qatlam\n",
        "hidden": true,
        "label": "O'rtadagi qatlam buzildi"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-81",
    "key": "backend-dars-81-easy",
    "title": "Birinchi ishga tushadigan xizmatlar",
    "difficulty": "EASY",
    "points": 10,
    "tags": [
      "python",
      "docker-compose",
      "bog'liqlik"
    ],
    "description": "`docker-compose.yml` da har bir xizmat `depends_on` orqali boshqalariga bog'lanadi. Hech kimga bog'liq bo'lmagan xizmatlar birinchi bo'lib ko'tariladi.\n\nKiritish (stdin):\n- 1-qator: `n` — xizmatlar soni;\n- keyingi `n` qator: `<xizmat>: <bog'liqlik1> <bog'liqlik2> ...` yoki bog'liqligi bo'lmasa `<xizmat>: -`.\n\nChiqarish: bog'liqligi yo'q xizmatlar nomi ALIFBO tartibida, har biri alohida qatorda; oxirida `Jami: X`.\n\nMisol — kiritish:\n```\n4\nweb: db redis\ndb: -\nredis: -\nworker: redis db\n```\nChiqish:\n```\ndb\nredis\nJami: 2\n```",
    "starterCodePy": "# Har bir qatorni ':' bo'yicha ajrating.\n# O'ng tomoni '-' bo'lgan xizmatlarni yig'ing, alifbo bo'yicha saralab chiqaring.\n",
    "testCases": [
      {
        "stdin": "4\nweb: db redis\ndb: -\nredis: -\nworker: redis db\n",
        "expectedStdout": "db\nredis\nJami: 2\n",
        "hidden": false,
        "label": "Misoldagi xizmatlar"
      },
      {
        "stdin": "3\napp: postgres\npostgres: -\nnginx: app\n",
        "expectedStdout": "postgres\nJami: 1\n",
        "hidden": false,
        "label": "Bitta mustaqil xizmat"
      },
      {
        "stdin": "2\na: b\nb: a\n",
        "expectedStdout": "Jami: 0\n",
        "hidden": true,
        "label": "Mustaqil xizmat topilmadi"
      },
      {
        "stdin": "5\nredis: -\ndb: -\nmailhog: -\nweb: db redis\nworker: redis\n",
        "expectedStdout": "db\nmailhog\nredis\nJami: 3\n",
        "hidden": true,
        "label": "Bir nechta mustaqil xizmat"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-81",
    "key": "backend-dars-81-medium",
    "title": "Ishga tushish tartibi",
    "difficulty": "MEDIUM",
    "points": 20,
    "tags": [
      "python",
      "docker-compose",
      "tartib"
    ],
    "description": "`docker compose up` xizmatlarni tasodifiy tartibda emas, bog'liqliklarga qarab ko'taradi: avval hech kimga bog'liq bo'lmaganlari, keyin ularga tayanadiganlari.\n\nKiritish (stdin):\n- 1-qator: `n` — xizmatlar soni;\n- keyingi `n` qator: `<xizmat>: <bog'liqlik1> <bog'liqlik2> ...` yoki `<xizmat>: -`.\n\nHar bir bog'liqlik albatta ro'yxatdagi xizmatlardan biri.\n\nAlgoritm: har qadamda hali ko'tarilmagan va BARCHA bog'liqliklari allaqachon ko'tarilgan xizmatlardan ALIFBO bo'yicha eng kichigini tanlang va ko'taring. Shu tartibni har birini alohida qatorda chiqaring.\n\nAgar biror qadamda hech qanday xizmatni ko'tarib bo'lmasa (bog'liqliklar halqasi), boshqa hech narsa chiqarmasdan FAQAT bitta `SIKL` qatorini chiqaring.\n\nMisol — kiritish:\n```\n4\nweb: db redis\ndb: -\nredis: -\nworker: redis db\n```\nChiqish:\n```\ndb\nredis\nweb\nworker\n```",
    "starterCodePy": "# Har bir xizmat uchun bog'liqliklar to'plamini saqlang.\n# Sikl bilan: tayyor xizmatlardan alifbo bo'yicha eng kichigini tanlab, ro'yxatga qo'shing.\n# Hech biri tayyor bo'lmasa — faqat SIKL chiqaring (avvalgi natijalarni chiqarmang).\n",
    "testCases": [
      {
        "stdin": "4\nweb: db redis\ndb: -\nredis: -\nworker: redis db\n",
        "expectedStdout": "db\nredis\nweb\nworker\n",
        "hidden": false,
        "label": "Misoldagi xizmatlar"
      },
      {
        "stdin": "3\nnginx: app\napp: postgres\npostgres: -\n",
        "expectedStdout": "postgres\napp\nnginx\n",
        "hidden": false,
        "label": "Uzun zanjir"
      },
      {
        "stdin": "2\na: b\nb: a\n",
        "expectedStdout": "SIKL\n",
        "hidden": true,
        "label": "Bog'liqliklar bir-biriga qarama-qarshi"
      },
      {
        "stdin": "6\nweb: db redis\nworker: redis db\ndb: -\nredis: -\nbeat: worker\nnginx: web\n",
        "expectedStdout": "db\nredis\nweb\nnginx\nworker\nbeat\n",
        "hidden": true,
        "label": "Ko'p xizmatli tizim"
      },
      {
        "stdin": "1\nsolo: -\n",
        "expectedStdout": "solo\n",
        "hidden": true,
        "label": "Yagona xizmat"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-82",
    "key": "backend-dars-82-easy",
    "title": "Ruxsatlarni sakkizlik songa aylantirish",
    "difficulty": "EASY",
    "points": 10,
    "tags": [
      "python",
      "linux",
      "chmod"
    ],
    "description": "Serverda `ls -l` fayl ruxsatlarini `rwxr-xr--` ko'rinishida ko'rsatadi, `chmod` esa sakkizlik son bilan ishlaydi. Ikkalasini bir-biriga o'gira olish kerak.\n\nKiritish (stdin):\n- 1-qator: `n` — qatorlar soni;\n- keyingi `n` qator: aynan 9 ta belgidan iborat ruxsat satri (`r`, `w`, `x` yoki `-`). Birinchi 3 belgi — egasi, keyingi 3 — guruh, oxirgi 3 — boshqalar.\n\nHar bir uchlik uchun: `r` = 4, `w` = 2, `x` = 1, `-` = 0. Uchlikdagi sonlar qo'shiladi.\n\nChiqarish: har bir satr uchun 3 raqamli son (masalan `754`), alohida qatorda.\n\nMisol — kiritish:\n```\n3\nrwxr-xr--\nrw-r--r--\nrwxrwxrwx\n```\nChiqish:\n```\n754\n644\n777\n```",
    "starterCodePy": "# Har bir ruxsat satrini 3 tadan bo'lib chiqing.\n# r=4, w=2, x=1, '-'=0 — uchlikdagi qiymatlarni qo'shing va uchta raqamni yonma-yon chiqaring.\n",
    "testCases": [
      {
        "stdin": "3\nrwxr-xr--\nrw-r--r--\nrwxrwxrwx\n",
        "expectedStdout": "754\n644\n777\n",
        "hidden": false,
        "label": "Misoldagi ruxsatlar"
      },
      {
        "stdin": "2\nrw-------\nr-xr-x---\n",
        "expectedStdout": "600\n550\n",
        "hidden": false,
        "label": "Cheklangan ruxsatlar"
      },
      {
        "stdin": "2\n---------\nrwxrwxrwx\n",
        "expectedStdout": "000\n777\n",
        "hidden": true,
        "label": "Chegaraviy qiymatlar"
      },
      {
        "stdin": "4\n-w--w--w-\n--x--x--x\nr--r--r--\nrwxr-x---\n",
        "expectedStdout": "222\n111\n444\n750\n",
        "hidden": true,
        "label": "Har xil kombinatsiyalar"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-82",
    "key": "backend-dars-82-medium",
    "title": "Bloklash ro'yxati",
    "difficulty": "MEDIUM",
    "points": 20,
    "tags": [
      "python",
      "linux",
      "log",
      "xavfsizlik"
    ],
    "description": "Internetdagi serverga SSH orqali kirishga urinishlar to'xtovsiz bo'ladi. `auth.log` ni o'qib, ko'p marta xato parol kiritgan IP'larni topamiz — ular firewall'da bloklanadi.\n\nKiritish (stdin):\n- 1-qator: `T` — bloklash chegarasi;\n- 2-qator: `n` — log qatorlari soni;\n- keyingi `n` qator: log yozuvlari. Har bir qatorning OXIRGI so'zi — IP manzil. Qator ichida `Failed` so'zi bo'lsa — bu muvaffaqiyatsiz urinish; qolgan qatorlar hisobga olinmaydi.\n\nChiqarish: urinishlar soni `T` dan kam bo'lmagan IP'lar. Avval urinishlar soni bo'yicha KAMAYISH tartibida, teng bo'lsa IP satri bo'yicha alifbo tartibida. Format: `<IP> <soni>`. Bunday IP topilmasa, bitta `Bloklash shart emas` qatorini chiqaring.\n\nMisol — kiritish:\n```\n2\n5\n10:01 sshd: Failed password for root from 5.5.5.5\n10:02 sshd: Failed password for admin from 5.5.5.5\n10:03 sshd: Accepted password for ali from 8.8.8.8\n10:04 sshd: Failed password for root from 9.9.9.9\n10:05 sshd: Failed password for root from 5.5.5.5\n```\nChiqish:\n```\n5.5.5.5 3\n```",
    "starterCodePy": "# Har bir qatorda 'Failed' bor-yo'qligini tekshiring, oxirgi so'zni IP sifatida oling.\n# Sanoqni lug'atda yig'ing, chegaradan o'tganlarini saralab chiqaring.\n",
    "testCases": [
      {
        "stdin": "2\n5\n10:01 sshd: Failed password for root from 5.5.5.5\n10:02 sshd: Failed password for admin from 5.5.5.5\n10:03 sshd: Accepted password for ali from 8.8.8.8\n10:04 sshd: Failed password for root from 9.9.9.9\n10:05 sshd: Failed password for root from 5.5.5.5\n",
        "expectedStdout": "5.5.5.5 3\n",
        "hidden": false,
        "label": "Misoldagi log"
      },
      {
        "stdin": "1\n4\n11:00 sshd: Failed password for root from 1.2.3.4\n11:01 sshd: Accepted password for ali from 1.2.3.4\n11:02 sshd: Failed password for root from 4.4.4.4\n11:03 sshd: Failed password for test from 4.4.4.4\n",
        "expectedStdout": "4.4.4.4 2\n1.2.3.4 1\n",
        "hidden": false,
        "label": "Past chegara"
      },
      {
        "stdin": "3\n3\n12:00 sshd: Failed password for root from 7.7.7.7\n12:01 sshd: Failed password for root from 8.8.8.8\n12:02 sshd: Accepted password for ali from 9.9.9.9\n",
        "expectedStdout": "Bloklash shart emas\n",
        "hidden": true,
        "label": "Chegaradan o'tmadi"
      },
      {
        "stdin": "2\n6\n13:00 sshd: Failed password for root from 2.2.2.2\n13:01 sshd: Failed password for root from 2.2.2.2\n13:02 sshd: Failed password for root from 1.1.1.1\n13:03 sshd: Failed password for root from 1.1.1.1\n13:04 sshd: Failed password for root from 3.3.3.3\n13:05 sshd: Accepted password for ali from 3.3.3.3\n",
        "expectedStdout": "1.1.1.1 2\n2.2.2.2 2\n",
        "hidden": true,
        "label": "Teng sonli urinishlar"
      }
    ]
  }
];
