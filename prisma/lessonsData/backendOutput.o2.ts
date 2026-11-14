// "Kod nima chiqaradi?" — backend lessons 13..24 (Python chuqurroq), 5 each.
//
// Lesson 21 (pip va paketlar) is skipped: its material is terminal commands and
// network requests, which have no fixed output to predict.
// File questions write into the current directory; the verifier runs each one
// in its own empty temp directory.
import { outputSet, py } from './outputHelpers';
import type { LessonOutputRecord } from './types';

export const backendOutputO2: LessonOutputRecord[] = [
  ...outputSet(13, [
    {
      code: py`
d = {"ism": "Ali", "yosh": 20}
print(d["ism"])
print(len(d))
`,
      out: py`
Ali
2
`,
      why: "Dict'ga indeks bilan emas, kalit nomi bilan murojaat qilinadi. len() juftliklar sonini beradi.",
    },
    {
      code: py`
d = {"a": 1}
d["b"] = 2
d["a"] = 5
print(d)
`,
      out: py`
{'a': 5, 'b': 2}
`,
      why: "Kalit yo'q bo'lsa d[k] = v uni qo'shadi, bor bo'lsa qiymatini almashtiradi.",
    },
    {
      code: py`
d = {"olma": 3}
print("olma" in d)
print(3 in d)
`,
      out: py`
True
False
`,
      why: "in dict'da faqat KALITLARni tekshiradi. 3 — qiymat, kalit emas.",
    },
    {
      code: py`
d = {"x": 1, "x": 2}
print(d)
`,
      out: py`
{'x': 2}
`,
      why: "Kalit takrorlanmaydi: ikkinchi \"x\" birinchisining qiymatini almashtiradi.",
    },
    {
      code: py`
d = {"a": 1, "b": 2}
del d["a"]
print(d)
print(list(d.keys()))
`,
      out: py`
{'b': 2}
['b']
`,
      why: "del kalitni qiymati bilan birga o'chiradi.",
    },
  ]),

  ...outputSet(14, [
    {
      code: py`
d = {"a": 1, "b": 2}
for k, v in d.items():
    print(k, v)
`,
      out: py`
a 1
b 2
`,
      why: "items() kalit va qiymatni juft qilib beradi. Dict qo'shilgan tartibini saqlaydi.",
    },
    {
      code: py`
d = {"ism": "Ali"}
print(d.get("yosh"))
print(d.get("yosh", 0))
`,
      out: py`
None
0
`,
      why: "get() kalit topilmasa KeyError bermaydi — None qaytaradi yoki berilgan zaxira qiymatni.",
    },
    {
      code: py`
talaba = {"ism": "Vali", "baholar": [5, 4, 5]}
print(talaba["baholar"][1])
print(sum(talaba["baholar"]))
`,
      out: py`
4
14
`,
      why: "Avval kalit bo'yicha ro'yxat olinadi, keyin uning 1-indeksi. 5 + 4 + 5 = 14.",
    },
    {
      code: py`
sanoq = {}
for h in "aba":
    sanoq[h] = sanoq.get(h, 0) + 1
print(sanoq)
`,
      out: py`
{'a': 2, 'b': 1}
`,
      why: "Har harf uchun eski son (yo'q bo'lsa 0) bittaga oshiriladi — harflarni sanashning standart usuli.",
    },
    {
      code: py`
d = {"b": 2, "a": 1}
print(sorted(d))
print(list(d.values()))
`,
      out: py`
['a', 'b']
[2, 1]
`,
      why: "sorted(d) kalitlarni tartiblab ro'yxat qaytaradi. values() esa qo'shilish tartibida qoladi.",
    },
  ]),

  ...outputSet(15, [
    {
      code: py`
print(len({1, 2, 2, 3, 3, 3}))
`,
      out: py`
3
`,
      why: "Set takrorlarni saqlamaydi: faqat 1, 2, 3 qoladi.",
    },
    {
      code: py`
a = {1, 2, 3}
b = {2, 3, 4}
print(a & b)
print(sorted(a | b))
`,
      out: py`
{2, 3}
[1, 2, 3, 4]
`,
      why: "& — ikkalasida bor elementlar, | — ikkalasining hammasi.",
    },
    {
      code: py`
a = {1, 2, 3}
b = {2, 3, 4}
print(a - b)
`,
      out: py`
{1}
`,
      why: "a - b — a da bor, b da yo'q elementlar.",
    },
    {
      code: py`
x = {}
y = set()
print(type(x))
print(type(y))
`,
      out: py`
<class 'dict'>
<class 'set'>
`,
      why: "Bo'sh { } — bu dict. Bo'sh set faqat set() bilan yasaladi.",
    },
    {
      code: py`
royxat = [3, 1, 3, 2, 1]
print(sorted(set(royxat)))
print(len(royxat))
`,
      out: py`
[1, 2, 3]
5
`,
      why: "set() dublikatlarni olib tashlaydi, lekin asl ro'yxatning o'zi o'zgarmaydi.",
    },
  ]),

  ...outputSet(16, [
    {
      code: py`
def salom():
    print("Salom")

print("Boshlandi")
`,
      out: py`
Boshlandi
`,
      why: "def funksiyani faqat e'lon qiladi. U chaqirilmagani uchun \"Salom\" chiqmaydi.",
    },
    {
      code: py`
def salom(ism):
    print("Salom,", ism)

salom("Ali")
salom("Vali")
`,
      out: py`
Salom, Ali
Salom, Vali
`,
      why: "Har chaqiruvda ism parametriga yangi argument tushadi.",
    },
    {
      code: py`
def kvadrat(n):
    print(n * n)

kvadrat(3)
kvadrat(4)
`,
      out: py`
9
16
`,
      why: "Bitta funksiya ikki marta, har safar boshqa argument bilan ishladi.",
    },
    {
      code: py`
def chiz(belgi, soni):
    print(belgi * soni)

chiz("*", 3)
chiz("-", 5)
`,
      out: py`
***
-----
`,
      why: "Argumentlar tartib bo'yicha parametrlarga tushadi: belgi, keyin soni.",
    },
    {
      code: py`
def f():
    print("A")

print("B")
f()
f()
`,
      out: py`
B
A
A
`,
      why: "Kod yuqoridan pastga bajariladi: def faqat e'lon, \"B\" birinchi chiqadi, keyin f() ikki marta.",
    },
  ]),

  ...outputSet(17, [
    {
      code: py`
def qosh(a, b):
    return a + b

natija = qosh(2, 3)
print(natija * 2)
`,
      out: py`
10
`,
      why: "return qiymatni dasturga qaytaradi, uni o'zgaruvchiga saqlab ishlatish mumkin: 5 · 2 = 10.",
    },
    {
      code: py`
def f():
    print("ichida")

x = f()
print(x)
`,
      out: py`
ichida
None
`,
      why: "print ekranga chiqaradi, lekin hech narsa qaytarmaydi. return yo'q funksiya None qaytaradi.",
    },
    {
      code: py`
def f(n):
    return n * 2
    print("bu chiqadimi?")

print(f(4))
`,
      out: py`
8
`,
      why: "return bajarilishi bilan funksiya tugaydi — undan keyingi satr ishlamaydi.",
    },
    {
      code: py`
def salom(ism, til="uz"):
    return ism + " " + til

print(salom("Ali"))
print(salom("Ali", "en"))
`,
      out: py`
Ali uz
Ali en
`,
      why: "Default qiymat faqat argument berilmaganda ishlatiladi.",
    },
    {
      code: py`
def bolish(a, b):
    return a // b

print(bolish(b=2, a=9))
`,
      out: py`
4
`,
      why: "Nomli (keyword) argumentlarda tartib muhim emas: a = 9, b = 2, 9 // 2 = 4.",
    },
  ]),

  ...outputSet(18, [
    {
      code: py`
def jami(*sonlar):
    return sum(sonlar)

print(jami(1, 2, 3))
print(jami())
`,
      out: py`
6
0
`,
      why: "*sonlar hamma argumentni tuple'ga yig'adi. Bo'sh tuple'ning yig'indisi 0.",
    },
    {
      code: py`
def info(**kw):
    print(kw)

info(ism="Ali", yosh=20)
`,
      out: py`
{'ism': 'Ali', 'yosh': 20}
`,
      why: "**kw nomli argumentlarni dict'ga yig'adi.",
    },
    {
      code: py`
x = 10

def f():
    x = 5
    return x

print(f())
print(x)
`,
      out: py`
5
10
`,
      why: "Funksiya ichidagi x — local, tashqaridagi x ga tegmaydi.",
    },
    {
      code: py`
kv = lambda n: n * n
print(kv(5))
`,
      out: py`
25
`,
      why: "lambda — bir satrli funksiya, ifoda natijasini o'zi qaytaradi.",
    },
    {
      code: py`
sonlar = [3, 1, 2]
print(sorted(sonlar, key=lambda n: -n))
print(list(map(lambda n: n + 1, sonlar)))
`,
      out: py`
[3, 2, 1]
[4, 2, 3]
`,
      why: "key=-n kamayish tartibida saralaydi. map har elementga 1 qo'shadi, sonlar esa o'zgarmaydi.",
    },
  ]),

  ...outputSet(19, [
    {
      code: py`
import math
print(math.sqrt(16))
print(math.floor(3.7))
`,
      out: py`
4.0
3
`,
      why: "sqrt() har doim float qaytaradi. floor() pastga yaxlitlaydi.",
    },
    {
      code: py`
import math
print(math.ceil(3.2))
print(math.pi > 3)
`,
      out: py`
4
True
`,
      why: "ceil() yuqoriga yaxlitlaydi. pi = 3.14159...",
    },
    {
      code: py`
from math import pow
print(pow(2, 3))
`,
      out: py`
8.0
`,
      why: "math.pow float qaytaradi — 2 ** 3 dan farqli ravishda (u 8 beradi).",
    },
    {
      code: py`
import random
print(random.randint(5, 5))
print(random.choice(["faqat"]))
`,
      out: py`
5
faqat
`,
      why: "randint(a, b) ikkala chegarani ham oladi, shuning uchun (5, 5) har doim 5. Bitta elementdan tanlov ham har doim o'sha.",
    },
    {
      code: py`
import math as m
print(m.factorial(4))
`,
      out: py`
24
`,
      why: "import ... as modulga qisqa nom beradi. 4! = 1 · 2 · 3 · 4 = 24.",
    },
  ]),

  ...outputSet(20, [
    {
      code: py`
from datetime import date
d = date(2026, 3, 8)
print(d.year)
print(d.month)
`,
      out: py`
2026
3
`,
      why: "date obyektining year, month, day atributlari bor.",
    },
    {
      code: py`
from datetime import date
a = date(2026, 1, 10)
b = date(2026, 1, 1)
print((a - b).days)
`,
      out: py`
9
`,
      why: "Ikki sana ayirmasi timedelta bo'ladi, .days kunlar sonini beradi.",
    },
    {
      code: py`
from datetime import date
d = date(2026, 9, 1)
print(d.strftime("%d.%m.%Y"))
`,
      out: py`
01.09.2026
`,
      why: "%d va %m ikki xonali chiqadi (01, 09), %Y to'rt xonali yil.",
    },
    {
      code: py`
from datetime import date, timedelta
d = date(2026, 12, 30) + timedelta(days=3)
print(d)
`,
      out: py`
2027-01-02
`,
      why: "timedelta oy va yil chegarasidan o'zi o'tadi. Sana YYYY-MM-DD ko'rinishida chiqadi.",
    },
    {
      code: py`
from datetime import datetime
t = datetime(2026, 5, 9, 14, 30)
print(t.strftime("%H:%M"))
print(t.hour + 1)
`,
      out: py`
14:30
15
`,
      why: "%H:%M soat va daqiqani formatlaydi. hour — oddiy butun son.",
    },
  ]),

  ...outputSet(22, [
    {
      code: py`
with open("a.txt", "w", encoding="utf-8") as f:
    f.write("salom")

with open("a.txt", encoding="utf-8") as f:
    print(f.read())
`,
      out: py`
salom
`,
      why: "Avval faylga yoziladi, keyin o'qiladi. with blokidan chiqqach fayl o'zi yopiladi.",
    },
    {
      code: py`
with open("a.txt", "w", encoding="utf-8") as f:
    f.write("bir")
with open("a.txt", "w", encoding="utf-8") as f:
    f.write("ikki")

with open("a.txt", encoding="utf-8") as f:
    print(f.read())
`,
      out: py`
ikki
`,
      why: "\"w\" rejimi faylning eski mazmunini O'CHIRIB yozadi.",
    },
    {
      code: py`
with open("a.txt", "w", encoding="utf-8") as f:
    f.write("bir\n")
with open("a.txt", "a", encoding="utf-8") as f:
    f.write("ikki\n")

with open("a.txt", encoding="utf-8") as f:
    print(f.read())
`,
      out: py`
bir
ikki
`,
      why: "\"a\" rejimi oxiriga qo'shadi, eski mazmun saqlanadi.",
    },
    {
      code: py`
with open("s.txt", "w", encoding="utf-8") as f:
    f.write("1\n2\n3\n")

with open("s.txt", encoding="utf-8") as f:
    qatorlar = f.readlines()
print(len(qatorlar))
print(qatorlar[0].strip())
`,
      out: py`
3
1
`,
      why: "readlines() har qatorni \\n bilan birga ro'yxatga oladi. strip() uni olib tashlaydi.",
    },
    {
      code: py`
with open("b.txt", "w", encoding="utf-8") as f:
    f.write("olma nok olma")

with open("b.txt", encoding="utf-8") as f:
    sozlar = f.read().split()
print(len(sozlar))
print(f.closed)
`,
      out: py`
3
True
`,
      why: "split() so'zlarga bo'ladi. with tugagach fayl avtomatik yopilgan — f.closed True.",
    },
  ]),

  ...outputSet(23, [
    {
      code: py`
import json
d = {"ism": "Ali", "yosh": 20}
print(json.dumps(d))
`,
      out: py`
{"ism": "Ali", "yosh": 20}
`,
      why: "dumps() dict'ni JSON matniga aylantiradi. JSON'da kalitlar qo'shtirnoqda bo'ladi.",
    },
    {
      code: py`
import json
d = json.loads('{"a": 1, "b": [1, 2]}')
print(d["b"][1])
print(type(d))
`,
      out: py`
2
<class 'dict'>
`,
      why: "loads() matnni Python dict'iga aylantiradi (\"s\" — string).",
    },
    {
      code: py`
import json
print(json.dumps({"shahar": "Toshkent", "ok": True}))
`,
      out: py`
{"shahar": "Toshkent", "ok": true}
`,
      why: "Python'dagi True JSON'da kichik harf bilan true bo'ladi.",
    },
    {
      code: py`
import json
print(json.dumps([1, None, False]))
`,
      out: py`
[1, null, false]
`,
      why: "None JSON'da null, False esa false bo'ladi.",
    },
    {
      code: py`
import csv
with open("t.csv", "w", newline="", encoding="utf-8") as f:
    w = csv.writer(f)
    w.writerow(["ism", "ball"])
    w.writerow(["Ali", 90])

with open("t.csv", encoding="utf-8") as f:
    for qator in csv.reader(f):
        print(qator)
`,
      out: py`
['ism', 'ball']
['Ali', '90']
`,
      why: "CSV'da hamma narsa matn: o'qilganda 90 son emas, '90' satri bo'lib qaytadi.",
    },
  ]),

  ...outputSet(24, [
    {
      code: py`
try:
    print(10 / 0)
except ZeroDivisionError:
    print("nolga bo'lib bo'lmaydi")
`,
      out: py`
nolga bo'lib bo'lmaydi
`,
      why: "10 / 0 xato beradi, dastur qulamaydi — except bloki ishlaydi.",
    },
    {
      code: py`
try:
    son = int("abc")
    print("son:", son)
except ValueError:
    print("xato")
print("davom")
`,
      out: py`
xato
davom
`,
      why: "int(\"abc\") xato berganda try ichidagi qolgan satrlar o'tkazib yuboriladi. try/except'dan keyingi kod ishlayveradi.",
    },
    {
      code: py`
try:
    x = 5
except Exception:
    print("xato")
else:
    print("xato yo'q")
finally:
    print("har doim")
`,
      out: py`
xato yo'q
har doim
`,
      why: "else faqat xato bo'lmaganda, finally esa har holda bajariladi.",
    },
    {
      code: py`
def f():
    try:
        return "try"
    finally:
        print("finally")

print(f())
`,
      out: py`
finally
try
`,
      why: "return'dan oldin ham finally bajariladi. Qaytgan qiymat undan keyin chiqariladi.",
    },
    {
      code: py`
d = {"a": 1}
try:
    print(d["b"])
except KeyError:
    print("kalit yo'q")
except Exception:
    print("boshqa")
`,
      out: py`
kalit yo'q
`,
      why: "Mos kelgan birinchi except ishlaydi. Shuning uchun aniq xato turi umumiy Exception'dan oldin yoziladi.",
    },
  ]),
];
