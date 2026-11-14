// "Kod nima chiqaradi?" — backend lessons 1..12 (Python asoslari), 5 each.
//
// Every snippet targets one misconception from that lesson's XULOSA slide:
// a commented-out print, `/` always giving float, methods not changing the
// string, `sort()` returning None, two names for one list...
// Answer keys are checked on Python 3.10 by scripts/verifyOutputQuestions.ts.
import { outputSet, py } from './outputHelpers';
import type { LessonOutputRecord } from './types';

export const backendOutputO1: LessonOutputRecord[] = [
  ...outputSet(1, [
    {
      code: py`
print("Salom")
# print("Dunyo")
print("Python")
`,
      out: py`
Salom
Python
`,
      why: "# bilan boshlangan satrni Python o'qimaydi, shuning uchun \"Dunyo\" chiqmaydi.",
    },
    {
      code: py`
print("2 + 3")
print(2 + 3)
`,
      out: py`
2 + 3
5
`,
      why: "Qo'shtirnoq ichidagisi matn — qanday yozilgan bo'lsa shunday chiqadi. Qo'shtirnoqsiz esa hisoblanadi.",
    },
    {
      code: py`
print("A", "B", "C")
`,
      out: py`
A B C
`,
      why: "print() vergul bilan berilgan qiymatlar orasiga bitta bo'sh joy qo'yadi.",
    },
    {
      code: py`
print("Ism")
print()
print("Familiya")
`,
      out: py`
Ism

Familiya
`,
      why: "Bo'sh print() bitta bo'sh qator chiqaradi.",
    },
    {
      code: py`
print(7 * 6)
print("7 * 6")
`,
      out: py`
42
7 * 6
`,
      why: "Birinchisi son sifatida hisoblanadi, ikkinchisi qo'shtirnoqda bo'lgani uchun matn bo'lib chiqadi.",
    },
  ]),

  ...outputSet(2, [
    {
      code: py`
ism = "Ali"
ism = "Vali"
print(ism)
`,
      out: py`
Vali
`,
      why: "O'zgaruvchiga yangi qiymat berilsa, eskisi o'chadi — qutida faqat oxirgisi qoladi.",
    },
    {
      code: py`
a = 5
b = a
a = 10
print(a, b)
`,
      out: py`
10 5
`,
      why: "b = a paytida b ga 5 yozildi. Keyin a o'zgargani b ga ta'sir qilmaydi.",
    },
    {
      code: py`
x = 3
x = x + 2
print(x)
`,
      out: py`
5
`,
      why: "Avval o'ng tomon hisoblanadi (3 + 2), natija yana x ga yoziladi.",
    },
    {
      code: py`
yosh = 17
print("yosh")
print(yosh)
`,
      out: py`
yosh
17
`,
      why: "Qo'shtirnoq ichidagi \"yosh\" — oddiy matn. Qo'shtirnoqsiz yosh — o'zgaruvchi, uning qiymati chiqadi.",
    },
    {
      code: py`
narx = 1000
soni = 3
jami = narx * soni
print("Jami:", jami)
`,
      out: py`
Jami: 3000
`,
      why: "jami = 1000 * 3 = 3000. print matn va sonni bo'sh joy bilan ajratib chiqaradi.",
    },
  ]),

  ...outputSet(3, [
    {
      code: py`
print(type(5))
print(type("5"))
`,
      out: py`
<class 'int'>
<class 'str'>
`,
      why: "5 — butun son (int), \"5\" esa qo'shtirnoqda bo'lgani uchun matn (str).",
    },
    {
      code: py`
print(int("7") + 3)
print("7" + "3")
`,
      out: py`
10
73
`,
      why: "int(\"7\") sonni beradi va 7 + 3 = 10. Ikki matnni + esa yopishtiradi: \"73\".",
    },
    {
      code: py`
print(float(4))
print(int(3.9))
`,
      out: py`
4.0
3
`,
      why: "float() kasr qismini qo'shadi. int() yaxlitlamaydi — kasr qismini shunchaki tashlab yuboradi.",
    },
    {
      code: py`
print(bool(0), bool(5), bool(""))
`,
      out: py`
False True False
`,
      why: "0 va bo'sh matn False hisoblanadi, qolgan son va matnlar True.",
    },
    {
      code: py`
print(type(6 / 2))
print(10 == 10.0)
`,
      out: py`
<class 'float'>
True
`,
      why: "/ har doim float beradi (3.0). 10 va 10.0 qiymat jihatidan teng.",
    },
  ]),

  ...outputSet(4, [
    {
      code: py`
print(7 / 2)
print(7 // 2)
print(7 % 2)
`,
      out: py`
3.5
3
1
`,
      why: "/ oddiy bo'lish, // butun qismi, % qoldiq.",
    },
    {
      code: py`
print(2 + 3 * 4)
print((2 + 3) * 4)
`,
      out: py`
14
20
`,
      why: "Ko'paytirish qo'shishdan oldin bajariladi. Qavs esa tartibni o'zgartiradi.",
    },
    {
      code: py`
print(2 ** 3)
print(10 / 5)
`,
      out: py`
8
2.0
`,
      why: "** — daraja (2·2·2 = 8). / qoldiqsiz bo'linsa ham float beradi.",
    },
    {
      code: py`
son = 1234
print(son % 10)
print(son // 10)
`,
      out: py`
4
123
`,
      why: "% 10 oxirgi raqamni ajratadi, // 10 esa oxirgi raqamni olib tashlaydi.",
    },
    {
      code: py`
print(15 % 4, 15 // 4)
`,
      out: py`
3 3
`,
      why: "15 = 4 · 3 + 3: butun qismi 3, qoldig'i ham 3.",
    },
  ]),

  ...outputSet(5, [
    {
      code: py`
s = "Python"
print(s[0])
print(s[-1])
`,
      out: py`
P
n
`,
      why: "Indeks 0 dan boshlanadi. -1 esa oxirgi belgi.",
    },
    {
      code: py`
s = "Toshkent"
print(s[0:4])
`,
      out: py`
Tosh
`,
      why: "s[0:4] — 0, 1, 2, 3 indekslar. 4-indeks kirmaydi.",
    },
    {
      code: py`
s = "dastur"
print(s[3:])
`,
      out: py`
tur
`,
      why: "s[3:] — 3-indeksdan oxirigacha: d(0) a(1) s(2) t(3) u(4) r(5).",
    },
    {
      code: py`
print(len("Salom dunyo"))
`,
      out: py`
11
`,
      why: "len() bo'sh joyni ham sanaydi: 5 + 1 + 5 = 11.",
    },
    {
      code: py`
s = "abcdef"
print(s[1:4])
print(s[:2] + s[-2:])
`,
      out: py`
bcd
abef
`,
      why: "s[1:4] — b, c, d. s[:2] = \"ab\", s[-2:] = \"ef\", ular yopishtiriladi.",
    },
  ]),

  ...outputSet(6, [
    {
      code: py`
s = "  salom  "
print(s.strip() + "!")
`,
      out: py`
salom!
`,
      why: "strip() ikki chetdagi bo'sh joylarni olib tashlaydi.",
    },
    {
      code: py`
s = "python"
s.upper()
print(s)
`,
      out: py`
python
`,
      why: "Metod satrni o'zgartirmaydi — yangisini qaytaradi. Natija saqlanmagani uchun s o'zgarmadi.",
    },
    {
      code: py`
print("olma,nok,uzum".split(","))
`,
      out: py`
['olma', 'nok', 'uzum']
`,
      why: "split(\",\") satrni vergul bo'yicha bo'lib, ro'yxat qaytaradi.",
    },
    {
      code: py`
ism = "Ali"
yosh = 20
print(f"{ism} {yosh + 1} yoshda")
`,
      out: py`
Ali 21 yoshda
`,
      why: "f-string ichidagi {} da ifoda hisoblanadi: yosh + 1 = 21.",
    },
    {
      code: py`
print("banan".count("a"))
print("banan".replace("a", "o"))
`,
      out: py`
2
bonon
`,
      why: "count() necha marta uchraganini sanaydi, replace() hammasini almashtiradi.",
    },
  ]),

  ...outputSet(7, [
    {
      code: py`
x = 15
if x > 10:
    print("katta")
elif x > 5:
    print("o'rta")
else:
    print("kichik")
`,
      out: py`
katta
`,
      why: "Birinchi True shart topilgach qolganlari tekshirilmaydi — 15 > 5 ham rost bo'lsa-da.",
    },
    {
      code: py`
ball = 75
if ball >= 60:
    print("o'tdi")
if ball >= 70:
    print("yaxshi")
`,
      out: py`
o'tdi
yaxshi
`,
      why: "Bu ikkita alohida if, elif emas — ikkalasi ham tekshiriladi va ikkalasi ham rost.",
    },
    {
      code: py`
son = 8
if son % 2 == 0:
    print("juft")
else:
    print("toq")
`,
      out: py`
juft
`,
      why: "8 % 2 = 0, demak shart rost.",
    },
    {
      code: py`
x = 0
if x:
    print("bor")
else:
    print("yo'q")
`,
      out: py`
yo'q
`,
      why: "if ichida 0 False hisoblanadi, shuning uchun else bajariladi.",
    },
    {
      code: py`
harorat = 25
if harorat > 30:
    print("issiq")
elif harorat > 20:
    print("iliq")
elif harorat > 10:
    print("salqin")
print("tugadi")
`,
      out: py`
iliq
tugadi
`,
      why: "25 > 20 birinchi rost shart. Oxirgi print if ga tegishli emas — u har doim ishlaydi.",
    },
  ]),

  ...outputSet(8, [
    {
      code: py`
print(True and False)
print(True or False)
print(not True)
`,
      out: py`
False
True
False
`,
      why: "and — ikkalasi kerak, or — bittasi yetarli, not — teskarisi.",
    },
    {
      code: py`
yosh = 25
print(18 <= yosh <= 60)
`,
      out: py`
True
`,
      why: "Zanjirli taqqoslash: 18 <= 25 va 25 <= 60 — ikkalasi rost.",
    },
    {
      code: py`
a = 5
b = 10
print(a > 3 and b < 5)
`,
      out: py`
False
`,
      why: "a > 3 rost, lekin b < 5 yolg'on. and uchun ikkalasi rost bo'lishi kerak.",
    },
    {
      code: py`
x = 7
if x > 0 and x % 2 == 1:
    print("musbat toq")
else:
    print("boshqa")
`,
      out: py`
musbat toq
`,
      why: "7 > 0 rost va 7 % 2 == 1 rost — and ning ikkala tomoni bajarildi.",
    },
    {
      code: py`
print(not (3 > 5) or False)
print(1 == 1 and 2 > 3)
`,
      out: py`
True
False
`,
      why: "not (False) = True, True or False = True. Ikkinchisida 2 > 3 yolg'on, shuning uchun and False beradi.",
    },
  ]),

  ...outputSet(9, [
    {
      code: py`
i = 1
while i <= 3:
    print(i)
    i += 1
`,
      out: py`
1
2
3
`,
      why: "i 4 bo'lganda i <= 3 yolg'on bo'ladi va sikl to'xtaydi.",
    },
    {
      code: py`
i = 0
jami = 0
while i < 5:
    jami += i
    i += 1
print(jami)
`,
      out: py`
10
`,
      why: "0 + 1 + 2 + 3 + 4 = 10. 5 kirmaydi, chunki i < 5.",
    },
    {
      code: py`
n = 10
while n > 0:
    n -= 3
print(n)
`,
      out: py`
-2
`,
      why: "10 → 7 → 4 → 1 → -2. Shart faqat aylanish boshida tekshiriladi, shuning uchun n manfiyga o'tib ketadi.",
    },
    {
      code: py`
i = 0
while True:
    i += 1
    if i == 4:
        break
print(i)
`,
      out: py`
4
`,
      why: "while True cheksiz, lekin break i 4 bo'lganda siklni to'xtatadi.",
    },
    {
      code: py`
i = 0
while i < 5:
    i += 1
    if i == 3:
        continue
    print(i)
`,
      out: py`
1
2
4
5
`,
      why: "continue faqat shu aylanishni tashlab o'tadi — 3 chiqmaydi, sikl esa davom etadi.",
    },
  ]),

  ...outputSet(10, [
    {
      code: py`
for i in range(3):
    print(i)
`,
      out: py`
0
1
2
`,
      why: "range(3) — 0 dan 3 gacha, 3 kirmaydi.",
    },
    {
      code: py`
for i in range(2, 10, 3):
    print(i)
`,
      out: py`
2
5
8
`,
      why: "2 dan boshlab 3 qadam bilan: 2, 5, 8. Keyingisi 11 — u 10 dan katta.",
    },
    {
      code: py`
jami = 0
for i in range(1, 5):
    jami += i
print(jami)
`,
      out: py`
10
`,
      why: "range(1, 5) — 1, 2, 3, 4. Yig'indisi 10.",
    },
    {
      code: py`
for harf in "abc":
    print(harf * 2)
`,
      out: py`
aa
bb
cc
`,
      why: "for satrning har bir harfidan o'tadi. Matnni 2 ga ko'paytirish uni ikki marta takrorlaydi.",
    },
    {
      code: py`
for i in range(5, 0, -2):
    print(i)
`,
      out: py`
5
3
1
`,
      why: "Manfiy qadam teskari sanaydi. 0 chegarasi kirmaydi.",
    },
  ]),

  ...outputSet(11, [
    {
      code: py`
a = [10, 20, 30]
a.append(40)
print(a)
print(len(a))
`,
      out: py`
[10, 20, 30, 40]
4
`,
      why: "append() ro'yxatning oxiriga qo'shadi va ro'yxatning o'zini o'zgartiradi.",
    },
    {
      code: py`
a = [3, 1, 2]
b = a.sort()
print(b)
print(a)
`,
      out: py`
None
[1, 2, 3]
`,
      why: "sort() ro'yxatning o'zini tartiblaydi va None qaytaradi — b ga hech narsa tushmaydi.",
    },
    {
      code: py`
a = [1, 2, 3]
b = a
b.append(4)
print(a)
`,
      out: py`
[1, 2, 3, 4]
`,
      why: "b = a nusxa olmaydi — ikkala nom bitta ro'yxatni ko'rsatadi.",
    },
    {
      code: py`
a = ["olma", "nok", "uzum"]
x = a.pop()
print(x)
print(a)
`,
      out: py`
uzum
['olma', 'nok']
`,
      why: "pop() oxirgi elementni olib tashlaydi va uni qaytaradi.",
    },
    {
      code: py`
sonlar = [4, 7, 2, 9]
jami = 0
for s in sonlar:
    if s > 3:
        jami += s
print(jami)
`,
      out: py`
20
`,
      why: "3 dan kattalari: 4 + 7 + 9 = 20. 2 o'tkazib yuboriladi.",
    },
  ]),

  ...outputSet(12, [
    {
      code: py`
t = (1, 2, 3)
print(t[1])
print(len(t))
`,
      out: py`
2
3
`,
      why: "Tuple ham 0 dan indekslanadi. len() elementlar sonini beradi.",
    },
    {
      code: py`
t = (5,)
print(type(t))
print(type((5)))
`,
      out: py`
<class 'tuple'>
<class 'int'>
`,
      why: "Tuple'ni vergul yasaydi, qavs emas. (5) — oddiy son 5.",
    },
    {
      code: py`
a, b = (3, 4)
print(a + b)
`,
      out: py`
7
`,
      why: "Tuple ochiladi: a = 3, b = 4.",
    },
    {
      code: py`
t = (1, 2) + (3,)
print(t)
`,
      out: py`
(1, 2, 3)
`,
      why: "Tuple o'zgarmaydi, lekin + ikkalasidan yangi tuple yasaydi.",
    },
    {
      code: py`
t = (4, 1, 4, 2)
print(t.count(4))
print(t.index(2))
`,
      out: py`
2
3
`,
      why: "4 ikki marta uchraydi. 2 ning indeksi 3 (0 dan sanaganda).",
    },
  ]),
];
