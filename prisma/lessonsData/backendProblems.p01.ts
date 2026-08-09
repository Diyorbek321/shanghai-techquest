/**
 * Hand-authored practice problems for backend lessons 13-19 (Oy-2, "Python chuqurroq").
 *
 * Grading is exact-output, so every `expectedStdout` below was captured by actually running a
 * reference solution on the Piston sandbox (python 3.10.0) against the matching `stdin` —
 * none of them are written from memory.
 */
import type { LessonProblemRecord } from './types';

export const backendProblemsP01: LessonProblemRecord[] = [
  {
    "lessonKey": "backend-dars-13",
    "key": "backend-dars-13-easy",
    "title": "Telefon kitobidan raqam olish",
    "difficulty": "EASY",
    "points": 10,
    "tags": [
      "python",
      "dictionary",
      "kalit"
    ],
    "description": "Kodingizda ANIQ shu telefon kitobini yarating:\n\n```python\nkitob = {\"Ali\": \"901234567\", \"Malika\": \"935556677\", \"Bexruz\": \"977778899\"}\n```\n\nSo'ng `input()` bilan bitta qatorda ism o'qing (ism har doim kitobda bor) va uning raqamini shu ko'rinishda chiqaring:\n\n`<ism> -> <raqam>`\n\nMisol. Kiritish:\n```\nAli\n```\nNatija:\n```\nAli -> 901234567\n```\n\nDiqqat: `input()` ichiga savol matni yozmang — u ham ekranga chiqib, javob xato bo'ladi. Raqamlar matn (string) sifatida saqlangan, ularni `int()` ga aylantirmang.",
    "starterCodePy": "# Telefon kitobini yarating (topshiriqdagi 3 ta kontakt bilan)\nkitob = {\"Ali\": \"901234567\", \"Malika\": \"935556677\", \"Bexruz\": \"977778899\"}\n\n# Ismni o'qing va kitobdan raqamini toping\n# ism = input()\n# print(...)\n",
    "testCases": [
      {
        "stdin": "Ali\n",
        "expectedStdout": "Ali -> 901234567\n",
        "hidden": false,
        "label": "Namunadagi misol"
      },
      {
        "stdin": "Malika\n",
        "expectedStdout": "Malika -> 935556677\n",
        "hidden": false,
        "label": "Ikkinchi kontakt"
      },
      {
        "stdin": "Bexruz\n",
        "expectedStdout": "Bexruz -> 977778899\n",
        "hidden": true,
        "label": "Kitobning oxirgi kaliti"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-13",
    "key": "backend-dars-13-medium",
    "title": "Kitobga yangi kontakt qo'shish",
    "difficulty": "MEDIUM",
    "points": 20,
    "tags": [
      "python",
      "dictionary",
      "qoshish"
    ],
    "description": "Kodingizda ANIQ shu telefon kitobidan boshlang:\n\n```python\nkitob = {\"Ali\": \"901234567\", \"Malika\": \"935556677\", \"Bexruz\": \"977778899\"}\n```\n\n`input()` bilan 2 ta qatorni o'qing: 1-qator — ism, 2-qator — raqam. Ularni kitobga `kitob[ism] = raqam` bilan yozing va ANIQ shu 2 qatorni chiqaring:\n\n```\nSaqlandi: <ism> - <raqam>\nJami: <kitobdagi kontaktlar soni>\n```\n\nMisol. Kiritish:\n```\nSardor\n909998877\n```\nNatija:\n```\nSaqlandi: Sardor - 909998877\nJami: 4\n```\n\nDiqqat: agar kiritilgan ism kitobda ALLAQACHON bo'lsa, yangi kalit qo'shilmaydi — eski raqam almashadi, ya'ni `Jami` o'zgarmaydi. Sonni `len()` bilan hisoblang.",
    "starterCodePy": "# Kitobni yarating\nkitob = {\"Ali\": \"901234567\", \"Malika\": \"935556677\", \"Bexruz\": \"977778899\"}\n\n# Ism va raqamni o'qing, kitobga yozing\n# Keyin 2 qator natijani chiqaring\n",
    "testCases": [
      {
        "stdin": "Sardor\n909998877\n",
        "expectedStdout": "Saqlandi: Sardor - 909998877\nJami: 4\n",
        "hidden": false,
        "label": "Namunadagi misol"
      },
      {
        "stdin": "Nodira\n944443322\n",
        "expectedStdout": "Saqlandi: Nodira - 944443322\nJami: 4\n",
        "hidden": false,
        "label": "Boshqa yangi kontakt"
      },
      {
        "stdin": "Ali\n900000000\n",
        "expectedStdout": "Saqlandi: Ali - 900000000\nJami: 3\n",
        "hidden": true,
        "label": "Kalit takrorlanganda"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-13",
    "key": "backend-dars-13-hard",
    "title": "Kitobni to'ldirib, qidirish",
    "difficulty": "HARD",
    "points": 35,
    "tags": [
      "python",
      "dictionary",
      "qidiruv"
    ],
    "description": "Telefon kitobini butunlay kiritishdan (stdin) yig'ing:\n\n1-qator — `n` soni (nechta kontakt bor).\nKeyingi `n` qator — har birida `ism raqam` ko'rinishida, orasida bitta bo'sh joy.\nOxirgi qator — qidirilayotgan ism.\n\nAgar ism kitobda bo'lsa `<ism>: <raqam>` deb chiqaring, bo'lmasa `Topilmadi` deb chiqaring. Faqat BITTA qator chiqadi.\n\nMisol. Kiritish:\n```\n3\nAli 901234567\nMalika 935556677\nBexruz 977778899\nMalika\n```\nNatija:\n```\nMalika: 935556677\n```\n\nMaslahat: qatorni `split()` bilan ikkiga ajrating, kalit borligini `in` bilan tekshiring — shunda `KeyError` chiqmaydi.",
    "starterCodePy": "# n ni o'qing, so'ng n ta qatorni lug'atga yig'ing\n# kitob = {}\n# n = int(input())\n# for i in range(n):\n#     qism = input().split()\n#     ...\n# Oxirida qidirilayotgan ismni o'qing va natijani chiqaring\n",
    "testCases": [
      {
        "stdin": "3\nAli 901234567\nMalika 935556677\nBexruz 977778899\nMalika\n",
        "expectedStdout": "Malika: 935556677\n",
        "hidden": false,
        "label": "Namunadagi misol"
      },
      {
        "stdin": "2\nAli 901234567\nSardor 909998877\nNodira\n",
        "expectedStdout": "Topilmadi\n",
        "hidden": false,
        "label": "Ism ro'yxatda yo'q"
      },
      {
        "stdin": "1\nAli 901234567\nAli\n",
        "expectedStdout": "Ali: 901234567\n",
        "hidden": true,
        "label": "Bitta kontaktli kitob"
      },
      {
        "stdin": "3\nAli 901234567\nAli 900000000\nMalika 935556677\nAli\n",
        "expectedStdout": "Ali: 900000000\n",
        "hidden": true,
        "label": "Bir ism ikki marta kiritilganda"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-14",
    "key": "backend-dars-14-easy",
    "title": "Narxlar jadvalini chiqarish",
    "difficulty": "EASY",
    "points": 10,
    "tags": [
      "python",
      "dictionary",
      "items"
    ],
    "description": "Narxlar ro'yxati kiritishdan (stdin) keladi:\n\n1-qator — `n` soni (nechta mahsulot bor).\nKeyingi `n` qator — har birida `nom narx` ko'rinishida, bo'sh joy bilan ajratilgan (nom ichida bo'sh joy yo'q, narx — butun son). Har bir nom faqat BIR marta uchraydi.\n\nBarcha juftliklarni `narxlar` nomli lug'atga yig'ing (`narxlar[nom] = int(narx)`), so'ng `for kalit, qiymat in narxlar.items():` sikli bilan har birini `<nom>: <narx>` ko'rinishida KIRITISHDAGI tartibda chiqaring. Eng oxirida `Mahsulotlar: <soni>` qatorini yozing — sonni `len(narxlar)` bilan oling.\n\nMisol. Kiritish:\n```\n3\nNon 4000\nSut 12000\nTuxum 18000\n```\nNatija:\n```\nNon: 4000\nSut: 12000\nTuxum: 18000\nMahsulotlar: 3\n```\n\nYana bir misol. Kiritish:\n```\n2\nOlma 9000\nAnor 15000\n```\nNatija:\n```\nOlma: 9000\nAnor: 15000\nMahsulotlar: 2\n```\n\nDiqqat: mahsulotlar soni har safar boshqacha bo'ladi — natijani kodga yozib qo'ymang, kiritishdan o'qing. `input()` ichiga savol matni yozmang.",
    "starterCodePy": "n = int(input())\nnarxlar = {}\n\n# n ta qatorni o'qing va lug'atga yozing\n# for _ in range(n):\n#     nom, narx = input().split()\n#     narxlar[nom] = int(narx)\n\n# items() bilan aylanib har bir juftlikni chiqaring\n# Oxirida len(narxlar) ni chiqaring\n",
    "testCases": [
      {
        "stdin": "3\nNon 4000\nSut 12000\nTuxum 18000\n",
        "expectedStdout": "Non: 4000\nSut: 12000\nTuxum: 18000\nMahsulotlar: 3\n",
        "hidden": false,
        "label": "Namunadagi uchta mahsulot"
      },
      {
        "stdin": "2\nOlma 9000\nAnor 15000\n",
        "expectedStdout": "Olma: 9000\nAnor: 15000\nMahsulotlar: 2\n",
        "hidden": false,
        "label": "Boshqa uzunlikdagi ro'yxat"
      },
      {
        "stdin": "4\nDaftar 5000\nRuchka 2000\nChizgich 1500\nQalam 3000\n",
        "expectedStdout": "Daftar: 5000\nRuchka: 2000\nChizgich: 1500\nQalam: 3000\nMahsulotlar: 4\n",
        "hidden": true,
        "label": "Uzunroq ro'yxat"
      },
      {
        "stdin": "1\nSut 12000\n",
        "expectedStdout": "Sut: 12000\nMahsulotlar: 1\n",
        "hidden": true,
        "label": "Chegaraviy holat"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-14",
    "key": "backend-dars-14-medium",
    "title": "Savatcha summasi",
    "difficulty": "MEDIUM",
    "points": 20,
    "tags": [
      "python",
      "dictionary",
      "get"
    ],
    "description": "Savatchani kiritishdan (stdin) o'qing:\n\n1-qator — `n` soni (nechta yozuv bor).\nKeyingi `n` qator — har birida `mahsulot narx` ko'rinishida (narx — butun son).\n\nBitta mahsulot bir necha marta uchrashi mumkin — u holda narxlari QO'SHILADI. Buning uchun `d[nom] = d.get(nom, 0) + narx` shaklidan foydalaning.\n\nAvval har bir mahsulotni BIRINCHI marta uchragan tartibida `<nom>: <jami narx>` ko'rinishida chiqaring, so'ng oxirgi qatorda umumiy summani `Jami: <summa>` deb chiqaring.\n\nMisol. Kiritish:\n```\n4\nNon 4000\nSut 12000\nNon 4000\nTuxum 18000\n```\nNatija:\n```\nNon: 8000\nSut: 12000\nTuxum: 18000\nJami: 38000\n```",
    "starterCodePy": "# n ni o'qing, so'ng har bir qatorni savatchaga qo'shing\n# savat = {}\n# nom, narx = input().split()\n# savat[nom] = savat.get(nom, 0) + int(narx)\n",
    "testCases": [
      {
        "stdin": "4\nNon 4000\nSut 12000\nNon 4000\nTuxum 18000\n",
        "expectedStdout": "Non: 8000\nSut: 12000\nTuxum: 18000\nJami: 38000\n",
        "hidden": false,
        "label": "Namunadagi misol"
      },
      {
        "stdin": "3\nOlma 9000\nAnor 15000\nUzum 22000\n",
        "expectedStdout": "Olma: 9000\nAnor: 15000\nUzum: 22000\nJami: 46000\n",
        "hidden": false,
        "label": "Takrorlanmaydigan savat"
      },
      {
        "stdin": "1\nNon 4000\n",
        "expectedStdout": "Non: 4000\nJami: 4000\n",
        "hidden": true,
        "label": "Bitta yozuv"
      },
      {
        "stdin": "5\nSut 12000\nSut 12000\nSut 12000\nNon 4000\nSut 12000\n",
        "expectedStdout": "Sut: 48000\nNon: 4000\nJami: 52000\n",
        "hidden": true,
        "label": "Bir mahsulot ko'p marta"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-14",
    "key": "backend-dars-14-hard",
    "title": "Eng yuqori va eng past ball",
    "difficulty": "HARD",
    "points": 35,
    "tags": [
      "python",
      "dictionary",
      "solishtirish"
    ],
    "description": "Talabalar ballarini kiritishdan (stdin) o'qing:\n\n1-qator — `n` soni (nechta talaba bor, `n >= 1`).\nKeyingi `n` qator — har birida `ism ball` ko'rinishida (ball — butun son). Ismlar takrorlanmaydi.\n\nMa'lumotni lug'atga yig'ing va ANIQ shu 2 qatorni chiqaring:\n\n```\nEng yuqori: <ism> (<ball>)\nEng past: <ism> (<ball>)\n```\n\nAgar bir nechta talaba bir xil ballga ega bo'lsa, kiritishda BIRINCHI uchraganini tanlang.\n\nMisol. Kiritish:\n```\n4\nAli 78\nMalika 95\nBexruz 61\nNodira 88\n```\nNatija:\n```\nEng yuqori: Malika (95)\nEng past: Bexruz (61)\n```",
    "starterCodePy": "# Ballarni lug'atga yig'ing, so'ng items() bilan aylanib eng katta va eng kichigini toping.\n# max() / min() ishlatmasdan, oddiy taqqoslash bilan yozing.\n",
    "testCases": [
      {
        "stdin": "4\nAli 78\nMalika 95\nBexruz 61\nNodira 88\n",
        "expectedStdout": "Eng yuqori: Malika (95)\nEng past: Bexruz (61)\n",
        "hidden": false,
        "label": "Namunadagi misol"
      },
      {
        "stdin": "3\nSardor 100\nOygul 45\nJasur 72\n",
        "expectedStdout": "Eng yuqori: Sardor (100)\nEng past: Oygul (45)\n",
        "hidden": false,
        "label": "Eng yuqori birinchi o'rinda"
      },
      {
        "stdin": "1\nAli 55\n",
        "expectedStdout": "Eng yuqori: Ali (55)\nEng past: Ali (55)\n",
        "hidden": true,
        "label": "Bitta talaba"
      },
      {
        "stdin": "4\nAli 70\nMalika 70\nBexruz 70\nNodira 70\n",
        "expectedStdout": "Eng yuqori: Ali (70)\nEng past: Ali (70)\n",
        "hidden": true,
        "label": "Barcha ballar teng"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-15",
    "key": "backend-dars-15-easy",
    "title": "Noyob sonlar",
    "difficulty": "EASY",
    "points": 10,
    "tags": [
      "python",
      "set",
      "dublikat"
    ],
    "description": "Bitta qatorda bo'sh joy bilan ajratilgan butun sonlar keladi (stdin). Ulardan takrorlanadiganlarini olib tashlang va ANIQ shu 2 qatorni chiqaring:\n\n1-qator: `Noyob: <noyob sonlar soni>`\n2-qator: noyob sonlar O'SISH tartibida, orasida bitta bo'sh joy bilan.\n\nMisol. Kiritish:\n```\n5 3 5 1 3 9\n```\nNatija:\n```\nNoyob: 4\n1 3 5 9\n```\n\nMaslahat: `set()` dublikatlarni yo'q qiladi, lekin tartibni saqlamaydi — shuning uchun natijani `list()` ga aylantirib, `.sort()` qiling. Chiqarishda `print(*royxat)` yoki `\" \".join(...)` dan foydalanishingiz mumkin.",
    "starterCodePy": "# Sonlarni o'qing\n# sonlar = input().split()\n# int() ga aylantiring, set bilan dublikatlarni oling, tartiblang va chiqaring\n",
    "testCases": [
      {
        "stdin": "5 3 5 1 3 9\n",
        "expectedStdout": "Noyob: 4\n1 3 5 9\n",
        "hidden": false,
        "label": "Namunadagi misol"
      },
      {
        "stdin": "10 20 30\n",
        "expectedStdout": "Noyob: 3\n10 20 30\n",
        "hidden": false,
        "label": "Dublikatsiz ro'yxat"
      },
      {
        "stdin": "7 7 7 7\n",
        "expectedStdout": "Noyob: 1\n7\n",
        "hidden": true,
        "label": "Barcha sonlar bir xil"
      },
      {
        "stdin": "4\n",
        "expectedStdout": "Noyob: 1\n4\n",
        "hidden": true,
        "label": "Bitta son"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-15",
    "key": "backend-dars-15-medium",
    "title": "Ikki ro'yxatdagi umumiy so'zlar",
    "difficulty": "MEDIUM",
    "points": 20,
    "tags": [
      "python",
      "set",
      "kesishma"
    ],
    "description": "Kiritishda (stdin) 2 qator keladi. Har bir qatorda bo'sh joy bilan ajratilgan so'zlar bor.\n\nIkkala qatorda ham uchraydigan so'zlarni toping va ularni ALIFBO tartibida, bitta qatorda, bo'sh joy bilan ajratib chiqaring. Agar umumiy so'z bo'lmasa, `Umumiy element yo'q` deb chiqaring.\n\nMisol. Kiritish:\n```\nolma anor uzum shaftoli\nuzum banan olma\n```\nNatija:\n```\nolma uzum\n```\n\nMaslahat: to'plamlarning kesishmasi `&` operatori bilan olinadi. Natijani ro'yxatga aylantirib `.sort()` qiling.",
    "starterCodePy": "# Ikki qatorni o'qing va to'plamga aylantiring\n# a = set(input().split())\n# b = set(input().split())\n# Kesishmani toping, tartiblang va chiqaring\n",
    "testCases": [
      {
        "stdin": "olma anor uzum shaftoli\nuzum banan olma\n",
        "expectedStdout": "olma uzum\n",
        "hidden": false,
        "label": "Namunadagi misol"
      },
      {
        "stdin": "bir ikki uch\nturt besh olti\n",
        "expectedStdout": "Umumiy element yo'q\n",
        "hidden": false,
        "label": "Mos kelmaydigan qatorlar"
      },
      {
        "stdin": "kitob kitob daftar\ndaftar kitob\n",
        "expectedStdout": "daftar kitob\n",
        "hidden": true,
        "label": "Qatorlarda takror so'zlar bor"
      },
      {
        "stdin": "salom\nsalom\n",
        "expectedStdout": "salom\n",
        "hidden": true,
        "label": "Ikkala qator bir xil"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-15",
    "key": "backend-dars-15-hard",
    "title": "Gapdagi noyob harflar",
    "difficulty": "HARD",
    "points": 35,
    "tags": [
      "python",
      "set",
      "matn"
    ],
    "description": "Kiritishda (stdin) bitta qator matn keladi (faqat lotin harflari va bo'sh joylar).\n\nBo'sh joylarni hisobga olmagan holda, katta-kichik harf farqiga E'TIBOR BERMASDAN, matndagi noyob harflarni toping. ANIQ shu 2 qatorni chiqaring:\n\n1-qator: `Noyob harflar: <soni>`\n2-qator: noyob harflar alifbo tartibida, orasida bitta bo'sh joy bilan (hammasi KICHIK harfda).\n\nMisol. Kiritish:\n```\nSalom Dunyo\n```\nNatija:\n```\nNoyob harflar: 9\na d l m n o s u y\n```\n\nMaslahat: avval `lower()` bilan matnni kichik harfga aylantiring, so'ng bo'sh joyni `replace(\" \", \"\")` bilan olib tashlang. Satrni to'g'ridan-to'g'ri `set()` ga bersangiz, u harflar to'plamini beradi.",
    "starterCodePy": "# Matnni o'qing, kichik harfga aylantiring va bo'sh joyni olib tashlang\n# matn = input().lower().replace(\" \", \"\")\n# Noyob harflarni toping, tartiblang va chiqaring\n",
    "testCases": [
      {
        "stdin": "Salom Dunyo\n",
        "expectedStdout": "Noyob harflar: 9\na d l m n o s u y\n",
        "hidden": false,
        "label": "Namunadagi misol"
      },
      {
        "stdin": "Python dasturlash tili\n",
        "expectedStdout": "Noyob harflar: 13\na d h i l n o p r s t u y\n",
        "hidden": false,
        "label": "Uzun gap"
      },
      {
        "stdin": "aAaA\n",
        "expectedStdout": "Noyob harflar: 1\na\n",
        "hidden": true,
        "label": "Faqat bitta harf, turli registrda"
      },
      {
        "stdin": "abc cba\n",
        "expectedStdout": "Noyob harflar: 3\na b c\n",
        "hidden": true,
        "label": "Ikki so'z bir xil harflardan"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-16",
    "key": "backend-dars-16-easy",
    "title": "Uchta hisoblovchi funksiya",
    "difficulty": "EASY",
    "points": 10,
    "tags": [
      "python",
      "funksiya",
      "def"
    ],
    "description": "Uchta funksiya yozing — `kvadrat(n)`, `kub(n)` va `yarim(n)`. Har biri natijani O'ZI `print()` bilan chiqarsin (bu darsda `return` hali kerak emas).\n\n`input()` bilan bitta butun son o'qing va uchala funksiyani shu son bilan navbatma-navbat chaqiring. Chiqish formati:\n\n```\nKvadrat: <n*n>\nKub: <n*n*n>\nYarim: <n/2>\n```\n\nMisol. Kiritish:\n```\n5\n```\nNatija:\n```\nKvadrat: 25\nKub: 125\nYarim: 2.5\n```\n\nDiqqat: `Yarim` uchun oddiy bo'lish `/` ishlatiladi, shuning uchun natija har doim kasrli ko'rinishda chiqadi (masalan `4` uchun `2.0`).",
    "starterCodePy": "# Uchta funksiya e'lon qiling\ndef kvadrat(n):\n    print(f\"Kvadrat: {n * n}\")\n\n# kub() va yarim() ni ham shunday yozing\n\n# Sonni o'qing va uchala funksiyani chaqiring\n",
    "testCases": [
      {
        "stdin": "5\n",
        "expectedStdout": "Kvadrat: 25\nKub: 125\nYarim: 2.5\n",
        "hidden": false,
        "label": "Namunadagi misol"
      },
      {
        "stdin": "4\n",
        "expectedStdout": "Kvadrat: 16\nKub: 64\nYarim: 2.0\n",
        "hidden": false,
        "label": "Juft son"
      },
      {
        "stdin": "0\n",
        "expectedStdout": "Kvadrat: 0\nKub: 0\nYarim: 0.0\n",
        "hidden": true,
        "label": "Nol kiritilganda"
      },
      {
        "stdin": "12\n",
        "expectedStdout": "Kvadrat: 144\nKub: 1728\nYarim: 6.0\n",
        "hidden": true,
        "label": "Ikki xonali son"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-16",
    "key": "backend-dars-16-medium",
    "title": "Salomlashuv funksiyasi",
    "difficulty": "MEDIUM",
    "points": 20,
    "tags": [
      "python",
      "funksiya",
      "sikl"
    ],
    "description": "`salomlash(ism)` nomli funksiya yozing. U ANIQ shu qatorni chiqarsin:\n\n`Salom, <ism>! Bugungi darsga xush kelibsiz.`\n\n`input()` bilan 3 ta ismni ALOHIDA qatorlardan o'qing, ularni ro'yxatga yig'ing va `for` sikli ichida funksiyani har bir ism uchun chaqiring. Jami 3 qator chiqadi.\n\nMisol. Kiritish:\n```\nAli\nMalika\nBexruz\n```\nNatija:\n```\nSalom, Ali! Bugungi darsga xush kelibsiz.\nSalom, Malika! Bugungi darsga xush kelibsiz.\nSalom, Bexruz! Bugungi darsga xush kelibsiz.\n```\n\nDiqqat: matnni faqat funksiya ichida chiqaring — bir xil `print()` ni uch marta yozish DRY tamoyiliga zid.",
    "starterCodePy": "# Funksiyani e'lon qiling\ndef salomlash(ism):\n    pass\n\n# 3 ta ismni o'qib ro'yxatga yig'ing\n# for sikli ichida funksiyani chaqiring\n",
    "testCases": [
      {
        "stdin": "Ali\nMalika\nBexruz\n",
        "expectedStdout": "Salom, Ali! Bugungi darsga xush kelibsiz.\nSalom, Malika! Bugungi darsga xush kelibsiz.\nSalom, Bexruz! Bugungi darsga xush kelibsiz.\n",
        "hidden": false,
        "label": "Namunadagi misol"
      },
      {
        "stdin": "Sardor\nNodira\nJasur\n",
        "expectedStdout": "Salom, Sardor! Bugungi darsga xush kelibsiz.\nSalom, Nodira! Bugungi darsga xush kelibsiz.\nSalom, Jasur! Bugungi darsga xush kelibsiz.\n",
        "hidden": false,
        "label": "Boshqa uchta ism"
      },
      {
        "stdin": "A\nB\nC\n",
        "expectedStdout": "Salom, A! Bugungi darsga xush kelibsiz.\nSalom, B! Bugungi darsga xush kelibsiz.\nSalom, C! Bugungi darsga xush kelibsiz.\n",
        "hidden": true,
        "label": "Bir harfli ismlar"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-16",
    "key": "backend-dars-16-hard",
    "title": "To'rtburchak funksiyasi",
    "difficulty": "HARD",
    "points": 35,
    "tags": [
      "python",
      "funksiya",
      "parametr"
    ],
    "description": "`tortburchak(eni, boyi)` nomli, IKKI parametrli funksiya yozing. U ANIQ shu 2 qatorni chiqarsin:\n\n```\nYuza: <eni * boyi>\nPerimetr: <2 * (eni + boyi)>\n```\n\nKiritishda (stdin) 2 qator keladi, har birida bo'sh joy bilan ajratilgan ikkita butun son — bitta to'rtburchakning eni va bo'yi. Funksiyani IKKI marta chaqiring: avval birinchi to'rtburchak uchun, keyin ikkinchisi uchun. Jami 4 qator chiqadi.\n\nMisol. Kiritish:\n```\n3 4\n5 5\n```\nNatija:\n```\nYuza: 12\nPerimetr: 14\nYuza: 25\nPerimetr: 20\n```\n\nDiqqat: hisoblash kodi faqat funksiya ichida bo'lsin — shuning uchun uni ikki marta yozish kerak emas.",
    "starterCodePy": "# Ikki parametrli funksiya yozing\ndef tortburchak(eni, boyi):\n    pass\n\n# Ikki qatorni o'qing va funksiyani ikki marta chaqiring\n",
    "testCases": [
      {
        "stdin": "3 4\n5 5\n",
        "expectedStdout": "Yuza: 12\nPerimetr: 14\nYuza: 25\nPerimetr: 20\n",
        "hidden": false,
        "label": "Namunadagi misol"
      },
      {
        "stdin": "10 2\n7 8\n",
        "expectedStdout": "Yuza: 20\nPerimetr: 24\nYuza: 56\nPerimetr: 30\n",
        "hidden": false,
        "label": "Boshqa o'lchamlar"
      },
      {
        "stdin": "1 1\n1 100\n",
        "expectedStdout": "Yuza: 1\nPerimetr: 4\nYuza: 100\nPerimetr: 202\n",
        "hidden": true,
        "label": "Juda kichik va juda uzun to'rtburchak"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-17",
    "key": "backend-dars-17-easy",
    "title": "Yig'indini qaytaruvchi funksiya",
    "difficulty": "EASY",
    "points": 10,
    "tags": [
      "python",
      "funksiya",
      "return"
    ],
    "description": "`qoshish(a, b)` nomli funksiya yozing. U natijani ekranga CHIQARMASIN, balki `return` bilan QAYTARSIN.\n\n`input()` bilan 2 ta butun sonni alohida qatorlardan o'qing, funksiyani chaqiring, natijani o'zgaruvchiga saqlang va ANIQ shu qatorni chiqaring:\n\n`Yig'indi: <natija>`\n\nMisol. Kiritish:\n```\n7\n5\n```\nNatija:\n```\nYig'indi: 12\n```\n\nDiqqat: agar funksiya ichida `print()` yozsangiz, natija ikki marta chiqib ketadi. `return` — qiymatni dasturga qaytaradi, `print` — ekranga chiqaradi.",
    "starterCodePy": "# Yig'indini QAYTARADIGAN funksiya yozing\ndef qoshish(a, b):\n    pass\n\n# Ikki sonni o'qing, funksiyani chaqiring va natijani chiqaring\n",
    "testCases": [
      {
        "stdin": "7\n5\n",
        "expectedStdout": "Yig'indi: 12\n",
        "hidden": false,
        "label": "Namunadagi misol"
      },
      {
        "stdin": "100\n250\n",
        "expectedStdout": "Yig'indi: 350\n",
        "hidden": false,
        "label": "Katta sonlar"
      },
      {
        "stdin": "-4\n4\n",
        "expectedStdout": "Yig'indi: 0\n",
        "hidden": true,
        "label": "Manfiy son bilan"
      },
      {
        "stdin": "0\n0\n",
        "expectedStdout": "Yig'indi: 0\n",
        "hidden": true,
        "label": "Ikkala son nol"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-17",
    "key": "backend-dars-17-medium",
    "title": "Doira yuzasi (default parametr bilan)",
    "difficulty": "MEDIUM",
    "points": 20,
    "tags": [
      "python",
      "funksiya",
      "default"
    ],
    "description": "`doira_yuzasi(radius=1)` nomli funksiya yozing — radius berilmasa u 1 ga teng bo'lsin. Funksiya `3.14159 * radius * radius` qiymatini `return` bilan qaytarsin (`math` moduli hali kerak emas, `3.14159` sonini o'zingiz yozing).\n\n`input()` bilan bitta butun son — radiusni o'qing. Funksiyani IKKI marta chaqiring: birinchisi argumentsiz (default radius bilan), ikkinchisi o'qilgan radius bilan. ANIQ shu 2 qatorni chiqaring:\n\n```\nStandart: <yuza>\nRadius <r>: <yuza>\n```\n\nHar ikkala yuza `f\"{qiymat:.2f}\"` formatida — ya'ni ANIQ 2 kasr xonasi bilan chiqarilsin.\n\nMisol. Kiritish:\n```\n3\n```\nNatija:\n```\nStandart: 3.14\nRadius 3: 28.27\n```",
    "starterCodePy": "# Default parametrli funksiya yozing\ndef doira_yuzasi(radius=1):\n    pass\n\n# Radiusni o'qing va funksiyani ikki marta chaqiring (biri argumentsiz)\n# print(f\"Standart: {...:.2f}\")\n",
    "testCases": [
      {
        "stdin": "3\n",
        "expectedStdout": "Standart: 3.14\nRadius 3: 28.27\n",
        "hidden": false,
        "label": "Namunadagi misol"
      },
      {
        "stdin": "10\n",
        "expectedStdout": "Standart: 3.14\nRadius 10: 314.16\n",
        "hidden": false,
        "label": "Katta radius"
      },
      {
        "stdin": "1\n",
        "expectedStdout": "Standart: 3.14\nRadius 1: 3.14\n",
        "hidden": true,
        "label": "Radius default bilan bir xil"
      },
      {
        "stdin": "2\n",
        "expectedStdout": "Standart: 3.14\nRadius 2: 12.57\n",
        "hidden": true,
        "label": "Yaxlitlash tekshiruvi"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-17",
    "key": "backend-dars-17-hard",
    "title": "Statistika qaytaruvchi funksiya",
    "difficulty": "HARD",
    "points": 35,
    "tags": [
      "python",
      "funksiya",
      "return"
    ],
    "description": "`statistika(sonlar)` nomli funksiya yozing. U ro'yxat qabul qilsin va UCHTA qiymatni birdaniga qaytarsin: eng kichigi, eng kattasi va o'rtachasi (`return kichik, katta, ortacha`).\n\nKiritishda (stdin) bitta qator — bo'sh joy bilan ajratilgan butun sonlar keladi (kamida bitta son bo'ladi). Funksiyani chaqiring va ANIQ shu 3 qatorni chiqaring:\n\n```\nMin: <eng kichik>\nMax: <eng katta>\nO'rtacha: <o'rtacha>\n```\n\nO'rtacha `f\"{qiymat:.2f}\"` formatida — ANIQ 2 kasr xonasi bilan chiqarilsin. Min va Max esa butun son ko'rinishida.\n\nMisol. Kiritish:\n```\n4 9 15 2\n```\nNatija:\n```\nMin: 2\nMax: 15\nO'rtacha: 7.50\n```\n\nMaslahat: bir nechta qiymatni `natija = statistika(sonlar)` bilan olib, `natija[0]` deb ishlatishingiz yoki `a, b, c = statistika(sonlar)` deb ajratib olishingiz mumkin.",
    "starterCodePy": "# Uchta qiymat qaytaruvchi funksiya yozing\ndef statistika(sonlar):\n    pass\n\n# Sonlarni o'qing, funksiyani chaqiring va 3 qator natijani chiqaring\n",
    "testCases": [
      {
        "stdin": "4 9 15 2\n",
        "expectedStdout": "Min: 2\nMax: 15\nO'rtacha: 7.50\n",
        "hidden": false,
        "label": "Namunadagi misol"
      },
      {
        "stdin": "10 20 30 40 50\n",
        "expectedStdout": "Min: 10\nMax: 50\nO'rtacha: 30.00\n",
        "hidden": false,
        "label": "Beshta son"
      },
      {
        "stdin": "7\n",
        "expectedStdout": "Min: 7\nMax: 7\nO'rtacha: 7.00\n",
        "hidden": true,
        "label": "Bitta son"
      },
      {
        "stdin": "-5 -1 -9\n",
        "expectedStdout": "Min: -9\nMax: -1\nO'rtacha: -5.00\n",
        "hidden": true,
        "label": "Faqat manfiy sonlar"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-18",
    "key": "backend-dars-18-easy",
    "title": "Istalgancha sonni qo'shuvchi funksiya",
    "difficulty": "EASY",
    "points": 10,
    "tags": [
      "python",
      "funksiya",
      "args"
    ],
    "description": "`yigindi(*sonlar)` nomli funksiya yozing. U ISTALGANCHA sondagi argument qabul qilsin va ularning yig'indisini `return` bilan qaytarsin. Argument berilmasa `0` qaytarilsin.\n\nKiritish (stdin):\n\n1-qator — `n` soni (nechta guruh bor).\nKeyingi `n` qator — har birida bo'sh joy bilan ajratilgan butun sonlar. Qator BO'SH ham bo'lishi mumkin — bu «argumentsiz chaqiruv» degani.\n\nHar bir guruh uchun sonlarni ro'yxatga yig'ing va funksiyani `yigindi(*sonlar)` ko'rinishida (yulduzcha bilan yoyib) chaqirib, natijani alohida qatorda chiqaring. Eng oxirida BARCHA sonlarning yig'indisini `Jami: <summa>` deb chiqaring — buni ham xuddi shu funksiya bilan hisoblang.\n\nMisol. Kiritish:\n```\n3\n1 2 3\n5\n10 20 30 40\n```\nNatija:\n```\n6\n5\n100\nJami: 111\n```\n\nYana bir misol. Kiritish:\n```\n2\n7 8\n100 200 300\n```\nNatija:\n```\n15\n600\nJami: 615\n```\n\nDiqqat: `*sonlar` funksiya ichida oddiy tuple bo'ladi — uni `for` bilan aylanib chiqing. Sonlar manfiy ham bo'lishi mumkin. Natija kiritishga bog'liq, shuning uchun javobni kodga yozib qo'yish ishlamaydi.",
    "starterCodePy": "# *args qabul qiladigan funksiya yozing\ndef yigindi(*sonlar):\n    pass\n\nn = int(input())\nhammasi = []\n# Har bir qatorni o'qing, sonlarga aylantiring va yigindi(*sonlar) ni chiqaring\n# Oxirida yigindi(*hammasi) ni 'Jami: ...' ko'rinishida chiqaring\n",
    "testCases": [
      {
        "stdin": "3\n1 2 3\n5\n10 20 30 40\n",
        "expectedStdout": "6\n5\n100\nJami: 111\n",
        "hidden": false,
        "label": "Namunadagi uchta guruh"
      },
      {
        "stdin": "2\n7 8\n100 200 300\n",
        "expectedStdout": "15\n600\nJami: 615\n",
        "hidden": false,
        "label": "Ikkita guruh"
      },
      {
        "stdin": "3\n4\n\n1 1 1 1 1\n",
        "expectedStdout": "4\n0\n5\nJami: 9\n",
        "hidden": true,
        "label": "Bo'sh guruh ham bor"
      },
      {
        "stdin": "1\n-5 5 12\n",
        "expectedStdout": "12\nJami: 12\n",
        "hidden": true,
        "label": "Bitta guruh"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-18",
    "key": "backend-dars-18-medium",
    "title": "kwargs bilan profil chiqarish",
    "difficulty": "MEDIUM",
    "points": 20,
    "tags": [
      "python",
      "funksiya",
      "kwargs"
    ],
    "description": "`profil(**malumot)` nomli funksiya yozing. U avval `--- Profil ---` qatorini chiqarsin, so'ng `for kalit, qiymat in malumot.items():` sikli bilan har bir juftlikni `<kalit>: <qiymat>` ko'rinishida chiqarsin.\n\nKiritish (stdin):\n\n1-qator — `n` soni (nechta profil bor).\nKeyingi `n` qator — har birida bo'sh joy bilan ajratilgan `kalit=qiymat` juftliklari. Kalit ham, qiymat ham bo'sh joysiz. Har bir qator uchun lug'at yig'ing va funksiyani `profil(**malumot)` ko'rinishida (ikki yulduzcha bilan yoyib) chaqiring.\n\nQiymatlar matn (string) sifatida chiqarilsin — ularni `int()` ga aylantirmang.\n\nMisol. Kiritish:\n```\n2\nism=Ali yosh=15 shahar=Toshkent\nism=Malika kasb=dasturchi\n```\nNatija:\n```\n--- Profil ---\nism: Ali\nyosh: 15\nshahar: Toshkent\n--- Profil ---\nism: Malika\nkasb: dasturchi\n```\n\nYana bir misol. Kiritish:\n```\n1\nnom=Python versiya=3.10\n```\nNatija:\n```\n--- Profil ---\nnom: Python\nversiya: 3.10\n```\n\nMaslahat: bitta juftlikni `kalit, qiymat = juft.split(\"=\")` bilan ajratasiz. `**kwargs` funksiya ichida oddiy lug'at bo'ladi, kalitlar berilgan tartibda saqlanadi.",
    "starterCodePy": "# **kwargs qabul qiladigan funksiya yozing\ndef profil(**malumot):\n    pass\n\nn = int(input())\n# Har bir qatorni o'qing, kalit=qiymat juftliklaridan lug'at yig'ing\n# va profil(**malumot) ni chaqiring\n",
    "testCases": [
      {
        "stdin": "2\nism=Ali yosh=15 shahar=Toshkent\nism=Malika kasb=dasturchi\n",
        "expectedStdout": "--- Profil ---\nism: Ali\nyosh: 15\nshahar: Toshkent\n--- Profil ---\nism: Malika\nkasb: dasturchi\n",
        "hidden": false,
        "label": "Namunadagi ikki profil"
      },
      {
        "stdin": "1\nnom=Python versiya=3.10\n",
        "expectedStdout": "--- Profil ---\nnom: Python\nversiya: 3.10\n",
        "hidden": false,
        "label": "Bitta profil"
      },
      {
        "stdin": "3\na=1\nb=2 c=3\nism=Bexruz yosh=17 shahar=Samarqand\n",
        "expectedStdout": "--- Profil ---\na: 1\n--- Profil ---\nb: 2\nc: 3\n--- Profil ---\nism: Bexruz\nyosh: 17\nshahar: Samarqand\n",
        "hidden": true,
        "label": "Uchta profil"
      },
      {
        "stdin": "2\ntil=uz\ntil=en daraja=B2\n",
        "expectedStdout": "--- Profil ---\ntil: uz\n--- Profil ---\ntil: en\ndaraja: B2\n",
        "hidden": true,
        "label": "Takrorlanuvchi kalitlar"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-18",
    "key": "backend-dars-18-hard",
    "title": "lambda bilan uzunlik bo'yicha tartiblash",
    "difficulty": "HARD",
    "points": 35,
    "tags": [
      "python",
      "lambda",
      "sorted"
    ],
    "description": "Kiritishda (stdin) bitta qator — bo'sh joy bilan ajratilgan so'zlar keladi.\n\n`sorted()` funksiyasiga `key=lambda s: len(s)` berib, so'zlarni UZUNLIGI bo'yicha tartiblang va ANIQ shu 2 qatorni chiqaring:\n\n1-qator: so'zlar uzunligi bo'yicha O'SISH tartibida, bo'sh joy bilan ajratilgan.\n2-qator: so'zlar uzunligi bo'yicha KAMAYISH tartibida (`reverse=True`), bo'sh joy bilan ajratilgan.\n\nUzunligi teng so'zlar kiritishdagi tartibini saqlaydi — `sorted()` barqaror (stable), shuning uchun qo'shimcha hech narsa qilish shart emas.\n\nMisol. Kiritish:\n```\nolma anor shaftoli uzum non\n```\nNatija:\n```\nnon olma anor uzum shaftoli\nshaftoli olma anor uzum non\n```\n\nMaslahat: chiqarishda `print(*royxat)` yoki `\" \".join(royxat)` dan foydalaning.",
    "starterCodePy": "# So'zlarni o'qing\n# sozlar = input().split()\n# sorted() va lambda bilan ikki xil tartibda chiqaring\n",
    "testCases": [
      {
        "stdin": "olma anor shaftoli uzum non\n",
        "expectedStdout": "non olma anor uzum shaftoli\nshaftoli olma anor uzum non\n",
        "hidden": false,
        "label": "Namunadagi misol"
      },
      {
        "stdin": "python kod dastur it\n",
        "expectedStdout": "it kod python dastur\npython dastur kod it\n",
        "hidden": false,
        "label": "Turli uzunlikdagi so'zlar"
      },
      {
        "stdin": "bir ikki uch\n",
        "expectedStdout": "bir uch ikki\nikki bir uch\n",
        "hidden": true,
        "label": "Teng uzunlikdagi so'zlar tartibi"
      },
      {
        "stdin": "salom\n",
        "expectedStdout": "salom\nsalom\n",
        "hidden": true,
        "label": "Bitta so'z"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-19",
    "key": "backend-dars-19-easy",
    "title": "math bilan ildiz hisoblash",
    "difficulty": "EASY",
    "points": 10,
    "tags": [
      "python",
      "modul",
      "math"
    ],
    "description": "`math` modulini `import` qiling va `input()` bilan bitta butun son (`n >= 0`) o'qing. ANIQ shu 3 qatorni chiqaring:\n\n```\nIldiz: <math.sqrt(n) — 2 kasr xonasi bilan>\nYuqoriga: <math.ceil(math.sqrt(n))>\nPastga: <math.floor(math.sqrt(n))>\n```\n\nIldiz `f\"{qiymat:.2f}\"` formatida chiqarilsin, `Yuqoriga` va `Pastga` esa butun son ko'rinishida.\n\nMisol. Kiritish:\n```\n10\n```\nNatija:\n```\nIldiz: 3.16\nYuqoriga: 4\nPastga: 3\n```\n\nDiqqat: `math.ceil()` yuqoriga, `math.floor()` pastga yaxlitlaydi. Ular butun son (int) qaytaradi.",
    "starterCodePy": "import math\n\n# Sonni o'qing va uchta qatorni chiqaring\n# print(f\"Ildiz: {math.sqrt(n):.2f}\")\n",
    "testCases": [
      {
        "stdin": "10\n",
        "expectedStdout": "Ildiz: 3.16\nYuqoriga: 4\nPastga: 3\n",
        "hidden": false,
        "label": "Namunadagi misol"
      },
      {
        "stdin": "50\n",
        "expectedStdout": "Ildiz: 7.07\nYuqoriga: 8\nPastga: 7\n",
        "hidden": false,
        "label": "Katta son"
      },
      {
        "stdin": "25\n",
        "expectedStdout": "Ildiz: 5.00\nYuqoriga: 5\nPastga: 5\n",
        "hidden": true,
        "label": "To'liq kvadrat son"
      },
      {
        "stdin": "0\n",
        "expectedStdout": "Ildiz: 0.00\nYuqoriga: 0\nPastga: 0\n",
        "hidden": true,
        "label": "Nol kiritilganda"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-19",
    "key": "backend-dars-19-medium",
    "title": "Aylana uzunligi va faktorial",
    "difficulty": "MEDIUM",
    "points": 20,
    "tags": [
      "python",
      "modul",
      "math"
    ],
    "description": "`math` modulidan `pi` doimiysi va `factorial()` funksiyasidan foydalaning.\n\nKiritishda (stdin) 2 qator keladi: 1-qator — `r` radiusi (butun son), 2-qator — `k` soni (`0 <= k <= 12`). ANIQ shu 2 qatorni chiqaring:\n\n```\nUzunlik: <2 * math.pi * r — 2 kasr xonasi bilan>\nFaktorial: <math.factorial(k)>\n```\n\nUzunlik `f\"{qiymat:.2f}\"` formatida chiqarilsin.\n\nMisol. Kiritish:\n```\n5\n4\n```\nNatija:\n```\nUzunlik: 31.42\nFaktorial: 24\n```\n\nDiqqat: `3.14` emas, aynan `math.pi` ni ishlating — u ancha aniqroq va natija ikkinchi kasr xonasida farq qilishi mumkin.",
    "starterCodePy": "import math\n\n# r va k ni o'qing\n# Aylana uzunligi va faktorialni chiqaring\n",
    "testCases": [
      {
        "stdin": "5\n4\n",
        "expectedStdout": "Uzunlik: 31.42\nFaktorial: 24\n",
        "hidden": false,
        "label": "Namunadagi misol"
      },
      {
        "stdin": "1\n0\n",
        "expectedStdout": "Uzunlik: 6.28\nFaktorial: 1\n",
        "hidden": false,
        "label": "Nol faktoriali"
      },
      {
        "stdin": "100\n12\n",
        "expectedStdout": "Uzunlik: 628.32\nFaktorial: 479001600\n",
        "hidden": true,
        "label": "Katta qiymatlar"
      },
      {
        "stdin": "7\n1\n",
        "expectedStdout": "Uzunlik: 43.98\nFaktorial: 1\n",
        "hidden": true,
        "label": "Bir faktoriali"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-19",
    "key": "backend-dars-19-hard",
    "title": "Boshqariladigan tasodifiy sonlar",
    "difficulty": "HARD",
    "points": 35,
    "tags": [
      "python",
      "modul",
      "random"
    ],
    "description": "`random` va `math` modullarini `import` qiling.\n\nKiritishda (stdin) 2 qator keladi: 1-qator — `urug'` (seed) soni, 2-qator — `n` soni (nechta son kerak).\n\nQadamlarni ANIQ shu tartibda bajaring:\n1. `random.seed(urug)` — shundan keyin tasodifiy sonlar ketma-ketligi har safar bir xil bo'ladi (natija tekshirilishi uchun shart).\n2. `n` marta `random.randint(1, 100)` chaqirib, sonlarni ro'yxatga yig'ing. Boshqa hech qanday `random` funksiyasini chaqirmang — aks holda ketma-ketlik siljiydi.\n3. 1-qatorda sonlarni bo'sh joy bilan ajratib chiqaring.\n4. 2-qatorda har bir sonning kvadrat ildizini (`math.sqrt`) 2 kasr xonasi bilan, bo'sh joy bilan ajratib chiqaring.\n\nMisol. Kiritish:\n```\n42\n5\n```\nNatija:\n```\n82 15 4 95 36\n9.06 3.87 2.00 9.75 6.00\n```\n\nDiqqat: `random.seed()` ni `randint()` chaqiruvlaridan OLDIN, faqat bir marta yozing.",
    "starterCodePy": "import random\nimport math\n\n# urug' va n ni o'qing\n# random.seed(urug) ni chaqiring, so'ng n ta randint(1, 100) yig'ing\n# Ikki qatorni chiqaring\n",
    "testCases": [
      {
        "stdin": "42\n5\n",
        "expectedStdout": "82 15 4 95 36\n9.06 3.87 2.00 9.75 6.00\n",
        "hidden": false,
        "label": "Namunadagi misol"
      },
      {
        "stdin": "7\n3\n",
        "expectedStdout": "42 20 51\n6.48 4.47 7.14\n",
        "hidden": false,
        "label": "Boshqa urug' va uzunlik"
      },
      {
        "stdin": "1\n1\n",
        "expectedStdout": "18\n4.24\n",
        "hidden": true,
        "label": "Bitta son"
      },
      {
        "stdin": "2026\n8\n",
        "expectedStdout": "16 41 65 66 83 14 29 77\n4.00 6.40 8.06 8.12 9.11 3.74 5.39 8.77\n",
        "hidden": true,
        "label": "Uzunroq ketma-ketlik"
      }
    ]
  }
];
