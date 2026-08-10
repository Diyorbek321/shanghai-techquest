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
];
