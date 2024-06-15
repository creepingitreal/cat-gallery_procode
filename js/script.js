// const toggleBtn= document.getElementsByClassName('toggle-button');
document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.cat-container');
    const loadMoreButton = document.querySelector('#load-more');
    let catData = [];
    let currentIndex = 0;
    const limit = 6;

    fetch('https://cataas.com/api/cats')
        .then((res) => {
            if (!res.ok) {
                throw new Error('Network response error. Needs a hug. And a cat.');
            }
            return res.json();
        })
        .then((data) => {
            catData = data;
            displayCats();
        })
        .catch((error) => console.log(error));

    function displayCats() {
        const endIndex = currentIndex + limit; // 0 + 6 to limit images to 6
        const catsToDisplay = catData.slice(currentIndex, endIndex); // slices the array to get the next set of images

        catsToDisplay.forEach(cat => {
            const singleCat = document.createElement('li'); // creating a li item to append to the ul
            const catImg = document.createElement('img');
            
            catImg.src = `https://cataas.com/cat/${cat._id}`;
            catImg.alt = cat.tags.join(', '); // adding alt text for the images generated

            singleCat.appendChild(catImg);
            container.appendChild(singleCat);
        });
        currentIndex = endIndex; // updates the current index with where we are in the array

        if (currentIndex >= catData.length) {
            loadMoreButton.style.display = 'none';
        }
    }

    loadMoreButton.addEventListener('click', displayCats);
});


// function toggleMode() {
//     toggleBtn.addEventListener('click', () => {
//         const background = document.getElementsByName('body');

//         background.classList.toggle('.cat-mode');
//     })
// }