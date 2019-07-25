
//install service worker
self.addEventListener('install', evt => {
    console.log('service worker installed!')
})

//activate service worker
self.addEventListener('activate', evt => {
    console.log('service worker activated')
})

//fetch event
self.addEventListener('fetch', evt => {
    console.log('fetch event', evt)
})