export default {
  id: 'm1',
  title: 'Основи',
  lessons: [
    {
      id: 'l1-1',
      title: 'Змінні та типи даних',
      theory: `<p>У Python змінна є ім'ям, що посилається на значення. Тип визначається автоматично. Основні типи: <code>int</code> (цілі), <code>float</code> (дробові), <code>str</code> (рядки), <code>bool</code> (True/False), <code>None</code> (відсутність значення).</p>
<p>Перевірити тип можна функцією <code>type()</code>. Конвертувати між типами: <code>int()</code>, <code>float()</code>, <code>str()</code>, <code>bool()</code>.</p>
<p>Імена змінних: латиниця, цифри, підкреслення; не починаються з цифри. Конвенція: <code>snake_case</code>.</p>`,
      examples: [
        {
          code: `# Базові типи
age = 30           # int
price = 19.99      # float
name = "Іван"      # str
active = True      # bool

print(type(age), type(price), type(name), type(active))`,
          output: `<class 'int'> <class 'float'> <class 'str'> <class 'bool'>`,
        },
        {
          code: `# Конвертація типів
x = "42"
n = int(x)
print(n + 8)

# float -> int відкидає дробову частину
print(int(3.99))

# Будь-яке непорожнє значення -> True
print(bool(""), bool("text"), bool(0), bool(1))`,
          output: `50
3
False True False True`,
        },
        {
          code: `# Кілька присвоєнь одночасно
x, y, z = 1, 2, 3
print(x + y + z)

# Обмін значеннями без temp-змінної
a, b = 10, 20
a, b = b, a
print(a, b)`,
          output: `6
20 10`,
        },
        {
          code: `# f-strings - найзручніший спосіб форматування
name = "Олена"
sales = 12500
print(f"{name} продала на суму {sales} грн")

# Округлення в f-string
pi = 3.14159265
print(f"π ≈ {pi:.2f}")`,
          output: `Олена продала на суму 12500 грн
π ≈ 3.14`,
        },
      ],
      exercises: [
        {
          task: 'Створи змінну <code>revenue</code> зі значенням <code>150000</code> і виведи її тип.',
          starter: `revenue = 
# виведи тип
`,
          expected: `<class 'int'>`,
          solution: `revenue = 150000
print(type(revenue))`,
        },
        {
          task: 'Конвертуй рядок <code>"3.14"</code> у число типу float, помнож на 2 і виведи результат.',
          starter: `x = "3.14"
# твій код
`,
          expected: '6.28',
          solution: `x = "3.14"
print(float(x) * 2)`,
        },
        {
          task: 'Створи дві змінні <code>a = 5</code> і <code>b = 7</code>. Обміняй їх значеннями і виведи через пробіл.',
          starter: `a = 5
b = 7
# обміняй і виведи
`,
          expected: '7 5',
          solution: `a = 5
b = 7
a, b = b, a
print(a, b)`,
        },
        {
          task: 'Зміннi <code>price = 1299.5</code> і <code>qty = 3</code>. Виведи фразу: <code>Сума: 3898.50 грн</code> (з двома знаками після коми).',
          starter: `price = 1299.5
qty = 3
# твій код
`,
          expected: 'Сума: 3898.50 грн',
          solution: `price = 1299.5
qty = 3
print(f"Сума: {price*qty:.2f} грн")`,
        },
        {
          task: 'Дано <code>x = "100"</code>. Конвертуй у int, додай 50 і виведи результат.',
          starter: `x = "100"
# твій код
`,
          expected: '150',
          solution: `x = "100"
print(int(x) + 50)`,
        },
        {
          task: 'Перевір, що повертає <code>bool()</code> для пустого рядка, нуля, числа 0.0 та порожнього списку <code>[]</code>. Виведи усі чотири значення через пробіл.',
          starter: `# твій код
`,
          expected: 'False False False False',
          solution: 'print(bool(""), bool(0), bool(0.0), bool([]))',
        },
      ],
    },
    {
      id: 'l1-2',
      title: 'Рядки (strings)',
      theory: `<p>Рядки в Python: послідовності символів у лапках (одинарних або подвійних). До них можна звертатися за індексом: <code>s[0]</code>: перший символ, <code>s[-1]</code>: останній.</p>
<p>Зрізи (slicing): <code>s[1:4]</code>: символи з 1 по 3 включно, <code>s[:5]</code>: перші 5, <code>s[::-1]</code>: зворотний порядок.</p>
<p>Корисні методи: <code>.lower()</code>, <code>.upper()</code>, <code>.strip()</code>, <code>.replace()</code>, <code>.split()</code>, <code>.join()</code>, <code>.startswith()</code>, <code>.find()</code>.</p>`,
      examples: [
        {
          code: `s = "Data Analyst"
print(s[0])        # перший символ
print(s[-1])       # останній
print(s[5:])       # від індексу 5 до кінця
print(s[:4])       # перші 4
print(len(s))      # довжина`,
          output: `D
t
Analyst
Data
12`,
        },
        {
          code: `email = "  Vitaliy@COMPANY.com  "
clean = email.strip().lower()
print(clean)

print(clean.endswith("@company.com"))
print(clean.replace("@company", "@firm"))`,
          output: `vitaliy@company.com
True
vitaliy@firm.com`,
        },
        {
          code: `# split + join - дуже корисно для CSV
row = "Київ;Одеса;Львів;Харків"
cities = row.split(";")
print(cities)
print(len(cities))

joined = " | ".join(cities)
print(joined)`,
          output: `['Київ', 'Одеса', 'Львів', 'Харків']
4
Київ | Одеса | Львів | Харків`,
        },
        {
          code: `# Пошук підрядка
text = "Sales report 2026 Q1"
print("2026" in text)
print(text.find("Q1"))     # індекс знайденого
print(text.find("Q3"))     # -1 якщо не знайдено
print(text.count("e"))     # кількість входжень`,
          output: `True
18
-1
2`,
        },
      ],
      exercises: [
        {
          task: 'Дано рядок <code>s = "powerbi"</code>. Виведи перший і останній символи через пробіл.',
          starter: `s = "powerbi"
# твій код
`,
          expected: 'p i',
          solution: `s = "powerbi"
print(s[0], s[-1])`,
        },
        {
          task: 'Розверни рядок <code>"analyst"</code> у зворотному порядку.',
          starter: `s = "analyst"
# твій код
`,
          expected: 'tsylana',
          solution: `s = "analyst"
print(s[::-1])`,
        },
        {
          task: 'Дано <code>email = "  John.Doe@Mail.com  "</code>. Прибери пробіли та переведи у нижній регістр.',
          starter: `email = "  John.Doe@Mail.com  "
# твій код
`,
          expected: 'john.doe@mail.com',
          solution: `email = "  John.Doe@Mail.com  "
print(email.strip().lower())`,
        },
        {
          task: 'Дано CSV-рядок <code>"apple,banana,cherry,date"</code>. Виведи кількість елементів.',
          starter: `row = "apple,banana,cherry,date"
# твій код
`,
          expected: '4',
          solution: `row = "apple,banana,cherry,date"
print(len(row.split(",")))`,
        },
        {
          task: `Список фруктів <code>fruits = ["apple", "banana", "cherry"]</code>. Об'єднай їх через " + " і виведи.`,
          starter: `fruits = ["apple", "banana", "cherry"]
# твій код
`,
          expected: 'apple + banana + cherry',
          solution: `fruits = ["apple", "banana", "cherry"]
print(" + ".join(fruits))`,
        },
        {
          task: 'У рядку <code>"Sales: 12500 UAH"</code> заміни "UAH" на "₴".',
          starter: `s = "Sales: 12500 UAH"
# твій код
`,
          expected: 'Sales: 12500 ₴',
          solution: `s = "Sales: 12500 UAH"
print(s.replace("UAH", "₴"))`,
        },
        {
          task: 'Підрахуй, скільки разів літера "a" зустрічається в рядку <code>"banana cabana"</code>.',
          starter: `s = "banana cabana"
# твій код
`,
          expected: '6',
          solution: `s = "banana cabana"
print(s.count("a"))`,
        },
      ],
    },
    {
      id: 'l1-3',
      title: 'Числа та оператори',
      theory: `<p>Арифметика: <code>+</code> <code>-</code> <code>*</code> <code>/</code> <code>**</code> (степінь), <code>//</code> (цілочисельне ділення), <code>%</code> (залишок).</p>
<p>Корисні функції: <code>abs()</code>, <code>round()</code>, <code>min()</code>, <code>max()</code>, <code>sum()</code>, <code>pow()</code>.</p>
<p>Модуль <code>math</code> має <code>math.sqrt()</code>, <code>math.floor()</code>, <code>math.ceil()</code>, <code>math.pi</code> та інші.</p>`,
      examples: [
        {
          code: `# Основна арифметика
print(10 / 3)       # звичайне ділення
print(10 // 3)      # цілочисельне
print(10 % 3)       # залишок
print(2 ** 10)      # степінь
print(abs(-15))     # модуль`,
          output: `3.3333333333333335
3
1
1024
15`,
        },
        {
          code: `# round() з другим аргументом
x = 3.14159265
print(round(x, 2))
print(round(x, 4))
print(round(1234567, -3))

# Конвертація валют
usd = 100
rate = 41.23
print(round(usd * rate, 2))`,
          output: `3.14
3.1416
1235000
4123.0`,
        },
        {
          code: `import math
print(math.sqrt(144))
print(math.floor(7.9))
print(math.ceil(7.1))
print(math.pi)
print(round(math.log(100, 10), 2))`,
          output: `12.0
7
8
3.141592653589793
2.0`,
        },
        {
          code: `# Відсоток зміни
old = 10000
new = 12500
change_pct = (new - old) / old * 100
print(f"Зростання: {change_pct:.1f}%")

# Чи парне число
n = 17
print(n % 2 == 0)`,
          output: `Зростання: 25.0%
False`,
        },
      ],
      exercises: [
        {
          task: 'Обчисли остачу від ділення 2026 на 7.',
          starter: `# твій код
`,
          expected: '3',
          solution: 'print(2026 % 7)',
        },
        {
          task: 'Обчисли 2 у степені 16.',
          starter: `# твій код
`,
          expected: '65536',
          solution: 'print(2 ** 16)',
        },
        {
          task: 'Округли число <code>123.4567</code> до 2 знаків після коми.',
          starter: `x = 123.4567
# твій код
`,
          expected: '123.46',
          solution: `x = 123.4567
print(round(x, 2))`,
        },
        {
          task: 'Площа кола радіусом 5. Виведи округлене до 2 знаків. (Використай <code>math.pi</code>)',
          starter: `import math
r = 5
# твій код
`,
          expected: '78.54',
          solution: `import math
r = 5
print(round(math.pi * r ** 2, 2))`,
        },
        {
          task: 'Виведи відсоток зміни від 8000 до 10000 з одним знаком після коми (наприклад <code>25.0%</code>).',
          starter: `old = 8000
new = 10000
# твій код
`,
          expected: '25.0%',
          solution: `old = 8000
new = 10000
print(f"{(new-old)/old*100:.1f}%")`,
        },
        {
          task: 'Скільки повних годин в 12345 секундах? (цілочисельне ділення)',
          starter: `sec = 12345
# твій код
`,
          expected: '3',
          solution: `sec = 12345
print(sec // 3600)`,
        },
      ],
    },
    {
      id: 'l1-4',
      title: 'Логічні операції',
      theory: `<p>Порівняння: <code>==</code> <code>!=</code> <code>&lt;</code> <code>&gt;</code> <code>&lt;=</code> <code>&gt;=</code>. Результат: <code>True</code> або <code>False</code>.</p>
<p>Логічні: <code>and</code> (обидва True), <code>or</code> (хоча б один True), <code>not</code> (заперечення).</p>
<p>Перевірка членства: <code>in</code>, <code>not in</code>. Працює для рядків, списків, словників.</p>`,
      examples: [
        {
          code: `age = 25
salary = 50000
is_senior = age >= 30 and salary > 80000
print(is_senior)

# Ланцюжок порівнянь
score = 75
print(60 <= score <= 80)`,
          output: `False
True`,
        },
        {
          code: `# in / not in
name = "Iuliia"
print("ii" in name)
print("Z" not in name)

allowed = ["admin", "editor", "viewer"]
role = "guest"
print(role in allowed)`,
          output: `True
True
False`,
        },
        {
          code: `# Тернарний оператор
x = 15
status = "великий" if x > 10 else "малий"
print(status)

# Поєднання умов
income = 70000
tax = 0.18 if income > 50000 else 0.05
print(f"Ставка податку: {tax*100:.0f}%")`,
          output: `великий
Ставка податку: 18%`,
        },
      ],
      exercises: [
        {
          task: 'Перевір, чи число 42 більше за 10 і менше за 100. Виведи результат.',
          starter: `n = 42
# твій код
`,
          expected: 'True',
          solution: `n = 42
print(10 < n < 100)`,
        },
        {
          task: 'Дано <code>email = "user@gmail.com"</code>. Перевір, чи є в ньому "@" і чи закінчується на ".com".',
          starter: `email = "user@gmail.com"
# твій код
`,
          expected: 'True',
          solution: `email = "user@gmail.com"
print("@" in email and email.endswith(".com"))`,
        },
        {
          task: 'Перевір, чи слово "python" є у списку <code>["sql", "python", "dax"]</code>.',
          starter: `tools = ["sql", "python", "dax"]
# твій код
`,
          expected: 'True',
          solution: `tools = ["sql", "python", "dax"]
print("python" in tools)`,
        },
        {
          task: 'Дано <code>x = 0</code>. Скористайся тернарним оператором, щоб вивести "позитивне", "негативне" або "нуль".',
          starter: `x = 0
# твій код
`,
          expected: 'нуль',
          solution: `x = 0
print("позитивне" if x > 0 else "негативне" if x < 0 else "нуль")`,
        },
        {
          task: 'Користувач має <code>age = 22</code> і <code>has_license = True</code>. Виведи True, якщо обидві умови виконано: вік ≥ 18 і є ліцензія.',
          starter: `age = 22
has_license = True
# твій код
`,
          expected: 'True',
          solution: `age = 22
has_license = True
print(age >= 18 and has_license)`,
        },
        {
          task: 'Дано <code>password = ""</code>. Перевір, чи пароль "пустий" (через bool). Має вивести True.',
          starter: `password = ""
# твій код
`,
          expected: 'True',
          solution: `password = ""
print(not password)`,
        },
      ],
    },
  ],
};
