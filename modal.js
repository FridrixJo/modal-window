window.addEventListener('DOMContentLoaded', () => {
    let btns = document.querySelectorAll('.btn');
    modal = document.querySelector('.modal');

    btns.forEach( i => {
        i.addEventListener('click', () => {
           openModal();
        })
    });
    
    function openModal() {
        modal.classList.add('show');
        modal.classList.remove('hide');
        document.body.style.overflow = 'hidden';
        clearTimeout(timerID);
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
        if ( e.code === 'Escape' && modal.classList.contains('show')) {
            closeModal();
        }
    });

    let timerID = setTimeout(openModal, 50000);

    function showModalByScroll() {
        if (window.pageYOffset + document.documentElement.clientHeight >= 2000 ) {
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

    function postData() {
        form.addEventListener('submit', (event) => {
            event.preventDefault();

            const statusMessage = document.createElement('img');
            statusMessage.src = message.loading;
            statusMessage.style.cssText = `
               display: block;
               margin: 0 auto;
            `;
            form.insertAdjacentElement('afterend', statusMessage);

            const request = new XMLHttpRequest();
            request.open('POST', 'server.php');
            
            request.setRequestHeader('Content-type', 'application/json');
            const formData = new FormData(form);

            const object = {};
            formData.forEach(function(value,key){
                object[key] = value;
            });

            const json = JSON.stringify(object);
            
            request.send(json);

            request.addEventListener('load', () => {
                if ( request.status === 200 ) {
                    form.reset();
                    statusMessage.remove();
                    showThanksModal(message.success);   
                    console.log(request.response);
                } else {
                    showThanksModal(message.failure);
                    form.reset();
                }
            })
        });
    } postData();

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
        setTimeout( () => {
            thanksModal.remove();
            prevModalContant.classList.add('show');
            prevModalContant.classList.remove('hide');
            closeModal();
        }, 4000);

    } 
});