let btns = document.querySelectorAll('.btn');
    modal = document.querySelector('.modal');
    esc = document.querySelector('.esc');

    btns.forEach( i => {
        i.addEventListener('click', () => {
           modal.classList.add('show');
           modal.classList.remove('hide');
           document.body.style.overflow = 'hidden';
        })
    });

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
    })