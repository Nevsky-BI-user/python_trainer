export default {
  id: 'm8',
  title: 'Структурування даних',
  lessons: [
    {
      id: 'l8-1',
      title: 'Зведені таблиці',
      theory: `<p><strong>Зведена таблиця</strong> розкладає одне число за двома розрізами: по рядках одна ознака, по колонках інша, у клітинках агрегат. У pandas це <code>df.pivot_table(index="city", columns="month", values="amount", aggfunc="sum")</code>. Рядки й колонки впорядковуються за значенням, тому місяці краще писати як <code>2024-01</code>: з назвами <code>Jan</code>, <code>Feb</code> лютий опиниться перед січнем.</p>
<p>Без <code>aggfunc</code> pandas рахує <strong>середнє</strong>, а не суму: це найчастіша помилка новачка. Порожні комбінації дають <code>NaN</code>; <code>fill_value=0</code> ставить нуль там, де продажів справді не було. <code>margins=True</code> додає рядок і колонку підсумків, назву їм дає <code>margins_name="Total"</code>.</p>
<p><code>pd.crosstab(df["city"], df["channel"])</code> рахує, скільки разів трапилась кожна пара значень. З <code>normalize="index"</code> кожен рядок перетворюється на частки, що в сумі дають 1: так видно структуру, а не обсяг.</p>
<p>Дані бувають <strong>широкі</strong> (місяці в колонках) і <strong>довгі</strong> (одна колонка «місяць», одна колонка «значення»). Групувати, фільтрувати і малювати зручніше довгі. <code>df.melt(id_vars="shop", var_name="month", value_name="amount")</code> перетворює широку таблицю на довгу.</p>
<p>Зворотний крок: <code>long.pivot(index="shop", columns="month", values="amount")</code>. <code>pivot</code> нічого не агрегує, тож кожна пара рядок-колонка має траплятися один раз, інакше буде помилка. Якщо пари повторюються, потрібен <code>pivot_table</code> з <code>aggfunc</code>.</p>`,
      examples: [
        {
          code: `import pandas as pd

df = pd.DataFrame({
    "city": ["Kyiv", "Lviv", "Kyiv", "Odesa", "Lviv", "Kyiv", "Odesa", "Lviv"],
    "month": ["2024-01", "2024-01", "2024-02", "2024-02", "2024-02", "2024-03", "2024-03", "2024-03"],
    "amount": [120, 80, 150, 60, 90, 170, 75, 95],
})

pt = df.pivot_table(index="city", columns="month", values="amount", aggfunc="sum")
print(pt)`,
          output: `month  2024-01  2024-02  2024-03
city
Kyiv     120.0    150.0    170.0
Lviv      80.0     90.0     95.0
Odesa      NaN     60.0     75.0`,
        },
        {
          code: `import pandas as pd

df = pd.DataFrame({
    "city": ["Kyiv", "Lviv", "Kyiv", "Odesa", "Lviv", "Kyiv", "Odesa", "Lviv"],
    "month": ["2024-01", "2024-01", "2024-02", "2024-02", "2024-02", "2024-03", "2024-03", "2024-03"],
    "amount": [120, 80, 150, 60, 90, 170, 75, 95],
})

pt = df.pivot_table(index="city", columns="month", values="amount",
                    aggfunc="sum", fill_value=0, margins=True, margins_name="Total")
print(pt)`,
          output: `month  2024-01  2024-02  2024-03  Total
city
Kyiv       120      150      170    440
Lviv        80       90       95    265
Odesa        0       60       75    135
Total      200      300      340    840`,
        },
        {
          code: `import pandas as pd

orders = pd.DataFrame({
    "city": ["Kyiv", "Kyiv", "Lviv", "Kyiv", "Lviv", "Odesa", "Odesa", "Kyiv"],
    "channel": ["online", "shop", "online", "online", "shop", "shop", "shop", "shop"],
})

print(pd.crosstab(orders["city"], orders["channel"]))
print()
print(pd.crosstab(orders["city"], orders["channel"], normalize="index").round(2))`,
          output: `channel  online  shop
city
Kyiv          2     2
Lviv          1     1
Odesa         0     2

channel  online  shop
city
Kyiv        0.5   0.5
Lviv        0.5   0.5
Odesa       0.0   1.0`,
        },
        {
          code: `import pandas as pd

wide = pd.DataFrame({
    "shop": ["A", "B"],
    "Q1": [300, 210],
    "Q2": [340, 250],
})

long = wide.melt(id_vars="shop", var_name="quarter", value_name="amount")
print(long)
print()
back = long.pivot(index="shop", columns="quarter", values="amount")
print(back)`,
          output: `  shop quarter  amount
0    A      Q1     300
1    B      Q1     210
2    A      Q2     340
3    B      Q2     250

quarter   Q1   Q2
shop
A        300  340
B        210  250`,
        },
      ],
      exercises: [
        {
          task: 'Побудуй зведену таблицю <code>pt</code>: рядки <code>region</code>, колонки <code>product</code>, у клітинках сума <code>amount</code>. Виведи <code>pt</code>.',
          starter: `import pandas as pd
df = pd.DataFrame({
    "region": ["North", "South", "North", "South", "North", "South"],
    "product": ["tea", "tea", "coffee", "coffee", "tea", "coffee"],
    "amount": [40, 55, 70, 65, 35, 80],
})
# твій код
`,
          solution: `import pandas as pd
df = pd.DataFrame({
    "region": ["North", "South", "North", "South", "North", "South"],
    "product": ["tea", "tea", "coffee", "coffee", "tea", "coffee"],
    "amount": [40, 55, 70, 65, 35, 80],
})
pt = df.pivot_table(index="region", columns="product", values="amount", aggfunc="sum")
print(pt)`,
          expected: `product  coffee  tea
region
North        70   75
South       145   55`,
          hint: 'Без aggfunc вийде середнє. Потрібна сума: aggfunc="sum".',
        },
        {
          task: 'Порахуй кількість замовлень кожного менеджера (<code>manager</code>, рядки) за місяцями (<code>month</code>, колонки). Там, де замовлень не було, має стояти 0. Виведи таблицю.',
          starter: `import pandas as pd
df = pd.DataFrame({
    "manager": ["Iryna", "Taras", "Iryna", "Oksana", "Taras", "Iryna", "Oksana"],
    "month": ["2024-01", "2024-01", "2024-02", "2024-02", "2024-03", "2024-03", "2024-03"],
    "order_id": [101, 102, 103, 104, 105, 106, 107],
})
# твій код
`,
          solution: `import pandas as pd
df = pd.DataFrame({
    "manager": ["Iryna", "Taras", "Iryna", "Oksana", "Taras", "Iryna", "Oksana"],
    "month": ["2024-01", "2024-01", "2024-02", "2024-02", "2024-03", "2024-03", "2024-03"],
    "order_id": [101, 102, 103, 104, 105, 106, 107],
})
pt = df.pivot_table(index="manager", columns="month", values="order_id",
                    aggfunc="count", fill_value=0)
print(pt)`,
          expected: `month    2024-01  2024-02  2024-03
manager
Iryna          1        1        1
Oksana         0        1        1
Taras          1        0        1`,
          hint: 'aggfunc="count" рахує непорожні значення, fill_value=0 замінює пропуски.',
        },
        {
          task: 'Побудуй <code>pt</code>: рядки <code>city</code>, колонки <code>channel</code>, сума <code>amount</code>, з підсумками під назвою <code>"Total"</code>. Виведи лише загальну суму всіх продажів, узявши її з <code>pt</code>.',
          starter: `import pandas as pd
df = pd.DataFrame({
    "city": ["Kyiv", "Lviv", "Kyiv", "Dnipro", "Lviv", "Dnipro"],
    "channel": ["online", "shop", "shop", "online", "online", "shop"],
    "amount": [1200, 800, 950, 430, 610, 720],
})
# твій код
`,
          solution: `import pandas as pd
df = pd.DataFrame({
    "city": ["Kyiv", "Lviv", "Kyiv", "Dnipro", "Lviv", "Dnipro"],
    "channel": ["online", "shop", "shop", "online", "online", "shop"],
    "amount": [1200, 800, 950, 430, 610, 720],
})
pt = df.pivot_table(index="city", columns="channel", values="amount",
                    aggfunc="sum", margins=True, margins_name="Total")
print(pt.loc["Total", "Total"])`,
          expected: `4710`,
          check: `import pandas as pd
pt = need("pt", pd.DataFrame)
expect("Total" in pt.index and "Total" in pt.columns, "У pt має бути рядок і колонка Total: margins=True, margins_name=\\"Total\\"")
expect(approx(pt.loc["Total", "Total"], 1200 + 800 + 950 + 430 + 610 + 720), "Загальний підсумок у pt має дорівнювати сумі всіх amount")`,
          hint: 'margins=True, margins_name="Total", потім pt.loc["Total", "Total"].',
        },
        {
          task: 'Яку частку замовлень кожного міста дає кожен канал? Побудуй <code>crosstab</code> міст і каналів з частками по рядках, округли до 2 знаків і виведи.',
          starter: `import pandas as pd
orders = pd.DataFrame({
    "city": ["Kyiv", "Kyiv", "Kyiv", "Kyiv", "Lviv", "Lviv", "Lviv", "Odesa", "Odesa"],
    "channel": ["online", "online", "online", "shop", "online", "shop", "shop", "shop", "online"],
})
# твій код
`,
          solution: `import pandas as pd
orders = pd.DataFrame({
    "city": ["Kyiv", "Kyiv", "Kyiv", "Kyiv", "Lviv", "Lviv", "Lviv", "Odesa", "Odesa"],
    "channel": ["online", "online", "online", "shop", "online", "shop", "shop", "shop", "online"],
})
print(pd.crosstab(orders["city"], orders["channel"], normalize="index").round(2))`,
          expected: `channel  online  shop
city
Kyiv       0.75  0.25
Lviv       0.33  0.67
Odesa      0.50  0.50`,
          hint: 'pd.crosstab(..., normalize="index"), потім .round(2).',
        },
        {
          task: 'Таблиця <code>wide</code> містить продажі магазинів за місяцями в колонках. Перетвори її на довгу <code>long</code> з колонками <code>shop</code>, <code>month</code>, <code>amount</code>, відсортуй за <code>shop</code> і <code>month</code>, скинь індекс і виведи.',
          starter: `import pandas as pd
wide = pd.DataFrame({
    "shop": ["Center", "Mall"],
    "2024-01": [410, 380],
    "2024-02": [395, 420],
    "2024-03": [450, 465],
})
# твій код
`,
          solution: `import pandas as pd
wide = pd.DataFrame({
    "shop": ["Center", "Mall"],
    "2024-01": [410, 380],
    "2024-02": [395, 420],
    "2024-03": [450, 465],
})
long = wide.melt(id_vars="shop", var_name="month", value_name="amount")
long = long.sort_values(["shop", "month"]).reset_index(drop=True)
print(long)`,
          expected: `     shop    month  amount
0  Center  2024-01     410
1  Center  2024-02     395
2  Center  2024-03     450
3    Mall  2024-01     380
4    Mall  2024-02     420
5    Mall  2024-03     465`,
          hint: 'melt(id_vars="shop", var_name=..., value_name=...), потім sort_values і reset_index(drop=True).',
        },
        {
          task: 'У довгій таблиці <code>long</code> план і факт по магазинах лежать рядками (<code>kind</code>: <code>plan</code> або <code>fact</code>). Розгорни її в широку <code>wide</code> (рядки <code>shop</code>, колонки <code>plan</code> і <code>fact</code>), додай колонку <code>gap = fact - plan</code> і виведи лише магазини, що не виконали план, від найбільшого недобору.',
          starter: `import pandas as pd
long = pd.DataFrame({
    "shop": ["Center", "Center", "Mall", "Mall", "Airport", "Airport", "Station", "Station"],
    "kind": ["plan", "fact", "plan", "fact", "plan", "fact", "plan", "fact"],
    "amount": [500, 540, 450, 410, 300, 255, 280, 290],
})
# твій код
`,
          solution: `import pandas as pd
long = pd.DataFrame({
    "shop": ["Center", "Center", "Mall", "Mall", "Airport", "Airport", "Station", "Station"],
    "kind": ["plan", "fact", "plan", "fact", "plan", "fact", "plan", "fact"],
    "amount": [500, 540, 450, 410, 300, 255, 280, 290],
})
wide = long.pivot(index="shop", columns="kind", values="amount")
wide["gap"] = wide["fact"] - wide["plan"]
print(wide[wide["gap"] < 0].sort_values("gap"))`,
          expected: `kind     fact  plan  gap
shop
Airport   255   300  -45
Mall      410   450  -40`,
          hint: 'pivot(index="shop", columns="kind", values="amount"); недобір: gap &lt; 0, найбільший недобір це найменше значення gap.',
        },
      ],
    },
    {
      id: 'l8-2',
      title: 'Час: групування за періодами',
      theory: `<p>Щоб рахувати за місяцями чи тижнями, дата має бути датою, а не рядком: <code>df["date"] = pd.to_datetime(df["date"])</code>. Після цього доступний аксесор <code>.dt</code>.</p>
<p><code>df["date"].dt.to_period("M")</code> перетворює дату на <strong>період</strong> <code>2024-03</code>. За такою колонкою групують як за звичайною категорією: <code>df.groupby(df["date"].dt.to_period("M"))["amount"].sum()</code>. Тиждень дає <code>to_period("W")</code>: період з понеділка по неділю, друкується як <code>2024-03-04/2024-03-10</code>.</p>
<p><code>resample</code> групує за часом на <code>DatetimeIndex</code>: <code>df.set_index("date").resample("ME")["amount"].sum()</code>. Мітка рядка тут дата кінця періоду. Правило для кінця місяця в pandas 3 це <code>"ME"</code> (старе <code>"M"</code> дає помилку), тиждень <code>"W"</code> (закінчується в неділю), день <code>"D"</code>. Замість <code>set_index</code> можна передати колонку: <code>df.resample("ME", on="date")</code>.</p>
<p>Пропущені періоди. <code>groupby</code> показує лише ті місяці, де були записи: місяць без продажів просто зникає, і графік чи середнє стають брехливими. <code>resample(...).sum()</code> сам додає порожні періоди з нулем. Після <code>groupby</code> повний ряд будують так: <code>s.reindex(pd.period_range("2024-01", "2024-06", freq="M"), fill_value=0)</code>.</p>`,
      examples: [
        {
          code: `import pandas as pd

df = pd.DataFrame({
    "date": ["2024-01-05", "2024-01-20", "2024-02-03", "2024-02-17", "2024-02-28", "2024-03-09"],
    "amount": [1200, 800, 950, 1100, 400, 1300],
})
df["date"] = pd.to_datetime(df["date"])
df["month"] = df["date"].dt.to_period("M")
print(df)
print()
print(df.groupby("month")["amount"].sum())`,
          output: `        date  amount    month
0 2024-01-05    1200  2024-01
1 2024-01-20     800  2024-01
2 2024-02-03     950  2024-02
3 2024-02-17    1100  2024-02
4 2024-02-28     400  2024-02
5 2024-03-09    1300  2024-03

month
2024-01    2000
2024-02    2450
2024-03    1300
Freq: M, Name: amount, dtype: int64`,
        },
        {
          code: `import pandas as pd

df = pd.DataFrame({
    "date": pd.to_datetime(["2024-03-04", "2024-03-06", "2024-03-10", "2024-03-11", "2024-03-15", "2024-03-19"]),
    "amount": [300, 450, 200, 500, 350, 600],
})

weekly = df.groupby(df["date"].dt.to_period("W"))["amount"].sum()
print(weekly)`,
          output: `date
2024-03-04/2024-03-10    950
2024-03-11/2024-03-17    850
2024-03-18/2024-03-24    600
Freq: W-SUN, Name: amount, dtype: int64`,
        },
        {
          code: `import pandas as pd

df = pd.DataFrame({
    "date": pd.to_datetime(["2024-01-10", "2024-01-25", "2024-03-02", "2024-03-30"]),
    "amount": [500, 700, 650, 300],
})

print(df.set_index("date").resample("ME")["amount"].sum())
print()
print(df.resample("ME", on="date")["amount"].count())`,
          output: `date
2024-01-31    1200
2024-02-29       0
2024-03-31     950
Freq: ME, Name: amount, dtype: int64

date
2024-01-31    2
2024-02-29    0
2024-03-31    2
Freq: ME, Name: amount, dtype: int64`,
        },
        {
          code: `import pandas as pd

df = pd.DataFrame({
    "date": pd.to_datetime(["2024-01-10", "2024-01-25", "2024-03-02", "2024-04-14"]),
    "amount": [500, 700, 650, 300],
})

by_month = df.groupby(df["date"].dt.to_period("M"))["amount"].sum()
print(by_month)
print()
full = by_month.reindex(pd.period_range("2024-01", "2024-05", freq="M"), fill_value=0)
print(full)`,
          output: `date
2024-01    1200
2024-03     650
2024-04     300
Freq: M, Name: amount, dtype: int64

2024-01    1200
2024-02       0
2024-03     650
2024-04     300
2024-05       0
Freq: M, Name: amount, dtype: int64`,
        },
      ],
      exercises: [
        {
          task: 'Перетвори <code>date</code> на дати і виведи суму <code>amount</code> за кожен місяць через <code>dt.to_period("M")</code>.',
          starter: `import pandas as pd
df = pd.DataFrame({
    "date": ["2024-04-02", "2024-04-18", "2024-05-07", "2024-05-21", "2024-05-30", "2024-06-11"],
    "amount": [820, 640, 910, 300, 450, 1020],
})
# твій код
`,
          solution: `import pandas as pd
df = pd.DataFrame({
    "date": ["2024-04-02", "2024-04-18", "2024-05-07", "2024-05-21", "2024-05-30", "2024-06-11"],
    "amount": [820, 640, 910, 300, 450, 1020],
})
df["date"] = pd.to_datetime(df["date"])
print(df.groupby(df["date"].dt.to_period("M"))["amount"].sum())`,
          expected: `date
2024-04    1460
2024-05    1660
2024-06    1020
Freq: M, Name: amount, dtype: int64`,
          hint: 'pd.to_datetime, потім groupby(df["date"].dt.to_period("M")).',
        },
        {
          task: 'Порахуй кількість замовлень за кожен тиждень (понеділок-неділя) і виведи результат.',
          starter: `import pandas as pd
df = pd.DataFrame({
    "date": pd.to_datetime(["2024-09-02", "2024-09-03", "2024-09-08", "2024-09-10",
                            "2024-09-12", "2024-09-13", "2024-09-16"]),
    "order_id": [1, 2, 3, 4, 5, 6, 7],
})
# твій код
`,
          solution: `import pandas as pd
df = pd.DataFrame({
    "date": pd.to_datetime(["2024-09-02", "2024-09-03", "2024-09-08", "2024-09-10",
                            "2024-09-12", "2024-09-13", "2024-09-16"]),
    "order_id": [1, 2, 3, 4, 5, 6, 7],
})
print(df.groupby(df["date"].dt.to_period("W"))["order_id"].count())`,
          expected: `date
2024-09-02/2024-09-08    3
2024-09-09/2024-09-15    3
2024-09-16/2024-09-22    1
Freq: W-SUN, Name: order_id, dtype: int64`,
          hint: 'Тиждень: dt.to_period("W"); кількість: .count() або .size().',
        },
        {
          task: 'Через <code>resample</code> порахуй суму <code>amount</code> за кожен місяць у Series <code>monthly</code> і виведи її. Місяць без продажів має бути з нулем.',
          starter: `import pandas as pd
df = pd.DataFrame({
    "date": pd.to_datetime(["2024-01-15", "2024-01-29", "2024-02-10", "2024-04-05", "2024-04-22"]),
    "amount": [1500, 900, 1250, 700, 1600],
})
# твій код
`,
          solution: `import pandas as pd
df = pd.DataFrame({
    "date": pd.to_datetime(["2024-01-15", "2024-01-29", "2024-02-10", "2024-04-05", "2024-04-22"]),
    "amount": [1500, 900, 1250, 700, 1600],
})
monthly = df.set_index("date").resample("ME")["amount"].sum()
print(monthly)`,
          expected: `date
2024-01-31    2400
2024-02-29    1250
2024-03-31       0
2024-04-30    2300
Freq: ME, Name: amount, dtype: int64`,
          check: `import pandas as pd
monthly = need("monthly", pd.Series)
expect(len(monthly) == 4, f"У monthly має бути 4 місяці (січень-квітень), а зараз {len(monthly)}")
expect(approx(monthly.iloc[2], 0), "Березень без продажів: у monthly має бути 0")`,
          hint: 'set_index("date").resample("ME")["amount"].sum(). У pandas 3 кінець місяця це "ME".',
        },
        {
          task: 'Продажі є не за всі місяці. Порахуй суми за місяцями через <code>groupby</code> і <code>to_period("M")</code>, а потім доповни ряд до повного першого півріччя 2024 (січень-червень) нулями. Виведи повний ряд.',
          starter: `import pandas as pd
df = pd.DataFrame({
    "date": pd.to_datetime(["2024-02-03", "2024-02-19", "2024-03-08", "2024-05-27"]),
    "amount": [400, 650, 380, 920],
})
# твій код
`,
          solution: `import pandas as pd
df = pd.DataFrame({
    "date": pd.to_datetime(["2024-02-03", "2024-02-19", "2024-03-08", "2024-05-27"]),
    "amount": [400, 650, 380, 920],
})
by_month = df.groupby(df["date"].dt.to_period("M"))["amount"].sum()
full = by_month.reindex(pd.period_range("2024-01", "2024-06", freq="M"), fill_value=0)
print(full)`,
          expected: `2024-01       0
2024-02    1050
2024-03     380
2024-04       0
2024-05     920
2024-06       0
Freq: M, Name: amount, dtype: int64`,
          hint: 'reindex(pd.period_range("2024-01", "2024-06", freq="M"), fill_value=0).',
        },
        {
          task: 'Побудуй таблицю <code>table</code>: рядки місяці (<code>to_period("M")</code>), колонки міста, у клітинках сума <code>amount</code>, порожні клітинки 0. Виведи її.',
          starter: `import pandas as pd
df = pd.DataFrame({
    "date": pd.to_datetime(["2024-01-04", "2024-01-15", "2024-01-30", "2024-02-02",
                            "2024-02-14", "2024-03-01", "2024-03-21"]),
    "city": ["Kyiv", "Lviv", "Kyiv", "Lviv", "Lviv", "Kyiv", "Kharkiv"],
    "amount": [600, 300, 450, 500, 250, 700, 350],
})
# твій код
`,
          solution: `import pandas as pd
df = pd.DataFrame({
    "date": pd.to_datetime(["2024-01-04", "2024-01-15", "2024-01-30", "2024-02-02",
                            "2024-02-14", "2024-03-01", "2024-03-21"]),
    "city": ["Kyiv", "Lviv", "Kyiv", "Lviv", "Lviv", "Kyiv", "Kharkiv"],
    "amount": [600, 300, 450, 500, 250, 700, 350],
})
df["month"] = df["date"].dt.to_period("M")
table = df.pivot_table(index="month", columns="city", values="amount", aggfunc="sum", fill_value=0)
print(table)`,
          expected: `city     Kharkiv  Kyiv  Lviv
month
2024-01        0  1050   300
2024-02        0     0   750
2024-03      350   700     0`,
          hint: 'Колонка month з to_period("M"), далі pivot_table з aggfunc="sum" і fill_value=0.',
        },
        {
          task: 'Знайди тиждень з найбільшою виручкою. Порахуй суми за тижнями через <code>resample("W")</code> і виведи в одному рядку дату кінця цього тижня (лише дату, без часу) і суму через пробіл.',
          starter: `import pandas as pd
df = pd.DataFrame({
    "date": pd.to_datetime(["2024-10-01", "2024-10-03", "2024-10-08", "2024-10-09",
                            "2024-10-11", "2024-10-15", "2024-10-24"]),
    "amount": [700, 450, 300, 820, 510, 900, 640],
})
# твій код
`,
          solution: `import pandas as pd
df = pd.DataFrame({
    "date": pd.to_datetime(["2024-10-01", "2024-10-03", "2024-10-08", "2024-10-09",
                            "2024-10-11", "2024-10-15", "2024-10-24"]),
    "amount": [700, 450, 300, 820, 510, 900, 640],
})
weekly = df.set_index("date").resample("W")["amount"].sum()
best = weekly.idxmax()
print(best.date(), weekly.max())`,
          expected: `2024-10-13 1630`,
          hint: 'idxmax() повертає мітку (Timestamp) найбільшого значення, у Timestamp є метод .date().',
        },
      ],
    },
    {
      id: 'l8-3',
      title: 'Динаміка і ранги',
      theory: `<p>Динаміку рахують по відсортованому за часом ряду. <code>s.diff()</code> дає приріст до попереднього рядка в одиницях, <code>s.pct_change()</code> дає відносну зміну (0.25 означає +25%). Перший рядок завжди <code>NaN</code>: попереднього значення немає.</p>
<p><code>s.shift(1)</code> зсуває ряд на один крок униз, тобто ставить поруч попереднє значення. З нього збирається будь-яке порівняння: <code>s - s.shift(1)</code> те саме, що <code>diff()</code>, а <code>shift(12)</code> на місячних даних дає той самий місяць минулого року.</p>
<p><code>s.cumsum()</code> дає наростальний підсумок з початку періоду. <code>s.rolling(3).mean()</code> рахує ковзне середнє за три точки: згладжує шум, але перші два значення <code>NaN</code>, бо трьох точок ще немає.</p>
<p><code>s.rank(ascending=False)</code> ставить місце: 1 у найбільшого. Однакові значення за замовчуванням отримують середнє місце (2.5), з <code>method="min"</code> обидва отримують 2, а наступний 4. <code>df.nlargest(3, "amount")</code> повертає три рядки з найбільшими значеннями, без повного сортування.</p>
<p>Коли в таблиці кілька рядів (магазини, міста), динаміку рахують усередині групи: <code>df.groupby("shop")["amount"].diff()</code>. Інакше перший місяць одного магазину порівняється з останнім місяцем попереднього.</p>`,
      examples: [
        {
          code: `import pandas as pd

df = pd.DataFrame({
    "month": ["2024-01", "2024-02", "2024-03", "2024-04", "2024-05"],
    "revenue": [400, 460, 437, 520, 520],
})
df["diff"] = df["revenue"].diff()
df["growth_pct"] = (df["revenue"].pct_change() * 100).round(1)
df["cum"] = df["revenue"].cumsum()
print(df)`,
          output: `     month  revenue  diff  growth_pct   cum
0  2024-01      400   NaN         NaN   400
1  2024-02      460  60.0        15.0   860
2  2024-03      437 -23.0        -5.0  1297
3  2024-04      520  83.0        19.0  1817
4  2024-05      520   0.0         0.0  2337`,
        },
        {
          code: `import pandas as pd

s = pd.Series([120, 95, 140, 110, 160, 130],
              index=["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"])
out = pd.DataFrame({
    "visits": s,
    "prev": s.shift(1),
    "avg3": s.rolling(3).mean().round(1),
})
print(out)`,
          output: `     visits   prev   avg3
Mon     120    NaN    NaN
Tue      95  120.0    NaN
Wed     140   95.0  118.3
Thu     110  140.0  115.0
Fri     160  110.0  136.7
Sat     130  160.0  133.3`,
        },
        {
          code: `import pandas as pd

df = pd.DataFrame({
    "manager": ["Iryna", "Taras", "Oksana", "Bohdan", "Marta"],
    "sales": [540, 610, 540, 720, 480],
})
df["rank_avg"] = df["sales"].rank(ascending=False)
df["rank_min"] = df["sales"].rank(ascending=False, method="min").astype(int)
print(df)
print()
print(df.nlargest(2, "sales"))`,
          output: `  manager  sales  rank_avg  rank_min
0   Iryna    540       3.5         3
1   Taras    610       2.0         2
2  Oksana    540       3.5         3
3  Bohdan    720       1.0         1
4   Marta    480       5.0         5

  manager  sales  rank_avg  rank_min
3  Bohdan    720       1.0         1
1   Taras    610       2.0         2`,
        },
        {
          code: `import pandas as pd

df = pd.DataFrame({
    "shop": ["A", "A", "A", "B", "B", "B"],
    "month": ["2024-01", "2024-02", "2024-03", "2024-01", "2024-02", "2024-03"],
    "amount": [100, 130, 120, 300, 280, 330],
})
df["wrong"] = df["amount"].diff()
df["right"] = df.groupby("shop")["amount"].diff()
print(df)`,
          output: `  shop    month  amount  wrong  right
0    A  2024-01     100    NaN    NaN
1    A  2024-02     130   30.0   30.0
2    A  2024-03     120  -10.0  -10.0
3    B  2024-01     300  180.0    NaN
4    B  2024-02     280  -20.0  -20.0
5    B  2024-03     330   50.0   50.0`,
        },
      ],
      exercises: [
        {
          task: 'Додай у <code>df</code> колонку <code>change</code>: приріст виручки до попереднього місяця в гривнях. Виведи <code>df</code>.',
          starter: `import pandas as pd
df = pd.DataFrame({
    "month": ["2024-06", "2024-07", "2024-08", "2024-09"],
    "revenue": [820, 910, 870, 1005],
})
# твій код
`,
          solution: `import pandas as pd
df = pd.DataFrame({
    "month": ["2024-06", "2024-07", "2024-08", "2024-09"],
    "revenue": [820, 910, 870, 1005],
})
df["change"] = df["revenue"].diff()
print(df)`,
          expected: `     month  revenue  change
0  2024-06      820     NaN
1  2024-07      910    90.0
2  2024-08      870   -40.0
3  2024-09     1005   135.0`,
          hint: 'df["revenue"].diff().',
        },
        {
          task: 'Додай колонку <code>growth</code>: зміна до попереднього місяця у відсотках, округлена до 1 знака. Виведи <code>df</code>.',
          starter: `import pandas as pd
df = pd.DataFrame({
    "month": ["2024-01", "2024-02", "2024-03", "2024-04", "2024-05"],
    "users": [1500, 1650, 1584, 1900, 2090],
})
# твій код
`,
          solution: `import pandas as pd
df = pd.DataFrame({
    "month": ["2024-01", "2024-02", "2024-03", "2024-04", "2024-05"],
    "users": [1500, 1650, 1584, 1900, 2090],
})
df["growth"] = (df["users"].pct_change() * 100).round(1)
print(df)`,
          expected: `     month  users  growth
0  2024-01   1500     NaN
1  2024-02   1650    10.0
2  2024-03   1584    -4.0
3  2024-04   1900    19.9
4  2024-05   2090    10.0`,
          hint: 'pct_change() дає частку, помнож на 100 і округли.',
        },
        {
          task: 'Річний план відділу 3000 тис. грн. Додай колонку <code>cum</code> з наростальним підсумком і виведи назву першого місяця, у якому наростальний підсумок досяг плану або перевищив його.',
          starter: `import pandas as pd
df = pd.DataFrame({
    "month": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
    "sales": [310, 340, 395, 420, 380, 450, 510, 470],
})
plan = 3000
# твій код
`,
          solution: `import pandas as pd
df = pd.DataFrame({
    "month": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
    "sales": [310, 340, 395, 420, 380, 450, 510, 470],
})
plan = 3000
df["cum"] = df["sales"].cumsum()
print(df.loc[df["cum"] >= plan, "month"].iloc[0])`,
          expected: `Aug`,
          check: `import pandas as pd
df = need("df", pd.DataFrame)
expect("cum" in df.columns, "Додай у df колонку cum")
expect(list(df["cum"]) == [310, 650, 1045, 1465, 1845, 2295, 2805, 3275], "cum має бути наростальним підсумком sales")`,
          hint: 'cumsum(), потім фільтр cum &gt;= plan і перший рядок через .iloc[0].',
        },
        {
          task: 'Добові замовлення скачуть. Додай колонку <code>avg3</code>: ковзне середнє за 3 дні, округлене до 1 знака. Виведи <code>df</code>.',
          starter: `import pandas as pd
df = pd.DataFrame({
    "day": ["01.03", "02.03", "03.03", "04.03", "05.03", "06.03", "07.03"],
    "orders": [52, 61, 47, 70, 58, 66, 49],
})
# твій код
`,
          solution: `import pandas as pd
df = pd.DataFrame({
    "day": ["01.03", "02.03", "03.03", "04.03", "05.03", "06.03", "07.03"],
    "orders": [52, 61, 47, 70, 58, 66, 49],
})
df["avg3"] = df["orders"].rolling(3).mean().round(1)
print(df)`,
          expected: `     day  orders  avg3
0  01.03      52   NaN
1  02.03      61   NaN
2  03.03      47  53.3
3  04.03      70  59.3
4  05.03      58  58.3
5  06.03      66  64.7
6  07.03      49  57.7`,
          hint: 'df["orders"].rolling(3).mean().',
        },
        {
          task: 'Постав менеджерам місця за продажами: 1 у найбільших продажів, при рівних продажах обидва отримують вище місце (як у спорті: 1, 2, 2, 4). Колонка <code>place</code> має бути цілою. Виведи таблицю, відсортовану за місцем.',
          starter: `import pandas as pd
df = pd.DataFrame({
    "manager": ["Iryna", "Taras", "Oksana", "Bohdan", "Marta", "Yurii"],
    "sales": [430, 515, 515, 380, 610, 430],
})
# твій код
`,
          solution: `import pandas as pd
df = pd.DataFrame({
    "manager": ["Iryna", "Taras", "Oksana", "Bohdan", "Marta", "Yurii"],
    "sales": [430, 515, 515, 380, 610, 430],
})
df["place"] = df["sales"].rank(ascending=False, method="min").astype(int)
print(df.sort_values("place"))`,
          expected: `  manager  sales  place
4   Marta    610      1
1   Taras    515      2
2  Oksana    515      2
0   Iryna    430      4
5   Yurii    430      4
3  Bohdan    380      6`,
          hint: 'rank(ascending=False, method="min"), потім astype(int) і sort_values.',
        },
        {
          task: 'Для кожного магазину порахуй зміну продажів до попереднього місяця цього ж магазину (колонка <code>change</code>). Виведи лише рядки, де продажі впали.',
          starter: `import pandas as pd
df = pd.DataFrame({
    "shop": ["Center", "Center", "Center", "Mall", "Mall", "Mall", "Airport", "Airport", "Airport"],
    "month": ["2024-01", "2024-02", "2024-03"] * 3,
    "sales": [500, 470, 520, 300, 340, 310, 200, 260, 280],
})
# твій код
`,
          solution: `import pandas as pd
df = pd.DataFrame({
    "shop": ["Center", "Center", "Center", "Mall", "Mall", "Mall", "Airport", "Airport", "Airport"],
    "month": ["2024-01", "2024-02", "2024-03"] * 3,
    "sales": [500, 470, 520, 300, 340, 310, 200, 260, 280],
})
df["change"] = df.groupby("shop")["sales"].diff()
print(df[df["change"] < 0])`,
          expected: `     shop    month  sales  change
1  Center  2024-02    470   -30.0
5    Mall  2024-03    310   -30.0`,
          hint: 'df.groupby("shop")["sales"].diff(), потім фільтр change &lt; 0.',
        },
      ],
    },
    {
      id: 'l8-4',
      title: 'Групи і сегменти',
      theory: `<p><code>pd.cut(s, bins=[0, 500, 2000, float("inf")], labels=["small", "medium", "large"])</code> розкладає числа по інтервалах з межами, які задаєш ти. За замовчуванням права межа входить в інтервал: 500 потрапить у <code>(0, 500]</code>. <code>right=False</code> робить інтервали <code>[0, 500)</code>.</p>
<p><code>pd.qcut(s, q=4, labels=["Q1", "Q2", "Q3", "Q4"])</code> ділить за квантилями: межі підбираються так, щоб у кожній групі було приблизно порівну рядків. <code>cut</code> відповідає на «скільки чеків до 500 грн», <code>qcut</code> на «хто в нижній чверті».</p>
<p>Іменовані агрегації дають одразу зрозумілі назви колонок: <code>df.groupby("city").agg(orders=("amount", "count"), revenue=("amount", "sum"))</code>. Ліворуч назва нової колонки, праворуч пара (колонка, функція).</p>
<p><code>transform</code> рахує агрегат групи, але повертає його для кожного рядка, тож результат можна покласти поруч з даними: <code>df["city_total"] = df.groupby("city")["amount"].transform("sum")</code>. Частка рядка в групі: <code>df["amount"] / df["city_total"]</code>.</p>
<p>Умовні колонки. <code>np.where(умова, "так", "ні")</code> для двох варіантів. Для кількох <code>np.select([умова1, умова2], ["A", "B"], default="інше")</code>: перевіряє умови по черзі, перша справджена перемагає, тож найвужчу умову ставлять першою.</p>`,
      examples: [
        {
          code: `import pandas as pd

checks = pd.Series([120, 480, 500, 950, 1800, 2300, 4100, 650])
seg = pd.cut(checks, bins=[0, 500, 2000, float("inf")], labels=["small", "medium", "large"])
print(pd.DataFrame({"amount": checks, "segment": seg}))
print()
print(seg.value_counts(sort=False))`,
          output: `   amount segment
0     120   small
1     480   small
2     500   small
3     950  medium
4    1800  medium
5    2300   large
6    4100   large
7     650  medium

small     3
medium    3
large     2
Name: count, dtype: int64`,
        },
        {
          code: `import pandas as pd

checks = pd.Series([120, 480, 500, 950, 1800, 2300, 4100, 650])
q = pd.qcut(checks, q=4, labels=["Q1", "Q2", "Q3", "Q4"])
print(q.value_counts(sort=False))
print()
print(pd.qcut(checks, q=4).cat.categories)`,
          output: `Q1    2
Q2    2
Q3    2
Q4    2
Name: count, dtype: int64

IntervalIndex([(119.999, 495.0], (495.0, 800.0], (800.0, 1925.0], (1925.0, 4100.0]], dtype='interval[float64, right]')`,
        },
        {
          code: `import pandas as pd

df = pd.DataFrame({
    "city": ["Kyiv", "Lviv", "Kyiv", "Odesa", "Lviv", "Kyiv"],
    "amount": [1200, 800, 950, 430, 610, 1500],
})
summary = df.groupby("city").agg(
    orders=("amount", "count"),
    revenue=("amount", "sum"),
    avg_check=("amount", "mean"),
)
print(summary.round(1).sort_values("revenue", ascending=False))`,
          output: `       orders  revenue  avg_check
city
Kyiv        3     3650     1216.7
Lviv        2     1410      705.0
Odesa       1      430      430.0`,
        },
        {
          code: `import numpy as np
import pandas as pd

df = pd.DataFrame({
    "city": ["Kyiv", "Kyiv", "Kyiv", "Lviv", "Lviv"],
    "shop": ["Center", "Mall", "Airport", "Center", "Station"],
    "amount": [500, 300, 200, 450, 150],
})
df["share"] = (df["amount"] / df.groupby("city")["amount"].transform("sum") * 100).round(1)
df["size"] = np.where(df["amount"] >= 300, "big", "small")
df["tier"] = np.select(
    [df["share"] >= 50, df["share"] >= 25],
    ["leader", "middle"],
    default="tail",
)
print(df)`,
          output: `   city     shop  amount  share   size    tier
0  Kyiv   Center     500   50.0    big  leader
1  Kyiv     Mall     300   30.0    big  middle
2  Kyiv  Airport     200   20.0  small    tail
3  Lviv   Center     450   75.0    big  leader
4  Lviv  Station     150   25.0  small  middle`,
        },
      ],
      exercises: [
        {
          task: 'Розклади чеки на сегменти: до 500 грн включно <code>small</code>, понад 500 і до 2000 включно <code>medium</code>, понад 2000 <code>large</code>. Виведи кількість чеків у кожному сегменті в порядку сегментів (не за спаданням).',
          starter: `import pandas as pd
checks = pd.Series([90, 350, 500, 720, 1100, 2000, 2600, 480, 3900, 640])
# твій код
`,
          solution: `import pandas as pd
checks = pd.Series([90, 350, 500, 720, 1100, 2000, 2600, 480, 3900, 640])
seg = pd.cut(checks, bins=[0, 500, 2000, float("inf")], labels=["small", "medium", "large"])
print(seg.value_counts(sort=False))`,
          expected: `small     4
medium    4
large     2
Name: count, dtype: int64`,
          hint: 'pd.cut з bins=[0, 500, 2000, float("inf")] і labels, потім value_counts(sort=False).',
        },
        {
          task: 'Поділи клієнтів за витратами на три рівні з однаковою кількістю клієнтів: <code>low</code>, <code>mid</code>, <code>high</code>. Збережи в колонку <code>level</code> і виведи <code>df</code>, відсортований за <code>spend</code>.',
          starter: `import pandas as pd
df = pd.DataFrame({
    "client": ["c1", "c2", "c3", "c4", "c5", "c6", "c7", "c8", "c9"],
    "spend": [1200, 300, 4500, 800, 2600, 150, 3100, 950, 1800],
})
# твій код
`,
          solution: `import pandas as pd
df = pd.DataFrame({
    "client": ["c1", "c2", "c3", "c4", "c5", "c6", "c7", "c8", "c9"],
    "spend": [1200, 300, 4500, 800, 2600, 150, 3100, 950, 1800],
})
df["level"] = pd.qcut(df["spend"], q=3, labels=["low", "mid", "high"])
print(df.sort_values("spend"))`,
          expected: `  client  spend level
5     c6    150   low
1     c2    300   low
3     c4    800   low
7     c8    950   mid
0     c1   1200   mid
8     c9   1800   mid
4     c5   2600  high
6     c7   3100  high
2     c3   4500  high`,
          hint: 'pd.qcut(df["spend"], q=3, labels=[...]).',
        },
        {
          task: 'Збери по містах таблицю <code>summary</code> з колонками <code>orders</code> (кількість), <code>revenue</code> (сума), <code>avg_check</code> (середній чек) через іменовані агрегації. Округли до 1 знака, відсортуй за <code>revenue</code> від більшої і виведи.',
          starter: `import pandas as pd
df = pd.DataFrame({
    "city": ["Kyiv", "Dnipro", "Kyiv", "Lviv", "Dnipro", "Kyiv", "Lviv", "Dnipro"],
    "amount": [1350, 720, 980, 640, 1100, 1520, 890, 430],
})
# твій код
`,
          solution: `import pandas as pd
df = pd.DataFrame({
    "city": ["Kyiv", "Dnipro", "Kyiv", "Lviv", "Dnipro", "Kyiv", "Lviv", "Dnipro"],
    "amount": [1350, 720, 980, 640, 1100, 1520, 890, 430],
})
summary = df.groupby("city").agg(
    orders=("amount", "count"),
    revenue=("amount", "sum"),
    avg_check=("amount", "mean"),
)
summary = summary.round(1).sort_values("revenue", ascending=False)
print(summary)`,
          expected: `        orders  revenue  avg_check
city
Kyiv         3     3850     1283.3
Dnipro       3     2250      750.0
Lviv         2     1530      765.0`,
          hint: 'agg(orders=("amount", "count"), revenue=("amount", "sum"), avg_check=("amount", "mean")).',
        },
        {
          task: 'Додай колонку <code>share</code>: частка продажів товару в продажах його категорії, у відсотках, округлена до 1 знака. Виведи <code>df</code>.',
          starter: `import pandas as pd
df = pd.DataFrame({
    "category": ["drinks", "drinks", "drinks", "snacks", "snacks"],
    "product": ["tea", "coffee", "juice", "chips", "nuts"],
    "sales": [240, 510, 150, 330, 170],
})
# твій код
`,
          solution: `import pandas as pd
df = pd.DataFrame({
    "category": ["drinks", "drinks", "drinks", "snacks", "snacks"],
    "product": ["tea", "coffee", "juice", "chips", "nuts"],
    "sales": [240, 510, 150, 330, 170],
})
df["share"] = (df["sales"] / df.groupby("category")["sales"].transform("sum") * 100).round(1)
print(df)`,
          expected: `  category product  sales  share
0   drinks     tea    240   26.7
1   drinks  coffee    510   56.7
2   drinks   juice    150   16.7
3   snacks   chips    330   66.0
4   snacks    nuts    170   34.0`,
          check: `import pandas as pd
df = need("df", pd.DataFrame)
expect(len(df) == 5, "У df має лишитися 5 рядків: transform не згортає групи")
expect(approx(df.loc[df["category"] == "drinks", "share"].sum(), 100, tol=1e-2), "Частки в межах категорії drinks мають давати 100")`,
          hint: 'df.groupby("category")["sales"].transform("sum") дає суму категорії для кожного рядка.',
        },
        {
          task: 'Додай колонку <code>status</code>: <code>"done"</code>, якщо факт не менший за план, інакше <code>"miss"</code>. Виведи <code>df</code>.',
          starter: `import numpy as np
import pandas as pd
df = pd.DataFrame({
    "shop": ["Center", "Mall", "Airport", "Station"],
    "plan": [500, 450, 300, 280],
    "fact": [540, 410, 300, 255],
})
# твій код
`,
          solution: `import numpy as np
import pandas as pd
df = pd.DataFrame({
    "shop": ["Center", "Mall", "Airport", "Station"],
    "plan": [500, 450, 300, 280],
    "fact": [540, 410, 300, 255],
})
df["status"] = np.where(df["fact"] >= df["plan"], "done", "miss")
print(df)`,
          expected: `      shop  plan  fact status
0   Center   500   540   done
1     Mall   450   410   miss
2  Airport   300   300   done
3  Station   280   255   miss`,
          hint: 'np.where(df["fact"] &gt;= df["plan"], "done", "miss").',
        },
        {
          task: 'Сегментуй клієнтів: <code>vip</code>, якщо витратили від 10000 грн і зробили від 5 замовлень; <code>big</code>, якщо витратили від 10000 грн; <code>frequent</code>, якщо зробили від 5 замовлень; решта <code>regular</code>. Збережи в колонку <code>segment</code> і виведи кількість клієнтів у кожному сегменті, відсортовану за назвою сегмента.',
          starter: `import numpy as np
import pandas as pd
df = pd.DataFrame({
    "client": ["c1", "c2", "c3", "c4", "c5", "c6", "c7", "c8"],
    "spend": [12500, 3400, 15800, 9900, 2100, 10000, 7600, 4300],
    "orders": [7, 6, 3, 5, 1, 5, 2, 8],
})
# твій код
`,
          solution: `import numpy as np
import pandas as pd
df = pd.DataFrame({
    "client": ["c1", "c2", "c3", "c4", "c5", "c6", "c7", "c8"],
    "spend": [12500, 3400, 15800, 9900, 2100, 10000, 7600, 4300],
    "orders": [7, 6, 3, 5, 1, 5, 2, 8],
})
big = df["spend"] >= 10000
frequent = df["orders"] >= 5
df["segment"] = np.select([big & frequent, big, frequent], ["vip", "big", "frequent"], default="regular")
print(df["segment"].value_counts().sort_index())`,
          expected: `segment
big         1
frequent    3
regular     2
vip         2
Name: count, dtype: int64`,
          check: `import pandas as pd
df = need("df", pd.DataFrame)
expect("segment" in df.columns, "Додай у df колонку segment")
expect(list(df["segment"]) == ["vip", "frequent", "big", "frequent", "regular", "vip", "regular", "frequent"], "Перевір порядок умов: vip має йти першим, інакше його перехопить big або frequent")`,
          hint: 'np.select([big &amp; frequent, big, frequent], [...], default="regular"): найвужча умова перша.',
        },
      ],
    },
  ],
};
