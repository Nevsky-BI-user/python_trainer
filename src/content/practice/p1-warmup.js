export default {
  id: 'p1',
  level: 1,
  title: 'Розминка',
  description: 'Базовий Python без бібліотек: рядки, списки, словники, цикли й f-рядки на невеликих робочих журналах.',
  tasks: [
    {
      id: 'p1-1',
      title: 'Журнал кавʼярень',
      skills: ['split і strip', 'список словників', 'f-рядки з вирівнюванням'],
      story: `<p>У мережі три кавʼярні в Києві. Каса кожної зміни надсилає рядок <code>дата;точка;виручка</code>, і за тиждень набрався журнал <code>LOG</code>. Касири не дуже акуратні: подекуди зайві пробіли, а один рядок порожній.</p>
<p>Власниця питає: яка точка дає найбільшу виручку і в якої найвища середня виручка за зміну?</p>`,
      setup: `LOG = """2026-03-02;Поділ;2140.50
2026-03-02;Оболонь;1310.00
2026-03-02;Печерськ;2980.40
2026-03-03;Поділ;1875.00
 2026-03-03 ; Оболонь ;1420.30
2026-03-03;Печерськ;3150.00
2026-03-04;Поділ;2310.80
2026-03-04;Оболонь ; 690.00
2026-03-04;Поділ;1150.00

2026-03-05;Поділ;1960.20
2026-03-05;Печерськ;2760.00
2026-03-05;Оболонь;1580.70
2026-03-06;Поділ;2490.00
2026-03-06;Печерськ ;3320.60
2026-03-06;Оболонь;1705.50
2026-03-06;Поділ;640.00
"""`,
      steps: [
        {
          title: 'Розбери журнал',
          task: `<p>Перетвори рядок <code>LOG</code> на список словників <code>sales</code>. Кожен запис: <code>{"date": ..., "point": ..., "amount": ...}</code>, де дата і точка рядки без зайвих пробілів, а виручка <code>float</code>. Порожні рядки пропусти, порядок записів збережи.</p>
<p>Виведи <code>len(sales)</code>, а другим рядком <code>sales[4]</code>.</p>`,
          starter: `sales = []
for line in LOG.splitlines():
    # пропусти порожні, розріж за ";", почисть частини
    pass

print(len(sales))
`,
          hint: 'Рядок, що складається лише з пробілів, після strip() стає порожнім. Після split(";") почисть кожну частину окремо, а виручку перетвори через float.',
          solution: `sales = []
for line in LOG.splitlines():
    if not line.strip():
        continue
    date, point, amount = line.split(";")
    sales.append({"date": date.strip(), "point": point.strip(), "amount": float(amount)})

print(len(sales))
print(sales[4])`,
          expected: `16
{'date': '2026-03-03', 'point': 'Оболонь', 'amount': 1420.3}`,
          check: `sales = need("sales", list)
rows = [r for r in LOG.splitlines() if r.strip()]
expect(len(sales) == len(rows), f"У sales має бути {len(rows)} записів (без порожніх рядків), а зараз {len(sales)}")
expect(all(isinstance(r, dict) and set(r) == {"date", "point", "amount"} for r in sales), "Кожен запис має бути словником з ключами date, point, amount")
expect(all(isinstance(r["amount"], float) for r in sales), "amount має бути float, а не рядком")
expect(all(r["point"] == r["point"].strip() and r["date"] == r["date"].strip() for r in sales), "У date чи point лишились пробіли по краях: почисть кожну частину strip()")
expect([r["point"] for r in sales] == [r.split(";")[1].strip() for r in rows], "Порядок записів має бути таким самим, як у LOG")
expect(approx(sum(r["amount"] for r in sales), sum(float(r.split(";")[2]) for r in rows)), "Сума amount не збігається з журналом: перевір перетворення виручки")`,
        },
        {
          title: 'Підсумки за точками',
          task: `<p>На вході список <code>sales</code> з попереднього кроку. Створи два словники в порядку першої появи точки в журналі: <code>totals</code> (точка → сума виручки) і <code>shifts</code> (точка → кількість змін, тобто записів).</p>
<p>Виведи для кожної точки рядок <code>Поділ: змін 7, виручка 12566.50 грн</code> (виручка з двома знаками після коми).</p>`,
          starter: `totals = {}
shifts = {}
for s in sales:
    pass
`,
          hint: 'Ключа ще може не бути в словнику: totals.get(point, 0) повертає 0 для нової точки. Словник зберігає порядок вставки, тому порядок першої появи вийде сам.',
          solution: `totals = {}
shifts = {}
for s in sales:
    p = s["point"]
    totals[p] = totals.get(p, 0) + s["amount"]
    shifts[p] = shifts.get(p, 0) + 1

for p in totals:
    print(f"{p}: змін {shifts[p]}, виручка {totals[p]:.2f} грн")`,
          expected: `Поділ: змін 7, виручка 12566.50 грн
Оболонь: змін 5, виручка 6706.50 грн
Печерськ: змін 4, виручка 12211.00 грн`,
          check: `totals = need("totals", dict)
shifts = need("shifts", dict)
order = []
for r in LOG.splitlines():
    if r.strip() and r.split(";")[1].strip() not in order:
        order.append(r.split(";")[1].strip())
expect(list(totals) == order, f"Ключі totals мають іти в порядку першої появи: {order}")
expect(list(shifts) == order, f"Ключі shifts мають іти в порядку першої появи: {order}")
for p in order:
    rows = [r for r in LOG.splitlines() if r.strip() and r.split(";")[1].strip() == p]
    expect(shifts[p] == len(rows), f"У точки {p} має бути {len(rows)} змін, а в shifts {shifts[p]}")
    expect(approx(totals[p], sum(float(r.split(";")[2]) for r in rows)), f"Виручка точки {p} у totals не збігається з журналом")`,
        },
        {
          title: 'Середня зміна і частка',
          task: `<p>На вході <code>totals</code> і <code>shifts</code>. Створи:</p>
<ul><li><code>avg_shift</code>: точка → середня виручка за зміну, округлена до 2 знаків;</li>
<li><code>share</code>: точка → частка точки в загальній виручці у відсотках, округлена до 1 знака;</li>
<li><code>grand_total</code>: загальна виручка мережі.</li></ul>
<p>Виведи <code>grand_total</code> з двома знаками, потім <code>avg_shift</code> і <code>share</code>.</p>`,
          starter: `grand_total = 0
avg_shift = {}
share = {}
`,
          hint: 'Спершу загальна сума: від неї рахується кожна частка. Частка = виручка точки / загальна * 100. round(x, 1) округлює до одного знака.',
          solution: `grand_total = sum(totals.values())
avg_shift = {}
share = {}
for p in totals:
    avg_shift[p] = round(totals[p] / shifts[p], 2)
    share[p] = round(totals[p] / grand_total * 100, 1)

print(f"{grand_total:.2f}")
print(avg_shift)
print(share)`,
          expected: `31484.00
{'Поділ': 1795.21, 'Оболонь': 1341.3, 'Печерськ': 3052.75}
{'Поділ': 39.9, 'Оболонь': 21.3, 'Печерськ': 38.8}`,
          check: `need("grand_total", (int, float))
avg_shift = need("avg_shift", dict)
share = need("share", dict)
rows = [r.split(";") for r in LOG.splitlines() if r.strip()]
total = sum(float(r[2]) for r in rows)
expect(approx(grand_total, total), f"grand_total має бути {total:.2f}")
for p in sorted({r[1].strip() for r in rows}):
    amounts = [float(r[2]) for r in rows if r[1].strip() == p]
    expect(p in avg_shift and approx(avg_shift[p], round(sum(amounts) / len(amounts), 2)), f"Середня зміна точки {p} має бути {sum(amounts) / len(amounts):.2f}")
    expect(p in share and approx(share[p], round(sum(amounts) / total * 100, 1)), f"Частка точки {p} має бути {sum(amounts) / total * 100:.1f}")
expect(approx(sum(share.values()), 100), "Частки разом мають давати 100")`,
        },
        {
          title: 'Звіт власниці',
          task: `<p>На вході <code>totals</code>, <code>shifts</code>, <code>avg_shift</code>, <code>share</code>, <code>grand_total</code>. Виведи таблицю, точки за спаданням виручки, і підсумковий рядок <code>Разом</code>:</p>
<ul><li>назва точки ліворуч у полі шириною 10;</li>
<li>кількість змін праворуч у полі 6;</li>
<li>виручка праворуч у полі 12, а середня зміна праворуч у полі 11: обидві з двома знаками і пробілом між тисячами (<code>11 416.50</code>);</li>
<li>частка праворуч у полі 7 з одним знаком і знаком <code>%</code>.</li></ul>
<p>Шапка: <code>Точка</code>, <code>Змін</code>, <code>Виручка</code>, <code>Сер. зміна</code>, <code>Частка</code> з тими самими ширинами. У рядку <code>Разом</code> середня зміна рахується як вся виручка поділити на всі зміни. Останнім рядком виведи <code>Лідер за виручкою: ..., за середньою зміною: ...</code>.</p>`,
          starter: `def money(x):
    # 11416.5 -> "11 416.50"
    return str(x)

print(f"{'Точка':<10}")
`,
          hint: 'Формат ",.2f" ставить кому між тисячами, її можна замінити на пробіл через replace. Відсортуй ключі totals через sorted з key і reverse=True. Частку зручно форматувати як число, а знак % дописати рядком перед вирівнюванням.',
          solution: `def money(x):
    return f"{x:,.2f}".replace(",", " ")

print(f"{'Точка':<10}{'Змін':>6}{'Виручка':>12}{'Сер. зміна':>11}{'Частка':>7}")
for p in sorted(totals, key=lambda k: totals[k], reverse=True):
    pct = f"{share[p]:.1f}%"
    print(f"{p:<10}{shifts[p]:>6}{money(totals[p]):>12}{money(avg_shift[p]):>11}{pct:>7}")
n = sum(shifts.values())
print(f"{'Разом':<10}{n:>6}{money(grand_total):>12}{money(grand_total / n):>11}{'100.0%':>7}")
best_total = max(totals, key=lambda k: totals[k])
best_avg = max(avg_shift, key=lambda k: avg_shift[k])
print(f"Лідер за виручкою: {best_total}, за середньою зміною: {best_avg}")`,
          expected: `Точка       Змін     Виручка Сер. зміна Частка
Поділ          7   12 566.50   1 795.21  39.9%
Печерськ       4   12 211.00   3 052.75  38.8%
Оболонь        5    6 706.50   1 341.30  21.3%
Разом         16   31 484.00   1 967.75 100.0%
Лідер за виручкою: Поділ, за середньою зміною: Печерськ`,
        },
      ],
    },
    {
      id: 'p1-2',
      title: 'Список розсилки',
      skills: ['чистка рядків', 'перевірка формату', 'дублікати з порядком', 'групування'],
      story: `<p>Маркетолог зібрав адреси для розсилки з трьох форм реєстрації у список <code>RAW_EMAILS</code>. Там усе впереміш: великі літери, пробіли, порожні рядки, биті адреси й ті самі люди по кілька разів.</p>
<p>Треба отримати чистий список без повторів і відповісти: на який поштовий домен припадає найбільше адрес?</p>`,
      setup: `RAW_EMAILS = [
    "  Olena.Koval@poshta.ua",
    "ivan.petrenko@lystok.net ",
    "OLENA.KOVAL@POSHTA.UA",
    "maria_sydorenko@kvitka.com.ua",
    "andriy.bondar@lystok",
    "",
    "taras@@poshta.ua",
    "oksana.melnyk@poshta.ua",
    "   ",
    "Ivan.Petrenko@Lystok.net",
    "petro.shevchuk@poshta.ua",
    "nataliia hrytsenko@poshta.ua",
    "@poshta.ua",
    "yurii.tkachuk@lystok.net",
    "svitlana.lysenko@poshta.ua",
    "dmytro.kravets@kvitka.com.ua.",
    "Maria_Sydorenko@kvitka.com.ua",
    "roman.oliinyk@lystok.net",
    "iryna.moroz@poshta.ua ",
    "bohdan.savchuk@kvitka.com.ua",
    "roman.oliinyk@lystok.net",
]`,
      steps: [
        {
          title: 'Почисти адреси',
          task: `<p>Створи список <code>cleaned</code>: кожна адреса з <code>RAW_EMAILS</code> без пробілів по краях і в нижньому регістрі. Порожні після чистки рядки викинь, порядок збережи.</p>
<p>Виведи <code>len(cleaned)</code> і перші три адреси списком.</p>`,
          starter: `cleaned = []
for e in RAW_EMAILS:
    pass

print(len(cleaned))
`,
          hint: 'Почисти адресу, а потім перевір, чи після чистки щось лишилось. Порожній рядок у if поводиться як False.',
          solution: `cleaned = []
for e in RAW_EMAILS:
    e = e.strip().lower()
    if e:
        cleaned.append(e)

print(len(cleaned))
print(cleaned[:3])`,
          expected: `19
['olena.koval@poshta.ua', 'ivan.petrenko@lystok.net', 'olena.koval@poshta.ua']`,
          check: `cleaned = need("cleaned", list)
ref = [e.strip().lower() for e in RAW_EMAILS if e.strip()]
expect("" not in cleaned, "У cleaned лишились порожні рядки")
expect(all(e == e.strip().lower() for e in cleaned), "Не всі адреси почищені: потрібні strip() і lower()")
expect(len(cleaned) == len(ref), f"У cleaned має бути {len(ref)} адрес, а зараз {len(cleaned)}")
expect(cleaned == ref, "Адреси мають іти в тому самому порядку, що й у RAW_EMAILS")`,
        },
        {
          title: 'Відсій биті адреси',
          task: `<p>На вході <code>cleaned</code>. Адреса коректна, якщо одночасно:</p>
<ul><li>у ній рівно один символ <code>@</code> і немає пробілів;</li>
<li>частина до <code>@</code> не порожня;</li>
<li>домен (частина після <code>@</code>) містить крапку, але не починається і не закінчується нею.</li></ul>
<p>Розклади адреси у два списки <code>valid</code> і <code>invalid</code>, зберігаючи порядок. Виведи <code>Коректних: N</code>, а потім кожну биту адресу окремим рядком.</p>`,
          starter: `valid = []
invalid = []
for e in cleaned:
    pass
`,
          hint: 'Спершу перевір кількість @ через count: лише коли вона рівно 1, адресу можна безпечно розрізати split("@"). Решту умов зручно зібрати в одну змінну ok через and.',
          solution: `valid = []
invalid = []
for e in cleaned:
    ok = e.count("@") == 1 and " " not in e
    if ok:
        user, domain = e.split("@")
        ok = user != "" and "." in domain and not domain.startswith(".") and not domain.endswith(".")
    if ok:
        valid.append(e)
    else:
        invalid.append(e)

print(f"Коректних: {len(valid)}")
for e in invalid:
    print(e)`,
          expected: `Коректних: 14
andriy.bondar@lystok
taras@@poshta.ua
nataliia hrytsenko@poshta.ua
@poshta.ua
dmytro.kravets@kvitka.com.ua.`,
          check: `valid = need("valid", list)
invalid = need("invalid", list)
expected_bad = ["andriy.bondar@lystok", "taras@@poshta.ua", "nataliia hrytsenko@poshta.ua", "@poshta.ua", "dmytro.kravets@kvitka.com.ua."]
for e in expected_bad:
    expect(e in invalid, f"Адреса {e} бита, вона має бути в invalid")
    expect(e not in valid, f"Адреса {e} бита, їй не місце у valid")
expect(len(valid) + len(invalid) == len(cleaned), "Кожна адреса з cleaned має потрапити рівно в один зі списків")
expect(invalid == expected_bad, f"У invalid мають бути рівно ці адреси в такому порядку: {expected_bad}")
expect(valid == [e for e in cleaned if e not in expected_bad], "valid має містити всі інші адреси в порядку cleaned")`,
        },
        {
          title: 'Прибери повтори',
          task: `<p>На вході <code>valid</code>. Створи <code>unique</code>: адреси без повторів, кожна на місці своєї першої появи. Виведи <code>Унікальних: N, повторів прибрано: M</code>.</p>`,
          starter: `unique = list(set(valid))
`,
          hint: 'set прибирає повтори, але губить порядок. Можна йти списком і додавати адресу, лише якщо її ще немає в результаті, або взяти ключі словника dict.fromkeys.',
          solution: `unique = []
for e in valid:
    if e not in unique:
        unique.append(e)

print(f"Унікальних: {len(unique)}, повторів прибрано: {len(valid) - len(unique)}")`,
          expected: `Унікальних: 10, повторів прибрано: 4`,
          check: `unique = need("unique", list)
ref = []
for e in valid:
    if e not in ref:
        ref.append(e)
expect(len(unique) == len(set(unique)), "У unique ще є повтори")
expect(sorted(unique) == sorted(ref), f"У unique мають бути рівно {len(ref)} різних адрес з valid")
expect(unique == ref, "Порядок має бути як у першої появи адреси у valid: set його губить")`,
        },
        {
          title: 'Домени',
          task: `<p>На вході <code>unique</code>. Створи словник <code>by_domain</code>: домен → список адрес цього домену в порядку <code>unique</code>.</p>
<p>Виведи домени за спаданням кількості адрес (за однакової кількості за абеткою) у форматі <code>poshta.ua: 5</code>, а останнім рядком <code>Найбільше адрес: домен</code>.</p>`,
          starter: `by_domain = {}
`,
          hint: 'Домен: те, що після @. setdefault(domain, []) повертає список, у який одразу можна додати адресу. Для сортування за двома ознаками ключ може бути кортежем, де кількість береться з мінусом.',
          solution: `by_domain = {}
for e in unique:
    domain = e.split("@")[1]
    by_domain.setdefault(domain, []).append(e)

ranked = sorted(by_domain, key=lambda d: (-len(by_domain[d]), d))
for d in ranked:
    print(f"{d}: {len(by_domain[d])}")
print(f"Найбільше адрес: {ranked[0]}")`,
          expected: `poshta.ua: 5
lystok.net: 3
kvitka.com.ua: 2
Найбільше адрес: poshta.ua`,
          check: `by_domain = need("by_domain", dict)
ref = {}
for e in unique:
    ref.setdefault(e.split("@")[1], []).append(e)
expect(set(by_domain) == set(ref), f"Домени в by_domain мають бути: {sorted(ref)}")
for d in ref:
    expect(by_domain[d] == ref[d], f"Адреси домену {d} мають бути {ref[d]}")`,
        },
      ],
    },
    {
      id: 'p1-3',
      title: 'Залишки складу',
      skills: ['словники', 'копія замість зміни', 'сортування за ключем'],
      story: `<p>Ти ведеш склад постачання для кавʼярень. Є залишки на початок тижня <code>stock</code>, мінімальні запаси <code>minimum</code> і журнал руху <code>JOURNAL</code> у форматі <code>операція;товар;кількість</code>.</p>
<p>У пʼятницю треба відправити постачальнику замовлення: що і скільки докупити, щоб кожна позиція нижче мінімуму піднялась до подвійного мінімуму?</p>`,
      setup: `stock = {
    "Кава зерно 1 кг": 12,
    "Молоко 1 л": 30,
    "Вершки 0,5 л": 8,
    "Стаканчик 250 мл": 400,
    "Кришка 250 мл": 350,
    "Цукор стік": 900,
    "Сироп карамель": 4,
}
minimum = {
    "Кава зерно 1 кг": 10,
    "Молоко 1 л": 40,
    "Вершки 0,5 л": 10,
    "Стаканчик 250 мл": 300,
    "Кришка 250 мл": 300,
    "Цукор стік": 500,
    "Сироп карамель": 3,
    "Сироп ваніль": 3,
}
JOURNAL = [
    "надходження;Молоко 1 л;24",
    "списання;Кава зерно 1 кг;5",
    "списання;Стаканчик 250 мл;180",
    "надходження;Сироп ваніль;2",
    "списання;Молоко 1 л;31",
    "списання;Кришка 250 мл;160",
    "надходження;Кава зерно 1 кг;6",
    "списання;Вершки 0,5 л;3",
    "списання;Цукор стік;240",
    "списання;Сироп карамель;2",
    "надходження;Стаканчик 250 мл;100",
    "списання;Кава зерно 1 кг;7",
    "списання;Молоко 1 л;12",
    "надходження;Вершки 0,5 л;6",
    "списання;Сироп ваніль;1",
    "списання;Цукор стік;180",
]`,
      steps: [
        {
          title: 'Чистий рух за тиждень',
          task: `<p>Розбери <code>JOURNAL</code> і створи словник <code>delta</code>: товар → чиста зміна за тиждень (надходження зі знаком плюс, списання з мінусом), у порядку першої появи товару в журналі.</p>
<p>Виведи кожен товар рядком <code>Молоко 1 л: -19</code>, знак показуй завжди, і в плюсі теж.</p>`,
          starter: `delta = {}
for row in JOURNAL:
    op, item, qty = row.split(";")
`,
          hint: 'Кількість у журналі рядок: потрібен int. Для списання бери число з мінусом. У форматі цілого числа є прапорець +, що завжди показує знак.',
          solution: `delta = {}
for row in JOURNAL:
    op, item, qty = row.split(";")
    qty = int(qty)
    if op == "списання":
        qty = -qty
    delta[item] = delta.get(item, 0) + qty

for item, d in delta.items():
    print(f"{item}: {d:+d}")`,
          expected: `Молоко 1 л: -19
Кава зерно 1 кг: -6
Стаканчик 250 мл: -80
Сироп ваніль: +1
Кришка 250 мл: -160
Вершки 0,5 л: +3
Цукор стік: -420
Сироп карамель: -2`,
          check: `delta = need("delta", dict)
ref = {}
for row in JOURNAL:
    op, item, qty = row.split(";")
    ref[item] = ref.get(item, 0) + (int(qty) if op == "надходження" else -int(qty))
expect(set(delta) == set(ref), f"У delta мають бути всі товари з журналу: {list(ref)}")
for item in ref:
    expect(delta[item] == ref[item], f"Чиста зміна для {item} має бути {ref[item]:+d}, а зараз {delta[item]}")
expect(list(delta) == list(ref), "Товари в delta мають іти в порядку першої появи в журналі")`,
        },
        {
          title: 'Залишки на пʼятницю',
          task: `<p>На вході <code>stock</code> і <code>delta</code>. Створи <b>новий</b> словник <code>current</code> із залишками на кінець тижня: усі товари зі <code>stock</code> плюс товари, яких на складі не було (для них стартовий залишок 0). Сам <code>stock</code> не змінюй: він ще знадобиться бухгалтерії.</p>
<p>Виведи <code>current</code>.</p>`,
          starter: `current = stock
for item, d in delta.items():
    pass
`,
          hint: 'current = stock не копіює словник, а дає йому друге імʼя: зміни зачеплять і stock. Потрібна копія, наприклад через dict(stock) чи stock.copy().',
          solution: `current = dict(stock)
for item, d in delta.items():
    current[item] = current.get(item, 0) + d

print(current)`,
          expected: `{'Кава зерно 1 кг': 6, 'Молоко 1 л': 11, 'Вершки 0,5 л': 11, 'Стаканчик 250 мл': 320, 'Кришка 250 мл': 190, 'Цукор стік': 480, 'Сироп карамель': 2, 'Сироп ваніль': 1}`,
          check: `current = need("current", dict)
start = {"Кава зерно 1 кг": 12, "Молоко 1 л": 30, "Вершки 0,5 л": 8, "Стаканчик 250 мл": 400, "Кришка 250 мл": 350, "Цукор стік": 900, "Сироп карамель": 4}
expect(stock == start, "stock змінився: current має бути копією, а не тим самим словником")
expect(current is not stock, "current і stock один і той самий обʼєкт: зроби копію")
ref = dict(start)
for row in JOURNAL:
    op, item, qty = row.split(";")
    ref[item] = ref.get(item, 0) + (int(qty) if op == "надходження" else -int(qty))
expect(set(current) == set(ref), f"У current мають бути товари: {list(ref)}")
for item in ref:
    expect(current[item] == ref[item], f"Залишок {item} має бути {ref[item]}, а зараз {current[item]}")`,
        },
        {
          title: 'Що докупити',
          task: `<p>На вході <code>current</code> і <code>minimum</code>. Позиція потребує замовлення, якщо її залишок менший за мінімум. Замовляємо стільки, щоб залишок став рівним подвійному мінімуму. Товар без мінімуму в <code>minimum</code> не замовляємо.</p>
<p>Створи словник <code>to_order</code>: товар → кількість до замовлення, у порядку <code>current</code>. Виведи <code>len(to_order)</code>.</p>`,
          starter: `to_order = {}
for item, qty in current.items():
    pass

print(len(to_order))
`,
          hint: 'minimum.get(item) поверне None для товару без мінімуму, такий треба пропустити. Кількість до замовлення: подвійний мінімум мінус поточний залишок.',
          solution: `to_order = {}
for item, qty in current.items():
    low = minimum.get(item)
    if low is not None and qty < low:
        to_order[item] = 2 * low - qty

print(len(to_order))`,
          expected: `6`,
          check: `to_order = need("to_order", dict)
ref = {i: 2 * minimum[i] - q for i, q in current.items() if i in minimum and q < minimum[i]}
for i in to_order:
    expect(i in ref, f"{i} не треба замовляти: залишок {current[i]}, мінімум {minimum.get(i)}")
for i in ref:
    expect(i in to_order, f"{i} нижче мінімуму ({current[i]} < {minimum[i]}), його треба замовити")
    expect(to_order[i] == ref[i], f"Для {i} треба замовити {ref[i]}: до подвійного мінімуму {2 * minimum[i]}")`,
        },
        {
          title: 'Замовлення постачальнику',
          task: `<p>На вході <code>current</code>, <code>minimum</code>, <code>to_order</code>. Виведи таблицю замовлення: спершу найбільші кількості, за рівної кількості за назвою. Колонки: товар ліворуч у полі 18, залишок, мінімум і замовлення праворуч у полях по 9.</p>
<p>Шапка: <code>Товар</code>, <code>Залишок</code>, <code>Мінімум</code>, <code>Замовити</code>. Останній рядок: <code>Позицій у замовленні: N</code>.</p>`,
          starter: `print(f"{'Товар':<18}{'Залишок':>9}{'Мінімум':>9}{'Замовити':>9}")
`,
          hint: 'sorted приймає key, що повертає кортеж: першим елементом поклади кількість з мінусом, другим назву.',
          solution: `print(f"{'Товар':<18}{'Залишок':>9}{'Мінімум':>9}{'Замовити':>9}")
for item in sorted(to_order, key=lambda i: (-to_order[i], i)):
    print(f"{item:<18}{current[item]:>9}{minimum[item]:>9}{to_order[item]:>9}")
print(f"Позицій у замовленні: {len(to_order)}")`,
          expected: `Товар               Залишок  Мінімум Замовити
Цукор стік              480      500      520
Кришка 250 мл           190      300      410
Молоко 1 л               11       40       69
Кава зерно 1 кг           6       10       14
Сироп ваніль              1        3        5
Сироп карамель            2        3        4
Позицій у замовленні: 6`,
        },
      ],
    },
  ],
};
