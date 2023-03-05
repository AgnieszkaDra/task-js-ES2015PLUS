export class JSSlider {
    constructor(selelector){
        this.selelector = selelector
        this.imagesList = document.querySelectorAll(selelector)
        this.sliderRootElement = document.querySelector('.js-slider');
        this.sliderRootElement.prototypeClass = 'js-slider__thumbs-item--prototype';
        this.sliderRootElement.currentImageClass = 'js-slider__thumbs-image--current';
        this.sliderRootElement.arrows = [
            this.sliderRootElement.querySelector('.js-slider__nav--next'),
            this.sliderRootElement.querySelector('.js-slider__nav--prev')
        ];

    }

    run(){
        this.initEvents()
        this.initCustomEvents()
    }

    initEvents() {
        const [navNext, navPrev] = this.sliderRootElement.arrows;

        this.imagesList.forEach(item => item.addEventListener(
            'click', 
            e => this.fireCustomEvent(e.currentTarget, 'js-slider-img-click')
            ))
              
            
        this.imagesList.forEach(item => item.addEventListener(
            'click', 
            event => this.fireCustomEvent(event.currentTarget, 'js-slider-start')
        ))
        
        this.sliderRootElement.arrows.forEach( arrow => arrow.addEventListener(
            'mouseover',
            event => this.fireCustomEvent(event.currentTarget, 'js-slider-stop')
        ))

        this.sliderRootElement.arrows.forEach( arrow => arrow.addEventListener(
            'mouseout',
            event => this.fireCustomEvent(event.currentTarget, 'js-slider-start')
        )) 
    

        
    
        // todo: 
        // utwórz event o nazwie [click], który ma uruchomić event [js-slider-img-next]
        // na elemencie [.js-slider__nav--next]
        
       
        if(navNext) { 
            navNext.addEventListener(
                'click', 
                e => this.fireCustomEvent(this.sliderRootElement, 'js-slider-img-next')
            );
        }
    
        // todo:
        // utwórz event o nazwie [click], który ma uruchomić event [js-slider-img-prev]
        // na elemencie [.js-slider__nav--prev]
       
        if(navPrev) { 
            navPrev.addEventListener(
                'click',
                e => this.fireCustomEvent(this.sliderRootElement, 'js-slider-img-prev')
            );
        }

  
        // todo:
        // utwórz event o nazwie [click], który ma uruchomić event [js-slider-close]
        // tylko wtedy gdy użytkownik kliknie w [.js-slider__zoom]
        const zoom = this.sliderRootElement.querySelector('.js-slider__zoom');
        if(zoom) {
            zoom.addEventListener('click', function(e) {
                if(e.target === e.currentTarget) {
                    this.fireCustomEvent(this.sliderRootElement, 'js-slider-close');
                }
            })
        }
    }

    initCustomEvents() {
       
        this.imagesList.forEach(img => img.addEventListener(
             'js-slider-img-click', 
            event => this.onImageClick(event)
        ));

        this.imagesList.forEach( img => img.addEventListener(
            'js-slider-start', 
            event => this.slideImages(event)
    ));

    this.sliderRootElement.arrows.forEach(arrow => arrow.addEventListener(
        'js-slider-stop', 
        event => this.stopSlideImages(event)
    ));   

    this.sliderRootElement.arrows.forEach(arrow => arrow.addEventListener(
        'js-slider-start', 
        event => this.slideImages(event)
    ));  
            
    
        this.sliderRootElement.addEventListener('js-slider-img-next', (event) => this.onImageNext(event));
        this.sliderRootElement.addEventListener('js-slider-img-prev', (event) => this.onImagePrev(event));
        this.sliderRootElement.addEventListener('js-slider-close', (event) => {
            this.onClose(event);
            this.stopSlideImages(event)
        });
    }

    fireCustomEvent(element, name) {
        console.log(element.className, '=>', name);
    
        const event = new CustomEvent(name, {
            bubbles: true,
        });
    
        element.dispatchEvent(event);
    }

    stopSlideImages(event){
        console.log(this.slideInterval);
        if (this.slideInterval) {
            clearInterval(this.slideInterval);
          }
    }

    slideImages(event){
        console.log(this)
        this.stopSlideImages();
        this.slideInterval = setInterval(
            
        this.onImageNext.bind(this), 3000);
    }

    onImageClick(event){
        
        // todo:  
        // 1. dodać klasę [js-slider--active], aby pokazać całą sekcję
        // 2. wyszukać ściężkę do klikniętego elementu i wstawić do [.js-slider__image]
        // 3. pobrać nazwę grupy zapisaną w dataset klikniętego elementu
        // 4. wyszukać wszystkie zdjęcia należące do danej grupy
        // 5. utworzyć na podsawie elementu [.js-slider__thumbs-item--prototype] zawartość dla [.js-slider__thumbs]
        // 6. zaznaczyć przy pomocy klasy [.js-slider__thumbs-image--current], który element jest aktualnie wyświetlany
        this.sliderRootElement.classList.add('js-slider--active');
            
        const src = event.currentTarget.querySelector('img').src;
        this.sliderRootElement.querySelector('.js-slider__image').src = src;
    
        const groupName = event.currentTarget.dataset.sliderGroupName;
        this.createThumbs(groupName, src);
    }
    
    createThumbs(groupName, src) {
        //const thumbsList = document.querySelectorAll(this.selelector+'[data-slider-group-name='+ groupName +']');
        const thumbsList = document.querySelectorAll(`${this.selelector}[data-slider-group-name= '${groupName}']`);
        
        const prototype = document.querySelector('.js-slider__thumbs-item--prototype');
        
        thumbsList.forEach( (item) => {
            const thumbElement = this.cloneThumbElement();
            const thumbImg = thumbElement.querySelector('img');
            
            thumbImg.src = item.querySelector('img').src;
            
            if(thumbImg.src === src) {
                thumbImg.classList.add('js-slider__thumbs-image--current');
            }
    
            document.querySelector('.js-slider__thumbs').appendChild(thumbElement);
        })
    }

    cloneThumbElement(){
        const prototype = document.querySelector(`.${this.sliderRootElement.prototypeClass}`);
        const thumbElement = prototype.cloneNode(true);
        thumbElement.classList.remove('js-slider__thumbs-item--prototype');

        return thumbElement
    }
        
    
    
    onImageNext() {
        
        console.log(this, 'onImageNext');
        // [this] wskazuje na element [.js-slider]
        
        // todo:
        // 1. wyszukać aktualny wyświetlany element przy pomocy [.js-slider__thumbs-image--current]
        // 2. znaleźć element następny do wyświetlenie względem drzewa DOM
        // 3. sprawdzić czy ten element istnieje
        // 4. przełączyć klasę [.js-slider__thumbs-image--current] do odpowiedniego elementu
        // 5. podmienić atrybut src dla [.js-slider__image]
        const currentClassName = 'js-slider__thumbs-image--current';
        //const current = document.querySelector('.'+ currentClassName);
        const current = document.querySelector(`.${this.sliderRootElement.currentImageClass}`);
        
        const parentCurrent = current.parentElement;
        const nextElement = parentCurrent.nextElementSibling;
        this.changeCurrentImage(nextElement, current)
      
    }

    changeCurrentImage(newCurrent, current){
        if(newCurrent && !newCurrent.className.includes(`${this.sliderRootElement.prototypeClass}`)) {
            const img = newCurrent.querySelector('img')
            img.classList.add(this.sliderRootElement.currentImageClass);
    
            document.querySelector('.js-slider__image').src = img.src;
            current.classList.remove(this.sliderRootElement.currentImageClass);
        }
    }

    onImagePrev(event) {
        console.log(this, 'onImagePrev');
        // [this] wskazuje na element [.js-slider]
        
        // todo:
        // 1. wyszukać aktualny wyświetlany element przy pomocy [.js-slider__thumbs-image--current]
        // 2. znaleźć element poprzedni do wyświetlenie względem drzewa DOM
        // 3. sprawdzić czy ten element istnieje i czy nie posiada klasy [.js-slider__thumbs-item--prototype]
        // 4. przełączyć klasę [.js-slider__thumbs-image--current] do odpowiedniego elementu
        // 5. podmienić atrybut src dla [.js-slider__image]
        const currentClassName = 'js-slider__thumbs-image--current';
        const current = document.querySelector('.'+currentClassName);
    
        const parentCurrent = current.parentElement;
        const prevElement = parentCurrent.previousElementSibling;
        this.changeCurrentImage(prevElement, current)
    }
    
    onClose(event) {
        // todo:
        // 1. należy usunać klasę [js-slider--active] dla [.js-slider]
        // 2. należy usunać wszystkie dzieci dla [.js-slider__thumbs] pomijając [.js-slider__thumbs-item--prototype]
    
        event.currentTarget.classList.remove('js-slider--active');
        const thumbsList = this.querySelectorAll('.js-slider__thumbs-item:not(.js-slider__thumbs-item--prototype)');
        thumbsList.forEach( item => item.parentElement.removeChild(item));
    }


}


