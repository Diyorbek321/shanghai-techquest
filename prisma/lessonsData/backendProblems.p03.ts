/**
 * Hand-authored practice problems for backend lessons 27-33
 * (Oy-3: OOP amaliyoti, meros, inkapsulyatsiya, polimorfizm, comprehension,
 * generator va decorator).
 *
 * Grading is exact-output, so every `expectedStdout` below was produced by actually
 * running a reference solution on the Piston sandbox (python 3.10.0) against the
 * matching `stdin` — none of them are written from memory.
 */
import type { LessonProblemRecord } from './types';
// Hand-authored practice, test cases verified against the Piston sandbox.
export const backendProblemsP03: LessonProblemRecord[] = [
  {
    "lessonKey": "backend-dars-27",
    "key": "backend-dars-27-easy",
    "title": "Telefon classi",
    "difficulty": "EASY",
    "points": 10,
    "tags": [
      "python",
      "oop",
      "class",
      "metod"
    ],
    "description": "«Telefon» classini yarating. Atributlari: `marka` (matn) va `zaryad` (butun son, foizda).\nMetodi: `qongiroq()`.\n\n`qongiroq()` qoidasi:\n- agar `zaryad` 5 dan kichik bo'lmasa — zaryadni 5 ga kamaytiring va `<marka> jiringlamoqda` deb chiqaring;\n- aks holda zaryadga tegmang va `<marka> zaryadi yetarli emas` deb chiqaring.\n\nKirish (stdin) 3 qatordan iborat:\n1-qator — marka, 2-qator — boshlang'ich zaryad, 3-qator — nechta qo'ng'iroq qilinishi.\n\nBarcha qo'ng'iroqlardan keyin oxirgi qatorda `Zaryad: <zaryad>%` deb chiqaring.\n\nMisol. Kiritish:\n```\nSamsung\n80\n2\n```\nNatija:\n```\nSamsung jiringlamoqda\nSamsung jiringlamoqda\nZaryad: 70%\n```",
    "starterCodePy": "# Telefon classini yarating: marka va zaryad atributlari, qongiroq() metodi.\nclass Telefon:\n    def __init__(self, marka, zaryad):\n        pass\n\n    def qongiroq(self):\n        pass\n\n\nmarka = input()\nzaryad = int(input())\nsoni = int(input())\n# Obyekt yasang, soni marta qongiroq() ni chaqiring va oxirida zaryadni chiqaring\n",
    "testCases": [
      {
        "stdin": "Samsung\n80\n2\n",
        "expectedStdout": "Samsung jiringlamoqda\nSamsung jiringlamoqda\nZaryad: 70%\n",
        "hidden": false,
        "label": "Namunadagi misol"
      },
      {
        "stdin": "iPhone\n12\n4\n",
        "expectedStdout": "iPhone jiringlamoqda\niPhone jiringlamoqda\niPhone zaryadi yetarli emas\niPhone zaryadi yetarli emas\nZaryad: 2%\n",
        "hidden": false,
        "label": "Zaryad yo'lda tugab qoladi"
      },
      {
        "stdin": "Nokia\n0\n1\n",
        "expectedStdout": "Nokia zaryadi yetarli emas\nZaryad: 0%\n",
        "hidden": true,
        "label": "Boshlang'ich holat chegarasi"
      },
      {
        "stdin": "Xiaomi\n100\n5\n",
        "expectedStdout": "Xiaomi jiringlamoqda\nXiaomi jiringlamoqda\nXiaomi jiringlamoqda\nXiaomi jiringlamoqda\nXiaomi jiringlamoqda\nZaryad: 75%\n",
        "hidden": true,
        "label": "Ko'p qo'ng'iroq"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-27",
    "key": "backend-dars-27-medium",
    "title": "Hayvon classi va __str__",
    "difficulty": "MEDIUM",
    "points": 20,
    "tags": [
      "python",
      "oop",
      "str",
      "class"
    ],
    "description": "«Hayvon» classini yarating. Atributlari: `nom`, `tur`, `yosh` (butun son).\nClassga `__str__` metodini qo'shing — u ANIQ shu ko'rinishdagi MATNNI QAYTARSIN\n(chiqarmasin, aynan `return` qilsin):\n\n`<nom> — <tur>, <yosh> yoshda`\n\nKirish (stdin): birinchi qatorda `n` — hayvonlar soni. Keyingi `n` qatorning har birida\nbo'sh joy bilan ajratilgan `nom tur yosh`.\n\nHar bir hayvonni `print(hayvon)` bilan chiqaring, so'ng oxirgi qatorda\n`Jami: <n> ta hayvon` deb chiqaring.\n\nMisol. Kiritish:\n```\n2\nBars mushuk 3\nRex it 5\n```\nNatija:\n```\nBars — mushuk, 3 yoshda\nRex — it, 5 yoshda\nJami: 2 ta hayvon\n```",
    "starterCodePy": "# Hayvon classini yarating va __str__ metodida matn QAYTARING (return).\nclass Hayvon:\n    def __init__(self, nom, tur, yosh):\n        pass\n\n    def __str__(self):\n        pass\n\n\nn = int(input())\n# n ta hayvonni o'qing, print(hayvon) qiling, oxirida jami sonini chiqaring\n",
    "testCases": [
      {
        "stdin": "2\nBars mushuk 3\nRex it 5\n",
        "expectedStdout": "Bars — mushuk, 3 yoshda\nRex — it, 5 yoshda\nJami: 2 ta hayvon\n",
        "hidden": false,
        "label": "Namunadagi misol"
      },
      {
        "stdin": "3\nKesh tuya 7\nLola tovuq 1\nZorro ot 12\n",
        "expectedStdout": "Kesh — tuya, 7 yoshda\nLola — tovuq, 1 yoshda\nZorro — ot, 12 yoshda\nJami: 3 ta hayvon\n",
        "hidden": false,
        "label": "Uchta hayvon"
      },
      {
        "stdin": "1\nMoro baliq 0\n",
        "expectedStdout": "Moro — baliq, 0 yoshda\nJami: 1 ta hayvon\n",
        "hidden": true,
        "label": "Bitta hayvon"
      },
      {
        "stdin": "0\n",
        "expectedStdout": "Jami: 0 ta hayvon\n",
        "hidden": true,
        "label": "Ro'yxat bo'sh holati"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-27",
    "key": "backend-dars-27-hard",
    "title": "Mahsulotlarni filtrlash",
    "difficulty": "HARD",
    "points": 35,
    "tags": [
      "python",
      "oop",
      "royxat",
      "filtr"
    ],
    "description": "«Mahsulot» classini yarating. Atributlari: `nom`, `narx` (butun son), `miqdor` (butun son).\nClassga `jami()` metodini qo'shing — u `narx * miqdor` ni QAYTARSIN.\n\nKirish (stdin): birinchi qatorda `n`. Keyingi `n` qatorda `nom narx miqdor`.\nHamma obyektlarni bitta ro'yxatga soling.\n\nSo'ng ro'yxat bo'ylab yuring va faqat `jami()` qiymati 100000 dan KICHIK BO'LMAGAN\nmahsulotlarni kiritilgan tartibda chiqaring:\n\n`<nom>: <jami> so'm`\n\nOxirgi qatorda `Tanlangan: <k> ta` deb chiqaring (`k` — chiqarilgan mahsulotlar soni).\nAgar mos mahsulot bo'lmasa, faqat shu oxirgi qator chiqadi.\n\nMisol. Kiritish:\n```\n3\nDaftar 5000 10\nTelefon 3000000 1\nRuchka 2000 3\n```\nNatija:\n```\nTelefon: 3000000 so'm\nTanlangan: 1 ta\n```",
    "starterCodePy": "# Mahsulot classini yarating, obyektlarni ro'yxatga soling va shart bo'yicha filtrlang.\nclass Mahsulot:\n    def __init__(self, nom, narx, miqdor):\n        pass\n\n    def jami(self):\n        pass\n\n\nn = int(input())\nmahsulotlar = []\n# n ta mahsulotni o'qing va ro'yxatga qo'shing, so'ng filtrlab chiqaring\n",
    "testCases": [
      {
        "stdin": "3\nDaftar 5000 10\nTelefon 3000000 1\nRuchka 2000 3\n",
        "expectedStdout": "Telefon: 3000000 so'm\nTanlangan: 1 ta\n",
        "hidden": false,
        "label": "Namunadagi misol"
      },
      {
        "stdin": "5\nNoutbuk 7000000 2\nSichqoncha 90000 1\nKlaviatura 250000 1\nQalam 1500 4\nMonitor 100000 1\n",
        "expectedStdout": "Noutbuk: 14000000 so'm\nKlaviatura: 250000 so'm\nMonitor: 100000 so'm\nTanlangan: 3 ta\n",
        "hidden": false,
        "label": "Besh mahsulot"
      },
      {
        "stdin": "2\nQalam 1000 2\nDaftar 3000 5\n",
        "expectedStdout": "Tanlangan: 0 ta\n",
        "hidden": true,
        "label": "Hech biri shartga tushmaydi"
      },
      {
        "stdin": "1\nKitob 50000 2\n",
        "expectedStdout": "Kitob: 100000 so'm\nTanlangan: 1 ta\n",
        "hidden": true,
        "label": "Chegaraviy qiymat"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-28",
    "key": "backend-dars-28-easy",
    "title": "Odam va Talaba merosi",
    "difficulty": "EASY",
    "points": 10,
    "tags": [
      "python",
      "oop",
      "inheritance",
      "super"
    ],
    "description": "«Odam» classini yarating: atributlari `ism` va `yosh`, metodi `tanishtir()` —\nu `Men <ism>, <yosh> yoshdaman.` deb CHIQARADI.\n\nSo'ng `Odam` dan meros oluvchi «Talaba» classini yozing: qo'shimcha atributi `guruh`.\n`Talaba.__init__` ichida `super().__init__(...)` ni chaqirish SHART.\n`Talaba.tanishtir()` avval `super().tanishtir()` ni chaqirsin, keyin\n`Guruhim: <guruh>.` qatorini chiqarsin.\n\nKirish (stdin) 5 qator: 1-2 qator — Odam uchun ism va yosh;\n3-4-5 qator — Talaba uchun ism, yosh va guruh.\n\nAvval odamning, keyin talabaning `tanishtir()` metodini chaqiring.\n\nMisol. Kiritish:\n```\nKarim\n40\nAli\n15\nIT-1\n```\nNatija:\n```\nMen Karim, 40 yoshdaman.\nMen Ali, 15 yoshdaman.\nGuruhim: IT-1.\n```",
    "starterCodePy": "# Odam classini yozing, so'ng undan meros oluvchi Talaba classini yozing.\nclass Odam:\n    def __init__(self, ism, yosh):\n        pass\n\n    def tanishtir(self):\n        pass\n\n\nclass Talaba(Odam):\n    pass\n\n\n# Kiritishni o'qing va ikkala obyektning tanishtir() metodini chaqiring\n",
    "testCases": [
      {
        "stdin": "Karim\n40\nAli\n15\nIT-1\n",
        "expectedStdout": "Men Karim, 40 yoshdaman.\nMen Ali, 15 yoshdaman.\nGuruhim: IT-1.\n",
        "hidden": false,
        "label": "Namunadagi misol"
      },
      {
        "stdin": "Malika\n33\nBexruz\n17\nBackend-2\n",
        "expectedStdout": "Men Malika, 33 yoshdaman.\nMen Bexruz, 17 yoshdaman.\nGuruhim: Backend-2.\n",
        "hidden": false,
        "label": "Boshqa qiymatlar"
      },
      {
        "stdin": "A\n1\nB\n2\nG\n",
        "expectedStdout": "Men A, 1 yoshdaman.\nMen B, 2 yoshdaman.\nGuruhim: G.\n",
        "hidden": true,
        "label": "Qisqa qiymatlar"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-28",
    "key": "backend-dars-28-medium",
    "title": "Hayvon → Mushuk → Sher zanjiri",
    "difficulty": "MEDIUM",
    "points": 20,
    "tags": [
      "python",
      "oop",
      "inheritance",
      "override"
    ],
    "description": "Uch bosqichli meros zanjirini tuzing: `Hayvon` → `Mushuk(Hayvon)` → `Sher(Mushuk)`.\n\nHar birida `nom` atributi va `ovoz()` metodi bo'lsin. `ovoz()` metodi MATN QAYTARSIN:\n- `Hayvon.ovoz()` → `Noaniq ovoz`\n- `Mushuk.ovoz()` → `Miyov`\n- `Sher.ovoz()` → `Rrrr`\n\n`Mushuk` va `Sher` o'z `__init__` ini yozmasin — `nom` ni merosdan olsin.\n\nKirish (stdin): birinchi qatorda `n`. Keyingi `n` qatorda `tur nom`,\nbunda `tur` faqat `hayvon`, `mushuk` yoki `sher` bo'ladi.\n\nHar bir qator uchun `<nom>: <ovoz>` chiqaring.\n\nMisol. Kiritish:\n```\n3\nhayvon Kimdir\nmushuk Bars\nsher Simba\n```\nNatija:\n```\nKimdir: Noaniq ovoz\nBars: Miyov\nSimba: Rrrr\n```",
    "starterCodePy": "# Hayvon -> Mushuk -> Sher meros zanjirini tuzing, ovoz() matn QAYTARSIN.\nclass Hayvon:\n    def __init__(self, nom):\n        self.nom = nom\n\n    def ovoz(self):\n        pass\n\n\nclass Mushuk(Hayvon):\n    pass\n\n\nclass Sher(Mushuk):\n    pass\n\n\nn = int(input())\n# Har bir qatordagi turga mos obyekt yasang va natijani chiqaring\n",
    "testCases": [
      {
        "stdin": "3\nhayvon Kimdir\nmushuk Bars\nsher Simba\n",
        "expectedStdout": "Kimdir: Noaniq ovoz\nBars: Miyov\nSimba: Rrrr\n",
        "hidden": false,
        "label": "Namunadagi misol"
      },
      {
        "stdin": "4\nsher Alex\nsher Nala\nmushuk Tom\nhayvon Nomalum\n",
        "expectedStdout": "Alex: Rrrr\nNala: Rrrr\nTom: Miyov\nNomalum: Noaniq ovoz\n",
        "hidden": false,
        "label": "Takrorlanuvchi turlar"
      },
      {
        "stdin": "1\nmushuk Kesha\n",
        "expectedStdout": "Kesha: Miyov\n",
        "hidden": true,
        "label": "Bitta qator"
      },
      {
        "stdin": "2\nhayvon X\nhayvon Y\n",
        "expectedStdout": "X: Noaniq ovoz\nY: Noaniq ovoz\n",
        "hidden": true,
        "label": "Faqat ota class"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-28",
    "key": "backend-dars-28-hard",
    "title": "Shakl → Kvadrat / Doira",
    "difficulty": "HARD",
    "points": 35,
    "tags": [
      "python",
      "oop",
      "inheritance",
      "yuza"
    ],
    "description": "`Shakl` ota classini va undan meros oluvchi `Kvadrat` hamda `Doira` classlarini yozing.\nHar birida `yuza()` metodi bo'lsin va u sonni QAYTARSIN:\n- `Kvadrat` — `tomon * tomon`\n- `Doira` — `math.pi * radius ** 2`\n\nKirish (stdin): birinchi qatorda `n`. Keyingi `n` qatorda `kvadrat <tomon>` yoki\n`doira <radius>`. O'lchamlar butun son bo'ladi.\n\nHar bir shakl uchun bitta qator chiqaring — yuza ANIQ 2 kasr xonagacha yaxlitlangan\nholda (`f\"{qiymat:.2f}\"`):\n```\nKvadrat: 16.00\nDoira: 28.27\n```\nOxirgi qatorda `Umumiy yuza: <yig'indi>` ni ham 2 kasr xonagacha chiqaring.\n\nMisol. Kiritish:\n```\n2\nkvadrat 4\ndoira 3\n```\nNatija:\n```\nKvadrat: 16.00\nDoira: 28.27\nUmumiy yuza: 44.27\n```",
    "starterCodePy": "import math\n\n\n# Shakl ota class, Kvadrat va Doira undan meros oladi. yuza() son QAYTARSIN.\nclass Shakl:\n    nomi = \"Shakl\"\n\n    def yuza(self):\n        return 0\n\n\nclass Kvadrat(Shakl):\n    pass\n\n\nclass Doira(Shakl):\n    pass\n\n\nn = int(input())\n# Shakllarni yasang, yuzasini 2 kasr xonagacha chiqaring va yig'indini hisoblang\n",
    "testCases": [
      {
        "stdin": "2\nkvadrat 4\ndoira 3\n",
        "expectedStdout": "Kvadrat: 16.00\nDoira: 28.27\nUmumiy yuza: 44.27\n",
        "hidden": false,
        "label": "Namunadagi misol"
      },
      {
        "stdin": "4\ndoira 1\nkvadrat 10\ndoira 7\nkvadrat 2\n",
        "expectedStdout": "Doira: 3.14\nKvadrat: 100.00\nDoira: 153.94\nKvadrat: 4.00\nUmumiy yuza: 261.08\n",
        "hidden": false,
        "label": "To'rtta shakl"
      },
      {
        "stdin": "1\ndoira 0\n",
        "expectedStdout": "Doira: 0.00\nUmumiy yuza: 0.00\n",
        "hidden": true,
        "label": "Nol o'lchov"
      },
      {
        "stdin": "3\nkvadrat 12\nkvadrat 5\nkvadrat 9\n",
        "expectedStdout": "Kvadrat: 144.00\nKvadrat: 25.00\nKvadrat: 81.00\nUmumiy yuza: 250.00\n",
        "hidden": true,
        "label": "Faqat kvadratlar"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-29",
    "key": "backend-dars-29-easy",
    "title": "Himoyalangan bank hisobi",
    "difficulty": "EASY",
    "points": 10,
    "tags": [
      "python",
      "oop",
      "encapsulation",
      "metod"
    ],
    "description": "«Hisob» classini yarating. Balans `_balans` nomli ichki atributda saqlansin va uni\nfaqat metodlar orqali o'zgartirish mumkin bo'lsin:\n- `kirim(summa)` — balansga qo'shadi va `Kirim: <summa>. Balans: <balans>` chiqaradi;\n- `chiqim(summa)` — agar `summa` balansdan katta bo'lsa, balansga TEGMASDAN\n  `Mablag' yetarli emas` chiqaradi; aks holda ayiradi va\n  `Chiqim: <summa>. Balans: <balans>` chiqaradi.\n\nKirish (stdin): birinchi qatorda boshlang'ich balans (butun son). Keyin har bir qatorda\n`kirim <summa>` yoki `chiqim <summa>` buyrug'i keladi. `yakun` qatori kelganda to'xtang.\n\nOxirida `Yakuniy balans: <balans>` deb chiqaring.\n\nMisol. Kiritish:\n```\n100\nkirim 50\nchiqim 200\nchiqim 30\nyakun\n```\nNatija:\n```\nKirim: 50. Balans: 150\nMablag' yetarli emas\nChiqim: 30. Balans: 120\nYakuniy balans: 120\n```",
    "starterCodePy": "# Hisob classi: _balans ichki atribut, kirim() va chiqim() metodlari.\nclass Hisob:\n    def __init__(self, balans):\n        self._balans = balans\n\n    def kirim(self, summa):\n        pass\n\n    def chiqim(self, summa):\n        pass\n\n\nhisob = Hisob(int(input()))\n# Buyruqlarni \"yakun\" so'ziga qadar o'qing va bajaring\n",
    "testCases": [
      {
        "stdin": "100\nkirim 50\nchiqim 200\nchiqim 30\nyakun\n",
        "expectedStdout": "Kirim: 50. Balans: 150\nMablag' yetarli emas\nChiqim: 30. Balans: 120\nYakuniy balans: 120\n",
        "hidden": false,
        "label": "Namunadagi misol"
      },
      {
        "stdin": "0\nkirim 1000\nchiqim 1000\nchiqim 1\nyakun\n",
        "expectedStdout": "Kirim: 1000. Balans: 1000\nChiqim: 1000. Balans: 0\nMablag' yetarli emas\nYakuniy balans: 0\n",
        "hidden": false,
        "label": "Balans nolga tushadi"
      },
      {
        "stdin": "500\nyakun\n",
        "expectedStdout": "Yakuniy balans: 500\n",
        "hidden": true,
        "label": "Buyruqsiz yakunlanish"
      },
      {
        "stdin": "50\nchiqim 50\nkirim 25\nchiqim 26\nyakun\n",
        "expectedStdout": "Chiqim: 50. Balans: 0\nKirim: 25. Balans: 25\nMablag' yetarli emas\nYakuniy balans: 25\n",
        "hidden": true,
        "label": "Chegaraviy summalar"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-29",
    "key": "backend-dars-29-medium",
    "title": "Harorat va @setter tekshiruvi",
    "difficulty": "MEDIUM",
    "points": 20,
    "tags": [
      "python",
      "oop",
      "property",
      "setter"
    ],
    "description": "«Harorat» classini yarating. Qiymat `_qiymat` ichki atributda saqlansin,\ntashqariga esa `qiymat` nomli `@property` orqali chiqsin.\n\n`@qiymat.setter` ichida tekshiruv bo'lsin: agar berilgan qiymat -273 dan kichik bo'lsa,\n`raise ValueError(\"-273 dan past bo'lishi mumkin emas\")` qiling.\n\nBoshlang'ich harorat 0 bo'lsin.\n\nKirish (stdin): birinchi qatorda `n`. Keyingi `n` qatorda butun son — yangi harorat.\nHar bir son uchun `try/except ValueError` ichida qiymatni o'rnating:\n- muvaffaqiyatli bo'lsa `Harorat: <qiymat>` chiqaring;\n- xatolik bo'lsa `Xato: <xato matni>` chiqaring (matnni `str(e)` dan oling).\n\nOxirida `Oxirgi harorat: <qiymat>` deb chiqaring.\n\nMisol. Kiritish:\n```\n3\n25\n-300\n-10\n```\nNatija:\n```\nHarorat: 25\nXato: -273 dan past bo'lishi mumkin emas\nHarorat: -10\nOxirgi harorat: -10\n```",
    "starterCodePy": "# Harorat classi: @property va tekshiruvli @setter.\nclass Harorat:\n    def __init__(self):\n        self._qiymat = 0\n\n    @property\n    def qiymat(self):\n        pass\n\n    @qiymat.setter\n    def qiymat(self, yangi):\n        pass\n\n\nh = Harorat()\nn = int(input())\n# Har bir qiymatni try/except ichida o'rnating\n",
    "testCases": [
      {
        "stdin": "3\n25\n-300\n-10\n",
        "expectedStdout": "Harorat: 25\nXato: -273 dan past bo'lishi mumkin emas\nHarorat: -10\nOxirgi harorat: -10\n",
        "hidden": false,
        "label": "Namunadagi misol"
      },
      {
        "stdin": "4\n-273\n-274\n0\n100\n",
        "expectedStdout": "Harorat: -273\nXato: -273 dan past bo'lishi mumkin emas\nHarorat: 0\nHarorat: 100\nOxirgi harorat: 100\n",
        "hidden": false,
        "label": "Chegara atrofidagi qiymatlar"
      },
      {
        "stdin": "1\n-1000\n",
        "expectedStdout": "Xato: -273 dan past bo'lishi mumkin emas\nOxirgi harorat: 0\n",
        "hidden": true,
        "label": "Faqat rad etilgan qiymat"
      },
      {
        "stdin": "0\n",
        "expectedStdout": "Oxirgi harorat: 0\n",
        "hidden": true,
        "label": "Hech qanday o'zgarish yo'q"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-29",
    "key": "backend-dars-29-hard",
    "title": "Faqat o'qish uchun to'liq ism",
    "difficulty": "HARD",
    "points": 35,
    "tags": [
      "python",
      "oop",
      "property",
      "read-only"
    ],
    "description": "«Talaba» classini yarating: `__init__` da `ism` va `familiya` saqlansin.\nClassga `toliq_ism` nomli `@property` qo'shing — u `<ism> <familiya>` matnini QAYTARSIN.\nBu property'ga SETTER YOZMANG — u faqat o'qish uchun bo'lsin.\n\nKirish (stdin): birinchi qatorda `n`. Keyingi `n` qatorda `ism familiya`.\n\nHar bir talaba uchun `<tartib>. <toliq_ism>` chiqaring (tartib 1 dan boshlanadi).\n\nSo'ng OXIRGI yaratilgan talabaning `toliq_ism` iga qiymat berishga urinib ko'ring va\nbuni `try/except AttributeError` ichiga oling. `except` blokida ANIQ shu qatorni chiqaring:\n`Xato: to'liq ismni o'zgartirib bo'lmaydi`\n\nAgar `n` nolga teng bo'lsa, faqat shu oxirgi qator chiqmasin — u holda hech narsa\nchiqarilmaydi.\n\nMisol. Kiritish:\n```\n2\nAli Karimov\nMalika Toshpulatova\n```\nNatija:\n```\n1. Ali Karimov\n2. Malika Toshpulatova\nXato: to'liq ismni o'zgartirib bo'lmaydi\n```",
    "starterCodePy": "# Talaba classi: toliq_ism faqat o'qish uchun @property bo'lsin (setter yo'q).\nclass Talaba:\n    def __init__(self, ism, familiya):\n        self.ism = ism\n        self.familiya = familiya\n\n    @property\n    def toliq_ism(self):\n        pass\n\n\nn = int(input())\noxirgi = None\n# Talabalarni chiqaring, so'ng oxirgisining toliq_ism ini o'zgartirishga urinib ko'ring\n",
    "testCases": [
      {
        "stdin": "2\nAli Karimov\nMalika Toshpulatova\n",
        "expectedStdout": "1. Ali Karimov\n2. Malika Toshpulatova\nXato: to'liq ismni o'zgartirib bo'lmaydi\n",
        "hidden": false,
        "label": "Namunadagi misol"
      },
      {
        "stdin": "3\nBexruz Saidov\nZilola Rasulova\nOtabek Yusupov\n",
        "expectedStdout": "1. Bexruz Saidov\n2. Zilola Rasulova\n3. Otabek Yusupov\nXato: to'liq ismni o'zgartirib bo'lmaydi\n",
        "hidden": false,
        "label": "Uchta talaba"
      },
      {
        "stdin": "1\nA B\n",
        "expectedStdout": "1. A B\nXato: to'liq ismni o'zgartirib bo'lmaydi\n",
        "hidden": true,
        "label": "Bitta talaba"
      },
      {
        "stdin": "0\n",
        "expectedStdout": "",
        "hidden": true,
        "label": "Ro'yxat bo'sh"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-30",
    "key": "backend-dars-30-easy",
    "title": "__str__ va __repr__ farqi",
    "difficulty": "EASY",
    "points": 10,
    "tags": [
      "python",
      "oop",
      "magic",
      "repr"
    ],
    "description": "«Nuqta» classini yarating: atributlari `x` va `y` (butun sonlar).\nUnga IKKALA magic metodni ham qo'shing:\n- `__str__` → `(<x>, <y>)` matnini qaytarsin (odam uchun);\n- `__repr__` → `Nuqta(x=<x>, y=<y>)` matnini qaytarsin (dasturchi uchun).\n\nKirish (stdin): birinchi qatorda `n`. Keyingi `n` qatorda `x y`.\n\nAvval har bir nuqtani `print(nuqta)` bilan chiqaring (bu `__str__` ni ishlatadi).\nSo'ng barcha nuqtalarni bitta ro'yxatga solib, `print(royxat)` qiling —\nro'yxat elementlarni `__repr__` orqali ko'rsatadi.\n\nMisol. Kiritish:\n```\n2\n1 2\n-3 4\n```\nNatija:\n```\n(1, 2)\n(-3, 4)\n[Nuqta(x=1, y=2), Nuqta(x=-3, y=4)]\n```",
    "starterCodePy": "# Nuqta classiga __str__ va __repr__ metodlarini yozing.\nclass Nuqta:\n    def __init__(self, x, y):\n        self.x = x\n        self.y = y\n\n    def __str__(self):\n        pass\n\n    def __repr__(self):\n        pass\n\n\nn = int(input())\nnuqtalar = []\n# Har bir nuqtani print qiling, so'ng butun ro'yxatni print qiling\n",
    "testCases": [
      {
        "stdin": "2\n1 2\n-3 4\n",
        "expectedStdout": "(1, 2)\n(-3, 4)\n[Nuqta(x=1, y=2), Nuqta(x=-3, y=4)]\n",
        "hidden": false,
        "label": "Namunadagi misol"
      },
      {
        "stdin": "3\n0 0\n10 -10\n-5 -5\n",
        "expectedStdout": "(0, 0)\n(10, -10)\n(-5, -5)\n[Nuqta(x=0, y=0), Nuqta(x=10, y=-10), Nuqta(x=-5, y=-5)]\n",
        "hidden": false,
        "label": "Manfiy va nol koordinatalar"
      },
      {
        "stdin": "1\n7 8\n",
        "expectedStdout": "(7, 8)\n[Nuqta(x=7, y=8)]\n",
        "hidden": true,
        "label": "Bitta nuqta"
      },
      {
        "stdin": "0\n",
        "expectedStdout": "[]\n",
        "hidden": true,
        "label": "Bo'sh ro'yxat"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-30",
    "key": "backend-dars-30-medium",
    "title": "Polimorfizm: bitta chaqiruv, turli ovoz",
    "difficulty": "MEDIUM",
    "points": 20,
    "tags": [
      "python",
      "oop",
      "polimorfizm",
      "override"
    ],
    "description": "`Hayvon` ota classini yozing: `nom` atributi va `ovoz()` metodi\n(`Hayvon.ovoz()` → `...` matnini qaytarsin — uch nuqta).\n\nUndan `Mushuk` va `It` classlarini meros qilib oling va ikkalasida ham `ovoz()` ni\noverride qiling: `Mushuk` → `Miyov`, `It` → `Vov`.\n\nKirish (stdin): birinchi qatorda `n`. Keyingi `n` qatorda `tur nom`,\nbunda `tur` — `mushuk`, `it` yoki `hayvon`.\n\nBarcha obyektlarni BITTA ro'yxatga soling va ro'yxat bo'ylab bitta sikl bilan yuring —\nhar bir element uchun aynan bir xil `h.ovoz()` chaqiruvini yozing. Bu polimorfizm.\nHar bir qator: `<nom> deydi: <ovoz>`\n\nOxirida `Mushuklar: <a>, itlar: <b>` deb chiqaring (`a` va `b` — mos turdagilar soni).\n\nMisol. Kiritish:\n```\n3\nmushuk Bars\nit Rex\nmushuk Kesha\n```\nNatija:\n```\nBars deydi: Miyov\nRex deydi: Vov\nKesha deydi: Miyov\nMushuklar: 2, itlar: 1\n```",
    "starterCodePy": "# Hayvon -> Mushuk / It. ovoz() ni override qiling va bitta sikl bilan chaqiring.\nclass Hayvon:\n    def __init__(self, nom):\n        self.nom = nom\n\n    def ovoz(self):\n        return \"...\"\n\n\nclass Mushuk(Hayvon):\n    pass\n\n\nclass It(Hayvon):\n    pass\n\n\nn = int(input())\nhayvonlar = []\n# Obyektlarni ro'yxatga soling, sikl bilan ovoz() ni chaqiring va turlarni sanang\n",
    "testCases": [
      {
        "stdin": "3\nmushuk Bars\nit Rex\nmushuk Kesha\n",
        "expectedStdout": "Bars deydi: Miyov\nRex deydi: Vov\nKesha deydi: Miyov\nMushuklar: 2, itlar: 1\n",
        "hidden": false,
        "label": "Namunadagi misol"
      },
      {
        "stdin": "4\nit Sharik\nhayvon Nomalum\nit Bobik\nmushuk Tom\n",
        "expectedStdout": "Sharik deydi: Vov\nNomalum deydi: ...\nBobik deydi: Vov\nTom deydi: Miyov\nMushuklar: 1, itlar: 2\n",
        "hidden": false,
        "label": "Ota class ham qatnashadi"
      },
      {
        "stdin": "1\nhayvon X\n",
        "expectedStdout": "X deydi: ...\nMushuklar: 0, itlar: 0\n",
        "hidden": true,
        "label": "Faqat ota class"
      },
      {
        "stdin": "0\n",
        "expectedStdout": "Mushuklar: 0, itlar: 0\n",
        "hidden": true,
        "label": "Bo'sh ro'yxat"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-30",
    "key": "backend-dars-30-hard",
    "title": "Savat classi: __len__, __contains__, __str__",
    "difficulty": "HARD",
    "points": 35,
    "tags": [
      "python",
      "oop",
      "magic",
      "savat"
    ],
    "description": "«Savat» classini yarating. Ichida mahsulot nomlari ro'yxati saqlansin.\nUnga uchta magic metod yozing:\n- `__str__` → mahsulotlarni `, ` bilan birlashtirib qaytarsin; savat bo'sh bo'lsa `bo'sh` qaytarsin;\n- `__len__` → mahsulotlar sonini qaytarsin (`len(savat)` shu tufayli ishlaydi);\n- `__contains__` → mahsulot savatda bor-yo'qligini qaytarsin (`nom in savat` shu tufayli ishlaydi).\n\n`qosh(nom)` metodi ham bo'lsin — mahsulotni ro'yxatga qo'shadi.\n\nKirish (stdin): 1-qatorda `n`, keyingi `n` qatorda mahsulot nomi,\nso'nggi qatorda qidiriladigan nom.\n\nChiqaring:\n```\nSavat: <str(savat)>\nElementlar soni: <len(savat)>\n<qidirilgan nom> bor\n```\nOxirgi qatorda mahsulot savatda bo'lmasa `bor` o'rniga `yo'q` yozing.\nTekshirishda `in` operatoridan foydalaning.\n\nMisol. Kiritish:\n```\n3\nolma\nnon\nsut\nnon\n```\nNatija:\n```\nSavat: olma, non, sut\nElementlar soni: 3\nnon bor\n```",
    "starterCodePy": "# Savat classi: qosh(), __str__, __len__ va __contains__ metodlari.\nclass Savat:\n    def __init__(self):\n        self.mahsulotlar = []\n\n    def qosh(self, nom):\n        pass\n\n    def __str__(self):\n        pass\n\n    def __len__(self):\n        pass\n\n    def __contains__(self, nom):\n        pass\n\n\nn = int(input())\nsavat = Savat()\n# Mahsulotlarni qo'shing, so'ng savatni, sonini va qidiruv natijasini chiqaring\n",
    "testCases": [
      {
        "stdin": "3\nolma\nnon\nsut\nnon\n",
        "expectedStdout": "Savat: olma, non, sut\nElementlar soni: 3\nnon bor\n",
        "hidden": false,
        "label": "Namunadagi misol"
      },
      {
        "stdin": "4\nguruch\nyog\ntuz\nshakar\nkartoshka\n",
        "expectedStdout": "Savat: guruch, yog, tuz, shakar\nElementlar soni: 4\nkartoshka yo'q\n",
        "hidden": false,
        "label": "Mahsulot topilmadi"
      },
      {
        "stdin": "0\nolma\n",
        "expectedStdout": "Savat: bo'sh\nElementlar soni: 0\nolma yo'q\n",
        "hidden": true,
        "label": "Savat bo'sh"
      },
      {
        "stdin": "2\nolma\nolma\nolma\n",
        "expectedStdout": "Savat: olma, olma\nElementlar soni: 2\nolma bor\n",
        "hidden": true,
        "label": "Takrorlangan mahsulot"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-31",
    "key": "backend-dars-31-easy",
    "title": "Juft sonlar comprehension bilan",
    "difficulty": "EASY",
    "points": 10,
    "tags": [
      "python",
      "comprehension",
      "filtr"
    ],
    "description": "1 dan `n` gacha (`n` ham kiradi) bo'lgan JUFT sonlar ro'yxatini BITTA\nlist comprehension bilan yasang. Sikl va `append()` ishlatmang.\n\nKirish (stdin): bitta qator — butun son `n`.\n\nChiqarish 2 qator:\n1-qator — ro'yxatning o'zi (`print(royxat)`, ya'ni `[2, 4, 6]` ko'rinishida);\n2-qator — `Yig'indi: <yig'indi>`.\n\nMisol. Kiritish:\n```\n7\n```\nNatija:\n```\n[2, 4, 6]\nYig'indi: 12\n```",
    "starterCodePy": "# Juft sonlarni bitta list comprehension bilan yig'ing.\nn = int(input())\njuftlar = []  # bu yerni comprehension bilan almashtiring\nprint(juftlar)\n# Yig'indini chiqaring\n",
    "testCases": [
      {
        "stdin": "7\n",
        "expectedStdout": "[2, 4, 6]\nYig'indi: 12\n",
        "hidden": false,
        "label": "Namunadagi misol"
      },
      {
        "stdin": "20\n",
        "expectedStdout": "[2, 4, 6, 8, 10, 12, 14, 16, 18, 20]\nYig'indi: 110\n",
        "hidden": false,
        "label": "Yigirmagacha"
      },
      {
        "stdin": "1\n",
        "expectedStdout": "[]\nYig'indi: 0\n",
        "hidden": true,
        "label": "Juft son yo'q"
      },
      {
        "stdin": "2\n",
        "expectedStdout": "[2]\nYig'indi: 2\n",
        "hidden": true,
        "label": "Chegaraviy qiymat"
      },
      {
        "stdin": "100\n",
        "expectedStdout": "[2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48, 50, 52, 54, 56, 58, 60, 62, 64, 66, 68, 70, 72, 74, 76, 78, 80, 82, 84, 86, 88, 90, 92, 94, 96, 98, 100]\nYig'indi: 2550\n",
        "hidden": true,
        "label": "Katta qiymat"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-31",
    "key": "backend-dars-31-medium",
    "title": "So'z va uzunlik lug'ati",
    "difficulty": "MEDIUM",
    "points": 20,
    "tags": [
      "python",
      "comprehension",
      "dict"
    ],
    "description": "Bitta qatorda bo'sh joy bilan ajratilgan so'zlar beriladi. DICT COMPREHENSION bilan\n`{so'z: uzunlik}` ko'rinishidagi lug'at yasang.\n\nKirish (stdin): bitta qator so'zlar.\n\nChiqarish 2 qator:\n1-qator — lug'atning o'zi (`print(lugat)`);\n2-qator — `Eng uzun: <so'z>`. Agar bir nechta so'z eng uzun bo'lsa, ULARDAN BIRINCHISINI\nchiqaring.\n\nDiqqat: takrorlangan so'z lug'atda bir marta qoladi.\n\nMisol. Kiritish:\n```\nolma non anor\n```\nNatija:\n```\n{'olma': 4, 'non': 3, 'anor': 4}\nEng uzun: olma\n```",
    "starterCodePy": "# Dict comprehension bilan {so'z: uzunlik} lug'atini yasang.\nsozlar = input().split()\nlugat = {}  # bu yerni dict comprehension bilan almashtiring\nprint(lugat)\n# Eng uzun so'zni toping va chiqaring\n",
    "testCases": [
      {
        "stdin": "olma non anor\n",
        "expectedStdout": "{'olma': 4, 'non': 3, 'anor': 4}\nEng uzun: olma\n",
        "hidden": false,
        "label": "Namunadagi misol"
      },
      {
        "stdin": "python dasturlash til\n",
        "expectedStdout": "{'python': 6, 'dasturlash': 10, 'til': 3}\nEng uzun: dasturlash\n",
        "hidden": false,
        "label": "Turli uzunliklar"
      },
      {
        "stdin": "bir bir ikki\n",
        "expectedStdout": "{'bir': 3, 'ikki': 4}\nEng uzun: ikki\n",
        "hidden": true,
        "label": "Takrorlangan so'z"
      },
      {
        "stdin": "a\n",
        "expectedStdout": "{'a': 1}\nEng uzun: a\n",
        "hidden": true,
        "label": "Bitta so'z"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-31",
    "key": "backend-dars-31-hard",
    "title": "Ichma-ich comprehension",
    "difficulty": "HARD",
    "points": 35,
    "tags": [
      "python",
      "comprehension",
      "nested"
    ],
    "description": "Bir nechta qatorda sonlar beriladi. BITTA ichma-ich (nested) list comprehension bilan\nbarcha qatorlardagi 3 ga BO'LINADIGAN sonlarning KVADRATLARINI yig'ing.\nTartib: qatorlar tartibida, har bir qator ichida chapdan o'ngga.\n\nKirish (stdin): birinchi qatorda `n` — qatorlar soni. Keyingi `n` qatorning har birida\nbo'sh joy bilan ajratilgan butun sonlar.\n\nChiqarish 3 qator:\n1-qator — natija ro'yxati (`print(...)`);\n2-qator — `Soni: <nechta element>`;\n3-qator — `Yig'indi: <yig'indi>`.\n\nMisol. Kiritish:\n```\n2\n1 3 4\n6 7 9\n```\nNatija:\n```\n[9, 36, 81]\nSoni: 3\nYig'indi: 126\n```",
    "starterCodePy": "# Avval qatorlarni o'qib matritsa yasang, so'ng bitta nested comprehension yozing.\nn = int(input())\nmatritsa = [input().split() for _ in range(n)]\nnatija = []  # bu yerni nested comprehension bilan almashtiring\nprint(natija)\n# Soni va yig'indini chiqaring\n",
    "testCases": [
      {
        "stdin": "2\n1 3 4\n6 7 9\n",
        "expectedStdout": "[9, 36, 81]\nSoni: 3\nYig'indi: 126\n",
        "hidden": false,
        "label": "Namunadagi misol"
      },
      {
        "stdin": "3\n0 1 2\n12 15 18\n5 7 11\n",
        "expectedStdout": "[0, 144, 225, 324]\nSoni: 4\nYig'indi: 693\n",
        "hidden": false,
        "label": "Nol ham bo'linadi"
      },
      {
        "stdin": "1\n1 2 4 5\n",
        "expectedStdout": "[]\nSoni: 0\nYig'indi: 0\n",
        "hidden": true,
        "label": "Mos son yo'q"
      },
      {
        "stdin": "2\n-3 -6 2\n3 3 3\n",
        "expectedStdout": "[9, 36, 9, 9, 9]\nSoni: 5\nYig'indi: 72\n",
        "hidden": true,
        "label": "Manfiy sonlar"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-32",
    "key": "backend-dars-32-easy",
    "title": "Birinchi generatoringiz",
    "difficulty": "EASY",
    "points": 10,
    "tags": [
      "python",
      "generator",
      "yield"
    ],
    "description": "`sonlar(n)` nomli GENERATOR funksiya yozing — u 1 dan `n` gacha (`n` ham kiradi)\nsonlarni `yield` bilan birma-bir bersin. `return` bilan ro'yxat qaytarmang.\n\nKirish (stdin): bitta qator — butun son `n`.\n\nChiqarish 2 qator:\n1-qator — sonlar bo'sh joy bilan ajratilgan holda (`print(*sonlar(n))`);\n2-qator — `Yig'indi: <yig'indi>`.\n\nDiqqat: generator BIR MARTA o'qiladi. Shuning uchun yig'indi uchun `sonlar(n)` ni\nQAYTA chaqiring.\n\nMisol. Kiritish:\n```\n5\n```\nNatija:\n```\n1 2 3 4 5\nYig'indi: 15\n```\n\nAgar `n` 0 ga teng bo'lsa, birinchi qator bo'sh qoladi.",
    "starterCodePy": "# yield ishlatib generator yozing.\ndef sonlar(n):\n    pass\n\n\nn = int(input())\nprint(*sonlar(n))\n# Yig'indi uchun generatorni qaytadan chaqiring\n",
    "testCases": [
      {
        "stdin": "5\n",
        "expectedStdout": "1 2 3 4 5\nYig'indi: 15\n",
        "hidden": false,
        "label": "Namunadagi misol"
      },
      {
        "stdin": "10\n",
        "expectedStdout": "1 2 3 4 5 6 7 8 9 10\nYig'indi: 55\n",
        "hidden": false,
        "label": "O'ngacha"
      },
      {
        "stdin": "1\n",
        "expectedStdout": "1\nYig'indi: 1\n",
        "hidden": true,
        "label": "Bitta element"
      },
      {
        "stdin": "0\n",
        "expectedStdout": "\nYig'indi: 0\n",
        "hidden": true,
        "label": "Bo'sh generator"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-32",
    "key": "backend-dars-32-medium",
    "title": "Fibonachchi generatori",
    "difficulty": "MEDIUM",
    "points": 20,
    "tags": [
      "python",
      "generator",
      "fibonachchi"
    ],
    "description": "`fib(k)` nomli GENERATOR funksiya yozing — u Fibonachchi ketma-ketligining\nbirinchi `k` ta hadini `yield` bilan bersin. Ketma-ketlik `1, 1, 2, 3, 5, 8, ...`\nko'rinishida boshlanadi.\n\nKirish (stdin): bitta qator — butun son `k`.\n\nChiqarish 2 qator:\n1-qator — hadlar bo'sh joy bilan ajratilgan holda;\n2-qator — `Oxirgi had: <qiymat>`.\n\nAgar `k` 0 ga teng bo'lsa, 1-qator bo'sh qoladi va 2-qatorda `Oxirgi had: yo'q` yoziladi.\n\nMisol. Kiritish:\n```\n7\n```\nNatija:\n```\n1 1 2 3 5 8 13\nOxirgi had: 13\n```",
    "starterCodePy": "# Fibonachchi generatorini yozing (1, 1, 2, 3, 5, ...).\ndef fib(k):\n    pass\n\n\nk = int(input())\nhadlar = list(fib(k))\nprint(*hadlar)\n# Oxirgi hadni chiqaring (bo'lmasa \"yo'q\")\n",
    "testCases": [
      {
        "stdin": "7\n",
        "expectedStdout": "1 1 2 3 5 8 13\nOxirgi had: 13\n",
        "hidden": false,
        "label": "Namunadagi misol"
      },
      {
        "stdin": "15\n",
        "expectedStdout": "1 1 2 3 5 8 13 21 34 55 89 144 233 377 610\nOxirgi had: 610\n",
        "hidden": false,
        "label": "O'n beshta had"
      },
      {
        "stdin": "1\n",
        "expectedStdout": "1\nOxirgi had: 1\n",
        "hidden": true,
        "label": "Bitta had"
      },
      {
        "stdin": "2\n",
        "expectedStdout": "1 1\nOxirgi had: 1\n",
        "hidden": true,
        "label": "Ikkita had"
      },
      {
        "stdin": "0\n",
        "expectedStdout": "\nOxirgi had: yo'q\n",
        "hidden": true,
        "label": "Bo'sh ketma-ketlik"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-32",
    "key": "backend-dars-32-hard",
    "title": "Satrlarni filtrlovchi generator",
    "difficulty": "HARD",
    "points": 35,
    "tags": [
      "python",
      "generator",
      "filtr",
      "yield"
    ],
    "description": "Katta faylni butunlay xotiraga yuklamasdan o'qish uchun generator ishlatiladi.\nShu g'oyani mashq qilamiz.\n\n`qidir(satrlar, soz)` nomli GENERATOR funksiya yozing — u `satrlar` ro'yxati bo'ylab\nyurib, ichida `soz` QATNASHGAN satrlarni `(tartib, satr)` juftligi ko'rinishida\n`yield` qilsin. Tartib 1 dan boshlanadi va BARCHA satrlar bo'yicha sanaladi\n(mos kelmaganlari ham hisobga olinadi). Qidiruv katta-kichik harfga sezgir.\n\nKirish (stdin): 1-qator — qidiriladigan so'z. Keyingi qatorlar — matn satrlari.\n`TUGADI` qatori kelganda o'qishni to'xtating (u satr hisoblanmaydi).\n\nHar bir topilgan satr uchun `<tartib>: <satr>` chiqaring,\noxirgi qatorda esa `Topildi: <soni> ta` deb chiqaring.\n\nMisol. Kiritish:\n```\nxato\nhammasi joyida\nxato yuz berdi\ntayyor\nyana xato\nTUGADI\n```\nNatija:\n```\n2: xato yuz berdi\n4: yana xato\nTopildi: 2 ta\n```",
    "starterCodePy": "# qidir() generatorini yozing: mos satrlarni (tartib, satr) ko'rinishida yield qiling.\ndef qidir(satrlar, soz):\n    pass\n\n\nsoz = input()\nsatrlar = []\nwhile True:\n    qator = input()\n    if qator == \"TUGADI\":\n        break\n    satrlar.append(qator)\n\n# Generatordan foydalanib natijani chiqaring va topilganlar sonini sanang\n",
    "testCases": [
      {
        "stdin": "xato\nhammasi joyida\nxato yuz berdi\ntayyor\nyana xato\nTUGADI\n",
        "expectedStdout": "2: xato yuz berdi\n4: yana xato\nTopildi: 2 ta\n",
        "hidden": false,
        "label": "Namunadagi misol"
      },
      {
        "stdin": "log\nlogin sahifasi\nbosh sahifa\nlogout tugmasi\nLOG katta harfda\nTUGADI\n",
        "expectedStdout": "1: login sahifasi\n3: logout tugmasi\nTopildi: 2 ta\n",
        "hidden": false,
        "label": "Katta-kichik harf farqi"
      },
      {
        "stdin": "python\nJava\nC++\nTUGADI\n",
        "expectedStdout": "Topildi: 0 ta\n",
        "hidden": true,
        "label": "Hech narsa topilmadi"
      },
      {
        "stdin": "a\nTUGADI\n",
        "expectedStdout": "Topildi: 0 ta\n",
        "hidden": true,
        "label": "Matn bo'sh"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-33",
    "key": "backend-dars-33-easy",
    "title": "Log yozuvchi decorator",
    "difficulty": "EASY",
    "points": 10,
    "tags": [
      "python",
      "decorator",
      "funksiya"
    ],
    "description": "`log` nomli DECORATOR yozing. U o'ralgan funksiyani o'zgartirmasdan quyidagilarni qilsin:\n- chaqiruvdan OLDIN `Chaqirildi: <funksiya nomi>` chiqarsin (nomni `func.__name__` dan oling);\n- funksiyani chaqirib, natijani `Natija: <qiymat>` ko'rinishida chiqarsin;\n- natijani `return` qilsin.\n\n`wrapper` `*args` qabul qilsin, shunda har qanday funksiyaga yopishadi.\n\n`@log` bilan ikkita funksiyani bezang:\n- `qoshish(a, b)` → `a + b` ni qaytaradi;\n- `kopaytir(a, b)` → `a * b` ni qaytaradi.\n\nKirish (stdin): bitta qatorda bo'sh joy bilan ajratilgan ikkita butun son `a` va `b`.\nAvval `qoshish(a, b)`, so'ng `kopaytir(a, b)` ni chaqiring.\n\nMisol. Kiritish:\n```\n3 4\n```\nNatija:\n```\nChaqirildi: qoshish\nNatija: 7\nChaqirildi: kopaytir\nNatija: 12\n```",
    "starterCodePy": "# log decoratorini yozing.\ndef log(func):\n    def wrapper(*args):\n        pass\n    return wrapper\n\n\n@log\ndef qoshish(a, b):\n    return a + b\n\n\n# kopaytir funksiyasini ham @log bilan bezang\n\na, b = input().split()\n# Ikkala funksiyani chaqiring\n",
    "testCases": [
      {
        "stdin": "3 4\n",
        "expectedStdout": "Chaqirildi: qoshish\nNatija: 7\nChaqirildi: kopaytir\nNatija: 12\n",
        "hidden": false,
        "label": "Namunadagi misol"
      },
      {
        "stdin": "10 0\n",
        "expectedStdout": "Chaqirildi: qoshish\nNatija: 10\nChaqirildi: kopaytir\nNatija: 0\n",
        "hidden": false,
        "label": "Nol bilan ko'paytirish"
      },
      {
        "stdin": "-5 6\n",
        "expectedStdout": "Chaqirildi: qoshish\nNatija: 1\nChaqirildi: kopaytir\nNatija: -30\n",
        "hidden": true,
        "label": "Manfiy son"
      },
      {
        "stdin": "1000 1000\n",
        "expectedStdout": "Chaqirildi: qoshish\nNatija: 2000\nChaqirildi: kopaytir\nNatija: 1000000\n",
        "hidden": true,
        "label": "Katta sonlar"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-33",
    "key": "backend-dars-33-medium",
    "title": "Bezakli javob va functools.wraps",
    "difficulty": "MEDIUM",
    "points": 20,
    "tags": [
      "python",
      "decorator",
      "wraps",
      "closure"
    ],
    "description": "`bezak` nomli DECORATOR yozing. U o'ralgan funksiya QAYTARGAN matnni\n`*** <matn> ***` ko'rinishiga o'rab qaytarsin (ekranga chiqarmasin — `return` qilsin).\n\n`wrapper` ni `functools.wraps(func)` bilan bezang — shunda funksiyaning asl nomi\nsaqlanib qoladi.\n\n`@bezak` bilan `salom(ism)` funksiyasini bezang. Bezaksiz `salom(ism)`\n`Salom, <ism>!` matnini qaytaradi.\n\nKirish (stdin): 1-qatorda `n`, keyingi `n` qatorda ism.\n\nHar bir ism uchun `salom(ism)` natijasini `print()` qiling.\nOxirgi qatorda `Funksiya nomi: <salom.__name__>` deb chiqaring —\n`@wraps` tufayli u `salom` bo'lib qolishi kerak.\n\nMisol. Kiritish:\n```\n2\nAli\nMalika\n```\nNatija:\n```\n*** Salom, Ali! ***\n*** Salom, Malika! ***\nFunksiya nomi: salom\n```",
    "starterCodePy": "from functools import wraps\n\n\n# bezak decoratorini yozing: natijani *** bilan o'rab QAYTARSIN.\ndef bezak(func):\n    @wraps(func)\n    def wrapper(*args, **kwargs):\n        pass\n    return wrapper\n\n\n@bezak\ndef salom(ism):\n    return f\"Salom, {ism}!\"\n\n\nn = int(input())\n# Har bir ism uchun natijani chiqaring, oxirida funksiya nomini chiqaring\n",
    "testCases": [
      {
        "stdin": "2\nAli\nMalika\n",
        "expectedStdout": "*** Salom, Ali! ***\n*** Salom, Malika! ***\nFunksiya nomi: salom\n",
        "hidden": false,
        "label": "Namunadagi misol"
      },
      {
        "stdin": "3\nBexruz\nZilola\nOtabek\n",
        "expectedStdout": "*** Salom, Bexruz! ***\n*** Salom, Zilola! ***\n*** Salom, Otabek! ***\nFunksiya nomi: salom\n",
        "hidden": false,
        "label": "Uchta ism"
      },
      {
        "stdin": "0\n",
        "expectedStdout": "Funksiya nomi: salom\n",
        "hidden": true,
        "label": "Ism yo'q, faqat nom tekshiriladi"
      },
      {
        "stdin": "1\nA\n",
        "expectedStdout": "*** Salom, A! ***\nFunksiya nomi: salom\n",
        "hidden": true,
        "label": "Bitta harf"
      }
    ]
  },
  {
    "lessonKey": "backend-dars-33",
    "key": "backend-dars-33-hard",
    "title": "Chaqiruvlarni sanovchi decorator",
    "difficulty": "HARD",
    "points": 35,
    "tags": [
      "python",
      "decorator",
      "closure",
      "hisoblagich"
    ],
    "description": "`sanagich` nomli DECORATOR yozing. U closure yordamida funksiya NECHA MARTA\nchaqirilganini eslab qolsin:\n- har bir chaqiruvda hisoblagichni 1 ga oshirsin;\n- joriy qiymatni `wrapper.hisob` atributiga yozsin (shunda tashqaridan o'qish mumkin);\n- o'ralgan funksiyaning natijasini `return` qilsin.\n\n`@sanagich` bilan ikkita funksiyani bezang:\n- `salom(ism)` → `Salom, <ism>!` matnini qaytaradi;\n- `xayr(ism)` → `Xayr, <ism>!` matnini qaytaradi.\n\nHar bir funksiyaning hisoblagichi ALOHIDA bo'lishi kerak.\n\nKirish (stdin): har bir qatorda `salom <ism>` yoki `xayr <ism>` buyrug'i.\n`yakun` qatori kelganda to'xtang.\n\nHar bir buyruq uchun funksiya natijasini `print()` qiling. Oxirida ikkita qator chiqaring:\n```\nsalom: <a> marta\nxayr: <b> marta\n```\n\nMisol. Kiritish:\n```\nsalom Ali\nxayr Vali\nsalom Malika\nyakun\n```\nNatija:\n```\nSalom, Ali!\nXayr, Vali!\nSalom, Malika!\nsalom: 2 marta\nxayr: 1 marta\n```",
    "starterCodePy": "# sanagich decoratorini closure bilan yozing va hisobni wrapper.hisob ga yozing.\ndef sanagich(func):\n    soni = 0\n\n    def wrapper(*args):\n        nonlocal soni\n        pass\n\n    wrapper.hisob = 0\n    return wrapper\n\n\n@sanagich\ndef salom(ism):\n    return f\"Salom, {ism}!\"\n\n\n# xayr funksiyasini ham yozing va @sanagich bilan bezang\n\n# Buyruqlarni \"yakun\" ga qadar o'qing, so'ng hisoblarni chiqaring\n",
    "testCases": [
      {
        "stdin": "salom Ali\nxayr Vali\nsalom Malika\nyakun\n",
        "expectedStdout": "Salom, Ali!\nXayr, Vali!\nSalom, Malika!\nsalom: 2 marta\nxayr: 1 marta\n",
        "hidden": false,
        "label": "Namunadagi misol"
      },
      {
        "stdin": "xayr A\nxayr B\nxayr C\nyakun\n",
        "expectedStdout": "Xayr, A!\nXayr, B!\nXayr, C!\nsalom: 0 marta\nxayr: 3 marta\n",
        "hidden": false,
        "label": "Faqat bitta funksiya ishlatiladi"
      },
      {
        "stdin": "yakun\n",
        "expectedStdout": "salom: 0 marta\nxayr: 0 marta\n",
        "hidden": true,
        "label": "Hech qanday chaqiruv yo'q"
      },
      {
        "stdin": "salom X\nsalom X\nsalom X\nsalom X\nyakun\n",
        "expectedStdout": "Salom, X!\nSalom, X!\nSalom, X!\nSalom, X!\nsalom: 4 marta\nxayr: 0 marta\n",
        "hidden": true,
        "label": "Bir xil ism takrorlanadi"
      }
    ]
  }
];
