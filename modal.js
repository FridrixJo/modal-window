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
        if (window.pageYOffset + document.documentElement.clientHeight >= 899 ) {
            openModal();
            window.removeEventListener('scroll', showModalByScroll);
        }
    }

    window.addEventListener('scroll', showModalByScroll);