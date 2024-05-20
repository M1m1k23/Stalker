"use strict"

document.addEventListener("click", documentActions);

function documentActions(e) {
    const targetElement = e.target;

    if (targetElement.closest('.icon-menu')) {
        document.documentElement.classList.toggle('menu-open');
    } else if (targetElement.closest('.menu__link')) {
        if (document.documentElement.classList.contains('menu-open')) {
        	document.documentElement.classList.remove('menu-open')
        }
        const link = targetElement.closest('.menu__link')
        const goto = link.dataset.goto
        const gotoElement = document.querySelector(goto)

        if (gotoElement) {
        	gotoElement.scrollIntoView({
        		behavior: "smooth"
        	})
        }
    }
    if (targetElement.closest('[data-spoller]')) {
        const currentElement = targetElement.closest('[data-spoller]');
        if (!currentElement.classList.contains('--sliding')) {
            currentElement.classList.toggle('active')
        }
        slideToggle(currentElement.nextElementSibling)
    }
    if (targetElement.closest('[data-tabs-button]')) {
        const currentElement = targetElement.closest('[data-tabs-button]');
        setTab(currentElement);
    }
    if (targetElement.classList.contains('menu-filter__link') && !targetElement.classList.contains('active')) {
      const activeElement = document.querySelector(`.menu-filter__link.active`);
      const elements = document.querySelectorAll(`.catalog__link`);
      const elementType = targetElement.dataset.categoryType;

      activeElement.classList.remove('active');
      targetElement.classList.add('active');

      elements.forEach(element  => {
          !elementType || element.dataset.categoryType === elementType ?
              element.hidden = false : element.hidden = true;
      });
    }
  
}
function updateBlockHeight() {
  const catalogBlock = document.querySelector('[data-showmore-content]');
  catalogBlock.style.height = 'auto';
}
const elementsWithClass = document.querySelectorAll('.menu-filter__link');

elementsWithClass.forEach(element => {
  element.addEventListener('click', updateBlockHeight);
});


//Spollers
const spollers = document.querySelectorAll('[data-spoller]')

if (spollers.length) {
    spollers.forEach(spoller => {
      spoller.dataset.spoller !== 'open' ? spoller.nextElementSibling.hidden = true : spoller.classList.add('active');
    });
    // Filter
    
    const filterTitle = document.querySelector('.filter__title')
    if (filterTitle) {
      const breakPointValue = filterTitle.dataset.spollerMedia;
      const breakPoint = breakPointValue ? `(${breakPointValue.split(',')[0]}-width:${breakPointValue.split(',')[1]}px)` : null
      if (breakPoint) {
        const matchMedia = window.matchMedia(breakPoint)
        matchMedia.addEventListener("change", (e) => {
          const isTrue = e.matches
          if (isTrue) {
            _slideUp(filterTitle.nextElementSibling)
            filterTitle.classList.remove('active')
          } else {
            _slideDown(filterTitle.nextElementSibling)
            filterTitle.classList.add('active')
          }
        })
      }
      

    }
}

let _slideDown = (target, duration = 500, showmore = 0) => {
  if (!target.classList.contains("_slide")) {
    target.classList.add("_slide");
    target.hidden = target.hidden ? false : null;
    // Отримуємо нову висоту, якщо showmore не дорівнює нулю
    let height = showmore ? target.scrollHeight : target.offsetHeight;
    target.style.overflow = "hidden";
    target.style.height = showmore ? `${showmore}px` : `0px`;
    target.style.paddingTop = 0;
    target.style.paddingBottom = 0;
    target.style.marginTop = 0;
    target.style.marginBottom = 0;
    target.offsetHeight;
    target.style.transitionProperty = "height, margin, padding";
    target.style.transitionDuration = duration + "ms";
    target.style.height = height + "px"; // Встановлюємо нову висоту
    target.style.removeProperty("padding-top");
    target.style.removeProperty("padding-bottom");
    target.style.removeProperty("margin-top");
    target.style.removeProperty("margin-bottom");
    window.setTimeout((() => {
        target.style.removeProperty("height");
        target.style.removeProperty("overflow");
        target.style.removeProperty("transition-duration");
        target.style.removeProperty("transition-property");
        target.classList.remove("_slide");
        document.dispatchEvent(new CustomEvent("slideDownDone", {
            detail: {
                target
            }
        }));
    }), duration);
  }
}

