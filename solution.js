'use strict';
if (typeof window == 'undefined') var window = global.window;

function drawNestedSetsTree(data, node) {
  let tree = {};

  function parseTree(data) {
    const {
      minLeft,
      maxRight,
    } = data.reduce(({ minLeft = Infinity, maxRight = 0 }, item) => {
      if (item.left < minLeft) minLeft = item.left;
      if (item.right > maxRight) maxRight = item.right;
      return { minLeft, maxRight };
    });

    console.log(minLeft, maxRight);
  }

  tree = parseTree(data);
}

var data = [
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
