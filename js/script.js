document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.querySelector('.toggle-button');
    const container = document.querySelector('.cat-container');
    const showMoreButton = document.querySelector('#show-more');
    const showLessButton = document.querySelector('#show-less');
    let catData = [];
    let currentIndex = 0;
    const limit = 3;
    
    function catMode() {
        let stylesheet = document.querySelector('#stylesheet');
    
        if (stylesheet.getAttribute('href') === '/css/stylesheet.css') {
            stylesheet.setAttribute('href', '/css/catmode.css');
        } else {
            stylesheet.setAttribute('href', '/css/stylesheet.css');
        }
    }
    
    toggleBtn.addEventListener('click', catMode);

    fetch('https://cataas.com/api/cats')
        .then((res) => {
            if (!res.ok) {
                throw new Error('Network response error. Needs a hug. And a cat.');
            }
            return res.json();
        })
        .then((data) => {
            catData = data;
            showMoreCats(); // to show the cats on load
        })
        .catch((error) => console.log(error));

    function showMoreCats() { // function to show more cats
        const endIndex = currentIndex + limit;
        const catsToDisplay = catData.slice(currentIndex, endIndex);

        catsToDisplay.forEach(cat => {
            const singleCat = document.createElement('li');
            const catImg = document.createElement('img');
            catImg.classList.add('single-cat');

            
            catImg.src = `https://cataas.com/cat/${cat._id}`;
            catImg.alt = cat.tags.join(', ');

            singleCat.appendChild(catImg);
            container.appendChild(singleCat);

            singleCat.addEventListener('click', () => openCat(catImg.src, catImg.alt))
        });
        currentIndex = endIndex;

        if (currentIndex >= catData.length) { // to handle when the show more button is visible
            showMoreButton.style.display = 'none';
        } else {
            showMoreButton.style.display = 'block';
        }

        showLessButton.style.display = currentIndex > limit ? 'block' : 'none';
    }

    function showLessCats() {
        const prevIndex = currentIndex - limit;
        if (prevIndex < limit) {
            return // prevent from going less than the limit (less than 6)
        }

        for (let i = 0; i < limit; i++) { //remove the last 'limit' number of cats - I need to work out remove cats so that it will not leave less than 6
            if (container.lastChild) {
                container.removeChild(container.lastChild);
            } 
        }
        currentIndex = prevIndex;

        showMoreButton.style.display = 'block';
        showLessButton.style.display = currentIndex > limit ? 'block' : 'none';
    }

    showMoreButton.addEventListener('click', showMoreCats);
    showLessButton.addEventListener('click', showLessCats);
    
    function openCat(src, alt) { //here i am trying to get a modal to open when an image is clicked on
        const catModal = document.createElement('div');
        catModal.classList.add('modal');
        catModal.style.display = 'block';

        const modalContent = document.createElement('div');
        modalContent.classList.add('modal-content');

        const modalImage = document.createElement('img');
        modalImage.src = src;
        modalImage.alt = alt;

        const closeModal = document.createElement('span');
        closeModal.classList.add('close');
        closeModal.innerHTML = '&times;';

        closeModal.addEventListener('click', () => {
            document.body.removeChild(catModal);
        });

        modalContent.appendChild(closeModal);
        modalContent.appendChild(modalImage);
        catModal.appendChild(modalContent);
        document.body.appendChild(catModal);
    }
});
