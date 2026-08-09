import type { LessonProblemRecord } from './types';
// Hand-authored practice, test cases verified against the Piston sandbox.
export const backendProblemsP08: LessonProblemRecord[] = [
  {
    "lessonKey": "backend-dars-62",
    "key": "backend-dars-62-easy",
    "title": "Ruxsat etilgan metodlar",
    "difficulty": "EASY",
    "points": 10,
    "tags": [
      "api",
      "http",
      "metod"
    ],
    "description": "APIView faqat o'zida yozilgan HTTP metodlarga javob beradi. Yozilmagan metod kelsa DRF avtomatik `405 Method Not Allowed` qaytaradi. Shu qoidani sof Python'da takrorlaymiz.\n\nBizning endpoint faqat `GET` va `POST` metodlarini biladi.\n\n**Kirish (stdin):** birinchi qatorda `n` — so'rovlar soni. Keyingi `n` qatorda bittadan HTTP metod nomi katta harflarda.\n\n**Chiqish:** har bir so'rov uchun alohida qator:\n- metod `GET` yoki `POST` bo'lsa — `200 OK`\n- aks holda — `405 Method Not Allowed`\n\nMisol kirish:\n```\n3\nGET\nPOST\nDELETE\n```\n\nMisol chiqish:\n```\n200 OK\n200 OK\n405 Method Not Allowed\n```",
    "starterCodePy": "import sys\n\n# stdin'dan so'rovlar sonini va metodlarni o'qing.\n# GET va POST uchun \"200 OK\", qolganlari uchun \"405 Method Not Allowed\" chiqaring.\n",
    "testCases": [
      {
        "stdin": "3\nGET\nPOST\nDELETE\n",
        "expectedStdout": "200 OK\n200 OK\n405 Method Not Allowed\n",
        "hidden": false,
        "label": "Misoldagi uchta so'rov"
      },
      {
        "stdin": "5\nPUT\nGET\nPATCH\nDELETE\nPOST\n",
        "expectedStdout": "405 Method Not Allowed\n200 OK\n405 Method Not Allowed\n405 Method Not Allowed\n200 OK\n",
        "hidden": false,
        "label": "Aralash metodlar"
      },
      {
        "stdin": "1\nGET\n",
        "expectedStdout": "200 OK\n",
        "hidden": true,
        "label": "Bitta so'rov"
      },
      {
        "stdin": "4\nHEAD\nOPTIONS\nTRACE\nPUT\n",
        "expectedStdout": "405 Method Not Allowed\n405 Method Not Allowed\n405 Method Not Allowed\n405 Method Not Allowed\n",
        "hidden": true,
        "label": "Hech biri qo'llab-quvvatlanmaydi"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-62",
    "key": "backend-dars-62-medium",
    "title": "APIView dispatcher",
    "difficulty": "MEDIUM",
    "points": 20,
    "tags": [
      "api",
      "routing",
      "status"
    ],
    "description": "`urls.py` so'rovni yo'l (path) bo'yicha kerakli view'ga uzatadi, view esa metodga qarab kerakli metodni chaqiradi. Shu ikki bosqichli tanlovni Python'da yozing.\n\nBizda ikki xil yo'l bor:\n- `/api/kitoblar/` — ro'yxat yo'li: `GET` -> `200 ro'yxat`, `POST` -> `201 yaratildi`\n- `/api/kitoblar/<son>/` — bitta obyekt yo'li (`<son>` faqat raqamlardan iborat): `GET` -> `200 kitob-<son>`, `DELETE` -> `204 o'chirildi`\n\nQoidalar:\n- yo'l yuqoridagi ikkalasiga ham mos kelmasa — `404 Not Found`\n- yo'l mos, lekin metod ro'yxatda yo'q — `405 Method Not Allowed`\n\n**Kirish (stdin):** birinchi qatorda `n`, keyingi `n` qatorda `METOD yo'l` (bitta bo'sh joy bilan).\n\n**Chiqish:** har bir so'rov uchun bitta qator.\n\nMisol kirish:\n```\n4\nGET /api/kitoblar/\nPOST /api/kitoblar/\nGET /api/kitoblar/7/\nPUT /api/mualliflar/\n```\n\nMisol chiqish:\n```\n200 ro'yxat\n201 yaratildi\n200 kitob-7\n404 Not Found\n```",
    "starterCodePy": "import sys\n\n# Har bir so'rovni yo'l bo'yicha, keyin metod bo'yicha tekshiring.\n# Noma'lum yo'l -> 404 Not Found, noto'g'ri metod -> 405 Method Not Allowed.\n",
    "testCases": [
      {
        "stdin": "4\nGET /api/kitoblar/\nPOST /api/kitoblar/\nGET /api/kitoblar/7/\nPUT /api/mualliflar/\n",
        "expectedStdout": "200 ro'yxat\n201 yaratildi\n200 kitob-7\n404 Not Found\n",
        "hidden": false,
        "label": "Misoldagi to'rt so'rov"
      },
      {
        "stdin": "5\nDELETE /api/kitoblar/12/\nPATCH /api/kitoblar/12/\nDELETE /api/kitoblar/\nGET /api/\nPOST /api/kitoblar/\n",
        "expectedStdout": "204 o'chirildi\n405 Method Not Allowed\n405 Method Not Allowed\n404 Not Found\n201 yaratildi\n",
        "hidden": false,
        "label": "Metod va yo'l aralash"
      },
      {
        "stdin": "3\nGET /api/kitoblar/1/\nGET /api/kitoblar/100/\nGET /api/kitoblar/abc/\n",
        "expectedStdout": "200 kitob-1\n200 kitob-100\n404 Not Found\n",
        "hidden": true,
        "label": "Raqamli va raqamsiz identifikator"
      },
      {
        "stdin": "2\nPUT /api/kitoblar/\nOPTIONS /api/kitoblar/5/\n",
        "expectedStdout": "405 Method Not Allowed\n405 Method Not Allowed\n",
        "hidden": true,
        "label": "Ikkala yo'lda ham noto'g'ri metod"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-62",
    "key": "backend-dars-62-hard",
    "title": "Xotiradagi kitoblar endpointi",
    "difficulty": "HARD",
    "points": 35,
    "tags": [
      "api",
      "crud",
      "status"
    ],
    "description": "Endi endpoint ma'lumotni ham saqlasin. Kitoblar xotirada turadi, identifikatorlar `1` dan boshlab har bir muvaffaqiyatli yaratishda bittaga oshadi (o'chirilgan raqam qayta ishlatilmaydi).\n\n**Kirish (stdin):** birinchi qatorda `n`, keyingi `n` qatorda so'rov. So'rov ko'rinishi `METOD yo'l` yoki `POST /api/kitoblar/ nom=<matn>`.\n\nQoidalar va javoblar:\n- `GET /api/kitoblar/` -> `200 <hozirgi kitoblar soni>`\n- `POST /api/kitoblar/ nom=<matn>` -> `nom` bo'sh bo'lmasa kitob saqlanadi va `201 <nom>` chiqadi\n- `POST /api/kitoblar/` da `nom` berilmagan yoki bo'sh bo'lsa -> `400 nom majburiy` (kitob saqlanmaydi)\n- `GET /api/kitoblar/<id>/` -> shunday id bor bo'lsa `200 <nom>`, aks holda `404 Not Found`\n- `DELETE /api/kitoblar/<id>/` -> bor bo'lsa kitob o'chiriladi va `204` chiqadi, aks holda `404 Not Found`\n- yo'l noma'lum bo'lsa -> `404 Not Found`\n- yo'l ma'lum, lekin metod yuqorida sanalmagan bo'lsa -> `405 Method Not Allowed`\n\nMisol kirish:\n```\n6\nGET /api/kitoblar/\nPOST /api/kitoblar/ nom=O'tkan kunlar\nPOST /api/kitoblar/\nGET /api/kitoblar/1/\nDELETE /api/kitoblar/1/\nGET /api/kitoblar/1/\n```\n\nMisol chiqish:\n```\n200 0\n201 O'tkan kunlar\n400 nom majburiy\n200 O'tkan kunlar\n204\n404 Not Found\n```",
    "starterCodePy": "import sys\n\n# Kitoblarni lug'atda saqlang: {id: nom}. Keyingi id ni alohida hisoblagichda yuriting.\n# Har bir so'rovga topshiriqdagi status kodi bilan javob bering.\n",
    "testCases": [
      {
        "stdin": "6\nGET /api/kitoblar/\nPOST /api/kitoblar/ nom=O'tkan kunlar\nPOST /api/kitoblar/\nGET /api/kitoblar/1/\nDELETE /api/kitoblar/1/\nGET /api/kitoblar/1/\n",
        "expectedStdout": "200 0\n201 O'tkan kunlar\n400 nom majburiy\n200 O'tkan kunlar\n204\n404 Not Found\n",
        "hidden": false,
        "label": "Misoldagi ketma-ketlik"
      },
      {
        "stdin": "7\nPOST /api/kitoblar/ nom=Mehrobdan chayon\nPOST /api/kitoblar/ nom=Kecha va kunduz\nGET /api/kitoblar/\nDELETE /api/kitoblar/1/\nPOST /api/kitoblar/ nom=Sarob\nGET /api/kitoblar/3/\nGET /api/kitoblar/\n",
        "expectedStdout": "201 Mehrobdan chayon\n201 Kecha va kunduz\n200 2\n204\n201 Sarob\n200 Sarob\n200 2\n",
        "hidden": false,
        "label": "Yaratish, o'chirish va sanash"
      },
      {
        "stdin": "4\nPUT /api/kitoblar/\nPATCH /api/kitoblar/2/\nGET /api/mualliflar/\nDELETE /api/kitoblar/9/\n",
        "expectedStdout": "405 Method Not Allowed\n405 Method Not Allowed\n404 Not Found\n404 Not Found\n",
        "hidden": true,
        "label": "Noto'g'ri metod va noma'lum manzil"
      },
      {
        "stdin": "3\nPOST /api/kitoblar/ nom=\nPOST /api/kitoblar/ nom=   \nGET /api/kitoblar/\n",
        "expectedStdout": "400 nom majburiy\n400 nom majburiy\n200 0\n",
        "hidden": true,
        "label": "Bo'sh nom bilan yaratib bo'lmaydi"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-63",
    "key": "backend-dars-63-easy",
    "title": "Router qanday URL yasaydi",
    "difficulty": "EASY",
    "points": 10,
    "tags": [
      "router",
      "url",
      "viewset"
    ],
    "description": "`router.register('kitoblar', KitobViewSet, basename='kitob')` chaqirilganda DRF ikkita URL yasaydi: ro'yxat uchun va bitta obyekt uchun. Shu yasashni Python'da takrorlang.\n\nHar bir ro'yxatdan o'tkazish uchun ANIQ ikki qator chiqaring:\n```\n/api/<prefiks>/ <basename>-list\n/api/<prefiks>/<pk>/ <basename>-detail\n```\n`<pk>` — aynan shu ko'rinishda, harfma-harf yoziladi.\n\n**Kirish (stdin):** birinchi qatorda `n` — ro'yxatdan o'tkazishlar soni. Keyingi `n` qatorda `prefiks basename` (bitta bo'sh joy bilan).\n\nMisol kirish:\n```\n2\nkitoblar kitob\nmualliflar muallif\n```\n\nMisol chiqish:\n```\n/api/kitoblar/ kitob-list\n/api/kitoblar/<pk>/ kitob-detail\n/api/mualliflar/ muallif-list\n/api/mualliflar/<pk>/ muallif-detail\n```",
    "starterCodePy": "import sys\n\n# Har bir prefiks va basename juftligi uchun ikkita URL qatorini chiqaring.\n",
    "testCases": [
      {
        "stdin": "2\nkitoblar kitob\nmualliflar muallif\n",
        "expectedStdout": "/api/kitoblar/ kitob-list\n/api/kitoblar/<pk>/ kitob-detail\n/api/mualliflar/ muallif-list\n/api/mualliflar/<pk>/ muallif-detail\n",
        "hidden": false,
        "label": "Misoldagi ikki registratsiya"
      },
      {
        "stdin": "1\npostlar post\n",
        "expectedStdout": "/api/postlar/ post-list\n/api/postlar/<pk>/ post-detail\n",
        "hidden": false,
        "label": "Bitta registratsiya"
      },
      {
        "stdin": "3\nizohlar izoh\nfoydalanuvchilar foydalanuvchi\nkategoriyalar kategoriya\n",
        "expectedStdout": "/api/izohlar/ izoh-list\n/api/izohlar/<pk>/ izoh-detail\n/api/foydalanuvchilar/ foydalanuvchi-list\n/api/foydalanuvchilar/<pk>/ foydalanuvchi-detail\n/api/kategoriyalar/ kategoriya-list\n/api/kategoriyalar/<pk>/ kategoriya-detail\n",
        "hidden": true,
        "label": "Uchta registratsiya"
      },
      {
        "stdin": "1\nteglar teg\n",
        "expectedStdout": "/api/teglar/ teg-list\n/api/teglar/<pk>/ teg-detail\n",
        "hidden": true,
        "label": "Qisqa prefiks"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-63",
    "key": "backend-dars-63-medium",
    "title": "ModelViewSet amallar jadvali",
    "difficulty": "MEDIUM",
    "points": 20,
    "tags": [
      "viewset",
      "routing",
      "crud"
    ],
    "description": "`ModelViewSet` HTTP metod va URL turiga qarab qaysi amalni bajarishini bir jadval bilan hal qiladi. Shu jadvalni kod bilan yozing.\n\nRo'yxat yo'li `/api/kitoblar/`:\n- `GET` -> `list`\n- `POST` -> `create`\n\nBitta obyekt yo'li `/api/kitoblar/<son>/` (`<son>` faqat raqamlardan iborat):\n- `GET` -> `retrieve`\n- `PUT` -> `update`\n- `PATCH` -> `partial_update`\n- `DELETE` -> `destroy`\n\nJadvalda yo'q juftlik uchun `405` chiqaring. Yo'l umuman bu ikki shaklga mos kelmasa `404` chiqaring.\n\n**Kirish (stdin):** birinchi qatorda `n`, keyingi `n` qatorda `METOD yo'l`.\n\n**Chiqish:** har bir so'rov uchun bitta qator — amal nomi yoki `405` yoki `404`.\n\nMisol kirish:\n```\n5\nGET /api/kitoblar/\nPOST /api/kitoblar/\nPATCH /api/kitoblar/3/\nDELETE /api/kitoblar/\nGET /api/kitoblar/3/4/\n```\n\nMisol chiqish:\n```\nlist\ncreate\npartial_update\n405\n404\n```",
    "starterCodePy": "import sys\n\n# Ikkita lug'at tuzing: ro'yxat yo'li uchun va bitta obyekt yo'li uchun.\n# Metodni lug'atdan qidiring; topilmasa 405, yo'l noma'lum bo'lsa 404.\n",
    "testCases": [
      {
        "stdin": "5\nGET /api/kitoblar/\nPOST /api/kitoblar/\nPATCH /api/kitoblar/3/\nDELETE /api/kitoblar/\nGET /api/kitoblar/3/4/\n",
        "expectedStdout": "list\ncreate\npartial_update\n405\n404\n",
        "hidden": false,
        "label": "Misoldagi besh so'rov"
      },
      {
        "stdin": "6\nPUT /api/kitoblar/10/\nDELETE /api/kitoblar/10/\nGET /api/kitoblar/10/\nPOST /api/kitoblar/10/\nGET /api/kitoblar/\nOPTIONS /api/kitoblar/\n",
        "expectedStdout": "update\ndestroy\nretrieve\n405\nlist\n405\n",
        "hidden": false,
        "label": "Bitta obyekt yo'lidagi amallar"
      },
      {
        "stdin": "3\nGET /api/mualliflar/\nPATCH /api/kitoblar/abc/\nHEAD /api/kitoblar/1/\n",
        "expectedStdout": "404\n404\n405\n",
        "hidden": true,
        "label": "Noma'lum yo'l va noma'lum metod"
      },
      {
        "stdin": "2\nPOST /api/kitoblar/\nPATCH /api/kitoblar/999/\n",
        "expectedStdout": "create\npartial_update\n",
        "hidden": true,
        "label": "Katta identifikator"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-63",
    "key": "backend-dars-63-hard",
    "title": "@action bilan qo'shimcha yo'llar",
    "difficulty": "HARD",
    "points": 35,
    "tags": [
      "viewset",
      "action",
      "url"
    ],
    "description": "`@action` bilan ViewSet'ga standart CRUD'dan tashqari yo'l qo'shiladi. `detail=False` bo'lsa yo'l ro'yxat manziliga, `detail=True` bo'lsa bitta obyekt manziliga ulanadi.\n\nViewSet prefiksi — `kitoblar`, basename — `kitob`. Router doim ikkita asosiy yo'lni yasaydi:\n```\n/api/kitoblar/ kitob-list\n/api/kitoblar/<pk>/ kitob-detail\n```\nHar bir `@action` uchun yana bitta yo'l qo'shiladi:\n- `detail=false` -> `/api/kitoblar/<url_path>/ kitob-<url_path>`\n- `detail=true` -> `/api/kitoblar/<pk>/<url_path>/ kitob-<url_path>`\n\n**Kirish (stdin):** birinchi qatorda `n` — `@action`lar soni. Keyingi `n` qatorda `url_path detail` bo'lib, `detail` qiymati `true` yoki `false`.\n\n**Chiqish:** barcha yo'llar (ikkita asosiysi bilan birga) URL matni bo'yicha O'SISH tartibida saralangan holda, har biri `<url> <nom>` ko'rinishida alohida qatorda.\n\nMisol kirish:\n```\n2\nmashhur false\narxivla true\n```\n\nMisol chiqish:\n```\n/api/kitoblar/ kitob-list\n/api/kitoblar/<pk>/ kitob-detail\n/api/kitoblar/<pk>/arxivla/ kitob-arxivla\n/api/kitoblar/mashhur/ kitob-mashhur\n```",
    "starterCodePy": "import sys\n\n# Yo'llarni ro'yxatga yig'ing: avval ikkita asosiy yo'l, keyin har bir @action.\n# Oxirida URL matni bo'yicha sorted() bilan saralab chiqaring.\n",
    "testCases": [
      {
        "stdin": "2\nmashhur false\narxivla true\n",
        "expectedStdout": "/api/kitoblar/ kitob-list\n/api/kitoblar/<pk>/ kitob-detail\n/api/kitoblar/<pk>/arxivla/ kitob-arxivla\n/api/kitoblar/mashhur/ kitob-mashhur\n",
        "hidden": false,
        "label": "Misoldagi ikki @action"
      },
      {
        "stdin": "3\nyangi false\nyoqtirish true\nstatistika false\n",
        "expectedStdout": "/api/kitoblar/ kitob-list\n/api/kitoblar/<pk>/ kitob-detail\n/api/kitoblar/<pk>/yoqtirish/ kitob-yoqtirish\n/api/kitoblar/statistika/ kitob-statistika\n/api/kitoblar/yangi/ kitob-yangi\n",
        "hidden": false,
        "label": "Uchta qo'shimcha yo'l"
      },
      {
        "stdin": "0\n",
        "expectedStdout": "/api/kitoblar/ kitob-list\n/api/kitoblar/<pk>/ kitob-detail\n",
        "hidden": true,
        "label": "@action umuman yo'q"
      },
      {
        "stdin": "4\nb true\na false\nz true\nc false\n",
        "expectedStdout": "/api/kitoblar/ kitob-list\n/api/kitoblar/<pk>/ kitob-detail\n/api/kitoblar/<pk>/b/ kitob-b\n/api/kitoblar/<pk>/z/ kitob-z\n/api/kitoblar/a/ kitob-a\n/api/kitoblar/c/ kitob-c\n",
        "hidden": true,
        "label": "Saralash tartibi tekshiriladi"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-64",
    "key": "backend-dars-64-easy",
    "title": "201 mi, 400 mi?",
    "difficulty": "EASY",
    "points": 10,
    "tags": [
      "api",
      "validatsiya",
      "status"
    ],
    "description": "POST so'rovi kelganda serializer avval ma'lumotni tekshiradi: to'g'ri bo'lsa `201 Created`, noto'g'ri bo'lsa `400 Bad Request`. Shu tanlovni Python'da yozing.\n\n**Kirish (stdin):** birinchi qatorda `n`, keyingi `n` qatorda `nom;narx` (nuqta-vergul bilan ajratilgan).\n\nTekshiruv tartibi:\n1. `nom` — atrofidagi bo'sh joylar olib tashlangandan keyin bo'sh bo'lmasligi kerak. Bo'sh bo'lsa -> `400 nom`\n2. `narx` — faqat raqamlardan iborat butun son bo'lishi kerak (manfiy son ham, harf ham qabul qilinmaydi). Bo'lmasa -> `400 narx`\n\nIkkalasi ham to'g'ri bo'lsa `201 <nom> <narx>` chiqaring. `narx` boshidagi ortiqcha nollarsiz, butun son ko'rinishida chiqariladi.\n\nMisol kirish:\n```\n3\nAlisher;100\n;50\nKitob;abc\n```\n\nMisol chiqish:\n```\n201 Alisher 100\n400 nom\n400 narx\n```",
    "starterCodePy": "import sys\n\n# Har bir qatorni ';' bo'yicha ikkiga ajrating.\n# Avval nom ni, keyin narx ni tekshiring va mos status kodini chiqaring.\n",
    "testCases": [
      {
        "stdin": "3\nAlisher;100\n;50\nKitob;abc\n",
        "expectedStdout": "201 Alisher 100\n400 nom\n400 narx\n",
        "hidden": false,
        "label": "Misoldagi uch yozuv"
      },
      {
        "stdin": "4\nDaftar;0\nRuchka;-5\n   ;10\nKitob;007\n",
        "expectedStdout": "201 Daftar 0\n400 narx\n400 nom\n201 Kitob 7\n",
        "hidden": false,
        "label": "Nol, manfiy va nolli qiymatlar"
      },
      {
        "stdin": "3\n  Sarob  ;25000\nSarob;\n;\n",
        "expectedStdout": "201 Sarob 25000\n400 narx\n400 nom\n",
        "hidden": true,
        "label": "Bo'sh maydonlar"
      },
      {
        "stdin": "2\nO'tkan kunlar;45000\nMehrobdan chayon;12 000\n",
        "expectedStdout": "201 O'tkan kunlar 45000\n400 narx\n",
        "hidden": true,
        "label": "Bo'sh joyli narx"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-64",
    "key": "backend-dars-64-medium",
    "title": "list va retrieve",
    "difficulty": "MEDIUM",
    "points": 20,
    "tags": [
      "api",
      "crud",
      "list"
    ],
    "description": "`list` butun ro'yxatni, `retrieve` esa bitta obyektni qaytaradi — client uchun bu farq muhim. Uch buyruqli kichik API yozing. Identifikatorlar `1` dan boshlab har yaratishda bittaga oshadi.\n\n**Kirish (stdin):** birinchi qatorda `n`, keyingi `n` qatorda buyruq:\n- `CREATE <nom>` -> obyekt saqlanadi va `201 <id>` chiqadi\n- `LIST` -> `200 <id>:<nom>,<id>:<nom>` ko'rinishida, id bo'yicha o'sish tartibida, ajratgich `,` (bo'sh joysiz). Ro'yxat bo'sh bo'lsa `200 bo'sh`\n- `RETRIEVE <id>` -> shunday id bo'lsa `200 <nom>`, aks holda `404`\n\nMisol kirish:\n```\n5\nLIST\nCREATE Sarob\nCREATE Sarob 2\nLIST\nRETRIEVE 2\n```\n\nMisol chiqish:\n```\n200 bo'sh\n201 1\n201 2\n200 1:Sarob,2:Sarob 2\n200 Sarob 2\n```\n\nDiqqat: `nom` ichida bo'sh joy bo'lishi mumkin, shuning uchun buyruqni faqat BIRINCHI bo'sh joy bo'yicha ajrating.",
    "starterCodePy": "import sys\n\n# Obyektlarni lug'atda saqlang: {id: nom}.\n# split(' ', 1) buyruq nomini qolgan qismidan ajratadi.\n",
    "testCases": [
      {
        "stdin": "5\nLIST\nCREATE Sarob\nCREATE Sarob 2\nLIST\nRETRIEVE 2\n",
        "expectedStdout": "200 bo'sh\n201 1\n201 2\n200 1:Sarob,2:Sarob 2\n200 Sarob 2\n",
        "hidden": false,
        "label": "Misoldagi ketma-ketlik"
      },
      {
        "stdin": "6\nCREATE O'tkan kunlar\nRETRIEVE 1\nRETRIEVE 5\nCREATE Kecha va kunduz\nCREATE Dunyoning ishlari\nLIST\n",
        "expectedStdout": "201 1\n200 O'tkan kunlar\n404\n201 2\n201 3\n200 1:O'tkan kunlar,2:Kecha va kunduz,3:Dunyoning ishlari\n",
        "hidden": false,
        "label": "Yaratish va bittalab o'qish"
      },
      {
        "stdin": "3\nRETRIEVE 1\nLIST\nRETRIEVE 0\n",
        "expectedStdout": "404\n200 bo'sh\n404\n",
        "hidden": true,
        "label": "Bo'sh ro'yxatdan o'qish"
      },
      {
        "stdin": "4\nCREATE A\nCREATE B\nCREATE C\nLIST\n",
        "expectedStdout": "201 1\n201 2\n201 3\n200 1:A,2:B,3:C\n",
        "hidden": true,
        "label": "Ketma-ket identifikatorlar"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-64",
    "key": "backend-dars-64-hard",
    "title": "Serializer xatolar ro'yxati",
    "difficulty": "HARD",
    "points": 35,
    "tags": [
      "api",
      "validatsiya",
      "xatolar"
    ],
    "description": "`is_valid()` faqat birinchi xatoda to'xtamaydi — u BARCHA maydonlarning xatosini yig'ib `errors` ichida qaytaradi. Shu xulqni takrorlang.\n\n**Kirish (stdin):** birinchi qatorda `n`, keyingi `n` qatorda `nom|narx|yil` (vertikal chiziq bilan ajratilgan).\n\nHar bir maydon uchun qoidalar (har bir maydondan FAQAT BIRINCHI xato yoziladi):\n- `nom` (atrofidagi bo'sh joylar olib tashlanadi): bo'sh bo'lsa -> `nom: bo'sh bo'lmasin`; uzunligi 50 dan katta bo'lsa -> `nom: 50 belgidan oshmasin`\n- `narx`: faqat raqamlardan iborat bo'lmasa -> `narx: butun son bo'lsin`; son 0 ga teng bo'lsa -> `narx: musbat bo'lsin`\n- `yil`: faqat raqamlardan iborat bo'lmasa -> `yil: butun son bo'lsin`; son 1900 dan kichik yoki 2026 dan katta bo'lsa -> `yil: 1900-2026 oralig'ida bo'lsin`\n\nAgar xato bo'lmasa bitta qator chiqaring: `201 <nom>`.\nAgar xato bo'lsa avval `400` qatorini, keyin xatolarni `nom`, `narx`, `yil` tartibida har birini alohida qatorda chiqaring.\n\nMisol kirish:\n```\n2\nSarob|25000|1957\n |0|1800\n```\n\nMisol chiqish:\n```\n201 Sarob\n400\nnom: bo'sh bo'lmasin\nnarx: musbat bo'lsin\nyil: 1900-2026 oralig'ida bo'lsin\n```",
    "starterCodePy": "import sys\n\n# Har bir yozuv uchun bo'sh xatolar ro'yxati oching.\n# Uchala maydonni ham tekshirib, xatolarni ro'yxatga qo'shing — birinchi xatoda to'xtamang.\n",
    "testCases": [
      {
        "stdin": "2\nSarob|25000|1957\n |0|1800\n",
        "expectedStdout": "201 Sarob\n400\nnom: bo'sh bo'lmasin\nnarx: musbat bo'lsin\nyil: 1900-2026 oralig'ida bo'lsin\n",
        "hidden": false,
        "label": "Misoldagi ikki yozuv"
      },
      {
        "stdin": "3\nO'tkan kunlar|45000|1926\nDaftar|arzon|2020\nRuchka|1500|yil\n",
        "expectedStdout": "201 O'tkan kunlar\n400\nnarx: butun son bo'lsin\n400\nyil: butun son bo'lsin\n",
        "hidden": false,
        "label": "Har xil noto'g'ri qiymatlar"
      },
      {
        "stdin": "2\nAAAAAAAAAABBBBBBBBBBCCCCCCCCCCDDDDDDDDDDEEEEEEEEEEF|10|2026\nAAAAAAAAAABBBBBBBBBBCCCCCCCCCCDDDDDDDDDDEEEEEEEEEE|10|2026\n",
        "expectedStdout": "400\nnom: 50 belgidan oshmasin\n201 AAAAAAAAAABBBBBBBBBBCCCCCCCCCCDDDDDDDDDDEEEEEEEEEE\n",
        "hidden": true,
        "label": "Uzunlik chegarasi"
      },
      {
        "stdin": "3\nKitob|10|1899\nKitob|10|1900\nKitob|10|2027\n",
        "expectedStdout": "400\nyil: 1900-2026 oralig'ida bo'lsin\n201 Kitob\n400\nyil: 1900-2026 oralig'ida bo'lsin\n",
        "hidden": true,
        "label": "Yil chegaralari"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-65",
    "key": "backend-dars-65-easy",
    "title": "PATCH faqat berilganini o'zgartiradi",
    "difficulty": "EASY",
    "points": 10,
    "tags": [
      "patch",
      "yangilash",
      "api"
    ],
    "description": "PATCH — qisman yangilash: faqat kelgan maydonlar o'zgaradi, qolganlari joyida qoladi.\n\nObyektning boshlang'ich holati:\n```\nnom=Kitob\nnarx=100\nyil=2020\n```\n\n**Kirish (stdin):** birinchi qatorda `n` — PATCH so'rovlari soni. Keyingi `n` qatorda `maydon=qiymat` (maydon doim `nom`, `narx` yoki `yil`).\n\n**Chiqish:** har bir so'rovdan KEYIN obyektning to'liq holati bitta qatorda:\n`nom=<nom> narx=<narx> yil=<yil>` (maydonlar orasida bitta bo'sh joy).\n\nMisol kirish:\n```\n2\nnarx=250\nnom=Sarob\n```\n\nMisol chiqish:\n```\nnom=Kitob narx=250 yil=2020\nnom=Sarob narx=250 yil=2020\n```",
    "starterCodePy": "obyekt = {'nom': 'Kitob', 'narx': '100', 'yil': '2020'}\n\n# Har bir qatorni '=' bo'yicha ajrating va lug'atdagi mos maydonni yangilang.\n# Har safar obyektning to'liq holatini chiqaring.\n",
    "testCases": [
      {
        "stdin": "2\nnarx=250\nnom=Sarob\n",
        "expectedStdout": "nom=Kitob narx=250 yil=2020\nnom=Sarob narx=250 yil=2020\n",
        "hidden": false,
        "label": "Misoldagi ikki so'rov"
      },
      {
        "stdin": "3\nyil=1957\nyil=1958\nnarx=0\n",
        "expectedStdout": "nom=Kitob narx=100 yil=1957\nnom=Kitob narx=100 yil=1958\nnom=Kitob narx=0 yil=1958\n",
        "hidden": false,
        "label": "Bir maydonni ikki marta yangilash"
      },
      {
        "stdin": "1\nnom=Sarob\n",
        "expectedStdout": "nom=Sarob narx=100 yil=2020\n",
        "hidden": true,
        "label": "Bitta maydon o'zgaradi, qolganlari qoladi"
      },
      {
        "stdin": "3\nnom=O'tkan kunlar\nnarx=45000\nyil=1926\n",
        "expectedStdout": "nom=O'tkan kunlar narx=100 yil=2020\nnom=O'tkan kunlar narx=45000 yil=2020\nnom=O'tkan kunlar narx=45000 yil=1926\n",
        "hidden": true,
        "label": "Uchala maydon ketma-ket"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-65",
    "key": "backend-dars-65-medium",
    "title": "PUT to'liq almashtiradi",
    "difficulty": "MEDIUM",
    "points": 20,
    "tags": [
      "put",
      "patch",
      "api"
    ],
    "description": "PUT obyektni TO'LIQ almashtiradi — shuning uchun barcha maydonlar yuborilishi shart. PATCH esa faqat kelgan maydonlarni birlashtiradi.\n\nObyektning boshlang'ich holati: `nom=Kitob`, `narx=100`, `yil=2020`.\n\n**Kirish (stdin):** birinchi qatorda `n`. Keyingi `n` qatorda `METOD maydonlar` ko'rinishidagi so'rov. `METOD` — `PUT` yoki `PATCH`. `maydonlar` — nuqta-vergul bilan ajratilgan `maydon=qiymat` juftliklari, masalan `nom=Sarob;narx=250;yil=1957`.\n\nQoidalar:\n- `PUT` da uchala maydon (`nom`, `narx`, `yil`) ham bo'lishi shart. Bittasi yetishmasa `400 barcha maydonlar kerak` chiqaring va obyektni O'ZGARTIRMANG.\n- `PUT` to'g'ri bo'lsa obyekt butunlay yangi qiymatlar bilan almashtiriladi.\n- `PATCH` kelgan maydonlarni yangilaydi, qolganlari joyida qoladi.\n- Muvaffaqiyatli so'rovdan keyin `200 nom=<nom> narx=<narx> yil=<yil>` chiqaring.\n\nMisol kirish:\n```\n3\nPATCH narx=250\nPUT nom=Sarob;yil=1957\nPUT nom=Sarob;narx=300;yil=1957\n```\n\nMisol chiqish:\n```\n200 nom=Kitob narx=250 yil=2020\n400 barcha maydonlar kerak\n200 nom=Sarob narx=300 yil=1957\n```",
    "starterCodePy": "import sys\n\nobyekt = {'nom': 'Kitob', 'narx': '100', 'yil': '2020'}\n\n# Har bir so'rovni metod va maydonlar qismiga ajrating.\n# PUT uchun uchala maydon borligini tekshiring, PATCH uchun update() ishlating.\n",
    "testCases": [
      {
        "stdin": "3\nPATCH narx=250\nPUT nom=Sarob;yil=1957\nPUT nom=Sarob;narx=300;yil=1957\n",
        "expectedStdout": "200 nom=Kitob narx=250 yil=2020\n400 barcha maydonlar kerak\n200 nom=Sarob narx=300 yil=1957\n",
        "hidden": false,
        "label": "Misoldagi uch so'rov"
      },
      {
        "stdin": "4\nPUT nom=A;narx=1;yil=2001\nPATCH yil=2002\nPUT narx=2\nPATCH nom=B;narx=3\n",
        "expectedStdout": "200 nom=A narx=1 yil=2001\n200 nom=A narx=1 yil=2002\n400 barcha maydonlar kerak\n200 nom=B narx=3 yil=2002\n",
        "hidden": false,
        "label": "PUT va PATCH navbatma-navbat"
      },
      {
        "stdin": "2\nPUT nom=X\nPATCH \n",
        "expectedStdout": "400 barcha maydonlar kerak\n200 nom=Kitob narx=100 yil=2020\n",
        "hidden": true,
        "label": "Yetishmayotgan maydonlar"
      },
      {
        "stdin": "3\nPATCH nom=O'tkan kunlar\nPATCH narx=45000\nPUT nom=Yangi;narx=0;yil=1900\n",
        "expectedStdout": "200 nom=O'tkan kunlar narx=100 yil=2020\n200 nom=O'tkan kunlar narx=45000 yil=2020\n200 nom=Yangi narx=0 yil=1900\n",
        "hidden": true,
        "label": "Ketma-ket qisman yangilashlar"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-65",
    "key": "backend-dars-65-hard",
    "title": "To'liq CRUD: PUT, PATCH, DELETE",
    "difficulty": "HARD",
    "points": 35,
    "tags": [
      "crud",
      "delete",
      "status"
    ],
    "description": "Endi bir nechta obyektli to'liq CRUD. Identifikatorlar `1` dan boshlanadi va har yaratishda bittaga oshadi (o'chirilgani qayta ishlatilmaydi). Har bir obyektda ikkita maydon bor: `nom` va `narx`.\n\n**Kirish (stdin):** birinchi qatorda `n`, keyingi `n` qatorda buyruq:\n- `POST <maydonlar>` -> yangi obyekt, javob `201 <id>`\n- `GET <id>` -> `200 nom=<nom> narx=<narx>`\n- `PUT <id> <maydonlar>` -> to'liq almashtirish\n- `PATCH <id> <maydonlar>` -> qisman yangilash\n- `DELETE <id>` -> `204`\n\n`<maydonlar>` — nuqta-vergul bilan ajratilgan `maydon=qiymat` juftliklari, masalan `nom=Sarob;narx=250`. Kalitlar ham, qiymatlar ham bo'sh joysiz bo'ladi — shuning uchun buyruqni oddiy `split()` bilan bo'sh joy bo'yicha ajratsangiz bo'ladi.\n\nTekshiruv tartibi (juda muhim):\n1. Buyruqda `<id>` bo'lsa va bunday obyekt yo'q bo'lsa -> `404` (boshqa hech narsa tekshirilmaydi)\n2. `POST` va `PUT` da ikkala maydon (`nom`, `narx`) ham bo'lishi shart; bo'lmasa -> `400 nom va narx kerak`\n3. `PUT`/`PATCH` muvaffaqiyatli bo'lsa -> `200 nom=<nom> narx=<narx>`\n\nMisol kirish:\n```\n6\nPOST nom=Sarob;narx=250\nGET 1\nPATCH 1 narx=300\nPUT 1 nom=Yangi\nDELETE 1\nGET 1\n```\n\nMisol chiqish:\n```\n201 1\n200 nom=Sarob narx=250\n200 nom=Sarob narx=300\n400 nom va narx kerak\n204\n404\n```",
    "starterCodePy": "import sys\n\n# store = {id: {'nom': ..., 'narx': ...}}\n# Buyruqni bo'shliq bo'yicha ajrating: birinchi bo'lak — metod, ikkinchisi — id (agar bor bo'lsa).\n# Avval id ni tekshiring (404), keyingina maydonlarni (400).\n",
    "testCases": [
      {
        "stdin": "6\nPOST nom=Sarob;narx=250\nGET 1\nPATCH 1 narx=300\nPUT 1 nom=Yangi\nDELETE 1\nGET 1\n",
        "expectedStdout": "201 1\n200 nom=Sarob narx=250\n200 nom=Sarob narx=300\n400 nom va narx kerak\n204\n404\n",
        "hidden": false,
        "label": "Misoldagi ketma-ketlik"
      },
      {
        "stdin": "7\nPOST nom=A;narx=1\nPOST nom=B;narx=2\nPUT 2 nom=C;narx=9\nGET 2\nDELETE 1\nGET 1\nPOST nom=D;narx=4\n",
        "expectedStdout": "201 1\n201 2\n200 nom=C narx=9\n200 nom=C narx=9\n204\n404\n201 3\n",
        "hidden": false,
        "label": "Ikki obyekt bilan ishlash"
      },
      {
        "stdin": "4\nPATCH 5 nom=X\nDELETE 5\nPOST narx=10\nPUT 1 nom=X;narx=1\n",
        "expectedStdout": "404\n404\n400 nom va narx kerak\n404\n",
        "hidden": true,
        "label": "Mavjud bo'lmagan obyekt va to'liqsiz ma'lumot"
      },
      {
        "stdin": "5\nPOST nom=Kitob;narx=100\nPATCH 1 nom=Yangilangan\nGET 1\nDELETE 1\nDELETE 1\n",
        "expectedStdout": "201 1\n200 nom=Yangilangan narx=100\n200 nom=Yangilangan narx=100\n204\n404\n",
        "hidden": true,
        "label": "Ikki marta o'chirish"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-66",
    "key": "backend-dars-66-easy",
    "title": "Sahifalash javobi",
    "difficulty": "EASY",
    "points": 10,
    "tags": [
      "pagination",
      "api",
      "royxat"
    ],
    "description": "Pagination javobida to'rt narsa bo'ladi: `count`, `next`, `previous` va `results`. Shuni yasang.\n\n**Kirish (stdin):**\n1-qator — `page_size` (bir sahifadagi elementlar soni)\n2-qator — `page` (so'ralgan sahifa raqami, 1 dan boshlanadi)\n3-qator — `n` (elementlar soni)\nkeyingi `n` qator — element nomlari (kelgan tartibi saqlanadi)\n\n**Chiqish:**\nAgar so'ralgan sahifa `1` dan katta bo'lsa-yu unda birorta ham element bo'lmasa — FAQAT `404` chiqaring.\nAks holda:\n```\ncount=<jami elementlar soni>\nnext=<bor|yo'q>\nprevious=<bor|yo'q>\n```\nva keyin shu sahifadagi elementlar har biri alohida qatorda.\n`next=bor` — undan keyin yana element qolgan bo'lsa. `previous=bor` — sahifa raqami 1 dan katta bo'lsa.\n\nMisol kirish:\n```\n2\n2\n5\nAli\nVali\nHasan\nHusan\nOmina\n```\n\nMisol chiqish:\n```\ncount=5\nnext=bor\nprevious=bor\nHasan\nHusan\n```",
    "starterCodePy": "import sys\n\n# start = (page - 1) * page_size, end = start + page_size\n# Kesmani ro'yxatdan oling va count/next/previous ni hisoblang.\n",
    "testCases": [
      {
        "stdin": "2\n2\n5\nAli\nVali\nHasan\nHusan\nOmina\n",
        "expectedStdout": "count=5\nnext=bor\nprevious=bor\nHasan\nHusan\n",
        "hidden": false,
        "label": "O'rtadagi sahifa"
      },
      {
        "stdin": "3\n1\n4\nAli\nVali\nHasan\nHusan\n",
        "expectedStdout": "count=4\nnext=bor\nprevious=yo'q\nAli\nVali\nHasan\n",
        "hidden": false,
        "label": "Birinchi sahifa"
      },
      {
        "stdin": "2\n9\n3\nAli\nVali\nHasan\n",
        "expectedStdout": "404\n",
        "hidden": true,
        "label": "Mavjud bo'lmagan sahifa"
      },
      {
        "stdin": "5\n1\n0\n",
        "expectedStdout": "count=0\nnext=yo'q\nprevious=yo'q\n",
        "hidden": true,
        "label": "Ro'yxat bo'sh"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-66",
    "key": "backend-dars-66-medium",
    "title": "search_fields bo'yicha qidiruv",
    "difficulty": "MEDIUM",
    "points": 20,
    "tags": [
      "search",
      "filtr",
      "api"
    ],
    "description": "`SearchFilter` matnli qidiruvni katta-kichik harfga qaramay, qism satr (substring) bo'yicha bajaradi.\n\n**Kirish (stdin):**\n1-qator — `search=<so'z>`. `<so'z>` bo'sh bo'lishi ham mumkin (`search=`), u holda hamma element mos keladi.\n2-qator — `n` (elementlar soni)\nkeyingi `n` qator — element nomlari\n\n**Chiqish:** birinchi qatorda `count=<mos kelganlar soni>`, keyin mos kelgan nomlar KIRISH TARTIBIDA har biri alohida qatorda. Hech narsa topilmasa faqat `count=0` chiqadi.\n\nMisol kirish:\n```\nsearch=kun\n4\nO'tkan kunlar\nKecha va kunduz\nSarob\nKunduzgi yulduz\n```\n\nMisol chiqish:\n```\ncount=3\nO'tkan kunlar\nKecha va kunduz\nKunduzgi yulduz\n```\n\nDiqqat: `Kecha va kunduz` ham mos keladi, chunki `kunduz` so'zining ichida `kun` bor — qidiruv so'zning boshini emas, ISTALGAN joyini tekshiradi.",
    "starterCodePy": "import sys\n\n# So'rovni ham, nomni ham lower() qiling va 'in' operatori bilan tekshiring.\n",
    "testCases": [
      {
        "stdin": "search=kun\n4\nO'tkan kunlar\nKecha va kunduz\nSarob\nKunduzgi yulduz\n",
        "expectedStdout": "count=3\nO'tkan kunlar\nKecha va kunduz\nKunduzgi yulduz\n",
        "hidden": false,
        "label": "Misoldagi qidiruv"
      },
      {
        "stdin": "search=SAROB\n3\nSarob\nsarobli tush\nKitob\n",
        "expectedStdout": "count=2\nSarob\nsarobli tush\n",
        "hidden": false,
        "label": "Katta harfli so'rov"
      },
      {
        "stdin": "search=\n3\nAli\nVali\nHasan\n",
        "expectedStdout": "count=3\nAli\nVali\nHasan\n",
        "hidden": true,
        "label": "Bo'sh so'rov"
      },
      {
        "stdin": "search=xyz\n2\nAli\nVali\n",
        "expectedStdout": "count=0\n",
        "hidden": true,
        "label": "Hech narsa topilmadi"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-66",
    "key": "backend-dars-66-hard",
    "title": "Qidiruv, tartiblash va sahifalash birgalikda",
    "difficulty": "HARD",
    "points": 35,
    "tags": [
      "pagination",
      "ordering",
      "search"
    ],
    "description": "Haqiqiy API'da uch bosqich ketma-ket bajariladi: avval FILTR (qidiruv), keyin TARTIBLASH, eng oxirida SAHIFALASH. Tartibni buzsangiz javob noto'g'ri chiqadi.\n\n**Kirish (stdin):**\n1-qator — `search=<so'z>` (bo'sh bo'lishi mumkin; nom bo'yicha, katta-kichik harfga qaramay qism satr)\n2-qator — `ordering=<maydon>`, qiymati `nom`, `-nom`, `narx` yoki `-narx`. Oldidagi `-` — kamayish tartibi.\n3-qator — `page=<son>`\n4-qator — `page_size=<son>`\n5-qator — `n`\nkeyingi `n` qator — `nom;narx` (narx — butun son)\n\nTartiblash BARQAROR bo'lishi kerak: qiymatlari teng elementlar kirish tartibida qoladi (`sorted()` Python'da aynan shunday ishlaydi). `narx` bo'yicha tartiblashda sonni matn emas, SON sifatida solishtiring.\n\n**Chiqish:** so'ralgan sahifa `1` dan katta bo'lsa-yu bo'sh bo'lsa — FAQAT `404`. Aks holda:\n```\ncount=<qidiruvdan keyingi jami soni>\nnext=<bor|yo'q>\nprevious=<bor|yo'q>\n```\nva shu sahifadagi elementlar `<nom> <narx>` ko'rinishida (bitta bo'sh joy bilan) alohida qatorlarda.\n\nMisol kirish:\n```\nsearch=kitob\nordering=-narx\npage=1\npage_size=2\n4\nKitob A;300\nDaftar;100\nkitob B;500\nKitob C;200\n```\n\nMisol chiqish:\n```\ncount=3\nnext=bor\nprevious=yo'q\nkitob B 500\nKitob A 300\n```",
    "starterCodePy": "import sys\n\n# 1) search bo'yicha filtrlang\n# 2) ordering bo'yicha sorted(..., key=..., reverse=...) qiling\n# 3) page va page_size bo'yicha kesmani oling\n",
    "testCases": [
      {
        "stdin": "search=kitob\nordering=-narx\npage=1\npage_size=2\n4\nKitob A;300\nDaftar;100\nkitob B;500\nKitob C;200\n",
        "expectedStdout": "count=3\nnext=bor\nprevious=yo'q\nkitob B 500\nKitob A 300\n",
        "hidden": false,
        "label": "Misoldagi so'rov"
      },
      {
        "stdin": "search=\nordering=nom\npage=2\npage_size=2\n5\nVali;10\nAli;20\nHasan;30\nBobur;40\nZulfiya;50\n",
        "expectedStdout": "count=5\nnext=bor\nprevious=bor\nHasan 30\nVali 10\n",
        "hidden": false,
        "label": "Nom bo'yicha ikkinchi sahifa"
      },
      {
        "stdin": "search=a\nordering=narx\npage=1\npage_size=10\n4\nKitobA;90\nDaftarA;9\nRuchka;900\nQalam;90\n",
        "expectedStdout": "count=4\nnext=yo'q\nprevious=yo'q\nDaftarA 9\nKitobA 90\nQalam 90\nRuchka 900\n",
        "hidden": true,
        "label": "Teng narxlar tartibi"
      },
      {
        "stdin": "search=xyz\nordering=-nom\npage=3\npage_size=2\n3\nAli;1\nVali;2\nHasan;3\n",
        "expectedStdout": "404\n",
        "hidden": true,
        "label": "Bo'sh sahifa"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-67",
    "key": "backend-dars-67-easy",
    "title": "Parol murakkabligini tekshirish",
    "difficulty": "EASY",
    "points": 10,
    "tags": [
      "auth",
      "parol",
      "validatsiya"
    ],
    "description": "Ro'yxatdan o'tishda parol yetarlicha kuchli ekanini serializer tekshiradi. Shu tekshiruvni yozing.\n\n**Kirish (stdin):** birinchi qatorda `n`, keyingi `n` qatorda bittadan parol.\n\nQoidalar SHU TARTIBDA tekshiriladi va FAQAT birinchi buzilgani haqida xabar chiqariladi:\n1. uzunligi kamida 8 belgi — buzilsa `xato: kamida 8 belgi`\n2. ichida kamida bitta raqam bor — buzilsa `xato: kamida bitta raqam`\n3. ichida kamida bitta katta harf bor — buzilsa `xato: kamida bitta katta harf`\n\nUchala qoida bajarilsa `ok` chiqaring.\n\nMisol kirish:\n```\n4\nParol123\nqisqa1A\nparollar\nparol123\n```\n\nMisol chiqish:\n```\nok\nxato: kamida 8 belgi\nxato: kamida bitta raqam\nxato: kamida bitta katta harf\n```",
    "starterCodePy": "import sys\n\n# len(), any(c.isdigit() for c in parol) va any(c.isupper() for c in parol) yordam beradi.\n# Qoidalarni topshiriqdagi tartibda tekshiring va birinchi xatoda to'xtang.\n",
    "testCases": [
      {
        "stdin": "4\nParol123\nqisqa1A\nparollar\nparol123\n",
        "expectedStdout": "ok\nxato: kamida 8 belgi\nxato: kamida bitta raqam\nxato: kamida bitta katta harf\n",
        "hidden": false,
        "label": "Misoldagi to'rt parol"
      },
      {
        "stdin": "3\nA1bcdefg\nA1bcdef\nabcdefg1\n",
        "expectedStdout": "ok\nxato: kamida 8 belgi\nxato: kamida bitta katta harf\n",
        "hidden": false,
        "label": "Uzunlik chegarasi"
      },
      {
        "stdin": "2\n1234567A\nAAAAAAAA\n",
        "expectedStdout": "ok\nxato: kamida bitta raqam\n",
        "hidden": true,
        "label": "Faqat raqam yoki faqat harf"
      },
      {
        "stdin": "3\n\nToshkent2026\nTOSHKENT2026\n",
        "expectedStdout": "xato: kamida 8 belgi\nok\nok\n",
        "hidden": true,
        "label": "Bo'sh va uzun parollar"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-67",
    "key": "backend-dars-67-medium",
    "title": "Register: parol javobda ko'rinmasin",
    "difficulty": "MEDIUM",
    "points": 20,
    "tags": [
      "auth",
      "register",
      "write-only"
    ],
    "description": "Register serializer'ida parol `write_only=True` bo'ladi: u KIRISHDA qabul qilinadi, lekin CHIQISHDA hech qachon qaytarilmaydi. Shu xulqni yozing.\n\n**Kirish (stdin):** birinchi qatorda `n`, keyingi `n` qatorda `username;email;parol`.\n\nTekshiruv SHU TARTIBDA (birinchi xatoda to'xtaladi):\n1. `username` atrofidagi bo'sh joylar olib tashlanganda bo'sh bo'lsa -> `400 username`\n2. shunday `username` allaqachon ro'yxatdan o'tgan bo'lsa -> `400 username band`\n3. `email` ichida `@` belgisi bo'lmasa -> `400 email`\n4. `parol` uzunligi 8 dan kichik bo'lsa -> `400 parol`\n\nHammasi to'g'ri bo'lsa foydalanuvchi saqlanadi va `201 username=<username> email=<email>` chiqadi. Parol javobda BO'LMASLIGI kerak. Xato bo'lgan foydalanuvchi saqlanmaydi.\n\nMisol kirish:\n```\n4\nali;ali@mail.uz;Parol123\nali;ali2@mail.uz;Parol123\nvali;valimail.uz;Parol123\n ;x@mail.uz;Parol123\n```\n\nMisol chiqish:\n```\n201 username=ali email=ali@mail.uz\n400 username band\n400 email\n400 username\n```",
    "starterCodePy": "import sys\n\n# Ro'yxatdan o'tganlarni to'plamda (set) saqlang.\n# Javobda parolni CHIQARMANG — u faqat kirish uchun.\n",
    "testCases": [
      {
        "stdin": "4\nali;ali@mail.uz;Parol123\nali;ali2@mail.uz;Parol123\nvali;valimail.uz;Parol123\n ;x@mail.uz;Parol123\n",
        "expectedStdout": "201 username=ali email=ali@mail.uz\n400 username band\n400 email\n400 username\n",
        "hidden": false,
        "label": "Misoldagi to'rt yozuv"
      },
      {
        "stdin": "3\nbobur;bobur@uz.uz;qisqa\nbobur;bobur@uz.uz;Uzunparol1\nbobur;bobur@uz.uz;Uzunparol1\n",
        "expectedStdout": "400 parol\n201 username=bobur email=bobur@uz.uz\n400 username band\n",
        "hidden": false,
        "label": "Xato yozuv saqlanmaydi"
      },
      {
        "stdin": "2\n   ;a@b.uz;12345678\nzulfiya;zulfiya@mail.uz;12345678\n",
        "expectedStdout": "400 username\n201 username=zulfiya email=zulfiya@mail.uz\n",
        "hidden": true,
        "label": "Bo'sh username"
      },
      {
        "stdin": "3\nx;x@a.uz;12345678\nX;X@a.uz;12345678\nx;y@a.uz;12345678\n",
        "expectedStdout": "201 username=x email=x@a.uz\n201 username=X email=X@a.uz\n400 username band\n",
        "hidden": true,
        "label": "Katta-kichik harf farqi"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-67",
    "key": "backend-dars-67-hard",
    "title": "Parolni hash qilib saqlash",
    "difficulty": "HARD",
    "points": 35,
    "tags": [
      "auth",
      "hash",
      "xavfsizlik"
    ],
    "description": "Parol HECH QACHON ochiq saqlanmaydi — saqlanadigan narsa uning hash'i. Va login xatosida qaysi biri (login yoki parol) noto'g'ri ekanini AYTMAYMIZ, aks holda hujumchiga qaysi username mavjudligini ochib bergan bo'lamiz.\n\nHash formulasi: `hashlib.sha256(('techquest' + parol).encode()).hexdigest()` — ya'ni `techquest` so'zi parolga oldindan qo'shiladi (tuz/salt) va sha256 ning kichik harfli hex ko'rinishi olinadi.\n\n**Kirish (stdin):** birinchi qatorda `n`, keyingi `n` qatorda buyruq (bo'laklar bitta bo'sh joy bilan ajratilgan, username va parolda bo'sh joy yo'q):\n- `REGISTER <username> <parol>` -> username band bo'lsa `400 bu username band`, aks holda parolning hash'i saqlanadi va `201 <username>` chiqadi\n- `LOGIN <username> <parol>` -> foydalanuvchi bor va parol hash'i mos bo'lsa `200 kirish muvaffaqiyatli`, BOSHQA HAMMA holatda `400 login yoki parol xato`\n- `HASH <username>` -> foydalanuvchi bor bo'lsa saqlangan hash chiqariladi, aks holda `404`\n\nMisol kirish:\n```\n4\nREGISTER ali Parol123\nLOGIN ali Parol123\nLOGIN ali boshqa\nLOGIN vali Parol123\n```\n\nMisol chiqish:\n```\n201 ali\n200 kirish muvaffaqiyatli\n400 login yoki parol xato\n400 login yoki parol xato\n```",
    "starterCodePy": "import sys\nimport hashlib\n\ndef hashla(parol):\n    return hashlib.sha256(('techquest' + parol).encode()).hexdigest()\n\n# Foydalanuvchilarni lug'atda saqlang: {username: hash}.\n# Parolning o'zini HECH QAYERDA saqlamang.\n",
    "testCases": [
      {
        "stdin": "4\nREGISTER ali Parol123\nLOGIN ali Parol123\nLOGIN ali boshqa\nLOGIN vali Parol123\n",
        "expectedStdout": "201 ali\n200 kirish muvaffaqiyatli\n400 login yoki parol xato\n400 login yoki parol xato\n",
        "hidden": false,
        "label": "Misoldagi to'rt buyruq"
      },
      {
        "stdin": "4\nREGISTER bobur Kuchli2026\nHASH bobur\nREGISTER bobur Yangi2026\nHASH yulduz\n",
        "expectedStdout": "201 bobur\n6adae4c356ad9a8835f0531a01847607b344d75f02ef6849f328254f4be3f101\n400 bu username band\n404\n",
        "hidden": false,
        "label": "Hash va band username"
      },
      {
        "stdin": "5\nREGISTER a 1\nREGISTER b 1\nHASH a\nHASH b\nLOGIN a 1\n",
        "expectedStdout": "201 a\n201 b\nc94997e6b9ac2ee9e93f111b078da7227d18ebd16b3cc567d59b2975b35ef8dd\nc94997e6b9ac2ee9e93f111b078da7227d18ebd16b3cc567d59b2975b35ef8dd\n200 kirish muvaffaqiyatli\n",
        "hidden": true,
        "label": "Bir xil parolning hash'i"
      },
      {
        "stdin": "3\nLOGIN yoq parol\nREGISTER yoq parol\nLOGIN yoq Parol\n",
        "expectedStdout": "400 login yoki parol xato\n201 yoq\n400 login yoki parol xato\n",
        "hidden": true,
        "label": "Ro'yxatdan o'tmagan foydalanuvchi"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-68",
    "key": "backend-dars-68-easy",
    "title": "JWT payload shifrlanmagan",
    "difficulty": "EASY",
    "points": 10,
    "tags": [
      "jwt",
      "token",
      "base64"
    ],
    "description": "JWT uchta bo'lakdan iborat va ular nuqta bilan ajratiladi: `header.payload.signature`. Har bir bo'lak — base64url ko'rinishidagi matn. Payload SHIFRLANMAGAN: kalitsiz ham uni o'qish mumkin. Buni o'z ko'zingiz bilan ko'rasiz — shuning uchun JWT ichiga maxfiy ma'lumot yozilmaydi.\n\n**Kirish (stdin):** bitta qatorda JWT token.\n\n**Chiqish:** payload ichidagi har bir kalit-qiymat juftligi `<kalit>=<qiymat>` ko'rinishida, KALIT nomi bo'yicha alifbo tartibida saralangan holda, har biri alohida qatorda.\n\nbase64url'ni ochish uchun to'ldiruvchi `=` belgilarini qo'shish kerak bo'ladi — buni starter kodidagi `b64url_ochish()` funksiyasi bajaradi.\n\nMisol kirish:\n```\neyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo3LCJ1c2VybmFtZSI6ImFsaSIsImV4cCI6MTg5MzQ1NjAwMH0.VAHo0ZY8J-FiMieHYYcoV8rHbM4stsvClKlh5UKEekQ\n```\n\nMisol chiqish:\n```\nexp=1893456000\nuser_id=7\nusername=ali\n```",
    "starterCodePy": "import sys\nimport base64\nimport json\n\ndef b64url_ochish(bolak):\n    # base64url uzunligi 4 ga bo'linishi kerak — yetmaganini '=' bilan to'ldiramiz\n    bolak += '=' * (-len(bolak) % 4)\n    return base64.urlsafe_b64decode(bolak)\n\n# Tokenni '.' bo'yicha uchga ajrating, o'rtadagi bo'lakni oching va json.loads() qiling.\n",
    "testCases": [
      {
        "stdin": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo3LCJ1c2VybmFtZSI6ImFsaSIsImV4cCI6MTg5MzQ1NjAwMH0.VAHo0ZY8J-FiMieHYYcoV8rHbM4stsvClKlh5UKEekQ\n",
        "expectedStdout": "exp=1893456000\nuser_id=7\nusername=ali\n",
        "hidden": false,
        "label": "Misoldagi token"
      },
      {
        "stdin": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwidXNlcl9pZCI6NDJ9.FDMjFLlG2OLZkc8NnH-3E_1Mhb33QJMM4kXjtOIej6g\n",
        "expectedStdout": "token_type=access\nuser_id=42\n",
        "hidden": false,
        "label": "Boshqa kalitlar to'plami"
      },
      {
        "stdin": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzAwMDAwMDAwLCJleHAiOjE3MDAwMDM2MDB9.Y7mBs22eCunSYQIQjj_0JWXSxXgV-6Eo2OC4HEhTeLA\n",
        "expectedStdout": "exp=1700003600\niat=1700000000\nrole=admin\nsub=1\n",
        "hidden": true,
        "label": "To'rtta da'vo"
      },
      {
        "stdin": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ6ZWJyYSI6Im94aXJnaSIsImFsZmEiOiJiaXJpbmNoaSJ9.EhyVl-te4wpKluBHZ22j__wLXJh2wMDS-ssX960djKk\n",
        "expectedStdout": "alfa=birinchi\nzebra=oxirgi\n",
        "hidden": true,
        "label": "Saralash tartibi"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-68",
    "key": "backend-dars-68-medium",
    "title": "JWT imzosini tekshirish",
    "difficulty": "MEDIUM",
    "points": 20,
    "tags": [
      "jwt",
      "imzo",
      "hmac"
    ],
    "description": "Payloadni hamma o'qiy oladi, lekin uni O'ZGARTIRIB bo'lmaydi — chunki uchinchi bo'lak imzo. Imzo `HS256` algoritmida shunday hisoblanadi:\n\n1. `header` va `payload` bo'laklari nuqta bilan birlashtiriladi: `header.payload`\n2. shu matndan maxfiy kalit bilan HMAC-SHA256 olinadi\n3. natija base64url'ga o'giriladi va oxiridagi `=` to'ldiruvchilari OLIB TASHLANADI\n\nAgar hisoblangan imzo tokendagi uchinchi bo'lakka teng bo'lsa — token haqiqiy.\n\n**Kirish (stdin):** 1-qatorda maxfiy kalit, 2-qatorda token.\n\n**Chiqish:** bitta qator — `imzo to'g'ri` yoki `imzo xato`.\n\nMisol kirish:\n```\nmaxfiy-kalit\neyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjozLCJ0b2tlbl90eXBlIjoiYWNjZXNzIn0.N9wOlmLoxevYLzedj4Hi-fVB7QRB_NMQZWgz4aAubiI\n```\n\nMisol chiqish:\n```\nimzo to'g'ri\n```",
    "starterCodePy": "import sys\nimport base64\nimport hashlib\nimport hmac\n\ndef b64url_yopish(baytlar):\n    return base64.urlsafe_b64encode(baytlar).decode().rstrip('=')\n\n# imzo = hmac.new(kalit.encode(), (header + '.' + payload).encode(), hashlib.sha256).digest()\n# Uni b64url_yopish() bilan matnga o'giring va tokendagi uchinchi bo'lak bilan solishtiring.\n",
    "testCases": [
      {
        "stdin": "maxfiy-kalit\neyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjozLCJ0b2tlbl90eXBlIjoiYWNjZXNzIn0.N9wOlmLoxevYLzedj4Hi-fVB7QRB_NMQZWgz4aAubiI\n",
        "expectedStdout": "imzo to'g'ri\n",
        "hidden": false,
        "label": "Misoldagi token"
      },
      {
        "stdin": "maxfiy-kalit\neyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjozLCJ0b2tlbl90eXBlIjoiYWNjZXNzIn0.b2IVlAxXfAn5EPQyETzsG4xLBhOuzGFqOs-UaLhwrmA\n",
        "expectedStdout": "imzo xato\n",
        "hidden": false,
        "label": "Boshqa kalit bilan imzolangan"
      },
      {
        "stdin": "12345\neyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo5OX0.wLSKQkqQSTjM7fvBscCohw4EnrlBl2-oIUIDRJTfM_E\n",
        "expectedStdout": "imzo to'g'ri\n",
        "hidden": true,
        "label": "Qisqa kalit"
      },
      {
        "stdin": "kalit\neyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJyb2wiOiJhZG1pbiJ9.iazS-AkjQaZo25ngm339b0jmP9VOkp4zU3ISrz4ovrc\n",
        "expectedStdout": "imzo xato\n",
        "hidden": true,
        "label": "Buzilgan imzo"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-68",
    "key": "backend-dars-68-hard",
    "title": "Access tokenni to'liq tekshirish",
    "difficulty": "HARD",
    "points": 35,
    "tags": [
      "jwt",
      "auth",
      "tekshiruv"
    ],
    "description": "Har bir himoyalangan so'rovda server tokenni tekshiradi. Tekshiruv bosqichlari ANIQ shu tartibda bo'ladi va birinchi muammoda to'xtaydi:\n\n1. token nuqta bilan ajratilganda ANIQ 3 bo'lak bermasa -> `xato: format`\n2. imzo mos kelmasa -> `xato: imzo` (imzo HS256: `header.payload` matnidan maxfiy kalit bilan HMAC-SHA256, base64url, oxiridagi `=` siz)\n3. payload'da `exp` bo'lmasa YOKI `exp` qiymati hozirgi vaqtdan katta bo'lmasa (`exp <= hozir`) -> `xato: muddati tugagan`\n4. payload'dagi `token_type` qiymati `access` bo'lmasa (yoki umuman bo'lmasa) -> `xato: turi noto'g'ri`\n\nHammasi joyida bo'lsa `ok user_id=<qiymat>` chiqaring.\n\n**Kirish (stdin):** 1-qatorda `secret=<kalit>`, 2-qatorda `hozir=<unix vaqt, butun son>`, 3-qatorda token.\n\nMisol kirish:\n```\nsecret=maxfiy\nhozir=1700000000\neyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwidXNlcl9pZCI6MTIsImV4cCI6MTgwMDAwMDAwMH0.sJ-xWOdgk_W3tCh1FH81DNlmjo070lba-4y-zoRyRks\n```\n\nMisol chiqish:\n```\nok user_id=12\n```",
    "starterCodePy": "import sys\nimport base64\nimport hashlib\nimport hmac\nimport json\n\ndef b64url_ochish(bolak):\n    bolak += '=' * (-len(bolak) % 4)\n    return base64.urlsafe_b64decode(bolak)\n\ndef b64url_yopish(baytlar):\n    return base64.urlsafe_b64encode(baytlar).decode().rstrip('=')\n\n# Bosqichlarni topshiriqdagi tartibda bajaring: format -> imzo -> muddat -> tur.\n",
    "testCases": [
      {
        "stdin": "secret=maxfiy\nhozir=1700000000\neyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwidXNlcl9pZCI6MTIsImV4cCI6MTgwMDAwMDAwMH0.sJ-xWOdgk_W3tCh1FH81DNlmjo070lba-4y-zoRyRks\n",
        "expectedStdout": "ok user_id=12\n",
        "hidden": false,
        "label": "Misoldagi token"
      },
      {
        "stdin": "secret=maxfiy\nhozir=1700000000\neyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwidXNlcl9pZCI6MTIsImV4cCI6MTYwMDAwMDAwMH0.5CrC-mcGLHpb7kSKuo8_4LPGRZVSOV4ayQHYfzG3c54\n",
        "expectedStdout": "xato: muddati tugagan\n",
        "hidden": false,
        "label": "Vaqti o'tgan token"
      },
      {
        "stdin": "secret=maxfiy\nhozir=1700000000\neyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsInVzZXJfaWQiOjEyLCJleHAiOjE4MDAwMDAwMDB9.IZ5OO1KKLhGKM8AdJVgWjogqlnSFfUUZInn-6RnSqr0\n",
        "expectedStdout": "xato: turi noto'g'ri\n",
        "hidden": true,
        "label": "Noto'g'ri turdagi token"
      },
      {
        "stdin": "secret=maxfiy\nhozir=1700000000\neyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwidXNlcl9pZCI6MTIsImV4cCI6MTgwMDAwMDAwMH0.sayDm20kRFrk3c1LMiiAP_km3vu40B61PjbSSHbdW6w\n",
        "expectedStdout": "xato: imzo\n",
        "hidden": true,
        "label": "Imzo mos emas"
      },
      {
        "stdin": "secret=maxfiy\nhozir=1700000000\neyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwidXNlcl9pZCI6NX0\n",
        "expectedStdout": "xato: format\n",
        "hidden": true,
        "label": "Bo'laklar soni noto'g'ri"
      }
    ]
  }
];
