/**
 * Hand-authored practice problems for backend lessons 1-4 (Oy-1, 1-2 hafta).
 *
 * Each record implements one of the lesson's own MAKE tiers (OSON / O'RTA / QIYIN).
 * Grading is exact-output, so every `expectedStdout` below was produced by actually
 * running a reference solution on the Piston sandbox (python 3.10.0) against the
 * matching `stdin` — none of them are written from memory.
 */
import type { LessonProblemRecord } from './types';

export const backendProblemsM1a: LessonProblemRecord[] = [
    {
      "lessonKey": "backend-dars-01",
      "key": "backend-dars-01-easy",
      "title": "Besh qatorli tanishuv",
      "difficulty": "EASY",
      "points": 10,
      "tags": [
        "python",
        "print",
        "matn"
      ],
      "description": "5 ta `print()` yozing va o'zingiz haqingizda ma'lumot chiqaring. Bu topshiriqda kirish (input) yo'q — matnlar kodning ichida yozilgan bo'lishi kerak.\n\nEkranga ANIQ shu 5 qatorni shu tartibda chiqaring:\n\n```\nIsm: Ali\nFamiliya: Karimov\nYosh: 15\nShahar: Toshkent\nSevimli rang: ko'k\n```\n\nNuqtali ikki nuqta (`:`) dan keyin bitta bo'sh joy qo'yiladi. Har bir qator alohida `print()` bilan chiqariladi.",
      "starterCodePy": "# 5 ta print() yozing: ism, familiya, yosh, shahar, sevimli rang.\n# Matnlar topshiriqdagi bilan bir xil bo'lsin.\n",
      "testCases": [
        {
          "stdin": "",
          "expectedStdout": "Ism: Ali\nFamiliya: Karimov\nYosh: 15\nShahar: Toshkent\nSevimli rang: ko'k\n",
          "hidden": false,
          "label": "Beshta qator to'g'ri chiqdi"
        },
        {
          "stdin": "",
          "expectedStdout": "Ism: Ali\nFamiliya: Karimov\nYosh: 15\nShahar: Toshkent\nSevimli rang: ko'k\n",
          "hidden": false,
          "label": "Matnlar aynan mos"
        },
        {
          "stdin": "Ali\nKarimov\n",
          "expectedStdout": "Ism: Ali\nFamiliya: Karimov\nYosh: 15\nShahar: Toshkent\nSevimli rang: ko'k\n",
          "hidden": true,
          "label": "Dastur kiritishga bog'liq emas"
        }
      ]
    },
    {
      "lessonKey": "backend-dars-01",
      "key": "backend-dars-01-medium",
      "title": "Izohli birinchi dastur",
      "difficulty": "MEDIUM",
      "points": 20,
      "tags": [
        "python",
        "print",
        "izoh"
      ],
      "description": "Dasturingizga 2 ta izoh qo'shing: bittasi eng tepada (dastur nima qilishini tushuntiradi), bittasi esa `print()` satrining yonida. Izohlar `#` bilan boshlanadi va Python ularni bajarmaydi — shuning uchun ular ekranda ko'rinmaydi.\n\nEkranga ANIQ shu 3 qatorni chiqaring:\n\n```\nSalom, dunyo!\nMen Python o'rganyapman.\nBirinchi dasturim tayyor.\n```\n\nDiqqat: izohlarning matni erkin, lekin ular ekranga chiqmasligi kerak. Agar `#` ni unutsangiz, Python xato beradi.",
      "starterCodePy": "# 1-izoh: bu yerga dastur nima qilishini yozing\n# Uchta print() yozing va ulardan biriga satr yonida izoh qo'shing\n",
      "testCases": [
        {
          "stdin": "",
          "expectedStdout": "Salom, dunyo!\nMen Python o'rganyapman.\nBirinchi dasturim tayyor.\n",
          "hidden": false,
          "label": "Uch qator to'g'ri chiqdi"
        },
        {
          "stdin": "",
          "expectedStdout": "Salom, dunyo!\nMen Python o'rganyapman.\nBirinchi dasturim tayyor.\n",
          "hidden": false,
          "label": "Izohlar ekranga chiqmadi"
        },
        {
          "stdin": "salom\n",
          "expectedStdout": "Salom, dunyo!\nMen Python o'rganyapman.\nBirinchi dasturim tayyor.\n",
          "hidden": true,
          "label": "Kiritishdan qat'i nazar natija bir xil"
        }
      ]
    },
    {
      "lessonKey": "backend-dars-01",
      "key": "backend-dars-01-hard",
      "title": "Yulduzchali ramka",
      "difficulty": "HARD",
      "points": 35,
      "tags": [
        "python",
        "print",
        "ramka"
      ],
      "description": "`print()` yordamida 5 qatorli yulduzchali ramka chizing va uning o'rtasiga `ALI` ismini joylang.\n\nEkranga ANIQ shu 5 qatorni chiqaring:\n\n```\n*********\n*       *\n*  ALI  *\n*       *\n*********\n```\n\nQoidalar: har bir qator aynan 9 ta belgidan iborat. 1- va 5-qator — 9 ta `*`. 2- va 4-qator — `*`, 7 ta bo'sh joy, `*`. 3-qator — `*`, 2 ta bo'sh joy, `ALI`, 2 ta bo'sh joy, `*`. Ortiqcha bo'sh qator qo'shmang.",
      "starterCodePy": "# 5 ta print() bilan yulduzchali ramka chizing.\n# Har bir qator 9 ta belgidan iborat bo'lsin, o'rtasida ALI so'zi tursin.\n",
      "testCases": [
        {
          "stdin": "",
          "expectedStdout": "*********\n*       *\n*  ALI  *\n*       *\n*********\n",
          "hidden": false,
          "label": "Ramka to'g'ri chizildi"
        },
        {
          "stdin": "",
          "expectedStdout": "*********\n*       *\n*  ALI  *\n*       *\n*********\n",
          "hidden": false,
          "label": "Har bir qator 9 belgidan"
        },
        {
          "stdin": "ALI\n",
          "expectedStdout": "*********\n*       *\n*  ALI  *\n*       *\n*********\n",
          "hidden": true,
          "label": "Kiritish natijaga ta'sir qilmaydi"
        }
      ]
    },
    {
      "lessonKey": "backend-dars-02",
      "key": "backend-dars-02-easy",
      "title": "Ism va familiya bilan salomlashuv",
      "difficulty": "EASY",
      "points": 10,
      "tags": [
        "python",
        "input",
        "f-string"
      ],
      "description": "Foydalanuvchidan 2 ta qiymatni ALOHIDA `input()` bilan oling:\n\n1-qator — ism, 2-qator — familiya.\n\nSo'ng ularni bitta qatorda quyidagi ko'rinishda chiqaring:\n\n`Salom, <ism> <familiya>!`\n\nMisol. Kiritish:\n```\nAli\nKarimov\n```\nNatija:\n```\nSalom, Ali Karimov!\n```\n\nDiqqat: `input()` ichiga hech qanday savol matni yozmang — aks holda u ham ekranga chiqib, javob xato bo'ladi.",
      "starterCodePy": "# 1-qatordan ismni, 2-qatordan familiyani o'qing\nism = input()\n# familiya = input()\n# f-string bilan bitta qatorda chiqaring\n",
      "testCases": [
        {
          "stdin": "Ali\nKarimov\n",
          "expectedStdout": "Salom, Ali Karimov!\n",
          "hidden": false,
          "label": "Namunadagi misol"
        },
        {
          "stdin": "Malika\nTo'rayeva\n",
          "expectedStdout": "Salom, Malika To'rayeva!\n",
          "hidden": false,
          "label": "Apostrofli familiya"
        },
        {
          "stdin": "Bexruz\nSaidov\n",
          "expectedStdout": "Salom, Bexruz Saidov!\n",
          "hidden": false,
          "label": "Boshqa ism-familiya"
        },
        {
          "stdin": "A\nB\n",
          "expectedStdout": "Salom, A B!\n",
          "hidden": true,
          "label": "Bir harfli qiymatlar"
        }
      ]
    },
    {
      "lessonKey": "backend-dars-02",
      "key": "backend-dars-02-medium",
      "title": "Shahar, maktab va sinf",
      "difficulty": "MEDIUM",
      "points": 20,
      "tags": [
        "python",
        "input",
        "f-string",
        "ozgaruvchi"
      ],
      "description": "3 ta o'zgaruvchi yarating va ularning qiymatini `input()` orqali oling:\n\n1-qator — shahar, 2-qator — maktab raqami, 3-qator — sinf.\n\nSo'ng f-string yordamida ularni bitta gapga birlashtiring:\n\n`Men <shahar> shahridanman, <maktab>-maktabning <sinf> sinfida o'qiyman.`\n\nMisol. Kiritish:\n```\nToshkent\n12\n9-A\n```\nNatija:\n```\nMen Toshkent shahridanman, 12-maktabning 9-A sinfida o'qiyman.\n```\n\nVergul, defis va nuqtani aynan namunadagidek qo'ying.",
      "starterCodePy": "# Uchta o'zgaruvchi: shahar, maktab, sinf\nshahar = input()\n# maktab = input()\n# sinf = input()\n# f-string bilan bitta gap qilib chiqaring\n",
      "testCases": [
        {
          "stdin": "Toshkent\n12\n9-A\n",
          "expectedStdout": "Men Toshkent shahridanman, 12-maktabning 9-A sinfida o'qiyman.\n",
          "hidden": false,
          "label": "Namunadagi misol"
        },
        {
          "stdin": "Samarqand\n5\n7-B\n",
          "expectedStdout": "Men Samarqand shahridanman, 5-maktabning 7-B sinfida o'qiyman.\n",
          "hidden": false,
          "label": "Boshqa shahar va sinf"
        },
        {
          "stdin": "Xiva\n1\n11-V\n",
          "expectedStdout": "Men Xiva shahridanman, 1-maktabning 11-V sinfida o'qiyman.\n",
          "hidden": true,
          "label": "Bir xonali maktab raqami"
        }
      ]
    },
    {
      "lessonKey": "backend-dars-02",
      "key": "backend-dars-02-hard",
      "title": "Ikki so'zni teskari tartibda",
      "difficulty": "HARD",
      "points": 35,
      "tags": [
        "python",
        "input",
        "ozgaruvchi"
      ],
      "description": "Foydalanuvchidan 2 ta so'zni alohida qatorlarda so'rang (1-qator — birinchi so'z, 2-qator — ikkinchi so'z). So'ngra ularni TESKARI tartibda, bitta bo'sh joy bilan ajratib, bitta qatorda chiqaring: avval ikkinchi so'z, keyin birinchi so'z.\n\nMisol. Kiritish:\n```\nolma\nnok\n```\nNatija:\n```\nnok olma\n```\n\nSo'zlarning o'zi o'zgarmaydi — faqat joylari almashadi. Oxirida nuqta yoki qo'shimcha belgi qo'ymang.",
      "starterCodePy": "# Ikkita so'zni o'qing va ularni teskari tartibda chiqaring\nbirinchi = input()\n# ikkinchi = input()\n# print(...) — avval ikkinchi, keyin birinchi\n",
      "testCases": [
        {
          "stdin": "olma\nnok\n",
          "expectedStdout": "nok olma\n",
          "hidden": false,
          "label": "Namunadagi misol"
        },
        {
          "stdin": "salom\ndunyo\n",
          "expectedStdout": "dunyo salom\n",
          "hidden": false,
          "label": "Salom-dunyo juftligi"
        },
        {
          "stdin": "bir\nikki\n",
          "expectedStdout": "ikki bir\n",
          "hidden": false,
          "label": "Sonli so'zlar"
        },
        {
          "stdin": "a\nb\n",
          "expectedStdout": "b a\n",
          "hidden": true,
          "label": "Bir harfli so'zlar"
        }
      ]
    },
    {
      "lessonKey": "backend-dars-03",
      "key": "backend-dars-03-easy",
      "title": "To'rt tur va type()",
      "difficulty": "EASY",
      "points": 10,
      "tags": [
        "python",
        "type",
        "malumot-turlari"
      ],
      "description": "4 xil turdagi 4 ta o'zgaruvchi yarating va har birining turini `type()` bilan chiqaring. Kirish (input) yo'q — qiymatlarni kodning o'zida yozing.\n\nTartib qat'iy: 1) butun son (int), 2) kasr son (float), 3) matn (str), 4) mantiqiy qiymat (bool).\n\nMasalan `yosh = 15`, `bo_y = 1.72`, `ism = \"Ali\"`, `talabami = True` deb yozsangiz, natija:\n\n```\n<class 'int'>\n<class 'float'>\n<class 'str'>\n<class 'bool'>\n```\n\nHar bir qator `print(type(...))` bilan chiqariladi. Qiymatlarni o'zgartirishingiz mumkin, ammo turlari va tartibi yuqoridagidek bo'lishi shart.",
      "starterCodePy": "# To'rt xil turdagi o'zgaruvchi yarating\nyosh = 15\n# bo_y = ...  (float)\n# ism = ...   (str)\n# talabami = ... (bool)\n# So'ng har birining turini print(type(...)) bilan chiqaring\n",
      "testCases": [
        {
          "stdin": "",
          "expectedStdout": "<class 'int'>\n<class 'float'>\n<class 'str'>\n<class 'bool'>\n",
          "hidden": false,
          "label": "To'rt tur to'g'ri tartibda"
        },
        {
          "stdin": "",
          "expectedStdout": "<class 'int'>\n<class 'float'>\n<class 'str'>\n<class 'bool'>\n",
          "hidden": false,
          "label": "Natija aynan mos"
        },
        {
          "stdin": "15\n",
          "expectedStdout": "<class 'int'>\n<class 'float'>\n<class 'str'>\n<class 'bool'>\n",
          "hidden": true,
          "label": "Kiritishga bog'liq emas"
        }
      ]
    },
    {
      "lessonKey": "backend-dars-03",
      "key": "backend-dars-03-medium",
      "title": "Yig'indi va ko'paytma",
      "difficulty": "MEDIUM",
      "points": 20,
      "tags": [
        "python",
        "input",
        "int",
        "arifmetika"
      ],
      "description": "Foydalanuvchidan 2 ta BUTUN sonni alohida qatorlarda so'rang (1-qator — birinchi son, 2-qator — ikkinchi son). `input()` matn qaytargani uchun ularni `int()` bilan songa aylantiring.\n\nNatijani ikki qatorda chiqaring:\n\n```\nYig'indi: <a+b>\nKo'paytma: <a*b>\n```\n\nMisol. Kiritish:\n```\n5\n7\n```\nNatija:\n```\nYig'indi: 12\nKo'paytma: 35\n```\n\nAgar `int()` ni unutsangiz, `5 + 7` o'rniga `57` chiqadi.",
      "starterCodePy": "# Ikkita butun sonni o'qing (int() ni unutmang)\na = int(input())\n# b = int(input())\n# Yig'indi va ko'paytmani ikki qatorda chiqaring\n",
      "testCases": [
        {
          "stdin": "5\n7\n",
          "expectedStdout": "Yig'indi: 12\nKo'paytma: 35\n",
          "hidden": false,
          "label": "Namunadagi misol"
        },
        {
          "stdin": "12\n3\n",
          "expectedStdout": "Yig'indi: 15\nKo'paytma: 36\n",
          "hidden": false,
          "label": "Kattaroq sonlar"
        },
        {
          "stdin": "0\n9\n",
          "expectedStdout": "Yig'indi: 9\nKo'paytma: 0\n",
          "hidden": false,
          "label": "Nol ishtirok etganda"
        },
        {
          "stdin": "-4\n6\n",
          "expectedStdout": "Yig'indi: 2\nKo'paytma: -24\n",
          "hidden": true,
          "label": "Manfiy son"
        }
      ]
    },
    {
      "lessonKey": "backend-dars-03",
      "key": "backend-dars-03-hard",
      "title": "Tana massa indeksi (TMI)",
      "difficulty": "HARD",
      "points": 35,
      "tags": [
        "python",
        "input",
        "float",
        "formula"
      ],
      "description": "Foydalanuvchidan bo'y va vaznni alohida qatorlarda so'rang: 1-qator — bo'y metrda (masalan `1.72`), 2-qator — vazn kilogrammda (masalan `70`). Ikkalasini ham `float()` bilan songa aylantiring.\n\nTMI formulasi: `vazn / (bo'y * bo'y)`.\n\nNatijani ANIQ 2 xonali kasr ko'rinishida chiqaring:\n\n`TMI: <natija>`\n\nMisol. Kiritish:\n```\n1.72\n70\n```\nNatija:\n```\nTMI: 23.66\n```\n\nIkki xonagacha yaxlitlash uchun f-string formatidan foydalaning: `print(f\"TMI: {tmi:.2f}\")`. Natija butun chiqsa ham ikkita kasr xonasi yozilishi kerak (masalan `20.00`).",
      "starterCodePy": "# Bo'y va vaznni o'qing (float bilan)\nbo_y = float(input())\n# vazn = float(input())\n# tmi = vazn / (bo_y * bo_y)\n# print(f\"TMI: {tmi:.2f}\") ko'rinishida chiqaring\n",
      "testCases": [
        {
          "stdin": "1.72\n70\n",
          "expectedStdout": "TMI: 23.66\n",
          "hidden": false,
          "label": "Namunadagi misol"
        },
        {
          "stdin": "1.60\n50.5\n",
          "expectedStdout": "TMI: 19.73\n",
          "hidden": false,
          "label": "Kasrli vazn"
        },
        {
          "stdin": "1.85\n95\n",
          "expectedStdout": "TMI: 27.76\n",
          "hidden": false,
          "label": "Baland bo'y"
        },
        {
          "stdin": "1.5\n45\n",
          "expectedStdout": "TMI: 20.00\n",
          "hidden": true,
          "label": "Natija butun songa teng"
        }
      ]
    },
    {
      "lessonKey": "backend-dars-04",
      "key": "backend-dars-04-easy",
      "title": "To'rt amalli kalkulyator",
      "difficulty": "EASY",
      "points": 10,
      "tags": [
        "python",
        "input",
        "arifmetika",
        "operatorlar"
      ],
      "description": "Foydalanuvchidan 2 ta BUTUN sonni alohida qatorlarda so'rang (1-qator — `a`, 2-qator — `b`) va 4 ta amal natijasini chiqaring.\n\nChiqarish formati (aynan shu tartibda, 4 qator):\n\n```\nYig'indi: <a+b>\nAyirma: <a-b>\nKo'paytma: <a*b>\nBo'linma: <a/b>\n```\n\nBo'linma HAR DOIM 2 kasr xonasi bilan yoziladi: `print(f\"Bo'linma: {a / b:.2f}\")`.\n\nMisol. Kiritish:\n```\n7\n5\n```\nNatija:\n```\nYig'indi: 12\nAyirma: 2\nKo'paytma: 35\nBo'linma: 1.40\n```",
      "starterCodePy": "# Ikkita butun sonni o'qing\na = int(input())\n# b = int(input())\n# Yig'indi, ayirma, ko'paytma va bo'linmani chiqaring\n# Bo'linmani {a / b:.2f} formatida yozing\n",
      "testCases": [
        {
          "stdin": "7\n5\n",
          "expectedStdout": "Yig'indi: 12\nAyirma: 2\nKo'paytma: 35\nBo'linma: 1.40\n",
          "hidden": false,
          "label": "Namunadagi misol"
        },
        {
          "stdin": "12\n4\n",
          "expectedStdout": "Yig'indi: 16\nAyirma: 8\nKo'paytma: 48\nBo'linma: 3.00\n",
          "hidden": false,
          "label": "Butun bo'linadigan sonlar"
        },
        {
          "stdin": "3\n8\n",
          "expectedStdout": "Yig'indi: 11\nAyirma: -5\nKo'paytma: 24\nBo'linma: 0.38\n",
          "hidden": false,
          "label": "Kichik natija"
        },
        {
          "stdin": "-10\n4\n",
          "expectedStdout": "Yig'indi: -6\nAyirma: -14\nKo'paytma: -40\nBo'linma: -2.50\n",
          "hidden": true,
          "label": "Manfiy son"
        }
      ]
    },
    {
      "lessonKey": "backend-dars-04",
      "key": "backend-dars-04-medium",
      "title": "Sekundni daqiqaga aylantirish",
      "difficulty": "MEDIUM",
      "points": 20,
      "tags": [
        "python",
        "input",
        "bolish",
        "qoldiq"
      ],
      "description": "Foydalanuvchidan bitta butun son — sekundlar sonini so'rang (bitta qator). Uni `// ` (butun bo'lish) va `%` (qoldiq) yordamida daqiqa va sekundga ajrating.\n\nNatijani bitta qatorda chiqaring:\n\n`<daqiqa> daqiqa <sekund> sekund`\n\nMisol. Kiritish:\n```\n130\n```\nNatija:\n```\n2 daqiqa 10 sekund\n```\n\nDaqiqa yoki sekund nolga teng bo'lsa ham `0` yozib chiqiladi (masalan `0 daqiqa 59 sekund`).",
      "starterCodePy": "# Sekundlar sonini o'qing\nsekund = int(input())\n# // bilan daqiqani, % bilan qolgan sekundni toping\n# print(f\"{...} daqiqa {...} sekund\")\n",
      "testCases": [
        {
          "stdin": "130\n",
          "expectedStdout": "2 daqiqa 10 sekund\n",
          "hidden": false,
          "label": "Namunadagi misol"
        },
        {
          "stdin": "59\n",
          "expectedStdout": "0 daqiqa 59 sekund\n",
          "hidden": false,
          "label": "Bir daqiqadan kam"
        },
        {
          "stdin": "3600\n",
          "expectedStdout": "60 daqiqa 0 sekund\n",
          "hidden": false,
          "label": "Aniq bir soat"
        },
        {
          "stdin": "600\n",
          "expectedStdout": "10 daqiqa 0 sekund\n",
          "hidden": true,
          "label": "Qoldiqsiz holat"
        }
      ]
    },
    {
      "lessonKey": "backend-dars-04",
      "key": "backend-dars-04-hard",
      "title": "Uch xonali sonning raqamlari yig'indisi",
      "difficulty": "HARD",
      "points": 35,
      "tags": [
        "python",
        "input",
        "bolish",
        "qoldiq"
      ],
      "description": "Foydalanuvchidan uch xonali butun son so'rang (bitta qator) va uning raqamlari yig'indisini toping. Faqat `//` va `%` amallaridan foydalaning — satrga aylantirmang.\n\nMaslahat: yuzlar xonasi — `son // 100`, o'nlar xonasi — `(son // 10) % 10`, birlar xonasi — `son % 10`.\n\nNatijani bitta qatorda chiqaring:\n\n`Raqamlar yig'indisi: <yig'indi>`\n\nMisol. Kiritish:\n```\n123\n```\nNatija:\n```\nRaqamlar yig'indisi: 6\n```",
      "starterCodePy": "# Uch xonali sonni o'qing\nson = int(input())\n# // va % yordamida yuzlar, o'nlar va birlar xonasini ajrating\n# Yig'indini chiqaring\n",
      "testCases": [
        {
          "stdin": "123\n",
          "expectedStdout": "Raqamlar yig'indisi: 6\n",
          "hidden": false,
          "label": "Namunadagi misol"
        },
        {
          "stdin": "999\n",
          "expectedStdout": "Raqamlar yig'indisi: 27\n",
          "hidden": false,
          "label": "Eng katta uch xonali son"
        },
        {
          "stdin": "100\n",
          "expectedStdout": "Raqamlar yig'indisi: 1\n",
          "hidden": false,
          "label": "Nollar bilan"
        },
        {
          "stdin": "504\n",
          "expectedStdout": "Raqamlar yig'indisi: 9\n",
          "hidden": true,
          "label": "O'rtasida nol"
        }
      ]
    }
  ];
