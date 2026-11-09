export default {
  id: 'm4',
  title: 'Функції',
  lessons: [
    {
      id: 'l4-1',
      title: 'Створення функцій',
      theory: `<p>Функція оголошується через <code>def</code>: <code>def name(args): ...</code>. Повертає значення через <code>return</code>.</p>
<p>Аргументи можуть мати значення за замовчуванням: <code>def f(x, y=10):</code>. Можна передавати позиційно або за іменем.</p>`,
      examples: [
        {
          code: `def avg(numbers):
    """Повертає середнє арифметичне."""
    return sum(numbers) / len(numbers)

print(avg([10, 20, 30]))
print(avg([5, 15, 25, 35, 45]))`,
          output: `20.0
25.0`,
        },
        {
          code: `def discount_price(price, discount=0.1):
    return price * (1 - discount)

print(discount_price(1000))
print(discount_price(1000, 0.25))
print(discount_price(1000, discount=0.5))`,
          output: `900.0
750.0
500.0`,
        },
        {
          code: `def stats(nums):
    return min(nums), max(nums), sum(nums) / len(nums)

lo, hi, mean = stats([3, 7, 2, 9, 4])
print(f"min={lo}, max={hi}, avg={mean}")`,
          output: 'min=2, max=9, avg=5.0',
        },
        {
          code: `def sum_all(*nums):
    return sum(nums)

print(sum_all(1, 2, 3))
print(sum_all(10, 20, 30, 40, 50))

def build_user(**fields):
    return fields

print(build_user(name="Іван", age=30, city="Київ"))`,
          output: `6
150
{'name': 'Іван', 'age': 30, 'city': 'Київ'}`,
        },
      ],
      exercises: [
        {
          task: 'Напиши функцію <code>square(x)</code>, що повертає квадрат числа. Виклич з 7.',
          starter: `def square(x):
    pass
print(square(7))
`,
          expected: '49',
          solution: `def square(x):
    return x * x
print(square(7))`,
        },
        {
          task: 'Функція <code>greet(name)</code> повертає рядок "Привіт, {name}!". Виклич з "Іван".',
          starter: `def greet(name):
    pass
print(greet("Іван"))
`,
          expected: 'Привіт, Іван!',
          solution: `def greet(name):
    return f"Привіт, {name}!"

print(greet("Іван"))`,
        },
        {
          task: 'Функція <code>is_even(n)</code> повертає True/False. Виклич з 10.',
          starter: `def is_even(n):
    pass
print(is_even(10))
`,
          expected: 'True',
          solution: `def is_even(n):
    return n % 2 == 0

print(is_even(10))`,
        },
        {
          task: 'Функція <code>vat(price, rate=0.2)</code> повертає ціну з ПДВ (price + price*rate). Виклич з price=100.',
          starter: `def vat(price, rate=0.2):
    pass
print(vat(100))
`,
          expected: '120.0',
          solution: `def vat(price, rate=0.2):
    return price * (1 + rate)

print(vat(100))`,
        },
        {
          task: 'Функція <code>fizzbuzz(n)</code>: повертає "Fizz" якщо n%3==0, "Buzz" якщо n%5==0, "FizzBuzz" якщо обидва, інакше str(n). Виклич з 15.',
          starter: `def fizzbuzz(n):
    pass
print(fizzbuzz(15))
`,
          expected: 'FizzBuzz',
          solution: `def fizzbuzz(n):
    if n % 15 == 0: return "FizzBuzz"
    if n % 3 == 0: return "Fizz"
    if n % 5 == 0: return "Buzz"
    return str(n)

print(fizzbuzz(15))`,
        },
        {
          task: 'Функція <code>safe_div(a, b)</code> повертає a/b, але якщо b == 0 повертає <code>None</code>. Виклич з safe_div(10, 2) і safe_div(10, 0), кожен результат з нового рядка.',
          starter: `def safe_div(a, b):
    pass

print(safe_div(10, 2))
print(safe_div(10, 0))
`,
          expected: `5.0
None`,
          solution: `def safe_div(a, b):
    return None if b == 0 else a / b

print(safe_div(10, 2))
print(safe_div(10, 0))`,
        },
        {
          task: 'Функція <code>average(*nums)</code> приймає довільну кількість чисел і повертає середнє. Виклич з average(2, 4, 6, 8).',
          starter: `def average(*nums):
    pass
print(average(2, 4, 6, 8))
`,
          expected: '5.0',
          solution: `def average(*nums):
    return sum(nums) / len(nums)

print(average(2, 4, 6, 8))`,
        },
      ],
    },
    {
      id: 'l4-2',
      title: 'Lambda, map, filter',
      theory: `<p><code>lambda</code>: анонімна функція в одному рядку: <code>lambda x: x * 2</code>.</p>
<p><code>map(func, iterable)</code>: застосовує функцію до кожного елемента.</p>
<p><code>filter(func, iterable)</code>: залишає тільки ті, для яких func(x) повертає True.</p>`,
      examples: [
        {
          code: `square = lambda x: x ** 2
print(square(5))

nums = [1, 2, 3, 4, 5]
result = list(map(lambda x: x * 10, nums))
print(result)`,
          output: `25
[10, 20, 30, 40, 50]`,
        },
        {
          code: `nums = [1, 2, 3, 4, 5, 6, 7, 8]
evens = list(filter(lambda x: x % 2 == 0, nums))
print(evens)

words = ["apple", "ai", "data", "ml", "analytics"]
long_words = list(filter(lambda w: len(w) > 3, words))
print(long_words)`,
          output: `[2, 4, 6, 8]
['apple', 'data', 'analytics']`,
        },
        {
          code: `employees = [
    {"name": "Ivan", "salary": 50000},
    {"name": "Olena", "salary": 75000},
    {"name": "Petro", "salary": 60000}
]
by_salary = sorted(employees, key=lambda e: e["salary"], reverse=True)
for e in by_salary:
    print(e["name"], e["salary"])`,
          output: `Olena 75000
Petro 60000
Ivan 50000`,
        },
        {
          code: `data = [("apple", 3), ("banana", 1), ("cherry", 2)]
print(sorted(data, key=lambda x: x[1]))

words = ["data", "ai", "analytics", "ml"]
print(sorted(words, key=len))`,
          output: `[('banana', 1), ('cherry', 2), ('apple', 3)]
['ai', 'ml', 'data', 'analytics']`,
        },
      ],
      exercises: [
        {
          task: 'Створи lambda <code>cube</code>, що повертає куб числа. Виклич з 4.',
          starter: `cube = lambda 
print(cube(4))
`,
          expected: '64',
          solution: `cube = lambda x: x ** 3
print(cube(4))`,
        },
        {
          task: 'Використай map+lambda, щоб подвоїти кожне число у <code>[1, 2, 3, 4]</code>. Виведи як list.',
          starter: `nums = [1, 2, 3, 4]
# твій код
`,
          expected: '[2, 4, 6, 8]',
          solution: `nums = [1, 2, 3, 4]
print(list(map(lambda x: x*2, nums)))`,
        },
        {
          task: 'Використай filter+lambda, щоб залишити з <code>[5, 12, 8, 23, 1, 17]</code> числа >= 10.',
          starter: `nums = [5, 12, 8, 23, 1, 17]
# твій код
`,
          expected: '[12, 23, 17]',
          solution: `nums = [5, 12, 8, 23, 1, 17]
print(list(filter(lambda x: x >= 10, nums)))`,
        },
        {
          task: 'Відсортуй список рядків <code>["banana", "fig", "apple", "kiwi"]</code> за довжиною.',
          starter: `words = ["banana", "fig", "apple", "kiwi"]
# твій код
`,
          expected: `['fig', 'kiwi', 'apple', 'banana']`,
          solution: `words = ["banana", "fig", "apple", "kiwi"]
print(sorted(words, key=len))`,
        },
        {
          task: 'Відсортуй <code>[("a", 30), ("b", 10), ("c", 20)]</code> за другим елементом за спаданням.',
          starter: `pairs = [("a", 30), ("b", 10), ("c", 20)]
# твій код
`,
          expected: `[('a', 30), ('c', 20), ('b', 10)]`,
          solution: `pairs = [("a", 30), ("b", 10), ("c", 20)]
print(sorted(pairs, key=lambda x: x[1], reverse=True))`,
        },
        {
          task: 'Список словників: <code>[{"n":"A","v":5},{"n":"B","v":12},{"n":"C","v":3}]</code>. Знайди елемент з мінімальним "v" і виведи його "n".',
          starter: `data = [{"n":"A","v":5},{"n":"B","v":12},{"n":"C","v":3}]
# твій код
`,
          expected: 'C',
          solution: `data = [{"n":"A","v":5},{"n":"B","v":12},{"n":"C","v":3}]
print(min(data, key=lambda x: x["v"])["n"])`,
        },
      ],
    },
  ],
};
