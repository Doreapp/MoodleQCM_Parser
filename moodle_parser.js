var attempt = -1;
var cmid = -1;
var length = $('#mod_quiz_navblock')[0].children[1].children[0].childElementCount;

var question = [];
question["length"] = length;

var tmp = [];
location.search
    .substr(1)
    .split("&")
    .forEach(function(item) {
        tmp = item.split("=");
        if (tmp[0] === "attempt") attempt = decodeURIComponent(tmp[1]);
        else if (tmp[0] === "cmid") cmid = decodeURIComponent(tmp[1]);
    });

var i = 0;
var done = 0;

while (i < length) {
    //
    treat(i);
    i++;
}

var csv = "numero;text;res-type;res-text;...;\n";


function treat(page) {
    $.get("https://moodle.insa-lyon.fr/mod/quiz/attempt.php", {
            attempt: attempt,
            cmid: cmid,
            page: page
        })
        .done(function(data) {
            treatPageData(data);
            done++;
            if (done == length) {
                console.log("Fini !");
                finish();
            }
        })
        .fail(function() {
            console.log("error")
        });
}

var res;

function treatPageData(data) {
    var html = $(data);
    res = html;
    var i = 1;
    var inner;
    while (i <= length) {
        inner = html.find('#q' + i);
        if (inner.length > 0)
            treatQuestion(inner[0], i);
        i++;
    }
}

function treatQuestion(html, index) {
    res = html;

    //csv += index + ";";
    var q = [];

    var inputs = html.querySelectorAll(".formulation.clearfix input");
    var selects = html.querySelectorAll(".formulation.clearfix select");

    var texts = html.querySelectorAll(".formulation.clearfix .qtext");

    q["text"] = "";
    if (texts[0] != undefined)
        q["text"] = texts[0].innerText;
    else {
        var paragraphes = html.querySelectorAll(".formulation.clearfix p");
        for (let i in paragraphes) {
            if (paragraphes[i] != undefined && paragraphes[i].innerText != undefined) {
                q["text"] += "\n" + paragraphes[i].innerText;
            }
        }
    }
    // for (let i in texts) {
    //     text += texts[i].innerHTML;
    // }

    var responses = [];
    var rIndex = 0;

    for (let i in inputs) {
        if (inputs[i].type != "submit" && inputs[i].type != "hidden" && inputs[i].type != undefined) {
            var label = html.querySelectorAll('.formulation.clearfix label[for="' + inputs[i].id + '"]')[0].innerText;
            responses[rIndex++] = { "type": inputs[i].type, "text": label };
            //csv += "[" + inputs[i].type + "] " + label + ";";
        }
    }
    if (selects.length > 0) {
        var labels = html.querySelectorAll(".formulation.clearfix td.text");
        for (let i in selects) {
            if (i === "length")
                break;

            var options = selects[i].querySelectorAll('option');

            var label = "";
            if (labels[i] != undefined) {
                label = labels[i].innerText;
            }
            label += "(";
            for (let j in options) {
                if (options[j].innerText === "Choisir..." || options[j].innerText.trim() === "")
                    continue;
                label += options[j].innerText;
                if (j < options.length - 1)
                    label += "/";
                else
                    break;
            }
            label += ")";
            responses[rIndex++] = { "type": "select", "text": label };

        }
    }

    q["responses"] = responses;

    question[index - 1] = q;
    console.log(index);
}

function finish() {
    var sortedQuestions = [];
    let i = 0;
    let index = 0;
    while (i < length) {
        var s = undefined;
        for (let i in question) {
            if (question[i] != undefined) {
                if (s == undefined || s.localeCompare(question[i].text) > 0) {
                    s = question[i].text;
                    index = i;
                }
            }
        }
        sortedQuestions[i] = question[index];
        question[index] = undefined;

        i++;
    }
    print(sortedQuestions);
    toCSV(sortedQuestions);
}

function print(questions) {
    var text = "";
    for (let i in questions) {
        if (questions[i] != undefined) {
            text += "* " + questions[i].text + " : \n";

            for (let j in questions[i].responses) {
                text += "    > [" + questions[i].responses[j].type + "] : " + questions[i].responses[j].text + "\n";
            }
        }
    }
    console.log(text);
}

function toCSV(questions) {
    var text = "";
    for (let i in questions) {
        if (questions[i] != undefined) {
            text += "" + questions[i].text.replace(/\r?\n|\r/g, "   ") + ";";

            for (let j in questions[i].responses) {
                text += "[" + questions[i].responses[j].type + "] " + questions[i].responses[j].text.replace(/\r?\n|\r/g, "   ") + ";";
            }

            text += "\n";
        }
    }
    console.log(text);
}