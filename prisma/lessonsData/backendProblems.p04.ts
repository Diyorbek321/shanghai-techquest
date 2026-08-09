import type { LessonProblemRecord } from './types';

/**
 * Hand-authored practice for backend lessons 34-40.
 * Grading is exact-output, so every `expectedStdout` below was captured from a real
 * reference-solution run on the Piston sandbox (python 3.10.0) against the matching
 * `stdin` — none of them are written from memory.
 *
 * Lesson 39 (GitHub: push/pull/README) has no record here on purpose: a stdin/stdout
 * test cannot honestly verify that a student pushed a repository or wrote a README,
 * and there is no meaningful pure-Python exercise underneath it. That lesson keeps its
 * rubric-graded homework assignment.
 */
export const backendProblemsP04: LessonProblemRecord[] = [
  {
    "lessonKey": "backend-dars-34",
    "key": "backend-dars-34-easy",
    "title": "requirements.txt ni tozalash",
    "difficulty": "EASY",
    "points": 10,
    "tags": [
      "python",
      "matn",
      "requirements"
    ],
    "description": "`requirements.txt` faylining «iflos» varianti berilgan: qatorlarda ortiqcha bo'sh joylar bor, izohlar (`#` bilan boshlanadigan qatorlar) va bo'sh qatorlar aralashib ketgan. Uni toza ko'rinishga keltiring.\n\nKiritish (stdin): birinchi qatorda `n` — qatorlar soni. Keyingi `n` ta qator — faylning o'zi.\n\nQoidalar:\n- Bo'sh qatorni va `#` bilan boshlanadigan (bo'sh joylar olib tashlangandan keyin) qatorni tashlab yuboring.\n- Qolgan har bir qator `nom==versiya` shaklida. Nom va versiya atrofidagi bo'sh joylarni olib tashlang, nomni kichik harfga o'tkazing.\n- Natijani nom bo'yicha alifbo tartibida chiqaring.\n- Oxirida `Jami: K` qatorini chiqaring — K toza paketlar soni.\n\nMisol — kiritish:\n```\n5\nrequests == 2.31.0\n# kerak emas\n\nflask==2.0.1\nDJANGO ==4.2\n```\nChiqish:\n```\ndjango==4.2\nflask==2.0.1\nrequests==2.31.0\nJami: 3\n```",
    "starterCodePy": "# requirements.txt qatorlarini tozalang.\n# n ta qatorni o'qing, izoh va bo'sh qatorlarni tashlang,\n# nomni kichik harfga o'tkazing va alifbo tartibida chiqaring.\n",
    "testCases": [
      {
        "stdin": "5\nrequests == 2.31.0\n# kerak emas\n\nflask==2.0.1\nDJANGO ==4.2\n",
        "expectedStdout": "django==4.2\nflask==2.0.1\nrequests==2.31.0\nJami: 3\n",
        "hidden": false,
        "label": "Misoldagi fayl to'g'ri tozalandi"
      },
      {
        "stdin": "3\n# faqat izohlar\n\n#   yana izoh\n",
        "expectedStdout": "Jami: 0\n",
        "hidden": false,
        "label": "Faqat izoh va bo'sh qatorlar"
      },
      {
        "stdin": "4\n  Pytest==7.4.0  \nBlack==24.1.0\n#flake8==6.0.0\nRequests==2.31.0\n",
        "expectedStdout": "black==24.1.0\npytest==7.4.0\nrequests==2.31.0\nJami: 3\n",
        "hidden": true,
        "label": "Bo'sh joylar va katta harflar aralash"
      },
      {
        "stdin": "1\nnumpy==1.26.4\n",
        "expectedStdout": "numpy==1.26.4\nJami: 1\n",
        "hidden": true,
        "label": "Bitta paketli fayl"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-34",
    "key": "backend-dars-34-medium",
    "title": "Muhitni requirements bilan solishtirish",
    "difficulty": "MEDIUM",
    "points": 20,
    "tags": [
      "python",
      "lugat",
      "requirements"
    ],
    "description": "Virtual muhitga qaysi paketlar o'rnatilganini `pip freeze` ko'rsatadi. Uni `requirements.txt` bilan solishtiring.\n\nKiritish (stdin):\n- 1-qator: `n` — talab qilingan paketlar soni.\n- Keyingi `n` qator: `nom==versiya` (requirements.txt).\n- Keyingi qator: `m` — o'rnatilgan paketlar soni.\n- Keyingi `m` qator: `nom==versiya` (pip freeze natijasi).\n\nHar bir talab qilingan paket uchun requirements.txt dagi tartibda bitta qator chiqaring:\n- muhitda umuman yo'q bo'lsa: `nom: yo'q`\n- bor, lekin versiyasi boshqa bo'lsa: `nom: boshqa versiya (kerak K, o'rnatilgan O)`\n- versiyasi ham mos bo'lsa: `nom: OK`\n\nOxirida `Muammolar: K` — `OK` bo'lmagan paketlar soni.\n\nMisol — kiritish:\n```\n3\nflask==2.0.1\nrequests==2.31.0\npytest==7.4.0\n2\nflask==2.0.1\nrequests==2.28.0\n```\nChiqish:\n```\nflask: OK\nrequests: boshqa versiya (kerak 2.31.0, o'rnatilgan 2.28.0)\npytest: yo'q\nMuammolar: 2\n```",
    "starterCodePy": "# requirements.txt va pip freeze ro'yxatlarini solishtiring.\n# O'rnatilgan paketlarni lug'atga yig'ib olsangiz, qidirish oson bo'ladi.\n",
    "testCases": [
      {
        "stdin": "3\nflask==2.0.1\nrequests==2.31.0\npytest==7.4.0\n2\nflask==2.0.1\nrequests==2.28.0\n",
        "expectedStdout": "flask: OK\nrequests: boshqa versiya (kerak 2.31.0, o'rnatilgan 2.28.0)\npytest: yo'q\nMuammolar: 2\n",
        "hidden": false,
        "label": "Misoldagi solishtirish to'g'ri"
      },
      {
        "stdin": "2\nblack==24.1.0\nflake8==6.0.0\n2\nblack==24.1.0\nflake8==6.0.0\n",
        "expectedStdout": "black: OK\nflake8: OK\nMuammolar: 0\n",
        "hidden": false,
        "label": "Hamma narsa mos kelgan holat"
      },
      {
        "stdin": "1\ndjango==4.2.0\n3\nnumpy==1.26.4\ndjango==5.0.1\npandas==2.1.0\n",
        "expectedStdout": "django: boshqa versiya (kerak 4.2.0, o'rnatilgan 5.0.1)\nMuammolar: 1\n",
        "hidden": true,
        "label": "Muhitda ortiqcha paketlar bor"
      },
      {
        "stdin": "2\nrequests==2.31.0\nurllib3==2.0.7\n0\n",
        "expectedStdout": "requests: yo'q\nurllib3: yo'q\nMuammolar: 2\n",
        "hidden": true,
        "label": "Muhit butunlay bo'sh"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-34",
    "key": "backend-dars-34-hard",
    "title": "Versiya yetarlimi?",
    "difficulty": "HARD",
    "points": 35,
    "tags": [
      "python",
      "versiya",
      "taqqoslash"
    ],
    "description": "`requirements.txt` da ba'zan `nom>=versiya` yoziladi — «shu versiya yoki undan yangisi» degani. Versiyalarni matn sifatida emas, raqam sifatida solishtirish kerak: `4.10.0` — bu `4.2` dan YANGI, chunki 10 > 2.\n\nKiritish (stdin):\n- 1-qator: `n`. Keyingi `n` qator: `nom>=kerakli_versiya`.\n- Keyingi qator: `m`. Keyingi `m` qator: `nom==o'rnatilgan_versiya`.\n\nVersiya nuqta bilan ajratilgan butun sonlardan iborat, bo'laklar soni har xil bo'lishi mumkin (`13.7` va `13.7.0` — teng versiyalar: qisqasiga nol qo'shiladi).\n\nHar bir talab uchun berilgan tartibda bitta qator chiqaring:\n- paket o'rnatilmagan bo'lsa: `nom: o'rnatilmagan`\n- o'rnatilgan versiya kerakligidan katta yoki teng bo'lsa: `nom: yaroqli (O)`\n- eski bo'lsa: `nom: eski (O < K)`\n\nOxirida `Yangilash kerak: K` — yaroqli bo'lmaganlar soni.\n\nMisol — kiritish:\n```\n3\nflask>=2.0.0\nrequests>=2.31.0\npytest>=7.0.0\n2\nflask==2.1.3\nrequests==2.28.1\n```\nChiqish:\n```\nflask: yaroqli (2.1.3)\nrequests: eski (2.28.1 < 2.31.0)\npytest: o'rnatilmagan\nYangilash kerak: 2\n```",
    "starterCodePy": "# Versiyani nuqta bo'yicha bo'lib, butun sonlar ro'yxatiga aylantiring.\n# Ro'yxatlar uzunligi har xil bo'lsa, qisqasining oxiriga 0 qo'shing.\n",
    "testCases": [
      {
        "stdin": "3\nflask>=2.0.0\nrequests>=2.31.0\npytest>=7.0.0\n2\nflask==2.1.3\nrequests==2.28.1\n",
        "expectedStdout": "flask: yaroqli (2.1.3)\nrequests: eski (2.28.1 < 2.31.0)\npytest: o'rnatilmagan\nYangilash kerak: 2\n",
        "hidden": false,
        "label": "Misoldagi tekshiruv to'g'ri"
      },
      {
        "stdin": "2\nblack>=24.1\nnumpy>=1.26.4\n2\nblack==24.1.0\nnumpy==1.26.4\n",
        "expectedStdout": "black: yaroqli (24.1.0)\nnumpy: yaroqli (1.26.4)\nYangilash kerak: 0\n",
        "hidden": false,
        "label": "Hammasi yaroqli"
      },
      {
        "stdin": "3\ndjango>=4.2\npandas>=2.0.1\nurllib3>=2\n2\ndjango==4.10.0\npandas==2.0.0\n",
        "expectedStdout": "django: yaroqli (4.10.0)\npandas: eski (2.0.0 < 2.0.1)\nurllib3: o'rnatilmagan\nYangilash kerak: 2\n",
        "hidden": true,
        "label": "Ko'p bo'lakli va bir bo'lakli versiyalar"
      },
      {
        "stdin": "1\nrich>=13.7.0\n1\nrich==13.7\n",
        "expectedStdout": "rich: yaroqli (13.7)\nYangilash kerak: 0\n",
        "hidden": true,
        "label": "Uzunligi har xil, lekin teng versiyalar"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-35",
    "key": "backend-dars-35-easy",
    "title": "snake_case ga o'tkazish",
    "difficulty": "EASY",
    "points": 10,
    "tags": [
      "python",
      "pep8",
      "matn"
    ],
    "description": "PEP 8 ga ko'ra funksiya va o'zgaruvchi nomlari `snake_case` da yoziladi. `camelCase` nomlarni avtomatik tarjima qiluvchi dastur yozing.\n\nQoida (aynan shunday bajaring): nomni chapdan o'ngga ko'rib chiqing. Agar belgi katta harf bo'lsa va u birinchi belgi bo'lmasa, undan oldin `_` qo'ying. Keyin barcha harflarni kichik harfga o'tkazing.\n\nShu qoidaga ko'ra `HTTPServer` → `h_t_t_p_server` bo'ladi. Bu ataylab shunday — qoidani o'zgartirmang.\n\nKiritish (stdin): 1-qatorda `n`, keyin `n` ta nom (faqat lotin harflari va raqamlar).\nChiqish: har bir nomning o'zgartirilgan ko'rinishi, alohida qatorda.\n\nMisol — kiritish:\n```\n4\ngetUserName\nHTTPServer\nsalom\nCalculateTotalPrice\n```\nChiqish:\n```\nget_user_name\nh_t_t_p_server\nsalom\ncalculate_total_price\n```",
    "starterCodePy": "# Har bir nomni belgima-belgi ko'rib chiqing.\n# Katta harf oldiga (birinchisidan tashqari) '_' qo'ying va kichik harfga o'tkazing.\n",
    "testCases": [
      {
        "stdin": "4\ngetUserName\nHTTPServer\nsalom\nCalculateTotalPrice\n",
        "expectedStdout": "get_user_name\nh_t_t_p_server\nsalom\ncalculate_total_price\n",
        "hidden": false,
        "label": "Misoldagi to'rt nom to'g'ri"
      },
      {
        "stdin": "3\nreadFile\nX\nuserID\n",
        "expectedStdout": "read_file\nx\nuser_i_d\n",
        "hidden": false,
        "label": "Bitta harfli va qisqa nomlar"
      },
      {
        "stdin": "2\nalreadysnake\nABC\n",
        "expectedStdout": "alreadysnake\na_b_c\n",
        "hidden": true,
        "label": "Allaqachon kichik harfli va butunlay katta harfli nomlar"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-35",
    "key": "backend-dars-35-medium",
    "title": "Oddiy PEP 8 tekshiruvchi",
    "difficulty": "MEDIUM",
    "points": 20,
    "tags": [
      "python",
      "pep8",
      "linter"
    ],
    "description": "`flake8` kabi kichik tekshiruvchi yozing. Kod qatorlari berilgan, siz PEP 8 ning 3 ta qoidasini tekshirasiz.\n\nKiritish (stdin): 1-qatorda `n`, keyin `n` ta kod qatori (ular bo'sh ham bo'lishi mumkin, oxirida bo'sh joy yoki tab bo'lishi mumkin).\n\nHar bir qator uchun quyidagi tekshiruvlarni SHU tartibda bajaring va topilgan har bir xato uchun alohida qator chiqaring — `qator L: xabar` (L — 1 dan boshlangan qator raqami):\n1. Qator uzunligi 79 belgidan katta bo'lsa → `79 belgidan uzun`\n2. Qatorda tab belgisi bo'lsa → `tab ishlatilgan`\n3. Qator bo'sh joy yoki tab bilan tugasa → `oxirida bo'sh joy`\n\nBitta qatorda bir nechta xato bo'lsa, hammasini shu tartibda chiqaring. Oxirida `Xatolar: K` — topilgan xatolarning umumiy soni.\n\nMisol — kiritish (2-qator tab bilan tugagan, 3-qator bo'sh joylar bilan tugagan):\n```\n4\ndef salom():\n    ism = input()<TAB>\nprint(ism)···\n    return ism\n```\nChiqish:\n```\nqator 2: tab ishlatilgan\nqator 2: oxirida bo'sh joy\nqator 3: oxirida bo'sh joy\nXatolar: 3\n```\n(`<TAB>` va `···` — bu yerda ko'rinishi uchun yozilgan, haqiqiy kiritishda oddiy tab va bo'sh joylar bo'ladi.)\n\nDiqqat: qatorlarni `input()` bilan o'qisangiz oxiridagi bo'sh joylar saqlanadi — ularni o'chirib yubormang.",
    "starterCodePy": "# n ta kod qatorini o'qing (oxiridagi bo'sh joylarni saqlagan holda!).\n# Har bir qatorni 3 ta qoida bo'yicha tekshiring va xatolarni sanang.\n",
    "testCases": [
      {
        "stdin": "4\ndef salom():\n    ism = input()\t\nprint(ism)   \n    return ism\n",
        "expectedStdout": "qator 2: tab ishlatilgan\nqator 2: oxirida bo'sh joy\nqator 3: oxirida bo'sh joy\nXatolar: 3\n",
        "hidden": false,
        "label": "Misoldagi kod bo'lagi"
      },
      {
        "stdin": "3\nx = 1\ny = 2\nz = 3\n",
        "expectedStdout": "Xatolar: 0\n",
        "hidden": false,
        "label": "Toza kod — xatosiz"
      },
      {
        "stdin": "2\nx = 12345678901234567890123456789012345678901234567890123456789012345678901234567890\n\tprint(1)\t\n",
        "expectedStdout": "qator 1: 79 belgidan uzun\nqator 2: tab ishlatilgan\nqator 2: oxirida bo'sh joy\nXatolar: 3\n",
        "hidden": true,
        "label": "Juda uzun qator va tab bilan chekinish"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-35",
    "key": "backend-dars-35-hard",
    "title": "Type hints yetishmayapti",
    "difficulty": "HARD",
    "points": 35,
    "tags": [
      "python",
      "type-hints",
      "parsing"
    ],
    "description": "Funksiya sarlavhalari (`def ...:` qatorlari) berilgan. Har birida type hints to'liq qo'yilganini tekshiring.\n\nKiritish (stdin): 1-qatorda `n`, keyin `n` ta `def` qatori. Har bir qator `def nom(...)` ko'rinishida va `:` bilan tugaydi. Parametrlarda standart qiymat (`=`) bo'lmaydi, annotatsiyalarda qavs bo'lmaydi.\n\nHar bir funksiya uchun bitta qator chiqaring:\n- Barcha parametrlarda `:` bilan tur ko'rsatilgan VA `->` bilan qaytish turi ko'rsatilgan bo'lsa: `nom: to'liq`\n- Aks holda: `nom: yetishmaydi -> ` va yetishmayotganlar ro'yxati `, ` bilan ajratib. Avval turi ko'rsatilmagan parametr nomlari (berilgan tartibda), agar qaytish turi ham yo'q bo'lsa oxirida `qaytish` so'zi.\n\nOxirida `To'liq: K / N` — to'liq annotatsiyalangan funksiyalar soni va umumiy soni.\n\nMisol — kiritish:\n```\n3\ndef yigindi(a: int, b: int) -> int:\ndef salom(ism):\ndef hech():\n```\nChiqish:\n```\nyigindi: to'liq\nsalom: yetishmaydi -> ism, qaytish\nhech: yetishmaydi -> qaytish\nTo'liq: 1 / 3\n```",
    "starterCodePy": "# Har bir def qatoridan funksiya nomini, qavs ichidagi parametrlarni\n# va qavsdan keyingi qismni ajratib oling.\n# Parametrni ',' bo'yicha bo'ling, har birida ':' bor-yo'qligini tekshiring.\n",
    "testCases": [
      {
        "stdin": "3\ndef yigindi(a: int, b: int) -> int:\ndef salom(ism):\ndef hech():\n",
        "expectedStdout": "yigindi: to'liq\nsalom: yetishmaydi -> ism, qaytish\nhech: yetishmaydi -> qaytish\nTo'liq: 1 / 3\n",
        "hidden": false,
        "label": "Misoldagi uchta funksiya"
      },
      {
        "stdin": "2\ndef bol(a: float, b) -> float:\ndef nomi(x: str) -> str:\n",
        "expectedStdout": "bol: yetishmaydi -> b\nnomi: to'liq\nTo'liq: 1 / 2\n",
        "hidden": false,
        "label": "Qisman annotatsiyalangan funksiyalar"
      },
      {
        "stdin": "2\n  def toza(a: int, b: str, c: bool) -> None:\ndef kop(a, b, c):\n",
        "expectedStdout": "toza: to'liq\nkop: yetishmaydi -> a, b, c, qaytish\nTo'liq: 1 / 2\n",
        "hidden": true,
        "label": "Chekinishli qator va uch parametrli annotatsiyasiz funksiya"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-36",
    "key": "backend-dars-36-easy",
    "title": "Kitob klassi",
    "difficulty": "EASY",
    "points": 10,
    "tags": [
      "python",
      "oop",
      "class"
    ],
    "description": "Kutubxona tizimining birinchi g'ishti — `Kitob` klassi.\n\n`Kitob` klassini yozing: `__init__` da `nom`, `muallif`, `yil` atributlari saqlansin va `info()` metodi kitob haqidagi matnni QAYTARSIN (chiqarmasin).\n\nKiritish (stdin): 1-qatorda `n`, keyin `n` ta qator `nom|muallif|yil` ko'rinishida.\n\nHar bir kitob uchun `info()` natijasini quyidagi formatda chiqaring:\n`«nom» — muallif (yil)`\n\nOxirida `Jami kitoblar: n`.\n\nMisol — kiritish:\n```\n3\nO'tkan kunlar|Abdulla Qodiriy|1926\nSariq devni minib|Xudoyberdi To'xtaboyev|1975\nShum bola|G'afur G'ulom|1936\n```\nChiqish:\n```\n«O'tkan kunlar» — Abdulla Qodiriy (1926)\n«Sariq devni minib» — Xudoyberdi To'xtaboyev (1975)\n«Shum bola» — G'afur G'ulom (1936)\nJami kitoblar: 3\n```\n\nDiqqat: qo'shtirnoqlar — `«` va `»` belgilari, chiziqcha esa uzun tire `—`. Ularni to'g'ri nusxalang.",
    "starterCodePy": "class Kitob:\n    def __init__(self, nom, muallif, yil):\n        # atributlarni saqlang\n        pass\n\n    def info(self):\n        # «nom» — muallif (yil) ko'rinishidagi matnni QAYTARING\n        pass\n\n# n ta kitobni o'qing, obyekt yarating va info() ni chiqaring.\n",
    "testCases": [
      {
        "stdin": "3\nO'tkan kunlar|Abdulla Qodiriy|1926\nSariq devni minib|Xudoyberdi To'xtaboyev|1975\nShum bola|G'afur G'ulom|1936\n",
        "expectedStdout": "«O'tkan kunlar» — Abdulla Qodiriy (1926)\n«Sariq devni minib» — Xudoyberdi To'xtaboyev (1975)\n«Shum bola» — G'afur G'ulom (1936)\nJami kitoblar: 3\n",
        "hidden": false,
        "label": "Misoldagi uchta kitob"
      },
      {
        "stdin": "1\nMehrobdan chayon|Abdulla Qodiriy|1929\n",
        "expectedStdout": "«Mehrobdan chayon» — Abdulla Qodiriy (1929)\nJami kitoblar: 1\n",
        "hidden": false,
        "label": "Bitta kitob"
      },
      {
        "stdin": "2\nQutadg'u bilig|Yusuf Xos Hojib|1069\nBoburnoma|Zahiriddin Bobur|1530\n",
        "expectedStdout": "«Qutadg'u bilig» — Yusuf Xos Hojib (1069)\n«Boburnoma» — Zahiriddin Bobur (1530)\nJami kitoblar: 2\n",
        "hidden": true,
        "label": "Boshqa kitoblar bilan tekshiruv"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-36",
    "key": "backend-dars-36-medium",
    "title": "Kutubxona: qidiruv va band qilish",
    "difficulty": "MEDIUM",
    "points": 20,
    "tags": [
      "python",
      "oop",
      "crud"
    ],
    "description": "Endi kitoblarni boshqaruvchi tizim yozing. Har bir kitobning `band` holati bor — boshida hammasi bo'sh.\n\nKiritish (stdin):\n- 1-qator: `n`, keyin `n` ta qator `nom|muallif|yil`.\n- Keyingi qator: `m`, keyin `m` ta buyruq.\n\nBuyruqlar (buyruq nomi va argument bitta bo'sh joy bilan ajratilgan):\n- `QIDIR so'z` — nomida shu so'z qatnashgan (katta-kichik harf farqsiz) kitoblarni ro'yxatdagi tartibda `Topildi: nom` ko'rinishida chiqaring. Bitta ham topilmasa: `Topilmadi: so'z`.\n- `BAND nom` — nomi AYNAN mos kitobni band qiling. Kitob yo'q bo'lsa: `Kitob yo'q: nom`. Allaqachon band bo'lsa: `Allaqachon band: nom`. Aks holda band qiling va `Band qilindi: nom`.\n- `QAYTAR nom` — kitobni qaytaring. Kitob yo'q bo'lsa: `Kitob yo'q: nom`. Band bo'lmasa: `Band emas: nom`. Aks holda bo'shating va `Qaytarildi: nom`.\n\nBarcha buyruqlardan keyin oxirgi qator: `Bo'sh kitoblar: K` — band bo'lmagan kitoblar soni.\n\nMisol — kiritish:\n```\n3\nO'tkan kunlar|Abdulla Qodiriy|1926\nShum bola|G'afur G'ulom|1936\nSariq devni minib|Xudoyberdi To'xtaboyev|1975\n4\nQIDIR kunlar\nBAND Shum bola\nBAND Shum bola\nQAYTAR Shum bola\n```\nChiqish:\n```\nTopildi: O'tkan kunlar\nBand qilindi: Shum bola\nAllaqachon band: Shum bola\nQaytarildi: Shum bola\nBo'sh kitoblar: 3\n```",
    "starterCodePy": "# Kitob va Kutubxona klasslarini yozing.\n# Kutubxona ichida kitoblar ro'yxati va qidir/band/qaytar metodlari bo'lsin.\n# Buyruqni nom va argumentga ajratish uchun split(\" \", 1) qulay.\n",
    "testCases": [
      {
        "stdin": "3\nO'tkan kunlar|Abdulla Qodiriy|1926\nShum bola|G'afur G'ulom|1936\nSariq devni minib|Xudoyberdi To'xtaboyev|1975\n4\nQIDIR kunlar\nBAND Shum bola\nBAND Shum bola\nQAYTAR Shum bola\n",
        "expectedStdout": "Topildi: O'tkan kunlar\nBand qilindi: Shum bola\nAllaqachon band: Shum bola\nQaytarildi: Shum bola\nBo'sh kitoblar: 3\n",
        "hidden": false,
        "label": "Misoldagi to'rt buyruq"
      },
      {
        "stdin": "2\nBoburnoma|Zahiriddin Bobur|1530\nDevoni lug'otit turk|Mahmud Koshg'ariy|1074\n3\nQIDIR olma\nBAND Yo'q kitob\nQAYTAR Boburnoma\n",
        "expectedStdout": "Topilmadi: olma\nKitob yo'q: Yo'q kitob\nBand emas: Boburnoma\nBo'sh kitoblar: 2\n",
        "hidden": false,
        "label": "Topilmagan va band bo'lmagan holatlar"
      },
      {
        "stdin": "3\nAlisher|A|1900\nalisher navoiy|B|1901\nBobur|C|1902\n3\nQIDIR ALISHER\nBAND alisher navoiy\nQIDIR bob\n",
        "expectedStdout": "Topildi: Alisher\nTopildi: alisher navoiy\nBand qilindi: alisher navoiy\nTopildi: Bobur\nBo'sh kitoblar: 2\n",
        "hidden": true,
        "label": "Katta-kichik harf farqsiz qidiruv"
      },
      {
        "stdin": "1\nShum bola|G'afur G'ulom|1936\n2\nBAND Shum bola\nQIDIR shum\n",
        "expectedStdout": "Band qilindi: Shum bola\nTopildi: Shum bola\nBo'sh kitoblar: 0\n",
        "hidden": true,
        "label": "Barcha kitoblar band bo'lib qolgan holat"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-36",
    "key": "backend-dars-36-hard",
    "title": "Kutubxona hisoboti",
    "difficulty": "HARD",
    "points": 35,
    "tags": [
      "python",
      "oop",
      "hisobot"
    ],
    "description": "Kutubxona bo'yicha hisobot tayyorlang.\n\nKiritish (stdin): 1-qatorda `n`, keyin `n` ta qator `nom|muallif|yil|holat`, bunda `holat` — `bor` yoki `band`.\n\nChiqish aynan quyidagi tartibda:\n1. `Mualliflar:` qatori, keyin har bir muallif uchun `muallif — K ta`. Tartib: kitoblari soni bo'yicha kamayish tartibida, soni teng bo'lsa muallif nomi bo'yicha alifbo tartibida.\n2. `O'n yilliklar:` qatori, keyin har bir o'n yillik uchun `YYY0-yillar — K ta`. O'n yillik = yilning butun qismi (masalan 1926 → 1920). Faqat kitobi bor o'n yilliklar, yil bo'yicha o'sish tartibida.\n3. `Band: X / N` — band kitoblar soni va umumiy soni.\n\nMisol — kiritish:\n```\n5\nO'tkan kunlar|Abdulla Qodiriy|1926|band\nMehrobdan chayon|Abdulla Qodiriy|1929|bor\nShum bola|G'afur G'ulom|1936|bor\nSariq devni minib|Xudoyberdi To'xtaboyev|1975|band\nYillar shamoli|G'afur G'ulom|1971|bor\n```\nChiqish:\n```\nMualliflar:\nAbdulla Qodiriy — 2 ta\nG'afur G'ulom — 2 ta\nXudoyberdi To'xtaboyev — 1 ta\nO'n yilliklar:\n1920-yillar — 2 ta\n1930-yillar — 1 ta\n1970-yillar — 2 ta\nBand: 2 / 5\n```",
    "starterCodePy": "# Mualliflar va o'n yilliklarni lug'atda sanang.\n# Saralashda sorted(..., key=lambda p: (-p[1], p[0])) qulay keladi.\n",
    "testCases": [
      {
        "stdin": "5\nO'tkan kunlar|Abdulla Qodiriy|1926|band\nMehrobdan chayon|Abdulla Qodiriy|1929|bor\nShum bola|G'afur G'ulom|1936|bor\nSariq devni minib|Xudoyberdi To'xtaboyev|1975|band\nYillar shamoli|G'afur G'ulom|1971|bor\n",
        "expectedStdout": "Mualliflar:\nAbdulla Qodiriy — 2 ta\nG'afur G'ulom — 2 ta\nXudoyberdi To'xtaboyev — 1 ta\nO'n yilliklar:\n1920-yillar — 2 ta\n1930-yillar — 1 ta\n1970-yillar — 2 ta\nBand: 2 / 5\n",
        "hidden": false,
        "label": "Misoldagi besh kitob"
      },
      {
        "stdin": "2\nBoburnoma|Zahiriddin Bobur|1530|bor\nDevon|Alisher Navoiy|1498|bor\n",
        "expectedStdout": "Mualliflar:\nAlisher Navoiy — 1 ta\nZahiriddin Bobur — 1 ta\nO'n yilliklar:\n1490-yillar — 1 ta\n1530-yillar — 1 ta\nBand: 0 / 2\n",
        "hidden": false,
        "label": "Har bir muallifda bittadan kitob"
      },
      {
        "stdin": "3\nA|X|2001|band\nB|X|2011|band\nC|Y|2019|band\n",
        "expectedStdout": "Mualliflar:\nX — 2 ta\nY — 1 ta\nO'n yilliklar:\n2000-yillar — 1 ta\n2010-yillar — 2 ta\nBand: 3 / 3\n",
        "hidden": true,
        "label": "Hamma kitob band, o'n yilliklar chegarasi"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-37",
    "key": "backend-dars-37-easy",
    "title": "Commit xabarini ajratish",
    "difficulty": "EASY",
    "points": 10,
    "tags": [
      "python",
      "git",
      "matn"
    ],
    "description": "Conventional Commits qoidasiga ko'ra commit xabari `tur: tavsif` ko'rinishida yoziladi — masalan `feat: savatga qo'shish tugmasi`.\n\nKiritish (stdin): 1-qatorda `n`, keyin `n` ta commit xabari.\n\nHar bir xabar uchun bitta qator chiqaring:\n- Xabarda `\": \"` (ikki nuqta va undan keyin bo'sh joy) bo'lsa, uni BIRINCHI uchragan joyidan ikkiga bo'ling va `tur=T | tavsif=D` ko'rinishida chiqaring.\n- Aks holda: `noto'g'ri format`.\n\nMisol — kiritish:\n```\n4\nfeat: savatga qo'shish tugmasi\nfix: login xatosi tuzatildi\noddiy xabar\nchore: paketlar yangilandi\n```\nChiqish:\n```\ntur=feat | tavsif=savatga qo'shish tugmasi\ntur=fix | tavsif=login xatosi tuzatildi\nnoto'g'ri format\ntur=chore | tavsif=paketlar yangilandi\n```",
    "starterCodePy": "# Har bir xabarda \": \" bor-yo'qligini tekshiring.\n# split(\": \", 1) faqat birinchi uchragan joydan bo'ladi.\n",
    "testCases": [
      {
        "stdin": "4\nfeat: savatga qo'shish tugmasi\nfix: login xatosi tuzatildi\noddiy xabar\nchore: paketlar yangilandi\n",
        "expectedStdout": "tur=feat | tavsif=savatga qo'shish tugmasi\ntur=fix | tavsif=login xatosi tuzatildi\nnoto'g'ri format\ntur=chore | tavsif=paketlar yangilandi\n",
        "hidden": false,
        "label": "Misoldagi to'rt xabar"
      },
      {
        "stdin": "2\ndocs: README to'ldirildi\nfeat:probel yo'q\n",
        "expectedStdout": "tur=docs | tavsif=README to'ldirildi\nnoto'g'ri format\n",
        "hidden": false,
        "label": "Ikki nuqtadan keyin bo'sh joy yo'q"
      },
      {
        "stdin": "3\nrefactor: funksiya ikkiga bo'lindi\ntest: yangi testlar: qo'shildi\n: tur yo'q\n",
        "expectedStdout": "tur=refactor | tavsif=funksiya ikkiga bo'lindi\ntur=test | tavsif=yangi testlar: qo'shildi\ntur= | tavsif=tur yo'q\n",
        "hidden": true,
        "label": "Tavsif ichida yana ikki nuqta bor"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-37",
    "key": "backend-dars-37-medium",
    "title": "Commit xabarlarini tekshiruvchi",
    "difficulty": "MEDIUM",
    "points": 20,
    "tags": [
      "python",
      "git",
      "tekshiruv"
    ],
    "description": "Jamoa commit xabarlarini avtomatik tekshiradigan dastur yozing.\n\nKiritish (stdin): 1-qatorda `n`, keyin `n` ta commit xabari.\n\nHar bir xabarni SHU tartibda tekshiring va BIRINCHI buzilgan qoidada to'xtang:\n1. Xabarda `\": \"` yo'q → `format noto'g'ri`\n2. Turi bu ro'yxatda yo'q — `feat`, `fix`, `docs`, `refactor`, `test`, `chore` → `noma'lum tur`\n3. Tavsif katta harf bilan boshlangan → `tavsif kichik harf bilan boshlanishi kerak`\n4. Tavsif nuqta bilan tugagan → `oxirida nuqta`\n5. Butun xabar uzunligi 72 belgidan katta → `72 belgidan uzun`\n\nHar bir xabar uchun bitta qator chiqaring: qoida buzilmagan bo'lsa `L: OK`, aks holda `L: XATO — sabab`. Bu yerda `L` — 1 dan boshlangan xabar raqami, ajratuvchi belgi — uzun tire `—`.\n\nOxirida `To'g'ri: K / N`.\n\nMisol — kiritish:\n```\n5\nfeat: savatga qo'shish tugmasi\nFix: login xatosi\nfeat: Katta harf bilan\nfix: nuqta bilan tugadi.\nqandaydir xabar\n```\nChiqish:\n```\n1: OK\n2: XATO — noma'lum tur\n3: XATO — tavsif kichik harf bilan boshlanishi kerak\n4: XATO — oxirida nuqta\n5: XATO — format noto'g'ri\nTo'g'ri: 1 / 5\n```",
    "starterCodePy": "TURLAR = [\"feat\", \"fix\", \"docs\", \"refactor\", \"test\", \"chore\"]\n\n# Har bir xabarni yuqoridagi tartibda tekshiring va birinchi xatoda to'xtang.\n",
    "testCases": [
      {
        "stdin": "5\nfeat: savatga qo'shish tugmasi\nFix: login xatosi\nfeat: Katta harf bilan\nfix: nuqta bilan tugadi.\nqandaydir xabar\n",
        "expectedStdout": "1: OK\n2: XATO — noma'lum tur\n3: XATO — tavsif kichik harf bilan boshlanishi kerak\n4: XATO — oxirida nuqta\n5: XATO — format noto'g'ri\nTo'g'ri: 1 / 5\n",
        "hidden": false,
        "label": "Misoldagi besh xabar"
      },
      {
        "stdin": "3\nchore: paketlar yangilandi\ndocs: readme to'ldirildi\ntest: yangi testlar qo'shildi\n",
        "expectedStdout": "1: OK\n2: OK\n3: OK\nTo'g'ri: 3 / 3\n",
        "hidden": false,
        "label": "Hammasi to'g'ri yozilgan"
      },
      {
        "stdin": "2\nfeat: aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\nfixed: tur ro'yxatda yo'q\n",
        "expectedStdout": "1: XATO — 72 belgidan uzun\n2: XATO — noma'lum tur\nTo'g'ri: 0 / 2\n",
        "hidden": true,
        "label": "Juda uzun xabar va notanish tur"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-38",
    "key": "backend-dars-38-easy",
    "title": "Konflikt belgilarini sanash",
    "difficulty": "EASY",
    "points": 10,
    "tags": [
      "python",
      "git",
      "merge"
    ],
    "description": "Merge paytida konflikt yuz berganda Git faylga uchta belgi qo'yadi: `<<<<<<<` bilan boshlanadigan qator, `=======` bilan boshlanadigan qator va `>>>>>>>` bilan boshlanadigan qator.\n\nKiritish (stdin): 1-qatorda `n`, keyin `n` ta fayl qatori.\n\nChiqish aynan 2 qator:\n```\nKonfliktlar: K\nToza qatorlar: M\n```\nBunda `K` — `<<<<<<<` bilan boshlanadigan qatorlar soni, `M` — yuqoridagi uchta belgining birortasi bilan HAM boshlanmaydigan qatorlar soni.\n\nMisol — kiritish:\n```\n7\nsalom = 1\n<<<<<<< HEAD\nprint(salom)\n=======\nprint(salom + 1)\n>>>>>>> yangi\nchiqish = 0\n```\nChiqish:\n```\nKonfliktlar: 1\nToza qatorlar: 4\n```",
    "starterCodePy": "# startswith() yordamida uchta belgini aniqlang va sanang.\n",
    "testCases": [
      {
        "stdin": "7\nsalom = 1\n<<<<<<< HEAD\nprint(salom)\n=======\nprint(salom + 1)\n>>>>>>> yangi\nchiqish = 0\n",
        "expectedStdout": "Konfliktlar: 1\nToza qatorlar: 4\n",
        "hidden": false,
        "label": "Misoldagi bitta konflikt"
      },
      {
        "stdin": "3\nx = 1\ny = 2\nz = 3\n",
        "expectedStdout": "Konfliktlar: 0\nToza qatorlar: 3\n",
        "hidden": false,
        "label": "Konfliktsiz toza fayl"
      },
      {
        "stdin": "9\n<<<<<<< HEAD\na = 1\n=======\na = 2\n>>>>>>> b\nqator\n<<<<<<< HEAD\nb = 3\n=======\n",
        "expectedStdout": "Konfliktlar: 2\nToza qatorlar: 4\n",
        "hidden": true,
        "label": "Ikkita blok, ikkinchisi tugallanmagan"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-38",
    "key": "backend-dars-38-medium",
    "title": "Konfliktni hal qilish",
    "difficulty": "MEDIUM",
    "points": 20,
    "tags": [
      "python",
      "git",
      "merge"
    ],
    "description": "Konflikt belgilarini qo'lda o'chirish o'rniga, buni dastur qilsin.\n\nKiritish (stdin):\n- 1-qator: `MENING` yoki `ULARNING` — qaysi tomonni saqlash kerakligi.\n- 2-qator: `n` — fayl qatorlari soni.\n- Keyingi `n` qator: faylning o'zi.\n\nKonflikt bloki shunday ko'rinadi: `<<<<<<<` qatori, keyin MENING tomonim qatorlari, keyin `=======` qatori, keyin ULARNING tomoni qatorlari, keyin `>>>>>>>` qatori.\n\nChiqish: hal qilingan fayl — konflikt belgilari olib tashlanadi, tanlangan tomon qatorlari qoladi, ikkinchi tomon o'chiriladi. Blokdan tashqaridagi qatorlar o'zgarmaydi. Blokning tanlangan tomoni bo'sh bo'lishi ham mumkin.\n\nOxirgi qator: `Hal qilindi: K` — nechta konflikt bloki bo'lgani (`<<<<<<<` qatorlari soni).\n\nMisol — kiritish:\n```\nMENING\n7\nsalom = 1\n<<<<<<< HEAD\nprint(salom)\n=======\nprint(salom + 1)\n>>>>>>> yangi\nchiqish = 0\n```\nChiqish:\n```\nsalom = 1\nprint(salom)\nchiqish = 0\nHal qilindi: 1\n```",
    "starterCodePy": "# Qatorlarni ketma-ket ko'rib chiqing va hozir qayerdaligingizni eslab turing:\n# blokdan tashqarida / mening tomonim / ularning tomoni.\n",
    "testCases": [
      {
        "stdin": "MENING\n7\nsalom = 1\n<<<<<<< HEAD\nprint(salom)\n=======\nprint(salom + 1)\n>>>>>>> yangi\nchiqish = 0\n",
        "expectedStdout": "salom = 1\nprint(salom)\nchiqish = 0\nHal qilindi: 1\n",
        "hidden": false,
        "label": "Misoldagi MENING tanlovi"
      },
      {
        "stdin": "ULARNING\n7\nsalom = 1\n<<<<<<< HEAD\nprint(salom)\n=======\nprint(salom + 1)\n>>>>>>> yangi\nchiqish = 0\n",
        "expectedStdout": "salom = 1\nprint(salom + 1)\nchiqish = 0\nHal qilindi: 1\n",
        "hidden": false,
        "label": "Xuddi shu fayl, ULARNING tanlovi"
      },
      {
        "stdin": "MENING\n3\nx = 1\ny = 2\nz = 3\n",
        "expectedStdout": "x = 1\ny = 2\nz = 3\nHal qilindi: 0\n",
        "hidden": true,
        "label": "Konfliktsiz fayl o'zgarishsiz qoladi"
      },
      {
        "stdin": "ULARNING\n10\n<<<<<<< HEAD\na = 1\na = 2\n=======\na = 3\n>>>>>>> b\nO'rtada\n<<<<<<< HEAD\n=======\nb = 9\n",
        "expectedStdout": "a = 3\nO'rtada\nb = 9\nHal qilindi: 2\n",
        "hidden": true,
        "label": "Ko'p qatorli va bo'sh tomonli bloklar"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-40",
    "key": "backend-dars-40-easy",
    "title": "SELECT: barcha talabalar",
    "difficulty": "EASY",
    "points": 10,
    "tags": [
      "sql",
      "select",
      "sqlite"
    ],
    "description": "Baza `talabalar` jadvalidan iborat: `ism` (TEXT), `yosh` (INTEGER), `ball` (INTEGER).\n\nBoshlang'ich kodda baza stdin dan o'qilgan ma'lumot bilan to'ldiriladi va so'rov natijasi chiqariladi — u qismga tegmang. Siz faqat `SO_ROV` ichidagi SQL so'rovni yozasiz.\n\nNatijaning har bir qatori ustunlar ` | ` (bo'sh joy, tik chiziq, bo'sh joy) bilan ajratib chiqariladi. Ustunlar tartibi so'rovingizdagi tartib bilan bir xil bo'ladi.\n\nVazifa: `talabalar` jadvalidan `ism` va `ball` ustunlarini tanlang va natijani `ism` bo'yicha alifbo tartibida (A→Z) chiqaring. `SELECT *` ishlatmang — kerakli ustunlarni aniq yozing.\n\nMisol — kiritish:\n```\n5\nDiyor,17,88\nAli,16,54\nBobur,18,72\nSarvar,17,72\nZilola,15,95\n```\nChiqish:\n```\nAli | 54\nBobur | 72\nDiyor | 88\nSarvar | 72\nZilola | 95\n```",
    "starterCodePy": "import sqlite3\nimport sys\n\n# --- Baza tayyorlanadi (bu qismga tegmang) ---\nqatorlar = sys.stdin.read().split(\"\\n\")\nn = int(qatorlar[0])\nconn = sqlite3.connect(\":memory:\")\nconn.execute(\"CREATE TABLE talabalar (ism TEXT, yosh INTEGER, ball INTEGER)\")\nfor i in range(1, n + 1):\n    ism, yosh, ball = qatorlar[i].strip().split(\",\")\n    conn.execute(\"INSERT INTO talabalar VALUES (?, ?, ?)\", (ism, int(yosh), int(ball)))\n\n# --- Faqat shu SQL so'rovni yozing ---\nSO_ROV = \"\"\"\nSELECT ism, ball FROM talabalar\n\"\"\"\n\n# --- Natija chiqariladi (bu qismga ham tegmang) ---\nfor qator in conn.execute(SO_ROV):\n    print(\" | \".join(str(x) for x in qator))\n",
    "testCases": [
      {
        "stdin": "5\nDiyor,17,88\nAli,16,54\nBobur,18,72\nSarvar,17,72\nZilola,15,95\n",
        "expectedStdout": "Ali | 54\nBobur | 72\nDiyor | 88\nSarvar | 72\nZilola | 95\n",
        "hidden": false,
        "label": "Misoldagi besh talaba"
      },
      {
        "stdin": "3\nAli,16,40\nBobur,17,59\nDiyor,18,60\n",
        "expectedStdout": "Ali | 40\nBobur | 59\nDiyor | 60\n",
        "hidden": false,
        "label": "Uch talaba"
      },
      {
        "stdin": "1\nSarvar,19,100\n",
        "expectedStdout": "Sarvar | 100\n",
        "hidden": true,
        "label": "Bitta talaba"
      },
      {
        "stdin": "6\nAmir,15,90\nBek,16,90\nCharos,17,45\nDilnoza,18,90\nEldor,19,99\nFarrux,16,61\n",
        "expectedStdout": "Amir | 90\nBek | 90\nCharos | 45\nDilnoza | 90\nEldor | 99\nFarrux | 61\n",
        "hidden": true,
        "label": "Ballari takrorlangan ro'yxat"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-40",
    "key": "backend-dars-40-medium",
    "title": "WHERE: imtihondan o'tganlar",
    "difficulty": "MEDIUM",
    "points": 20,
    "tags": [
      "sql",
      "where",
      "order-by"
    ],
    "description": "Baza `talabalar` jadvalidan iborat: `ism` (TEXT), `yosh` (INTEGER), `ball` (INTEGER).\n\nBoshlang'ich kodda baza stdin dan o'qilgan ma'lumot bilan to'ldiriladi va so'rov natijasi chiqariladi — u qismga tegmang. Siz faqat `SO_ROV` ichidagi SQL so'rovni yozasiz.\n\nNatijaning har bir qatori ustunlar ` | ` (bo'sh joy, tik chiziq, bo'sh joy) bilan ajratib chiqariladi. Ustunlar tartibi so'rovingizdagi tartib bilan bir xil bo'ladi.\n\nVazifa: `ball` qiymati 60 dan kichik bo'lmagan talabalarning `ism` va `ball` ustunlarini tanlang. Natija ball bo'yicha kamayish tartibida (katta balldan kichigiga) chiqsin; ballari teng bo'lsa `ism` bo'yicha alifbo tartibida.\n\nMisol — kiritish:\n```\n5\nDiyor,17,88\nAli,16,54\nBobur,18,72\nSarvar,17,72\nZilola,15,95\n```\nChiqish:\n```\nZilola | 95\nDiyor | 88\nBobur | 72\nSarvar | 72\n```",
    "starterCodePy": "import sqlite3\nimport sys\n\n# --- Baza tayyorlanadi (bu qismga tegmang) ---\nqatorlar = sys.stdin.read().split(\"\\n\")\nn = int(qatorlar[0])\nconn = sqlite3.connect(\":memory:\")\nconn.execute(\"CREATE TABLE talabalar (ism TEXT, yosh INTEGER, ball INTEGER)\")\nfor i in range(1, n + 1):\n    ism, yosh, ball = qatorlar[i].strip().split(\",\")\n    conn.execute(\"INSERT INTO talabalar VALUES (?, ?, ?)\", (ism, int(yosh), int(ball)))\n\n# --- Faqat shu SQL so'rovni yozing ---\nSO_ROV = \"\"\"\nSELECT ism, ball FROM talabalar\n\"\"\"\n\n# --- Natija chiqariladi (bu qismga ham tegmang) ---\nfor qator in conn.execute(SO_ROV):\n    print(\" | \".join(str(x) for x in qator))\n",
    "testCases": [
      {
        "stdin": "5\nDiyor,17,88\nAli,16,54\nBobur,18,72\nSarvar,17,72\nZilola,15,95\n",
        "expectedStdout": "Zilola | 95\nDiyor | 88\nBobur | 72\nSarvar | 72\n",
        "hidden": false,
        "label": "Misoldagi filtr to'g'ri ishladi"
      },
      {
        "stdin": "3\nAli,16,40\nBobur,17,59\nDiyor,18,60\n",
        "expectedStdout": "Diyor | 60\n",
        "hidden": false,
        "label": "Chegaradagi qiymatlar (59 va 60)"
      },
      {
        "stdin": "1\nSarvar,19,100\n",
        "expectedStdout": "Sarvar | 100\n",
        "hidden": true,
        "label": "Bitta talaba o'tdi"
      },
      {
        "stdin": "6\nAmir,15,90\nBek,16,90\nCharos,17,45\nDilnoza,18,90\nEldor,19,99\nFarrux,16,61\n",
        "expectedStdout": "Eldor | 99\nAmir | 90\nBek | 90\nDilnoza | 90\nFarrux | 61\n",
        "hidden": true,
        "label": "Teng ballar alifbo bo'yicha tartiblandi"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-40",
    "key": "backend-dars-40-hard",
    "title": "ORDER BY va LIMIT: eng yaxshi uchlik",
    "difficulty": "HARD",
    "points": 35,
    "tags": [
      "sql",
      "order-by",
      "limit"
    ],
    "description": "Baza `talabalar` jadvalidan iborat: `ism` (TEXT), `yosh` (INTEGER), `ball` (INTEGER).\n\nBoshlang'ich kodda baza stdin dan o'qilgan ma'lumot bilan to'ldiriladi va so'rov natijasi chiqariladi — u qismga tegmang. Siz faqat `SO_ROV` ichidagi SQL so'rovni yozasiz.\n\nNatijaning har bir qatori ustunlar ` | ` (bo'sh joy, tik chiziq, bo'sh joy) bilan ajratib chiqariladi. Ustunlar tartibi so'rovingizdagi tartib bilan bir xil bo'ladi.\n\nVazifa: yoshi 16 dan 18 gacha (16 va 18 ham kiradi) bo'lgan talabalar orasidan eng yuqori ballilarini toping. `ism`, `yosh`, `ball` ustunlarini shu tartibda tanlang, ball bo'yicha kamayish tartibida saralang (ballari teng bo'lsa `ism` bo'yicha alifbo tartibida) va faqat birinchi 3 tasini chiqaring.\n\nAgar shartga mos talaba bo'lmasa, hech narsa chiqmaydi — bu ham to'g'ri natija.\n\nMisol — kiritish:\n```\n5\nDiyor,17,88\nAli,16,54\nBobur,18,72\nSarvar,17,72\nZilola,15,95\n```\nChiqish:\n```\nDiyor | 17 | 88\nBobur | 18 | 72\nSarvar | 17 | 72\n```",
    "starterCodePy": "import sqlite3\nimport sys\n\n# --- Baza tayyorlanadi (bu qismga tegmang) ---\nqatorlar = sys.stdin.read().split(\"\\n\")\nn = int(qatorlar[0])\nconn = sqlite3.connect(\":memory:\")\nconn.execute(\"CREATE TABLE talabalar (ism TEXT, yosh INTEGER, ball INTEGER)\")\nfor i in range(1, n + 1):\n    ism, yosh, ball = qatorlar[i].strip().split(\",\")\n    conn.execute(\"INSERT INTO talabalar VALUES (?, ?, ?)\", (ism, int(yosh), int(ball)))\n\n# --- Faqat shu SQL so'rovni yozing ---\nSO_ROV = \"\"\"\nSELECT ism, ball FROM talabalar\n\"\"\"\n\n# --- Natija chiqariladi (bu qismga ham tegmang) ---\nfor qator in conn.execute(SO_ROV):\n    print(\" | \".join(str(x) for x in qator))\n",
    "testCases": [
      {
        "stdin": "5\nDiyor,17,88\nAli,16,54\nBobur,18,72\nSarvar,17,72\nZilola,15,95\n",
        "expectedStdout": "Diyor | 17 | 88\nBobur | 18 | 72\nSarvar | 17 | 72\n",
        "hidden": false,
        "label": "Misoldagi uchlik to'g'ri"
      },
      {
        "stdin": "3\nAli,16,40\nBobur,17,59\nDiyor,18,60\n",
        "expectedStdout": "Diyor | 18 | 60\nBobur | 17 | 59\nAli | 16 | 40\n",
        "hidden": false,
        "label": "Uchala talaba ham shartga mos"
      },
      {
        "stdin": "1\nSarvar,19,100\n",
        "expectedStdout": "",
        "hidden": true,
        "label": "Yosh chegarasidan chiqqan yagona talaba"
      },
      {
        "stdin": "6\nAmir,15,90\nBek,16,90\nCharos,17,45\nDilnoza,18,90\nEldor,19,99\nFarrux,16,61\n",
        "expectedStdout": "Bek | 16 | 90\nDilnoza | 18 | 90\nFarrux | 16 | 61\n",
        "hidden": true,
        "label": "Teng ballar va uchtadan ortiq nomzod"
      }
    ]
  },
];
