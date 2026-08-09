import type { LessonProblemRecord } from './types';

/**
 * Hand-authored practice problems for backend lessons 41-47 (SQL va Python + DB).
 * Grading is exact-output, so every `expectedStdout` below was captured from a real
 * run of a reference solution on the Piston sandbox (python 3.10.0) against the
 * matching `stdin` — none of them are written from memory.
 *
 * Lessons 41-45 teach SQL itself, not Python: their starter code contains a ready-made
 * `sqlite3` fixture and the student only fills in the SQL string.
 */
export const backendProblemsP05: LessonProblemRecord[] = [
  {
    "lessonKey": "backend-dars-41",
    "key": "backend-dars-41-easy",
    "title": "Yangi mahsulot qo'shish",
    "difficulty": "EASY",
    "points": 10,
    "tags": [
      "sql",
      "insert",
      "baza"
    ],
    "description": "`mahsulot` jadvalida uchta ustun bor: `id` (butun son, PRIMARY KEY), `nom` (matn), `narx` (butun son).\n\nTayyor qism jadvalni yaratadi va kirishdagi yozuvlarni o'zi qo'shadi. Sizning vazifangiz — `SQL` matniga **bitta INSERT buyrug'i** yozib, jadvalga aynan shu yozuvni qo'shish:\n\n- `id` = 100\n- `nom` = Klaviatura\n- `narx` = 250000\n\nUstunlar ro'yxatini yozishni unutmang: `INSERT INTO mahsulot (id, nom, narx) VALUES (...);` Buyruq oxiriga nuqta-vergul (`;`) qo'ying.\n\nKirish (stdin) tayyor qism tomonidan o'qiladi: birinchi qatorda yozuvlar soni `n`, keyin `n` ta qator `id;nom;narx` ko'rinishida. Chiqishni ham tayyor qism chiqaradi — har bir yozuv `id|nom|narx` shaklida, `id` bo'yicha o'sish tartibida.\n\n**Misol — kirish:**\n\n```\n3\n1;Non;5000\n2;Sut;12000\n3;Guruch;18000\n```\n\n**Kutilgan chiqish:**\n\n```\n1|Non|5000\n2|Sut|12000\n3|Guruch|18000\n100|Klaviatura|250000\n```",
    "starterCodePy": "import sqlite3, sys\n\n# ===== TAYYOR QISM — bu yerni o'zgartirmang. Baza avtomatik quriladi. =====\nqatorlar = sys.stdin.read().splitlines()\nn = int(qatorlar[0])\nconn = sqlite3.connect(\":memory:\")\ncur = conn.cursor()\ncur.execute(\"CREATE TABLE mahsulot (id INTEGER PRIMARY KEY, nom TEXT NOT NULL, narx INTEGER NOT NULL)\")\nfor satr in qatorlar[1:n + 1]:\n    ustun = satr.split(\";\")\n    cur.execute(\"INSERT INTO mahsulot VALUES (?, ?, ?)\", (int(ustun[0]), ustun[1], int(ustun[2])))\n# ===== TAYYOR QISM TUGADI =====\n\nSQL = \"\"\"\n-- shu yerga SQL buyrug'ingizni yozing\n\"\"\"\n\ncur.executescript(SQL)\n\nfor qator in cur.execute(\"SELECT id, nom, narx FROM mahsulot ORDER BY id\"):\n    print(\"|\".join(str(x) for x in qator))\n",
    "testCases": [
      {
        "stdin": "3\n1;Non;5000\n2;Sut;12000\n3;Guruch;18000\n",
        "expectedStdout": "1|Non|5000\n2|Sut|12000\n3|Guruch|18000\n100|Klaviatura|250000\n",
        "hidden": false,
        "label": "Asosiy misol"
      },
      {
        "stdin": "1\n7;Choy;9000\n",
        "expectedStdout": "7|Choy|9000\n100|Klaviatura|250000\n",
        "hidden": false,
        "label": "Bitta yozuvli jadval"
      },
      {
        "stdin": "4\n1;Non;5000\n2;Sut;120000\n3;Guruch;18000\n5;Yog;95000\n",
        "expectedStdout": "1|Non|5000\n2|Sut|120000\n3|Guruch|18000\n5|Yog|95000\n100|Klaviatura|250000\n",
        "hidden": true,
        "label": "Kattaroq jadval"
      },
      {
        "stdin": "0\n",
        "expectedStdout": "100|Klaviatura|250000\n",
        "hidden": true,
        "label": "Bo'sh jadval"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-41",
    "key": "backend-dars-41-medium",
    "title": "Arzon mahsulotlarni qimmatlashtirish",
    "difficulty": "MEDIUM",
    "points": 20,
    "tags": [
      "sql",
      "update",
      "where"
    ],
    "description": "`mahsulot` jadvali (`id`, `nom`, `narx`) tayyor qism tomonidan quriladi.\n\n`SQL` matniga **bitta UPDATE buyrug'i** yozing: narxi **100000 dan kichik** bo'lgan barcha mahsulotlar narxini 5000 ga oshiring. Narxi aynan 100000 yoki undan katta bo'lganlar o'zgarmasligi kerak — ya'ni `WHERE` shartisiz UPDATE yozmang.\n\nKirish: birinchi qatorda yozuvlar soni `n`, keyin `n` ta `id;nom;narx` qatori. Chiqishni tayyor qism o'zi chiqaradi: `id|nom|narx`, `id` bo'yicha o'sish tartibida.\n\n**Misol — kirish:**\n\n```\n3\n1;Non;5000\n2;Sut;12000\n3;Guruch;18000\n```\n\n**Kutilgan chiqish:**\n\n```\n1|Non|10000\n2|Sut|17000\n3|Guruch|23000\n```",
    "starterCodePy": "import sqlite3, sys\n\n# ===== TAYYOR QISM — bu yerni o'zgartirmang. Baza avtomatik quriladi. =====\nqatorlar = sys.stdin.read().splitlines()\nn = int(qatorlar[0])\nconn = sqlite3.connect(\":memory:\")\ncur = conn.cursor()\ncur.execute(\"CREATE TABLE mahsulot (id INTEGER PRIMARY KEY, nom TEXT NOT NULL, narx INTEGER NOT NULL)\")\nfor satr in qatorlar[1:n + 1]:\n    ustun = satr.split(\";\")\n    cur.execute(\"INSERT INTO mahsulot VALUES (?, ?, ?)\", (int(ustun[0]), ustun[1], int(ustun[2])))\n# ===== TAYYOR QISM TUGADI =====\n\nSQL = \"\"\"\n-- shu yerga SQL buyrug'ingizni yozing\n\"\"\"\n\ncur.executescript(SQL)\n\nfor qator in cur.execute(\"SELECT id, nom, narx FROM mahsulot ORDER BY id\"):\n    print(\"|\".join(str(x) for x in qator))\n",
    "testCases": [
      {
        "stdin": "3\n1;Non;5000\n2;Sut;12000\n3;Guruch;18000\n",
        "expectedStdout": "1|Non|10000\n2|Sut|17000\n3|Guruch|23000\n",
        "hidden": false,
        "label": "Asosiy misol"
      },
      {
        "stdin": "4\n1;Non;5000\n2;Sut;120000\n3;Guruch;18000\n5;Yog;95000\n",
        "expectedStdout": "1|Non|10000\n2|Sut|120000\n3|Guruch|23000\n5|Yog|100000\n",
        "hidden": false,
        "label": "Qimmat mahsulotlar ham bor"
      },
      {
        "stdin": "3\n1;A;100000\n2;B;99999\n3;C;100001\n",
        "expectedStdout": "1|A|100000\n2|B|104999\n3|C|100001\n",
        "hidden": true,
        "label": "Chegaradagi narxlar"
      },
      {
        "stdin": "0\n",
        "expectedStdout": "",
        "hidden": true,
        "label": "Bo'sh jadval"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-41",
    "key": "backend-dars-41-hard",
    "title": "Omborni tozalash",
    "difficulty": "HARD",
    "points": 35,
    "tags": [
      "sql",
      "delete",
      "update"
    ],
    "description": "`mahsulot` jadvalida to'rtta ustun bor: `id`, `nom`, `narx`, `soni`.\n\n`SQL` matniga **ikkita buyruq** yozing (shu tartibda, har biri nuqta-vergul bilan tugasin):\n\n1. `soni` = 0 bo'lgan barcha yozuvlarni **o'chiring**.\n2. Qolganlaridan narxi **500000 dan katta** bo'lganlarning narxidan 50000 ni **ayiring** (narxi aynan 500000 bo'lgani o'zgarmaydi).\n\nTartib muhim: avval DELETE, keyin UPDATE.\n\nKirish: birinchi qatorda `n`, keyin `n` ta `id;nom;narx;soni` qatori. Chiqishni tayyor qism chiqaradi: `id|nom|narx|soni`, `id` bo'yicha o'sish tartibida.\n\n**Misol — kirish:**\n\n```\n4\n1;Non;5000;10\n2;Sut;12000;0\n3;Noutbuk;7000000;3\n4;Sichqoncha;120000;5\n```\n\n**Kutilgan chiqish:**\n\n```\n1|Non|5000|10\n3|Noutbuk|6950000|3\n4|Sichqoncha|120000|5\n```",
    "starterCodePy": "import sqlite3, sys\n\n# ===== TAYYOR QISM — bu yerni o'zgartirmang. Baza avtomatik quriladi. =====\nqatorlar = sys.stdin.read().splitlines()\nn = int(qatorlar[0])\nconn = sqlite3.connect(\":memory:\")\ncur = conn.cursor()\ncur.execute(\"CREATE TABLE mahsulot (id INTEGER PRIMARY KEY, nom TEXT NOT NULL, narx INTEGER NOT NULL, soni INTEGER NOT NULL)\")\nfor satr in qatorlar[1:n + 1]:\n    ustun = satr.split(\";\")\n    cur.execute(\"INSERT INTO mahsulot VALUES (?, ?, ?, ?)\", (int(ustun[0]), ustun[1], int(ustun[2]), int(ustun[3])))\n# ===== TAYYOR QISM TUGADI =====\n\nSQL = \"\"\"\n-- shu yerga SQL buyrug'ingizni yozing\n\"\"\"\n\ncur.executescript(SQL)\n\nfor qator in cur.execute(\"SELECT id, nom, narx, soni FROM mahsulot ORDER BY id\"):\n    print(\"|\".join(str(x) for x in qator))\n",
    "testCases": [
      {
        "stdin": "4\n1;Non;5000;10\n2;Sut;12000;0\n3;Noutbuk;7000000;3\n4;Sichqoncha;120000;5\n",
        "expectedStdout": "1|Non|5000|10\n3|Noutbuk|6950000|3\n4|Sichqoncha|120000|5\n",
        "hidden": false,
        "label": "Asosiy misol"
      },
      {
        "stdin": "3\n1;A;600000;0\n2;B;500000;2\n3;C;499999;1\n",
        "expectedStdout": "2|B|500000|2\n3|C|499999|1\n",
        "hidden": false,
        "label": "Chegaradagi narxlar"
      },
      {
        "stdin": "2\n1;Choy;9000;4\n2;Qand;8000;7\n",
        "expectedStdout": "1|Choy|9000|4\n2|Qand|8000|7\n",
        "hidden": true,
        "label": "Hech narsa o'chirilmaydi"
      },
      {
        "stdin": "1\n9;Monitor;900000;0\n",
        "expectedStdout": "",
        "hidden": true,
        "label": "Hamma yozuv o'chib ketadi"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-42",
    "key": "backend-dars-42-easy",
    "title": "Ismi A bilan boshlanadiganlar",
    "difficulty": "EASY",
    "points": 10,
    "tags": [
      "sql",
      "like",
      "filtr"
    ],
    "description": "`talaba` jadvalida `id`, `ism`, `shahar`, `ball` ustunlari bor.\n\n`SQL` matniga **bitta SELECT so'rovi** yozing: ismi `A` harfi bilan **boshlanadigan** talabalarning `ism` va `shahar` ustunlarini chiqaring. Natija `ism` bo'yicha **alifbo tartibida (o'sish)** bo'lsin.\n\nYa'ni so'rov aynan ikkita ustun qaytarishi kerak: avval `ism`, keyin `shahar`. Qidiruvni `LIKE` bilan yozing.\n\nKirish: birinchi qatorda `n`, keyin `n` ta `id;ism;shahar;ball` qatori (bo'sh katak — NULL). Chiqishni tayyor qism chiqaradi: har bir qator `ism|shahar` ko'rinishida.\n\n**Misol — kirish:**\n\n```\n5\n1;Anvar;Toshkent;80\n2;Bekzod;Samarqand;65\n3;Aziza;Toshkent;95\n4;Dilshod;Buxoro;55\n5;Aliya;Namangan;70\n```\n\n**Kutilgan chiqish:**\n\n```\nAliya|Namangan\nAnvar|Toshkent\nAziza|Toshkent\n```",
    "starterCodePy": "import sqlite3, sys\n\n# ===== TAYYOR QISM — bu yerni o'zgartirmang. Baza avtomatik quriladi. =====\nqatorlar = sys.stdin.read().splitlines()\nn = int(qatorlar[0])\nconn = sqlite3.connect(\":memory:\")\ncur = conn.cursor()\ncur.execute(\"CREATE TABLE talaba (id INTEGER PRIMARY KEY, ism TEXT, shahar TEXT, ball INTEGER)\")\nfor satr in qatorlar[1:n + 1]:\n    ustun = satr.split(\";\")\n    shahar = ustun[2] if ustun[2] != \"\" else None      # bo'sh katak = NULL\n    ball = int(ustun[3]) if ustun[3] != \"\" else None   # bo'sh katak = NULL\n    cur.execute(\"INSERT INTO talaba VALUES (?, ?, ?, ?)\", (int(ustun[0]), ustun[1], shahar, ball))\n# ===== TAYYOR QISM TUGADI =====\n\nSQL = \"\"\"\n-- shu yerga SELECT so'rovingizni yozing\n\"\"\"\n\nfor qator in cur.execute(SQL):\n    print(\"|\".join(\"\" if x is None else str(x) for x in qator))\n",
    "testCases": [
      {
        "stdin": "5\n1;Anvar;Toshkent;80\n2;Bekzod;Samarqand;65\n3;Aziza;Toshkent;95\n4;Dilshod;Buxoro;55\n5;Aliya;Namangan;70\n",
        "expectedStdout": "Aliya|Namangan\nAnvar|Toshkent\nAziza|Toshkent\n",
        "hidden": false,
        "label": "Asosiy misol"
      },
      {
        "stdin": "4\n1;Sardor;Toshkent;60\n2;Alisher;Andijon;90\n3;Aziz;Samarqand;\n4;Nodira;Toshkent;45\n",
        "expectedStdout": "Alisher|Andijon\nAziz|Samarqand\n",
        "hidden": false,
        "label": "Boshqa ro'yxat"
      },
      {
        "stdin": "3\n1;Bobur;Xiva;50\n2;Zulfiya;Nukus;77\n3;Temur;Qarshi;88\n",
        "expectedStdout": "",
        "hidden": true,
        "label": "Mos keluvchi yo'q"
      },
      {
        "stdin": "5\n1;Aaa;Toshkent;\n2;Abbos;Samarqand;60\n3;Aziz;Toshkent;90\n4;Alisher;Buxoro;61\n5;Baxtiyor;Toshkent;100\n",
        "expectedStdout": "Aaa|Toshkent\nAbbos|Samarqand\nAlisher|Buxoro\nAziz|Toshkent\n",
        "hidden": true,
        "label": "Bir nechta o'xshash ism"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-42",
    "key": "backend-dars-42-medium",
    "title": "Shahar va ball oralig'i bo'yicha filtr",
    "difficulty": "MEDIUM",
    "points": 20,
    "tags": [
      "sql",
      "in",
      "between"
    ],
    "description": "`talaba` jadvali (`id`, `ism`, `shahar`, `ball`) tayyor qism tomonidan quriladi.\n\n`SQL` matniga **bitta SELECT so'rovi** yozing va shu ikki shartni birga qo'llang:\n\n- `shahar` — `Toshkent` yoki `Samarqand` (`IN` dan foydalaning);\n- `ball` — 60 va 90 **oralig'ida**, ikkala chegara ham kiradi (`BETWEEN` dan foydalaning).\n\nSo'rov `ism` va `ball` ustunlarini shu tartibda qaytarsin. Natija `ball` bo'yicha **kamayish** tartibida, ballari teng bo'lsa `ism` bo'yicha alifbo tartibida chiqsin.\n\nKirish: birinchi qatorda `n`, keyin `n` ta `id;ism;shahar;ball` qatori (bo'sh katak — NULL). Chiqishni tayyor qism chiqaradi: har bir qator `ism|ball` ko'rinishida.\n\n**Misol — kirish:**\n\n```\n5\n1;Anvar;Toshkent;80\n2;Bekzod;Samarqand;65\n3;Aziza;Toshkent;95\n4;Dilshod;Buxoro;55\n5;Aliya;Namangan;70\n```\n\n**Kutilgan chiqish:**\n\n```\nAnvar|80\nBekzod|65\n```",
    "starterCodePy": "import sqlite3, sys\n\n# ===== TAYYOR QISM — bu yerni o'zgartirmang. Baza avtomatik quriladi. =====\nqatorlar = sys.stdin.read().splitlines()\nn = int(qatorlar[0])\nconn = sqlite3.connect(\":memory:\")\ncur = conn.cursor()\ncur.execute(\"CREATE TABLE talaba (id INTEGER PRIMARY KEY, ism TEXT, shahar TEXT, ball INTEGER)\")\nfor satr in qatorlar[1:n + 1]:\n    ustun = satr.split(\";\")\n    shahar = ustun[2] if ustun[2] != \"\" else None      # bo'sh katak = NULL\n    ball = int(ustun[3]) if ustun[3] != \"\" else None   # bo'sh katak = NULL\n    cur.execute(\"INSERT INTO talaba VALUES (?, ?, ?, ?)\", (int(ustun[0]), ustun[1], shahar, ball))\n# ===== TAYYOR QISM TUGADI =====\n\nSQL = \"\"\"\n-- shu yerga SELECT so'rovingizni yozing\n\"\"\"\n\nfor qator in cur.execute(SQL):\n    print(\"|\".join(\"\" if x is None else str(x) for x in qator))\n",
    "testCases": [
      {
        "stdin": "5\n1;Anvar;Toshkent;80\n2;Bekzod;Samarqand;65\n3;Aziza;Toshkent;95\n4;Dilshod;Buxoro;55\n5;Aliya;Namangan;70\n",
        "expectedStdout": "Anvar|80\nBekzod|65\n",
        "hidden": false,
        "label": "Asosiy misol"
      },
      {
        "stdin": "4\n1;Sardor;Toshkent;60\n2;Alisher;Andijon;90\n3;Aziz;Samarqand;\n4;Nodira;Toshkent;45\n",
        "expectedStdout": "Sardor|60\n",
        "hidden": false,
        "label": "NULL ball ham bor"
      },
      {
        "stdin": "4\n1;Aziz;Toshkent;60\n2;Bek;Samarqand;90\n3;Vali;Toshkent;91\n4;Gani;Samarqand;59\n",
        "expectedStdout": "Bek|90\nAziz|60\n",
        "hidden": true,
        "label": "Chegaraviy ballar"
      },
      {
        "stdin": "3\n1;Bobur;Xiva;50\n2;Zulfiya;Nukus;77\n3;Temur;Qarshi;88\n",
        "expectedStdout": "",
        "hidden": true,
        "label": "Kerakli shaharlar yo'q"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-42",
    "key": "backend-dars-42-hard",
    "title": "Ballsizlar qaysi shaharlardan",
    "difficulty": "HARD",
    "points": 35,
    "tags": [
      "sql",
      "null",
      "distinct"
    ],
    "description": "`talaba` jadvalida ba'zi talabalarning `ball` ustuni bo'sh (NULL) bo'lishi mumkin, ba'zilarining `shahar` ustuni ham NULL bo'lishi mumkin.\n\n`SQL` matniga **bitta SELECT so'rovi** yozing: `ball` ustuni **NULL bo'lgan** talabalarning shaharlarini **takrorlanmasdan** (`DISTINCT`) chiqaring. Shahri NULL bo'lgan talaba natijaga tushmasin. Natija shahar nomi bo'yicha alifbo tartibida bo'lsin.\n\nDiqqat: NULL ni `= NULL` bilan tekshirib bo'lmaydi — `IS NULL` / `IS NOT NULL` ishlating. So'rov faqat bitta ustun (`shahar`) qaytarsin.\n\nKirish: birinchi qatorda `n`, keyin `n` ta `id;ism;shahar;ball` qatori (bo'sh katak — NULL). Chiqishni tayyor qism chiqaradi: har bir shahar alohida qatorda.\n\n**Misol — kirish:**\n\n```\n6\n1;Anvar;Toshkent;\n2;Bek;Samarqand;70\n3;Dilnoza;Toshkent;\n4;Elyor;;\n5;Farrux;Buxoro;\n6;Gulnora;Buxoro;55\n```\n\n**Kutilgan chiqish:**\n\n```\nBuxoro\nToshkent\n```",
    "starterCodePy": "import sqlite3, sys\n\n# ===== TAYYOR QISM — bu yerni o'zgartirmang. Baza avtomatik quriladi. =====\nqatorlar = sys.stdin.read().splitlines()\nn = int(qatorlar[0])\nconn = sqlite3.connect(\":memory:\")\ncur = conn.cursor()\ncur.execute(\"CREATE TABLE talaba (id INTEGER PRIMARY KEY, ism TEXT, shahar TEXT, ball INTEGER)\")\nfor satr in qatorlar[1:n + 1]:\n    ustun = satr.split(\";\")\n    shahar = ustun[2] if ustun[2] != \"\" else None      # bo'sh katak = NULL\n    ball = int(ustun[3]) if ustun[3] != \"\" else None   # bo'sh katak = NULL\n    cur.execute(\"INSERT INTO talaba VALUES (?, ?, ?, ?)\", (int(ustun[0]), ustun[1], shahar, ball))\n# ===== TAYYOR QISM TUGADI =====\n\nSQL = \"\"\"\n-- shu yerga SELECT so'rovingizni yozing\n\"\"\"\n\nfor qator in cur.execute(SQL):\n    print(\"|\".join(\"\" if x is None else str(x) for x in qator))\n",
    "testCases": [
      {
        "stdin": "6\n1;Anvar;Toshkent;\n2;Bek;Samarqand;70\n3;Dilnoza;Toshkent;\n4;Elyor;;\n5;Farrux;Buxoro;\n6;Gulnora;Buxoro;55\n",
        "expectedStdout": "Buxoro\nToshkent\n",
        "hidden": false,
        "label": "Asosiy misol"
      },
      {
        "stdin": "4\n1;Sardor;Toshkent;60\n2;Alisher;Andijon;90\n3;Aziz;Samarqand;\n4;Nodira;Toshkent;45\n",
        "expectedStdout": "Samarqand\n",
        "hidden": false,
        "label": "Bitta ballsiz talaba"
      },
      {
        "stdin": "5\n1;Anvar;Toshkent;80\n2;Bekzod;Samarqand;65\n3;Aziza;Toshkent;95\n4;Dilshod;Buxoro;55\n5;Aliya;Namangan;70\n",
        "expectedStdout": "",
        "hidden": true,
        "label": "Ballsiz talaba yo'q"
      },
      {
        "stdin": "3\n1;A;;\n2;B;;\n3;C;Xiva;\n",
        "expectedStdout": "Xiva\n",
        "hidden": true,
        "label": "Ko'p NULL shahar"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-43",
    "key": "backend-dars-43-easy",
    "title": "Talaba va uning guruhi",
    "difficulty": "EASY",
    "points": 10,
    "tags": [
      "sql",
      "join",
      "inner-join"
    ],
    "description": "Ikkita jadval bor:\n\n- `guruh(id, nom)`\n- `talaba(id, ism, guruh_id)` — `guruh_id` `guruh.id` ga ishora qiladi, u NULL bo'lishi ham mumkin.\n\n`SQL` matniga **bitta SELECT so'rovi** yozing: `INNER JOIN` yordamida har bir talabaning ismi va uning guruhi nomini chiqaring. Guruhi yo'q (yoki mavjud bo'lmagan guruhga ishora qiluvchi) talabalar natijaga tushmasin.\n\nSo'rov ikkita ustun qaytarsin: avval talaba ismi, keyin guruh nomi. Natija ism bo'yicha alifbo tartibida bo'lsin.\n\nKirish: birinchi qatorda guruhlar soni, keyin shuncha `id;nom` qatori; so'ng talabalar soni va shuncha `id;ism;guruh_id` qatori (bo'sh katak — NULL). Chiqishni tayyor qism chiqaradi: `ism|guruh nomi`.\n\n**Misol — kirish:**\n\n```\n2\n1;IT-1\n2;IT-2\n4\n1;Anvar;1\n2;Bekzod;2\n3;Dilnoza;1\n4;Elyor;\n```\n\n**Kutilgan chiqish:**\n\n```\nAnvar|IT-1\nBekzod|IT-2\nDilnoza|IT-1\n```",
    "starterCodePy": "import sqlite3, sys\n\n# ===== TAYYOR QISM — bu yerni o'zgartirmang. Baza avtomatik quriladi. =====\nqatorlar = sys.stdin.read().splitlines()\no = 0\nconn = sqlite3.connect(\":memory:\")\ncur = conn.cursor()\ncur.execute(\"CREATE TABLE guruh (id INTEGER PRIMARY KEY, nom TEXT NOT NULL)\")\ncur.execute(\"CREATE TABLE talaba (id INTEGER PRIMARY KEY, ism TEXT NOT NULL, guruh_id INTEGER REFERENCES guruh(id))\")\ng = int(qatorlar[o]); o += 1\nfor satr in qatorlar[o:o + g]:\n    ustun = satr.split(\";\")\n    cur.execute(\"INSERT INTO guruh VALUES (?, ?)\", (int(ustun[0]), ustun[1]))\no += g\nt = int(qatorlar[o]); o += 1\nfor satr in qatorlar[o:o + t]:\n    ustun = satr.split(\";\")\n    gid = int(ustun[2]) if ustun[2] != \"\" else None\n    cur.execute(\"INSERT INTO talaba VALUES (?, ?, ?)\", (int(ustun[0]), ustun[1], gid))\no += t\n# ===== TAYYOR QISM TUGADI =====\n\nSQL = \"\"\"\n-- shu yerga SELECT so'rovingizni yozing\n\"\"\"\n\nfor qator in cur.execute(SQL):\n    print(\"|\".join(\"\" if x is None else str(x) for x in qator))\n",
    "testCases": [
      {
        "stdin": "2\n1;IT-1\n2;IT-2\n4\n1;Anvar;1\n2;Bekzod;2\n3;Dilnoza;1\n4;Elyor;\n",
        "expectedStdout": "Anvar|IT-1\nBekzod|IT-2\nDilnoza|IT-1\n",
        "hidden": false,
        "label": "Asosiy misol"
      },
      {
        "stdin": "3\n1;Frontend\n2;Backend\n3;Dizayn\n3\n10;Sardor;2\n11;Aziza;\n12;Jasur;9\n",
        "expectedStdout": "Sardor|Backend\n",
        "hidden": false,
        "label": "Noto'g'ri havola bor"
      },
      {
        "stdin": "1\n5;Yagona\n2\n1;Aaa;5\n2;Bbb;5\n",
        "expectedStdout": "Aaa|Yagona\nBbb|Yagona\n",
        "hidden": true,
        "label": "Hamma bitta guruhda"
      },
      {
        "stdin": "2\n1;A guruh\n2;B guruh\n0\n",
        "expectedStdout": "",
        "hidden": true,
        "label": "Talabalar yo'q"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-43",
    "key": "backend-dars-43-medium",
    "title": "Guruhsiz talabalarni topish",
    "difficulty": "MEDIUM",
    "points": 20,
    "tags": [
      "sql",
      "left-join",
      "null"
    ],
    "description": "Jadvallar: `guruh(id, nom)` va `talaba(id, ism, guruh_id)`.\n\n`SQL` matniga **bitta SELECT so'rovi** yozing: hech qanday mavjud guruhga bog'lanmagan talabalar ismini toping. Bunga ikki holat kiradi — `guruh_id` NULL bo'lgan talaba va `guruh_id` mavjud bo'lmagan guruhga ishora qiladigan talaba.\n\n`LEFT JOIN` qiling va `WHERE g.id IS NULL` naqshidan foydalaning. So'rov faqat bitta ustun — talaba ismini — qaytarsin, natija alifbo tartibida bo'lsin.\n\nKirish: guruhlar soni va `id;nom` qatorlari, so'ng talabalar soni va `id;ism;guruh_id` qatorlari (bo'sh katak — NULL). Chiqishni tayyor qism chiqaradi: har bir ism alohida qatorda.\n\n**Misol — kirish:**\n\n```\n2\n1;IT-1\n2;IT-2\n4\n1;Anvar;1\n2;Bekzod;2\n3;Dilnoza;1\n4;Elyor;\n```\n\n**Kutilgan chiqish:**\n\n```\nElyor\n```",
    "starterCodePy": "import sqlite3, sys\n\n# ===== TAYYOR QISM — bu yerni o'zgartirmang. Baza avtomatik quriladi. =====\nqatorlar = sys.stdin.read().splitlines()\no = 0\nconn = sqlite3.connect(\":memory:\")\ncur = conn.cursor()\ncur.execute(\"CREATE TABLE guruh (id INTEGER PRIMARY KEY, nom TEXT NOT NULL)\")\ncur.execute(\"CREATE TABLE talaba (id INTEGER PRIMARY KEY, ism TEXT NOT NULL, guruh_id INTEGER REFERENCES guruh(id))\")\ng = int(qatorlar[o]); o += 1\nfor satr in qatorlar[o:o + g]:\n    ustun = satr.split(\";\")\n    cur.execute(\"INSERT INTO guruh VALUES (?, ?)\", (int(ustun[0]), ustun[1]))\no += g\nt = int(qatorlar[o]); o += 1\nfor satr in qatorlar[o:o + t]:\n    ustun = satr.split(\";\")\n    gid = int(ustun[2]) if ustun[2] != \"\" else None\n    cur.execute(\"INSERT INTO talaba VALUES (?, ?, ?)\", (int(ustun[0]), ustun[1], gid))\no += t\n# ===== TAYYOR QISM TUGADI =====\n\nSQL = \"\"\"\n-- shu yerga SELECT so'rovingizni yozing\n\"\"\"\n\nfor qator in cur.execute(SQL):\n    print(\"|\".join(\"\" if x is None else str(x) for x in qator))\n",
    "testCases": [
      {
        "stdin": "2\n1;IT-1\n2;IT-2\n4\n1;Anvar;1\n2;Bekzod;2\n3;Dilnoza;1\n4;Elyor;\n",
        "expectedStdout": "Elyor\n",
        "hidden": false,
        "label": "Asosiy misol"
      },
      {
        "stdin": "3\n1;Frontend\n2;Backend\n3;Dizayn\n3\n10;Sardor;2\n11;Aziza;\n12;Jasur;9\n",
        "expectedStdout": "Aziza\nJasur\n",
        "hidden": false,
        "label": "NULL va noto'g'ri havola"
      },
      {
        "stdin": "1\n5;Yagona\n2\n1;Aaa;5\n2;Bbb;5\n",
        "expectedStdout": "",
        "hidden": true,
        "label": "Bog'lanmagan talaba yo'q"
      },
      {
        "stdin": "2\n1;A guruh\n2;B guruh\n0\n",
        "expectedStdout": "",
        "hidden": true,
        "label": "Talabalar yo'q"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-43",
    "key": "backend-dars-43-hard",
    "title": "Uch jadvalli hisobot",
    "difficulty": "HARD",
    "points": 35,
    "tags": [
      "sql",
      "join",
      "hisobot"
    ],
    "description": "Uchta jadval bor:\n\n- `guruh(id, nom)`\n- `talaba(id, ism, guruh_id)`\n- `baho(id, talaba_id, fan, ball)`\n\n`SQL` matniga **bitta SELECT so'rovi** yozing: uch jadvalni `INNER JOIN` bilan bog'lab, to'rt ustunli hisobot chiqaring — talaba ismi, guruh nomi, fan, ball. Guruhga bog'lanmagan talabaning bahosi hisobotga tushmasin.\n\nNatija avval `ism` bo'yicha alifbo tartibida, teng bo'lsa `fan` bo'yicha alifbo tartibida bo'lsin.\n\nKirish: guruhlar soni va `id;nom` qatorlari; talabalar soni va `id;ism;guruh_id` qatorlari; baholar soni va `id;talaba_id;fan;ball` qatorlari. Chiqishni tayyor qism chiqaradi: `ism|guruh|fan|ball`.\n\n**Misol — kirish:**\n\n```\n2\n1;IT-1\n2;IT-2\n3\n1;Anvar;1\n2;Bekzod;2\n3;Dilnoza;\n4\n1;1;Python;90\n2;1;SQL;75\n3;2;Python;60\n4;3;SQL;100\n```\n\n**Kutilgan chiqish:**\n\n```\nAnvar|IT-1|Python|90\nAnvar|IT-1|SQL|75\nBekzod|IT-2|Python|60\n```",
    "starterCodePy": "import sqlite3, sys\n\n# ===== TAYYOR QISM — bu yerni o'zgartirmang. Baza avtomatik quriladi. =====\nqatorlar = sys.stdin.read().splitlines()\no = 0\nconn = sqlite3.connect(\":memory:\")\ncur = conn.cursor()\ncur.execute(\"CREATE TABLE guruh (id INTEGER PRIMARY KEY, nom TEXT NOT NULL)\")\ncur.execute(\"CREATE TABLE talaba (id INTEGER PRIMARY KEY, ism TEXT NOT NULL, guruh_id INTEGER REFERENCES guruh(id))\")\ng = int(qatorlar[o]); o += 1\nfor satr in qatorlar[o:o + g]:\n    ustun = satr.split(\";\")\n    cur.execute(\"INSERT INTO guruh VALUES (?, ?)\", (int(ustun[0]), ustun[1]))\no += g\nt = int(qatorlar[o]); o += 1\nfor satr in qatorlar[o:o + t]:\n    ustun = satr.split(\";\")\n    gid = int(ustun[2]) if ustun[2] != \"\" else None\n    cur.execute(\"INSERT INTO talaba VALUES (?, ?, ?)\", (int(ustun[0]), ustun[1], gid))\no += t\ncur.execute(\"CREATE TABLE baho (id INTEGER PRIMARY KEY, talaba_id INTEGER, fan TEXT, ball INTEGER)\")\nb = int(qatorlar[o]); o += 1\nfor satr in qatorlar[o:o + b]:\n    ustun = satr.split(\";\")\n    cur.execute(\"INSERT INTO baho VALUES (?, ?, ?, ?)\", (int(ustun[0]), int(ustun[1]), ustun[2], int(ustun[3])))\n# ===== TAYYOR QISM TUGADI =====\n\nSQL = \"\"\"\n-- shu yerga SELECT so'rovingizni yozing\n\"\"\"\n\nfor qator in cur.execute(SQL):\n    print(\"|\".join(\"\" if x is None else str(x) for x in qator))\n",
    "testCases": [
      {
        "stdin": "2\n1;IT-1\n2;IT-2\n3\n1;Anvar;1\n2;Bekzod;2\n3;Dilnoza;\n4\n1;1;Python;90\n2;1;SQL;75\n3;2;Python;60\n4;3;SQL;100\n",
        "expectedStdout": "Anvar|IT-1|Python|90\nAnvar|IT-1|SQL|75\nBekzod|IT-2|Python|60\n",
        "hidden": false,
        "label": "Asosiy misol"
      },
      {
        "stdin": "1\n7;Kechki\n2\n1;Aziza;7\n2;Bobur;7\n3\n1;2;Algebra;55\n2;1;Fizika;80\n3;1;Algebra;95\n",
        "expectedStdout": "Aziza|Kechki|Algebra|95\nAziza|Kechki|Fizika|80\nBobur|Kechki|Algebra|55\n",
        "hidden": false,
        "label": "Bir talabada bir necha fan"
      },
      {
        "stdin": "2\n1;A\n2;B\n2\n1;Vali;1\n2;Gani;2\n0\n",
        "expectedStdout": "",
        "hidden": true,
        "label": "Baholar yo'q"
      },
      {
        "stdin": "1\n1;Yakka\n1\n5;Zafar;1\n1\n9;5;Tarix;70\n",
        "expectedStdout": "Zafar|Yakka|Tarix|70\n",
        "hidden": true,
        "label": "Yagona baho"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-44",
    "key": "backend-dars-44-easy",
    "title": "Har guruhda nechta talaba",
    "difficulty": "EASY",
    "points": 10,
    "tags": [
      "sql",
      "group-by",
      "count"
    ],
    "description": "`talaba(id, ism, guruh)` jadvali tayyor qism tomonidan quriladi.\n\n`SQL` matniga **bitta SELECT so'rovi** yozing: har bir guruhda nechta talaba borligini chiqaring. So'rov ikkita ustun qaytarsin — avval guruh nomi, keyin talabalar soni (`COUNT(*)`). Natija guruh nomi bo'yicha alifbo tartibida bo'lsin.\n\n`GROUP BY` dan foydalaning: agregatsiz ustun (`guruh`) `GROUP BY` da bo'lishi shart.\n\nKirish: birinchi qatorda `n`, keyin `n` ta `id;ism;guruh` qatori. Chiqishni tayyor qism chiqaradi: `guruh|soni`.\n\n**Misol — kirish:**\n\n```\n5\n1;Anvar;IT-1\n2;Bekzod;IT-2\n3;Dilnoza;IT-1\n4;Elyor;IT-3\n5;Feruza;IT-2\n```\n\n**Kutilgan chiqish:**\n\n```\nIT-1|2\nIT-2|2\nIT-3|1\n```",
    "starterCodePy": "import sqlite3, sys\n\n# ===== TAYYOR QISM — bu yerni o'zgartirmang. Baza avtomatik quriladi. =====\nqatorlar = sys.stdin.read().splitlines()\nn = int(qatorlar[0])\nconn = sqlite3.connect(\":memory:\")\ncur = conn.cursor()\ncur.execute(\"CREATE TABLE talaba (id INTEGER PRIMARY KEY, ism TEXT NOT NULL, guruh TEXT NOT NULL)\")\nfor satr in qatorlar[1:n + 1]:\n    ustun = satr.split(\";\")\n    cur.execute(\"INSERT INTO talaba VALUES (?, ?, ?)\", (int(ustun[0]), ustun[1], ustun[2]))\n# ===== TAYYOR QISM TUGADI =====\n\nSQL = \"\"\"\n-- shu yerga SELECT so'rovingizni yozing\n\"\"\"\n\nfor qator in cur.execute(SQL):\n    print(\"|\".join(\"\" if x is None else str(x) for x in qator))\n",
    "testCases": [
      {
        "stdin": "5\n1;Anvar;IT-1\n2;Bekzod;IT-2\n3;Dilnoza;IT-1\n4;Elyor;IT-3\n5;Feruza;IT-2\n",
        "expectedStdout": "IT-1|2\nIT-2|2\nIT-3|1\n",
        "hidden": false,
        "label": "Asosiy misol"
      },
      {
        "stdin": "3\n1;Aziza;Backend\n2;Bobur;Backend\n3;Jasur;Backend\n",
        "expectedStdout": "Backend|3\n",
        "hidden": false,
        "label": "Hamma bitta guruhda"
      },
      {
        "stdin": "1\n9;Zafar;Kechki\n",
        "expectedStdout": "Kechki|1\n",
        "hidden": true,
        "label": "Yagona talaba"
      },
      {
        "stdin": "6\n1;A;G1\n2;B;G2\n3;C;G3\n4;D;G1\n5;E;G2\n6;F;G1\n",
        "expectedStdout": "G1|3\nG2|2\nG3|1\n",
        "hidden": true,
        "label": "Uchta guruh"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-44",
    "key": "backend-dars-44-medium",
    "title": "Fanlar bo'yicha statistika",
    "difficulty": "MEDIUM",
    "points": 20,
    "tags": [
      "sql",
      "group-by",
      "agregat"
    ],
    "description": "`baho(id, fan, ball)` jadvali tayyor qism tomonidan quriladi.\n\n`SQL` matniga **bitta SELECT so'rovi** yozing: har bir fan bo'yicha beshta ustun chiqaring — shu tartibda:\n\n1. `fan`\n2. baholar soni — `COUNT(*)`\n3. o'rtacha ball — `ROUND(AVG(ball), 1)` (aynan shu ko'rinishda, bir xonagacha yaxlitlangan)\n4. eng kichik ball — `MIN(ball)`\n5. eng katta ball — `MAX(ball)`\n\nNatija fan nomi bo'yicha alifbo tartibida bo'lsin.\n\nKirish: birinchi qatorda `n`, keyin `n` ta `id;fan;ball` qatori. Chiqishni tayyor qism chiqaradi: `fan|soni|o'rtacha|min|max`.\n\n**Misol — kirish:**\n\n```\n6\n1;Python;90\n2;Python;70\n3;SQL;60\n4;SQL;80\n5;SQL;100\n6;Fizika;55\n```\n\n**Kutilgan chiqish:**\n\n```\nFizika|1|55.0|55|55\nPython|2|80.0|70|90\nSQL|3|80.0|60|100\n```",
    "starterCodePy": "import sqlite3, sys\n\n# ===== TAYYOR QISM — bu yerni o'zgartirmang. Baza avtomatik quriladi. =====\nqatorlar = sys.stdin.read().splitlines()\nn = int(qatorlar[0])\nconn = sqlite3.connect(\":memory:\")\ncur = conn.cursor()\ncur.execute(\"CREATE TABLE baho (id INTEGER PRIMARY KEY, fan TEXT NOT NULL, ball INTEGER NOT NULL)\")\nfor satr in qatorlar[1:n + 1]:\n    ustun = satr.split(\";\")\n    cur.execute(\"INSERT INTO baho VALUES (?, ?, ?)\", (int(ustun[0]), ustun[1], int(ustun[2])))\n# ===== TAYYOR QISM TUGADI =====\n\nSQL = \"\"\"\n-- shu yerga SELECT so'rovingizni yozing\n\"\"\"\n\nfor qator in cur.execute(SQL):\n    print(\"|\".join(\"\" if x is None else str(x) for x in qator))\n",
    "testCases": [
      {
        "stdin": "6\n1;Python;90\n2;Python;70\n3;SQL;60\n4;SQL;80\n5;SQL;100\n6;Fizika;55\n",
        "expectedStdout": "Fizika|1|55.0|55|55\nPython|2|80.0|70|90\nSQL|3|80.0|60|100\n",
        "hidden": false,
        "label": "Asosiy misol"
      },
      {
        "stdin": "3\n1;Algebra;50\n2;Algebra;51\n3;Algebra;52\n",
        "expectedStdout": "Algebra|3|51.0|50|52\n",
        "hidden": false,
        "label": "Yagona fan"
      },
      {
        "stdin": "1\n1;Tarix;77\n",
        "expectedStdout": "Tarix|1|77.0|77|77\n",
        "hidden": true,
        "label": "Bitta baho"
      },
      {
        "stdin": "4\n1;A;100\n2;A;100\n3;B;0\n4;B;1\n",
        "expectedStdout": "A|2|100.0|100|100\nB|2|0.5|0|1\n",
        "hidden": true,
        "label": "Bir xil ballar"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-44",
    "key": "backend-dars-44-hard",
    "title": "Ikki va undan ko'p bahosi bor talabalar",
    "difficulty": "HARD",
    "points": 35,
    "tags": [
      "sql",
      "join",
      "having"
    ],
    "description": "Jadvallar: `guruh(id, nom)`, `talaba(id, ism, guruh_id)`, `baho(id, talaba_id, fan, ball)`.\n\n`SQL` matniga **bitta SELECT so'rovi** yozing: `talaba` va `baho` jadvallarini `JOIN` qilib, har bir talabaning o'rtacha balini toping. Faqat **kamida 2 ta bahosi bor** talabalar natijaga tushsin (`HAVING` dan foydalaning — `WHERE` bu yerda ishlamaydi).\n\nSo'rov ikkita ustun qaytarsin: talaba ismi va `ROUND(AVG(b.ball), 1)`. Natija o'rtacha ball bo'yicha **kamayish** tartibida, teng bo'lsa ism bo'yicha alifbo tartibida bo'lsin.\n\nKirish: guruhlar soni va `id;nom` qatorlari; talabalar soni va `id;ism;guruh_id` qatorlari; baholar soni va `id;talaba_id;fan;ball` qatorlari. Chiqishni tayyor qism chiqaradi: `ism|o'rtacha`.\n\n**Misol — kirish:**\n\n```\n2\n1;IT-1\n2;IT-2\n3\n1;Anvar;1\n2;Bekzod;2\n3;Dilnoza;1\n6\n1;1;Python;90\n2;1;SQL;70\n3;2;Python;60\n4;3;Python;100\n5;3;SQL;95\n6;3;Fizika;90\n```\n\n**Kutilgan chiqish:**\n\n```\nDilnoza|95.0\nAnvar|80.0\n```",
    "starterCodePy": "import sqlite3, sys\n\n# ===== TAYYOR QISM — bu yerni o'zgartirmang. Baza avtomatik quriladi. =====\nqatorlar = sys.stdin.read().splitlines()\no = 0\nconn = sqlite3.connect(\":memory:\")\ncur = conn.cursor()\ncur.execute(\"CREATE TABLE guruh (id INTEGER PRIMARY KEY, nom TEXT NOT NULL)\")\ncur.execute(\"CREATE TABLE talaba (id INTEGER PRIMARY KEY, ism TEXT NOT NULL, guruh_id INTEGER REFERENCES guruh(id))\")\ng = int(qatorlar[o]); o += 1\nfor satr in qatorlar[o:o + g]:\n    ustun = satr.split(\";\")\n    cur.execute(\"INSERT INTO guruh VALUES (?, ?)\", (int(ustun[0]), ustun[1]))\no += g\nt = int(qatorlar[o]); o += 1\nfor satr in qatorlar[o:o + t]:\n    ustun = satr.split(\";\")\n    gid = int(ustun[2]) if ustun[2] != \"\" else None\n    cur.execute(\"INSERT INTO talaba VALUES (?, ?, ?)\", (int(ustun[0]), ustun[1], gid))\no += t\ncur.execute(\"CREATE TABLE baho (id INTEGER PRIMARY KEY, talaba_id INTEGER, fan TEXT, ball INTEGER)\")\nb = int(qatorlar[o]); o += 1\nfor satr in qatorlar[o:o + b]:\n    ustun = satr.split(\";\")\n    cur.execute(\"INSERT INTO baho VALUES (?, ?, ?, ?)\", (int(ustun[0]), int(ustun[1]), ustun[2], int(ustun[3])))\n# ===== TAYYOR QISM TUGADI =====\n\nSQL = \"\"\"\n-- shu yerga SELECT so'rovingizni yozing\n\"\"\"\n\nfor qator in cur.execute(SQL):\n    print(\"|\".join(\"\" if x is None else str(x) for x in qator))\n",
    "testCases": [
      {
        "stdin": "2\n1;IT-1\n2;IT-2\n3\n1;Anvar;1\n2;Bekzod;2\n3;Dilnoza;1\n6\n1;1;Python;90\n2;1;SQL;70\n3;2;Python;60\n4;3;Python;100\n5;3;SQL;95\n6;3;Fizika;90\n",
        "expectedStdout": "Dilnoza|95.0\nAnvar|80.0\n",
        "hidden": false,
        "label": "Asosiy misol"
      },
      {
        "stdin": "1\n1;Kechki\n2\n1;Aziza;1\n2;Bobur;1\n4\n1;1;A;51\n2;1;B;52\n3;2;A;80\n4;2;B;81\n",
        "expectedStdout": "Bobur|80.5\nAziza|51.5\n",
        "hidden": false,
        "label": "Teng o'rtachalar"
      },
      {
        "stdin": "1\n1;G\n2\n1;Vali;1\n2;Gani;1\n2\n1;1;A;70\n2;2;A;70\n",
        "expectedStdout": "",
        "hidden": true,
        "label": "Hech kimda 2 ta baho yo'q"
      },
      {
        "stdin": "1\n1;G\n2\n1;Yakka;1\n2;Ikkinchi;1\n3\n1;1;A;100\n2;1;B;91\n3;2;A;40\n",
        "expectedStdout": "Yakka|95.5\n",
        "hidden": true,
        "label": "Faqat bittasi shartga mos"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-45",
    "key": "backend-dars-45-easy",
    "title": "Mijozlar jadvali sxemasi",
    "difficulty": "EASY",
    "points": 10,
    "tags": [
      "sql",
      "create-table",
      "cheklov"
    ],
    "description": "`SXEMA` matniga **bitta CREATE TABLE buyrug'i** yozing va `mijoz` jadvalini quyidagi qoidalar bilan yarating:\n\n- `id` — butun son, `PRIMARY KEY`;\n- `ism` — matn, bo'sh bo'lishi mumkin emas (`NOT NULL`);\n- `email` — matn, bo'sh bo'lishi mumkin emas va **takrorlanmasligi** kerak (`NOT NULL` + `UNIQUE`).\n\nBuyruq oxiriga nuqta-vergul qo'ying. Tayyor qism kirishdagi har bir qatorni jadvalga qo'shishga urinadi: muvaffaqiyatli bo'lsa `OK`, cheklov buzilsa `XATO` chiqaradi. Oxirida `JAMI: <yozuvlar soni>` chiqadi. Ya'ni sxemangiz to'g'ri bo'lsagina chiqish mos keladi.\n\nKirish: har bir qator `id;ism;email` ko'rinishida (bo'sh katak — NULL).\n\n**Misol — kirish:**\n\n```\n1;Ali;ali@mail.uz\n2;Vali;vali@mail.uz\n3;Gani;ali@mail.uz\n4;;bosh@mail.uz\n```\n\n**Kutilgan chiqish:**\n\n```\nOK\nOK\nXATO\nXATO\nJAMI: 2\n```",
    "starterCodePy": "import sqlite3, sys\n\nconn = sqlite3.connect(\":memory:\")\ncur = conn.cursor()\n\nSXEMA = \"\"\"\n-- shu yerga CREATE TABLE buyrug'ingizni yozing\n\"\"\"\n\n# ===== TAYYOR QISM — o'zgartirmang =====\ncur.executescript(SXEMA)\n\nfor satr in sys.stdin.read().splitlines():\n    if not satr.strip():\n        continue\n    ustun = satr.split(\";\")\n    try:\n        cur.execute(\"INSERT INTO mijoz (id, ism, email) VALUES (?, ?, ?)\",\n                    (int(ustun[0]), ustun[1] or None, ustun[2] or None))\n        print(\"OK\")\n    except sqlite3.IntegrityError:\n        print(\"XATO\")\nprint(\"JAMI:\", cur.execute(\"SELECT COUNT(*) FROM mijoz\").fetchone()[0])\n",
    "testCases": [
      {
        "stdin": "1;Ali;ali@mail.uz\n2;Vali;vali@mail.uz\n3;Gani;ali@mail.uz\n4;;bosh@mail.uz\n",
        "expectedStdout": "OK\nOK\nXATO\nXATO\nJAMI: 2\n",
        "hidden": false,
        "label": "Asosiy misol"
      },
      {
        "stdin": "1;Anvar;a@a.uz\n1;Bekzod;b@b.uz\n",
        "expectedStdout": "OK\nXATO\nJAMI: 1\n",
        "hidden": false,
        "label": "Takrorlangan id"
      },
      {
        "stdin": "1;A;a@a.uz\n2;B;b@b.uz\n3;C;c@c.uz\n",
        "expectedStdout": "OK\nOK\nOK\nJAMI: 3\n",
        "hidden": true,
        "label": "Hammasi to'g'ri"
      },
      {
        "stdin": "1;A;a@a.uz\n2;;\n3;C;a@a.uz\n",
        "expectedStdout": "OK\nXATO\nXATO\nJAMI: 1\n",
        "hidden": true,
        "label": "Bir nechta cheklov buziladi"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-45",
    "key": "backend-dars-45-medium",
    "title": "1:N munosabat va tashqi kalit",
    "difficulty": "MEDIUM",
    "points": 20,
    "tags": [
      "sql",
      "foreign-key",
      "dizayn"
    ],
    "description": "`SXEMA` matniga **ikkita CREATE TABLE buyrug'i** yozing (bitta mijozda ko'p buyurtma bo'ladi — 1:N):\n\n1. `mijoz` — `id` butun son `PRIMARY KEY`, `ism` matn `NOT NULL`;\n2. `buyurtma` — `id` butun son `PRIMARY KEY`, `mijoz_id` butun son `NOT NULL` va `mijoz(id)` ga `REFERENCES` bilan bog'langan, `summa` butun son `NOT NULL`.\n\nTartib muhim: `mijoz` avval yaratilsin. Har bir buyruq nuqta-vergul bilan tugasin.\n\nTayyor qism `PRAGMA foreign_keys = ON` ni yoqadi, mijozlarni qo'shadi, so'ng har bir buyurtmani qo'shishga urinadi — muvaffaqiyatli bo'lsa `OK`, mavjud bo'lmagan mijozga bog'lansa `XATO`. Oxirida har bir mijozning buyurtmalari soni `ism|soni` ko'rinishida alifbo tartibida chiqadi.\n\nKirish: birinchi qatorda mijozlar soni `n`, keyin `n` ta `id;ism` qatori, so'ng qolgan qatorlar `id;mijoz_id;summa` ko'rinishidagi buyurtmalar.\n\n**Misol — kirish:**\n\n```\n2\n1;Ali\n2;Vali\n10;1;50000\n11;2;70000\n12;9;30000\n```\n\n**Kutilgan chiqish:**\n\n```\nOK\nOK\nXATO\nAli|1\nVali|1\n```",
    "starterCodePy": "import sqlite3, sys\n\nconn = sqlite3.connect(\":memory:\")\ncur = conn.cursor()\n\nSXEMA = \"\"\"\n-- shu yerga CREATE TABLE buyruqlaringizni yozing\n\"\"\"\n\n# ===== TAYYOR QISM — o'zgartirmang =====\ncur.executescript(SXEMA)\nconn.commit()\ncur.execute(\"PRAGMA foreign_keys = ON\")\n\nqatorlar = sys.stdin.read().splitlines()\nn = int(qatorlar[0])\nfor satr in qatorlar[1:n + 1]:\n    ustun = satr.split(\";\")\n    cur.execute(\"INSERT INTO mijoz (id, ism) VALUES (?, ?)\", (int(ustun[0]), ustun[1]))\nfor satr in qatorlar[n + 1:]:\n    if not satr.strip():\n        continue\n    ustun = satr.split(\";\")\n    try:\n        cur.execute(\"INSERT INTO buyurtma (id, mijoz_id, summa) VALUES (?, ?, ?)\",\n                    (int(ustun[0]), int(ustun[1]), int(ustun[2])))\n        print(\"OK\")\n    except sqlite3.IntegrityError:\n        print(\"XATO\")\nfor qator in cur.execute(\"SELECT m.ism, COUNT(b.id) FROM mijoz m LEFT JOIN buyurtma b ON b.mijoz_id = m.id GROUP BY m.id, m.ism ORDER BY m.ism\"):\n    print(\"|\".join(str(x) for x in qator))\n",
    "testCases": [
      {
        "stdin": "2\n1;Ali\n2;Vali\n10;1;50000\n11;2;70000\n12;9;30000\n",
        "expectedStdout": "OK\nOK\nXATO\nAli|1\nVali|1\n",
        "hidden": false,
        "label": "Asosiy misol"
      },
      {
        "stdin": "1\n5;Yakka\n1;5;100\n2;5;200\n3;7;300\n",
        "expectedStdout": "OK\nOK\nXATO\nYakka|2\n",
        "hidden": false,
        "label": "Bitta mijoz, uchta buyurtma"
      },
      {
        "stdin": "2\n1;A\n2;B\n",
        "expectedStdout": "A|0\nB|0\n",
        "hidden": true,
        "label": "Buyurtmasiz mijozlar"
      },
      {
        "stdin": "2\n1;A\n2;B\n1;3;10\n2;4;20\n",
        "expectedStdout": "XATO\nXATO\nA|0\nB|0\n",
        "hidden": true,
        "label": "Barcha havolalar noto'g'ri"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-45",
    "key": "backend-dars-45-hard",
    "title": "M:N munosabat — bog'lovchi jadval",
    "difficulty": "HARD",
    "points": 35,
    "tags": [
      "sql",
      "many-to-many",
      "dizayn"
    ],
    "description": "Bir talaba ko'p kursga yozilishi, bir kursda ko'p talaba bo'lishi mumkin — bu M:N munosabat, unga **bog'lovchi (uchinchi) jadval** kerak.\n\n`SXEMA` matniga **uchta CREATE TABLE buyrug'i** yozing (shu tartibda):\n\n1. `talaba` — `id` `PRIMARY KEY`, `ism` matn `NOT NULL`;\n2. `kurs` — `id` `PRIMARY KEY`, `nom` matn `NOT NULL`;\n3. `talaba_kurs` — `talaba_id` va `kurs_id` ustunlari; ikkalasi ham mos jadvalga `REFERENCES` bilan bog'langan; ikkovi birgalikda **birlashgan PRIMARY KEY** bo'lsin, ya'ni `PRIMARY KEY (talaba_id, kurs_id)` — shunda bir talaba bir kursga ikki marta yozila olmaydi.\n\nTayyor qism `PRAGMA foreign_keys = ON` ni yoqadi, talaba va kurslarni qo'shadi, so'ng har bir yozilishni qo'shishga urinadi — muvaffaqiyatli bo'lsa `OK`, takrorlangan yoki mavjud bo'lmagan kursga bog'langan bo'lsa `XATO`. Oxirida barcha yozilishlar `ism|kurs` ko'rinishida (ism, keyin kurs bo'yicha alifbo tartibida) chiqadi.\n\nKirish: talabalar soni va `id;ism` qatorlari; kurslar soni va `id;nom` qatorlari; so'ng qolgan qatorlar `talaba_id;kurs_id` ko'rinishidagi yozilishlar.\n\n**Misol — kirish:**\n\n```\n2\n1;Anvar\n2;Bekzod\n2\n10;Python\n11;SQL\n1;10\n1;11\n2;10\n1;10\n2;99\n```\n\n**Kutilgan chiqish:**\n\n```\nOK\nOK\nOK\nXATO\nXATO\nAnvar|Python\nAnvar|SQL\nBekzod|Python\n```",
    "starterCodePy": "import sqlite3, sys\n\nconn = sqlite3.connect(\":memory:\")\ncur = conn.cursor()\n\nSXEMA = \"\"\"\n-- shu yerga CREATE TABLE buyruqlaringizni yozing\n\"\"\"\n\n# ===== TAYYOR QISM — o'zgartirmang =====\ncur.executescript(SXEMA)\nconn.commit()\ncur.execute(\"PRAGMA foreign_keys = ON\")\n\nqatorlar = sys.stdin.read().splitlines()\no = 0\nn = int(qatorlar[o]); o += 1\nfor satr in qatorlar[o:o + n]:\n    ustun = satr.split(\";\")\n    cur.execute(\"INSERT INTO talaba (id, ism) VALUES (?, ?)\", (int(ustun[0]), ustun[1]))\no += n\nk = int(qatorlar[o]); o += 1\nfor satr in qatorlar[o:o + k]:\n    ustun = satr.split(\";\")\n    cur.execute(\"INSERT INTO kurs (id, nom) VALUES (?, ?)\", (int(ustun[0]), ustun[1]))\no += k\nfor satr in qatorlar[o:]:\n    if not satr.strip():\n        continue\n    ustun = satr.split(\";\")\n    try:\n        cur.execute(\"INSERT INTO talaba_kurs (talaba_id, kurs_id) VALUES (?, ?)\",\n                    (int(ustun[0]), int(ustun[1])))\n        print(\"OK\")\n    except sqlite3.IntegrityError:\n        print(\"XATO\")\nfor qator in cur.execute(\"SELECT t.ism, k.nom FROM talaba_kurs tk JOIN talaba t ON t.id = tk.talaba_id JOIN kurs k ON k.id = tk.kurs_id ORDER BY t.ism, k.nom\"):\n    print(\"|\".join(str(x) for x in qator))\n",
    "testCases": [
      {
        "stdin": "2\n1;Anvar\n2;Bekzod\n2\n10;Python\n11;SQL\n1;10\n1;11\n2;10\n1;10\n2;99\n",
        "expectedStdout": "OK\nOK\nOK\nXATO\nXATO\nAnvar|Python\nAnvar|SQL\nBekzod|Python\n",
        "hidden": false,
        "label": "Asosiy misol"
      },
      {
        "stdin": "1\n1;Aziza\n1\n5;Django\n1;5\n",
        "expectedStdout": "OK\nAziza|Django\n",
        "hidden": false,
        "label": "Yagona yozilish"
      },
      {
        "stdin": "2\n1;A\n2;B\n2\n1;X\n2;Y\n",
        "expectedStdout": "",
        "hidden": true,
        "label": "Yozilishlar yo'q"
      },
      {
        "stdin": "2\n1;Vali\n2;Gani\n2\n7;Fizika\n8;Kimyo\n2;8\n2;8\n1;7\n",
        "expectedStdout": "OK\nXATO\nOK\nGani|Kimyo\nVali|Fizika\n",
        "hidden": true,
        "label": "Takror yozilish"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-46",
    "key": "backend-dars-46-easy",
    "title": "Python'dan birinchi jadval",
    "difficulty": "EASY",
    "points": 10,
    "tags": [
      "python",
      "sqlite3",
      "baza"
    ],
    "description": "Python'ning `sqlite3` moduli bilan xotiradagi bazada (`sqlite3.connect(\":memory:\")`) `kitob` jadvalini yarating: `id` (INTEGER PRIMARY KEY), `nom` (TEXT), `yil` (INTEGER).\n\nKitoblar kiritishdan (stdin) keladi:\n\n1-qator — `n` soni (nechta kitob bor).\nKeyingi `n` qator — `id;nom;yil` ko'rinishida, nuqta-vergul bilan ajratilgan (`id` va `yil` — butun son, `nom` ichida `;` yo'q). Kitoblar TARTIBSIZ kelishi mumkin.\n\nHar bir qatorni jadvalga `INSERT` bilan qo'shing — so'rovda `?` parametrlaridan foydalaning. So'ng `SELECT ... ORDER BY id` bilan barcha yozuvlarni `id` bo'yicha O'SISH tartibida o'qing va har birini `id|nom|yil` ko'rinishida alohida qatorda chiqaring (ustunlar orasida bo'sh joysiz `|` belgisi).\n\nEng oxirgi qatorda `JAMI: <soni>` deb yozing — sonni `SELECT COUNT(*) FROM kitob` so'rovi bilan bazadan oling.\n\n**Misol — kirish:**\n\n```\n3\n1;O'tkan kunlar;1926\n2;Shum bola;1936\n3;Mehrobdan chayon;1929\n```\n\n**Kutilgan chiqish:**\n\n```\n1|O'tkan kunlar|1926\n2|Shum bola|1936\n3|Mehrobdan chayon|1929\nJAMI: 3\n```\n\n**Yana bir misol — kirish:**\n\n```\n2\n5;Sarob;1935\n9;Kecha va kunduz;1936\n```\n\n**Kutilgan chiqish:**\n\n```\n5|Sarob|1935\n9|Kecha va kunduz|1936\nJAMI: 2\n```\n\nDiqqat: kitoblar va ularning soni har safar boshqacha — natijani kodga yozib qo'ymang. `id` lar 1, 2, 3 bo'lishi shart emas, shuning uchun tartiblashni `ORDER BY id` bajarsin.",
    "starterCodePy": "import sqlite3\n\nconn = sqlite3.connect(\":memory:\")\ncur = conn.cursor()\n\n# 1) CREATE TABLE kitob (...) so'rovini yozing\n\nn = int(input())\nfor _ in range(n):\n    id_matn, nom, yil_matn = input().split(\";\")\n    # 2) INSERT INTO kitob ... VALUES (?, ?, ?) — parametrlar bilan qo'shing\nconn.commit()\n\n# 3) SELECT ... ORDER BY id — o'qing va id|nom|yil ko'rinishida chiqaring\n\n# 4) SELECT COUNT(*) — JAMI: <soni> qatorini chiqaring\n\nconn.close()\n",
    "testCases": [
      {
        "stdin": "3\n1;O'tkan kunlar;1926\n2;Shum bola;1936\n3;Mehrobdan chayon;1929\n",
        "expectedStdout": "1|O'tkan kunlar|1926\n2|Shum bola|1936\n3|Mehrobdan chayon|1929\nJAMI: 3\n",
        "hidden": false,
        "label": "Namunadagi uchta kitob"
      },
      {
        "stdin": "2\n5;Sarob;1935\n9;Kecha va kunduz;1936\n",
        "expectedStdout": "5|Sarob|1935\n9|Kecha va kunduz|1936\nJAMI: 2\n",
        "hidden": false,
        "label": "Ikkinchi namuna"
      },
      {
        "stdin": "4\n7;Delta;2010\n2;Alfa;2000\n9;Gamma;1999\n4;Beta;2000\n",
        "expectedStdout": "2|Alfa|2000\n4|Beta|2000\n7|Delta|2010\n9|Gamma|1999\nJAMI: 4\n",
        "hidden": true,
        "label": "Tartibsiz kelgan yozuvlar"
      },
      {
        "stdin": "1\n42;Yulduzli tunlar;1978\n",
        "expectedStdout": "42|Yulduzli tunlar|1978\nJAMI: 1\n",
        "hidden": true,
        "label": "Chegaraviy holat"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-46",
    "key": "backend-dars-46-medium",
    "title": "Kirishdagi kitoblarni bazaga yozish",
    "difficulty": "MEDIUM",
    "points": 20,
    "tags": [
      "python",
      "sqlite3",
      "select"
    ],
    "description": "Kirishning birinchi qatorida yozuvlar soni `n` beriladi, keyin `n` ta qator `nom;yil` ko'rinishida keladi.\n\n`sqlite3` bilan xotiradagi bazada `kitob(id INTEGER PRIMARY KEY AUTOINCREMENT yoki oddiy son, nom TEXT, yil INTEGER)` jadvalini yarating va barcha yozuvlarni parametrli so'rov bilan (`?` bilan) qo'shing.\n\nSo'ng `SELECT` bilan yozuvlarni **yil bo'yicha kamayish** tartibida (yillari teng bo'lsa nom bo'yicha alifbo tartibida) o'qing va har birini `nom (yil)` ko'rinishida chiqaring.\n\nEng oxirida `Jami: <soni> ta kitob` qatorini chiqaring.\n\n**Misol — kirish:**\n\n```\n3\nO'tkan kunlar;1926\nShum bola;1936\nMehrobdan chayon;1929\n```\n\n**Kutilgan chiqish:**\n\n```\nShum bola (1936)\nMehrobdan chayon (1929)\nO'tkan kunlar (1926)\nJami: 3 ta kitob\n```",
    "starterCodePy": "# stdin dan kitoblarni o'qing, sqlite3 bazasiga yozing va tartiblab chiqaring.\nimport sqlite3, sys\n",
    "testCases": [
      {
        "stdin": "3\nO'tkan kunlar;1926\nShum bola;1936\nMehrobdan chayon;1929\n",
        "expectedStdout": "Shum bola (1936)\nMehrobdan chayon (1929)\nO'tkan kunlar (1926)\nJami: 3 ta kitob\n",
        "hidden": false,
        "label": "Asosiy misol"
      },
      {
        "stdin": "4\nAlfa;2000\nBeta;2000\nGamma;1999\nDelta;2010\n",
        "expectedStdout": "Delta (2010)\nAlfa (2000)\nBeta (2000)\nGamma (1999)\nJami: 4 ta kitob\n",
        "hidden": false,
        "label": "Bir xil yillar"
      },
      {
        "stdin": "1\nYagona kitob;2024\n",
        "expectedStdout": "Yagona kitob (2024)\nJami: 1 ta kitob\n",
        "hidden": true,
        "label": "Bitta kitob"
      },
      {
        "stdin": "0\n",
        "expectedStdout": "Jami: 0 ta kitob\n",
        "hidden": true,
        "label": "Kitoblar yo'q"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-46",
    "key": "backend-dars-46-hard",
    "title": "CRUD buyruqlari",
    "difficulty": "HARD",
    "points": 35,
    "tags": [
      "python",
      "sqlite3",
      "crud"
    ],
    "description": "Kirishda har bir qatorda bitta buyruq keladi. Buyruqlar to'rt xil:\n\n- `QOSH;<nom>;<narx>` — `mahsulot` jadvaliga yangi yozuv qo'shadi va `QOSHILDI: <nom>` chiqaradi. Yangi yozuvning `id` si 1 dan boshlab ketma-ket beriladi (jadvaldagi PRIMARY KEY o'zi beradi).\n- `YANGILA;<id>;<narx>` — shu `id` li yozuvning narxini o'zgartiradi. Yozuv topilsa `YANGILANDI: <id>`, topilmasa `TOPILMADI: <id>` chiqaradi.\n- `OCHIR;<id>` — shu `id` li yozuvni o'chiradi. Topilsa `OCHIRILDI: <id>`, topilmasa `TOPILMADI: <id>`.\n- `ROYXAT` — barcha yozuvlarni `id` bo'yicha o'sish tartibida `<id>|<nom>|<narx>` ko'rinishida chiqaradi. Jadval bo'sh bo'lsa `BOSH` so'zini chiqaradi.\n\nBuyruqlar kelgan tartibda bajariladi. Narxlar butun son. Ishni `sqlite3` bazasi ustida bajaring va barcha so'rovlarda `?` parametrlaridan foydalaning. O'zgargan qatorlar sonini `cur.rowcount` bilan bilib olsangiz bo'ladi.\n\n**Misol — kirish:**\n\n```\nQOSH;Non;5000\nQOSH;Sut;12000\nROYXAT\nYANGILA;2;15000\nOCHIR;1\nROYXAT\n```\n\n**Kutilgan chiqish:**\n\n```\nQOSHILDI: Non\nQOSHILDI: Sut\n1|Non|5000\n2|Sut|12000\nYANGILANDI: 2\nOCHIRILDI: 1\n2|Sut|15000\n```",
    "starterCodePy": "# CRUD buyruqlarini stdin dan o'qib, sqlite3 bazasida bajaring.\nimport sqlite3, sys\n",
    "testCases": [
      {
        "stdin": "QOSH;Non;5000\nQOSH;Sut;12000\nROYXAT\nYANGILA;2;15000\nOCHIR;1\nROYXAT\n",
        "expectedStdout": "QOSHILDI: Non\nQOSHILDI: Sut\n1|Non|5000\n2|Sut|12000\nYANGILANDI: 2\nOCHIRILDI: 1\n2|Sut|15000\n",
        "hidden": false,
        "label": "Asosiy misol"
      },
      {
        "stdin": "ROYXAT\nOCHIR;5\nYANGILA;7;100\nROYXAT\n",
        "expectedStdout": "BOSH\nTOPILMADI: 5\nTOPILMADI: 7\nBOSH\n",
        "hidden": false,
        "label": "Bo'sh jadval bilan ishlash"
      },
      {
        "stdin": "QOSH;A;1\nQOSH;B;2\nOCHIR;1\nQOSH;C;3\nROYXAT\n",
        "expectedStdout": "QOSHILDI: A\nQOSHILDI: B\nOCHIRILDI: 1\nQOSHILDI: C\n2|B|2\n3|C|3\n",
        "hidden": true,
        "label": "O'chirishdan keyin qo'shish"
      },
      {
        "stdin": "QOSH;Choy;9000\nOCHIR;1\nROYXAT\nYANGILA;1;1\n",
        "expectedStdout": "QOSHILDI: Choy\nOCHIRILDI: 1\nBOSH\nTOPILMADI: 1\n",
        "hidden": true,
        "label": "Hammasi o'chirilgan holat"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-47",
    "key": "backend-dars-47-easy",
    "title": "Apostrofli ismni xavfsiz qidirish",
    "difficulty": "EASY",
    "points": 10,
    "tags": [
      "python",
      "sqlite3",
      "parametr"
    ],
    "description": "Kirishning birinchi qatorida yozuvlar soni `n`, keyin `n` ta qator `ism;shahar` ko'rinishida keladi. **Oxirgi qator** — qidiriladigan ism (u `O'ktam` kabi apostrof ham bo'lishi mumkin).\n\n`sqlite3` bazasida `odam(id INTEGER PRIMARY KEY, ism TEXT, shahar TEXT)` jadvalini yarating, yozuvlarni qo'shing, so'ng ismi aynan qidiruv so'ziga teng bo'lgan yozuvlarni toping.\n\nSo'rovni **parametr bilan** yozing: `cur.execute(\"SELECT ... WHERE ism = ?\", (qidiruv,))`. Qiymatni f-string bilan so'rovga yopishtirmang — apostrofli ism SQL ni buzadi (bu SQL injection yo'li).\n\nTopilgan har bir yozuvni `ism|shahar` ko'rinishida `id` bo'yicha o'sish tartibida chiqaring. Hech narsa topilmasa `TOPILMADI` so'zini chiqaring.\n\n**Misol — kirish:**\n\n```\n3\nO'ktam;Toshkent\nAli;Buxoro\nO'ktam;Xiva\nO'ktam\n```\n\n**Kutilgan chiqish:**\n\n```\nO'ktam|Toshkent\nO'ktam|Xiva\n```",
    "starterCodePy": "# Parametrli so'rov bilan qidiring — qiymatni so'rov matniga yopishtirmang.\nimport sqlite3, sys\n",
    "testCases": [
      {
        "stdin": "3\nO'ktam;Toshkent\nAli;Buxoro\nO'ktam;Xiva\nO'ktam\n",
        "expectedStdout": "O'ktam|Toshkent\nO'ktam|Xiva\n",
        "hidden": false,
        "label": "Apostrofli ism"
      },
      {
        "stdin": "2\nAli;Toshkent\nVali;Nukus\nVali\n",
        "expectedStdout": "Vali|Nukus\n",
        "hidden": false,
        "label": "Oddiy ism"
      },
      {
        "stdin": "2\nAli;Toshkent\nVali;Nukus\nSardor\n",
        "expectedStdout": "TOPILMADI\n",
        "hidden": true,
        "label": "Mos yozuv yo'q"
      },
      {
        "stdin": "1\nD'Artanyan;Parij\nD'Artanyan\n",
        "expectedStdout": "D'Artanyan|Parij\n",
        "hidden": true,
        "label": "Ikkinchi apostrofli holat"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-47",
    "key": "backend-dars-47-medium",
    "title": "Injection urinishini to'xtatish",
    "difficulty": "MEDIUM",
    "points": 20,
    "tags": [
      "python",
      "sqlite3",
      "sql-injection"
    ],
    "description": "Kirishning birinchi qatorida foydalanuvchilar soni `n`, keyin `n` ta qator `login;parol` ko'rinishida keladi. Oxirgi ikki qator — tekshiriladigan `login` va `parol`.\n\n`sqlite3` bazasida `foydalanuvchi(id INTEGER PRIMARY KEY, login TEXT, parol TEXT)` jadvalini yarating va yozuvlarni qo'shing. So'ng logini va paroli aynan mos keladigan foydalanuvchi bor-yo'qligini **parametrli so'rov** bilan tekshiring.\n\nMos kelsa `KIRISH: <login>`, mos kelmasa `RAD ETILDI` chiqaring.\n\nDiqqat: kirishdagi parol `' OR '1'='1` kabi hujum matni bo'lishi mumkin. Parametrli so'rovda bunday matn shunchaki oddiy qiymat sifatida qaraladi va hech qanday yozuvga mos kelmaydi — natija `RAD ETILDI` bo'ladi. Agar so'rovni f-string bilan yig'sangiz, hujum ishlab ketadi va test yiqiladi.\n\n**Misol — kirish:**\n\n```\n2\nadmin;12345\nali;qwerty\nadmin\n' OR '1'='1\n```\n\n**Kutilgan chiqish:**\n\n```\nRAD ETILDI\n```",
    "starterCodePy": "# Loginni parametrli so'rov bilan tekshiring — hujum matni oddiy qiymat bo'lib qolsin.\nimport sqlite3, sys\n",
    "testCases": [
      {
        "stdin": "2\nadmin;12345\nali;qwerty\nadmin\n' OR '1'='1\n",
        "expectedStdout": "RAD ETILDI\n",
        "hidden": false,
        "label": "Hujum urinishi"
      },
      {
        "stdin": "2\nadmin;12345\nali;qwerty\nali\nqwerty\n",
        "expectedStdout": "KIRISH: ali\n",
        "hidden": false,
        "label": "To'g'ri parol"
      },
      {
        "stdin": "2\nadmin;12345\nali;qwerty\nadmin\n123456\n",
        "expectedStdout": "RAD ETILDI\n",
        "hidden": true,
        "label": "Noto'g'ri parol"
      },
      {
        "stdin": "1\nO'ktam;p'a'rol\nO'ktam\np'a'rol\n",
        "expectedStdout": "KIRISH: O'ktam\n",
        "hidden": true,
        "label": "Apostrofli login va parol"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-47",
    "key": "backend-dars-47-hard",
    "title": "Dinamik filtr — o'rniga qo'yish belgilarini yasash",
    "difficulty": "HARD",
    "points": 35,
    "tags": [
      "python",
      "sqlite3",
      "parametr"
    ],
    "description": "Kirishning birinchi qatorida yozuvlar soni `n`, keyin `n` ta qator `ism;shahar` ko'rinishida keladi. Undan keyingi qatorda tanlangan shaharlar soni `m`, so'ng `m` ta shahar nomi (har biri alohida qatorda).\n\n`sqlite3` bazasida `odam(id INTEGER PRIMARY KEY, ism TEXT, shahar TEXT)` jadvalini quring va shu `m` ta shahardan biriga tegishli odamlarni toping. So'rovni `WHERE shahar IN (...)` bilan yozing, lekin shahar nomlarini so'rov matniga **yopishtirmang** — kerakli sondagi `?` belgilarini dasturda yasang, masalan `\",\".join(\"?\" * m)`, va qiymatlarni `execute` ning ikkinchi argumenti sifatida bering.\n\nNatijani `ism|shahar` ko'rinishida, ism bo'yicha alifbo tartibida (ismlar teng bo'lsa shahar bo'yicha) chiqaring. Hech narsa topilmasa `TOPILMADI` chiqaring. `m` = 0 bo'lsa ham dastur xato bermasligi va `TOPILMADI` chiqarishi kerak.\n\n**Misol — kirish:**\n\n```\n5\nAnvar;Toshkent\nBekzod;Samarqand\nDilnoza;Toshkent\nElyor;Buxoro\nFeruza;Nukus\n2\nToshkent\nBuxoro\n```\n\n**Kutilgan chiqish:**\n\n```\nAnvar|Toshkent\nDilnoza|Toshkent\nElyor|Buxoro\n```",
    "starterCodePy": "# Kerakli sondagi ? belgilarini yasab, IN (...) so'rovini parametrli qiling.\nimport sqlite3, sys\n",
    "testCases": [
      {
        "stdin": "5\nAnvar;Toshkent\nBekzod;Samarqand\nDilnoza;Toshkent\nElyor;Buxoro\nFeruza;Nukus\n2\nToshkent\nBuxoro\n",
        "expectedStdout": "Anvar|Toshkent\nDilnoza|Toshkent\nElyor|Buxoro\n",
        "hidden": false,
        "label": "Asosiy misol"
      },
      {
        "stdin": "3\nAli;Xiva\nVali;Xiva\nGani;Qarshi\n1\nXiva\n",
        "expectedStdout": "Ali|Xiva\nVali|Xiva\n",
        "hidden": false,
        "label": "Yagona shahar"
      },
      {
        "stdin": "2\nAli;Toshkent\nVali;Nukus\n0\n",
        "expectedStdout": "TOPILMADI\n",
        "hidden": true,
        "label": "Shahar tanlanmagan"
      },
      {
        "stdin": "3\nO'ktam;Toshkent\nAli;Andijon\nZarina;Toshkent\n2\nToshkent\nNamangan\n",
        "expectedStdout": "O'ktam|Toshkent\nZarina|Toshkent\n",
        "hidden": true,
        "label": "Mos kelmaydigan shahar ham bor"
      }
    ]
  }
];
