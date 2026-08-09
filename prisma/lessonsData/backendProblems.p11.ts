import type { LessonProblemRecord } from './types';

/**
 * Hand-authored practice problems for backend lessons 83-89 (Deployment va Yakuniy loyiha).
 *
 * These lessons are graded mostly by their rubric homework (server sozlash, deploy, ER diagram,
 * loyiha skeleti, Postman kolleksiyasi) — a stdout comparison cannot honestly verify any of that.
 * Only the genuinely pure-Python core of a lesson is auto-graded here, so the coverage is partial
 * by design:
 *   83 — medium only (Nginx location prefix matching). O'rnatish/sozlash qismi rubrika bilan.
 *   84 — easy + medium (.env parser, check --deploy qoidalari). Deploy/CI amali rubrika bilan.
 *   85 — NO problems. G'oya, user story, MoSCoW — matnli hujjat, faqat rubrika baholay oladi.
 *   86 — medium only (ER kardinallik -> jadval/FK/junction qoidasi).
 *   87 — medium only (base + prod sozlamalarini birlashtirish). Struktura qurish rubrika bilan.
 *   88 — easy + medium (serializer validatsiyasi, router metod -> action).
 *   89 — medium only (tranzaksiya atomikligi). services.py refaktori rubrika bilan.
 * No HARD tier is written: at this stage the QIYIN tiers are all real-project work.
 * Every `expectedStdout` below was captured from a reference solution actually executed on the
 * Piston sandbox (python 3.10.0) against the matching `stdin` — none are written from memory.
 */
