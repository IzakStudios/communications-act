class DebugLib {
    constructor(isEnabled) {
        this.isEnabled = isEnabled;
    }

    log (content) {
        if (!this.isEnabled) return;
        console.log(content)
    };
    space () {
        if (!this.isEnabled) return;
        console.log("");
    }
    progress (content) {
        if (!this.isEnabled) return;
        console.log(`⌛ ${content}`)
    };
    success (content) {
        if (!this.isEnabled) return;
        console.log(`✅ ${content}`)
    };
    error (content) {
        if (!this.isEnabled) return;
        console.log(`❌ ${content}`)
    };
}


const createPopup = async (title, description, inputCallback) => {
    const popupElement = document.getElementById("popup");
    const popupPanel = document.getElementById("popup-panel");

    popupElement.style = "opacity: 1;"

    popupPanel.getElementsByTagName("h2")[0].textContent = title;
    popupPanel.getElementsByTagName("p1")[0].textContent = description;

    popupPanel.getElementsByTagName("input")[0].style = "opacity: 0; pointer-events: none; transition: 0s" 
    popupPanel.getElementsByTagName("button")[0].style = "" 

    if (!inputCallback) {
        popupPanel.getElementsByTagName("button")[0].focus();
        return;
    }

    popupPanel.getElementsByTagName("button")[0].style = "opacity: 0; pointer-events: none;" 
    
    var hasEntered = false;
    
    popupPanel.getElementsByTagName("input")[0].value = "";
    popupPanel.getElementsByTagName("input")[0].style = "opacity: 1;"

    var answerQuestion = async (eventInfo) => { // memory leak, will fix later but i gtg 🔥 (I FIXED IT)
        eventInfo.preventDefault();

        if (eventInfo.keyCode === 13) {
            popupElement.style = "opacity: 0; pointer-events: none;"
            hasEntered = true;

            popupPanel.getElementsByTagName("input")[0].removeEventListener("keyup", answerQuestion, true);
        }
    }
    
    popupPanel.getElementsByTagName("input")[0].addEventListener("keyup", answerQuestion, true);
    popupPanel.getElementsByTagName("input")[0].focus();

    await (async() => {
        while(!hasEntered)
            await new Promise(resolve => setTimeout(resolve, 1));
    })();

    return popupPanel.getElementsByTagName("input")[0].value;
};

const confettiParticles = async () => {
    let emitter = await tsParticles.load({
        id: "particles",
        options: {
            "fpsLimit": 240,
            "fullScreen": {
                "zIndex": 1
            },
            "emitters": {
                "autoPlay": false,
                "name": "confetti",
                "position": {
                    "x": 50,
                    "y": 100
                },
                "rate": {
                    "quantity": {
                        "min": 50,
                        "max": 100,
                    },
                    "delay": {
                        "min": 0.02,
                        "max": 0.05,
                    }
                }
            },
            "particles": {
                "color": {
                    "value": [
                        "#FF0000",
                        "#FFFF00",
                        "#00FF00",
                        "#00FFFF",
                        "#0000FF",
                        "#FF00FF",
                    ]
                },
                "move": {
                    "decay": {
                        "min": 0.02,
                        "max": 0.05,
                    },
                    "direction": "top",
                    "enable": true,
                    "gravity": {
                        "enable": true
                    },
                    "outModes": {
                        "top": "none",
                        "default": "destroy"
                    },
                    "speed": {
                        "min": 50,
                        "max": 100
                    }
                },
                "number": {
                    "value": 0
                },
                "opacity": {
                    "value": 1
                },
                "rotate": {
                    "value": {
                        "min": 0,
                        "max": 360
                    },
                    "direction": "random",
                    "animation": {
                        "enable": true,
                        "speed": 30
                    }
                },
                "tilt": {
                    "direction": "random",
                    "enable": true,
                    "value": {
                        "min": 0,
                        "max": 360
                    },
                    "animation": {
                        "enable": true,
                        "speed": 30
                    }
                },
                "size": {
                    "value": 3,
                    "animation": {
                        "enable": true,
                        "startValue": "min",
                        "count": 1,
                        "speed": 16,
                        "sync": true
                    }
                },
                "roll": {
                    "darken": {
                        "enable": true,
                        "value": 25
                    },
                    "enlighten": {
                        "enable": true,
                        "value": 25
                    },
                    "enable": true,
                    "speed": {
                        "min": 5,
                        "max": 15
                    }
                },
                "wobble": {
                    "distance": 30,
                    "enable": true,
                    "speed": {
                        "min": -7,
                        "max": 7
                    }
                },
                "shape": {
                    "type": [
                        "circle",
                        "square"
                    ],
                    "options": {}
                }
            },
            "responsive": [{
                "maxWidth": 1024,
                "options": {
                    "particles": {
                        "move": {
                            "speed": {
                                "min": 33,
                                "max": 66
                            }
                        }
                    }
                }
            }]
        }
    });

    emitter.playEmitter("confetti");
    setTimeout(() => {emitter.pauseEmitter("confetti")}, 100);
}

class QuizLib {
    constructor(questions){
        this.questions = questions;
        this.answers = new Array(questions.length, false);

        this.questionsAnswered = 0;
        this.binds = [];
    };

