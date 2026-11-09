export default {
  id: 'm5',
  title: 'NumPy',
  lessons: [
    {
      id: 'l5-1',
      title: 'NumPy масиви',
      theory: `<p>NumPy: фундаментальна бібліотека для роботи з числовими масивами. Швидша за списки в 10-100 разів.</p>
<p>Створення: <code>np.array([1,2,3])</code>, <code>np.zeros(5)</code>, <code>np.ones((3,3))</code>, <code>np.arange(10)</code>, <code>np.linspace(0, 1, 5)</code>.</p>
<p>Векторизовані операції: <code>arr * 2</code>, <code>arr + arr2</code> працюють поелементно.</p>
<p>Тут Python працює в браузері (WebAssembly, 32 біти), тому цілочисельні масиви за замовчуванням мають тип <code>int32</code>. На звичайному 64-бітному комп'ютері той самий код покаже <code>int64</code>.</p>`,
      examples: [
        {
          code: `import numpy as np

arr = np.array([1, 2, 3, 4, 5])
print(arr)
print(arr.shape)
print(arr.dtype)

print(arr * 2)
print(arr ** 2)
print(arr + 100)`,
          output: `[1 2 3 4 5]
(5,)
int32
[ 2  4  6  8 10]
[ 1  4  9 16 25]
[101 102 103 104 105]`,
        },
        {
          code: `import numpy as np

zeros = np.zeros(5)
ones = np.ones((2, 3))
range_arr = np.arange(0, 10, 2)
linspace = np.linspace(0, 1, 5)

print(zeros)
print(ones)
print(range_arr)
print(linspace)`,
          output: `[0. 0. 0. 0. 0.]
[[1. 1. 1.]
 [1. 1. 1.]]
[0 2 4 6 8]
[0.   0.25 0.5  0.75 1.  ]`,
        },
        {
          code: `import numpy as np

arr = np.array([10, 25, 8, 47, 13, 35, 19])
print("sum:", arr.sum())
print("mean:", arr.mean())
print("max:", arr.max())
print("min:", arr.min())
print("std:", round(arr.std(), 2))
print("median:", np.median(arr))`,
          output: `sum: 157
mean: 22.428571428571427
max: 47
min: 8
std: 13.26
median: 19.0`,
        },
        {
          code: `import numpy as np

arr = np.array([10, 25, 8, 47, 13, 35, 19])
mask = arr > 20
print(mask)
print(arr[mask])
print(arr[(arr > 10) & (arr < 30)])`,
          output: `[False  True False  True False  True False]
[25 47 35]
[25 13 19]`,
        },
      ],
      exercises: [
        {
          task: 'Створи numpy-масив з чисел 1..10 (через arange). Виведи його.',
          starter: `import numpy as np
# твій код
`,
          expected: '[ 1  2  3  4  5  6  7  8  9 10]',
          solution: `import numpy as np
print(np.arange(1, 11))`,
        },
        {
          task: 'Дано <code>np.array([1, 2, 3, 4, 5])</code>. Помнож на 3 і додай 10. Виведи результат.',
          starter: `import numpy as np
arr = np.array([1, 2, 3, 4, 5])
# твій код
`,
          expected: '[13 16 19 22 25]',
          solution: `import numpy as np
arr = np.array([1, 2, 3, 4, 5])
print(arr * 3 + 10)`,
        },
        {
          task: 'З масиву <code>[15, 8, 23, 4, 17, 30, 11]</code> виведи середнє та максимум через пробіл.',
          starter: `import numpy as np
arr = np.array([15, 8, 23, 4, 17, 30, 11])
# твій код
`,
          expected: '15.428571428571429 30',
          solution: `import numpy as np
arr = np.array([15, 8, 23, 4, 17, 30, 11])
print(arr.mean(), arr.max())`,
        },
        {
          task: 'З <code>[5, 12, 8, 21, 3, 17, 9, 25]</code> виведи тільки елементи > 10.',
          starter: `import numpy as np
arr = np.array([5, 12, 8, 21, 3, 17, 9, 25])
# твій код
`,
          expected: '[12 21 17 25]',
          solution: `import numpy as np
arr = np.array([5, 12, 8, 21, 3, 17, 9, 25])
print(arr[arr > 10])`,
        },
        {
          task: 'Дано <code>np.array([2, 4, 6, 8, 10])</code>. Знайди суму квадратів цих чисел.',
          starter: `import numpy as np
arr = np.array([2, 4, 6, 8, 10])
# твій код
`,
          expected: '220',
          solution: `import numpy as np
arr = np.array([2, 4, 6, 8, 10])
print((arr ** 2).sum())`,
        },
        {
          task: 'Створи масив зі 100 рівномірно розподілених чисел від 0 до 10. Виведи третій елемент (індекс 2).',
          starter: `import numpy as np
# твій код
`,
          expected: '0.20202020202020202',
          solution: `import numpy as np
print(np.linspace(0, 10, 100)[2])`,
        },
        {
          task: 'З масиву <code>[10, 20, 30, 40, 50]</code> заміни всі значення > 25 на 0. Виведи результат.',
          starter: `import numpy as np
arr = np.array([10, 20, 30, 40, 50])
# твій код
`,
          expected: '[10 20  0  0  0]',
          solution: `import numpy as np
arr = np.array([10, 20, 30, 40, 50])
arr[arr > 25] = 0
print(arr)`,
        },
      ],
    },
    {
      id: 'l5-2',
      title: 'Індексація, маски і np.where',
      theory: `<p><strong>Булева маска</strong>: порівняння масиву з числом дає масив <code>True</code>/<code>False</code> тієї ж довжини. <code>arr[mask]</code> лишає лише елементи, де стоїть <code>True</code>. Умови поєднують через <code>&amp;</code> (і), <code>|</code> (або), <code>~</code> (не), кожну умову беруть у дужки: <code>arr[(arr &gt; 10) &amp; (arr &lt; 50)]</code>.</p>
<p><strong>Підрахунок за умовою</strong>: <code>True</code> рахується як 1, тому <code>(arr &gt; 100).sum()</code> дає кількість, а <code>(arr &gt; 100).mean()</code> дає частку таких елементів.</p>
<p><strong>Вибір за списком індексів</strong>: <code>arr[[0, 3, 4]]</code> повертає елементи на цих позиціях у вказаному порядку. <code>np.where(умова)</code> з одним аргументом повертає позиції, де умова істинна (кортеж, тож беремо <code>[0]</code>).</p>
<p><strong>np.where(умова, a, b)</strong> будує новий масив: де умова істинна, береться <code>a</code>, інакше <code>b</code>. <code>a</code> і <code>b</code> можуть бути числами або масивами тієї ж довжини. <code>np.clip(arr, низ, верх)</code> обрізає значення до меж. Збій можна позначити як <code>np.nan</code> і рахувати без нього: <code>np.nanmean</code>, <code>np.nansum</code>.</p>
<p><strong>Сортування</strong>: <code>np.sort(arr)</code> повертає відсортовану копію, <code>arr.argsort()</code> повертає індекси, у порядку яких масив був би відсортований. Через них сортують інший масив тієї ж довжини (наприклад, назви за продажами), а <code>[::-1]</code> перевертає порядок на спадний.</p>`,
      examples: [
        {
          code: `import numpy as np

orders = np.array([12, 0, 35, 8, 0, 41, 19, 27])
mask = orders > 15
print(mask)
print(orders[mask])
print("днів понад 15:", mask.sum())
print("частка днів без замовлень:", (orders == 0).mean())
print(orders[(orders > 0) & (orders < 20)])`,
          output: `[False False  True False False  True  True  True]
[35 41 19 27]
днів понад 15: 4
частка днів без замовлень: 0.25
[12  8 19]`,
        },
        {
          code: `import numpy as np

sales = np.array([820, 1340, 560, 2100, 990, 1750])
print(sales[[0, 2, 4]])
print(sales[-1], sales[-2])

big = np.where(sales > 1000)[0]
print("позиції днів понад 1000:", big)
print(np.where(sales >= 1000, "план", "нижче"))`,
          output: `[820 560 990]
1750 990
позиції днів понад 1000: [1 3 5]
['нижче' 'план' 'нижче' 'план' 'нижче' 'план']`,
        },
        {
          code: `import numpy as np

# показання датчика: від'ємні значення і 999 означають збій
temp = np.array([18.5, -40.0, 21.2, 999.0, 19.8, 23.1])
print(np.clip(temp, 0, 40))

fixed = np.where((temp < -30) | (temp > 60), np.nan, temp)
print(fixed)
print("середня без збоїв:", np.nanmean(fixed))`,
          output: `[18.5  0.  21.2 40.  19.8 23.1]
[18.5  nan 21.2  nan 19.8 23.1]
середня без збоїв: 20.65`,
        },
        {
          code: `import numpy as np

names = np.array(["Ірина", "Богдан", "Оксана", "Тарас", "Леся"])
sales = np.array([420, 615, 380, 590, 702])

print(np.sort(sales))
order = sales.argsort()
print(order)
print(names[order])
top3 = names[order[::-1][:3]]
print("топ-3:", top3.tolist())`,
          output: `[380 420 590 615 702]
[2 0 3 1 4]
['Оксана' 'Ірина' 'Тарас' 'Богдан' 'Леся']
топ-3: ['Леся', 'Богдан', 'Тарас']`,
        },
      ],
      exercises: [
        {
          task: 'Дано щоденні продажі <code>sales</code>. Виведи, скільки днів продажі були більші за 1000.',
          starter: `import numpy as np
sales = np.array([950, 1200, 870, 1430, 1010, 640, 1580, 990, 1120])
# твій код
`,
          solution: `import numpy as np
sales = np.array([950, 1200, 870, 1430, 1010, 640, 1580, 990, 1120])
print((sales > 1000).sum())`,
          expected: `5`,
          hint: 'Порівняння дає масив True/False, а True при додаванні рахується як 1.',
        },
        {
          task: 'З масиву <code>prices</code> виведи елементи на позиціях 1, 4 і 6 (саме в такому порядку) одним масивом.',
          starter: `import numpy as np
prices = np.array([120, 85, 240, 99, 310, 150, 64, 199])
# твій код
`,
          solution: `import numpy as np
prices = np.array([120, 85, 240, 99, 310, 150, 64, 199])
print(prices[[1, 4, 6]])`,
          expected: `[ 85 310  64]`,
          hint: 'У квадратні дужки можна передати список індексів.',
        },
        {
          task: 'Менеджер отримує бонус 5% від продажів у місяці, де продажі не менші за план, інакше 0. Створи масив <code>bonus</code> через <code>np.where</code> і виведи його.',
          starter: `import numpy as np
sales = np.array([48000, 61000, 55000, 39000, 72000, 50000])
plan = np.array([50000, 55000, 55000, 45000, 60000, 52000])
# bonus = ...
`,
          solution: `import numpy as np
sales = np.array([48000, 61000, 55000, 39000, 72000, 50000])
plan = np.array([50000, 55000, 55000, 45000, 60000, 52000])
bonus = np.where(sales >= plan, sales * 0.05, 0)
print(bonus)`,
          check: `import numpy as np
bonus = need("bonus", np.ndarray)
s = np.array([48000, 61000, 55000, 39000, 72000, 50000])
p = np.array([50000, 55000, 55000, 45000, 60000, 52000])
want = [x * 0.05 if x >= y else 0.0 for x, y in zip(s.tolist(), p.tolist())]
expect(bonus.shape == (6,), f"У bonus має бути 6 значень, а зараз форма {bonus.shape}")
expect(all(approx(a, b) for a, b in zip(bonus.tolist(), want)), f"Очікувались бонуси {want}")`,
          hint: 'np.where(умова, значення_якщо_так, значення_якщо_ні); умова тут sales >= plan.',
        },
        {
          task: 'Датчик вологості інколи видає значення поза фізичними межами 0-100. Обріж масив <code>humidity</code> до меж 0 і 100 і збережи в ту саму змінну. Виведи результат.',
          starter: `import numpy as np
humidity = np.array([45.2, 101.5, 38.0, -3.1, 77.4, 120.0, 0.0])
# твій код
`,
          solution: `import numpy as np
humidity = np.array([45.2, 101.5, 38.0, -3.1, 77.4, 120.0, 0.0])
humidity = np.clip(humidity, 0, 100)
print(humidity)`,
          check: `import numpy as np
h = need("humidity", np.ndarray)
raw = [45.2, 101.5, 38.0, -3.1, 77.4, 120.0, 0.0]
want = [min(max(x, 0.0), 100.0) for x in raw]
expect(h.shape == (7,), "У humidity має лишитись 7 значень")
expect(all(approx(a, b) for a, b in zip(h.tolist(), want)), f"Очікувались значення {want}")`,
          hint: 'np.clip(масив, нижня_межа, верхня_межа) повертає новий масив; присвой його назад.',
        },
        {
          task: 'Виведи список імен трьох менеджерів з найбільшими продажами, від більшого до меншого, як звичайний список Python (<code>.tolist()</code>).',
          starter: `import numpy as np
names = np.array(["Марта", "Андрій", "Софія", "Денис", "Галина", "Роман"])
sales = np.array([310, 455, 298, 520, 470, 365])
# твій код
`,
          solution: `import numpy as np
names = np.array(["Марта", "Андрій", "Софія", "Денис", "Галина", "Роман"])
sales = np.array([310, 455, 298, 520, 470, 365])
order = sales.argsort()[::-1]
print(names[order[:3]].tolist())`,
          expected: `['Денис', 'Галина', 'Андрій']`,
          hint: 'argsort дає індекси за зростанням; переверни їх через [::-1] і візьми перші три.',
        },
        {
          task: 'У чеках <code>checks</code> трапляються помилкові суми, більші за 5 медіан. Заміни такі суми на медіану масиву (масив <code>fixed</code>), а потім виведи середній чек <code>fixed</code>, округлений до 2 знаків через <code>round</code>.',
          starter: `import numpy as np
checks = np.array([240, 315, 180, 29500, 410, 275, 198, 360, 18800, 305])
# fixed = ...
`,
          solution: `import numpy as np
checks = np.array([240, 315, 180, 29500, 410, 275, 198, 360, 18800, 305])
med = np.median(checks)
fixed = np.where(checks > 5 * med, med, checks)
print(round(fixed.mean(), 2))`,
          check: `import numpy as np
fixed = need("fixed", np.ndarray)
raw = sorted([240, 315, 180, 29500, 410, 275, 198, 360, 18800, 305])
med = (raw[4] + raw[5]) / 2
want = [med if x > 5 * med else x for x in [240, 315, 180, 29500, 410, 275, 198, 360, 18800, 305]]
expect(len(fixed) == 10, "У fixed має бути 10 чеків, як і в checks: заміни значення, а не видаляй")
expect(all(approx(a, b) for a, b in zip(fixed.tolist(), want)), "Суми понад 5 медіан мають стати медіаною, решта лишитись як є")`,
          expected: `290.3`,
          hint: 'Спершу порахуй med = np.median(checks), потім np.where(checks > 5 * med, med, checks).',
        },
      ],
    },
    {
      id: 'l5-3',
      title: 'Двовимірні масиви і осі',
      theory: `<p><strong>Двовимірний масив</strong>: таблиця з рядків і стовпців. <code>m.shape</code> дає кортеж <code>(рядки, стовпці)</code>. <code>arr.reshape(4, 3)</code> перекладає одновимірний масив у таблицю 4 на 3 (кількість елементів має збігтися), а <code>-1</code> замість одного з чисел просить NumPy порахувати його самому.</p>
<p><strong>Індексація</strong>: <code>m[1, 2]</code> дає елемент у рядку 1, стовпці 2; <code>m[0]</code> дає весь рядок, <code>m[:, 0]</code> дає весь стовпець.</p>
<p><strong>Осі</strong>: <code>m.sum(axis=0)</code> згортає рядки і дає підсумок для кожного стовпця, <code>m.sum(axis=1)</code> згортає стовпці і дає підсумок для кожного рядка. Простіше запам'ятати так: вказана вісь зникає з форми. Те саме працює для <code>mean</code>, <code>max</code>, <code>min</code>, <code>argmax</code>.</p>
<p><strong>Broadcasting</strong>: операція між масивами різної форми, коли одна з осей має довжину 1. <code>m / m.sum(axis=1, keepdims=True)</code> ділить кожен рядок на його суму і дає частки; <code>keepdims=True</code> лишає форму <code>(рядки, 1)</code>, тож ділення йде рядок за рядком. <code>m - m.mean(axis=0)</code> віднімає від кожного стовпця його середнє.</p>
<p><code>np.round(m, 2)</code> округлює весь масив. <code>np.percentile(arr, 90)</code> дає значення, нижче за яке лежить 90% даних; можна передати список <code>[25, 50, 75]</code> і вісь <code>axis</code>.</p>`,
      examples: [
        {
          code: `import numpy as np

monthly = np.array([310, 290, 340, 360, 410, 395, 450, 470, 430, 380, 350, 520])
q = monthly.reshape(4, 3)
print(q)
print(q.shape)
print("за кварталами:", q.sum(axis=1))
print("1-й місяць кварталу:", q[:, 0])
print(monthly.reshape(-1, 6).shape)`,
          output: `[[310 290 340]
 [360 410 395]
 [450 470 430]
 [380 350 520]]
(4, 3)
за кварталами: [ 940 1165 1350 1250]
1-й місяць кварталу: [310 360 450 380]
(2, 6)`,
        },
        {
          code: `import numpy as np

# рядки: магазини, стовпці: січень, лютий, березень
m = np.array([
    [120, 135, 150],
    [ 90,  80, 110],
    [200, 210, 190],
])
print("сума по стовпцях:", m.sum(axis=0))
print("сума по рядках:", m.sum(axis=1))
print("середнє по магазину:", np.round(m.mean(axis=1), 1))
print("найкращий місяць кожного магазину:", m.argmax(axis=1))
print("загалом:", m.sum())`,
          output: `сума по стовпцях: [410 425 450]
сума по рядках: [405 280 600]
середнє по магазину: [135.   93.3 200. ]
найкращий місяць кожного магазину: [2 2 1]
загалом: 1285`,
        },
        {
          code: `import numpy as np

m = np.array([
    [120, 135, 150],
    [ 90,  80, 110],
    [200, 210, 190],
])
totals = m.sum(axis=1, keepdims=True)
print(totals.shape)
share = m / totals * 100
print(np.round(share, 1))
print(np.round(share.sum(axis=1), 1))`,
          output: `(3, 1)
[[29.6 33.3 37. ]
 [32.1 28.6 39.3]
 [33.3 35.  31.7]]
[100. 100. 100.]`,
        },
        {
          code: `import numpy as np

checks = np.array([180, 240, 95, 310, 275, 420, 150, 1300, 205, 260])
print(np.percentile(checks, 50))
print(np.percentile(checks, [25, 75]))
print("90-й перцентиль:", np.round(np.percentile(checks, 90), 1))`,
          output: `250.0
[186.25 301.25]
90-й перцентиль: 508.0`,
        },
      ],
      exercises: [
        {
          task: 'Перетвори <code>np.arange(1, 13)</code> на масив 3 рядки на 4 стовпці і виведи його.',
          starter: `import numpy as np
arr = np.arange(1, 13)
# твій код
`,
          solution: `import numpy as np
arr = np.arange(1, 13)
print(arr.reshape(3, 4))`,
          expected: `[[ 1  2  3  4]
 [ 5  6  7  8]
 [ 9 10 11 12]]`,
          hint: 'reshape(рядки, стовпці).',
        },
        {
          task: 'У <code>visits</code> рядки: філії, стовпці: дні тижня. Виведи загальну кількість відвідувань кожної філії (одним масивом).',
          starter: `import numpy as np
visits = np.array([
    [34, 41, 38, 45, 52, 60, 28],
    [21, 19, 25, 23, 30, 41, 17],
    [55, 58, 61, 57, 70, 82, 49],
])
# твій код
`,
          solution: `import numpy as np
visits = np.array([
    [34, 41, 38, 45, 52, 60, 28],
    [21, 19, 25, 23, 30, 41, 17],
    [55, 58, 61, 57, 70, 82, 49],
])
print(visits.sum(axis=1))`,
          expected: `[298 176 432]`,
          hint: 'Підсумок для кожного рядка: вісь стовпців зникає, тобто axis=1.',
        },
        {
          task: 'Для тих самих даних виведи номер дня тижня (індекс стовпця), у який сумарно по всіх філіях було найбільше відвідувань.',
          starter: `import numpy as np
visits = np.array([
    [34, 41, 38, 45, 52, 60, 28],
    [21, 19, 25, 23, 30, 41, 17],
    [55, 58, 61, 57, 70, 82, 49],
])
# твій код
`,
          solution: `import numpy as np
visits = np.array([
    [34, 41, 38, 45, 52, 60, 28],
    [21, 19, 25, 23, 30, 41, 17],
    [55, 58, 61, 57, 70, 82, 49],
])
print(visits.sum(axis=0).argmax())`,
          expected: `5`,
          hint: 'Спершу сума по стовпцях (axis=0), потім argmax.',
        },
        {
          task: 'У <code>costs</code> рядки: проєкти, стовпці: статті витрат. Створи масив <code>share</code>: частку кожної статті у витратах свого проєкту (кожен рядок у сумі дає 1), округлену до 3 знаків. Виведи <code>share</code>.',
          starter: `import numpy as np
costs = np.array([
    [400, 250, 350],
    [120, 600, 280],
    [500, 500, 1000],
])
# share = ...
`,
          solution: `import numpy as np
costs = np.array([
    [400, 250, 350],
    [120, 600, 280],
    [500, 500, 1000],
])
share = np.round(costs / costs.sum(axis=1, keepdims=True), 3)
print(share)`,
          check: `import numpy as np
share = need("share", np.ndarray)
rows = [[400, 250, 350], [120, 600, 280], [500, 500, 1000]]
expect(share.shape == (3, 3), f"share має бути форми (3, 3), а зараз {share.shape}")
for i, row in enumerate(rows):
    for j, v in enumerate(row):
        want = round(v / sum(row), 3)
        expect(approx(share[i, j], want, tol=1e-9), f"У рядку {i} стовпці {j} очікувалось {want}, а зараз {share[i, j]}: ділити треба на суму рядка")`,
          hint: 'costs.sum(axis=1, keepdims=True) дає суми рядків у формі (3, 1), на них і ділимо.',
        },
        {
          task: 'Оцінки трьох тестів (стовпці) для п\'яти учнів (рядки). Створи <code>centered</code>: кожна оцінка мінус середнє свого тесту. Виведи <code>np.round(centered, 1)</code>.',
          starter: `import numpy as np
scores = np.array([
    [72, 85, 64],
    [90, 78, 88],
    [65, 92, 70],
    [81, 69, 75],
    [77, 88, 83],
])
# centered = ...
`,
          solution: `import numpy as np
scores = np.array([
    [72, 85, 64],
    [90, 78, 88],
    [65, 92, 70],
    [81, 69, 75],
    [77, 88, 83],
])
centered = scores - scores.mean(axis=0)
print(np.round(centered, 1))`,
          check: `import numpy as np
c = need("centered", np.ndarray)
rows = [[72, 85, 64], [90, 78, 88], [65, 92, 70], [81, 69, 75], [77, 88, 83]]
expect(c.shape == (5, 3), f"centered має бути форми (5, 3), а зараз {c.shape}")
for j in range(3):
    col_mean = sum(r[j] for r in rows) / 5
    for i in range(5):
        expect(approx(c[i, j], rows[i][j] - col_mean), f"Учень {i}, тест {j}: очікувалось {rows[i][j] - col_mean}. Віднімати треба середнє стовпця")`,
          expected: `[[ -5.    2.6 -12. ]
 [ 13.   -4.4  12. ]
 [-12.    9.6  -6. ]
 [  4.  -13.4  -1. ]
 [  0.    5.6   7. ]]`,
          hint: 'scores.mean(axis=0) дає 3 середніх, по одному на тест; віднімання розтягнеться на всі рядки.',
        },
        {
          task: 'Вважай «піковою» годину, коли навантаження вище за 75-й перцентиль усієї таблиці <code>load</code> (рядки: сервери, стовпці: години). Виведи, скільки пікових годин у кожного сервера, одним масивом.',
          starter: `import numpy as np
load = np.array([
    [35, 42, 58, 71, 66, 40],
    [22, 30, 45, 88, 93, 51],
    [60, 64, 70, 75, 69, 62],
    [15, 18, 25, 33, 29, 20],
])
# твій код
`,
          solution: `import numpy as np
load = np.array([
    [35, 42, 58, 71, 66, 40],
    [22, 30, 45, 88, 93, 51],
    [60, 64, 70, 75, 69, 62],
    [15, 18, 25, 33, 29, 20],
])
p75 = np.percentile(load, 75)
print((load > p75).sum(axis=1))`,
          expected: `[1 2 3 0]`,
          hint: 'np.percentile без axis рахує по всій таблиці; маска load > p75 має ту ж форму, далі sum(axis=1).',
        },
      ],
    },
  ],
};
