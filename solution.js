function drawNestedSetsTree(data, mountPoint) {
  let virtualTree = {};

  function parseNestedSet() {
    const { left: minLeft, right: maxRight } = data.reduce(
      ({ left: lastLeft, right: lastRight }, item) => {
        let left = lastLeft;
        let right = lastRight;
        if (item.left < left) left = item.left;
        if (item.right > right) right = item.right;
        return {
          left,
          right,
        };
      },
      {
        left: Infinity,
        right: 0,
      },
    );

    if (maxRight <= minLeft) throw new Error('Nested Set error');

    function getChildren(item, parent) {
      if (!item.title) {
        console.log(item);
        return false;
      }

      const id = `${item.left}_${item.right}`;
      const domElement = document.createElement('li');
      domElement.setAttribute('id', id);
      domElement.innerText = item.title;

      const childrenContainer = document.createElement('ul');

      if (parent) {
        parent.childrenContainer.appendChild(domElement);
      }

      const out = {
        title: item.title,
        domElement,
        childrenContainer,
        id,
        parent,
        childrens: [],
      };

      if (item.right - item.left > 1) {
        if (parent) {
          parent.childrenContainer.appendChild(childrenContainer);
        }

        for (let i = item.left + 1; i < item.right; i += 1) {
          const children = data.filter(elem => elem.left === i)[0];
          out.childrens.push(getChildren(children, out));
          i = children.right;
        }
      }

      return out;
    }

    const root = data.filter(elem => elem.left === minLeft)[0];

    virtualTree = getChildren(root, { childrenContainer: mountPoint });

    console.log(virtualTree);
  }

  function callElemTree(element, callback) {
    console.log(element);
    callback(element);
    element.childrens.forEach(elem => callElemTree(elem, callback));
  }

  parseNestedSet(data);

  let start = 0;
  const plainTree = [];
  callElemTree(virtualTree, (itemVirtualTree) => {
    start += 1;
    plainTree.push({
      title: itemVirtualTree.title,
      left: start,
      right: start + 1,
    });

    if (itemVirtualTree.parent.title) {
      let parent = itemVirtualTree.parent;
      do {
        plainTree.forEach((iterator) => {
          if (iterator.title === parent.title) {
            iterator.right = iterator.right > start + 1 ? iterator.right : start + 1;
          }
        });
        if (parent.parent.title) parent = parent.parent;
        else parent = false;
      } while (parent);
    }
  });

  console.log(plainTree);
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

const tree = drawNestedSetsTree(data, document.getElementById('root'));
