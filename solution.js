function drawNestedSetsTree(dataIn, mountPoint) {
  let virtualTree = {};
  let data = dataIn;

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
  }

  function callElemTree(element, callback) {
    callback(element);
    element.childrens.forEach(elem => callElemTree(elem, callback));
  }

  // преобразовываем виртуальный дом в Nested Set
  function virtualTreeToNested() {
    let start = -1;
    const plainTree = [];
    callElemTree(virtualTree, (itemVirtualTree) => {
      start += 2;
      const current = {
        title: itemVirtualTree.title,
        left: start,
        right: start + 1,
        id: itemVirtualTree.id,
      };
      plainTree.push(current);

      if (itemVirtualTree.parent.id) {
        let parent = itemVirtualTree.parent;
        do {
          plainTree.forEach((iterator) => {
            if (iterator.id === parent.id) {
              iterator.right += 2;
              current.left -= 1;
              current.right -= 1;
            }
          });
          if (parent.parent.title) parent = parent.parent;
          else parent = false;
        } while (parent);
      }
    });

    // убираем вспомогательное поле
    return plainTree.map((nestedElem) => {
      const copy = Object.assign({}, nestedElem);
      delete copy.id;
      return copy;
    });
  }

  // навешиваем обработчик
  function setListener() {
    // helpers
    function allowDrop(ev) {
      ev.preventDefault();
    }

    function drag(ev) {
      ev.dataTransfer.setData('text', ev.target.id);
    }

    function drop(ev) {
      ev.preventDefault();
      const dragId = ev.dataTransfer.getData('text');

      // делаем текущий элемент чайлдом того на которого сбросили
      let dragInTree;
      callElemTree(virtualTree, (item) => {
        if (item.id === dragId) dragInTree = item;
      });
      let dropInTree;
      callElemTree(virtualTree, (item) => {
        if (item.id === ev.target.id) dropInTree = item;
      });

      if (dragInTree && dropInTree) {
        // убираем у родителя себя из массива чилдронов
        dragInTree.parent.childrens = dragInTree.parent.childrens.filter(
          item => item.id !== dragInTree.id,
        );
        // добавляем себя в чайлды дроп элемента
        dropInTree.childrens.push(dragInTree);

        render();

      }
    }

    function changeBorder(ev) {
      const target = ev.target;
      if (target.style.color) target.style.color = '';
      else target.style.color = 'purple';
    }

    callElemTree(virtualTree, (element) => {
      const dom = element.domElement;

      dom.setAttribute('draggable', true);
      dom.addEventListener('dragstart', drag);
      dom.addEventListener('drop', drop);
      dom.addEventListener('dragover', allowDrop);
      dom.addEventListener('dragenter', changeBorder);
      dom.addEventListener('dragleave', changeBorder);
    });
  }

  function render() {
    // если перерендер - размонтируем все
    if (virtualTree.domElement) {
      // пересоздаем Nested Set
      console.log(virtualTree);
      data = virtualTreeToNested();
      console.log(data);
      mountPoint.removeChild(virtualTree.domElement);
      mountPoint.removeChild(virtualTree.childrenContainer);
      virtualTree = {};
    }

    // создаем виртуальный дом и монтируем
    parseNestedSet();
    setListener();
  }

  render();

  return { save: virtualTreeToNested };
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
