// Рівень 4: повний цикл від сирого вивантаження до висновку.
// Дані вписані явно: нерозривні пробіли (U+00A0) у сумах задані екрануванням  ,
// тож у рядку даних, який бачить учень, це справжній нерозривний пробіл.

const RAW_COFFEE = 'date;shop;revenue;checks\n06.01.2026;Поділ;19\u00a0690,45 грн;172\n08.01.2026;Подiл;18275.1;\n09/01/2026;Подiл;18\u00a0581,69 грн;160\n10/01/2026;оболонь ;13 830,30;146\n11.01.2026;ОБОЛОНЬ;13019,54 грн;130\n13.01.2026;Оболонь;14\u00a0637,31 грн;\n18/01/2026;Познякі;9\u00a0217,39 грн;112\n19.01.2026;Познякі;951177;116\n28/01/2026;Позняки ;10819,65 грн;122\n2026-02-12;оболонь ;13465.69;131\n01.02.2026;Подiл;16904,49 грн;143\n2026-02-03; Поділ;;160\n2026-02-05;Подiл;16647,70 грн;150\n07.02.2026;Оболонь;16\u00a0491,81 грн;164\n2026-02-12;Оболон;13\u00a0465,69 грн;131\n16.02.2026;Оболон;;158\n17.06.2026;Оболонь;15274.26;143\n2026-02-18;Позняки ;9 403,32;104\n2026-02-24;Позняки ;9932,15 грн;110\n26/02/2026;Позняки ;10 106,37;115\n2026-03-01;Поділ;18 707,69;158\n2026-03-03;ПОДІЛ;19\u00a0135,80 грн;170\n01.02.2026; Поділ;16904.49;143\n20.06.2026;Позняки ;16\u00a0978,48 грн;176\n2026-03-05;Поділ;17\u00a0219,27 грн;157\n2026-03-09;ОБОЛОНЬ;13400.9;129\n13/03/2026;оболонь ;17\u00a0769,69 грн;173\n14.03.2026;Оболонь;15239.55;149\n15/03/2026;Позняки ;10 402,97;110\n18/03/2026;Позняки ;11\u00a0589,43 грн;124\n2026-03-27;Познякі;12863,38 грн;142\n04/04/2026;ПОДІЛ;17 268,72;147\n2026-04-08;Подiл;18 998,74;158\n2026-04-12; Поділ;17893.6;157\n14/04/2026;ОБОЛОНЬ;17 648,80;169\n2026-04-15;ОБОЛОНЬ;15\u00a0511,49 грн;148\n2026-04-22;ОБОЛОНЬ;14\u00a0518,48 грн;144\n2026-04-24;Позняки ;11323.2;120\n26.04.2026;Позняки;11 652,62;128\n28/04/2026;Позняки ;13756.8;151\n04/05/2026;ПОДІЛ;18 677,20;156\n2026-05-05; Поділ;20\u00a0353,62 грн;175\n08.05.2026;Поділ;20\u00a0037,20 грн;177\n11.05.2026;Оболонь;16 369,21;161\n16.05.2026;Оболон;15074.85;150\n18/05/2026;Оболонь;15066,21 грн;151\n19.05.2026;Позняки;14042,09 грн;151\n20.05.2026;Позняки;14050.01;145\n28/05/2026;Позняки;16\u00a0365,18 грн;\n02.06.2026;поділ;21 037,10;171\n03.06.2026;поділ;18654.1;164\n07/06/2026;Поділ;23266.05;195\n12/06/2026;Оболон;16 947,86;157\n13.06.2026;ОБОЛОНЬ;17022,47 грн;162\n26/02/2026;Позняки ;10 106,37;115\n17.06.2026;Оболонь;15274.26;143\n20.06.2026;Позняки ;16\u00a0978,48 грн;176\n22/06/2026;Позняки ;14600,39 грн;146\n26.06.2026;Позняки;13\u00a0820,46 грн;144';
const RAW_ENERGY = 'office,date,consumption,unit\nКиїв,2025-01-31,-1\u00a0932,кВт·год\nЛьвiв,2025-01-31,16\u00a0160,кВт год\nДніпро,30.04.2025,14\u00a0870,кВт*год\nхарків,31.01.2025,21390,кВт·год\nОдесса,2025-01-31,"13,31",МВт·год\nдніпро,31.01.2025,20\u00a0990,кВт·год\n Київ,2025-02-28,"34,73",МВт·год\nЛьвiв,28/02/2025,16520,кВт год\nхарків,28.02.2025,21\u00a0150,кВт*год\n Одеса,2025-02-28,12 320,квт·год \nДнiпро,28/02/2025,,мвт·год\n Київ,31.03.2025,29\u00a0960,квт·год \nЛьвів ,31.03.2025,14 490,кВт·год\nХарків ,2025-03-31,19.27,МВт*год\nодеса,2025-03-31,13\u00a0150,кВт год\nДнiпро,2025-03-31,16.13,МВт·год\nКиїв,31/05/2025,"25,57",МВт·год\n Київ,30/04/2025,27\u00a0820,кВт год\nЛьвів ,30.04.2025,13\u00a0040,кВт год\nхарків,30.04.2025,"16,32",МВт·год\nОдеса,2025-04-30,13\u00a0130,квт·год \nДніпро,30.04.2025,14\u00a0870,кВт*год\nKyiv,2025-05-31,25570,кВт год\nЛЬВІВ,31.05.2025,11\u00a0050,кВт·год\nХарків,31/05/2025,14\u00a0580,кВт*год\nОдесса,31.05.2025,"15,71",мвт·год\nДНІПРО,31/05/2025,14 430,кВт·год\n Київ,30.06.2025,25\u00a0810,кВт·год\nЛьвів ,2025-06-30,12 250,кВт*год\nХарків,30.06.2025,-1\u00a0655,кВт·год\nодеса,30.06.2025,18\u00a0070,кВт*год\nДнiпро,30/06/2025,14690,кВт*год\nКиїв,31/07/2025,"28,15",мвт·год\nЛьвiв,31/07/2025,13\u00a0420,квт·год \nОдеса,30/09/2025,"16,79",МВт·год\nхарків,2025-07-31,17560,кВт·год\n Одеса,31/07/2025,21 310,кВт·год\nДНІПРО,31/07/2025,15010,кВт·год\nКиїв,31/08/2025,28\u00a0180,квт·год \nЛЬВІВ,2025-08-31,,кВт·год\nхарків,31.08.2025,16.33,МВт*год\nОдесса,2025-08-31,20850,кВт*год\nДНІПРО,31/08/2025,15\u00a0840,кВт*год\n Київ,30.09.2025,24\u00a0420,кВт*год\nЛьвів,30/09/2025,12 390,кВт*год\nхарків,30.09.2025,15 560,кВт год\n Київ,31.03.2025,29\u00a0960,квт·год \nОдеса,30/09/2025,"16,79",МВт·год\nДніпро,2025-09-30,13.57,МВт·год\nКиїв,2025-10-31,28000,кВт·год\nЛьвів,31.10.2025,12 890,кВт·год\nХарків ,31.10.2025,17 700,квт·год \nОдесса,31/10/2025,14\u00a0790,квт·год \nДнiпро,31.10.2025,"14,94",МВт·год\n Київ,2025-11-30,30\u00a0030,кВт*год\nЛьвiв,30/11/2025,15\u00a0420,кВт·год\nХарків ,2025-11-30,18\u00a0650,кВт год\nодеса,30.11.2025,12690,кВт·год\nдніпро,30.11.2025,"17,26",МВт*год\nКиїв,2025-12-31,33300,кВт·год\nЛьвiв,31/12/2025,15\u00a0730,кВт*год\nХаркiв,2025-12-31,22 420,кВт год\nодеса,31/12/2025,13 210,кВт·год\nДніпро,2025-12-31,19\u00a0960,кВт*год';
const RAW_DELIVERY = 'order_id;district;ordered_at;delivered_at;complaint\n5117;Шевченкiвський;01.02.2026 09:09;01.02.2026 09:37;ні \n5145;шевченківський р-н;2026-02-02 14:54;02.02.2026 15:34;ні \n5108;Голосієвський;2026-02-02 20:23;2026-02-02 21:07;НІ\n5129;Шевченківський район;06.02.2026 15:42;06.02.2026 16:18;Ні\n5109;Шевченкiвський;06.02.2026 15:57;06.02.2026 16:22;НІ\n5148;Голосіївський;07.02.2026 15:10;07.02.2026 16:12;Так\n5101;шевченківський р-н;2026-02-08 14:32;07.02.2026 15:18;НІ\n5146;Оболонський ;2026-02-08 18:45;08.02.2026 19:37;Ні\n5134;оболонський район;10.02.2026 18:33;10.02.2026 19:19;Ні\n5151;Дарницький р-н;11.02.2026 13:16;11.02.2026 14:38;ні \n5160;шевченківський р-н;2026-02-11 18:07;11.02.2026 18:44;ні \n5139;Дарницький;2026-02-11 19:54;11.02.2026 21:05;Так\n5150;оболонський район;18.02.2026 18:53;18.02.2026 19:20;Так\n5106;Оболонський;2026-03-24 15:47;2026-03-24 16:34;Ні\n5157;Голосіївський р-н;19.02.2026 14:03;19.02.2026 14:49;ТАК\n5153;Шевченківський район;20.02.2026 10:06;2026-02-20 10:36;Ні\n5159;Голосіївський;21.02.2026 18:57;2026-02-21 20:13;Так\n5127;ДАРНИЦЬКИЙ;2026-02-21 19:37;21.02.2026 20:09;НІ\n5154;Оболонський;21.02.2026 21:29;21.02.2026 21:58;ні \n5118;Оболонь;2026-02-24 12:16;24.02.2026 12:46;Ні\n5131;Дарницький р-н;25.02.2026 09:06;2026-02-25 10:07;ні \n5122;Оболонь;2026-02-28 20:30;28.02.2026 20:59;ні \n5140;Голосіївський р-н;25.02.2026 13:11;25.02.2026 14:07;НІ\n5155;Дарницький;26.02.2026 14:38;;ні\n5110;Оболонь;2026-02-26 17:16;26.02.2026 17:51;ні \n5152;Голосіївський;2026-02-27 09:03;27.02.2026 09:55;ні\n5122;оболонський район;28.02.2026 20:30;28.02.2026 20:59;ні \n5142;оболонський район;01.03.2026 10:33;01.03.2026 11:06;НІ\n5136;Голосіївський;2026-03-14 11:02;2026-03-14 11:45;Ні\n5121;шевченківський р-н;01.03.2026 20:45;;Ні\n5137;шевченківський р-н;01.03.2026 21:41;2026-03-01 22:20;Ні\n5141;Шевченкiвський;02.03.2026 16:49;2026-03-02 17:26;ні \n5135;ДАРНИЦЬКИЙ;2026-03-02 18:14;02.03.2026 19:17;Так\n5113;Шевченкiвський;2026-03-03 11:30;2026-03-03 12:16;ні \n5130;Оболонський ;2026-03-05 15:24;05.03.2026 16:10;Ні\n5111;Дарницький;05.03.2026 17:51;05.03.2026 19:09;ТАК\n5107;Дарницький р-н;19.03.2026 14:05;2026-03-19 14:58;ні \n5119;Дарницький;05.03.2026 21:52;2026-03-05 22:40;Ні\n5128;Голосіївський р-н;07.03.2026 12:30;07.03.2026 23:05;ні \n5115;Дарниця;08.03.2026 15:42;2026-03-08 17:09;ні\n5147;Дарницький р-н;09.03.2026 13:36;09.03.2026 14:40;так\n5125;Шевченківський район;12.03.2026 21:12;2026-03-12 21:46;ні \n5136;Голосіївський;2026-03-14 11:02;2026-03-14 11:45;Ні\n5144;голосіївський;2026-03-14 14:26;14.03.2026 15:14;НІ\n5138;Оболонський ;2026-03-14 17:13;14.03.2026 18:09;ні\n5126;Оболонський;2026-03-15 21:40;15.03.2026 22:35;ні\n5133;шевченківський р-н;2026-03-16 13:28;16.03.2026 14:00;ні\n5105;Шевченківський район;16.03.2026 14:13;;ні \n5156;Голосіївський р-н;16.03.2026 14:55;16.03.2026 15:55;ні \n5114;оболонський район;2026-03-16 16:45;16.03.2026 17:13;\n5112;Голосієвський;18.03.2026 17:56;18.03.2026 18:44;ні \n5107;Дарницький р-н;19.03.2026 14:05;2026-03-19 14:58;ні \n5158;Дарницький р-н;2026-03-19 21:51;19.03.2026 22:39;ні \n5149;Шевченківський район;21.03.2026 14:46;21.03.2026 15:24;НІ\n5103;Дарницький р-н;2026-03-21 21:37;2026-03-21 22:42;ТАК\n5132;Голосіївський р-н;2026-03-22 09:01;22.03.2026 09:51;ні \n5116;Голосіївський р-н;24.03.2026 15:27;2026-03-24 16:14;НІ\n5106;Оболонський;2026-03-24 15:47;2026-03-24 16:34;Ні\n5104;Голосієвський;2026-03-25 10:28;2026-03-25 11:15;так\n5143;Дарниця;2026-03-25 10:54;25.03.2026 12:00;ТАК\n5120;Голосіївський;2026-03-26 13:20;26.03.2026 14:07;ні \n5123;Дарниця;2026-03-30 16:23;30.03.2026 17:51;так\n5102;Оболонь;2026-03-30 18:39;30.03.2026 19:16;\n5124;Голосіївський;2026-03-31 09:05;31.03.2026 10:03;';

