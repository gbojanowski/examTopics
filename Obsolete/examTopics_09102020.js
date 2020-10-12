var jContent = fetchJson();

async function fetchJson(){
    const data = await fetch('http://localhost:63342/examTopics/awsCloudPractitioner.json')
        .then(results=>results.json())
    jContent = data;
    console.log("jContent: ");
    console.log(jContent);
    return (data);
}

function typeQuestionSet(jContent){
    for (question in jContent.Questions){
        var answers = "";
        document.write('<form name="'+question+'" />');
        var questionText = '<h4>'+jContent.Questions[question].question+'</h4>';
        document.write(questionText);


        for (answer in jContent.Questions[question].answers){
            (function (answer) {
                if (countPropAnswers(jContent, question) > 1) {
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
    var answers = document.getElementsByName(question)
    var index = 1;
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

    for(question in jContent.Questions){
        var questionStyle = incorrectCheckedStyle;

        for(answer in jContent.Questions[question].answers){
            var answerIsChecked = jContent.Questions[question].answers[answer].chosen;
            if (answerIsChecked){
                isQuestionAnswered = true;
                var questionStyle = defaultStyle;

                break;
            }
        }

        var questionText = '<h3>'+jContent.Questions[question].question+'</h3>';
        document.write('<div style="'+questionStyle+'"> ');
        document.write(questionText);
        for (answer in jContent.Questions[question].answers){
            var answerIsCorrect = jContent.Questions[question].answers[answer].correct;
            var answerIsChecked = jContent.Questions[question].answers[answer].chosen;

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
        var explanation = jContent.Questions[question].explanation;
        console.log(explanation);
        document.write('<div><span  style="font-weight: bold">Explanation:</span>'+explanation+'</div>>')
        document.write('</div>');
    }

}

window.onload = function(){
    typeQuestionSet(jContent);

    document.write('<input type="submit" value="finish test" onclick="return finishTest();"/>');

}