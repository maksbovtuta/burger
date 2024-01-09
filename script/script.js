document.addEventListener('DOMContentLoaded', function(){
    const btnOpenModal = document.querySelector('#btnOpenModal');
    const modalBlock = document.querySelector('#modalBlock');
    const closeModal = document.querySelector('#closeModal');
    const questionTitle = document.querySelector('#question');
    const formAnswers = document.querySelector('#formAnswers');
    const nextButton = document.querySelector('#next');
    const prevButton = document.querySelector('#prev');
    const sendButtton = document.querySelector('#send');

 

    // axios.get('https://testburger-f083b-default-rtdb.europe-west1.firebasedatabase.app/questions.json')
    // .then(response => {
    //     // Обработка полученных данных
    //     console.log('Ответ от Firebase Database:', response.data);
    //     // Здесь можно обрабатывать полученные вопросы и ответы
    // })
    // .catch(error => {
    //     console.error('Ошибка при запросе к Firebase Database:', error);
    // });


    //функция получения данных
    // const getData = () => {
    //     formAnswers.textContent = 'LOAD';

    //     setTimeout(() => {
    //         // playTest();
    //         fetch('./questions.json')
    //         .then(res => res.json())
    //         .then(obj => playTest(obj.questions))
    //         .catch(err => {
    //             formAnswers.textContent = 'Ошибка загрузки данных';
    //             console.error(err)
            
    //         })
    //     }, 1000)
    // }

    const getDataFromFirebase = () => {
        axios.get('https://testburger-f083b-default-rtdb.europe-west1.firebasedatabase.app/questions.json')
            .then(response => {
                
                console.log('Ответ от Firebase Database:', response.data);
                const questionsFromFirebase = response.data; 

                
                playTest(questionsFromFirebase);
            })
            .catch(error => {
                console.error('Ошибка при запросе к Firebase Database:', error);
            });
    }




    btnOpenModal.addEventListener('click', () => {
        modalBlock.classList.add('d-block');
        // getData();
        getDataFromFirebase();
    })

    closeModal.addEventListener('click', () => {
        modalBlock.classList.remove('d-block');
    })

    const playTest = (questions) => {

        const finalAnswers = [];

        let numberQuestion = 0;

        const renderAnswers = (index) => {
            questions[index].answers.forEach((answer) => {
                const answerItem = document.createElement('div');
                answerItem.classList.add('answers-item', 'd-flex', 'justify-content-center');

                answerItem.innerHTML = `
                    <input type="${questions[index].type}" id="${answer.title}" name="answer" class="d-none" value="${answer.title}">
                    <label for="${answer.title}" class="d-flex flex-column justify-content-between">
                        <img class="answerImg" src="${answer.url}" alt="burger">
                        <span>${answer.title}</span>
                    </label>
                `;

                formAnswers.appendChild(answerItem);
            })

            sendButtton.onclick = () => {
                checkAnswer();
    
                
                const phoneNumber = document.querySelector('#numberPhone').value;
    
                
                axios.post('https://testburger-f083b-default-rtdb.europe-west1.firebasedatabase.app/phoneNumbers.json', {
                    phoneNumber: phoneNumber
                })
                .then(response => {
                    console.log('Номер телефона успешно отправлен в базу данных Firebase:', response.data);
                })
                .catch(error => {
                    console.error('Ошибка при отправке номера телефона в Firebase Database:', error);
                });
    
                numberQuestion++;
                renderQuestion(numberQuestion);
                console.log(finalAnswers);
            }
        };

        const renderQuestion = (indexQuestion) => {
            formAnswers.innerHTML = '';
        
            switch (true) {
                case (numberQuestion >= 0 && numberQuestion <= questions.length - 1):
                    questionTitle.textContent = questions[indexQuestion].question;
                    renderAnswers(indexQuestion);
        
                    nextButton.classList.remove('d-none');
                    prevButton.classList.remove('d-none');
                    sendButtton.classList.add('d-none');
                    break;
                
                case (numberQuestion === 0):
                    prevButton.classList.add('d-none');
                    break;
                
                case (numberQuestion === questions.length):
                    nextButton.classList.add('d-none');
                    prevButton.classList.add('d-none');
                    sendButtton.classList.remove('d-none');
                    formAnswers.innerHTML = `
                        <div class="form-group">
                            <label for="numberPhone">Enter your number</label>
                            <input type="phone" class="form-control" id="numberPhone">
                        </div>
                    `;
                    break;
                
                case (numberQuestion === questions.length + 1):
                    formAnswers.textContent = 'Спасибо за пройденный тест!';
                    setTimeout(() => {
                        modalBlock.classList.remove('d-block');
                    }, 2000);
                    break;
                
                default:
                    break;
            }
        };
        

        renderQuestion(numberQuestion);

        const checkAnswer = () => {
            
            const obj = {};

            const inputs = [...formAnswers.elements].filter((input) => input.checked || input.id === 'numberPhone');

           

            inputs.forEach((input, index) => {
                if(numberQuestion >= 0 && numberQuestion <= questions.length - 1){
                    obj[`${index}_${questions[numberQuestion].question}`] = input.value;
                }

                if(numberQuestion === questions.length) {
                    obj['Номер телефона'] = input.value;
                }
            })
 
            finalAnswers.push(obj);
            
        }

        nextButton.onclick = () => {
            checkAnswer();

            numberQuestion++;
            renderQuestion(numberQuestion);
        }
        prevButton.onclick = () => {
            numberQuestion--;
            renderQuestion(numberQuestion);
        }

        sendButtton.onclick = () => {
            checkAnswer();
            numberQuestion++;
            renderQuestion(numberQuestion);
            console.log(finalAnswers);
        }
    };
});