let _slideUp = (target, duration = 500, showmore = 0) => {
  if (!target.classList.contains("_slide")) {
    target.classList.add("_slide");
    target.style.transitionProperty = "height, margin, padding";
    target.style.transitionDuration = duration + "ms";
    target.style.height = `${target.offsetHeight}px`;
    target.offsetHeight;
    target.style.overflow = "hidden";
    target.style.height = showmore ? `${showmore}px` : `0px`;
    target.style.paddingTop = 0;
    target.style.paddingBottom = 0;
    target.style.marginTop = 0;
    target.style.marginBottom = 0;
    window.setTimeout((() => {
        target.hidden = !showmore ? true : false;
        !showmore ? target.style.removeProperty("height") : null;
        target.style.removeProperty("padding-top");
        target.style.removeProperty("padding-bottom");
        target.style.removeProperty("margin-top");
        target.style.removeProperty("margin-bottom");
        !showmore ? target.style.removeProperty("overflow") : null;
        target.style.removeProperty("transition-duration");
        target.style.removeProperty("transition-property");
        target.classList.remove("_slide");
        document.dispatchEvent(new CustomEvent("slideUpDone", {
            detail: {
                target
            }
        }));
    }), duration);
  }
  
}
let slideToggle = (target, duration = 500) => {
    target.hidden ? _slideDown(target, duration) : _slideUp(target, duration)
}

// Swiper
const heroSlider = document.querySelector('.hero');
if(heroSlider) {
    new Swiper('.hero', {
        // Optional parameters
        loop: true,
        autoHeight: true,
        speed: 800,
      
        // If we need pagination
        pagination: {
          el: '.hero__pagination',
          clickable: true,
        },
      
        // Navigation arrows
        navigation: {
          nextEl: '.hero__arrwo--next',
          prevEl: '.hero__arrwo--prev',
        },
    });
}

const newSlider = document.querySelector('.new__slider');
if(newSlider) {
    new Swiper('.new__slider', {
        // Optional parameters
        loop: true,
        autoHeight: true,
        speed: 800,
        spaceBetween: 35,
        slidesPerView: 4,
        // Navigation arrows
        navigation: {
          nextEl: '.new__arrow--right',
          prevEl: '.new__arrow--left',
        },
        breakpoints: {
            // when window width is >= 320px
            320: {
              slidesPerView: 1.4,
              spaceBetween: 15
            },
            480: {
              slidesPerView: 1.7,
              spaceBetween: 25
            },
            500: {
              slidesPerView: 2,
              spaceBetween: 25
            },
            // when window width is >= 480px
            650: {
              slidesPerView: 2,
              spaceBetween: 30
            },
            // when window width is >= 640px
            991: {
              slidesPerView: 4,
              spaceBetween: 35
            }
          }
    });
}

const mainProduct = document.querySelector('.main-product');
if (mainProduct) {
  const mainProductSliderImages = document.querySelectorAll('.main-product__slider img')
  let mainProductThumbSlider;

  const mainProductSlider = new Swiper('.main-product__slider', {
      // Optional parameters
      loop: true,
      // direction: "vertical",
      speed: 800,
      spaceBetween: 0,
      slidesPerView: 1,
      // Navigation arrows
      navigation: {
        nextEl: '.main-product__arrwo--next',
        prevEl: '.main-product__arrwo--prev',
      },
      // If we need pagination
      pagination: {
        el: '.main-product__pagination',
        clickable: true,
      },
    });    
}

// ---------------------
// Filter
// ---------------------

