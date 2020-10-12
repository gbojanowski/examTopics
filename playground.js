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
    var question =aQuestionsNames[aQuestionSet[index]];


        var answers = "";
        document.open ();
        document.close ();
        document.write('<form name="'+question+'" />');
        var questionText = '<h4>'+jQuestionSet.Questions[question].question+'</h4>';
        document.write(questionText);
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
        document.write(answers);
        if(index == 0) {
            document.write('<input type="button" value="next question" onclick="next(\'' + question + '\',\'' + index + '\')"/>');
        }
        else if(index > 0 && index < Object.keys(jQuestionSet.Questions).length-1) {
            document.write('<input type="button" value="previous question" onclick="previous(\'' + index + '\')"/>');
            document.write('<input type="button" value="next question" onclick="next(\'' + question + '\',\'' + index + '\')"/>');
        }  else {
            document.write('<input type="button" value="previous question" onclick="previous(\'' + index + '\')"/>');
            document.write('<input type="submit" value="finish test" onclick="return finish(\'' + question + '\')"/>');
        }
        document.write("</form>")
    // }
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

function finishTest(){
    document.body.innerHTML = '';
    document.write('<h1>RESULTS: </h1>');
    var answerStyle ='';

    // var correctStyle = "border: 2px solid green; border-radius: 7px; padding: 5px; ";
    var correctUnCheckedStyle = "font-weight: bold; color: green; ";
    var correctCheckedStyle = "font-weight: bold; color: green; border: 2px solid green; border-radius: 7px;";
    var incorrectCheckedStyle = "border: 2px solid red; border-radius: 7px; ";
    var defaultStyle = 'border: 0px';

    for(question in jQuestionSet.Questions){
        var correctAnswersCount = 0;
        var questionStyle = incorrectCheckedStyle;

        for(answer in jQuestionSet.Questions[question].answers){
            var answerIsChecked = jQuestionSet.Questions[question].answers[answer].chosen;
            if (answerIsChecked){
                isQuestionAnswered = true;
                var questionStyle = defaultStyle;
                break;
            }
        }

        var questionText = '<h3>'+jQuestionSet.Questions[question].question+'</h3>';
        document.write('<div style="'+questionStyle+'"> ');
        document.write(questionText);
        for (answer in jQuestionSet.Questions[question].answers){
            var answerIsCorrect = jQuestionSet.Questions[question].answers[answer].correct;
            var answerIsChecked = jQuestionSet.Questions[question].answers[answer].chosen;

            if(answerIsCorrect && answerIsChecked){
                document.write('<div style="'+correctCheckedStyle+'">'+answer+'</div>');
                correctAnswersCount ++;
            } else if(!answerIsCorrect && answerIsChecked){
                document.write('<div style="'+incorrectCheckedStyle+'">'+answer+'</div>');
            }else if(answerIsCorrect && !answerIsChecked){
                document.write('<div style="'+correctUnCheckedStyle+'">'+answer+'</div>');
            } else {
                document.write('<div style="'+answerStyle+'">'+answer+'</div>');
            }
        }
        document.write('<br/>');
        var explanation = jQuestionSet.Questions[question].explanation;
        document.write('<div><span  style="font-weight: bold">Explanation:</span>'+explanation+'</div>>')
        document.write('</div>');


    }

}

window.onload = function(){
    fillAQuestionNames();
    determineQuestionSet();
    typeQuestionSet(jQuestionSet, 0);



}