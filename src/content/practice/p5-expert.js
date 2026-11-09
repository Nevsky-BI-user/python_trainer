// Рівень 5: задачі, де дані приходять з кількох джерел, метод аналізу учень будує сам,
// а відповідь потребує інтерпретації. Повний цикл: очищення, структура, графік, висновок.

const cohorts = {
  id: 'p5-1',
  title: 'Утримання передплатників аудіокниг',
  skills: ['формати дат', 'merge', 'когорти', 'pivot_table', 'imshow'],
  story: `<p>Ти аналітик сервісу аудіокниг «Сторінка» з помісячною передплатою. Маркетинг каже, що березнева акція «перший місяць за 1 грн» привела рекордну кількість клієнтів, і хоче повторити її восени.</p>
<p>Є два джерела. <code>EVENTS_CSV</code>: вивантаження подій з трьох застосунків (web, android, ios), де кожна платформа пише дату по-своєму, назви подій написані як завгодно, а частина рядків вивантажилась двічі. <code>USERS_JSON</code>: довідник клієнтів з CRM з іншим форматом коду клієнта, каналом залучення і поштою; QA-команда платить тестовими акаунтами з пошти на <code>@test.local</code>.</p>
<p>Питання: чи справді клієнти з акції лишаються? Побудуй когортний аналіз утримання за платежами і з'ясуй, яка когорта тримається найкраще на 3-му місяці життя і наскільки.</p>`,
  setup: `import io
import json
import numpy as np
import pandas as pd

# Дані генеруються з фіксованим зерном. Для роботи потрібні два рядки: EVENTS_CSV і USERS_JSON.
rng = np.random.default_rng(7)
SIZES = {1: 42, 2: 38, 3: 56, 4: 40, 5: 36, 6: 44}
PROMO = {1: 0.10, 2: 0.15, 3: 0.55, 4: 0.20, 5: 0.05, 6: 0.25}
STAY = {"organic": 0.84, "referral": 0.88, "promo": 0.55}
FMT = {"web": "%Y-%m-%d %H:%M:%S", "android": "%d.%m.%Y %H:%M", "ios": "%m/%d/%Y %H:%M"}

events, users = [], []
uid = 100
for m, n in SIZES.items():
    for _ in range(n):
        uid += 1
        r = rng.random()
        channel = "promo" if r < PROMO[m] else ("referral" if r < PROMO[m] + 0.2 else "organic")
        users.append({"client": f"ST-{uid:05d}", "channel": channel, "email": f"reader{uid}@mail.example"})
        platform = str(rng.choice(["web", "android", "ios"]))
        day, hour = int(rng.integers(1, 29)), int(rng.integers(7, 23))
        start = pd.Timestamp(2025, m, day, hour, int(rng.integers(0, 60)))
        events.append((uid, start - pd.Timedelta(days=7), "trial_start", platform))
        month = m
        while month <= 9:
            events.append((uid, start + pd.DateOffset(months=month - m), "payment", platform))
            if rng.random() > STAY[channel]:
                break
            month += 1

# Тестові акаунти QA платять щомісяця
for uid in range(901, 909):
    users.append({"client": f"ST-{uid:05d}", "channel": "organic", "email": f"qa{uid}@test.local"})
    for month in range(1 + uid % 3, 10):
        events.append((uid, pd.Timestamp(2025, month, 3, 12, 0), "payment", "web"))

ev = pd.DataFrame(events, columns=["user_id", "ts", "event", "platform"]).sort_values("ts", kind="stable")
ev["event_time"] = [t.strftime(FMT[p]) for t, p in zip(ev["ts"], ev["platform"])]
spelling = ["payment", "Payment", " payment", "PAYMENT "]
ev["event"] = [spelling[i % 4] if e == "payment" else e for i, e in enumerate(ev["event"])]
ev = pd.concat([ev, ev.iloc[::37]]).sort_values("ts", kind="stable")
EVENTS_CSV = ev[["user_id", "event_time", "event", "platform"]].to_csv(index=False)

for i, u in enumerate(users):
    if i % 5 == 0:
        u["channel"] = u["channel"].capitalize() + " "
USERS_JSON = json.dumps(users, ensure_ascii=False)
del rng, SIZES, PROMO, STAY, FMT, events, users, uid, ev, spelling`,
  steps: [
    {
      title: 'Платежі з трьох платформ',
      task: `<p>Прочитай <code>EVENTS_CSV</code> і залиш лише платежі: тип події <code>payment</code> записаний з різним регістром і пробілами, а <code>trial_start</code> платежем не є. Створи DataFrame <code>pay</code> з колонками <code>user_id</code>, <code>platform</code>, <code>ts</code>, де <code>ts</code> це дата й час платежу.</p>
<p>Кожна платформа пише дату у своєму форматі: подивись на рядки web, android та ios і визнач формат кожної. Один формат для всіх тут не спрацює, а автоматичне вгадування мовчки переплутає день і місяць там, де обидва не більші за 12. Повтори рядків поки не чіпай. Виведи кількість платежів, найранішу й найпізнішу дату.</p>`,
      starter: `ev = pd.read_csv(io.StringIO(EVENTS_CSV))
print(ev.head(10))
print(ev["event"].unique())

# pay = ...
`,
      hint: 'Спершу нормалізуй event через .str.strip().str.lower(). Потім для кожної платформи окремо застосуй pd.to_datetime з явним format до її рядків; результати, складені через pd.concat, вирівнюються за індексом і лягають назад у свої рядки.',
      solution: `ev = pd.read_csv(io.StringIO(EVENTS_CSV))
ev["event"] = ev["event"].str.strip().str.lower()
pay = ev[ev["event"] == "payment"].copy()

formats = {"web": "%Y-%m-%d %H:%M:%S", "android": "%d.%m.%Y %H:%M", "ios": "%m/%d/%Y %H:%M"}
parts = [
    pd.to_datetime(pay.loc[pay["platform"] == p, "event_time"], format=f)
    for p, f in formats.items()
]
pay["ts"] = pd.concat(parts)
pay = pay[["user_id", "platform", "ts"]]
print(len(pay), pay["ts"].min(), pay["ts"].max())`,
      check: `from datetime import datetime
pay = need("pay", pd.DataFrame)
for c in ["user_id", "platform", "ts"]:
    expect(c in pay.columns, f"У pay має бути колонка {c}")
expect(pd.api.types.is_datetime64_any_dtype(pay["ts"]), f"Колонка ts має бути датою, а зараз {pay['ts'].dtype}")
expect(pay["ts"].notna().all(), "У ts лишились NaT: якийсь із форматів дат не розібрано")
raw = pd.read_csv(io.StringIO(EVENTS_CSV))
raw = raw[raw["event"].str.strip().str.lower() == "payment"]
expect(len(pay) == len(raw), f"Платежів у вивантаженні {len(raw)} (разом з повторами), а в pay {len(pay)}")
fmt = {"web": "%Y-%m-%d %H:%M:%S", "android": "%d.%m.%Y %H:%M", "ios": "%m/%d/%Y %H:%M"}
truth = sorted((int(u), pd.Timestamp(datetime.strptime(t, fmt[p]))) for u, t, p in zip(raw["user_id"], raw["event_time"], raw["platform"]))
got = sorted((int(u), pd.Timestamp(t)) for u, t in zip(pay["user_id"], pay["ts"]))
expect(got == truth, "Дати в ts не збігаються з вивантаженням: перевір, у якому порядку день і місяць пише кожна платформа")`,
    },
    {
      title: 'Повтори, тестові акаунти і канал',
      task: `<p>На вході <code>pay</code> з попереднього кроку. Розбери <code>USERS_JSON</code> у DataFrame <code>users</code> з колонками <code>user_id</code> (ціле число, як у подіях: код <code>ST-00123</code> відповідає 123), <code>channel</code> (лише <code>organic</code>, <code>referral</code>, <code>promo</code>) і <code>is_test</code> (пошта на <code>@test.local</code>).</p>
<p>Створи <code>clean</code>: платежі з <code>pay</code> без повторно вивантажених рядків (той самий клієнт і той самий момент) і без тестових акаунтів, з доданою колонкою <code>channel</code>. Виведи, скільки рядків прибрано як повтори і скільки як тестові.</p>`,
      starter: `users = pd.DataFrame(json.loads(USERS_JSON))
print(users.head())

# clean = ...
`,
      hint: 'Код клієнта перетворюється на число через .str.replace або .str[3:] і astype(int). Повтори шукай за парою колонок user_id і ts, а тестові акаунти прибирай після merge з users.',
      solution: `users = pd.DataFrame(json.loads(USERS_JSON))
users["user_id"] = users["client"].str.replace("ST-", "").astype(int)
users["channel"] = users["channel"].str.strip().str.lower()
users["is_test"] = users["email"].str.endswith("@test.local")

no_dups = pay.drop_duplicates(subset=["user_id", "ts"])
merged = no_dups.merge(users[["user_id", "channel", "is_test"]], on="user_id", how="left")
clean = merged[~merged["is_test"]].drop(columns="is_test").reset_index(drop=True)
print("повтори:", len(pay) - len(no_dups))
print("тестові:", len(merged) - len(clean))
print("лишилось:", len(clean))`,
      check: `users = need("users", pd.DataFrame)
clean = need("clean", pd.DataFrame)
for c in ["user_id", "channel", "is_test"]:
    expect(c in users.columns, f"У users має бути колонка {c}")
expect(pd.api.types.is_integer_dtype(users["user_id"]), f"user_id у users має бути цілим, як у подіях, а зараз {users['user_id'].dtype}")
expect(set(users["channel"]) == {"organic", "referral", "promo"}, f"Канали мають бути organic, referral, promo без пробілів і в нижньому регістрі, а зараз {sorted(set(users['channel']))}")
test_ids = {int(u["client"][3:]) for u in json.loads(USERS_JSON) if u["email"].endswith("@test.local")}
expect(set(users.loc[users["is_test"].astype(bool), "user_id"]) == test_ids, f"is_test має позначати {len(test_ids)} акаунти з поштою на @test.local")
expect("channel" in clean.columns and clean["channel"].notna().all(), "До clean додай канал клієнта з users")
expect(not clean["user_id"].isin(test_ids).any(), "У clean лишились платежі тестових акаунтів")
expect(not clean.duplicated(["user_id", "ts"]).any(), "У clean лишились повторно вивантажені платежі")
expect(len(clean) == 952, f"У clean має бути 952 платежі, а зараз {len(clean)}")`,
    },
    {
      title: 'Когорта і місяць життя',
      task: `<p>На вході <code>clean</code>. Додай до нього три колонки:</p>
<ul><li><code>month</code>: місяць платежу як період (<code>Period</code> з частотою місяць);</li>
<li><code>cohort</code>: місяць ПЕРШОГО платежу цього клієнта, теж період;</li>
<li><code>life</code>: ціле число, скільки календарних місяців минуло від когорти до платежу (перший платіж має 0).</li></ul>
<p>Виведи кількість клієнтів у кожній когорті.</p>`,
      starter: `# clean["month"] = ...
`,
      hint: 'Когорта однакова для всіх рядків клієнта: groupby("user_id") і transform("min") повертає значення для кожного рядка. Різницю в місяцях зручно рахувати через рік і місяць: (рік1 - рік0) * 12 + (місяць1 - місяць0).',
      solution: `clean["month"] = clean["ts"].dt.to_period("M")
clean["cohort"] = clean.groupby("user_id")["month"].transform("min")
clean["life"] = (clean["month"].dt.year - clean["cohort"].dt.year) * 12 + (clean["month"].dt.month - clean["cohort"].dt.month)
print(clean.groupby("cohort")["user_id"].nunique())`,
      check: `clean = need("clean", pd.DataFrame)
for c in ["month", "cohort", "life"]:
    expect(c in clean.columns, f"У clean має бути колонка {c}")
expect(isinstance(clean["cohort"].dtype, pd.PeriodDtype), f"cohort має бути місячним періодом, а зараз {clean['cohort'].dtype}")
first = clean.groupby("user_id")["ts"].transform("min").dt.to_period("M")
expect((clean["cohort"] == first).all(), "cohort має бути місяцем першого платежу клієнта")
expect(pd.api.types.is_integer_dtype(clean["life"]), f"life має бути цілим числом, а зараз {clean['life'].dtype}")
life = (clean["ts"].dt.year - first.dt.year) * 12 + (clean["ts"].dt.month - first.dt.month)
expect((clean["life"] == life).all(), "life: кількість календарних місяців від когорти до платежу, перший платіж має 0")`,
    },
    {
      title: 'Матриця утримання',
      task: `<p>На вході <code>clean</code> з колонками <code>cohort</code> і <code>life</code>. Створи:</p>
<ul><li><code>counts</code>: таблицю, де рядки це когорти, колонки це місяці життя 0, 1, 2…, а значення це кількість різних клієнтів, що заплатили;</li>
<li><code>retention</code>: ту саму таблицю в частках від розміру когорти (колонка 0 стає 1.0).</li></ul>
<p>Порожні клітинки, де місяць ще не настав, лишаються NaN. Виведи <code>retention</code>, округлену до 2 знаків.</p>`,
      starter: `# counts = clean.pivot_table(...)
`,
      hint: 'pivot_table з aggfunc="nunique" рахує різних клієнтів. Поділити кожен рядок на своє перше значення можна через .div(..., axis=0).',
      solution: `counts = clean.pivot_table(index="cohort", columns="life", values="user_id", aggfunc="nunique")
retention = counts.div(counts[0], axis=0)
print(retention.round(2))`,
      check: `counts = need("counts", pd.DataFrame)
retention = need("retention", pd.DataFrame)
exp = clean.groupby(["cohort", "life"])["user_id"].nunique().unstack()
expect(counts.shape == exp.shape, f"counts має форму {exp.shape}: когорти в рядках, місяці життя в колонках, а зараз {counts.shape}")
expect([int(c) for c in counts.columns] == list(exp.columns), "Колонки counts мають іти за місяцями життя: 0, 1, 2 ...")
expect(np.allclose(counts.to_numpy(float), exp.to_numpy(float), equal_nan=True), "counts: у клітинці кількість різних клієнтів когорти, що заплатили в цьому місяці життя")
expect(retention.shape == exp.shape, f"retention має ту саму форму, що й counts: {exp.shape}")
share = exp.div(exp[0], axis=0)
expect(np.allclose(retention.to_numpy(float), share.to_numpy(float), equal_nan=True), "retention: кожен рядок counts, поділений на розмір когорти (значення в колонці 0)")`,
    },
    {
      title: 'Теплова карта',
      task: `<p>На вході <code>retention</code>. Побудуй теплову карту утримання у відсотках через <code>imshow</code> (або <code>pcolormesh</code>): когорти по вертикалі з підписами <code>2025-01</code>…<code>2025-06</code>, місяці життя по горизонталі. Підпиши обидві осі, у назві графіка вкажи одиницю «%», додай шкалу кольорів (<code>colorbar</code>). Числа в клітинках через <code>ax.text</code> додай за бажанням: вони допомагають читати карту.</p>`,
      starter: `import matplotlib.pyplot as plt

fig, ax = plt.subplots(figsize=(9, 4))
`,
      hint: 'imshow приймає двовимірний масив: retention.to_numpy() * 100. Порожні клітинки NaN карта лишить прозорими. Підписи рядків задаються через ax.set_yticks(позиції, підписи), а періоди перетворюються на текст через astype(str).',
      solution: `import matplotlib.pyplot as plt

values = retention.to_numpy() * 100
fig, ax = plt.subplots(figsize=(9, 4))
im = ax.imshow(values, cmap="Blues", vmin=0, vmax=100, aspect="auto")
ax.set_xticks(range(retention.shape[1]), retention.columns)
ax.set_yticks(range(len(retention)), retention.index.astype(str))
ax.set_xlabel("Місяць життя")
ax.set_ylabel("Когорта")
ax.set_title("Утримання передплатників, %")
fig.colorbar(im, ax=ax)
for i in range(values.shape[0]):
    for j in range(values.shape[1]):
        if not np.isnan(values[i, j]):
            ax.text(j, i, f"{values[i, j]:.0f}", ha="center", va="center", color="white" if values[i, j] > 60 else "black", fontsize=8)`,
      check: `figs = figures()
expect(len(figs) == 1, f"Має бути один графік, а зараз {len(figs)}")
fig = figs[0]
fig.canvas.draw()
maps = []
for a in fig.axes:
    for item in list(a.images) + [c for c in a.collections if type(c).__name__ == "QuadMesh"]:
        maps.append((a, item))
expect(maps, "На графіку немає теплової карти: побудуй її через imshow або pcolormesh")
ax, item = maps[0]
arr = np.ma.masked_invalid(np.ma.asarray(item.get_array(), dtype=float)).filled(np.nan)
target = retention.to_numpy(float) * 100
expect(arr.shape == target.shape, f"Карта має форму {target.shape} (когорти x місяці життя), а зараз {arr.shape}")
expect(np.allclose(arr, target, equal_nan=True, atol=0.01), "Значення карти мають бути утриманням у відсотках: retention * 100")
labels = [t.get_text() for t in ax.get_yticklabels()]
missing = [str(p) for p in retention.index if str(p) not in labels]
expect(not missing, f"Підпиши рядки карти когортами, бракує: {missing}")
expect(ax.get_xlabel().strip() != "" and ax.get_ylabel().strip() != "", "Підпиши обидві осі")
expect("%" in ax.get_title(), "У назві графіка вкажи одиницю: %")
expect(len(fig.axes) >= 2, "Додай шкалу кольорів: fig.colorbar(...)")`,
    },
    {
      title: 'Висновок для маркетингу',
      task: `<p>На вході <code>retention</code> і <code>clean</code>. Створи:</p>
<ul><li><code>m3</code>: Series утримання на 3-му місяці життя (колонка 3) лише для когорт, де цей місяць уже настав;</li>
<li><code>best</code> і <code>worst</code>: когорти з найбільшим і найменшим утриманням на 3-му місяці, рядками виду <code>"2025-05"</code>;</li>
<li><code>gap_pp</code>: різницю між ними у відсоткових пунктах, округлену до 1 знака;</li>
<li><code>promo</code>: Series частки клієнтів з каналу <code>promo</code> у кожній когорті, у відсотках, округлену до 1 знака.</li></ul>
<p>Виведи <code>m3</code>, <code>promo</code> і одне речення з <code>best</code>, <code>worst</code> та <code>gap_pp</code>. Подумай, що ці числа кажуть про повтор акції.</p>`,
      starter: `# m3 = ...
`,
      hint: 'idxmax та idxmin повертають мітку когорти, str() перетворює період на "2025-05". Для частки promo візьми кожного клієнта один раз (drop_duplicates за user_id) і порахуй середнє від (channel == "promo") у groupby за когортою.',
      solution: `m3 = retention[3].dropna()
best = str(m3.idxmax())
worst = str(m3.idxmin())
gap_pp = round((m3.max() - m3.min()) * 100, 1)

first = clean.drop_duplicates("user_id")
promo = (first["channel"] == "promo").groupby(first["cohort"]).mean().mul(100).round(1)

print(m3.round(3))
print(promo)
print(f"Найкраще на 3-му місяці тримається когорта {best}, найгірше {worst}: різниця {gap_pp} п.п.")`,
      check: `m3 = need("m3", pd.Series)
best = need("best", str)
worst = need("worst", str)
gap_pp = need("gap_pp", (int, float))
promo = need("promo", pd.Series)
ref = retention[3].dropna()
expect(len(m3) == len(ref), f"У m3 мають бути лише когорти з 3-м місяцем: {len(ref)}, а зараз {len(m3)}")
expect(np.allclose(m3.to_numpy(float), ref.to_numpy(float)), "m3: колонка 3 матриці retention без порожніх значень")
expect(best == str(ref.idxmax()), f"best: когорта з найбільшим утриманням на 3-му місяці, рядком виду 2025-05, а зараз {best!r}")
expect(worst == str(ref.idxmin()), f"worst: когорта з найменшим утриманням на 3-му місяці, а зараз {worst!r}")
expect(approx(gap_pp, round((ref.max() - ref.min()) * 100, 1), tol=1e-9), "gap_pp: різниця best і worst у відсоткових пунктах (частка * 100), 1 знак")
u = clean.drop_duplicates("user_id")
ref_promo = (u["channel"] == "promo").groupby(u["cohort"]).mean() * 100
expect(len(promo) == len(ref_promo), f"promo: по одному значенню на когорту, їх {len(ref_promo)}")
expect(np.allclose(promo.to_numpy(float), ref_promo.to_numpy(float), atol=0.051), "promo: частка клієнтів каналу promo серед клієнтів когорти, у відсотках")
expect(best in OUTPUT and worst in OUTPUT, "Виведи речення-висновок з best і worst")`,
    },
  ],
};

