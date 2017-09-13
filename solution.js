'use strict';

// if (typeof window === 'undefined') var window = global.window;

function drawNestedSetsTree(data, mountPoint) {
  let virtualTree = {};

  function parseNestedSet() {
    const { minLeft, maxRight } = data.reduce(
      ({ minLeft, maxRight }, item) => {
        if (item.left < minLeft) minLeft = item.left;
        if (item.right > maxRight) maxRight = item.right;
        return { minLeft, maxRight };
      },
      { minLeft: Infinity, maxRight: 0 },
    );

    console.log(minLeft, maxRight);

    if (maxRight <= minLeft) throw new Error('Nested Set error');

    function getChildren(item, parent) {
      const out = {
        title: item.title,
        id: `${item.left}_${item.right}`,
        children: [],
      };
      for (let i = item.left + 1; i < item.right; i++) {
        const children = data.filter(iterator => iterator.left === i)[0];
        out.children.push(getChildren(children));
        i = children.right;
      }

      return out;
    }

    const root = data.filter(iterator => iterator.left === minLeft)[0];

    virtualTree = getChildren(root);

    console.log(virtualTree);
  }

  parseNestedSet(data);
}

const data = [
  {
    title: 'Одежда',
    left: 1,
    right: 22,
  },
  {
    title: 'Мужская',
    left: 2,
    right: 9,
  },
  {
    title: 'Женская',
    left: 10,
    right: 21,
  },
  {
    title: 'Костюмы',
    left: 3,
    right: 8,
  },
  {
    title: 'Платья',
    left: 11,
    right: 16,
  },
  {
    title: 'Юбки',
    left: 17,
    right: 18,
  },
  {
    title: 'Блузы',
    left: 19,
    right: 20,
  },
  {
    title: 'Брюки',
    left: 4,
    right: 5,
  },
  {
    title: 'Жакеты',
    left: 6,
    right: 7,
  },
  {
    title: 'Вечерние',
    left: 12,
    right: 13,
  },
  {
    title: 'Летние',
    left: 14,
    right: 15,
  },
];

const tree = drawNestedSetsTree(data, window.document.getElementById('root'));
