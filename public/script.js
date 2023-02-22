const modal = document.getElementById('modal');
const modalShow = document.getElementById('show-modal');
const modalClose = document.getElementById('close-modal');
const bookmarkForm = document.getElementById('bookmark-form');
const websiteNameEl = document.getElementById('website-name');
const websiteUrlEl = document.getElementById('website-url');
const bookmarksContainer = document.getElementById('bookmarks-container');

let bookmarks = [];

//show modal, focus on the input
function showModal() {
    modal.classList.add('show-modal');
    websiteNameEl.focus();
}

//handlel data from the form
function storeBookmark(e){
    e.preventDefault(); // so that the page doesn't just reset 
    const nameValue = websiteNameEl.value;
    let urlValue = websiteUrlEl.value;
    if (!urlValue.includes('https://') && !urlValue.includes('http://')) {
        urlValue = `https://${urlValue}`; 
   }
    if(!validate(nameValue, urlValue)) {
        return false;
    }
    const bookmark = {
        name: nameValue,
        url: urlValue,
    };
    bookmarks.push(bookmark);
    localStorage.setItem('bookmarks',JSON.stringify(bookmarks)); // localstorage only stores strings
    fetchBookmarks();
    bookmarkForm.reset();
    websiteNameEl.focus();
}

//Modal Event Listeners
modalShow.addEventListener('click', showModal);
modalClose.addEventListener('click', () => modal.classList.remove('show-modal'));
window.addEventListener('click', (e) => (e.target === modal ? modal.classList.remove('show-modal') : false));

//Validate form
function validate(nameValue, urlValue) {
    const expression = /(https)?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/g;
    const regex = new RegExp(expression);
    if (!nameValue || !urlValue) {
        alert('Please submit values in both fields');
        return false
    }
    if(!urlValue.match(regex)){
        alert('Please provide a valid web address');
        return false;
    }
    //Valid URL
    return true
}

//build bookmarks 
function buildBookmarks(){
    // due to appending need to remove 
    bookmarksContainer.textContent = '';
    //build items
    bookmarks.forEach((bookmark) => {
        const {name, url} = bookmark;
        // Item 
        const item = document.createElement('div');
        item.classList.add('item');
        //Close Icon
        const closeIcon = document.createElement('i');
        closeIcon.classList.add('fas', 'fa-times');
        closeIcon.setAttribute('title', 'Delete Bookmark');
        closeIcon.setAttribute('onclick', `deleteBookmark('${url}')`);
        // Favicon and Link container
        const linkInfo = document.createElement('div');
        linkInfo.classList.add('name');
        //Favicon
        const favicon = document.createElement('img');
        favicon.setAttribute('src',`https://s2.googleusercontent.com/s2/favicons?domain=${url}`);
        favicon.setAttribute('alt', 'Favicon');
        //Link
        const link = document.createElement('a');
        link.setAttribute('href', `${url}`);
        link.setAttribute('target', '_blank');
        link.textContent = name;
        //Append to bookmarks container
        linkInfo.append(favicon, link);
        item.append(closeIcon, linkInfo);
        bookmarksContainer.appendChild(item)
    });
}

//delete bookmark
function deleteBookmark(url){
    bookmarks.forEach((bookmark, i) => {
        if (bookmark.url === url) {
            bookmarks.splice(i, 1);
        }
    });
    //Update bookmarks array in localstorage, repopulate the dom
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    fetchBookmarks();
}

// Fetch bookmarks
function fetchBookmarks(){
    //get bookmarks from localstorage if available
    if (localStorage.getItem('bookmarks')) {
        bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
    } else {
        //create a bookmarks array in localstorage 
        bookmarks = [
            {
                name: 'testie',
                url: 'https://google.ca',
            },
        ];
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    }
    buildBookmarks();
}

// Event Listener
bookmarkForm.addEventListener('submit', storeBookmark);

//On Load, Fetch bookmarks
fetchBookmarks();