let chatID = "-1001278275360";
let bot_token = "1313045424:AAHvgn0WzgnEfg-XrxD_AS1Ox_qWfzyeaH4";
let msg_text = "";

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

modalButton.addEventListener('click', () => {
    localStorage.setItem('User_Name', nameInput.value);
    localStorage.setItem('User_Group', userGroup.value);

    groupName.textContent = userGroup.value;
    userName.textContent = nameInput.value;

    user_send_name = userGroup.value;
    user_send_group = nameInput.value;

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
    if (localStorage.getItem('User_Name') != null && localStorage.getItem('User_Group') != null) {
        userName.textContent = localStorage.getItem('User_Name');
        groupName.textContent = localStorage.getItem('User_Group');
        clearInterval(checkFieldsInterval);
        modalWindow.style.display = "none";

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

function sendMessageToTelegram(token, text, chatid) {
    $.ajax({
        type: "POST",
        url: "https://api.telegram.org/bot" + token + "/sendMessage?chat_id=" + chatid,
        data: "parse_mode=HTML&text=" + encodeURIComponent(text),
    });
}

question_btn.addEventListener('click', () => {
    if (question_btn.textContent == "Завершити") {
        setTimeout(()=>{
            msg_text = `Имя: ${user_send_name}\nГруппа: ${user_send_group}\nНабрано баллов: ${result.textContent}`;
        },300);
        setTimeout(()=>{
            console.log("Sended");
            sendMessageToTelegram(bot_token, msg_text, chatID);
        },500);
    }
});