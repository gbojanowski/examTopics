var jContent = fetchJson();
var nOfQuestions = 3;
var aQuestionsNames = [];
var aQuestionSet = [];
var jQuestionSet=JSON.parse('{"Questions":{}}');


async function fetchJson(){
    const data = await fetch('http://localhost:63342/examTopics/awsCloudPractitioner.json')
        .then(results=>results.json())
    jContent = data;
    return (data);
}

function typeQuestionSet(jQuestionSet, index){
    var questionHTML = '<div id="questions"><h1>Question: '+(index+1)+'/'+nOfQuestions+'</h1>';

    var question =aQuestionsNames[aQuestionSet[index]];

    var answers = "";
    document.getElementById('output').innerHTML = '';
    questionHTML+='<form name="'+question+'" />';
    questionHTML+='<h4>'+question+'</h4>';
    var questionText = '<h3>'+jQuestionSet.Questions[question].question+'</h3>';
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
        questionHTML+='<input type="button" value="previous question" onclick="previous(\'' + index + '\')"/>';
        questionHTML+='<input type="button" value="next question" onclick="next(\'' + question + '\',\'' + index + '\')"/>';
    }  else {
        questionHTML+='<input type="button" value="previous question" onclick="previous(\'' + index + '\')"/>';
        questionHTML+='<input type="submit" value="finish test" onclick="return finish(\'' + question + '\')"/>';
    }
    questionHTML+="</form></div>";

    document.getElementById('output').innerHTML = questionHTML;
}

function fillAQuestionNames(){
    for(question in jContent.Questions){
        aQuestionsNames.push(question);
    }
    return aQuestionsNames;
}
function determineQuestionSet(){
    var totalNumberOfQuestions = Object.keys(jContent.Questions).length;
    for(let i = 0; i<nOfQuestions; i++) {
        var randomNumber = Math.floor(Math.random() * totalNumberOfQuestions);
        aQuestionSet.push(randomNumber);
    }
    for (var index =0; index <aQuestionSet.length; index++ ){
        var questionIndex = aQuestionSet[index];
        var chosenQuestion = aQuestionsNames[questionIndex];
        jQuestionSet.Questions[chosenQuestion] = jContent.Questions[chosenQuestion];
    }
}
function countPropAnswers(jContent, question){
    var propAnswersCounter = 0
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
    var isChecked = isAnswerChecked(question, answers, answer);
    answers += '<input type="checkbox" '+isChecked+' value="'+answer+'" name="'+question+'">' +
        '<label>' + answer + '</label></br>';
    return answers;
}
function composeRadiobuttonAnswer(question, answers, answer){
    var isChecked = isAnswerChecked(question, answers, answer);
    answers += '<input type="radio" '+isChecked+' value="'+answer+'" name="'+question+'">' +
        '<label>' + answer + '</label></br>';
    return answers;
}
function submitAnswer(question){
    var answers = document.getElementsByName(question);
    var index = 1;
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
function previous(index){
    index--;
    typeQuestionSet(jQuestionSet,index);
}
function finish(question){
    submitAnswer(question);
    finishTest();
}
function markQuestionAsPassed(question, summaryPageContent){
    var failed = '<h4>'+question+'<span name="'+question+'" class="questionFailed">FAILED</span></h4>';
    var passed = '<h4>'+question+'<span name="'+question+'" class="questionPassed">PASSED</span></h4>'
    if(summaryPageContent.includes(failed)){
        return summaryPageContent.replace(failed, passed);
    }
    console.log(failed+' substring does not exist in: '+summaryPageContent);
    return summaryPageContent;
}
function finishTest(){
    document.getElementById('output').innerHTML = '';
    var correctAnswersCount = 0;
    var summaryPageContent = '';
    var answerStyle ='';
    var isQuestionOdd = true;


    // var correctStyle = "border: 2px solid green; border-radius: 7px; padding: 5px; ";


    for(question in jQuestionSet.Questions){
        var oddity;
        if(isQuestionOdd){
            oddity = "odd";
            isQuestionOdd = false;
        } else {
            oddity = "even";
            isQuestionOdd = true;
        }
        var isQuestionAnsweredCorrectly = true;
        // var questionStyle = incorrectCheckedStyle;

        for(answer in jQuestionSet.Questions[question].answers){
            var answerIsChecked = jQuestionSet.Questions[question].answers[answer].chosen;
            if (answerIsChecked){
                isQuestionAnswered = true;
                // var questionStyle = defaultStyle;
                break;
            }
        }

        var questionText = '<h3>'+jQuestionSet.Questions[question].question+'</h3>';
        summaryPageContent+='<div class="'+oddity+'" style="questionStyle"> ';

        summaryPageContent+='<h4>'+question+'<span name="'+question+'" class="questionFailed">FAILED</span></h4>';

        summaryPageContent+=questionText;
        for (answer in jQuestionSet.Questions[question].answers){
            var answerIsCorrect = jQuestionSet.Questions[question].answers[answer].correct;
            var answerIsChecked = jQuestionSet.Questions[question].answers[answer].chosen;
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
        var explanation = jQuestionSet.Questions[question].explanation;
        summaryPageContent+='<div><span name="explanation '+question+'"style="font-weight: bold" onclick="showHideExplanation(\''+question+'\')">Explanation (click):</span><p name="'+question+'">'+explanation+'</p></div>';

        summaryPageContent+='<p>Answer controversy level: '+jQuestionSet.Questions[question].discussions+'</p>';
        summaryPageContent+='</div>';


    }
    var result = ((correctAnswersCount/nOfQuestions)*100).toFixed(2);
    var resultHTML ='<span style="color: red">'+((correctAnswersCount/nOfQuestions)*100).toFixed(2) +'%, FAILED'+'</span>';;
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
    var x = document.querySelector('p[name="'+question+'"]');
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
}
window.onload = function(){
    fillAQuestionNames();
    determineQuestionSet();
    typeQuestionSet(jQuestionSet, 0);
}