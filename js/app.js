var install=document.getElementById('install');
// وانا مديله display:none;

let deferredPrompt;

// اول حدث
// حدث موجود 
window.addEventListener('beforeinstallprompt',(installevent)=>{
    installevent.preventDefault();
    // الايفنت ده معناه اللي هيجصل جواه قبل تنزيل الابليكشن 
    // طول ماهو شغال قبل تنزيل الابليكشن 
    // اظهر العنصر 
    // قبله عايزه يظهر 
    install.style.display='inline-block'
    // عايز اخزن الحدث دا قبل الكلك 
    deferredPrompt=installevent; // هيشل الحدث 

})


install.addEventListener('click',()=>{
    if(deferredPrompt){ // اذا كان حدث التثبيت متاحا 

        deferredPrompt.prompt(); // شغل مطالبه التثبيت 
        // ثم اعيد نتيجه اختيار المستخدم 

        deferredPrompt.userChoice.then((result)=>{
            // نتيجه الاختيار
            // outcome تحتوي علي كائن 
            // به تحديد وافق ولا لاء "accepted"
            // او dismissed
            if(result.outcome  === "accepted"){
                console.log('يتم الان التثبيت')
                install.style.display='none'
            }else{
                console.log("رفض التثبيت ")
            }
        })


    }
})



// !!!! اشغل الابلكشن اوف لاين 

if("serviceWorker" in navigator){
    navigator.serviceWorker.register('/sw.js').then((reg)=>{

        console.log("Register Services Worker")

    }).catch(error=>{
        console.warn(error)
    })
}


