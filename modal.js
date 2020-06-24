window.addEventListener('DOMContentLoaded', () => {
    let btns = document.querySelectorAll('.btn');
    modal = document.querySelector('.modal');
    esc = document.querySelector('.esc');

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
    }

    function closeModal() {
        modal.classList.remove('show');
        modal.classList.add('hide');
        document.body.style.overflow = '';
    }

    esc.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if ( e.code === 'Escape' && modal.classList.contains('show')) {
            closeModal();
        }
    });

    let timerID = setTimeout(openModal, 5000);

    function showModalByScroll() {
        if (window.pageYOffset + document.documentElement.clientHeight >= 2000 ) {
            openModal();
            window.removeEventListener('scroll', showModalByScroll);
        }
    }

    window.addEventListener('scroll', showModalByScroll);

    const form = document.querySelector('form');

    const message = {
        loading: 'loading...',
        success: 'thanks, soon we will connect with you',
        failure: 'something went wrong'
    }

    function postData() {
        form.addEventListener('submit', (event) => {
            event.preventDefault();

            const statusMessage = document.createElement('div');
            statusMessage.classList.add('status');
            statusMessage.textContent = message.loading;
            form.append(statusMessage);

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
                    statusMessage.textContent = message.success;
                    form.reset();
                    setTimeout( () => {
                        statusMessage.remove();
                    },2000);
                    console.log(request.response);
                } else {
                    statusMessage.textContent = message.failure;
                }
            })
        });
    } postData();

});