// const runJSSlider = function() {
//     const imagesSelector = '.gallery__item';
//     const sliderRootSelector = '.js-slider'; 

//     const imagesList = document.querySelectorAll(imagesSelector);
//     const sliderRootElement = document.querySelector(sliderRootSelector);

//     initEvents(imagesList, sliderRootElement);
//     initCustomEvents(imagesList, sliderRootElement, imagesSelector);
// }

// const initEvents = function() {
//     this.imagesList.forEach(function(item)  {
//         item.addEventListener('click', function(e) {
//             fireCustomEvent(e.currentTarget, 'js-slider-img-click');
//         });
//     });

//     // todo: 
//     // utwórz event o nazwie [click], który ma uruchomić event [js-slider-img-next]
//     // na elemencie [.js-slider__nav--next]
//     const navNext = sliderRootElement.querySelector('.js-slider__nav--next');
//     if(navNext) { 
//         navNext.addEventListener('click', function(e) {
//             fireCustomEvent(sliderRootElement, 'js-slider-img-next')
//         });
//     }

//     // todo:
//     // utwórz event o nazwie [click], który ma uruchomić event [js-slider-img-prev]
//     // na elemencie [.js-slider__nav--prev]
//     const navPrev = sliderRootElement.querySelector('.js-slider__nav--prev');
//     if(navPrev) { 
//         navPrev.addEventListener('click', function(e) {
//             fireCustomEvent(sliderRootElement, 'js-slider-img-prev')
//         });
//     }

