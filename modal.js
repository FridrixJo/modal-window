window.addEventListener('DOMContentLoaded', () => {
    let btns = document.querySelectorAll('.btn'),
    modal = document.querySelector('.modal'),
    container1 = document.querySelector('.container1');

    btns.forEach(i => {
        i.addEventListener('click', () => {
            openModal();
        })
    });

    function openModal() {
        modal.classList.add('show');
        modal.classList.remove('hide');
        document.body.style.overflow = 'hidden';
        clearTimeout(timerID);
        container1.style.right = '16px';
        window.removeEventListener('scroll', showModalByScroll);
    }

    function closeModal() {
        modal.classList.remove('show');
        modal.classList.add('hide');
        document.body.style.overflow = '';
    }

    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.getAttribute('data-close') == '') {
            closeModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.code === 'Escape' && modal.classList.contains('show')) {
            closeModal();
        }
    });

    let timerID = setTimeout(openModal, 50000);

    function showModalByScroll() {
        if (window.pageYOffset + document.documentElement.clientHeight >= 3000) {
            openModal();
            window.removeEventListener('scroll', showModalByScroll);
        }
    }

    window.addEventListener('scroll', showModalByScroll);

    const form = document.querySelector('form');

    const message = {
        loading: 'img/spinner.svg',
        success: 'thanks, soon we will connect with you',
        failure: 'something went wrong'
    }

    const postData = async (url, data) => {
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: data
        });

        return await res.json();
    }

    function bindPostData() {
        form.addEventListener('submit', (event) => {
            event.preventDefault();

            const statusMessage = document.createElement('img');
            statusMessage.src = message.loading;
            statusMessage.style.cssText = `
               display: block;
               margin: 0 auto;
            `;
            form.insertAdjacentElement('afterend', statusMessage);

            const formData = new FormData(form);

           const json = JSON.stringify(Object.fromEntries(formData.entries()));

            postData('http://localhost:3000/requests', json)
                .then(data => {
                    console.log(data);
                    showThanksModal(message.success);
                    form.reset();
                    statusMessage.remove();
                }).catch(() => {
                    showThanksModal(message.failure);
                }).finally(() => {
                    form.reset();
                })
        });
    }
    bindPostData();

    function showThanksModal(message) {
        const prevModalContant = document.querySelector('.modal__dialog');

        prevModalContant.classList.add('hide');
        openModal();

        const thanksModal = document.createElement('div');
        thanksModal.classList.add('modal__dialog');
        thanksModal.innerHTML = `
            <div class="modal__content">
                  <div class="esc" data-close>×</div>
                  <div class="thanks">${message}</div>
            </div>
        `;

        document.querySelector('.modal').append(thanksModal);
        setTimeout(() => {
            thanksModal.remove();
            prevModalContant.classList.add('show');
            prevModalContant.classList.remove('hide');
            closeModal();
        }, 4000);

    }

    fetch('db.json')
        .then(data => data.json())
        .then(res => console.log(res));

    //tabs

    const tabs = document.querySelectorAll('.tabheader__item'),
    tabsContent = document.querySelectorAll('.tabcontent'),
    tabsParent = document.querySelector('.tabheader__items');

    function hideTabContent() {
        tabsContent.forEach( item => {
            item.classList.add('hide');
            item.classList.remove('show', 'fade');
        });
        tabs.forEach( item => {
        item.classList.remove('tabheader__item_active');
        });
    }

    function showTabContent(i) {
        tabsContent[i].classList.add('show', 'fade');
        tabsContent[i].classList.remove('hide');
        tabs[i].classList.add('tabheader__item_active');
    }

    tabsParent.addEventListener('click', (event) => {
        const target = event.target;

        if ( target && target.classList.contains('tabheader__item')) {
            tabs.forEach( (item, i) => {
                if ( target == item ) {
                    hideTabContent();
                    showTabContent(i);
                }
            });
        }
    });

    hideTabContent();
    showTabContent(0);


    const getResource = async (url, data) => {
        const res = await fetch(url);
 
        

        if(!res.ok) {
            throw new Error(`could not fetch ${url}, status: ${res.status}`);
        }

        return await res.json();
    };

    //getResource('http://localhost:3000/menu')
    //    .then(data => {
    //        data.forEach(({img,altimg,title,descr,price}) => {
    //            new MenuCard(img,altimg,title,descr,price, '.container').render();
    //        });
    //    });

    axios.get('http://localhost:3000/menu')
         .then(data => {
            data.forEach(({img,altimg,title,descr,price}) => {
                new MenuCard(img,altimg,title,descr,price, '.container').render();
                });
         });

    class MenuCard {
        constructor(scr, alt, title, descr, price, parentSelector ) {
            this.scr = scr;
            this.alt = alt;
            this.title = title;
            this.descr = descr;
            this.price = price;
            this.parent = document.querySelector(parentSelector);
            this.transfer = 75;
            this.changeToUsd();
        }
    
        changeToUsd() {
            this.price = (this.price / this.transfer).toFixed(2);
        }
        
        render() {
            const element = document.createElement('div');
            element.innerHTML = `
            <div class="card">
                 <div class="img">
                     <img src=${this.scr} alt=${this.alt}>
                 </div>
                 <div class="title2">
                     <p>${this.title}</p>
                 </div>
                 <div class="text">
                     <h4>${this.descr}
                     </h4>  
                 </div>
                 <hr>
                 <p id="cost">Цена:</p>
                 <p id="num"><span>${this.price}</span>usd/день</p>
            </div>
        `;    
            this.parent.append(element);
        }
    
    }

    //slider

        const slides = document.querySelectorAll('.offer__slide'),
              prev = document.querySelector('.offer__slider-prev'),
              next = document.querySelector('.offer__slider-next'),
              total = document.querySelector('#total'),
              current = document.querySelector('#current');
        let slideIndex = 1;

        showSlides(slideIndex);

        if (slides.length < 10) {
            total.textContent = `0${slides.length}`;
        } else {
            total.textContent = slides.length;
        }

        function showSlides(n) {
            if (n > slides.length) {
                slideIndex = 1;
            }

            if (n < 1) {
                slideIndex = slides.length;
            }

            slides.forEach( item  => item.style.display = 'none');

            slides[slideIndex - 1].style.display = 'block';

            if (slides.length < 10) {
                current.textContent = `0${slideIndex}`;
            } else {
                total.textContent = slideIndex;
            }
        }

        function plusSlides(n) {
            showSlides( slideIndex += n );
        }

        prev.addEventListener('click', () => {
             plusSlides(-1);
        });

        next.addEventListener('click', () => {
            plusSlides(+1);
       });

       // merry-go-round

       const pictures = document.querySelectorAll('.merry-go-round__img'),
              left = document.querySelector('.merry-go-round__left'),
              right = document.querySelector('.merry-go-round__right'),
              now = document.querySelector('#now'),
              all = document.querySelector('#all'),
              picturesWrapper = document.querySelector('.merry-go-round__wrapper'),
              picturesField = document.querySelector('.merry-go-round__wrapper__inner'),
              width = window.getComputedStyle(picturesWrapper).width;

        let pictureIndex = 1,
            offset = 0;

            if (pictures.length < 10) {
                all.textContent = `0${pictures.length}`;
                now.textContent = `0${pictureIndex}`;
            } else {
                all.textContent = pictures.length;
                now.textContent = pictureIndex;
            }

        picturesField.style.width = 100 * pictures.length + '%';
        pictures.forEach(item => {
            item.style.width = width;
        });

        right.addEventListener('click', () => {
            if (offset == +width.slice(0, width.length - 2) * (pictures.length - 1)) {
               offset = 0;
            }else {
                offset += +width.slice(0, width.length - 2);
            }
            picturesField.style.transform = `translateX(-${offset}px)`;

            if ( pictureIndex == pictures.length ) {
                pictureIndex = 1;
            }else{
                pictureIndex++;
            }

            if (pictures.length < 10) {
                now.textContent = `0${pictureIndex}`;
            }else{
                now.textContent = pictureIndex;
            }
        });

        left.addEventListener('click', () => {
            if (offset == 0) {
                offset = +width.slice(0, width.length - 2) * (pictures.length - 1);
            }else {
                offset -= +width.slice(0, width.length - 2);
            }
            picturesField.style.transform = `translateX(-${offset}px)`;

            if ( pictureIndex == 1 ) {
                pictureIndex = pictures.length;
            }else{
                pictureIndex--;
            }

            if (pictures.length < 10) {
                now.textContent = `0${pictureIndex}`;
            }else{
                now.textContent = pictureIndex;
            }
        });




        const photos = document.querySelectorAll('.tank__img'),
              carousel = document.querySelector('.carousel'),
              previous = document.querySelector('.carousel__previous'),
              following = document.querySelector('.carousel__next'),
              actual = document.querySelector('#actual'),
              quanity = document.querySelector('#quanity'),
              photosWrapper = document.querySelector('.carousel__wrapper'),
              photosField = document.querySelector('.carousel__wrapper__inner'),
              breadth = window.getComputedStyle(photosWrapper).width;

              const indicators = document.createElement('ol'),
                    dots = [];
              indicators.classList.add('carousel-indicators');
              carousel.append(indicators);

              for (let i = 0; i < photos.length; i++) {
                  const dot = document.createElement('li');
                  dot.setAttribute('data-slide-to', i + 1);
                  dot.classList.add('dot');

                if (i == 0) {
                    dot.style.opacity = 1;
                }

                  indicators.append(dot);
                  dots.push(dot);
              }
              

        let photoIndex = 1,
            dislocation = 0;

            if (photos.length < 10) {
                quanity.textContent = `0${photos.length}`;
                actual.textContent = `0${photoIndex}`;
            } else {
                quanity.textContent = photos.length;
                actual.textContent = photoIndex;
            }

            if (photoIndex < 10) {
                actual.textContent = `0${photoIndex}`;
            }

            photosField.style.width = 100 * photos.length + '%';
            photos.forEach(item => {
            item.style.width = breadth;
        });

        following.addEventListener('click', () => {
            if (dislocation == +breadth.slice(0, breadth.length - 2) * (photos.length - 1)) {
                dislocation = 0;
            }else {
                dislocation += +breadth.slice(0, breadth.length - 2);
            }
            photosField.style.transform = `translateX(-${dislocation}px)`;

            if ( photoIndex == photos.length ) {
                photoIndex = 1;
            }else{
                photoIndex++;
            }

            if (photos.length < 10) {
                actual.textContent = `0${photoIndex}`;
            }else{
                actual.textContent = photoIndex;
            }
            if (photoIndex < 10) {
                actual.textContent = `0${photoIndex}`;
            }

            dots.forEach(dot => dot.style.opacity = '.5');
            dots[photoIndex - 1].style.opacity = 1;

        });

        previous.addEventListener('click', () => {
            if (dislocation == 0) {
                dislocation = +breadth.slice(0, breadth.length - 2) * (photos.length - 1);
            }else {
                dislocation -= +breadth.slice(0, breadth.length - 2);
            }
            photosField.style.transform = `translateX(-${dislocation}px)`;

            if ( photoIndex == 1 ) {
                photoIndex = photos.length;
            }else{
                photoIndex--;
            }

            if (photos.length < 10) {
                actual.textContent = `0${photoIndex}`;
            }else{
                actual.textContent = photoIndex;
            }
            if (photoIndex < 10) {
                actual.textContent = `0${photoIndex}`;
            }

            dots.forEach(dot => dot.style.opacity = '.5');
            dots[photoIndex - 1].style.opacity = 1;


        });

        dots.forEach(dot => {
            dot.addEventListener('click', (e) => {
                const slideTo = e.target.getAttribute('data-slide-to');

                photoIndex = slideTo;
                dislocation = +breadth.slice(0, breadth.length - 2) * (slideTo - 1);

                photosField.style.transform = `translateX(-${dislocation}px)`;

                dots.forEach(dot => dot.style.opacity = '.5');
                dots[photoIndex - 1].style.opacity = 1;

                if (photos.length < 10) {
                    actual.textContent = `0${photoIndex}`;
                }else{
                    actual.textContent = photoIndex;
                }
                if (photoIndex < 10) {
                    actual.textContent = `0${photoIndex}`;
                }
    
            });
        });


});