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
];
