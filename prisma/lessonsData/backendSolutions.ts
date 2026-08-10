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
];
