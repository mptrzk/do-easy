import functools

tasks = [
    'vsmth wm tabs',
    'vsmth wm splits',
    'vsmth graphs',
    'vsmth smart knobs',
    'vsmth ',
    'de ith graphical representation',
    'siubidubidubi',
    'preverse',
    'crocus jobdir',
    '8queens',
    'q-tic',
    'like-walking',
    'hashlife',
    'parse JSON',
    'test coverage macro',
    'circuit simulation',
    'ozaroscope',
]

reds = {}

def cmp(x, y):
  if (x, y) in reds:
    print('redundant comparison')
    return reds[(x, y)]
  #return 1 if len(x) > len(y) else -1
  while ans := input(f'Is "{x}" easier than "{y}"?\n'):
    if ans == 'y':
      reds[(x, y)] = 1
      return 1
    if ans == 'n':
      reds[(x, y)] = -1
      return -1

print(list(sorted(tasks, key=functools.cmp_to_key(cmp))))
