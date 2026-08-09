/**
 * Hand-authored practice problems for backend lessons 48-54.
 *
 * Grading is exact-output, so every `expectedStdout` below was produced by actually
 * running a reference solution on the Piston sandbox (python 3.10.0) against the
 * matching `stdin` - none of them are written from memory.
 *
 * Coverage is deliberately uneven. Lesson 52 (Django kirish) gets NO problem: its subject
 * matter (django-admin startproject / settings.py / runserver) cannot be honestly verified
 * by comparing stdout, so it keeps its rubric-graded homework instead. Lesson 49 (Web qanday
 * ishlaydi) gets only the one exercise that has real pure-Python substance under it
 * (splitting a URL into its parts); the rest of that lesson is conceptual.
 */
import type { LessonProblemRecord } from './types';

export const backendProblemsP06: LessonProblemRecord[] = [
  {
    "lessonKey": "backend-dars-48",
    "key": "backend-dars-48-easy",
    "title": "Kontaktlarni bazaga qo'shish",
    "difficulty": "EASY",
    "points": 10,
    "tags": [
      "sqlite3",
      "insert",
      "select"
    ],
    "description": "Boshlang'ich kodda `kontaktlar` jadvali allaqachon yaratilgan (`id`, `ism`, `telefon`). Sizning vazifangiz — kontaktlarni bazaga qo'shish va keyin hammasini o'qib chiqarish.\n\nKiritish (stdin):\n- 1-qator: `n` — kontaktlar soni.\n- Keyingi `n` qator: `ism;telefon` ko'rinishida (nuqta-vergul bilan ajratilgan).\n\nHar bir kontaktni PARAMETRLI so'rov bilan qo'shing: `cur.execute(\"INSERT ...VALUES (?, ?)\", (ism, telefon))`. Keyin `commit()` qiling va `SELECT ... ORDER BY id` bilan hammasini o'qib, har bir qatorni `id. ism - telefon` ko'rinishida chiqaring (`.` dan keyin bitta bo'sh joy, chiziqcha atrofida ham bittadan bo'sh joy).\n\nMisol — kiritish:\n```\n3\nAli;901112233\nVali;901112244\nHasan;901112255\n```\nChiqish:\n```\n1. Ali - 901112233\n2. Vali - 901112244\n3. Hasan - 901112255\n```\n\nAgar `n` nolga teng bo'lsa, hech narsa chiqarilmaydi.",
    "starterCodePy": "import sqlite3\n\n# --- Baza tayyorlanadi (bu qismni o'zgartirmang) ---\nconn = sqlite3.connect(\":memory:\")\ncur = conn.cursor()\ncur.execute(\"\"\"\n    CREATE TABLE kontaktlar (\n        id INTEGER PRIMARY KEY AUTOINCREMENT,\n        ism TEXT NOT NULL,\n        telefon TEXT NOT NULL\n    )\n\"\"\")\nconn.commit()\n# --- Tayyorgarlik tugadi ---\n\n# 1) n ta kontaktni o'qing va parametrli INSERT bilan bazaga qo'shing.\n# 2) commit() qiling.\n# 3) SELECT ... ORDER BY id bilan hammasini o'qib chiqaring.\n",
    "testCases": [
      {
        "stdin": "3\nAli;901112233\nVali;901112244\nHasan;901112255\n",
        "expectedStdout": "1. Ali - 901112233\n2. Vali - 901112244\n3. Hasan - 901112255\n",
        "hidden": false,
        "label": "Uchta kontakt qo'shildi"
      },
      {
        "stdin": "1\nZilola;909998877\n",
        "expectedStdout": "1. Zilola - 909998877\n",
        "hidden": false,
        "label": "Bitta kontakt"
      },
      {
        "stdin": "0\n",
        "expectedStdout": "",
        "hidden": true,
        "label": "Kontakt umuman yo'q"
      },
      {
        "stdin": "5\nAli Valiyev;901112233\nZarina;911112233\nBobur;921112233\nDilnoza;931112233\nEldor;941112233\n",
        "expectedStdout": "1. Ali Valiyev - 901112233\n2. Zarina - 911112233\n3. Bobur - 921112233\n4. Dilnoza - 931112233\n5. Eldor - 941112233\n",
        "hidden": true,
        "label": "Ko'p kontakt va ismda bo'sh joy"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-48",
    "key": "backend-dars-48-medium",
    "title": "Qidiruv va o'chirish",
    "difficulty": "MEDIUM",
    "points": 20,
    "tags": [
      "sqlite3",
      "like",
      "delete"
    ],
    "description": "Boshlang'ich kodda `kontaktlar` jadvali 5 ta yozuv bilan to'ldirilgan. Endi CLI ilovaning ikkita amalini yozing: qidiruv va o'chirish.\n\nKiritish (stdin):\n- 1-qator: qidiruv matni.\n- 2-qator: o'chiriladigan kontakt `id` si.\n\nBajarilishi kerak:\n1. Ismi ichida qidiruv matni QATNASHGAN (katta-kichik harf farqsiz) barcha kontaktlarni `id` bo'yicha o'sish tartibida `ism - telefon` ko'rinishida chiqaring. Hech narsa topilmasa, bitta qator: `Topilmadi`.\n2. Berilgan `id` li yozuvni o'chiring (bunday id bo'lmasa hech narsa o'chmaydi) va oxirgi qatorda `Qolgan kontaktlar: <son>` deb yozing.\n\nBarcha so'rovlar parametrli bo'lsin — qiymatni f-string bilan so'rovga yopishtirmang.\n\nDiqqat: qidiruv ismning ISTALGAN joyidan mos kelishi mumkin — `Ali` so'zi `Vali` va `Malika` ichida ham uchraydi.\n\nMisol — kiritish:\n```\nAli\n3\n```\nChiqish:\n```\nAli - 901112233\nAlisher - 901119988\nVali - 935550011\nMalika - 915550033\nQolgan kontaktlar: 4\n```",
    "starterCodePy": "import sqlite3\n\n# --- Baza tayyorlanadi (bu qismni o'zgartirmang) ---\nconn = sqlite3.connect(\":memory:\")\ncur = conn.cursor()\ncur.execute(\"\"\"\n    CREATE TABLE kontaktlar (\n        id INTEGER PRIMARY KEY,\n        ism TEXT NOT NULL,\n        telefon TEXT NOT NULL\n    )\n\"\"\")\ncur.executemany(\n    \"INSERT INTO kontaktlar (id, ism, telefon) VALUES (?, ?, ?)\",\n    [\n        (1, \"Ali\", \"901112233\"),\n        (2, \"Alisher\", \"901119988\"),\n        (3, \"Vali\", \"935550011\"),\n        (4, \"Hasan\", \"945550022\"),\n        (5, \"Malika\", \"915550033\"),\n    ],\n)\nconn.commit()\n# --- Tayyorgarlik tugadi ---\n\n# 1) Qidiruv matnini va o'chiriladigan id ni o'qing.\n# 2) LIKE bilan qidiring (parametrli so'rov!), natijani chiqaring.\n# 3) DELETE qiling, commit() qiling va COUNT(*) ni chiqaring.\n",
    "testCases": [
      {
        "stdin": "Ali\n3\n",
        "expectedStdout": "Ali - 901112233\nAlisher - 901119988\nVali - 935550011\nMalika - 915550033\nQolgan kontaktlar: 4\n",
        "hidden": false,
        "label": "Qidiruv va o'chirish ishladi"
      },
      {
        "stdin": "zil\n1\n",
        "expectedStdout": "Topilmadi\nQolgan kontaktlar: 4\n",
        "hidden": false,
        "label": "Mos kontakt yo'q holati"
      },
      {
        "stdin": "MALIKA\n99\n",
        "expectedStdout": "Malika - 915550033\nQolgan kontaktlar: 5\n",
        "hidden": true,
        "label": "Katta harf va mavjud bo'lmagan id"
      },
      {
        "stdin": "a\n5\n",
        "expectedStdout": "Ali - 901112233\nAlisher - 901119988\nVali - 935550011\nHasan - 945550022\nMalika - 915550033\nQolgan kontaktlar: 4\n",
        "hidden": true,
        "label": "Bir harfli keng qidiruv"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-48",
    "key": "backend-dars-48-hard",
    "title": "Talabalar reytingi",
    "difficulty": "HARD",
    "points": 35,
    "tags": [
      "sqlite3",
      "join",
      "group-by"
    ],
    "description": "Boshlang'ich kodda ikkita jadval to'ldirilgan: `talabalar(id, ism)` va `baholar(id, talaba_id, ball)`. Bitta talabaning bir nechta bahosi bo'lishi mumkin, ba'zi talabalarda esa umuman baho yo'q.\n\nKiritish (stdin): bitta qator — chegara ball (butun yoki kasr son, masalan `80` yoki `62.5`).\n\nJOIN + GROUP BY + HAVING bilan har bir talabaning o'rtacha balini hisoblang va faqat o'rtachasi chegaradan KICHIK BO'LMAGAN talabalarni chiqaring:\n`ism: o'rtacha (soni ta baho)` — o'rtacha aynan 1 xona kasr bilan (masalan `80.0`).\nTartib: o'rtacha bo'yicha kamayish, teng bo'lsa ism bo'yicha alifbo tartibida.\nBahosi umuman yo'q talaba ro'yxatga tushmaydi.\nOxirgi qator: `Jami: <son> ta talaba`.\n\nMisol — kiritish:\n```\n80\n```\nChiqish:\n```\nHasan: 95.0 (2 ta baho)\nAli: 80.0 (3 ta baho)\nMalika: 80.0 (3 ta baho)\nJami: 3 ta talaba\n```",
    "starterCodePy": "import sqlite3\n\n# --- Baza tayyorlanadi (bu qismni o'zgartirmang) ---\nconn = sqlite3.connect(\":memory:\")\ncur = conn.cursor()\ncur.execute(\"CREATE TABLE talabalar (id INTEGER PRIMARY KEY, ism TEXT NOT NULL)\")\ncur.execute(\"\"\"\n    CREATE TABLE baholar (\n        id INTEGER PRIMARY KEY,\n        talaba_id INTEGER NOT NULL REFERENCES talabalar(id),\n        ball INTEGER NOT NULL\n    )\n\"\"\")\ncur.executemany(\n    \"INSERT INTO talabalar (id, ism) VALUES (?, ?)\",\n    [(1, \"Ali\"), (2, \"Vali\"), (3, \"Hasan\"), (4, \"Malika\"), (5, \"Zilola\")],\n)\ncur.executemany(\n    \"INSERT INTO baholar (id, talaba_id, ball) VALUES (?, ?, ?)\",\n    [\n        (1, 1, 90), (2, 1, 80), (3, 1, 70),\n        (4, 2, 60), (5, 2, 65),\n        (6, 3, 100), (7, 3, 90),\n        (8, 4, 80), (9, 4, 80), (10, 4, 80),\n    ],\n)\nconn.commit()\n# --- Tayyorgarlik tugadi ---\n\n# 1) Chegara ballni o'qing.\n# 2) JOIN + GROUP BY + HAVING bilan o'rtacha balni hisoblang.\n# 3) Natijani o'rtacha bo'yicha kamayish, keyin ism bo'yicha o'sish tartibida chiqaring.\n",
    "testCases": [
      {
        "stdin": "80\n",
        "expectedStdout": "Hasan: 95.0 (2 ta baho)\nAli: 80.0 (3 ta baho)\nMalika: 80.0 (3 ta baho)\nJami: 3 ta talaba\n",
        "hidden": false,
        "label": "Chegara 80 uchun reyting"
      },
      {
        "stdin": "100\n",
        "expectedStdout": "Jami: 0 ta talaba\n",
        "hidden": false,
        "label": "Hech kim chegaradan o'tmadi"
      },
      {
        "stdin": "0\n",
        "expectedStdout": "Hasan: 95.0 (2 ta baho)\nAli: 80.0 (3 ta baho)\nMalika: 80.0 (3 ta baho)\nVali: 62.5 (2 ta baho)\nJami: 4 ta talaba\n",
        "hidden": true,
        "label": "Barcha bahosi bor talabalar"
      },
      {
        "stdin": "62.5\n",
        "expectedStdout": "Hasan: 95.0 (2 ta baho)\nAli: 80.0 (3 ta baho)\nMalika: 80.0 (3 ta baho)\nVali: 62.5 (2 ta baho)\nJami: 4 ta talaba\n",
        "hidden": true,
        "label": "Kasr chegara aynan tenglik bilan"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-49",
    "key": "backend-dars-49-easy",
    "title": "URL ni bo'laklarga ajratish",
    "difficulty": "EASY",
    "points": 10,
    "tags": [
      "web",
      "url",
      "satr"
    ],
    "description": "Brauzerga manzil yozganingizda, u avval URL ni bo'laklarga ajratadi: qaysi protokol, qaysi domen, qaysi port va qaysi manzil so'ralyapti.\n\nKiritish (stdin): bitta qator — URL. URL doim `protokol://` bilan boshlanadi.\n\nAynan 4 qator chiqaring:\n```\nProtokol: <protokol>\nDomen: <domen>\nPort: <port>\nManzil: <manzil>\n```\nQoidalar:\n- Port URL da ko'rsatilmagan bo'lsa: `https` uchun `443`, boshqa hollarda `80`.\n- Domendan keyin `/` umuman bo'lmasa, manzil `/` deb hisoblanadi.\n- Manzil `/` dan boshlab URL oxirigacha bo'lgan hamma narsa (agar `?` bo'lsa, u ham kiradi).\n\nMisol — kiritish:\n```\nhttps://example.com/talabalar/5\n```\nChiqish:\n```\nProtokol: https\nDomen: example.com\nPort: 443\nManzil: /talabalar/5\n```",
    "starterCodePy": "# URL ni bo'laklarga ajrating.\n# Maslahat: avval \"://\" bo'yicha, keyin birinchi \"/\" bo'yicha ajrating.\nurl = input().strip()\n",
    "testCases": [
      {
        "stdin": "https://example.com/talabalar/5\n",
        "expectedStdout": "Protokol: https\nDomen: example.com\nPort: 443\nManzil: /talabalar/5\n",
        "hidden": false,
        "label": "Standart https manzil"
      },
      {
        "stdin": "http://localhost:8000/\n",
        "expectedStdout": "Protokol: http\nDomen: localhost\nPort: 8000\nManzil: /\n",
        "hidden": false,
        "label": "Port ko'rsatilgan holat"
      },
      {
        "stdin": "http://uz.example.org\n",
        "expectedStdout": "Protokol: http\nDomen: uz.example.org\nPort: 80\nManzil: /\n",
        "hidden": true,
        "label": "Manzil qismi umuman yo'q"
      },
      {
        "stdin": "https://api.example.com:8443/v1/users?sort=ism\n",
        "expectedStdout": "Protokol: https\nDomen: api.example.com\nPort: 8443\nManzil: /v1/users?sort=ism\n",
        "hidden": true,
        "label": "Port va query birga"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-50",
    "key": "backend-dars-50-easy",
    "title": "Status kodlar tasnifi",
    "difficulty": "EASY",
    "points": 10,
    "tags": [
      "http",
      "status",
      "shart"
    ],
    "description": "HTTP javob kodining birinchi raqami uning toifasini bildiradi. Kodlarni tasniflovchi dastur yozing.\n\nKiritish (stdin):\n- 1-qator: `n` — kodlar soni.\n- Keyingi `n` qator: bitta butun son.\n\nHar bir kod uchun `<kod> - <toifa>` chiqaring. Toifalar:\n- `1xx` -> `Axborot`\n- `2xx` -> `Muvaffaqiyat`\n- `3xx` -> `Yo'naltirish`\n- `4xx` -> `Client xatosi`\n- `5xx` -> `Server xatosi`\n- 100 dan kichik yoki 599 dan katta son -> `Noma'lum`\n\nOxirgi qatorda xatolar sonini chiqaring: `Xatolar: <son>` — bu 400..599 oralig'idagi kodlar soni (`Noma'lum` kodlar sanalmaydi).\n\nMisol — kiritish:\n```\n5\n200\n404\n301\n500\n201\n```\nChiqish:\n```\n200 - Muvaffaqiyat\n404 - Client xatosi\n301 - Yo'naltirish\n500 - Server xatosi\n201 - Muvaffaqiyat\nXatolar: 2\n```",
    "starterCodePy": "# Har bir status kodni toifasi bilan chiqaring, oxirida xatolar sonini yozing.\nn = int(input())\n",
    "testCases": [
      {
        "stdin": "5\n200\n404\n301\n500\n201\n",
        "expectedStdout": "200 - Muvaffaqiyat\n404 - Client xatosi\n301 - Yo'naltirish\n500 - Server xatosi\n201 - Muvaffaqiyat\nXatolar: 2\n",
        "hidden": false,
        "label": "Aralash kodlar to'g'ri tasniflandi"
      },
      {
        "stdin": "1\n100\n",
        "expectedStdout": "100 - Axborot\nXatolar: 0\n",
        "hidden": false,
        "label": "Bitta axborot kodi"
      },
      {
        "stdin": "3\n999\n418\n503\n",
        "expectedStdout": "999 - Noma'lum\n418 - Client xatosi\n503 - Server xatosi\nXatolar: 2\n",
        "hidden": true,
        "label": "Diapazondan tashqari kod"
      },
      {
        "stdin": "2\n204\n304\n",
        "expectedStdout": "204 - Muvaffaqiyat\n304 - Yo'naltirish\nXatolar: 0\n",
        "hidden": true,
        "label": "Xatosiz javoblar"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-50",
    "key": "backend-dars-50-medium",
    "title": "So'rov qatorini o'qish",
    "difficulty": "MEDIUM",
    "points": 20,
    "tags": [
      "http",
      "metod",
      "satr"
    ],
    "description": "HTTP so'rovning birinchi qatori shunday ko'rinadi: `GET /talabalar/5?sort=ism HTTP/1.1` — metod, yo'l va protokol versiyasi bo'sh joy bilan ajratilgan.\n\nKiritish (stdin): bitta qator — so'rov qatori.\n\nAynan 4 qator chiqaring:\n```\nMetod: <metod>\nResurs: <?> belgisigacha bo'lgan yo'l\nQuery: <?> dan keyingi qism\nAmal: <amal nomi>\n```\nQoidalar:\n- Yo'lda `?` bo'lmasa, `Query: yo'q` deb yoziladi.\n- Amal: `GET` -> `O'qish`, `POST` -> `Yaratish`, `PUT` -> `To'liq yangilash`, `PATCH` -> `Qisman yangilash`, `DELETE` -> `O'chirish`. Boshqa metod uchun `Qo'llab-quvvatlanmaydi`.\n\nMisol — kiritish:\n```\nGET /talabalar/5?sort=ism HTTP/1.1\n```\nChiqish:\n```\nMetod: GET\nResurs: /talabalar/5\nQuery: sort=ism\nAmal: O'qish\n```",
    "starterCodePy": "# So'rov qatorini bo'laklarga ajrating: metod, resurs, query, amal.\nqator = input().strip()\n",
    "testCases": [
      {
        "stdin": "GET /talabalar/5?sort=ism HTTP/1.1\n",
        "expectedStdout": "Metod: GET\nResurs: /talabalar/5\nQuery: sort=ism\nAmal: O'qish\n",
        "hidden": false,
        "label": "Query bilan GET so'rovi"
      },
      {
        "stdin": "POST /talabalar HTTP/1.1\n",
        "expectedStdout": "Metod: POST\nResurs: /talabalar\nQuery: yo'q\nAmal: Yaratish\n",
        "hidden": false,
        "label": "Querysiz POST so'rovi"
      },
      {
        "stdin": "DELETE /talabalar/9?force=1 HTTP/1.1\n",
        "expectedStdout": "Metod: DELETE\nResurs: /talabalar/9\nQuery: force=1\nAmal: O'chirish\n",
        "hidden": true,
        "label": "O'chirish so'rovi"
      },
      {
        "stdin": "TRACE /debug HTTP/1.1\n",
        "expectedStdout": "Metod: TRACE\nResurs: /debug\nQuery: yo'q\nAmal: Qo'llab-quvvatlanmaydi\n",
        "hidden": true,
        "label": "Ro'yxatda yo'q metod"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-50",
    "key": "backend-dars-50-hard",
    "title": "To'liq HTTP so'rovini tahlil qilish",
    "difficulty": "HARD",
    "points": 35,
    "tags": [
      "http",
      "header",
      "status"
    ],
    "description": "Endi butun so'rovni tahlil qilamiz. So'rov quyidagi tuzilishga ega: birinchi qator (metod, yo'l, versiya), keyin headerlar, keyin BO'SH QATOR, keyin tana (body).\n\nKiritish (stdin): butun so'rov matni. Boshlang'ich kodda u `sys.stdin.read()` bilan bir marta o'qiladi.\n\nAynan 5 qator chiqaring:\n```\nMetod: <metod>\nYo'l: <yo'l>\nHeader soni: <son>\nHost: <host header qiymati>\nJavob: <status>\n```\nQoidalar:\n- Header nomi katta-kichik harf farqsiz izlanadi; `Host` header bo'lmasa `Host: yo'q`.\n- Header qiymatidan boshidagi va oxiridagi bo'sh joylar olib tashlanadi.\n- Tana bo'sh qatordan keyingi hamma narsa; agar undan bo'sh joylarni olib tashlaganda hech narsa qolmasa, tana bo'sh hisoblanadi.\n- Status shu tartibda aniqlanadi:\n  1. Metod `GET`, `POST`, `PUT`, `PATCH`, `DELETE` dan biri bo'lmasa -> `405 Method Not Allowed`\n  2. Metod `POST`/`PUT`/`PATCH` va tana bo'sh bo'lsa -> `400 Bad Request`\n  3. Metod `POST` bo'lsa -> `201 Created`\n  4. Aks holda -> `200 OK`\n\nMisol — kiritish:\n```\nPOST /api/talabalar HTTP/1.1\nHost: example.com\nContent-Type: application/json\nContent-Length: 27\n\n{\"ism\": \"Ali\", \"guruh\": \"A\"}\n```\nChiqish:\n```\nMetod: POST\nYo'l: /api/talabalar\nHeader soni: 3\nHost: example.com\nJavob: 201 Created\n```",
    "starterCodePy": "import sys\n\n# Butun so'rov matni bir marta o'qiladi.\nmatn = sys.stdin.read()\n\n# 1) Bosh qism va tanani bo'sh qator bo'yicha ajrating.\n# 2) Birinchi qatordan metod va yo'lni oling.\n# 3) Qolgan qatorlardan headerlarni lug'atga yig'ing (nomni kichik harfga o'tkazing).\n# 4) Qoidaga ko'ra javob status qatorini aniqlang.\n",
    "testCases": [
      {
        "stdin": "POST /api/talabalar HTTP/1.1\nHost: example.com\nContent-Type: application/json\nContent-Length: 27\n\n{\"ism\": \"Ali\", \"guruh\": \"A\"}\n",
        "expectedStdout": "Metod: POST\nYo'l: /api/talabalar\nHeader soni: 3\nHost: example.com\nJavob: 201 Created\n",
        "hidden": false,
        "label": "Tanasi bor POST so'rovi"
      },
      {
        "stdin": "GET /api/talabalar HTTP/1.1\nHost: example.com\n\n",
        "expectedStdout": "Metod: GET\nYo'l: /api/talabalar\nHeader soni: 1\nHost: example.com\nJavob: 200 OK\n",
        "hidden": false,
        "label": "Tanasiz o'qish so'rovi"
      },
      {
        "stdin": "PUT /api/talabalar/5 HTTP/1.1\nHost: example.com\nContent-Length: 0\n\n",
        "expectedStdout": "Metod: PUT\nYo'l: /api/talabalar/5\nHeader soni: 2\nHost: example.com\nJavob: 400 Bad Request\n",
        "hidden": true,
        "label": "Tanasi bo'sh yangilash so'rovi"
      },
      {
        "stdin": "BREW /api/kofe HTTP/1.1\nX-Test: 1\n\nsalom\n",
        "expectedStdout": "Metod: BREW\nYo'l: /api/kofe\nHeader soni: 1\nHost: yo'q\nJavob: 405 Method Not Allowed\n",
        "hidden": true,
        "label": "Host yo'q va metod noma'lum"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-51",
    "key": "backend-dars-51-easy",
    "title": "API javobidan ro'yxat ajratish",
    "difficulty": "EASY",
    "points": 10,
    "tags": [
      "json",
      "api",
      "royxat"
    ],
    "description": "REST API odatda JSON qaytaradi. Ro'yxat qaytaruvchi endpointning javobi shunday bo'ladi: `{\"count\": <son>, \"results\": [ ... ]}`.\n\nKiritish (stdin): bitta qator — JSON javob. Har bir element `id` va `ism` maydonlariga ega.\n\nChiqarish:\n- 1-qator: `Jami: <count maydonining qiymati>` (ro'yxat uzunligi emas, aynan `count` maydoni).\n- Keyin `results` ichidagi har bir element uchun berilgan tartibda: `#<id> <ism>`.\n- Agar `results` bo'sh bo'lsa, `Jami:` qatoridan keyin `Ro'yxat bo'sh` deb yozing.\n\nMisol — kiritish:\n```\n{\"count\": 3, \"results\": [{\"id\": 1, \"ism\": \"Ali\"}, {\"id\": 2, \"ism\": \"Vali\"}, {\"id\": 7, \"ism\": \"Nodira\"}]}\n```\nChiqish:\n```\nJami: 3\n#1 Ali\n#2 Vali\n#7 Nodira\n```",
    "starterCodePy": "import json\n\n# JSON javob bitta qatorda keladi.\njavob = json.loads(input())\n",
    "testCases": [
      {
        "stdin": "{\"count\": 3, \"results\": [{\"id\": 1, \"ism\": \"Ali\"}, {\"id\": 2, \"ism\": \"Vali\"}, {\"id\": 7, \"ism\": \"Nodira\"}]}\n",
        "expectedStdout": "Jami: 3\n#1 Ali\n#2 Vali\n#7 Nodira\n",
        "hidden": false,
        "label": "Uch elementli javob"
      },
      {
        "stdin": "{\"count\": 0, \"results\": []}\n",
        "expectedStdout": "Jami: 0\nRo'yxat bo'sh\n",
        "hidden": false,
        "label": "Bo'sh ro'yxat"
      },
      {
        "stdin": "{\"count\": 42, \"results\": [{\"id\": 9, \"ism\": \"Zilola\"}]}\n",
        "expectedStdout": "Jami: 42\n#9 Zilola\n",
        "hidden": true,
        "label": "count va elementlar soni har xil"
      },
      {
        "stdin": "{\"count\": 2, \"results\": [{\"id\": 11, \"ism\": \"Sardor\"}, {\"id\": 12, \"ism\": \"Dilnoza\"}]}\n",
        "expectedStdout": "Jami: 2\n#11 Sardor\n#12 Dilnoza\n",
        "hidden": true,
        "label": "Ikki elementli javob"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-51",
    "key": "backend-dars-51-medium",
    "title": "RESTful endpointni tekshirish",
    "difficulty": "MEDIUM",
    "points": 20,
    "tags": [
      "rest",
      "api",
      "tekshiruv"
    ],
    "description": "REST qoidasi: harakat HTTP metodida bo'ladi, URL da esa faqat resurs nomi turadi — fe'l emas.\n\nKiritish (stdin):\n- 1-qator: `n`.\n- Keyingi `n` qator: `METOD /yo'l` ko'rinishida.\n\nHar bir qator uchun bitta natija chiqaring:\n`<METOD> <yo'l> - TO'G'RI` yoki `<METOD> <yo'l> - XATO: <sabab>`.\n\nTekshiruv AYNAN shu tartibda bajariladi, birinchi topilgan xato chiqariladi:\n1. Metod `GET`, `POST`, `PUT`, `PATCH`, `DELETE` dan biri emas -> `noma'lum metod`\n2. Yo'l `/api/` bilan boshlanmaydi -> `/api/ bilan boshlanmagan`\n3. Yo'lning biror bo'lagi (ikki `/` orasidagi so'z) kichik harfga o'tkazilganda quyidagi fe'llardan biriga TENG bo'ladi -> `URL'da fe'l bor`.\n   Fe'llar: `get`, `create`, `delete`, `update`, `add`, `remove`, `list`, `new`, `edit`.\n4. Aks holda -> `TO'G'RI`\n\nMisol — kiritish:\n```\n3\nGET /api/talabalar\nDELETE /api/talabalar/delete/5\nGET /talabalar\n```\nChiqish:\n```\nGET /api/talabalar - TO'G'RI\nDELETE /api/talabalar/delete/5 - XATO: URL'da fe'l bor\nGET /talabalar - XATO: /api/ bilan boshlanmagan\n```",
    "starterCodePy": "# Har bir endpointni REST qoidalariga solishtiring.\nmetodlar = (\"GET\", \"POST\", \"PUT\", \"PATCH\", \"DELETE\")\nfellar = (\"get\", \"create\", \"delete\", \"update\", \"add\", \"remove\", \"list\", \"new\", \"edit\")\n\nn = int(input())\n",
    "testCases": [
      {
        "stdin": "3\nGET /api/talabalar\nDELETE /api/talabalar/delete/5\nGET /talabalar\n",
        "expectedStdout": "GET /api/talabalar - TO'G'RI\nDELETE /api/talabalar/delete/5 - XATO: URL'da fe'l bor\nGET /talabalar - XATO: /api/ bilan boshlanmagan\n",
        "hidden": false,
        "label": "Uchta endpoint tekshirildi"
      },
      {
        "stdin": "2\nPOST /api/talabalar/5/baholar\nFETCH /api/talabalar\n",
        "expectedStdout": "POST /api/talabalar/5/baholar - TO'G'RI\nFETCH /api/talabalar - XATO: noma'lum metod\n",
        "hidden": false,
        "label": "Metod tekshiruvi"
      },
      {
        "stdin": "3\nGET /api/LIST/talabalar\nPUSH /talabalar\nPATCH /api/guruhlar/12\n",
        "expectedStdout": "GET /api/LIST/talabalar - XATO: URL'da fe'l bor\nPUSH /talabalar - XATO: noma'lum metod\nPATCH /api/guruhlar/12 - TO'G'RI\n",
        "hidden": true,
        "label": "Katta harfli fe'l va tekshiruv tartibi"
      },
      {
        "stdin": "1\nDELETE /api/talabalar/5\n",
        "expectedStdout": "DELETE /api/talabalar/5 - TO'G'RI\n",
        "hidden": true,
        "label": "Bitta to'g'ri endpoint"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-51",
    "key": "backend-dars-51-hard",
    "title": "JSON javobidan statistika",
    "difficulty": "HARD",
    "points": 35,
    "tags": [
      "json",
      "statistika",
      "saralash"
    ],
    "description": "API dan kelgan JSON ni tahlil qilib, guruhlar kesimida statistika chiqaring.\n\nKiritish (stdin): bitta qator — `{\"talabalar\": [{\"ism\": ..., \"guruh\": ..., \"ball\": ...}, ...]}`. Ro'yxat hech qachon bo'sh bo'lmaydi.\n\nChiqarish:\n- Har bir guruh uchun (guruh nomi bo'yicha alifbo tartibida): `<guruh>: <son> ta, o'rtacha <o'rtacha>` — o'rtacha aynan 1 xona kasr bilan.\n- Oxirgi qator: `Eng yuqori: <ism> (<ball>)` — eng katta ballga ega talaba. Bir nechta talabaning bali teng bo'lsa, ismi alifboda oldin turgani tanlanadi.\n\nMisol — kiritish:\n```\n{\"talabalar\": [{\"ism\": \"Ali\", \"guruh\": \"A\", \"ball\": 80}, {\"ism\": \"Vali\", \"guruh\": \"A\", \"ball\": 60}, {\"ism\": \"Hasan\", \"guruh\": \"B\", \"ball\": 95}]}\n```\nChiqish:\n```\nA: 2 ta, o'rtacha 70.0\nB: 1 ta, o'rtacha 95.0\nEng yuqori: Hasan (95)\n```",
    "starterCodePy": "import json\n\n# JSON bitta qatorda keladi.\nmalumot = json.loads(input())\ntalabalar = malumot[\"talabalar\"]\n",
    "testCases": [
      {
        "stdin": "{\"talabalar\": [{\"ism\": \"Ali\", \"guruh\": \"A\", \"ball\": 80}, {\"ism\": \"Vali\", \"guruh\": \"A\", \"ball\": 60}, {\"ism\": \"Hasan\", \"guruh\": \"B\", \"ball\": 95}]}\n",
        "expectedStdout": "A: 2 ta, o'rtacha 70.0\nB: 1 ta, o'rtacha 95.0\nEng yuqori: Hasan (95)\n",
        "hidden": false,
        "label": "Ikki guruhli statistika"
      },
      {
        "stdin": "{\"talabalar\": [{\"ism\": \"Zilola\", \"guruh\": \"C\", \"ball\": 100}]}\n",
        "expectedStdout": "C: 1 ta, o'rtacha 100.0\nEng yuqori: Zilola (100)\n",
        "hidden": false,
        "label": "Bitta talaba"
      },
      {
        "stdin": "{\"talabalar\": [{\"ism\": \"Anvar\", \"guruh\": \"B\", \"ball\": 90}, {\"ism\": \"Ali\", \"guruh\": \"A\", \"ball\": 90}]}\n",
        "expectedStdout": "A: 1 ta, o'rtacha 90.0\nB: 1 ta, o'rtacha 90.0\nEng yuqori: Ali (90)\n",
        "hidden": true,
        "label": "Ballar teng bo'lgan holat"
      },
      {
        "stdin": "{\"talabalar\": [{\"ism\": \"Sardor\", \"guruh\": \"C\", \"ball\": 70}, {\"ism\": \"Dilnoza\", \"guruh\": \"A\", \"ball\": 85}, {\"ism\": \"Bobur\", \"guruh\": \"B\", \"ball\": 65}, {\"ism\": \"Nodira\", \"guruh\": \"A\", \"ball\": 90}]}\n",
        "expectedStdout": "A: 2 ta, o'rtacha 87.5\nB: 1 ta, o'rtacha 65.0\nC: 1 ta, o'rtacha 70.0\nEng yuqori: Nodira (90)\n",
        "hidden": true,
        "label": "Guruhlar tartibsiz kelgan holat"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-53",
    "key": "backend-dars-53-easy",
    "title": "Statik marshrutlar jadvali",
    "difficulty": "EASY",
    "points": 10,
    "tags": [
      "django",
      "routing",
      "url"
    ],
    "description": "Django `urls.py` da URL naqshlari ro'yxati bo'ladi va so'rov kelganda Django ularni YUQORIDAN PASTGA solishtiradi — birinchi mos kelgani ishlaydi. Shu mantiqni yozamiz.\n\nKiritish (stdin):\n- 1-qator: `n` — naqshlar soni.\n- Keyingi `n` qator: `<naqsh> <view_nomi>` (bitta bo'sh joy bilan ajratilgan).\n- Keyin bitta qator: `m` — so'ralgan URL lar soni.\n- Keyingi `m` qator: URL.\n\nHar bir URL uchun mos kelgan BIRINCHI naqshning view nomini chiqaring. Solishtirish AYNAN teng bo'lishi kerak — `/haqida/` va `/haqida` har xil URL. Hech qaysi naqsh mos kelmasa `404` deb yozing.\n\nMisol — kiritish:\n```\n3\n/ bosh\n/haqida/ haqida\n/talabalar/ talabalar_royxati\n4\n/\n/haqida/\n/talabalar/\n/aloqa/\n```\nChiqish:\n```\nbosh\nhaqida\ntalabalar_royxati\n404\n```",
    "starterCodePy": "# Marshrutlar jadvalini o'qing, keyin har bir URL uchun view nomini toping.\nn = int(input())\n",
    "testCases": [
      {
        "stdin": "3\n/ bosh\n/haqida/ haqida\n/talabalar/ talabalar_royxati\n4\n/\n/haqida/\n/talabalar/\n/aloqa/\n",
        "expectedStdout": "bosh\nhaqida\ntalabalar_royxati\n404\n",
        "hidden": false,
        "label": "To'rtta URL tekshirildi"
      },
      {
        "stdin": "1\n/ bosh\n1\n/\n",
        "expectedStdout": "bosh\n",
        "hidden": false,
        "label": "Yagona marshrut"
      },
      {
        "stdin": "2\n/haqida/ haqida\n/aloqa/ aloqa\n2\n/haqida\n/aloqa/\n",
        "expectedStdout": "404\naloqa\n",
        "hidden": true,
        "label": "Aniq moslik holati"
      },
      {
        "stdin": "3\n/talabalar/ royxat\n/talabalar/ eski_royxat\n/guruhlar/ guruhlar\n2\n/talabalar/\n/guruhlar/\n",
        "expectedStdout": "royxat\nguruhlar\n",
        "hidden": true,
        "label": "Bitta naqsh jadvalda ikki marta uchraydi"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-53",
    "key": "backend-dars-53-medium",
    "title": "URL parametrlarini ushlash",
    "difficulty": "MEDIUM",
    "points": 20,
    "tags": [
      "django",
      "routing",
      "parametr"
    ],
    "description": "Django naqshlarida `<int:pk>` va `<str:kod>` kabi konvertorlar bo'ladi. `int` faqat butun sondan iborat bo'lakka, `str` esa istalgan bo'sh bo'lmagan bo'lakka mos keladi.\n\nKiritish (stdin): oson topshiriqdagi kabi — `n`, `n` ta `<naqsh> <view_nomi>` qatori, keyin `m` va `m` ta URL.\n\nSolishtirish qoidalari:\n- URL va naqsh `/` bo'yicha bo'laklarga bo'linadi (bo'sh bo'laklar hisobga olinmaydi).\n- Bo'laklar soni teng bo'lishi shart.\n- Oddiy bo'lak aynan teng bo'lishi kerak; `<int:nom>` faqat raqamlardan iborat bo'lakka mos keladi.\n- Naqshlar yuqoridan pastga tekshiriladi, birinchi mos kelgani g'olib.\n\nChiqarish: naqshda konvertor bo'lmasa faqat view nomi; bo'lsa `view(nom=qiymat, nom2=qiymat2)` — konvertorlar naqshdagi tartibda, ajratgich `, `. Mos naqsh bo'lmasa `404`.\n\nMisol — kiritish:\n```\n3\n/talabalar/ royxat\n/talabalar/<int:pk>/ detal\n/guruh/<str:kod>/talabalar/ guruh_royxat\n4\n/talabalar/\n/talabalar/5/\n/talabalar/abc/\n/guruh/B-12/talabalar/\n```\nChiqish:\n```\nroyxat\ndetal(pk=5)\n404\nguruh_royxat(kod=B-12)\n```",
    "starterCodePy": "# Naqshni URL ga solishtiring: <int:nom> faqat raqamli bo'lakka,\n# <str:nom> istalgan bo'sh bo'lmagan bo'lakka mos keladi.\ndef moslash(naqsh, url):\n    # Mos kelsa argumentlar ro'yxatini, aks holda None qaytaring.\n    pass\n\n\nn = int(input())\n",
    "testCases": [
      {
        "stdin": "3\n/talabalar/ royxat\n/talabalar/<int:pk>/ detal\n/guruh/<str:kod>/talabalar/ guruh_royxat\n4\n/talabalar/\n/talabalar/5/\n/talabalar/abc/\n/guruh/B-12/talabalar/\n",
        "expectedStdout": "royxat\ndetal(pk=5)\n404\nguruh_royxat(kod=B-12)\n",
        "hidden": false,
        "label": "Konvertorli marshrutlar"
      },
      {
        "stdin": "2\n/talabalar/<int:pk>/ detal\n/talabalar/<str:slug>/ slug_detal\n2\n/talabalar/7/\n/talabalar/ali-valiyev/\n",
        "expectedStdout": "detal(pk=7)\nslug_detal(slug=ali-valiyev)\n",
        "hidden": false,
        "label": "int va str tartibi"
      },
      {
        "stdin": "2\n/guruh/<str:kod>/talaba/<int:pk>/ guruh_talaba\n/ bosh\n3\n/guruh/A/talaba/3/\n/guruh/A/talaba/x/\n/\n",
        "expectedStdout": "guruh_talaba(kod=A, pk=3)\n404\nbosh\n",
        "hidden": true,
        "label": "Ikkita parametrli naqsh"
      },
      {
        "stdin": "2\n/talabalar/<int:pk>/ detal\n/talabalar/<int:pk>/baholar/ baholar\n2\n/talabalar/12/baholar/\n/talabalar/12/baholar/1/\n",
        "expectedStdout": "baholar(pk=12)\n404\n",
        "hidden": true,
        "label": "Bo'laklar soni mos kelmagan holat"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-53",
    "key": "backend-dars-53-hard",
    "title": "reverse(): nomdan URL qurish",
    "difficulty": "HARD",
    "points": 35,
    "tags": [
      "django",
      "routing",
      "reverse"
    ],
    "description": "Django da har bir marshrutga `name` beriladi va `reverse('nom', args)` orqali URL QAYTA quriladi — shunda manzil o'zgarsa ham kod buzilmaydi. Shuni yozamiz.\n\nKiritish (stdin):\n- 1-qator: `n`.\n- Keyingi `n` qator: `<naqsh> <nom>`.\n- Keyin `m`, so'ng `m` qator: `<nom> [arg1 arg2 ...]`.\n\nHar bir so'rov uchun bitta qator chiqaring — qurilgan URL yoki xato:\n- Bunday nom yo'q -> `XATO: nom topilmadi`\n- Argumentlar soni naqshdagi konvertorlar soniga teng emas -> `XATO: argument soni mos emas`\n- `<int:...>` o'rniga faqat raqamlardan iborat bo'lmagan argument berilgan -> `XATO: int emas`\n- Aks holda konvertorlarni naqshdagi tartibda argumentlar bilan almashtirib, URL ni chiqaring.\n\nMisol — kiritish:\n```\n3\n/talabalar/ royxat\n/talabalar/<int:pk>/ detal\n/guruh/<str:kod>/talabalar/<int:pk>/ guruh_talaba\n5\nroyxat\ndetal 7\ndetal abc\nguruh_talaba B-12 3\nyoq 1\n```\nChiqish:\n```\n/talabalar/\n/talabalar/7/\nXATO: int emas\n/guruh/B-12/talabalar/3/\nXATO: nom topilmadi\n```",
    "starterCodePy": "# reverse(): marshrut nomi va argumentlardan URL quring.\nn = int(input())\n",
    "testCases": [
      {
        "stdin": "3\n/talabalar/ royxat\n/talabalar/<int:pk>/ detal\n/guruh/<str:kod>/talabalar/<int:pk>/ guruh_talaba\n5\nroyxat\ndetal 7\ndetal abc\nguruh_talaba B-12 3\nyoq 1\n",
        "expectedStdout": "/talabalar/\n/talabalar/7/\nXATO: int emas\n/guruh/B-12/talabalar/3/\nXATO: nom topilmadi\n",
        "hidden": false,
        "label": "Beshta reverse chaqiruvi"
      },
      {
        "stdin": "2\n/haqida/ haqida\n/talabalar/<int:pk>/ detal\n2\nhaqida\ndetal 100\n",
        "expectedStdout": "/haqida/\n/talabalar/100/\n",
        "hidden": false,
        "label": "Oddiy va parametrli nom"
      },
      {
        "stdin": "2\n/talabalar/ royxat\n/talabalar/<int:pk>/ detal\n3\nroyxat 5\ndetal\ndetal 1 2\n",
        "expectedStdout": "XATO: argument soni mos emas\nXATO: argument soni mos emas\nXATO: argument soni mos emas\n",
        "hidden": true,
        "label": "Argumentlar boshqacha berilgan"
      },
      {
        "stdin": "1\n/guruh/<str:kod>/ guruh\n2\nguruh 12\nguruh B-12\n",
        "expectedStdout": "/guruh/12/\n/guruh/B-12/\n",
        "hidden": true,
        "label": "str konvertor raqamni ham qabul qiladi"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-54",
    "key": "backend-dars-54-easy",
    "title": "Query parametrni xavfsiz olish",
    "difficulty": "EASY",
    "points": 10,
    "tags": [
      "django",
      "view",
      "query"
    ],
    "description": "Django da `request.GET.get(kalit, zaxira)` query parametrni oladi va parametr bo'lmasa zaxira qiymatni qaytaradi. Shu mantiqni qo'lda yozamiz.\n\nKiritish (stdin):\n- 1-qator: query qatori, masalan `sort=ism&sahifa=2` (bo'sh qator ham bo'lishi mumkin).\n- 2-qator: `n` — so'rovlar soni.\n- Keyingi `n` qator: `kalit|zaxira` (vertikal chiziq bilan ajratilgan).\n\nHar bir so'rov uchun parametr qiymatini, u yo'q bo'lsa zaxira qiymatni chiqaring.\nQoidalar:\n- Juftliklar `&` bilan, kalit va qiymat `=` bilan ajratiladi.\n- `=` belgisi yo'q bo'lak butunlay e'tiborsiz qoldiriladi.\n- Qiymat bo'sh bo'lsa (`sort=`), parametr yo'q hisoblanadi va zaxira qaytariladi.\n- Bitta kalit bir necha marta uchrasa, OXIRGI qiymat olinadi.\n\nMisol — kiritish:\n```\nsort=ism&sahifa=2\n3\nsort|id\nsahifa|1\nlimit|10\n```\nChiqish:\n```\nism\n2\n10\n```",
    "starterCodePy": "# request.GET.get(kalit, zaxira) ni qo'lda yozamiz.\nqator = input()\n",
    "testCases": [
      {
        "stdin": "sort=ism&sahifa=2\n3\nsort|id\nsahifa|1\nlimit|10\n",
        "expectedStdout": "ism\n2\n10\n",
        "hidden": false,
        "label": "Uchta parametr so'raldi"
      },
      {
        "stdin": "\n1\nq|yoq\n",
        "expectedStdout": "yoq\n",
        "hidden": false,
        "label": "Query qatori bo'sh"
      },
      {
        "stdin": "guruh=A&guruh=B\n1\nguruh|X\n",
        "expectedStdout": "B\n",
        "hidden": true,
        "label": "Kalit takrorlangan holat"
      },
      {
        "stdin": "sort=&limit=5&buzuq\n3\nsort|ism\nlimit|3\nbuzuq|yoq\n",
        "expectedStdout": "ism\n5\nyoq\n",
        "hidden": true,
        "label": "Bo'sh qiymat va noto'g'ri bo'lak"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-54",
    "key": "backend-dars-54-medium",
    "title": "Ro'yxat view'i: filtr va sahifalash",
    "difficulty": "MEDIUM",
    "points": 20,
    "tags": [
      "django",
      "view",
      "sahifalash"
    ],
    "description": "Ro'yxat qaytaruvchi view odatda filtr va sahifalashni query parametrlardan oladi. Talabalar ro'yxati boshlang'ich kodda `TALABALAR` o'zgaruvchisida berilgan.\n\nKiritish (stdin): bitta qator — query qatori (bo'sh bo'lishi mumkin). Parsing qoidalari 54-darsning oson topshirig'idagi bilan bir xil: `&` va `=`, bo'sh qiymat yo'q hisoblanadi, takrorlangan kalitda oxirgisi olinadi.\n\nParametrlar:\n- `guruh` — berilgan bo'lsa, faqat shu guruh talabalari qoladi (aynan mos, katta-kichik harf muhim).\n- `limit` — sahifadagi elementlar soni. Faqat raqamlardan iborat va 1..10 oralig'ida bo'lsa qabul qilinadi, aks holda `3`.\n- `sahifa` — sahifa raqami. Faqat raqamlardan iborat va 1 dan kichik bo'lmasa qabul qilinadi, aks holda `1`.\n\nRo'yxatning asl tartibi saqlanadi. Chiqarish:\n```\nJami: <filtrdan keyingi umumiy son>\nSahifa: <sahifa>/<sahifalar soni>\n```\nSahifalar soni — `jami` ni `limit` ga bo'lib yuqoriga yaxlitlash, lekin kamida `1`.\nKeyin tanlangan sahifadagi har bir talaba: `#<id> <ism> (<guruh>)`. Sahifa bo'sh chiqsa, uning o'rniga bitta qator: `Bo'sh sahifa`.\n\nMisol — kiritish:\n```\nguruh=B&sahifa=2&limit=2\n```\nChiqish:\n```\nJami: 3\nSahifa: 2/2\n#7 Nodira (B)\n```",
    "starterCodePy": "# --- Talabalar ro'yxati (bu qismni o'zgartirmang) ---\nTALABALAR = [\n    {\"id\": 1, \"ism\": \"Ali\", \"guruh\": \"A\"},\n    {\"id\": 2, \"ism\": \"Vali\", \"guruh\": \"A\"},\n    {\"id\": 3, \"ism\": \"Hasan\", \"guruh\": \"B\"},\n    {\"id\": 4, \"ism\": \"Zilola\", \"guruh\": \"B\"},\n    {\"id\": 5, \"ism\": \"Malika\", \"guruh\": \"A\"},\n    {\"id\": 6, \"ism\": \"Sardor\", \"guruh\": \"C\"},\n    {\"id\": 7, \"ism\": \"Nodira\", \"guruh\": \"B\"},\n]\n# --- Ma'lumot tugadi ---\n\n\n# 1) Query qatorini lug'atga aylantiring.\n# 2) guruh bo'yicha filtrlang, limit va sahifa ni hisoblang.\n# 3) Jami, Sahifa va tanlangan bo'lakni chiqaring.\nqator = input()\n",
    "testCases": [
      {
        "stdin": "guruh=B&sahifa=2&limit=2\n",
        "expectedStdout": "Jami: 3\nSahifa: 2/2\n#7 Nodira (B)\n",
        "hidden": false,
        "label": "Filtr va ikkinchi sahifa"
      },
      {
        "stdin": "\n",
        "expectedStdout": "Jami: 7\nSahifa: 1/3\n#1 Ali (A)\n#2 Vali (A)\n#3 Hasan (B)\n",
        "hidden": false,
        "label": "Parametrsiz birinchi sahifa"
      },
      {
        "stdin": "guruh=Z\n",
        "expectedStdout": "Jami: 0\nSahifa: 1/1\nBo'sh sahifa\n",
        "hidden": true,
        "label": "Mos talaba yo'q"
      },
      {
        "stdin": "sahifa=9&limit=99\n",
        "expectedStdout": "Jami: 7\nSahifa: 9/3\nBo'sh sahifa\n",
        "hidden": true,
        "label": "Noto'g'ri limit va diapazondan tashqari sahifa"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-54",
    "key": "backend-dars-54-hard",
    "title": "JSON qaytaruvchi view'lar",
    "difficulty": "HARD",
    "points": 35,
    "tags": [
      "django",
      "view",
      "json"
    ],
    "description": "Uchta view yozamiz: ro'yxat, bitta element va qidiruv. Talabalar ro'yxati boshlang'ich kodda `TALABALAR` o'zgaruvchisida berilgan.\n\nKiritish (stdin):\n- 1-qator: `n` — so'rovlar soni.\n- Keyingi `n` qator: `<METOD> <to'liq yo'l>`, masalan `GET /api/qidiruv/?q=al`.\n\nHar bir so'rov uchun IKKI qator chiqaring: avval status kod, keyin javob tanasi — aynan `json.dumps(tana, ensure_ascii=False, sort_keys=True)` natijasi.\n\nQoidalar (shu tartibda):\n- Metod `GET` emas -> `405` va `{\"xato\": \"metod ruxsat etilmagan\"}`\n- `/api/talabalar/` -> `200` va `{\"count\": <umumiy son>, \"results\": <butun ro'yxat>}`\n- `/api/qidiruv/` -> `q` parametri yo'q yoki bo'sh bo'lsa `400` va `{\"xato\": \"q parametri kerak\"}`; aks holda `200` va ismida `q` qatnashgan (katta-kichik harf farqsiz) talabalar bilan `{\"count\": ..., \"results\": ...}`\n- `/api/talabalar/<raqam>/` -> topilsa `200` va talabaning o'zi (lug'at), topilmasa `404` va `{\"xato\": \"topilmadi\"}`\n- Qolgan barcha yo'llar -> `404` va `{\"xato\": \"topilmadi\"}`\n\nMisol — kiritish:\n```\n2\nGET /api/talabalar/3/\nPOST /api/talabalar/\n```\nChiqish:\n```\n200\n{\"guruh\": \"B\", \"id\": 3, \"ism\": \"Hasan\"}\n405\n{\"xato\": \"metod ruxsat etilmagan\"}\n```",
    "starterCodePy": "# --- Talabalar ro'yxati (bu qismni o'zgartirmang) ---\nTALABALAR = [\n    {\"id\": 1, \"ism\": \"Ali\", \"guruh\": \"A\"},\n    {\"id\": 2, \"ism\": \"Vali\", \"guruh\": \"A\"},\n    {\"id\": 3, \"ism\": \"Hasan\", \"guruh\": \"B\"},\n    {\"id\": 4, \"ism\": \"Zilola\", \"guruh\": \"B\"},\n    {\"id\": 5, \"ism\": \"Malika\", \"guruh\": \"A\"},\n    {\"id\": 6, \"ism\": \"Sardor\", \"guruh\": \"C\"},\n    {\"id\": 7, \"ism\": \"Nodira\", \"guruh\": \"B\"},\n]\n# --- Ma'lumot tugadi ---\nimport json\n\n# 1) So'rovni metod va yo'lga ajrating, query parametrlarni oling.\n# 2) Yo'lga qarab kerakli javobni tayyorlang.\n# 3) Avval status kodni, keyin\n#    json.dumps(tana, ensure_ascii=False, sort_keys=True) natijasini chiqaring.\nn = int(input())\n",
    "testCases": [
      {
        "stdin": "2\nGET /api/talabalar/3/\nPOST /api/talabalar/\n",
        "expectedStdout": "200\n{\"guruh\": \"B\", \"id\": 3, \"ism\": \"Hasan\"}\n405\n{\"xato\": \"metod ruxsat etilmagan\"}\n",
        "hidden": false,
        "label": "Bitta element va noto'g'ri metod"
      },
      {
        "stdin": "2\nGET /api/qidiruv/?q=al\nGET /api/yoq/\n",
        "expectedStdout": "200\n{\"count\": 3, \"results\": [{\"guruh\": \"A\", \"id\": 1, \"ism\": \"Ali\"}, {\"guruh\": \"A\", \"id\": 2, \"ism\": \"Vali\"}, {\"guruh\": \"A\", \"id\": 5, \"ism\": \"Malika\"}]}\n404\n{\"xato\": \"topilmadi\"}\n",
        "hidden": false,
        "label": "Qidiruv va noma'lum yo'l"
      },
      {
        "stdin": "3\nGET /api/talabalar/\nGET /api/talabalar/99/\nGET /api/qidiruv/\n",
        "expectedStdout": "200\n{\"count\": 7, \"results\": [{\"guruh\": \"A\", \"id\": 1, \"ism\": \"Ali\"}, {\"guruh\": \"A\", \"id\": 2, \"ism\": \"Vali\"}, {\"guruh\": \"B\", \"id\": 3, \"ism\": \"Hasan\"}, {\"guruh\": \"B\", \"id\": 4, \"ism\": \"Zilola\"}, {\"guruh\": \"A\", \"id\": 5, \"ism\": \"Malika\"}, {\"guruh\": \"C\", \"id\": 6, \"ism\": \"Sardor\"}, {\"guruh\": \"B\", \"id\": 7, \"ism\": \"Nodira\"}]}\n404\n{\"xato\": \"topilmadi\"}\n400\n{\"xato\": \"q parametri kerak\"}\n",
        "hidden": true,
        "label": "To'liq ro'yxat va bo'sh qidiruv"
      },
      {
        "stdin": "2\nGET /api/qidiruv/?q=ZI\nDELETE /api/talabalar/1/\n",
        "expectedStdout": "200\n{\"count\": 1, \"results\": [{\"guruh\": \"B\", \"id\": 4, \"ism\": \"Zilola\"}]}\n405\n{\"xato\": \"metod ruxsat etilmagan\"}\n",
        "hidden": true,
        "label": "Katta harfli qidiruv"
      }
    ]
  }
];
