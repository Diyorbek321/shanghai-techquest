/**
 * Hand-authored practice problems for backend lessons 69-75.
 *
 * Grading is exact-output, so every `expectedStdout` below was produced by actually
 * running a reference solution on the Piston sandbox (python 3.10.0) against the
 * matching `stdin` - none of them are written from memory.
 *
 * These lessons are mostly framework lessons (DRF, testing tooling), so a stdin/stdout
 * test can only be honest when there is a real pure-Python idea underneath the topic:
 * permission resolution (69), relation flattening and nested representation (70-71),
 * assertions and error expectations (73), fixture dependency ordering (74), traceback
 * reading and a TDD spec (75).
 *
 * Deliberately WITHOUT problems:
 * - Lesson 69 QIYIN, 70 QIYIN, 71 QIYIN: `get_permissions()`, `get_serializer_class()`
 *   and `prefetch_related()` query counting are framework wiring - stdout cannot prove
 *   the student configured DRF, so they keep their rubric-graded homework.
 * - Lesson 72 (REST API loyiha, MINI-LOYIHA): a whole project design, graded by rubric.
 * - Lesson 74 OSON/QIYIN: `pytest.ini`, `pytest-django` and `APIClient` tests cannot be
 *   verified through stdout of a single sandboxed script.
 * - Lesson 75 QIYIN: measuring coverage on the student's own project is a tooling task.
 */
import type { LessonProblemRecord } from './types';