export const backendProblemsP11: LessonProblemRecord[] = [
  {
    "lessonKey": "backend-dars-83",
    "key": "backend-dars-83-medium",
    "title": "Nginx yo'naltirish jadvali",
    "difficulty": "MEDIUM",
    "points": 20,
    "tags": [
      "nginx",
      "deployment",
      "yonaltirish"
    ],
    "description": "Nginx loyihaning oldida turadi: `location` prefikslariga qarab so'rovni yo statik fayllarga, yo Gunicorn'ga uzatadi. Shu tanlovni Python'da modellashtiring.\n\nKiritish (stdin):\n- 1-qator: `n` — location'lar soni.\n- keyingi `n` qator: `<prefiks> <manzil>`, bu yerda manzil faqat `static` yoki `gunicorn` bo'ladi.\n- keyingi qator: `m` — so'rovlar soni.\n- keyingi `m` qator: har birida bitta URL.\n\nHar bir URL uchun ANIQ shu ko'rinishda bitta qator chiqaring:\n\n```\n<URL> -> <manzil>\n```\n\nQoidalar:\n- URL prefiks bilan BOSHLANSA, u mos hisoblanadi.\n- Bir nechta prefiks mos kelsa, ENG UZUN prefiks g'olib (Nginx ham shunday ishlaydi).\n- Hech bir prefiks mos kelmasa, manzil o'rniga `404` yozing.\n\nNamuna kiritish:\n\n```\n3\n/static/ static\n/media/ static\n/ gunicorn\n4\n/static/css/app.css\n/api/books/\n/\n/media/img/a.png\n```\n\nNamuna chiqish:\n\n```\n/static/css/app.css -> static\n/api/books/ -> gunicorn\n/ -> gunicorn\n/media/img/a.png -> static\n```\n\n`->` belgisining ikki tomonida bittadan bo'sh joy bo'ladi.",
    "starterCodePy": "import sys\n\n# 1) location'lar ro'yxatini o'qing: (prefiks, manzil)\n# 2) har bir URL uchun eng uzun mos prefiksni toping\n# 3) \"<URL> -> <manzil>\" ko'rinishida chiqaring, mos kelmasa \"404\"\ndata = sys.stdin.read().split(\"\\n\")\n",
    "testCases": [
      {
        "stdin": "3\n/static/ static\n/media/ static\n/ gunicorn\n4\n/static/css/app.css\n/api/books/\n/\n/media/img/a.png\n",
        "expectedStdout": "/static/css/app.css -> static\n/api/books/ -> gunicorn\n/ -> gunicorn\n/media/img/a.png -> static\n",
        "hidden": false,
        "label": "Namunadagi konfiguratsiya to'g'ri yo'naltirildi"
      },
      {
        "stdin": "2\n/static/ static\n/ gunicorn\n3\n/static/\n/admin/login/\n/staticfiles/x.js\n",
        "expectedStdout": "/static/ -> static\n/admin/login/ -> gunicorn\n/staticfiles/x.js -> gunicorn\n",
        "hidden": false,
        "label": "Prefiks chegarasi hisobga olindi"
      },
      {
        "stdin": "2\n/static/ static\n/api/ gunicorn\n3\n/static/a.css\n/api/v1/\n/salom\n",
        "expectedStdout": "/static/a.css -> static\n/api/v1/ -> gunicorn\n/salom -> 404\n",
        "hidden": true,
        "label": "Mos prefiks topilmagan holat"
      },
      {
        "stdin": "3\n/ gunicorn\n/static/ static\n/static/admin/ gunicorn\n3\n/static/admin/base.css\n/static/site.css\n/uy\n",
        "expectedStdout": "/static/admin/base.css -> gunicorn\n/static/site.css -> static\n/uy -> gunicorn\n",
        "hidden": true,
        "label": "Eng uzun mos prefiks tanlandi"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-84",
    "key": "backend-dars-84-easy",
    "title": ".env faylini o'qish",
    "difficulty": "EASY",
    "points": 10,
    "tags": [
      "deployment",
      "env",
      "sozlamalar"
    ],
    "description": "Deploy'da sozlamalar kod ichida emas, `.env` faylida turadi. Shu faylni o'qiydigan mini-parser yozing.\n\nKiritish (stdin) ikki qismdan iborat:\n1. `.env` fayl qatorlari;\n2. `---` chegara qatori;\n3. undan keyin — so'raladigan kalitlar, har biri alohida qatorda.\n\n`.env` qismini o'qish qoidalari:\n- bo'sh qator va `#` bilan boshlangan izoh qatori tashlab yuboriladi;\n- `=` belgisi umuman yo'q qator ham tashlab yuboriladi;\n- qator faqat BIRINCHI `=` bo'yicha bo'linadi (qiymat ichida `=` bo'lishi mumkin);\n- kalit va qiymat atrofidagi bo'sh joylar olib tashlanadi.\n\nHar bir so'ralgan kalit uchun bitta qator chiqaring: `KALIT=QIYMAT`. Agar bunday kalit topilmasa, qiymat o'rniga `YO'Q` yozing. Tartib — so'ralgan tartib.\n\nNamuna kiritish:\n\n```\n# ishlab chiqarish sozlamalari\nDEBUG=False\nSECRET_KEY=abc123\n\nDB_HOST = localhost\n---\nDEBUG\nDB_HOST\nDB_PORT\n```\n\nNamuna chiqish:\n\n```\nDEBUG=False\nDB_HOST=localhost\nDB_PORT=YO'Q\n```",
    "starterCodePy": "import sys\n\n# 1) \"---\" qatoriga qadar bo'lgan qismni lug'atga yig'ing\n# 2) izoh (#), bo'sh qator va \"=\" bo'lmagan qatorni tashlang\n# 3) \"---\" dan keyingi kalitlarni navbatma-navbat chiqaring\nlines = sys.stdin.read().split(\"\\n\")\n",
    "testCases": [
      {
        "stdin": "# ishlab chiqarish sozlamalari\nDEBUG=False\nSECRET_KEY=abc123\n\nDB_HOST = localhost\n---\nDEBUG\nDB_HOST\nDB_PORT\n",
        "expectedStdout": "DEBUG=False\nDB_HOST=localhost\nDB_PORT=YO'Q\n",
        "hidden": false,
        "label": "Izoh va bo'sh qatorlar tashlab yuborildi"
      },
      {
        "stdin": "A=1\nB=2\n---\nB\nA\n",
        "expectedStdout": "B=2\nA=1\n",
        "hidden": false,
        "label": "Kalitlar so'ralgan tartibda chiqdi"
      },
      {
        "stdin": "URL=postgres://u:p@host:5432/db\n#DEBUG=True\n---\nURL\nDEBUG\n",
        "expectedStdout": "URL=postgres://u:p@host:5432/db\nDEBUG=YO'Q\n",
        "hidden": true,
        "label": "Qiymat ichidagi belgilar saqlanadi"
      },
      {
        "stdin": "---\nSECRET_KEY\n",
        "expectedStdout": "SECRET_KEY=YO'Q\n",
        "hidden": true,
        "label": "Bo'sh sozlama fayli"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-84",
    "key": "backend-dars-84-medium",
    "title": "Deploy oldidan tekshiruv",
    "difficulty": "MEDIUM",
    "points": 20,
    "tags": [
      "deployment",
      "xavfsizlik",
      "tekshiruv"
    ],
    "description": "`manage.py check --deploy` loyihani internetga chiqarishdan oldin xavfli sozlamalarni topadi. Shunday tekshiruvning soddalashtirilgan versiyasini yozing.\n\nKiritish (stdin): `KALIT=QIYMAT` ko'rinishidagi qatorlar. `=` bo'lmagan va bo'sh qatorlarni tashlab yuboring, kalit va qiymat atrofidagi bo'sh joylarni olib tashlang. Kalit takrorlansa — oxirgisi kuchda qoladi.\n\nUchta qoidani ANIQ shu tartibda tekshiring va buzilganini chiqaring:\n1. `DEBUG` qiymati aynan `False` bo'lmasa (yoki kalit umuman bo'lmasa) →\n   `OGOHLANTIRISH: DEBUG=False bo'lishi kerak`\n2. `SECRET_KEY` qiymati 20 ta belgidan qisqa bo'lsa (yoki kalit bo'lmasa) →\n   `OGOHLANTIRISH: SECRET_KEY juda qisqa yoki yo'q`\n3. `ALLOWED_HOSTS` qiymati bo'sh bo'lsa (yoki kalit bo'lmasa) →\n   `OGOHLANTIRISH: ALLOWED_HOSTS bo'sh`\n\nOxirida har doim yakuniy qator chiqariladi: `Jami: <son> ta ogohlantirish`.\n\nNamuna kiritish:\n\n```\nDEBUG=True\nSECRET_KEY=qisqa\nALLOWED_HOSTS=\n```\n\nNamuna chiqish:\n\n```\nOGOHLANTIRISH: DEBUG=False bo'lishi kerak\nOGOHLANTIRISH: SECRET_KEY juda qisqa yoki yo'q\nOGOHLANTIRISH: ALLOWED_HOSTS bo'sh\nJami: 3 ta ogohlantirish\n```\n\nHech qanday qoida buzilmasa faqat `Jami: 0 ta ogohlantirish` qatori chiqadi. Kalitlar katta-kichik harf bilan aynan mos kelishi kerak (`debug` — bu `DEBUG` emas).",
    "starterCodePy": "import sys\n\n# 1) sozlamalarni lug'atga yig'ing (faqat birinchi \"=\" bo'yicha bo'ling)\n# 2) DEBUG -> SECRET_KEY -> ALLOWED_HOSTS tartibida tekshiring\n# 3) ogohlantirishlarni, so'ng \"Jami: N ta ogohlantirish\" qatorini chiqaring\ncfg = {}\n",
    "testCases": [
      {
        "stdin": "DEBUG=True\nSECRET_KEY=qisqa\nALLOWED_HOSTS=\n",
        "expectedStdout": "OGOHLANTIRISH: DEBUG=False bo'lishi kerak\nOGOHLANTIRISH: SECRET_KEY juda qisqa yoki yo'q\nOGOHLANTIRISH: ALLOWED_HOSTS bo'sh\nJami: 3 ta ogohlantirish\n",
        "hidden": false,
        "label": "Uchala qoida buzilgan holat"
      },
      {
        "stdin": "DEBUG=False\nSECRET_KEY=j8s7d6f5g4h3j2k1l0z9x8c7v6\nALLOWED_HOSTS=example.uz\n",
        "expectedStdout": "Jami: 0 ta ogohlantirish\n",
        "hidden": false,
        "label": "To'g'ri sozlangan loyiha"
      },
      {
        "stdin": "DEBUG=False\nALLOWED_HOSTS=example.uz\n",
        "expectedStdout": "OGOHLANTIRISH: SECRET_KEY juda qisqa yoki yo'q\nJami: 1 ta ogohlantirish\n",
        "hidden": true,
        "label": "Yetishmayotgan kalit holati"
      },
      {
        "stdin": "DEBUG=True\nSECRET_KEY=012345678901234567890\nALLOWED_HOSTS=a.uz,b.uz\n",
        "expectedStdout": "OGOHLANTIRISH: DEBUG=False bo'lishi kerak\nJami: 1 ta ogohlantirish\n",
        "hidden": true,
        "label": "Faqat bitta qoida buzilgan"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-86",
    "key": "backend-dars-86-medium",
    "title": "ER munosabatlarini jadvalga o'girish",
    "difficulty": "MEDIUM",
    "points": 20,
    "tags": [
      "er-diagram",
      "modellar",
      "baza"
    ],
    "description": "ER diagrammadagi munosabatni jadval strukturasiga o'girish qoidasi aniq: 1:N da FK «ko'p» tomonda turadi, N:M esa alohida junction jadval talab qiladi. Shu o'girishni dastur qilib yozing.\n\nKiritish (stdin):\n- 1-qator: `n` — munosabatlar soni.\n- keyingi `n` qator: `<A> <kardinallik> <B>`, kardinallik faqat `1:1`, `1:N`, `N:1` yoki `N:M` bo'ladi. Entity nomlari bitta so'z.\n\nHar bir munosabat uchun kiritilgan tartibda bitta qator chiqaring:\n\n| Kardinallik | Chiqadigan qator |\n| --- | --- |\n| `A 1:1 B` | `B jadvaliga A_id (UNIQUE FK)` |\n| `A 1:N B` | `B jadvaliga A_id (FK)` |\n| `A N:1 B` | `A jadvaliga B_id (FK)` |\n| `A N:M B` | `AB junction jadvali` |\n\nEng oxirida yakuniy qator: `Junction jadvallar: <son>` — bu N:M munosabatlar soni.\n\nNamuna kiritish:\n\n```\n4\nAuthor 1:N Book\nStudent N:M Course\nUser 1:1 Profile\nBook N:1 Publisher\n```\n\nNamuna chiqish:\n\n```\nBook jadvaliga Author_id (FK)\nStudentCourse junction jadvali\nProfile jadvaliga User_id (UNIQUE FK)\nBook jadvaliga Publisher_id (FK)\nJunction jadvallar: 1\n```\n\nNomlar kiritilgandagidek yoziladi — katta-kichik harfni o'zgartirmang.",
    "starterCodePy": "import sys\n\n# 1) munosabatlar sonini va qatorlarni o'qing\n# 2) har bir kardinallik uchun kerakli qatorni chiqaring\n# 3) oxirida \"Junction jadvallar: N\" qatorini chiqaring\nlines = [l.strip() for l in sys.stdin.read().split(\"\\n\") if l.strip()]\n",
    "testCases": [
      {
        "stdin": "4\nAuthor 1:N Book\nStudent N:M Course\nUser 1:1 Profile\nBook N:1 Publisher\n",
        "expectedStdout": "Book jadvaliga Author_id (FK)\nStudentCourse junction jadvali\nProfile jadvaliga User_id (UNIQUE FK)\nBook jadvaliga Publisher_id (FK)\nJunction jadvallar: 1\n",
        "hidden": false,
        "label": "Namunadagi to'rt munosabat"
      },
      {
        "stdin": "2\nOrder 1:N OrderItem\nProduct 1:N OrderItem\n",
        "expectedStdout": "OrderItem jadvaliga Order_id (FK)\nOrderItem jadvaliga Product_id (FK)\nJunction jadvallar: 0\n",
        "hidden": false,
        "label": "Junction kerak bo'lmagan holat"
      },
      {
        "stdin": "3\nPost N:M Tag\nUser N:M Group\nUser N:M Post\n",
        "expectedStdout": "PostTag junction jadvali\nUserGroup junction jadvali\nUserPost junction jadvali\nJunction jadvallar: 3\n",
        "hidden": true,
        "label": "Faqat N:M munosabatlar"
      },
      {
        "stdin": "1\nCity 1:1 Mayor\n",
        "expectedStdout": "Mayor jadvaliga City_id (UNIQUE FK)\nJunction jadvallar: 0\n",
        "hidden": true,
        "label": "Bitta 1:1 munosabat"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-87",
    "key": "backend-dars-87-medium",
    "title": "base va prod sozlamalarini birlashtirish",
    "difficulty": "MEDIUM",
    "points": 20,
    "tags": [
      "sozlamalar",
      "django",
      "konfiguratsiya"
    ],
    "description": "`config/settings/` ichida `base.py` umumiy sozlamalarni saqlaydi, `prod.py` esa `base` ni import qilib, ba'zilarini qayta yozadi. Shu birlashtirish mantig'ini yozing.\n\nKiritish (stdin):\n- `BASE` markeri, undan keyin base sozlamalari `KALIT=QIYMAT` ko'rinishida;\n- `OVERRIDE` markeri, undan keyin ustidan yoziladigan sozlamalar;\n- `END` markeri — undan keyingi barcha qatorlar butunlay e'tiborsiz qoldiriladi.\n\nBirlashtirish qoidasi: `OVERRIDE` bo'limidagi kalit `BASE` da bo'lsa — qiymati almashtiriladi, bo'lmasa — yangi kalit sifatida qo'shiladi. Kalit va qiymat atrofidagi bo'sh joylarni olib tashlang, bo'linish faqat birinchi `=` bo'yicha.\n\nNatijani kalitlar bo'yicha ALIFBO tartibida chiqaring, har bir qator `KALIT=QIYMAT` ko'rinishida.\n\nNamuna kiritish:\n\n```\nBASE\nDEBUG=False\nALLOWED_HOSTS=localhost\nTIMEZONE=Asia/Tashkent\nOVERRIDE\nDEBUG=True\nCACHE=locmem\nEND\n```\n\nNamuna chiqish:\n\n```\nALLOWED_HOSTS=localhost\nCACHE=locmem\nDEBUG=True\nTIMEZONE=Asia/Tashkent\n```",
    "starterCodePy": "import sys\n\n# 1) BASE va OVERRIDE bo'limlarini bitta lug'atga yig'ing (OVERRIDE ustun)\n# 2) END qatoriga yetganda o'qishni to'xtating\n# 3) kalitlarni alifbo tartibida \"KALIT=QIYMAT\" ko'rinishida chiqaring\nlines = sys.stdin.read().split(\"\\n\")\n",
    "testCases": [
      {
        "stdin": "BASE\nDEBUG=False\nALLOWED_HOSTS=localhost\nTIMEZONE=Asia/Tashkent\nOVERRIDE\nDEBUG=True\nCACHE=locmem\nEND\n",
        "expectedStdout": "ALLOWED_HOSTS=localhost\nCACHE=locmem\nDEBUG=True\nTIMEZONE=Asia/Tashkent\n",
        "hidden": false,
        "label": "Namunadagi base va override"
      },
      {
        "stdin": "BASE\nA=1\nB=2\nOVERRIDE\nEND\n",
        "expectedStdout": "A=1\nB=2\n",
        "hidden": false,
        "label": "Override bo'sh bo'lgan holat"
      },
      {
        "stdin": "BASE\nDEBUG=True\nOVERRIDE\nDEBUG=False\nSECRET_KEY=env\nEND\nDEBUG=True\n",
        "expectedStdout": "DEBUG=False\nSECRET_KEY=env\n",
        "hidden": true,
        "label": "END dan keyingi qatorlar hisobga olinmaydi"
      },
      {
        "stdin": "BASE\nZ=1\nA=2\nM=3\nOVERRIDE\nA=9\nEND\n",
        "expectedStdout": "A=9\nM=3\nZ=1\n",
        "hidden": true,
        "label": "Kalitlar alifbo tartibida"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-88",
    "key": "backend-dars-88-easy",
    "title": "Serializer validatsiyasi",
    "difficulty": "EASY",
    "points": 10,
    "tags": [
      "serializer",
      "validatsiya",
      "drf"
    ],
    "description": "Serializer ma'lumot bazaga tushishidan oldin uni tekshiradi. Kitob yozuvlari uchun shunday tekshiruvni yozing.\n\nKiritish (stdin):\n- 1-qator: `n` — yozuvlar soni.\n- keyingi `n` qator: `title|pages|year` — maydonlar `|` bilan ajratilgan.\n\nHar bir maydonni ANIQ shu tartibda tekshiring:\n1. `title` bo'sh (yoki faqat bo'sh joydan iborat) bo'lsa → xato matni: `title bo'sh bo'lmasin`\n2. `pages` musbat butun son bo'lmasa (masalan `0`, `-5`, `abc`) → `pages musbat butun son bo'lsin`\n3. `year` butun son bo'lmasa yoki 1900 dan kichik / 2026 dan katta bo'lsa → `year 1900-2026 oralig'ida bo'lsin`\n\nHar bir yozuv uchun bitta qator chiqaring. Xato bo'lmasa:\n\n```\nYozuv <raqam>: OK\n```\n\nXato bo'lsa, xato matnlari `; ` (nuqtali vergul va bo'sh joy) bilan birlashtiriladi:\n\n```\nYozuv <raqam>: <xato1>; <xato2>\n```\n\nYozuvlar 1 dan boshlab raqamlanadi. Oxirida yakuniy qator: `Yaroqli: <yaroqlilar soni> / <umumiy son>`.\n\nNamuna kiritish:\n\n```\n3\nDjango kitobi|320|2021\n|150|2019\nPython|0|1899\n```\n\nNamuna chiqish:\n\n```\nYozuv 1: OK\nYozuv 2: title bo'sh bo'lmasin\nYozuv 3: pages musbat butun son bo'lsin; year 1900-2026 oralig'ida bo'lsin\nYaroqli: 1 / 3\n```",
    "starterCodePy": "import sys\n\n# 1) yozuvlar sonini o'qing, har bir qatorni \"|\" bo'yicha bo'ling\n# 2) title -> pages -> year tartibida tekshirib, xatolarni ro'yxatga yig'ing\n# 3) \"Yozuv N: ...\" qatorlarini, oxirida \"Yaroqli: X / N\" ni chiqaring\nlines = sys.stdin.read().split(\"\\n\")\n",
    "testCases": [
      {
        "stdin": "3\nDjango kitobi|320|2021\n|150|2019\nPython|0|1899\n",
        "expectedStdout": "Yozuv 1: OK\nYozuv 2: title bo'sh bo'lmasin\nYozuv 3: pages musbat butun son bo'lsin; year 1900-2026 oralig'ida bo'lsin\nYaroqli: 1 / 3\n",
        "hidden": false,
        "label": "Namunadagi uch yozuv"
      },
      {
        "stdin": "2\nAsyncIO|1|1900\nWeb|12|2026\n",
        "expectedStdout": "Yozuv 1: OK\nYozuv 2: OK\nYaroqli: 2 / 2\n",
        "hidden": false,
        "label": "Chegaraviy qiymatlar"
      },
      {
        "stdin": "2\n  |abc|2020\nSQL|100|yil\n",
        "expectedStdout": "Yozuv 1: title bo'sh bo'lmasin; pages musbat butun son bo'lsin\nYozuv 2: year 1900-2026 oralig'ida bo'lsin\nYaroqli: 0 / 2\n",
        "hidden": true,
        "label": "Son bo'lmagan qiymatlar"
      },
      {
        "stdin": "1\nDRF|-5|2030\n",
        "expectedStdout": "Yozuv 1: pages musbat butun son bo'lsin; year 1900-2026 oralig'ida bo'lsin\nYaroqli: 0 / 1\n",
        "hidden": true,
        "label": "Manfiy va chegaradan tashqari"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-88",
    "key": "backend-dars-88-medium",
    "title": "Router qaysi amalni chaqiradi?",
    "difficulty": "MEDIUM",
    "points": 20,
    "tags": [
      "router",
      "url",
      "drf"
    ],
    "description": "DRF Router `BookViewSet` uchun ikkita manzil yaratadi: ro'yxat manzili `/api/books/` va bitta yozuv manzili `/api/books/<pk>/`. Qaysi HTTP metod qaysi amalga (action) tushishini aniqlaydigan dastur yozing.\n\nKiritish (stdin):\n- 1-qator: `n` — so'rovlar soni.\n- keyingi `n` qator: `<METOD> <manzil>`.\n\nAmallar jadvali:\n\n| Manzil | Metod | Amal |\n| --- | --- | --- |\n| `/api/books/` | GET | `list` |\n| `/api/books/` | POST | `create` |\n| `/api/books/<pk>/` | GET | `retrieve` |\n| `/api/books/<pk>/` | PUT | `update` |\n| `/api/books/<pk>/` | PATCH | `partial_update` |\n| `/api/books/<pk>/` | DELETE | `destroy` |\n\n`<pk>` — faqat raqamlardan iborat bo'lishi kerak. Boshqa har qanday holatda (boshqa resurs, oxirgi `/` tushib qolgan, `pk` raqam emas, jadvalda yo'q metod) amal o'rniga `404` yoziladi.\n\nHar bir so'rov uchun bitta qator chiqaring:\n\n```\n<METOD> <manzil> -> <amal>\n```\n\nNamuna kiritish:\n\n```\n5\nGET /api/books/\nPOST /api/books/\nGET /api/books/7/\nDELETE /api/books/7/\nPUT /api/authors/1/\n```\n\nNamuna chiqish:\n\n```\nGET /api/books/ -> list\nPOST /api/books/ -> create\nGET /api/books/7/ -> retrieve\nDELETE /api/books/7/ -> destroy\nPUT /api/authors/1/ -> 404\n```",
    "starterCodePy": "import sys\n\n# 1) ro'yxat va bitta yozuv manzillari uchun metod -> amal lug'atlarini tuzing\n# 2) har bir so'rov manzilini tekshiring: /api/books/ yoki /api/books/<raqam>/\n# 3) mos kelmasa \"404\" chiqaring\nlines = [l.strip() for l in sys.stdin.read().split(\"\\n\") if l.strip()]\n",
    "testCases": [
      {
        "stdin": "5\nGET /api/books/\nPOST /api/books/\nGET /api/books/7/\nDELETE /api/books/7/\nPUT /api/authors/1/\n",
        "expectedStdout": "GET /api/books/ -> list\nPOST /api/books/ -> create\nGET /api/books/7/ -> retrieve\nDELETE /api/books/7/ -> destroy\nPUT /api/authors/1/ -> 404\n",
        "hidden": false,
        "label": "Namunadagi besh so'rov"
      },
      {
        "stdin": "3\nPATCH /api/books/3/\nDELETE /api/books/\nGET /api/books/3/reviews/\n",
        "expectedStdout": "PATCH /api/books/3/ -> partial_update\nDELETE /api/books/ -> 404\nGET /api/books/3/reviews/ -> 404\n",
        "hidden": false,
        "label": "Ro'yxatda yo'q amallar"
      },
      {
        "stdin": "3\nGET /api/books\nPOST /api/books/9/\nPUT /api/books/abc/\n",
        "expectedStdout": "GET /api/books -> 404\nPOST /api/books/9/ -> 404\nPUT /api/books/abc/ -> 404\n",
        "hidden": true,
        "label": "Noto'g'ri manzil ko'rinishlari"
      },
      {
        "stdin": "2\nOPTIONS /api/books/\nGET /api/books/12/\n",
        "expectedStdout": "OPTIONS /api/books/ -> 404\nGET /api/books/12/ -> retrieve\n",
        "hidden": true,
        "label": "Qo'llab-quvvatlanmagan metod"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-89",
    "key": "backend-dars-89-medium",
    "title": "Buyurtma tranzaksiyasi",
    "difficulty": "MEDIUM",
    "points": 20,
    "tags": [
      "tranzaksiya",
      "biznes-logika",
      "atomiklik"
    ],
    "description": "Tranzaksiya — «hammasi bajariladi yoki hech nima bajarilmaydi». Buyurtmadagi mahsulotlardan bittasi ham yetmasa, omborda HECH NIMA o'zgarmasligi kerak. Shu qoidani dastur qilib yozing.\n\nKiritish (stdin):\n- 1-qator: `p` — ombordagi mahsulotlar soni.\n- keyingi `p` qator: `<nom> <miqdor>`.\n- keyingi qator: `b` — buyurtmalar soni.\n- har bir buyurtma uchun: `k` (buyurtmadagi qatorlar soni), so'ng `k` ta `<nom> <miqdor>` qatori.\n\nMiqdorlar 0 yoki musbat butun son. Bitta buyurtma ichida bir mahsulot bir necha marta uchrashi mumkin — bunda ularning miqdorlari QO'SHILADI va omborda shuncha bo'lishi shart.\n\nHar bir buyurtma uchun bitta qator chiqaring:\n- hamma mahsulot yetsa: `Buyurtma <raqam>: qabul qilindi` va ombordan yechiladi;\n- birortasi yetmasa: `Buyurtma <raqam>: bekor qilindi (<nom> yetarli emas)` va ombor umuman o'zgarmaydi. `<nom>` — buyurtma qatorlari bo'yicha yurganda yetmasligi aniqlangan BIRINCHI mahsulot nomi. Omborda umuman yo'q mahsulot ham «yetarli emas» hisoblanadi.\n\nBuyurtmalar 1 dan boshlab raqamlanadi. Hamma buyurtmadan keyin ombor holatini nom bo'yicha alifbo tartibida chiqaring: `<nom>: <miqdor>`.\n\nNamuna kiritish:\n\n```\n3\nolma 10\nnon 5\nsut 2\n2\n2\nolma 3\nsut 1\n2\nnon 10\nolma 1\n```\n\nNamuna chiqish:\n\n```\nBuyurtma 1: qabul qilindi\nBuyurtma 2: bekor qilindi (non yetarli emas)\nnon: 5\nolma: 7\nsut: 1\n```\n\nDiqqat: 2-buyurtmada `olma 1` bor edi, lekin buyurtma bekor bo'lgani uchun olma miqdori 7 bo'lib qoldi.",
    "starterCodePy": "import sys\n\n# 1) omborni lug'atga o'qing\n# 2) har bir buyurtma uchun AVVAL hammasini tekshiring, keyingina yeching\n# 3) natijalarni, so'ng ombor holatini alifbo tartibida chiqaring\nlines = [l.strip() for l in sys.stdin.read().split(\"\\n\") if l.strip()]\n",
    "testCases": [
      {
        "stdin": "3\nolma 10\nnon 5\nsut 2\n2\n2\nolma 3\nsut 1\n2\nnon 10\nolma 1\n",
        "expectedStdout": "Buyurtma 1: qabul qilindi\nBuyurtma 2: bekor qilindi (non yetarli emas)\nnon: 5\nolma: 7\nsut: 1\n",
        "hidden": false,
        "label": "Namunadagi ikki buyurtma"
      },
      {
        "stdin": "2\nolma 5\nnon 5\n1\n2\nolma 5\nnon 5\n",
        "expectedStdout": "Buyurtma 1: qabul qilindi\nnon: 0\nolma: 0\n",
        "hidden": false,
        "label": "Zaxira aniq yetadigan holat"
      },
      {
        "stdin": "2\nolma 3\nnon 1\n2\n1\nsut 1\n2\nolma 2\nolma 2\n",
        "expectedStdout": "Buyurtma 1: bekor qilindi (sut yetarli emas)\nBuyurtma 2: bekor qilindi (olma yetarli emas)\nnon: 1\nolma: 3\n",
        "hidden": true,
        "label": "Yo'q mahsulot va takroriy qator"
      },
      {
        "stdin": "1\nolma 4\n3\n1\nolma 4\n1\nolma 1\n1\nolma 0\n",
        "expectedStdout": "Buyurtma 1: qabul qilindi\nBuyurtma 2: bekor qilindi (olma yetarli emas)\nBuyurtma 3: qabul qilindi\nolma: 0\n",
        "hidden": true,
        "label": "Zaxira tugagandan keyin"
      }
    ]
  }
];
