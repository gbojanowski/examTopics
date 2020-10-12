// var jOldContent={"Questions":
//         {
//             "Question #60 Topic 2": {
//                 "question":"Which of the following describes the relationships among AWS Regions, Availability Zones, and edge locations? (Choose two.)",
//                 "answers":[
//                     "A. There are more AWS Regions than Availability Zones.",
//                     "CORRECT:B. There are more edge locations than AWS Regions.",
//                     "C. An edge location is an Availability Zone.",
//                     "D. There are more AWS Regions than edge locations.",
//                     "CORRECT:E. There are more Availability Zones than AWS Regions."],
//                 "explanation": "",
//                 "discussions": "2"},
//             "Question #61 Topic 2":{
//                 "question":"What does AWS Shield Standard provide?",
//                 "answers":[
//                     "A. WAF rules",
//                     "CORRECT:B. DDoS protection",
//                     "C. Identity and Access Management (IAM) permissions and access to resources",
//                     "D. Data encryption"],
//                 "explanation": "AWS Shield Standard provides protection for all AWS customers from common, most frequently occurring network and transport layer DDoS attacks that target your web site or application at no additional charge. Reference: https://aws.amazon.com/shield/pricing/",
//                 "discussions": "2"},
//             "Question #62 Topic 2":{
//                 "question":"A company wants to build its new application workloads in the AWS Cloud instead of using on-premises resources. What expense can be reduced using the AWS Cloud?",
//                 "answers":[
//                     "A. The cost of writing custom-built Java or Node .js code",
//                     "B. Penetration testing for security",
//                     "CORRECT:C. hardware required to support new applications",
//                     "D. Writing specific test cases for third-party applications."],
//                 "explanation": "Reference: https://aws.amazon.com/pricing/cost-optimization/",
//                 "discussions": "2"}
//         }
// };


// var jnewExampleContent={"Questions":
//         {
//             "Question #60 Topic 2": {
//                 "question":"Which of the following describes the relationships among AWS Regions, Availability Zones, and edge locations? (Choose two.)",
//                 "answers":{
//                     "A. There are more AWS Regions than Availability Zones.": {
//                         "correct": "false",
//                         "chosen": "false"
//                     },
//                     "B. DDoS protection": {
//                         "correct": "true",
//                         "chosen": "false"
//                     }
//                 },
//                 "explanation": "",
//                 "discussions": "2"}
//         }
// }


// var jOldContent = fetchJson();
var jNewContent = fetchJson();

// examTopicsAwsCloudPractitioner1-100.json
async function fetchJson(){
    const data = await fetch('http://localhost:63342/examTopics/awsCloudPractitioner.json')
        .then(results=>results.json())
    // jContent = rewriteJSons(data);
    jNewContent = data;
    console.log("jContent: ");
    console.log(jNewContent);
    // console.log("data: ");
    // console.log(data);
    return (data);
}
// console.log("jOldContent");
// console.log(jOldContent);



function rewriteJSons(jOldContent) {
    var jNewContent = JSON.parse('{"Questions":{}}');
    for (questionID in jOldContent.Questions) {

        jFullQuestionSet = '{"question":"' + jOldContent.Questions[questionID].question + '",' +
            '"answers":{},' +
            '"explanation":"'+jOldContent.Questions[questionID].explanation+'",' +
            '"discussions": "'+jOldContent.Questions[questionID].discussions+'"' +
            '}';
        jNewContent.Questions[questionID] = JSON.parse(jFullQuestionSet)

        jOldContent.Questions[questionID].answers.forEach(function (answer) {
            if (answer.startsWith("CORRECT:")) {
                jNewContent.Questions[questionID].answers[answer.substring(8)] =
                    JSON.parse('{"correct":true, "chosen":false}');
            } else {
                jNewContent.Questions[questionID].answers[answer] =
                    JSON.parse('{"correct":false, "chosen":false}');
            }
        });

    }
    return jNewContent;
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
    for(answer in jNewContent.Questions[question].answers){
        if (answers[index].checked){
            jNewContent.Questions[question].answers[answer].chosen = true;
        }
        index ++;
    }
    console.log(jNewContent);




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

    for(question in jNewContent.Questions){
        var questionStyle = incorrectCheckedStyle;

        for(answer in jNewContent.Questions[question].answers){
            var answerIsChecked = jNewContent.Questions[question].answers[answer].chosen;
            if (answerIsChecked){
                isQuestionAnswered = true;
                var questionStyle = defaultStyle;

                break;
            }
        }

        var questionText = '<h3>'+jNewContent.Questions[question].question+'</h3>';
        document.write('<div style="'+questionStyle+'"> ');
        document.write(questionText);
        for (answer in jNewContent.Questions[question].answers){
            var answerIsCorrect = jNewContent.Questions[question].answers[answer].correct;
            var answerIsChecked = jNewContent.Questions[question].answers[answer].chosen;

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
        var explanation = jNewContent.Questions[question].explanation;
        console.log(explanation);
        document.write('<div><span  style="font-weight: bold">Explanation:</span>'+explanation+'</div>>')
        document.write('</div>');
    }

}

window.onload = function(){
    typeQuestionSet(jNewContent);

    document.write('<input type="submit" value="finish test" onclick="return finishTest();"/>');

}