export default {
  id: 'p4',
  level: 4,
  title: 'Повний цикл',
  description: 'Три задачі від сирого вивантаження до відповіді бізнесу: діагностика, очищення, структура, графік і висновок.',
  tasks: [
    {
      id: 'p4-1',
      title: 'Пів року мережі кав\'ярень',
      skills: ['очищення тексту і чисел', 'дати в кількох форматах', 'pivot_table', 'matplotlib', 'висновок з цифрами'],
      story: `<p>Ти аналітик мережі з трьох кав'ярень у Києві: Поділ, Оболонь і Позняки. Бариста вносять виручку і кількість чеків у спільну таблицю вручну, тому вивантаження за січень-червень 2026 брудне.</p>
<p>Звіти є не за кожен день, а за кілька днів на місяць, тож порівнюємо середню денну виручку. Власник питає: яка точка за пів року зросла найбільше і за рахунок чого: більше гостей чи дорожчий чек?</p>`,
      setup: `import io
import pandas as pd

RAW = """${RAW_COFFEE}"""`,
      steps: [
        {
          title: 'Діагностика',
          task: `<p>Прочитай <code>RAW</code> у DataFrame <code>df</code>. Роздільник колонок у цьому вивантаженні не кома: глянь на перший рядок.</p>
<p>Нічого не виправляй, лише порахуй:</p>
<ul>
<li><code>n_rows</code>: кількість рядків;</li>
<li><code>n_dups</code>: кількість повних дублікатів рядків у сирих даних;</li>
<li><code>n_missing</code>: Series з кількістю пропусків у кожній колонці;</li>
<li><code>n_shop_names</code>: скільки різних написань точки в колонці <code>shop</code>.</li>
</ul>
<p>Виведи всі чотири результати і типи колонок. Подумай, чому <code>revenue</code> не число.</p>`,
          starter: `# df = pd.read_csv(...)
# n_rows = ...
# n_dups = ...
# n_missing = ...
# n_shop_names = ...
`,
          hint: 'pd.read_csv приймає параметр sep. Дублікати рахує df.duplicated(), пропуски df.isna(), різні значення колонки nunique().',
          solution: `df = pd.read_csv(io.StringIO(RAW), sep=";")
n_rows = len(df)
n_dups = int(df.duplicated().sum())
n_missing = df.isna().sum()
n_shop_names = df["shop"].nunique()

print("Рядків:", n_rows)
print("Повних дублікатів:", n_dups)
print("Пропуски:")
print(n_missing)
print("Написань точки:", n_shop_names)
print(df.dtypes)`,
          check: `import numpy as np
raw = pd.read_csv(io.StringIO(RAW), sep=";")
df = need("df", pd.DataFrame)
expect(df.shape == raw.shape, f"df має бути розміру {raw.shape}, а зараз {df.shape}: перевір роздільник колонок")
expect(list(df.columns) == ["date", "shop", "revenue", "checks"], f"Колонки мають бути date, shop, revenue, checks, а зараз {list(df.columns)}")
n_rows = need("n_rows", (int, np.integer))
expect(n_rows == len(raw), f"n_rows має бути {len(raw)}, а зараз {n_rows}")
n_dups = need("n_dups", (int, np.integer))
expect(n_dups == int(raw.duplicated().sum()), f"n_dups має бути кількістю повних дублікатів у сирих даних, а зараз {n_dups}")
n_missing = need("n_missing", pd.Series)
for col in raw.columns:
    expect(col in n_missing.index, f"У n_missing немає колонки {col}")
    expect(int(n_missing[col]) == int(raw[col].isna().sum()), f"Пропусків у {col} має бути {int(raw[col].isna().sum())}, а в n_missing {n_missing[col]}")
n_shop_names = need("n_shop_names", (int, np.integer))
expect(n_shop_names == raw["shop"].nunique(), f"Різних написань точки має бути {raw['shop'].nunique()}, а зараз {n_shop_names}")`,
        },
        {
          title: 'Назви точок і суми',
          task: `<p>На вході <code>df</code> з попереднього кроку. Виправ дві колонки на місці, рядки поки не прибирай.</p>
<p><strong>Назви точок.</strong> У <code>shop</code> мають лишитися рівно три значення: <code>Поділ</code>, <code>Оболонь</code>, <code>Позняки</code>. Прибери пробіли по краях, вирівняй регістр, а одруківки виправ словником замін. Два написання можуть виглядати однаково, але бути різними рядками.</p>
<p><strong>Суми.</strong> <code>revenue</code> записано по-різному: <code>19 690,45 грн</code>, <code>13 830,30</code>, <code>18275.1</code>. Між тисячами трапляються і звичайні, і нерозривні пробіли. Перетвори колонку на float; порожні клітинки мають лишитися пропусками.</p>
<p>Виведи <code>df["shop"].value_counts()</code> і кількість пропусків у <code>revenue</code>.</p>`,
          starter: `FIX = {
    # "одруківка": "правильно",
}
# df["shop"] = ...
# df["revenue"] = ...
`,
          hint: 'Спершу виведи sorted(df["shop"].str.strip().str.lower().unique()) і подивись, що лишилось. Якщо дві назви на вигляд однакові, порівняй їх посимвольно через ord(): одна літера може бути латинською. Для сум: регулярний вираз \\s ловить і нерозривний пробіл.',
          solution: `FIX = {
    "подiл": "поділ",      # латинська i
    "оболон": "оболонь",
    "познякі": "позняки",
}
names = df["shop"].str.strip().str.lower()
df["shop"] = names.replace(FIX).str.capitalize()
print(df["shop"].value_counts())

money = (
    df["revenue"]
    .str.replace("грн", "")
    .str.replace(r"\\s", "", regex=True)
    .str.replace(",", ".")
)
df["revenue"] = money.astype(float)
print("Пропусків у revenue:", df["revenue"].isna().sum())`,
          check: `import numpy as np
df = need("df", pd.DataFrame)
raw = pd.read_csv(io.StringIO(RAW), sep=";")
expect(len(df) == len(raw), f"На цьому кроці рядки не прибираємо: має лишитися {len(raw)}, а зараз {len(df)}")
names = sorted(df["shop"].dropna().unique().tolist())
expect(names == sorted(["Поділ", "Оболонь", "Позняки"]), f"У shop мають бути рівно Поділ, Оболонь, Позняки, а зараз {names}")
key = raw["shop"].str.strip().str.lower().str.replace("i", "і").str[:5]
truth_shop = key.map({"поділ": "Поділ", "оболо": "Оболонь", "позня": "Позняки"})
bad = (df["shop"].reset_index(drop=True) != truth_shop).sum()
expect(bad == 0, f"{bad} рядків отримали не ту точку: перевір словник замін")
expect(pd.api.types.is_float_dtype(df["revenue"]), f"revenue має бути float, а зараз {df['revenue'].dtype}")
truth_rev = raw["revenue"].str.replace("грн", "").str.replace("\\u00a0", "").str.replace(" ", "").str.replace(",", ".").astype(float)
expect(df["revenue"].isna().sum() == truth_rev.isna().sum(), f"Пропусків у revenue має бути {truth_rev.isna().sum()}, а зараз {df['revenue'].isna().sum()}")
diff = (df["revenue"].reset_index(drop=True) - truth_rev).abs().max()
expect(diff < 0.005, f"Деякі суми прочитані неправильно: найбільша розбіжність {diff:.2f} грн")`,
        },
        {
          title: 'Дати у трьох форматах',
          task: `<p>На вході <code>df</code> з очищеними <code>shop</code> і <code>revenue</code>. Дати записані трьома способами: <code>2026-01-06</code>, <code>06.01.2026</code> і <code>06/01/2026</code>; день завжди перед місяцем, крім формату з роком на початку.</p>
<p>Перетвори <code>df["date"]</code> на datetime. Не довіряй одному виклику наосліп: перевір результат. Усі дати мають лежати в січні-червні 2026, а кожна точка щомісяця має щонайменше три звіти.</p>
<p>Виведи першу й останню дату і таблицю: кількість звітів за місяцями (рядки) і точками (колонки).</p>`,
          starter: `# df["date"] = pd.to_datetime(df["date"], ...)
`,
          hint: 'Спробуй format="mixed", dayfirst=True і подивись, у які місяці потрапили дати з роком на початку. Надійніше розібрати кожен формат окремо з errors="coerce" і склеїти результати через fillna.',
          solution: `iso = pd.to_datetime(df["date"], format="%Y-%m-%d", errors="coerce")
dmy = pd.to_datetime(df["date"].str.replace("/", "."), format="%d.%m.%Y", errors="coerce")
df["date"] = iso.fillna(dmy)

print(df["date"].min().date(), df["date"].max().date())
print(df.groupby([df["date"].dt.month, "shop"]).size().unstack())`,
          check: `df = need("df", pd.DataFrame)
raw = pd.read_csv(io.StringIO(RAW), sep=";")
expect(pd.api.types.is_datetime64_any_dtype(df["date"]), f"date має бути datetime, а зараз {df['date'].dtype}")
expect(len(df) == len(raw), f"На цьому кроці рядки не прибираємо: має лишитися {len(raw)}, а зараз {len(df)}")
expect(df["date"].notna().all(), "Частина дат не розпізналась (NaT)")
parts = raw["date"].str.split(r"[-./]", regex=True)
iso = raw["date"].str[4] == "-"
year = parts.str[0].where(iso, parts.str[2]).astype(int)
day = parts.str[2].where(iso, parts.str[0]).astype(int)
month = parts.str[1].astype(int)
got = df["date"].reset_index(drop=True)
wrong = (got.dt.year != year) | (got.dt.month != month) | (got.dt.day != day)
if wrong.any():
    i = wrong.idxmax()
    expect(False, f"Дата {raw['date'][i]} прочитана як {got[i].date()}: переплутані день і місяць. Таких рядків {int(wrong.sum())}")`,
        },
        {
          title: 'Дублікати, пропуски, викиди',
          task: `<p>На вході <code>df</code>, де всі колонки вже мають правильні типи. Збери з нього чистий DataFrame <code>clean</code> (індекс з нуля), <code>df</code> не змінюй.</p>
<ul>
<li><strong>Дублікати.</strong> Тепер, коли назви, суми й дати однакові за форматом, повних дублікатів більше, ніж ти знайшов на першому кроці. Прибери їх і запиши, скільки рядків прибрано, у <code>n_removed_dups</code>.</li>
<li><strong>Пропуски.</strong> Звіт без виручки нічого не каже про виручку: такі рядки відкинь. Звіт без кількості чеків залиш, пропуск не заповнюй: виручка в ньому справжня.</li>
<li><strong>Викиди.</strong> Кав'ярня не заробляє за день понад 100 000 грн: такий рядок означає загублену кому. Відкинь рядки з виручкою понад 100 000.</li>
</ul>
<p>Виведи <code>n_removed_dups</code>, кількість рядків у <code>clean</code> і скільки в ньому звітів без кількості чеків.</p>`,
          starter: `# clean = ...
# n_removed_dups = ...
`,
          hint: 'drop_duplicates() без аргументів шукає повні дублікати. Для пропусків у одній колонці є dropna(subset=[...]). Порядок дій тут на результат не впливає, але кількість дублікатів рахуй до інших відсівів.',
          solution: `clean = df.drop_duplicates()
n_removed_dups = len(df) - len(clean)
clean = clean.dropna(subset=["revenue"])
clean = clean[clean["revenue"] <= 100_000].reset_index(drop=True)

print("Прибрано дублікатів:", n_removed_dups)
print("Рядків у clean:", len(clean))
print("Звітів без кількості чеків:", clean["checks"].isna().sum())`,
          check: `import numpy as np
clean = need("clean", pd.DataFrame)
n_removed_dups = need("n_removed_dups", (int, np.integer))
expect(n_removed_dups == 5, f"Після очищення назв, сум і дат повних дублікатів 5, а n_removed_dups = {n_removed_dups}. Рахуй їх до інших відсівів")
expect(clean["revenue"].notna().all(), "У clean лишились рядки без виручки")
expect(clean["revenue"].max() <= 100_000, f"У clean лишився викид: {clean['revenue'].max():.2f} грн")
expect(not clean.duplicated().any(), "У clean лишились повні дублікати")
expect(clean["checks"].isna().sum() == 3, f"Звіти без кількості чеків мають лишитися як є (їх 3), а в clean таких {clean['checks'].isna().sum()}")
expect(len(clean) == 51, f"У clean має бути 51 рядок, а зараз {len(clean)}")
expect(list(clean.index) == list(range(len(clean))), "Індекс clean має йти з нуля без пропусків: reset_index(drop=True)")`,
        },
        {
          title: 'Помісячна структура',
          task: `<p>На вході <code>clean</code>. Додай колонку <code>month</code>: місяць дати як період (<code>dt.to_period("M")</code>). Потім створи:</p>
<ul>
<li><code>daily</code>: середня денна виручка, рядки: місяці, колонки: точки (<code>pivot_table</code>);</li>
<li><code>avg_check</code>: середній чек тієї ж форми, рахуй як суму виручки, поділену на суму чеків, і лише за звітами, де кількість чеків відома;</li>
<li><code>growth</code>: Series по точках, на скільки відсотків середня денна виручка червня більша за січневу.</li>
</ul>
<p>Виведи всі три, округливши до одного знака після коми.</p>`,
          starter: `# clean["month"] = ...
# daily = ...
# avg_check = ...
# growth = ...
`,
          hint: 'Середнє відношень і відношення сум дають різні числа: середній чек мережі рахують як відношення сум. Звіти без чеків відкинь лише для avg_check, щоб їхня виручка не потрапила в чисельник без чеків у знаменнику.',
          solution: `clean["month"] = clean["date"].dt.to_period("M")
daily = clean.pivot_table(index="month", columns="shop", values="revenue", aggfunc="mean")

known = clean.dropna(subset=["checks"])
sums = known.groupby(["month", "shop"])[["revenue", "checks"]].sum()
avg_check = (sums["revenue"] / sums["checks"]).unstack()

growth = (daily.iloc[-1] / daily.iloc[0] - 1) * 100

print(daily.round(1))
print(avg_check.round(1))
print(growth.round(1))`,
          check: `EXP_DAILY = {"Оболонь": [13829.05, 14978.75, 15470.0467, 15892.9233, 15503.4233, 16414.8633], "Поділ": [18849.08, 16776.095, 18354.2533, 18053.6867, 19689.34, 20985.75], "Позняки": [10018.52, 9813.9467, 11618.5933, 12244.2067, 14819.0933, 15133.11]}
EXP_CHECK = {"Оболонь": [97.282, 101.5508, 102.905, 103.4247, 100.6716, 106.59], "Поділ": [115.2775, 114.5126, 113.5315, 117.2317, 116.2756, 118.7873], "Позняки": [85.6284, 89.4889, 92.7015, 92.0617, 94.9057, 97.4235]}
EXP_GROWTH = {"Оболонь": 18.6984, "Поділ": 11.3357, "Позняки": 51.0514}
clean = need("clean", pd.DataFrame)
expect("month" in clean.columns, "У clean немає колонки month")
expect(isinstance(clean["month"].dtype, pd.PeriodDtype), f"month має бути періодом (dt.to_period), а зараз {clean['month'].dtype}")
for name, exp, why in [
    ("daily", EXP_DAILY, "Це середня виручка за звіт, а не сума за місяць"),
    ("avg_check", EXP_CHECK, "Рахуй суму виручки, поділену на суму чеків, лише за звітами з відомими чеками"),
]:
    table = need(name, pd.DataFrame)
    expect(table.shape == (6, 3), f"{name}: має бути 6 місяців на 3 точки, а зараз {table.shape}")
    expect(sorted(table.columns) == sorted(exp), f"{name}: колонками мають бути точки, а зараз {list(table.columns)}")
    for shop, vals in exp.items():
        for i, (g, e) in enumerate(zip(table[shop].tolist(), vals)):
            expect(approx(g, e, 1e-5), f"{name}, {shop}, місяць {i + 1}: очікувалось {e:.2f}, а зараз {g:.2f}. {why}")
growth = need("growth", pd.Series)
for shop, e in EXP_GROWTH.items():
    expect(shop in growth.index, f"У growth немає точки {shop}")
    expect(approx(growth[shop], e, 1e-5), f"growth для {shop}: очікувалось {e:.1f}%, а зараз {growth[shop]:.2f}. Порівнюй червень із січнем у відсотках")`,
        },
        {
          title: 'Графік динаміки',
          task: `<p>На вході <code>daily</code>. Побудуй один лінійний графік: по лінії на кожну точку, по осі X місяці, по осі Y середня денна виручка в тисячах гривень.</p>
<p>Підпиши лінії назвами точок і додай легенду. У назві графіка вкажи одиниці (<code>тис. грн</code>), підпиши обидві осі.</p>`,
          starter: `import matplotlib.pyplot as plt

fig, ax = plt.subplots(figsize=(8, 4.5))
# ...
`,
          hint: 'Поділи daily на 1000 і малюй кожну колонку окремим ax.plot з label=назва точки. Місяці-періоди для осі X зручно перетворити на рядки: daily.index.astype(str).',
          solution: `import matplotlib.pyplot as plt

fig, ax = plt.subplots(figsize=(8, 4.5))
for shop in daily.columns:
    ax.plot(daily.index.astype(str), daily[shop] / 1000, marker="o", label=shop)
ax.set_title("Середня денна виручка за місяцями, тис. грн")
ax.set_xlabel("Місяць")
ax.set_ylabel("Виручка за день")
ax.legend()`,
          check: `EXP = {"Оболонь": [13.82905, 14.97875, 15.4700467, 15.8929233, 15.5034233, 16.4148633], "Поділ": [18.84908, 16.776095, 18.3542533, 18.0536867, 19.68934, 20.98575], "Позняки": [10.01852, 9.8139467, 11.6185933, 12.2442067, 14.8190933, 15.13311]}
figs = figures()
expect(len(figs) == 1, f"Має бути один графік, а зараз {len(figs)}")
axes = figs[0].axes
expect(len(axes) == 1, f"Має бути одна панель, а зараз {len(axes)}")
ax = axes[0]
lines = {l.get_label(): l for l in ax.get_lines()}
for shop, vals in EXP.items():
    expect(shop in lines, f"Немає лінії з підписом {shop}: передай label у ax.plot")
    y = [float(v) for v in lines[shop].get_ydata()]
    expect(len(y) == 6, f"Лінія {shop} має мати 6 точок, а зараз {len(y)}")
    expect(all(approx(a, b, 1e-4) for a, b in zip(y, vals)), f"Лінія {shop} не збігається з daily у тисячах гривень: січень {y[0]:.2f} замість {vals[0]:.2f}")
expect(ax.get_legend() is not None, "Додай легенду: ax.legend()")
title = ax.get_title()
expect("тис" in title and "грн" in title, f"У назві графіка вкажи одиниці, тис. грн. Зараз назва: {title!r}")
expect(ax.get_xlabel().strip() != "" and ax.get_ylabel().strip() != "", "Підпиши обидві осі")`,
        },
        {
          title: 'Висновок',
          task: `<p>На вході <code>growth</code>, <code>daily</code> і <code>avg_check</code>. Дай власнику відповідь:</p>
<ul>
<li><code>best_shop</code>: точка з найбільшим зростанням середньої денної виручки (рядок);</li>
<li><code>best_growth</code>: це зростання у відсотках, округлене до одного знака;</li>
<li><code>best_check_change</code>: на скільки відсотків за той самий час змінився середній чек цієї точки, теж з одним знаком.</li>
</ul>
<p>Виведи одне речення з назвою точки і обома числами (з одним знаком після коми). Якщо чек виріс значно менше, ніж виручка, то зростання дали нові гості.</p>`,
          starter: `# best_shop = ...
# best_growth = ...
# best_check_change = ...
`,
          hint: 'idxmax() повертає мітку найбільшого значення. Для зміни чека візьми колонку best_shop з avg_check і порівняй останній місяць з першим так само, як рахував growth.',
          solution: `best_shop = growth.idxmax()
best_growth = round(float(growth.max()), 1)
col = avg_check[best_shop]
best_check_change = round(float((col.iloc[-1] / col.iloc[0] - 1) * 100), 1)

print(f"Найбільше зросла точка {best_shop}: середня денна виручка +{best_growth:.1f}% "
      f"за січень-червень, а середній чек лише +{best_check_change:.1f}%, тож зростання дали нові гості.")`,
          check: `import numpy as np
best_shop = need("best_shop", str)
expect(best_shop == "Позняки", f"best_shop має бути точкою з найбільшим growth, а зараз {best_shop}")
best_growth = need("best_growth", (int, float, np.integer, np.floating))
expect(abs(best_growth - 51.1) < 0.06, f"best_growth має бути зростанням цієї точки у відсотках з одним знаком, а зараз {best_growth}")
best_check_change = need("best_check_change", (int, float, np.integer, np.floating))
expect(abs(best_check_change - 13.8) < 0.06, f"best_check_change: зміна середнього чека цієї точки з січня до червня, %. Зараз {best_check_change}")
expect(best_shop in OUTPUT, "У реченні має бути назва точки")
expect("51.1" in OUTPUT or "51,1" in OUTPUT, "У реченні має бути зростання виручки з одним знаком після коми")
expect("13.8" in OUTPUT or "13,8" in OUTPUT, "У реченні має бути зміна середнього чека з одним знаком після коми")`,
        },
      ],
    },
    {
      id: 'p4-2',
      title: 'Електроенергія п\'яти офісів',
      skills: ['одиниці виміру', 'збої як пропуски', 'pivot_table', 'subplots', 'висновок з цифрами'],
      story: `<p>Ти аналітик господарського відділу компанії з офісами в п'яти містах. Завгоспи щомісяця надсилають споживання електроенергії за 2025 рік: хто в кіловат-годинах, хто в мегават-годинах, з різними назвами міст і датами. Лічильник інколи дає збій і показує від'ємне число, а деякі звіти надіслано двічі.</p>
<p>Площі офісів у словнику <code>AREAS</code>, м². Фінансовий директор питає: який офіс витрачає найбільше енергії на квадратний метр, у який місяць у нього пік і наскільки він гірший за решту?</p>`,
      setup: `import io
import pandas as pd

AREAS = {"Київ": 1200, "Львів": 650, "Харків": 800, "Одеса": 500, "Дніпро": 700}

RAW = """${RAW_ENERGY}"""`,
      steps: [
        {
          title: 'Діагностика',
          task: `<p>Прочитай <code>RAW</code> у DataFrame <code>df</code> і нічого не виправляй. Порахуй:</p>
<ul>
<li><code>n_dups</code>: кількість повних дублікатів рядків;</li>
<li><code>n_missing</code>: скільки порожніх клітинок у <code>consumption</code> (ціле число);</li>
<li><code>unit_variants</code>: відсортований список різних написань одиниці в <code>unit</code>;</li>
<li><code>n_office_names</code>: скільки різних написань офісу в <code>office</code>.</li>
</ul>
<p>Виведи їх і <code>df.dtypes</code>. Подивись на <code>unit_variants</code> уважно: скільки там насправді різних одиниць?</p>`,
          starter: `# df = ...
# n_dups = ...
# n_missing = ...
# unit_variants = ...
# n_office_names = ...
`,
          hint: 'sorted() приймає результат unique() і повертає список. Щоб побачити пробіли в кінці рядків, виводь значення через repr() або у списку.',
          solution: `df = pd.read_csv(io.StringIO(RAW))
n_dups = int(df.duplicated().sum())
n_missing = int(df["consumption"].isna().sum())
unit_variants = sorted(df["unit"].unique())
n_office_names = df["office"].nunique()

print("Рядків:", len(df))
print("Повних дублікатів:", n_dups)
print("Порожніх consumption:", n_missing)
print("Написання одиниць:", unit_variants)
print("Написань офісу:", n_office_names)
print(df.dtypes)`,
          check: `import numpy as np
raw = pd.read_csv(io.StringIO(RAW))
df = need("df", pd.DataFrame)
expect(df.shape == raw.shape, f"df має бути розміру {raw.shape}, а зараз {df.shape}")
n_dups = need("n_dups", (int, np.integer))
expect(n_dups == int(raw.duplicated().sum()), f"n_dups має бути кількістю повних дублікатів, а зараз {n_dups}")
n_missing = need("n_missing", (int, np.integer))
expect(n_missing == int(raw["consumption"].isna().sum()), f"n_missing має бути {int(raw['consumption'].isna().sum())}, а зараз {n_missing}")
unit_variants = need("unit_variants", list)
expect(unit_variants == sorted(raw["unit"].unique()), f"unit_variants має бути відсортованим списком усіх {raw['unit'].nunique()} написань одиниці")
n_office_names = need("n_office_names", (int, np.integer))
expect(n_office_names == raw["office"].nunique(), f"Різних написань офісу {raw['office'].nunique()}, а зараз {n_office_names}")`,
        },
        {
          title: 'Офіси і місяці',
          task: `<p>На вході <code>df</code>. Рядки не прибирай.</p>
<p><strong>Офіси.</strong> Зведи <code>office</code> до п'яти назв, як у <code>AREAS</code>: <code>Київ</code>, <code>Львів</code>, <code>Харків</code>, <code>Одеса</code>, <code>Дніпро</code>. Тут є і латиниця, і російське написання, і латинська <code>i</code> посеред українського слова.</p>
<p><strong>Місяці.</strong> Кожна дата в <code>date</code> останній день місяця, у трьох форматах. Додай колонку <code>month</code>: місяць як період (<code>dt.to_period("M")</code>). Перевір результат: кожен офіс має мати всі 12 місяців 2025 року.</p>
<p>Виведи таблицю: кількість звітів за офісами (рядки) і місяцями (колонки).</p>`,
          starter: `FIX = {
    # "написання": "правильна назва",
}
# df["office"] = ...
# df["month"] = ...
`,
          hint: 'Після strip і lower склади словник для всіх написань, що лишились не такими, як у AREAS (у нижньому регістрі). Дні тут від 28 до 31, тож переплутати їх з місяцем неможливо: format="mixed" з dayfirst=True тут спрацює, але перевір таблицею.',
          solution: `FIX = {
    "kyiv": "київ",
    "одесса": "одеса",
    "львiв": "львів",
    "харкiв": "харків",
    "днiпро": "дніпро",
}
df["office"] = df["office"].str.strip().str.lower().replace(FIX).str.capitalize()
df["month"] = pd.to_datetime(df["date"], format="mixed", dayfirst=True).dt.to_period("M")

print(pd.crosstab(df["office"], df["month"].dt.month))`,
          check: `df = need("df", pd.DataFrame)
raw = pd.read_csv(io.StringIO(RAW))
expect(len(df) == len(raw), f"Рядки не прибирай: має бути {len(raw)}, а зараз {len(df)}")
names = sorted(df["office"].unique().tolist())
expect(names == sorted(AREAS), f"В office мають бути рівно {sorted(AREAS)}, а зараз {names}")
key = raw["office"].str.strip().str.lower().str.replace("kyiv", "київ").str.replace("i", "і").str[:3]
truth = key.map({"киї": "Київ", "льв": "Львів", "хар": "Харків", "оде": "Одеса", "дні": "Дніпро"})
bad = int((df["office"].reset_index(drop=True) != truth).sum())
expect(bad == 0, f"{bad} рядків отримали не той офіс: перевір словник замін")
expect("month" in df.columns, "Немає колонки month")
expect(isinstance(df["month"].dtype, pd.PeriodDtype), f"month має бути періодом (dt.to_period), а зараз {df['month'].dtype}")
parts = raw["date"].str.split(r"[-./]", regex=True)
iso = raw["date"].str[4] == "-"
month = parts.str[1].astype(int)
year = parts.str[0].where(iso, parts.str[2]).astype(int)
got = df["month"].reset_index(drop=True)
wrong = int(((got.dt.month != month) | (got.dt.year != year)).sum())
expect(wrong == 0, f"{wrong} дат отримали не той місяць")`,
        },
        {
          title: 'Одиниці і збої лічильника',
          task: `<p>На вході <code>df</code> з виправленими <code>office</code> і <code>month</code>. Додай колонку <code>kwh</code>: споживання в кіловат-годинах, float.</p>
<ul>
<li><code>consumption</code> записано і з пробілами між тисячами (бувають нерозривні), і з комою як десятковим знаком: <code>"13,31"</code> МВт·год означає 13 310 кВт·год.</li>
<li>Значення в мегават-годинах помнож на 1000. Хоч як записана одиниця, кіловат від мегавата відрізняє перша літера.</li>
<li>Від'ємне споживання означає збій лічильника. Заміни такі значення на пропуск, не на нуль і не на середнє: справжнього числа ми не знаємо. Скільки їх було, запиши в <code>n_failures</code>.</li>
</ul>
<p>Виведи <code>n_failures</code>, кількість пропусків у <code>kwh</code> і найменше та найбільше значення <code>kwh</code>.</p>`,
          starter: `import numpy as np

# value = ...
# df["kwh"] = ...
# n_failures = ...
`,
          hint: 'Спершу зроби число з тексту (прибери \\s, кому заміни крапкою), потім множник з одиниці: unit.str.strip().str.lower().str.startswith("м"). Для заміни на пропуск підійде df["kwh"].mask(умова).',
          solution: `import numpy as np

value = (
    df["consumption"]
    .str.replace(r"\\s", "", regex=True)
    .str.replace(",", ".")
    .astype(float)
)
is_mwh = df["unit"].str.strip().str.lower().str.startswith("м")
df["kwh"] = value * np.where(is_mwh, 1000, 1)

n_failures = int((df["kwh"] < 0).sum())
df["kwh"] = df["kwh"].mask(df["kwh"] < 0)

print("Збоїв лічильника:", n_failures)
print("Пропусків у kwh:", df["kwh"].isna().sum())
print("Від", df["kwh"].min(), "до", df["kwh"].max())`,
          check: `import numpy as np
df = need("df", pd.DataFrame)
raw = pd.read_csv(io.StringIO(RAW))
expect("kwh" in df.columns, "Немає колонки kwh")
expect(pd.api.types.is_float_dtype(df["kwh"]), f"kwh має бути float, а зараз {df['kwh'].dtype}")
expect(len(df) == len(raw), f"Рядки не прибирай: має бути {len(raw)}, а зараз {len(df)}")
num = raw["consumption"].str.replace("\\u00a0", "").str.replace(" ", "").str.replace(",", ".").astype(float)
mult = raw["unit"].str.strip().str.lower().str[0].map({"к": 1.0, "м": 1000.0})
truth = (num * mult).where(num >= 0)
n_failures = need("n_failures", (int, np.integer))
expect(n_failures == int((num < 0).sum()), f"Збоїв (від'ємних значень) {int((num < 0).sum())}, а n_failures = {n_failures}")
expect((df["kwh"] < 0).sum() == 0, "У kwh лишились від'ємні значення")
expect(df["kwh"].isna().sum() == truth.isna().sum(), f"Пропусків у kwh має бути {truth.isna().sum()}: порожні і збої, а зараз {df['kwh'].isna().sum()}")
got = df["kwh"].reset_index(drop=True)
small = got[(got < 1000)]
expect(small.empty, f"Є значення {small.iloc[0] if not small.empty else ''} кВт·год: схоже, мегават-години не переведені")
diff = (got - truth).abs().max()
expect(diff < 0.01, f"Деякі значення прочитані неправильно: найбільша розбіжність {diff:.0f} кВт·год")`,
        },
        {
          title: 'Повторні звіти',
          task: `<p>На вході <code>df</code> з колонкою <code>kwh</code>. Повторний звіт: той самий офіс за той самий місяць. Частина повторів збігається дослівно, а частина записана в іншій одиниці чи іншому форматі дати.</p>
<p>Спершу виведи всі рядки, де пара (<code>office</code>, <code>month</code>) трапляється більше одного разу, і переконайся, що <code>kwh</code> у повторах однакове. Потім створи <code>energy</code>: колонки <code>office</code>, <code>month</code>, <code>kwh</code>, по одному рядку на офіс і місяць, індекс з нуля. Скільки рядків прибрано, запиши в <code>n_repeats</code>.</p>`,
          starter: `# repeats = ...
# energy = ...
# n_repeats = ...
`,
          hint: 'duplicated і drop_duplicates приймають subset: список колонок, за якими рядки вважаються однаковими. keep=False у duplicated позначає всі копії, а не лише другу.',
          solution: `repeats = df[df.duplicated(subset=["office", "month"], keep=False)]
print(repeats.sort_values(["office", "month"])[["office", "month", "consumption", "unit", "kwh"]])

energy = (
    df[["office", "month", "kwh"]]
    .drop_duplicates(subset=["office", "month"])
    .reset_index(drop=True)
)
n_repeats = len(df) - len(energy)
print("Прибрано повторів:", n_repeats)
print("Рядків у energy:", len(energy))`,
          check: `import numpy as np
energy = need("energy", pd.DataFrame)
expect(sorted(energy.columns) == ["kwh", "month", "office"], f"У energy мають бути колонки office, month, kwh, а зараз {list(energy.columns)}")
expect(not energy.duplicated(subset=["office", "month"]).any(), "У energy лишились повтори офісу й місяця")
expect(len(energy) == 60, f"Має бути 60 рядків: 5 офісів на 12 місяців, а зараз {len(energy)}")
expect(list(energy.index) == list(range(len(energy))), "Індекс energy має йти з нуля: reset_index(drop=True)")
n_repeats = need("n_repeats", (int, np.integer))
expect(n_repeats == 4, f"Прибрано має бути 4 рядки, а n_repeats = {n_repeats}")
expect(energy["kwh"].isna().sum() == 4, f"Пропуски kwh (порожні звіти і збої) мають лишитися: їх 4, а зараз {energy['kwh'].isna().sum()}")`,
        },
        {
          title: 'Споживання на квадратний метр',
          task: `<p>На вході <code>energy</code> і словник площ <code>AREAS</code>. Створи:</p>
<ul>
<li><code>pivot</code>: споживання кВт·год, рядки: офіси, колонки: місяці (<code>pivot_table</code>); місяці зі збоєм лишаються порожніми;</li>
<li><code>intensity</code>: середнє місячне споживання на 1 м² за відомі місяці, Series по офісах, відсортована за спаданням;</li>
<li><code>peak</code>: Series, для кожного офісу місяць найбільшого споживання.</li>
</ul>
<p>Виведи <code>intensity</code> з одним знаком після коми і <code>peak</code>.</p>`,
          starter: `# pivot = ...
# intensity = ...
# peak = ...
`,
          hint: 'Порівнювати офіси різного розміру можна лише на одиницю площі. pd.Series(AREAS) вирівнюється з середнім по рядках pivot за назвою офісу. mean і idxmax по рядках беруть axis=1 і пропуски пропускають самі.',
          solution: `pivot = energy.pivot_table(index="office", columns="month", values="kwh")
intensity = (pivot.mean(axis=1) / pd.Series(AREAS)).sort_values(ascending=False)
peak = pivot.idxmax(axis=1)

print(intensity.round(1))
print(peak)`,
          check: `EXP = {"Одеса": 30.888333, "Київ": 23.937121, "Дніпро": 23.076623, "Харків": 22.832955, "Львів": 21.448951}
EXP_PEAK = {"Дніпро": "2025-01", "Київ": "2025-02", "Львів": "2025-02", "Одеса": "2025-07", "Харків": "2025-12"}
pivot = need("pivot", pd.DataFrame)
expect(pivot.shape == (5, 12), f"pivot: 5 офісів на 12 місяців, а зараз {pivot.shape}")
expect(sorted(pivot.index) == sorted(AREAS), f"Рядками pivot мають бути офіси, а зараз {list(pivot.index)}")
expect(int(pivot.isna().sum().sum()) == 4, f"У pivot мають лишитися 4 порожні клітинки (пропуски і збої), а зараз {int(pivot.isna().sum().sum())}")
intensity = need("intensity", pd.Series)
for office, e in EXP.items():
    expect(office in intensity.index, f"У intensity немає офісу {office}")
    expect(approx(intensity[office], e, 1e-6), f"intensity для {office}: очікувалось {e:.2f}, а зараз {intensity[office]:.2f}. Середнє за відомі місяці поділи на площу")
expect(intensity.is_monotonic_decreasing, "intensity має бути відсортована за спаданням")
peak = need("peak", pd.Series)
for office, e in EXP_PEAK.items():
    expect(office in peak.index, f"У peak немає офісу {office}")
    expect(str(peak[office])[:7] == e, f"peak для {office}: очікувався {e}, а зараз {peak[office]}")`,
        },
        {
          title: 'Дві панелі',
          task: `<p>На вході <code>intensity</code> і <code>pivot</code>. Побудуй одну фігуру з двома панелями поруч (<code>plt.subplots(1, 2)</code>):</p>
<ul>
<li>ліворуч стовпці: споживання на 1 м² за офісами, від найбільшого до найменшого; назва з одиницями <code>кВт·год на м²</code>;</li>
<li>праворуч лінія: помісячне споживання офісу, що на лівій панелі перший, у тисячах кВт·год; у назві офіс і одиниці.</li>
</ul>
<p>Підпиши осі на обох панелях.</p>`,
          starter: `import matplotlib.pyplot as plt

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(11, 4))
# ...
`,
          hint: 'intensity уже відсортована, тож ax1.bar(intensity.index, intensity.values) дасть потрібний порядок. Офіс для правої панелі: intensity.index[0]. Рядок pivot для нього: pivot.loc[назва].',
          solution: `import matplotlib.pyplot as plt

worst = intensity.index[0]
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(11, 4))

ax1.bar(intensity.index, intensity.values)
ax1.set_title("Споживання за місяць, кВт·год на м²")
ax1.set_xlabel("Офіс")
ax1.set_ylabel("Споживання")

ax2.plot(pivot.columns.astype(str), pivot.loc[worst] / 1000, marker="o")
ax2.set_title(f"{worst} за місяцями, тис. кВт·год")
ax2.set_xlabel("Місяць")
ax2.set_ylabel("Споживання")
ax2.tick_params(axis="x", labelrotation=45)
fig.tight_layout()`,
          check: `NAMES = ["Одеса", "Київ", "Дніпро", "Харків", "Львів"]
HEIGHTS = [30.888333, 23.937121, 23.076623, 22.832955, 21.448951]
LINE = [13.31, 12.32, 13.15, 13.13, 15.71, 18.07, 21.31, 20.85, 16.79, 14.79, 12.69, 13.21]
figs = figures()
expect(len(figs) == 1, f"Має бути одна фігура, а зараз {len(figs)}")
fig = figs[0]
expect(len(fig.axes) == 2, f"У фігурі мають бути дві панелі, а зараз {len(fig.axes)}")
fig.canvas.draw()
ax1, ax2 = fig.axes
bars = ax1.patches
expect(len(bars) == 5, f"Ліворуч має бути 5 стовпців, а зараз {len(bars)}")
heights = [b.get_height() for b in bars]
expect(all(approx(h, e, 1e-5) for h, e in zip(heights, HEIGHTS)), f"Висоти стовпців мають дорівнювати intensity від найбільшого до найменшого, а зараз {[round(h, 1) for h in heights]}")
expect(all(b.get_y() == 0 for b in bars), "Стовпці мають починатися від нуля")
labels = [t.get_text() for t in ax1.get_xticklabels()]
expect(labels == NAMES, f"Під стовпцями мають бути назви офісів у тому самому порядку, а зараз {labels}")
lines = ax2.get_lines()
expect(len(lines) >= 1, "Праворуч має бути лінія")
y = [float(v) for v in lines[0].get_ydata()]
expect(len(y) == 12 and all(approx(a, b, 1e-6) for a, b in zip(y, LINE)), "Лінія праворуч має показувати помісячне споживання першого офісу в тисячах кВт·год")
t1, t2 = ax1.get_title(), ax2.get_title()
expect("кВт" in t1 and ("м²" in t1 or "м2" in t1), f"У назві лівої панелі вкажи одиниці, кВт·год на м². Зараз: {t1!r}")
expect("Одеса" in t2 and "тис" in t2, f"У назві правої панелі вкажи офіс і одиниці, тис. кВт·год. Зараз: {t2!r}")
for ax in (ax1, ax2):
    expect(ax.get_xlabel().strip() != "" and ax.get_ylabel().strip() != "", "Підпиши осі на обох панелях")`,
        },
        {
          title: 'Висновок',
          task: `<p>На вході <code>intensity</code> і <code>peak</code>. Створи:</p>
<ul>
<li><code>worst_office</code>: офіс з найбільшим споживанням на 1 м² (рядок);</li>
<li><code>worst_value</code>: його споживання на 1 м², з одним знаком після коми;</li>
<li><code>peak_month</code>: його місяць піку рядком у вигляді <code>2025-03</code>;</li>
<li><code>gap_pct</code>: на скільки відсотків він перевищує середнє споживання на 1 м² решти чотирьох офісів, з одним знаком.</li>
</ul>
<p>Виведи речення з усіма чотирма значеннями.</p>`,
          starter: `# worst_office = ...
# worst_value = ...
# peak_month = ...
# gap_pct = ...
`,
          hint: 'Решта офісів: intensity.drop(worst_office). Період перетворюється на рядок через str().',
          solution: `worst_office = intensity.index[0]
worst_value = round(float(intensity.iloc[0]), 1)
peak_month = str(peak[worst_office])
others = intensity.drop(worst_office).mean()
gap_pct = round(float((intensity.iloc[0] / others - 1) * 100), 1)

print(f"Найбільше на 1 м² витрачає офіс {worst_office}: {worst_value} кВт·год за місяць, "
      f"на {gap_pct}% більше за середнє решти офісів; пік споживання в {peak_month}.")`,
          check: `import numpy as np
worst_office = need("worst_office", str)
expect(worst_office == "Одеса", f"worst_office має бути першим в intensity, а зараз {worst_office}")
worst_value = need("worst_value", (int, float, np.integer, np.floating))
expect(abs(worst_value - 30.9) < 0.06, f"worst_value має бути споживанням на 1 м² з одним знаком, а зараз {worst_value}")
peak_month = need("peak_month", str)
expect(peak_month == "2025-07", f"peak_month має бути рядком на кшталт 2025-03, а зараз {peak_month!r}")
gap_pct = need("gap_pct", (int, float, np.integer, np.floating))
expect(abs(gap_pct - 35.3) < 0.06, f"gap_pct: на скільки відсотків офіс перевищує середнє решти чотирьох, а зараз {gap_pct}")
for value in ["Одеса", "30.9", "2025-07", "35.3"]:
    expect(value in OUTPUT or value.replace(".", ",") in OUTPUT, f"У реченні немає значення {value}")`,
        },
      ],
    },
    {
      id: 'p4-3',
      title: 'Запізнення і скарги служби доставки',
      skills: ['регулярні вирази в назвах', 'тривалість між датами', 'boolean з пропусками', 'groupby і pivot_table', 'subplots'],
      story: `<p>Ти аналітик служби доставки продуктів у Києві. Оператори ведуть журнал замовлень за лютий-березень 2026 вручну: район пишуть як заманеться, час фіксують у двох форматах, частину замовлень внесено двічі.</p>
<p>Компанія вирішує, де відкрити ще один склад. Питання: у якому районі доставка найповільніша, яка там частка запізнень понад 60 хвилин і чи справді запізнення призводять до скарг?</p>`,
      setup: `import io
import pandas as pd

RAW = """${RAW_DELIVERY}"""`,
      steps: [
        {
          title: 'Діагностика',
          task: `<p>Прочитай <code>RAW</code> у DataFrame <code>df</code> і нічого не виправляй. Порахуй:</p>
<ul>
<li><code>n_full_dups</code>: кількість повних дублікатів рядків;</li>
<li><code>n_dup_ids</code>: скільки рядків повторюють номер замовлення, що вже траплявся вище;</li>
<li><code>n_not_delivered</code>: скільки замовлень без часу доставки;</li>
<li><code>complaint_values</code>: відсортований список різних непорожніх значень у <code>complaint</code>.</li>
</ul>
<p>Виведи їх. Подумай, чому <code>n_dup_ids</code> більше за <code>n_full_dups</code> і який із двох підрахунків правильний для журналу замовлень.</p>`,
          starter: `# df = ...
# n_full_dups = ...
# n_dup_ids = ...
# n_not_delivered = ...
# complaint_values = ...
`,
          hint: 'duplicated() можна викликати і на всьому DataFrame, і на одній колонці. Порожні значення прибере dropna() перед unique().',
          solution: `df = pd.read_csv(io.StringIO(RAW), sep=";")
n_full_dups = int(df.duplicated().sum())
n_dup_ids = int(df["order_id"].duplicated().sum())
n_not_delivered = int(df["delivered_at"].isna().sum())
complaint_values = sorted(df["complaint"].dropna().unique())

print("Рядків:", len(df))
print("Повних дублікатів:", n_full_dups)
print("Повторених номерів:", n_dup_ids)
print("Без часу доставки:", n_not_delivered)
print("Значення complaint:", complaint_values)`,
          check: `import numpy as np
raw = pd.read_csv(io.StringIO(RAW), sep=";")
df = need("df", pd.DataFrame)
expect(df.shape == raw.shape, f"df має бути розміру {raw.shape}, а зараз {df.shape}: перевір роздільник колонок")
n_full_dups = need("n_full_dups", (int, np.integer))
expect(n_full_dups == int(raw.duplicated().sum()), f"n_full_dups має бути {int(raw.duplicated().sum())}, а зараз {n_full_dups}")
n_dup_ids = need("n_dup_ids", (int, np.integer))
expect(n_dup_ids == int(raw["order_id"].duplicated().sum()), f"n_dup_ids має рахувати повтори лише номера замовлення, а зараз {n_dup_ids}")
n_not_delivered = need("n_not_delivered", (int, np.integer))
expect(n_not_delivered == int(raw["delivered_at"].isna().sum()), f"Без часу доставки {int(raw['delivered_at'].isna().sum())} замовлення, а зараз {n_not_delivered}")
complaint_values = need("complaint_values", list)
expect(complaint_values == sorted(raw["complaint"].dropna().unique()), "complaint_values має бути відсортованим списком усіх непорожніх написань, з пробілами як є")`,
        },
        {
          title: 'Райони',
          task: `<p>На вході <code>df</code>. Зведи <code>district</code> до чотирьох назв: <code>Шевченківський</code>, <code>Оболонський</code>, <code>Дарницький</code>, <code>Голосіївський</code>. Рядки не прибирай.</p>
<p>Частина записів має хвіст <code>р-н</code> або <code>район</code>: прибери його регулярним виразом, а не словником на кожне написання. Народні назви (<code>Оболонь</code>, <code>Дарниця</code>) і одруківки виправ словником. Виведи <code>df["district"].value_counts()</code>.</p>`,
          starter: `FIX = {
    # "написання": "правильна назва",
}
# df["district"] = ...
`,
          hint: 'У регулярному виразі хвіст описується так: пробіли, потім одне з двох слів через |, потім кінець рядка ($). Після заміни виведи унікальні значення і подивись, що ще лишилось.',
          solution: `FIX = {
    "шевченкiвський": "шевченківський",   # латинська i
    "оболонь": "оболонський",
    "дарниця": "дарницький",
    "голосієвський": "голосіївський",
}
district = (
    df["district"]
    .str.strip()
    .str.lower()
    .str.replace(r"\\s+(р-н|район)$", "", regex=True)
    .replace(FIX)
    .str.capitalize()
)
df["district"] = district
print(df["district"].value_counts())`,
          check: `df = need("df", pd.DataFrame)
raw = pd.read_csv(io.StringIO(RAW), sep=";")
expect(len(df) == len(raw), f"Рядки не прибирай: має бути {len(raw)}, а зараз {len(df)}")
NAMES = ["Голосіївський", "Дарницький", "Оболонський", "Шевченківський"]
names = sorted(df["district"].unique().tolist())
expect(names == NAMES, f"У district мають бути рівно {NAMES}, а зараз {names}")
key = raw["district"].str.strip().str.lower().str[:4].str.replace("i", "і")
truth = key.map({"шевч": "Шевченківський", "обол": "Оболонський", "дарн": "Дарницький", "голо": "Голосіївський"})
bad = int((df["district"].reset_index(drop=True) != truth).sum())
expect(bad == 0, f"{bad} рядків отримали не той район: перевір словник замін")`,
        },
        {
          title: 'Час доставки',
          task: `<p>На вході <code>df</code> з виправленими районами. У <code>ordered_at</code> і <code>delivered_at</code> час записано двома способами: <code>2026-02-14 18:05</code> і <code>14.02.2026 18:05</code>, причому формати змішані навіть у межах одного рядка.</p>
<p>Перетвори обидві колонки на datetime (порожній час доставки лишається NaT). Додай колонку <code>minutes</code>: скільки хвилин минуло від замовлення до доставки, float.</p>
<p>Виведи <code>df["minutes"].describe()</code>. Подивись на найменше і найбільше значення: що з ними не так? Виправлятимеш на наступному кроці.</p>`,
          starter: `# df["ordered_at"] = ...
# df["delivered_at"] = ...
# df["minutes"] = ...
`,
          hint: 'Пам\'ятаєш дати кав\'ярень? Один виклик для двох форматів тут теж помиляється. Напиши функцію, що розбирає колонку двома форматами з errors="coerce" і склеює результати, і застосуй її до обох колонок. Різниця двох datetime дає timedelta: .dt.total_seconds() / 60.',
          solution: `def parse(col):
    iso = pd.to_datetime(col, format="%Y-%m-%d %H:%M", errors="coerce")
    dmy = pd.to_datetime(col, format="%d.%m.%Y %H:%M", errors="coerce")
    return iso.fillna(dmy)

df["ordered_at"] = parse(df["ordered_at"])
df["delivered_at"] = parse(df["delivered_at"])
df["minutes"] = (df["delivered_at"] - df["ordered_at"]).dt.total_seconds() / 60

print(df["minutes"].describe().round(1))`,
          check: `df = need("df", pd.DataFrame)
raw = pd.read_csv(io.StringIO(RAW), sep=";")
expect(len(df) == len(raw), f"Рядки не прибирай: має бути {len(raw)}, а зараз {len(df)}")
for col in ["ordered_at", "delivered_at"]:
    expect(pd.api.types.is_datetime64_any_dtype(df[col]), f"{col} має бути datetime, а зараз {df[col].dtype}")
expect(df["ordered_at"].notna().all(), "Частина ordered_at не розпізналась (NaT)")
expect(df["delivered_at"].isna().sum() == raw["delivered_at"].isna().sum(), f"NaT у delivered_at має бути стільки ж, скільки порожніх клітинок: {raw['delivered_at'].isna().sum()}")

def truth(col):
    s = col.dropna()
    iso = s.str[4] == "-"
    d = s.str[:10].str.split(r"[-.]", regex=True)
    y = d.str[0].where(iso, d.str[2])
    day = d.str[2].where(iso, d.str[0])
    return pd.to_datetime(y + "-" + d.str[1] + "-" + day + " " + s.str[11:], format="%Y-%m-%d %H:%M").reindex(col.index)

t0, t1 = truth(raw["ordered_at"]), truth(raw["delivered_at"])
got0 = df["ordered_at"].reset_index(drop=True)
wrong = int((got0 != t0).sum())
if wrong:
    i = (got0 != t0).idxmax()
    expect(False, f"Час {raw['ordered_at'][i]} прочитано як {got0[i]}: переплутані день і місяць. Таких значень у ordered_at {wrong}")
got1 = df["delivered_at"].reset_index(drop=True)
expect(((got1 == t1) | t1.isna()).all(), "Частину delivered_at прочитано з переплутаними днем і місяцем")
expect("minutes" in df.columns, "Немає колонки minutes")
mins = (t1 - t0).dt.total_seconds() / 60
diff = (df["minutes"].reset_index(drop=True) - mins).abs().max()
expect(diff < 1e-6, f"minutes не збігається з різницею часу в хвилинах: найбільша розбіжність {diff:.1f}")`,
        },
        {
          title: 'Повтори, скарги, неможливий час',
          task: `<p>На вході <code>df</code> з колонкою <code>minutes</code>. Збери чистий журнал <code>orders</code> (індекс з нуля), <code>df</code> не змінюй.</p>
<ul>
<li><strong>Повтори.</strong> Одне замовлення = один номер. Залиш перший запис кожного <code>order_id</code>.</li>
<li><strong>Скарги.</strong> Перетвори <code>complaint</code> на тип <code>"boolean"</code>: так означає True, ні означає False, порожньо лишається пропуском (<code>&lt;NA&gt;</code>). Невідоме не дорівнює «скарги не було».</li>
<li><strong>Неможливий час.</strong> Доставка не буває від'ємною, а понад 180 хвилин означає, що кур'єр забув закрити замовлення. У таких рядках заміни <code>minutes</code> на пропуск, сам рядок залиш: скарга в ньому справжня. Кількість таких рядків запиши в <code>n_bad_time</code>.</li>
</ul>
<p>Виведи кількість рядків в <code>orders</code>, <code>orders["complaint"].value_counts(dropna=False)</code> і <code>n_bad_time</code>.</p>`,
          starter: `# orders = ...
# n_bad_time = ...
`,
          hint: 'drop_duplicates(subset="order_id"). Для скарг: strip, lower, потім map зі словником {"так": True, "ні": False} і astype("boolean"). Умову неможливого часу збери через | і застосуй mask.',
          solution: `orders = df.drop_duplicates(subset="order_id").reset_index(drop=True)

answer = orders["complaint"].str.strip().str.lower()
orders["complaint"] = answer.map({"так": True, "ні": False}).astype("boolean")

bad = (orders["minutes"] < 0) | (orders["minutes"] > 180)
n_bad_time = int(bad.sum())
orders["minutes"] = orders["minutes"].mask(bad)

print("Замовлень:", len(orders))
print(orders["complaint"].value_counts(dropna=False))
print("Неможливий час:", n_bad_time)`,
          check: `import numpy as np
orders = need("orders", pd.DataFrame)
expect(len(orders) == 60, f"Замовлень після прибирання повторів має бути 60, а зараз {len(orders)}")
expect(orders["order_id"].is_unique, "У orders лишились повтори номерів")
expect(list(orders.index) == list(range(len(orders))), "Індекс orders має йти з нуля: reset_index(drop=True)")
expect(str(orders["complaint"].dtype) == "boolean", f"complaint має бути типу boolean, а зараз {orders['complaint'].dtype}")
expect(int(orders["complaint"].isna().sum()) == 3, f"Порожні скарги мають лишитися пропусками: їх 3, а зараз {int(orders['complaint'].isna().sum())}")
expect(int(orders["complaint"].sum()) == 12, f"Скарг (True) має бути 12, а зараз {int(orders['complaint'].sum())}: перевір, чи всі написання «так» розпізнано")
n_bad_time = need("n_bad_time", (int, np.integer))
expect(n_bad_time == 2, f"Рядків з неможливим часом 2, а n_bad_time = {n_bad_time}")
expect(orders["minutes"].min() >= 0 and orders["minutes"].max() <= 180, "У minutes лишились від'ємні чи понад 180 хвилин значення")
expect(int(orders["minutes"].isna().sum()) == 5, f"Пропусків у minutes має бути 5: 3 недоставлені і 2 неможливі, а зараз {int(orders['minutes'].isna().sum())}")`,
        },
        {
          title: 'Райони, місяці, скарги',
          task: `<p>На вході <code>orders</code>. Створи:</p>
<ul>
<li><code>summary</code>: DataFrame по районах з колонками <code>orders</code> (усі замовлення), <code>median_min</code> (медіана хвилин), <code>late_pct</code> (частка доставок понад 60 хвилин, %), <code>complaint_pct</code> (частка замовлень зі скаргою, %); відсортуй за <code>median_min</code> від найбільшої;</li>
<li><code>by_month</code>: медіана хвилин, рядки: місяці замовлення (період), колонки: райони;</li>
<li><code>complaint_by_late</code>: Series з двома значеннями: частка скарг, %, серед доставок до 60 хвилин включно (мітка <code>до 60 хв</code>) і понад 60 хвилин (мітка <code>понад 60 хв</code>).</li>
</ul>
<p>Частки рахуй лише там, де значення відоме: запізнення серед доставок з відомим часом, скарги серед замовлень з відомою відповіддю. Виведи всі три з одним знаком після коми.</p>`,
          starter: `# summary = ...
# by_month = ...
# complaint_by_late = ...
`,
          hint: 'Середнє від True/False дає частку True, а тип boolean сам пропускає невідомі значення. Для частки запізнень спершу відкинь рядки без minutes, інакше NaN > 60 дасть False і заниже частку.',
          solution: `timed = orders.dropna(subset=["minutes"])
late = timed["minutes"] > 60

summary = pd.DataFrame({
    "orders": orders.groupby("district").size(),
    "median_min": timed.groupby("district")["minutes"].median(),
    "late_pct": late.groupby(timed["district"]).mean() * 100,
    "complaint_pct": orders.groupby("district")["complaint"].mean() * 100,
}).sort_values("median_min", ascending=False)

by_month = timed.pivot_table(
    index=timed["ordered_at"].dt.to_period("M"),
    columns="district", values="minutes", aggfunc="median",
)

complaint_by_late = timed.groupby(late)["complaint"].mean() * 100
complaint_by_late.index = complaint_by_late.index.map({False: "до 60 хв", True: "понад 60 хв"})

print(summary.round(1))
print(by_month.round(1))
print(complaint_by_late.round(1))`,
          check: `EXP = {
    "Дарницький": (15, 64.5, 71.428571, 46.666667),
    "Голосіївський": (16, 48.0, 13.333333, 26.666667),
    "Шевченківський": (15, 36.5, 0.0, 0.0),
    "Оболонський": (14, 36.0, 0.0, 8.333333),
}
EXP_MONTH = {"Голосіївський": [54.0, 48.0], "Дарницький": [66.0, 64.5], "Оболонський": [30.0, 46.0], "Шевченківський": [33.0, 37.5]}
summary = need("summary", pd.DataFrame)
cols = ["orders", "median_min", "late_pct", "complaint_pct"]
for c in cols:
    expect(c in summary.columns, f"У summary немає колонки {c}")
expect(sorted(summary.index) == sorted(EXP), f"Рядками summary мають бути райони, а зараз {list(summary.index)}")
why = {
    "orders": "Рахуй усі замовлення району",
    "median_min": "Медіана хвилин без неможливого часу",
    "late_pct": "Частку запізнень рахуй лише серед доставок з відомим часом",
    "complaint_pct": "Частку скарг рахуй лише серед замовлень з відомою відповіддю",
}
for d, vals in EXP.items():
    for c, e in zip(cols, vals):
        g = float(summary.loc[d, c])
        expect(abs(g - e) < 1e-4, f"summary, {d}, {c}: очікувалось {e:.1f}, а зараз {g:.1f}. {why[c]}")
expect(summary["median_min"].is_monotonic_decreasing, "summary має бути відсортована за median_min від найбільшої")
by_month = need("by_month", pd.DataFrame)
expect(by_month.shape == (2, 4), f"by_month: 2 місяці на 4 райони, а зараз {by_month.shape}")
for d, vals in EXP_MONTH.items():
    expect(d in by_month.columns, f"У by_month немає колонки {d}")
    expect(all(abs(float(a) - b) < 1e-9 for a, b in zip(by_month[d], vals)), f"by_month, {d}: очікувалось {vals}, а зараз {[float(v) for v in by_month[d]]}")
cbl = need("complaint_by_late", pd.Series)
for label, e in [("до 60 хв", 7.5), ("понад 60 хв", 75.0)]:
    expect(label in cbl.index, f"У complaint_by_late немає мітки {label!r}")
    expect(abs(float(cbl[label]) - e) < 1e-6, f"complaint_by_late[{label!r}]: очікувалось {e}, а зараз {float(cbl[label]):.2f}. Рахуй серед доставок з відомим часом і відомою відповіддю")`,
        },
        {
          title: 'Дві панелі',
          task: `<p>На вході <code>summary</code> і <code>complaint_by_late</code>. Побудуй фігуру з двома панелями поруч:</p>
<ul>
<li>ліворуч стовпці медіанного часу доставки за районами, від найповільнішого; одиниці (<code>хв</code>) у назві;</li>
<li>праворуч два стовпці: частка замовлень зі скаргою для доставок до 60 хвилин і понад 60 хвилин; одиниці (<code>%</code>) у назві.</li>
</ul>
<p>Підпиши осі на обох панелях.</p>`,
          starter: `import matplotlib.pyplot as plt

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(11, 4))
# ...
`,
          hint: 'summary вже відсортована, тож бери summary.index і summary["median_min"] як є. Довгі назви районів можна повернути: ax1.tick_params(axis="x", labelrotation=20).',
          solution: `import matplotlib.pyplot as plt

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(11, 4))

ax1.bar(summary.index, summary["median_min"])
ax1.set_title("Медіанний час доставки, хв")
ax1.set_xlabel("Район")
ax1.set_ylabel("Медіана")
ax1.tick_params(axis="x", labelrotation=20)

ax2.bar(complaint_by_late.index, complaint_by_late.values)
ax2.set_title("Замовлення зі скаргою, %")
ax2.set_xlabel("Час доставки")
ax2.set_ylabel("Частка")
fig.tight_layout()`,
          check: `NAMES = ["Дарницький", "Голосіївський", "Шевченківський", "Оболонський"]
MEDIANS = [64.5, 48.0, 36.5, 36.0]
RATES = [7.5, 75.0]
figs = figures()
expect(len(figs) == 1, f"Має бути одна фігура, а зараз {len(figs)}")
fig = figs[0]
expect(len(fig.axes) == 2, f"У фігурі мають бути дві панелі, а зараз {len(fig.axes)}")
fig.canvas.draw()
ax1, ax2 = fig.axes
h1 = [b.get_height() for b in ax1.patches]
expect(len(h1) == 4, f"Ліворуч має бути 4 стовпці, а зараз {len(h1)}")
expect(all(approx(a, b) for a, b in zip(h1, MEDIANS)), f"Висоти лівих стовпців мають дорівнювати median_min від найповільнішого району, а зараз {h1}")
labels = [t.get_text() for t in ax1.get_xticklabels()]
expect(labels == NAMES, f"Під лівими стовпцями мають бути райони в тому самому порядку, а зараз {labels}")
h2 = [b.get_height() for b in ax2.patches]
expect(len(h2) == 2, f"Праворуч має бути 2 стовпці, а зараз {len(h2)}")
expect(all(approx(a, b) for a, b in zip(h2, RATES)), f"Праворуч мають бути частки скарг до 60 і понад 60 хвилин у відсотках, а зараз {h2}")
for ax in (ax1, ax2):
    expect(all(b.get_y() == 0 for b in ax.patches), "Стовпці мають починатися від нуля")
    expect(ax.get_xlabel().strip() != "" and ax.get_ylabel().strip() != "", "Підпиши осі на обох панелях")
expect("хв" in ax1.get_title(), f"У назві лівої панелі вкажи одиниці, хв. Зараз: {ax1.get_title()!r}")
expect("%" in ax2.get_title(), f"У назві правої панелі вкажи одиниці, %. Зараз: {ax2.get_title()!r}")`,
        },
        {
          title: 'Висновок',
          task: `<p>На вході <code>summary</code> і <code>complaint_by_late</code>. Створи:</p>
<ul>
<li><code>worst_district</code>: район з найбільшою медіаною часу доставки;</li>
<li><code>worst_median</code>: ця медіана, хвилин;</li>
<li><code>worst_late_pct</code>: частка запізнень понад 60 хвилин у цьому районі, %, з одним знаком;</li>
<li><code>complaint_ratio</code>: у скільки разів частка скарг серед запізнень більша, ніж серед вчасних доставок, з одним знаком.</li>
</ul>
<p>Виведи речення з усіма чотирма значеннями: це і є відповідь, де потрібен склад.</p>`,
          starter: `# worst_district = ...
# worst_median = ...
# worst_late_pct = ...
# complaint_ratio = ...
`,
          hint: 'summary відсортована, тож найгірший район у першому рядку: summary.index[0] і summary.iloc[0]. Значення complaint_by_late беруться за мітками.',
          solution: `worst_district = summary.index[0]
worst_median = float(summary["median_min"].iloc[0])
worst_late_pct = round(float(summary["late_pct"].iloc[0]), 1)
complaint_ratio = round(float(complaint_by_late["понад 60 хв"] / complaint_by_late["до 60 хв"]), 1)

print(f"Найповільніше доставляють у район {worst_district}: медіана {worst_median} хв, "
      f"понад годину чекають {worst_late_pct}% замовлень. "
      f"Частка скарг після запізнення більша, ніж після вчасної доставки, у {complaint_ratio} раза.")`,
          check: `import numpy as np
worst_district = need("worst_district", str)
expect(worst_district == "Дарницький", f"worst_district має бути районом з найбільшою медіаною, а зараз {worst_district}")
worst_median = need("worst_median", (int, float, np.integer, np.floating))
expect(approx(worst_median, 64.5), f"worst_median має бути медіаною цього району, а зараз {worst_median}")
worst_late_pct = need("worst_late_pct", (int, float, np.integer, np.floating))
expect(abs(worst_late_pct - 71.4) < 0.06, f"worst_late_pct: частка запізнень цього району з одним знаком, а зараз {worst_late_pct}")
complaint_ratio = need("complaint_ratio", (int, float, np.integer, np.floating))
expect(abs(complaint_ratio - 10.0) < 0.06, f"complaint_ratio: частка скарг понад 60 хв, поділена на частку до 60 хв, а зараз {complaint_ratio}")
expect(worst_district in OUTPUT, "У реченні має бути назва району")
for value in ["64.5", "71.4", "10.0"]:
    expect(value in OUTPUT or value.replace(".", ",") in OUTPUT, f"У реченні немає значення {value}")`,
        },
      ],
    },
  ],
};
