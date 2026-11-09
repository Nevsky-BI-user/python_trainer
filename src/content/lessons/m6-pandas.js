export default {
  id: 'm6',
  title: 'pandas',
  lessons: [
    {
      id: 'l6-1',
      title: 'Series та DataFrame',
      theory: `<p><strong>Series</strong>: одновимірна іменована послідовність (як стовпець таблиці). <strong>DataFrame</strong>: двовимірна таблиця зі стовпцями різних типів.</p>
<p>Створення DataFrame: <code>pd.DataFrame({"col1": [...], "col2": [...]})</code>.</p>
<p>Огляд даних: <code>.head()</code>, <code>.tail()</code>, <code>.info()</code>, <code>.describe()</code>, <code>.shape</code>, <code>.columns</code>, <code>.dtypes</code>.</p>`,
      examples: [
        {
          code: `import pandas as pd

s = pd.Series([10, 20, 30, 40], index=["a", "b", "c", "d"])
print(s)
print("sum:", s.sum())
print("a value:", s["a"])`,
          output: `a    10
b    20
c    30
d    40
dtype: int64
sum: 100
a value: 10`,
        },
        {
          code: `import pandas as pd

df = pd.DataFrame({
    "name": ["Ivan", "Olena", "Petro", "Anna"],
    "city": ["Kyiv", "Lviv", "Odesa", "Lviv"],
    "salary": [50000, 65000, 48000, 72000]
})
print(df)
print()
print("Shape:", df.shape)
print("Columns:", list(df.columns))`,
          output: `    name   city  salary
0   Ivan   Kyiv   50000
1  Olena   Lviv   65000
2  Petro  Odesa   48000
3   Anna   Lviv   72000

Shape: (4, 3)
Columns: ['name', 'city', 'salary']`,
        },
        {
          code: `import pandas as pd

df = pd.DataFrame({
    "product": ["A", "B", "C"],
    "price": [100, 200, 300]
})

df["tax"] = df["price"] * 0.2
df["total"] = df["price"] + df["tax"]
print(df)`,
          output: `  product  price   tax  total
0       A    100  20.0  120.0
1       B    200  40.0  240.0
2       C    300  60.0  360.0`,
        },
      ],
      exercises: [
        {
          task: 'Створи Series з <code>[5, 10, 15, 20]</code> та індексом <code>["q1","q2","q3","q4"]</code>. Виведи суму.',
          starter: `import pandas as pd
# твій код
`,
          expected: '50',
          solution: `import pandas as pd
s = pd.Series([5,10,15,20], index=["q1","q2","q3","q4"])
print(s.sum())`,
        },
        {
          task: 'Створи DataFrame з двома колонками: <code>name=["A","B","C"]</code>, <code>score=[80, 90, 75]</code>. Виведи середнє значення колонки score.',
          starter: `import pandas as pd
# твій код
`,
          expected: '81.66666666666667',
          solution: `import pandas as pd
df = pd.DataFrame({"name":["A","B","C"], "score":[80,90,75]})
print(df["score"].mean())`,
        },
        {
          task: 'Дано DataFrame нижче. Виведи кількість рядків.',
          starter: `import pandas as pd
df = pd.DataFrame({"a": [1,2,3,4,5], "b": [10,20,30,40,50]})
# твій код
`,
          expected: '5',
          solution: `import pandas as pd
df = pd.DataFrame({"a": [1,2,3,4,5], "b": [10,20,30,40,50]})
print(len(df))`,
        },
        {
          task: 'Додай у DataFrame <code>df</code> нову колонку "c" = a + b. Виведи df.',
          starter: `import pandas as pd
df = pd.DataFrame({"a": [1,2,3], "b": [10,20,30]})
# твій код
`,
          expected: `   a   b   c
0  1  10  11
1  2  20  22
2  3  30  33`,
          solution: `import pandas as pd
df = pd.DataFrame({"a": [1,2,3], "b": [10,20,30]})
df["c"] = df["a"] + df["b"]
print(df)`,
        },
        {
          task: 'З df виведи список назв колонок як Python list.',
          starter: `import pandas as pd
df = pd.DataFrame({"product": [1], "price": [100], "qty": [5]})
# твій код
`,
          expected: `['product', 'price', 'qty']`,
          solution: `import pandas as pd
df = pd.DataFrame({"product": [1], "price": [100], "qty": [5]})
print(list(df.columns))`,
        },
        {
          task: 'Виведи максимальне значення колонки "salary" у df нижче.',
          starter: `import pandas as pd
df = pd.DataFrame({"name":["A","B","C","D"], "salary":[50000, 80000, 65000, 72000]})
# твій код
`,
          expected: '80000',
          solution: `import pandas as pd
df = pd.DataFrame({"name":["A","B","C","D"], "salary":[50000, 80000, 65000, 72000]})
print(df["salary"].max())`,
        },
      ],
    },
    {
      id: 'l6-2',
      title: 'Pandas: фільтрація і вибірка',
      theory: `<p>Вибір колонки: <code>df["col"]</code> (Series) або <code>df[["col1","col2"]]</code> (DataFrame).</p>
<p>Фільтрація: <code>df[df["col"] &gt; 100]</code>. Кілька умов: <code>df[(df["a"] &gt; 10) &amp; (df["b"] &lt; 20)]</code>: обов'язково <code>&amp;</code> та <code>|</code>!</p>
<p>Корисні: <code>.isin([...])</code>, <code>.between(a,b)</code>, <code>.str.contains(...)</code>, <code>.isna()</code>.</p>`,
      examples: [
        {
          code: `import pandas as pd

df = pd.DataFrame({
    "name": ["Ivan", "Olena", "Petro", "Anna", "Maria"],
    "city": ["Kyiv", "Lviv", "Odesa", "Lviv", "Kyiv"],
    "salary": [50000, 65000, 48000, 72000, 58000]
})

high = df[df["salary"] > 55000]
print(high)`,
          output: `    name  city  salary
1  Olena  Lviv   65000
3   Anna  Lviv   72000
4  Maria  Kyiv   58000`,
        },
        {
          code: `import pandas as pd

df = pd.DataFrame({
    "name": ["Ivan", "Olena", "Petro", "Anna"],
    "city": ["Kyiv", "Lviv", "Odesa", "Lviv"],
    "salary": [50000, 65000, 48000, 72000]
})

result = df[(df["city"] == "Lviv") & (df["salary"] > 60000)]
print(result)`,
          output: `    name  city  salary
1  Olena  Lviv   65000
3   Anna  Lviv   72000`,
        },
        {
          code: `import pandas as pd

df = pd.DataFrame({
    "product": ["Apple iPhone", "Samsung TV", "Apple Watch", "Sony Headphones"],
    "price": [40000, 25000, 15000, 8000]
})

apple_products = df[df["product"].str.contains("Apple")]
print(apple_products)`,
          output: `        product  price
0  Apple iPhone  40000
2   Apple Watch  15000`,
        },
      ],
      exercises: [
        {
          task: 'Виведи рядки, де salary > 50000.',
          starter: `import pandas as pd
df = pd.DataFrame({"name":["A","B","C","D"], "salary":[45000, 60000, 50000, 72000]})
# твій код
`,
          expected: `  name  salary
1    B   60000
3    D   72000`,
          solution: `import pandas as pd
df = pd.DataFrame({"name":["A","B","C","D"], "salary":[45000, 60000, 50000, 72000]})
print(df[df["salary"] > 50000])`,
        },
        {
          task: 'З df виведи тільки колонки "name" і "salary" як новий DataFrame.',
          starter: `import pandas as pd
df = pd.DataFrame({"name":["A","B"], "city":["X","Y"], "salary":[100, 200]})
# твій код
`,
          expected: `  name  salary
0    A     100
1    B     200`,
          solution: `import pandas as pd
df = pd.DataFrame({"name":["A","B"], "city":["X","Y"], "salary":[100, 200]})
print(df[["name", "salary"]])`,
        },
        {
          task: 'Виведи рядки, де city у списку ["Kyiv","Lviv"].',
          starter: `import pandas as pd
df = pd.DataFrame({"name":["A","B","C","D"], "city":["Kyiv","Odesa","Lviv","Dnipro"]})
# твій код
`,
          expected: `  name  city
0    A  Kyiv
2    C  Lviv`,
          solution: `import pandas as pd
df = pd.DataFrame({"name":["A","B","C","D"], "city":["Kyiv","Odesa","Lviv","Dnipro"]})
print(df[df["city"].isin(["Kyiv","Lviv"])])`,
        },
        {
          task: 'Виведи рядки, де price між 100 і 300 включно.',
          starter: `import pandas as pd
df = pd.DataFrame({"product":["A","B","C","D","E"], "price":[50, 150, 250, 350, 200]})
# твій код
`,
          expected: `  product  price
1       B    150
2       C    250
4       E    200`,
          solution: `import pandas as pd
df = pd.DataFrame({"product":["A","B","C","D","E"], "price":[50, 150, 250, 350, 200]})
print(df[df["price"].between(100, 300)])`,
        },
        {
          task: 'Виведи рядки, де name починається з літери "A". (Підказка: <code>.str.startswith("A")</code>)',
          starter: `import pandas as pd
df = pd.DataFrame({"name":["Anna","Boris","Alex","Maria","Andriy"]})
# твій код
`,
          expected: `     name
0    Anna
2    Alex
4  Andriy`,
          solution: `import pandas as pd
df = pd.DataFrame({"name":["Anna","Boris","Alex","Maria","Andriy"]})
print(df[df["name"].str.startswith("A")])`,
        },
        {
          task: 'Скільки рядків мають salary >= 50000? Виведи число.',
          starter: `import pandas as pd
df = pd.DataFrame({"name":["A","B","C","D","E"], "salary":[45000, 60000, 50000, 72000, 40000]})
# твій код
`,
          expected: '3',
          solution: `import pandas as pd
df = pd.DataFrame({"name":["A","B","C","D","E"], "salary":[45000, 60000, 50000, 72000, 40000]})
print(len(df[df["salary"] >= 50000]))`,
        },
      ],
    },
    {
      id: 'l6-3',
      title: 'GroupBy та агрегації',
      theory: `<p><code>df.groupby("col")</code>: групує дані за значеннями колонки. Потім застосовуй агрегації.</p>
<p>Прості агрегації: <code>.sum()</code>, <code>.mean()</code>, <code>.count()</code>, <code>.max()</code>, <code>.min()</code>, <code>.std()</code>.</p>
<p>Кілька агрегацій одночасно: <code>.agg(["sum", "mean", "count"])</code>.</p>`,
      examples: [
        {
          code: `import pandas as pd

df = pd.DataFrame({
    "city": ["Kyiv","Lviv","Kyiv","Odesa","Lviv","Kyiv"],
    "salary": [50000, 65000, 70000, 48000, 72000, 58000]
})

print(df.groupby("city")["salary"].mean())`,
          output: `city
Kyiv     59333.333333
Lviv     68500.000000
Odesa    48000.000000
Name: salary, dtype: float64`,
        },
        {
          code: `import pandas as pd

df = pd.DataFrame({
    "product": ["A","B","A","B","A","C"],
    "region": ["N","N","S","S","N","S"],
    "sales": [100, 200, 150, 250, 120, 80]
})

result = df.groupby("product")["sales"].agg(["sum","mean","count"])
print(result)`,
          output: `         sum        mean  count
product                        
A        370  123.333333      3
B        450  225.000000      2
C         80   80.000000      1`,
        },
        {
          code: `import pandas as pd

df = pd.DataFrame({
    "year": [2024,2024,2025,2025,2026,2026],
    "region": ["N","S","N","S","N","S"],
    "sales": [100, 150, 120, 180, 140, 200]
})

result = df.groupby(["year","region"])["sales"].sum()
print(result)`,
          output: `year  region
2024  N         100
      S         150
2025  N         120
      S         180
2026  N         140
      S         200
Name: sales, dtype: int64`,
        },
      ],
      exercises: [
        {
          task: 'Згрупуй df за "category" і виведи суму "amount" по кожній.',
          starter: `import pandas as pd
df = pd.DataFrame({"category":["A","B","A","B","A"], "amount":[10, 20, 15, 25, 30]})
# твій код
`,
          expected: `category
A    55
B    45
Name: amount, dtype: int64`,
          solution: `import pandas as pd
df = pd.DataFrame({"category":["A","B","A","B","A"], "amount":[10, 20, 15, 25, 30]})
print(df.groupby("category")["amount"].sum())`,
        },
        {
          task: 'Знайди середнє "salary" по "dept".',
          starter: `import pandas as pd
df = pd.DataFrame({"dept":["IT","HR","IT","HR","IT"], "salary":[80000, 50000, 90000, 55000, 85000]})
# твій код
`,
          expected: `dept
HR    52500.0
IT    85000.0
Name: salary, dtype: float64`,
          solution: `import pandas as pd
df = pd.DataFrame({"dept":["IT","HR","IT","HR","IT"], "salary":[80000, 50000, 90000, 55000, 85000]})
print(df.groupby("dept")["salary"].mean())`,
        },
        {
          task: 'Підрахуй кількість рядків у кожній "category" (через groupby + size).',
          starter: `import pandas as pd
df = pd.DataFrame({"category":["A","B","A","B","C","A","B","C"]})
# твій код
`,
          expected: `category
A    3
B    3
C    2
dtype: int64`,
          solution: `import pandas as pd
df = pd.DataFrame({"category":["A","B","A","B","C","A","B","C"]})
print(df.groupby("category").size())`,
        },
        {
          task: 'Знайди максимальну "sales" по кожному "region".',
          starter: `import pandas as pd
df = pd.DataFrame({"region":["N","S","N","S","N"], "sales":[100, 200, 150, 250, 120]})
# твій код
`,
          expected: `region
N    150
S    250
Name: sales, dtype: int64`,
          solution: `import pandas as pd
df = pd.DataFrame({"region":["N","S","N","S","N"], "sales":[100, 200, 150, 250, 120]})
print(df.groupby("region")["sales"].max())`,
        },
        {
          task: 'Згрупуй df за "type" і знайди ОДНОЧАСНО суму і середнє "value".',
          starter: `import pandas as pd
df = pd.DataFrame({"type":["X","Y","X","Y","X"], "value":[10, 20, 30, 40, 50]})
# твій код
`,
          expected: `      sum  mean
type           
X      90  30.0
Y      60  30.0`,
          solution: `import pandas as pd
df = pd.DataFrame({"type":["X","Y","X","Y","X"], "value":[10, 20, 30, 40, 50]})
print(df.groupby("type")["value"].agg(["sum","mean"]))`,
        },
      ],
    },
    {
      id: 'l6-4',
      title: 'Сортування, merge, очищення',
      theory: `<p>Сортування: <code>df.sort_values("col")</code>, з кількома: <code>df.sort_values(["a","b"], ascending=[True, False])</code>.</p>
<p>Об'єднання: <code>pd.merge(df1, df2, on="key")</code>. Опції: <code>how="left"</code>, <code>"right"</code>, <code>"outer"</code>.</p>
<p>Пропущені значення: <code>.isna()</code>, <code>.dropna()</code>, <code>.fillna(value)</code>. Унікальні: <code>.unique()</code>, <code>.nunique()</code>, <code>.drop_duplicates()</code>.</p>`,
      examples: [
        {
          code: `import pandas as pd

df = pd.DataFrame({
    "name": ["Ivan","Olena","Petro","Anna"],
    "salary": [50000, 65000, 48000, 72000]
})

print(df.sort_values("salary", ascending=False))`,
          output: `    name  salary
3   Anna   72000
1  Olena   65000
0   Ivan   50000
2  Petro   48000`,
        },
        {
          code: `import pandas as pd

employees = pd.DataFrame({
    "id": [1, 2, 3, 4],
    "name": ["Ivan","Olena","Petro","Anna"],
    "dept_id": [10, 20, 10, 30]
})
depts = pd.DataFrame({
    "dept_id": [10, 20, 30],
    "dept_name": ["IT", "HR", "Sales"]
})

result = pd.merge(employees, depts, on="dept_id")
print(result)`,
          output: `   id   name  dept_id dept_name
0   1   Ivan       10        IT
1   2  Olena       20        HR
2   3  Petro       10        IT
3   4   Anna       30     Sales`,
        },
        {
          code: `import pandas as pd
import numpy as np

df = pd.DataFrame({
    "name": ["A","B","C","D"],
    "price": [100, np.nan, 200, np.nan],
    "qty": [10, 5, np.nan, 8]
})

print(df.fillna(0))`,
          output: `  name  price   qty
0    A  100.0  10.0
1    B    0.0   5.0
2    C  200.0   0.0
3    D    0.0   8.0`,
        },
      ],
      exercises: [
        {
          task: 'Відсортуй df за "price" за спаданням.',
          starter: `import pandas as pd
df = pd.DataFrame({"product":["A","B","C","D"], "price":[120, 80, 250, 150]})
# твій код
`,
          expected: `  product  price
2       C    250
3       D    150
0       A    120
1       B     80`,
          solution: `import pandas as pd
df = pd.DataFrame({"product":["A","B","C","D"], "price":[120, 80, 250, 150]})
print(df.sort_values("price", ascending=False))`,
        },
        {
          task: `Об'єднай df1 і df2 за колонкою "id".`,
          starter: `import pandas as pd
df1 = pd.DataFrame({"id":[1,2,3], "name":["A","B","C"]})
df2 = pd.DataFrame({"id":[1,2,3], "score":[90, 85, 78]})
# твій код
`,
          expected: `   id name  score
0   1    A     90
1   2    B     85
2   3    C     78`,
          solution: `import pandas as pd
df1 = pd.DataFrame({"id":[1,2,3], "name":["A","B","C"]})
df2 = pd.DataFrame({"id":[1,2,3], "score":[90, 85, 78]})
print(pd.merge(df1, df2, on="id"))`,
        },
        {
          task: 'У df заповни всі NaN нулями і виведи DataFrame.',
          starter: `import pandas as pd
import numpy as np
df = pd.DataFrame({"a":[1, np.nan, 3], "b":[np.nan, 5, 6]})
# твій код
`,
          expected: `     a    b
0  1.0  0.0
1  0.0  5.0
2  3.0  6.0`,
          solution: `import pandas as pd
import numpy as np
df = pd.DataFrame({"a":[1, np.nan, 3], "b":[np.nan, 5, 6]})
print(df.fillna(0))`,
        },
        {
          task: 'Знайди кількість унікальних значень у колонці "city".',
          starter: `import pandas as pd
df = pd.DataFrame({"city":["Kyiv","Lviv","Kyiv","Odesa","Lviv","Kyiv"]})
# твій код
`,
          expected: '3',
          solution: `import pandas as pd
df = pd.DataFrame({"city":["Kyiv","Lviv","Kyiv","Odesa","Lviv","Kyiv"]})
print(df["city"].nunique())`,
        },
        {
          task: 'Видали дублікати з df за колонкою "email" (залишити перший).',
          starter: `import pandas as pd
df = pd.DataFrame({"email":["a@x","b@x","a@x","c@x"], "n":[1,2,3,4]})
# твій код
`,
          expected: `  email  n
0   a@x  1
1   b@x  2
3   c@x  4`,
          solution: `import pandas as pd
df = pd.DataFrame({"email":["a@x","b@x","a@x","c@x"], "n":[1,2,3,4]})
print(df.drop_duplicates("email"))`,
        },
        {
          task: 'Знайди суму без NaN у колонці "value".',
          starter: `import pandas as pd
import numpy as np
df = pd.DataFrame({"value":[10, np.nan, 20, 30, np.nan, 5]})
# твій код
`,
          expected: '65.0',
          solution: `import pandas as pd
import numpy as np
df = pd.DataFrame({"value":[10, np.nan, 20, 30, np.nan, 5]})
print(df["value"].sum())`,
        },
      ],
    },
  ],
};
