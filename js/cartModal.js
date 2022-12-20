const cartModal = {

  states: {
    element: undefined,
    isOpen: false,
    cart: [],

    onOffButtonElement: undefined,
    buttonIsOn: false,
  },

  /**
   * @param {boolean} value 
   */
  setIsOpen: (value) => {
    cartModal.states.isOpen = value;
    cartModal.updateElement();
  },

  removeArticleInCart: (id) => {
    const { cart } = cartModal.states;

    const index = cart.findIndex(article => article.id === id);
    cart.splice(index, 1);
    cartModal.updateElement();
    addToCart.updateElement();
  },

  createProductInCartModal: (
    id,
    thumbnail,
    title,
    price,
    priceDiscound,
    quantity,
  ) => {
    const cartListElement = document.querySelector('.cartModal__content__main__list');

    const product = app.functionCreateElement('div', ['cartModal__content__main__list__product'], {
      'data-article-id': id,
    });

    const productThumbnail = app.functionCreateElement('img', ['cartModal__content__main__list__product__thumbnail'], {
      src: thumbnail,
      alt: title,
    });

    const productDescription = app.functionCreateElement('div', ['cartModal__content__main__list__product__description']);

    const productDelete = app.functionCreateElement('img', ['cartModal__content__main__list__product__delete'], {
      src: './img/icon-delete.svg',
      alt: 'delete-icon',
    });
    productDelete.addEventListener('click', () => {
      cartModal.removeArticleInCart(id);
    });

    const productDescriptionName = app.functionCreateElement('span', ['cartModal__content__main__list__product__description__name'], {
      textContent: title,
    });

    const productDescriptionPrice = app.functionCreateElement('div', ['cartModal__content__main__list__product__description__price']);

    const productDescriptionPriceUnit = app.functionCreateElement('span', ['cartModal__content__main__list__product__description__price__unit'], {
      textContent: `$${priceDiscound ? priceDiscound.toFixed(2) : price.toFixed(2)}`,
    });

    const productDescriptionPriceQuantity = app.functionCreateElement('span', ['cartModal__content__main__list__product__description__price__quantity'], {
      textContent: `x ${quantity}`,
    });

    const productDescriptionPriceTotal = app.functionCreateElement('span', ['cartModal__content__main__list__product__description__price__total'], {
      textContent: `$${((priceDiscound ? priceDiscound : price) * quantity).toFixed(2)}`,
    });

    productDescriptionPrice.appendChild(productDescriptionPriceUnit);
    productDescriptionPrice.appendChild(productDescriptionPriceQuantity);
    productDescriptionPrice.appendChild(productDescriptionPriceTotal);
    productDescription.appendChild(productDescriptionName);
    productDescription.appendChild(productDescriptionPrice);
    product.appendChild(productThumbnail);
    product.appendChild(productDescription);
    product.appendChild(productDelete);
    cartListElement.appendChild(product);
  },

  updateElement: () => {
    const { element, isOpen, cart } = cartModal.states;

    // Je trie le cart par id
    cart.sort((a, b) => {
      return a.id - b.id;
    });

    if (isOpen) {
      element.classList.add('cartModal--isOpen');
    }
    else {
      element.classList.remove('cartModal--isOpen');
    }

    // Affichage si cart.lenght === 0 ou non
    const cartContentElement = document.querySelector('.cartModal__content__main');
    if (cart.length === 0 && cartContentElement.classList.contains('cartModal__content__main--notEmpty')) {
      cartContentElement.classList.remove('cartModal__content__main--notEmpty');
    }
    else if (cart.length > 0 && !cartContentElement.classList.contains('cartModal__content__main--notEmpty')) {
      cartContentElement.classList.add('cartModal__content__main--notEmpty');
    }

    // Je crée les produits présent dans le cart
    const cartListElement = document.querySelector('.cartModal__content__main__list');
    cartListElement.innerHTML = '';
    cart.forEach((article) => {
      cartModal.createProductInCartModal(
        article.id,
        article.thumbnails[0],
        article.title,
        article.price,
        article.priceDiscound,
        article.quantity,
      );
    });

    // je met la quantité en attribut
    const cartButtonElement = document.querySelector('.header__content__right__action--cart .header__content__right__action__button');
    let totalQuantity = 0;
    cart.forEach(article => {
      totalQuantity += article.quantity;
    });

    if (totalQuantity > 0) {
      cartButtonElement.setAttribute('quantity', totalQuantity);
    }
    else {
      cartButtonElement.removeAttribute('quantity');
    }
  },

  setEventListener: () => {
    const cartElement = document.querySelector('.header__content__right__action--cart .header__content__right__action__button');

    const cartModalElement = document.querySelector('.cartModal');

    const cartModalCloseButtonElement = document.querySelector('.cartModal__content__header__closeButton');

    cartElement.addEventListener('click', () => {
      cartModal.setIsOpen(!cartModal.states.isOpen);
    });

    cartModalCloseButtonElement.addEventListener('click', () => {
      cartModal.setIsOpen(false);
      cartModalElement.style.display = 'none';
      setTimeout(() => {
        cartModalElement.removeAttribute('style');
      }, 200);
    });
  },

  init: () => {
    // Define element in state
    cartModal.states.element = document.querySelector('.cartModal');

    // Set Event Listener
    cartModal.setEventListener();

    // Update Element
    cartModal.updateElement();
  }
}
