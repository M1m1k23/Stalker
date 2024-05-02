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
    if (targetElement.closest('.rating__input')) {
      const currentElement = targetElement.closest('.rating__input');
      const rating = currentElement.closest('.rating');
      if (rating.classList.contains('..rating--set')) {
        startRatingGet(rating, currentElement);
      }
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



//Rating

const ratings = document.querySelectorAll('[data-rating]')

if (ratings) {
  ratings.forEach(rating => {
    const currentValue = +rating.dataset.rating;
    currentValue ? startRatingSet(rating, currentValue) : null;
  });
}

function startRatingGet(rating, currentElement) {
  const ratingValue = +currentElement.value;
  const resultRating = 2.5;
  startRatingSet(rating, resultRating)
  
}

function startRatingSet(rating, value) {
  const ratingItems = rating.querySelectorAll('.rating__item')
  const resultFullItems = parseInt(value);
  const resultPartItem = value - resultFullItems;
  ratingItems.forEach((ratingItem, index) => {
    ratingItem.classList.remove('active');
    ratingItem.querySelector('span') ? ratingItems[index].querySelector('span').remove() : null;
    
    if (index <= (resultFullItems-1)) {
      ratingItem.classList.add('active');
    }
    if (index === resultFullItems && resultPartItem) {
      ratingItem.insertAdjacentHTML("beforeend", `<span style="width:${resultPartItem * 100}%"></span>`)
    }
  });
}


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
            slideUp(filterTitle.nextElementSibling)
            filterTitle.classList.remove('active')
          } else {
            slideDown(filterTitle.nextElementSibling)
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

const reviewsSlider = document.querySelector('.reviews');
if(reviewsSlider) {
    new Swiper('.reviews__slider', {
        // Optional parameters
        loop: true,
        speed: 800,
        spaceBetween: 23,
        slidesPerView: 3,
         // If we need pagination
        pagination: {
            el: '.reviews__pagination',
            clickable: true,
        },
        breakpoints: {
            // when window width is >= 320px
            320: {
              slidesPerView: 1.3,
              spaceBetween: 15
            },
            480: {
              slidesPerView: 2,
              spaceBetween: 15
            },
            // when window width is >= 640px
            991: {
              slidesPerView: 3,
              spaceBetween: 23
            }
          }
    });
}

const mainProduct = document.querySelector('.main-product');
if (mainProduct) {
  const mainProductSliderImages = document.querySelectorAll('.main-product__slider img')
  let mainProductThumbSlider;

  // if (mainProductSliderImages.length) {
  //   const productImagesBlock = document.querySelector('.main-product__images')
  //   let mainProductThumbSliderTemplate = `<div class="main-product__thumb-slider thumb-slider">`
  //   mainProductThumbSliderTemplate += `<div class="thumb-slider__slider swiper">`
  //   mainProductThumbSliderTemplate += `<div class="thumb-slider__wrapper swiper-wrapper">`
  //   mainProductSliderImages.forEach(mainProductSliderImages => {
  //     const srcImage = mainProductSliderImages.getAttribute('src').replace('/slider/', '/slider/thumbs/');
  //     mainProductThumbSliderTemplate += `<div class="thumb-slider__slide swiper-slide">
  //         <img src="${srcImage}" class="thumb-slider__image" alt="Image">
  //     </div>`
  //   });
  //   mainProductThumbSliderTemplate += `</div>`
  //   mainProductThumbSliderTemplate += `</div>`
  //   mainProductThumbSliderTemplate += `<div class="thumb-slider__arrows">`
  //   mainProductThumbSliderTemplate += `
  //       <button type="button" class="thumb-slider__arrow thumb-slider__arrow--up _icon-ch-up"></button>
  //       <button type="button" class="thumb-slider__arrow thumb-slider__arrow--down _icon-ch-down"></button>
  //   `
    
  //   mainProductThumbSliderTemplate += `</div>`
  //   mainProductThumbSliderTemplate += `</div>`
  //   productImagesBlock.insertAdjacentHTML("afterbegin", mainProductThumbSliderTemplate)

  //   // mainProductThumbSlider = new Swiper('.thumb-slider__slider', {
  //   //   // Optional parameters
  //   //   loop: true,
  //   //   direction: "vertical",
  //   //   speed: 800,
  //   //   spaceBetween: 15,
  //   //   slidesPerView: 3,
  //   // });
  // }

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

// Catalog

// const catalogItems = document.querySelectorAll('.catalog__items');
// if (catalogItems) {
//   loadProducts();
// }

// async function loadProducts() {
//   const response = await fetch("json/products.json", {
//     method: "GET"
//   })
//   if (response.ok) {
//     const responseData = await response.json()
//     initProducts(responseData)
//   } else {
//     alert('Error');
//   }
// }

// function initProducts(data) {
//   const productsList = data.products;
  
//   if (productsList.length) {
//     let productTemplate = ``;
//     productsList.forEach(productItem => {
//       productTemplate += `<article class="item-product">`;
//       if (productItem.image) {
//         productTemplate += `<a href="${productItem.url}" class="item-product__picture-link">`
//         productTemplate += `<img src="${productItem.image}" alt="shirts" class="item-product__img">`
//         productTemplate += `</a>`
//       }
//       productTemplate += `<div class="item-product__body">`
//       productTemplate += `<h4 class="item-product__title">`
//       productTemplate += `<a href="${productItem.url}" class="item-product__link-title">${productItem.title}</a>`
//       productTemplate += `</h4>`
//       productTemplate += `<div class="item-product__price">${productItem.price}</div>`
//       productTemplate += `</div>`
//       productTemplate += `</article>`
//     });
//     catalogItems.innerHTML = productTemplate;
     
//   }
// }

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
  fetch('/json/products.json')
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
}