export const backendProblemsP09: LessonProblemRecord[] = [
  {
    "lessonKey": "backend-dars-69",
    "key": "backend-dars-69-easy",
    "title": "Ruxsat kodi: 200, 401, 403",
    "difficulty": "EASY",
    "points": 10,
    "tags": [
      "permissions",
      "http",
      "shart"
    ],
    "description": "DRF'da har bir so'rov ikki savoldan o'tadi: «sen kimsan?» (autentifikatsiya) va «senga bu mumkinmi?» (ruxsat). Javob kodi ana shu ikki savolga qarab tanlanadi.\n\nKiritish (stdin):\n- 1-qator: `n` — so'rovlar soni.\n- Keyingi `n` qator: `token;rol;metod` ko'rinishida (nuqta-vergul bilan ajratilgan).\n  - `token` — `yoq` bo'lsa foydalanuvchi tokensiz kelgan, aks holda uning nomi.\n  - `rol` — `admin` yoki `user` (tokensiz so'rovda `-` turishi mumkin).\n  - `metod` — HTTP metodi: `GET`, `HEAD`, `OPTIONS`, `POST`, `PUT`, `PATCH`, `DELETE`.\n\nHar bir so'rov uchun ANIQ shu tartibda tekshiring va bitta qator chiqaring:\n1. `token` `yoq` bo'lsa -> `401 Autentifikatsiya kerak`\n2. `metod` xavfsiz metodlardan biri bo'lsa (`GET`, `HEAD`, `OPTIONS`) -> `200 OK`\n3. `rol` `admin` bo'lsa -> `200 OK`\n4. Aks holda -> `403 Ruxsat yo'q`\n\nMisol — kiritish:\n```\n4\nyoq;-;GET\nali;user;GET\nali;user;DELETE\nzuhra;admin;DELETE\n```\nChiqish:\n```\n401 Autentifikatsiya kerak\n200 OK\n403 Ruxsat yo'q\n200 OK\n```",
    "starterCodePy": "# Har bir so'rov uchun ruxsat kodini aniqlang.\n# Xavfsiz metodlar: GET, HEAD, OPTIONS.\nimport sys\n\nqatorlar = sys.stdin.read().split(\"\\n\")\n",
    "testCases": [
      {
        "stdin": "4\nyoq;-;GET\nali;user;GET\nali;user;DELETE\nzuhra;admin;DELETE\n",
        "expectedStdout": "401 Autentifikatsiya kerak\n200 OK\n403 Ruxsat yo'q\n200 OK\n",
        "hidden": false,
        "label": "Uchala javob kodi aralash holatda"
      },
      {
        "stdin": "3\nyoq;-;POST\nvali;user;PUT\nvali;admin;PATCH\n",
        "expectedStdout": "401 Autentifikatsiya kerak\n403 Ruxsat yo'q\n200 OK\n",
        "hidden": false,
        "label": "Xavfsiz bo'lmagan metodlar"
      },
      {
        "stdin": "4\nsardor;user;HEAD\nsardor;user;OPTIONS\nyoq;admin;GET\nlaziz;admin;POST\n",
        "expectedStdout": "200 OK\n200 OK\n401 Autentifikatsiya kerak\n200 OK\n",
        "hidden": true,
        "label": "HEAD va OPTIONS ham tekshirildi"
      },
      {
        "stdin": "5\nyoq;admin;HEAD\nali;admin;OPTIONS\nali;user;POST\nzuhra;admin;PUT\nyoq;user;DELETE\n",
        "expectedStdout": "401 Autentifikatsiya kerak\n200 OK\n403 Ruxsat yo'q\n200 OK\n401 Autentifikatsiya kerak\n",
        "hidden": true,
        "label": "Rol va token birga hisobga olindi"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-69",
    "key": "backend-dars-69-medium",
    "title": "Faqat egasi o'zgartira oladi",
    "difficulty": "MEDIUM",
    "points": 20,
    "tags": [
      "permissions",
      "obyekt",
      "crud"
    ],
    "description": "`has_object_permission` — obyekt darajasidagi tekshiruv: postni faqat uning egasi o'zgartira olsin, boshqalar esa faqat o'qiy olsin.\n\nKiritish (stdin):\n- 1-qator: `n` — postlar soni.\n- Keyingi `n` qator: `post_id;egasi`.\n- Undan keyingi qator: `m` — so'rovlar soni.\n- Keyingi `m` qator: `foydalanuvchi;metod;post_id`. `foydalanuvchi` `anonim` bo'lsa — token yo'q.\n\nHar bir so'rov uchun ANIQ shu tartibda tekshiring:\n1. Foydalanuvchi `anonim` -> kod `401`\n2. Bunday `post_id` yo'q -> kod `404`\n3. Metod xavfsiz (`GET`, `HEAD`, `OPTIONS`) -> kod `200`\n4. Post egasi shu foydalanuvchi -> kod `200`\n5. Aks holda -> kod `403`\n\nHar bir so'rov uchun bitta qator chiqaring: `<METOD> /post/<post_id> -> <kod>` (chiziqcha va `>` orasida bo'sh joy yo'q, `->` atrofida bittadan bo'sh joy).\n\nMisol — kiritish:\n```\n3\n1;ali\n2;vali\n3;ali\n5\nali;GET;1\nvali;PUT;1\nali;PUT;1\nanonim;GET;2\nali;DELETE;9\n```\nChiqish:\n```\nGET /post/1 -> 200\nPUT /post/1 -> 403\nPUT /post/1 -> 200\nGET /post/2 -> 401\nDELETE /post/9 -> 404\n```",
    "starterCodePy": "# Avval postlarning egalarini lug'atga yig'ing, keyin har bir so'rovni tekshiring.\n# Tartib muhim: 401 -> 404 -> xavfsiz metod -> egasi -> 403.\nimport sys\n\nqatorlar = sys.stdin.read().split(\"\\n\")\n",
    "testCases": [
      {
        "stdin": "3\n1;ali\n2;vali\n3;ali\n5\nali;GET;1\nvali;PUT;1\nali;PUT;1\nanonim;GET;2\nali;DELETE;9\n",
        "expectedStdout": "GET /post/1 -> 200\nPUT /post/1 -> 403\nPUT /post/1 -> 200\nGET /post/2 -> 401\nDELETE /post/9 -> 404\n",
        "hidden": false,
        "label": "Egasi, begona va anonim so'rovlar"
      },
      {
        "stdin": "2\n7;zuhra\n8;sardor\n3\nzuhra;DELETE;7\nsardor;DELETE;7\nzuhra;POST;8\n",
        "expectedStdout": "DELETE /post/7 -> 200\nDELETE /post/7 -> 403\nPOST /post/8 -> 403\n",
        "hidden": false,
        "label": "O'chirish va yaratish so'rovlari"
      },
      {
        "stdin": "2\n1;ali\n2;vali\n4\nvali;HEAD;1\nvali;OPTIONS;1\nanonim;PUT;99\nvali;PATCH;2\n",
        "expectedStdout": "HEAD /post/1 -> 200\nOPTIONS /post/1 -> 200\nPUT /post/99 -> 401\nPATCH /post/2 -> 200\n",
        "hidden": true,
        "label": "Xavfsiz metodlar hammaga ochiq"
      },
      {
        "stdin": "3\n1;ali\n2;vali\n3;zuhra\n4\nzuhra;PATCH;3\nzuhra;PATCH;2\nanonim;GET;3\nali;GET;77\n",
        "expectedStdout": "PATCH /post/3 -> 200\nPATCH /post/2 -> 403\nGET /post/3 -> 401\nGET /post/77 -> 404\n",
        "hidden": true,
        "label": "Yo'q post va anonim aralash"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-70",
    "key": "backend-dars-70-easy",
    "title": "Kategoriya nomini ko'rsatish",
    "difficulty": "EASY",
    "points": 10,
    "tags": [
      "serializer",
      "foreignkey",
      "lug'at"
    ],
    "description": "Standart holda `ForeignKey` javobda faqat `id` bo'lib chiqadi: `\"kategoriya\": 1`. `StringRelatedField` esa uning o'rniga nomni ko'rsatadi. Shu almashtirishni qo'lda bajaring.\n\nKiritish (stdin):\n- 1-qator: `n` — kategoriyalar soni.\n- Keyingi `n` qator: `kategoriya_id;nom`.\n- Undan keyingi qator: `m` — postlar soni.\n- Keyingi `m` qator: `post_id;sarlavha;kategoriya_id`.\n\nHar bir post uchun kirish tartibida bitta qator chiqaring:\n`<post_id>. <sarlavha> [<kategoriya nomi>]`\nNuqtadan keyin bitta bo'sh joy, kvadrat qavs oldidan ham bitta bo'sh joy. Agar bunday `kategoriya_id` ro'yxatda bo'lmasa, nom o'rniga `noma'lum` yozing.\n\nMisol — kiritish:\n```\n2\n1;Texnologiya\n2;Sport\n3\n10;Python haqida;1\n11;Futbol yangiliklari;2\n12;Sirli post;7\n```\nChiqish:\n```\n10. Python haqida [Texnologiya]\n11. Futbol yangiliklari [Sport]\n12. Sirli post [noma'lum]\n```",
    "starterCodePy": "# Kategoriyalarni lug'atga yig'ing, keyin har bir post uchun nomni toping.\n# Kategoriya topilmasa: noma'lum\nimport sys\n\nqatorlar = sys.stdin.read().split(\"\\n\")\n",
    "testCases": [
      {
        "stdin": "2\n1;Texnologiya\n2;Sport\n3\n10;Python haqida;1\n11;Futbol yangiliklari;2\n12;Sirli post;7\n",
        "expectedStdout": "10. Python haqida [Texnologiya]\n11. Futbol yangiliklari [Sport]\n12. Sirli post [noma'lum]\n",
        "hidden": false,
        "label": "Bor va yo'q kategoriyalar aralash"
      },
      {
        "stdin": "1\n5;Ta'lim\n2\n1;Birinchi dars;5\n2;Ikkinchi dars;5\n",
        "expectedStdout": "1. Birinchi dars [Ta'lim]\n2. Ikkinchi dars [Ta'lim]\n",
        "hidden": false,
        "label": "Bitta kategoriyaga bir nechta post"
      },
      {
        "stdin": "0\n2\n3;Yangi post;1\n4;Eski post;2\n",
        "expectedStdout": "3. Yangi post [noma'lum]\n4. Eski post [noma'lum]\n",
        "hidden": true,
        "label": "Kategoriyalar ro'yxati bo'sh"
      },
      {
        "stdin": "3\n1;Ilm\n2;San'at\n3;Sport\n3\n30;Uch;3\n31;Bir;1\n32;Nol;0\n",
        "expectedStdout": "30. Uch [Sport]\n31. Bir [Ilm]\n32. Nol [noma'lum]\n",
        "hidden": true,
        "label": "Nol id alohida qaraldi"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-70",
    "key": "backend-dars-70-medium",
    "title": "Ichma-ich (nested) javob",
    "difficulty": "MEDIUM",
    "points": 20,
    "tags": [
      "serializer",
      "nested",
      "json"
    ],
    "description": "Nested serializer bog'langan obyektni javobning ichiga to'liq joylaydi. Har bir post uchun shunday JSON qatorini yasang.\n\nKiritish (stdin):\n- 1-qator: `n` — kategoriyalar soni.\n- Keyingi `n` qator: `kategoriya_id;nom`.\n- Undan keyingi qator: `m` — postlar soni.\n- Keyingi `m` qator: `post_id;sarlavha;kategoriya_id`.\n\nHar bir post uchun bitta qator chiqaring. Kalitlar tartibi ANIQ shunday: `id`, `sarlavha`, `kategoriya`. `id` lar butun son (qo'shtirnoqsiz). Agar `kategoriya_id` `0` bo'lsa yoki bunday kategoriya topilmasa, `\"kategoriya\": null` yozing.\n\nEng ishonchli yo'l — lug'at yasab, uni `json.dumps(obyekt, ensure_ascii=False)` bilan chiqarish. Shunda bo'sh joylar ham to'g'ri joylashadi.\n\nMisol — kiritish:\n```\n2\n1;Texnologiya\n2;Sport\n3\n10;Python haqida;1\n11;Futbol;2\n12;Kundalik;0\n```\nChiqish:\n```\n{\"id\": 10, \"sarlavha\": \"Python haqida\", \"kategoriya\": {\"id\": 1, \"nom\": \"Texnologiya\"}}\n{\"id\": 11, \"sarlavha\": \"Futbol\", \"kategoriya\": {\"id\": 2, \"nom\": \"Sport\"}}\n{\"id\": 12, \"sarlavha\": \"Kundalik\", \"kategoriya\": null}\n```",
    "starterCodePy": "import json\nimport sys\n\n# Har bir post uchun lug'at yasang va json.dumps(..., ensure_ascii=False) bilan chiqaring.\n# Kategoriya topilmasa yoki id 0 bo'lsa - None (JSON'da null).\nqatorlar = sys.stdin.read().split(\"\\n\")\n",
    "testCases": [
      {
        "stdin": "2\n1;Texnologiya\n2;Sport\n3\n10;Python haqida;1\n11;Futbol;2\n12;Kundalik;0\n",
        "expectedStdout": "{\"id\": 10, \"sarlavha\": \"Python haqida\", \"kategoriya\": {\"id\": 1, \"nom\": \"Texnologiya\"}}\n{\"id\": 11, \"sarlavha\": \"Futbol\", \"kategoriya\": {\"id\": 2, \"nom\": \"Sport\"}}\n{\"id\": 12, \"sarlavha\": \"Kundalik\", \"kategoriya\": null}\n",
        "hidden": false,
        "label": "Ichki obyekt va null aralash"
      },
      {
        "stdin": "1\n4;Ta'lim\n2\n7;Birinchi dars;4\n8;Ikkinchi dars;0\n",
        "expectedStdout": "{\"id\": 7, \"sarlavha\": \"Birinchi dars\", \"kategoriya\": {\"id\": 4, \"nom\": \"Ta'lim\"}}\n{\"id\": 8, \"sarlavha\": \"Ikkinchi dars\", \"kategoriya\": null}\n",
        "hidden": false,
        "label": "Bitta kategoriya, ikkita post"
      },
      {
        "stdin": "1\n1;Texnologiya\n2\n20;Yo'qolgan kategoriya;9\n21;Bor kategoriya;1\n",
        "expectedStdout": "{\"id\": 20, \"sarlavha\": \"Yo'qolgan kategoriya\", \"kategoriya\": null}\n{\"id\": 21, \"sarlavha\": \"Bor kategoriya\", \"kategoriya\": {\"id\": 1, \"nom\": \"Texnologiya\"}}\n",
        "hidden": true,
        "label": "Yo'q kategoriya null bo'lib chiqdi"
      },
      {
        "stdin": "2\n3;Ilm\n5;San'at\n3\n40;Birinchi;5\n41;Ikkinchi;3\n42;Uchinchi;0\n",
        "expectedStdout": "{\"id\": 40, \"sarlavha\": \"Birinchi\", \"kategoriya\": {\"id\": 5, \"nom\": \"San'at\"}}\n{\"id\": 41, \"sarlavha\": \"Ikkinchi\", \"kategoriya\": {\"id\": 3, \"nom\": \"Ilm\"}}\n{\"id\": 42, \"sarlavha\": \"Uchinchi\", \"kategoriya\": null}\n",
        "hidden": true,
        "label": "Kalitlar tartibi saqlandi"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-71",
    "key": "backend-dars-71-easy",
    "title": "Post va teglar (M2M)",
    "difficulty": "EASY",
    "points": 10,
    "tags": [
      "m2m",
      "teglar",
      "to'plam"
    ],
    "description": "Many-to-Many munosabat alohida bog'lovchi jadval orqali saqlanadi: bir postda bir nechta teg, bir teg bir nechta postda bo'ladi. Shu bog'lanishni yig'ib chiqaring.\n\nKiritish (stdin):\n- 1-qator: `p` — postlar soni. Keyingi `p` qator: `post_id;sarlavha`.\n- Keyingi qator: `t` — teglar soni. Keyingi `t` qator: `teg_id;nom`.\n- Keyingi qator: `l` — bog'lanishlar soni. Keyingi `l` qator: `post_id;teg_id`.\n\nHar bir post uchun kirish tartibida bitta qator chiqaring:\n`<sarlavha>: <teg1>, <teg2>`\nTeg nomlari ALIFBO tartibida, vergul va bitta bo'sh joy bilan ajratiladi. Bir xil bog'lanish ikki marta kelsa, teg faqat bir marta yoziladi. Postda umuman teg bo'lmasa: `<sarlavha>: teglar yo'q`.\n\nMisol — kiritish:\n```\n2\n1;Salom dunyo\n2;Ikkinchi post\n3\n5;python\n6;django\n7;api\n4\n1;5\n1;6\n2;7\n2;5\n```\nChiqish:\n```\nSalom dunyo: django, python\nIkkinchi post: api, python\n```",
    "starterCodePy": "# Teglarni post bo'yicha to'plamga (set) yig'ing - takrorlar o'zi yo'qoladi.\n# Chiqarishdan oldin sorted() bilan alifbo tartibiga soling.\nimport sys\n\nqatorlar = sys.stdin.read().split(\"\\n\")\n",
    "testCases": [
      {
        "stdin": "2\n1;Salom dunyo\n2;Ikkinchi post\n3\n5;python\n6;django\n7;api\n4\n1;5\n1;6\n2;7\n2;5\n",
        "expectedStdout": "Salom dunyo: django, python\nIkkinchi post: api, python\n",
        "hidden": false,
        "label": "Ikki postda umumiy teg"
      },
      {
        "stdin": "2\n10;Teglari yo'q post\n11;Bitta tegli post\n2\n3;backend\n4;frontend\n1\n11;3\n",
        "expectedStdout": "Teglari yo'q post: teglar yo'q\nBitta tegli post: backend\n",
        "hidden": false,
        "label": "Tegi yo'q post ham bor"
      },
      {
        "stdin": "1\n1;Takroriy teg\n2\n8;python\n9;api\n3\n1;8\n1;8\n1;9\n",
        "expectedStdout": "Takroriy teg: api, python\n",
        "hidden": true,
        "label": "Takroriy bog'lanish bir marta sanaldi"
      },
      {
        "stdin": "3\n1;A post\n2;B post\n3;C post\n2\n5;api\n6;web\n3\n3;5\n1;6\n3;6\n",
        "expectedStdout": "A post: web\nB post: teglar yo'q\nC post: api, web\n",
        "hidden": true,
        "label": "Teglar alifbo tartibida"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-71",
    "key": "backend-dars-71-medium",
    "title": "Hisoblanadigan maydonlar",
    "difficulty": "MEDIUM",
    "points": 20,
    "tags": [
      "serializer",
      "methodfield",
      "matn"
    ],
    "description": "`SerializerMethodField` — modelda yo'q, lekin javobda kerak bo'ladigan maydon: masalan matnning qisqartmasi va izohlar soni. Shu ikkala maydonni hisoblang.\n\nKiritish (stdin):\n- 1-qator: `n` — postlar soni. Keyingi `n` qator: `post_id;sarlavha;matn`.\n- Keyingi qator: `m` — izohlar soni. Keyingi `m` qator: izoh tegishli `post_id`.\n\nHar bir post uchun kirish tartibida bitta qator chiqaring:\n`<sarlavha> | qisqacha: <qisqartma> | izohlar: <son>`\nVertikal chiziq atrofida bittadan bo'sh joy. Qisqartma qoidasi: matn uzunligi 20 belgidan KATTA bo'lsa — dastlabki 20 belgi va oxiriga `...` qo'shiladi; aynan 20 yoki undan qisqa bo'lsa — matn o'zgarishsiz qoladi.\n\nMisol — kiritish:\n```\n2\n1;Salom;Bugun Python o'rgandik va juda zavqlandik\n2;Ikkinchi;Qisqa matn\n3\n1\n1\n2\n```\nChiqish:\n```\nSalom | qisqacha: Bugun Python o'rgand... | izohlar: 2\nIkkinchi | qisqacha: Qisqa matn | izohlar: 1\n```",
    "starterCodePy": "# Izohlarni post_id bo'yicha sanang, matnni 20 belgigacha qisqartiring.\n# 20 dan uzun bo'lsagina oxiriga ... qo'shiladi.\nimport sys\n\nqatorlar = sys.stdin.read().split(\"\\n\")\n",
    "testCases": [
      {
        "stdin": "2\n1;Salom;Bugun Python o'rgandik va juda zavqlandik\n2;Ikkinchi;Qisqa matn\n3\n1\n1\n2\n",
        "expectedStdout": "Salom | qisqacha: Bugun Python o'rgand... | izohlar: 2\nIkkinchi | qisqacha: Qisqa matn | izohlar: 1\n",
        "hidden": false,
        "label": "Uzun matn qisqartirildi"
      },
      {
        "stdin": "1\n7;Yakka post;Izohsiz qolgan post matni\n0\n",
        "expectedStdout": "Yakka post | qisqacha: Izohsiz qolgan post ... | izohlar: 0\n",
        "hidden": false,
        "label": "Izohsiz post nol bilan chiqdi"
      },
      {
        "stdin": "2\n3;Aniq yigirma;12345678901234567890\n4;Yigirma bir;123456789012345678901\n2\n3\n4\n",
        "expectedStdout": "Aniq yigirma | qisqacha: 12345678901234567890 | izohlar: 1\nYigirma bir | qisqacha: 12345678901234567890... | izohlar: 1\n",
        "hidden": true,
        "label": "Aynan 20 belgi chegarasi"
      },
      {
        "stdin": "1\n9;Bo'sh emas;Salom\n3\n9\n9\n9\n",
        "expectedStdout": "Bo'sh emas | qisqacha: Salom | izohlar: 3\n",
        "hidden": true,
        "label": "Bir postga uchta izoh"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-73",
    "key": "backend-dars-73-easy",
    "title": "Sodda tekshiruv funksiyasi",
    "difficulty": "EASY",
    "points": 10,
    "tags": [
      "test",
      "assert",
      "tekshiruv"
    ],
    "description": "Test — bu kodni tekshiruvchi kod. Uning eng sodda ko'rinishi: kutilgan qiymat bilan olingan qiymatni solishtirish va natijani aytish.\n\nKiritish (stdin):\n- 1-qator: `n` — testlar soni.\n- Keyingi `n` qator: `nom;olingan;kutilgan`. Qiymatlar matn sifatida solishtiriladi (bo'sh qiymat ham bo'lishi mumkin).\n\nHar bir test uchun bitta qator chiqaring:\n- Mos kelsa: `<nom>: OK`\n- Mos kelmasa: `<nom>: XATO (kutilgan=<kutilgan>, olingan=<olingan>)`\n\nOxirida yana bitta qator: `<o'tganlar soni>/<jami> test o'tdi`.\n\nMisol — kiritish:\n```\n3\ntest_qoshish;7;7\ntest_ayirish;2;3\ntest_kopaytirish;12;12\n```\nChiqish:\n```\ntest_qoshish: OK\ntest_ayirish: XATO (kutilgan=3, olingan=2)\ntest_kopaytirish: OK\n2/3 test o'tdi\n```",
    "starterCodePy": "# Har bir test uchun olingan va kutilgan qiymatni solishtiring.\n# Oxirida nechta test o'tganini chiqaring.\nimport sys\n\nqatorlar = sys.stdin.read().split(\"\\n\")\n",
    "testCases": [
      {
        "stdin": "3\ntest_qoshish;7;7\ntest_ayirish;2;3\ntest_kopaytirish;12;12\n",
        "expectedStdout": "test_qoshish: OK\ntest_ayirish: XATO (kutilgan=3, olingan=2)\ntest_kopaytirish: OK\n2/3 test o'tdi\n",
        "hidden": false,
        "label": "Bir test yiqildi, ikkitasi o'tdi"
      },
      {
        "stdin": "2\ntest_salom;Salom;Salom\ntest_uzunlik;5;5\n",
        "expectedStdout": "test_salom: OK\ntest_uzunlik: OK\n2/2 test o'tdi\n",
        "hidden": false,
        "label": "Hamma testlar o'tdi"
      },
      {
        "stdin": "3\ntest_bir;a;b\ntest_ikki;;x\ntest_uch;10;9\n",
        "expectedStdout": "test_bir: XATO (kutilgan=b, olingan=a)\ntest_ikki: XATO (kutilgan=x, olingan=)\ntest_uch: XATO (kutilgan=9, olingan=10)\n0/3 test o'tdi\n",
        "hidden": true,
        "label": "Hamma testlar yiqildi"
      },
      {
        "stdin": "1\ntest_yolgiz;42;42\n",
        "expectedStdout": "test_yolgiz: OK\n1/1 test o'tdi\n",
        "hidden": true,
        "label": "Yolg'iz test hisobi"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-73",
    "key": "backend-dars-73-medium",
    "title": "Chegirma va ValueError",
    "difficulty": "MEDIUM",
    "points": 20,
    "tags": [
      "test",
      "xato",
      "try"
    ],
    "description": "Yaxshi funksiya noto'g'ri kiritishda jimgina noto'g'ri javob qaytarmaydi — u xato ko'taradi. Testda ana shu xatoni kutish mumkin (`pytest.raises`).\n\n`chegirma(narx, foiz)` funksiyasini yozing:\n- `narx` manfiy bo'lsa: `ValueError(\"narx manfiy\")` ko'taring.\n- `foiz` 0 dan kichik yoki 100 dan katta bo'lsa: `ValueError(\"foiz 0-100 oralig'ida emas\")` ko'taring.\n- Aks holda chegirmadan keyingi narxni qaytaring: `narx - narx * foiz / 100`.\n- Tekshirish tartibi ANIQ shunday: avval `narx`, keyin `foiz`.\n\nKiritish (stdin):\n- 1-qator: `n` — holatlar soni.\n- Keyingi `n` qator: `narx;foiz` (kasr son bo'lishi mumkin, `float()` bilan o'qing).\n\nHar bir holat uchun bitta qator chiqaring: natija ikki xona aniqlikda (`f\"{qiymat:.2f}\"`), yoki xato bo'lsa `XATO: <xabar>`.\n\nMisol — kiritish:\n```\n4\n100;10\n200;0\n-5;10\n50;150\n```\nChiqish:\n```\n90.00\n200.00\nXATO: narx manfiy\nXATO: foiz 0-100 oralig'ida emas\n```",
    "starterCodePy": "import sys\n\n\ndef chegirma(narx, foiz):\n    # Avval narxni, keyin foizni tekshiring va kerak bo'lsa ValueError ko'taring.\n    ...\n\n\nqatorlar = sys.stdin.read().split(\"\\n\")\n# Har bir holatni try/except ichida chaqiring.\n",
    "testCases": [
      {
        "stdin": "4\n100;10\n200;0\n-5;10\n50;150\n",
        "expectedStdout": "90.00\n200.00\nXATO: narx manfiy\nXATO: foiz 0-100 oralig'ida emas\n",
        "hidden": false,
        "label": "To'g'ri va noto'g'ri qiymatlar aralash"
      },
      {
        "stdin": "3\n33.33;7\n19.99;33\n1000;100\n",
        "expectedStdout": "31.00\n13.39\n0.00\n",
        "hidden": false,
        "label": "Kasr sonlar ikki xonagacha"
      },
      {
        "stdin": "4\n-1;200\n0;0\n80;100\n250;40\n",
        "expectedStdout": "XATO: narx manfiy\n0.00\n0.00\n150.00\n",
        "hidden": true,
        "label": "Chegaradagi qiymatlar"
      },
      {
        "stdin": "2\n50;-1\n50;100.5\n",
        "expectedStdout": "XATO: foiz 0-100 oralig'ida emas\nXATO: foiz 0-100 oralig'ida emas\n",
        "hidden": true,
        "label": "Faqat foiz noto'g'ri holatlar"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-73",
    "key": "backend-dars-73-hard",
    "title": "Test hisoboti",
    "difficulty": "HARD",
    "points": 35,
    "tags": [
      "test",
      "hisobot",
      "lug'at"
    ],
    "description": "Test to'plami ishlab bo'lgach, pytest qisqa hisobot chiqaradi. Shunga o'xshash hisobotni o'zingiz yig'ing.\n\nKiritish (stdin):\n- 1-qator: `n` — testlar soni.\n- Keyingi `n` qator: `guruh;test_nomi;holat`. `holat` — `otdi` yoki `yiqildi`.\n\nChiqarish:\n- Guruhlarni ALIFBO tartibida aylanib chiqing. Har bir guruh uchun: `<guruh>: <o'tganlar>/<jami>`.\n- Agar guruhda yiqilgan testlar bo'lsa, ularni KIRISH tartibida, har birini alohida qatorda chiqaring: ikkita bo'sh joy, `-`, bitta bo'sh joy, test nomi (`  - test_nomi`).\n- Oxirida: `Jami: <o'tganlar>/<jami> (<foiz>%)`. Foiz bir xona aniqlikda: `f\"{foiz:.1f}\"`.\n\nMisol — kiritish:\n```\n5\nauth;test_login;otdi\nauth;test_logout;yiqildi\napi;test_list;otdi\napi;test_create;otdi\napi;test_delete;yiqildi\n```\nChiqish:\n```\napi: 2/3\n  - test_delete\nauth: 1/2\n  - test_logout\nJami: 3/5 (60.0%)\n```",
    "starterCodePy": "# Guruhlar bo'yicha lug'at yig'ing: jami, o'tgan, yiqilganlar ro'yxati.\n# Guruhlarni sorted() bilan alifbo tartibida chiqaring.\nimport sys\n\nqatorlar = sys.stdin.read().split(\"\\n\")\n",
    "testCases": [
      {
        "stdin": "5\nauth;test_login;otdi\nauth;test_logout;yiqildi\napi;test_list;otdi\napi;test_create;otdi\napi;test_delete;yiqildi\n",
        "expectedStdout": "api: 2/3\n  - test_delete\nauth: 1/2\n  - test_logout\nJami: 3/5 (60.0%)\n",
        "hidden": false,
        "label": "Ikki guruh, yiqilganlar ro'yxati bilan"
      },
      {
        "stdin": "3\nmodels;test_str;otdi\nmodels;test_save;otdi\nmodels;test_clean;otdi\n",
        "expectedStdout": "models: 3/3\nJami: 3/3 (100.0%)\n",
        "hidden": false,
        "label": "Hammasi o'tgan guruh"
      },
      {
        "stdin": "3\nutils;test_bir;otdi\nutils;test_ikki;yiqildi\nutils;test_uch;yiqildi\n",
        "expectedStdout": "utils: 1/3\n  - test_ikki\n  - test_uch\nJami: 1/3 (33.3%)\n",
        "hidden": true,
        "label": "Bitta guruhda ikki yiqilish"
      },
      {
        "stdin": "4\nz_oxirgi;test_a;yiqildi\na_birinchi;test_b;yiqildi\nz_oxirgi;test_c;yiqildi\na_birinchi;test_d;yiqildi\n",
        "expectedStdout": "a_birinchi: 0/2\n  - test_b\n  - test_d\nz_oxirgi: 0/2\n  - test_a\n  - test_c\nJami: 0/4 (0.0%)\n",
        "hidden": true,
        "label": "Guruhlar alifbo tartibida"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-74",
    "key": "backend-dars-74-medium",
    "title": "Fixture'lar tartibi",
    "difficulty": "MEDIUM",
    "points": 20,
    "tags": [
      "pytest",
      "fixture",
      "tartib"
    ],
    "description": "Fixture — testga kerak bo'ladigan tayyorgarlik. Fixture boshqa fixture'ga bog'liq bo'lishi mumkin: `mijoz` uchun `foydalanuvchi` kerak, `foydalanuvchi` uchun `baza` kerak. pytest ularni bog'liqlik tartibida tayyorlaydi va TESKARI tartibda tozalaydi.\n\nKiritish (stdin):\n- 1-qator: `n` — e'lon qilingan fixture'lar soni.\n- Keyingi `n` qator: `nom;bog'liqliklar` — bog'liqliklar vergul bilan ajratiladi, bog'liqlik bo'lmasa `-` yoziladi.\n- Oxirgi qator: test so'ragan fixture'lar, vergul bilan ajratilgan.\n\nChiqarish:\n- Har bir tayyorlangan fixture uchun `SETUP <nom>`. Bog'liqlik AVVAL tayyorlanadi. Bir fixture bir martadan ko'p tayyorlanmaydi (ikkinchi marta kerak bo'lsa, qaytadan `SETUP` yozilmaydi). So'ralganlar chapdan o'ngga, bog'liqliklar ham chapdan o'ngga aylanadi.\n- Keyin bitta qator: `RUN test`.\n- Keyin tayyorlangan tartibga TESKARI tartibda `TEARDOWN <nom>`.\n- Agar so'ralgan yoki bog'liqlik sifatida kerak bo'lgan fixture e'lon qilinmagan bo'lsa, boshqa hech narsa chiqarmasdan faqat shu qatorni chiqaring: `XATO: fixture topilmadi: <nom>` (birinchi uchragan noma'lum nom).\n\nMisol — kiritish:\n```\n3\nbaza;-\nfoydalanuvchi;baza\nmijoz;baza,foydalanuvchi\nmijoz\n```\nChiqish:\n```\nSETUP baza\nSETUP foydalanuvchi\nSETUP mijoz\nRUN test\nTEARDOWN mijoz\nTEARDOWN foydalanuvchi\nTEARDOWN baza\n```",
    "starterCodePy": "# Fixture'larni rekursiv tayyorlang: avval bog'liqliklari, keyin o'zi.\n# Tayyorlanganlarni ro'yxatda saqlang - teardown teskari tartibda bo'ladi.\nimport sys\n\nqatorlar = sys.stdin.read().split(\"\\n\")\n",
    "testCases": [
      {
        "stdin": "3\nbaza;-\nfoydalanuvchi;baza\nmijoz;baza,foydalanuvchi\nmijoz\n",
        "expectedStdout": "SETUP baza\nSETUP foydalanuvchi\nSETUP mijoz\nRUN test\nTEARDOWN mijoz\nTEARDOWN foydalanuvchi\nTEARDOWN baza\n",
        "hidden": false,
        "label": "Zanjirli bog'liqlik"
      },
      {
        "stdin": "3\nbaza;-\nmijoz;baza\nsozlama;-\nmijoz,sozlama\n",
        "expectedStdout": "SETUP baza\nSETUP mijoz\nSETUP sozlama\nRUN test\nTEARDOWN sozlama\nTEARDOWN mijoz\nTEARDOWN baza\n",
        "hidden": false,
        "label": "Umumiy bog'liqlik bir marta tayyorlandi"
      },
      {
        "stdin": "2\nbaza;-\nmijoz;baza\nmijoz,token\n",
        "expectedStdout": "XATO: fixture topilmadi: token\n",
        "hidden": true,
        "label": "Noma'lum fixture so'raldi"
      },
      {
        "stdin": "4\nbaza;-\nkesh;baza\nfoydalanuvchi;baza\nmijoz;kesh,foydalanuvchi\nmijoz,baza\n",
        "expectedStdout": "SETUP baza\nSETUP kesh\nSETUP foydalanuvchi\nSETUP mijoz\nRUN test\nTEARDOWN mijoz\nTEARDOWN foydalanuvchi\nTEARDOWN kesh\nTEARDOWN baza\n",
        "hidden": true,
        "label": "Ikki tarmoqli bog'liqlik"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-75",
    "key": "backend-dars-75-easy",
    "title": "Traceback'ni oxiridan o'qish",
    "difficulty": "EASY",
    "points": 10,
    "tags": [
      "debugging",
      "traceback",
      "satr"
    ],
    "description": "Traceback'ni OXIRIDAN o'qish kerak: eng pastdagi qatorda xato turi va xabari, undan yuqoridagi oxirgi `File ...` qatorida esa xato yuz bergan aniq joy turadi.\n\nKiritish (stdin): to'liq traceback matni (bir nechta qator, oxirigacha o'qiladi). Kadr qatorlari doim shu ko'rinishda: `  File \"<fayl>\", line <raqam>, in <funksiya>`.\n\nANIQ 3 qator chiqaring:\n```\nXato turi: <tur>\nXabar: <xabar>\nManba: <fayl>, <raqam>-qator, <funksiya>()\n```\nQoidalar:\n- Xato turi va xabari eng oxirgi bo'sh bo'lmagan qatordan olinadi va birinchi `: ` bo'yicha AJRATILADI (xabarning ichida yana `: ` bo'lsa, u xabarning bir qismi bo'lib qoladi).\n- Agar oxirgi qatorda `: ` umuman bo'lmasa, xabar o'rniga `-` yozing.\n- Manba uchun ENG OXIRGI `File ...` qatori olinadi. Funksiya nomi `<module>` bo'lsa ham shundayligicha yoziladi.\n\nMisol — kiritish:\n```\nTraceback (most recent call last):\n  File \"asosiy.py\", line 20, in <module>\n    natija = hisobla(10, 0)\n  File \"hisob.py\", line 12, in bolish\n    return a / b\nZeroDivisionError: division by zero\n```\nChiqish:\n```\nXato turi: ZeroDivisionError\nXabar: division by zero\nManba: hisob.py, 12-qator, bolish()\n```",
    "starterCodePy": "# Traceback'ni to'liq o'qing, oxirgi File qatorini va oxirgi qatorni ajrating.\n# Ajratishda split(\": \", 1) va split(\", \") yordam beradi.\nimport sys\n\nmatn = sys.stdin.read()\n",
    "testCases": [
      {
        "stdin": "Traceback (most recent call last):\n  File \"asosiy.py\", line 20, in <module>\n    natija = hisobla(10, 0)\n  File \"hisob.py\", line 12, in bolish\n    return a / b\nZeroDivisionError: division by zero\n",
        "expectedStdout": "Xato turi: ZeroDivisionError\nXabar: division by zero\nManba: hisob.py, 12-qator, bolish()\n",
        "hidden": false,
        "label": "Ikki kadrli traceback"
      },
      {
        "stdin": "Traceback (most recent call last):\n  File \"api.py\", line 5, in <module>\n    print(sozlama[\"port\"])\nKeyError: 'port'\n",
        "expectedStdout": "Xato turi: KeyError\nXabar: 'port'\nManba: api.py, 5-qator, <module>()\n",
        "hidden": false,
        "label": "Bitta kadr, <module> ichida"
      },
      {
        "stdin": "Traceback (most recent call last):\n  File \"servis.py\", line 31, in yuklash\n    ma'lumot = int(qator)\nValueError: invalid literal for int() with base 10: 'abc'\n",
        "expectedStdout": "Xato turi: ValueError\nXabar: invalid literal for int() with base 10: 'abc'\nManba: servis.py, 31-qator, yuklash()\n",
        "hidden": true,
        "label": "Xabar ichida yana ikki nuqta bor"
      },
      {
        "stdin": "Traceback (most recent call last):\n  File \"kutish.py\", line 8, in kutmoq\n    vaqt.sleep(60)\nKeyboardInterrupt\n",
        "expectedStdout": "Xato turi: KeyboardInterrupt\nXabar: -\nManba: kutish.py, 8-qator, kutmoq()\n",
        "hidden": true,
        "label": "Xabari yo'q xato"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-75",
    "key": "backend-dars-75-medium",
    "title": "TDD: parol kuchi",
    "difficulty": "MEDIUM",
    "points": 20,
    "tags": [
      "tdd",
      "funksiya",
      "satr"
    ],
    "description": "TDD'da avval qoidalar (testlar) yoziladi, keyin ularni qoniqtiradigan eng sodda kod. Quyidagi qoidalar — sizning RED bosqichingiz.\n\n`parol_kuchi(parol)` uchun ball 0 dan 4 gacha hisoblanadi. Har bir bajarilgan shart uchun +1:\n1. uzunligi 8 dan kichik emas;\n2. ichida kamida bitta raqam bor;\n3. ichida kamida bitta KATTA harf bor;\n4. ichida kamida bitta maxsus belgi bor: `!`, `@`, `#`, `$`, `%`.\n\nBallga qarab daraja: 0-2 -> `zaif`, 3 -> `o'rtacha`, 4 -> `kuchli`.\n\nKiritish (stdin):\n- 1-qator: `n` — parollar soni.\n- Keyingi `n` qator: parolning o'zi (bo'sh joysiz).\n\nHar bir parol uchun bitta qator chiqaring: `<parol> -> <daraja> (<ball>/4)`.\n\nMisol — kiritish:\n```\n4\nsalom\nParol123\nParol123!\nabc12345\n```\nChiqish:\n```\nsalom -> zaif (0/4)\nParol123 -> o'rtacha (3/4)\nParol123! -> kuchli (4/4)\nabc12345 -> zaif (2/4)\n```",
    "starterCodePy": "# Har bir shart uchun +1 ball bering, keyin darajani aniqlang.\n# any(...) va satr metodlari (isdigit, isupper) qo'l keladi.\nimport sys\n\nqatorlar = sys.stdin.read().split(\"\\n\")\n",
    "testCases": [
      {
        "stdin": "4\nsalom\nParol123\nParol123!\nabc12345\n",
        "expectedStdout": "salom -> zaif (0/4)\nParol123 -> o'rtacha (3/4)\nParol123! -> kuchli (4/4)\nabc12345 -> zaif (2/4)\n",
        "hidden": false,
        "label": "To'rt xil daraja aralash"
      },
      {
        "stdin": "3\nQwerty12\nqwerty12\nA1!bcdef\n",
        "expectedStdout": "Qwerty12 -> o'rtacha (3/4)\nqwerty12 -> zaif (2/4)\nA1!bcdef -> kuchli (4/4)\n",
        "hidden": false,
        "label": "Katta harf va maxsus belgi ta'siri"
      },
      {
        "stdin": "3\nAbc1!\n12345678\nPAROL!!!\n",
        "expectedStdout": "Abc1! -> o'rtacha (3/4)\n12345678 -> zaif (2/4)\nPAROL!!! -> o'rtacha (3/4)\n",
        "hidden": true,
        "label": "Uzunlik chegarasidagi parollar"
      },
      {
        "stdin": "2\n1234567\nZzZzZzZ1!\n",
        "expectedStdout": "1234567 -> zaif (1/4)\nZzZzZzZ1! -> kuchli (4/4)\n",
        "hidden": true,
        "label": "Eng past va eng yuqori ball"
      }
    ]
  }
];
