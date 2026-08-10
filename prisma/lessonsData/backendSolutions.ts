/**
 * Reference solutions, used only to build the Parsons (line-ordering) variant of
 * a problem.
 *
 * These are NOT trusted on sight. `scripts/addParsonsSolutions.ts` runs every
 * one of them through the real code runner against that problem's own stored
 * test cases and refuses to save any solution that does not pass — a Parsons
 * exercise assembled from wrong code would drill the wrong structure into a
 * beginner, which is worse than offering no exercise at all.
 *
 * Line breaks matter here in a way they do not in ordinary source: each
 * non-blank line becomes one draggable card. Prefer one statement per line, and
 * avoid one-liners that collapse the structure the exercise is meant to teach.
 *
 * SCAFFOLDED PROBLEMS ARE DELIBERATELY ABSENT. From the SQL lessons onward many
 * problems ship a fixed Python harness — it builds the database, runs the query
 * and prints the result — and the student writes only the SQL string inside it.
 * The harness says "bu yerni o'zgartirmang" in as many words. Shuffling those
 * lines would hand the student cards made of code they were just told not to
 * touch, and drill the ordering of a harness instead of the skill the lesson
 * teaches. A missing exercise is honest; a misleading one is not.
 */
export interface ParsonsSolutionRecord {
  /** Problem.key this solution belongs to. */
  key: string;
  solutionPy: string;
}

