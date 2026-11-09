export default {
  id: 'm7',
  title: 'Очищення даних',
  lessons: [
    {
      id: 'l7-1',
      title: 'Пропуски: знайти і вирішити',
      theory: `<p><strong>Пропуск</strong> у pandas позначається як <code>NaN</code> (у датах <code>NaT</code>). <code>df.isna()</code> дає таблицю True/False, <code>df.isna().sum()</code> рахує пропуски в кожній колонці, <code>df.isna().mean()</code> дає їхню частку. Рядки з пропуском в одній колонці: <code>df[df["amount"].isna()]</code>. Спершу подивись на ці рядки, а вже потім вирішуй, що з ними робити.</p>
<p><strong>Видалити</strong>: <code>df.dropna()</code> прибирає рядок, якщо пропуск є хоч у якійсь колонці, і часто забирає забагато. <code>df.dropna(subset=["amount"])</code> прибирає лише рядки без ключового значення, решта пропусків лишається.</p>
<p><strong>Заповнити</strong>: <code>fillna(значення)</code>. Для чисел зазвичай медіана (<code>median()</code>), вона менше за середнє реагує на викиди; для категорій мода, найчастіше значення: <code>df["size"].mode()[0]</code>. Точніше заповнювати в межах групи: <code>df.groupby("category")["price"].transform("median")</code> дає для кожного рядка медіану його категорії, її й передають у <code>fillna</code>. У pandas 3 результат присвоюють назад: <code>df["x"] = df["x"].fillna(...)</code>. Запис <code>df["x"].fillna(0, inplace=True)</code> таблицю не змінює.</p>
<p><strong>ffill</strong> (forward fill) протягує останнє відоме значення вниз. Це доречно, коли значення діє, доки не зміниться: залишок на складі, ціна, тариф. Рядки спершу сортують за часом. Якщо в таблиці кілька об'єктів, протягувати треба в межах кожного: <code>df.groupby("device")["temp"].ffill()</code>, інакше значення одного пристрою перетече в інший.</p>
<p><strong>Коли краще лишити пропуск</strong>: якщо він сам щось означає (клієнт не залишив оцінку, дата звільнення порожня, бо людина працює), або якщо заповнення спотворить статистику (середня оцінка, «підтягнута» медіаною, виглядатиме певнішою, ніж є). Тоді пропуск лишають, а функції pandas (<code>mean</code>, <code>sum</code>) його просто пропускають.</p>`,
      examples: [
        {
          code: `import pandas as pd
import numpy as np

df = pd.DataFrame({
    "order_id": [101, 102, 103, 104, 105, 106, 107, 108],
    "city": ["Київ", "Львів", None, "Київ", "Одеса", "Львів", None, "Київ"],
    "amount": [1250.0, np.nan, 830.0, 2100.0, np.nan, 640.0, 975.0, 1480.0],
    "rating": [5, 4, np.nan, np.nan, 3, 5, np.nan, 4],
})
print(df.isna().sum())
print()
print(df.isna().mean().round(2))
print()
print(df[df["amount"].isna()])`,
          output: `order_id    0
city        2
amount      2
rating      3
dtype: int64

order_id    0.00
city        0.25
amount      0.25
rating      0.38
dtype: float64

   order_id   city  amount  rating
1       102  Львів     NaN     4.0
4       105  Одеса     NaN     3.0`,
        },
        {
          code: `import pandas as pd
import numpy as np

df = pd.DataFrame({
    "order_id": [101, 102, 103, 104, 105, 106, 107, 108],
    "city": ["Київ", "Львів", None, "Київ", "Одеса", "Львів", None, "Київ"],
    "amount": [1250.0, np.nan, 830.0, 2100.0, np.nan, 640.0, 975.0, 1480.0],
    "rating": [5, 4, np.nan, np.nan, 3, 5, np.nan, 4],
})
print("усього рядків:", len(df))
print("dropna():", len(df.dropna()))
print('dropna(subset=["amount"]):', len(df.dropna(subset=["amount"])))
print("середня оцінка без заповнення:", df["rating"].mean())`,
          output: `усього рядків: 8
dropna(): 3
dropna(subset=["amount"]): 6
середня оцінка без заповнення: 4.2`,
        },
        {
          code: `import pandas as pd
import numpy as np

df = pd.DataFrame({
    "category": ["кава", "чай", "кава", "десерт", "чай", "кава", "десерт", "чай"],
    "price": [65.0, 45.0, np.nan, 120.0, np.nan, 70.0, np.nan, 50.0],
    "size": ["M", "S", "M", None, "S", None, "M", "M"],
})
print("медіана price:", df["price"].median())
print("мода size:", df["size"].mode()[0])

df["size"] = df["size"].fillna(df["size"].mode()[0])
group_med = df.groupby("category")["price"].transform("median")
df["price_filled"] = df["price"].fillna(group_med)
print(df)`,
          output: `медіана price: 65.0
мода size: M
  category  price size  price_filled
0     кава   65.0    M          65.0
1      чай   45.0    S          45.0
2     кава    NaN    M          67.5
3   десерт  120.0    M         120.0
4      чай    NaN    S          47.5
5     кава   70.0    M          70.0
6   десерт    NaN    M         120.0
7      чай   50.0    M          50.0`,
        },
        {
          code: `import pandas as pd
import numpy as np

# склад записує залишок лише в дні, коли він змінився
stock = pd.DataFrame({
    "date": ["01.03", "02.03", "03.03", "04.03", "05.03", "06.03"],
    "qty": [120, np.nan, np.nan, 95, np.nan, 80],
})
stock["qty_ffill"] = stock["qty"].ffill()
print(stock)`,
          output: `    date    qty  qty_ffill
0  01.03  120.0      120.0
1  02.03    NaN      120.0
2  03.03    NaN      120.0
3  04.03   95.0       95.0
4  05.03    NaN       95.0
5  06.03   80.0       80.0`,
        },
      ],
      exercises: [
        {
          task: `Виведи кількість пропусків у кожній колонці <code>df</code>.`,
          starter: `import pandas as pd
import numpy as np
df = pd.DataFrame({
    "client": ["Оксана", "Віктор", None, "Ліна", "Петро", "Ярина"],
    "phone": ["067-111-22-33", None, None, "050-444-55-66", None, "093-777-88-99"],
    "amount": [540.0, 1200.0, 310.0, np.nan, 860.0, 450.0],
})
# твій код
`,
          solution: `import pandas as pd
import numpy as np
df = pd.DataFrame({
    "client": ["Оксана", "Віктор", None, "Ліна", "Петро", "Ярина"],
    "phone": ["067-111-22-33", None, None, "050-444-55-66", None, "093-777-88-99"],
    "amount": [540.0, 1200.0, 310.0, np.nan, 860.0, 450.0],
})
print(df.isna().sum())`,
          expected: `client    1
phone     3
amount    1
dtype: int64`,
          hint: `isna() позначає пропуски, sum() рахує їх по колонках.`,
        },
        {
          task: `Без суми замовлення рядок для аналізу виручки непридатний, а без телефону придатний. Створи <code>clean</code>: <code>df</code> без рядків, де пропущено <code>amount</code>. Рядки з пропущеним телефоном мають лишитися. Виведи <code>len(clean)</code>.`,
          starter: `import pandas as pd
import numpy as np
df = pd.DataFrame({
    "client": ["Оксана", "Віктор", "Дмитро", "Ліна", "Петро", "Ярина", "Остап"],
    "phone": ["067-111-22-33", None, None, "050-444-55-66", None, "093-777-88-99", None],
    "amount": [540.0, 1200.0, np.nan, np.nan, 860.0, 450.0, 715.0],
})
# clean = ...
`,
          solution: `import pandas as pd
import numpy as np
df = pd.DataFrame({
    "client": ["Оксана", "Віктор", "Дмитро", "Ліна", "Петро", "Ярина", "Остап"],
    "phone": ["067-111-22-33", None, None, "050-444-55-66", None, "093-777-88-99", None],
    "amount": [540.0, 1200.0, np.nan, np.nan, 860.0, 450.0, 715.0],
})
clean = df.dropna(subset=["amount"])
print(len(clean))`,
          check: `import pandas as pd
clean = need("clean", pd.DataFrame)
want = ["Оксана", "Віктор", "Петро", "Ярина", "Остап"]
expect(clean["amount"].isna().sum() == 0, "У clean не має лишитися пропусків в amount")
expect(clean["client"].tolist() == want, f"Мають лишитися клієнти {want}, а зараз {clean['client'].tolist()}. Пропуски в phone не причина видаляти рядок")`,
          hint: `dropna має параметр subset: список колонок, у яких шукати пропуски.`,
        },
        {
          task: `Заповни пропуски в колонці <code>delivery_days</code> медіаною цієї колонки (зміни саму <code>df</code>). Виведи <code>df["delivery_days"].tolist()</code>.`,
          starter: `import pandas as pd
import numpy as np
df = pd.DataFrame({
    "order_id": [1, 2, 3, 4, 5, 6, 7],
    "delivery_days": [2, np.nan, 3, 14, np.nan, 2, 4],
})
# твій код
`,
          solution: `import pandas as pd
import numpy as np
df = pd.DataFrame({
    "order_id": [1, 2, 3, 4, 5, 6, 7],
    "delivery_days": [2, np.nan, 3, 14, np.nan, 2, 4],
})
df["delivery_days"] = df["delivery_days"].fillna(df["delivery_days"].median())
print(df["delivery_days"].tolist())`,
          check: `import pandas as pd
df = need("df", pd.DataFrame)
known = sorted([2, 3, 14, 2, 4])
med = known[len(known) // 2]
want = [2, med, 3, 14, med, 2, 4]
expect(df["delivery_days"].isna().sum() == 0, "У delivery_days лишились пропуски: присвой результат fillna назад у колонку")
expect(all(approx(a, b) for a, b in zip(df["delivery_days"].tolist(), want)), f"Очікувались значення {want}: пропуски мають стати медіаною {med}")`,
          expected: `[2.0, 3.0, 3.0, 14.0, 3.0, 2.0, 4.0]`,
          hint: `df["x"] = df["x"].fillna(df["x"].median()). У pandas 3 inplace=True на колонці не спрацює.`,
        },
        {
          task: `У колонці <code>payment</code> заповни пропуски найчастішим способом оплати (модою). Виведи <code>df["payment"].value_counts()</code>.`,
          starter: `import pandas as pd
df = pd.DataFrame({
    "order_id": [11, 12, 13, 14, 15, 16, 17, 18],
    "payment": ["картка", "готівка", None, "картка", "картка", None, "переказ", "готівка"],
})
# твій код
`,
          solution: `import pandas as pd
df = pd.DataFrame({
    "order_id": [11, 12, 13, 14, 15, 16, 17, 18],
    "payment": ["картка", "готівка", None, "картка", "картка", None, "переказ", "готівка"],
})
df["payment"] = df["payment"].fillna(df["payment"].mode()[0])
print(df["payment"].value_counts())`,
          check: `import pandas as pd
df = need("df", pd.DataFrame)
expect(df["payment"].isna().sum() == 0, "У payment лишились пропуски")
want = ["картка", "готівка", "картка", "картка", "картка", "картка", "переказ", "готівка"]
expect(df["payment"].tolist() == want, f"Очікувалось {want}: пропуски мають стати найчастішим значенням")`,
          expected: `payment
картка     5
готівка    2
переказ    1
Name: count, dtype: int64`,
          hint: `mode() повертає Series (мод може бути кілька), тому бери перший елемент: mode()[0].`,
        },
        {
          task: `Ціни різних категорій дуже різні, тож загальна медіана тут погана. Заповни пропуски в <code>price</code> медіаною ціни своєї категорії (<code>category</code>). Зміни саму <code>df</code> і виведи її.`,
          starter: `import pandas as pd
import numpy as np
df = pd.DataFrame({
    "item": ["навушники", "кабель", "ноутбук", "мишка", "кабель", "ноутбук", "мишка", "ноутбук"],
    "category": ["аудіо", "аксесуари", "ПК", "аксесуари", "аксесуари", "ПК", "аксесуари", "ПК"],
    "price": [1899.0, 249.0, 32999.0, np.nan, np.nan, 28499.0, 399.0, np.nan],
})
# твій код
`,
          solution: `import pandas as pd
import numpy as np
df = pd.DataFrame({
    "item": ["навушники", "кабель", "ноутбук", "мишка", "кабель", "ноутбук", "мишка", "ноутбук"],
    "category": ["аудіо", "аксесуари", "ПК", "аксесуари", "аксесуари", "ПК", "аксесуари", "ПК"],
    "price": [1899.0, 249.0, 32999.0, np.nan, np.nan, 28499.0, 399.0, np.nan],
})
group_med = df.groupby("category")["price"].transform("median")
df["price"] = df["price"].fillna(group_med)
print(df)`,
          check: `import pandas as pd
df = need("df", pd.DataFrame)
expect(len(df) == 8, "У df має лишитися 8 рядків")
expect(df["price"].isna().sum() == 0, "У price лишились пропуски")
acc = (249.0 + 399.0) / 2
pc = (32999.0 + 28499.0) / 2
want = [1899.0, 249.0, 32999.0, acc, acc, 28499.0, 399.0, pc]
got = df["price"].tolist()
expect(all(approx(a, b) for a, b in zip(got, want)), f"Очікувались ціни {want}, а зараз {got}: медіану треба брати в межах категорії")`,
          expected: `        item   category    price
0  навушники      аудіо   1899.0
1     кабель  аксесуари    249.0
2    ноутбук         ПК  32999.0
3      мишка  аксесуари    324.0
4     кабель  аксесуари    324.0
5    ноутбук         ПК  28499.0
6      мишка  аксесуари    399.0
7    ноутбук         ПК  30749.0`,
          hint: `groupby("category")["price"].transform("median") дає Series тієї ж довжини, що й df; передай її в fillna.`,
        },
        {
          task: `Два датчики (<code>device</code>) пишуть температуру, частина замірів загубилась, рядки перемішані. Відсортуй <code>df</code> за <code>device</code> і <code>time</code>, скинь індекс (<code>reset_index(drop=True)</code>) і протягни останній відомий замір вниз у межах кожного датчика. Перший замір датчика, перед яким нічого немає, має лишитися пропуском. Виведи <code>df</code>.`,
          starter: `import pandas as pd
import numpy as np
df = pd.DataFrame({
    "device": ["B", "A", "A", "B", "A", "B", "A", "B"],
    "time": ["08:00", "09:00", "08:00", "09:00", "10:00", "10:00", "11:00", "11:00"],
    "temp": [np.nan, np.nan, 21.4, 19.8, 22.1, np.nan, np.nan, 20.5],
})
# твій код
`,
          solution: `import pandas as pd
import numpy as np
df = pd.DataFrame({
    "device": ["B", "A", "A", "B", "A", "B", "A", "B"],
    "time": ["08:00", "09:00", "08:00", "09:00", "10:00", "10:00", "11:00", "11:00"],
    "temp": [np.nan, np.nan, 21.4, 19.8, 22.1, np.nan, np.nan, 20.5],
})
df = df.sort_values(["device", "time"]).reset_index(drop=True)
df["temp"] = df.groupby("device")["temp"].ffill()
print(df)`,
          check: `import pandas as pd
import math
df = need("df", pd.DataFrame)
expect(df["device"].tolist() == ["A"] * 4 + ["B"] * 4, "Рядки мають бути відсортовані: спершу всі заміри A, потім B")
expect(df["time"].tolist() == ["08:00", "09:00", "10:00", "11:00"] * 2, "У межах датчика заміри мають іти за часом")
want = [21.4, 21.4, 22.1, 22.1, None, 19.8, 19.8, 20.5]
got = df["temp"].tolist()
expect(math.isnan(got[4]), "Перший замір датчика B не має попередника і мав лишитися пропуском: протягуй у межах датчика через groupby")
expect(all(approx(a, b) for a, b in zip(got, want) if b is not None), f"Очікувались температури {want}, а зараз {got}")`,
          expected: `  device   time  temp
0      A  08:00  21.4
1      A  09:00  21.4
2      A  10:00  22.1
3      A  11:00  22.1
4      B  08:00   NaN
5      B  09:00  19.8
6      B  10:00  19.8
7      B  11:00  20.5`,
          hint: `sort_values(["device", "time"]), потім df.groupby("device")["temp"].ffill(). Звичайний ffill протягне останній замір A у перший рядок B.`,
        },
      ],
    },
    {
      id: 'l7-2',
      title: 'Числа і типи з рядків',
      theory: `<p>Числа з вивантажень часто приходять рядками. У pandas 3 така колонка має тип <code>str</code>, і <code>sum()</code> на ній не додає, а склеює: <code>"12" + "7"</code> дає <code>"127"</code>. Тип колонок видно в <code>df.dtypes</code>. Якщо всі значення чисті, тип змінює <code>astype(int)</code> або <code>astype(float)</code>.</p>
<p><code>pd.to_numeric(s, errors="coerce")</code> перетворює все, що вдається, а решту робить <code>NaN</code>. Так один кривий рядок не ламає всю колонку. Порахуй, скільки значень стало пропусками, і подивись на них: <code>s[nums.isna() &amp; s.notna()]</code>. Кома як десятковий розділювач (<code>"2,4"</code>) теж не розбирається.</p>
<p>Суми на кшталт <code>"1 299,50 грн"</code> чистять методами <code>.str</code>: прибрати валюту і пробіли, замінити кому на крапку, потім <code>astype(float)</code>. Пастка: в експортах з Excel і банків розділювач тисяч часто <strong>нерозривний пробіл</strong> <code>\\xa0</code>. На екрані він виглядає як звичайний, і <code>.str.replace(" ", "")</code> його не бачить.</p>
<p>Надійніше чистити регулярним виразом: <code>.str.replace(r"\\s", "", regex=True)</code> прибирає всі види пробілів, зокрема <code>\\xa0</code>, а <code>.str.replace(r"[^\\d,]", "", regex=True)</code> лишає тільки цифри й кому. Для звичайної заміни тексту став <code>regex=False</code>, щоб крапка чи дужка не стали спецсимволами.</p>
<p>Відповіді «так/ні» спершу нормалізують (<code>.str.strip().str.lower()</code>), потім переводять у bool словником: <code>.map({"так": True, "ні": False})</code>. Значення, якого немає в словнику, стане <code>NaN</code>, тому після <code>map</code> перевір пропуски. <code>astype(bool)</code> напряму на рядках не підходить: будь-який непорожній рядок, і <code>"ні"</code> теж, стає <code>True</code>.</p>`,
      examples: [
        {
          code: `import pandas as pd

df = pd.DataFrame({"sku": ["A-1", "A-2", "B-7"], "qty": ["12", "7", "30"]})
print(df.dtypes)
print(repr(df["qty"].sum()))

df["qty"] = df["qty"].astype(int)
print(df["qty"].dtype, df["qty"].sum())`,
          output: `sku    str
qty    str
dtype: object
'12730'
int32 49`,
        },
        {
          code: `import pandas as pd

w = pd.Series(["1.25", "0.8", "н/д", "", "2,4", "3"])
nums = pd.to_numeric(w, errors="coerce")
print(nums)
print("не розібрано:", nums.isna().sum())
print(w[nums.isna()].tolist())`,
          output: `0    1.25
1    0.80
2     NaN
3     NaN
4     NaN
5    3.00
dtype: float64
не розібрано: 3
['н/д', '', '2,4']`,
        },
        {
          code: `import pandas as pd

price = pd.Series(["1 299,50 грн", "2\\xa0450 грн", "980,00 грн", "15\\xa0300 грн"])
naive = price.str.replace(" ", "").str.replace("грн", "").str.replace(",", ".")
print(naive.tolist())
print(pd.to_numeric(naive, errors="coerce").tolist())

clean = (price.str.replace(r"[^\\d,]", "", regex=True)
              .str.replace(",", ".", regex=False)
              .astype(float))
print(clean.tolist())
print("разом:", clean.sum())`,
          output: `['1299.50', '2\\xa0450', '980.00', '15\\xa0300']
[1299.5, nan, 980.0, nan]
[1299.5, 2450.0, 980.0, 15300.0]
разом: 20029.5`,
        },
        {
          code: `import pandas as pd

paid = pd.Series(["Так", " ні", "ТАК", "так ", "Ні", "так"])
print(paid.astype(bool).tolist())

norm = paid.str.strip().str.lower()
print(norm.value_counts())
flag = norm.map({"так": True, "ні": False})
print(flag.dtype, "оплачено:", flag.sum())`,
          output: `[True, True, True, True, True, True]
так    4
ні     2
Name: count, dtype: int64
bool оплачено: 4`,
        },
      ],
      exercises: [
        {
          task: `Колонка <code>qty</code> прийшла рядками. Переведи її в цілі числа (зміни саму <code>df</code>) і виведи суму <code>qty</code>.`,
          starter: `import pandas as pd
df = pd.DataFrame({"sku": ["K-10", "K-11", "K-12", "K-13"], "qty": ["15", "8", "120", "42"]})
# твій код
`,
          solution: `import pandas as pd
df = pd.DataFrame({"sku": ["K-10", "K-11", "K-12", "K-13"], "qty": ["15", "8", "120", "42"]})
df["qty"] = df["qty"].astype(int)
print(df["qty"].sum())`,
          check: `import pandas as pd
df = need("df", pd.DataFrame)
expect(pd.api.types.is_integer_dtype(df["qty"]), f"Колонка qty має бути цілочисельною, а зараз {df['qty'].dtype}")
expect(int(df["qty"].sum()) == 15 + 8 + 120 + 42, "Сума qty не збігається з даними")`,
          expected: `185`,
          hint: `df["qty"] = df["qty"].astype(int)`,
        },
        {
          task: `У <code>weight</code> трапляються «н/д» і порожні рядки. Переведи колонку в числа так, щоб нерозпізнане стало пропуском (зміни <code>df</code>), і виведи, скільки значень не розпізнано.`,
          starter: `import pandas as pd
df = pd.DataFrame({
    "parcel": [1, 2, 3, 4, 5, 6, 7],
    "weight": ["1.2", "н/д", "0.75", "", "3.4", "н/д", "12"],
})
# твій код
`,
          solution: `import pandas as pd
df = pd.DataFrame({
    "parcel": [1, 2, 3, 4, 5, 6, 7],
    "weight": ["1.2", "н/д", "0.75", "", "3.4", "н/д", "12"],
})
df["weight"] = pd.to_numeric(df["weight"], errors="coerce")
print(df["weight"].isna().sum())`,
          check: `import pandas as pd
df = need("df", pd.DataFrame)
expect(pd.api.types.is_numeric_dtype(df["weight"]), f"Колонка weight має бути числовою, а зараз {df['weight'].dtype}")
expect(int(df["weight"].isna().sum()) == 3, "Нерозпізнаними мають стати 3 значення: два «н/д» і порожній рядок")
expect(approx(df["weight"].sum(), 1.2 + 0.75 + 3.4 + 12), "Сума розпізнаних ваг не збігається з даними")`,
          expected: `3`,
          hint: `pd.to_numeric(..., errors="coerce"), потім isna().sum().`,
        },
        {
          task: `Ціни записані як <code>"2 450 грн"</code> (звичайні пробіли, без копійок). Перетвори <code>price</code> на числа float (зміни <code>df</code>) і виведи середню ціну.`,
          starter: `import pandas as pd
df = pd.DataFrame({
    "model": ["X1", "X2", "X3", "X4"],
    "price": ["2 450 грн", "899 грн", "12 300 грн", "4 150 грн"],
})
# твій код
`,
          solution: `import pandas as pd
df = pd.DataFrame({
    "model": ["X1", "X2", "X3", "X4"],
    "price": ["2 450 грн", "899 грн", "12 300 грн", "4 150 грн"],
})
df["price"] = df["price"].str.replace("грн", "", regex=False).str.replace(" ", "", regex=False).astype(float)
print(df["price"].mean())`,
          check: `import pandas as pd
df = need("df", pd.DataFrame)
expect(pd.api.types.is_float_dtype(df["price"]), f"Колонка price має бути float, а зараз {df['price'].dtype}")
want = [2450.0, 899.0, 12300.0, 4150.0]
expect(all(approx(a, b) for a, b in zip(df["price"].tolist(), want)), f"Очікувались ціни {want}")`,
          expected: `4949.75`,
          hint: `Прибери "грн" і пробіли через .str.replace, потім astype(float).`,
        },
        {
          task: `Вивантаження з банку: <code>"1\\xa0299,50 грн"</code>, де розділювач тисяч нерозривний пробіл <code>\\xa0</code>, а копійки після коми. Перетвори <code>amount</code> на float (зміни <code>df</code>) і виведи суму, округлену до 2 знаків через <code>round</code>.`,
          starter: `import pandas as pd
df = pd.DataFrame({
    "op": [1, 2, 3, 4, 5],
    "amount": ["1\\xa0299,50 грн", "350,00 грн", "12\\xa0040,75 грн", "89,90 грн", "2\\xa0500,00 грн"],
})
# твій код
`,
          solution: `import pandas as pd
df = pd.DataFrame({
    "op": [1, 2, 3, 4, 5],
    "amount": ["1\\xa0299,50 грн", "350,00 грн", "12\\xa0040,75 грн", "89,90 грн", "2\\xa0500,00 грн"],
})
df["amount"] = (df["amount"].str.replace(r"[^\\d,]", "", regex=True)
                            .str.replace(",", ".", regex=False)
                            .astype(float))
print(round(df["amount"].sum(), 2))`,
          check: `import pandas as pd
df = need("df", pd.DataFrame)
expect(pd.api.types.is_float_dtype(df["amount"]), f"Колонка amount має бути float, а зараз {df['amount'].dtype}")
want = [1299.50, 350.00, 12040.75, 89.90, 2500.00]
got = df["amount"].tolist()
expect(all(approx(a, b) for a, b in zip(got, want)), f"Очікувались суми {want}, а зараз {got}")`,
          expected: `16280.15`,
          hint: `Регулярний вираз r"[^\\d,]" прибирає все, крім цифр і коми, разом із \\xa0. Потім кома на крапку.`,
        },
        {
          task: `У колонці <code>paid</code> відповіді «так/ні» з різним регістром і пробілами. Перетвори її на тип bool (зміни <code>df</code>) і виведи кількість оплачених замовлень.`,
          starter: `import pandas as pd
df = pd.DataFrame({
    "order_id": [1, 2, 3, 4, 5, 6, 7],
    "paid": ["Так", "ні", " ТАК", "Ні ", "так", "НІ", "Так "],
})
# твій код
`,
          solution: `import pandas as pd
df = pd.DataFrame({
    "order_id": [1, 2, 3, 4, 5, 6, 7],
    "paid": ["Так", "ні", " ТАК", "Ні ", "так", "НІ", "Так "],
})
df["paid"] = df["paid"].str.strip().str.lower().map({"так": True, "ні": False})
print(df["paid"].sum())`,
          check: `import pandas as pd
df = need("df", pd.DataFrame)
expect(pd.api.types.is_bool_dtype(df["paid"]), f"Колонка paid має бути типу bool, а зараз {df['paid'].dtype}")
want = [True, False, True, False, True, False, True]
expect(df["paid"].tolist() == want, f"Очікувалось {want}, а зараз {df['paid'].tolist()}")`,
          expected: `4`,
          hint: `strip і lower прибирають пробіли й регістр; потім map зі словником {"так": True, "ні": False}.`,
        },
        {
          task: `Суми з різних джерел записані хто як: з пробілами, з <code>\\xa0</code>, зі знаком ₴, з «грн», з комою чи крапкою. Перетвори <code>amount</code> на числа (зміни <code>df</code>), нерозпізнане зроби пропуском. Виведи два рядки: суму розпізнаних, округлену до 2 знаків через <code>round</code>, і кількість нерозпізнаних.`,
          starter: `import pandas as pd
df = pd.DataFrame({
    "src": ["каса", "сайт", "каса", "банк", "сайт", "банк", "каса"],
    "amount": ["1 200", "1200,5", "₴ 980", "980.00 грн", "н/д", "2\\xa0015,75", "уточнити"],
})
# твій код
`,
          solution: `import pandas as pd
df = pd.DataFrame({
    "src": ["каса", "сайт", "каса", "банк", "сайт", "банк", "каса"],
    "amount": ["1 200", "1200,5", "₴ 980", "980.00 грн", "н/д", "2\\xa0015,75", "уточнити"],
})
cleaned = (df["amount"].str.replace(r"[^\\d,.]", "", regex=True)
                       .str.replace(",", ".", regex=False))
df["amount"] = pd.to_numeric(cleaned, errors="coerce")
print(round(df["amount"].sum(), 2))
print(df["amount"].isna().sum())`,
          check: `import pandas as pd
import math
df = need("df", pd.DataFrame)
expect(pd.api.types.is_numeric_dtype(df["amount"]), f"Колонка amount має бути числовою, а зараз {df['amount'].dtype}")
want = [1200.0, 1200.5, 980.0, 980.0, None, 2015.75, None]
got = df["amount"].tolist()
for g, w in zip(got, want):
    if w is None:
        expect(math.isnan(g), "«н/д» і «уточнити» мають стати пропусками")
    else:
        expect(approx(g, w), f"Очікувались суми {want}, а зараз {got}")`,
          expected: `6376.25
2`,
          hint: `Залиш лише цифри, кому й крапку (r"[^\\d,.]"), кому заміни на крапку, далі pd.to_numeric(..., errors="coerce"): порожній рядок стане пропуском.`,
        },
      ],
    },
    {
      id: 'l7-3',
      title: 'Текст, категорії, дублікати',
      theory: `<p>Одне місто, записане як <code>" Київ"</code>, <code>"київ"</code> і <code>"КИЇВ "</code>, для pandas три різні категорії, і групування розкидає дані по них. Текст нормалізують методами <code>.str</code>: <code>strip()</code> прибирає пробіли по краях, <code>lower()</code> переводить у нижній регістр, <code>title()</code> робить кожне слово з великої літери. Пастка для української: <code>title()</code> після апострофа теж ставить велику літеру (<code>"Кам'Янське"</code>), тоді краще <code>capitalize()</code>, що піднімає лише першу літеру рядка.</p>
<p>Одруківки виправляють словником: <code>s.replace({"Хаків": "Харків", "Полтва": "Полтава"})</code> замінює значення, що збігаються цілком. Словник пишуть після нормалізації регістру й пробілів, тоді варіантів менше.</p>
<p><strong>Контроль до і після</strong>: <code>value_counts()</code> перед очищенням показує всі варіанти написання, після нього кількість категорій має зменшитися, а загальна кількість рядків лишитися тією самою. <code>s.nunique()</code> дає кількість різних значень одним числом.</p>
<p><strong>Дублікати</strong>: <code>df.duplicated()</code> позначає True рядок, що повністю повторює якийсь попередній; <code>.sum()</code> дає їхню кількість. <code>subset=["order_id"]</code> порівнює лише вказані колонки. <code>keep="first"</code> (типово) лишає перший екземпляр, <code>keep="last"</code> останній, <code>keep=False</code> позначає всі копії, зручно, щоб їх роздивитись.</p>
<p><code>df.drop_duplicates(subset=[...], keep=...)</code> видаляє повтори. Якщо запис оновлювався, відсортуй за часом оновлення і лиши останній (<code>keep="last"</code>). Порядок важливий: спершу нормалізуй текст, потім шукай дублікати, інакше <code>" ivan@mail.ua"</code> і <code>"Ivan@mail.ua"</code> лишаться різними клієнтами. Після очищення <code>df["order_id"].is_unique</code> має бути <code>True</code>.</p>`,
      examples: [
        {
          code: `import pandas as pd

city = pd.Series([" Київ", "київ", "КИЇВ ", "Львів", "львів ", "Одеса", "Дніпро", " дніпро"])
print(city.value_counts())
print()
clean = city.str.strip().str.title()
print(clean.value_counts())
print(city.nunique(), "->", clean.nunique())

towns = pd.Series(["кам'янське", "кривий ріг"])
print(towns.str.title().tolist())
print(towns.str.capitalize().tolist())`,
          output: ` Київ      1
київ       1
КИЇВ       1
Львів      1
львів      1
Одеса      1
Дніпро     1
 дніпро    1
Name: count, dtype: int64

Київ      3
Львів     2
Дніпро    2
Одеса     1
Name: count, dtype: int64
8 -> 4
["Кам'Янське", 'Кривий Ріг']
["Кам'янське", 'Кривий ріг']`,
        },
        {
          code: `import pandas as pd

cats = pd.Series(["Харків", "Хаків", "харків", "Полтава", "Полтва", "Харків", "Суми"])
norm = cats.str.strip().str.title()
print(norm.value_counts())
print()
fix = {"Хаків": "Харків", "Полтва": "Полтава"}
fixed = norm.replace(fix)
print(fixed.value_counts())
print("рядків:", len(cats), len(fixed))`,
          output: `Харків     3
Хаків      1
Полтава    1
Полтва     1
Суми       1
Name: count, dtype: int64

Харків     4
Полтава    2
Суми       1
Name: count, dtype: int64
рядків: 7 7`,
        },
        {
          code: `import pandas as pd

orders = pd.DataFrame({
    "order_id": [501, 502, 502, 503, 504, 504, 504],
    "client": ["Оля", "Максим", "Максим", "Ігор", "Дана", "Дана", "Дана"],
    "amount": [320, 1150, 1150, 640, 210, 210, 260],
})
print(orders.duplicated().tolist())
print("повних дублікатів:", orders.duplicated().sum())
print(orders[orders.duplicated(subset=["order_id"], keep=False)])
print()
print(orders.drop_duplicates())`,
          output: `[False, False, True, False, False, True, False]
повних дублікатів: 2
   order_id  client  amount
1       502  Максим    1150
2       502  Максим    1150
4       504    Дана     210
5       504    Дана     210
6       504    Дана     260

   order_id  client  amount
0       501     Оля     320
1       502  Максим    1150
3       503    Ігор     640
4       504    Дана     210
6       504    Дана     260`,
        },
        {
          code: `import pandas as pd

log = pd.DataFrame({
    "order_id": [701, 702, 701, 703, 702],
    "updated": ["2026-04-01 10:15", "2026-04-01 11:00", "2026-04-02 09:30",
                "2026-04-02 12:10", "2026-04-03 08:45"],
    "status": ["нове", "нове", "оплачено", "нове", "скасовано"],
})
latest = log.sort_values("updated").drop_duplicates(subset=["order_id"], keep="last")
print(latest.sort_values("order_id"))
print(latest["order_id"].is_unique, len(log), "->", len(latest))`,
          output: `   order_id           updated     status
2       701  2026-04-02 09:30   оплачено
4       702  2026-04-03 08:45  скасовано
3       703  2026-04-02 12:10       нове
True 5 -> 3`,
        },
      ],
      exercises: [
        {
          task: `Нормалізуй колонку <code>city</code>: прибери пробіли по краях і зроби кожне слово з великої літери (зміни <code>df</code>). Виведи <code>df["city"].value_counts()</code>.`,
          starter: `import pandas as pd
df = pd.DataFrame({
    "order_id": [1, 2, 3, 4, 5, 6, 7, 8],
    "city": ["львів", " Київ", "ОДЕСА", "Львів ", "київ", "Київ", " одеса ", "ЛЬВІВ"],
})
# твій код
`,
          solution: `import pandas as pd
df = pd.DataFrame({
    "order_id": [1, 2, 3, 4, 5, 6, 7, 8],
    "city": ["львів", " Київ", "ОДЕСА", "Львів ", "київ", "Київ", " одеса ", "ЛЬВІВ"],
})
df["city"] = df["city"].str.strip().str.title()
print(df["city"].value_counts())`,
          check: `import pandas as pd
df = need("df", pd.DataFrame)
expect(len(df) == 8, "Рядків має лишитися 8: нормалізація не видаляє рядки")
expect(set(df["city"]) == {"Київ", "Львів", "Одеса"}, f"Мають лишитися три міста: Київ, Львів, Одеса, а зараз {sorted(set(df['city']))}")`,
          expected: `city
Львів    3
Київ     3
Одеса    2
Name: count, dtype: int64`,
          hint: `Методи .str можна ланцюжити: .str.strip().str.title().`,
        },
        {
          task: `У колонці <code>product</code> одруківки. Виправ їх словником через <code>.replace</code> (зміни <code>df</code>): «Капучіно» і «Капучино» це «Капучино», «Лате» і «Латте» це «Латте», «Американо» правильно. Виведи <code>df["product"].value_counts()</code>.`,
          starter: `import pandas as pd
df = pd.DataFrame({
    "product": ["Капучино", "Лате", "Американо", "Капучіно", "Латте", "Капучино", "Лате", "Американо", "Латте"],
})
# твій код
`,
          solution: `import pandas as pd
df = pd.DataFrame({
    "product": ["Капучино", "Лате", "Американо", "Капучіно", "Латте", "Капучино", "Лате", "Американо", "Латте"],
})
df["product"] = df["product"].replace({"Капучіно": "Капучино", "Лате": "Латте"})
print(df["product"].value_counts())`,
          check: `import pandas as pd
df = need("df", pd.DataFrame)
expect(len(df) == 9, "Рядків має лишитися 9")
counts = df["product"].value_counts().to_dict()
expect(counts == {"Латте": 4, "Капучино": 3, "Американо": 2}, f"Очікувалось Латте 4, Капучино 3, Американо 2, а зараз {counts}")`,
          expected: `product
Латте        4
Капучино     3
Американо    2
Name: count, dtype: int64`,
          hint: `Ключі словника: помилкові варіанти, значення: правильна назва.`,
        },
        {
          task: `Скільки в <code>df</code> рядків, що повністю повторюють якийсь попередній? Виведи число.`,
          starter: `import pandas as pd
df = pd.DataFrame({
    "receipt": [9001, 9002, 9002, 9003, 9004, 9004, 9005, 9004],
    "shop": ["Поділ", "Оболонь", "Оболонь", "Поділ", "Позняки", "Позняки", "Оболонь", "Позняки"],
    "amount": [415, 1280, 1280, 96, 530, 530, 742, 535],
})
# твій код
`,
          solution: `import pandas as pd
df = pd.DataFrame({
    "receipt": [9001, 9002, 9002, 9003, 9004, 9004, 9005, 9004],
    "shop": ["Поділ", "Оболонь", "Оболонь", "Поділ", "Позняки", "Позняки", "Оболонь", "Позняки"],
    "amount": [415, 1280, 1280, 96, 530, 530, 742, 535],
})
print(df.duplicated().sum())`,
          expected: `2`,
          hint: `duplicated() без subset порівнює всі колонки; True рахується як 1.`,
        },
        {
          task: `<code>log</code> містить кілька версій одного замовлення. Створи <code>orders</code>: для кожного <code>order_id</code> лише найсвіжіший запис за <code>updated</code>, відсортований за <code>order_id</code>. Виведи <code>orders</code>.`,
          starter: `import pandas as pd
log = pd.DataFrame({
    "order_id": [31, 32, 31, 33, 32, 31, 34],
    "updated": ["2026-05-02 09:10", "2026-05-02 09:40", "2026-05-03 14:05", "2026-05-03 15:20",
                "2026-05-04 10:00", "2026-05-01 18:30", "2026-05-04 11:15"],
    "amount": [1450, 820, 1520, 300, 790, 1400, 2650],
})
# orders = ...
`,
          solution: `import pandas as pd
log = pd.DataFrame({
    "order_id": [31, 32, 31, 33, 32, 31, 34],
    "updated": ["2026-05-02 09:10", "2026-05-02 09:40", "2026-05-03 14:05", "2026-05-03 15:20",
                "2026-05-04 10:00", "2026-05-01 18:30", "2026-05-04 11:15"],
    "amount": [1450, 820, 1520, 300, 790, 1400, 2650],
})
orders = (log.sort_values("updated")
             .drop_duplicates(subset=["order_id"], keep="last")
             .sort_values("order_id"))
print(orders)`,
          check: `import pandas as pd
orders = need("orders", pd.DataFrame)
expect(orders["order_id"].is_unique, "Кожен order_id має лишитися один раз")
expect(orders["order_id"].tolist() == [31, 32, 33, 34], f"Очікувались замовлення [31, 32, 33, 34] за зростанням, а зараз {orders['order_id'].tolist()}")
expect(orders["amount"].tolist() == [1520, 790, 300, 2650], f"Для кожного замовлення має лишитися найсвіжіша сума: [1520, 790, 300, 2650], а зараз {orders['amount'].tolist()}. Рядки в log не впорядковані за часом")`,
          expected: `   order_id           updated  amount
2        31  2026-05-03 14:05    1520
4        32  2026-05-04 10:00     790
3        33  2026-05-03 15:20     300
6        34  2026-05-04 11:15    2650`,
          hint: `Спершу sort_values("updated"), тоді drop_duplicates(subset=["order_id"], keep="last"), наприкінці sort_values("order_id").`,
        },
        {
          task: `Клієнти реєструвались кілька разів з тією ж поштою, але з пробілами й іншим регістром. Нормалізуй <code>email</code> (без пробілів по краях, нижній регістр) і створи <code>clients</code>: по одному рядку на пошту, лишаючи першу реєстрацію (рядки вже йдуть за датою). Виведи <code>clients</code>.`,
          starter: `import pandas as pd
df = pd.DataFrame({
    "email": ["olena.k@mail.ua", " Taras@ukr.net", "OLENA.K@mail.ua", "iryna_v@gmail.com",
              "taras@ukr.net ", "Iryna_V@Gmail.com", "bohdan@i.ua"],
    "registered": ["2026-01-05", "2026-01-09", "2026-02-11", "2026-02-14", "2026-03-01", "2026-03-20", "2026-03-22"],
})
# clients = ...
`,
          solution: `import pandas as pd
df = pd.DataFrame({
    "email": ["olena.k@mail.ua", " Taras@ukr.net", "OLENA.K@mail.ua", "iryna_v@gmail.com",
              "taras@ukr.net ", "Iryna_V@Gmail.com", "bohdan@i.ua"],
    "registered": ["2026-01-05", "2026-01-09", "2026-02-11", "2026-02-14", "2026-03-01", "2026-03-20", "2026-03-22"],
})
df["email"] = df["email"].str.strip().str.lower()
clients = df.drop_duplicates(subset=["email"], keep="first")
print(clients)`,
          check: `import pandas as pd
clients = need("clients", pd.DataFrame)
want_mail = ["olena.k@mail.ua", "taras@ukr.net", "iryna_v@gmail.com", "bohdan@i.ua"]
want_reg = ["2026-01-05", "2026-01-09", "2026-02-14", "2026-03-22"]
expect(len(clients) == 4, f"Унікальних клієнтів 4, а в clients {len(clients)} рядків: спершу нормалізуй пошту, потім шукай дублікати")
expect(clients["email"].tolist() == want_mail, f"Очікувались пошти {want_mail}, а зараз {clients['email'].tolist()}")
expect(clients["registered"].tolist() == want_reg, "Для кожної пошти має лишитися перша реєстрація")`,
          expected: `               email  registered
0    olena.k@mail.ua  2026-01-05
1      taras@ukr.net  2026-01-09
3  iryna_v@gmail.com  2026-02-14
6        bohdan@i.ua  2026-03-22`,
          hint: `Нормалізуй: .str.strip().str.lower(), а вже потім drop_duplicates(subset=["email"]).`,
        },
        {
          task: `Почисть колонку <code>brand</code>: пробіли по краях, нижній регістр, потім одруківки словником <code>{"samsng": "samsung", "xiaomy": "xiaomi"}</code> (зміни <code>df</code>). Як контроль виведи кількість різних брендів до і після очищення через пробіл, наприклад <code>12 5</code>.`,
          starter: `import pandas as pd
df = pd.DataFrame({
    "brand": ["Samsung", "samsung ", "SAMSUNG", "Samsng", "Xiaomi", " xiaomi", "Xiaomy", "Apple", "apple", "Apple "],
})
# твій код
`,
          solution: `import pandas as pd
df = pd.DataFrame({
    "brand": ["Samsung", "samsung ", "SAMSUNG", "Samsng", "Xiaomi", " xiaomi", "Xiaomy", "Apple", "apple", "Apple "],
})
before = df["brand"].nunique()
df["brand"] = df["brand"].str.strip().str.lower().replace({"samsng": "samsung", "xiaomy": "xiaomi"})
print(before, df["brand"].nunique())`,
          check: `import pandas as pd
df = need("df", pd.DataFrame)
expect(len(df) == 10, "Рядків має лишитися 10")
counts = df["brand"].value_counts().to_dict()
expect(counts == {"samsung": 4, "xiaomi": 3, "apple": 3}, f"Очікувалось samsung 4, xiaomi 3, apple 3, а зараз {counts}")`,
          expected: `10 3`,
          hint: `nunique() до очищення збережи в змінну, бо після присвоєння в df["brand"] старих значень уже не буде.`,
        },
      ],
    },
    {
      id: 'l7-4',
      title: 'Дати і викиди',
      theory: `<p><code>pd.to_datetime(s, format="%d.%m.%Y")</code> перетворює рядки на дати за явним шаблоном: <code>%d</code> день, <code>%m</code> місяць, <code>%Y</code> рік з чотирьох цифр, <code>%H:%M</code> години й хвилини. Явний формат однозначний і швидкий. Без нього pandas вгадує, і <code>"03.04.2026"</code> стає 4 березня; <code>dayfirst=True</code> каже читати першим день.</p>
<p>Коли в колонці кілька форматів, <code>format="mixed"</code> розбирає кожне значення окремо, а <code>errors="coerce"</code> робить нерозпізнане (<code>"березень"</code>, порожній рядок, <code>"31.02.2026"</code>) значенням <code>NaT</code>. Пастка: <code>format="mixed", dayfirst=True</code> переставляє день і місяць і в датах <code>"2026-03-05"</code>. Якщо поруч є дати ISO, розбирай кожен формат своїм <code>to_datetime</code> з <code>errors="coerce"</code> і об'єднуй через <code>fillna</code>.</p>
<p>З колонки дат <code>.dt</code> дістає частини: <code>.dt.year</code>, <code>.dt.month</code>, <code>.dt.day</code>. <code>.dt.to_period("M")</code> перетворює дату на місяць (<code>2026-03</code>), за ним зручно групувати: <code>df.groupby(df["date"].dt.to_period("M"))["amount"].sum()</code>.</p>
<p><strong>Викиди</strong> шукають через міжквартильний розмах (IQR): <code>q1, q3 = s.quantile([0.25, 0.75])</code>, <code>iqr = q3 - q1</code>, межі <code>q1 - 1.5 * iqr</code> і <code>q3 + 1.5 * iqr</code>. Усе, що за межами, варто роздивитись: це може бути зайвий нуль, тестове замовлення або справжній великий клієнт.</p>
<p>Далі рішення: видалити рядки (<code>s[(s &gt;= low) &amp; (s &lt;= high)]</code>) або обрізати значення до меж через <code>s.clip(low, high)</code>, тоді рядки лишаються, а викид не тягне середнє. Справжні великі продажі не обрізають, коли рахують виручку: межі IQR корисні для середніх і графіків, а не для сум у звіті.</p>`,
      examples: [
        {
          code: `import pandas as pd

s = pd.Series(["05.03.2026", "12.03.2026", "01.04.2026"])
d = pd.to_datetime(s, format="%d.%m.%Y")
print(d)
print(pd.to_datetime("03.04.2026"))
print(pd.to_datetime("03.04.2026", dayfirst=True))
print(pd.to_datetime("17.03.2026 14:30", format="%d.%m.%Y %H:%M"))`,
          output: `0   2026-03-05
1   2026-03-12
2   2026-04-01
dtype: datetime64[us]
2026-03-04 00:00:00
2026-04-03 00:00:00
2026-03-17 14:30:00`,
        },
        {
          code: `import pandas as pd

raw = pd.Series(["05.03.2026", "5/3/2026", "07.03.2026", "березень", "", "31.02.2026"])
d = pd.to_datetime(raw, format="mixed", dayfirst=True, errors="coerce")
print(d)
print("не розібрано:", d.isna().sum())

iso = pd.Series(["2026-03-05", "2026-03-10"])
print(pd.to_datetime(iso, format="mixed", dayfirst=True).tolist())`,
          output: `0   2026-03-05
1   2026-03-05
2   2026-03-07
3          NaT
4          NaT
5          NaT
dtype: datetime64[us]
не розібрано: 3
[Timestamp('2026-05-03 00:00:00'), Timestamp('2026-10-03 00:00:00')]`,
        },
        {
          code: `import pandas as pd

raw = pd.Series(["2026-03-05", "10.03.2026", "2026-03-12", "15.03.2026", "уточнити"])
a = pd.to_datetime(raw, format="%Y-%m-%d", errors="coerce")
b = pd.to_datetime(raw, format="%d.%m.%Y", errors="coerce")
d = a.fillna(b)
print(d)

sales = pd.DataFrame({
    "date": pd.to_datetime(["2026-01-14", "2026-01-29", "2026-02-03", "2026-02-17",
                            "2026-03-08", "2026-03-21", "2026-03-30"]),
    "amount": [1200, 860, 1430, 990, 2100, 1750, 640],
})
sales["month"] = sales["date"].dt.month
sales["period"] = sales["date"].dt.to_period("M")
print(sales.head(3))
print(sales.groupby("period")["amount"].sum())`,
          output: `0   2026-03-05
1   2026-03-10
2   2026-03-12
3   2026-03-15
4          NaT
dtype: datetime64[us]
        date  amount  month   period
0 2026-01-14    1200      1  2026-01
1 2026-01-29     860      1  2026-01
2 2026-02-03    1430      2  2026-02
period
2026-01    2060
2026-02    2420
2026-03    4490
Freq: M, Name: amount, dtype: int64`,
        },
        {
          code: `import pandas as pd

amount = pd.Series([420, 515, 380, 610, 475, 9800, 530, 445, 12, 590, 505, 460])
q1, q3 = amount.quantile([0.25, 0.75])
iqr = q3 - q1
low, high = q1 - 1.5 * iqr, q3 + 1.5 * iqr
print("q1:", q1, "q3:", q3, "iqr:", iqr)
print("межі:", low, high)
print(amount[(amount < low) | (amount > high)])
print("середнє до:", round(amount.mean(), 1))
clipped = amount.clip(low, high)
print("середнє після clip:", round(clipped.mean(), 1))`,
          output: `q1: 438.75 q3: 545.0 iqr: 106.25
межі: 279.375 704.375
5    9800
8      12
dtype: int64
середнє до: 1228.5
середнє після clip: 492.8`,
        },
      ],
      exercises: [
        {
          task: `Перетвори колонку <code>date</code> (формат <code>дд.мм.рррр</code>) на дати через явний <code>format</code> (зміни <code>df</code>). Виведи <code>df["date"].dt.day.tolist()</code>.`,
          starter: `import pandas as pd
df = pd.DataFrame({
    "date": ["05.03.2026", "11.03.2026", "02.04.2026", "09.04.2026"],
    "amount": [1300, 870, 1540, 990],
})
# твій код
`,
          solution: `import pandas as pd
df = pd.DataFrame({
    "date": ["05.03.2026", "11.03.2026", "02.04.2026", "09.04.2026"],
    "amount": [1300, 870, 1540, 990],
})
df["date"] = pd.to_datetime(df["date"], format="%d.%m.%Y")
print(df["date"].dt.day.tolist())`,
          check: `import pandas as pd
df = need("df", pd.DataFrame)
expect(pd.api.types.is_datetime64_any_dtype(df["date"]), f"Колонка date має бути датою, а зараз {df['date'].dtype}")
want = [pd.Timestamp(2026, 3, 5), pd.Timestamp(2026, 3, 11), pd.Timestamp(2026, 4, 2), pd.Timestamp(2026, 4, 9)]
expect(df["date"].tolist() == want, "Дати розібрано не так: 05.03.2026 це 5 березня")`,
          expected: `[5, 11, 2, 9]`,
          hint: `format="%d.%m.%Y": день, місяць, рік через крапки.`,
        },
        {
          task: `Дати в <code>date</code> записані по-різному, частина взагалі не дати. Перетвори колонку з <code>format="mixed"</code>, <code>dayfirst=True</code> і <code>errors="coerce"</code> (зміни <code>df</code>) і виведи кількість нерозпізнаних дат.`,
          starter: `import pandas as pd
df = pd.DataFrame({
    "date": ["12.02.2026", "13/02/2026", "14.02.2026 09:15", "вчора", "", "16.2.2026", "30.02.2026"],
})
# твій код
`,
          solution: `import pandas as pd
df = pd.DataFrame({
    "date": ["12.02.2026", "13/02/2026", "14.02.2026 09:15", "вчора", "", "16.2.2026", "30.02.2026"],
})
df["date"] = pd.to_datetime(df["date"], format="mixed", dayfirst=True, errors="coerce")
print(df["date"].isna().sum())`,
          check: `import pandas as pd
df = need("df", pd.DataFrame)
expect(pd.api.types.is_datetime64_any_dtype(df["date"]), f"Колонка date має бути датою, а зараз {df['date'].dtype}")
expect(df["date"].iloc[1] == pd.Timestamp(2026, 2, 13), "13/02/2026 має стати 13 лютого")
expect(int(df["date"].isna().sum()) == 3, "Нерозпізнаними мають бути 3 значення: «вчора», порожній рядок і 30 лютого")`,
          expected: `3`,
          hint: `pd.to_datetime(df["date"], format="mixed", dayfirst=True, errors="coerce"), потім isna().sum().`,
        },
        {
          task: `Виведи суму <code>amount</code> за кожен місяць (Series з періодами <code>2026-01</code>, <code>2026-02</code>, ...). Дати в <code>date</code> у форматі ISO.`,
          starter: `import pandas as pd
df = pd.DataFrame({
    "date": ["2026-01-08", "2026-01-22", "2026-02-05", "2026-02-19", "2026-02-27", "2026-03-11", "2026-03-25"],
    "amount": [2150, 1840, 990, 2600, 1310, 3050, 1720],
})
# твій код
`,
          solution: `import pandas as pd
df = pd.DataFrame({
    "date": ["2026-01-08", "2026-01-22", "2026-02-05", "2026-02-19", "2026-02-27", "2026-03-11", "2026-03-25"],
    "amount": [2150, 1840, 990, 2600, 1310, 3050, 1720],
})
df["date"] = pd.to_datetime(df["date"], format="%Y-%m-%d")
print(df.groupby(df["date"].dt.to_period("M"))["amount"].sum())`,
          expected: `date
2026-01    3990
2026-02    4900
2026-03    4770
Freq: M, Name: amount, dtype: int64`,
          hint: `Спершу to_datetime, потім groupby за df["date"].dt.to_period("M").`,
        },
        {
          task: `Порахуй межі викидів для <code>amount</code> за правилом IQR: змінні <code>low</code> і <code>high</code>. Виведи їх через пробіл.`,
          starter: `import pandas as pd
amount = pd.Series([310, 285, 420, 365, 298, 4100, 342, 377, 15, 330, 401, 356, 389])
# low = ...
# high = ...
`,
          solution: `import pandas as pd
amount = pd.Series([310, 285, 420, 365, 298, 4100, 342, 377, 15, 330, 401, 356, 389])
q1, q3 = amount.quantile([0.25, 0.75])
iqr = q3 - q1
low = q1 - 1.5 * iqr
high = q3 + 1.5 * iqr
print(low, high)`,
          check: `import numpy as np
vals = [310, 285, 420, 365, 298, 4100, 342, 377, 15, 330, 401, 356, 389]
q1, q3 = np.percentile(vals, 25), np.percentile(vals, 75)
low = need("low")
high = need("high")
expect(approx(low, q1 - 1.5 * (q3 - q1)), f"Нижня межа має бути {q1 - 1.5 * (q3 - q1)}, а зараз {low}")
expect(approx(high, q3 + 1.5 * (q3 - q1)), f"Верхня межа має бути {q3 + 1.5 * (q3 - q1)}, а зараз {high}")`,
          expected: `191.5 507.5`,
          hint: `q1, q3 = amount.quantile([0.25, 0.75]); iqr = q3 - q1; межі q1 - 1.5 * iqr і q3 + 1.5 * iqr.`,
        },
        {
          task: `Створи <code>clean</code>: рядки <code>df</code>, де <code>amount</code> в межах IQR (межі включно). Виведи <code>len(clean)</code> і середнє <code>clean["amount"]</code>, округлене до 1 знака через <code>round</code>, через пробіл.`,
          starter: `import pandas as pd
df = pd.DataFrame({
    "check_id": list(range(1, 13)),
    "amount": [540, 610, 495, 23000, 580, 525, 7, 660, 515, 590, 18500, 555],
})
# clean = ...
`,
          solution: `import pandas as pd
df = pd.DataFrame({
    "check_id": list(range(1, 13)),
    "amount": [540, 610, 495, 23000, 580, 525, 7, 660, 515, 590, 18500, 555],
})
q1, q3 = df["amount"].quantile([0.25, 0.75])
iqr = q3 - q1
low, high = q1 - 1.5 * iqr, q3 + 1.5 * iqr
clean = df[(df["amount"] >= low) & (df["amount"] <= high)]
print(len(clean), round(clean["amount"].mean(), 1))`,
          check: `import pandas as pd
import numpy as np
clean = need("clean", pd.DataFrame)
vals = [540, 610, 495, 23000, 580, 525, 7, 660, 515, 590, 18500, 555]
q1, q3 = np.percentile(vals, 25), np.percentile(vals, 75)
lo, hi = q1 - 1.5 * (q3 - q1), q3 + 1.5 * (q3 - q1)
want = [i + 1 for i, v in enumerate(vals) if lo <= v <= hi]
expect(clean["check_id"].tolist() == want, f"Мають лишитися чеки {want}, а зараз {clean['check_id'].tolist()}")`,
          expected: `9 563.3`,
          hint: `Умова з двох частин: (df["amount"] >= low) & (df["amount"] <= high).`,
        },
        {
          task: `Дані зведено з двох систем: дати частково ISO (<code>2026-01-15</code>), частково <code>дд.мм.рррр</code>; у сумах є явні помилки. Розбери дати так, щоб обидва формати прочиталися правильно (зміни <code>df["date"]</code>), обріж <code>amount</code> до меж IQR через <code>clip</code> (зміни <code>df["amount"]</code>) і створи <code>monthly</code>: суму <code>amount</code> за місяцями (<code>to_period("M")</code>). Виведи <code>monthly</code>.`,
          starter: `import pandas as pd
df = pd.DataFrame({
    "date": ["2026-01-15", "03.01.2026", "2026-01-28", "10.02.2026", "2026-02-04",
             "11.02.2026", "2026-03-02", "07.03.2026", "2026-03-12", "09.03.2026"],
    "amount": [820, 760, 905, 15400, 690, 840, 880, 3, 795, 910],
})
# monthly = ...
`,
          solution: `import pandas as pd
df = pd.DataFrame({
    "date": ["2026-01-15", "03.01.2026", "2026-01-28", "10.02.2026", "2026-02-04",
             "11.02.2026", "2026-03-02", "07.03.2026", "2026-03-12", "09.03.2026"],
    "amount": [820, 760, 905, 15400, 690, 840, 880, 3, 795, 910],
})
iso = pd.to_datetime(df["date"], format="%Y-%m-%d", errors="coerce")
dotted = pd.to_datetime(df["date"], format="%d.%m.%Y", errors="coerce")
df["date"] = iso.fillna(dotted)

q1, q3 = df["amount"].quantile([0.25, 0.75])
iqr = q3 - q1
df["amount"] = df["amount"].clip(q1 - 1.5 * iqr, q3 + 1.5 * iqr)

monthly = df.groupby(df["date"].dt.to_period("M"))["amount"].sum()
print(monthly)`,
          check: `import pandas as pd
import numpy as np
df = need("df", pd.DataFrame)
monthly = need("monthly", pd.Series)
want_dates = [pd.Timestamp(2026, 1, 15), pd.Timestamp(2026, 1, 3), pd.Timestamp(2026, 1, 28), pd.Timestamp(2026, 2, 10),
              pd.Timestamp(2026, 2, 4), pd.Timestamp(2026, 2, 11), pd.Timestamp(2026, 3, 2), pd.Timestamp(2026, 3, 7),
              pd.Timestamp(2026, 3, 12), pd.Timestamp(2026, 3, 9)]
expect(pd.api.types.is_datetime64_any_dtype(df["date"]), f"Колонка date має бути датою, а зараз {df['date'].dtype}")
expect(df["date"].tolist() == want_dates, "Дати розібрано неправильно: перевір, чи не переставились день і місяць у датах ISO")
vals = [820, 760, 905, 15400, 690, 840, 880, 3, 795, 910]
q1, q3 = np.percentile(vals, 25), np.percentile(vals, 75)
lo, hi = q1 - 1.5 * (q3 - q1), q3 + 1.5 * (q3 - q1)
clipped = [min(max(v, lo), hi) for v in vals]
months = [d.month for d in want_dates]
want = [sum(c for c, m in zip(clipped, months) if m == k) for k in (1, 2, 3)]
expect(len(monthly) == 3, f"У monthly мають бути 3 місяці, а зараз {len(monthly)}")
expect(all(approx(a, b) for a, b in zip(monthly.tolist(), want)), f"Очікувались суми за місяцями {want}, а зараз {monthly.tolist()}")`,
          expected: `date
2026-01    2485.00
2026-02    2623.75
2026-03    3158.75
Freq: M, Name: amount, dtype: float64`,
          hint: `Розбери кожен формат окремо з errors="coerce" і об'єднай через fillna. format="mixed" з dayfirst=True зіпсує дати ISO.`,
        },
      ],
    },
  ],
};
