import type { LessonProblemRecord } from './types';

/**
 * Hand-authored practice for backend lessons 55-61 (Oy-5: Django, Oy-6 boshi: DRF).
 *
 * Grading is exact-output, so every `expectedStdout` below was produced by actually running a
 * reference solution on the Piston sandbox (python 3.10.0) against the matching `stdin` — none of
 * them were written by hand or from memory.
 *
 * Lessons 57 (Admin panel) and 60 (Blog loyiha) intentionally have NO problems here: their work is
 * configuring a running Django project, which a stdin/stdout check cannot honestly verify. They
 * keep their rubric-graded homework assignment instead.
 */
export const backendProblemsP07: LessonProblemRecord[] = [
  {
    "lessonKey": "backend-dars-55",
    "key": "backend-dars-55-easy",
    "title": "Modeldan CREATE TABLE",
    "difficulty": "EASY",
    "points": 10,
    "tags": [
      "django",
      "model",
      "sql",
      "migratsiya"
    ],
    "description": "Django `makemigrations` buyrug'i model class'ni o'qib, undan SQL jadval yozadi — `sqlmigrate` bilan o'sha SQL'ni ko'rish mumkin. Bugun o'sha tarjimonni o'zimiz yozamiz.\n\nKirish (stdin):\n- 1-qator — jadval nomi;\n- 2-qator — `N`, maydonlar soni;\n- keyingi `N` qator — `maydon_nomi FieldType` ko'rinishida (orasida bitta bo'sh joy).\n\nMaydon turlari quyidagicha tarjima qilinadi:\n\n`CharField` → `varchar(200)`\n`TextField` → `text`\n`IntegerField` → `integer`\n`BooleanField` → `bool`\n`DateField` → `date`\n\nChiqish qoidalari:\n1. Birinchi qator — `CREATE TABLE <jadval_nomi> (`.\n2. Har bir ustun alohida qatorda, boshida ANIQ 4 ta bo'sh joy bilan yoziladi.\n3. Birinchi ustun har doim `id integer PRIMARY KEY AUTOINCREMENT` — Django uni avtomatik qo'shadi, kirishda u yo'q.\n4. Keyin kirish tartibida har bir maydon: `nom tur NOT NULL`.\n5. Oxirgi ustundan tashqari har bir ustun qatori vergul (`,`) bilan tugaydi.\n6. Oxirgi qator — `);`.\n\nMisol. Kirish:\n\n```\nblog_post\n3\nsarlavha CharField\nmatn TextField\nkorishlar IntegerField\n```\n\nChiqish:\n\n```\nCREATE TABLE blog_post (\n    id integer PRIMARY KEY AUTOINCREMENT,\n    sarlavha varchar(200) NOT NULL,\n    matn text NOT NULL,\n    korishlar integer NOT NULL\n);\n```",
    "starterCodePy": "import sys\n\n# Django maydon turlarini SQL turlariga aylantiruvchi jadval.\nTURLAR = {\n    \"CharField\": \"varchar(200)\",\n    \"TextField\": \"text\",\n    \"IntegerField\": \"integer\",\n    \"BooleanField\": \"bool\",\n    \"DateField\": \"date\",\n}\n\nlines = sys.stdin.read().split(\"\\n\")\njadval = lines[0].strip()\nn = int(lines[1])\n\n# 1) Ustunlar ro'yxatini yig'ing (birinchisi id).\n# 2) CREATE TABLE ni chiqaring: har ustun oldida 4 ta bo'sh joy,\n#    oxirgisidan boshqasida vergul.\n",
    "testCases": [
      {
        "stdin": "blog_post\n3\nsarlavha CharField\nmatn TextField\nkorishlar IntegerField\n",
        "expectedStdout": "CREATE TABLE blog_post (\n    id integer PRIMARY KEY AUTOINCREMENT,\n    sarlavha varchar(200) NOT NULL,\n    matn text NOT NULL,\n    korishlar integer NOT NULL\n);\n",
        "hidden": false,
        "label": "Uchta maydonli model"
      },
      {
        "stdin": "shop_mahsulot\n2\nnom CharField\nnarx IntegerField\n",
        "expectedStdout": "CREATE TABLE shop_mahsulot (\n    id integer PRIMARY KEY AUTOINCREMENT,\n    nom varchar(200) NOT NULL,\n    narx integer NOT NULL\n);\n",
        "hidden": false,
        "label": "Boshqa jadval nomi"
      },
      {
        "stdin": "blog_teg\n1\nnom CharField\n",
        "expectedStdout": "CREATE TABLE blog_teg (\n    id integer PRIMARY KEY AUTOINCREMENT,\n    nom varchar(200) NOT NULL\n);\n",
        "hidden": true,
        "label": "Bitta maydonli model"
      },
      {
        "stdin": "kutubxona_kitob\n5\nnom CharField\ntavsif TextField\nsahifa IntegerField\nmavjud BooleanField\nchiqqan_sana DateField\n",
        "expectedStdout": "CREATE TABLE kutubxona_kitob (\n    id integer PRIMARY KEY AUTOINCREMENT,\n    nom varchar(200) NOT NULL,\n    tavsif text NOT NULL,\n    sahifa integer NOT NULL,\n    mavjud bool NOT NULL,\n    chiqqan_sana date NOT NULL\n);\n",
        "hidden": true,
        "label": "Beshta maydon, barcha turlar"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-55",
    "key": "backend-dars-55-medium",
    "title": "null=True va blank=True",
    "difficulty": "MEDIUM",
    "points": 20,
    "tags": [
      "django",
      "model",
      "sql",
      "null"
    ],
    "description": "Darsning eng ko'p chalkashtiradigan joyi: `null=True` — bazaga tegishli (ustun NULL qabul qiladi), `blank=True` — faqat formaga tegishli (SQL'ga umuman ta'sir qilmaydi). Buni tarjimon yozib isbotlaymiz.\n\nKirish (stdin):\n- 1-qator — jadval nomi;\n- 2-qator — `N`, maydonlar soni;\n- keyingi `N` qator — `maydon_nomi FieldType [bayroqlar...]`. Bayroq bo'lmasligi, bittasi yoki ikkalasi ham (`null=True`, `blank=True`) bo'lishi mumkin, ular bo'sh joy bilan ajratiladi.\n\nTurlar tarjimasi:\n\n`CharField` → `varchar(200)`\n`TextField` → `text`\n`IntegerField` → `integer`\n`BooleanField` → `bool`\n`DateField` → `date`\n\nChiqish oldingi topshiriqdagi kabi `CREATE TABLE` bloki, faqat ustun oxiri:\n- agar maydonda `null=True` bo'lsa — `NULL`;\n- aks holda — `NOT NULL`.\n\n`blank=True` chiqishga umuman ta'sir qilmaydi. `id` ustuni har doim birinchi va o'zgarmaydi.\n\nMisol. Kirish:\n\n```\nblog_post\n3\nsarlavha CharField\nmatn TextField null=True\nchop_etilgan BooleanField\n```\n\nChiqish:\n\n```\nCREATE TABLE blog_post (\n    id integer PRIMARY KEY AUTOINCREMENT,\n    sarlavha varchar(200) NOT NULL,\n    matn text NULL,\n    chop_etilgan bool NOT NULL\n);\n```",
    "starterCodePy": "import sys\n\nTURLAR = {\n    \"CharField\": \"varchar(200)\",\n    \"TextField\": \"text\",\n    \"IntegerField\": \"integer\",\n    \"BooleanField\": \"bool\",\n    \"DateField\": \"date\",\n}\n\nlines = sys.stdin.read().split(\"\\n\")\njadval = lines[0].strip()\nn = int(lines[1])\n\n# Har bir qatorni split() qiling: birinchi so'z — nom, ikkinchisi — tur,\n# qolganlari — bayroqlar. Faqat null=True SQL'ni o'zgartiradi.\n",
    "testCases": [
      {
        "stdin": "blog_post\n3\nsarlavha CharField\nmatn TextField null=True\nchop_etilgan BooleanField\n",
        "expectedStdout": "CREATE TABLE blog_post (\n    id integer PRIMARY KEY AUTOINCREMENT,\n    sarlavha varchar(200) NOT NULL,\n    matn text NULL,\n    chop_etilgan bool NOT NULL\n);\n",
        "hidden": false,
        "label": "null=True bo'lgan maydon"
      },
      {
        "stdin": "shop_mahsulot\n2\nnom CharField\nchegirma IntegerField null=True\n",
        "expectedStdout": "CREATE TABLE shop_mahsulot (\n    id integer PRIMARY KEY AUTOINCREMENT,\n    nom varchar(200) NOT NULL,\n    chegirma integer NULL\n);\n",
        "hidden": false,
        "label": "Ikkita maydon"
      },
      {
        "stdin": "blog_izoh\n2\nmatn TextField blank=True\nsana DateField\n",
        "expectedStdout": "CREATE TABLE blog_izoh (\n    id integer PRIMARY KEY AUTOINCREMENT,\n    matn text NOT NULL,\n    sana date NOT NULL\n);\n",
        "hidden": true,
        "label": "Faqat blank=True berilgan"
      },
      {
        "stdin": "blog_profil\n3\nbio TextField null=True blank=True\ntugilgan DateField null=True\nfaol BooleanField\n",
        "expectedStdout": "CREATE TABLE blog_profil (\n    id integer PRIMARY KEY AUTOINCREMENT,\n    bio text NULL,\n    tugilgan date NULL,\n    faol bool NOT NULL\n);\n",
        "hidden": true,
        "label": "Ikkala bayroq birga"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-55",
    "key": "backend-dars-55-hard",
    "title": "ForeignKey va indeks",
    "difficulty": "HARD",
    "points": 35,
    "tags": [
      "django",
      "model",
      "foreignkey",
      "sql"
    ],
    "description": "`ForeignKey` — Django'da ikkita modelni bog'lash usuli. Bazada u `_id` qo'shimchali ustunga aylanadi va Django unga avtomatik indeks yasaydi. Shu xatti-harakatni takrorlang.\n\nKirish (stdin):\n- 1-qator — jadval nomi;\n- 2-qator — `N`, maydonlar soni;\n- keyingi `N` qator ikki xil bo'ladi:\n  - oddiy maydon: `nom FieldType [null=True] [blank=True]`;\n  - bog'lanish: `nom ForeignKey maqsad_jadval [null=True] [blank=True]`.\n\nOddiy turlar tarjimasi:\n\n`CharField` → `varchar(200)`\n`TextField` → `text`\n`IntegerField` → `integer`\n`BooleanField` → `bool`\n`DateField` → `date`\n\nChiqish:\n1. `CREATE TABLE` bloki oldingi topshiriqlardagi qoidalar bo'yicha (birinchi ustun — `id integer PRIMARY KEY AUTOINCREMENT`, 4 ta bo'sh joy, oxirgisidan boshqasida vergul, `null=True` bo'lsa `NULL`, aks holda `NOT NULL`).\n2. `ForeignKey` maydoni uchun ustun quyidagicha yoziladi:\n   `nom_id integer NOT NULL REFERENCES \"maqsad_jadval\" (\"id\")` — e'tibor bering, ustun nomiga `_id` qo'shiladi, turi doim `integer`, maqsad jadval va `id` qo'shtirnoq ichida.\n3. `);` qatoridan KEYIN har bir `ForeignKey` uchun (kirish tartibida) indeks qatori chiqariladi:\n   `CREATE INDEX <jadval>_<nom>_id ON <jadval> (<nom>_id);`\n   Agar `ForeignKey` bo'lmasa, indeks qatorlari ham bo'lmaydi.\n\nMisol. Kirish:\n\n```\nblog_post\n3\nsarlavha CharField\nmuallif ForeignKey auth_user\nkategoriya ForeignKey blog_kategoriya null=True\n```\n\nChiqish:\n\n```\nCREATE TABLE blog_post (\n    id integer PRIMARY KEY AUTOINCREMENT,\n    sarlavha varchar(200) NOT NULL,\n    muallif_id integer NOT NULL REFERENCES \"auth_user\" (\"id\"),\n    kategoriya_id integer NULL REFERENCES \"blog_kategoriya\" (\"id\")\n);\nCREATE INDEX blog_post_muallif_id ON blog_post (muallif_id);\nCREATE INDEX blog_post_kategoriya_id ON blog_post (kategoriya_id);\n```",
    "starterCodePy": "import sys\n\nTURLAR = {\n    \"CharField\": \"varchar(200)\",\n    \"TextField\": \"text\",\n    \"IntegerField\": \"integer\",\n    \"BooleanField\": \"bool\",\n    \"DateField\": \"date\",\n}\n\nlines = sys.stdin.read().split(\"\\n\")\njadval = lines[0].strip()\nn = int(lines[1])\n\n# Ustunlarni va indekslarni ikkita alohida ro'yxatga yig'ing.\n# ForeignKey qatorida uchinchi so'z — maqsad jadval nomi.\n# Avval CREATE TABLE ni, keyin indekslarni chiqaring.\n",
    "testCases": [
      {
        "stdin": "blog_post\n3\nsarlavha CharField\nmuallif ForeignKey auth_user\nkategoriya ForeignKey blog_kategoriya null=True\n",
        "expectedStdout": "CREATE TABLE blog_post (\n    id integer PRIMARY KEY AUTOINCREMENT,\n    sarlavha varchar(200) NOT NULL,\n    muallif_id integer NOT NULL REFERENCES \"auth_user\" (\"id\"),\n    kategoriya_id integer NULL REFERENCES \"blog_kategoriya\" (\"id\")\n);\nCREATE INDEX blog_post_muallif_id ON blog_post (muallif_id);\nCREATE INDEX blog_post_kategoriya_id ON blog_post (kategoriya_id);\n",
        "hidden": false,
        "label": "Ikkita ForeignKey"
      },
      {
        "stdin": "shop_buyurtma\n2\nsoni IntegerField\nmijoz ForeignKey shop_mijoz\n",
        "expectedStdout": "CREATE TABLE shop_buyurtma (\n    id integer PRIMARY KEY AUTOINCREMENT,\n    soni integer NOT NULL,\n    mijoz_id integer NOT NULL REFERENCES \"shop_mijoz\" (\"id\")\n);\nCREATE INDEX shop_buyurtma_mijoz_id ON shop_buyurtma (mijoz_id);\n",
        "hidden": false,
        "label": "Bitta ForeignKey"
      },
      {
        "stdin": "blog_teg\n2\nnom CharField\ntavsif TextField null=True\n",
        "expectedStdout": "CREATE TABLE blog_teg (\n    id integer PRIMARY KEY AUTOINCREMENT,\n    nom varchar(200) NOT NULL,\n    tavsif text NULL\n);\n",
        "hidden": true,
        "label": "ForeignKey umuman yo'q"
      },
      {
        "stdin": "forum_javob\n3\nmatn TextField\nsavol ForeignKey forum_savol\nmuallif ForeignKey auth_user null=True\n",
        "expectedStdout": "CREATE TABLE forum_javob (\n    id integer PRIMARY KEY AUTOINCREMENT,\n    matn text NOT NULL,\n    savol_id integer NOT NULL REFERENCES \"forum_savol\" (\"id\"),\n    muallif_id integer NULL REFERENCES \"auth_user\" (\"id\")\n);\nCREATE INDEX forum_javob_savol_id ON forum_javob (savol_id);\nCREATE INDEX forum_javob_muallif_id ON forum_javob (muallif_id);\n",
        "hidden": true,
        "label": "Bog'lanish va NULL birga"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-56",
    "key": "backend-dars-56-easy",
    "title": "filter() — QuerySet qaytaradi",
    "difficulty": "EASY",
    "points": 10,
    "tags": [
      "django",
      "orm",
      "filter",
      "json"
    ],
    "description": "`Mahsulot.objects.filter(nom=\"Olma\")` bitta obyekt emas, QuerySet qaytaradi — unda 0 ta, 1 ta yoki ko'p yozuv bo'lishi mumkin. Shu mantiqni sof Python'da yozamiz.\n\nKirish (stdin):\n- 1-qator — `N`, yozuvlar soni;\n- keyingi `N` qator — har biri bitta JSON obyekt: `{\"id\": 1, \"nom\": \"Olma\", \"narx\": 12000}`. Bu — `Mahsulot` modelining bazadagi qatorlari.\n- oxirgi qator — qidirilayotgan nom.\n\nChiqish:\n- Nomi qidiruv qatoriga AYNAN teng (katta-kichik harf farqlanadi) bo'lgan har bir yozuv uchun bitta qator: `id nom narx` — orasida bittadan bo'sh joy, kirishdagi tartibda.\n- Agar bitta ham yozuv topilmasa, faqat `QuerySet bo'sh` deb chiqaring.\n\nMisol. Kirish:\n\n```\n4\n{\"id\": 1, \"nom\": \"Olma\", \"narx\": 12000}\n{\"id\": 2, \"nom\": \"Anor\", \"narx\": 25000}\n{\"id\": 3, \"nom\": \"Olma\", \"narx\": 15000}\n{\"id\": 4, \"nom\": \"Uzum\", \"narx\": 30000}\nOlma\n```\n\nChiqish:\n\n```\n1 Olma 12000\n3 Olma 15000\n```",
    "starterCodePy": "import sys\nimport json\n\nlines = sys.stdin.read().split(\"\\n\")\nn = int(lines[0])\nyozuvlar = [json.loads(lines[1 + i]) for i in range(n)]\nqidiruv = lines[1 + n].strip()\n\n# filter(nom=qidiruv) kabi ishlang: mos yozuvlarni ro'yxatga yig'ing.\n# Ro'yxat bo'sh bo'lsa \"QuerySet bo'sh\" chiqaring.\n",
    "testCases": [
      {
        "stdin": "4\n{\"id\": 1, \"nom\": \"Olma\", \"narx\": 12000}\n{\"id\": 2, \"nom\": \"Anor\", \"narx\": 25000}\n{\"id\": 3, \"nom\": \"Olma\", \"narx\": 15000}\n{\"id\": 4, \"nom\": \"Uzum\", \"narx\": 30000}\nOlma\n",
        "expectedStdout": "1 Olma 12000\n3 Olma 15000\n",
        "hidden": false,
        "label": "Ikkita mos yozuv"
      },
      {
        "stdin": "4\n{\"id\": 1, \"nom\": \"Olma\", \"narx\": 12000}\n{\"id\": 2, \"nom\": \"Anor\", \"narx\": 25000}\n{\"id\": 3, \"nom\": \"Olma\", \"narx\": 15000}\n{\"id\": 4, \"nom\": \"Uzum\", \"narx\": 30000}\nUzum\n",
        "expectedStdout": "4 Uzum 30000\n",
        "hidden": false,
        "label": "Bitta mos yozuv"
      },
      {
        "stdin": "4\n{\"id\": 1, \"nom\": \"Olma\", \"narx\": 12000}\n{\"id\": 2, \"nom\": \"Anor\", \"narx\": 25000}\n{\"id\": 3, \"nom\": \"Olma\", \"narx\": 15000}\n{\"id\": 4, \"nom\": \"Uzum\", \"narx\": 30000}\nBehi\n",
        "expectedStdout": "QuerySet bo'sh\n",
        "hidden": true,
        "label": "Hech narsa topilmadi"
      },
      {
        "stdin": "4\n{\"id\": 1, \"nom\": \"Olma\", \"narx\": 12000}\n{\"id\": 2, \"nom\": \"Anor\", \"narx\": 25000}\n{\"id\": 3, \"nom\": \"Olma\", \"narx\": 15000}\n{\"id\": 4, \"nom\": \"Uzum\", \"narx\": 30000}\nolma\n",
        "expectedStdout": "QuerySet bo'sh\n",
        "hidden": true,
        "label": "Katta-kichik harf farqlanadi"
      },
      {
        "stdin": "1\n{\"id\": 9, \"nom\": \"Shaftoli\", \"narx\": 40000}\nShaftoli\n",
        "expectedStdout": "9 Shaftoli 40000\n",
        "hidden": true,
        "label": "Bitta yozuvli baza"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-56",
    "key": "backend-dars-56-medium",
    "title": "Lookup va exclude",
    "difficulty": "MEDIUM",
    "points": 20,
    "tags": [
      "django",
      "orm",
      "lookup",
      "exclude"
    ],
    "description": "Django lookup'lari — `nom__icontains`, `narx__gt`, `narx__lt`. Va `exclude()` — `filter()`ning teskarisi: shartga MOS KELMAGAN yozuvlarni qoldiradi.\n\nKirish (stdin):\n- 1-qator — `N`, yozuvlar soni;\n- keyingi `N` qator — har biri bitta JSON obyekt: `{\"id\": 1, \"nom\": \"Olma\", \"narx\": 12000}`. Bu — `Mahsulot` modelining bazadagi qatorlari.\n- oxirgi qator — so'rov: `filter <ifoda>` yoki `exclude <ifoda>`.\n\n`<ifoda>` ikki ko'rinishda bo'ladi:\n- `maydon=qiymat` — aniq moslik (`exact`), matn sifatida solishtiriladi;\n- `maydon__lookup=qiymat`, bu yerda lookup:\n  - `icontains` — qiymat maydon ichida uchraydi, katta-kichik harf farqlanmaydi;\n  - `gt` — maydon (son) qiymatdan katta;\n  - `lt` — maydon (son) qiymatdan kichik.\n\nChiqish:\n- Shart bajarilgan (`filter` uchun) yoki bajarilmagan (`exclude` uchun) har bir yozuvning faqat `nom` maydoni, kirish tartibida, har biri alohida qatorda.\n- Natija bo'sh bo'lsa — `QuerySet bo'sh`.\n\nMisol. Kirish:\n\n```\n4\n{\"id\": 1, \"nom\": \"Olma\", \"narx\": 12000}\n{\"id\": 2, \"nom\": \"Anor\", \"narx\": 25000}\n{\"id\": 3, \"nom\": \"Olma\", \"narx\": 15000}\n{\"id\": 4, \"nom\": \"Uzum\", \"narx\": 30000}\nfilter nom__icontains=ol\n```\n\nChiqish:\n\n```\nOlma\nOlma\n```",
    "starterCodePy": "import sys\nimport json\n\nlines = sys.stdin.read().split(\"\\n\")\nn = int(lines[0])\nyozuvlar = [json.loads(lines[1 + i]) for i in range(n)]\nsorov = lines[1 + n].strip()\n\n# So'rovni bo'lib oling: amal (filter/exclude), maydon, lookup, qiymat.\n# Lookup ko'rsatilmagan bo'lsa — exact.\n# exclude uchun shart natijasini teskarisiga aylantiring.\n",
    "testCases": [
      {
        "stdin": "4\n{\"id\": 1, \"nom\": \"Olma\", \"narx\": 12000}\n{\"id\": 2, \"nom\": \"Anor\", \"narx\": 25000}\n{\"id\": 3, \"nom\": \"Olma\", \"narx\": 15000}\n{\"id\": 4, \"nom\": \"Uzum\", \"narx\": 30000}\nfilter nom__icontains=ol\n",
        "expectedStdout": "Olma\nOlma\n",
        "hidden": false,
        "label": "icontains bilan qidiruv"
      },
      {
        "stdin": "4\n{\"id\": 1, \"nom\": \"Olma\", \"narx\": 12000}\n{\"id\": 2, \"nom\": \"Anor\", \"narx\": 25000}\n{\"id\": 3, \"nom\": \"Olma\", \"narx\": 15000}\n{\"id\": 4, \"nom\": \"Uzum\", \"narx\": 30000}\nexclude nom__icontains=ol\n",
        "expectedStdout": "Anor\nUzum\n",
        "hidden": false,
        "label": "exclude bilan kesish"
      },
      {
        "stdin": "4\n{\"id\": 1, \"nom\": \"Olma\", \"narx\": 12000}\n{\"id\": 2, \"nom\": \"Anor\", \"narx\": 25000}\n{\"id\": 3, \"nom\": \"Olma\", \"narx\": 15000}\n{\"id\": 4, \"nom\": \"Uzum\", \"narx\": 30000}\nfilter narx__lt=13000\n",
        "expectedStdout": "Olma\n",
        "hidden": true,
        "label": "lt lookup"
      },
      {
        "stdin": "4\n{\"id\": 1, \"nom\": \"Olma\", \"narx\": 12000}\n{\"id\": 2, \"nom\": \"Anor\", \"narx\": 25000}\n{\"id\": 3, \"nom\": \"Olma\", \"narx\": 15000}\n{\"id\": 4, \"nom\": \"Uzum\", \"narx\": 30000}\nfilter nom=Anor\n",
        "expectedStdout": "Anor\n",
        "hidden": true,
        "label": "Lookupsiz aniq moslik"
      },
      {
        "stdin": "4\n{\"id\": 1, \"nom\": \"Olma\", \"narx\": 12000}\n{\"id\": 2, \"nom\": \"Anor\", \"narx\": 25000}\n{\"id\": 3, \"nom\": \"Olma\", \"narx\": 15000}\n{\"id\": 4, \"nom\": \"Uzum\", \"narx\": 30000}\nfilter nom__icontains=zzz\n",
        "expectedStdout": "QuerySet bo'sh\n",
        "hidden": true,
        "label": "Natija bo'sh"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-56",
    "key": "backend-dars-56-hard",
    "title": "get() — aynan bitta bo'lishi shart",
    "difficulty": "HARD",
    "points": 35,
    "tags": [
      "django",
      "orm",
      "get",
      "xatolik"
    ],
    "description": "`filter()` QuerySet qaytaradi, `get()` esa AYNAN bitta obyekt qaytaradi. Topmasa `DoesNotExist`, bittadan ko'p topsa `MultipleObjectsReturned` xatosini beradi. Shuning uchun `get()` ni har doim noyob maydon bilan chaqirish kerak.\n\nKirish (stdin):\n- 1-qator — `N`, yozuvlar soni;\n- keyingi `N` qator — har biri bitta JSON obyekt: `{\"id\": 1, \"nom\": \"Olma\", \"narx\": 12000}`. Bu — `Mahsulot` modelining bazadagi qatorlari.\n- keyingi qator — `M`, so'rovlar soni;\n- keyingi `M` qator — har biri `maydon=qiymat` ko'rinishidagi `get()` so'rovi. Solishtirish matn sifatida, aniq moslik bo'yicha bajariladi.\n\nHar bir so'rov uchun bitta qator chiqaring, so'rovlar tartibida:\n- aynan bitta yozuv topilsa — `Topildi: <nom>`;\n- bitta ham topilmasa — `DoesNotExist`;\n- bittadan ko'p topilsa — `MultipleObjectsReturned`.\n\nMisol. Kirish:\n\n```\n4\n{\"id\": 1, \"nom\": \"Olma\", \"narx\": 12000}\n{\"id\": 2, \"nom\": \"Anor\", \"narx\": 25000}\n{\"id\": 3, \"nom\": \"Olma\", \"narx\": 15000}\n{\"id\": 4, \"nom\": \"Uzum\", \"narx\": 30000}\n3\nnom=Olma\nid=2\nnom=Behi\n```\n\nChiqish:\n\n```\nMultipleObjectsReturned\nTopildi: Anor\nDoesNotExist\n```",
    "starterCodePy": "import sys\nimport json\n\nlines = sys.stdin.read().split(\"\\n\")\nn = int(lines[0])\nyozuvlar = [json.loads(lines[1 + i]) for i in range(n)]\nm = int(lines[1 + n])\n\n# Har bir so'rov uchun mos yozuvlarni yig'ing va ULARNING SONIGA qarab\n# uchta natijadan birini chiqaring. Solishtirishda str() ishlating.\n",
    "testCases": [
      {
        "stdin": "4\n{\"id\": 1, \"nom\": \"Olma\", \"narx\": 12000}\n{\"id\": 2, \"nom\": \"Anor\", \"narx\": 25000}\n{\"id\": 3, \"nom\": \"Olma\", \"narx\": 15000}\n{\"id\": 4, \"nom\": \"Uzum\", \"narx\": 30000}\n3\nnom=Olma\nid=2\nnom=Behi\n",
        "expectedStdout": "MultipleObjectsReturned\nTopildi: Anor\nDoesNotExist\n",
        "hidden": false,
        "label": "Uch xil natija"
      },
      {
        "stdin": "4\n{\"id\": 1, \"nom\": \"Olma\", \"narx\": 12000}\n{\"id\": 2, \"nom\": \"Anor\", \"narx\": 25000}\n{\"id\": 3, \"nom\": \"Olma\", \"narx\": 15000}\n{\"id\": 4, \"nom\": \"Uzum\", \"narx\": 30000}\n2\nid=4\nnarx=25000\n",
        "expectedStdout": "Topildi: Uzum\nTopildi: Anor\n",
        "hidden": false,
        "label": "id va narx bo'yicha get"
      },
      {
        "stdin": "4\n{\"id\": 1, \"nom\": \"Olma\", \"narx\": 12000}\n{\"id\": 2, \"nom\": \"Anor\", \"narx\": 25000}\n{\"id\": 3, \"nom\": \"Olma\", \"narx\": 15000}\n{\"id\": 4, \"nom\": \"Uzum\", \"narx\": 30000}\n1\nnarx=99999\n",
        "expectedStdout": "DoesNotExist\n",
        "hidden": true,
        "label": "Umuman topilmadi"
      },
      {
        "stdin": "4\n{\"id\": 1, \"nom\": \"Olma\", \"narx\": 12000}\n{\"id\": 2, \"nom\": \"Anor\", \"narx\": 25000}\n{\"id\": 3, \"nom\": \"Olma\", \"narx\": 15000}\n{\"id\": 4, \"nom\": \"Uzum\", \"narx\": 30000}\n4\nnom=Uzum\nnom=Olma\nid=1\nid=99\n",
        "expectedStdout": "Topildi: Uzum\nMultipleObjectsReturned\nTopildi: Olma\nDoesNotExist\n",
        "hidden": true,
        "label": "To'rtta ketma-ket so'rov"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-58",
    "key": "backend-dars-58-easy",
    "title": "{{ }} — shablonga qiymat qo'yish",
    "difficulty": "EASY",
    "points": 10,
    "tags": [
      "django",
      "template",
      "render",
      "json"
    ],
    "description": "`render(request, \"post.html\", context)` shablondagi `{{ nom }}` yozuvlarini context'dagi qiymatlar bilan almashtiradi. Shu almashtirishni o'zingiz yozing.\n\nKirish (stdin):\n- 1-qator — context: bitta JSON obyekt, masalan `{\"ism\": \"Ali\", \"shahar\": \"Toshkent\"}`;\n- 2-qator — `N`, shablon qatorlari soni;\n- keyingi `N` qator — shablonning o'zi.\n\nQoidalar:\n- O'zgaruvchi tegi har doim `{{ nom }}` ko'rinishida yoziladi — ikkita gulqavs, ichida bittadan bo'sh joy. Nom faqat harf, raqam va pastki chiziqdan iborat.\n- Bitta qatorda bir nechta teg bo'lishi mumkin.\n- Context'da bunday kalit bo'lmasa, teg BO'SH matn bilan almashtiriladi (Django ham xato bermaydi).\n- Sonlar matn sifatida qo'yiladi (`12000`).\n- Teg bo'lmagan matn o'zgarmaydi, qatorlar soni ham o'zgarmaydi.\n\nMisol. Kirish:\n\n```\n{\"ism\": \"Ali\", \"shahar\": \"Toshkent\"}\n3\n<h1>Salom, {{ ism }}!</h1>\n<p>{{ shahar }} shahridan</p>\n<p>{{ yosh }}</p>\n```\n\nChiqish:\n\n```\n<h1>Salom, Ali!</h1>\n<p>Toshkent shahridan</p>\n<p></p>\n```",
    "starterCodePy": "import sys\nimport json\nimport re\n\nlines = sys.stdin.read().split(\"\\n\")\ncontext = json.loads(lines[0])\nn = int(lines[1])\n\n# re.sub() va {{ nom }} naqshi yordamida har bir qatorni almashtiring.\n# Kalit topilmasa — bo'sh matn qo'ying.\n",
    "testCases": [
      {
        "stdin": "{\"ism\": \"Ali\", \"shahar\": \"Toshkent\"}\n3\n<h1>Salom, {{ ism }}!</h1>\n<p>{{ shahar }} shahridan</p>\n<p>{{ yosh }}</p>\n",
        "expectedStdout": "<h1>Salom, Ali!</h1>\n<p>Toshkent shahridan</p>\n<p></p>\n",
        "hidden": false,
        "label": "Uch qatorli shablon"
      },
      {
        "stdin": "{\"nom\": \"Olma\", \"narx\": 12000}\n2\n<h2>{{ nom }}</h2>\n<span>{{ narx }} so'm</span>\n",
        "expectedStdout": "<h2>Olma</h2>\n<span>12000 so'm</span>\n",
        "hidden": false,
        "label": "Son qiymati chiqdi"
      },
      {
        "stdin": "{\"a\": \"bir\", \"b\": \"ikki\"}\n1\n{{ a }} va {{ b }}\n",
        "expectedStdout": "bir va ikki\n",
        "hidden": true,
        "label": "Bitta qatorda ikkita o'zgaruvchi"
      },
      {
        "stdin": "{\"ism\": \"Vali\"}\n3\n<div>\n{{ yoq }}{{ ism }}\n</div>\n",
        "expectedStdout": "<div>\nVali\n</div>\n",
        "hidden": true,
        "label": "Noma'lum o'zgaruvchi bo'sh qoladi"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-58",
    "key": "backend-dars-58-medium",
    "title": "{% for %} — ro'yxatni chiqarish",
    "difficulty": "MEDIUM",
    "points": 20,
    "tags": [
      "django",
      "template",
      "sikl"
    ],
    "description": "Shablon tili ichida mantiq ham bor: `{% for %} ... {% endfor %}`. Endi shablon dvigatelingizga sikl qo'shing.\n\nKirish (stdin):\n- 1-qator — context: JSON obyekt, ichida oddiy qiymatlar ham, ro'yxatlar ham bo'lishi mumkin;\n- 2-qator — `N`, shablon qatorlari soni;\n- keyingi `N` qator — shablon.\n\nQoidalar:\n- `{{ nom }}` avvalgidek almashtiriladi; kalit topilmasa — bo'sh matn.\n- `{% for x in ruyxat %}` tegi ALOHIDA qatorda turadi, uning yopilishi `{% endfor %}` ham alohida qatorda. Ular ichma-ich joylashmaydi (bitta daraja).\n- Sikl tanasidagi qatorlar ro'yxatning har bir elementi uchun qaytariladi. Tana ichida `x` element qiymatini, context'dagi boshqa o'zgaruvchilar esa o'z qiymatini beradi.\n- Ro'yxat bo'sh bo'lsa, tana umuman chiqarilmaydi.\n- `{% for %}` va `{% endfor %}` qatorlarining o'zi chiqishda BO'LMAYDI. Tanadagi bo'shliqlar (masalan qator boshidagi ikki probel) saqlanadi.\n\nMisol. Kirish:\n\n```\n{\"sarlavha\": \"Postlar\", \"postlar\": [\"Birinchi\", \"Ikkinchi\", \"Uchinchi\"]}\n6\n<h1>{{ sarlavha }}</h1>\n<ul>\n{% for p in postlar %}\n  <li>{{ p }}</li>\n{% endfor %}\n</ul>\n```\n\nChiqish:\n\n```\n<h1>Postlar</h1>\n<ul>\n  <li>Birinchi</li>\n  <li>Ikkinchi</li>\n  <li>Uchinchi</li>\n</ul>\n```",
    "starterCodePy": "import sys\nimport json\nimport re\n\nlines = sys.stdin.read().split(\"\\n\")\ncontext = json.loads(lines[0])\nn = int(lines[1])\nshablon = lines[2:2 + n]\n\n# while sikli bilan qatorlarni ko'rib chiqing.\n# {% for %} uchrasa — {% endfor %} gacha bo'lgan tanani yig'ib oling va\n# har bir element uchun nusxa context bilan chiqaring.\n",
    "testCases": [
      {
        "stdin": "{\"sarlavha\": \"Postlar\", \"postlar\": [\"Birinchi\", \"Ikkinchi\", \"Uchinchi\"]}\n6\n<h1>{{ sarlavha }}</h1>\n<ul>\n{% for p in postlar %}\n  <li>{{ p }}</li>\n{% endfor %}\n</ul>\n",
        "expectedStdout": "<h1>Postlar</h1>\n<ul>\n  <li>Birinchi</li>\n  <li>Ikkinchi</li>\n  <li>Uchinchi</li>\n</ul>\n",
        "hidden": false,
        "label": "Uch elementli ro'yxat"
      },
      {
        "stdin": "{\"sarlavha\": \"Narxlar\", \"narxlar\": [100, 250]}\n4\n{{ sarlavha }}:\n{% for n in narxlar %}\n- {{ n }}\n{% endfor %}\n",
        "expectedStdout": "Narxlar:\n- 100\n- 250\n",
        "hidden": false,
        "label": "Sonlar ustidan takrorlash"
      },
      {
        "stdin": "{\"postlar\": []}\n5\n<ul>\n{% for p in postlar %}\n  <li>{{ p }}</li>\n{% endfor %}\n</ul>\n",
        "expectedStdout": "<ul>\n</ul>\n",
        "hidden": true,
        "label": "Bo'sh ro'yxat"
      },
      {
        "stdin": "{\"ism\": \"Ali\", \"raqamlar\": [1, 2]}\n5\n{% for r in raqamlar %}\n  {{ ism }} - {{ r }}\n  ---\n{% endfor %}\nTugadi\n",
        "expectedStdout": "  Ali - 1\n  ---\n  Ali - 2\n  ---\nTugadi\n",
        "hidden": true,
        "label": "Ikki qatorli tana va tashqi o'zgaruvchi"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-58",
    "key": "backend-dars-58-hard",
    "title": "{% extends %} va {% block %}",
    "difficulty": "HARD",
    "points": 35,
    "tags": [
      "django",
      "template",
      "meros",
      "dry"
    ],
    "description": "`base.html` + `{% extends %}` + `{% block %}` — HTML uchun DRY. Bola shablon faqat kerakli bloklarni almashtiradi, qolgan hamma narsa asosdan olinadi.\n\nKirish (stdin):\n- 1-qator — `B`, asos (base) shablon qatorlari soni;\n- keyingi `B` qator — asos shablon;\n- keyingi qator — `C`, bola shablon qatorlari soni;\n- keyingi `C` qator — bola shablon (birinchi qatori `{% extends \"base.html\" %}`).\n\nQoidalar:\n- `{% block nom %}` va `{% endblock %}` teglari har doim alohida qatorda turadi va ichma-ich joylashmaydi.\n- Chiqish — asos shablon, faqat har bir blok o'rniga: bola shablonda shu nomli blok bo'lsa — bolaning tanasi, bo'lmasa — asosdagi tana (standart qiymat).\n- Blok tanasidagi qatorlar soni bolada boshqacha bo'lishi mumkin (0 ta ham bo'lishi mumkin).\n- `{% block %}`, `{% endblock %}` va `{% extends %}` qatorlarining o'zi chiqishga TUSHMAYDI.\n- Bola shablonda bloklardan tashqarida turgan qatorlar e'tiborsiz qoldiriladi — Django ham shunday qiladi.\n\nMisol. Kirish:\n\n```\n10\n<html>\n{% block sarlavha %}\n<title>Sayt</title>\n{% endblock %}\n<body>\n{% block kontent %}\n<p>Bo'sh</p>\n{% endblock %}\n</body>\n</html>\n5\n{% extends \"base.html\" %}\n{% block kontent %}\n<h1>Blog</h1>\n<p>Xush kelibsiz</p>\n{% endblock %}\n```\n\nChiqish:\n\n```\n<html>\n<title>Sayt</title>\n<body>\n<h1>Blog</h1>\n<p>Xush kelibsiz</p>\n</body>\n</html>\n```",
    "starterCodePy": "import sys\nimport re\n\nlines = sys.stdin.read().split(\"\\n\")\nb = int(lines[0])\nasos = lines[1:1 + b]\nc = int(lines[1 + b])\nbola = lines[2 + b:2 + b + c]\n\n# 1) Bola shablondan {nom: tana} lug'atini yig'ing.\n# 2) Asosni qator-qator o'qing: blok uchrasa, bolada shu nom bormi —\n#    bor bo'lsa bolaning tanasini, yo'q bo'lsa asosdagi tanani chiqaring.\n",
    "testCases": [
      {
        "stdin": "10\n<html>\n{% block sarlavha %}\n<title>Sayt</title>\n{% endblock %}\n<body>\n{% block kontent %}\n<p>Bo'sh</p>\n{% endblock %}\n</body>\n</html>\n5\n{% extends \"base.html\" %}\n{% block kontent %}\n<h1>Blog</h1>\n<p>Xush kelibsiz</p>\n{% endblock %}\n",
        "expectedStdout": "<html>\n<title>Sayt</title>\n<body>\n<h1>Blog</h1>\n<p>Xush kelibsiz</p>\n</body>\n</html>\n",
        "hidden": false,
        "label": "Bitta blok almashtirildi"
      },
      {
        "stdin": "10\n<html>\n{% block sarlavha %}\n<title>Sayt</title>\n{% endblock %}\n<body>\n{% block kontent %}\n<p>Bo'sh</p>\n{% endblock %}\n</body>\n</html>\n7\n{% extends \"base.html\" %}\n{% block sarlavha %}\n<title>Blog</title>\n{% endblock %}\n{% block kontent %}\n<h1>Salom</h1>\n{% endblock %}\n",
        "expectedStdout": "<html>\n<title>Blog</title>\n<body>\n<h1>Salom</h1>\n</body>\n</html>\n",
        "hidden": false,
        "label": "Ikkala blok almashtirildi"
      },
      {
        "stdin": "10\n<html>\n{% block sarlavha %}\n<title>Sayt</title>\n{% endblock %}\n<body>\n{% block kontent %}\n<p>Bo'sh</p>\n{% endblock %}\n</body>\n</html>\n1\n{% extends \"base.html\" %}\n",
        "expectedStdout": "<html>\n<title>Sayt</title>\n<body>\n<p>Bo'sh</p>\n</body>\n</html>\n",
        "hidden": true,
        "label": "Hech qanday blok berilmadi"
      },
      {
        "stdin": "5\n<div>\n{% block ichki %}\nasl\n{% endblock %}\n</div>\n5\n{% extends \"base.html\" %}\n{% block ichki %}\nyangi 1\nyangi 2\n{% endblock %}\n",
        "expectedStdout": "<div>\nyangi 1\nyangi 2\n</div>\n",
        "hidden": true,
        "label": "Blok ichida qatorlar soni o'zgardi"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-59",
    "key": "backend-dars-59-easy",
    "title": "Majburiy maydonlar tekshiruvi",
    "difficulty": "EASY",
    "points": 10,
    "tags": [
      "django",
      "forma",
      "validatsiya"
    ],
    "description": "`form.is_valid()` — foydalanuvchiga ishonmaslikning birinchi qadami. Eng oddiy tekshiruvdan boshlaymiz: majburiy maydon to'ldirilganmi?\n\nKirish (stdin):\n- 1-qator — majburiy maydonlar nomlari JSON ro'yxati, masalan `[\"nom\", \"email\", \"matn\"]`;\n- 2-qator — foydalanuvchi yuborgan ma'lumot, JSON obyekt.\n\nQoidalar:\n- Maydon xato hisoblanadi, agar u ma'lumotda umuman bo'lmasa, yoki qiymati bo'sh matn bo'lsa, yoki faqat bo'shliqlardan iborat bo'lsa.\n- Ma'lumotdagi ortiqcha, ro'yxatda yo'q maydonlar e'tiborsiz qoldiriladi.\n\nChiqish:\n- Xato bo'lmasa — bitta qator: `is_valid: True`.\n- Xato bo'lsa — birinchi qator `is_valid: False`, keyin har bir xato maydon uchun `<maydon>: Bu maydon majburiy.` qatori. Tartib — majburiy maydonlar ro'yxatidagi tartib.\n\nMisol. Kirish:\n\n```\n[\"nom\", \"email\", \"matn\"]\n{\"nom\": \"Ali\", \"email\": \"\", \"matn\": \"Salom\"}\n```\n\nChiqish:\n\n```\nis_valid: False\nemail: Bu maydon majburiy.\n```",
    "starterCodePy": "import sys\nimport json\n\nlines = sys.stdin.read().split(\"\\n\")\nmajburiy = json.loads(lines[0])\ndata = json.loads(lines[1])\n\n# Har bir majburiy maydonni tekshiring: yo'q, bo'sh yoki faqat probel bo'lsa — xato.\n# str(qiymat).strip() == \"\" shartidan foydalaning.\n",
    "testCases": [
      {
        "stdin": "[\"nom\", \"email\", \"matn\"]\n{\"nom\": \"Ali\", \"email\": \"\", \"matn\": \"Salom\"}\n",
        "expectedStdout": "is_valid: False\nemail: Bu maydon majburiy.\n",
        "hidden": false,
        "label": "Bitta maydon bo'sh"
      },
      {
        "stdin": "[\"nom\", \"email\"]\n{\"nom\": \"Ali\", \"email\": \"ali@mail.uz\"}\n",
        "expectedStdout": "is_valid: True\n",
        "hidden": false,
        "label": "Hammasi to'ldirilgan"
      },
      {
        "stdin": "[\"nom\", \"email\", \"matn\"]\n{\"nom\": \"   \", \"matn\": \"Salom\"}\n",
        "expectedStdout": "is_valid: False\nnom: Bu maydon majburiy.\nemail: Bu maydon majburiy.\n",
        "hidden": true,
        "label": "Probel va yo'q maydon"
      },
      {
        "stdin": "[\"sarlavha\"]\n{\"sarlavha\": \"Birinchi post\", \"ortiqcha\": \"e'tiborsiz\"}\n",
        "expectedStdout": "is_valid: True\n",
        "hidden": true,
        "label": "Ortiqcha maydon e'tiborsiz qoldiriladi"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-59",
    "key": "backend-dars-59-medium",
    "title": "Maydon turi va chegaralar",
    "difficulty": "MEDIUM",
    "points": 20,
    "tags": [
      "django",
      "forma",
      "validatsiya",
      "tur"
    ],
    "description": "Haqiqiy formada har maydonning o'z qoidasi bor: matn uzunligi, sonning chegarasi, email ko'rinishi. Kichik validator yozamiz.\n\nKirish (stdin):\n- 1-qator — `N`, maydonlar soni;\n- keyingi `N` qator — maydon ta'rifi: `nom tur [parametrlar...]`, bo'sh joy bilan ajratilgan. Tur: `str`, `int` yoki `email`. Parametrlar: `max=<son>`, `min=<son>`, `optional`;\n- oxirgi qator — foydalanuvchi ma'lumoti, JSON obyekt.\n\nTekshirish tartibi (har bir maydon uchun FAQAT BIRINCHI xato yoziladi):\n1. Maydon yo'q, bo'sh yoki faqat probeldan iborat bo'lsa: `optional` bo'lmasa — `Bu maydon majburiy.`, `optional` bo'lsa — bu maydon umuman tekshirilmaydi.\n2. `int` tur: qiymat butun son bo'lmasa (JSON'da son emas va `\"25\"` kabi butun sonli matn ham emas) — `Butun son kiriting.`\n3. `int` tur: son `min` dan kichik yoki `max` dan katta bo'lsa — `Qiymat <min> va <max> orasida bo'lishi kerak.`\n4. `email` tur: qiymatda `@` belgisi bo'lmasa — `To'g'ri email kiriting.`\n5. `str` tur: uzunligi `max` dan katta bo'lsa — `Bu maydon <max> belgidan oshmasligi kerak.`\n\nChiqish 59-darsning oldingi topshirig'idagidek: xato bo'lmasa `is_valid: True`; aks holda `is_valid: False` va har bir xato uchun `<maydon>: <xabar>` qatori, maydonlar ta'rif tartibida.\n\nMisol. Kirish:\n\n```\n3\nnom str max=50\nyosh int min=1 max=120\nemail email\n{\"nom\": \"Ali\", \"yosh\": \"200\", \"email\": \"ali.example.com\"}\n```\n\nChiqish:\n\n```\nis_valid: False\nyosh: Qiymat 1 va 120 orasida bo'lishi kerak.\nemail: To'g'ri email kiriting.\n```",
    "starterCodePy": "import sys\nimport json\nimport re\n\nlines = sys.stdin.read().split(\"\\n\")\nn = int(lines[0])\n# Har bir ta'rif qatorini split() qilib, nom / tur / parametrlarni ajrating.\n# max=50 kabi parametrlarni \"=\" bo'yicha bo'lib, son sifatida saqlang.\ndata = json.loads(lines[1 + n])\n\n# Har bir maydon uchun birinchi xatoni topib, ro'yxatga qo'shing.\n",
    "testCases": [
      {
        "stdin": "3\nnom str max=50\nyosh int min=1 max=120\nemail email\n{\"nom\": \"Ali\", \"yosh\": \"200\", \"email\": \"ali.example.com\"}\n",
        "expectedStdout": "is_valid: False\nyosh: Qiymat 1 va 120 orasida bo'lishi kerak.\nemail: To'g'ri email kiriting.\n",
        "hidden": false,
        "label": "Ikkita xato"
      },
      {
        "stdin": "3\nnom str max=50\nyosh int min=1 max=120\nemail email\n{\"nom\": \"Vali\", \"yosh\": 25, \"email\": \"vali@mail.uz\"}\n",
        "expectedStdout": "is_valid: True\n",
        "hidden": false,
        "label": "Forma to'g'ri to'ldirilgan"
      },
      {
        "stdin": "3\nnom str max=5\nyosh int min=18 max=99 optional\nizoh str max=100 optional\n{\"nom\": \"Abdurahmon\", \"izoh\": \"salom\"}\n",
        "expectedStdout": "is_valid: False\nnom: Bu maydon 5 belgidan oshmasligi kerak.\n",
        "hidden": true,
        "label": "Uzun matn va tashlab ketilgan maydon"
      },
      {
        "stdin": "2\nyosh int min=1 max=120\nemail email\n{\"yosh\": \"yigirma\", \"email\": \"\"}\n",
        "expectedStdout": "is_valid: False\nyosh: Butun son kiriting.\nemail: Bu maydon majburiy.\n",
        "hidden": true,
        "label": "Son o'rniga matn"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-59",
    "key": "backend-dars-59-hard",
    "title": "clean() — maydonlararo tekshiruv",
    "difficulty": "HARD",
    "points": 35,
    "tags": [
      "django",
      "forma",
      "clean",
      "validatsiya"
    ],
    "description": "Ba'zi qoidalar bitta maydonga tegishli emas — masalan «ikkita parol bir xilmi?». Django buni `clean()` metodida tekshiradi va xatoni `__all__` (non-field) xatolari ichiga qo'yadi. Muhim nozik jihat: agar maydonning O'ZIDA xato bo'lsa, u `cleaned_data` ga tushmaydi va `clean()` uni umuman ko'rmaydi.\n\nKirish (stdin): bitta qator — foydalanuvchi yuborgan JSON obyekt. Forma maydonlari doim shular: `parol`, `parol2`, `yosh` (shu tartibda).\n\nTekshiruv bosqichlari:\n1. Uchala maydon majburiy. Yo'q, bo'sh yoki faqat probel bo'lsa — `Bu maydon majburiy.` Bunday maydon `cleaned_data` ga tushmaydi.\n2. Maydon xatolari (faqat 1-bosqichdan o'tganlar uchun, har maydonga bittadan):\n   - `parol` uzunligi 8 dan kichik bo'lsa — `Parol kamida 8 ta belgidan iborat bo'lsin.`\n   - `yosh` butun son bo'lmasa — `Butun son kiriting.`\n   - `yosh` butun son bo'lib, 18 dan kichik bo'lsa — `18 yoshdan kichiklar ro'yxatdan o'ta olmaydi.`\n   Xatoga uchragan maydon ham `cleaned_data` dan chiqarib tashlanadi.\n   Eslatma: `yosh` JSON'da son bo'lib ham, matn bo'lib ham kelishi mumkin. Faqat raqamlardan iborat matn (masalan `\"17\"`, oldida ixtiyoriy `-` bilan) HAM butun son hisoblanadi — u songa aylantirilib, 18 bilan solishtiriladi. `\"yigirma\"` yoki `\"12.5\"` kabi matn esa butun son emas.\n3. `clean()`: agar `parol` HAM, `parol2` HAM `cleaned_data` da bo'lsa va ular teng bo'lmasa — `__all__` xatosi: `Parollar mos kelmadi.` Ulardan biri yuqoridagi bosqichlarda yiqilgan bo'lsa, bu tekshiruv umuman bajarilmaydi.\n\nChiqish:\n- Xato bo'lmasa — `is_valid: True`.\n- Aks holda `is_valid: False`, keyin maydon xatolari `parol`, `parol2`, `yosh` tartibida `<maydon>: <xabar>` ko'rinishida, ulardan keyin `__all__: <xabar>` qatori (agar bo'lsa).\n\nMisol. Kirish:\n\n```\n{\"parol\": \"maxfiy123\", \"parol2\": \"maxfiy124\", \"yosh\": 20}\n```\n\nChiqish:\n\n```\nis_valid: False\n__all__: Parollar mos kelmadi.\n```",
    "starterCodePy": "import sys\nimport json\nimport re\n\ndata = json.loads(sys.stdin.read().strip())\n\n# cleaned_data lug'atini yuriting: tekshiruvdan o'tgan maydonlarnigina qo'shing.\n# 1) majburiylik, 2) maydon qoidalari, 3) clean() — parollarni solishtirish.\n",
    "testCases": [
      {
        "stdin": "{\"parol\": \"maxfiy123\", \"parol2\": \"maxfiy124\", \"yosh\": 20}\n",
        "expectedStdout": "is_valid: False\n__all__: Parollar mos kelmadi.\n",
        "hidden": false,
        "label": "Parollar tekshiruvi"
      },
      {
        "stdin": "{\"parol\": \"maxfiy123\", \"parol2\": \"maxfiy123\", \"yosh\": 20}\n",
        "expectedStdout": "is_valid: True\n",
        "hidden": false,
        "label": "Forma to'liq to'g'ri"
      },
      {
        "stdin": "{\"parol\": \"qisqa\", \"parol2\": \"boshqa\", \"yosh\": \"17\"}\n",
        "expectedStdout": "is_valid: False\nparol: Parol kamida 8 ta belgidan iborat bo'lsin.\nyosh: 18 yoshdan kichiklar ro'yxatdan o'ta olmaydi.\n",
        "hidden": true,
        "label": "Maydon xatosi bor paytda clean() ishlamaydi"
      },
      {
        "stdin": "{\"parol2\": \"maxfiy123\", \"yosh\": \"yigirma\"}\n",
        "expectedStdout": "is_valid: False\nparol: Bu maydon majburiy.\nyosh: Butun son kiriting.\n",
        "hidden": true,
        "label": "Yo'q maydon va noto'g'ri tur"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-61",
    "key": "backend-dars-61-easy",
    "title": "Serializer — obyektdan JSON",
    "difficulty": "EASY",
    "points": 10,
    "tags": [
      "drf",
      "serializer",
      "json"
    ],
    "description": "DRF'da `Serializer(obyekt).data` model obyektini JSON'ga aylantiradi va FAQAT `Meta.fields` da sanalgan maydonlarni chiqaradi — qolganlari (masalan ichki izohlar) tashqariga chiqmaydi. Shu tanlashni o'zingiz yozing.\n\nKirish (stdin):\n- 1-qator — obyekt: bitta JSON obyekt (model instansi);\n- 2-qator — `Meta.fields`: bo'sh joy bilan ajratilgan maydon nomlari.\n\nChiqish: bitta qator — faqat sanalgan maydonlardan iborat JSON obyekt, maydonlar `fields` dagi TARTIBDA. JSON'ni `json.dumps(natija, ensure_ascii=False)` bilan chiqaring — ya'ni `{\"kalit\": qiymat, ...}` ko'rinishida, vergul va ikki nuqtadan keyin bittadan bo'sh joy, o'zbekcha harflar o'z holicha.\n\n`fields` da sanalgan maydon obyektda doim mavjud bo'ladi.\n\nMisol. Kirish:\n\n```\n{\"id\": 7, \"nom\": \"Olma\", \"narx\": 12000, \"yashirin_izoh\": \"ichki\"}\nid nom narx\n```\n\nChiqish:\n\n```\n{\"id\": 7, \"nom\": \"Olma\", \"narx\": 12000}\n```",
    "starterCodePy": "import sys\nimport json\n\nlines = sys.stdin.read().split(\"\\n\")\nobyekt = json.loads(lines[0])\nfields = lines[1].split()\n\n# Faqat kerakli maydonlardan yangi lug'at yasang (tartib fields bo'yicha)\n# va json.dumps(..., ensure_ascii=False) bilan chiqaring.\n",
    "testCases": [
      {
        "stdin": "{\"id\": 7, \"nom\": \"Olma\", \"narx\": 12000, \"yashirin_izoh\": \"ichki\"}\nid nom narx\n",
        "expectedStdout": "{\"id\": 7, \"nom\": \"Olma\", \"narx\": 12000}\n",
        "hidden": false,
        "label": "Uchta maydon tanlandi"
      },
      {
        "stdin": "{\"id\": 3, \"nom\": \"Anor\", \"narx\": 25000}\nnom narx\n",
        "expectedStdout": "{\"nom\": \"Anor\", \"narx\": 25000}\n",
        "hidden": false,
        "label": "id chiqarilmadi"
      },
      {
        "stdin": "{\"id\": 1, \"nom\": \"Shaftoli\", \"narx\": 40000}\nnarx nom id\n",
        "expectedStdout": "{\"narx\": 40000, \"nom\": \"Shaftoli\", \"id\": 1}\n",
        "hidden": true,
        "label": "Maydonlar tartibi o'zgardi"
      },
      {
        "stdin": "{\"id\": 2, \"nom\": \"O'rik\", \"narx\": 18000, \"izoh\": \"shirin\"}\nnom izoh\n",
        "expectedStdout": "{\"nom\": \"O'rik\", \"izoh\": \"shirin\"}\n",
        "hidden": true,
        "label": "O'zbekcha harflar saqlanadi"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-61",
    "key": "backend-dars-61-medium",
    "title": "many=True va hisoblangan maydon",
    "difficulty": "MEDIUM",
    "points": 20,
    "tags": [
      "drf",
      "serializer",
      "many",
      "json"
    ],
    "description": "Bitta obyekt uchun `Serializer(obyekt)`, ro'yxat uchun `Serializer(obyektlar, many=True)` — natija JSON massiv bo'ladi. Bundan tashqari DRF'da `SerializerMethodField` bor: bazada yo'q, lekin javobda hisoblab chiqariladigan maydon.\n\nKirish (stdin):\n- 1-qator — `N`, obyektlar soni (0 ham bo'lishi mumkin);\n- keyingi `N` qator — har biri bitta JSON obyekt;\n- oxirgi qator — maydonlar ro'yxati, bo'sh joy bilan ajratilgan.\n\nMaydonlar ro'yxatida `nom_uzunligi` degan maxsus nom uchrashi mumkin — bu hisoblangan maydon: obyektning `nom` qiymatidagi belgilar soni. Qolgan nomlar obyektdan to'g'ridan-to'g'ri olinadi.\n\nChiqish: bitta qator — JSON massiv. Har bir element — sanalgan maydonlardan iborat obyekt, maydonlar ro'yxatdagi tartibda, obyektlar kirish tartibida. `json.dumps(natija, ensure_ascii=False)` dan foydalaning. `N` nol bo'lsa chiqish `[]` bo'ladi.\n\nMisol. Kirish:\n\n```\n2\n{\"id\": 1, \"nom\": \"Olma\", \"narx\": 12000}\n{\"id\": 2, \"nom\": \"Anor\", \"narx\": 25000}\nid nom nom_uzunligi\n```\n\nChiqish:\n\n```\n[{\"id\": 1, \"nom\": \"Olma\", \"nom_uzunligi\": 4}, {\"id\": 2, \"nom\": \"Anor\", \"nom_uzunligi\": 4}]\n```",
    "starterCodePy": "import sys\nimport json\n\nlines = sys.stdin.read().split(\"\\n\")\nn = int(lines[0])\nobyektlar = [json.loads(lines[1 + i]) for i in range(n)]\nfields = lines[1 + n].split()\n\n# Har bir obyekt uchun lug'at yasang. nom_uzunligi maydonini\n# len(obyekt[\"nom\"]) orqali hisoblang. Natijani massiv sifatida chiqaring.\n",
    "testCases": [
      {
        "stdin": "2\n{\"id\": 1, \"nom\": \"Olma\", \"narx\": 12000}\n{\"id\": 2, \"nom\": \"Anor\", \"narx\": 25000}\nid nom nom_uzunligi\n",
        "expectedStdout": "[{\"id\": 1, \"nom\": \"Olma\", \"nom_uzunligi\": 4}, {\"id\": 2, \"nom\": \"Anor\", \"nom_uzunligi\": 4}]\n",
        "hidden": false,
        "label": "Ikkita obyekt va hisoblangan maydon"
      },
      {
        "stdin": "3\n{\"id\": 1, \"nom\": \"Olma\", \"narx\": 12000}\n{\"id\": 2, \"nom\": \"Anor\", \"narx\": 25000}\n{\"id\": 3, \"nom\": \"Uzum\", \"narx\": 30000}\nnom narx\n",
        "expectedStdout": "[{\"nom\": \"Olma\", \"narx\": 12000}, {\"nom\": \"Anor\", \"narx\": 25000}, {\"nom\": \"Uzum\", \"narx\": 30000}]\n",
        "hidden": false,
        "label": "Hisoblangan maydonsiz"
      },
      {
        "stdin": "0\nid nom\n",
        "expectedStdout": "[]\n",
        "hidden": true,
        "label": "Bo'sh ro'yxat"
      },
      {
        "stdin": "1\n{\"id\": 5, \"nom\": \"O'rik\", \"narx\": 18000}\nnom nom_uzunligi narx\n",
        "expectedStdout": "[{\"nom\": \"O'rik\", \"nom_uzunligi\": 5, \"narx\": 18000}]\n",
        "hidden": true,
        "label": "Bitta obyekt, aralash tartib"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-61",
    "key": "backend-dars-61-hard",
    "title": "Deserializatsiya: is_valid va errors",
    "difficulty": "HARD",
    "points": 35,
    "tags": [
      "drf",
      "serializer",
      "validatsiya",
      "json"
    ],
    "description": "Teskari yo'nalish: `Serializer(data=so'rov_ma'lumoti)` → `.is_valid()` → `.validated_data` yoki `.errors`. Diqqat: DRF'da `errors` — har bir maydon uchun XABARLAR RO'YXATI saqlaydigan lug'at (Django formalaridan farqi shunda).\n\nKirish (stdin):\n- 1-qator — `N`, maydonlar soni;\n- keyingi `N` qator — maydon ta'rifi: `nom tur holat`, bu yerda tur `str` yoki `int`, holat `required` yoki `optional`;\n- oxirgi qator — kelgan ma'lumot, JSON obyekt.\n\nQoidalar:\n- Maydon yo'q, bo'sh yoki faqat probel bo'lsa: `required` bo'lsa xato — `Bu maydon majburiy.`; `optional` bo'lsa shunchaki tashlab ketiladi.\n- `int` maydon butun son bo'lmasa (JSON soni ham, `\"12000\"` kabi butun sonli matn ham emas) — xato: `Butun son kiriting.`\n- Ta'rifda yo'q, ortiqcha kalitlar e'tiborsiz qoldiriladi.\n- `validated_data` da `int` maydon SON sifatida (`12000`, qo'shtirnoqsiz), `str` maydon matn sifatida saqlanadi.\n\nChiqish — ANIQ ikki qator:\n1. `is_valid: True` yoki `is_valid: False`.\n2. Xato bo'lmasa — `validated_data` JSON obyekti (maydonlar ta'rif tartibida). Xato bo'lsa — `errors` JSON obyekti: kalit maydon nomi, qiymat esa bitta xabardan iborat RO'YXAT, maydonlar ta'rif tartibida.\n\nIkkala holatda ham `json.dumps(natija, ensure_ascii=False)` dan foydalaning.\n\nMisol. Kirish:\n\n```\n3\nnom str required\nnarx int required\nizoh str optional\n{\"nom\": \"Olma\", \"narx\": \"abc\"}\n```\n\nChiqish:\n\n```\nis_valid: False\n{\"narx\": [\"Butun son kiriting.\"]}\n```",
    "starterCodePy": "import sys\nimport json\nimport re\n\nlines = sys.stdin.read().split(\"\\n\")\nn = int(lines[0])\n# Ta'riflarni (nom, tur, majburiymi) ko'rinishida ro'yxatga yig'ing.\ndata = json.loads(lines[1 + n])\n\n# errors va validated_data lug'atlarini alohida yig'ing.\n# errors bo'sh bo'lmasa — is_valid: False va errors ni chiqaring.\n",
    "testCases": [
      {
        "stdin": "3\nnom str required\nnarx int required\nizoh str optional\n{\"nom\": \"Olma\", \"narx\": \"abc\"}\n",
        "expectedStdout": "is_valid: False\n{\"narx\": [\"Butun son kiriting.\"]}\n",
        "hidden": false,
        "label": "Butun son emas"
      },
      {
        "stdin": "3\nnom str required\nnarx int required\nizoh str optional\n{\"nom\": \"Olma\", \"narx\": \"12000\", \"izoh\": \"shirin\"}\n",
        "expectedStdout": "is_valid: True\n{\"nom\": \"Olma\", \"narx\": 12000, \"izoh\": \"shirin\"}\n",
        "hidden": false,
        "label": "Barcha maydon to'g'ri"
      },
      {
        "stdin": "3\nnom str required\nnarx int required\nizoh str optional\n{\"izoh\": \"faqat izoh\"}\n",
        "expectedStdout": "is_valid: False\n{\"nom\": [\"Bu maydon majburiy.\"], \"narx\": [\"Bu maydon majburiy.\"]}\n",
        "hidden": true,
        "label": "Ikkita majburiy maydon yo'q"
      },
      {
        "stdin": "2\nnom str required\nsoni int optional\n{\"nom\": \"Anor\"}\n",
        "expectedStdout": "is_valid: True\n{\"nom\": \"Anor\"}\n",
        "hidden": true,
        "label": "Ixtiyoriy maydon tashlab ketilgan"
      }
    ]
  }
];
