import * as Vsmth from './vsmth.js'


const model = {
  todos: [],
  qsgen: null,
  q: null,
  ans: null,
}

function viewTodo(draw, x, i) {
  const remove = () => {model.todos.splice(i, 1); draw();};
  return ['li',
    ['span',
      x,
      ['span', {onclick: remove}, ' \u2a2f'],
    ]
  ];
}

function viewInputBar(draw) {
  const inRef = {current: null};
  const push = () => {
    const val = inRef.current.value;
    if (val === '') return;
    model.todos.push(val);
    if (model.todos.length > 1) {
      model.qsgen = qs();
      model.qsgen.next();
    }
    inRef.current.value = '';
    draw();
  };
  return ['div',
    ['input', {ref: inRef, onkeypress: e => e.key == 'Enter' ? push() : ''}],
    ['button', {onclick: push}, 'foo'],
  ];
}


function* qs(lo=0, hi, isTop=true) {
  const a = model.todos;
  hi ??= a.length - 1;
  if (lo < hi) {
    let pi;
    for (const res of partition(lo, hi)) {
      if (res === null) yield null;
      else pi = res;
    }
    yield* qs(lo, pi, false);
    yield* qs(pi + 1, hi, false);
  }
  if (isTop) {
    model.q = null;
  }
}

function ask(idx, pivot) {
  const a = model.todos
  if (a[idx] !== pivot) {
    model.q = ` Is "${a[idx]}" easier than "${pivot}"? `;
    return true;
  } else {
    model.ans = 0;
    return false
  }
}

function* partition(lo, hi) {
  const a = model.todos;
  const pivot = a[hi];
  let i = lo - 1;
  let j = hi + 1;
  const test = idx => {
  }
  while (true) {
    console.log(i, j);
    do {
      i++;
      if (ask(i, pivot)) yield null;
    } while (model.ans < 0);
    do {
      j--;
      if (ask(j, pivot)) yield null;
    } while (model.ans > 0);
    if (i >= j) {
      break;
    }
    [a[i], a[j]] = [a[j], a[i]];
  }
  yield j;
}

function viewSortUI(draw) {
  if (!model.q) {
    return 'everything sorted';
  }
  const a = model.todos;
  const ans = x => {
    model.ans = x;
    model.qsgen?.next();
    draw();
  }
  return ['div',
    ['button', {onclick: () => ans(1)}, 'N <-'],
    model.q,
    ['button', {onclick: () => ans(-1)}, '-> Y'],
  ];
}

function view(draw) {
  return ['div',
    viewInputBar(draw),
    viewSortUI(draw),
    ['ul',
      ...model.todos.map((x, i) => viewTodo(draw, x, i))
    ]
  ];
}

Vsmth.init(view, document.body);

