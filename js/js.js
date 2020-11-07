// Переключение вариантов ответа
let labels = document.querySelectorAll(".radio-group label"),
    next_question_btn = document.getElementById('nxt_quest'),
    radio_group = document.querySelector(".radio-group"),
    choosed_variant = "",
    radios = document.querySelectorAll(".radio-group label input[type=radio]");
radios.forEach((item) => {
    item.addEventListener("click", (e) => {
        let target = e.target;
        for (i = 0; i < labels.length; i++) {
            labels[i].classList.remove("active");
        }
        target.closest("label").classList.add("active");

        choosed_variant = item.value;
        if (item.checked) {
            next_question_btn.removeAttribute('disabled', 'disabled');
        } else {
            choosed_variant = "";
            next_question_btn.setAttribute('disabled', 'disabled');
        }
    });
});
// Переключение вариантов ответа


// Получение данных из JSON с вопросами
const getData = async function (url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Ошибка по адресу ${url}, статус ошибки ${response.status}!`);
    }
    return await response.json();
};
const quiz_url = "https://raw.githubusercontent.com/MrGregor228/different-jsons/master/questions.json";

let total_amount = 0,
    correct_answer_amount = 0,
    total_amount_span = document.querySelector('.total__amount'),
    correct_answer_span = document.querySelector('.correct__answer'),

    question_number = document.querySelector('.question-number'),
    question = document.querySelector('.question'),

    answ = document.querySelectorAll('.radio-group label span'),   

    result_container = document.querySelector('.result'),
    result_span = document.querySelector('.result span'),

    num = 0;

function cleanFields() {
    result_container.style.display = "flex";
    setTimeout(()=>{
        result_container.style.height = '30vh';
        result_container.style.opacity = "1";
    }, 275);
    result_span.textContent = `${correct_answer_amount} / ${total_amount}`;
    radio_group.remove();
    question.remove();
    question_number.remove();
    next_question_btn.remove();
    document.querySelector('.next-question').remove();
}    

getData(quiz_url).then((data) => {
    for (let i = 0; i < data.length; i++) {
        total_amount = total_amount + +data[i].amount;
    }
    total_amount_span.textContent = total_amount;
    correct_answer_span.textContent = correct_answer_amount;
    answ.forEach((item, i) => {
        item.textContent = data[0].answers[i];
    });
    question_number.textContent = data[0].number;
    question.textContent = data[0].question;
    
    next_question_btn.addEventListener('click', () => { 
        
        if (num <= data.length) {
            if(data[num].right == choosed_variant) {
                correct_answer_amount = correct_answer_amount + +data[num].amount;
                correct_answer_span.textContent = correct_answer_amount;
            } 
        } else {
            setTimeout(()=>{
                cleanFields();
            }, 275);
        } 
        num++;
        if (num <= data.length - 1) {
            answ.forEach((item, i) => {
                item.textContent = data[num].answers[i];
            });
            question_number.textContent = data[num].number;
            question.textContent = data[num].question;
            for (i = 0; i < labels.length; i++) {
                labels[i].classList.remove("active");
                radios[i].checked = false;
            }           
            
            choosed_variant = "";
            next_question_btn.setAttribute('disabled', 'disabled');
            if (num == data.length - 1) {
                next_question_btn.textContent = "Завершити";
            }
            
        } else {
            setTimeout(()=>{
                cleanFields();
            }, 275);
        }        
    });
});