const abcxyz = {
  id: 'p5-2',
  title: 'ABC/XYZ асортименту чайно-кавової мережі',
  skills: ['узгодження джерел', 'concat', 'ABC/XYZ', 'twinx', 'crosstab'],
  story: `<p>Мережа магазинів чаю й кави «Листок» перед плануванням закупівель на 2026 рік хоче знати, які товари тримають виручку і чий попит можна прогнозувати. Закупівельник просить два списки: що замовляти автоматично за графіком і що переглянути або прибрати.</p>
<p>Продажі 2025 року лежать у двох системах. Інтернет-магазин (<code>ONLINE_CSV</code>) вивантажує через крапку з комою, з українськими назвами колонок, артикулами в різному регістрі з пробілами і сумою виду <code>"26 035,80 грн"</code>. Каси магазинів (<code>SHOPS_CSV</code>) знають товар лише за числовим кодом і пишуть виручку в копійках. Зв'язок артикула і коду, а також назви товарів лежать у довіднику <code>CATALOG</code>.</p>
<p>Метод: ABC ділить товари за внеском у виручку, XYZ за стабільністю місячного попиту. Перетин AX це основа асортименту з передбачуваним попитом, CZ це кандидати на перегляд.</p>`,
  setup: `import io
import numpy as np
import pandas as pd

# Дані генеруються з фіксованим зерном. Для роботи потрібні ONLINE_CSV, SHOPS_CSV і CATALOG.
rng = np.random.default_rng(7)
WINTER = [1.6, 1.4, 1.0, 0.7, 0.4, 0.3, 0.3, 0.3, 0.6, 1.0, 1.4, 1.8]
SUMMER = [0, 0, 0, 0.3, 1.0, 1.6, 1.8, 1.6, 0.6, 0, 0, 0]
GIFTS = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.6, 2.0]
CUPS = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1.5, 3.0]
FLAT = [1] * 12
# артикул, код у касах, назва, ціна, базовий обсяг на місяць, сезонність, розкид
ITEMS = [
    ("KV-001", 1001, "Кава Бразилія 1 кг", 619.90, 140, FLAT, 0.05),
    ("KV-002", 1002, "Кава Ефіопія 250 г", 309.50, 260, FLAT, 0.05),
    ("KV-003", 1003, "Кава Колумбія 250 г", 289.90, 210, FLAT, 0.17),
    ("KV-004", 1004, "Кава Кенія 250 г", 359.00, 90, FLAT, 0.17),
    ("KV-005", 1005, "Кава без кофеїну 250 г", 329.50, 40, FLAT, 0.17),
    ("KV-006", 1006, "Кава в капсулах 10 шт", 179.90, 380, FLAT, 0.04),
    ("CH-011", 2011, "Чай чорний цейлонський 100 г", 119.50, 300, FLAT, 0.05),
    ("CH-012", 2012, "Чай зелений сенча 100 г", 159.90, 180, FLAT, 0.17),
    ("CH-013", 2013, "Чай трав'яний карпатський 50 г", 94.90, 160, WINTER, 0.10),
    ("CH-014", 2014, "Холодний чай персик 0,5 л", 44.90, 600, SUMMER, 0.10),
    ("CH-015", 2015, "Пуер 100 г", 419.00, 25, FLAT, 0.17),
    ("AK-021", 3021, "Кавомолка ручна", 1449.00, 12, FLAT, 0.17),
    ("AK-022", 3022, "Френч-прес 600 мл", 689.00, 30, FLAT, 0.17),
    ("AK-023", 3023, "Термочашка 350 мл", 539.90, 55, CUPS, 0.10),
    ("AK-024", 3024, "Фільтри паперові 100 шт", 84.90, 220, FLAT, 0.05),
    ("AK-025", 3025, "Подарунковий набір «Зимовий»", 979.00, 60, GIFTS, 0.10),
    ("AK-026", 3026, "Сироп ванільний 250 мл", 139.90, 150, FLAT, 0.17),
]
online, shops = [], []
for sku, code, name, price, base, season, spread in ITEMS:
    for m in range(12):
        qty = int(round(base * season[m] * (1 + rng.normal(0, spread))))
        if qty <= 0:
            continue
        web = int(round(qty * 0.3))
        day = pd.Timestamp(2025, m + 1, int(rng.integers(1, 29)))
        if web > 0:
            online.append((day.strftime("%d.%m.%Y"), sku, web, web * price))
        shops.append((day.strftime("%Y-%m-%d"), code, qty - web, int(round((qty - web) * price * 100))))

def money(x):
    return f"{x:,.2f}".replace(",", " ").replace(".", ",") + " грн"

lines = ["Дата;Артикул;Кількість;Сума"]
for i, (d, sku, q, rev) in enumerate(online):
    sku = sku.lower() if i % 3 == 0 else (" " + sku if i % 3 == 1 else sku + " ")
    lines.append(f"{d};{sku};{q};{money(rev)}")
ONLINE_CSV = "\\n".join(lines)
SHOPS_CSV = pd.DataFrame(shops, columns=["date", "code", "qty", "revenue_kop"]).to_csv(index=False)
CATALOG = pd.DataFrame([(s, c, n) for s, c, n, *_ in ITEMS], columns=["sku", "code", "name"])
del rng, WINTER, SUMMER, GIFTS, CUPS, FLAT, ITEMS, online, shops, lines, money`,
  steps: [
    {
      title: 'Інтернет-магазин',
      task: `<p>Прочитай <code>ONLINE_CSV</code> (роздільник <code>;</code>) у DataFrame <code>online</code> з колонками <code>date</code> (дата), <code>sku</code> (артикул без пробілів, великими літерами), <code>qty</code> (ціле), <code>revenue</code> (гривні, число з копійками) і <code>channel</code> зі значенням <code>"online"</code>. Інших колонок не лишай. Виведи кількість рядків і суму виручки, округлену до копійок.</p>`,
      starter: `online = pd.read_csv(io.StringIO(ONLINE_CSV), sep=";")
print(online.head())
`,
      hint: 'Суму перетвори в кілька кроків над рядком: прибери " грн", прибери пробіли-розділювачі тисяч, заміни десяткову кому на крапку, потім astype(float). Дата тут у форматі день.місяць.рік.',
      solution: `online = pd.read_csv(io.StringIO(ONLINE_CSV), sep=";")
online = online.rename(columns={"Дата": "date", "Артикул": "sku", "Кількість": "qty", "Сума": "revenue"})
online["date"] = pd.to_datetime(online["date"], format="%d.%m.%Y")
online["sku"] = online["sku"].str.strip().str.upper()
online["revenue"] = (
    online["revenue"].str.replace(" грн", "").str.replace(" ", "").str.replace(",", ".").astype(float)
)
online["channel"] = "online"
print(len(online), round(online["revenue"].sum(), 2))`,
      check: `online = need("online", pd.DataFrame)
expect(sorted(online.columns) == ["channel", "date", "qty", "revenue", "sku"], f"У online мають бути рівно колонки date, sku, qty, revenue, channel, а зараз {list(online.columns)}")
expect(pd.api.types.is_datetime64_any_dtype(online["date"]), f"date має бути датою, а зараз {online['date'].dtype}")
expect(online["date"].dt.month.nunique() == 12, "Дати мають покривати 12 місяців 2025 року: перевір формат день.місяць.рік")
expect(set(online["sku"]) <= set(CATALOG["sku"]), "Артикули мають збігатися з довідником: прибери пробіли і переведи у верхній регістр")
expect(pd.api.types.is_numeric_dtype(online["revenue"]), f"revenue має бути числом, а зараз {online['revenue'].dtype}")
rows = ONLINE_CSV.splitlines()[1:]
expect(len(online) == len(rows), f"У online мають бути всі {len(rows)} рядків вивантаження, а зараз {len(online)}")
total = sum(float("".join(ch for ch in r.split(";")[3] if ch.isdigit() or ch == ",").replace(",", ".")) for r in rows)
expect(approx(online["revenue"].sum(), total, tol=1e-9), f"Сума виручки online має бути {total:.2f} грн, а зараз {online['revenue'].sum():.2f}: перевір пробіли між тисячами і десяткову кому")
expect((online["channel"] == "online").all(), "channel у всіх рядках online дорівнює \\"online\\"")`,
    },
    {
      title: 'Каси магазинів і спільна таблиця',
      task: `<p>На вході <code>online</code>. Прочитай <code>SHOPS_CSV</code> у DataFrame <code>shops</code> з тими самими колонками, що й <code>online</code>: код товару заміни артикулом з <code>CATALOG</code>, копійки переведи в гривні, <code>channel</code> дорівнює <code>"shops"</code>.</p>
<p>Склади обидві таблиці в одну <code>sales</code> з чистим індексом 0, 1, 2… і виведи виручку за каналами, округлену до копійок.</p>`,
      starter: `shops = pd.read_csv(io.StringIO(SHOPS_CSV))
print(shops.head())
print(CATALOG.head())
`,
      hint: 'merge з CATALOG за колонкою code дає артикул. Перед concat колонки обох таблиць мають називатися однаково, інакше з\'являться NaN. ignore_index=True перенумерує рядки.',
      solution: `shops = pd.read_csv(io.StringIO(SHOPS_CSV))
shops = shops.merge(CATALOG[["code", "sku"]], on="code", how="left")
shops["date"] = pd.to_datetime(shops["date"])
shops["revenue"] = shops["revenue_kop"] / 100
shops["channel"] = "shops"
shops = shops[["date", "sku", "qty", "revenue", "channel"]]

sales = pd.concat([online, shops], ignore_index=True)
print(sales.groupby("channel")["revenue"].sum().round(2))`,
      check: `shops = need("shops", pd.DataFrame)
sales = need("sales", pd.DataFrame)
expect(sorted(shops.columns) == ["channel", "date", "qty", "revenue", "sku"], f"У shops мають бути колонки date, sku, qty, revenue, channel, а зараз {list(shops.columns)}")
expect(shops["sku"].notna().all() and set(shops["sku"]) <= set(CATALOG["sku"]), "Кожен код з кас має перетворитися на артикул з CATALOG")
raw = pd.read_csv(io.StringIO(SHOPS_CSV))
expect(approx(shops["revenue"].sum(), raw["revenue_kop"].sum() / 100, tol=1e-9), "revenue у shops має бути в гривнях: копійки поділи на 100")
expect(sorted(sales.columns) == ["channel", "date", "qty", "revenue", "sku"], f"У sales ті самі п'ять колонок, а зараз {list(sales.columns)}")
expect(len(sales) == len(online) + len(raw), f"У sales мають бути всі рядки обох джерел: {len(online) + len(raw)}, а зараз {len(sales)}")
expect(list(sales.index) == list(range(len(sales))), "Індекс sales має бути 0, 1, 2 ... без повторів")
expect(not sales.isna().any().any(), "У sales не має бути пропусків: перевір, що назви колонок обох таблиць збігаються")
total = online["revenue"].sum() + raw["revenue_kop"].sum() / 100
expect(approx(sales["revenue"].sum(), total, tol=1e-9), f"Загальна виручка sales має бути {total:.2f} грн")`,
    },
    {
      title: 'ABC за виручкою',
      task: `<p>На вході <code>sales</code>. Створи DataFrame <code>abc</code> з індексом <code>sku</code>, відсортований за виручкою від більшої до меншої, з колонками:</p>
<ul><li><code>revenue</code>: виручка товару за рік, грн;</li>
<li><code>share</code>: частка товару в загальній виручці (від 0 до 1);</li>
<li><code>cum_share</code>: накопичена частка, включно з цим товаром;</li>
<li><code>abc</code>: клас <code>"A"</code>, якщо <code>cum_share</code> не більша за 0.80, <code>"B"</code>, якщо не більша за 0.95, інакше <code>"C"</code>.</li></ul>
<p>Виведи кількість товарів у кожному класі та їхню частку виручки.</p>`,
      starter: `# abc = ...
`,
      hint: 'Сортування перед cumsum обов\'язкове: накопичена частка має сенс лише від найбільшого до найменшого. Три класи за порогами зручно задати через np.select або pd.cut з межами [0, 0.8, 0.95, 1].',
      solution: `abc = sales.groupby("sku")[["revenue"]].sum().sort_values("revenue", ascending=False)
abc["share"] = abc["revenue"] / abc["revenue"].sum()
abc["cum_share"] = abc["share"].cumsum()
abc["abc"] = np.select([abc["cum_share"] <= 0.80, abc["cum_share"] <= 0.95], ["A", "B"], default="C")
print(abc.groupby("abc").agg(items=("share", "size"), share=("share", "sum")).round(3))`,
      check: `abc = need("abc", pd.DataFrame)
for c in ["revenue", "share", "cum_share", "abc"]:
    expect(c in abc.columns, f"У abc має бути колонка {c}")
rev = sales.groupby("sku")["revenue"].sum().sort_values(ascending=False)
expect(list(abc.index) == list(rev.index), "abc: індекс sku, рядки від найбільшої виручки до найменшої")
expect(np.allclose(abc["revenue"].to_numpy(float), rev.to_numpy(float)), "revenue: сума виручки товару з обох каналів")
cum = (rev / rev.sum()).cumsum()
expect(np.allclose(abc["cum_share"].to_numpy(float), cum.to_numpy(float)), "cum_share: накопичена частка від 0 до 1, включно з поточним товаром")
ref = np.where(cum <= 0.80, "A", np.where(cum <= 0.95, "B", "C"))
bad = [s for s, a, b in zip(rev.index, abc["abc"], ref) if a != b]
expect(not bad, f"Клас abc неправильний для {bad}: A до 0.80 включно, B до 0.95 включно, далі C")`,
    },
    {
      title: 'XYZ за стабільністю попиту',
      task: `<p>На вході <code>sales</code>. Створи <code>monthly</code>: таблицю продажів у штуках, де рядки це артикули, колонки це місяці 1-12. Місяць без жодного продажу означає 0 штук, а не відсутні дані.</p>
<p>Створи DataFrame <code>xyz</code> з індексом <code>sku</code> і колонками <code>cv</code> (коефіцієнт варіації: стандартне відхилення pandas за замовчуванням, поділене на середнє за 12 місяців) і <code>xyz</code>: <code>"X"</code>, якщо <code>cv</code> не більший за 0.10, <code>"Y"</code>, якщо не більший за 0.25, інакше <code>"Z"</code>. Виведи <code>xyz</code>, відсортований за <code>cv</code>.</p>`,
      starter: `# monthly = ...
`,
      hint: 'pivot_table з fill_value=0 заповнює порожні клітинки нулями. Перевір, що колонок справді 12: сезонні товари продаються не щомісяця, і пропущений місяць робить cv меншим, ніж він є.',
      solution: `monthly = sales.pivot_table(index="sku", columns=sales["date"].dt.month, values="qty", aggfunc="sum", fill_value=0)
monthly = monthly.reindex(columns=range(1, 13), fill_value=0)
xyz = pd.DataFrame({"cv": monthly.std(axis=1) / monthly.mean(axis=1)})
xyz["xyz"] = np.select([xyz["cv"] <= 0.10, xyz["cv"] <= 0.25], ["X", "Y"], default="Z")
print(xyz.sort_values("cv").round(3))`,
      check: `monthly = need("monthly", pd.DataFrame)
xyz = need("xyz", pd.DataFrame)
m = sales.assign(month=sales["date"].dt.month).groupby(["sku", "month"])["qty"].sum().unstack(fill_value=0).reindex(columns=range(1, 13), fill_value=0)
expect(monthly.shape == m.shape, f"monthly має форму {m.shape}: 17 артикулів і 12 місяців, а зараз {monthly.shape}")
expect(np.allclose(monthly.loc[m.index].to_numpy(float), m.to_numpy(float)), "monthly: сума штук за артикулом і місяцем, порожні місяці дорівнюють 0")
for c in ["cv", "xyz"]:
    expect(c in xyz.columns, f"У xyz має бути колонка {c}")
cv = m.std(axis=1) / m.mean(axis=1)
expect(set(xyz.index) == set(cv.index), "Індекс xyz: усі 17 артикулів")
expect(np.allclose(xyz.loc[cv.index, "cv"].to_numpy(float), cv.to_numpy(float)), "cv: std з ddof=1 (за замовчуванням), поділене на середнє за всі 12 місяців, разом з нульовими")
ref = np.where(cv <= 0.10, "X", np.where(cv <= 0.25, "Y", "Z"))
bad = [s for s, a, b in zip(cv.index, xyz.loc[cv.index, "xyz"], ref) if a != b]
expect(not bad, f"Клас xyz неправильний для {bad}: X до 0.10 включно, Y до 0.25 включно, далі Z")`,
    },
    {
      title: 'Матриця ABC×XYZ',
      task: `<p>На вході <code>abc</code>, <code>xyz</code> і <code>CATALOG</code>. Створи <code>classes</code>: DataFrame з індексом <code>sku</code> у порядку <code>abc</code> і колонками <code>name</code>, <code>revenue</code>, <code>abc</code>, <code>xyz</code>, <code>cell</code> (склеєний клас, наприклад <code>"AX"</code>).</p>
<p>Створи <code>matrix</code>: кількість товарів у кожній клітинці, рядки <code>A</code>, <code>B</code>, <code>C</code>, колонки <code>X</code>, <code>Y</code>, <code>Z</code>, порожні клітинки дорівнюють 0. Виведи <code>matrix</code>.</p>`,
      starter: `# classes = ...
`,
      hint: 'abc.join(xyz) поєднує за індексом і зберігає порядок abc. Назву додай з CATALOG, зробивши sku його індексом. pd.crosstab рахує пари, а reindex з fill_value=0 додасть порожні рядки чи колонки.',
      solution: `classes = abc[["revenue", "abc"]].join(xyz[["xyz"]])
classes["name"] = CATALOG.set_index("sku")["name"]
classes["cell"] = classes["abc"] + classes["xyz"]
classes = classes[["name", "revenue", "abc", "xyz", "cell"]]

matrix = pd.crosstab(classes["abc"], classes["xyz"]).reindex(index=["A", "B", "C"], columns=["X", "Y", "Z"], fill_value=0)
print(matrix)`,
      check: `classes = need("classes", pd.DataFrame)
matrix = need("matrix", pd.DataFrame)
for c in ["name", "revenue", "abc", "xyz", "cell"]:
    expect(c in classes.columns, f"У classes має бути колонка {c}")
expect(list(classes.index) == list(abc.index), "classes: ті самі артикули і в тому самому порядку, що й abc")
names = CATALOG.set_index("sku")["name"]
expect((classes["name"] == names.loc[classes.index]).all(), "name: назва товару з CATALOG за артикулом")
cell = abc["abc"] + xyz.loc[abc.index, "xyz"]
expect((classes["cell"] == cell).all(), "cell: клас ABC і клас XYZ разом, наприклад AX")
expect(list(matrix.index) == ["A", "B", "C"] and list(matrix.columns) == ["X", "Y", "Z"], "matrix: рядки A, B, C і колонки X, Y, Z саме в такому порядку")
ref = pd.crosstab(abc["abc"], xyz.loc[abc.index, "xyz"]).reindex(index=["A", "B", "C"], columns=["X", "Y", "Z"], fill_value=0)
expect(np.array_equal(matrix.to_numpy(), ref.to_numpy()), "matrix: кількість товарів у кожній парі класів, порожні клітинки 0")`,
    },
    {
      title: 'Діаграма Парето',
      task: `<p>На вході <code>abc</code>. Побудуй діаграму Парето: стовпці виручки кожного товару в тисячах гривень від найбільшого до найменшого, артикули на осі X, і поверх них на другій осі Y (<code>ax.twinx()</code>) лінію накопиченої частки у відсотках з точками. Додай горизонтальну лінію на рівні 80 % на другій осі. У назві графіка й підписах осей вкажи одиниці.</p>`,
      starter: `import matplotlib.pyplot as plt

fig, ax = plt.subplots(figsize=(11, 5))
`,
      hint: 'Обидві осі мають спільну вісь X, тому стовпці й лінію малюй за тими самими позиціями. Тисячі гривень: revenue / 1000, відсотки: cum_share * 100. Вісь відсотків варто обмежити 0-100 через set_ylim.',
      solution: `import matplotlib.pyplot as plt

fig, ax = plt.subplots(figsize=(11, 5))
x = range(len(abc))
ax.bar(x, abc["revenue"] / 1000, color="#4C72B0")
ax.set_xticks(x, abc.index, rotation=60)
ax.set_xlabel("Артикул")
ax.set_ylabel("Виручка, тис. грн")
ax.set_title("Виручка товарів за 2025 рік, тис. грн, і накопичена частка, %")

ax2 = ax.twinx()
ax2.plot(x, abc["cum_share"] * 100, color="#C44E52", marker="o")
ax2.axhline(80, color="gray", linestyle="--", linewidth=1)
ax2.set_ylim(0, 105)
ax2.set_ylabel("Накопичена частка, %")
fig.tight_layout()`,
      check: `figs = figures()
expect(len(figs) == 1, f"Має бути один графік, а зараз {len(figs)}")
fig = figs[0]
bar_axes = [a for a in fig.axes if len(a.patches) > 0]
expect(bar_axes, "На графіку немає стовпців виручки")
ax = bar_axes[0]
heights = [p.get_height() for p in ax.patches]
target = (abc["revenue"] / 1000).to_numpy(float)
expect(len(heights) == len(target), f"Стовпців має бути {len(target)}, по одному на товар, а зараз {len(heights)}")
expect(np.allclose(heights, target, rtol=1e-6), "Висоти стовпців: виручка товару в тисячах гривень у порядку abc")
expect(all(h >= 0 for h in heights), "Стовпці мають іти від нуля")
twins = [a for a in fig.axes if a is not ax and a.get_shared_x_axes().joined(a, ax)]
expect(twins, "Накопичену частку малюй на другій осі Y: ax.twinx()")
ax2 = twins[0]
cum_lines = [l for l in ax2.get_lines() if len(l.get_ydata()) == len(target)]
expect(cum_lines, "На другій осі немає лінії накопиченої частки по всіх товарах")
expect(np.allclose(np.asarray(cum_lines[0].get_ydata(), float), abc["cum_share"].to_numpy(float) * 100, rtol=1e-6), "Лінія: накопичена частка у відсотках (cum_share * 100)")
expect(any(np.allclose(np.asarray(l.get_ydata(), float), 80) for l in ax2.get_lines() if len(l.get_ydata()) == 2), "Додай горизонтальну лінію на 80 % на другій осі: ax2.axhline(80)")
fig.canvas.draw()
expect([t.get_text() for t in ax.get_xticklabels()] == list(abc.index), "Підпиши стовпці артикулами в порядку abc")
expect("грн" in (ax.get_title() + ax.get_ylabel()) and "%" in (ax.get_title() + ax2.get_ylabel()), "Вкажи одиниці: тис. грн для стовпців і % для накопиченої частки")`,
    },
    {
      title: 'Рекомендації закупівельнику',
      task: `<p>На вході <code>classes</code>. Створи два списки артикулів у порядку спадання виручки:</p>
<ul><li><code>auto_order</code>: товари класу AX, їх замовляємо автоматично за графіком;</li>
<li><code>review</code>: товари класу CZ, їх переглядаємо.</li></ul>
<p>Створи <code>ax_share</code>: частку виручки, яку дають товари AX, у відсотках з 1 знаком. Виведи обидва списки з назвами товарів і <code>ax_share</code>. Подумай, чому сезонний товар з класу C не обов'язково прибирати.</p>`,
      starter: `# auto_order = ...
`,
      hint: 'Відфільтруй classes за колонкою cell: рядки вже впорядковані за виручкою, тож список індексу зберігає порядок. Частку рахуй від загальної виручки всіх товарів.',
      solution: `auto_order = classes.index[classes["cell"] == "AX"].tolist()
review = classes.index[classes["cell"] == "CZ"].tolist()
ax_share = round(classes.loc[auto_order, "revenue"].sum() / classes["revenue"].sum() * 100, 1)

print("Автозамовлення:")
for sku in auto_order:
    print(" ", sku, classes.loc[sku, "name"])
print("Переглянути:")
for sku in review:
    print(" ", sku, classes.loc[sku, "name"])
print(f"Товари AX дають {ax_share}% виручки")`,
      check: `auto_order = need("auto_order", list)
review = need("review", list)
ax_share = need("ax_share", (int, float))
ref_ax = [s for s in abc.index if abc.loc[s, "abc"] == "A" and xyz.loc[s, "xyz"] == "X"]
ref_cz = [s for s in abc.index if abc.loc[s, "abc"] == "C" and xyz.loc[s, "xyz"] == "Z"]
expect(sorted(auto_order) == sorted(ref_ax), f"auto_order: усі товари класу AX, їх {len(ref_ax)}")
expect(auto_order == ref_ax, "auto_order: від більшої виручки до меншої")
expect(sorted(review) == sorted(ref_cz), f"review: усі товари класу CZ, їх {len(ref_cz)}")
expect(review == ref_cz, "review: від більшої виручки до меншої")
share = abc.loc[ref_ax, "revenue"].sum() / abc["revenue"].sum() * 100
expect(approx(ax_share, round(share, 1), tol=1e-9), "ax_share: виручка товарів AX від загальної, у відсотках, 1 знак")`,
    },
  ],
};

