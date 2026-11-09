export default {
  id: 'm9',
  title: 'Візуалізація',
  lessons: [
    {
      id: 'l9-1',
      title: 'Перший графік: лінія і стовпці',
      theory: `<p>Графіки в Python малює <strong>matplotlib</strong>: <code>import matplotlib.pyplot as plt</code>. Кожна команда <code>plt.*</code> домальовує щось на поточний графік, <code>plt.show()</code> показує результат. У тренажері картинка з'являється під кодом.</p>
<p><code>plt.plot(x, y)</code> малює <strong>лінію</strong>: для зміни в часі, коли точки йдуть по порядку і проміжки між ними щось означають. <code>marker="o"</code> позначає самі точки. <code>plt.bar(categories, values)</code> малює <strong>стовпці</strong>: для порівняння окремих категорій (міста, товари, канали). Для довгих назв зручніші горизонтальні стовпці <code>plt.barh(categories, values)</code>.</p>
<p>Підписи: <code>plt.title("Виручка за місяць, тис. грн")</code>, <code>plt.xlabel(...)</code>, <code>plt.ylabel(...)</code>. Одиниці пишуть у назві чи підписі осі один раз, а не біля кожного числа. Графік без одиниць змушує вгадувати, гривні це чи штуки.</p>
<p>Стовпці завжди від нуля: висота стовпця і є значення, обрізана вісь робить різницю 5% схожою на двократну. matplotlib сам починає стовпці з нуля, не ламай це через <code>plt.ylim</code>.</p>
<p>Категорії сортують перед показом: від більшого до меншого в <code>bar</code>; у <code>barh</code> перша категорія малюється внизу, тож для «найбільший зверху» сортують за зростанням. Порядок спершу задають у даних (<code>sorted</code>, <code>sort_values</code>), а потім малюють.</p>`,
      examples: [
        {
          code: `import matplotlib.pyplot as plt

months = ["січ", "лют", "бер", "кві", "тра", "чер"]
revenue = [410, 445, 430, 490, 520, 560]

plt.plot(months, revenue, marker="o")
plt.title("Виручка за місяць, тис. грн")
plt.xlabel("Місяць")
plt.show()`,
          output: ``,
          images: true,
        },
        {
          code: `import matplotlib.pyplot as plt

sales = {"Львів": 310, "Київ": 540, "Одеса": 260, "Дніпро": 295}
pairs = sorted(sales.items(), key=lambda kv: kv[1], reverse=True)
cities = [c for c, v in pairs]
values = [v for c, v in pairs]
print(cities)

plt.bar(cities, values)
plt.title("Продажі за містами, тис. грн")
plt.show()`,
          output: `['Київ', 'Львів', 'Дніпро', 'Одеса']`,
          images: true,
        },
        {
          code: `import matplotlib.pyplot as plt

categories = ["Заморожені продукти", "Напої", "Молочні продукти", "Бакалія"]
share = [8, 31, 24, 19]
pairs = sorted(zip(share, categories))

plt.barh([c for s, c in pairs], [s for s, c in pairs])
plt.title("Частка в обороті, %")
plt.show()`,
          output: ``,
          images: true,
        },
      ],
      exercises: [
        {
          task: 'Намалюй лінію виручки за місяцями і дай графіку назву <code>"Виручка за місяць, тис. грн"</code>.',
          starter: `import matplotlib.pyplot as plt
months = ["лип", "сер", "вер", "жов", "лис", "гру"]
revenue = [380, 365, 420, 455, 470, 610]
# твій код
`,
          solution: `import matplotlib.pyplot as plt
months = ["лип", "сер", "вер", "жов", "лис", "гру"]
revenue = [380, 365, 420, 455, 470, 610]
plt.plot(months, revenue)
plt.title("Виручка за місяць, тис. грн")
plt.show()`,
          check: `figs = figures()
expect(len(figs) == 1, f"Має бути один графік, а зараз {len(figs)}")
ax = figs[0].axes[0]
lines = ax.get_lines()
expect(len(lines) == 1, f"На графіку має бути одна лінія, а зараз {len(lines)}")
ys = list(lines[0].get_ydata())
expect(len(ys) == 6 and all(approx(a, b) for a, b in zip(ys, [380, 365, 420, 455, 470, 610])), "Лінія має проходити через значення revenue")
expect(ax.get_title() == "Виручка за місяць, тис. грн", f"Назва графіка має бути «Виручка за місяць, тис. грн», а зараз «{ax.get_title()}»")`,
          hint: 'plt.plot(months, revenue), потім plt.title(...).',
        },
        {
          task: 'Намалюй стовпці продажів за каналами. Назва <code>"Продажі за каналами, тис. грн"</code>, підпис осі X <code>"Канал"</code>.',
          starter: `import matplotlib.pyplot as plt
channels = ["Сайт", "Магазини", "Маркетплейс"]
sales = [820, 640, 310]
# твій код
`,
          solution: `import matplotlib.pyplot as plt
channels = ["Сайт", "Магазини", "Маркетплейс"]
sales = [820, 640, 310]
plt.bar(channels, sales)
plt.title("Продажі за каналами, тис. грн")
plt.xlabel("Канал")
plt.show()`,
          check: `figs = figures()
expect(len(figs) == 1, f"Має бути один графік, а зараз {len(figs)}")
ax = figs[0].axes[0]
heights = [p.get_height() for p in ax.patches]
expect(len(heights) == 3, f"Має бути 3 стовпці, а зараз {len(heights)}")
expect(all(approx(a, b) for a, b in zip(heights, [820, 640, 310])), "Висоти стовпців мають дорівнювати sales")
expect(ax.get_title() == "Продажі за каналами, тис. грн", "Назва графіка має бути «Продажі за каналами, тис. грн»")
expect(ax.get_xlabel() == "Канал", "Підпис осі X має бути «Канал»")`,
          hint: 'plt.bar(channels, sales), plt.title, plt.xlabel.',
        },
        {
          task: 'Намалюй горизонтальні стовпці кількості скарг за темами так, щоб найбільша тема була зверху. Назва <code>"Скарги за темами, шт."</code>.',
          starter: `import matplotlib.pyplot as plt
topics = ["Доставка", "Оплата", "Якість товару", "Повернення", "Робота сайту"]
complaints = [48, 17, 35, 22, 9]
# твій код
`,
          solution: `import matplotlib.pyplot as plt
topics = ["Доставка", "Оплата", "Якість товару", "Повернення", "Робота сайту"]
complaints = [48, 17, 35, 22, 9]
pairs = sorted(zip(complaints, topics))
plt.barh([t for c, t in pairs], [c for c, t in pairs])
plt.title("Скарги за темами, шт.")
plt.show()`,
          check: `figs = figures()
expect(len(figs) == 1, f"Має бути один графік, а зараз {len(figs)}")
ax = figs[0].axes[0]
widths = [p.get_width() for p in ax.patches]
expect(len(widths) == 5, f"Має бути 5 стовпців, а зараз {len(widths)}")
expect(all(approx(a, b) for a, b in zip(widths, [9, 17, 22, 35, 48])), "barh малює першу категорію внизу: відсортуй за зростанням, щоб найбільша була зверху")
labels = [t.get_text() for t in ax.get_yticklabels()]
expect(labels == ["Робота сайту", "Оплата", "Повернення", "Якість товару", "Доставка"], "Назви тем мають іти разом зі своїми значеннями")
expect(ax.get_title() == "Скарги за темами, шт.", "Назва графіка має бути «Скарги за темами, шт.»")`,
          hint: 'sorted(zip(complaints, topics)) сортує пари за числом; barh малює знизу вгору.',
        },
        {
          task: 'Дано словник продажів за товарами. Намалюй стовпці від найбільшого до найменшого з назвою <code>"Продажі за товарами, тис. грн"</code>.',
          starter: `import matplotlib.pyplot as plt
sales = {"Чай": 140, "Кава": 390, "Какао": 75, "Сік": 210, "Вода": 160}
# твій код
`,
          solution: `import matplotlib.pyplot as plt
sales = {"Чай": 140, "Кава": 390, "Какао": 75, "Сік": 210, "Вода": 160}
pairs = sorted(sales.items(), key=lambda kv: kv[1], reverse=True)
plt.bar([k for k, v in pairs], [v for k, v in pairs])
plt.title("Продажі за товарами, тис. грн")
plt.show()`,
          check: `figs = figures()
expect(len(figs) == 1, f"Має бути один графік, а зараз {len(figs)}")
ax = figs[0].axes[0]
heights = [p.get_height() for p in ax.patches]
expect(len(heights) == 5, f"Має бути 5 стовпців, а зараз {len(heights)}")
expect(all(approx(a, b) for a, b in zip(heights, [390, 210, 160, 140, 75])), "Стовпці мають іти від найбільшого до найменшого")
labels = [t.get_text() for t in ax.get_xticklabels()]
expect(labels == ["Кава", "Сік", "Вода", "Чай", "Какао"], "Назви товарів мають іти разом зі своїми значеннями")
expect(ax.get_title() == "Продажі за товарами, тис. грн", "Назва графіка має бути «Продажі за товарами, тис. грн»")`,
          hint: 'sorted(sales.items(), key=lambda kv: kv[1], reverse=True), потім розклади пари на два списки.',
        },
        {
          task: 'У таблиці замовлення за датами. Порахуй виручку за кожен місяць (<code>month</code>) і намалюй стовпці в порядку місяців. Назва <code>"Виручка за місяць, грн"</code>.',
          starter: `import pandas as pd
import matplotlib.pyplot as plt
df = pd.DataFrame({
    "month": ["2024-01", "2024-02", "2024-01", "2024-03", "2024-02", "2024-03", "2024-03"],
    "amount": [1200, 950, 800, 1400, 700, 600, 1100],
})
# твій код
`,
          solution: `import pandas as pd
import matplotlib.pyplot as plt
df = pd.DataFrame({
    "month": ["2024-01", "2024-02", "2024-01", "2024-03", "2024-02", "2024-03", "2024-03"],
    "amount": [1200, 950, 800, 1400, 700, 600, 1100],
})
by_month = df.groupby("month")["amount"].sum()
plt.bar(by_month.index, by_month.values)
plt.title("Виручка за місяць, грн")
plt.show()`,
          check: `figs = figures()
expect(len(figs) == 1, f"Має бути один графік, а зараз {len(figs)}")
ax = figs[0].axes[0]
heights = [p.get_height() for p in ax.patches]
expect(len(heights) == 3, f"Має бути 3 стовпці, по одному на місяць, а зараз {len(heights)}")
expect(all(approx(a, b) for a, b in zip(heights, [1200 + 800, 950 + 700, 1400 + 600 + 1100])), "Висоти мають бути сумами amount за місяцями, у порядку 2024-01, 2024-02, 2024-03")
expect(ax.get_title() == "Виручка за місяць, грн", "Назва графіка має бути «Виручка за місяць, грн»")`,
          hint: 'groupby("month")["amount"].sum() дає Series: її index це місяці, values це суми.',
        },
        {
          task: 'Покажи лише 5 найбільших за продажами товарів горизонтальними стовпцями, найбільший зверху. Назва <code>"Топ-5 товарів, тис. грн"</code>.',
          starter: `import pandas as pd
import matplotlib.pyplot as plt
s = pd.Series({"Хліб": 210, "Молоко": 340, "Сир": 280, "Яйця": 150, "Масло": 190,
               "Кава": 410, "Чай": 95, "Цукор": 120})
# твій код
`,
          solution: `import pandas as pd
import matplotlib.pyplot as plt
s = pd.Series({"Хліб": 210, "Молоко": 340, "Сир": 280, "Яйця": 150, "Масло": 190,
               "Кава": 410, "Чай": 95, "Цукор": 120})
top = s.nlargest(5).sort_values()
plt.barh(top.index, top.values)
plt.title("Топ-5 товарів, тис. грн")
plt.show()`,
          check: `figs = figures()
expect(len(figs) == 1, f"Має бути один графік, а зараз {len(figs)}")
ax = figs[0].axes[0]
widths = [p.get_width() for p in ax.patches]
expect(len(widths) == 5, f"Має бути 5 стовпців, а зараз {len(widths)}")
expect(all(approx(a, b) for a, b in zip(widths, [190, 210, 280, 340, 410])), "Потрібні 5 найбільших значень, відсортовані так, щоб найбільше було зверху")
labels = [t.get_text() for t in ax.get_yticklabels()]
expect(labels == ["Масло", "Хліб", "Сир", "Молоко", "Кава"], "Назви товарів мають іти разом зі своїми значеннями")
expect(ax.get_title() == "Топ-5 товарів, тис. грн", "Назва графіка має бути «Топ-5 товарів, тис. грн»")`,
          hint: 's.nlargest(5) дає найбільші за спаданням; для barh переверни порядок через sort_values().',
        },
      ],
    },
    {
      id: 'l9-2',
      title: 'Розподіли і зв\'язки',
      theory: `<p><strong>Гістограма</strong> <code>plt.hist(values, bins=10)</code> ділить діапазон значень на кошики і показує, скільки значень потрапило в кожен. Вона відповідає на питання «які чеки типові, а які рідкісні». <code>bins</code> задає кількість кошиків або список меж: <code>bins=[0, 500, 1000, 2000]</code>.</p>
<p>Кількість кошиків змінює картинку: замало, і все зливається в одну гору; забагато, і з'являється шум. Почни з 10-20 і подивись, чи форма стабільна. Кошики роблять однакової ширини: висота стовпця це кількість, і ширший кошик виглядав би більшим, ніж є. Межі з кроком зручно будувати через <code>np.arange(0, max + крок, крок)</code>. <code>edgecolor="white"</code> відділяє стовпці один від одного.</p>
<p><strong>Діаграма розсіювання</strong> <code>plt.scatter(x, y)</code> ставить точку на кожен рядок і показує зв'язок двох чисел: чи ростуть продажі разом з рекламою, чи є окремі точки, що випадають. <code>alpha=0.6</code> робить точки напівпрозорими, і видно, де вони накладаються.</p>
<p><strong>Ящик з вусами</strong> <code>plt.boxplot([група1, група2], tick_labels=["A", "B"])</code> стискає розподіл до п'яти чисел: лінія всередині ящика це медіана, межі ящика це перший і третій квартилі, вуса тягнуться до найдальших звичайних значень, окремі кружки це викиди. Кілька ящиків поруч порівнюють групи краще, ніж кілька гістограм.</p>`,
      examples: [
        {
          code: `import numpy as np
import matplotlib.pyplot as plt

rng = np.random.default_rng(42)
checks = rng.gamma(shape=3, scale=250, size=400)

plt.hist(checks, bins=20, edgecolor="white")
plt.title("Розподіл чеків, грн")
plt.xlabel("Сума чека")
plt.ylabel("Кількість чеків")
plt.show()
print(round(float(np.median(checks))), round(float(checks.mean())))`,
          output: `690 751`,
          images: true,
        },
        {
          code: `import numpy as np
import matplotlib.pyplot as plt

rng = np.random.default_rng(7)
ads = rng.uniform(10, 100, 40)
sales = 200 + 6 * ads + rng.normal(0, 60, 40)

plt.scatter(ads, sales, alpha=0.6)
plt.title("Реклама і продажі за тиждень, тис. грн")
plt.xlabel("Витрати на рекламу")
plt.ylabel("Продажі")
plt.show()`,
          output: ``,
          images: true,
        },
        {
          code: `import numpy as np
import matplotlib.pyplot as plt

rng = np.random.default_rng(3)
center = rng.normal(900, 150, 60)
mall = rng.normal(750, 250, 60)
station = rng.normal(500, 100, 60)

plt.boxplot([center, mall, station], tick_labels=["Центр", "ТРЦ", "Вокзал"])
plt.title("Чеки за магазинами, грн")
plt.show()`,
          output: ``,
          images: true,
        },
        {
          code: `import numpy as np
import matplotlib.pyplot as plt

rng = np.random.default_rng(42)
checks = rng.gamma(shape=3, scale=250, size=400)

bins = np.arange(0, checks.max() + 250, 250)
plt.hist(checks, bins=bins, edgecolor="white")
plt.axvline(np.median(checks), color="black", linestyle="--", label="медіана")
plt.legend()
plt.title("Чеки за діапазонами, грн")
plt.show()`,
          output: ``,
          images: true,
        },
      ],
      exercises: [
        {
          task: 'Намалюй гістограму часу доставки з 8 кошиками. Назва <code>"Час доставки, хв"</code>.',
          starter: `import matplotlib.pyplot as plt
minutes = [32, 45, 28, 51, 38, 40, 62, 35, 47, 29, 55, 41, 36, 44, 70, 39, 33, 48, 42, 58]
# твій код
`,
          solution: `import matplotlib.pyplot as plt
minutes = [32, 45, 28, 51, 38, 40, 62, 35, 47, 29, 55, 41, 36, 44, 70, 39, 33, 48, 42, 58]
plt.hist(minutes, bins=8)
plt.title("Час доставки, хв")
plt.show()`,
          check: `figs = figures()
expect(len(figs) == 1, f"Має бути один графік, а зараз {len(figs)}")
ax = figs[0].axes[0]
heights = [p.get_height() for p in ax.patches]
expect(len(heights) == 8, f"Має бути 8 кошиків, а зараз {len(heights)}")
expect(approx(sum(heights), 20), "Гістограма має врахувати всі 20 значень minutes")
expect(ax.get_title() == "Час доставки, хв", "Назва графіка має бути «Час доставки, хв»")`,
          hint: 'plt.hist(minutes, bins=8).',
        },
        {
          task: 'Намалюй гістограму чеків з межами кошиків <code>[0, 400, 800, 1200, 1600, 2000]</code> і підписом осі Y <code>"Кількість чеків"</code>.',
          starter: `import matplotlib.pyplot as plt
checks = [120, 340, 560, 90, 1500, 780, 230, 410, 950, 1800, 670, 310, 205, 860, 1250, 480]
# твій код
`,
          solution: `import matplotlib.pyplot as plt
checks = [120, 340, 560, 90, 1500, 780, 230, 410, 950, 1800, 670, 310, 205, 860, 1250, 480]
plt.hist(checks, bins=[0, 400, 800, 1200, 1600, 2000])
plt.ylabel("Кількість чеків")
plt.show()`,
          check: `import numpy as np
figs = figures()
expect(len(figs) == 1, f"Має бути один графік, а зараз {len(figs)}")
ax = figs[0].axes[0]
heights = [p.get_height() for p in ax.patches]
data = [120, 340, 560, 90, 1500, 780, 230, 410, 950, 1800, 670, 310, 205, 860, 1250, 480]
counts, _ = np.histogram(data, bins=[0, 400, 800, 1200, 1600, 2000])
expect(len(heights) == 5, f"Межі [0, 400, 800, 1200, 1600, 2000] дають 5 кошиків, а зараз {len(heights)}")
expect(all(approx(a, b) for a, b in zip(heights, counts)), "Кількість у кошиках не збігається: передай межі списком у bins")
expect(ax.get_ylabel() == "Кількість чеків", "Підпис осі Y має бути «Кількість чеків»")`,
          hint: 'bins приймає не лише число, а й список меж.',
        },
        {
          task: 'Покажи зв\'язок площі магазину і виручки діаграмою розсіювання: по X площа, по Y виручка. Підписи осей <code>"Площа, м²"</code> і <code>"Виручка, тис. грн"</code>.',
          starter: `import matplotlib.pyplot as plt
area = [120, 85, 200, 150, 60, 175, 95, 230]
revenue = [940, 610, 1480, 1150, 520, 1300, 700, 1620]
# твій код
`,
          solution: `import matplotlib.pyplot as plt
area = [120, 85, 200, 150, 60, 175, 95, 230]
revenue = [940, 610, 1480, 1150, 520, 1300, 700, 1620]
plt.scatter(area, revenue)
plt.xlabel("Площа, м²")
plt.ylabel("Виручка, тис. грн")
plt.show()`,
          check: `figs = figures()
expect(len(figs) == 1, f"Має бути один графік, а зараз {len(figs)}")
ax = figs[0].axes[0]
expect(len(ax.collections) == 1, "Потрібна одна діаграма розсіювання: plt.scatter")
pts = ax.collections[0].get_offsets()
expect(len(pts) == 8, f"Має бути 8 точок, а зараз {len(pts)}")
xs = [float(p[0]) for p in pts]
ys = [float(p[1]) for p in pts]
expect(xs == [120, 85, 200, 150, 60, 175, 95, 230], "По осі X має бути площа area")
expect(ys == [940, 610, 1480, 1150, 520, 1300, 700, 1620], "По осі Y має бути виручка revenue")
expect(ax.get_xlabel() == "Площа, м²" and ax.get_ylabel() == "Виручка, тис. грн", "Підпиши обидві осі, як у завданні")`,
          hint: 'plt.scatter(area, revenue), потім plt.xlabel і plt.ylabel.',
        },
        {
          task: 'Порівняй час обробки заявок у трьох відділах ящиками з вусами. Підписи ящиків <code>"Продажі"</code>, <code>"Склад"</code>, <code>"Підтримка"</code> у цьому порядку, назва <code>"Час обробки заявки, год"</code>.',
          starter: `import matplotlib.pyplot as plt
sales = [2, 3, 3, 4, 5, 4, 3, 2, 6]
warehouse = [5, 7, 6, 8, 9, 6, 7, 15]
support = [1, 2, 1, 3, 2, 2, 4, 1, 2, 3]
# твій код
`,
          solution: `import matplotlib.pyplot as plt
sales = [2, 3, 3, 4, 5, 4, 3, 2, 6]
warehouse = [5, 7, 6, 8, 9, 6, 7, 15]
support = [1, 2, 1, 3, 2, 2, 4, 1, 2, 3]
plt.boxplot([sales, warehouse, support], tick_labels=["Продажі", "Склад", "Підтримка"])
plt.title("Час обробки заявки, год")
plt.show()`,
          check: `figs = figures()
expect(len(figs) == 1, f"Має бути один графік, а зараз {len(figs)}")
ax = figs[0].axes[0]
labels = [t.get_text() for t in ax.get_xticklabels()]
expect(labels == ["Продажі", "Склад", "Підтримка"], f"Підписи ящиків мають бути Продажі, Склад, Підтримка, а зараз {labels}")
expect(len(ax.get_lines()) >= 18, "Схоже, ящиків менше трьох: передай у boxplot список з трьох списків")
expect(ax.get_title() == "Час обробки заявки, год", "Назва графіка має бути «Час обробки заявки, год»")`,
          hint: 'plt.boxplot([sales, warehouse, support], tick_labels=[...]).',
        },
        {
          task: 'Серед замовлень є кілька оптових на десятки тисяч, вони сплющують гістограму. Відкинь замовлення від 5000 грн і намалюй гістограму решти з 6 кошиками. Назва <code>"Роздрібні замовлення, грн"</code>.',
          starter: `import matplotlib.pyplot as plt
orders = [420, 980, 35000, 610, 1250, 760, 48000, 330, 1890, 540, 2100, 870,
          1430, 690, 27500, 1120, 450, 3100, 990, 1660, 720]
# твій код
`,
          solution: `import matplotlib.pyplot as plt
orders = [420, 980, 35000, 610, 1250, 760, 48000, 330, 1890, 540, 2100, 870,
          1430, 690, 27500, 1120, 450, 3100, 990, 1660, 720]
retail = [x for x in orders if x < 5000]
plt.hist(retail, bins=6)
plt.title("Роздрібні замовлення, грн")
plt.show()`,
          check: `figs = figures()
expect(len(figs) == 1, f"Має бути один графік, а зараз {len(figs)}")
ax = figs[0].axes[0]
heights = [p.get_height() for p in ax.patches]
expect(len(heights) == 6, f"Має бути 6 кошиків, а зараз {len(heights)}")
data = [420, 980, 35000, 610, 1250, 760, 48000, 330, 1890, 540, 2100, 870, 1430, 690, 27500, 1120, 450, 3100, 990, 1660, 720]
keep = [x for x in data if x < 5000]
expect(approx(sum(heights), len(keep)), f"У гістограмі має бути {len(keep)} замовлень до 5000 грн, а зараз {int(sum(heights))}")
right = max(p.get_x() + p.get_width() for p in ax.patches)
expect(right < 5000, "Остання межа гістограми за 5000: оптові замовлення не відкинуто")
expect(ax.get_title() == "Роздрібні замовлення, грн", "Назва графіка має бути «Роздрібні замовлення, грн»")`,
          hint: 'Спершу відфільтруй список: [x for x in orders if x < 5000].',
        },
        {
          task: 'Порівняй розподіл чеків двох магазинів на одній гістограмі: однакові межі кошиків <code>[0, 300, 600, 900, 1200, 1500]</code>, напівпрозорі стовпці (<code>alpha=0.5</code>), легенда з підписами <code>"Центр"</code> і <code>"Вокзал"</code>.',
          starter: `import matplotlib.pyplot as plt
center = [820, 950, 1100, 760, 1340, 890, 1020, 680, 1180, 930]
station = [310, 450, 520, 280, 610, 390, 470, 720, 350, 560]
# твій код
`,
          solution: `import matplotlib.pyplot as plt
center = [820, 950, 1100, 760, 1340, 890, 1020, 680, 1180, 930]
station = [310, 450, 520, 280, 610, 390, 470, 720, 350, 560]
bins = [0, 300, 600, 900, 1200, 1500]
plt.hist(center, bins=bins, alpha=0.5, label="Центр")
plt.hist(station, bins=bins, alpha=0.5, label="Вокзал")
plt.legend()
plt.title("Чеки двох магазинів, грн")
plt.show()`,
          check: `import numpy as np
figs = figures()
expect(len(figs) == 1, f"Обидві гістограми мають бути на одному графіку, а зараз графіків {len(figs)}")
ax = figs[0].axes[0]
heights = [p.get_height() for p in ax.patches]
expect(len(heights) == 10, f"Дві гістограми по 5 кошиків дають 10 стовпців, а зараз {len(heights)}")
bins = [0, 300, 600, 900, 1200, 1500]
c1, _ = np.histogram([820, 950, 1100, 760, 1340, 890, 1020, 680, 1180, 930], bins=bins)
c2, _ = np.histogram([310, 450, 520, 280, 610, 390, 470, 720, 350, 560], bins=bins)
expect(all(approx(a, b) for a, b in zip(heights, list(c1) + list(c2))), "Кошики мають бути однакові для обох магазинів: bins=[0, 300, 600, 900, 1200, 1500]")
expect(all(approx(p.get_alpha() or 1, 0.5) for p in ax.patches), "Задай alpha=0.5, щоб стовпці не закривали один одного")
legend = ax.get_legend()
expect(legend is not None, "Додай легенду: label=... у hist і plt.legend()")
expect([t.get_text() for t in legend.get_texts()] == ["Центр", "Вокзал"], "Підписи в легенді мають бути «Центр» і «Вокзал»")`,
          hint: 'Два виклики plt.hist з тим самим bins і своїм label, потім plt.legend().',
        },
      ],
    },
    {
      id: 'l9-3',
      title: 'Кілька графіків і оформлення',
      theory: `<p>Для кількох графіків на одній картинці використовують об'єктний підхід: <code>fig, axes = plt.subplots(1, 2, figsize=(10, 4))</code>. <code>fig</code> це вся картинка, <code>axes</code> це масив областей. На кожній малюють її методами: <code>axes[0].plot(...)</code>, <code>axes[1].bar(...)</code>. Підписи тут через <code>set_</code>: <code>ax.set_title</code>, <code>ax.set_xlabel</code>, <code>ax.set_ylabel</code>.</p>
<p><code>label="План"</code> у виклику малювання і <code>ax.legend()</code> додають легенду. Легенда потрібна, коли на області кілька рядів; для одного ряду досить назви. <code>ax.grid(axis="y", alpha=0.3)</code> додає світлі горизонтальні лінії, по яких легше зчитати значення.</p>
<p><code>ax.bar_label(ax.containers[0])</code> пише значення над кожним стовпцем. Коли стовпців небагато, точні числа на них корисніші за вісь Y.</p>
<p><code>sharey=True</code> (або <code>sharex=True</code>) дає областям спільну шкалу. Без неї кожна область підбирає свою, і стовпець 300 ліворуч може виглядати вищим за 500 праворуч. Порівнювані графіки малюють на спільній шкалі.</p>
<p><code>ax2 = ax.twinx()</code> додає другу вісь Y справа з тією ж віссю X: наприклад, виручка в гривнях стовпцями і маржа у відсотках лінією. Підписуй обидві осі, інакше не зрозуміло, яке число до якої шкали. <code>fig.tight_layout()</code> наприкінці розсуває області, щоб підписи не налазили один на одного.</p>`,
      examples: [
        {
          code: `import matplotlib.pyplot as plt

months = ["січ", "лют", "бер", "кві"]
orders = [320, 340, 395, 410]
avg_check = [610, 590, 640, 655]

fig, axes = plt.subplots(1, 2, figsize=(9, 3.5))
axes[0].plot(months, orders, marker="o")
axes[0].set_title("Замовлення, шт.")
axes[1].bar(months, avg_check)
axes[1].set_title("Середній чек, грн")
fig.tight_layout()
plt.show()`,
          output: ``,
          images: true,
        },
        {
          code: `import matplotlib.pyplot as plt

cities = ["Київ", "Львів", "Дніпро", "Одеса"]
sales = [540, 310, 295, 260]

fig, ax = plt.subplots()
bars = ax.bar(cities, sales)
ax.bar_label(bars)
ax.grid(axis="y", alpha=0.3)
ax.set_title("Продажі за містами, тис. грн")
plt.show()
print(len(ax.texts))`,
          output: `4`,
          images: true,
        },
        {
          code: `import matplotlib.pyplot as plt

products = ["Чай", "Кава", "Сік"]
kyiv = [220, 480, 150]
lviv = [180, 260, 90]

fig, axes = plt.subplots(1, 2, figsize=(8, 3.5), sharey=True)
axes[0].bar(products, kyiv)
axes[0].set_title("Київ, тис. грн")
axes[1].bar(products, lviv)
axes[1].set_title("Львів, тис. грн")
fig.tight_layout()
plt.show()`,
          output: ``,
          images: true,
        },
        {
          code: `import matplotlib.pyplot as plt

months = ["січ", "лют", "бер", "кві", "тра"]
revenue = [410, 445, 430, 490, 520]
margin = [18.5, 17.9, 19.2, 20.4, 21.0]

fig, ax = plt.subplots()
ax.bar(months, revenue, color="lightsteelblue", label="Виручка")
ax.set_ylabel("Виручка, тис. грн")
ax2 = ax.twinx()
ax2.plot(months, margin, color="darkred", marker="o", label="Маржа")
ax2.set_ylabel("Маржа, %")
ax.set_title("Виручка і маржа")
fig.tight_layout()
plt.show()
print(len(fig.axes))`,
          output: `2`,
          images: true,
        },
      ],
      exercises: [
        {
          task: 'Зроби картинку з двох областей поруч: ліворуч лінія відвідувачів, праворуч стовпці конверсії. Назви областей <code>"Відвідувачі, тис."</code> і <code>"Конверсія, %"</code>.',
          starter: `import matplotlib.pyplot as plt
weeks = ["т1", "т2", "т3", "т4", "т5"]
visitors = [12.4, 13.1, 11.8, 14.6, 15.2]
conversion = [2.1, 2.4, 2.2, 2.6, 2.9]
# твій код
`,
          solution: `import matplotlib.pyplot as plt
weeks = ["т1", "т2", "т3", "т4", "т5"]
visitors = [12.4, 13.1, 11.8, 14.6, 15.2]
conversion = [2.1, 2.4, 2.2, 2.6, 2.9]
fig, axes = plt.subplots(1, 2, figsize=(9, 3.5))
axes[0].plot(weeks, visitors)
axes[0].set_title("Відвідувачі, тис.")
axes[1].bar(weeks, conversion)
axes[1].set_title("Конверсія, %")
fig.tight_layout()
plt.show()`,
          check: `figs = figures()
expect(len(figs) == 1, f"Обидві області мають бути на одній картинці, а зараз картинок {len(figs)}")
axes = figs[0].axes
expect(len(axes) == 2, f"На картинці мають бути 2 області, а зараз {len(axes)}")
left, right = axes
expect(len(left.get_lines()) == 1 and all(approx(a, b) for a, b in zip(left.get_lines()[0].get_ydata(), [12.4, 13.1, 11.8, 14.6, 15.2])), "Ліворуч має бути лінія visitors")
heights = [p.get_height() for p in right.patches]
expect(len(heights) == 5 and all(approx(a, b) for a, b in zip(heights, [2.1, 2.4, 2.2, 2.6, 2.9])), "Праворуч мають бути стовпці conversion")
expect(left.get_title() == "Відвідувачі, тис." and right.get_title() == "Конверсія, %", "Назви областей: «Відвідувачі, тис.» і «Конверсія, %»")`,
          hint: 'fig, axes = plt.subplots(1, 2); axes[0].plot(...), axes[1].bar(...), set_title на кожній.',
        },
        {
          task: 'Намалюй стовпці кількості нових клієнтів за каналами і підпиши значення над кожним стовпцем через <code>bar_label</code>.',
          starter: `import matplotlib.pyplot as plt
channels = ["Пошук", "Соцмережі", "Розсилка", "Партнери"]
clients = [184, 126, 73, 41]
# твій код
`,
          solution: `import matplotlib.pyplot as plt
channels = ["Пошук", "Соцмережі", "Розсилка", "Партнери"]
clients = [184, 126, 73, 41]
fig, ax = plt.subplots()
bars = ax.bar(channels, clients)
ax.bar_label(bars)
ax.set_title("Нові клієнти за каналами, осіб")
plt.show()`,
          check: `figs = figures()
expect(len(figs) == 1, f"Має бути один графік, а зараз {len(figs)}")
ax = figs[0].axes[0]
expect(len(ax.patches) == 4, f"Має бути 4 стовпці, а зараз {len(ax.patches)}")
texts = [t.get_text() for t in ax.texts]
expect(texts == ["184", "126", "73", "41"], f"Над стовпцями мають бути значення 184, 126, 73, 41, а зараз {texts}")`,
          hint: 'bars = ax.bar(...), потім ax.bar_label(bars).',
        },
        {
          task: 'Намалюй дві лінії на одній області: план і факт за місяцями, з підписами <code>"План"</code> і <code>"Факт"</code> у легенді, і додай горизонтальну сітку (<code>axis="y"</code>).',
          starter: `import matplotlib.pyplot as plt
months = ["січ", "лют", "бер", "кві", "тра", "чер"]
plan = [400, 420, 440, 460, 480, 500]
fact = [385, 430, 425, 470, 505, 490]
# твій код
`,
          solution: `import matplotlib.pyplot as plt
months = ["січ", "лют", "бер", "кві", "тра", "чер"]
plan = [400, 420, 440, 460, 480, 500]
fact = [385, 430, 425, 470, 505, 490]
fig, ax = plt.subplots()
ax.plot(months, plan, linestyle="--", label="План")
ax.plot(months, fact, marker="o", label="Факт")
ax.legend()
ax.grid(axis="y", alpha=0.3)
ax.set_title("План і факт продажів, тис. грн")
plt.show()`,
          check: `figs = figures()
expect(len(figs) == 1, f"Має бути один графік, а зараз {len(figs)}")
ax = figs[0].axes[0]
expect(len(ax.get_lines()) == 2, f"Має бути 2 лінії, а зараз {len(ax.get_lines())}")
legend = ax.get_legend()
expect(legend is not None, "Додай легенду: label=... у plot і ax.legend()")
expect([t.get_text() for t in legend.get_texts()] == ["План", "Факт"], "У легенді мають бути «План» і «Факт»")
expect(any(l.get_visible() for l in ax.get_ygridlines()), "Додай горизонтальну сітку: ax.grid(axis=\\"y\\")")
expect(not any(l.get_visible() for l in ax.get_xgridlines()), "Потрібна лише горизонтальна сітка: axis=\\"y\\"")`,
          hint: 'Два ax.plot з label, ax.legend(), ax.grid(axis="y").',
        },
        {
          task: 'Зроби дві області одна під одною зі спільною віссю X: зверху замовлення, знизу повернення (обидві лінії). Назви областей <code>"Замовлення, шт."</code> і <code>"Повернення, шт."</code>.',
          starter: `import matplotlib.pyplot as plt
days = ["пн", "вт", "ср", "чт", "пт", "сб", "нд"]
orders = [210, 195, 230, 240, 310, 280, 190]
returns = [12, 9, 15, 11, 22, 18, 8]
# твій код
`,
          solution: `import matplotlib.pyplot as plt
days = ["пн", "вт", "ср", "чт", "пт", "сб", "нд"]
orders = [210, 195, 230, 240, 310, 280, 190]
returns = [12, 9, 15, 11, 22, 18, 8]
fig, axes = plt.subplots(2, 1, sharex=True, figsize=(7, 5))
axes[0].plot(days, orders)
axes[0].set_title("Замовлення, шт.")
axes[1].plot(days, returns)
axes[1].set_title("Повернення, шт.")
fig.tight_layout()
plt.show()`,
          check: `figs = figures()
expect(len(figs) == 1, f"Має бути одна картинка, а зараз {len(figs)}")
axes = figs[0].axes
expect(len(axes) == 2, f"Мають бути 2 області, а зараз {len(axes)}")
top, bottom = axes
expect(top.get_position().y0 > bottom.get_position().y0, "Області мають стояти одна під одною: plt.subplots(2, 1, ...)")
expect(top.get_shared_x_axes().joined(top, bottom), "Вісь X має бути спільною: sharex=True")
expect(all(approx(a, b) for a, b in zip(top.get_lines()[0].get_ydata(), [210, 195, 230, 240, 310, 280, 190])), "Зверху має бути лінія orders")
expect(all(approx(a, b) for a, b in zip(bottom.get_lines()[0].get_ydata(), [12, 9, 15, 11, 22, 18, 8])), "Знизу має бути лінія returns")
expect(top.get_title() == "Замовлення, шт." and bottom.get_title() == "Повернення, шт.", "Назви областей: «Замовлення, шт.» і «Повернення, шт.»")`,
          hint: 'plt.subplots(2, 1, sharex=True).',
        },
        {
          task: 'Покажи на одній області виручку стовпцями (ліва вісь, підпис <code>"Виручка, тис. грн"</code>) і кількість замовлень лінією на другій осі справа (підпис <code>"Замовлення, шт."</code>).',
          starter: `import matplotlib.pyplot as plt
months = ["січ", "лют", "бер", "кві", "тра"]
revenue = [410, 445, 430, 490, 520]
orders = [690, 720, 680, 760, 800]
# твій код
`,
          solution: `import matplotlib.pyplot as plt
months = ["січ", "лют", "бер", "кві", "тра"]
revenue = [410, 445, 430, 490, 520]
orders = [690, 720, 680, 760, 800]
fig, ax = plt.subplots()
ax.bar(months, revenue, color="lightsteelblue")
ax.set_ylabel("Виручка, тис. грн")
ax2 = ax.twinx()
ax2.plot(months, orders, color="darkred", marker="o")
ax2.set_ylabel("Замовлення, шт.")
ax.set_title("Виручка і замовлення")
fig.tight_layout()
plt.show()`,
          check: `figs = figures()
expect(len(figs) == 1, f"Має бути одна картинка, а зараз {len(figs)}")
axes = figs[0].axes
expect(len(axes) == 2, "Друга вісь Y створюється через ax.twinx()")
bar_ax = [a for a in axes if len(a.patches) > 0]
line_ax = [a for a in axes if len(a.get_lines()) > 0]
expect(len(bar_ax) == 1 and len(line_ax) == 1 and bar_ax[0] is not line_ax[0], "Стовпці мають бути на одній осі, лінія на другій")
b, l = bar_ax[0], line_ax[0]
expect(all(approx(p.get_height(), v) for p, v in zip(b.patches, [410, 445, 430, 490, 520])), "Стовпці мають показувати revenue")
expect(all(approx(a, v) for a, v in zip(l.get_lines()[0].get_ydata(), [690, 720, 680, 760, 800])), "Лінія має показувати orders")
expect(b.get_ylabel() == "Виручка, тис. грн", "Підпис осі стовпців: «Виручка, тис. грн»")
expect(l.get_ylabel() == "Замовлення, шт.", "Підпис другої осі: «Замовлення, шт.»")`,
          hint: 'ax.bar(...), ax.set_ylabel(...), ax2 = ax.twinx(), ax2.plot(...), ax2.set_ylabel(...).',
        },
        {
          task: 'Зроби сітку 2×2 зі спільною віссю Y: на кожній області стовпці продажів за товарами для одного міста. Міста розклади за алфавітом зліва направо і згори вниз, назва кожної області: назва міста.',
          starter: `import pandas as pd
import matplotlib.pyplot as plt
df = pd.DataFrame({
    "city": ["Lviv", "Kyiv", "Odesa", "Dnipro"] * 3,
    "product": ["tea"] * 4 + ["coffee"] * 4 + ["juice"] * 4,
    "sales": [120, 260, 90, 110, 210, 480, 150, 170, 60, 140, 70, 55],
})
# твій код
`,
          solution: `import pandas as pd
import matplotlib.pyplot as plt
df = pd.DataFrame({
    "city": ["Lviv", "Kyiv", "Odesa", "Dnipro"] * 3,
    "product": ["tea"] * 4 + ["coffee"] * 4 + ["juice"] * 4,
    "sales": [120, 260, 90, 110, 210, 480, 150, 170, 60, 140, 70, 55],
})
fig, axes = plt.subplots(2, 2, figsize=(8, 6), sharey=True)
for ax, city in zip(axes.flat, sorted(df["city"].unique())):
    part = df[df["city"] == city]
    ax.bar(part["product"], part["sales"])
    ax.set_title(city)
fig.tight_layout()
plt.show()`,
          check: `figs = figures()
expect(len(figs) == 1, f"Має бути одна картинка, а зараз {len(figs)}")
axes = figs[0].axes
expect(len(axes) == 4, f"Мають бути 4 області (2×2), а зараз {len(axes)}")
titles = [a.get_title() for a in axes]
expect(titles == ["Dnipro", "Kyiv", "Lviv", "Odesa"], f"Назви областей мають іти за алфавітом: Dnipro, Kyiv, Lviv, Odesa; а зараз {titles}")
expect(all(axes[0].get_shared_y_axes().joined(axes[0], a) for a in axes[1:]), "Вісь Y має бути спільною: sharey=True")
data = {"Dnipro": [110, 170, 55], "Kyiv": [260, 480, 140], "Lviv": [120, 210, 60], "Odesa": [90, 150, 70]}
for a in axes:
    hs = [p.get_height() for p in a.patches]
    want = data.get(a.get_title(), [])
    expect(len(hs) == 3 and all(approx(x, y) for x, y in zip(hs, want)), f"На області {a.get_title()} стовпці не відповідають продажам цього міста")`,
          hint: 'plt.subplots(2, 2, sharey=True); пройдись циклом по zip(axes.flat, sorted(міста)).',
        },
      ],
    },
    {
      id: 'l9-4',
      title: 'Графіки з pandas',
      theory: `<p>У Series і DataFrame є метод <code>.plot()</code>, що малює через ту саму matplotlib. Індекс іде на вісь X, значення на вісь Y, а кожна колонка DataFrame стає окремою лінією з легендою. Вид задає <code>kind</code>: <code>"line"</code>, <code>"bar"</code>, <code>"barh"</code>, <code>"hist"</code>, <code>"scatter"</code>, або коротка форма <code>df.plot.bar()</code>.</p>
<p>Метод повертає область (<code>ax</code>), тож підписи доробляють як завжди: <code>ax = s.plot(kind="bar", title="Продажі, тис. грн")</code>, далі <code>ax.set_ylabel(...)</code>. Назву осі X pandas бере з назви індексу.</p>
<p>Головна звичка: спершу підготуй дані, потім малюй. <code>df.groupby("city")["amount"].sum().sort_values(ascending=False).plot(kind="bar")</code>: агрегат, сортування, графік в одному ланцюжку. Порядок стовпців такий самий, як порядок рядків у Series.</p>
<p><code>df.plot.bar(stacked=True)</code> складає колонки DataFrame одна на одну: висота стовпця це підсумок рядка, сегменти показують склад. Дані для нього зручно готувати через <code>pivot_table</code>: рядки стануть стовпцями, колонки сегментами. Легенда часто накриває найвищий стовпець, тому її виносять праворуч: <code>ax.legend(bbox_to_anchor=(1, 1), loc="upper left")</code>.</p>
<p>Пастка: <code>DataFrame.plot()</code> щоразу створює нову картинку, а <code>Series.plot()</code> малює на поточній. Щоб керувати, куди йде графік, створи області самостійно і передай: <code>fig, axes = plt.subplots(1, 2)</code>, далі <code>df.plot(ax=axes[0])</code>.</p>`,
      examples: [
        {
          code: `import pandas as pd
import matplotlib.pyplot as plt

s = pd.Series([410, 445, 430, 490, 520, 560],
              index=["січ", "лют", "бер", "кві", "тра", "чер"])
ax = s.plot(kind="line", marker="o", title="Виручка за місяць, тис. грн")
ax.set_xlabel("Місяць")
plt.show()`,
          output: ``,
          images: true,
        },
        {
          code: `import pandas as pd
import matplotlib.pyplot as plt

df = pd.DataFrame({
    "city": ["Kyiv", "Lviv", "Kyiv", "Odesa", "Lviv", "Dnipro", "Kyiv", "Odesa"],
    "amount": [1200, 800, 950, 430, 610, 720, 1500, 380],
})
by_city = df.groupby("city")["amount"].sum().sort_values(ascending=False)
print(by_city)
by_city.plot(kind="bar", title="Виручка за містами, грн", rot=0)
plt.show()`,
          output: `city
Kyiv      3650
Lviv      1410
Odesa      810
Dnipro     720
Name: amount, dtype: int64`,
          images: true,
        },
        {
          code: `import pandas as pd
import matplotlib.pyplot as plt

df = pd.DataFrame({
    "month": ["2024-01", "2024-01", "2024-02", "2024-02", "2024-03", "2024-03"],
    "channel": ["Сайт", "Магазини", "Сайт", "Магазини", "Сайт", "Магазини"],
    "amount": [320, 450, 360, 430, 410, 440],
})
pt = df.pivot_table(index="month", columns="channel", values="amount", aggfunc="sum")
print(pt)
ax = pt.plot.bar(stacked=True, title="Виручка за каналами, тис. грн", rot=0)
ax.legend(title="Канал", bbox_to_anchor=(1, 1), loc="upper left")
plt.show()`,
          output: `channel  Магазини  Сайт
month
2024-01       450   320
2024-02       430   360
2024-03       440   410`,
          images: true,
        },
        {
          code: `import pandas as pd
import matplotlib.pyplot as plt

df = pd.DataFrame({
    "plan": [400, 420, 440, 460],
    "fact": [385, 430, 425, 470],
}, index=["січ", "лют", "бер", "кві"])

fig, axes = plt.subplots(1, 2, figsize=(9, 3.5))
df.plot(ax=axes[0], title="План і факт, тис. грн")
(df["fact"] - df["plan"]).plot(kind="bar", ax=axes[1], title="Відхилення, тис. грн", rot=0)
fig.tight_layout()
plt.show()
print(len(fig.axes))`,
          output: `2`,
          images: true,
        },
      ],
      exercises: [
        {
          task: 'Намалюй лінію Series <code>s</code> методом pandas з назвою <code>"Активні користувачі, тис."</code>.',
          starter: `import pandas as pd
import matplotlib.pyplot as plt
s = pd.Series([18.2, 19.5, 21.0, 20.4, 22.8, 24.1],
              index=["лип", "сер", "вер", "жов", "лис", "гру"])
# твій код
`,
          solution: `import pandas as pd
import matplotlib.pyplot as plt
s = pd.Series([18.2, 19.5, 21.0, 20.4, 22.8, 24.1],
              index=["лип", "сер", "вер", "жов", "лис", "гру"])
s.plot(title="Активні користувачі, тис.")
plt.show()`,
          check: `figs = figures()
expect(len(figs) == 1, f"Має бути один графік, а зараз {len(figs)}")
ax = figs[0].axes[0]
lines = ax.get_lines()
expect(len(lines) == 1, f"Має бути одна лінія, а зараз {len(lines)}")
expect(all(approx(a, b) for a, b in zip(lines[0].get_ydata(), [18.2, 19.5, 21.0, 20.4, 22.8, 24.1])), "Лінія має показувати значення s")
expect(ax.get_title() == "Активні користувачі, тис.", "Назва графіка має бути «Активні користувачі, тис.»")`,
          hint: 's.plot(title=...).',
        },
        {
          task: 'Порахуй виручку за категоріями і намалюй стовпці від найбільшої до найменшої методом pandas. Назва <code>"Виручка за категоріями, грн"</code>.',
          starter: `import pandas as pd
import matplotlib.pyplot as plt
df = pd.DataFrame({
    "category": ["drinks", "snacks", "dairy", "drinks", "bakery", "dairy", "snacks", "drinks", "bakery"],
    "amount": [420, 310, 560, 380, 240, 290, 150, 510, 330],
})
# твій код
`,
          solution: `import pandas as pd
import matplotlib.pyplot as plt
df = pd.DataFrame({
    "category": ["drinks", "snacks", "dairy", "drinks", "bakery", "dairy", "snacks", "drinks", "bakery"],
    "amount": [420, 310, 560, 380, 240, 290, 150, 510, 330],
})
by_cat = df.groupby("category")["amount"].sum().sort_values(ascending=False)
by_cat.plot(kind="bar", title="Виручка за категоріями, грн", rot=0)
plt.show()`,
          check: `figs = figures()
expect(len(figs) == 1, f"Має бути один графік, а зараз {len(figs)}")
ax = figs[0].axes[0]
heights = [p.get_height() for p in ax.patches]
expect(len(heights) == 4, f"Має бути 4 стовпці, по одному на категорію, а зараз {len(heights)}")
expect(all(approx(a, b) for a, b in zip(heights, [420 + 380 + 510, 560 + 290, 240 + 330, 310 + 150])), "Стовпці мають бути сумами amount за категоріями від найбільшої до найменшої")
labels = [t.get_text() for t in ax.get_xticklabels()]
expect(labels == ["drinks", "dairy", "bakery", "snacks"], f"Підписи стовпців у неправильному порядку: {labels}")
expect(ax.get_title() == "Виручка за категоріями, грн", "Назва графіка має бути «Виручка за категоріями, грн»")`,
          hint: 'groupby("category")["amount"].sum().sort_values(ascending=False).plot(kind="bar", ...).',
        },
        {
          task: 'Побудуй зведену таблицю <code>pt</code> (рядки <code>quarter</code>, колонки <code>region</code>, сума <code>amount</code>) і намалюй її складеними стовпцями. Назва <code>"Виручка за регіонами, млн грн"</code>.',
          starter: `import pandas as pd
import matplotlib.pyplot as plt
df = pd.DataFrame({
    "quarter": ["Q1", "Q1", "Q1", "Q2", "Q2", "Q2", "Q3", "Q3", "Q3"],
    "region": ["North", "South", "West"] * 3,
    "amount": [4.2, 3.1, 2.5, 4.6, 3.4, 2.2, 5.1, 3.9, 2.8],
})
# твій код
`,
          solution: `import pandas as pd
import matplotlib.pyplot as plt
df = pd.DataFrame({
    "quarter": ["Q1", "Q1", "Q1", "Q2", "Q2", "Q2", "Q3", "Q3", "Q3"],
    "region": ["North", "South", "West"] * 3,
    "amount": [4.2, 3.1, 2.5, 4.6, 3.4, 2.2, 5.1, 3.9, 2.8],
})
pt = df.pivot_table(index="quarter", columns="region", values="amount", aggfunc="sum")
ax = pt.plot.bar(stacked=True, title="Виручка за регіонами, млн грн", rot=0)
ax.legend(bbox_to_anchor=(1, 1), loc="upper left")
plt.show()`,
          check: `figs = figures()
expect(len(figs) == 1, f"Має бути один графік, а зараз {len(figs)}")
ax = figs[0].axes[0]
expect(len(ax.patches) == 9, f"3 квартали × 3 регіони дають 9 сегментів, а зараз {len(ax.patches)}")
tops = {}
for p in ax.patches:
    x = round(p.get_x() + p.get_width() / 2, 3)
    tops[x] = max(tops.get(x, 0), p.get_y() + p.get_height())
expect(len(tops) == 3, "Сегменти мають стояти в 3 стовпцях: stacked=True")
totals = [tops[k] for k in sorted(tops)]
expect(all(approx(a, b) for a, b in zip(totals, [4.2 + 3.1 + 2.5, 4.6 + 3.4 + 2.2, 5.1 + 3.9 + 2.8])), "Висота кожного стовпця має дорівнювати сумі кварталу")
expect(ax.get_title() == "Виручка за регіонами, млн грн", "Назва графіка має бути «Виручка за регіонами, млн грн»")`,
          hint: 'pivot_table(index="quarter", columns="region", values="amount", aggfunc="sum"), потім pt.plot.bar(stacked=True).',
        },
        {
          task: 'Намалюй усі три колонки DataFrame <code>df</code> лініями на одному графіку методом pandas (легенда з\'явиться сама). Назва <code>"Відвідувачі за каналами, тис."</code>.',
          starter: `import pandas as pd
import matplotlib.pyplot as plt
df = pd.DataFrame({
    "search": [42, 45, 47, 51, 55],
    "social": [18, 22, 27, 25, 31],
    "email": [9, 9, 11, 10, 12],
}, index=["т1", "т2", "т3", "т4", "т5"])
# твій код
`,
          solution: `import pandas as pd
import matplotlib.pyplot as plt
df = pd.DataFrame({
    "search": [42, 45, 47, 51, 55],
    "social": [18, 22, 27, 25, 31],
    "email": [9, 9, 11, 10, 12],
}, index=["т1", "т2", "т3", "т4", "т5"])
df.plot(title="Відвідувачі за каналами, тис.")
plt.show()`,
          check: `figs = figures()
expect(len(figs) == 1, f"Має бути один графік, а зараз {len(figs)}")
ax = figs[0].axes[0]
lines = ax.get_lines()
expect(len(lines) == 3, f"Має бути 3 лінії, по одній на колонку, а зараз {len(lines)}")
legend = ax.get_legend()
expect(legend is not None and [t.get_text() for t in legend.get_texts()] == ["search", "social", "email"], "У легенді мають бути назви колонок search, social, email")
expect(all(approx(a, b) for a, b in zip(lines[1].get_ydata(), [18, 22, 27, 25, 31])), "Друга лінія має показувати колонку social")
expect(ax.get_title() == "Відвідувачі за каналами, тис.", "Назва графіка має бути «Відвідувачі за каналами, тис.»")`,
          hint: 'df.plot(title=...) малює кожну колонку окремою лінією.',
        },
        {
          task: 'Порахуй виручку за кожен місяць через <code>resample("ME")</code> і намалюй її стовпцями методом pandas. Підпис осі Y <code>"Виручка, грн"</code>.',
          starter: `import pandas as pd
import matplotlib.pyplot as plt
df = pd.DataFrame({
    "date": pd.to_datetime(["2024-01-08", "2024-01-22", "2024-02-05", "2024-02-26",
                            "2024-03-11", "2024-03-18", "2024-03-29"]),
    "amount": [1800, 2200, 1500, 2600, 2100, 1900, 2400],
})
# твій код
`,
          solution: `import pandas as pd
import matplotlib.pyplot as plt
df = pd.DataFrame({
    "date": pd.to_datetime(["2024-01-08", "2024-01-22", "2024-02-05", "2024-02-26",
                            "2024-03-11", "2024-03-18", "2024-03-29"]),
    "amount": [1800, 2200, 1500, 2600, 2100, 1900, 2400],
})
monthly = df.set_index("date").resample("ME")["amount"].sum()
ax = monthly.plot(kind="bar", rot=0)
ax.set_ylabel("Виручка, грн")
plt.show()`,
          check: `figs = figures()
expect(len(figs) == 1, f"Має бути один графік, а зараз {len(figs)}")
ax = figs[0].axes[0]
heights = [p.get_height() for p in ax.patches]
expect(len(heights) == 3, f"Має бути 3 стовпці, по одному на місяць, а зараз {len(heights)}")
expect(all(approx(a, b) for a, b in zip(heights, [1800 + 2200, 1500 + 2600, 2100 + 1900 + 2400])), "Стовпці мають бути сумами amount за січень, лютий і березень")
expect(ax.get_ylabel() == "Виручка, грн", "Підпис осі Y має бути «Виручка, грн»")`,
          hint: 'set_index("date").resample("ME")["amount"].sum(), потім .plot(kind="bar") і ax.set_ylabel.',
        },
        {
          task: 'Зроби картинку з двох областей: ліворуч лінія виручки за місяцями (сума <code>amount</code> за <code>month</code>), праворуч горизонтальні стовпці виручки за містами, найбільше місто зверху. Малюй методами pandas з параметром <code>ax=</code>.',
          starter: `import pandas as pd
import matplotlib.pyplot as plt
df = pd.DataFrame({
    "month": ["2024-01", "2024-01", "2024-01", "2024-02", "2024-02", "2024-03", "2024-03", "2024-03"],
    "city": ["Kyiv", "Lviv", "Odesa", "Kyiv", "Lviv", "Kyiv", "Odesa", "Lviv"],
    "amount": [900, 420, 310, 1050, 380, 1120, 290, 460],
})
# твій код
`,
          solution: `import pandas as pd
import matplotlib.pyplot as plt
df = pd.DataFrame({
    "month": ["2024-01", "2024-01", "2024-01", "2024-02", "2024-02", "2024-03", "2024-03", "2024-03"],
    "city": ["Kyiv", "Lviv", "Odesa", "Kyiv", "Lviv", "Kyiv", "Odesa", "Lviv"],
    "amount": [900, 420, 310, 1050, 380, 1120, 290, 460],
})
fig, axes = plt.subplots(1, 2, figsize=(10, 3.5))
df.groupby("month")["amount"].sum().plot(ax=axes[0], marker="o", title="Виручка за місяць, грн")
df.groupby("city")["amount"].sum().sort_values().plot(kind="barh", ax=axes[1], title="Виручка за містами, грн")
fig.tight_layout()
plt.show()`,
          check: `figs = figures()
expect(len(figs) == 1, f"Обидва графіки мають бути на одній картинці, а зараз картинок {len(figs)}: передай ax=axes[0] і ax=axes[1]")
axes = figs[0].axes
expect(len(axes) == 2, f"Мають бути 2 області, а зараз {len(axes)}")
left, right = axes
expect(len(left.get_lines()) == 1, "Ліворуч має бути одна лінія")
expect(all(approx(a, b) for a, b in zip(left.get_lines()[0].get_ydata(), [900 + 420 + 310, 1050 + 380, 1120 + 290 + 460])), "Лінія має показувати суми amount за місяцями")
widths = [p.get_width() for p in right.patches]
expect(len(widths) == 3, f"Праворуч має бути 3 стовпці, а зараз {len(widths)}")
expect(all(approx(a, b) for a, b in zip(widths, [310 + 290, 420 + 380 + 460, 900 + 1050 + 1120])), "Праворуч мають бути суми за містами, відсортовані так, щоб найбільше місто було зверху")`,
          hint: 'fig, axes = plt.subplots(1, 2); ...sum().plot(ax=axes[0]); ...sum().sort_values().plot(kind="barh", ax=axes[1]).',
        },
      ],
    },
  ],
};