// Price
const filterRange = document.querySelector('.price-filter__range')
if (filterRange) {
  const filterRangeFrom = document.querySelector('.price-filter__input--from')
  const filterRangeTo = document.querySelector('.price-filter__input--to')
  noUiSlider.create(filterRange, {
      start: [0, 1000],
      connect: true,
      range: {
          'min': 0,
          'max': 15000
      },
      format: wNumb({
        decimals: 0,
        suffix: '₴'
    })
  });
  filterRange.noUiSlider.on('update', function (values, handle) {
    filterRangeFrom.value = `${values[0]}`;
    filterRangeTo.value = `${values[1]}`
  });
  filterRangeFrom.addEventListener('change', function () {
    filterRange.noUiSlider.setHandle(0, filterRangeFrom.value);
  });
  filterRangeTo.addEventListener('change', function () {
    filterRange.noUiSlider.setHandle(1, filterRangeTo);
  });
}

// Tabs

function setTab(tabElement) {
  const tabsParent = tabElement.closest('[data-tabs]');

  const tabsButtons = Array.from(tabsParent.querySelectorAll('[data-tabs-button]'));
  const tabsActiveButton = tabsParent.querySelector('[data-tabs-button].active')
  tabsActiveButton.classList.remove('active');
  tabElement.classList.add('active')
  const currentButtonIndex = tabsButtons.indexOf(tabElement);
  
  const tabsElements = tabsParent.querySelectorAll('[data-tabs-element]');

  tabsElements.forEach(tabsElement => {
      tabsElement.hidden = true;
  });

  tabsElements[currentButtonIndex].hidden = false;
}