//     // todo:
//     // utwórz event o nazwie [click], który ma uruchomić event [js-slider-close]
//     // tylko wtedy gdy użytkownik kliknie w [.js-slider__zoom]
//     const zoom = sliderRootElement.querySelector('.js-slider__zoom');
//     if(zoom) {
//         zoom.addEventListener('click', function(e) {
//             if(e.target === e.currentTarget) {
//                 fireCustomEvent(sliderRootElement, 'js-slider-close');
//             }
//         })
//     }
// }

// const fireCustomEvent = function(element, name) {
//     console.log(element.className, '=>', name);

//     const event = new CustomEvent(name, {
//         bubbles: true,
//     });

//     element.dispatchEvent(event);
// }

// const initCustomEvents = function(imagesList, sliderRootElement, imagesSelector) {
//     imagesList.forEach(function(img) {
//         img.addEventListener('js-slider-img-click', function(event) {
//             onImageClick(event, sliderRootElement, imagesSelector);
//         });
//     });

//     sliderRootElement.addEventListener('js-slider-img-next', onImageNext);
//     sliderRootElement.addEventListener('js-slider-img-prev', onImagePrev);
//     sliderRootElement.addEventListener('js-slider-close', onClose);
// }

// const onImageClick = function(event, sliderRootElement, imagesSelector) {
//     // todo:  
//     // 1. dodać klasę [js-slider--active], aby pokazać całą sekcję
//     // 2. wyszukać ściężkę do klikniętego elementu i wstawić do [.js-slider__image]
//     // 3. pobrać nazwę grupy zapisaną w dataset klikniętego elementu
//     // 4. wyszukać wszystkie zdjęcia należące do danej grupy
//     // 5. utworzyć na podsawie elementu [.js-slider__thumbs-item--prototype] zawartość dla [.js-slider__thumbs]
//     // 6. zaznaczyć przy pomocy klasy [.js-slider__thumbs-image--current], który element jest aktualnie wyświetlany
//     sliderRootElement.classList.add('js-slider--active');
        
