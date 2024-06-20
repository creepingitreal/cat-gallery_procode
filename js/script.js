document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.querySelector('.toggle-button');
    const errorMessage = document.querySelector('#error-message');
    const container = document.querySelector('.cat-container');
    const showMoreButton = document.querySelector('#show-more');
    const showLessButton = document.querySelector('#show-less');
    const searchBar = document.querySelector('#search-bar');
    const catSurprise = document.getElementById('cat-surprise');
    const supriseButton = document.getElementById('surprise-button');

    let catData = [];
    let currentIndex = 0;
    const limit = 3;

    catSurprise.setAttribute('tabindex', '0'); //the internet said to try this so that the escapt key would work   
    
    function catMode() {
        let stylesheet = document.querySelector('#stylesheet');
    
        if (stylesheet.getAttribute('href') === '/css/stylesheet.css') {
            stylesheet.setAttribute('href', '/css/catmode.css');
        } else {
            stylesheet.setAttribute('href', '/css/stylesheet.css');
        }
    }
    
    toggleBtn.addEventListener('click', catMode);

    function fetchAllCats() {fetch('https://cataas.com/api/cats')
        .then((res) => {
            if (!res.ok) {
                throw new Error('Network response error. Needs a hug. And a cat.'); //error message displayed in console
            }
            return res.json();
        })
        .then((data) => {
            catData = data;
            showMoreCats(); // to show the cats on load
        })  
        .catch((error) => {
            console.log(error)
            displayError('Cats failed to load. Please try again later.'); //display error to user
            });
    }

    fetchAllCats();

    function displayError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        errorMessage.style.padding = '30px';
        }

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

            singleCat.addEventListener('click', () => openCat(catImg.src, catImg.alt)); //event listening in this function so that if a single image is clicked on it will open it in a modal
        
        });
        currentIndex = endIndex;

        if (currentIndex >= catData.length) { // to handle when the show more button is visible
            showMoreButton.style.display = 'none';
        } else {
            showMoreButton.style.display = 'block';
        }

        showLessButton.style.display = currentIndex > limit ? 'block' : 'none'; //display button if the current index is bigger than 3
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
    
    function openCat(src, alt) { // Modal to view the inndividual cat image from the gallery, with a share button that will offer the user the option to copy the image URL to share
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

        const shareButton = document.createElement('button');
        shareButton.classList.add('share-button')
        shareButton.textContent = 'Share cat';

        shareButton.addEventListener('click', () => shareCat(src));

        closeModal.addEventListener('click', () => {
            document.body.removeChild(catModal);
        });

        modalContent.appendChild(closeModal);
        modalContent.appendChild(modalImage);
        modalContent.appendChild(shareButton);
        catModal.appendChild(modalContent);
        document.body.appendChild(catModal);
    }

    function shareCat(src) { //added basic share function to copy the cat image url so that the user can share the image (cat people love to tell people about the cats they're looking at)
        const shareText = `Check out this cat: ${src}`;
        if (navigator.share) {
            navigator.share({
                title: 'Cat Share!',
                text: shareText,
                url: src
            })
            .catch((error) => console.log('Sharing failed', error));
        } else {
            navigator.clipboard.writeText(shareText)
                .then(() => alert('Cat URL copied to clipboard!'))
                .catch((error) => console.log('Share failed', error));
        }
    }

    searchBar.addEventListener('input', () => {
        const query = searchBar.value.toLowerCase();
        filterCatsBytag(query);
    })

    function filterCatsBytag(query){
        container.innerHTML = ''; //empty container
        currentIndex = 0;

        if(query.trim() === '' ){ //to reset to fetch all cats if the input field is cleared 
            catData = []; //clear catData if the input is cleared

            fetchAllCats();

        } else {
            currentIndex = 0;
            const filteredCats = catData.filter(cat => cat.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase())));
            catData = filteredCats;
            showMoreCats();
        }
        
    }

    supriseButton.addEventListener('click', () => {
        catSurprise.style.display = 'block';
        catSurprise.focus(); //using focus as the escape key was not working
    })

    catSurprise.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            catSurprise.style.display = 'none';
        }
    })
});