function showMore() {
  window.addEventListener("load", (function(e) {
      const showMoreBlocks = document.querySelectorAll("[data-showmore]");
      let showMoreBlocksRegular;
      let mdQueriesArray;
      if (showMoreBlocks.length) {
          showMoreBlocksRegular = Array.from(showMoreBlocks).filter((function(item, index, self) {
              return !item.dataset.showmoreMedia;
          }));
          showMoreBlocksRegular.length ? initItems(showMoreBlocksRegular) : null;
          document.addEventListener("click", showMoreActions);
          window.addEventListener("resize", showMoreActions);
          mdQueriesArray = dataMediaQueries(showMoreBlocks, "showmoreMedia");
          if (mdQueriesArray && mdQueriesArray.length) {
              mdQueriesArray.forEach((mdQueriesItem => {
                  mdQueriesItem.matchMedia.addEventListener("change", (function() {
                      initItems(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
                  }));
              }));
              initItemsMedia(mdQueriesArray);
          }
      }
      
      function initItemsMedia(mdQueriesArray) {
          mdQueriesArray.forEach((mdQueriesItem => {
              initItems(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
          }));
      }
      function initItems(showMoreBlocks, matchMedia) {
          showMoreBlocks.forEach((showMoreBlock => {
              initItem(showMoreBlock, matchMedia);
          }));
      }
      function initItem(showMoreBlock, matchMedia = false) {
          showMoreBlock = matchMedia ? showMoreBlock.item : showMoreBlock;
          let showMoreContent = showMoreBlock.querySelectorAll("[data-showmore-content]");
          let showMoreButton = showMoreBlock.querySelectorAll("[data-showmore-button]");
          showMoreContent = Array.from(showMoreContent).filter((item => item.closest("[data-showmore]") === showMoreBlock))[0];
          showMoreButton = Array.from(showMoreButton).filter((item => item.closest("[data-showmore]") === showMoreBlock))[0];
          const hiddenHeight = getHeight(showMoreBlock, showMoreContent);
          if (matchMedia.matches || !matchMedia) if (hiddenHeight < getOriginalHeight(showMoreContent)) {
              _slideUp(showMoreContent, 0, showMoreBlock.classList.contains("_showmore-active") ? getOriginalHeight(showMoreContent) : hiddenHeight);
              showMoreButton.hidden = false;
          } else {
              _slideDown(showMoreContent, 0, hiddenHeight);
              showMoreButton.hidden = true;
          } else {
              _slideDown(showMoreContent, 0, hiddenHeight);
              showMoreButton.hidden = true;
          }
      }
      function getHeight(showMoreBlock, showMoreContent) {
          let hiddenHeight = 0;
          const showMoreType = showMoreBlock.dataset.showmore ? showMoreBlock.dataset.showmore : "size";
          const rowGap = parseFloat(getComputedStyle(showMoreContent).rowGap) ? parseFloat(getComputedStyle(showMoreContent).rowGap) : 0;
          if (showMoreType === "items") {
              const showMoreTypeValue = showMoreContent.dataset.showmoreContent ? showMoreContent.dataset.showmoreContent : 3;
              const showMoreItems = showMoreContent.children;
              for (let index = 1; index < showMoreItems.length; index++) {
                  const showMoreItem = showMoreItems[index - 1];
                  const marginTop = parseFloat(getComputedStyle(showMoreItem).marginTop) ? parseFloat(getComputedStyle(showMoreItem).marginTop) : 0;
                  const marginBottom = parseFloat(getComputedStyle(showMoreItem).marginBottom) ? parseFloat(getComputedStyle(showMoreItem).marginBottom) : 0;
                  hiddenHeight += showMoreItem.offsetHeight + marginTop;
                  if (index == showMoreTypeValue) break;
                  hiddenHeight += marginBottom;
              }
              rowGap ? hiddenHeight += (showMoreTypeValue - 1) * rowGap : null;
          } else {
              const showMoreTypeValue = showMoreContent.dataset.showmoreContent ? showMoreContent.dataset.showmoreContent : 150;
              hiddenHeight = showMoreTypeValue;
          }
          return hiddenHeight;
      }
      function getOriginalHeight(showMoreContent) {
          let parentHidden;
          let hiddenHeight = showMoreContent.offsetHeight;
          showMoreContent.style.removeProperty("height");
          if (showMoreContent.closest(`[hidden]`)) {
              parentHidden = showMoreContent.closest(`[hidden]`);
              parentHidden.hidden = false;
          }
          let originalHeight = showMoreContent.offsetHeight;
          parentHidden ? parentHidden.hidden = true : null;
          showMoreContent.style.height = `${hiddenHeight}px`;
          return originalHeight; 
      }
      function showMoreActions(e) {
          const targetEvent = e.target;
          const targetType = e.type;
          if (targetType === "click") {
              if (targetEvent.closest("[data-showmore-button]")) {
                  const showMoreButton = targetEvent.closest("[data-showmore-button]");
                  const showMoreBlock = showMoreButton.closest("[data-showmore]");
                  const showMoreContent = showMoreBlock.querySelector("[data-showmore-content]");
                  const showMoreSpeed = showMoreBlock.dataset.showmoreButton ? showMoreBlock.dataset.showmoreButton : "500";
                  const hiddenHeight = getHeight(showMoreBlock, showMoreContent);
                  if (!showMoreContent.classList.contains("_slide")) {
                      showMoreBlock.classList.contains("_showmore-active") ? _slideUp(showMoreContent, showMoreSpeed, hiddenHeight) : _slideDown(showMoreContent, showMoreSpeed, hiddenHeight);
                      showMoreBlock.classList.toggle("_showmore-active");
                  }
              }
          } else if (targetType === "resize") {
              showMoreBlocksRegular && showMoreBlocksRegular.length ? initItems(showMoreBlocksRegular) : null;
              mdQueriesArray && mdQueriesArray.length ? initItemsMedia(mdQueriesArray) : null;
          }
      }
      function dataMediaQueries(array, dataSetValue) {
        const media = Array.from(array).filter((function(item, index, self) {
            if (item.dataset[dataSetValue]) return item.dataset[dataSetValue].split(",")[0];
        }));
        if (media.length) {
            const breakpointsArray = [];
            media.forEach((item => {
                const params = item.dataset[dataSetValue];
                const breakpoint = {};
                const paramsArray = params.split(",");
                breakpoint.value = paramsArray[0];
                breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max";
                breakpoint.item = item;
                breakpointsArray.push(breakpoint);
            }));
            let mdQueries = breakpointsArray.map((function(item) {
                return "(" + item.type + "-width: " + item.value + "px)," + item.value + "," + item.type;
            }));
            mdQueries = uniqArray(mdQueries);
            const mdQueriesArray = [];
            if (mdQueries.length) {
                mdQueries.forEach((breakpoint => {
                    const paramsArray = breakpoint.split(",");
                    const mediaBreakpoint = paramsArray[1];
                    const mediaType = paramsArray[2];
                    const matchMedia = window.matchMedia(paramsArray[0]);
                    const itemsArray = breakpointsArray.filter((function(item) {
                        if (item.value === mediaBreakpoint && item.type === mediaType) return true;
                    }));
                    mdQueriesArray.push({
                        itemsArray,
                        matchMedia
                    });
                }));
                return mdQueriesArray;
            }
        }
    }
    
  }));
}
showMore();

document.addEventListener('DOMContentLoaded', function() {
  const products = document.querySelectorAll('.catalog__link');

  products.forEach(product => {
      product.addEventListener('click', function(event) {
          event.preventDefault();
          const productId = parseInt(product.dataset.productIndex);
          window.location.href = 'product.html?id=' + productId;
      });
  });
});

document.addEventListener('DOMContentLoaded', function() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = parseInt(urlParams.get('id'));
  fetch('dist/json/products.json')
      .then(response => response.json())
      .then(data => {
          const product = data.products.find(item => item.id === productId);
          displayProduct(product);
      })
      .catch(error => console.error('Помилка під час отримання даних:', error));
});

function displayProduct(product) {
  const descriptionElement = document.querySelector('.description-product__info p');

  // Заповнюємо дані на сторінці товару з отриманими даними
  document.querySelector('.main-product__title').innerText = product.name;
  document.querySelector('.main-product__image--one').src = product.image_sliderOne;
  document.querySelector('.main-product__image--two').src = product.image_sliderTwo;
  document.querySelector('.main-product__image--three').src = product.image_sliderThree;
  document.querySelector('.main-product__price').innerText = product.price + ' грн';
  document.querySelector('.description-product__info p').innerText = product.description;
  // Додати подію для кнопки "До кошика"
  document.querySelector('.action-product__button.button').addEventListener('click', function() {
    const selectedSize = document.querySelector('.sizes-product__input:checked');
    if (selectedSize) {
      const size = selectedSize.value;
      addToCart(product, size);
    } else {
      alert('Будь ласка, виберіть розмір');
    }
  });
}
function addToCart(product, size) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingProduct = cart.find(item => item.id === product.id && item.size === size);
    
    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      const productToAdd = {...product, quantity: 1, size};
      cart.push(productToAdd);
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Товар додано до кошика');
    updateCartQuantityDisplay();
}
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.endsWith('cart.html')) {
      displayCart();
    }
});
function displayCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartList = document.querySelector('.cart__list');
    const cartTotal = document.querySelector('.cart__total');
    
    cartList.innerHTML = '';
    let total = 0;
    
    cart.forEach(product => {
      const productElement = document.createElement('li');
      productElement.className = 'cart__item';
      productElement.innerHTML = `
        <div class="cart__image"><img src="${product.image_sliderOne}" alt="${product.name}"></div>
        <div class="cart__body">
            <div class="cart__name">${product.name}</div>
            <div class="cart__price">За 1 товар: <span> ${product.price} грн</span></div>
            <div class="cart__size">Розмір: <span>${product.size}</span></div>
            
            <div class="cart__quantity">
            <button class="cart__quantity-btn" data-id="${product.id}" data-size="${product.size}" data-action="decrease">-</button>
            <span class="cart__quantity-value">${product.quantity}</span>
            <button class="cart__quantity-btn" data-id="${product.id}" data-size="${product.size}" data-action="increase">+</button>
            </div>
            <div class="cart__total-price">Разом: <span>${product.price * product.quantity} грн </span></div>
        </div>
        
      `;
      cartList.appendChild(productElement);
      total += product.price * product.quantity;
    });
  
    cartTotal.innerText = `Загальна сума: ${total} грн`;
  
    // Додаємо обробники подій для кнопок збільшення/зменшення кількості
    document.querySelectorAll('.cart__quantity-btn').forEach(button => {
      button.addEventListener('click', function() {
        const productId = parseInt(this.dataset.id);
        const size = this.dataset.size;
        const action = this.dataset.action;
        updateCart(productId, size, action);
      });
    });
    updateCartQuantityDisplay();
}
function updateCart(productId, size, action) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const product = cart.find(item => item.id === productId && item.size === size);
  
    if (product) {
      if (action === 'increase') {
        product.quantity += 1;
      } else if (action === 'decrease') {
        product.quantity -= 1;
        if (product.quantity <= 0) {
          cart = cart.filter(item => !(item.id === productId && item.size === size));
        }
      }
  
      localStorage.setItem('cart', JSON.stringify(cart));
      displayCart();
    }
}
function updateCartQuantityDisplay() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalQuantity = cart.reduce((sum, product) => sum + product.quantity, 0);
    const quantityElement = document.querySelector('.action-header__quantity');
    
    if (quantityElement) {
      quantityElement.textContent = totalQuantity;
    }
  }
