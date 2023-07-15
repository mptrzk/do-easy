
tasks = [
    'vsmth wm tabs',
    'vsmth wm splits',
    'vsmth graphs',
    'vsmth context',
    'vsmth effect hook',
    'siubidubidubi',
    'skleene',
    'q-tic writeup',
    'crocus writeup',
    '8queens',
    'like-walking',
    'hashlife',
    'parsing JSON',
    'test coverage macro',
    'circuit simulation',
    'ozaroscope',
]

def qs(arr, cmp=lambda x, y : x - y, low=0, high=None):
  if high == None:
    high = len(arr) - 1
  if low < high:
    for arr, pivot_idx in partition(arr, cmp, low, high): #is this ugly because of sneaky "arr" binding?
      if pivot_idx == None:
        yield arr
    yield from qs(arr, cmp, low, pivot_idx)
    yield from qs(arr, cmp, pivot_idx + 1, high)


def partition(arr, cmp, low, high):
  pivot = arr[low]
  i = low - 1
  j = high + 1
  while True:
    i += 1
    while cmp(arr[i], pivot) < 0:
      i += 1
    j -= 1
    while cmp(arr[j], pivot) > 0:
      j -= 1
    if i >= j:
      break
    arr[i], arr[j] = arr[j], arr[i]
    yield arr, None
  yield arr, j

cache = {}

def ask(x, y):
  if x == y:
    return 0
  if (x, y) in cache:
    return cache[(x, y)]
  while (ans := input(f'is "{x}" easier than "{y}"? (y/n) ')):
    if ans == 'y':
      cache[(x, y)] = -1
      return -1
    if ans == 'n':
      cache[(x, y)] = 1
      return -1
    print('invalid answer')


x = [9, 2, 5, 3, 6]
for t in qs(tasks, ask):
  print(x)
