import * as Vsmth from './vsmth.js'


const model = {
  todos: [],
  q: null,
  ansf: null,
  stopQs: null,
  draw: null, //ugly hack?
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
    model.stopQs?.();
    const pr = new Promise((r, f) => {
      qs().then(r);
      model.stopQs = f;
    });
    inRef.current.value = '';
  };
  return ['div',
    ['input', {ref: inRef, onkeypress: e => e.key == 'Enter' ? push() : ''}],
    ['button', {onclick: push}, 'foo'],
  ];
}



async function ask(a, b) {
  if (a !== b) {
    model.q = ` Is "${a}" easier than "${b}"? `;
    model.draw();
    return await new Promise((r, f) => model.ansf = r);
    //^ is this "await" necessary?
  } else {
    return 0;
  }
}

async function partition(lo, hi) {
  console.log(`partition(${lo}, ${hi})`);
  const a = model.todos;
  const pivot = a[lo];
  let i = lo - 1;
  let j = hi + 1;
  while (true) {
    do {
      i++;
    } while ((await ask(a[i], pivot)) < 0);
    do {
      j--;
    } while ((await ask(a[j], pivot)) > 0);
    if (i >= j) {
      return j;
    }
    [a[i], a[j]] = [a[j], a[i]];
  }
}

async function qs(lo=0, hi, isTop=true) {
  console.log(`qs(${lo}, ${hi}, ${isTop})`);
  const a = model.todos;
  hi ??= a.length - 1;
  if (lo < hi) {
    const pi = await partition(lo, hi);
    qs(lo, pi, false);
    qs(pi + 1, hi, false);
  }
  if (isTop) {
    model.q = null;
    model.draw();
  }
}


function viewSortUI(draw) {
  if (!model.q) {
    return 'everything sorted';
  }
  const a = model.todos;
  return ['div',
    ['button', {onclick: () => model.ansf(1)}, 'N <-'],
    model.q,
    ['button', {onclick: () => model.ansf(-1)}, '-> Y'],
  ];
}

function view(draw) {
  model.draw = draw; //ugly hack?
  return ['div',
    viewInputBar(draw),
    viewSortUI(draw),
    ['ul',
      ...model.todos.map((x, i) => viewTodo(draw, x, i))
    ]
  ];
}

Vsmth.init(view, document.body);

