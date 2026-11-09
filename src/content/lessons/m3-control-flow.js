export default {
  id: 'm3',
  title: 'Керування потоком',
  lessons: [
    {
      id: 'l3-1',
      title: 'Умовні оператори',
      theory: `<p>Конструкція: <code>if condition:</code> ... <code>elif other:</code> ... <code>else:</code> ...</p>
<p>Відступи в Python є синтаксисом, а не косметикою. Стандарт: 4 пробіли.</p>
<p>Перевірки можна об'єднувати: <code>if x &gt; 0 and y &gt; 0:</code>. Тернарний оператор: <code>value = a if cond else b</code>.</p>`,
      examples: [
        {
          code: `score = 78
if score >= 90:
    grade = "A"
elif score >= 75:
    grade = "B"
elif score >= 60:
    grade = "C"
else:
    grade = "F"
print(grade)`,
          output: 'B',
        },
        {
          code: `# Класифікація транзакцій
amount = 12500
currency = "UAH"

if currency == "UAH":
    if amount >= 10000:
        category = "VIP"
    elif amount >= 1000:
        category = "Standard"
    else:
        category = "Small"
else:
    category = "Foreign"
print(category)`,
          output: 'VIP',
        },
        {
          code: `email = "user@company.com"

if not email:
    print("ERROR: empty")
elif "@" not in email:
    print("ERROR: no @")
elif not email.endswith(".com"):
    print("ERROR: not .com")
else:
    print("OK")`,
          output: 'OK',
        },
      ],
      exercises: [
        {
          task: 'Дано <code>n = 7</code>. Виведи "парне" або "непарне".',
          starter: `n = 7
# твій код
`,
          expected: 'непарне',
          solution: `n = 7
print("парне" if n % 2 == 0 else "непарне")`,
        },
        {
          task: 'Дано <code>temp = 22</code>. Виведи "холодно" (<10), "тепло" (10-25), "спекотно" (>25).',
          starter: `temp = 22
# твій код
`,
          expected: 'тепло',
          solution: `temp = 22
if temp < 10: print("холодно")
elif temp <= 25: print("тепло")
else: print("спекотно")`,
        },
        {
          task: 'Дано <code>age = 17</code>. Виведи "так" якщо вік від 18 до 65 включно, інакше "ні".',
          starter: `age = 17
# твій код
`,
          expected: 'ні',
          solution: `age = 17
print("так" if 18 <= age <= 65 else "ні")`,
        },
        {
          task: 'Знижка: якщо сума замовлення ≥ 5000, знижка 10%, якщо ≥ 1000, знижка 5%, інакше 0%. Дано <code>amount = 2500</code>. Виведи фінальну суму як ціле.',
          starter: `amount = 2500
# твій код
`,
          expected: '2375',
          solution: `amount = 2500
if amount >= 5000: d = 0.1
elif amount >= 1000: d = 0.05
else: d = 0
print(int(amount * (1 - d)))`,
        },
        {
          task: 'Перевір, чи рік <code>year = 2024</code> високосний. Виведи True/False. Правило: ділиться на 4, АЛЕ якщо ділиться на 100, то має ділитись на 400.',
          starter: `year = 2024
# твій код
`,
          expected: 'True',
          solution: `year = 2024
print((year % 4 == 0 and year % 100 != 0) or year % 400 == 0)`,
        },
        {
          task: 'Дано <code>password = "abc123"</code>. Виведи "сильний" якщо довжина ≥ 8 і є хоча б одна цифра, інакше "слабкий".',
          starter: `password = "abc123"
# твій код
`,
          expected: 'слабкий',
          solution: `password = "abc123"
has_digit = any(ch.isdigit() for ch in password)
print("сильний" if len(password) >= 8 and has_digit else "слабкий")`,
        },
      ],
    },
    {
      id: 'l3-2',
      title: 'Цикли for',
      theory: `<p><code>for x in iterable:</code>: проходить по елементах. Працює зі списками, рядками, словниками, range.</p>
<p><code>range(stop)</code>, <code>range(start, stop)</code>, <code>range(start, stop, step)</code>: генерує послідовність чисел.</p>
<p>Корисні: <code>enumerate(lst)</code>: пари (індекс, значення); <code>zip(a, b)</code>: пари з двох послідовностей.</p>
<p>Керування: <code>break</code>: вийти з циклу, <code>continue</code>: наступна ітерація.</p>`,
      examples: [
        {
          code: `# range
for i in range(5):
    print(i, end=" ")
print()
for i in range(2, 8):
    print(i, end=" ")
print()
for i in range(0, 20, 5):
    print(i, end=" ")`,
          output: `0 1 2 3 4 
2 3 4 5 6 7 
0 5 10 15 `,
        },
        {
          code: `fruits = ["apple", "banana", "cherry"]
for i, name in enumerate(fruits, start=1):
    print(f"{i}. {name}")`,
          output: `1. apple
2. banana
3. cherry`,
        },
        {
          code: `names = ["Іван", "Олена", "Петро"]
ages = [30, 25, 40]
for n, a in zip(names, ages):
    print(f"{n} - {a}")`,
          output: `Іван - 30
Олена - 25
Петро - 40`,
        },
        {
          code: `total = 0
for n in [5, 12, -3, 8, 0, 20, -1]:
    if n < 0:
        continue
    if total > 30:
        break
    total += n
print(total)`,
          output: '45',
        },
      ],
      exercises: [
        {
          task: 'Виведи суму чисел від 1 до 100 (включно).',
          starter: `# твій код
`,
          expected: '5050',
          solution: 'print(sum(range(1, 101)))',
        },
        {
          task: 'Виведи всі парні числа від 0 до 20 (включно) через пробіл в одному рядку.',
          starter: `# твій код
`,
          expected: '0 2 4 6 8 10 12 14 16 18 20 ',
          solution: `for i in range(0, 21, 2):
    print(i, end=" ")`,
        },
        {
          task: 'Список <code>prices = [120, 250, 80, 400]</code>. Виведи кожну ціну у форматі: <code>Товар 1: 120</code> (з нумерацією від 1).',
          starter: `prices = [120, 250, 80, 400]
# твій код
`,
          expected: `Товар 1: 120
Товар 2: 250
Товар 3: 80
Товар 4: 400`,
          solution: `prices = [120, 250, 80, 400]
for i, p in enumerate(prices, 1):
    print(f"Товар {i}: {p}")`,
        },
        {
          task: 'Маємо два списки: <code>products = ["хліб", "сік"]</code> і <code>qty = [3, 2]</code>. Виведи фрази: <code>хліб x 3</code> і <code>сік x 2</code>.',
          starter: `products = ["хліб", "сік"]
qty = [3, 2]
# твій код
`,
          expected: `хліб x 3
сік x 2`,
          solution: `products = ["хліб", "сік"]
qty = [3, 2]
for p, q in zip(products, qty):
    print(f"{p} x {q}")`,
        },
        {
          task: 'Підрахуй кількість голосних (a, e, i, o, u) у рядку <code>"data analytics"</code>.',
          starter: `s = "data analytics"
# твій код
`,
          expected: '5',
          solution: `s = "data analytics"
count = 0
for ch in s:
    if ch in "aeiou":
        count += 1
print(count)`,
        },
        {
          task: 'З <code>[10, -5, 8, -2, 15, -7, 3]</code> виведи список тільки додатних чисел.',
          starter: `nums = [10, -5, 8, -2, 15, -7, 3]
# твій код
`,
          expected: '[10, 8, 15, 3]',
          solution: `nums = [10, -5, 8, -2, 15, -7, 3]
positives = []
for n in nums:
    if n > 0:
        positives.append(n)
print(positives)`,
        },
        {
          task: 'Знайди перше число у списку <code>[3, 7, 12, 18, 24, 35]</code>, що більше за 15, і виведи його (використай break).',
          starter: `nums = [3, 7, 12, 18, 24, 35]
# твій код
`,
          expected: '18',
          solution: `nums = [3, 7, 12, 18, 24, 35]
for n in nums:
    if n > 15:
        print(n)
        break`,
        },
      ],
    },
    {
      id: 'l3-3',
      title: 'Comprehensions',
      theory: `<p>List comprehension: компактна форма створення списку: <code>[expr for x in iterable]</code>.</p>
<p>З умовою: <code>[expr for x in iterable if cond]</code>.</p>
<p>Dict comprehension: <code>{k: v for ...}</code>. Set comprehension: <code>{expr for ...}</code>.</p>`,
      examples: [
        {
          code: `squares = [x ** 2 for x in range(1, 6)]
print(squares)

evens = [x for x in range(20) if x % 2 == 0]
print(evens)`,
          output: `[1, 4, 9, 16, 25]
[0, 2, 4, 6, 8, 10, 12, 14, 16, 18]`,
        },
        {
          code: `names = ["  Ivan  ", "OLENA", "petro"]
clean = [n.strip().title() for n in names]
print(clean)

words = ["data", "analytics", "is", "fun"]
lengths = [len(w) for w in words]
print(lengths)`,
          output: `['Ivan', 'Olena', 'Petro']
[4, 9, 2, 3]`,
        },
        {
          code: `prices = {"кава": 45, "чай": 30, "сік": 25}
with_tax = {k: round(v * 1.2, 2) for k, v in prices.items()}
print(with_tax)

inv = {v: k for k, v in prices.items()}
print(inv)`,
          output: `{'кава': 54.0, 'чай': 36.0, 'сік': 30.0}
{45: 'кава', 30: 'чай', 25: 'сік'}`,
        },
        {
          code: `nums = [-5, 3, -1, 8, -2, 10]
result = ["+" if n > 0 else "-" for n in nums]
print(result)

matrix = [[i*j for j in range(1, 4)] for i in range(1, 4)]
for row in matrix:
    print(row)`,
          output: `['-', '+', '-', '+', '-', '+']
[1, 2, 3]
[2, 4, 6]
[3, 6, 9]`,
        },
      ],
      exercises: [
        {
          task: 'Створи список квадратів чисел від 1 до 10.',
          starter: `# твій код
`,
          expected: '[1, 4, 9, 16, 25, 36, 49, 64, 81, 100]',
          solution: 'print([x**2 for x in range(1, 11)])',
        },
        {
          task: 'Зі списку <code>[12, 7, 23, 4, 18, 9, 35]</code> отримай тільки ті, що більше 10.',
          starter: `nums = [12, 7, 23, 4, 18, 9, 35]
# твій код
`,
          expected: '[12, 23, 18, 35]',
          solution: `nums = [12, 7, 23, 4, 18, 9, 35]
print([n for n in nums if n > 10])`,
        },
        {
          task: 'З <code>["apple", "BANANA", "Cherry"]</code> отримай список у нижньому регістрі.',
          starter: `fruits = ["apple", "BANANA", "Cherry"]
# твій код
`,
          expected: `['apple', 'banana', 'cherry']`,
          solution: `fruits = ["apple", "BANANA", "Cherry"]
print([f.lower() for f in fruits])`,
        },
        {
          task: 'Зі словника <code>{"a": 5, "b": 12, "c": 8, "d": 20}</code> залиш тільки пари, де значення > 10.',
          starter: `d = {"a": 5, "b": 12, "c": 8, "d": 20}
# твій код
`,
          expected: `{'b': 12, 'd': 20}`,
          solution: `d = {"a": 5, "b": 12, "c": 8, "d": 20}
print({k: v for k, v in d.items() if v > 10})`,
        },
        {
          task: 'Зі списку чисел <code>[5, -3, 8, -1, 0, 7, -4]</code> створи список їх абсолютних значень.',
          starter: `nums = [5, -3, 8, -1, 0, 7, -4]
# твій код
`,
          expected: '[5, 3, 8, 1, 0, 7, 4]',
          solution: `nums = [5, -3, 8, -1, 0, 7, -4]
print([abs(n) for n in nums])`,
        },
        {
          task: 'Створи словник, де ключами є числа від 1 до 5, а значеннями їхні куби.',
          starter: `# твій код
`,
          expected: '{1: 1, 2: 8, 3: 27, 4: 64, 5: 125}',
          solution: 'print({x: x**3 for x in range(1, 6)})',
        },
        {
          task: 'З двох списків <code>keys = ["a","b","c"]</code> і <code>vals = [10, 20, 30]</code> зроби словник.',
          starter: `keys = ["a", "b", "c"]
vals = [10, 20, 30]
# твій код
`,
          expected: `{'a': 10, 'b': 20, 'c': 30}`,
          solution: `keys = ["a", "b", "c"]
vals = [10, 20, 30]
print({k: v for k, v in zip(keys, vals)})`,
        },
      ],
    },
  ],
};
