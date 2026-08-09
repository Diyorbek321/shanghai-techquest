/**
 * Hand-authored practice problems for backend lessons 20-26.
 *
 * Grading is exact-output, so every `expectedStdout` below was captured from a real run
 * of a reference solution on the Piston sandbox (python 3.10.0) against the matching
 * `stdin` — none of them were written from memory.
 */
import type { LessonProblemRecord } from './types';

export const backendProblemsP02: LessonProblemRecord[] = [
  {
    "lessonKey": "backend-dars-20",
    "key": "backend-dars-20-easy",
    "title": "Sanani chiroyli formatda chiqarish",
    "difficulty": "EASY",
    "points": 10,
    "tags": [
      "python",
      "datetime",
      "strftime"
    ],
    "description": "`datetime` moduli yordamida sanani boshqa formatga o'tkazing.\n\nKirish (stdin) — bitta qator: sana `YYYY-MM-DD` ko'rinishida.\n\nChiqish — bitta qator: shu sana `DD.MM.YYYY` ko'rinishida. Kun va oy har doim ikki xonali bo'lishi kerak (5-yanvar → `05.01`).\n\nMisol. Kiritish:\n```\n2010-05-14\n```\nNatija:\n```\n14.05.2010\n```\n\nMaslahat: `datetime.strptime(matn, \"%Y-%m-%d\")` matnni sanaga aylantiradi, `strftime(\"%d.%m.%Y\")` esa sanani kerakli matnga qaytaradi.",
    "starterCodePy": "from datetime import datetime\n\n# 1-qatordan sanani o'qing (YYYY-MM-DD)\nmatn = input()\n# strptime bilan sanaga aylantiring, strftime bilan DD.MM.YYYY qilib chiqaring\n",
    "testCases": [
      {
        "stdin": "2010-05-14\n",
        "expectedStdout": "14.05.2010\n",
        "hidden": false,
        "label": "Namunadagi misol"
      },
      {
        "stdin": "1999-12-31\n",
        "expectedStdout": "31.12.1999\n",
        "hidden": false,
        "label": "Yilning oxirgi kuni"
      },
      {
        "stdin": "2024-01-05\n",
        "expectedStdout": "05.01.2024\n",
        "hidden": true,
        "label": "Bir xonali kun va oy"
      },
      {
        "stdin": "2000-02-29\n",
        "expectedStdout": "29.02.2000\n",
        "hidden": true,
        "label": "Kabisa yilidagi sana"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-20",
    "key": "backend-dars-20-medium",
    "title": "Yoshni kun aniqligida hisoblash",
    "difficulty": "MEDIUM",
    "points": 20,
    "tags": [
      "python",
      "datetime",
      "timedelta"
    ],
    "description": "Ikki sana orasidagi farqni hisoblang.\n\nKirish (stdin) — 2 qator:\n1-qator — tug'ilgan sana `YYYY-MM-DD`\n2-qator — bugungi sana `YYYY-MM-DD` (tug'ilgan sanadan keyin yoki unga teng)\n\nChiqish — ANIQ 2 qator:\n```\nKunlar: <ikki sana orasidagi kunlar soni>\nTo'liq yosh: <to'liq yillar soni>\n```\n\n«To'liq yosh» — tug'ilgan kun shu yili allaqachon o'tgan bo'lsa yillar farqi, hali o'tmagan bo'lsa yillar farqidan bitta kam. Tug'ilgan kunning aynan o'zi o'tgan hisoblanadi.\n\nMisol. Kiritish:\n```\n2010-05-14\n2026-08-02\n```\nNatija:\n```\nKunlar: 5924\nTo'liq yosh: 16\n```\n\nMaslahat: ikki sana ayirmasi `timedelta` beradi, kun soni — `(a - b).days`.",
    "starterCodePy": "from datetime import datetime\n\n# 1-qator — tug'ilgan sana, 2-qator — bugungi sana\ntugilgan = datetime.strptime(input(), '%Y-%m-%d')\n# bugun = ...\n# Kunlar farqini (a - b).days bilan oling\n# To'liq yoshni yillar farqidan hisoblang\n",
    "testCases": [
      {
        "stdin": "2010-05-14\n2026-08-02\n",
        "expectedStdout": "Kunlar: 5924\nTo'liq yosh: 16\n",
        "hidden": false,
        "label": "Namunadagi misol"
      },
      {
        "stdin": "2005-01-01\n2026-01-01\n",
        "expectedStdout": "Kunlar: 7670\nTo'liq yosh: 21\n",
        "hidden": false,
        "label": "Tug'ilgan kun aynan bugun"
      },
      {
        "stdin": "2005-12-31\n2026-01-01\n",
        "expectedStdout": "Kunlar: 7306\nTo'liq yosh: 20\n",
        "hidden": true,
        "label": "Tug'ilgan kunga bir kun qolgan holat"
      },
      {
        "stdin": "2000-02-29\n2026-08-02\n",
        "expectedStdout": "Kunlar: 9651\nTo'liq yosh: 26\n",
        "hidden": true,
        "label": "Kabisa kunida tug'ilgan"
      },
      {
        "stdin": "2026-08-02\n2026-08-02\n",
        "expectedStdout": "Kunlar: 0\nTo'liq yosh: 0\n",
        "hidden": true,
        "label": "Ikkala sana bir xil"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-20",
    "key": "backend-dars-20-hard",
    "title": "Sanaga kun qo'shish va hafta kunini topish",
    "difficulty": "HARD",
    "points": 35,
    "tags": [
      "python",
      "datetime",
      "timedelta"
    ],
    "description": "Berilgan sanaga N kun qo'shing va natijaviy sanani hafta kuni bilan chiqaring.\n\nKirish (stdin) — 2 qator:\n1-qator — boshlang'ich sana `YYYY-MM-DD`\n2-qator — butun son N (manfiy ham bo'lishi mumkin — bu holda sana orqaga suriladi)\n\nChiqish — ANIQ 2 qator:\n```\nSana: <DD.MM.YYYY>\nHafta kuni: <nom>\n```\n\nHafta kunlari nomlari ANIQ shu ro'yxatdan olinadi (dushanbadan boshlab):\n`Dushanba, Seshanba, Chorshanba, Payshanba, Juma, Shanba, Yakshanba`\n\nMisol. Kiritish:\n```\n2026-08-02\n30\n```\nNatija:\n```\nSana: 01.09.2026\nHafta kuni: Seshanba\n```\n\nMaslahat: `timedelta(days=N)` ni sanaga qo'shsa bo'ladi. `sana.weekday()` dushanba uchun 0, yakshanba uchun 6 qaytaradi.",
    "starterCodePy": "from datetime import datetime, timedelta\n\nkunlar = ['Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba', 'Yakshanba']\n# 1-qator — sana, 2-qator — qo'shiladigan kunlar soni\nsana = datetime.strptime(input(), '%Y-%m-%d')\n# n = int(input())\n# timedelta bilan yangi sanani toping va weekday() orqali nomini chiqaring\n",
    "testCases": [
      {
        "stdin": "2026-08-02\n30\n",
        "expectedStdout": "Sana: 01.09.2026\nHafta kuni: Seshanba\n",
        "hidden": false,
        "label": "Namunadagi misol"
      },
      {
        "stdin": "2026-01-31\n1\n",
        "expectedStdout": "Sana: 01.02.2026\nHafta kuni: Yakshanba\n",
        "hidden": false,
        "label": "Oy chegarasidan o'tish"
      },
      {
        "stdin": "2026-03-01\n-1\n",
        "expectedStdout": "Sana: 28.02.2026\nHafta kuni: Shanba\n",
        "hidden": true,
        "label": "Manfiy kun bilan orqaga surish"
      },
      {
        "stdin": "2024-02-28\n1\n",
        "expectedStdout": "Sana: 29.02.2024\nHafta kuni: Payshanba\n",
        "hidden": true,
        "label": "Kabisa yilidagi chegara"
      },
      {
        "stdin": "2026-12-31\n1\n",
        "expectedStdout": "Sana: 01.01.2027\nHafta kuni: Juma\n",
        "hidden": true,
        "label": "Yil chegarasidan o'tish"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-21",
    "key": "backend-dars-21-easy",
    "title": "requirements.txt satrlarini ajratish",
    "difficulty": "EASY",
    "points": 10,
    "tags": [
      "python",
      "pip",
      "requirements",
      "satr"
    ],
    "description": "`requirements.txt` fayli ichida har bir qator `paket==versiya` ko'rinishida yoziladi. Shu qatorlarni ikki qismga ajratib chiqaring.\n\nKirish (stdin):\n1-qator — n soni (nechta qator borligi)\nkeyingi n qator — `paket==versiya` ko'rinishidagi satr\n\nChiqish — har bir qator uchun bitta satr:\n```\n<paket> — <versiya>\n```\nChiziqcha `—` (uzun tire) ning ikki yonida bittadan bo'sh joy bor.\n\nMisol. Kiritish:\n```\n2\nrequests==2.31.0\ndjango==5.0.1\n```\nNatija:\n```\nrequests — 2.31.0\ndjango — 5.0.1\n```\n\nMaslahat: `satr.split(\"==\")` qatorni ikkiga bo'ladi.",
    "starterCodePy": "# 1-qatordan nechta paket borligini o'qing\nn = int(input())\n# Har bir qatorni == bo'yicha bo'lib, «paket — versiya» ko'rinishida chiqaring\nfor i in range(n):\n    satr = input()\n",
    "testCases": [
      {
        "stdin": "2\nrequests==2.31.0\ndjango==5.0.1\n",
        "expectedStdout": "requests — 2.31.0\ndjango — 5.0.1\n",
        "hidden": false,
        "label": "Namunadagi misol"
      },
      {
        "stdin": "3\nflask==3.0.0\npsycopg2==2.9.9\npytest==8.0.0\n",
        "expectedStdout": "flask — 3.0.0\npsycopg2 — 2.9.9\npytest — 8.0.0\n",
        "hidden": false,
        "label": "Uchta paket"
      },
      {
        "stdin": "1\npython-dateutil==2.8.2\n",
        "expectedStdout": "python-dateutil — 2.8.2\n",
        "hidden": true,
        "label": "Nomida chiziqcha bor paket"
      },
      {
        "stdin": "4\na==1.0\nb==2.0\nc==3.0\nd==4.0\n",
        "expectedStdout": "a — 1.0\nb — 2.0\nc — 3.0\nd — 4.0\n",
        "hidden": true,
        "label": "Qisqa nomli ko'p paket"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-21",
    "key": "backend-dars-21-medium",
    "title": "Ikki loyihaning paketlarini birlashtirish",
    "difficulty": "MEDIUM",
    "points": 20,
    "tags": [
      "python",
      "pip",
      "set",
      "requirements"
    ],
    "description": "Ikki loyihaning `requirements.txt` ro'yxati berilgan. Ularni birlashtirib, TAKRORLANMAS paket NOMLARINI alifbo tartibida chiqaring.\n\nKirish (stdin):\n1-qator — n, keyin n qator `paket==versiya` (1-loyiha)\nkeyingi qator — m, keyin m qator `paket==versiya` (2-loyiha)\n\nChiqish — avval har bir noyob paket nomi alifbo tartibida alohida qatorda, eng oxirida esa:\n```\nJami: <noyob paketlar soni>\n```\nVersiyalar chiqarilmaydi — faqat nomlar. Bir paket ikkala ro'yxatda turli versiya bilan uchrasa ham, u BIR marta chiqadi.\n\nMisol. Kiritish:\n```\n2\nrequests==2.31.0\ndjango==5.0.1\n2\nrequests==2.28.0\npytest==8.0.0\n```\nNatija:\n```\ndjango\npytest\nrequests\nJami: 3\n```\n\nMaslahat: `set` dublikatlarni o'zi olib tashlaydi, `sorted()` esa alifbo tartibiga soladi.",
    "starterCodePy": "# 1-loyiha paketlarini o'qing\nn = int(input())\npaketlar = set()\nfor i in range(n):\n    satr = input()\n# So'ng 2-loyihani ham xuddi shunday o'qing\n# sorted() bilan alifbo tartibida chiqaring va oxirida sonini yozing\n",
    "testCases": [
      {
        "stdin": "2\nrequests==2.31.0\ndjango==5.0.1\n2\nrequests==2.28.0\npytest==8.0.0\n",
        "expectedStdout": "django\npytest\nrequests\nJami: 3\n",
        "hidden": false,
        "label": "Namunadagi misol"
      },
      {
        "stdin": "3\nflask==3.0.0\nclick==8.1.7\njinja2==3.1.3\n2\nclick==8.0.0\nflask==2.0.0\n",
        "expectedStdout": "click\nflask\njinja2\nJami: 3\n",
        "hidden": false,
        "label": "Ikkala ro'yxat ham kesishadi"
      },
      {
        "stdin": "2\na==1.0\nb==1.0\n0\n",
        "expectedStdout": "a\nb\nJami: 2\n",
        "hidden": true,
        "label": "Ikkinchi ro'yxat bo'sh"
      },
      {
        "stdin": "1\nzeta==1.0\n3\nalpha==1.0\nbeta==1.0\nzeta==2.0\n",
        "expectedStdout": "alpha\nbeta\nzeta\nJami: 3\n",
        "hidden": true,
        "label": "Tartib kiritish tartibiga bog'liq emas"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-21",
    "key": "backend-dars-21-hard",
    "title": "Qaysi versiya yangiroq?",
    "difficulty": "HARD",
    "points": 35,
    "tags": [
      "python",
      "pip",
      "versiya",
      "solishtirish"
    ],
    "description": "Paket versiyalarini solishtirish `pip` ning eng muhim ishlaridan biri. Versiya `KATTA.O'RTA.KICHIK` ko'rinishida — aynan 3 ta butun son, nuqta bilan ajratilgan.\n\nKirish (stdin):\n1-qator — n\nkeyingi n qator — bitta bo'sh joy bilan ajratilgan ikki versiya, masalan `2.31.0 2.4.1`\n\nChiqish — har bir juftlik uchun bitta qator: kattaroq (yangiroq) versiyaning o'zi, ular teng bo'lsa `teng` so'zi.\n\nSolishtirish MATN bo'yicha emas, SON bo'yicha ketadi: avval birinchi son, teng bo'lsa ikkinchisi, u ham teng bo'lsa uchinchisi. Shuning uchun `2.31.0` `2.4.1` dan yangiroq (31 > 4), garchi matn sifatida `\"2.4.1\"` kattaroq ko'rinsa ham.\n\nMisol. Kiritish:\n```\n3\n2.31.0 2.4.1\n1.0.0 1.0.0\n0.9.9 1.0.0\n```\nNatija:\n```\n2.31.0\nteng\n1.0.0\n```\n\nMaslahat: `[int(x) for x in v.split(\".\")]` versiyani sonlar ro'yxatiga aylantiradi, ro'yxatlarni esa `<` va `>` bilan to'g'ridan-to'g'ri solishtirsa bo'ladi.",
    "starterCodePy": "# Har bir qatorda ikki versiya bor: masalan «2.31.0 2.4.1»\nn = int(input())\nfor i in range(n):\n    a, b = input().split()\n    # Har bir versiyani sonlar ro'yxatiga aylantiring va solishtiring\n",
    "testCases": [
      {
        "stdin": "3\n2.31.0 2.4.1\n1.0.0 1.0.0\n0.9.9 1.0.0\n",
        "expectedStdout": "2.31.0\nteng\n1.0.0\n",
        "hidden": false,
        "label": "Namunadagi misol"
      },
      {
        "stdin": "2\n1.2.3 1.2.10\n10.0.0 9.99.99\n",
        "expectedStdout": "1.2.10\n10.0.0\n",
        "hidden": false,
        "label": "Ikki xonali qismlar"
      },
      {
        "stdin": "3\n0.0.1 0.0.0\n1.0.0 1.1.0\n3.4.5 3.4.5\n",
        "expectedStdout": "0.0.1\n1.1.0\nteng\n",
        "hidden": true,
        "label": "Faqat oxirgi son farq qiladi"
      },
      {
        "stdin": "1\n0.0.0 0.0.0\n",
        "expectedStdout": "teng\n",
        "hidden": true,
        "label": "Nol versiyalar tengligi"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-22",
    "key": "backend-dars-22-easy",
    "title": "Matnni faylga yozib, qayta o'qish",
    "difficulty": "EASY",
    "points": 10,
    "tags": [
      "python",
      "fayl",
      "open",
      "utf-8"
    ],
    "description": "Foydalanuvchi kiritgan matnni faylga saqlang, so'ng shu fayldan qayta o'qib ekranga chiqaring.\n\nKirish (stdin) — bitta qator matn.\n\nBajarish tartibi:\n1. Matnni `matn.txt` fayliga `w` rejimida yozing (`encoding=\"utf-8\"` bilan).\n2. Faylni qayta oching va mazmunini o'qing.\n3. Ekranga ANIQ 2 qator chiqaring:\n```\nFaylga yozildi\n<fayldan o'qilgan matn>\n```\n\nMisol. Kiritish:\n```\nSalom, dunyo\n```\nNatija:\n```\nFaylga yozildi\nSalom, dunyo\n```\n\nDiqqat: faylga `\\n` qo'shmang — aks holda ortiqcha bo'sh qator paydo bo'ladi. Har doim `with open(...) as f` ishlating.",
    "starterCodePy": "matn = input()\n\n# Matnni matn.txt fayliga w rejimida yozing (encoding=\"utf-8\")\n# with open(\"matn.txt\", \"w\", encoding=\"utf-8\") as f:\n#     ...\n\nprint('Faylga yozildi')\n# Endi faylni qayta o'qib, mazmunini chiqaring\n",
    "testCases": [
      {
        "stdin": "Salom, dunyo\n",
        "expectedStdout": "Faylga yozildi\nSalom, dunyo\n",
        "hidden": false,
        "label": "Namunadagi misol"
      },
      {
        "stdin": "Bugun Python o'rgandim\n",
        "expectedStdout": "Faylga yozildi\nBugun Python o'rgandim\n",
        "hidden": false,
        "label": "Apostrofli matn"
      },
      {
        "stdin": "O'zbekiston — Vatanim mening\n",
        "expectedStdout": "Faylga yozildi\nO'zbekiston — Vatanim mening\n",
        "hidden": true,
        "label": "O'zbekcha harflar va uzun tire"
      },
      {
        "stdin": "123 456\n",
        "expectedStdout": "Faylga yozildi\n123 456\n",
        "hidden": true,
        "label": "Faqat sonlardan iborat matn"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-22",
    "key": "backend-dars-22-medium",
    "title": "Kundalik: yozuvlarni faylga qo'shish",
    "difficulty": "MEDIUM",
    "points": 20,
    "tags": [
      "python",
      "fayl",
      "append",
      "sikl"
    ],
    "description": "`a` (append) rejimi eski mazmunni o'chirmaydi — yangi yozuvni fayl OXIRIGA qo'shadi. Shuni ishlatib kichik kundalik yozing.\n\nKirish (stdin):\n1-qator — n (yozuvlar soni)\nkeyingi n qator — yozuv matni\n\nBajarish tartibi:\n1. Har bir yozuvni `kundalik.txt` fayliga `a` rejimida qo'shing, har birining oxiriga `\\n` qo'ying.\n2. Fayl to'lgach uni o'qib, har bir yozuvni raqamlab chiqaring:\n```\n1. <birinchi yozuv>\n2. <ikkinchi yozuv>\n```\n3. Eng oxirida yozuvlar sonini chiqaring:\n```\nYozuvlar soni: <n>\n```\n\nMisol. Kiritish:\n```\n3\nBugun dars boshlandi\nFayllarni o'rgandim\nErtaga JSON\n```\nNatija:\n```\n1. Bugun dars boshlandi\n2. Fayllarni o'rgandim\n3. Ertaga JSON\nYozuvlar soni: 3\n```\n\nDiqqat: `w` rejimini ishlatsangiz faqat oxirgi yozuv qoladi.",
    "starterCodePy": "n = int(input())\n\n# Har bir yozuvni kundalik.txt fayliga a rejimida qo'shing\nfor i in range(n):\n    yozuv = input()\n    # with open(\"kundalik.txt\", \"a\", encoding=\"utf-8\") as f:\n    #     ...\n\n# Faylni o'qib, satrlarni raqamlab chiqaring, oxirida sonini yozing\n",
    "testCases": [
      {
        "stdin": "3\nBugun dars boshlandi\nFayllarni o'rgandim\nErtaga JSON\n",
        "expectedStdout": "1. Bugun dars boshlandi\n2. Fayllarni o'rgandim\n3. Ertaga JSON\nYozuvlar soni: 3\n",
        "hidden": false,
        "label": "Namunadagi misol"
      },
      {
        "stdin": "1\nYolg'iz yozuv\n",
        "expectedStdout": "1. Yolg'iz yozuv\nYozuvlar soni: 1\n",
        "hidden": false,
        "label": "Bitta yozuv"
      },
      {
        "stdin": "5\nbir\nikki\nuch\nto'rt\nbesh\n",
        "expectedStdout": "1. bir\n2. ikki\n3. uch\n4. to'rt\n5. besh\nYozuvlar soni: 5\n",
        "hidden": true,
        "label": "Besh yozuv ketma-ket qo'shildi"
      },
      {
        "stdin": "2\nbir xil\nbir xil\n",
        "expectedStdout": "1. bir xil\n2. bir xil\nYozuvlar soni: 2\n",
        "hidden": true,
        "label": "Ikki bir xil yozuv ham saqlanadi"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-22",
    "key": "backend-dars-22-hard",
    "title": "Fayldagi eng uzun satr",
    "difficulty": "HARD",
    "points": 35,
    "tags": [
      "python",
      "fayl",
      "satr",
      "maksimum"
    ],
    "description": "Satrlarni faylga saqlang va shu FAYLDAN o'qib, eng uzun satrni toping.\n\nKirish (stdin):\n1-qator — n (satrlar soni)\nkeyingi n qator — matn satrlari\n\nBajarish tartibi:\n1. Barcha satrlarni `matnlar.txt` fayliga yozing (har biri yangi qatorda).\n2. Faylni qayta o'qing.\n3. Eng uzun satrni toping. Uzunligi bir xil bo'lgan satrlar bo'lsa — BIRINCHI uchraganini oling.\n4. ANIQ 2 qator chiqaring:\n```\nEng uzun satr: <satr>\nUzunligi: <belgilar soni>\n```\n\nUzunlik satr oxiridagi `\\n` ni HISOBLAMAYDI.\n\nMisol. Kiritish:\n```\n3\nPython\nFayllar bilan ishlash\nJSON\n```\nNatija:\n```\nEng uzun satr: Fayllar bilan ishlash\nUzunligi: 21\n```",
    "starterCodePy": "n = int(input())\n\n# Satrlarni matnlar.txt fayliga yozing\n# Keyin faylni qayta o'qib, eng uzun satrni toping\n# Satr oxiridagi \\n ni rstrip(\"\\n\") bilan olib tashlashni unutmang\n",
    "testCases": [
      {
        "stdin": "3\nPython\nFayllar bilan ishlash\nJSON\n",
        "expectedStdout": "Eng uzun satr: Fayllar bilan ishlash\nUzunligi: 21\n",
        "hidden": false,
        "label": "Namunadagi misol"
      },
      {
        "stdin": "4\nbir\nikkita soz\nuch\nto'rtta soz bor\n",
        "expectedStdout": "Eng uzun satr: to'rtta soz bor\nUzunligi: 15\n",
        "hidden": false,
        "label": "To'rtta satr"
      },
      {
        "stdin": "3\nabcde\nfghij\nkl\n",
        "expectedStdout": "Eng uzun satr: abcde\nUzunligi: 5\n",
        "hidden": true,
        "label": "Uzunliklar teng — birinchisi olinadi"
      },
      {
        "stdin": "1\nyagona satr\n",
        "expectedStdout": "Eng uzun satr: yagona satr\nUzunligi: 11\n",
        "hidden": true,
        "label": "Bitta satr"
      },
      {
        "stdin": "2\na\nbb\n",
        "expectedStdout": "Eng uzun satr: bb\nUzunligi: 2\n",
        "hidden": true,
        "label": "Juda qisqa satrlar"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-23",
    "key": "backend-dars-23-easy",
    "title": "Dict'ni JSON faylga saqlash va qayta o'qish",
    "difficulty": "EASY",
    "points": 10,
    "tags": [
      "python",
      "json",
      "dict",
      "fayl"
    ],
    "description": "Kiritilgan ma'lumotdan dict yasang, uni JSON faylga saqlang va SHU FAYLDAN qayta o'qib chiqaring.\n\nKirish (stdin) — 2 qator:\n1-qator — ism\n2-qator — yosh (butun son)\n\nBajarish tartibi:\n1. `{\"ism\": ..., \"yosh\": ...}` dict yarating. Yosh SON bo'lishi kerak (`int`), matn emas.\n2. Uni `talaba.json` fayliga `json.dump` bilan saqlang (`ensure_ascii=False`, `indent=2`).\n3. Faylni `json.load` bilan qayta o'qing va ANIQ 3 qator chiqaring:\n```\nIsm: <ism>\nYosh: <yosh>\nKalitlar soni: 2\n```\n\nMisol. Kiritish:\n```\nAli\n15\n```\nNatija:\n```\nIsm: Ali\nYosh: 15\nKalitlar soni: 2\n```",
    "starterCodePy": "import json\n\nism = input()\nyosh = int(input())\n# dict yarating va talaba.json fayliga json.dump bilan saqlang\n# with open(\"talaba.json\", \"w\", encoding=\"utf-8\") as f:\n#     json.dump(..., f, ensure_ascii=False, indent=2)\n\n# Faylni json.load bilan qayta o'qing va uchta qatorni chiqaring\n",
    "testCases": [
      {
        "stdin": "Ali\n15\n",
        "expectedStdout": "Ism: Ali\nYosh: 15\nKalitlar soni: 2\n",
        "hidden": false,
        "label": "Namunadagi misol"
      },
      {
        "stdin": "Malika\n21\n",
        "expectedStdout": "Ism: Malika\nYosh: 21\nKalitlar soni: 2\n",
        "hidden": false,
        "label": "Boshqa ma'lumot"
      },
      {
        "stdin": "O'tkir\n7\n",
        "expectedStdout": "Ism: O'tkir\nYosh: 7\nKalitlar soni: 2\n",
        "hidden": true,
        "label": "Apostrofli ism JSON'da buzilmaydi"
      },
      {
        "stdin": "Nodira\n0\n",
        "expectedStdout": "Ism: Nodira\nYosh: 0\nKalitlar soni: 2\n",
        "hidden": true,
        "label": "Chegaraviy yosh qiymati"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-23",
    "key": "backend-dars-23-medium",
    "title": "Talabalar ro'yxatini JSON'da saqlash",
    "difficulty": "MEDIUM",
    "points": 20,
    "tags": [
      "python",
      "json",
      "list",
      "ortacha"
    ],
    "description": "Talabalar ro'yxatini (list of dict) JSON faylga saqlang, qayta o'qing va hisobot chiqaring.\n\nKirish (stdin):\n1-qator — n (talabalar soni)\nkeyingi n qator — `ism ball` (bitta bo'sh joy bilan ajratilgan, ball — butun son)\n\nBajarish tartibi:\n1. Har bir talaba uchun `{\"ism\": ..., \"ball\": ...}` dict yasab, ularni ro'yxatga to'plang.\n2. Ro'yxatni `ballar.json` fayliga saqlang (`ensure_ascii=False`).\n3. Fayldan qayta o'qib, har bir talabani chiqaring:\n```\n<ism>: <ball>\n```\n4. Oxirida o'rtacha ballni AYNAN bitta kasr xonasi bilan chiqaring:\n```\nO'rtacha: <o'rtacha>\n```\n\nMisol. Kiritish:\n```\n3\nAli 85\nMalika 92\nBobur 78\n```\nNatija:\n```\nAli: 85\nMalika: 92\nBobur: 78\nO'rtacha: 85.0\n```\n\nMaslahat: bitta kasr xonasi uchun `f\"{qiymat:.1f}\"` ishlating.",
    "starterCodePy": "import json\n\nn = int(input())\ntalabalar = []\nfor i in range(n):\n    ism, ball = input().split()\n    # dict yasab, talabalar ro'yxatiga qo'shing (ball int bo'lsin)\n\n# ballar.json fayliga saqlang, keyin qayta o'qing\n# Har bir talabani chiqaring va oxirida o'rtachani :.1f formatida yozing\n",
    "testCases": [
      {
        "stdin": "3\nAli 85\nMalika 92\nBobur 78\n",
        "expectedStdout": "Ali: 85\nMalika: 92\nBobur: 78\nO'rtacha: 85.0\n",
        "hidden": false,
        "label": "Namunadagi misol"
      },
      {
        "stdin": "2\nZuhra 100\nSardor 91\n",
        "expectedStdout": "Zuhra: 100\nSardor: 91\nO'rtacha: 95.5\n",
        "hidden": false,
        "label": "Ikki talaba"
      },
      {
        "stdin": "1\nYolgiz 63\n",
        "expectedStdout": "Yolgiz: 63\nO'rtacha: 63.0\n",
        "hidden": true,
        "label": "Bitta talaba"
      },
      {
        "stdin": "4\nA 1\nB 2\nC 2\nD 2\n",
        "expectedStdout": "A: 1\nB: 2\nC: 2\nD: 2\nO'rtacha: 1.8\n",
        "hidden": true,
        "label": "Kasrli o'rtacha yaxlitlanishi"
      },
      {
        "stdin": "3\nOtabek 0\nNodir 0\nKamol 1\n",
        "expectedStdout": "Otabek: 0\nNodir: 0\nKamol: 1\nO'rtacha: 0.3\n",
        "hidden": true,
        "label": "Nol ballar"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-23",
    "key": "backend-dars-23-hard",
    "title": "CSV faylga yozib, DictReader bilan o'qish",
    "difficulty": "HARD",
    "points": 35,
    "tags": [
      "python",
      "csv",
      "dictreader",
      "filtr"
    ],
    "description": "Ma'lumotni CSV faylga yozing va uni `csv.DictReader` bilan qayta o'qib filtrlang.\n\nKirish (stdin):\n1-qator — n\nkeyingi n qator — `ism,shahar,yosh` (vergul bilan ajratilgan, bo'sh joysiz; yosh — butun son)\n\nBajarish tartibi:\n1. `odamlar.csv` fayliga yozing. Birinchi qator sarlavha bo'lsin: `ism,shahar,yosh`. `csv` modulini ishlating va `newline=\"\"` parametrini unutmang.\n2. Faylni `csv.DictReader` bilan o'qing.\n3. Yoshi 18 dan KICHIK BO'LMAGAN (>= 18) har bir odamni chiqaring:\n```\n<ism> (<shahar>)\n```\n4. Oxirida ularning sonini chiqaring:\n```\nKattalar: <son>\n```\n\nMisol. Kiritish:\n```\n3\nAli,Toshkent,20\nMalika,Samarqand,17\nBobur,Buxoro,18\n```\nNatija:\n```\nAli (Toshkent)\nBobur (Buxoro)\nKattalar: 2\n```\n\nDiqqat: `DictReader` barcha qiymatlarni MATN qilib qaytaradi — solishtirishdan oldin `int()` ga o'tkazing.",
    "starterCodePy": "import csv\n\nn = int(input())\n# Satrlarni o'qib, odamlar.csv fayliga sarlavha bilan yozing\n# with open(\"odamlar.csv\", \"w\", newline=\"\", encoding=\"utf-8\") as f:\n#     yozuvchi = csv.writer(f)\n#     yozuvchi.writerow([\"ism\", \"shahar\", \"yosh\"])\n\n# Keyin csv.DictReader bilan o'qib, yoshi >= 18 bo'lganlarni chiqaring\n",
    "testCases": [
      {
        "stdin": "3\nAli,Toshkent,20\nMalika,Samarqand,17\nBobur,Buxoro,18\n",
        "expectedStdout": "Ali (Toshkent)\nBobur (Buxoro)\nKattalar: 2\n",
        "hidden": false,
        "label": "Namunadagi misol"
      },
      {
        "stdin": "4\nZuhra,Namangan,30\nSardor,Andijon,15\nNodir,Xorazm,45\nGuli,Navoiy,12\n",
        "expectedStdout": "Zuhra (Namangan)\nNodir (Xorazm)\nKattalar: 2\n",
        "hidden": false,
        "label": "To'rt odam, ikkitasi mos"
      },
      {
        "stdin": "2\nA,Toshkent,17\nB,Nukus,10\n",
        "expectedStdout": "Kattalar: 0\n",
        "hidden": true,
        "label": "Hech kim shartga mos kelmadi"
      },
      {
        "stdin": "1\nYakka,Qarshi,18\n",
        "expectedStdout": "Yakka (Qarshi)\nKattalar: 1\n",
        "hidden": true,
        "label": "Chegaraviy yosh 18"
      },
      {
        "stdin": "3\nX,Fargona,99\nY,Jizzax,18\nZ,Sirdaryo,19\n",
        "expectedStdout": "X (Fargona)\nY (Jizzax)\nZ (Sirdaryo)\nKattalar: 3\n",
        "hidden": true,
        "label": "Hammasi shartga mos"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-24",
    "key": "backend-dars-24-easy",
    "title": "Xavfsiz son o'qish (try/except)",
    "difficulty": "EASY",
    "points": 10,
    "tags": [
      "python",
      "try-except",
      "valueerror"
    ],
    "description": "Foydalanuvchi son o'rniga harf kiritsa, `int()` dasturni qulatadi. `try/except` bilan buni oldini oling.\n\nKirish (stdin) — bitta qator.\n\nAgar qatorni butun songa aylantirish MUMKIN bo'lsa, uning ikki barobarini chiqaring:\n```\nNatija: <son * 2>\n```\nAylantirib bo'lmasa, ANIQ shu xabarni chiqaring:\n```\nXato: butun son kiriting\n```\n\nMisol 1. Kiritish `21` → natija `Natija: 42`\nMisol 2. Kiritish `salom` → natija `Xato: butun son kiriting`\n\nDiqqat: bo'sh `except:` yozmang — aynan `except ValueError:` ni tuting.",
    "starterCodePy": "matn = input()\n\n# try ichida int() ga aylantiring va ikki barobarini chiqaring\n# except ValueError: bo'limida xato xabarini chiqaring\n",
    "testCases": [
      {
        "stdin": "21\n",
        "expectedStdout": "Natija: 42\n",
        "hidden": false,
        "label": "To'g'ri son kiritildi"
      },
      {
        "stdin": "salom\n",
        "expectedStdout": "Xato: butun son kiriting\n",
        "hidden": false,
        "label": "Son o'rniga matn kiritildi"
      },
      {
        "stdin": "-8\n",
        "expectedStdout": "Natija: -16\n",
        "hidden": true,
        "label": "Manfiy son"
      },
      {
        "stdin": "3.5\n",
        "expectedStdout": "Xato: butun son kiriting\n",
        "hidden": true,
        "label": "Kasrli son butun son emas"
      },
      {
        "stdin": "0\n",
        "expectedStdout": "Natija: 0\n",
        "hidden": true,
        "label": "Nol qiymati"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-24",
    "key": "backend-dars-24-medium",
    "title": "Fayl topilmasa ham qulamaydigan dastur",
    "difficulty": "MEDIUM",
    "points": 20,
    "tags": [
      "python",
      "try-except",
      "fayl",
      "finally"
    ],
    "description": "Dastur avval `mavjud.txt` faylini yaratadi va ichiga AYNAN `Salom` so'zini yozadi (kiritishdan qat'i nazar — bu doim bajariladi).\n\nSo'ng stdin dan bitta qator — ochilishi kerak bo'lgan fayl NOMI o'qiladi va shu fayl ochib ko'riladi.\n\nChiqish — ANIQ 2 qator:\n- Fayl topilsa: `Mazmun: <fayl ichidagi matn>`\n- Fayl topilmasa: `Xato: fayl topilmadi`\n- Ikkala holatda ham OXIRGI qator: `Dastur tugadi`\n\nOxirgi qator `finally` blokida chiqarilishi kerak.\n\nMisol 1. Kiritish:\n```\nmavjud.txt\n```\nNatija:\n```\nMazmun: Salom\nDastur tugadi\n```\n\nMisol 2. Kiritish:\n```\nyoq.txt\n```\nNatija:\n```\nXato: fayl topilmadi\nDastur tugadi\n```\n\nDiqqat: aynan `except FileNotFoundError:` ni tuting.",
    "starterCodePy": "# Avval mavjud.txt faylini yarating va ichiga Salom deb yozing\nwith open('mavjud.txt', 'w', encoding='utf-8') as f:\n    f.write('Salom')\n\nnom = input()\n# try ichida faylni ochib mazmunini chiqaring\n# except FileNotFoundError: bo'limida xato xabarini bering\n# finally: bo'limida «Dastur tugadi» chiqarilsin\n",
    "testCases": [
      {
        "stdin": "mavjud.txt\n",
        "expectedStdout": "Mazmun: Salom\nDastur tugadi\n",
        "hidden": false,
        "label": "Mavjud fayl ochildi"
      },
      {
        "stdin": "yoq.txt\n",
        "expectedStdout": "Xato: fayl topilmadi\nDastur tugadi\n",
        "hidden": false,
        "label": "Mavjud bo'lmagan fayl"
      },
      {
        "stdin": "mavjud.txt.bak\n",
        "expectedStdout": "Xato: fayl topilmadi\nDastur tugadi\n",
        "hidden": true,
        "label": "O'xshash nom ham topilmaydi"
      },
      {
        "stdin": "papka/fayl.txt\n",
        "expectedStdout": "Xato: fayl topilmadi\nDastur tugadi\n",
        "hidden": true,
        "label": "Mavjud bo'lmagan papkadagi fayl"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-24",
    "key": "backend-dars-24-hard",
    "title": "Bo'lish kalkulyatori: ikki xil xatoni tutish",
    "difficulty": "HARD",
    "points": 35,
    "tags": [
      "python",
      "try-except",
      "zerodivisionerror",
      "valueerror"
    ],
    "description": "Ikki sonni bo'luvchi kalkulyator yozing va IKKI xil xatoni ALOHIDA tuting.\n\nKirish (stdin):\n1-qator — n (amallar soni)\nkeyingi n qator — bitta bo'sh joy bilan ajratilgan ikki qiymat, masalan `10 4`\n\nHar bir amal uchun bitta qator chiqaring:\n- Ikkalasi ham butun son va bo'luvchi noldan farqli bo'lsa: bo'linma AYNAN ikki kasr xonasi bilan → `10 4` uchun `2.50`\n- Bo'luvchi nol bo'lsa: `Xato: nolga bo'lib bo'lmaydi`\n- Qiymatlardan biri butun son bo'lmasa: `Xato: son emas`\n\nOxirida:\n```\nTekshirilgan amallar: <n>\n```\n\nMisol. Kiritish:\n```\n3\n10 4\n5 0\nabc 2\n```\nNatija:\n```\n2.50\nXato: nolga bo'lib bo'lmaydi\nXato: son emas\nTekshirilgan amallar: 3\n```\n\nDiqqat: `int()` xatosi `ValueError`, nolga bo'lish esa `ZeroDivisionError`. Ikkalasini alohida `except` bilan tuting.",
    "starterCodePy": "n = int(input())\nfor i in range(n):\n    a, b = input().split()\n    # try ichida int() ga aylantiring va bo'ling\n    # except ZeroDivisionError va except ValueError ni alohida yozing\n    # To'g'ri natijani :.2f formatida chiqaring\n# Oxirida amallar sonini chiqaring\n",
    "testCases": [
      {
        "stdin": "3\n10 4\n5 0\nabc 2\n",
        "expectedStdout": "2.50\nXato: nolga bo'lib bo'lmaydi\nXato: son emas\nTekshirilgan amallar: 3\n",
        "hidden": false,
        "label": "Uch xil holat birga"
      },
      {
        "stdin": "2\n9 3\n7 2\n",
        "expectedStdout": "3.00\n3.50\nTekshirilgan amallar: 2\n",
        "hidden": false,
        "label": "Faqat to'g'ri amallar"
      },
      {
        "stdin": "3\n0 5\n-10 4\n5 -2\n",
        "expectedStdout": "0.00\n-2.50\n-2.50\nTekshirilgan amallar: 3\n",
        "hidden": true,
        "label": "Manfiy va nol suratlar"
      },
      {
        "stdin": "2\n10 2.5\n1 0\n",
        "expectedStdout": "Xato: son emas\nXato: nolga bo'lib bo'lmaydi\nTekshirilgan amallar: 2\n",
        "hidden": true,
        "label": "Kasrli qiymat butun son emas"
      },
      {
        "stdin": "1\n1000000 3\n",
        "expectedStdout": "333333.33\nTekshirilgan amallar: 1\n",
        "hidden": true,
        "label": "Katta son bilan bo'lish"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-25",
    "key": "backend-dars-25-easy",
    "title": "Talaba classi va ikkita obyekt",
    "difficulty": "EASY",
    "points": 10,
    "tags": [
      "python",
      "oop",
      "class",
      "init"
    ],
    "description": "`Talaba` nomli class yarating. `__init__` metodi ikki parametr olsin: `ism` va `yosh`, va ularni `self.ism` / `self.yosh` sifatida saqlasin.\n\nKirish (stdin) — 2 qator, har birida `ism yosh` (bitta bo'sh joy bilan ajratilgan, yosh — butun son).\n\nHar bir qator uchun bitta `Talaba` obyekti yasang va uni chiqaring:\n```\n<ism>, <yosh> yosh\n```\n\nMisol. Kiritish:\n```\nAli 15\nMalika 17\n```\nNatija:\n```\nAli, 15 yosh\nMalika, 17 yosh\n```\n\nDiqqat: `self.ism = ism` yozmasangiz, atribut saqlanmaydi.",
    "starterCodePy": "class Talaba:\n    def __init__(self, ism, yosh):\n        # Atributlarni self orqali saqlang\n        pass\n\n# Ikki qatorni o'qib, ikkita obyekt yasang va ma'lumotini chiqaring\n",
    "testCases": [
      {
        "stdin": "Ali 15\nMalika 17\n",
        "expectedStdout": "Ali, 15 yosh\nMalika, 17 yosh\n",
        "hidden": false,
        "label": "Namunadagi misol"
      },
      {
        "stdin": "Bobur 21\nZuhra 19\n",
        "expectedStdout": "Bobur, 21 yosh\nZuhra, 19 yosh\n",
        "hidden": false,
        "label": "Boshqa ikki talaba"
      },
      {
        "stdin": "O'tkir 7\nNodira 40\n",
        "expectedStdout": "O'tkir, 7 yosh\nNodira, 40 yosh\n",
        "hidden": true,
        "label": "Apostrofli ism"
      },
      {
        "stdin": "A 0\nB 100\n",
        "expectedStdout": "A, 0 yosh\nB, 100 yosh\n",
        "hidden": true,
        "label": "Chegaraviy yoshlar"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-25",
    "key": "backend-dars-25-medium",
    "title": "Kitob classi",
    "difficulty": "MEDIUM",
    "points": 20,
    "tags": [
      "python",
      "oop",
      "class",
      "atribut"
    ],
    "description": "`Kitob` classini yarating. `__init__` uch parametr olsin: `nom`, `muallif`, `yil`.\n\nKirish (stdin) — 4 qator:\n1-qator — kitob nomi\n2-qator — muallif\n3-qator — nashr yili (butun son)\n4-qator — joriy yil (butun son)\n\nBitta `Kitob` obyekti yasang va ANIQ 2 qator chiqaring:\n```\n<nom> — <muallif> (<yil>)\nYoshi: <joriy yil - nashr yili> yil\n```\nChiziqcha `—` (uzun tire) ning ikki yonida bittadan bo'sh joy bor.\n\nMisol. Kiritish:\n```\nO'tkan kunlar\nAbdulla Qodiriy\n1926\n2026\n```\nNatija:\n```\nO'tkan kunlar — Abdulla Qodiriy (1926)\nYoshi: 100 yil\n```",
    "starterCodePy": "class Kitob:\n    def __init__(self, nom, muallif, yil):\n        # Uchta atributni saqlang\n        pass\n\nnom = input()\nmuallif = input()\nyil = int(input())\njoriy = int(input())\n# Obyekt yasang va ikki qatorni chiqaring\n",
    "testCases": [
      {
        "stdin": "O'tkan kunlar\nAbdulla Qodiriy\n1926\n2026\n",
        "expectedStdout": "O'tkan kunlar — Abdulla Qodiriy (1926)\nYoshi: 100 yil\n",
        "hidden": false,
        "label": "Namunadagi misol"
      },
      {
        "stdin": "Sariq devni minib\nXudoyberdi To'xtaboyev\n1975\n2026\n",
        "expectedStdout": "Sariq devni minib — Xudoyberdi To'xtaboyev (1975)\nYoshi: 51 yil\n",
        "hidden": false,
        "label": "Boshqa kitob"
      },
      {
        "stdin": "Yangi kitob\nMuallif Ismi\n2026\n2026\n",
        "expectedStdout": "Yangi kitob — Muallif Ismi (2026)\nYoshi: 0 yil\n",
        "hidden": true,
        "label": "Shu yili chiqqan kitob"
      },
      {
        "stdin": "Bir\nIkki\n1\n2\n",
        "expectedStdout": "Bir — Ikki (1)\nYoshi: 1 yil\n",
        "hidden": true,
        "label": "Juda kichik yil qiymatlari"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-25",
    "key": "backend-dars-25-hard",
    "title": "Talabalar ro'yxati va hisobot",
    "difficulty": "HARD",
    "points": 35,
    "tags": [
      "python",
      "oop",
      "class",
      "list",
      "sikl"
    ],
    "description": "`Talaba` classini (`ism`, `yosh`) yarating va bir nechta obyektni ro'yxatga to'plang.\n\nKirish (stdin):\n1-qator — n\nkeyingi n qator — `ism yosh`\n\nChiqish:\n1. Har bir talaba raqamlangan holda, kiritilgan tartibda:\n```\n1. <ism> (<yosh>)\n2. <ism> (<yosh>)\n```\n2. So'ng ANIQ shu 2 qator:\n```\nJami: <n>\nO'rtacha yosh: <o'rtacha>\n```\nO'rtacha yosh AYNAN bitta kasr xonasi bilan chiqariladi.\n\nMisol. Kiritish:\n```\n3\nAli 15\nMalika 17\nBobur 16\n```\nNatija:\n```\n1. Ali (15)\n2. Malika (17)\n3. Bobur (16)\nJami: 3\nO'rtacha yosh: 16.0\n```",
    "starterCodePy": "class Talaba:\n    def __init__(self, ism, yosh):\n        self.ism = ism\n        self.yosh = yosh\n\nn = int(input())\ntalabalar = []\n# n ta obyekt yasab ro'yxatga qo'shing\n# Keyin sikl bilan raqamlab chiqaring va hisobot bering\n",
    "testCases": [
      {
        "stdin": "3\nAli 15\nMalika 17\nBobur 16\n",
        "expectedStdout": "1. Ali (15)\n2. Malika (17)\n3. Bobur (16)\nJami: 3\nO'rtacha yosh: 16.0\n",
        "hidden": false,
        "label": "Namunadagi misol"
      },
      {
        "stdin": "2\nZuhra 20\nSardor 21\n",
        "expectedStdout": "1. Zuhra (20)\n2. Sardor (21)\nJami: 2\nO'rtacha yosh: 20.5\n",
        "hidden": false,
        "label": "Ikki talaba"
      },
      {
        "stdin": "1\nYolgiz 30\n",
        "expectedStdout": "1. Yolgiz (30)\nJami: 1\nO'rtacha yosh: 30.0\n",
        "hidden": true,
        "label": "Bitta talaba"
      },
      {
        "stdin": "4\nA 10\nB 11\nC 11\nD 11\n",
        "expectedStdout": "1. A (10)\n2. B (11)\n3. C (11)\n4. D (11)\nJami: 4\nO'rtacha yosh: 10.8\n",
        "hidden": true,
        "label": "Kasrli o'rtacha"
      },
      {
        "stdin": "3\nX 0\nY 0\nZ 1\n",
        "expectedStdout": "1. X (0)\n2. Y (0)\n3. Z (1)\nJami: 3\nO'rtacha yosh: 0.3\n",
        "hidden": true,
        "label": "Nol yoshlar"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-26",
    "key": "backend-dars-26-easy",
    "title": "Sanoqchi classi",
    "difficulty": "EASY",
    "points": 10,
    "tags": [
      "python",
      "oop",
      "metod",
      "holat"
    ],
    "description": "`Sanoqchi` classini yarating. Boshlang'ich qiymati 0 bo'lsin va uchta metodi bo'lsin: `oshir()` — bittaga oshiradi, `kamaytir()` — bittaga kamaytiradi, `korsat()` — joriy qiymatni `Hisob: <qiymat>` ko'rinishida chiqaradi.\n\nKirish (stdin):\n1-qator — n (buyruqlar soni)\nkeyingi n qator — buyruq: `oshir`, `kamaytir` yoki `korsat`\n\nHar bir buyruqni tartib bilan bajaring. Faqat `korsat` ekranga yozadi. Barcha buyruqlardan keyin ANIQ shu qatorni chiqaring:\n```\nYakuniy: <qiymat>\n```\n\nMisol. Kiritish:\n```\n5\noshir\noshir\nkorsat\nkamaytir\nkorsat\n```\nNatija:\n```\nHisob: 2\nHisob: 1\nYakuniy: 1\n```",
    "starterCodePy": "class Sanoqchi:\n    def __init__(self):\n        self.qiymat = 0\n\n    def oshir(self):\n        # self.qiymat ni bittaga oshiring\n        pass\n\n    # kamaytir() va korsat() metodlarini yozing\n\nn = int(input())\ns = Sanoqchi()\n# Buyruqlarni o'qib, mos metodni chaqiring\n",
    "testCases": [
      {
        "stdin": "5\noshir\noshir\nkorsat\nkamaytir\nkorsat\n",
        "expectedStdout": "Hisob: 2\nHisob: 1\nYakuniy: 1\n",
        "hidden": false,
        "label": "Namunadagi misol"
      },
      {
        "stdin": "3\nkorsat\noshir\nkorsat\n",
        "expectedStdout": "Hisob: 0\nHisob: 1\nYakuniy: 1\n",
        "hidden": false,
        "label": "Boshlang'ich qiymatdan boshlanadi"
      },
      {
        "stdin": "4\nkamaytir\nkamaytir\nkorsat\noshir\n",
        "expectedStdout": "Hisob: -2\nYakuniy: -1\n",
        "hidden": true,
        "label": "Manfiy qiymatga tushish"
      },
      {
        "stdin": "1\nkorsat\n",
        "expectedStdout": "Hisob: 0\nYakuniy: 0\n",
        "hidden": true,
        "label": "Yagona buyruq"
      },
      {
        "stdin": "0\n",
        "expectedStdout": "Yakuniy: 0\n",
        "hidden": true,
        "label": "Buyruqlarsiz holat"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-26",
    "key": "backend-dars-26-medium",
    "title": "Mashina classi va uning metodlari",
    "difficulty": "MEDIUM",
    "points": 20,
    "tags": [
      "python",
      "oop",
      "metod",
      "shart"
    ],
    "description": "`Mashina` classini yarating. Boshida tezlik 0 va mashina O'CHIQ. Metodlari:\n\n- `yoq()` — mashina o'chiq bo'lsa yoqadi va `Mashina yoqildi` chiqaradi; allaqachon yoqilgan bo'lsa `Mashina allaqachon yoqilgan` chiqaradi.\n- `tezlash(n)` — mashina o'chiq bo'lsa `Avval mashinani yoqing` chiqaradi va tezlikni O'ZGARTIRMAYDI; yoqilgan bo'lsa tezlikni n ga oshiradi va `Tezlik: <tezlik> km/h` chiqaradi.\n- `toxta()` — tezlikni 0 qiladi, mashinani o'chiradi va `Mashina to'xtadi` chiqaradi.\n\nKirish (stdin):\n1-qator — n (buyruqlar soni)\nkeyingi n qator — `yoq`, `toxta` yoki `tezlash <son>`\n\nBarcha buyruqlardan keyin ANIQ shu qatorni chiqaring:\n```\nYakuniy tezlik: <tezlik>\n```\n\nMisol. Kiritish:\n```\n5\ntezlash 20\nyoq\ntezlash 40\ntezlash 30\ntoxta\n```\nNatija:\n```\nAvval mashinani yoqing\nMashina yoqildi\nTezlik: 40 km/h\nTezlik: 70 km/h\nMashina to'xtadi\nYakuniy tezlik: 0\n```",
    "starterCodePy": "class Mashina:\n    def __init__(self):\n        self.tezlik = 0\n        self.yoqilgan = False\n\n    def yoq(self):\n        # Holatni tekshirib, mos xabarni chiqaring\n        pass\n\n    # tezlash(n) va toxta() metodlarini yozing\n\nn = int(input())\nm = Mashina()\n# Buyruqlarni split() bilan ajratib, mos metodni chaqiring\n",
    "testCases": [
      {
        "stdin": "5\ntezlash 20\nyoq\ntezlash 40\ntezlash 30\ntoxta\n",
        "expectedStdout": "Avval mashinani yoqing\nMashina yoqildi\nTezlik: 40 km/h\nTezlik: 70 km/h\nMashina to'xtadi\nYakuniy tezlik: 0\n",
        "hidden": false,
        "label": "Namunadagi misol"
      },
      {
        "stdin": "4\nyoq\nyoq\ntezlash 10\ntezlash 5\n",
        "expectedStdout": "Mashina yoqildi\nMashina allaqachon yoqilgan\nTezlik: 10 km/h\nTezlik: 15 km/h\nYakuniy tezlik: 15\n",
        "hidden": false,
        "label": "Ikki marta yoqish urinishi"
      },
      {
        "stdin": "6\nyoq\ntezlash 60\ntoxta\ntezlash 10\nyoq\ntezlash 15\n",
        "expectedStdout": "Mashina yoqildi\nTezlik: 60 km/h\nMashina to'xtadi\nAvval mashinani yoqing\nMashina yoqildi\nTezlik: 15 km/h\nYakuniy tezlik: 15\n",
        "hidden": true,
        "label": "To'xtagandan keyin qayta yoqish"
      },
      {
        "stdin": "2\ntoxta\ntezlash 100\n",
        "expectedStdout": "Mashina to'xtadi\nAvval mashinani yoqing\nYakuniy tezlik: 0\n",
        "hidden": true,
        "label": "O'chiq mashinani to'xtatish"
      },
      {
        "stdin": "1\nyoq\n",
        "expectedStdout": "Mashina yoqildi\nYakuniy tezlik: 0\n",
        "hidden": true,
        "label": "Faqat yoqish"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-26",
    "key": "backend-dars-26-hard",
    "title": "Hisob classi: pul qo'shish va yechish",
    "difficulty": "HARD",
    "points": 35,
    "tags": [
      "python",
      "oop",
      "metod",
      "tekshiruv"
    ],
    "description": "Bank hisobini modellashtiruvchi `Hisob` classini yarating. Metodlari:\n\n- `qoshish(summa)` — summa musbat bo'lsa balansga qo'shadi va `Qo'shildi: <summa>. Balans: <balans>` chiqaradi; summa 0 yoki manfiy bo'lsa balansni O'ZGARTIRMAY `Xato: summa musbat bo'lishi kerak` chiqaradi.\n- `yechish(summa)` — summa musbat bo'lmasa xuddi shu `Xato: summa musbat bo'lishi kerak` xabarini beradi; summa balansdan katta bo'lsa balansni O'ZGARTIRMAY `Mablag' yetarli emas. Balans: <balans>` chiqaradi; aks holda yechadi va `Yechildi: <summa>. Balans: <balans>` chiqaradi.\n\nKirish (stdin):\n1-qator — boshlang'ich balans (butun son)\n2-qator — n (buyruqlar soni)\nkeyingi n qator — `qoshish <summa>` yoki `yechish <summa>`\n\nOxirida ANIQ shu qatorni chiqaring:\n```\nYakuniy balans: <balans>\n```\n\nMisol. Kiritish:\n```\n100\n4\nqoshish 50\nyechish 200\nyechish 30\nqoshish -5\n```\nNatija:\n```\nQo'shildi: 50. Balans: 150\nMablag' yetarli emas. Balans: 150\nYechildi: 30. Balans: 120\nXato: summa musbat bo'lishi kerak\nYakuniy balans: 120\n```\n\nDiqqat: nuqta va bo'sh joylarga e'tibor bering — matn aynan mos bo'lishi kerak.",
    "starterCodePy": "class Hisob:\n    def __init__(self, balans):\n        self.balans = balans\n\n    def qoshish(self, summa):\n        # Summa musbatligini tekshiring\n        pass\n\n    # yechish(summa) metodini yozing\n\nbalans = int(input())\nn = int(input())\nh = Hisob(balans)\n# Buyruqlarni o'qib, mos metodni chaqiring\n",
    "testCases": [
      {
        "stdin": "100\n4\nqoshish 50\nyechish 200\nyechish 30\nqoshish -5\n",
        "expectedStdout": "Qo'shildi: 50. Balans: 150\nMablag' yetarli emas. Balans: 150\nYechildi: 30. Balans: 120\nXato: summa musbat bo'lishi kerak\nYakuniy balans: 120\n",
        "hidden": false,
        "label": "Namunadagi misol"
      },
      {
        "stdin": "0\n3\nqoshish 10\nyechish 10\nyechish 1\n",
        "expectedStdout": "Qo'shildi: 10. Balans: 10\nYechildi: 10. Balans: 0\nMablag' yetarli emas. Balans: 0\nYakuniy balans: 0\n",
        "hidden": false,
        "label": "Nol balansdan boshlash"
      },
      {
        "stdin": "50\n2\nyechish 50\nqoshish 0\n",
        "expectedStdout": "Yechildi: 50. Balans: 0\nXato: summa musbat bo'lishi kerak\nYakuniy balans: 0\n",
        "hidden": true,
        "label": "Balansni to'liq yechish va nol summa"
      },
      {
        "stdin": "20\n3\nyechish -10\nqoshish 5\nyechish 25\n",
        "expectedStdout": "Xato: summa musbat bo'lishi kerak\nQo'shildi: 5. Balans: 25\nYechildi: 25. Balans: 0\nYakuniy balans: 0\n",
        "hidden": true,
        "label": "Manfiy summa bilan yechish"
      },
      {
        "stdin": "1000\n1\nyechish 1001\n",
        "expectedStdout": "Mablag' yetarli emas. Balans: 1000\nYakuniy balans: 1000\n",
        "hidden": true,
        "label": "Bir birlikka yetmagan mablag'"
      }
    ]
  }
];
