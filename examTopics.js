var jContent = fetchJson();
var nOfQuestions = 1;
var aQuestionsNames = [];
var aQuestionSet = [];
var jQuestionSet=JSON.parse('{"Questions":{}}');


async function fetchJson(){
    const data = await fetch('http://localhost:63342/examTopics/awsCloudPractitioner.json')
        .then(results=>results.json())
    jContent = data;
    console.log(jContent);
    return (data);
}

function typeQuestionSet(jQuestionSet){
    for (question in jQuestionSet.Questions){
        var answers = "";
        document.write('<form name="'+question+'" />');
        var questionText = '<h4>'+jQuestionSet.Questions[question].question+'</h4>';
        document.write(questionText);


        for (answer in jQuestionSet.Questions[question].answers){
            (function (answer) {
                if (countPropAnswers(jQuestionSet, question) > 1) {
                    answers = composeCheckboxAnswer(answers, answer);
                } else {
                    answers = composeRadiobuttonAnswer(answers, answer);
                }
            }).call(this, answer);
        };

        answers += "</br>";
        document.write(answers);
        document.write('<input type="button" value="submit answer" onclick="submitAnswer(\''+question+'\')"/>');
        document.write("</form>")
    }
}
function fillAQuestionNames(){
    for(question in jContent.Questions){
        aQuestionsNames.push(question);
    }
    return aQuestionsNames;
}
function determineQuestionSet(){
    console.log("Object.keys(jContent).length");
    var totalNumberOfQuestions = Object.keys(jContent.Questions).length;


    for(let i = 0; i<nOfQuestions; i++) {
        var randomNumber = Math.floor(Math.random() * totalNumberOfQuestions);
        aQuestionSet.push(randomNumber);
    }
    for (var index =0; index <aQuestionSet.length; index++ ){
        var questionIndex = aQuestionSet[index];
        var chosenQuestion = aQuestionsNames[questionIndex];
        console.log(jContent.Questions[chosenQuestion]);
        jQuestionSet.Questions[chosenQuestion] = jContent.Questions[chosenQuestion];
        console.log(jQuestionSet);
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
function composeCheckboxAnswer(answers, answer){
    answers += '<input type="checkbox" value="'+answer+'" name="'+question+'">' +
        '<label>' + answer + '</label></br>';
    return answers;
}
function composeRadiobuttonAnswer(answers, answer){
    answers += '<input type="radio" value="'+answer+'" name="'+question+'">' +
        '<label>' + answer + '</label></br>';
    return answers;
}
function submitAnswer(question){
    var answers = document.getElementsByName(question);
    var index = 1;
    console.log('answers:');
    console.log(answers);
    for(answer in jContent.Questions[question].answers){
        if (answers[index].checked){
            jContent.Questions[question].answers[answer].chosen = true;
        }
        index ++;
    }
    console.log(jContent);




}
function finishTest(){
    console.log("finishTest()");
    document.body.innerHTML = '';
    document.write('<h1>RESULTS: </h1>');
    var answerStyle ='';

    // var correctStyle = "border: 2px solid green; border-radius: 7px; padding: 5px; ";
    var correctUnCheckedStyle = "font-weight: bold; color: green; ";
    var correctCheckedStyle = "font-weight: bold; color: green; border: 2px solid green; border-radius: 7px;";
    var incorrectCheckedStyle = "border: 2px solid red; border-radius: 7px; ";
    var defaultStyle = 'border: 0px';

    for(question in jQuestionSet.Questions){
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
    typeQuestionSet(jQuestionSet);

    document.write('<input type="submit" value="finish test" onclick="return finishTest();"/>');

}