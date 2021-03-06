let jContent;

let nOfQuestions = 3;
let aQuestionsNames = [];
let aQuestionSet = [];
let jQuestionSet=JSON.parse('{"Questions":{}}');


function fetchJson(){
    fetch("http://localhost:63342/examTopics/awsCloudPractitioner.json")
        .then((res)=>res.json())
        .then(output=>{
            jContent = output;
            fillAQuestionNames();
            determineQuestionSet();
            typeQuestionSet(jQuestionSet, 0);
        })
}


function typeQuestionSet(jQuestionSet, index){
    let questionHTML = '<div id="questions"><h1>Question: '+(index+1)+'/'+nOfQuestions+'</h1>';

    let question =aQuestionsNames[aQuestionSet[index]];

    let answers = "";
    document.getElementById('output').innerHTML = '';
    questionHTML+='<form name="'+question+'" />';
    questionHTML+='<h4>'+question+'</h4>';
    let questionText = '<h3>'+jQuestionSet.Questions[question].question+'</h3>';
    questionHTML+=questionText;
    for (answer in jQuestionSet.Questions[question].answers){
        (function (answer) {
            if (countPropAnswers(jQuestionSet, question) > 1) {
                answers = composeCheckboxAnswer(question, answers, answer);
            } else {
                answers = composeRadiobuttonAnswer(question, answers, answer);
            }
        }).call(this, answer);
    };
    answers += "</br>";
    questionHTML+=answers;
    if(index == 0) {
        questionHTML+='<input type="button" value="next question" onclick="next(\'' + question + '\',\'' + index + '\')"/>';
    }
    else if(index > 0 && index < Object.keys(jQuestionSet.Questions).length-1) {
        questionHTML+='<input type="button" value="previous question" onclick="previous(\'' + question + '\',\'' + index + '\')"/>';
        questionHTML+='<input type="button" value="next question" onclick="next(\'' + question + '\',\'' + index + '\')"/>';
    }  else {
        questionHTML+='<input type="button" value="previous question" onclick="previous(\'' + question + '\',\'' + index + '\')"/>';
        questionHTML+='<input type="submit" value="finish test" onclick="return finish(\'' + question + '\')"/>';
    }
    questionHTML+="</form></div>";

    document.getElementById('output').innerHTML = questionHTML;
}