//     const src = event.currentTarget.querySelector('img').src;
//     sliderRootElement.querySelector('.js-slider__image').src = src;

//     const groupName = event.currentTarget.dataset.sliderGroupName;
//     console.log(groupName)
//     const thumbsList = document.querySelectorAll(imagesSelector+'[data-slider-group-name='+ groupName +']');
//     console.log(thumbsList)
//     const prototype = document.querySelector('.js-slider__thumbs-item--prototype');
//     thumbsList.forEach( (item) => {
//         const thumbElement = prototype.cloneNode(true);
//         console.log(thumbElement)
//         thumbElement.classList.remove('js-slider__thumbs-item--prototype');
//         const thumbImg = thumbElement.querySelector('img');
//         console.log(thumbImg)
//         thumbImg.src = item.querySelector('img').src;
//         console.log(src)
//         console.log(thumbImg.src)
//         if(thumbImg.src === src) {
//             thumbImg.classList.add('js-slider__thumbs-image--current');
//         }

//         document.querySelector('.js-slider__thumbs').appendChild(thumbElement);
//     })
// }

// const onImageNext = function(event) {
//     console.log(this, 'onImageNext');
//     // [this] wskazuje na element [.js-slider]
    
//     // todo:
//     // 1. wyszukać aktualny wyświetlany element przy pomocy [.js-slider__thumbs-image--current]
//     // 2. znaleźć element następny do wyświetlenie względem drzewa DOM
//     // 3. sprawdzić czy ten element istnieje
//     // 4. przełączyć klasę [.js-slider__thumbs-image--current] do odpowiedniego elementu
//     // 5. podmienić atrybut src dla [.js-slider__image]
//     const currentClassName = 'js-slider__thumbs-image--current';
//     const current = this.querySelector('.'+currentClassName);
    
//     const parentCurrent = current.parentElement;
//     const nextElement = parentCurrent.nextElementSibling;
//     if(nextElement && !nextElement.className.includes('js-slider__thumbs-item--prototype')) {
//         const img = nextElement.querySelector('img')
//         img.classList.add(currentClassName);

//         this.querySelector('.js-slider__image').src = img.src;
//         current.classList.remove(currentClassName);
//     }
// }

// const onImagePrev = function(event) {
//     console.log(this, 'onImagePrev');
//     // [this] wskazuje na element [.js-slider]
    
//     // todo:
//     // 1. wyszukać aktualny wyświetlany element przy pomocy [.js-slider__thumbs-image--current]
//     // 2. znaleźć element poprzedni do wyświetlenie względem drzewa DOM
//     // 3. sprawdzić czy ten element istnieje i czy nie posiada klasy [.js-slider__thumbs-item--prototype]
//     // 4. przełączyć klasę [.js-slider__thumbs-image--current] do odpowiedniego elementu
//     // 5. podmienić atrybut src dla [.js-slider__image]
//     const currentClassName = 'js-slider__thumbs-image--current';
//     const current = this.querySelector('.'+currentClassName);

//     const parentCurrent = current.parentElement;
//     const prevElement = parentCurrent.previousElementSibling;
//     if(prevElement && !prevElement.className.includes('js-slider__thumbs-item--prototype')) {
//         const img = prevElement.querySelector('img')
//         img.classList.add(currentClassName);

//         this.querySelector('.js-slider__image').src = img.src;
//         current.classList.remove(currentClassName);
//     }
// }

// const onClose = function(event) {
//     // todo:
//     // 1. należy usunać klasę [js-slider--active] dla [.js-slider]
//     // 2. należy usunać wszystkie dzieci dla [.js-slider__thumbs] pomijając [.js-slider__thumbs-item--prototype]

//     event.currentTarget.classList.remove('js-slider--active');
//     const thumbsList = this.querySelectorAll('.js-slider__thumbs-item:not(.js-slider__thumbs-item--prototype)');
//     thumbsList.forEach( item => item.parentElement.removeChild(item));
// }