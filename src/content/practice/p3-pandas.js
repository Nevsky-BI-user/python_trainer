export default {
  id: 'p3',
  level: 3,
  title: 'Аналіз у pandas',
  description: 'Чисті дані, бізнес-питання і кілька кроків до відповіді: merge, groupby з кількома агрегатами, transform, pivot_table і дати.',
  tasks: [
    {
      id: 'p3-1',
      title: 'Регіональний склад інтернет-магазину',
      skills: ['merge', 'groupby', 'частки', 'nlargest'],
      story: `<p>Ти аналітик інтернет-магазину товарів для дому. Директор хоче відкрити регіональний склад там, де найбільша виручка за січень-лютий 2026 року.</p>
<p>Є дві таблиці: замовлення (<code>ORDERS_RAW</code>) і клієнти з містом і регіоном (<code>CLIENTS_RAW</code>). Перш ніж погодити склад, з'ясуй, з чого складається виручка регіону-лідера і чи не тримається вона на одному клієнті.</p>`,
      setup: `import io
import pandas as pd

ORDERS_RAW = """order_id,date,client_id,amount
1001,2026-01-03,C01,1840
1002,2026-01-04,C07,620
1003,2026-01-05,C04,2310
1004,2026-01-07,C08,5400
1005,2026-01-08,C10,1290
1006,2026-01-09,C02,980
1007,2026-01-11,C05,3150
1008,2026-01-12,C01,2260
1009,2026-01-14,C11,870
1010,2026-01-15,C08,6120
1011,2026-01-16,C03,1450
1012,2026-01-18,C06,1980
1013,2026-01-19,C09,540
1014,2026-01-21,C02,1730
1015,2026-01-22,C12,2640
1016,2026-01-24,C04,1560
1017,2026-01-26,C01,3080
1018,2026-01-28,C08,4890
1019,2026-01-30,C10,1170
1020,2026-02-02,C07,760
1021,2026-02-03,C05,2840
1022,2026-02-05,C02,1360
1023,2026-02-06,C12,1920
1024,2026-02-09,C03,2110
1025,2026-02-10,C08,7350
1026,2026-02-12,C04,2690
1027,2026-02-14,C01,1590
1028,2026-02-16,C11,1040
1029,2026-02-18,C06,2420
1030,2026-02-20,C10,1580
1031,2026-02-23,C09,690
1032,2026-02-25,C02,2050"""

CLIENTS_RAW = """client_id,name,city,region
C01,Олена Ковальчук,Київ,Центр
C02,Андрій Мельник,Київ,Центр
C03,Ірина Бондар,Біла Церква,Центр
C04,Тарас Гнатюк,Львів,Захід
C05,Марта Федорів,Львів,Захід
C06,Богдан Савчук,Тернопіль,Захід
C07,Наталія Кравець,Харків,Схід
C08,Сергій Литвин,Дніпро,Схід
C09,Оксана Шевчук,Дніпро,Схід
C10,Дмитро Поліщук,Одеса,Південь
C11,Юлія Ткаченко,Миколаїв,Південь
C12,Віктор Остапенко,Одеса,Південь"""`,
      steps: [
        {
          title: 'Зведи замовлення з клієнтами',
          task: `<p>Прочитай <code>ORDERS_RAW</code> у <code>orders</code>, а <code>CLIENTS_RAW</code> у <code>clients</code>. Збери таблицю <code>df</code>: кожне замовлення рівно один раз, з колонками клієнта <code>name</code>, <code>city</code>, <code>region</code>.</p>
<p>Переконайся, що жодне замовлення не загубилось і не задвоїлось. Виведи двома рядками кількість рядків <code>df</code> і загальну виручку (суму <code>amount</code>).</p>`,
          starter: `# orders = ...
# clients = ...
# df = ...
`,
          hint: 'Основа таблиці: замовлення, до них підтягуються клієнти. Подумай, який how у merge зберігає всі замовлення, і як параметр validate підтвердить, що на кожне замовлення припадає один клієнт.',
          solution: `orders = pd.read_csv(io.StringIO(ORDERS_RAW))
clients = pd.read_csv(io.StringIO(CLIENTS_RAW))
df = orders.merge(clients, on="client_id", how="left", validate="many_to_one")
print(len(df))
print(df["amount"].sum())`,
          check: `orders = need("orders", pd.DataFrame)
clients = need("clients", pd.DataFrame)
df = need("df", pd.DataFrame)
expect(len(orders) == 32, f"У orders має бути 32 замовлення, а зараз {len(orders)}")
expect(len(clients) == 12, f"У clients має бути 12 клієнтів, а зараз {len(clients)}")
for col in ["order_id", "amount", "name", "city", "region"]:
    expect(col in df.columns, f"У df немає колонки {col}")
expect(len(df) == 32, f"У df має бути 32 рядки, по одному на замовлення, а зараз {len(df)}")
expect(set(df["order_id"]) == set(orders["order_id"]) and df["order_id"].is_unique, "Кожне замовлення з orders має бути в df рівно один раз")
expect(df["region"].notna().all(), "Не в усіх замовлень підтягнувся регіон клієнта")
expect(int(df["amount"].sum()) == 72280, f"Сума amount у df має бути 72280, а зараз {df['amount'].sum()}")
expect(OUTPUT.split()[:2] == ["32", "72280"], "Виведи двома рядками кількість рядків df і загальну виручку")`,
        },
        {
          title: 'Виручка і частка регіонів',
          task: `<p>Є <code>df</code> з кроку 1. Створи Series <code>region_rev</code>: виручка за регіонами, від більшої до меншої. Потім Series <code>region_share</code>: частка кожного регіону в загальній виручці у відсотках, округлена до 1 знака, у тому самому порядку.</p>
<p>Виведи <code>region_share</code>.</p>`,
          starter: `# region_rev = ...
# region_share = ...
`,
          hint: 'Частка: виручка регіону, поділена на виручку всього магазину. Загальну суму можна взяти з самої region_rev.',
          solution: `region_rev = df.groupby("region")["amount"].sum().sort_values(ascending=False)
region_share = (region_rev / region_rev.sum() * 100).round(1)
print(region_share)`,
          check: `rr = need("region_rev", pd.Series)
rs = need("region_share", pd.Series)
exp_rev = {"Схід": 26370, "Центр": 18450, "Захід": 16950, "Південь": 10510}
exp_share = {"Схід": 36.5, "Центр": 25.5, "Захід": 23.5, "Південь": 14.5}
expect(list(rr.index) == list(exp_rev), f"region_rev має йти від більшої виручки до меншої, а зараз порядок {list(rr.index)}")
expect(all(approx(rr[k], v) for k, v in exp_rev.items()), "Суми в region_rev не збігаються з виручкою регіонів")
expect(list(rs.index) == list(exp_rev), "region_share має бути в тому самому порядку, що й region_rev")
expect(all(approx(rs[k], v) for k, v in exp_share.items()), f"Частки в region_share: відсотки від загальної виручки, 1 знак. Зараз {rs.tolist()}")
expect(OUTPUT.strip() != "", "Виведи region_share")`,
        },
        {
          title: 'Середній чек і кількість клієнтів',
          task: `<p>Одна велика виручка може бути від багатьох дрібних замовлень або від кількох великих. Створи DataFrame <code>region_stats</code> з індексом <code>region</code> і колонками:</p>
<ul><li><code>orders</code>: кількість замовлень;</li><li><code>clients</code>: кількість різних клієнтів;</li><li><code>revenue</code>: виручка;</li><li><code>avg_check</code>: середній чек (виручка на одне замовлення), округлений до гривні.</li></ul>
<p>Відсортуй за <code>avg_check</code> від більшого до меншого і виведи.</p>`,
          starter: `# region_stats = ...
`,
          hint: 'groupby з agg і іменованими агрегатами дає кілька колонок за раз. Для різних клієнтів потрібна не кількість рядків, а кількість унікальних значень.',
          solution: `region_stats = df.groupby("region").agg(
    orders=("order_id", "count"),
    clients=("client_id", "nunique"),
    revenue=("amount", "sum"),
)
region_stats["avg_check"] = (region_stats["revenue"] / region_stats["orders"]).round(0)
region_stats = region_stats.sort_values("avg_check", ascending=False)
print(region_stats)`,
          check: `rs = need("region_stats", pd.DataFrame)
for col in ["orders", "clients", "revenue", "avg_check"]:
    expect(col in rs.columns, f"У region_stats немає колонки {col}")
exp = {"Схід": (8, 3, 26370, 3296), "Захід": (7, 3, 16950, 2421), "Центр": (10, 3, 18450, 1845), "Південь": (7, 3, 10510, 1501)}
expect(list(rs.index) == list(exp), f"Рядки region_stats мають іти за avg_check від більшого до меншого, а зараз порядок {list(rs.index)}")
for reg, (o, c, r, a) in exp.items():
    row = rs.loc[reg]
    expect(approx(row["orders"], o), f"{reg}: замовлень має бути {o}, а зараз {row['orders']}")
    expect(approx(row["clients"], c), f"{reg}: різних клієнтів має бути {c}, а зараз {row['clients']}. Рахуєш рядки чи унікальних клієнтів?")
    expect(approx(row["revenue"], r), f"{reg}: виручка має бути {r}, а зараз {row['revenue']}")
    expect(approx(row["avg_check"], a), f"{reg}: середній чек має бути {a}, а зараз {row['avg_check']}")
expect(OUTPUT.strip() != "", "Виведи region_stats")`,
        },
        {
          title: 'Топ-3 клієнти',
          task: `<p>Створи DataFrame <code>top3</code>: три клієнти з найбільшою виручкою за два місяці, від більшого до меншого. Колонки: <code>name</code>, <code>region</code>, <code>revenue</code> і <code>share</code> (частка клієнта в загальній виручці магазину, %, 1 знак). Виведи <code>top3</code>.</p>`,
          starter: `# top3 = ...
`,
          hint: 'Спершу виручка на клієнта: групуй за ідентифікатором і тими колонками, які мають лишитися в результаті. Три найбільші значення дає nlargest.',
          solution: `client_rev = df.groupby(["client_id", "name", "region"], as_index=False)["amount"].sum()
client_rev = client_rev.rename(columns={"amount": "revenue"})
top3 = client_rev.nlargest(3, "revenue")[["name", "region", "revenue"]]
top3["share"] = (top3["revenue"] / df["amount"].sum() * 100).round(1)
print(top3)`,
          check: `t = need("top3", pd.DataFrame)
for col in ["name", "region", "revenue", "share"]:
    expect(col in t.columns, f"У top3 немає колонки {col}")
expect(len(t) == 3, f"У top3 має бути 3 рядки, а зараз {len(t)}")
expect(list(t["name"]) == ["Сергій Литвин", "Олена Ковальчук", "Тарас Гнатюк"], f"Не ті клієнти або не той порядок: {list(t['name'])}")
expect(list(t["region"]) == ["Схід", "Центр", "Захід"], "Регіони в top3 не відповідають клієнтам")
expect(all(approx(a, b) for a, b in zip(t["revenue"], [23760, 8770, 6560])), f"Виручка клієнтів у top3 неправильна: {t['revenue'].tolist()}")
expect(all(approx(a, b) for a, b in zip(t["share"], [32.9, 12.1, 9.1])), f"share: частка від виручки всього магазину, %, 1 знак. Зараз {t['share'].tolist()}")
expect(OUTPUT.strip() != "", "Виведи top3")`,
        },
        {
          title: 'Чи стійке лідерство',
          task: `<p>Відповідь директору. Для кожного регіону знайди його найбільшого клієнта і створи дві Series з індексом <code>region</code>:</p>
<ul><li><code>top_client_share</code>: частка найбільшого клієнта у виручці свого регіону, %, 1 знак, від більшої до меншої;</li><li><code>without_top</code>: виручка регіону без його найбільшого клієнта, від більшої до меншої.</li></ul>
<p>Виведи <code>top_client_share</code>, а потім рядок у форматі <code>Без найбільшого клієнта лідирує: Регіон, 12345 грн</code>.</p>`,
          starter: `# top_client_share = ...
# without_top = ...
`,
          hint: 'Два рівні групування: спершу виручка кожного клієнта в регіоні, потім по цих сумах найбільша і загальна в межах регіону.',
          solution: `per_client = df.groupby(["region", "client_id"])["amount"].sum()
biggest = per_client.groupby("region").max()
total = per_client.groupby("region").sum()
top_client_share = (biggest / total * 100).round(1).sort_values(ascending=False)
without_top = (total - biggest).sort_values(ascending=False)
print(top_client_share)
print(f"Без найбільшого клієнта лідирує: {without_top.index[0]}, {without_top.iloc[0]} грн")`,
          check: `import re
tcs = need("top_client_share", pd.Series)
wt = need("without_top", pd.Series)
exp_share = {"Схід": 90.1, "Центр": 47.5, "Південь": 43.4, "Захід": 38.7}
exp_wt = {"Захід": 10390, "Центр": 9680, "Південь": 5950, "Схід": 2610}
expect(set(tcs.index) == set(exp_share), f"Індекс top_client_share: регіони, а зараз {list(tcs.index)}")
expect(all(approx(tcs[k], v) for k, v in exp_share.items()), f"top_client_share: частка найбільшого клієнта у виручці свого регіону, %, 1 знак. Зараз {tcs.round(1).to_dict()}")
expect(list(tcs.index) == list(exp_share), "Відсортуй top_client_share від більшої частки до меншої")
expect(set(wt.index) == set(exp_wt) and all(approx(wt[k], v) for k, v in exp_wt.items()), f"without_top: виручка регіону мінус його найбільший клієнт. Зараз {wt.to_dict()}")
expect(list(wt.index) == list(exp_wt), "Відсортуй without_top від більшої виручки до меншої")
expect(re.search(r"Без найбільшого клієнта лідирує: Захід, 10390([.]0)? грн", OUTPUT) is not None, "Не знайдено рядок «Без найбільшого клієнта лідирує: Регіон, сума грн» з правильними регіоном і сумою")`,
        },
      ],
    },
    {
      id: 'p3-2',
      title: 'Перегляд зарплат',
      skills: ['pivot_table', 'transform', 'медіана', 'map'],
      story: `<p>Ти аналітик у відділі персоналу дистриб'юторської компанії. Директор з персоналу готує перегляд зарплат і питає: де розрив між Junior і Senior найбільший, хто випадає зі своєї вилки і скільки на місяць коштуватиме підтягнути тих, хто отримує менше за медіану свого грейду у своєму відділі.</p>
<p>Дані: співробітники з грейдом і місячною зарплатою в гривнях (<code>EMP_RAW</code>) і довідник відділів (<code>DEPT_RAW</code>).</p>`,
      setup: `import io
import pandas as pd

EMP_RAW = """emp_id,name,dept_id,grade,salary
101,Олег Руденко,D1,Junior,32000
102,Ганна Лисенко,D1,Junior,35000
103,Максим Зінченко,D1,Middle,52000
104,Валерія Кушнір,D1,Middle,58000
105,Роман Гордієнко,D1,Middle,55000
106,Софія Онищенко,D1,Senior,82000
107,Петро Мороз,D1,Senior,76000
108,Аліна Ярошенко,D2,Junior,26000
109,Ігор Павленко,D2,Junior,28000
110,Христина Бойко,D2,Junior,24000
111,Віталій Сидоренко,D2,Middle,41000
112,Дарина Коваленко,D2,Middle,45000
113,Микола Тимошенко,D2,Senior,62000
114,Людмила Гуменюк,D2,Senior,39000
115,Артем Демченко,D3,Junior,23000
116,Катерина Левченко,D3,Junior,25000
117,Євген Марченко,D3,Middle,34000
118,Тетяна Кириленко,D3,Middle,37000
119,Василь Клименко,D3,Middle,33000
120,Світлана Олійник,D3,Senior,48000
121,Олександр Пономаренко,D4,Junior,30000
122,Ольга Захарченко,D4,Junior,33000
123,Денис Харченко,D4,Middle,49000
124,Анастасія Лук'яненко,D4,Middle,47000
125,Юрій Остапчук,D4,Senior,71000
126,Вікторія Мазур,D4,Senior,68000
127,Станіслав Білик,D4,Senior,45000
128,Марина Савченко,D3,Senior,51000"""

DEPT_RAW = """dept_id,dept_name
D1,Аналітика
D2,Продажі
D3,Логістика
D4,Фінанси"""`,
      steps: [
        {
          title: 'Медіана за відділами',
          task: `<p>Прочитай обидві таблиці і збери <code>staff</code>: усі співробітники з назвою відділу в колонці <code>dept_name</code>. Створи Series <code>dept_median</code>: медіанна зарплата за <code>dept_name</code>, від більшої до меншої. Виведи <code>dept_median</code>.</p>`,
          starter: `# staff = ...
# dept_median = ...
`,
          hint: 'Довідник відділів приєднується до співробітників за dept_id. Медіана в groupby працює так само, як sum чи mean.',
          solution: `emp = pd.read_csv(io.StringIO(EMP_RAW))
depts = pd.read_csv(io.StringIO(DEPT_RAW))
staff = emp.merge(depts, on="dept_id", how="left", validate="many_to_one")
dept_median = staff.groupby("dept_name")["salary"].median().sort_values(ascending=False)
print(dept_median)`,
          check: `staff = need("staff", pd.DataFrame)
expect(len(staff) == 28, f"У staff мають бути всі 28 співробітників, а зараз {len(staff)}")
expect("dept_name" in staff.columns, "У staff немає колонки dept_name")
expect(staff["dept_name"].notna().all(), "Не в усіх співробітників підтягнулась назва відділу")
dm = need("dept_median", pd.Series)
exp = {"Аналітика": 55000, "Фінанси": 47000, "Продажі": 39000, "Логістика": 34000}
expect(set(dm.index) == set(exp), f"Індекс dept_median: назви відділів, а зараз {list(dm.index)}")
expect(all(approx(dm[k], v) for k, v in exp.items()), f"Медіани відділів неправильні: {dm.to_dict()}")
expect(list(dm.index) == list(exp), "Відсортуй dept_median від більшої медіани до меншої")
expect(OUTPUT.strip() != "", "Виведи dept_median")`,
        },
        {
          title: 'Розрив між грейдами',
          task: `<p>Є <code>staff</code>. Створи DataFrame <code>grade_pivot</code>: рядки за <code>dept_name</code>, колонки <code>Junior</code>, <code>Middle</code>, <code>Senior</code> саме в такому порядку, у клітинках медіанна зарплата. Додай колонку <code>gap</code>: у скільки разів медіана Senior більша за медіану Junior, 2 знаки. Відсортуй за <code>gap</code> від більшого до меншого і виведи.</p>`,
          starter: `# grade_pivot = ...
`,
          hint: 'pivot_table з aggfunc="median" дає таблицю відділ на грейд. Порядок колонок задається списком назв у квадратних дужках.',
          solution: `grade_pivot = staff.pivot_table(index="dept_name", columns="grade", values="salary", aggfunc="median")
grade_pivot = grade_pivot[["Junior", "Middle", "Senior"]]
grade_pivot["gap"] = (grade_pivot["Senior"] / grade_pivot["Junior"]).round(2)
grade_pivot = grade_pivot.sort_values("gap", ascending=False)
print(grade_pivot)`,
          check: `gp = need("grade_pivot", pd.DataFrame)
expect(list(gp.columns) == ["Junior", "Middle", "Senior", "gap"], f"Колонки grade_pivot мають бути Junior, Middle, Senior, gap, а зараз {list(gp.columns)}")
exp = {"Аналітика": (33500, 55000, 79000, 2.36), "Фінанси": (31500, 48000, 68000, 2.16), "Логістика": (24000, 34000, 49500, 2.06), "Продажі": (26000, 43000, 50500, 1.94)}
expect(set(gp.index) == set(exp), f"Рядки grade_pivot: назви відділів, а зараз {list(gp.index)}")
for dept, (j, m, s, g) in exp.items():
    row = gp.loc[dept]
    expect(approx(row["Junior"], j) and approx(row["Middle"], m) and approx(row["Senior"], s), f"{dept}: медіани грейдів неправильні. Чи медіана, а не середнє?")
    expect(approx(row["gap"], g), f"{dept}: gap має бути {g}, а зараз {row['gap']}")
expect(list(gp.index) == list(exp), "Відсортуй grade_pivot за gap від більшого до меншого")
expect(OUTPUT.strip() != "", "Виведи grade_pivot")`,
        },
        {
          title: 'Вище медіани свого відділу',
          task: `<p>Додай у <code>staff</code> колонку <code>dept_med</code>: медіанна зарплата відділу, у якому працює людина (у кожному рядку). Створи <code>above</code>: співробітники, чия зарплата строго вища за медіану свого відділу, колонки <code>name</code>, <code>dept_name</code>, <code>salary</code>, відсортовані за <code>dept_name</code>, а всередині відділу за зарплатою від більшої.</p>
<p>Порівняй з наївним підходом: створи <code>above_company</code>, скільки людей мають зарплату строго вищу за медіану всієї компанії. Виведи <code>len(above)</code> і <code>above_company</code> двома рядками.</p>`,
          starter: `# staff["dept_med"] = ...
# above = ...
# above_company = ...
`,
          hint: 'groupby з agg повертає один рядок на відділ, а потрібне значення в кожному рядку staff. Для цього є transform.',
          solution: `staff["dept_med"] = staff.groupby("dept_name")["salary"].transform("median")
above = staff[staff["salary"] > staff["dept_med"]]
above = above.sort_values(["dept_name", "salary"], ascending=[True, False])[["name", "dept_name", "salary"]]
above_company = int((staff["salary"] > staff["salary"].median()).sum())
print(len(above))
print(above_company)`,
          check: `import numpy as np
staff = need("staff", pd.DataFrame)
expect("dept_med" in staff.columns, "У staff немає колонки dept_med")
expect(len(staff) == 28, f"staff має лишитися з 28 рядками, а зараз {len(staff)}: медіана відділу додається в кожен рядок")
meds = {"Аналітика": 55000, "Фінанси": 47000, "Продажі": 39000, "Логістика": 34000}
expect((staff["dept_med"] == staff["dept_name"].map(meds)).all(), "У dept_med кожного рядка має стояти медіана зарплати його відділу")
above = need("above", pd.DataFrame)
expect(list(above.columns) == ["name", "dept_name", "salary"], f"Колонки above мають бути name, dept_name, salary, а зараз {list(above.columns)}")
ref = staff[staff["salary"] > staff["dept_name"].map(meds)]
expect(len(above) == 12 and set(above["name"]) == set(ref["name"]), f"У above мають бути лише ті, хто строго вище медіани свого відділу; зараз рядків {len(above)}")
pairs = list(zip(above["dept_name"], above["salary"]))
expect(pairs == sorted(pairs, key=lambda p: (p[0], -p[1])), "Відсортуй above за dept_name, а всередині відділу за зарплатою від більшої")
ac = need("above_company", (int, np.integer))
expect(int(ac) == 14, f"above_company: скільки людей строго вище медіани всієї компанії. Зараз {ac}")
expect(OUTPUT.split()[:2] == ["12", "14"], "Виведи len(above) і above_company двома рядками")`,
        },
        {
          title: 'Senior, що випадає з вилки',
          task: `<p>Senior має отримувати не менше, ніж типовий Middle у своєму відділі. Створи Series <code>middle_median</code>: медіана зарплати Middle за <code>dept_name</code>. Потім DataFrame <code>anomalies</code>: Senior, чия зарплата нижча за <code>middle_median</code> свого відділу, з колонками <code>name</code>, <code>dept_name</code>, <code>salary</code>, <code>middle_median</code>. Виведи <code>anomalies</code>.</p>`,
          starter: `# middle_median = ...
# anomalies = ...
`,
          hint: 'Медіану рахуй лише по рядках Middle, а порівнюй з рядками Senior. Щоб поставити поруч медіану відділу, Series з індексом dept_name можна застосувати до колонки через map.',
          solution: `middle_median = staff[staff["grade"] == "Middle"].groupby("dept_name")["salary"].median()
seniors = staff[staff["grade"] == "Senior"].copy()
seniors["middle_median"] = seniors["dept_name"].map(middle_median)
anomalies = seniors[seniors["salary"] < seniors["middle_median"]][["name", "dept_name", "salary", "middle_median"]]
print(anomalies)`,
          check: `mm = need("middle_median", pd.Series)
exp = {"Аналітика": 55000, "Фінанси": 48000, "Продажі": 43000, "Логістика": 34000}
expect(set(mm.index) == set(exp), f"Індекс middle_median: назви відділів, а зараз {list(mm.index)}")
expect(all(approx(mm[k], v) for k, v in exp.items()), f"middle_median: медіана лише серед Middle свого відділу. Зараз {mm.to_dict()}")
an = need("anomalies", pd.DataFrame)
expect(list(an.columns) == ["name", "dept_name", "salary", "middle_median"], f"Колонки anomalies мають бути name, dept_name, salary, middle_median, а зараз {list(an.columns)}")
expect(sorted(an["name"]) == sorted(["Людмила Гуменюк", "Станіслав Білик"]), f"У anomalies мають бути лише Senior з зарплатою нижче медіани Middle свого відділу; зараз рядків {len(an)}")
expect(all(approx(m, exp[d]) for d, m in zip(an["dept_name"], an["middle_median"])), "middle_median у anomalies має відповідати відділу людини")
expect(OUTPUT.strip() != "", "Виведи anomalies")`,
        },
        {
          title: 'Скільки коштує вирівнювання',
          task: `<p>Відповідь директору з персоналу. Кожному, хто отримує менше за медіану свого грейду у своєму відділі, піднімають зарплату до цієї медіани. Додай у <code>staff</code> колонки <code>grade_med</code> (медіана пари відділ і грейд) і <code>raise</code> (на скільки треба підняти, для решти 0). Створи Series <code>raise_by_dept</code>: сума підвищень за <code>dept_name</code>, від більшої до меншої.</p>
<p>Виведи два рядки: <code>Разом на місяць: 12345 грн</code> і <code>Найдорожче: Відділ, 12345 грн</code> (суми цілими числами).</p>`,
          starter: `# staff["grade_med"] = ...
# staff["raise"] = ...
# raise_by_dept = ...
`,
          hint: 'transform працює і з групуванням за двома колонками. Від\'ємну різницю (людина вже вище медіани) обріже clip(lower=0).',
          solution: `staff["grade_med"] = staff.groupby(["dept_name", "grade"])["salary"].transform("median")
staff["raise"] = (staff["grade_med"] - staff["salary"]).clip(lower=0)
raise_by_dept = staff.groupby("dept_name")["raise"].sum().sort_values(ascending=False)
print(f"Разом на місяць: {int(raise_by_dept.sum())} грн")
print(f"Найдорожче: {raise_by_dept.index[0]}, {int(raise_by_dept.iloc[0])} грн")`,
          check: `staff = need("staff", pd.DataFrame)
for col in ["grade_med", "raise"]:
    expect(col in staff.columns, f"У staff немає колонки {col}")
expect((staff["raise"] >= 0).all(), "raise не буває від'ємним: тим, хто вже на медіані чи вище, підвищення 0")
expect(approx(staff["raise"].sum(), 52000), f"Сума raise має бути 52000, а зараз {staff['raise'].sum()}")
rb = need("raise_by_dept", pd.Series)
exp = {"Фінанси": 25500, "Продажі": 15500, "Аналітика": 7500, "Логістика": 3500}
expect(set(rb.index) == set(exp) and all(approx(rb[k], v) for k, v in exp.items()), f"Суми підвищень за відділами неправильні: {rb.to_dict()}")
expect(list(rb.index) == list(exp), "Відсортуй raise_by_dept від більшої суми до меншої")
expect(OUTPUT.strip().splitlines() == ["Разом на місяць: 52000 грн", "Найдорожче: Фінанси, 25500 грн"], "Виведи рівно два рядки у форматі «Разом на місяць: 12345 грн» і «Найдорожче: Відділ, 12345 грн», суми цілими числами")`,
        },
      ],
    },
    {
      id: 'p3-3',
      title: 'Запізнення перевізників',
      skills: ['дати', 'pivot_table', 'groupby', 'clip'],
      story: `<p>Ти аналітик логістики оптового складу. Доставки за перший квартал 2026 року везли три перевізники: Сокіл, Ланка і Обрій. Договори закінчуються в березні, і комерційний директор вирішує, з ким не продовжувати.</p>
<p>У <code>RAW</code> для кожної доставки є планова (<code>planned</code>) і фактична (<code>actual</code>) дата. За договором перший день запізнення безкоштовний, а за кожен наступний перевізник платить 300 грн.</p>`,
      setup: `import io
import pandas as pd

RAW = """delivery_id,carrier,city,planned,actual
D001,Сокіл,Київ,2026-01-05,2026-01-05
D002,Ланка,Львів,2026-01-06,2026-01-07
D003,Обрій,Харків,2026-01-07,2026-01-11
D004,Сокіл,Одеса,2026-01-09,2026-01-08
D005,Ланка,Дніпро,2026-01-12,2026-01-12
D006,Обрій,Вінниця,2026-01-13,2026-01-16
D007,Сокіл,Полтава,2026-01-15,2026-01-15
D008,Ланка,Київ,2026-01-19,2026-01-20
D009,Обрій,Львів,2026-01-20,2026-01-20
D010,Сокіл,Харків,2026-01-22,2026-01-21
D011,Ланка,Одеса,2026-01-26,2026-01-26
D012,Обрій,Дніпро,2026-01-28,2026-02-03
D013,Ланка,Вінниця,2026-02-02,2026-02-04
D014,Сокіл,Київ,2026-02-03,2026-02-03
D015,Обрій,Полтава,2026-02-04,2026-02-06
D016,Ланка,Харків,2026-02-09,2026-02-09
D017,Сокіл,Львів,2026-02-10,2026-02-12
D018,Обрій,Одеса,2026-02-11,2026-02-10
D019,Ланка,Дніпро,2026-02-16,2026-02-17
D020,Сокіл,Вінниця,2026-02-17,2026-02-17
D021,Обрій,Київ,2026-02-18,2026-02-19
D022,Ланка,Полтава,2026-02-23,2026-02-22
D023,Сокіл,Харків,2026-02-24,2026-02-23
D024,Обрій,Львів,2026-02-25,2026-02-25
D025,Сокіл,Одеса,2026-03-02,2026-03-06
D026,Ланка,Київ,2026-03-03,2026-03-04
D027,Обрій,Дніпро,2026-03-04,2026-03-04
D028,Сокіл,Полтава,2026-03-09,2026-03-12
D029,Ланка,Львів,2026-03-10,2026-03-10
D030,Обрій,Харків,2026-03-11,2026-03-10
D031,Сокіл,Київ,2026-03-16,2026-03-16
D032,Ланка,Вінниця,2026-03-17,2026-03-19
D033,Обрій,Одеса,2026-03-18,2026-03-18
D034,Сокіл,Дніпро,2026-03-23,2026-03-28
D035,Ланка,Харків,2026-03-24,2026-03-24
D036,Обрій,Полтава,2026-03-25,2026-03-24"""`,
      steps: [
        {
          title: 'Дні запізнення',
          task: `<p>Прочитай <code>RAW</code> у <code>deliveries</code> так, щоб <code>planned</code> і <code>actual</code> були датами. Додай колонки:</p>
<ul><li><code>delay</code>: на скільки днів доставка запізнилась (ціле число; якщо привезли вчасно чи раніше, то 0);</li><li><code>late</code>: True, якщо доставка запізнилась.</li></ul>
<p>Виведи двома рядками кількість запізнень і сумарну кількість днів запізнення.</p>`,
          starter: `# deliveries = ...
`,
          hint: 'Різниця двох дат дає тривалість; кількість днів з неї дістає .dt.days. Дострокова доставка дасть від\'ємне число, а запізнення не буває від\'ємним.',
          solution: `deliveries = pd.read_csv(io.StringIO(RAW), parse_dates=["planned", "actual"])
deliveries["delay"] = (deliveries["actual"] - deliveries["planned"]).dt.days.clip(lower=0)
deliveries["late"] = deliveries["delay"] > 0
print(deliveries["late"].sum())
print(deliveries["delay"].sum())`,
          check: `from datetime import date
d = need("deliveries", pd.DataFrame)
expect(len(d) == 36, f"У deliveries має бути 36 доставок, а зараз {len(d)}")
for col in ["planned", "actual"]:
    expect(pd.api.types.is_datetime64_any_dtype(d[col]), f"Колонка {col} має бути датою (datetime64), а зараз {d[col].dtype}")
for col in ["delay", "late"]:
    expect(col in d.columns, f"У deliveries немає колонки {col}")
expect(pd.api.types.is_integer_dtype(d["delay"]), f"delay має бути цілим числом днів, а зараз {d['delay'].dtype}")
expect((d["delay"] >= 0).all(), "delay не буває від'ємним: дострокова доставка означає 0 днів запізнення")
rows = [line.split(",") for line in RAW.splitlines()[1:]]
ref = [max(0, (date.fromisoformat(r[4]) - date.fromisoformat(r[3])).days) for r in rows]
expect(d["delay"].tolist() == ref, "Дні запізнення в delay не збігаються з різницею actual і planned")
expect(d["late"].dtype == bool and d["late"].tolist() == [x > 0 for x in ref], "late має бути True лише для доставок з delay більше 0")
expect(OUTPUT.split()[:2] == ["15", "38"], "Виведи двома рядками кількість запізнень і сумарну кількість днів запізнення")`,
        },
        {
          title: 'Хто запізнюється частіше',
          task: `<p>Є <code>deliveries</code> з кроку 1. Створи DataFrame <code>carrier_stats</code> з індексом <code>carrier</code> і колонками:</p>
<ul><li><code>deliveries</code>: кількість доставок;</li><li><code>late_share</code>: частка запізнень, %, 1 знак;</li><li><code>avg_late_delay</code>: середнє запізнення в днях лише серед запізнених доставок, 1 знак.</li></ul>
<p>Відсортуй за <code>late_share</code> від більшої до меншої і виведи.</p>`,
          starter: `# carrier_stats = ...
`,
          hint: 'Середнє від колонки True/False дає частку True. Середнє запізнення серед запізнених рахується на відфільтрованих рядках, а потім стає колонкою поруч.',
          solution: `carrier_stats = deliveries.groupby("carrier").agg(
    deliveries=("delivery_id", "count"),
    late_share=("late", "mean"),
)
carrier_stats["late_share"] = (carrier_stats["late_share"] * 100).round(1)
late_only = deliveries[deliveries["late"]]
carrier_stats["avg_late_delay"] = late_only.groupby("carrier")["delay"].mean().round(1)
carrier_stats = carrier_stats.sort_values("late_share", ascending=False)
print(carrier_stats)`,
          check: `cs = need("carrier_stats", pd.DataFrame)
for col in ["deliveries", "late_share", "avg_late_delay"]:
    expect(col in cs.columns, f"У carrier_stats немає колонки {col}")
exp = {"Ланка": (12, 50.0, 1.3), "Обрій": (12, 41.7, 3.2), "Сокіл": (12, 33.3, 3.5)}
expect(set(cs.index) == set(exp), f"Індекс carrier_stats: перевізники, а зараз {list(cs.index)}")
for c, (n, share, avg) in exp.items():
    row = cs.loc[c]
    expect(approx(row["deliveries"], n), f"{c}: доставок має бути {n}, а зараз {row['deliveries']}")
    expect(approx(row["late_share"], share), f"{c}: late_share має бути у відсотках з 1 знаком, а зараз {row['late_share']}")
    expect(approx(row["avg_late_delay"], avg), f"{c}: avg_late_delay рахується лише серед запізнених доставок, 1 знак. Зараз {row['avg_late_delay']}")
expect(list(cs.index) == list(exp), "Відсортуй carrier_stats за late_share від більшої до меншої")
expect(OUTPUT.strip() != "", "Виведи carrier_stats")`,
        },
        {
          title: 'Динаміка за місяцями',
          task: `<p>Середнє за квартал може ховати тренд. Додай у <code>deliveries</code> колонку <code>month</code>: місяць планової дати рядком у форматі <code>2026-01</code>. Створи <code>pivot</code>: рядки за перевізником, колонки за місяцем, у клітинках частка запізнень, %, 1 знак.</p>
<p>Створи Series <code>trend</code>: зміна частки запізнень з січня до березня (березень мінус січень), від найбільшого погіршення. Виведи <code>pivot</code> і <code>trend</code>.</p>`,
          starter: `# deliveries["month"] = ...
# pivot = ...
# trend = ...
`,
          hint: 'Місяць беремо з планової дати: доставка, запланована на кінець січня, належить січню, навіть якщо приїхала в лютому. Рядок з дати дає .dt.strftime.',
          solution: `deliveries["month"] = deliveries["planned"].dt.strftime("%Y-%m")
pivot = (deliveries.pivot_table(index="carrier", columns="month", values="late", aggfunc="mean") * 100).round(1)
trend = (pivot["2026-03"] - pivot["2026-01"]).sort_values(ascending=False)
print(pivot)
print(trend)`,
          check: `d = need("deliveries", pd.DataFrame)
expect("month" in d.columns, "У deliveries немає колонки month")
expect(set(d["month"].astype(str)) == {"2026-01", "2026-02", "2026-03"} and all(isinstance(m, str) for m in d["month"]), "month має бути рядком у форматі 2026-01")
expect(d.loc[d["delivery_id"] == "D012", "month"].iloc[0] == "2026-01", "Місяць береться з планової дати: D012 запланована на січень")
pv = need("pivot", pd.DataFrame)
expect([str(c) for c in pv.columns] == ["2026-01", "2026-02", "2026-03"], f"Колонки pivot: місяці від січня до березня, а зараз {list(pv.columns)}")
exp = {"Ланка": [50.0, 50.0, 50.0], "Обрій": [75.0, 50.0, 0.0], "Сокіл": [0.0, 25.0, 75.0]}
expect(set(pv.index) == set(exp), f"Рядки pivot: перевізники, а зараз {list(pv.index)}")
for c, vals in exp.items():
    expect(all(approx(a, b) for a, b in zip(pv.loc[c].tolist(), vals)), f"{c}: частки запізнень за місяцями неправильні, зараз {pv.loc[c].tolist()}. Потрібні відсотки")
tr = need("trend", pd.Series)
exp_tr = {"Сокіл": 75.0, "Ланка": 0.0, "Обрій": -75.0}
expect(set(tr.index) == set(exp_tr) and all(approx(tr[k], v) for k, v in exp_tr.items()), f"trend: березень мінус січень, зараз {tr.to_dict()}")
expect(list(tr.index) == list(exp_tr), "Відсортуй trend від найбільшого погіршення")
expect(OUTPUT.strip() != "", "Виведи pivot і trend")`,
        },
        {
          title: 'Штрафи і рішення',
          task: `<p>Відповідь комерційному директору. Додай у <code>deliveries</code> колонку <code>penalty</code>: 300 грн за кожен день запізнення, крім першого. Створи DataFrame <code>summary</code> з індексом <code>carrier</code> і колонками <code>penalty_q1</code> (штрафи за квартал) і <code>penalty_march</code> (штрафи лише за доставки, заплановані на березень), відсортований за <code>penalty_march</code> від більшого до меншого.</p>
<p>Виведи <code>summary</code>, а потім рядок <code>Найбільший ризик на квітень: Перевізник</code>: той, у кого найбільші березневі штрафи.</p>`,
          starter: `# deliveries["penalty"] = ...
# summary = ...
`,
          hint: 'Платних днів на один менше, ніж днів запізнення, але не менше нуля. Квартальну і березневу суми можна порахувати двома groupby і поставити в одну таблицю.',
          solution: `deliveries["penalty"] = (deliveries["delay"] - 1).clip(lower=0) * 300
summary = pd.DataFrame({
    "penalty_q1": deliveries.groupby("carrier")["penalty"].sum(),
    "penalty_march": deliveries[deliveries["month"] == "2026-03"].groupby("carrier")["penalty"].sum(),
})
summary = summary.sort_values("penalty_march", ascending=False)
print(summary)
print(f"Найбільший ризик на квітень: {summary.index[0]}")`,
          check: `d = need("deliveries", pd.DataFrame)
expect("penalty" in d.columns, "У deliveries немає колонки penalty")
expect(((d["delay"] - 1).clip(lower=0) * 300 == d["penalty"]).all(), "penalty: 300 грн за кожен день запізнення, крім першого; без запізнення 0")
s = need("summary", pd.DataFrame)
for col in ["penalty_q1", "penalty_march"]:
    expect(col in s.columns, f"У summary немає колонки {col}")
exp = {"Сокіл": (3000, 2700), "Ланка": (600, 300), "Обрій": (3300, 0)}
expect(set(s.index) == set(exp), f"Індекс summary: перевізники, а зараз {list(s.index)}")
for c, (q1, mar) in exp.items():
    expect(approx(s.loc[c, "penalty_q1"], q1), f"{c}: штрафи за квартал мають бути {q1}, а зараз {s.loc[c, 'penalty_q1']}")
    expect(approx(s.loc[c, "penalty_march"], mar), f"{c}: штрафи за березень мають бути {mar}, а зараз {s.loc[c, 'penalty_march']}")
expect(list(s.index) == list(exp), "Відсортуй summary за penalty_march від більшого до меншого")
expect("Найбільший ризик на квітень: Сокіл" in OUTPUT, "Не знайдено рядок «Найбільший ризик на квітень: Перевізник» з перевізником, у якого найбільші березневі штрафи")`,
        },
      ],
    },
  ],
};
