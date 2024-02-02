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


const createPopup = async (Title, Description) => {
    const popupPanel = docmuent.getElementById("popup-panel")

};

class QuizLib {
    constructor(questions){
        this.questions = questions;
        this.answers = new Array(questions.length, false);
    };

    hashAnswer(answer){
        return String(CryptoJS.SHA256(answer));
    };
    checkAnswer(hashedAnswer, inputtedAnswer) {
        return String(CryptoJS.SHA256(inputtedAnswer)) === hashedAnswer;
    };
    answerQuestion(questionIndex) {
        let questionData = this.questions[questionIndex];
        if (questionData["isAnswered"]){ // If the question is already answered.
            window.alert("You've already answered this question!");
            return;
        };

        let userAnswer = window.prompt(questionData["content"], "");
        if (!userAnswer) return; // If the user inputs nothing.

        let isCorrect = this.checkAnswer(questionData["answer"], userAnswer.toLowerCase())

        if (isCorrect === false){
            window.alert("Incorrect Answer!");
            return;
        };

        questionData["isAnswered"] = true;
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
            "content": "What is the opposite of 'Goodbye'?",

            "answer": "2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824",
        },
        {
            "question": "Question 1",
            "content": "What is the opposite of 'Goodbye'?",

            "answer": "2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824",
        },
    ])

    Quiz.questions.forEach(async (question, index) => {
        let element = document.createElement("button");
        element.classList.add("quiz-button");
        element.textContent = question["question"];
        
        element.addEventListener("click", async () => {
            Quiz.answerQuestion(index);
        });

        quizElement.appendChild(element);
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

const onWindowLoad = async () => {
    loadQuiz(); Debug.space();
    loadContent(); Debug.space();
};

if (document.readyState === "complete" || document.readyState === "interactive") { onWindowLoad() }
else { window.addEventListener("load", onWindowLoad) };