const addToCart = {

  states: {
    parentElement: undefined,
  },

  addOneToCart: () => {
    const articleInCart = addToCart.getArticleInCart();

    if (articleInCart) {
      const indexOfArticle = cartModal.states.cart.indexOf(articleInCart);
      cartModal.states.cart.splice(indexOfArticle, 1, {
        ...articleInCart,
        quantity: addToCart.getQuantity() + 1,
      });
    }
    else {
      let article = addToCart.fetchArticle();
      article['quantity'] = 1;
      cartModal.states.cart.push(article);
    }
    addToCart.updateElement();
    cartModal.updateElement();
  },

  removeOneToCart: () => {
    const articleInCart = addToCart.getArticleInCart();
    const quantity = addToCart.getQuantity();

    if (articleInCart) {
      const indexOfArticle = cartModal.states.cart.indexOf(articleInCart);

      if (quantity > 1) {
        cartModal.states.cart.splice(indexOfArticle, 1, {
          ...articleInCart,
          quantity: quantity - 1,
        });
      }
      else {
        cartModal.states.cart.splice(indexOfArticle, 1);
      }
    }
    addToCart.updateElement();
    cartModal.updateElement();
  },

  updateElement: () => {
    const quantity = addToCart.getQuantity();

    // Update Value
    const valueElement = document.querySelector('.main__right__product__actions__quantity__value');
    valueElement.textContent = quantity;
    
    // Update Decrease Button
    const actionsQuantityDecreaseButtonElement = document.querySelector('.main__right__product__actions__quantity__button');
    if (quantity > 0 && actionsQuantityDecreaseButtonElement.classList.contains('main__right__product__actions__quantity__button--blocked')) {
      actionsQuantityDecreaseButtonElement.classList.remove('main__right__product__actions__quantity__button--blocked');
      actionsQuantityDecreaseButtonElement.addEventListener('click', addToCart.removeOneToCart);
    }
    else if (quantity === 0 && !actionsQuantityDecreaseButtonElement.classList.contains('main__right__product__actions__quantity__button--blocked')) {
      actionsQuantityDecreaseButtonElement.classList.add('main__right__product__actions__quantity__button--blocked');
      actionsQuantityDecreaseButtonElement.removeEventListener('click', addToCart.removeOneToCart);
    }
  },

  fetchArticle: () => {
    const articleId = app.states.currentArticleId;

    return app.articles.find(item => item.id === articleId);
  },

  getArticleInCart: () => {
    const articleId = app.states.currentArticleId;
    return cartModal.states.cart.find(item => item.id === articleId);
  },

  getQuantity: () => {
    const articleInCart = addToCart.getArticleInCart();
  
    if (articleInCart) {
      return articleInCart.quantity;
    }
    else {
      return 0;
    }
  },

  createElement: () => {
    const { parentElement } = addToCart.states;
    const quantity = addToCart.getQuantity();

    const { functionCreateElement } = app;

    const actionsElement = parentElement.querySelector('.main__right__product__actions');
    const actionsAddToCartButtonElement = actionsElement.querySelector('.main__right__product__actions__addToCartButton');

    const actionsQuantityElement = functionCreateElement('div', ['main__right__product__actions__quantity']);

    const actionsQuantityDecreaseButtonElement = functionCreateElement('button', ['main__right__product__actions__quantity__button'], {
      id: 'decreaseButton',
      type: 'button',
    });
    if (quantity > 0) {
      actionsQuantityDecreaseButtonElement.addEventListener('click', addToCart.removeOneToCart);
    }
    else {
      actionsQuantityDecreaseButtonElement.classList.add('main__right__product__actions__quantity__button--blocked');
    }

    const actionsQuantityDecreaseButtonIconElement = functionCreateElement('img', ['main__right__product__actions__quantity__button__icon'], {
      src: './img/icon-minus.svg',
      alt: 'Decrease-quantity-icon',
    });

    const actionsQuantityValueElement = functionCreateElement('span', ['main__right__product__actions__quantity__value'], {
      textContent: quantity,
    });

    const actionsQuantityIncreaseButtonElement = functionCreateElement('button', ['main__right__product__actions__quantity__button'], {
      id: 'increaseButton',
      type: 'button',
    });
    actionsQuantityIncreaseButtonElement.addEventListener('click', addToCart.addOneToCart);

    const actionsQuantityIncreaseButtonIconElement = functionCreateElement('img', ['main__right__product__actions__quantity__button__icon'], {
      src: './img/icon-plus.svg',
      alt: 'Increase-quantity-icon',
    });

    actionsQuantityDecreaseButtonElement.appendChild(actionsQuantityDecreaseButtonIconElement);
    actionsQuantityElement.appendChild(actionsQuantityDecreaseButtonElement);
    actionsQuantityElement.appendChild(actionsQuantityValueElement);
    actionsQuantityIncreaseButtonElement.appendChild(actionsQuantityIncreaseButtonIconElement);
    actionsQuantityElement.appendChild(actionsQuantityIncreaseButtonElement);
    actionsElement.appendChild(actionsQuantityElement);
    actionsElement.appendChild(actionsAddToCartButtonElement);
    parentElement.appendChild(actionsElement);
  },

  init: () => {
    // Define element in state
    addToCart.states.parentElement = document.querySelector('.main__right__product');

    // Create Elements
    addToCart.createElement();
  }
}