function fillAQuestionNames(){
    console.log("hello");
    for(question in jContent.Questions){
        aQuestionsNames.push(question);
    }
    return aQuestionsNames;
}
function determineQuestionSet(){
    let totalNumberOfQuestions = Object.keys(jContent.Questions).length;
    for(let i = 0; i<nOfQuestions; i++) {
        let randomNumber = Math.floor(Math.random() * totalNumberOfQuestions);
        aQuestionSet.push(randomNumber);
    }
    for (let index =0; index <aQuestionSet.length; index++ ){
        let questionIndex = aQuestionSet[index];
        let chosenQuestion = aQuestionsNames[questionIndex];
        jQuestionSet.Questions[chosenQuestion] = jContent.Questions[chosenQuestion];
    }
}
function countPropAnswers(jContent, question){
    let propAnswersCounter = 0
    for (answer in jContent.Questions[question].answers){
        if (jContent.Questions[question].answers[answer].correct){
            propAnswersCounter++;
        }
    };
    return propAnswersCounter;
}
function isAnswerChecked(question, answers, answer){
    if (jQuestionSet.Questions[question].answers[answer].chosen == true){
        return 'checked="checked"';
    }
    return '';
}
function composeCheckboxAnswer(question, answers, answer){
    let isChecked = isAnswerChecked(question, answers, answer);
    answers += '<input type="checkbox" '+isChecked+' value="'+answer+'" name="'+question+'">' +
        '<label>' + answer + '</label></br>';
    return answers;
}
function composeRadiobuttonAnswer(question, answers, answer){
    let isChecked = isAnswerChecked(question, answers, answer);
    answers += '<input type="radio" '+isChecked+' value="'+answer+'" name="'+question+'">' +
        '<label>' + answer + '</label></br>';
    return answers;
}
function submitAnswer(question){
    let answers = document.getElementsByName(question);
    let index = 1;
    for(answer in jQuestionSet.Questions[question].answers){
        if (answers[index].checked){
            jQuestionSet.Questions[question].answers[answer].chosen = true;
        } else if (!answer[index].checked){
            jQuestionSet.Questions[question].answers[answer].chosen = false;
        }
        index ++;
    }
}
function next(question, index){
    submitAnswer(question);
    index++;
    typeQuestionSet(jQuestionSet, index)
}
function previous(question, index){
    submitAnswer(question);
    index--;
    typeQuestionSet(jQuestionSet,index);
}
function finish(question){
    submitAnswer(question);
    finishTest();
}
function markQuestionAsPassed(question, summaryPageContent){
    let failed = '<h4>'+question+'<span name="'+question+'" class="questionFailed">FAILED</span></h4>';
    let passed = '<h4>'+question+'<span name="'+question+'" class="questionPassed">PASSED</span></h4>'
    if(summaryPageContent.includes(failed)){
        return summaryPageContent.replace(failed, passed);
    }
    console.log(failed+' substring does not exist in: '+summaryPageContent);
    return summaryPageContent;
}
function finishTest(){
    document.getElementById('output').innerHTML = '';
    let correctAnswersCount = 0;
    let summaryPageContent = '';
    let answerStyle ='';
    let isQuestionOdd = true;
    for(question in jQuestionSet.Questions){
        let oddity;
        if(isQuestionOdd){
            oddity = "odd";
            isQuestionOdd = false;
        } else {
            oddity = "even";
            isQuestionOdd = true;
        }
        let isQuestionAnsweredCorrectly = true;
        // let questionStyle = incorrectCheckedStyle;

        for(answer in jQuestionSet.Questions[question].answers){
            let answerIsChecked = jQuestionSet.Questions[question].answers[answer].chosen;
            if (answerIsChecked){
                isQuestionAnswered = true;
                // let questionStyle = defaultStyle;
                break;
            }
        }

        let questionText = '<h3>'+jQuestionSet.Questions[question].question+'</h3>';
        summaryPageContent+='<div class="'+oddity+'" style="questionStyle"> ';

        summaryPageContent+='<h4>'+question+'<span name="'+question+'" class="questionFailed">FAILED</span></h4>';

        summaryPageContent+=questionText;
        for (answer in jQuestionSet.Questions[question].answers){
            let answerIsCorrect = jQuestionSet.Questions[question].answers[answer].correct;
            let answerIsChecked = jQuestionSet.Questions[question].answers[answer].chosen;
            if(answerIsCorrect && answerIsChecked){
                summaryPageContent+='<div class="correctCheckedStyle">'+answer+'</div>';
            } else if(!answerIsCorrect && answerIsChecked){
                summaryPageContent+='<div class="incorrectCheckedStyle">'+answer+'</div>';
                isQuestionAnsweredCorrectly = false;
            }else if(answerIsCorrect && !answerIsChecked){
                summaryPageContent+='<div class="correctUnCheckedStyle">'+answer+'</div>';
                isQuestionAnsweredCorrectly = false;
            } else {
                summaryPageContent+='<div class="answerStyle">'+answer+'</div>';
            }
        }
        if(isQuestionAnsweredCorrectly){
            correctAnswersCount++;
            summaryPageContent = markQuestionAsPassed(question, summaryPageContent);
        }
        summaryPageContent+='<br/>';
        let explanation = jQuestionSet.Questions[question].explanation;
        summaryPageContent+='<div><span name="explanation '+question+'"style="font-weight: bold" onclick="showHideExplanation(\''+question+'\')">Explanation (click):</span><p name="'+question+'">'+explanation+'</p></div>';

        summaryPageContent+='<p>Answer controversy level: '+jQuestionSet.Questions[question].discussions+'</p>';
        summaryPageContent+='</div>';


    }
    let result = ((correctAnswersCount/nOfQuestions)*100).toFixed(2);
    let resultHTML ='<span style="color: red">'+((correctAnswersCount/nOfQuestions)*100).toFixed(2) +'%, FAILED'+'</span>';;
    if (result >= 70){
        resultHTML = '<span style="color: green">'+((correctAnswersCount/nOfQuestions)*100).toFixed(2) +'%, PASSED'+'</span>';
    }
    summaryPageContent = '<h1>RESULTS: '+resultHTML+'</h1>' + '<div id="answers">'+summaryPageContent+'</div>';
    document.getElementById('output').innerHTML =summaryPageContent;
    hideExplanations();
}

function hideExplanations(){
    for (question in jQuestionSet.Questions){
        document.querySelector('p[name="'+question+'"]').style.display = "none";
    }
}

function showHideExplanation(question){
    let x = document.querySelector('p[name="'+question+'"]');
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
}
window.onload = function(){
    fetchJson();
}