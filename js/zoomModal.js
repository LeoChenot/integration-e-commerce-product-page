const zoomModal = {

  states: {
    element: undefined,
    isOpen: false,
  },

  /**
   * @param {boolean} value 
   */
  setIsOpen: (value) => {
    zoomModal.states.isOpen = value;
    zoomModal.updateElement();
  },

  updateElement: () => {
    const { element, isOpen } = zoomModal.states;

    if (isOpen) {
      element.classList.add('zoomModal--isOpen');
    }
    else {
      element.classList.remove('zoomModal--isOpen');
    }

    zoomModal.createImg();
    zoomModal.createThumbnailList();
  },

  createImg: () => {
    const { element } = zoomModal.states;
    const { currentArticleId, currentImgIndex } = app.states;

    const { images } = app.articles.find(article => article.id === currentArticleId);

    const imgContainer = element.querySelector('.zoomModal__content__imgContainer');

    const foundImg = imgContainer.querySelector('.zoomModal__content__imgContainer__img');
  
    // Si l'élément <img> existe
    if (foundImg) {
      foundImg.src = images[currentImgIndex];
      foundImg.alt = `image-${currentImgIndex + 1}`;
    }
    // Sinon, je le créé et je l'ajoute à l'élément parent
    else {
      // Création de l'élément <img>
      const img = app.functionCreateElement('img', ['zoomModal__content__imgContainer__img'], {
        src: images[currentImgIndex],
        alt: `image-${currentImgIndex + 1}`,
      });

      // Ajout de l'élément <img> dans l'élément parent
      imgContainer.appendChild(img);
    }
  },

  createThumbnailList: () => {
    const listOfThumbnailsElement = document.querySelector('.zoomModal__content__list');

    const foundAllThumnailContainer = [...listOfThumbnailsElement.querySelectorAll('.zoomModal__content__list__thumbnailContainer')];


    const { currentArticleId, currentImgIndex: currentThumbnailIndex } = app.states;
    const { thumbnails } = app.articles.find(article => article.id === currentArticleId);

    // Si l'élément parent possède autant d'enfants que de thumbnails
    if (foundAllThumnailContainer.length === thumbnails.length) {
      foundAllThumnailContainer.forEach(thumbnail => {
        const index = foundAllThumnailContainer.indexOf(thumbnail);

        let thumbnailClone = undefined;

        // J'ajoute la classe --current à la currentThumbnail
        if (foundAllThumnailContainer.indexOf(thumbnail) === currentThumbnailIndex) {
          thumbnail.classList.add('zoomModal__content__list__thumbnailContainer--current');
          thumbnailClone = thumbnail.cloneNode(true);
        }
        // Et j'enlève la classe --current aux autres
        else {
          thumbnail.classList.remove('zoomModal__content__list__thumbnailContainer--current');
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
        const thumbnailContainer = app.functionCreateElement('div', ['zoomModal__content__list__thumbnailContainer']);
        const index = thumbnails.indexOf(thumbnail);
        
        const img = app.functionCreateElement('img', ['zoomModal__content__list__thumbnailContainer__thumbnail'], {
          src: thumbnail,
          alt: `thumbnail-${index + 1}`,
        });
        
        if (index === currentThumbnailIndex) {
          thumbnailContainer.classList.add('zoomModal__content__list__thumbnailContainer--current');
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

  selectPreviousImg: () => {
    const { currentArticleId, currentImgIndex } = app.states;

    
    if (currentImgIndex > 0) {
      app.setCurrentImgIndex(currentImgIndex - 1);
    }
    else {
      const { thumbnails } = app.articles.find(article => article.id === currentArticleId);
      app.setCurrentImgIndex(thumbnails.length - 1);
    }
  },

  selectNextImg: () => {
    const { currentArticleId, currentImgIndex } = app.states;

    const { thumbnails } = app.articles.find(article => article.id === currentArticleId);
    
    if (currentImgIndex < thumbnails.length - 1) {
      app.setCurrentImgIndex(currentImgIndex + 1);
    }
    else {
      app.setCurrentImgIndex(0);
    }
  },

  setEventListener: () => {
    const { element } = zoomModal.states;

    element.addEventListener('click', (event) => {
      const firstClassName = event.target.className.split(' ')[0];

      if (firstClassName === 'zoomModal') {
        zoomModal.setIsOpen(false);
      }
    });

    const closeButtonElement = element.querySelector('.zoomModal__content__closeButton');
    closeButtonElement.addEventListener('click', () => {
      zoomModal.setIsOpen(false);
    });

    const previousButtonElement = element.querySelector('.zoomModal__content__imgContainer__button--previousButton');
    previousButtonElement.addEventListener('click', () => {
      zoomModal.selectPreviousImg();
    });

    const nextButtonElement = element.querySelector('.zoomModal__content__imgContainer__button--nextButton');
    nextButtonElement.addEventListener('click', () => {
      zoomModal.selectNextImg();
    });

  },

  init: () => {
    // Define element in state
    zoomModal.states.element = document.querySelector('.zoomModal');

    // Set Event Listener
    zoomModal.setEventListener();
    
    // Update Element
    zoomModal.updateElement();
  }
}