document.addEventListener('DOMContentLoaded', displayCart);
document.addEventListener('DOMContentLoaded', updateCartQuantityDisplay);



const modules_flsModules = {};
let bodyLockStatus = true;
let bodyUnlock = (delay = 500) => {
    if (bodyLockStatus) {
        const lockPaddingElements = document.querySelectorAll("[data-lp]");
        setTimeout((() => {
            lockPaddingElements.forEach((lockPaddingElement => {
                lockPaddingElement.style.paddingRight = "";
            }));
            document.body.style.paddingRight = "";
            document.documentElement.classList.remove("lock");
        }), delay);
        bodyLockStatus = false;
        setTimeout((function() {
            bodyLockStatus = true;
        }), delay);
    }
};
let bodyLock = (delay = 500) => {
    if (bodyLockStatus) {
        const lockPaddingElements = document.querySelectorAll("[data-lp]");
        const lockPaddingValue = window.innerWidth - document.body.offsetWidth + "px";
        lockPaddingElements.forEach((lockPaddingElement => {
            lockPaddingElement.style.paddingRight = lockPaddingValue;
        }));
        document.body.style.paddingRight = lockPaddingValue;
        document.documentElement.classList.add("lock");
        bodyLockStatus = false;
        setTimeout((function() {
            bodyLockStatus = true;
        }), delay);
    }
};
function functions_FLS(message) {
    setTimeout((() => {
        if (window.FLS) console.log(message);
    }), 0);
}
class Popup {
    constructor(options) {
        let config = {
            logging: true,
            init: true,
            attributeOpenButton: "data-popup",
            attributeCloseButton: "data-close",
            fixElementSelector: "[data-lp]",
            youtubeAttribute: "data-popup-youtube",
            youtubePlaceAttribute: "data-popup-youtube-place",
            setAutoplayYoutube: true,
            classes: {
                popup: "popup",
                popupContent: "popup__content",
                popupActive: "popup_show",
                bodyActive: "popup-show"
            },
            focusCatch: true,
            closeEsc: true,
            bodyLock: true,
            hashSettings: {
                location: true,
                goHash: true
            },
            on: {
                beforeOpen: function() {},
                afterOpen: function() {},
                beforeClose: function() {},
                afterClose: function() {}
            }
        };
        this.youTubeCode;
        this.isOpen = false;
        this.targetOpen = {
            selector: false,
            element: false
        };
        this.previousOpen = {
            selector: false,
            element: false
        };
        this.lastClosed = {
            selector: false,
            element: false
        };
        this._dataValue = false;
        this.hash = false;
        this._reopen = false;
        this._selectorOpen = false;
        this.lastFocusEl = false;
        this._focusEl = [ "a[href]", 'input:not([disabled]):not([type="hidden"]):not([aria-hidden])', "button:not([disabled]):not([aria-hidden])", "select:not([disabled]):not([aria-hidden])", "textarea:not([disabled]):not([aria-hidden])", "area[href]", "iframe", "object", "embed", "[contenteditable]", '[tabindex]:not([tabindex^="-"])' ];
        this.options = {
            ...config,
            ...options,
            classes: {
                ...config.classes,
                ...options?.classes
            },
            hashSettings: {
                ...config.hashSettings,
                ...options?.hashSettings
            },
            on: {
                ...config.on,
                ...options?.on
            }
        };
        this.bodyLock = false;
        this.options.init ? this.initPopups() : null;
    }
    initPopups() {
        this.popupLogging(`Прокинувся`);
        this.eventsPopup();
    }
    eventsPopup() {
        document.addEventListener("click", function(e) {
            const buttonOpen = e.target.closest(`[${this.options.attributeOpenButton}]`);
            if (buttonOpen) {
                e.preventDefault();
                this._dataValue = buttonOpen.getAttribute(this.options.attributeOpenButton) ? buttonOpen.getAttribute(this.options.attributeOpenButton) : "error";
                this.youTubeCode = buttonOpen.getAttribute(this.options.youtubeAttribute) ? buttonOpen.getAttribute(this.options.youtubeAttribute) : null;
                if (this._dataValue !== "error") {
                    if (!this.isOpen) this.lastFocusEl = buttonOpen;
                    this.targetOpen.selector = `${this._dataValue}`;
                    this._selectorOpen = true;
                    this.open();
                    return;
                } else this.popupLogging(`Йой, не заповнено атрибут у ${buttonOpen.classList}`);
                return;
            }
            const buttonClose = e.target.closest(`[${this.options.attributeCloseButton}]`);
            if (buttonClose || !e.target.closest(`.${this.options.classes.popupContent}`) && this.isOpen) {
                e.preventDefault();
                this.close();
                return;
            }
        }.bind(this));
        document.addEventListener("keydown", function(e) {
            if (this.options.closeEsc && e.which == 27 && e.code === "Escape" && this.isOpen) {
                e.preventDefault();
                this.close();
                return;
            }
            if (this.options.focusCatch && e.which == 9 && this.isOpen) {
                this._focusCatch(e);
                return;
            }
        }.bind(this));
        if (this.options.hashSettings.goHash) {
            window.addEventListener("hashchange", function() {
                if (window.location.hash) this._openToHash(); else this.close(this.targetOpen.selector);
            }.bind(this));
            window.addEventListener("load", function() {
                if (window.location.hash) this._openToHash();
            }.bind(this));
        }
    }
    open(selectorValue) {
        if (bodyLockStatus) {
            this.bodyLock = document.documentElement.classList.contains("lock") && !this.isOpen ? true : false;
            if (selectorValue && typeof selectorValue === "string" && selectorValue.trim() !== "") {
                this.targetOpen.selector = selectorValue;
                this._selectorOpen = true;
            }
            if (this.isOpen) {
                this._reopen = true;
                this.close();
            }
            if (!this._selectorOpen) this.targetOpen.selector = this.lastClosed.selector;
            if (!this._reopen) this.previousActiveElement = document.activeElement;
            this.targetOpen.element = document.querySelector(this.targetOpen.selector);
            if (this.targetOpen.element) {
                if (this.youTubeCode) {
                    const codeVideo = this.youTubeCode;
                    const urlVideo = `https://www.youtube.com/embed/${codeVideo}?rel=0&showinfo=0&autoplay=1`;
                    const iframe = document.createElement("iframe");
                    iframe.setAttribute("allowfullscreen", "");
                    const autoplay = this.options.setAutoplayYoutube ? "autoplay;" : "";
                    iframe.setAttribute("allow", `${autoplay}; encrypted-media`);
                    iframe.setAttribute("src", urlVideo);
                    if (!this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`)) {
                        this.targetOpen.element.querySelector(".popup__text").setAttribute(`${this.options.youtubePlaceAttribute}`, "");
                    }
                    this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`).appendChild(iframe);
                }
                if (this.options.hashSettings.location) {
                    this._getHash();
                    this._setHash();
                }
                this.options.on.beforeOpen(this);
                document.dispatchEvent(new CustomEvent("beforePopupOpen", {
                    detail: {
                        popup: this
                    }
                }));
                this.targetOpen.element.classList.add(this.options.classes.popupActive);
                document.documentElement.classList.add(this.options.classes.bodyActive);
                if (!this._reopen) !this.bodyLock ? bodyLock() : null; else this._reopen = false;
                this.targetOpen.element.setAttribute("aria-hidden", "false");
                this.previousOpen.selector = this.targetOpen.selector;
                this.previousOpen.element = this.targetOpen.element;
                this._selectorOpen = false;
                this.isOpen = true;
                setTimeout((() => {
                    this._focusTrap();
                }), 50);
                this.options.on.afterOpen(this);
                document.dispatchEvent(new CustomEvent("afterPopupOpen", {
                    detail: {
                        popup: this
                    }
                }));
                this.popupLogging(`Відкрив попап`);
            } else this.popupLogging(`Йой, такого попапу немає. Перевірте коректність введення. `);
        }
    }
    close(selectorValue) {
        if (selectorValue && typeof selectorValue === "string" && selectorValue.trim() !== "") this.previousOpen.selector = selectorValue;
        if (!this.isOpen || !bodyLockStatus) return;
        this.options.on.beforeClose(this);
        document.dispatchEvent(new CustomEvent("beforePopupClose", {
            detail: {
                popup: this
            }
        }));
        if (this.youTubeCode) if (this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`)) this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`).innerHTML = "";
        this.previousOpen.element.classList.remove(this.options.classes.popupActive);
        this.previousOpen.element.setAttribute("aria-hidden", "true");
        if (!this._reopen) {
            document.documentElement.classList.remove(this.options.classes.bodyActive);
            !this.bodyLock ? bodyUnlock() : null;
            this.isOpen = false;
        }
        this._removeHash();
        if (this._selectorOpen) {
            this.lastClosed.selector = this.previousOpen.selector;
            this.lastClosed.element = this.previousOpen.element;
        }
        this.options.on.afterClose(this);
        document.dispatchEvent(new CustomEvent("afterPopupClose", {
            detail: {
                popup: this
            }
        }));
        setTimeout((() => {
            this._focusTrap();
        }), 50);
        this.popupLogging(`Закрив попап`);
    }
    _getHash() {
        if (this.options.hashSettings.location) this.hash = this.targetOpen.selector.includes("#") ? this.targetOpen.selector : this.targetOpen.selector.replace(".", "#");
    }
    _openToHash() {
        let classInHash = document.querySelector(`.${window.location.hash.replace("#", "")}`) ? `.${window.location.hash.replace("#", "")}` : document.querySelector(`${window.location.hash}`) ? `${window.location.hash}` : null;
        const buttons = document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash}"]`) ? document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash}"]`) : document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash.replace(".", "#")}"]`);
        this.youTubeCode = buttons.getAttribute(this.options.youtubeAttribute) ? buttons.getAttribute(this.options.youtubeAttribute) : null;
        if (buttons && classInHash) this.open(classInHash);
    }
    _setHash() {
        history.pushState("", "", this.hash);
    }
    _removeHash() {
        history.pushState("", "", window.location.href.split("#")[0]);
    }
    _focusCatch(e) {
        const focusable = this.targetOpen.element.querySelectorAll(this._focusEl);
        const focusArray = Array.prototype.slice.call(focusable);
        const focusedIndex = focusArray.indexOf(document.activeElement);
        if (e.shiftKey && focusedIndex === 0) {
            focusArray[focusArray.length - 1].focus();
            e.preventDefault();
        }
        if (!e.shiftKey && focusedIndex === focusArray.length - 1) {
            focusArray[0].focus();
            e.preventDefault();
        }
    }
    _focusTrap() {
        const focusable = this.previousOpen.element.querySelectorAll(this._focusEl);
        if (!this.isOpen && this.lastFocusEl) this.lastFocusEl.focus(); else focusable[0].focus();
    }
    popupLogging(message) {
        this.options.logging ? functions_FLS(`[Попапос]: ${message}`) : null;
    }
}
modules_flsModules.popup = new Popup({});
let addWindowScrollEvent = false;
setTimeout((() => {
    if (addWindowScrollEvent) {
        let windowScroll = new Event("windowScroll");
        window.addEventListener("scroll", (function(e) {
            document.dispatchEvent(windowScroll);
        }));
    }
}), 0);
window["FLS"] = true;