const anomalies = {
  id: 'p5-3',
  title: 'Аномалії щоденної виручки пекарні',
  skills: ['reindex', 'resample', 'rolling', 'z-оцінка', 'subplots'],
  story: `<p>Пекарня «Колосок» у Вінниці продає через касу в залі і через сайт з доставкою. Власниця хоче зрозуміти, які дні першого півріччя 2025 року були справді незвичними: де свята дали приріст, а де виручка провалилася через відключення світла, і скільки це в гривнях.</p>
<p>Каса (<code>POS_CSV</code>) вивантажує підсумок дня з комою в сумі і пробілами між тисячами, але вивантаження збоїть: деяких днів немає, деякі дні вивантажились двічі, а коли каса падала, у файлі стоїть 0. Сайт (<code>WEB_JSON</code>) віддає кожне замовлення окремо з часом у форматі ISO і сумою рядком.</p>
<p>Метод: порівняти виручку дня з середнім і розкидом попередніх 14 днів. День, що відхиляється більш ніж на 3 стандартні відхилення, вважаємо аномалією. Збої вивантаження не мають потрапити в аномалії: це дірки в даних, а не події.</p>`,
  setup: `import io
import json
import numpy as np
import pandas as pd

# Дані генеруються з фіксованим зерном. Для роботи потрібні POS_CSV і WEB_JSON.
rng = np.random.default_rng(7)
days = pd.date_range("2025-01-01", "2025-06-30", freq="D")
week = np.array([0.92, 0.97, 0.98, 1.0, 1.06, 1.15, 1.10])[days.dayofweek]
trend = np.linspace(1.0, 1.08, len(days))
pos = 41000 * week * trend * (1 + rng.normal(0, 0.04, len(days)))
EVENTS = {"2025-02-14": 1.7, "2025-03-08": 1.8, "2025-04-20": 1.6, "2025-03-25": 0.45, "2025-05-27": 0.5}
for d, k in EVENTS.items():
    pos[days.get_loc(pd.Timestamp(d))] *= k
table = pd.DataFrame({"day": days.strftime("%d.%m.%Y"), "amount": pos.round(2)})
# Збої вивантаження: пропущені дні, нулі через збій каси, дні, вивантажені двічі
table = table[~table["day"].isin(["06.01.2025", "07.01.2025", "19.02.2025", "02.04.2025", "15.05.2025", "16.06.2025"])]
table.loc[table["day"].isin(["11.02.2025", "23.04.2025", "09.06.2025"]), "amount"] = 0.0
twice = table[table["day"].isin(["31.01.2025", "28.02.2025", "31.03.2025", "30.04.2025", "31.05.2025"])]
table = pd.concat([table, twice]).sort_index(kind="stable")
fmt = lambda x: f"{x:,.2f}".replace(",", " ").replace(".", ",")
POS_CSV = "день;виручка\\n" + "\\n".join(f"{d};{fmt(a)}" for d, a in zip(table["day"], table["amount"]))

orders = []
for d in days:
    for _ in range(int(rng.integers(9, 18))):
        t = d + pd.Timedelta(minutes=int(rng.integers(8 * 60, 21 * 60)))
        orders.append({"created": t.strftime("%Y-%m-%dT%H:%M:%S"), "total": f"{rng.uniform(250, 950):.2f}"})
WEB_JSON = json.dumps(orders)
del rng, days, week, trend, pos, EVENTS, d, k, table, twice, fmt, orders, t`,
  steps: [
    {
      title: 'Каса: повтори і нулі',
      task: `<p>Прочитай <code>POS_CSV</code> і створи Series <code>pos</code>: індекс це дати (<code>DatetimeIndex</code>, відсортований, без повторів), значення це виручка каси в гривнях (float). Дні, вивантажені двічі, лиши по одному разу. Нуль означає збій каси, а не нульову виручку: заміни його на NaN.</p>
<p>Виведи, скільки рядків прибрано як повтори, скільки нулів замінено, і кількість днів у <code>pos</code>.</p>`,
      starter: `raw = pd.read_csv(io.StringIO(POS_CSV), sep=";")
print(raw.head())
print(raw.dtypes)

# pos = ...
`,
      hint: 'Повторне вивантаження дає однакові рядки: drop_duplicates їх прибере. Суму перетвори з рядка через прибирання пробілів і заміну коми на крапку. Нулі на NaN: .replace(0, np.nan) або .mask(...).',
      solution: `raw = pd.read_csv(io.StringIO(POS_CSV), sep=";")
dedup = raw.drop_duplicates()
amount = dedup["виручка"].str.replace(" ", "").str.replace(",", ".").astype(float)
pos = pd.Series(amount.to_numpy(), index=pd.to_datetime(dedup["день"], format="%d.%m.%Y")).sort_index()
zeros = int((pos == 0).sum())
pos = pos.replace(0, np.nan)
print("повтори:", len(raw) - len(dedup))
print("нулі:", zeros)
print("днів:", len(pos))`,
      check: `pos = need("pos", pd.Series)
expect(isinstance(pos.index, pd.DatetimeIndex), f"Індекс pos має бути датами, а зараз {type(pos.index).__name__}")
expect(pos.index.is_unique, "У pos лишились дні, вивантажені двічі")
expect(pos.index.is_monotonic_increasing, "Відсортуй pos за датою")
expect(pd.api.types.is_float_dtype(pos), f"Значення pos мають бути числами з копійками, а зараз {pos.dtype}")
raw = pd.read_csv(io.StringIO(POS_CSV), sep=";")
uniq = raw.drop_duplicates()
expect(len(pos) == len(uniq), f"У pos має бути {len(uniq)} днів, а зараз {len(pos)}")
expect(not (pos == 0).any(), "Нулі в pos означають збій каси: заміни їх на NaN")
ref = pd.Series([float(v.replace(" ", "").replace(",", ".")) for v in uniq["виручка"]], index=pd.to_datetime(uniq["день"], format="%d.%m.%Y").to_numpy()).sort_index()
ref = ref.where(ref != 0)
expect(pos.index.equals(pd.DatetimeIndex(ref.index)), "Дати в pos не збігаються з вивантаженням: формат день.місяць.рік")
expect(np.allclose(pos.to_numpy(float), ref.to_numpy(float), equal_nan=True), "Суми в pos не збігаються з вивантаженням: перевір пробіли між тисячами і десяткову кому")`,
    },
    {
      title: 'Повний календар',
      task: `<p>На вході <code>pos</code>. Створи <code>calendar</code>: усі дні від 1 січня до 30 червня 2025 року (<code>DatetimeIndex</code>). Перепиши <code>pos</code> на цей календар, щоб пропущені у вивантаженні дні стали NaN.</p>
<p>Виведи кількість днів у календарі, кількість днів без даних каси і самі ці дати у форматі <code>2025-01-06</code>.</p>`,
      starter: `# calendar = ...
`,
      hint: 'pd.date_range будує календар, reindex накладає на нього наявні значення. Дні без даних тепер включають і пропущені рядки, і колишні нулі.',
      solution: `calendar = pd.date_range("2025-01-01", "2025-06-30", freq="D")
pos = pos.reindex(calendar)
gaps = pos.index[pos.isna()]
print("днів:", len(calendar))
print("без даних:", len(gaps))
print(list(gaps.strftime("%Y-%m-%d")))`,
      check: `calendar = need("calendar", pd.DatetimeIndex)
pos = need("pos", pd.Series)
expect(len(calendar) == 181 and calendar[0] == pd.Timestamp("2025-01-01") and calendar[-1] == pd.Timestamp("2025-06-30"), "calendar: кожен день з 2025-01-01 до 2025-06-30, це 181 день")
expect(pos.index.equals(calendar), "pos має бути переписаний на calendar: reindex")
gaps = [d.strftime("%Y-%m-%d") for d in pos.index[pos.isna()]]
expect(len(gaps) == 9, f"Днів без даних каси має бути 9 (6 пропущених і 3 нулі), а зараз {len(gaps)}")
expect("2025-01-06" in OUTPUT and "2025-06-16" in OUTPUT, "Виведи дати без даних у форматі 2025-01-06")`,
    },
    {
      title: 'Замовлення сайту і загальна виручка',
      task: `<p>На вході <code>pos</code> і <code>calendar</code>. Розбери <code>WEB_JSON</code>: кожне замовлення має час <code>created</code> і суму <code>total</code> рядком. Склади виручку сайту за день і наклади на <code>calendar</code>: день без замовлень означає 0 гривень.</p>
<p>Створи DataFrame <code>daily</code> з індексом <code>calendar</code> і колонками <code>pos</code>, <code>web</code>, <code>total</code> (<code>pos + web</code>; якщо каса не має даних, <code>total</code> лишається NaN, бо виручка дня невідома). Виведи суму <code>web</code> і суму <code>total</code>, округлені до гривні.</p>`,
      starter: `orders = pd.DataFrame(json.loads(WEB_JSON))
print(orders.head())
print(orders.dtypes)

# daily = ...
`,
      hint: 'Після pd.to_datetime і astype(float) зроби час індексом і застосуй resample("D").sum(). Звичайне додавання двох Series дає NaN там, де NaN хоча б в одній, а саме це тут і треба.',
      solution: `orders = pd.DataFrame(json.loads(WEB_JSON))
orders["created"] = pd.to_datetime(orders["created"])
orders["total"] = orders["total"].astype(float)
web = orders.set_index("created")["total"].resample("D").sum().reindex(calendar, fill_value=0)

daily = pd.DataFrame({"pos": pos, "web": web}, index=calendar)
daily["total"] = daily["pos"] + daily["web"]
print("сайт:", round(daily["web"].sum()))
print("разом:", round(daily["total"].sum()))`,
      check: `daily = need("daily", pd.DataFrame)
for c in ["pos", "web", "total"]:
    expect(c in daily.columns, f"У daily має бути колонка {c}")
expect(daily.index.equals(calendar), "Індекс daily: calendar, усі 181 день")
o = json.loads(WEB_JSON)
per_day = {}
for x in o:
    per_day[x["created"][:10]] = per_day.get(x["created"][:10], 0.0) + float(x["total"])
web_ref = np.array([per_day.get(d.strftime("%Y-%m-%d"), 0.0) for d in calendar])
expect(pd.api.types.is_numeric_dtype(daily["web"]), f"web має бути числом, а зараз {daily['web'].dtype}")
expect(daily["web"].notna().all(), "web: день без замовлень дорівнює 0, а не NaN")
expect(np.allclose(daily["web"].to_numpy(float), web_ref), "web: сума замовлень сайту за кожен день календаря")
expect(np.allclose(daily["pos"].to_numpy(float), pos.to_numpy(float), equal_nan=True), "pos у daily: виручка каси з попереднього кроку, з NaN у днях без даних")
expect(daily["total"].isna().sum() == pos.isna().sum(), "total має бути NaN там, де немає даних каси")
expect(np.allclose(daily["total"].to_numpy(float), pos.to_numpy(float) + web_ref, equal_nan=True), "total: pos + web")`,
    },
    {
      title: 'Ковзне середнє і z-оцінка',
      task: `<p>На вході <code>daily</code>. Для кожного дня порахуй середнє і стандартне відхилення <code>total</code> за 14 ПОПЕРЕДНІХ днів, сам день у вікно не входить. Рахуй, якщо у вікні є хоча б 10 днів з даними. Додай колонки <code>mean</code>, <code>std</code> і <code>z</code> (наскільки стандартних відхилень <code>total</code> відходить від <code>mean</code>).</p>
<p>Виведи 5 днів з найбільшим за модулем <code>z</code> разом з <code>total</code>, <code>mean</code>, <code>z</code>, округленими до 2 знаків.</p>`,
      starter: `# daily["mean"] = ...
`,
      hint: 'Якщо день входить у власне вікно, сплеск сам підтягує середнє і ховається. shift(1) зсуває ряд на день, після нього rolling(14, min_periods=10). Сортувати за модулем зручно через reindex за індексом daily["z"].abs().sort_values(...).',
      solution: `window = daily["total"].shift(1).rolling(14, min_periods=10)
daily["mean"] = window.mean()
daily["std"] = window.std()
daily["z"] = (daily["total"] - daily["mean"]) / daily["std"]
top = daily["z"].abs().sort_values(ascending=False).index[:5]
print(daily.loc[top, ["total", "mean", "z"]].round(2))`,
      check: `daily = need("daily", pd.DataFrame)
for c in ["mean", "std", "z"]:
    expect(c in daily.columns, f"У daily має бути колонка {c}")
w = daily["total"].shift(1).rolling(14, min_periods=10)
m, s = w.mean(), w.std()
same = daily["total"].rolling(14, min_periods=10).mean()
if not np.allclose(daily["mean"].to_numpy(float), m.to_numpy(float), equal_nan=True) and np.allclose(daily["mean"].to_numpy(float), same.to_numpy(float), equal_nan=True):
    expect(False, "У вікно потрапляє сам день: зсунь ряд на 1 день перед rolling")
expect(np.allclose(daily["mean"].to_numpy(float), m.to_numpy(float), equal_nan=True), "mean: середнє total за 14 попередніх днів, якщо є хоча б 10 значень")
expect(np.allclose(daily["std"].to_numpy(float), s.to_numpy(float), equal_nan=True), "std: стандартне відхилення total за ті самі 14 попередніх днів")
expect(np.allclose(daily["z"].to_numpy(float), ((daily["total"] - m) / s).to_numpy(float), equal_nan=True), "z: (total - mean) / std")`,
    },
    {
      title: 'Позначення аномалій',
      task: `<p>На вході <code>daily</code> з колонкою <code>z</code>. Додай булеву колонку <code>anomaly</code>: модуль <code>z</code> більший за 3. Створи DataFrame <code>anomalies</code>: лише аномальні дні в порядку дат, з колонками <code>total</code>, <code>mean</code>, <code>z</code>, <code>effect</code> (<code>total - mean</code>, гривні) і <code>kind</code>: <code>"сплеск"</code> для z більше 0 і <code>"провал"</code> для z менше 0. Виведи <code>anomalies</code>, числа округли до 1 знака.</p>`,
      starter: `# daily["anomaly"] = ...
`,
      hint: 'Порівняння з NaN дає False, тож дні без даних у аномалії не потраплять самі. Тип аномалії за знаком z зручно задати через np.where.',
      solution: `daily["anomaly"] = daily["z"].abs() > 3
anomalies = daily.loc[daily["anomaly"], ["total", "mean", "z"]].copy()
anomalies["effect"] = anomalies["total"] - anomalies["mean"]
anomalies["kind"] = np.where(anomalies["z"] > 0, "сплеск", "провал")
print(anomalies.round(1))`,
      check: `daily = need("daily", pd.DataFrame)
anomalies = need("anomalies", pd.DataFrame)
expect("anomaly" in daily.columns and pd.api.types.is_bool_dtype(daily["anomaly"]), "У daily має бути булева колонка anomaly")
ref = daily["z"].abs() > 3
expect((daily["anomaly"] == ref).all(), "anomaly: True, якщо модуль z більший за 3")
for c in ["total", "mean", "z", "effect", "kind"]:
    expect(c in anomalies.columns, f"У anomalies має бути колонка {c}")
expect(list(anomalies.index) == list(daily.index[ref]), f"anomalies: усі {int(ref.sum())} аномальних днів у порядку дат")
expect(np.allclose(anomalies["effect"].to_numpy(float), (daily.loc[ref, "total"] - daily.loc[ref, "mean"]).to_numpy(float)), "effect: total - mean")
kinds = np.where(daily.loc[ref, "z"] > 0, "сплеск", "провал")
expect(list(anomalies["kind"]) == list(kinds), "kind: сплеск для z більше 0, провал для z менше 0")`,
    },
    {
      title: 'Панель з чотирьох графіків',
      task: `<p>На вході <code>daily</code> і <code>anomalies</code>. Побудуй <code>fig, axs = plt.subplots(2, 2, figsize=(13, 8))</code> і заповни:</p>
<ul><li><code>axs[0, 0]</code>: лінія <code>total</code> у тисячах гривень за датами і поверх неї точки аномалій (<code>scatter</code>) теж у тисячах гривень;</li>
<li><code>axs[0, 1]</code>: лінія <code>z</code> за датами і дві горизонтальні лінії на 3 і -3;</li>
<li><code>axs[1, 0]</code>: стовпці виручки (<code>total</code>) за місяцями в тисячах гривень, місяці від січня до червня;</li>
<li><code>axs[1, 1]</code>: горизонтальні стовпці (<code>barh</code>) <code>effect</code> аномалій у тисячах гривень, від найменшого до найбільшого, з підписами дат.</li></ul>
<p>Кожному графіку дай назву з одиницями (тис. грн або σ для z).</p>`,
      starter: `import matplotlib.pyplot as plt

fig, axs = plt.subplots(2, 2, figsize=(13, 8))
`,
      hint: 'Точки поверх лінії: спершу plot, потім scatter за індексом anomalies. Місячні суми дає resample("ME").sum(): дні без даних каси пропускаються. Для barh відсортуй anomalies за effect.',
      solution: `import matplotlib.pyplot as plt

fig, axs = plt.subplots(2, 2, figsize=(13, 8))

ax = axs[0, 0]
ax.plot(daily.index, daily["total"] / 1000, color="#4C72B0", linewidth=1)
ax.scatter(anomalies.index, anomalies["total"] / 1000, color="#C44E52", zorder=3)
ax.set_title("Виручка за день, тис. грн")

ax = axs[0, 1]
ax.plot(daily.index, daily["z"], color="#55A868", linewidth=1)
ax.axhline(3, color="gray", linestyle="--")
ax.axhline(-3, color="gray", linestyle="--")
ax.set_title("z-оцінка, σ")

monthly = daily["total"].resample("ME").sum() / 1000
ax = axs[1, 0]
ax.bar(monthly.index.strftime("%Y-%m"), monthly, color="#4C72B0")
ax.set_title("Виручка за місяць, тис. грн")

eff = anomalies.sort_values("effect")
ax = axs[1, 1]
ax.barh(eff.index.strftime("%Y-%m-%d"), eff["effect"] / 1000, color=np.where(eff["effect"] > 0, "#55A868", "#C44E52"))
ax.axvline(0, color="black", linewidth=0.8)
ax.set_title("Відхилення аномальних днів від середнього, тис. грн")

for a in axs[0]:
    a.tick_params(axis="x", rotation=30)
fig.tight_layout()`,
      check: `figs = figures()
expect(len(figs) == 1, f"Має бути один графік з чотирма панелями, а зараз {len(figs)}")
fig = figs[0]
axes = fig.axes
expect(len(axes) == 4, f"У фігурі має бути 4 панелі (subplots(2, 2)), а зараз {len(axes)}")
a00, a01, a10, a11 = axes
total_k = (daily["total"] / 1000).to_numpy(float)
lines = [l for l in a00.get_lines() if len(l.get_ydata()) == len(daily)]
expect(lines and np.allclose(np.asarray(lines[0].get_ydata(), float), total_k, equal_nan=True), "axs[0, 0]: лінія total / 1000 за всі дні календаря")
expect(len(a00.collections) >= 1, "axs[0, 0]: додай точки аномалій через scatter")
pts = np.asarray(a00.collections[0].get_offsets(), float)
expect(len(pts) == len(anomalies) and np.allclose(np.sort(pts[:, 1]), np.sort((anomalies["total"] / 1000).to_numpy(float))), "axs[0, 0]: точки мають стояти на висоті total / 1000 у дні аномалій")
zl = [l for l in a01.get_lines() if len(l.get_ydata()) == len(daily)]
expect(zl and np.allclose(np.asarray(zl[0].get_ydata(), float), daily["z"].to_numpy(float), equal_nan=True), "axs[0, 1]: лінія z за всі дні")
levels = sorted(float(np.asarray(l.get_ydata(), float)[0]) for l in a01.get_lines() if len(l.get_ydata()) == 2)
expect(levels == [-3.0, 3.0], "axs[0, 1]: додай горизонтальні лінії на 3 і -3 (axhline)")
monthly = (daily["total"].resample("ME").sum() / 1000).to_numpy(float)
heights = [p.get_height() for p in a10.patches]
expect(len(heights) == 6 and np.allclose(heights, monthly), "axs[1, 0]: 6 стовпців, сума total за місяць / 1000, від січня до червня")
widths = [p.get_width() for p in a11.patches]
eff = np.sort((anomalies["effect"] / 1000).to_numpy(float))
expect(len(widths) == len(eff) and np.allclose(widths, eff), "axs[1, 1]: barh з effect / 1000, відсортований від найменшого до найбільшого")
fig.canvas.draw()
labels = [t.get_text() for t in a11.get_yticklabels()]
expect(all(d.strftime("%Y-%m-%d") in labels for d in anomalies.index), "axs[1, 1]: підпиши стовпці датами аномалій у форматі 2025-02-14")
expect(all(a.get_title().strip() for a in axes), "Дай назву кожній із чотирьох панелей")
expect("грн" in a00.get_title() and "грн" in a10.get_title() and "грн" in a11.get_title(), "Вкажи одиниці в назвах панелей з гривнями: тис. грн")`,
    },
    {
      title: 'Підсумок для власниці',
      task: `<p>На вході <code>daily</code> і <code>anomalies</code>. Створи:</p>
<ul><li><code>anomaly_days</code>: список дат аномалій рядками <code>"2025-02-14"</code> у порядку дат;</li>
<li><code>spike_gain</code>: скільки гривень сплески дали понад звичайний рівень (сума <code>effect</code> сплесків), округлено до гривні;</li>
<li><code>drop_loss</code>: скільки гривень втрачено в дні провалів, додатним числом, округлено до гривні;</li>
<li><code>gain_share</code>: частка <code>spike_gain</code> у виручці всіх днів з даними, у відсотках з 2 знаками.</li></ul>
<p>Виведи ці величини. Подумай: на які дати припали сплески і провали, і що з цього варто планувати наперед.</p>`,
      starter: `# anomaly_days = ...
`,
      hint: 'Індекс anomalies уже містить дати: strftime перетворить їх на рядки. Для сум відбери рядки за kind. Виручка всіх днів з даними: daily["total"].sum(), NaN пропускаються.',
      solution: `anomaly_days = list(anomalies.index.strftime("%Y-%m-%d"))
spike_gain = round(anomalies.loc[anomalies["kind"] == "сплеск", "effect"].sum())
drop_loss = round(-anomalies.loc[anomalies["kind"] == "провал", "effect"].sum())
gain_share = round(spike_gain / daily["total"].sum() * 100, 2)
print("Аномальні дні:", anomaly_days)
print("Сплески дали понад звичайне:", spike_gain, "грн")
print("Провали забрали:", drop_loss, "грн")
print("Частка сплесків у виручці півріччя:", gain_share, "%")`,
      check: `anomaly_days = need("anomaly_days", list)
spike_gain = need("spike_gain", (int, float))
drop_loss = need("drop_loss", (int, float))
gain_share = need("gain_share", (int, float))
ref_days = [d.strftime("%Y-%m-%d") for d in daily.index[daily["z"].abs() > 3]]
expect(anomaly_days == ref_days, f"anomaly_days: {len(ref_days)} дат рядками виду 2025-02-14 у порядку дат")
eff = daily["total"] - daily["mean"]
up = daily["z"] > 3
down = daily["z"] < -3
expect(approx(spike_gain, round(eff[up].sum()), tol=1e-9), "spike_gain: сума effect у дні сплесків, округлена до гривні")
expect(drop_loss > 0, "drop_loss: втрати записуй додатним числом")
expect(approx(drop_loss, round(-eff[down].sum()), tol=1e-9), "drop_loss: сума effect у дні провалів зі зміненим знаком, до гривні")
expect(abs(gain_share - eff[up].sum() / daily["total"].sum() * 100) <= 0.011, "gain_share: spike_gain від суми total за всі дні з даними, у відсотках, 2 знаки")`,
    },
  ],
};

export default {
  id: 'p5',
  level: 5,
  title: 'Експерт',
  description: 'Кілька джерел з різними форматами, власний аналітичний метод, складні графіки і висновок, який треба пояснити.',
  tasks: [cohorts, abcxyz, anomalies],
};
