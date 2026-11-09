export default {
  id: 'p2',
  level: 2,
  title: 'Функції і логіка',
  description: 'Функції з параметрами за замовчуванням, try/except для битих записів, Counter і defaultdict, дати через datetime, сортування за ключем.',
  tasks: [
    {
      id: 'p2-1',
      title: 'Замовлення з помилками',
      skills: ['try/except', 'datetime.strptime', 'defaultdict', 'Counter'],
      story: `<p>Інтернет-магазин побутової техніки вивантажив квітневі замовлення рядками <code>номер;дата;місто;кількість;ціна</code> у список <code>ORDERS</code>. Частину рядків менеджери вводили вручну, і там трапляються помилки.</p>
<p>Фінансист питає: скільки виручки підтверджено коректними замовленнями, яке місто веде і яка частка рядків іде на виправлення?</p>`,
      setup: `ORDERS = [
    "1001;2026-04-01;Київ;2;1249.00",
    "1002;2026-04-01;Львів;1;3899.90",
    "1003;2026-04-02;Одеса;три;799.00",
    "1004;2026-04-02;Київ;1;5490.00",
    "1005;2026-04-31;Дніпро;2;999.50",
    "1006;2026-04-03;Львів;4;349.00",
    "1007;2026-04-03;Харків;1",
    "1008;2026-04-04;Київ;0;1249.00",
    "1009;2026-04-04;Одеса;3;799.00",
    "1010;2026-04-05;Дніпро;1;2199.00",
    "1011;2026-04-05;Львів;2;1 249,00",
    "1012;2026-04-06;Харків;5;189.90",
    "1013;2026-04-06;Київ;1;3899.90",
    "1014;06.04.2026;Одеса;1;5490.00",
    "1015;2026-04-07;Дніпро;2;1249.00",
    "1016;2026-04-07;Харків;1;-349.00",
    "1017;2026-04-08;Львів;1;5490.00",
    "1018;2026-04-08;Київ;3;349.00",
]`,
      steps: [
        {
          title: 'Функція розбору',
          task: `<p>Напиши функцію <code>parse_order(line)</code>, що повертає словник <code>{"id": int, "date": datetime.date, "city": str, "qty": int, "price": float}</code> або піднімає <code>ValueError</code> з однією з причин, перевіряючи в такому порядку:</p>
<ul><li><code>неправильна кількість полів</code>: полів не 5;</li>
<li><code>некоректна дата</code>: дата не у форматі <code>РРРР-ММ-ДД</code> або такого дня немає;</li>
<li><code>кількість не ціле число</code>, потім <code>кількість має бути більше 0</code>;</li>
<li><code>ціна не число</code>, потім <code>ціна має бути більше 0</code>.</li></ul>
<p>Виведи <code>parse_order(ORDERS[0])</code>.</p>`,
          starter: `from datetime import datetime

def parse_order(line):
    parts = line.split(";")
    # перевір поля, дату, кількість і ціну
    return None

print(parse_order(ORDERS[0]))
`,
          hint: 'datetime.strptime сам піднімає ValueError і для чужого формату, і для 31 квітня. Обгорни кожне перетворення в окремий try/except і в except підніми ValueError уже зі своєю причиною: так текст помилки буде однаковим, хоч би що зламалось.',
          solution: `from datetime import datetime

def parse_order(line):
    parts = [p.strip() for p in line.split(";")]
    if len(parts) != 5:
        raise ValueError("неправильна кількість полів")
    order_id, raw_date, city, raw_qty, raw_price = parts
    try:
        day = datetime.strptime(raw_date, "%Y-%m-%d").date()
    except ValueError:
        raise ValueError("некоректна дата")
    try:
        qty = int(raw_qty)
    except ValueError:
        raise ValueError("кількість не ціле число")
    if qty <= 0:
        raise ValueError("кількість має бути більше 0")
    try:
        price = float(raw_price)
    except ValueError:
        raise ValueError("ціна не число")
    if price <= 0:
        raise ValueError("ціна має бути більше 0")
    return {"id": int(order_id), "date": day, "city": city, "qty": qty, "price": price}

print(parse_order(ORDERS[0]))`,
          expected: `{'id': 1001, 'date': datetime.date(2026, 4, 1), 'city': 'Київ', 'qty': 2, 'price': 1249.0}`,
          check: `from datetime import date as _date
parse_order = need("parse_order")
expect(callable(parse_order), "parse_order має бути функцією")
r = parse_order(ORDERS[0])
want = {"id": 1001, "date": _date(2026, 4, 1), "city": "Київ", "qty": 2, "price": 1249.0}
expect(isinstance(r, dict), f"parse_order має повертати словник, а повернула {type(r).__name__}")
expect(type(r.get("date")) is _date, "date має бути datetime.date: візьми .date() від результату strptime")
expect(r == want, f"parse_order(ORDERS[0]) має повернути {want}, а повернула {r}")
cases = [
    ("1;2026-04-01;Київ;1", "неправильна кількість полів"),
    ("1;2026-04-01;Київ;1;10;5", "неправильна кількість полів"),
    ("1;2026-04-31;Київ;1;10", "некоректна дата"),
    ("1;01.04.2026;Київ;1;10", "некоректна дата"),
    ("1;2026-04-01;Київ;два;10", "кількість не ціле число"),
    ("1;2026-04-01;Київ;0;10", "кількість має бути більше 0"),
    ("1;2026-04-01;Київ;1;10,5", "ціна не число"),
    ("1;2026-04-01;Київ;1;-3", "ціна має бути більше 0"),
]
for line, reason in cases:
    try:
        parse_order(line)
    except ValueError as exc:
        expect(str(exc) == reason, f"Для рядка {line!r} причина має бути «{reason}», а зараз «{exc}»")
    except Exception as exc:
        expect(False, f"Для рядка {line!r} функція має піднімати ValueError, а підняла {type(exc).__name__}")
    else:
        expect(False, f"parse_order({line!r}) має підняти ValueError з причиною «{reason}»")`,
        },
        {
          title: 'Коректні окремо, помилки окремо',
          task: `<p>На вході <code>ORDERS</code> і <code>parse_order</code>. Пройди всі рядки і склади два списки: <code>good</code> зі словниками коректних замовлень і <code>errors</code> з кортежами <code>(номер рядка, причина)</code>, де рядки нумеруються з 1. Один битий рядок не має зупиняти розбір решти.</p>
<p>Виведи <code>Коректних: N, з помилками: M</code>, а потім кожну помилку рядком <code>рядок 3: кількість не ціле число</code>.</p>`,
          starter: `good = []
errors = []
for line in ORDERS:
    good.append(parse_order(line))
`,
          hint: 'enumerate(ORDERS, start=1) дає номер рядка разом із самим рядком. Текст причини береться з перехопленого винятку: except ValueError as exc, потім str(exc).',
          solution: `good = []
errors = []
for n, line in enumerate(ORDERS, start=1):
    try:
        good.append(parse_order(line))
    except ValueError as exc:
        errors.append((n, str(exc)))

print(f"Коректних: {len(good)}, з помилками: {len(errors)}")
for n, reason in errors:
    print(f"рядок {n}: {reason}")`,
          expected: `Коректних: 11, з помилками: 7
рядок 3: кількість не ціле число
рядок 5: некоректна дата
рядок 7: неправильна кількість полів
рядок 8: кількість має бути більше 0
рядок 11: ціна не число
рядок 14: некоректна дата
рядок 16: ціна має бути більше 0`,
          check: `good = need("good", list)
errors = need("errors", list)
want = [(3, "кількість не ціле число"), (5, "некоректна дата"), (7, "неправильна кількість полів"), (8, "кількість має бути більше 0"), (11, "ціна не число"), (14, "некоректна дата"), (16, "ціна має бути більше 0")]
expect(all(isinstance(e, tuple) and len(e) == 2 for e in errors), "Кожна помилка має бути кортежем (номер рядка, причина)")
expect([e[0] for e in errors] == [w[0] for w in want], f"Помилки мають бути в рядках {[w[0] for w in want]} (нумерація з 1), а зараз {[e[0] for e in errors]}")
expect(errors == want, f"Причини помилок мають бути: {want}")
expect(len(good) == len(ORDERS) - len(want), f"Коректних замовлень має бути {len(ORDERS) - len(want)}, а зараз {len(good)}")
expect([g["id"] for g in good] == [int(line.split(";")[0]) for n, line in enumerate(ORDERS, start=1) if n not in dict(want)], "У good мають бути всі коректні замовлення в порядку ORDERS")`,
        },
        {
          title: 'Виручка за містами',
          task: `<p>На вході <code>good</code>. Порахуй виручку (кількість × ціна) за кожним містом через <code>defaultdict</code>, а потім збери звичайний словник <code>revenue</code>: місто → виручка, округлена до 2 знаків, міста за спаданням виручки.</p>
<p>Виведи кожне місто рядком: назва ліворуч у полі 8, виручка праворуч у полі 10 з двома знаками.</p>`,
          starter: `from collections import defaultdict

sums = defaultdict(float)
revenue = {}
`,
          hint: 'defaultdict(float) дає 0.0 для нового ключа, тож можна одразу додавати. Порядок у звичайному словнику задає порядок вставки: вставляй міста вже відсортованими за значенням, sorted(sums.items(), key=..., reverse=True).',
          solution: `from collections import defaultdict

sums = defaultdict(float)
for o in good:
    sums[o["city"]] += o["qty"] * o["price"]

revenue = {}
for city, total in sorted(sums.items(), key=lambda kv: kv[1], reverse=True):
    revenue[city] = round(total, 2)

for city, total in revenue.items():
    print(f"{city:<8}{total:>10.2f}")`,
          expected: `Київ      12934.90
Львів     10785.90
Дніпро     4697.00
Одеса      2397.00
Харків      949.50`,
          check: `revenue = need("revenue", dict)
bad = {3, 5, 7, 8, 11, 14, 16}
ref = {}
for n, line in enumerate(ORDERS, start=1):
    if n in bad:
        continue
    p = line.split(";")
    ref[p[2]] = ref.get(p[2], 0) + int(p[3]) * float(p[4])
expect(set(revenue) == set(ref), f"У revenue мають бути міста: {sorted(ref)}")
for city, total in ref.items():
    expect(approx(revenue[city], round(total, 2)), f"Виручка {city} має бути {total:.2f}, а зараз {revenue[city]}")
vals = list(revenue.values())
expect(vals == sorted(vals, reverse=True), "Міста в revenue мають іти за спаданням виручки")`,
        },
        {
          title: 'Відповідь фінансисту',
          task: `<p>На вході <code>ORDERS</code>, <code>errors</code>, <code>revenue</code>. Порахуй причини помилок через <code>Counter</code> у змінну <code>reasons</code> і виведи чотири рядки:</p>
<pre>Підтверджена виручка: &lt;сума&gt; грн
Лідер: &lt;місто&gt;, &lt;частка&gt;% виручки
На виправлення: &lt;помилок&gt; з &lt;усього&gt; рядків (&lt;частка&gt;%)
Найчастіша причина: &lt;причина&gt; (&lt;кількість&gt;)</pre>
<p>Сума з пробілом між тисячами і двома знаками після коми (<code>12 345.60</code>), відсотки з одним знаком.</p>`,
          starter: `from collections import Counter

reasons = Counter()
`,
          hint: 'Counter приймає будь-яку послідовність, тож причини можна витягнути з errors генератором. most_common(1) повертає список з однієї пари (причина, кількість). Лідер уже стоїть першим у revenue.',
          solution: `from collections import Counter

reasons = Counter(reason for n, reason in errors)
total = sum(revenue.values())
leader = next(iter(revenue))
top_reason, top_count = reasons.most_common(1)[0]

print(f"Підтверджена виручка: {total:,.2f} грн".replace(",", " "))
print(f"Лідер: {leader}, {revenue[leader] / total * 100:.1f}% виручки")
print(f"На виправлення: {len(errors)} з {len(ORDERS)} рядків ({len(errors) / len(ORDERS) * 100:.1f}%)")
print(f"Найчастіша причина: {top_reason} ({top_count})")`,
          expected: `Підтверджена виручка: 31 764.30 грн
Лідер: Київ, 40.7% виручки
На виправлення: 7 з 18 рядків (38.9%)
Найчастіша причина: некоректна дата (2)`,
          check: `from collections import Counter as _Counter
reasons = need("reasons", dict)
want = _Counter(r for n, r in errors)
expect(dict(reasons) == dict(want), f"reasons має рахувати причини з errors: {dict(want)}")`,
        },
      ],
    },
    {
      id: 'p2-2',
      title: 'Табель відвідувань',
      skills: ['datetime', 'параметри за замовчуванням', 'Counter', 'серії днів'],
      story: `<p>У невеликому офісі в Полтаві турнікет записує кожен вхід у список <code>VISITS</code>: імʼя і час у форматі <code>ДД.ММ.РРРР ГГ:ХХ</code>. Робочий день починається о <code>START</code>, працюють з понеділка по пʼятницю, люди виходять на обід і заходять знову.</p>
<p>Керівниця хоче за два тижні відзначити премією найдисциплінованішого: у кого найдовша серія робочих днів без пропусків, а за рівності менше запізнень?</p>`,
      setup: `DAYS = ["пн", "вт", "ср", "чт", "пт", "сб", "нд"]
START = "09:00"
VISITS = [
    ("Оксана", "02.03.2026 08:51"),
    ("Богдан", "02.03.2026 09:17"),
    ("Богдан", "03.03.2026 08:55"),
    ("Оксана", "03.03.2026 08:47"),
    ("Марина", "03.03.2026 08:58"),
    ("Оксана", "04.03.2026 09:12"),
    ("Марина", "04.03.2026 08:40"),
    ("Оксана", "05.03.2026 14:05"),
    ("Марина", "05.03.2026 08:56"),
    ("Оксана", "05.03.2026 08:52"),
    ("Богдан", "06.03.2026 09:31"),
    ("Марина", "06.03.2026 09:05"),
    ("Оксана", "06.03.2026 08:59"),
    ("Марина", "09.03.2026 08:44"),
    ("Оксана", "09.03.2026 13:40"),
    ("Богдан", "09.03.2026 08:50"),
    ("Оксана", "09.03.2026 08:49"),
    ("Оксана", "10.03.2026 09:03"),
    ("Богдан", "10.03.2026 09:08"),
    ("Марина", "10.03.2026 08:57"),
    ("Богдан", "11.03.2026 08:53"),
    ("Марина", "11.03.2026 08:50"),
    ("Марина", "12.03.2026 08:46"),
    ("Богдан", "12.03.2026 09:02"),
    ("Оксана", "12.03.2026 08:54"),
    ("Богдан", "13.03.2026 12:30"),
    ("Оксана", "13.03.2026 08:58"),
    ("Богдан", "13.03.2026 08:57"),
    ("Марина", "13.03.2026 08:59"),
]`,
      steps: [
        {
          title: 'Перший вхід за день',
          task: `<p>Напиши функцію <code>parse_ts(ts, fmt="%d.%m.%Y %H:%M")</code>, що перетворює рядок на <code>datetime</code>. Потім створи словник <code>first_in</code>: ключ <code>(імʼя, дата)</code>, де дата це <code>datetime.date</code>, значення: найраніший вхід цієї людини за цей день.</p>
<p>Порахуй через <code>Counter</code> відвідування за днями тижня у <code>by_weekday</code> (ключі з <code>DAYS</code>, одне відвідування = один ключ <code>first_in</code>) і виведи <code>Входів: N, робочих відвідувань: M</code>, а потім рядки <code>пн: 5</code> від понеділка до пʼятниці.</p>`,
          starter: `from datetime import datetime
from collections import Counter

def parse_ts(ts, fmt="%d.%m.%Y %H:%M"):
    return ts

first_in = {}
by_weekday = Counter()
`,
          hint: 'Пройди VISITS і для кожного ключа (імʼя, dt.date()) лиши менший із двох часів: того, що вже лежить у словнику, і нового. Номер дня тижня дає dt.weekday(): 0 це понеділок, і він же індекс у DAYS.',
          solution: `from datetime import datetime
from collections import Counter

def parse_ts(ts, fmt="%d.%m.%Y %H:%M"):
    return datetime.strptime(ts, fmt)

first_in = {}
for name, ts in VISITS:
    dt = parse_ts(ts)
    key = (name, dt.date())
    if key not in first_in or dt < first_in[key]:
        first_in[key] = dt

by_weekday = Counter(DAYS[day.weekday()] for name, day in first_in)

print(f"Входів: {len(VISITS)}, робочих відвідувань: {len(first_in)}")
for d in DAYS[:5]:
    print(f"{d}: {by_weekday[d]}")`,
          expected: `Входів: 29, робочих відвідувань: 26
пн: 5
вт: 6
ср: 4
чт: 5
пт: 6`,
          check: `from datetime import datetime as _dt
first_in = need("first_in", dict)
by_weekday = need("by_weekday", dict)
parse_ts = need("parse_ts")
expect(parse_ts("02.03.2026 08:51") == _dt(2026, 3, 2, 8, 51), "parse_ts має повертати datetime для формату ДД.ММ.РРРР ГГ:ХХ")
expect(parse_ts("2026-03-02", "%Y-%m-%d") == _dt(2026, 3, 2), "Другий параметр fmt має задавати формат")
ref = {}
for name, ts in VISITS:
    dt = _dt.strptime(ts, "%d.%m.%Y %H:%M")
    k = (name, dt.date())
    ref[k] = min(ref.get(k, dt), dt)
expect(len(first_in) == len(ref), f"У first_in має бути {len(ref)} пар (імʼя, дата), а зараз {len(first_in)}")
for k, dt in ref.items():
    expect(k in first_in, f"Немає ключа {k}: ключ це (імʼя, datetime.date)")
    expect(first_in[k] == dt, f"Для {k[0]} {k[1]} перший вхід о {dt:%H:%M}, а у first_in {first_in[k]}")
for i, d in enumerate(DAYS):
    n = sum(1 for (name, day) in ref if day.weekday() == i)
    expect(by_weekday.get(d, 0) == n, f"by_weekday[{d!r}] має бути {n}")`,
        },
        {
          title: 'Запізнення',
          task: `<p>На вході <code>first_in</code> і <code>START</code>. Напиши функцію <code>minutes_late(dt, start=START, grace=5)</code>: скільки хвилин людина запізнилась після <code>start</code>. Запізнення до <code>grace</code> хвилин включно не рахується (функція повертає 0), а більше рахується повністю: прихід о 09:12 це 12 хвилин.</p>
<p>Створи <code>late_days</code> (<code>Counter</code>: імʼя → кількість днів із запізненням) і <code>late_total</code> (імʼя → сума хвилин запізнень, для всіх людей, навіть із нулем). Виведи для кожної людини за абеткою рядок <code>Богдан: запізнень 3, хвилин 56</code>.</p>`,
          starter: `def minutes_late(dt, start=START, grace=5):
    return 0

late_days = Counter()
late_total = {}
`,
          hint: 'Розбери start через strptime з форматом "%H:%M" і порівнюй хвилини від початку доби: dt.hour * 60 + dt.minute. Межа: рівно grace хвилин ще не запізнення.',
          solution: `def minutes_late(dt, start=START, grace=5):
    s = datetime.strptime(start, "%H:%M")
    diff = (dt.hour * 60 + dt.minute) - (s.hour * 60 + s.minute)
    return diff if diff > grace else 0

late_days = Counter()
late_total = {}
for (name, day), dt in first_in.items():
    m = minutes_late(dt)
    late_total[name] = late_total.get(name, 0) + m
    if m > 0:
        late_days[name] += 1

for name in sorted(late_total):
    print(f"{name}: запізнень {late_days[name]}, хвилин {late_total[name]}")`,
          expected: `Богдан: запізнень 3, хвилин 56
Марина: запізнень 0, хвилин 0
Оксана: запізнень 1, хвилин 12`,
          check: `from datetime import datetime as _dt
minutes_late = need("minutes_late")
late_days = need("late_days", dict)
late_total = need("late_total", dict)
d = lambda hm: _dt.strptime("02.03.2026 " + hm, "%d.%m.%Y %H:%M")
expect(minutes_late(d("09:12")) == 12, "minutes_late для 09:12 має дати 12")
expect(minutes_late(d("09:05")) == 0, "Рівно 5 хвилин ще не запізнення: має бути 0")
expect(minutes_late(d("09:06")) == 6, "09:06 це вже запізнення на 6 хвилин")
expect(minutes_late(d("08:40")) == 0, "Ранній прихід дає 0, а не відʼємне число")
expect(minutes_late(d("10:20"), start="10:00") == 20, "Параметр start має змінювати початок дня")
expect(minutes_late(d("09:12"), grace=15) == 0, "Параметр grace має змінювати поблажку")
ref_days, ref_total = {}, {}
for (name, day), dt in first_in.items():
    m = dt.hour * 60 + dt.minute - 540
    m = m if m > 5 else 0
    ref_total[name] = ref_total.get(name, 0) + m
    ref_days[name] = ref_days.get(name, 0) + (1 if m else 0)
for name in ref_total:
    expect(late_total.get(name) == ref_total[name], f"У {name} сума запізнень {ref_total[name]} хв, а в late_total {late_total.get(name)}")
    expect(late_days.get(name, 0) == ref_days[name], f"У {name} днів із запізненням {ref_days[name]}, а в late_days {late_days.get(name, 0)}")`,
        },
        {
          title: 'Найдовша серія',
          task: `<p>Напиши функцію <code>longest_streak(days)</code>: на вході список дат (у будь-якому порядку, можливо з повторами), на виході довжина найдовшої серії робочих днів поспіль. Вихідні серію не рвуть: пʼятниця і наступний понеділок стоять поруч. Порожній список дає 0.</p>
<p>Потім створи <code>streaks</code>: імʼя → найдовша серія за <code>first_in</code>, і виведи його з іменами за абеткою.</p>`,
          starter: `from datetime import timedelta

def longest_streak(days):
    return len(days)

streaks = {}
`,
          hint: 'Відсортуй унікальні дати і йди парами сусідів. Наступний робочий день після пʼятниці (weekday() == 4) настає через 3 дні, після інших днів через 1. Якщо сусід збігається з наступним робочим днем, серія росте, інакше починається знову з 1.',
          solution: `from datetime import timedelta

def next_workday(d):
    return d + timedelta(days=3 if d.weekday() == 4 else 1)

def longest_streak(days):
    days = sorted(set(days))
    best = 0
    run = 0
    prev = None
    for d in days:
        run = run + 1 if prev is not None and d == next_workday(prev) else 1
        best = max(best, run)
        prev = d
    return best

names = sorted({name for name, day in first_in})
streaks = {name: longest_streak([day for n, day in first_in if n == name]) for name in names}
print(streaks)`,
          expected: `{'Богдан': 6, 'Марина': 9, 'Оксана': 7}`,
          check: `from datetime import date as _d
longest_streak = need("longest_streak")
streaks = need("streaks", dict)
expect(longest_streak([]) == 0, "Порожній список має давати 0")
expect(longest_streak([_d(2026, 3, 6), _d(2026, 3, 9)]) == 2, "Пʼятниця 06.03 і понеділок 09.03 стоять поруч: серія 2")
expect(longest_streak([_d(2026, 3, 2), _d(2026, 3, 4)]) == 1, "Понеділок і середа без вівторка: серія 1")
expect(longest_streak([_d(2026, 3, 4), _d(2026, 3, 2), _d(2026, 3, 3)]) == 3, "Порядок дат не має значення: 02-04.03 це серія 3")
expect(longest_streak([_d(2026, 3, 2), _d(2026, 3, 2), _d(2026, 3, 3)]) == 2, "Повтори дати не подовжують серію")
expect(longest_streak([_d(2026, 3, 5), _d(2026, 3, 9)]) == 1, "Четвер і понеділок без пʼятниці: серія 1")
want = {"Богдан": 6, "Марина": 9, "Оксана": 7}
expect(streaks == want, f"streaks має бути {want}, а зараз {streaks}")`,
        },
        {
          title: 'Кому премія',
          task: `<p>На вході <code>first_in</code>, <code>late_days</code>, <code>late_total</code>, <code>streaks</code>. Виведи таблицю: спершу найдовша серія, за рівної серії менше днів із запізненням, далі за іменем. Колонки: імʼя ліворуч у полі 8, а <code>Днів</code> (кількість відвідувань), <code>Запізнень</code>, <code>Хвилин</code>, <code>Серія</code> праворуч у полях по 10.</p>
<p>Останній рядок: <code>Премія: імʼя</code> людини з першого рядка таблиці.</p>`,
          starter: `print(f"{'Імʼя':<8}{'Днів':>10}{'Запізнень':>10}{'Хвилин':>10}{'Серія':>10}")
`,
          hint: 'Кількість відвідувань людини: скільки ключів first_in мають її імʼя. Ключ сортування кортежем: (-серія, днів запізнень, імʼя).',
          solution: `visits = Counter(name for name, day in first_in)
ranked = sorted(streaks, key=lambda n: (-streaks[n], late_days[n], n))

print(f"{'Імʼя':<8}{'Днів':>10}{'Запізнень':>10}{'Хвилин':>10}{'Серія':>10}")
for n in ranked:
    print(f"{n:<8}{visits[n]:>10}{late_days[n]:>10}{late_total[n]:>10}{streaks[n]:>10}")
print(f"Премія: {ranked[0]}")`,
          expected: `Імʼя          Днів Запізнень    Хвилин     Серія
Марина           9         0         0         9
Оксана           9         1        12         7
Богдан           8         3        56         6
Премія: Марина`,
        },
      ],
    },
    {
      id: 'p2-3',
      title: 'Знижки і ПДВ',
      skills: ['параметри за замовчуванням', 'порогові знижки', 'вкладені словники', 'min з key'],
      story: `<p>Магазин обладнання для кавʼярень продає юрособам. Ціни в каталозі без ПДВ, знижка рахується від суми кошика без ПДВ, ПДВ 20% додається після знижки. Зараз діє схема порогових знижок <code>TIERS</code>, маркетинг пропонує ще дві схеми з <code>POLICIES</code>.</p>
<p>Яку схему вигідно запропонувати кожному з трьох типових клієнтів із <code>CARTS</code> і скільки він заощадить проти поточних порогів?</p>`,
      setup: `TIERS = [(5000, 0.05), (20000, 0.10), (2000, 0.02)]
VAT = 0.20
POLICIES = {
    "Пороги": TIERS,
    "Промокод 7%": [(0, 0.07)],
    "Клубна картка": [(3000, 0.04), (12000, 0.08)],
}
CARTS = {
    "Кавʼярня на Подолі": [("Кавомашина", 18990.00, 1), ("Кавомолка", 4350.00, 1), ("Пітчер 0,6 л", 389.00, 4)],
    "Офіс у Львові": [("Чайник", 1299.00, 2), ("Крапельна кавоварка", 2490.00, 1), ("Чашка", 159.00, 12)],
    "Пекарня в Одесі": [("Тістоміс", 12400.00, 1), ("Ваги", 1890.00, 2)],
}`,
      steps: [
        {
          title: 'Ставка знижки',
          task: `<p>Напиши функцію <code>discount_rate(total, tiers=TIERS)</code>: ставка за найвищим порогом, якого досягла сума (сума, рівна порогу, теж досягла). Пороги в списку йдуть не по порядку. Жодного порогу не досягнуто: 0.0.</p>
<p>Виведи ставки для сум 1999.99, 2000, 4999.99, 5000 і 25000 через пробіл.</p>`,
          starter: `def discount_rate(total, tiers=TIERS):
    for threshold, rate in tiers:
        if total >= threshold:
            return rate
    return 0.0
`,
          hint: 'Перший знайдений поріг не обовʼязково найвищий, бо список не впорядкований. Можна відсортувати пороги за спаданням або зібрати ставки всіх досягнутих порогів і взяти найбільшу.',
          solution: `def discount_rate(total, tiers=TIERS):
    best = 0.0
    for threshold, rate in tiers:
        if total >= threshold and rate > best:
            best = rate
    return best

print(*[discount_rate(t) for t in [1999.99, 2000, 4999.99, 5000, 25000]])`,
          expected: `0.0 0.02 0.02 0.05 0.1`,
          check: `discount_rate = need("discount_rate")
cases = [(1999.99, 0.0), (2000, 0.02), (4999.99, 0.02), (5000, 0.05), (19999, 0.05), (20000, 0.10), (25000, 0.10)]
for total, rate in cases:
    got = discount_rate(total)
    expect(approx(got, rate), f"discount_rate({total}) має дати {rate}, а дала {got}")
expect(approx(discount_rate(100, [(0, 0.07)]), 0.07), "Параметр tiers має замінювати пороги: discount_rate(100, [(0, 0.07)]) це 0.07")
expect(approx(discount_rate(13000, [(12000, 0.08), (3000, 0.04)]), 0.08), "Для 13000 з порогами [(12000, 0.08), (3000, 0.04)] ставка 0.08")`,
        },
        {
          title: 'Ціна кошика',
          task: `<p>На вході <code>discount_rate</code>, <code>CARTS</code>, <code>VAT</code>. Напиши дві функції:</p>
<ul><li><code>cart_total(cart)</code>: сума ціна × кількість по позиціях кошика, без ПДВ;</li>
<li><code>final_price(cart, tiers=TIERS, vat=VAT)</code>: сума без ПДВ мінус знижка за <code>tiers</code>, потім плюс ПДВ, округлена до 2 знаків.</li></ul>
<p>Виведи для кожного кошика рядок <code>Офіс у Львові: 6996.00 без ПДВ, 7975.44 до сплати</code> за поточними порогами.</p>`,
          starter: `def cart_total(cart):
    return 0

def final_price(cart, tiers=TIERS, vat=VAT):
    return cart_total(cart)
`,
          hint: 'Знижку визначає сума без ПДВ, тому спершу cart_total, потім discount_rate від неї. Множник ціни після знижки (1 - ставка), після ПДВ ще (1 + vat).',
          solution: `def cart_total(cart):
    return sum(price * qty for name, price, qty in cart)

def final_price(cart, tiers=TIERS, vat=VAT):
    net = cart_total(cart)
    rate = discount_rate(net, tiers)
    return round(net * (1 - rate) * (1 + vat), 2)

for client, cart in CARTS.items():
    print(f"{client}: {cart_total(cart):.2f} без ПДВ, {final_price(cart):.2f} до сплати")`,
          expected: `Кавʼярня на Подолі: 24896.00 без ПДВ, 26887.68 до сплати
Офіс у Львові: 6996.00 без ПДВ, 7975.44 до сплати
Пекарня в Одесі: 16180.00 без ПДВ, 18445.20 до сплати`,
          check: `cart_total = need("cart_total")
final_price = need("final_price")
for client, cart in CARTS.items():
    net = sum(p * q for _, p, q in cart)
    expect(approx(cart_total(cart), net), f"cart_total для «{client}» має дати {net:.2f}")
    rate = max([r for t, r in TIERS if net >= t] or [0.0])
    want = round(net * (1 - rate) * 1.2, 2)
    expect(approx(final_price(cart), want), f"final_price для «{client}» має дати {want:.2f}, а дала {final_price(cart)}")
one = [("Тест", 1000.0, 1)]
expect(approx(final_price(one, [(0, 0.10)]), 1080.0), "final_price(cart, tiers) має брати пороги з параметра: 1000 зі знижкою 10% і ПДВ це 1080.00")
expect(approx(final_price(one, [(0, 0.10)], vat=0), 900.0), "Параметр vat має замінювати ставку ПДВ: з vat=0 це 900.00")`,
        },
        {
          title: 'Усі схеми для всіх клієнтів',
          task: `<p>На вході <code>final_price</code>, <code>CARTS</code>, <code>POLICIES</code>. Створи вкладений словник <code>results</code>: клієнт → {схема → ціна до сплати}, порядок клієнтів і схем як у <code>CARTS</code> і <code>POLICIES</code>. Спробуй зібрати його одним dict comprehension.</p>
<p>Виведи <code>results["Пекарня в Одесі"]</code>.</p>`,
          starter: `results = {}
`,
          hint: 'Comprehension може бути вкладеним: зовнішній по CARTS.items(), внутрішній по POLICIES.items(). Пороги кожної схеми передай у final_price другим аргументом.',
          solution: `results = {
    client: {policy: final_price(cart, tiers) for policy, tiers in POLICIES.items()}
    for client, cart in CARTS.items()
}

print(results["Пекарня в Одесі"])`,
          expected: `{'Пороги': 18445.2, 'Промокод 7%': 18056.88, 'Клубна картка': 17862.72}`,
          check: `results = need("results", dict)
expect(list(results) == list(CARTS), f"Ключі results мають бути клієнтами в порядку CARTS: {list(CARTS)}")
for client, cart in CARTS.items():
    expect(isinstance(results[client], dict) and list(results[client]) == list(POLICIES), f"results[{client!r}] має містити схеми {list(POLICIES)}")
    net = sum(p * q for _, p, q in cart)
    for policy, tiers in POLICIES.items():
        rate = max([r for t, r in tiers if net >= t] or [0.0])
        want = round(net * (1 - rate) * 1.2, 2)
        expect(approx(results[client][policy], want), f"Для «{client}» за схемою «{policy}» ціна {want:.2f}, а в results {results[client][policy]}")`,
        },
        {
          title: 'Що пропонувати',
          task: `<p>На вході <code>results</code>. Для кожного клієнта знайди найдешевшу для нього схему і зведи це в словник <code>best</code>: клієнт → назва схеми. Виведи таблицю: клієнт ліворуч у полі 20, схема ліворуч у полі 15, ціна до сплати праворуч у полі 12, економія проти схеми <code>Пороги</code> праворуч у полі 10. Ціни й економія з двома знаками.</p>
<p>Шапка: <code>Клієнт</code>, <code>Схема</code>, <code>До сплати</code>, <code>Економія</code>.</p>`,
          starter: `best = {}
print(f"{'Клієнт':<20}{'Схема':<15}{'До сплати':>12}{'Економія':>10}")
`,
          hint: 'min по словнику перебирає ключі, а key=prices.get змушує порівнювати їх за значеннями. Економія: ціна за порогами мінус ціна за найкращою схемою.',
          solution: `best = {client: min(prices, key=prices.get) for client, prices in results.items()}

print(f"{'Клієнт':<20}{'Схема':<15}{'До сплати':>12}{'Економія':>10}")
for client, policy in best.items():
    price = results[client][policy]
    saving = results[client]["Пороги"] - price
    print(f"{client:<20}{policy:<15}{price:>12.2f}{saving:>10.2f}")`,
          expected: `Клієнт              Схема             До сплати  Економія
Кавʼярня на Подолі  Пороги             26887.68      0.00
Офіс у Львові       Промокод 7%         7807.54    167.90
Пекарня в Одесі     Клубна картка      17862.72    582.48`,
          check: `best = need("best", dict)
for client, prices in results.items():
    low = min(prices.values())
    expect(client in best, f"У best немає клієнта «{client}»")
    expect(prices.get(best[client]) == low, f"Для «{client}» найдешевша схема дає {low:.2f}, а обрана «{best[client]}»")`,
        },
      ],
    },
  ],
};