    hashAnswer(answer){ // For creating the questions.
        return String(CryptoJS.SHA256(answer));
    };

    checkAnswer(hashedAnswer, inputtedAnswer) {
        return String(CryptoJS.SHA256(inputtedAnswer)) === hashedAnswer;
    };
    
    bindToQuestion(index, element) {
        this.binds[index] = element;
    };

    async answerQuestion(questionIndex) {
        let questionData = this.questions[questionIndex];
        
        if (this.questionsAnswered == this.questions.length){
            createPopup(questionData["question"], "You've already finished the quiz!");
            return;
        };

        if (questionIndex > this.questionsAnswered){
            createPopup("Slow Down!", "Please answer the previous questions first!");
            return;
        };

        if (questionData["isAnswered"]){
            createPopup(questionData["question"], "You've already answered this question!");
            return;
        };

        let userAnswer = await createPopup(questionData["question"], questionData["content"], true);
        if (!userAnswer) return;

        let isCorrect = this.checkAnswer(questionData["answer"], userAnswer.toLowerCase())

        if (isCorrect === false){
            createPopup("Uh Oh!", "You got this question incorrect!");
            return;
        };

        this.questionsAnswered++;

        if (this.questionsAnswered == this.questions.length){
            createPopup("Congrats!", "You've finished the quiz!");
            confettiParticles();
        } else {
            createPopup("Congrats!", "You got this question correct!");
        };

        questionData["isAnswered"] = true;

        if (this.binds[questionIndex]){
            this.binds[questionIndex].textContent = questionData["question"] + " ✅"
        }

        this.binds.forEach((element, index) => {
            let data = this.questions[index];

            if (index > this.questionsAnswered){
                element.textContent = data.question + " 🔒"
            } else {
                if (!data.isAnswered) {
                    element.textContent = data.question + " ❓"
                } else {
                    element.textContent = data.question + " ✅"
                }
            }
        })
    };
}

const LAW_CONTENT = `
The Communications Act is an Act of the United Kingdom Parliment.
The act was enforced on the 25th of July, 2003.

It is an act to confer functions on the Office of Communication.
To make provision about the regulation of the prevision of electronic communication networks and services, and the use of the electro-magnetic spectrum.
To make provision about the regulation of broadcasting and of the provision of television and radio services.
To make provision about mergers involving newspaper and other media enterprises and, in that connection, to ammend the Enterprise Act 2002, and for connected purposes.

The act consolidated the telecommunication and broadcasting regulators inside the UK.
This introduced Ofcom (Office of Communications) as the new industry regulator.

Aswell as other measures, the act introduced legal recognition of 'Community Radio' which allowed for full-time community radio services inside the UK.
Also, many restrictions on cross-media ownerships were lifted due to this act.

The act also made it illegal to use other people's Wi-Fi connections without gaining their permissions.
`

const Debug = new DebugLib(true);

const loadQuiz = async () => {
    var quizElement = document.getElementById("quiz") || quiz;
    if (!quizElement) {
        Debug.error("'quiz' element not found!");
        return;
    };

    Debug.progress("Loading Quiz...");
    
    var Quiz = new QuizLib([
        {
            "question": "Question 1",
            "content": "What year was the act enforced?",

            "answer": "77459b9b941bcb4714d0c121313c900ecf30541d158eb2b9b178cdb8eca6457e",
        },
        {
            "question": "Question 2",
            "content": "Who was introduced as the new regulator?",

            "answer": "f8812df5b31cb4355f91e551377020e7457a6c3cc440306b22147336697679de",
        },
    ])

    Quiz.questions.forEach(async (question, index) => {
        let element = document.createElement("button");

        element.classList.add("quiz-button");
        element.textContent = question.question + " ❓";
        
        if (index > 0) {
            element.textContent = question.question + " 🔒"
        }

        element.addEventListener("click", async () => {
            Quiz.answerQuestion(index);
        });

        quizElement.appendChild(element);
        Quiz.bindToQuestion(index, element);
    })
    
    Debug.success("Quiz Loaded!")
};

const loadContent = async () => {
    Debug.progress("Loading Content...")
    
    var contentElement = document.getElementById("content") || content;

    if (!contentElement) {
        Debug.error("'content' element not found!");
        return;
    };

    contentElement.innerText = LAW_CONTENT.slice(1, -1);

    Debug.success("Content Loaded!")
};

const loadPopup = async () => {
    Debug.progress("Loading Popup...")

    var popupElement = document.getElementById("popup");
    var popupPanel = document.getElementById("popup-panel");

    if (!popupPanel) {
        Debug.error("'popup-panel' element not found!");
        return;
    };

    popupPanel.getElementsByTagName("button")[0].addEventListener("click", async () => {
        popupElement.style = "opacity: 0; pointer-events: none;" 
    })

    popupElement.style = "opacity: 0; pointer-events: none;"

    Debug.success("Popup Loaded!")
};

const onWindowLoad = async () => {
    loadQuiz(); Debug.space();
    loadContent(); Debug.space();
    loadPopup(); Debug.space();
};

if (document.readyState === "complete" || document.readyState === "interactive") { onWindowLoad() }
else { window.addEventListener("load", onWindowLoad) };