export const backendParsonsSolutions: ParsonsSolutionRecord[] = [
  {
    key: 'backend-dars-01-easy',
    solutionPy: `print("Ism: Ali")
print("Familiya: Karimov")
print("Yosh: 15")
print("Shahar: Toshkent")
print("Sevimli rang: ko'k")`,
  },
  {
    key: 'backend-dars-01-medium',
    solutionPy: `# Bu dastur o'zim haqimda uchta qator chiqaradi
print("Salom, dunyo!")  # birinchi salomlashuv
print("Men Python o'rganyapman.")
print("Birinchi dasturim tayyor.")`,
  },
  {
    // Rows 1/5 and 2/4 are identical, which makes this the problem that proves
    // duplicate cards are interchangeable rather than a grading bug.
    key: 'backend-dars-01-hard',
    solutionPy: `print("*********")
print("*       *")
print("*  ALI  *")
print("*       *")
print("*********")`,
  },
  {
    key: 'backend-dars-02-easy',
    solutionPy: `ism = input()
familiya = input()
print(f"Salom, {ism} {familiya}!")`,
  },
  {
    key: 'backend-dars-02-medium',
    solutionPy: `shahar = input()
maktab = input()
sinf = input()
print(f"Men {shahar} shahridanman, {maktab}-maktabning {sinf} sinfida o'qiyman.")`,
  },
  {
    key: 'backend-dars-02-hard',
    solutionPy: `birinchi = input()
ikkinchi = input()
print(f"{ikkinchi} {birinchi}")`,
  },
  {
    key: 'backend-dars-03-easy',
    solutionPy: `yosh = 15
bo_y = 1.72
ism = "Ali"
talabami = True
print(type(yosh))
print(type(bo_y))
print(type(ism))
print(type(talabami))`,
  },
  {
    key: 'backend-dars-03-medium',
    solutionPy: `a = int(input())
b = int(input())
print(f"Yig'indi: {a + b}")
print(f"Ko'paytma: {a * b}")`,
  },
  {
    key: 'backend-dars-03-hard',
    solutionPy: `bo_y = float(input())
vazn = float(input())
tmi = vazn / (bo_y * bo_y)
print(f"TMI: {tmi:.2f}")`,
  },
  {
    key: 'backend-dars-04-easy',
    solutionPy: `a = int(input())
b = int(input())
print(f"Yig'indi: {a + b}")
print(f"Ayirma: {a - b}")
print(f"Ko'paytma: {a * b}")
print(f"Bo'linma: {a / b:.2f}")`,
  },
  {
    key: 'backend-dars-04-medium',
    solutionPy: `sekundlar = int(input())
daqiqa = sekundlar // 60
sekund = sekundlar % 60
print(f"{daqiqa} daqiqa {sekund} sekund")`,
  },
  {
    key: 'backend-dars-04-hard',
    solutionPy: `son = int(input())
yuzlar = son // 100
onlar = (son // 10) % 10
birlar = son % 10
print(f"Raqamlar yig'indisi: {yuzlar + onlar + birlar}")`,
  },
  // --- Darslar 5-8: satrlar, shartlar ---
  {
    key: 'backend-dars-05-easy',
    solutionPy: `soz = input()
print(f"Birinchi: {soz[0]}")
print(f"O'rtadagi: {soz[len(soz) // 2]}")
print(f"Oxirgi: {soz[-1]}")`,
  },
  {
    key: 'backend-dars-05-medium',
    solutionPy: `toliq = input().split()
ism = toliq[0]
familiya = toliq[1]
print(f"{ism[0].upper()}.{familiya[0].upper()}.")`,
  },
  {
    key: 'backend-dars-05-hard',
    solutionPy: `soz = input()
teskari = soz[::-1]
print(f"Teskari: {teskari}")
if teskari == soz:
    print("Palindrom: Ha")
else:
    print("Palindrom: Yo'q")`,
  },
  {
    key: 'backend-dars-06-easy',
    solutionPy: `gap = input().strip()
print(gap.upper())
print(gap.lower())`,
  },
  {
    key: 'backend-dars-06-medium',
    solutionPy: `gap = input()
sozlar = gap.split()
print(f"So'zlar soni: {len(sozlar)}")
print(f"Birinchi so'z: {sozlar[0]}")`,
  },
  {
    key: 'backend-dars-06-hard',
    solutionPy: `gap = input()
unlilar = "aeiou"
soni = 0
for harf in gap.lower():
    if harf in unlilar:
        soni += 1
print(f"Unlilar soni: {soni}")`,
  },
  {
    key: 'backend-dars-07-easy',
    solutionPy: `son = int(input())
if son > 100:
    print("100 dan katta")
elif son < 100:
    print("100 dan kichik")
else:
    print("100 ga teng")`,
  },
  {
    key: 'backend-dars-07-medium',
    solutionPy: `ball = int(input())
if ball >= 90:
    baho = 5
elif ball >= 70:
    baho = 4
elif ball >= 50:
    baho = 3
else:
    baho = 2
print(f"Baho: {baho}")`,
  },
  {
    key: 'backend-dars-07-hard',
    solutionPy: `yil = int(input())
if (yil % 4 == 0 and yil % 100 != 0) or yil % 400 == 0:
    print("Kabisa")
else:
    print("Kabisa emas")`,
  },
  {
    key: 'backend-dars-08-easy',
    solutionPy: `a = int(input())
b = int(input())
if a > 0 and b > 0:
    print("Ikkalasi ham musbat")
else:
    print("Ikkalasi ham musbat emas")`,
  },
  {
    key: 'backend-dars-08-medium',
    solutionPy: `yosh = int(input())
talaba = input()
if yosh < 12:
    chegirma = 50
elif yosh >= 60:
    chegirma = 40
elif talaba == "ha":
    chegirma = 30
else:
    chegirma = 0
print(f"Chegirma: {chegirma}%")`,
  },
  {
    key: 'backend-dars-08-hard',
    solutionPy: `a = int(input())
b = int(input())
c = int(input())
if a >= b and a >= c:
    eng_katta = a
elif b >= a and b >= c:
    eng_katta = b
else:
    eng_katta = c
print(f"Eng katta: {eng_katta}")`,
  },
  // --- Darslar 9-12: sikllar, ro'yxatlar, 1-oy loyihasi ---
  {
    key: 'backend-dars-09-easy',
    solutionPy: `n = int(input())
i = 1
while i <= n:
    print(f"{i} * {i} = {i * i}")
    i += 1`,
  },
  {
    key: 'backend-dars-09-medium',
    solutionPy: `yigindi = 0
son = int(input())
while son != 0:
    yigindi += son
    son = int(input())
print(f"Yig'indi: {yigindi}")`,
  },
  {
    key: 'backend-dars-09-hard',
    solutionPy: `yashirin = int(input())
urinishlar = 0
while True:
    taxmin = int(input())
    urinishlar += 1
    if taxmin > yashirin:
        print("Kichikroq")
    elif taxmin < yashirin:
        print("Kattaroq")
    else:
        print(f"Topdingiz! {urinishlar} ta urinish")
        break`,
  },
  {
    key: 'backend-dars-10-easy',
    solutionPy: `n = int(input())
for i in range(1, n + 1):
    print(f"{i} ning kvadrati: {i * i}")`,
  },
  {
    key: 'backend-dars-10-medium',
    solutionPy: `soz = input()
for harf in soz:
    print(harf)`,
  },
  {
    key: 'backend-dars-10-hard',
    solutionPy: `n = int(input())
for i in range(1, n + 1):
    qator = ""
    for j in range(i):
        qator += "*"
    print(qator)`,
  },
  {
    key: 'backend-dars-11-easy',
    solutionPy: `sonlar = [int(x) for x in input().split()]
yigindi = 0
for son in sonlar:
    yigindi += son
print(f"Yig'indi: {yigindi}")`,
  },
  {
    key: 'backend-dars-11-medium',
    solutionPy: `n = int(input())
ismlar = []
for i in range(n):
    ismlar.append(input())
ismlar.sort()
for ism in ismlar:
    print(ism)`,
  },
  {
    key: 'backend-dars-11-hard',
    solutionPy: `sonlar = [int(x) for x in input().split()]
eng_katta = sonlar[0]
eng_kichik = sonlar[0]
for son in sonlar:
    if son > eng_katta:
        eng_katta = son
    if son < eng_kichik:
        eng_kichik = son
print(f"Eng katta: {eng_katta}")
print(f"Eng kichik: {eng_kichik}")`,
  },
  {
    key: 'backend-dars-12-easy',
    solutionPy: `yashirin = int(input())
while True:
    taxmin = int(input())
    if taxmin < yashirin:
        print("Katta son ayting")
    elif taxmin > yashirin:
        print("Kichik son ayting")
    else:
        print("Topdingiz!")
        break`,
  },
  {
    key: 'backend-dars-12-medium',
    solutionPy: `yashirin = int(input())
topildi = False
for urinish in range(1, 8):
    taxmin = int(input())
    if taxmin < yashirin:
        print("Katta son ayting")
    elif taxmin > yashirin:
        print("Kichik son ayting")
    else:
        print(f"Topdingiz! {urinish} ta urinish")
        topildi = True
        break
if not topildi:
    print(f"Yutqazdingiz! Son: {yashirin}")`,
  },
  {
    key: 'backend-dars-12-hard',
    solutionPy: `while True:
    amal = input()
    if amal == "chiq":
        print("Xayr!")
        break
    a = int(input())
    b = int(input())
    if amal == "+":
        print(f"{a} + {b} = {a + b}")
    elif amal == "-":
        print(f"{a} - {b} = {a - b}")
    elif amal == "*":
        print(f"{a} * {b} = {a * b}")
    elif b == 0:
        print("Nolga bo'lib bo'lmaydi")
    else:
        print(f"{a} / {b} = {a / b}")`,
  },
  // --- Darslar 13-16: lug'atlar, to'plamlar, funksiyalar ---
  {
    key: 'backend-dars-13-easy',
    solutionPy: `kitob = {"Ali": "901234567", "Malika": "935556677", "Bexruz": "977778899"}
ism = input()
print(f"{ism} -> {kitob[ism]}")`,
  },
  {
    key: 'backend-dars-13-medium',
    solutionPy: `kitob = {"Ali": "901234567", "Malika": "935556677", "Bexruz": "977778899"}
ism = input()
raqam = input()
kitob[ism] = raqam
print(f"Saqlandi: {ism} - {raqam}")
print(f"Jami: {len(kitob)}")`,
  },
  {
    key: 'backend-dars-13-hard',
    solutionPy: `n = int(input())
kitob = {}
for i in range(n):
    qator = input().split()
    kitob[qator[0]] = qator[1]
qidiruv = input()
if qidiruv in kitob:
    print(f"{qidiruv}: {kitob[qidiruv]}")
else:
    print("Topilmadi")`,
  },
  {
    key: 'backend-dars-14-easy',
    solutionPy: `n = int(input())
narxlar = {}
for i in range(n):
    nom, narx = input().split()
    narxlar[nom] = int(narx)
for nom in narxlar:
    print(f"{nom}: {narxlar[nom]}")
print(f"Mahsulotlar: {len(narxlar)}")`,
  },
  {
    key: 'backend-dars-14-medium',
    solutionPy: `n = int(input())
savat = {}
for i in range(n):
    nom, narx = input().split()
    savat[nom] = savat.get(nom, 0) + int(narx)
jami = 0
for nom in savat:
    print(f"{nom}: {savat[nom]}")
    jami += savat[nom]
print(f"Jami: {jami}")`,
  },
  {
    key: 'backend-dars-14-hard',
    solutionPy: `n = int(input())
ballar = {}
for i in range(n):
    ism, ball = input().split()
    ballar[ism] = int(ball)
eng_yuqori = None
eng_past = None
for ism in ballar:
    if eng_yuqori is None or ballar[ism] > ballar[eng_yuqori]:
        eng_yuqori = ism
    if eng_past is None or ballar[ism] < ballar[eng_past]:
        eng_past = ism
print(f"Eng yuqori: {eng_yuqori} ({ballar[eng_yuqori]})")
print(f"Eng past: {eng_past} ({ballar[eng_past]})")`,
  },
  {
    key: 'backend-dars-15-easy',
    solutionPy: `sonlar = [int(x) for x in input().split()]
noyob = sorted(set(sonlar))
print(f"Noyob: {len(noyob)}")
print(" ".join(str(son) for son in noyob))`,
  },
  {
    key: 'backend-dars-15-medium',
    solutionPy: `birinchi = set(input().split())
ikkinchi = set(input().split())
umumiy = sorted(birinchi & ikkinchi)
if umumiy:
    print(" ".join(umumiy))
else:
    print("Umumiy element yo'q")`,
  },
  {
    key: 'backend-dars-15-hard',
    solutionPy: `matn = input().lower()
harflar = set()
for harf in matn:
    if harf != " ":
        harflar.add(harf)
tartibli = sorted(harflar)
print(f"Noyob harflar: {len(tartibli)}")
print(" ".join(tartibli))`,
  },
  {
    key: 'backend-dars-16-easy',
    solutionPy: `def kvadrat(n):
    print(f"Kvadrat: {n * n}")
def kub(n):
    print(f"Kub: {n * n * n}")
def yarim(n):
    print(f"Yarim: {n / 2}")
son = int(input())
kvadrat(son)
kub(son)
yarim(son)`,
  },
  {
    key: 'backend-dars-16-medium',
    solutionPy: `def salomlash(ism):
    print(f"Salom, {ism}! Bugungi darsga xush kelibsiz.")
ismlar = []
for i in range(3):
    ismlar.append(input())
for ism in ismlar:
    salomlash(ism)`,
  },
  {
    key: 'backend-dars-16-hard',
    solutionPy: `def tortburchak(eni, boyi):
    print(f"Yuza: {eni * boyi}")
    print(f"Perimetr: {2 * (eni + boyi)}")
for i in range(2):
    eni, boyi = input().split()
    tortburchak(int(eni), int(boyi))`,
  },
  // --- Darslar 17-20: return, *args/**kwargs, math/random, datetime ---
  {
    key: 'backend-dars-17-easy',
    solutionPy: `def yigindi(a, b):
    return a + b
birinchi = int(input())
ikkinchi = int(input())
natija = yigindi(birinchi, ikkinchi)
print(f"Yig'indi: {natija}")`,
  },
  {
    key: 'backend-dars-17-medium',
    solutionPy: `def doira_yuzasi(radius=1):
    return 3.14159 * radius * radius
r = int(input())
print(f"Standart: {doira_yuzasi():.2f}")
print(f"Radius {r}: {doira_yuzasi(r):.2f}")`,
  },
  {
    key: 'backend-dars-17-hard',
    solutionPy: `def statistika(sonlar):
    kichik = min(sonlar)
    katta = max(sonlar)
    ortacha = sum(sonlar) / len(sonlar)
    return kichik, katta, ortacha
sonlar = [int(x) for x in input().split()]
kichik, katta, ortacha = statistika(sonlar)
print(f"Min: {kichik}")
print(f"Max: {katta}")
print(f"O'rtacha: {ortacha:.2f}")`,
  },
  {
    key: 'backend-dars-18-easy',
    solutionPy: `def yigindi(*sonlar):
    jami = 0
    for son in sonlar:
        jami += son
    return jami
n = int(input())
umumiy = 0
for i in range(n):
    guruh = [int(x) for x in input().split()]
    natija = yigindi(*guruh)
    print(natija)
    umumiy += natija
print(f"Jami: {umumiy}")`,
  },
  {
    key: 'backend-dars-18-medium',
    solutionPy: `def profil(**malumot):
    print("--- Profil ---")
    for kalit, qiymat in malumot.items():
        print(f"{kalit}: {qiymat}")
n = int(input())
for i in range(n):
    juftliklar = {}
    for bolak in input().split():
        kalit, qiymat = bolak.split("=")
        juftliklar[kalit] = qiymat
    profil(**juftliklar)`,
  },
  {
    key: 'backend-dars-18-hard',
    solutionPy: `sozlar = input().split()
osish = sorted(sozlar, key=lambda s: len(s))
kamayish = sorted(sozlar, key=lambda s: len(s), reverse=True)
print(" ".join(osish))
print(" ".join(kamayish))`,
  },
  {
    key: 'backend-dars-19-easy',
    solutionPy: `import math
n = int(input())
ildiz = math.sqrt(n)
print(f"Ildiz: {ildiz:.2f}")
print(f"Yuqoriga: {math.ceil(ildiz)}")
print(f"Pastga: {math.floor(ildiz)}")`,
  },
  {
    key: 'backend-dars-19-medium',
    solutionPy: `import math
r = int(input())
k = int(input())
print(f"Uzunlik: {2 * math.pi * r:.2f}")
print(f"Faktorial: {math.factorial(k)}")`,
  },
  {
    key: 'backend-dars-19-hard',
    solutionPy: `import random
import math
urug = int(input())
n = int(input())
random.seed(urug)
sonlar = []
for i in range(n):
    sonlar.append(random.randint(1, 100))
print(" ".join(str(son) for son in sonlar))
print(" ".join(f"{math.sqrt(son):.2f}" for son in sonlar))`,
  },
  {
    key: 'backend-dars-20-easy',
    solutionPy: `from datetime import datetime
matn = input()
sana = datetime.strptime(matn, "%Y-%m-%d")
print(sana.strftime("%d.%m.%Y"))`,
  },
  {
    key: 'backend-dars-20-medium',
    solutionPy: `from datetime import datetime
tugilgan = datetime.strptime(input(), "%Y-%m-%d")
bugun = datetime.strptime(input(), "%Y-%m-%d")
kunlar = (bugun - tugilgan).days
yosh = bugun.year - tugilgan.year
if (bugun.month, bugun.day) < (tugilgan.month, tugilgan.day):
    yosh -= 1
print(f"Kunlar: {kunlar}")
print(f"To'liq yosh: {yosh}")`,
  },
  {
    key: 'backend-dars-20-hard',
    solutionPy: `from datetime import datetime, timedelta
kunlar_nomi = ["Dushanba", "Seshanba", "Chorshanba", "Payshanba", "Juma", "Shanba", "Yakshanba"]
sana = datetime.strptime(input(), "%Y-%m-%d")
n = int(input())
natija = sana + timedelta(days=n)
print(f"Sana: {natija.strftime('%d.%m.%Y')}")
print(f"Hafta kuni: {kunlar_nomi[natija.weekday()]}")`,
  },
  // --- Darslar 21-24: pip, fayllar, JSON/CSV, try/except ---
  {
    key: 'backend-dars-21-easy',
    solutionPy: `n = int(input())
for i in range(n):
    qator = input()
    nom, versiya = qator.split("==")
    print(f"{nom} — {versiya}")`,
  },
  {
    key: 'backend-dars-21-medium',
    solutionPy: `paketlar = set()
n = int(input())
for i in range(n):
    paketlar.add(input().split("==")[0])
m = int(input())
for i in range(m):
    paketlar.add(input().split("==")[0])
for nom in sorted(paketlar):
    print(nom)
print(f"Jami: {len(paketlar)}")`,
  },
  {
    key: 'backend-dars-21-hard',
    solutionPy: `n = int(input())
for i in range(n):
    birinchi, ikkinchi = input().split()
    a = [int(x) for x in birinchi.split(".")]
    b = [int(x) for x in ikkinchi.split(".")]
    if a > b:
        print(birinchi)
    elif b > a:
        print(ikkinchi)
    else:
        print("teng")`,
  },
  {
    key: 'backend-dars-22-easy',
    solutionPy: `matn = input()
with open("matn.txt", "w", encoding="utf-8") as f:
    f.write(matn)
with open("matn.txt", "r", encoding="utf-8") as f:
    oqilgan = f.read()
print("Faylga yozildi")
print(oqilgan)`,
  },
  {
    key: 'backend-dars-22-medium',
    solutionPy: `n = int(input())
for i in range(n):
    yozuv = input()
    with open("kundalik.txt", "a", encoding="utf-8") as f:
        f.write(yozuv + "\\n")
with open("kundalik.txt", "r", encoding="utf-8") as f:
    satrlar = f.read().splitlines()
for raqam, satr in enumerate(satrlar, start=1):
    print(f"{raqam}. {satr}")
print(f"Yozuvlar soni: {len(satrlar)}")`,
  },
  {
    key: 'backend-dars-22-hard',
    solutionPy: `n = int(input())
with open("matnlar.txt", "w", encoding="utf-8") as f:
    for i in range(n):
        f.write(input() + "\\n")
with open("matnlar.txt", "r", encoding="utf-8") as f:
    satrlar = f.read().splitlines()
eng_uzun = satrlar[0]
for satr in satrlar:
    if len(satr) > len(eng_uzun):
        eng_uzun = satr
print(f"Eng uzun satr: {eng_uzun}")
print(f"Uzunligi: {len(eng_uzun)}")`,
  },
  {
    key: 'backend-dars-23-easy',
    solutionPy: `import json
ism = input()
yosh = int(input())
talaba = {"ism": ism, "yosh": yosh}
with open("talaba.json", "w", encoding="utf-8") as f:
    json.dump(talaba, f, ensure_ascii=False)
with open("talaba.json", "r", encoding="utf-8") as f:
    oqilgan = json.load(f)
print(f"Ism: {oqilgan['ism']}")
print(f"Yosh: {oqilgan['yosh']}")
print(f"Kalitlar soni: {len(oqilgan)}")`,
  },
  {
    key: 'backend-dars-23-medium',
    solutionPy: `import json
n = int(input())
talabalar = []
for i in range(n):
    ism, ball = input().split()
    talabalar.append({"ism": ism, "ball": int(ball)})
with open("talabalar.json", "w", encoding="utf-8") as f:
    json.dump(talabalar, f, ensure_ascii=False)
with open("talabalar.json", "r", encoding="utf-8") as f:
    oqilgan = json.load(f)
jami = 0
for talaba in oqilgan:
    print(f"{talaba['ism']}: {talaba['ball']}")
    jami += talaba["ball"]
ortacha = jami / len(oqilgan)
print(f"O'rtacha: {round(ortacha, 1)}")`,
  },
  {
    key: 'backend-dars-23-hard',
    solutionPy: `import csv
n = int(input())
qatorlar = []
for i in range(n):
    ism, shahar, yosh = input().split(",")
    qatorlar.append({"ism": ism, "shahar": shahar, "yosh": yosh})
with open("odamlar.csv", "w", encoding="utf-8", newline="") as f:
    yozuvchi = csv.DictWriter(f, fieldnames=["ism", "shahar", "yosh"])
    yozuvchi.writeheader()
    yozuvchi.writerows(qatorlar)
kattalar = 0
with open("odamlar.csv", "r", encoding="utf-8", newline="") as f:
    for qator in csv.DictReader(f):
        if int(qator["yosh"]) >= 18:
            print(f"{qator['ism']} ({qator['shahar']})")
            kattalar += 1
print(f"Kattalar: {kattalar}")`,
  },
  {
    key: 'backend-dars-24-easy',
    solutionPy: `qator = input()
try:
    son = int(qator)
    print(f"Natija: {son * 2}")
except ValueError:
    print("Xato: butun son kiriting")`,
  },
  {
    key: 'backend-dars-24-medium',
    solutionPy: `with open("mavjud.txt", "w", encoding="utf-8") as f:
    f.write("Salom")
nom = input()
try:
    with open(nom, "r", encoding="utf-8") as f:
        print(f"Mazmun: {f.read()}")
except FileNotFoundError:
    print("Xato: fayl topilmadi")
print("Dastur tugadi")`,
  },
  {
    key: 'backend-dars-24-hard',
    solutionPy: `n = int(input())
for i in range(n):
    a, b = input().split()
    try:
        natija = int(a) / int(b)
        print(f"{natija:.2f}")
    except ZeroDivisionError:
        print("Xato: nolga bo'lib bo'lmaydi")
    except ValueError:
        print("Xato: son emas")
print(f"Tekshirilgan amallar: {n}")`,
  },
  // --- Darslar 25-30: OOP — classlar, meros, property, magic metodlar ---
  {
    key: 'backend-dars-25-easy',
    solutionPy: `class Talaba:
    def __init__(self, ism, yosh):
        self.ism = ism
        self.yosh = yosh
for i in range(2):
    ism, yosh = input().split()
    talaba = Talaba(ism, int(yosh))
    print(f"{talaba.ism}, {talaba.yosh} yosh")`,
  },
  {
    key: 'backend-dars-25-medium',
    solutionPy: `class Kitob:
    def __init__(self, nom, muallif, yil):
        self.nom = nom
        self.muallif = muallif
        self.yil = yil
nom = input()
muallif = input()
yil = int(input())
joriy = int(input())
kitob = Kitob(nom, muallif, yil)
print(f"{kitob.nom} — {kitob.muallif} ({kitob.yil})")
print(f"Yoshi: {joriy - kitob.yil} yil")`,
  },
  {
    key: 'backend-dars-25-hard',
    solutionPy: `class Talaba:
    def __init__(self, ism, yosh):
        self.ism = ism
        self.yosh = yosh
n = int(input())
talabalar = []
for i in range(n):
    ism, yosh = input().split()
    talabalar.append(Talaba(ism, int(yosh)))
for tartib, talaba in enumerate(talabalar, start=1):
    print(f"{tartib}. {talaba.ism} ({talaba.yosh})")
print(f"Jami: {n}")
yigindi = 0
for talaba in talabalar:
    yigindi += talaba.yosh
print(f"O'rtacha yosh: {round(yigindi / n, 1)}")`,
  },
  {
    key: 'backend-dars-26-easy',
    solutionPy: `class Sanoqchi:
    def __init__(self):
        self.qiymat = 0
    def oshir(self):
        self.qiymat += 1
    def kamaytir(self):
        self.qiymat -= 1
    def korsat(self):
        print(f"Hisob: {self.qiymat}")
n = int(input())
sanoqchi = Sanoqchi()
for i in range(n):
    buyruq = input()
    if buyruq == "oshir":
        sanoqchi.oshir()
    elif buyruq == "kamaytir":
        sanoqchi.kamaytir()
    else:
        sanoqchi.korsat()
print(f"Yakuniy: {sanoqchi.qiymat}")`,
  },
  {
    key: 'backend-dars-26-medium',
    solutionPy: `class Mashina:
    def __init__(self):
        self.tezlik = 0
        self.yoqilgan = False
    def yoq(self):
        if self.yoqilgan:
            print("Mashina allaqachon yoqilgan")
        else:
            self.yoqilgan = True
            print("Mashina yoqildi")
    def tezlash(self, n):
        if not self.yoqilgan:
            print("Avval mashinani yoqing")
        else:
            self.tezlik += n
            print(f"Tezlik: {self.tezlik} km/h")
    def toxta(self):
        self.tezlik = 0
        self.yoqilgan = False
        print("Mashina to'xtadi")
n = int(input())
mashina = Mashina()
for i in range(n):
    buyruq = input().split()
    if buyruq[0] == "yoq":
        mashina.yoq()
    elif buyruq[0] == "tezlash":
        mashina.tezlash(int(buyruq[1]))
    else:
        mashina.toxta()
print(f"Yakuniy tezlik: {mashina.tezlik}")`,
  },
  {
    key: 'backend-dars-26-hard',
    solutionPy: `class Hisob:
    def __init__(self, balans):
        self.balans = balans
    def qoshish(self, summa):
        if summa <= 0:
            print("Xato: summa musbat bo'lishi kerak")
        else:
            self.balans += summa
            print(f"Qo'shildi: {summa}. Balans: {self.balans}")
    def yechish(self, summa):
        if summa <= 0:
            print("Xato: summa musbat bo'lishi kerak")
        elif summa > self.balans:
            print(f"Mablag' yetarli emas. Balans: {self.balans}")
        else:
            self.balans -= summa
            print(f"Yechildi: {summa}. Balans: {self.balans}")
hisob = Hisob(int(input()))
n = int(input())
for i in range(n):
    amal, summa = input().split()
    if amal == "qoshish":
        hisob.qoshish(int(summa))
    else:
        hisob.yechish(int(summa))
print(f"Yakuniy balans: {hisob.balans}")`,
  },
  {
    key: 'backend-dars-27-easy',
    solutionPy: `class Telefon:
    def __init__(self, marka, zaryad):
        self.marka = marka
        self.zaryad = zaryad
    def qongiroq(self):
        if self.zaryad >= 5:
            self.zaryad -= 5
            print(f"{self.marka} jiringlamoqda")
        else:
            print(f"{self.marka} zaryadi yetarli emas")
marka = input()
zaryad = int(input())
n = int(input())
telefon = Telefon(marka, zaryad)
for i in range(n):
    telefon.qongiroq()
print(f"Zaryad: {telefon.zaryad}%")`,
  },
  {
    key: 'backend-dars-27-medium',
    solutionPy: `class Hayvon:
    def __init__(self, nom, tur, yosh):
        self.nom = nom
        self.tur = tur
        self.yosh = yosh
    def __str__(self):
        return f"{self.nom} — {self.tur}, {self.yosh} yoshda"
n = int(input())
hayvonlar = []
for i in range(n):
    nom, tur, yosh = input().split()
    hayvonlar.append(Hayvon(nom, tur, int(yosh)))
for hayvon in hayvonlar:
    print(hayvon)
print(f"Jami: {n} ta hayvon")`,
  },
  {
    key: 'backend-dars-27-hard',
    solutionPy: `class Mahsulot:
    def __init__(self, nom, narx, miqdor):
        self.nom = nom
        self.narx = narx
        self.miqdor = miqdor
    def jami(self):
        return self.narx * self.miqdor
n = int(input())
mahsulotlar = []
for i in range(n):
    nom, narx, miqdor = input().split()
    mahsulotlar.append(Mahsulot(nom, int(narx), int(miqdor)))
tanlangan = 0
for mahsulot in mahsulotlar:
    if mahsulot.jami() >= 100000:
        print(f"{mahsulot.nom}: {mahsulot.jami()} so'm")
        tanlangan += 1
print(f"Tanlangan: {tanlangan} ta")`,
  },
  {
    key: 'backend-dars-28-easy',
    solutionPy: `class Odam:
    def __init__(self, ism, yosh):
        self.ism = ism
        self.yosh = yosh
    def tanishtir(self):
        print(f"Men {self.ism}, {self.yosh} yoshdaman.")
class Talaba(Odam):
    def __init__(self, ism, yosh, guruh):
        super().__init__(ism, yosh)
        self.guruh = guruh
    def tanishtir(self):
        super().tanishtir()
        print(f"Guruhim: {self.guruh}.")
odam = Odam(input(), int(input()))
talaba = Talaba(input(), int(input()), input())
odam.tanishtir()
talaba.tanishtir()`,
  },
  {
    key: 'backend-dars-28-medium',
    solutionPy: `class Hayvon:
    def __init__(self, nom):
        self.nom = nom
    def ovoz(self):
        return "Noaniq ovoz"
class Mushuk(Hayvon):
    def ovoz(self):
        return "Miyov"
class Sher(Mushuk):
    def ovoz(self):
        return "Rrrr"
n = int(input())
for i in range(n):
    tur, nom = input().split()
    if tur == "sher":
        hayvon = Sher(nom)
    elif tur == "mushuk":
        hayvon = Mushuk(nom)
    else:
        hayvon = Hayvon(nom)
    print(f"{hayvon.nom}: {hayvon.ovoz()}")`,
  },
  {
    key: 'backend-dars-28-hard',
    solutionPy: `import math
class Shakl:
    def yuza(self):
        return 0
class Kvadrat(Shakl):
    def __init__(self, tomon):
        self.tomon = tomon
    def yuza(self):
        return self.tomon * self.tomon
class Doira(Shakl):
    def __init__(self, radius):
        self.radius = radius
    def yuza(self):
        return math.pi * self.radius ** 2
n = int(input())
umumiy = 0
for i in range(n):
    tur, olcham = input().split()
    if tur == "kvadrat":
        shakl = Kvadrat(int(olcham))
        print(f"Kvadrat: {shakl.yuza():.2f}")
    else:
        shakl = Doira(int(olcham))
        print(f"Doira: {shakl.yuza():.2f}")
    umumiy += shakl.yuza()
print(f"Umumiy yuza: {umumiy:.2f}")`,
  },
  {
    key: 'backend-dars-29-easy',
    solutionPy: `class Hisob:
    def __init__(self, balans):
        self._balans = balans
    def kirim(self, summa):
        self._balans += summa
        print(f"Kirim: {summa}. Balans: {self._balans}")
    def chiqim(self, summa):
        if summa > self._balans:
            print("Mablag' yetarli emas")
        else:
            self._balans -= summa
            print(f"Chiqim: {summa}. Balans: {self._balans}")
hisob = Hisob(int(input()))
while True:
    qator = input()
    if qator == "yakun":
        break
    amal, summa = qator.split()
    if amal == "kirim":
        hisob.kirim(int(summa))
    else:
        hisob.chiqim(int(summa))
print(f"Yakuniy balans: {hisob._balans}")`,
  },
  {
    key: 'backend-dars-29-medium',
    solutionPy: `class Harorat:
    def __init__(self):
        self._qiymat = 0
    @property
    def qiymat(self):
        return self._qiymat
    @qiymat.setter
    def qiymat(self, yangi):
        if yangi < -273:
            raise ValueError("-273 dan past bo'lishi mumkin emas")
        self._qiymat = yangi
n = int(input())
harorat = Harorat()
for i in range(n):
    yangi = int(input())
    try:
        harorat.qiymat = yangi
        print(f"Harorat: {harorat.qiymat}")
    except ValueError as xato:
        print(f"Xato: {xato}")
print(f"Oxirgi harorat: {harorat.qiymat}")`,
  },
  {
    key: 'backend-dars-29-hard',
    solutionPy: `class Talaba:
    def __init__(self, ism, familiya):
        self.ism = ism
        self.familiya = familiya
    @property
    def toliq_ism(self):
        return f"{self.ism} {self.familiya}"
n = int(input())
talabalar = []
for i in range(n):
    ism, familiya = input().split()
    talabalar.append(Talaba(ism, familiya))
for tartib, talaba in enumerate(talabalar, start=1):
    print(f"{tartib}. {talaba.toliq_ism}")
if talabalar:
    try:
        talabalar[-1].toliq_ism = "Yangi Ism"
    except AttributeError:
        print("Xato: to'liq ismni o'zgartirib bo'lmaydi")`,
  },
  {
    key: 'backend-dars-30-easy',
    solutionPy: `class Nuqta:
    def __init__(self, x, y):
        self.x = x
        self.y = y
    def __str__(self):
        return f"({self.x}, {self.y})"
    def __repr__(self):
        return f"Nuqta(x={self.x}, y={self.y})"
n = int(input())
nuqtalar = []
for i in range(n):
    x, y = input().split()
    nuqtalar.append(Nuqta(int(x), int(y)))
for nuqta in nuqtalar:
    print(nuqta)
print(nuqtalar)`,
  },
  {
    key: 'backend-dars-30-medium',
    solutionPy: `class Hayvon:
    def __init__(self, nom):
        self.nom = nom
    def ovoz(self):
        return "..."
class Mushuk(Hayvon):
    def ovoz(self):
        return "Miyov"
class It(Hayvon):
    def ovoz(self):
        return "Vov"
n = int(input())
mushuklar = 0
itlar = 0
for i in range(n):
    tur, nom = input().split()
    if tur == "mushuk":
        hayvon = Mushuk(nom)
        mushuklar += 1
    elif tur == "it":
        hayvon = It(nom)
        itlar += 1
    else:
        hayvon = Hayvon(nom)
    print(f"{hayvon.nom} deydi: {hayvon.ovoz()}")
print(f"Mushuklar: {mushuklar}, itlar: {itlar}")`,
  },
  {
    key: 'backend-dars-30-hard',
    solutionPy: `class Savat:
    def __init__(self):
        self.mahsulotlar = []
    def qoshish(self, nom):
        self.mahsulotlar.append(nom)
    def __str__(self):
        if not self.mahsulotlar:
            return "bo'sh"
        return ", ".join(self.mahsulotlar)
    def __len__(self):
        return len(self.mahsulotlar)
    def __contains__(self, nom):
        return nom in self.mahsulotlar
n = int(input())
savat = Savat()
for i in range(n):
    savat.qoshish(input())
qidiruv = input()
print(f"Savat: {savat}")
print(f"Elementlar soni: {len(savat)}")
if qidiruv in savat:
    print(f"{qidiruv} bor")
else:
    print(f"{qidiruv} yo'q")`,
  },
  // --- Darslar 31-33: comprehension, generatorlar, dekoratorlar ---
  {
    key: 'backend-dars-31-easy',
    solutionPy: `n = int(input())
royxat = [son for son in range(1, n + 1) if son % 2 == 0]
print(royxat)
print(f"Yig'indi: {sum(royxat)}")`,
  },
  {
    key: 'backend-dars-31-medium',
    solutionPy: `sozlar = input().split()
lugat = {soz: len(soz) for soz in sozlar}
print(lugat)
eng_uzun = sozlar[0]
for soz in sozlar:
    if len(soz) > len(eng_uzun):
        eng_uzun = soz
print(f"Eng uzun: {eng_uzun}")`,
  },
  {
    key: 'backend-dars-31-hard',
    solutionPy: `n = int(input())
qatorlar = [input().split() for i in range(n)]
kvadratlar = [int(x) ** 2 for qator in qatorlar for x in qator if int(x) % 3 == 0]
print(kvadratlar)
print(f"Soni: {len(kvadratlar)}")
print(f"Yig'indi: {sum(kvadratlar)}")`,
  },
  {
    key: 'backend-dars-32-easy',
    solutionPy: `def sonlar(n):
    for son in range(1, n + 1):
        yield son
n = int(input())
print(*sonlar(n))
print(f"Yig'indi: {sum(sonlar(n))}")`,
  },
  {
    key: 'backend-dars-32-medium',
    solutionPy: `def fib(k):
    a = 1
    b = 1
    for i in range(k):
        yield a
        a, b = b, a + b
k = int(input())
hadlar = list(fib(k))
print(*hadlar)
if hadlar:
    print(f"Oxirgi had: {hadlar[-1]}")
else:
    print("Oxirgi had: yo'q")`,
  },
  {
    key: 'backend-dars-32-hard',
    solutionPy: `def qidir(satrlar, soz):
    for tartib, satr in enumerate(satrlar, start=1):
        if soz in satr:
            yield tartib, satr
soz = input()
satrlar = []
while True:
    qator = input()
    if qator == "TUGADI":
        break
    satrlar.append(qator)
topildi = 0
for tartib, satr in qidir(satrlar, soz):
    print(f"{tartib}: {satr}")
    topildi += 1
print(f"Topildi: {topildi} ta")`,
  },
  {
    key: 'backend-dars-33-easy',
    solutionPy: `def log(func):
    def wrapper(*args):
        print(f"Chaqirildi: {func.__name__}")
        natija = func(*args)
        print(f"Natija: {natija}")
        return natija
    return wrapper
@log
def qoshish(a, b):
    return a + b
@log
def kopaytir(a, b):
    return a * b
a, b = input().split()
qoshish(int(a), int(b))
kopaytir(int(a), int(b))`,
  },
  {
    key: 'backend-dars-33-medium',
    solutionPy: `import functools
def bezak(func):
    @functools.wraps(func)
    def wrapper(*args):
        return f"*** {func(*args)} ***"
    return wrapper
@bezak
def salom(ism):
    return f"Salom, {ism}!"
n = int(input())
for i in range(n):
    print(salom(input()))
print(f"Funksiya nomi: {salom.__name__}")`,
  },
  {
    key: 'backend-dars-33-hard',
    solutionPy: `def sanagich(func):
    def wrapper(*args):
        wrapper.hisob += 1
        return func(*args)
    wrapper.hisob = 0
    return wrapper
@sanagich
def salom(ism):
    return f"Salom, {ism}!"
@sanagich
def xayr(ism):
    return f"Xayr, {ism}!"
while True:
    qator = input()
    if qator == "yakun":
        break
    amal, ism = qator.split()
    if amal == "salom":
        print(salom(ism))
    else:
        print(xayr(ism))
print(f"salom: {salom.hisob} marta")
print(f"xayr: {xayr.hisob} marta")`,
  },
  // --- Darslar 34-35: requirements tahlili, PEP 8 ---
  {
    key: 'backend-dars-34-easy',
    solutionPy: `n = int(input())
paketlar = {}
for i in range(n):
    qator = input().strip()
    if qator == "" or qator.startswith("#"):
        continue
    nom, versiya = qator.split("==")
    paketlar[nom.strip().lower()] = versiya.strip()
for nom in sorted(paketlar):
    print(f"{nom}=={paketlar[nom]}")
print(f"Jami: {len(paketlar)}")`,
  },
  {
    key: 'backend-dars-34-medium',
    solutionPy: `n = int(input())
talab = []
for i in range(n):
    nom, versiya = input().split("==")
    talab.append((nom, versiya))
m = int(input())
ornatilgan = {}
for i in range(m):
    nom, versiya = input().split("==")
    ornatilgan[nom] = versiya
muammolar = 0
for nom, kerak in talab:
    if nom not in ornatilgan:
        print(f"{nom}: yo'q")
        muammolar += 1
    elif ornatilgan[nom] != kerak:
        print(f"{nom}: boshqa versiya (kerak {kerak}, o'rnatilgan {ornatilgan[nom]})")
        muammolar += 1
    else:
        print(f"{nom}: OK")
print(f"Muammolar: {muammolar}")`,
  },
  {
    key: 'backend-dars-34-hard',
    solutionPy: `def versiya_royxati(matn):
    return [int(x) for x in matn.split(".")]
def solishtir(a, b):
    uzunlik = max(len(a), len(b))
    a = a + [0] * (uzunlik - len(a))
    b = b + [0] * (uzunlik - len(b))
    return (a > b) - (a < b)
n = int(input())
talab = []
for i in range(n):
    nom, kerak = input().split(">=")
    talab.append((nom, kerak))
m = int(input())
ornatilgan = {}
for i in range(m):
    nom, versiya = input().split("==")
    ornatilgan[nom] = versiya
yangilash = 0
for nom, kerak in talab:
    if nom not in ornatilgan:
        print(f"{nom}: o'rnatilmagan")
        yangilash += 1
    elif solishtir(versiya_royxati(ornatilgan[nom]), versiya_royxati(kerak)) >= 0:
        print(f"{nom}: yaroqli ({ornatilgan[nom]})")
    else:
        print(f"{nom}: eski ({ornatilgan[nom]} < {kerak})")
        yangilash += 1
print(f"Yangilash kerak: {yangilash}")`,
  },
  {
    key: 'backend-dars-35-easy',
    solutionPy: `n = int(input())
for i in range(n):
    nom = input()
    natija = ""
    for tartib, belgi in enumerate(nom):
        if belgi.isupper() and tartib != 0:
            natija += "_"
        natija += belgi
    print(natija.lower())`,
  },
  // --- Darslar 35-36: flake8, type hints, kutubxona tizimi ---
  {
    key: 'backend-dars-35-medium',
    solutionPy: `n = int(input())
xatolar = 0
for tartib in range(1, n + 1):
    qator = input()
    if len(qator) > 79:
        print(f"qator {tartib}: 79 belgidan uzun")
        xatolar += 1
    if "\\t" in qator:
        print(f"qator {tartib}: tab ishlatilgan")
        xatolar += 1
    if qator.endswith(" ") or qator.endswith("\\t"):
        print(f"qator {tartib}: oxirida bo'sh joy")
        xatolar += 1
print(f"Xatolar: {xatolar}")`,
  },
  {
    key: 'backend-dars-35-hard',
    solutionPy: `n = int(input())
toliq_soni = 0
for i in range(n):
    qator = input().strip()
    nom = qator[4:qator.index("(")]
    ichi = qator[qator.index("(") + 1:qator.rindex(")")]
    yetishmaydi = []
    if ichi.strip() != "":
        for param in ichi.split(","):
            if ":" not in param:
                yetishmaydi.append(param.strip())
    if "->" not in qator:
        yetishmaydi.append("qaytish")
    if yetishmaydi:
        print(f"{nom}: yetishmaydi -> " + ", ".join(yetishmaydi))
    else:
        print(f"{nom}: to'liq")
        toliq_soni += 1
print(f"To'liq: {toliq_soni} / {n}")`,
  },
  {
    key: 'backend-dars-36-easy',
    solutionPy: `class Kitob:
    def __init__(self, nom, muallif, yil):
        self.nom = nom
        self.muallif = muallif
        self.yil = yil
    def info(self):
        return f"«{self.nom}» — {self.muallif} ({self.yil})"
n = int(input())
kitoblar = []
for i in range(n):
    nom, muallif, yil = input().split("|")
    kitoblar.append(Kitob(nom, muallif, int(yil)))
for kitob in kitoblar:
    print(kitob.info())
print(f"Jami kitoblar: {n}")`,
  },
  {
    key: 'backend-dars-36-medium',
    solutionPy: `class Kitob:
    def __init__(self, nom, muallif, yil):
        self.nom = nom
        self.muallif = muallif
        self.yil = yil
        self.band = False
n = int(input())
kitoblar = []
for i in range(n):
    nom, muallif, yil = input().split("|")
    kitoblar.append(Kitob(nom, muallif, int(yil)))
m = int(input())
for i in range(m):
    buyruq, argument = input().split(" ", 1)
    if buyruq == "QIDIR":
        topilgan = [k for k in kitoblar if argument.lower() in k.nom.lower()]
        if topilgan:
            for kitob in topilgan:
                print(f"Topildi: {kitob.nom}")
        else:
            print(f"Topilmadi: {argument}")
    else:
        kitob = None
        for k in kitoblar:
            if k.nom == argument:
                kitob = k
                break
        if kitob is None:
            print(f"Kitob yo'q: {argument}")
        elif buyruq == "BAND":
            if kitob.band:
                print(f"Allaqachon band: {argument}")
            else:
                kitob.band = True
                print(f"Band qilindi: {argument}")
        else:
            if not kitob.band:
                print(f"Band emas: {argument}")
            else:
                kitob.band = False
                print(f"Qaytarildi: {argument}")
bosh = 0
for kitob in kitoblar:
    if not kitob.band:
        bosh += 1
print(f"Bo'sh kitoblar: {bosh}")`,
  },
  {
    key: 'backend-dars-36-hard',
    solutionPy: `n = int(input())
mualliflar = {}
onyilliklar = {}
band = 0
for i in range(n):
    nom, muallif, yil, holat = input().split("|")
    mualliflar[muallif] = mualliflar.get(muallif, 0) + 1
    onyillik = int(yil) // 10 * 10
    onyilliklar[onyillik] = onyilliklar.get(onyillik, 0) + 1
    if holat == "band":
        band += 1
print("Mualliflar:")
for muallif, soni in sorted(mualliflar.items(), key=lambda juft: (-juft[1], juft[0])):
    print(f"{muallif} — {soni} ta")
print("O'n yilliklar:")
for onyillik in sorted(onyilliklar):
    print(f"{onyillik}-yillar — {onyilliklar[onyillik]} ta")
print(f"Band: {band} / {n}")`,
  },
  // --- Darslar 37-38: Conventional Commits, merge konflikti ---
  {
    key: 'backend-dars-37-easy',
    solutionPy: `n = int(input())
for i in range(n):
    xabar = input()
    if ": " in xabar:
        tur, tavsif = xabar.split(": ", 1)
        print(f"tur={tur} | tavsif={tavsif}")
    else:
        print("noto'g'ri format")`,
  },
  {
    key: 'backend-dars-37-medium',
    solutionPy: `TURLAR = ["feat", "fix", "docs", "refactor", "test", "chore"]
n = int(input())
togri = 0
for tartib in range(1, n + 1):
    xabar = input()
    xato = None
    if ": " not in xabar:
        xato = "format noto'g'ri"
    else:
        tur, tavsif = xabar.split(": ", 1)
        if tur not in TURLAR:
            xato = "noma'lum tur"
        elif tavsif[:1].isupper():
            xato = "tavsif kichik harf bilan boshlanishi kerak"
        elif tavsif.endswith("."):
            xato = "oxirida nuqta"
        elif len(xabar) > 72:
            xato = "72 belgidan uzun"
    if xato is None:
        print(f"{tartib}: OK")
        togri += 1
    else:
        print(f"{tartib}: XATO — {xato}")
print(f"To'g'ri: {togri} / {n}")`,
  },
  {
    key: 'backend-dars-38-easy',
    solutionPy: `n = int(input())
konfliktlar = 0
toza = 0
for i in range(n):
    qator = input()
    if qator.startswith("<<<<<<<"):
        konfliktlar += 1
    elif qator.startswith("=======") or qator.startswith(">>>>>>>"):
        pass
    else:
        toza += 1
print(f"Konfliktlar: {konfliktlar}")
print(f"Toza qatorlar: {toza}")`,
  },
  {
    key: 'backend-dars-38-medium',
    solutionPy: `tomon = input()
n = int(input())
natija = []
hal = 0
holat = "tashqarida"
for i in range(n):
    qator = input()
    if qator.startswith("<<<<<<<"):
        holat = "mening"
        hal += 1
    elif qator.startswith("=======") and holat != "tashqarida":
        holat = "ularning"
    elif qator.startswith(">>>>>>>") and holat != "tashqarida":
        holat = "tashqarida"
    elif holat == "tashqarida" or holat.upper() == tomon:
        natija.append(qator)
for qator in natija:
    print(qator)
print(f"Hal qilindi: {hal}")`,
  },
  // --- Darslar 46-49: sqlite3, parametrli so'rovlar, URL tahlili ---
  {
    key: 'backend-dars-46-easy',
    solutionPy: `import sqlite3
n = int(input())
conn = sqlite3.connect(":memory:")
conn.execute("CREATE TABLE kitob (id INTEGER PRIMARY KEY, nom TEXT, yil INTEGER)")
for i in range(n):
    kitob_id, nom, yil = input().split(";")
    conn.execute("INSERT INTO kitob VALUES (?, ?, ?)", (int(kitob_id), nom, int(yil)))
for qator in conn.execute("SELECT id, nom, yil FROM kitob ORDER BY id"):
    print("|".join(str(x) for x in qator))
print(f"JAMI: {n}")`,
  },
  {
    key: 'backend-dars-46-medium',
    solutionPy: `import sqlite3
n = int(input())
conn = sqlite3.connect(":memory:")
conn.execute("CREATE TABLE kitob (id INTEGER PRIMARY KEY, nom TEXT, yil INTEGER)")
for i in range(1, n + 1):
    nom, yil = input().split(";")
    conn.execute("INSERT INTO kitob VALUES (?, ?, ?)", (i, nom, int(yil)))
for nom, yil in conn.execute("SELECT nom, yil FROM kitob ORDER BY yil DESC, nom ASC"):
    print(f"{nom} ({yil})")
print(f"Jami: {n} ta kitob")`,
  },
  {
    key: 'backend-dars-46-hard',
    solutionPy: `import sqlite3
import sys
conn = sqlite3.connect(":memory:")
conn.execute("CREATE TABLE mahsulot (id INTEGER PRIMARY KEY, nom TEXT, narx INTEGER)")
for satr in sys.stdin.read().splitlines():
    if satr == "":
        continue
    bolaklar = satr.split(";")
    buyruq = bolaklar[0]
    if buyruq == "QOSH":
        conn.execute("INSERT INTO mahsulot (nom, narx) VALUES (?, ?)", (bolaklar[1], int(bolaklar[2])))
        print(f"QOSHILDI: {bolaklar[1]}")
    elif buyruq == "YANGILA":
        kursor = conn.execute("UPDATE mahsulot SET narx = ? WHERE id = ?", (int(bolaklar[2]), int(bolaklar[1])))
        print(f"YANGILANDI: {bolaklar[1]}" if kursor.rowcount else f"TOPILMADI: {bolaklar[1]}")
    elif buyruq == "OCHIR":
        kursor = conn.execute("DELETE FROM mahsulot WHERE id = ?", (int(bolaklar[1]),))
        print(f"OCHIRILDI: {bolaklar[1]}" if kursor.rowcount else f"TOPILMADI: {bolaklar[1]}")
    else:
        qatorlar = list(conn.execute("SELECT id, nom, narx FROM mahsulot ORDER BY id"))
        if not qatorlar:
            print("BOSH")
        for qator in qatorlar:
            print("|".join(str(x) for x in qator))`,
  },
  {
    key: 'backend-dars-47-easy',
    solutionPy: `import sqlite3
n = int(input())
conn = sqlite3.connect(":memory:")
conn.execute("CREATE TABLE odam (id INTEGER PRIMARY KEY, ism TEXT, shahar TEXT)")
for i in range(1, n + 1):
    ism, shahar = input().split(";")
    conn.execute("INSERT INTO odam VALUES (?, ?, ?)", (i, ism, shahar))
qidiruv = input()
topildi = list(conn.execute("SELECT ism, shahar FROM odam WHERE ism = ? ORDER BY id", (qidiruv,)))
if not topildi:
    print("TOPILMADI")
for ism, shahar in topildi:
    print(f"{ism}|{shahar}")`,
  },
  {
    key: 'backend-dars-47-medium',
    solutionPy: `import sqlite3
n = int(input())
conn = sqlite3.connect(":memory:")
conn.execute("CREATE TABLE foydalanuvchi (id INTEGER PRIMARY KEY, login TEXT, parol TEXT)")
for i in range(1, n + 1):
    login, parol = input().split(";")
    conn.execute("INSERT INTO foydalanuvchi VALUES (?, ?, ?)", (i, login, parol))
kirish_login = input()
kirish_parol = input()
qator = conn.execute("SELECT login FROM foydalanuvchi WHERE login = ? AND parol = ?", (kirish_login, kirish_parol)).fetchone()
if qator:
    print(f"KIRISH: {qator[0]}")
else:
    print("RAD ETILDI")`,
  },
  {
    key: 'backend-dars-47-hard',
    solutionPy: `import sqlite3
n = int(input())
conn = sqlite3.connect(":memory:")
conn.execute("CREATE TABLE odam (id INTEGER PRIMARY KEY, ism TEXT, shahar TEXT)")
for i in range(1, n + 1):
    ism, shahar = input().split(";")
    conn.execute("INSERT INTO odam VALUES (?, ?, ?)", (i, ism, shahar))
m = int(input())
shaharlar = [input() for i in range(m)]
topildi = []
if shaharlar:
    belgilar = ",".join("?" * len(shaharlar))
    topildi = list(conn.execute(f"SELECT ism, shahar FROM odam WHERE shahar IN ({belgilar}) ORDER BY id", shaharlar))
if not topildi:
    print("TOPILMADI")
for ism, shahar in topildi:
    print(f"{ism}|{shahar}")`,
  },
  {
    key: 'backend-dars-49-easy',
    solutionPy: `url = input()
protokol, qolgan = url.split("://", 1)
if "/" in qolgan:
    host, yol = qolgan.split("/", 1)
    manzil = "/" + yol
else:
    host = qolgan
    manzil = "/"
if ":" in host:
    domen, port = host.split(":", 1)
else:
    domen = host
    port = "443" if protokol == "https" else "80"
print(f"Protokol: {protokol}")
print(f"Domen: {domen}")
print(f"Port: {port}")
print(f"Manzil: {manzil}")`,
  },
  // --- Darslar 50-53: HTTP, REST, Django marshrutlash ---
  {
    key: 'backend-dars-50-easy',
    solutionPy: `n = int(input())
xatolar = 0
for i in range(n):
    kod = int(input())
    if 100 <= kod < 200:
        nom = "Axborot"
    elif 200 <= kod < 300:
        nom = "Muvaffaqiyat"
    elif 300 <= kod < 400:
        nom = "Yo'naltirish"
    elif 400 <= kod < 500:
        nom = "Client xatosi"
    elif 500 <= kod < 600:
        nom = "Server xatosi"
    else:
        nom = "Noma'lum"
    if 400 <= kod < 600:
        xatolar += 1
    print(f"{kod} - {nom}")
print(f"Xatolar: {xatolar}")`,
  },
  {
    key: 'backend-dars-50-medium',
    solutionPy: `AMALLAR = {"GET": "O'qish", "POST": "Yaratish", "PUT": "To'liq yangilash", "PATCH": "Qisman yangilash", "DELETE": "O'chirish"}
metod, yol, versiya = input().split(" ")
if "?" in yol:
    resurs, query = yol.split("?", 1)
else:
    resurs = yol
    query = "yo'q"
amal = AMALLAR.get(metod, "Qo'llab-quvvatlanmaydi")
print(f"Metod: {metod}")
print(f"Resurs: {resurs}")
print(f"Query: {query}")
print(f"Amal: {amal}")`,
  },
  {
    key: 'backend-dars-50-hard',
    solutionPy: `import sys
qatorlar = sys.stdin.read().split("\\n")
metod, yol, versiya = qatorlar[0].split(" ")
headerlar = {}
i = 1
while i < len(qatorlar) and qatorlar[i] != "":
    nom, qiymat = qatorlar[i].split(":", 1)
    headerlar[nom.lower()] = qiymat.strip()
    i += 1
tana = "\\n".join(qatorlar[i + 1:]).strip()
if metod not in ["GET", "POST", "PUT", "PATCH", "DELETE"]:
    javob = "405 Method Not Allowed"
elif metod in ["POST", "PUT", "PATCH"] and tana == "":
    javob = "400 Bad Request"
elif metod == "POST":
    javob = "201 Created"
else:
    javob = "200 OK"
host = headerlar.get("host", "yo'q")
print(f"Metod: {metod}")
print(f"Yo'l: {yol}")
print(f"Header soni: {len(headerlar)}")
print(f"Host: {host}")
print(f"Javob: {javob}")`,
  },
  {
    key: 'backend-dars-51-easy',
    solutionPy: `import json
javob = json.loads(input())
print(f"Jami: {javob['count']}")
if not javob["results"]:
    print("Ro'yxat bo'sh")
for element in javob["results"]:
    print(f"#{element['id']} {element['ism']}")`,
  },
  {
    key: 'backend-dars-51-medium',
    solutionPy: `METODLAR = ["GET", "POST", "PUT", "PATCH", "DELETE"]
FELLAR = ["get", "list", "create", "delete", "update", "add", "remove", "edit", "new", "fetch"]
n = int(input())
for i in range(n):
    metod, yol = input().split(" ", 1)
    if metod not in METODLAR:
        sabab = "noma'lum metod"
    elif not yol.startswith("/api/"):
        sabab = "/api/ bilan boshlanmagan"
    else:
        sabab = None
        for bolak in yol.split("/"):
            if bolak.lower() in FELLAR:
                sabab = "URL'da fe'l bor"
                break
    if sabab is None:
        print(f"{metod} {yol} - TO'G'RI")
    else:
        print(f"{metod} {yol} - XATO: {sabab}")`,
  },
  {
    key: 'backend-dars-51-hard',
    solutionPy: `import json
malumot = json.loads(input())
talabalar = malumot["talabalar"]
guruhlar = {}
for talaba in talabalar:
    guruhlar.setdefault(talaba["guruh"], []).append(talaba["ball"])
for guruh in sorted(guruhlar):
    ballar = guruhlar[guruh]
    ortacha = sum(ballar) / len(ballar)
    print(f"{guruh}: {len(ballar)} ta, o'rtacha {ortacha:.1f}")
eng = sorted(talabalar, key=lambda t: (-t["ball"], t["ism"]))[0]
print(f"Eng yuqori: {eng['ism']} ({eng['ball']})")`,
  },
  {
    key: 'backend-dars-53-easy',
    solutionPy: `n = int(input())
naqshlar = []
for i in range(n):
    naqsh, view = input().split(" ")
    naqshlar.append((naqsh, view))
m = int(input())
for i in range(m):
    url = input()
    topildi = "404"
    for naqsh, view in naqshlar:
        if naqsh == url:
            topildi = view
            break
    print(topildi)`,
  },
  {
    key: 'backend-dars-53-medium',
    solutionPy: `def bolaklar(yol):
    return [b for b in yol.split("/") if b != ""]
n = int(input())
naqshlar = []
for i in range(n):
    naqsh, view = input().split(" ")
    naqshlar.append((bolaklar(naqsh), view))
m = int(input())
for i in range(m):
    url_bolaklar = bolaklar(input())
    natija = "404"
    for naqsh, view in naqshlar:
        if len(naqsh) != len(url_bolaklar):
            continue
        args = []
        mos = True
        for shablon, qiymat in zip(naqsh, url_bolaklar):
            if shablon.startswith("<") and shablon.endswith(">"):
                tur, nom = shablon[1:-1].split(":")
                if tur == "int" and not qiymat.isdigit():
                    mos = False
                    break
                args.append(f"{nom}={qiymat}")
            elif shablon != qiymat:
                mos = False
                break
        if mos:
            natija = view + ("(" + ", ".join(args) + ")" if args else "")
            break
    print(natija)`,
  },
  {
    key: 'backend-dars-53-hard',
    solutionPy: `def konvertorlar(naqsh):
    return [b for b in naqsh.split("/") if b.startswith("<") and b.endswith(">")]
n = int(input())
naqshlar = {}
for i in range(n):
    naqsh, nom = input().split(" ")
    naqshlar[nom] = naqsh
m = int(input())
for i in range(m):
    sorov = input().split(" ")
    nom = sorov[0]
    args = sorov[1:]
    if nom not in naqshlar:
        print("XATO: nom topilmadi")
        continue
    naqsh = naqshlar[nom]
    joylar = konvertorlar(naqsh)
    if len(joylar) != len(args):
        print("XATO: argument soni mos emas")
        continue
    natija = naqsh
    xato = False
    for joy, qiymat in zip(joylar, args):
        if joy.startswith("<int:") and not qiymat.isdigit():
            xato = True
            break
        natija = natija.replace(joy, qiymat, 1)
    if xato:
        print("XATO: int emas")
    else:
        print(natija)`,
  },
  // --- Darslar 54-56: query parametrlari, migratsiya SQL, ORM ---
  {
    key: 'backend-dars-54-easy',
    solutionPy: `query = input()
parametrlar = {}
for bolak in query.split("&"):
    if "=" not in bolak:
        continue
    kalit, qiymat = bolak.split("=", 1)
    parametrlar[kalit] = qiymat
n = int(input())
for i in range(n):
    kalit, zaxira = input().split("|")
    qiymat = parametrlar.get(kalit, zaxira)
    if qiymat == "":
        qiymat = zaxira
    print(qiymat)`,
  },
  {
    key: 'backend-dars-55-easy',
    solutionPy: `TURLAR = {"CharField": "varchar(200)", "TextField": "text", "IntegerField": "integer", "BooleanField": "bool", "DateField": "date"}
jadval = input()
n = int(input())
qatorlar = ["    id integer PRIMARY KEY AUTOINCREMENT"]
for i in range(n):
    nom, tur = input().split(" ")
    qatorlar.append(f"    {nom} {TURLAR[tur]} NOT NULL")
print(f"CREATE TABLE {jadval} (")
print(",\\n".join(qatorlar))
print(");")`,
  },
  {
    key: 'backend-dars-55-medium',
    solutionPy: `TURLAR = {"CharField": "varchar(200)", "TextField": "text", "IntegerField": "integer", "BooleanField": "bool", "DateField": "date"}
jadval = input()
n = int(input())
qatorlar = ["    id integer PRIMARY KEY AUTOINCREMENT"]
for i in range(n):
    bolaklar = input().split(" ")
    nom = bolaklar[0]
    tur = bolaklar[1]
    cheklov = "NULL" if "null=True" in bolaklar[2:] else "NOT NULL"
    qatorlar.append(f"    {nom} {TURLAR[tur]} {cheklov}")
print(f"CREATE TABLE {jadval} (")
print(",\\n".join(qatorlar))
print(");")`,
  },
  {
    key: 'backend-dars-55-hard',
    solutionPy: `TURLAR = {"CharField": "varchar(200)", "TextField": "text", "IntegerField": "integer", "BooleanField": "bool", "DateField": "date"}
jadval = input()
n = int(input())
qatorlar = ["    id integer PRIMARY KEY AUTOINCREMENT"]
indekslar = []
for i in range(n):
    bolaklar = input().split(" ")
    nom = bolaklar[0]
    tur = bolaklar[1]
    if tur == "ForeignKey":
        maqsad = bolaklar[2]
        cheklov = "NULL" if "null=True" in bolaklar[3:] else "NOT NULL"
        qatorlar.append(f'    {nom}_id integer {cheklov} REFERENCES "{maqsad}" ("id")')
        indekslar.append(f"CREATE INDEX {jadval}_{nom}_id ON {jadval} ({nom}_id);")
    else:
        cheklov = "NULL" if "null=True" in bolaklar[2:] else "NOT NULL"
        qatorlar.append(f"    {nom} {TURLAR[tur]} {cheklov}")
print(f"CREATE TABLE {jadval} (")
print(",\\n".join(qatorlar))
print(");")
for indeks in indekslar:
    print(indeks)`,
  },
  {
    key: 'backend-dars-56-easy',
    solutionPy: `import json
n = int(input())
yozuvlar = [json.loads(input()) for i in range(n)]
qidiruv = input()
topildi = [y for y in yozuvlar if y["nom"] == qidiruv]
if not topildi:
    print("QuerySet bo'sh")
for y in topildi:
    print(f"{y['id']} {y['nom']} {y['narx']}")`,
  },
  {
    key: 'backend-dars-56-medium',
    solutionPy: `import json
n = int(input())
yozuvlar = [json.loads(input()) for i in range(n)]
amal, ifoda = input().split(" ", 1)
maydon_qism, qiymat = ifoda.split("=", 1)
if "__" in maydon_qism:
    maydon, lookup = maydon_qism.split("__", 1)
else:
    maydon = maydon_qism
    lookup = "exact"
def mos(yozuv):
    hozirgi = yozuv[maydon]
    if lookup == "icontains":
        return qiymat.lower() in str(hozirgi).lower()
    if lookup == "gt":
        return int(hozirgi) > int(qiymat)
    if lookup == "lt":
        return int(hozirgi) < int(qiymat)
    return str(hozirgi) == qiymat
natija = [y for y in yozuvlar if mos(y) == (amal == "filter")]
if not natija:
    print("QuerySet bo'sh")
for y in natija:
    print(y["nom"])`,
  },
  {
    key: 'backend-dars-56-hard',
    solutionPy: `import json
n = int(input())
yozuvlar = [json.loads(input()) for i in range(n)]
m = int(input())
for i in range(m):
    maydon, qiymat = input().split("=", 1)
    topildi = [y for y in yozuvlar if str(y[maydon]) == qiymat]
    if len(topildi) == 0:
        print("DoesNotExist")
    elif len(topildi) > 1:
        print("MultipleObjectsReturned")
    else:
        print(f"Topildi: {topildi[0]['nom']}")`,
  },
  // --- Darslar 58-61: shablon dvigateli, formalar, DRF serializerlari ---
  {
    key: 'backend-dars-58-medium',
    solutionPy: `import json
context = json.loads(input())
n = int(input())
shablon = [input() for i in range(n)]
def toliq(qator, qoshimcha):
    natija = qator
    for kalit in qoshimcha:
        natija = natija.replace("{{ " + kalit + " }}", str(qoshimcha[kalit]))
    for kalit in context:
        natija = natija.replace("{{ " + kalit + " }}", str(context[kalit]))
    while "{{" in natija and "}}" in natija:
        boshi = natija.index("{{")
        oxiri = natija.index("}}", boshi) + 2
        natija = natija[:boshi] + natija[oxiri:]
    return natija
chiqish = []
i = 0
while i < len(shablon):
    qator = shablon[i].strip()
    if qator.startswith("{% for ") and qator.endswith(" %}"):
        bolaklar = qator[7:-3].split(" in ")
        royxat = context.get(bolaklar[1], [])
        tana = []
        i += 1
        while not shablon[i].strip().startswith("{% endfor %}"):
            tana.append(shablon[i])
            i += 1
        for element in royxat:
            for t in tana:
                chiqish.append(toliq(t, {bolaklar[0]: element}))
    else:
        chiqish.append(toliq(shablon[i], {}))
    i += 1
for qator in chiqish:
    print(qator)`,
  },
  {
    key: 'backend-dars-58-hard',
    solutionPy: `b = int(input())
asos = [input() for i in range(b)]
c = int(input())
bola = [input() for i in range(c)]
bloklar = {}
i = 0
while i < len(bola):
    qator = bola[i].strip()
    if qator.startswith("{% block ") and qator.endswith(" %}"):
        nom = qator[9:-3].strip()
        tana = []
        i += 1
        while not bola[i].strip().startswith("{% endblock %}"):
            tana.append(bola[i])
            i += 1
        bloklar[nom] = tana
    i += 1
chiqish = []
i = 0
while i < len(asos):
    qator = asos[i].strip()
    if qator.startswith("{% block ") and qator.endswith(" %}"):
        nom = qator[9:-3].strip()
        asl = []
        i += 1
        while not asos[i].strip().startswith("{% endblock %}"):
            asl.append(asos[i])
            i += 1
        chiqish.extend(bloklar.get(nom, asl))
    else:
        chiqish.append(asos[i])
    i += 1
for qator in chiqish:
    print(qator)`,
  },
  {
    key: 'backend-dars-59-easy',
    solutionPy: `import json
majburiy = json.loads(input())
malumot = json.loads(input())
xatolar = []
for maydon in majburiy:
    qiymat = malumot.get(maydon, "")
    if str(qiymat).strip() == "":
        xatolar.append(maydon)
if xatolar:
    print("is_valid: False")
    for maydon in xatolar:
        print(f"{maydon}: Bu maydon majburiy.")
else:
    print("is_valid: True")`,
  },
  {
    key: 'backend-dars-59-medium',
    solutionPy: `import json
n = int(input())
maydonlar = [input().split(" ") for i in range(n)]
malumot = json.loads(input())
xatolar = []
for bolaklar in maydonlar:
    nom = bolaklar[0]
    tur = bolaklar[1]
    parametrlar = bolaklar[2:]
    eng_katta = None
    eng_kichik = None
    for p in parametrlar:
        if p.startswith("max="):
            eng_katta = int(p[4:])
        if p.startswith("min="):
            eng_kichik = int(p[4:])
    qiymat = malumot.get(nom, "")
    if str(qiymat).strip() == "":
        if "optional" not in parametrlar:
            xatolar.append((nom, "Bu maydon majburiy."))
        continue
    if tur == "int":
        try:
            son = int(str(qiymat))
        except ValueError:
            xatolar.append((nom, "Butun son kiriting."))
            continue
        if (eng_kichik is not None and son < eng_kichik) or (eng_katta is not None and son > eng_katta):
            xatolar.append((nom, f"Qiymat {eng_kichik} va {eng_katta} orasida bo'lishi kerak."))
    elif tur == "email":
        if "@" not in str(qiymat):
            xatolar.append((nom, "To'g'ri email kiriting."))
    elif eng_katta is not None and len(str(qiymat)) > eng_katta:
        xatolar.append((nom, f"Bu maydon {eng_katta} belgidan oshmasligi kerak."))
print("is_valid: True" if not xatolar else "is_valid: False")
for nom, xabar in xatolar:
    print(f"{nom}: {xabar}")`,
  },
  {
    key: 'backend-dars-59-hard',
    solutionPy: `import json
malumot = json.loads(input())
xatolar = []
tozalangan = {}
for maydon in ["parol", "parol2", "yosh"]:
    qiymat = malumot.get(maydon, "")
    if str(qiymat).strip() == "":
        xatolar.append((maydon, "Bu maydon majburiy."))
    else:
        tozalangan[maydon] = qiymat
if "parol" in tozalangan and len(str(tozalangan["parol"])) < 8:
    xatolar.append(("parol", "Parol kamida 8 ta belgidan iborat bo'lsin."))
    del tozalangan["parol"]
if "yosh" in tozalangan:
    try:
        yosh = int(str(tozalangan["yosh"]))
        if yosh < 18:
            xatolar.append(("yosh", "18 yoshdan kichiklar ro'yxatdan o'ta olmaydi."))
            del tozalangan["yosh"]
    except ValueError:
        xatolar.append(("yosh", "Butun son kiriting."))
        del tozalangan["yosh"]
if "parol" in tozalangan and "parol2" in tozalangan and tozalangan["parol"] != tozalangan["parol2"]:
    xatolar.append(("__all__", "Parollar mos kelmadi."))
print("is_valid: True" if not xatolar else "is_valid: False")
for nom, xabar in xatolar:
    print(f"{nom}: {xabar}")`,
  },
  {
    key: 'backend-dars-61-easy',
    solutionPy: `import json
obyekt = json.loads(input())
maydonlar = input().split()
natija = {}
for maydon in maydonlar:
    natija[maydon] = obyekt[maydon]
print(json.dumps(natija, ensure_ascii=False))`,
  },
  {
    key: 'backend-dars-61-medium',
    solutionPy: `import json
n = int(input())
obyektlar = [json.loads(input()) for i in range(n)]
maydonlar = input().split()
natija = []
for obyekt in obyektlar:
    qator = {}
    for maydon in maydonlar:
        if maydon == "nom_uzunligi":
            qator[maydon] = len(obyekt["nom"])
        else:
            qator[maydon] = obyekt[maydon]
    natija.append(qator)
print(json.dumps(natija, ensure_ascii=False))`,
  },
  {
    key: 'backend-dars-61-hard',
    solutionPy: `import json
n = int(input())
maydonlar = [input().split(" ") for i in range(n)]
malumot = json.loads(input())
xatolar = {}
tozalangan = {}
for nom, tur, holat in maydonlar:
    qiymat = malumot.get(nom, "")
    if str(qiymat).strip() == "":
        if holat == "required":
            xatolar[nom] = ["Bu maydon majburiy."]
        continue
    if tur == "int":
        try:
            tozalangan[nom] = int(str(qiymat))
        except ValueError:
            xatolar[nom] = ["Butun son kiriting."]
    else:
        tozalangan[nom] = qiymat
if xatolar:
    print("is_valid: False")
    print(json.dumps(xatolar, ensure_ascii=False))
else:
    print("is_valid: True")
    print(json.dumps(tozalangan, ensure_ascii=False))`,
  },
  // --- Darslar 62-64: API endpointlari, ViewSet, serializer validatsiyasi ---
  {
    key: 'backend-dars-62-hard',
    solutionPy: `n = int(input())
kitoblar = {}
keyingi_id = 1
for i in range(n):
    bolaklar = input().split(" ", 2)
    metod = bolaklar[0]
    yol = bolaklar[1]
    if yol == "/api/kitoblar/":
        if metod == "GET":
            print(f"200 {len(kitoblar)}")
        elif metod == "POST":
            nom = ""
            if len(bolaklar) > 2 and bolaklar[2].startswith("nom="):
                nom = bolaklar[2][4:].strip()
            if nom == "":
                print("400 nom majburiy")
            else:
                kitoblar[keyingi_id] = nom
                keyingi_id += 1
                print(f"201 {nom}")
        else:
            print("405 Method Not Allowed")
    elif yol.startswith("/api/kitoblar/") and yol.endswith("/") and yol[14:-1].isdigit():
        kitob_id = int(yol[14:-1])
        if metod == "GET":
            print(f"200 {kitoblar[kitob_id]}" if kitob_id in kitoblar else "404 Not Found")
        elif metod == "DELETE":
            if kitob_id in kitoblar:
                del kitoblar[kitob_id]
                print("204")
            else:
                print("404 Not Found")
        else:
            print("405 Method Not Allowed")
    else:
        print("404 Not Found")`,
  },
  {
    key: 'backend-dars-63-easy',
    solutionPy: `n = int(input())
for i in range(n):
    prefiks, basename = input().split(" ")
    print(f"/api/{prefiks}/ {basename}-list")
    print(f"/api/{prefiks}/<pk>/ {basename}-detail")`,
  },
  {
    key: 'backend-dars-63-medium',
    solutionPy: `ROYXAT = {"GET": "list", "POST": "create"}
DETAL = {"GET": "retrieve", "PUT": "update", "PATCH": "partial_update", "DELETE": "destroy"}
n = int(input())
for i in range(n):
    metod, yol = input().split(" ")
    if yol == "/api/kitoblar/":
        print(ROYXAT.get(metod, "405"))
    elif yol.startswith("/api/kitoblar/") and yol.endswith("/") and yol[14:-1].isdigit():
        print(DETAL.get(metod, "405"))
    else:
        print("404")`,
  },
  {
    key: 'backend-dars-63-hard',
    solutionPy: `n = int(input())
detalli = []
royxatli = []
for i in range(n):
    url_path, detail = input().split(" ")
    if detail == "true":
        detalli.append(url_path)
    else:
        royxatli.append(url_path)
print("/api/kitoblar/ kitob-list")
print("/api/kitoblar/<pk>/ kitob-detail")
for url_path in sorted(detalli):
    print(f"/api/kitoblar/<pk>/{url_path}/ kitob-{url_path}")
for url_path in sorted(royxatli):
    print(f"/api/kitoblar/{url_path}/ kitob-{url_path}")`,
  },
  {
    key: 'backend-dars-64-easy',
    solutionPy: `n = int(input())
for i in range(n):
    nom, narx = input().split(";")
    nom = nom.strip()
    narx = narx.strip()
    if nom == "":
        print("400 nom")
    elif not narx.isdigit():
        print("400 narx")
    else:
        print(f"201 {nom} {int(narx)}")`,
  },
  {
    key: 'backend-dars-64-medium',
    solutionPy: `n = int(input())
kitoblar = {}
keyingi_id = 1
for i in range(n):
    qator = input()
    if qator == "LIST":
        if not kitoblar:
            print("200 bo'sh")
        else:
            print("200 " + ",".join(f"{k}:{kitoblar[k]}" for k in sorted(kitoblar)))
    elif qator.startswith("CREATE "):
        kitoblar[keyingi_id] = qator[7:]
        print(f"201 {keyingi_id}")
        keyingi_id += 1
    else:
        kitob_id = int(qator[9:])
        print(f"200 {kitoblar[kitob_id]}" if kitob_id in kitoblar else "404")`,
  },
  {
    key: 'backend-dars-64-hard',
    solutionPy: `n = int(input())
for i in range(n):
    nom, narx, yil = input().split("|")
    nom = nom.strip()
    xatolar = []
    if nom == "":
        xatolar.append("nom: bo'sh bo'lmasin")
    elif len(nom) > 50:
        xatolar.append("nom: 50 belgidan oshmasin")
    if not narx.strip().isdigit():
        xatolar.append("narx: butun son bo'lsin")
    elif int(narx) <= 0:
        xatolar.append("narx: musbat bo'lsin")
    if not yil.strip().isdigit():
        xatolar.append("yil: butun son bo'lsin")
    elif not 1900 <= int(yil) <= 2026:
        xatolar.append("yil: 1900-2026 oralig'ida bo'lsin")
    if xatolar:
        print("400")
        for xato in xatolar:
            print(xato)
    else:
        print(f"201 {nom}")`,
  },
];
