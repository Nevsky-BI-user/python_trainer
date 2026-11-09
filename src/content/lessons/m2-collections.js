export default {
  id: 'm2',
  title: 'Колекції',
  lessons: [
    {
      id: 'l2-1',
      title: 'Списки (lists)',
      theory: `<p>Список: впорядкована, змінювана колекція: <code>[1, 2, 3]</code>. Може містити різні типи.</p>
<p>Додавання: <code>.append(x)</code> (в кінець), <code>.insert(i, x)</code>, <code>.extend([...])</code>. Видалення: <code>.remove(x)</code>, <code>.pop(i)</code>, <code>del lst[i]</code>.</p>
<p>Сортування: <code>.sort()</code> (на місці), <code>sorted(lst)</code> (нова копія). Реверс: <code>.reverse()</code> або <code>[::-1]</code>.</p>`,
      examples: [
        {
          code: `sales = [120, 350, 80, 410, 290]
print(sum(sales))
print(max(sales))
print(min(sales))
print(round(sum(sales) / len(sales), 1))`,
          output: `1250
410
80
250.0`,
        },
        {
          code: `cities = ["Київ", "Львів"]
cities.append("Одеса")
cities.insert(1, "Харків")
print(cities)

cities.remove("Львів")
print(cities)

last = cities.pop()
print("Видалили:", last)
print(cities)`,
          output: `['Київ', 'Харків', 'Львів', 'Одеса']
['Київ', 'Харків', 'Одеса']
Видалили: Одеса
['Київ', 'Харків']`,
        },
        {
          code: `# Сортування
nums = [5, 2, 8, 1, 9, 3]
print(sorted(nums))
print(sorted(nums, reverse=True))

words = ["banana", "Apple", "cherry"]
print(sorted(words, key=str.lower))`,
          output: `[1, 2, 3, 5, 8, 9]
[9, 8, 5, 3, 2, 1]
['Apple', 'banana', 'cherry']`,
        },
        {
          code: `# Зрізи + копіювання
nums = [10, 20, 30, 40, 50, 60]
print(nums[1:4])
print(nums[:3])
print(nums[-2:])
print(nums[::2])`,
          output: `[20, 30, 40]
[10, 20, 30]
[50, 60]
[10, 30, 50]`,
        },
      ],
      exercises: [
        {
          task: 'Створи список з чисел 1, 2, 3, 4, 5 і виведи їх суму.',
          starter: `nums = 
# твій код
`,
          expected: '15',
          solution: `nums = [1,2,3,4,5]
print(sum(nums))`,
        },
        {
          task: 'Дано <code>sales = [120, 350, 80, 410, 290]</code>. Знайди середнє арифметичне (округли до 1 знака).',
          starter: `sales = [120, 350, 80, 410, 290]
# твій код
`,
          expected: '250.0',
          solution: `sales = [120, 350, 80, 410, 290]
print(round(sum(sales)/len(sales), 1))`,
        },
        {
          task: 'У список <code>["сік", "хліб"]</code> додай "молоко" в кінець і "вода" на початок. Виведи список.',
          starter: `items = ["сік", "хліб"]
# твій код
`,
          expected: `['вода', 'сік', 'хліб', 'молоко']`,
          solution: `items = ["сік", "хліб"]
items.append("молоко")
items.insert(0, "вода")
print(items)`,
        },
        {
          task: 'Відсортуй список <code>[3.5, 1.2, 4.8, 2.1]</code> за спаданням.',
          starter: `arr = [3.5, 1.2, 4.8, 2.1]
# твій код
`,
          expected: '[4.8, 3.5, 2.1, 1.2]',
          solution: `arr = [3.5, 1.2, 4.8, 2.1]
print(sorted(arr, reverse=True))`,
        },
        {
          task: 'Виведи останні 3 елементи списку <code>[10, 20, 30, 40, 50, 60, 70]</code>.',
          starter: `lst = [10, 20, 30, 40, 50, 60, 70]
# твій код
`,
          expected: '[50, 60, 70]',
          solution: `lst = [10, 20, 30, 40, 50, 60, 70]
print(lst[-3:])`,
        },
        {
          task: 'Дано список <code>scores = [85, 92, 78, 91, 64]</code>. Виведи різницю між максимальним і мінімальним значеннями.',
          starter: `scores = [85, 92, 78, 91, 64]
# твій код
`,
          expected: '28',
          solution: `scores = [85, 92, 78, 91, 64]
print(max(scores) - min(scores))`,
        },
        {
          task: 'Видали з <code>[1, 2, 3, 4, 5]</code> елемент 3 і виведи список.',
          starter: `lst = [1, 2, 3, 4, 5]
# твій код
`,
          expected: '[1, 2, 4, 5]',
          solution: `lst = [1, 2, 3, 4, 5]
lst.remove(3)
print(lst)`,
        },
      ],
    },
    {
      id: 'l2-2',
      title: 'Словники (dicts)',
      theory: `<p>Словник: колекція пар "ключ-значення": <code>{"name": "Іван", "age": 30}</code>. Доступ за ключем: <code>d["name"]</code>.</p>
<p>Безпечний доступ: <code>d.get("key", default)</code>: не падає, якщо ключа немає.</p>
<p>Корисні методи: <code>.keys()</code>, <code>.values()</code>, <code>.items()</code>, <code>.update({...})</code>, <code>.pop("key")</code>.</p>`,
      examples: [
        {
          code: `user = {"name": "Олена", "age": 28, "city": "Львів"}
print(user["name"])
print(user.get("email", "не вказано"))

user["email"] = "olena@mail.com"
user["age"] = 29
print(user)`,
          output: `Олена
не вказано
{'name': 'Олена', 'age': 29, 'city': 'Львів', 'email': 'olena@mail.com'}`,
        },
        {
          code: `prices = {"кава": 45, "чай": 30, "сік": 25}
for key, value in prices.items():
    print(f"{key}: {value} грн")

print("Сума:", sum(prices.values()))`,
          output: `кава: 45 грн
чай: 30 грн
сік: 25 грн
Сума: 100`,
        },
        {
          code: `# Підрахунок частоти
words = ["sql", "python", "sql", "dax", "python", "sql"]
counts = {}
for w in words:
    counts[w] = counts.get(w, 0) + 1
print(counts)`,
          output: `{'sql': 3, 'python': 2, 'dax': 1}`,
        },
        {
          code: `# Вкладені словники
employees = {
    "E001": {"name": "Іван", "salary": 50000},
    "E002": {"name": "Олена", "salary": 65000}
}
print(employees["E002"]["name"])
print(employees["E001"]["salary"])`,
          output: `Олена
50000`,
        },
      ],
      exercises: [
        {
          task: 'Створи словник <code>person</code> з ключами "name" = "Ivan" і "age" = 30. Виведи його.',
          starter: `# твій код
`,
          expected: `{'name': 'Ivan', 'age': 30}`,
          solution: `person = {"name": "Ivan", "age": 30}
print(person)`,
        },
        {
          task: 'Дано <code>d = {"a": 1, "b": 2, "c": 3}</code>. Виведи суму всіх значень.',
          starter: `d = {"a": 1, "b": 2, "c": 3}
# твій код
`,
          expected: '6',
          solution: `d = {"a": 1, "b": 2, "c": 3}
print(sum(d.values()))`,
        },
        {
          task: 'У словник <code>{"hello": "Привіт"}</code> додай пару "bye" → "Бувай" і виведи словник.',
          starter: `d = {"hello": "Привіт"}
# твій код
`,
          expected: `{'hello': 'Привіт', 'bye': 'Бувай'}`,
          solution: `d = {"hello": "Привіт"}
d["bye"] = "Бувай"
print(d)`,
        },
        {
          task: 'Безпечно отримай значення для ключа "phone" зі словника <code>{"name": "Олег"}</code>. Якщо ключа немає, поверни "н/д".',
          starter: `d = {"name": "Олег"}
# твій код
`,
          expected: 'н/д',
          solution: `d = {"name": "Олег"}
print(d.get("phone", "н/д"))`,
        },
        {
          task: 'Дано список <code>["a", "b", "a", "c", "b", "a"]</code>. Підрахуй, скільки разів кожна літера зустрічається. Виведи словник.',
          starter: `letters = ["a", "b", "a", "c", "b", "a"]
# твій код
`,
          expected: `{'a': 3, 'b': 2, 'c': 1}`,
          solution: `letters = ["a", "b", "a", "c", "b", "a"]
counts = {}
for ch in letters:
    counts[ch] = counts.get(ch, 0) + 1
print(counts)`,
        },
        {
          task: 'Знайди ключ з максимальним значенням у словнику <code>{"x": 10, "y": 45, "z": 23}</code>.',
          starter: `d = {"x": 10, "y": 45, "z": 23}
# твій код
`,
          expected: 'y',
          solution: `d = {"x": 10, "y": 45, "z": 23}
print(max(d, key=d.get))`,
        },
      ],
    },
    {
      id: 'l2-3',
      title: 'Кортежі та множини',
      theory: `<p><strong>Кортеж (tuple)</strong>: як список, але незмінний: <code>(1, 2, 3)</code>. Швидший і безпечніший, коли дані не мають змінюватись.</p>
<p><strong>Множина (set)</strong>: невпорядкована колекція унікальних значень: <code>{1, 2, 3}</code>. Швидкий пошук членства, видалення дублікатів.</p>
<p>Операції над множинами: <code>|</code> (об'єднання), <code>&</code> (перетин), <code>-</code> (різниця).</p>`,
      examples: [
        {
          code: `# Tuple - незмінний
point = (10, 20)
x, y = point
print(x, y)

def stats(nums):
    return min(nums), max(nums), sum(nums)/len(nums)

lo, hi, avg = stats([5, 8, 12, 3, 9])
print(lo, hi, avg)`,
          output: `10 20
3 12 7.4`,
        },
        {
          code: `nums = [1, 2, 2, 3, 3, 3, 4]
unique = set(nums)
print(unique)
print(len(unique))

allowed = {"admin", "editor", "viewer"}
print("admin" in allowed)`,
          output: `{1, 2, 3, 4}
4
True`,
        },
        {
          code: `a = {1, 2, 3, 4, 5}
b = {4, 5, 6, 7, 8}
print(a | b)
print(a & b)
print(a - b)
print(a ^ b)`,
          output: `{1, 2, 3, 4, 5, 6, 7, 8}
{4, 5}
{1, 2, 3}
{1, 2, 3, 6, 7, 8}`,
        },
        {
          code: `# Дедуплікація + збереження порядку
emails = ["a@x.com", "b@x.com", "a@x.com", "c@x.com", "b@x.com"]
unique = list(dict.fromkeys(emails))
print(unique)`,
          output: `['a@x.com', 'b@x.com', 'c@x.com']`,
        },
      ],
      exercises: [
        {
          task: 'Створи tuple з трьох чисел: 10, 20, 30. Розпакуй в три змінні a, b, c і виведи їх суму.',
          starter: `# твій код
`,
          expected: '60',
          solution: `a, b, c = (10, 20, 30)
print(a + b + c)`,
        },
        {
          task: 'Прибери дублікати зі списку <code>[1, 2, 2, 3, 3, 3, 4, 4]</code>. Виведи відсортований список.',
          starter: `lst = [1, 2, 2, 3, 3, 3, 4, 4]
# твій код
`,
          expected: '[1, 2, 3, 4]',
          solution: `lst = [1, 2, 2, 3, 3, 3, 4, 4]
print(sorted(set(lst)))`,
        },
        {
          task: 'Знайди спільні елементи двох списків: <code>[1,2,3,4]</code> та <code>[3,4,5,6]</code>. Виведи відсортований список.',
          starter: `a = [1, 2, 3, 4]
b = [3, 4, 5, 6]
# твій код
`,
          expected: '[3, 4]',
          solution: `a = [1, 2, 3, 4]
b = [3, 4, 5, 6]
print(sorted(set(a) & set(b)))`,
        },
        {
          task: 'Знайди елементи, які є тільки в першому списку <code>[10, 20, 30, 40]</code>, але не в другому <code>[30, 40, 50]</code>.',
          starter: `a = [10, 20, 30, 40]
b = [30, 40, 50]
# твій код
`,
          expected: '[10, 20]',
          solution: `a = [10, 20, 30, 40]
b = [30, 40, 50]
print(sorted(set(a) - set(b)))`,
        },
        {
          task: 'Перевір, чи є елемент "Київ" у tuple <code>("Львів", "Київ", "Одеса")</code>.',
          starter: `t = ("Львів", "Київ", "Одеса")
# твій код
`,
          expected: 'True',
          solution: `t = ("Львів", "Київ", "Одеса")
print("Київ" in t)`,
        },
        {
          task: 'Скільки унікальних символів у рядку <code>"data analytics"</code> (включаючи пробіл)?',
          starter: `s = "data analytics"
# твій код
`,
          expected: '10',
          solution: `s = "data analytics"
print(len(set(s)))`,
        },
      ],
    },
  ],
};
