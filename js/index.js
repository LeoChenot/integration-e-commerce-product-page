const app = {

  articles: [
    {
      id: 1,
      images: [
        './img/image-product-1.jpg',
        './img/image-product-2.jpg',
        './img/image-product-3.jpg',
        './img/image-product-4.jpg',
      ],
      thumbnails: [
        './img/image-product-1-thumbnail.jpg',
        './img/image-product-2-thumbnail.jpg',
        './img/image-product-3-thumbnail.jpg',
        './img/image-product-4-thumbnail.jpg',
      ],
      collection: 'SNEAKER COMPANY',
      title: 'Fall Limited Edition Sneakers',
      description: 'These low-profile sneakers are your perfect casual wear companion. Featuring a durable rubber outer sole, they\'Il withstand everything the weather can offer.',
      price: 250.00,
      priceDiscound: 125.00,
    },
  ],


  states: {
    currentArticleId: 1,
    currentImgIndex: 0,
    menuIsOpen: false,
  },

  /**
   * 
   * @param {string} tag HTML tag
   * @param {[string]} classes HTML class
   * @param {{textContent: string, type: string, src: string, alt: string}} otherProperties other HTML properties
   * @returns {object} HTML element
   */
  functionCreateElement: (tag, classes, otherProperties) => {
    const newElement = document.createElement(tag);
    classes.forEach(classe => {
      newElement.classList.add(classe);
    });
    if (otherProperties) {
      for (const [key, value] of Object.entries(otherProperties)) {
        if (key === 'textContent') {
          newElement[key] = value;
        }
        else {
          newElement.setAttribute(key, value);
        }
      }
    }

    return newElement;
  },

  setCurrentImgIndex: (newIndex) => {
    app.states.currentImgIndex = newIndex;

    const currentArticle = app.articles.find(article => article.id === app.states.currentArticleId);
    
    app.createImg(currentArticle.images, app.states.currentImgIndex);
    app.createThumbnailList(currentArticle.thumbnails, app.states.currentImgIndex);

    zoomModal.createImg();
    zoomModal.createThumbnailList();
  },

  setMenuIsOpen: (value) => {
    app.states.menuIsOpen = value;

    app.updateElements();
  },  
  
  createImg: (images, currentImgIndex) => {
    // Sélection de l'élément parent
    const imgContainer = document.querySelector('.main__left__imgContainer');

    const foundImg = imgContainer.querySelector('.main__left__imgContainer__img');

    // Si l'élément <img> existe
    if (foundImg) {
      foundImg.src = images[currentImgIndex];
      foundImg.alt = `image-${currentImgIndex + 1}`;
    }
    // Sinon, je le créé et je l'ajoute à l'élément parent
    else {
      // Création de l'élément <img>
      const img = app.functionCreateElement('img', ['main__left__imgContainer__img'], {
        src: images[currentImgIndex],
        alt: `image-${currentImgIndex + 1}`,
      });
      img.addEventListener('click', () => {
        zoomModal.setIsOpen(true);
      });

      // Ajout de l'élément <img> dans l'élément parent
      imgContainer.appendChild(img);
    }
  },

  createThumbnailList: (thumbnails, currentThumbnailIndex) => {
    const listOfThumbnailsElement = document.querySelector('.main__left__list');

    const foundAllThumnailContainer = [...listOfThumbnailsElement.querySelectorAll('.main__left__list__thumbnailContainer')];

    // Si l'élément parent possède autant d'enfants que de thumbnails
    if (foundAllThumnailContainer.length === thumbnails.length) {
      foundAllThumnailContainer.forEach(thumbnail => {
        const index = foundAllThumnailContainer.indexOf(thumbnail);

        let thumbnailClone = undefined;

        // J'ajoute la classe --current à la currentThumbnail
        if (foundAllThumnailContainer.indexOf(thumbnail) === currentThumbnailIndex) {
          thumbnail.classList.add('main__left__list__thumbnailContainer--current');
          thumbnailClone = thumbnail.cloneNode(true);
          thumbnailClone.addEventListener('click', () => {
            zoomModal.setIsOpen(true);
          });
        }
        // Et j'enlève la classe --current aux autres
        else {
          thumbnail.classList.remove('main__left__list__thumbnailContainer--current');
          thumbnailClone = thumbnail.cloneNode(true);
          thumbnailClone.addEventListener('click', () => {
            app.setCurrentImgIndex(index);
          });
        }

        // J'enlève les event Listener
        
        thumbnail.parentNode.replaceChild(thumbnailClone, thumbnail);
      });
    }
    // Sinon, je les créé et je les ajoute au DOM
    else {
      thumbnails.forEach(thumbnail => {
        const thumbnailContainer = app.functionCreateElement('div', ['main__left__list__thumbnailContainer']);
        const index = thumbnails.indexOf(thumbnail);
        
        const img = app.functionCreateElement('img', ['main__left__list__thumbnailContainer__thumbnail'], {
          src: thumbnail,
          alt: `thumbnail-${index + 1}`,
        });
        
        if (index === currentThumbnailIndex) {
          thumbnailContainer.classList.add('main__left__list__thumbnailContainer--current');
          thumbnailContainer.addEventListener('click', () => {
            zoomModal.setIsOpen(true);
          });
        }
        else {
          img.addEventListener('click', () => {
            app.setCurrentImgIndex(index);
          });
        }
        
        thumbnailContainer.appendChild(img);
        listOfThumbnailsElement.appendChild(thumbnailContainer);
      });
    }
  },

  createArticleInformations: (
    collection,
    title,
    description,
    price,
    priceDiscound,
  ) => {
    const productContainer = document.querySelector('.main__right__product');

    const collectionElement = app.functionCreateElement('h3', ['main__right__product__collection'], {
      textContent: collection,
    });

    const titleElement = app.functionCreateElement('h2', ['main__right__product__title'], {
      textContent: title,
    });

    const descriptionElement = app.functionCreateElement('p', ['main__right__product__description'], {
      textContent: description,
    });

    const priceElement = app.functionCreateElement('div', ['main__right__product__price']);

    const priceCurrentElement = app.functionCreateElement('div', ['main__right__product__price__current']);

    const priceCurrentValueElement = app.functionCreateElement('span', ['main__right__product__price__current__value']);

    productContainer.appendChild(collectionElement);
    productContainer.appendChild(titleElement);
    productContainer.appendChild(descriptionElement);

    priceCurrentElement.appendChild(priceCurrentValueElement);
    priceElement.appendChild(priceCurrentElement);
    productContainer.appendChild(priceElement);
    
    if (priceDiscound) {
      const discountPercentage = Math.floor(((price - priceDiscound) / price) * 100);
      
      priceElement.classList.add('main__right__product__price--discount');
      priceCurrentValueElement.textContent = `$${priceDiscound.toFixed(2)}`;

      const priceCurrentDiscountElement = app.functionCreateElement('span', ['main__right__product__price__current__discount'], {
        textContent: `-${discountPercentage}%`,
      });

      const priceCurrentOldElement = app.functionCreateElement('span', ['main__right__product__price__old'], {
        textContent: `$${price.toFixed(2)}`,
      });

      priceCurrentElement.appendChild(priceCurrentDiscountElement);
      priceElement.appendChild(priceCurrentOldElement);
    }
    else {
      priceCurrentValueElement.textContent = `$${price.toFixed(2)}`;
    }
  },

  updateElements: () => {
    const { menuIsOpen } = app.states;

    const navElement = document.querySelector('.header__content__left__nav');

    if (menuIsOpen) {
      navElement.classList.add('header__content__left__nav--isOpen');
    }
    else {
      navElement.classList.remove('header__content__left__nav--isOpen');
    }
  },

  setEventsListener: () => {
    const previousButtonElement = document.querySelector('.main__left__imgContainer__button--previousButton');
    const nextButtonElement = document.querySelector('.main__left__imgContainer__button--nextButton');

    const openMenuButtonElement = document.querySelector('.header__content__left__openMenuButton');
    const closeMenuButtonElement = document.querySelector('.header__content__left__nav__content__closeMenuButton');

    const navElement = document.querySelector('.header__content__left__nav');

    previousButtonElement.addEventListener('click', () => {
      zoomModal.selectPreviousImg();
    });

    nextButtonElement.addEventListener('click', () => {
      zoomModal.selectNextImg();
    });

    openMenuButtonElement.addEventListener('click', () => {
      app.setMenuIsOpen(true);
    });

    closeMenuButtonElement.addEventListener('click', () => {
      app.setMenuIsOpen(false);
    });

    navElement.addEventListener('click', (event) => {
      const classList = event.target.classList;
      if (classList[1] && classList[1] === 'header__content__left__nav--isOpen') {
        navElement.classList.remove
        ('header__content__left__nav--isOpen');
      }
    });
  },

  init: () => {
    const currentArticle = app.articles.find(article => article.id === app.states.currentArticleId);
    
    app.createImg(currentArticle.images, app.states.currentImgIndex);
    app.createThumbnailList(currentArticle.thumbnails, app.states.currentImgIndex);
    app.createArticleInformations(
      currentArticle.collection,
      currentArticle.title,
      currentArticle.description,
      currentArticle.price,
      currentArticle.priceDiscound,
    );

    app.setEventsListener();
    app.updateElements();

    zoomModal.init();
    cartModal.init();
    addToCart.init();
  }
}

document.addEventListener('DOMContentLoaded', app.init);