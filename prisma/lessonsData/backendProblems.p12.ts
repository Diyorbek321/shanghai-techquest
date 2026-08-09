/**
 * Hand-authored practice problems for backend lessons 90-96 (Oy-8, yakuniy loyiha va karyera).
 *
 * Grading is exact-output, so every `expectedStdout` below was captured from a real run of a
 * reference solution on the Piston sandbox (python 3.10.0) against the matching `stdin` — none of
 * them are written from memory.
 *
 * Lessons 94 (Portfolio & CV), 95 (Intervyuga tayyorgarlik) and 96 (Bitiruv) intentionally have NO
 * problems: a stdin/stdout test cannot honestly verify a README, a CV, a spoken interview answer or
 * a graduation presentation. Those lessons keep their rubric-graded homework assignment, which is
 * the right tool for them.
 *
 * Lessons 90-93 are project lessons about Django/DRF/deploy, so the problems here deliberately
 * target the pure-Python logic underneath each topic: the ownership filter behind IDOR protection,
 * the throttling window, a miniature test runner and coverage report, N+1 detection in a query log,
 * and log/smoke-test reporting after a deploy.
 */
import type { LessonProblemRecord } from './types';

export const backendProblemsP12: LessonProblemRecord[] = [
  {
    "lessonKey": "backend-dars-90",
    "key": "backend-dars-90-easy",
    "title": "Faqat o'z yozuvlaringiz",
    "difficulty": "EASY",
    "points": 10,
    "tags": [
      "python",
      "xavfsizlik",
      "filtr"
    ],
    "description": "IDOR — foydalanuvchi boshqaning ma'lumotini ko'rib qolishi. Eng ishonchli himoya — ro'yxatni har doim egasi bo'yicha filtrlash. Shu filtrni sof Python'da yozamiz.\n\nKirish (stdin):\n1-qator: `n` — yozuvlar soni.\nKeyingi `n` qator: `id egasi sarlavha` (uchtasi ham bo'sh joysiz bitta so'z).\nOxirgi qator: joriy foydalanuvchi nomi.\n\nChiqish: joriy foydalanuvchiga tegishli har bir yozuv uchun `id sarlavha` ko'rinishida bitta qator — kiritilgan tartibda. Agar unga tegishli yozuv bo'lmasa, faqat `Ma'lumot yo'q` chiqaring.\n\nMisol — kirish:\n```\n3\n1 ali Kitob\n2 vali Daftar\n3 ali Ruchka\nali\n```\nChiqish:\n```\n1 Kitob\n3 Ruchka\n```",
    "starterCodePy": "# Yozuvlarni o'qing va faqat joriy foydalanuvchiga tegishlilarini chiqaring.\n# Bittasi ham topilmasa: Ma'lumot yo'q\nn = int(input())\n",
    "testCases": [
      {
        "stdin": "3\n1 ali Kitob\n2 vali Daftar\n3 ali Ruchka\nali\n",
        "expectedStdout": "1 Kitob\n3 Ruchka\n",
        "hidden": false,
        "label": "Namunadagi ro'yxat to'g'ri filtrlandi"
      },
      {
        "stdin": "4\n7 dilnoza Hisobot\n8 sardor Reja\n9 dilnoza Chek\n10 dilnoza Xat\ndilnoza\n",
        "expectedStdout": "7 Hisobot\n9 Chek\n10 Xat\n",
        "hidden": false,
        "label": "Boshqa foydalanuvchi yozuvlari chiqmadi"
      },
      {
        "stdin": "2\n1 ali Kitob\n2 vali Daftar\nsevara\n",
        "expectedStdout": "Ma'lumot yo'q\n",
        "hidden": true,
        "label": "Yozuvi yo'q foydalanuvchi holati"
      },
      {
        "stdin": "1\n5 ali Yagona\nali\n",
        "expectedStdout": "5 Yagona\n",
        "hidden": true,
        "label": "Bitta yozuvli ro'yxat"
      },
      {
        "stdin": "3\n1 ali A\n2 ali B\n3 ali C\nali\n",
        "expectedStdout": "1 A\n2 B\n3 C\n",
        "hidden": true,
        "label": "Barcha yozuvlar bitta egaga tegishli"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-90",
    "key": "backend-dars-90-medium",
    "title": "403 emas, 404",
    "difficulty": "MEDIUM",
    "points": 20,
    "tags": [
      "python",
      "xavfsizlik",
      "idor"
    ],
    "description": "Begona obyektga murojaat qilinganda 403 qaytarish obyekt mavjudligini oshkor qiladi. Shuning uchun begona obyekt uchun ham 404 qaytariladi. Shu qarorni chiqaruvchi funksiyani yozing.\n\nKirish (stdin):\n1-qator: `n` — yozuvlar soni.\nKeyingi `n` qator: `id egasi`.\nUndan keyin: `m` — so'rovlar soni.\nKeyingi `m` qator: `foydalanuvchi id`.\n\nHar bir so'rov uchun alohida qatorda `200` chiqaring — agar shunday `id` mavjud BO'LSA va uning egasi so'rov yuborgan foydalanuvchi bo'lsa. Boshqa barcha holatlarda (`id` yo'q yoki egasi boshqa odam) `404` chiqaring.\n\nMisol — kirish:\n```\n2\n10 ali\n11 vali\n3\nali 10\nali 11\nvali 99\n```\nChiqish:\n```\n200\n404\n404\n```",
    "starterCodePy": "# Yozuvlar egalarini lug'atga yig'ing, keyin har bir so'rov uchun 200 yoki 404 chiqaring.\n# Begona yozuv uchun ham 404 — 403 emas.\nn = int(input())\n",
    "testCases": [
      {
        "stdin": "2\n10 ali\n11 vali\n3\nali 10\nali 11\nvali 99\n",
        "expectedStdout": "200\n404\n404\n",
        "hidden": false,
        "label": "Namunadagi uchta so'rov"
      },
      {
        "stdin": "3\n1 sardor\n2 sardor\n3 dilnoza\n4\nsardor 1\ndilnoza 3\ndilnoza 1\nsardor 3\n",
        "expectedStdout": "200\n200\n404\n404\n",
        "hidden": false,
        "label": "Har bir so'rov alohida tekshirildi"
      },
      {
        "stdin": "1\n7 ali\n2\nali 8\nvali 7\n",
        "expectedStdout": "404\n404\n",
        "hidden": true,
        "label": "Mavjud bo'lmagan va begona yozuv"
      },
      {
        "stdin": "2\n5 ali\n6 ali\n3\nali 5\nali 6\nali 5\n",
        "expectedStdout": "200\n200\n200\n",
        "hidden": true,
        "label": "Takroriy so'rovlar"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-90",
    "key": "backend-dars-90-hard",
    "title": "Throttling: sirg'aluvchi oyna",
    "difficulty": "HARD",
    "points": 35,
    "tags": [
      "python",
      "throttling",
      "xavfsizlik"
    ],
    "description": "Throttling — bitta foydalanuvchining haddan ortiq so'rov yuborishidan himoya. Sirg'aluvchi oyna qoidasini yozing.\n\nKirish (stdin):\n1-qator: `limit oyna` — bitta foydalanuvchi uchun ruxsat etilgan so'rovlar soni va oyna uzunligi (sekundda).\n2-qator: `n` — so'rovlar soni.\nKeyingi `n` qator: `vaqt foydalanuvchi` (vaqt — butun son, so'rovlar vaqt bo'yicha o'sish tartibida).\n\nHar bir so'rovni kelgan tartibda ko'rib chiqing. So'rov vaqti `t` bo'lsin. Agar shu foydalanuvchining QABUL QILINGAN so'rovlari orasida vaqti `t - oyna` dan KATTA bo'lganlari soni `limit` dan kichik bo'lsa — so'rov qabul qilinadi, `OK` chiqaring va uni qabul qilinganlar ro'yxatiga qo'shing. Aks holda `429` chiqaring va uni ro'yxatga QO'SHMANG (rad etilgan so'rov keyingi hisobda qatnashmaydi).\n\nMisol — kirish:\n```\n2 10\n5\n1 ali\n2 ali\n3 ali\n12 ali\n13 vali\n```\nChiqish:\n```\nOK\nOK\n429\nOK\nOK\n```\nIzoh: `t=3` da `ali` ning oyna ichida 2 ta qabul qilingan so'rovi bor — limit to'lgan. `t=12` da esa 1 va 2 vaqtlari oynadan chiqib ketgan.",
    "starterCodePy": "# Har bir foydalanuvchi uchun qabul qilingan so'rovlar vaqtini saqlang.\n# Oyna ichidagilar soni limitdan kichik bo'lsa OK, aks holda 429.\nlimit, oyna = [int(x) for x in input().split()]\n",
    "testCases": [
      {
        "stdin": "2 10\n5\n1 ali\n2 ali\n3 ali\n12 ali\n13 vali\n",
        "expectedStdout": "OK\nOK\n429\nOK\nOK\n",
        "hidden": false,
        "label": "Namunadagi so'rovlar oqimi"
      },
      {
        "stdin": "1 5\n4\n1 ali\n2 ali\n7 ali\n8 ali\n",
        "expectedStdout": "OK\n429\nOK\n429\n",
        "hidden": false,
        "label": "Limit 1 bo'lganda"
      },
      {
        "stdin": "1 5\n2\n1 ali\n6 ali\n",
        "expectedStdout": "OK\nOK\n",
        "hidden": true,
        "label": "Oyna chegarasidagi so'rov"
      },
      {
        "stdin": "2 4\n6\n1 ali\n1 vali\n2 ali\n2 vali\n3 ali\n3 vali\n",
        "expectedStdout": "OK\nOK\nOK\nOK\n429\n429\n",
        "hidden": true,
        "label": "Ikki foydalanuvchi aralash"
      },
      {
        "stdin": "3 100\n3\n1 ali\n2 ali\n3 ali\n",
        "expectedStdout": "OK\nOK\nOK\n",
        "hidden": true,
        "label": "Limitdan kam so'rov"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-91",
    "key": "backend-dars-91-easy",
    "title": "Kichkina test yuruvchi",
    "difficulty": "EASY",
    "points": 10,
    "tags": [
      "python",
      "test",
      "hisobot"
    ],
    "description": "Har qanday test kutubxonasining yuragi oddiy: kutilgan qiymatni olingan qiymat bilan solishtirish va hisobot chiqarish. Shu yuruvchini o'zingiz yozing.\n\nKirish (stdin):\n1-qator: `n` — testlar soni.\nKeyingi `n` qator: `nom kutilgan olingan` (uchtasi ham bo'sh joysiz bitta so'z).\n\nHar bir test uchun bitta qator chiqaring:\n- qiymatlar teng bo'lsa: `nom: PASS`\n- teng bo'lmasa: `nom: FAIL (kutilgan=K, olingan=O)`\n\nOxirida yakuniy qator: `Natija: X/N o'tdi`, bu yerda `X` — o'tgan testlar soni.\n\nMisol — kirish:\n```\n3\nsum_test 5 5\ndiv_test 2 3\nneg_test -1 -1\n```\nChiqish:\n```\nsum_test: PASS\ndiv_test: FAIL (kutilgan=2, olingan=3)\nneg_test: PASS\nNatija: 2/3 o'tdi\n```",
    "starterCodePy": "# Har bir test uchun PASS yoki FAIL chiqaring, oxirida umumiy natijani yozing.\nn = int(input())\n",
    "testCases": [
      {
        "stdin": "3\nsum_test 5 5\ndiv_test 2 3\nneg_test -1 -1\n",
        "expectedStdout": "sum_test: PASS\ndiv_test: FAIL (kutilgan=2, olingan=3)\nneg_test: PASS\nNatija: 2/3 o'tdi\n",
        "hidden": false,
        "label": "Namunadagi uchta test"
      },
      {
        "stdin": "2\nlogin_test 200 200\ntoken_test abc abc\n",
        "expectedStdout": "login_test: PASS\ntoken_test: PASS\nNatija: 2/2 o'tdi\n",
        "hidden": false,
        "label": "Barcha testlar o'tdi"
      },
      {
        "stdin": "2\na_test 1 2\nb_test x y\n",
        "expectedStdout": "a_test: FAIL (kutilgan=1, olingan=2)\nb_test: FAIL (kutilgan=x, olingan=y)\nNatija: 0/2 o'tdi\n",
        "hidden": true,
        "label": "Barcha testlar yiqildi"
      },
      {
        "stdin": "1\nyagona_test 0 0\n",
        "expectedStdout": "yagona_test: PASS\nNatija: 1/1 o'tdi\n",
        "hidden": true,
        "label": "Bitta testli holat"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-91",
    "key": "backend-dars-91-medium",
    "title": "Qamrov hisoboti",
    "difficulty": "MEDIUM",
    "points": 20,
    "tags": [
      "python",
      "test",
      "coverage"
    ],
    "description": "Coverage hisoboti — qaysi qatorlar testlar davomida bajarilganini ko'rsatadi. Shu hisobotni yozing.\n\nKirish (stdin):\n1-qator: `n` — fayldagi qatorlar soni (qatorlar 1 dan `n` gacha raqamlangan).\n2-qator: bajarilgan qator raqamlari, bo'sh joy bilan ajratilgan. Raqamlar tartibsiz bo'lishi va takrorlanishi mumkin; ularning hammasi 1 va `n` orasida. Kamida bitta raqam bo'ladi.\n\nAynan 3 qator chiqaring:\n1. `Qamrov: P%` — `P` = (noyob bajarilgan qatorlar soni / n) * 100, bitta kasr xonasi bilan (masalan `75.0`).\n2. `Qamralmagan: ...` — bajarilmagan qator raqamlari o'sish tartibida, bo'sh joy bilan. Bittasi ham bo'lmasa `Qamralmagan: yo'q`.\n3. `Natija: YETARLI` — agar `P` 80 dan kichik bo'lmasa, aks holda `Natija: YETARLI EMAS`.\n\nMisol — kirish:\n```\n8\n1 2 4 5 6 8\n```\nChiqish:\n```\nQamrov: 75.0%\nQamralmagan: 3 7\nNatija: YETARLI EMAS\n```",
    "starterCodePy": "# Foizni bitta kasr xonasi bilan chiqaring: format(foiz, '.1f')\n# Qamralmagan qatorlarni o'sish tartibida sanang.\nn = int(input())\nbajarilgan = set(int(x) for x in input().split())\n",
    "testCases": [
      {
        "stdin": "8\n1 2 4 5 6 8\n",
        "expectedStdout": "Qamrov: 75.0%\nQamralmagan: 3 7\nNatija: YETARLI EMAS\n",
        "hidden": false,
        "label": "Namunadagi qamrov hisobi"
      },
      {
        "stdin": "10\n1 2 3 4 5 6 7 8 9\n",
        "expectedStdout": "Qamrov: 90.0%\nQamralmagan: 10\nNatija: YETARLI\n",
        "hidden": false,
        "label": "Yuqori qamrov holati"
      },
      {
        "stdin": "5\n1 1 2 3 4 5\n",
        "expectedStdout": "Qamrov: 100.0%\nQamralmagan: yo'q\nNatija: YETARLI\n",
        "hidden": true,
        "label": "Takroriy raqamlar bor"
      },
      {
        "stdin": "5\n1 2 3 4\n",
        "expectedStdout": "Qamrov: 80.0%\nQamralmagan: 5\nNatija: YETARLI\n",
        "hidden": true,
        "label": "Chegaradagi qiymat"
      },
      {
        "stdin": "4\n2\n",
        "expectedStdout": "Qamrov: 25.0%\nQamralmagan: 1 3 4\nNatija: YETARLI EMAS\n",
        "hidden": true,
        "label": "Juda past qamrov"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-92",
    "key": "backend-dars-92-easy",
    "title": "So'rovlar jurnalini sanash",
    "difficulty": "EASY",
    "points": 10,
    "tags": [
      "python",
      "sql",
      "optimizatsiya"
    ],
    "description": "`connection.queries` bitta so'rov davomida bazaga yuborilgan SQL so'rovlarni saqlaydi. Optimizatsiya doim shu jurnalni sanashdan boshlanadi.\n\nKirish (stdin):\n1-qator: `n` — jurnaldagi so'rovlar soni.\nKeyingi `n` qator: SQL so'rov matni (ichida bo'sh joylar bo'lishi mumkin — qatorni bo'lmang).\n\nAynan 2 qator chiqaring:\n```\nJami so'rov: <n>\nNoyob so'rov: <bir-biridan farq qiladigan so'rovlar soni>\n```\nSo'rovlar aynan bir xil matn bo'lsagina bir xil hisoblanadi.\n\nMisol — kirish:\n```\n5\nSELECT * FROM author\nSELECT * FROM book WHERE author_id = 1\nSELECT * FROM author\nSELECT * FROM book WHERE author_id = 1\nSELECT * FROM tag\n```\nChiqish:\n```\nJami so'rov: 5\nNoyob so'rov: 3\n```",
    "starterCodePy": "# So'rovlarni ro'yxatga yig'ing, keyin jami va noyob sonini chiqaring.\nn = int(input())\n",
    "testCases": [
      {
        "stdin": "5\nSELECT * FROM author\nSELECT * FROM book WHERE author_id = 1\nSELECT * FROM author\nSELECT * FROM book WHERE author_id = 1\nSELECT * FROM tag\n",
        "expectedStdout": "Jami so'rov: 5\nNoyob so'rov: 3\n",
        "hidden": false,
        "label": "Namunadagi so'rovlar jurnali"
      },
      {
        "stdin": "3\nSELECT * FROM book\nSELECT * FROM tag\nSELECT * FROM author\n",
        "expectedStdout": "Jami so'rov: 3\nNoyob so'rov: 3\n",
        "hidden": false,
        "label": "Barcha so'rovlar har xil"
      },
      {
        "stdin": "4\nSELECT 1\nSELECT 1\nSELECT 1\nSELECT 1\n",
        "expectedStdout": "Jami so'rov: 4\nNoyob so'rov: 1\n",
        "hidden": true,
        "label": "Barcha so'rovlar bir xil"
      },
      {
        "stdin": "1\nSELECT * FROM book\n",
        "expectedStdout": "Jami so'rov: 1\nNoyob so'rov: 1\n",
        "hidden": true,
        "label": "Bitta so'rovli jurnal"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-92",
    "key": "backend-dars-92-medium",
    "title": "N+1 ni jurnaldan topish",
    "difficulty": "MEDIUM",
    "points": 20,
    "tags": [
      "python",
      "sql",
      "n+1"
    ],
    "description": "N+1 muammosining izi jurnalda shunday ko'rinadi: bitta so'rov shakli faqat ID bilan farq qilib ko'p marta takrorlanadi. Shu shakllarni topadigan tekshiruvchi yozing.\n\nKirish (stdin):\n1-qator: `n` — jurnaldagi so'rovlar soni.\nKeyingi `n` qator: SQL so'rov matni.\n\nHar bir so'rovni SHAKLGA aylantiring: matndagi ketma-ket kelgan har bir raqamlar guruhi bitta `?` belgisiga almashtiriladi (`... id = 12` → `... id = ?`). Keyin bir xil shakllarni sanang.\n\n3 marta yoki undan ko'p uchragan har bir shakl uchun `<soni> x <shakl>` qatorini chiqaring. Tartib: avval soni ko'p bo'lgani, soni teng bo'lsa — shakl matni bo'yicha alifbo tartibida. Bunday shakl umuman topilmasa, faqat `N+1 topilmadi` chiqaring.\n\nMisol — kirish:\n```\n6\nSELECT * FROM author\nSELECT * FROM book WHERE author_id = 1\nSELECT * FROM book WHERE author_id = 2\nSELECT * FROM book WHERE author_id = 3\nSELECT * FROM tag WHERE id = 7\nSELECT * FROM tag WHERE id = 9\n```\nChiqish:\n```\n3 x SELECT * FROM book WHERE author_id = ?\n```",
    "starterCodePy": "# Raqamlarni ? ga almashtirish uchun re moduli qulay:\n# import re; shakl = re.sub(r\"\\d+\", \"?\", sorov)\nn = int(input())\n",
    "testCases": [
      {
        "stdin": "6\nSELECT * FROM author\nSELECT * FROM book WHERE author_id = 1\nSELECT * FROM book WHERE author_id = 2\nSELECT * FROM book WHERE author_id = 3\nSELECT * FROM tag WHERE id = 7\nSELECT * FROM tag WHERE id = 9\n",
        "expectedStdout": "3 x SELECT * FROM book WHERE author_id = ?\n",
        "hidden": false,
        "label": "Namunadagi jurnal"
      },
      {
        "stdin": "4\nSELECT * FROM book\nSELECT * FROM tag WHERE id = 1\nSELECT * FROM tag WHERE id = 2\nSELECT * FROM author WHERE id = 3\n",
        "expectedStdout": "N+1 topilmadi\n",
        "hidden": false,
        "label": "Shubhali takror yo'q"
      },
      {
        "stdin": "7\nSELECT * FROM b WHERE id = 1\nSELECT * FROM b WHERE id = 2\nSELECT * FROM b WHERE id = 3\nSELECT * FROM a WHERE id = 1\nSELECT * FROM a WHERE id = 2\nSELECT * FROM a WHERE id = 3\nSELECT * FROM c\n",
        "expectedStdout": "3 x SELECT * FROM a WHERE id = ?\n3 x SELECT * FROM b WHERE id = ?\n",
        "hidden": true,
        "label": "Bir xil sonli ikkita guruh"
      },
      {
        "stdin": "7\nSELECT * FROM x WHERE id = 10\nSELECT * FROM x WHERE id = 20\nSELECT * FROM x WHERE id = 30\nSELECT * FROM y WHERE id = 1\nSELECT * FROM y WHERE id = 2\nSELECT * FROM y WHERE id = 3\nSELECT * FROM y WHERE id = 4\n",
        "expectedStdout": "4 x SELECT * FROM y WHERE id = ?\n3 x SELECT * FROM x WHERE id = ?\n",
        "hidden": true,
        "label": "Ikkita guruh, soni har xil"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-93",
    "key": "backend-dars-93-easy",
    "title": "Loglarni darajaga ajratish",
    "difficulty": "EASY",
    "points": 10,
    "tags": [
      "python",
      "log",
      "deploy"
    ],
    "description": "Deploy'dan keyin birinchi ish — loglarni ochish. Ularni qo'lda o'qish o'rniga darajalar bo'yicha sanaymiz.\n\nKirish (stdin):\n1-qator: `n` — log qatorlari soni.\nKeyingi `n` qator: `SANA VAQT DARAJA xabar` ko'rinishida. Daraja — uchinchi so'z va u faqat `INFO`, `WARNING` yoki `ERROR` bo'ladi. Xabar ichida bo'sh joylar bo'lishi mumkin.\n\nAynan 3 qator chiqaring — shu tartibda, soni 0 bo'lsa ham:\n```\nINFO: <soni>\nWARNING: <soni>\nERROR: <soni>\n```\n\nMisol — kirish:\n```\n5\n2026-08-01 10:00:00 INFO Server ishga tushdi\n2026-08-01 10:00:05 ERROR Bazaga ulanmadi\n2026-08-01 10:00:07 INFO So'rov keldi\n2026-08-01 10:00:09 WARNING Sekin so'rov\n2026-08-01 10:00:11 ERROR Ichki xato\n```\nChiqish:\n```\nINFO: 2\nWARNING: 1\nERROR: 2\n```",
    "starterCodePy": "# Har bir qatorni bo'lib, uchinchi so'zni (darajani) sanang.\n# Uchala darajani ham chiqaring — hatto soni 0 bo'lsa ham.\nn = int(input())\n",
    "testCases": [
      {
        "stdin": "5\n2026-08-01 10:00:00 INFO Server ishga tushdi\n2026-08-01 10:00:05 ERROR Bazaga ulanmadi\n2026-08-01 10:00:07 INFO So'rov keldi\n2026-08-01 10:00:09 WARNING Sekin so'rov\n2026-08-01 10:00:11 ERROR Ichki xato\n",
        "expectedStdout": "INFO: 2\nWARNING: 1\nERROR: 2\n",
        "hidden": false,
        "label": "Namunadagi jurnal"
      },
      {
        "stdin": "3\n2026-08-01 09:00:00 INFO Boshlandi\n2026-08-01 09:00:01 INFO Tayyor\n2026-08-01 09:00:02 WARNING Sekin javob\n",
        "expectedStdout": "INFO: 2\nWARNING: 1\nERROR: 0\n",
        "hidden": false,
        "label": "ERROR yo'q holat"
      },
      {
        "stdin": "2\n2026-08-01 08:00:00 ERROR Xato bir\n2026-08-01 08:00:01 ERROR Xato ikki\n",
        "expectedStdout": "INFO: 0\nWARNING: 0\nERROR: 2\n",
        "hidden": true,
        "label": "Faqat xatolar"
      },
      {
        "stdin": "1\n2026-08-01 07:00:00 INFO Yolg'iz qator\n",
        "expectedStdout": "INFO: 1\nWARNING: 0\nERROR: 0\n",
        "hidden": true,
        "label": "Bitta qatorli jurnal"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-93",
    "key": "backend-dars-93-medium",
    "title": "Smoke test hisoboti",
    "difficulty": "MEDIUM",
    "points": 20,
    "tags": [
      "python",
      "deploy",
      "smoke-test"
    ],
    "description": "Smoke test — deploy'dan keyin asosiy endpointlarni birma-bir chaqirib, javob kodini tekshirish. Natijalarni hisobotga aylantiring.\n\nKirish (stdin):\n1-qator: `n` — tekshirilgan so'rovlar soni.\nKeyingi `n` qator: `METOD /yo'l KOD` (masalan `GET /api/health 200`).\n\nChiqish:\n1. `Muvaffaqiyatli: X/N` — `X` — kodi 200 dan 399 gacha (399 ham kiradi) bo'lgan so'rovlar soni.\n2. Muvaffaqiyatsiz har bir so'rov uchun kiritilgan tartibda `Xato: METOD /yo'l KOD` qatori.\n3. Yakuniy qator: bitta ham xato bo'lmasa `Smoke test: MUVAFFAQIYATLI`, aks holda `Smoke test: MUVAFFAQIYATSIZ`.\n\nMisol — kirish:\n```\n4\nGET /api/health 200\nGET /api/books 500\nPOST /api/books 201\nGET /api/docs 404\n```\nChiqish:\n```\nMuvaffaqiyatli: 2/4\nXato: GET /api/books 500\nXato: GET /api/docs 404\nSmoke test: MUVAFFAQIYATSIZ\n```",
    "starterCodePy": "# 200-399 oralig'idagi kodlar muvaffaqiyatli hisoblanadi.\n# Avval umumiy hisob, keyin xato qatorlari, oxirida yakuniy xulosa.\nn = int(input())\n",
    "testCases": [
      {
        "stdin": "4\nGET /api/health 200\nGET /api/books 500\nPOST /api/books 201\nGET /api/docs 404\n",
        "expectedStdout": "Muvaffaqiyatli: 2/4\nXato: GET /api/books 500\nXato: GET /api/docs 404\nSmoke test: MUVAFFAQIYATSIZ\n",
        "hidden": false,
        "label": "Namunadagi smoke test"
      },
      {
        "stdin": "3\nGET /api/health 200\nGET /api/books 200\nPOST /api/books 201\n",
        "expectedStdout": "Muvaffaqiyatli: 3/3\nSmoke test: MUVAFFAQIYATLI\n",
        "hidden": false,
        "label": "Barcha so'rovlar muvaffaqiyatli"
      },
      {
        "stdin": "2\nGET /old 301\nGET /new 200\n",
        "expectedStdout": "Muvaffaqiyatli: 2/2\nSmoke test: MUVAFFAQIYATLI\n",
        "hidden": true,
        "label": "Yo'naltirish holati"
      },
      {
        "stdin": "1\nGET /api/health 503\n",
        "expectedStdout": "Muvaffaqiyatli: 0/1\nXato: GET /api/health 503\nSmoke test: MUVAFFAQIYATSIZ\n",
        "hidden": true,
        "label": "Yagona so'rov yiqildi"
      },
      {
        "stdin": "3\nGET /a 400\nGET /b 401\nGET /c 404\n",
        "expectedStdout": "Muvaffaqiyatli: 0/3\nXato: GET /a 400\nXato: GET /b 401\nXato: GET /c 404\nSmoke test: MUVAFFAQIYATSIZ\n",
        "hidden": true,
        "label": "Barcha so'rovlar yiqildi"
      }
    ]
  }
];
