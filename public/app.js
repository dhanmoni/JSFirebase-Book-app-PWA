
const bookList = document.querySelector('#bookList')

const addBook = document.querySelector('.addBook')

const modal = document.querySelector('.modal')

const headerSection = document.querySelector('.header')

const bookListContainerSection = document.querySelector('.bookListContainer')

const addBookSection = document.querySelector('.addBook')

const mainSection = document.querySelector('.main')

const cancelButton = document.querySelector('.cancel')

const saveButton = document.querySelector('.save')

const bookForm = document.querySelector('#bookForm')

const errorMsg = document.querySelector('#errorMsg')

const deviceWidth = window.matchMedia("(max-width: 500px)")

//Action on clicking add new book...
addBook.addEventListener('click', (e) => {
    //console.log('button clicked...')
    if (deviceWidth.matches) {
        modal.style.animation = 'showModalSp 0.45s ease-in-out forwards';
    } else {
        modal.style.animation = 'showModal 0.5s ease-in-out forwards';
    }
    headerSection.style.filter = 'blur(2px)'
    bookListContainerSection.style.filter = 'blur(2px)'
    addBookSection.style.filter = 'blur(2px)'
    // headerSection.style.backgroundColor = '#333'
    // bookListContainerSection.style.backgroundColor = '#333'
    // addBookSection.style.backgroundColor = '#333'
    // mainSection.style.backgroundColor = 'rgba(0,0,0,0.1)';
    //mainSection.style.filter = 'blur(2px)'
})

//Action on clicking cancel...
cancelButton.addEventListener('click', () => {

    bookForm["book"].value = "";
    bookForm["author"].value = "";
    errorMsg.style.display = 'none'
    bookForm["book"].classList.remove("bookError");
    bookForm["author"].classList.remove("authorError");
    if (deviceWidth.matches) {
        modal.style.animation = 'hideModalSp 0.45s ease-in-out forwards';
    } else {
        modal.style.animation = 'hideModal 0.5s ease-in-out forwards';
    }
    headerSection.style.filter = 'blur(0px)'
    bookListContainerSection.style.filter = 'blur(0px)'
    addBookSection.style.filter = 'blur(0px)'
})


//Action on clicking save...
saveButton.addEventListener('click', () => {

    let bookVal = bookForm["book"].value
    let authorVal = bookForm["author"].value

    console.log(bookVal.length)
    console.log(typeof authorVal)

    if (bookVal.trim().length < 1 && authorVal.trim().length < 1) {
        console.log('error in value')
        // bookForm["book"].addClass('bookError')
        bookForm["book"].classList.add("bookError");
        bookForm["author"].classList.add("authorError");
        errorMsg.style.display = 'block'

    }
    else if (authorVal.trim().length < 1) {
        console.log('error in author value')
        bookForm["author"].classList.add("authorError");
        errorMsg.style.display = 'block'
    }
    else if (bookVal.trim().length < 1) {
        console.log('error in book value')
        bookForm["book"].classList.add("bookError");
        errorMsg.style.display = 'block'
    }
    else {
        db.collection("Books").add({
            BookName: bookVal,
            Author: authorVal
        });
        bookForm["book"].value = "";
        bookForm["author"].value = "";
        errorMsg.style.display = 'none'
        bookForm["book"].classList.remove("bookError");
        bookForm["author"].classList.remove("authorError");
        if (deviceWidth.matches) {
            modal.style.animation = 'hideModalSp 0.45s ease-in-out forwards';
        } else {
            modal.style.animation = 'hideModal 0.5s ease-in-out forwards';
        }
        headerSection.style.filter = 'blur(0px)'
        bookListContainerSection.style.filter = 'blur(0px)'
        addBookSection.style.filter = 'blur(0px)'
    }


})


//Render book after fetching...

const renderBook = (doc) => {
    let li = document.createElement('li');
    let bookName = document.createElement('span')
    let authorName = document.createElement('span')
    let cross = document.createElement('div');

    li.setAttribute('id', doc.id);
    bookName.textContent = doc.data().BookName;
    authorName.textContent = doc.data().Author;
    cross.textContent = 'X'

    li.appendChild(bookName);
    li.appendChild(authorName)
    li.appendChild(cross)

    bookList.appendChild(li)

    cross.addEventListener('click', (e) => {
        e.stopPropagation();
        let id = e.target.parentElement.getAttribute('id');
        db.collection('Books').doc(id).delete();
    });
}

// Get books from firestore!!!

db.collection('Books').orderBy('BookName').onSnapshot((snapshot) => {
    let changes = snapshot.docChanges()
    changes.forEach(change => {
        if (change.type === 'added') {
            renderBook(change.doc)
        } else if (change.type === 'removed') {
            let item = document.getElementById(change.doc.id);
            item.parentNode.removeChild(item);
        }
    })
})

// Register service worker.
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((reg) => console.log('Service worker registered.', reg))
            .catch((err) => console.log('Something went wrong!', err))
    });
}