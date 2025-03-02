const version=6;
const cacheName=`staticCache-${version}`
let assets=[
    "/css/boxicon.css",
    "/css/style.css",
    "/imgs/about1.jpg",
    "/imgs/about2.jpg",
    "/imgs/background1.jpg",
    "/imgs/background2.jpg",
    "/imgs/background3.jpg",
    "/imgs/blog1.jpg",
    "/imgs/blog2.jpg",
    "/imgs/blog3.jpg",
    "/imgs/logo-alt.png",
    "/imgs/logo.png",
    "/imgs/perso1.jpg",
    "/imgs/perso2.jpg",
    "/imgs/team1.jpg",
    "/imgs/team2.jpg",
    "/imgs/team3.jpg",
    "/imgs/work1.jpg",
    "/imgs/work2.jpg",
    "/imgs/work3.jpg",
    "/imgs/work4.jpg",
    "/imgs/work5.jpg",
    "/imgs/work6.jpg",
    "/imgs/photos/1.jpg",
    "/imgs/photos/2.jpg",
    "/imgs/photos/3.jpg",
    "/js/app.js",
    "/index.html",
    "/manifest.json",
    "/sw.js",
]
// جلب الملفات الخارجية أثناء fetch وتخزينها في الكاش عند الطلب الأول فقط.

let externalAssets = [
    "https://fonts.googleapis.com/css2?family=Annie+Use+Your+Telescope&family=Aref+Ruqaa:wght@400;700&family=Bad+Script&family=Cairo:wght@200..1000&family=Open+Sans:ital,wght@0,300..800;1,300..800&family=Oswald:wght@200..700&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Rubik:wght@300..900&family=Work+Sans:ital@0;1&display=swap",
    "https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css",
    "https://unpkg.com/boxicons@2.1.4/fonts/boxicons.woff2",
    "https://unpkg.com/boxicons@2.1.4/fonts/boxicons.woff",
    "https://unpkg.com/boxicons@2.1.4/fonts/boxicons.ttf"
];

self.addEventListener('install',(ev)=>{
ev.waitUntil(
    caches.open(cacheName).then((cache)=>{
     return   cache.addAll(assets);
    }).catch((error)=>{
        console.warn(error)
    }).then(()=>{
        self.skipWaiting();    
    })

 
)

})


self.addEventListener('activate',(ev)=>{
    ev.waitUntil(
      
        caches.keys().then((keys)=>{
            return Promise.all( //map() لا يعمل هنا لأنه لا يُرجع Promise ويحتاج Promise.all() لتنفيذ الحذف بشكل صحيح
                keys.filter((key)=> key != cacheName).map(keys=>{
                    caches.delete(keys);
                }) 
            )
           
        })
    )
})


// self.addEventListener('fetch',(ev)=>{
//     ev.respondWith(
//         caches.match(ev.request).then((res)=>{
//             return res || fetch(ev.request)
//         }) .catch(() => {
//             console.warn("Failed to fetch:", ev.request.url);
//             return new Response("Network error", { status: 408 });
//         })
//     )

// })


self.addEventListener("fetch", (ev) => {
    ev.respondWith(
        caches.match(ev.request).then((cachedRes) => {
            if (cachedRes) return cachedRes; // إذا كان الملف في الكاش، استخدمه مباشرة

            return fetch(ev.request)
                .then((fetchRes) => {
                    if (!fetchRes || fetchRes.status !== 200 || fetchRes.type !== "basic") {
                        return fetchRes; // لا تخزن الردود غير الصالحة
                    }

                    let responseClone = fetchRes.clone();
                    caches.open(cacheName).then((cache) => {
                        cache.put(ev.request, responseClone);
                    });

                    return fetchRes;
                })
                .catch(() => {
                    console.warn("Failed to fetch:", ev.request.url);
                    return caches.match("/offline.html"); // عرض صفحة خطأ بديلة
                });
        })
    );
});


// self.addEventListener('fetch',(fetchreq)=>{
//     fetchreq.respondWith(
//         caches.match(fetchreq.request).then((res)=>{
//             if(res) return res

//             return fetchreq(fetchreq.request);



//         }).then((fetchres)=>{
//             if(!fetchres || fetchres.status !== 200){
//                 return fetchres;
//             }

//             let resposeclone=fetchres.clone();
//             caches.open(cacheName).then((cache)=>{
//                 cache.put(fetchreq.request,resposeclone)
//             })

//             return fetchres;
//         }).catch(error=>{
//             console.log('خطأ في رجوع الداتا من النت ',error)
//         })
//     )
// })



// !!!!! شرح جزء تاني مفصل 
// v.respondWith(
//     caches.match(ev.request).then((res) => {
//         if (res) return res; // إذا كان الملف في الكاش، استخدمه مباشرة

//         return fetch(ev.request)
//             .then((fetchRes) => {
//                 if (!fetchRes || fetchRes.status !== 200 || fetchRes.type !== "basic") {
//                     return fetchRes; // لا نخزن الردود غير الصالحة (مثل الملفات الخارجية)
//                 }

//                 let responseClone = fetchRes.clone();
//                 caches.open(cacheName).then((cache) => {
//                     cache.put(ev.request, responseClone);
//                 });

//                 return fetchRes;
//             })
//             .catch(() => {
//                 console.warn("Failed to fetch:", ev.request.url);
//                 return caches.match("/offline.html"); // عرض صفحة خطأ بديلة
//             });
//     })
// );
// }); اشرحلي دا بالتفصيل هيعمل اي 


// منع Service Worker المتصفح من تحميل الملف بالطريقة العادية. ev.respondWith(

    // caches.match(ev.request).then((res) => {
        // if (res) return res; // إذا كان الملف في الكاش، استخدمه مباشرة


        // جلب الملف من الإنترنت إذا لم يكن في الكاش
        // return fetch(ev.request)


        // بعد تحميل الملف بنجاح، يتم التأكد أنه ملف صالح للتخزين.
// ✔ يجب أن يكون حالة الرد (status) تساوي 200 (تم التحميل بنجاح).
// ✔ يجب أن يكون الملف من نفس الأصل (type: "basic") وليس من موقع خارجي (Google Fonts, Boxicons).
// ✔ إذا لم يكن الملف صالحًا، يتم إعادته بدون تخزينه.


        // .then((fetchRes) => {
            // if (!fetchRes || fetchRes.status !== 200 || fetchRes.type !== "basic") {
                // return fetchRes; // لا نخزن الردود غير الصالحة (مثل الملفات الخارجية)
            // }


            // وضع الملف في الكاش
            // يتم إنشاء نسخة (clone()) من الاستجابة حتى لا يتم استهلاكها قبل التخزين.
            // يتم فتح الكاش (caches.open(cacheName)) وإضافة الملف إلى التخزين (cache.put
            // هذا يسمح لنا باستخدامه لاحقًا دون الحاجة إلى تحميله مرة أخرى من الإنترنت.
            // let responseClone = fetchRes.clone();
            // caches.open(cacheName).then((cache) => {
                // cache.put(ev.request, responseClone);
            // });




            // إذا حدث خطأ أثناء تحميل الملف (fetch فشل)، يتم تنفيذ catch().
// ✔ يتم طباعة رسالة خطأ في console.
// ✔ يتم إرجاع صفحة بديلة (offline.html) بدلاً من إظهار خطأ فارغ للزائر.

            // .catch(() => {
                // console.warn("Failed to fetch:", ev.request.url);
                // return caches.match("/offline.html"); // عرض صفحة خطأ بديلة
            // });