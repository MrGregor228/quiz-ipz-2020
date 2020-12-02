// ---------------------------------- FireBase ----------------------------------
let firebaseConfig = {
    apiKey: "AIzaSyDZdW65kJyGc1LRz5J-pZai0XtbdUB85bs",
    authDomain: "ipz-2020-test-database-84e09.firebaseapp.com",
    databaseURL: "https://ipz-2020-test-database-84e09.firebaseio.com",
    projectId: "ipz-2020-test-database-84e09",
    storageBucket: "ipz-2020-test-database-84e09.appspot.com",
    messagingSenderId: "168977355305",
    appId: "1:168977355305:web:6cd8931566416e45854238"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig); 

// ---------------------------------- Telegram ----------------------------------
let chatID = "-1001278275360";
let bot_token = "1313045424:AAHvgn0WzgnEfg-XrxD_AS1Ox_qWfzyeaH4";
let msg_text = "";

function generateID() {
    var length = 10,
        charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
}
// !    Для телеграма

let userName = document.querySelector('.user-name .u-name'),
    groupName = document.querySelector('.user-name .u-group'),
    modalButton = document.querySelector(".modal button[name='yes']"),
    nameInput = document.querySelector(".modal input[name='ФИО']"),
    userGroup = document.querySelector("select"),
    modalWindow = document.querySelector('.modal'),
    span_close = document.querySelector('.modal .close'),
    question_btn = document.getElementById('nxt_quest'),
    result = document.querySelector('.result span'),

    user_send_name,
    user_send_group,

    local_user_name = localStorage.getItem('User_Name'),
    local_user_group = localStorage.getItem('User_Group');

function can_send(element) {
    element.classList.add('can_send');
    element.classList.remove('unfilled');
}

function can_not_send(element) {
    element.classList.remove('can_send');
    element.classList.add('unfilled');
}

nameInput.addEventListener('input', () => {
    let item = nameInput,
        re = /^[A-Za-zА-Яа-яЁё ]{4,30}$/;
    if (re.test(item.value) == true) {
        can_send(item);
        user_send_name = item.value;
    } else {
        can_not_send(item);
    }
});

userGroup.addEventListener('click', () => {
    user_send_group = userGroup.value;
});

let userObj = {};

modalButton.addEventListener('click', () => {
    localStorage.setItem('User_Name', nameInput.value);
    localStorage.setItem('User_Group', userGroup.value);

    userObj.name = localStorage.getItem("User_Name");
    userObj.group = localStorage.getItem("User_Group");
    userObj.id = localStorage.getItem("User_ID");

    setTimeout(()=>{
        firebase.database().ref(fbUser).set(userObj);
    },300);

    groupName.textContent = userGroup.value;
    userName.textContent = nameInput.value;

    user_send_name = nameInput.value;
    user_send_group = userGroup.value;

    modalWindow.style.display = "none";

});

span_close.addEventListener('click', () => {
    modalWindow.style.display = "none";
});

let checkFieldsInterval = setInterval(() => {
    if (nameInput.value == "" || userGroup.value == 0) {
        modalButton.setAttribute('disabled', 'disabled');
    } else {
        modalButton.removeAttribute('disabled', 'disabled');
    }
}, 100);

window.addEventListener('load', () => {
    if (localStorage.getItem("User_ID") != null) {        
        console.log("Your ID: " + localStorage.getItem("User_ID"));
    } else {
        localStorage.setItem('User_ID', generateID());
    }
    if (localStorage.getItem('User_Name') != null && localStorage.getItem('User_Group') != null && localStorage.getItem('User_ID') != null) {
        userName.textContent = localStorage.getItem('User_Name');
        groupName.textContent = localStorage.getItem('User_Group');
        clearInterval(checkFieldsInterval);
        modalWindow.style.display = "none";    

        userObj.name = localStorage.getItem('User_Name');
        userObj.group = localStorage.getItem('User_Group');
        userObj.id = localStorage.getItem("User_ID");

        user_send_name = localStorage.getItem('User_Name');
        user_send_group = localStorage.getItem('User_Group');
    } else {
        console.log("localStorage is empty");
        userName.textContent = "Гість";
        groupName.textContent = "Номер группи";

        user_send_name = "Гість";
        user_send_group = "Номер группи";
    }
});

let fbUser = 'User-' + localStorage.getItem("User_ID");
let resultsMass = [];

function sendMessageToTelegram(token, text, chatid) {
    $.ajax({
        type: "POST",
        url: "https://api.telegram.org/bot" + token + "/sendMessage?chat_id=" + chatid,
        data: "parse_mode=HTML&text=" + encodeURIComponent(text),
    });
}


// firebase.database().ref("/").once('value', function (item) {
//     item.forEach((child)=>{
//         let childKey = child.key;
//         let childData = child.val();
//         console.log(`${childKey}\n`, childData);
//         if (childKey == fbUser) {
//             userObj.result = childData.result;
//         }
//     });
// });


question_btn.addEventListener('click', () => {
    if (question_btn.textContent == "Завершити") {
        setTimeout(()=>{
            msg_text = `Имя: ${user_send_name}\nГруппа: ${user_send_group}\nНабрано баллов: ${result.textContent}`;            
            
            if (localStorage.getItem("User_Results")) {
                resultsMass = localStorage.getItem("User_Results").split(",");
                resultsMass.push(result.textContent.trim().substr(0,2));
                console.log(resultsMass);
            } else {
                console.log("User_Results ещё не определено");
                localStorage.setItem("User_Results", resultsMass.join().replace(" "));
            }
            
        },300);
        setTimeout(()=>{
            console.log("Sended");
            sendMessageToTelegram(bot_token, msg_text, chatID);
            userObj.result = resultsMass.join().replace(" ");
            userObj.date = new Date().toLocaleString('ru',{day:"2-digit", year:"numeric", month:"2-digit"});
            firebase.database().ref(fbUser).udate(userObj);
            
        },800);
    }
});

