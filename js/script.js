const container = document.querySelector(".cat-container");

fetch('https://cataas.com/api/cats')
    .then((res) => {
        if(!res.ok) {
            throw new Error('Network response error. Needs a hug. And a cat.')
        } 
        return res.json();
    }) 
    .then((catData) => {
        console.log(catData);
        getCats(catData);
    })
    .catch((error) => console.log(error));

    function getCats (catData) {
        catData.forEach(cat => {
            const singleCat = document.createElement('li'); //creating a li item to append to the ul
            const catImg = document.createElement('img');
            catImg.setAttribute('max-height', '300px');
            catImg.setAttribute('width', 'auto');
            catImg.setAttribute('object-fit', 'contain')
            
            catImg.src = `https://cataas.com/cat/${cat._id}`;
            catImg.alt = cat.tags.join(', '); // adding alt text for the images generated

            singleCat.appendChild(catImg);
            container.appendChild(singleCat);
        }) 
    }