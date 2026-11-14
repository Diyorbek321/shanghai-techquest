// "Kod nima chiqaradi?" — backend lessons 25..33 (OOP, Ilg'or Python), 5 each.
//
// No snippet prints an object without __str__/__repr__ or a bound method: their
// default text carries a memory address, which changes on every run.
import { outputSet, py } from './outputHelpers';
import type { LessonOutputRecord } from './types';

export const backendOutputO3: LessonOutputRecord[] = [
  ...outputSet(25, [
    {
      code: py`
class Mashina:
    def __init__(self, rang):
        self.rang = rang

m1 = Mashina("qizil")
m2 = Mashina("oq")
print(m1.rang, m2.rang)
`,
      out: py`
qizil oq
`,
      why: "Bitta class'dan ikki xil obyekt: har birining o'z rang atributi bor.",
    },
    {
      code: py`
class A:
    def __init__(self):
        print("yaratildi")

a = A()
b = A()
`,
      out: py`
yaratildi
yaratildi
`,
      why: "__init__ har bir obyekt yaratilganda avtomatik ishlaydi — ikki obyekt, ikki marta.",
    },
    {
      code: py`
class Talaba:
    def __init__(self, ism):
        self.ism = ism

t = Talaba("Ali")
t.ism = "Vali"
print(t.ism)
`,
      out: py`
Vali
`,
      why: "Obyekt atributini oddiy o'zgaruvchidek qayta yozish mumkin.",
    },
    {
      code: py`
class Sanoq:
    def __init__(self):
        self.n = 0

a = Sanoq()
b = Sanoq()
a.n += 5
print(a.n, b.n)
`,
      out: py`
5 0
`,
      why: "self.n har obyektning o'ziniki: a ni o'zgartirish b ga ta'sir qilmaydi.",
    },
    {
      code: py`
class Kitob:
    def __init__(self, nom, bet):
        self.nom = nom
        self.bet = bet

k = Kitob("Python", 300)
print(k.nom, k.bet // 100)
print(isinstance(k, Kitob))
`,
      out: py`
Python 3
True
`,
      why: "Argumentlar tartib bo'yicha nom va bet ga tushadi. k — Kitob class'ining obyekti.",
    },
  ]),

  ...outputSet(26, [
    {
      code: py`
class Hisob:
    def __init__(self):
        self.balans = 0

    def qosh(self, x):
        self.balans += x

h = Hisob()
h.qosh(100)
h.qosh(50)
print(h.balans)
`,
      out: py`
150
`,
      why: "Metod self orqali obyekt holatini o'zgartiradi: 0 + 100 + 50.",
    },
    {
      code: py`
class Mashina:
    def __init__(self):
        self.tezlik = 0

    def tezlash(self):
        self.tezlik += 10
        return self.tezlik

m = Mashina()
m.tezlash()
print(m.tezlash())
`,
      out: py`
20
`,
      why: "Birinchi chaqiruv natijasi chiqarilmadi, lekin tezlik baribir 10 bo'ldi. Ikkinchisi 20 qaytaradi.",
    },
    {
      code: py`
class Hisob:
    def __init__(self, balans):
        self.balans = balans

    def yech(self, x):
        if x > self.balans:
            print("yetarli emas")
        else:
            self.balans -= x

h = Hisob(100)
h.yech(150)
h.yech(30)
print(h.balans)
`,
      out: py`
yetarli emas
70
`,
      why: "Metod ichidagi tekshiruv noto'g'ri amalni rad etadi: 150 yechilmadi, 30 yechildi.",
    },
    {
      code: py`
class Doira:
    def __init__(self, r):
        self.r = r

    def diametr(self):
        return self.r * 2

    def info(self):
        return "d=" + str(self.diametr())

print(Doira(3).info())
`,
      out: py`
d=6
`,
      why: "Metod boshqa metodni self orqali chaqiradi.",
    },
    {
      code: py`
class Savat:
    def __init__(self):
        self.mahsulotlar = []

    def qosh(self, nom):
        self.mahsulotlar.append(nom)

s = Savat()
s.qosh("non")
s.qosh("sut")
print(len(s.mahsulotlar), s.mahsulotlar[-1])
`,
      out: py`
2 sut
`,
      why: "Atribut ro'yxat bo'lishi ham mumkin. Oxirgi qo'shilgani — \"sut\".",
    },
  ]),

  ...outputSet(27, [
    {
      code: py`
class Talaba:
    def __init__(self, ism):
        self.ism = ism

    def __str__(self):
        return "Talaba: " + self.ism

print(Talaba("Ali"))
`,
      out: py`
Talaba: Ali
`,
      why: "print obyekt uchun __str__ qaytargan matnni chiqaradi.",
    },
    {
      code: py`
class Talaba:
    def __init__(self, ism):
        self.ism = ism

    def __str__(self):
        return "Talaba: " + self.ism

t = Talaba("Vali")
print(f"{t}!")
`,
      out: py`
Talaba: Vali!
`,
      why: "f-string ham obyektni __str__ orqali matnga aylantiradi.",
    },
    {
      code: py`
class Mahsulot:
    def __init__(self, nom, narx):
        self.nom = nom
        self.narx = narx

items = [Mahsulot("non", 5000), Mahsulot("sut", 12000), Mahsulot("choy", 8000)]
for m in items:
    if m.narx > 6000:
        print(m.nom)
`,
      out: py`
sut
choy
`,
      why: "Obyektlar ro'yxati sikl va shart bilan boshqariladi: 6000 dan qimmatlari.",
    },
    {
      code: py`
class Mahsulot:
    def __init__(self, nom, narx):
        self.nom = nom
        self.narx = narx

items = [Mahsulot("non", 5000), Mahsulot("sut", 12000), Mahsulot("choy", 8000)]
jami = 0
for m in items:
    jami += m.narx
print(jami)
`,
      out: py`
25000
`,
      why: "Har obyektning narx atributi yig'iladi: 5000 + 12000 + 8000.",
    },
    {
      code: py`
class Mahsulot:
    def __init__(self, nom, narx):
        self.nom = nom
        self.narx = narx

items = [Mahsulot("non", 5000), Mahsulot("sut", 12000), Mahsulot("choy", 8000)]
arzon = min(items, key=lambda m: m.narx)
print(arzon.nom)
`,
      out: py`
non
`,
      why: "min() key bo'yicha solishtiradi va obyektning o'zini qaytaradi.",
    },
  ]),

  ...outputSet(28, [
    {
      code: py`
class Hayvon:
    def ovoz(self):
        return "..."

class It(Hayvon):
    pass

print(It().ovoz())
`,
      out: py`
...
`,
      why: "It o'zida ovoz() yozmagan — uni otasi Hayvon'dan meros oladi.",
    },
    {
      code: py`
class Hayvon:
    def ovoz(self):
        return "..."

class Mushuk(Hayvon):
    def ovoz(self):
        return "miyov"

print(Mushuk().ovoz())
print(Hayvon().ovoz())
`,
      out: py`
miyov
...
`,
      why: "Override: bola metodni qayta yozdi. Otaning o'z metodi o'zgarmaydi.",
    },
    {
      code: py`
class Hayvon:
    def __init__(self, ism):
        self.ism = ism

class It(Hayvon):
    def __init__(self, ism, zot):
        super().__init__(ism)
        self.zot = zot

it = It("Bobik", "ovcharka")
print(it.ism, it.zot)
`,
      out: py`
Bobik ovcharka
`,
      why: "super().__init__(ism) otaning __init__ ini chaqirib ism ni o'rnatadi. Usiz it.ism bo'lmasdi.",
    },
    {
      code: py`
class A:
    def salom(self):
        return "A"

class B(A):
    def salom(self):
        return super().salom() + "B"

print(B().salom())
`,
      out: py`
AB
`,
      why: "super() bilan otaning asl metodi chaqiriladi va natijasiga qo'shimcha qo'shiladi.",
    },
    {
      code: py`
class Hayvon:
    pass

class It(Hayvon):
    pass

print(isinstance(It(), Hayvon))
print(isinstance(Hayvon(), It))
`,
      out: py`
True
False
`,
      why: "Har It — Hayvon, lekin har Hayvon It emas. Meros bir tomonlama.",
    },
  ]),

  ...outputSet(29, [
    {
      code: py`
class Hisob:
    def __init__(self):
        self._balans = 100

h = Hisob()
print(h._balans)
`,
      out: py`
100
`,
      why: "_ — faqat «ichki, tegmang» kelishuvi. Python o'qishni taqiqlamaydi.",
    },
    {
      code: py`
class Doira:
    def __init__(self, r):
        self.r = r

    @property
    def yuza(self):
        return self.r * self.r * 3

d = Doira(2)
print(d.yuza)
`,
      out: py`
12
`,
      why: "@property metodni qavssiz, atributdek o'qish imkonini beradi: 2 · 2 · 3.",
    },
    {
      code: py`
class Kvadrat:
    def __init__(self, tomon):
        self.tomon = tomon

    @property
    def perimetr(self):
        return self.tomon * 4

k = Kvadrat(2)
k.tomon = 5
print(k.perimetr)
`,
      out: py`
20
`,
      why: "Property har o'qilganda qayta hisoblanadi — tomon o'zgargani darhol ko'rinadi.",
    },
    {
      code: py`
class Odam:
    def __init__(self):
        self._yosh = 0
    @property
    def yosh(self):
        return self._yosh
    @yosh.setter
    def yosh(self, v):
        if v >= 0:
            self._yosh = v

o = Odam()
o.yosh = -5
print(o.yosh)
`,
      out: py`
0
`,
      why: "Setter ichidagi tekshiruv manfiy qiymatni qabul qilmadi — yosh avvalgidek 0.",
    },
    {
      code: py`
class Doira:
    def __init__(self, r):
        self.r = r

    @property
    def yuza(self):
        return self.r * self.r * 3

d = Doira(1)
try:
    d.yuza = 5
except AttributeError:
    print("faqat o'qish")
`,
      out: py`
faqat o'qish
`,
      why: "Setter'siz property read-only: unga qiymat berish AttributeError beradi.",
    },
  ]),

  ...outputSet(30, [
    {
      code: py`
class It:
    def ovoz(self):
        return "vov"

class Mushuk:
    def ovoz(self):
        return "miyov"

for h in [It(), Mushuk()]:
    print(h.ovoz())
`,
      out: py`
vov
miyov
`,
      why: "Polimorfizm: bir xil metod nomi, har class'da o'zicha ishlaydi.",
    },
    {
      code: py`
class Savat:
    def __init__(self):
        self.items = ["a", "b", "c"]

    def __len__(self):
        return len(self.items)

print(len(Savat()))
`,
      out: py`
3
`,
      why: "len(obyekt) aslida obyekt.__len__() ni chaqiradi.",
    },
    {
      code: py`
class Nuqta:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __eq__(self, other):
        return self.x == other.x and self.y == other.y

print(Nuqta(1, 2) == Nuqta(1, 2))
print(Nuqta(1, 2) is Nuqta(1, 2))
`,
      out: py`
True
False
`,
      why: "== __eq__ ni chaqiradi va qiymatlarni solishtiradi. is esa bitta obyektmi-yo'qligini tekshiradi — bular ikki xil obyekt.",
    },
    {
      code: py`
class Pul:
    def __init__(self, s):
        self.s = s

    def __add__(self, other):
        return Pul(self.s + other.s)

    def __str__(self):
        return f"{self.s} so'm"

print(Pul(500) + Pul(700))
`,
      out: py`
1200 so'm
`,
      why: "+ belgisi __add__ ni chaqiradi, natija yangi Pul obyekti — print uni __str__ orqali chiqaradi.",
    },
    {
      code: py`
class A:
    def __repr__(self):
        return "A()"

print(A())
print([A(), A()])
`,
      out: py`
A()
[A(), A()]
`,
      why: "__str__ bo'lmasa __repr__ ishlatiladi. Ro'yxat ichidagi obyektlar har doim __repr__ bilan chiqadi.",
    },
  ]),

  ...outputSet(31, [
    {
      code: py`
print([x * 2 for x in range(4)])
`,
      out: py`
[0, 2, 4, 6]
`,
      why: "Har x uchun x * 2 hisoblanib ro'yxatga yig'iladi.",
    },
    {
      code: py`
print([x for x in range(10) if x % 3 == 0])
`,
      out: py`
[0, 3, 6, 9]
`,
      why: "Oxiridagi if — filtr: faqat 3 ga bo'linadiganlari qoladi.",
    },
    {
      code: py`
print(["juft" if x % 2 == 0 else "toq" for x in [1, 2, 3]])
`,
      out: py`
['toq', 'juft', 'toq']
`,
      why: "Boshidagi if/else filtr emas — har element uchun tanlov. Element soni o'zgarmaydi.",
    },
    {
      code: py`
print({x: x * x for x in range(1, 4)})
`,
      out: py`
{1: 1, 2: 4, 3: 9}
`,
      why: "{kalit: qiymat for ...} — dict comprehension.",
    },
    {
      code: py`
sozlar = ["olma", "nok", "uzum"]
print([len(s) for s in sozlar])
print({len(s) for s in sozlar})
`,
      out: py`
[4, 3, 4]
{3, 4}
`,
      why: "[ ] ro'yxat yasaydi va takrorni saqlaydi. { } (kalitsiz) set yasaydi — takror 4 bitta qoladi.",
    },
  ]),

  ...outputSet(32, [
    {
      code: py`
def gen():
    yield 1
    yield 2

for x in gen():
    print(x)
`,
      out: py`
1
2
`,
      why: "yield qiymatni birma-bir beradi. for ularni navbat bilan oladi.",
    },
    {
      code: py`
g = (x * x for x in range(3))
print(list(g))
print(list(g))
`,
      out: py`
[0, 1, 4]
[]
`,
      why: "Generator bir marta o'qiladi. Ikkinchi marta unda hech narsa qolmagan.",
    },
    {
      code: py`
def g():
    print("boshlandi")
    yield 1
    print("davom")
    yield 2

it = g()
print(next(it))
print(next(it))
`,
      out: py`
boshlandi
1
davom
2
`,
      why: "yield funksiyani PAUZA qiladi. Keyingi next() aynan to'xtagan joyidan davom ettiradi.",
    },
    {
      code: py`
def sanoq(n):
    i = 0
    while i < n:
        yield i
        i += 1

print(sum(sanoq(5)))
`,
      out: py`
10
`,
      why: "Generator 0, 1, 2, 3, 4 ni beradi, sum() ularni qo'shadi.",
    },
    {
      code: py`
g = (x for x in [1, 2, 3])
print(type(g).__name__)
print(next(g))
`,
      out: py`
generator
1
`,
      why: "( ) ichidagi comprehension ro'yxat emas — generator ifodasi.",
    },
  ]),

  ...outputSet(33, [
    {
      code: py`
def tashqi():
    x = 5
    def ichki():
        return x * 2
    return ichki

f = tashqi()
print(f())
`,
      out: py`
10
`,
      why: "Closure: tashqi() tugagan bo'lsa ham, ichki funksiya x ni eslab qolgan.",
    },
    {
      code: py`
def kopaytir(n):
    def f(x):
        return x * n
    return f

ikki = kopaytir(2)
uch = kopaytir(3)
print(ikki(5), uch(5))
`,
      out: py`
10 15
`,
      why: "Har closure o'z n qiymatini saqlaydi: biri 2, biri 3.",
    },
    {
      code: py`
def dek(func):
    def wrapper():
        print("oldin")
        func()
        print("keyin")
    return wrapper

@dek
def salom():
    print("salom")

salom()
`,
      out: py`
oldin
salom
keyin
`,
      why: "@dek — bu salom = dek(salom). Endi salom() aslida wrapper'ni chaqiradi.",
    },
    {
      code: py`
def ikki_baravar(func):
    def wrapper(*args, **kwargs):
        return func(*args, **kwargs) * 2
    return wrapper

@ikki_baravar
def qosh(a, b):
    return a + b

print(qosh(2, 3))
`,
      out: py`
10
`,
      why: "wrapper argumentlarni asl funksiyaga uzatadi va natijani 2 ga ko'paytiradi: (2 + 3) · 2.",
    },
    {
      code: py`
from functools import wraps

def dek(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        return func(*args, **kwargs)
    return wrapper

@dek
def hisobla():
    pass

print(hisobla.__name__)
`,
      out: py`
hisobla
`,
      why: "@wraps(func) asl funksiya nomini saqlaydi. Usiz \"wrapper\" chiqqan bo'lardi.",
    },
  ]),
];
