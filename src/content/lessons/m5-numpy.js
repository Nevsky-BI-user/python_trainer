export default {
  id: 'm5',
  title: 'NumPy',
  lessons: [
    {
      id: 'l5-1',
      title: 'NumPy масиви',
      theory: `<p>NumPy: фундаментальна бібліотека для роботи з числовими масивами. Швидша за списки в 10-100 разів.</p>
<p>Створення: <code>np.array([1,2,3])</code>, <code>np.zeros(5)</code>, <code>np.ones((3,3))</code>, <code>np.arange(10)</code>, <code>np.linspace(0, 1, 5)</code>.</p>
<p>Векторизовані операції: <code>arr * 2</code>, <code>arr + arr2</code> працюють поелементно.</p>
<p>Тут Python працює в браузері (WebAssembly, 32 біти), тому цілочисельні масиви за замовчуванням мають тип <code>int32</code>. На звичайному 64-бітному комп'ютері той самий код покаже <code>int64</code>.</p>`,
      examples: [
        {
          code: `import numpy as np

arr = np.array([1, 2, 3, 4, 5])
print(arr)
print(arr.shape)
print(arr.dtype)

print(arr * 2)
print(arr ** 2)
print(arr + 100)`,
          output: `[1 2 3 4 5]
(5,)
int32
[ 2  4  6  8 10]
[ 1  4  9 16 25]
[101 102 103 104 105]`,
        },
        {
          code: `import numpy as np

zeros = np.zeros(5)
ones = np.ones((2, 3))
range_arr = np.arange(0, 10, 2)
linspace = np.linspace(0, 1, 5)

print(zeros)
print(ones)
print(range_arr)
print(linspace)`,
          output: `[0. 0. 0. 0. 0.]
[[1. 1. 1.]
 [1. 1. 1.]]
[0 2 4 6 8]
[0.   0.25 0.5  0.75 1.  ]`,
        },
        {
          code: `import numpy as np

arr = np.array([10, 25, 8, 47, 13, 35, 19])
print("sum:", arr.sum())
print("mean:", arr.mean())
print("max:", arr.max())
print("min:", arr.min())
print("std:", round(arr.std(), 2))
print("median:", np.median(arr))`,
          output: `sum: 157
mean: 22.428571428571427
max: 47
min: 8
std: 13.26
median: 19.0`,
        },
        {
          code: `import numpy as np

arr = np.array([10, 25, 8, 47, 13, 35, 19])
mask = arr > 20
print(mask)
print(arr[mask])
print(arr[(arr > 10) & (arr < 30)])`,
          output: `[False  True False  True False  True False]
[25 47 35]
[25 13 19]`,
        },
      ],
      exercises: [
        {
          task: 'Створи numpy-масив з чисел 1..10 (через arange). Виведи його.',
          starter: `import numpy as np
# твій код
`,
          expected: '[ 1  2  3  4  5  6  7  8  9 10]',
          solution: `import numpy as np
print(np.arange(1, 11))`,
        },
        {
          task: 'Дано <code>np.array([1, 2, 3, 4, 5])</code>. Помнож на 3 і додай 10. Виведи результат.',
          starter: `import numpy as np
arr = np.array([1, 2, 3, 4, 5])
# твій код
`,
          expected: '[13 16 19 22 25]',
          solution: `import numpy as np
arr = np.array([1, 2, 3, 4, 5])
print(arr * 3 + 10)`,
        },
        {
          task: 'З масиву <code>[15, 8, 23, 4, 17, 30, 11]</code> виведи середнє та максимум через пробіл.',
          starter: `import numpy as np
arr = np.array([15, 8, 23, 4, 17, 30, 11])
# твій код
`,
          expected: '15.428571428571429 30',
          solution: `import numpy as np
arr = np.array([15, 8, 23, 4, 17, 30, 11])
print(arr.mean(), arr.max())`,
        },
        {
          task: 'З <code>[5, 12, 8, 21, 3, 17, 9, 25]</code> виведи тільки елементи > 10.',
          starter: `import numpy as np
arr = np.array([5, 12, 8, 21, 3, 17, 9, 25])
# твій код
`,
          expected: '[12 21 17 25]',
          solution: `import numpy as np
arr = np.array([5, 12, 8, 21, 3, 17, 9, 25])
print(arr[arr > 10])`,
        },
        {
          task: 'Дано <code>np.array([2, 4, 6, 8, 10])</code>. Знайди суму квадратів цих чисел.',
          starter: `import numpy as np
arr = np.array([2, 4, 6, 8, 10])
# твій код
`,
          expected: '220',
          solution: `import numpy as np
arr = np.array([2, 4, 6, 8, 10])
print((arr ** 2).sum())`,
        },
        {
          task: 'Створи масив зі 100 рівномірно розподілених чисел від 0 до 10. Виведи третій елемент (індекс 2).',
          starter: `import numpy as np
# твій код
`,
          expected: '0.20202020202020202',
          solution: `import numpy as np
print(np.linspace(0, 10, 100)[2])`,
        },
        {
          task: 'З масиву <code>[10, 20, 30, 40, 50]</code> заміни всі значення > 25 на 0. Виведи результат.',
          starter: `import numpy as np
arr = np.array([10, 20, 30, 40, 50])
# твій код
`,
          expected: '[10 20  0  0  0]',
          solution: `import numpy as np
arr = np.array([10, 20, 30, 40, 50])
arr[arr > 25] = 0
print(arr)`,
        },
      ],
    },
  ],
};
