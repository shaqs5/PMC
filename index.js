const fs = require('fs');
const inquirer = require("inquirer");

mainLogic();

function mainLogic() {
    showMenu();
}

function showMenu() {
    console.log(""); //filler
    const mainMenu =
        [
            "Show day with the smallest temperature spread",
            "Show team with smallest difference between goals `For` and goals `Against`",
            "Exit App"
        ];
    inquirer.prompt([{
        type: "rawlist",
        name: "choice",
        message: "What would you like to do?",
        choices: mainMenu
    }]).then(function (val) {
        // Checking to see what option the user decided on, running the appropriate function in response
        switch (val.choice) {
            case mainMenu[0]:
                readfileCleanWeather('./w_data.dat');
                break;
            case mainMenu[1]:
                readfileCleanSoccer('./soccer.dat');
                break;
            case mainMenu[2]:
                console.log("\nBye!")
                break;
            default:
                console.log(val.choice + " is not a valid selection!");
        }
    });
}

function readfileCleanSoccer(filename) {
    fs.readFile(filename, 'utf8', function (err, data) {
        if (err) { console.log(err) }
        else {
            let cleanData
            let values = [];
            let sdata = data.split('\n');
            for (let i = 2; i < sdata.length - 2; i++) {
                sdata[i].split(/\s+/);
                cleanData = sdata[i].replace('-', '')
                cleanData = cleanData.split(/\s+/)
                cleanData.splice(0, 1);
                if (cleanData[0] != "Team") { cleanData.splice(0, 1) }
                values.push(cleanData);
            }
            var s_result = getMinDiff(values, 5, 6, 0);
            console.log(`\n${s_result[0]} has the smallest difference in "For" and "Against" goals, with a difference of ${s_result[1]} goal(s).`);
            showMenu();
        }
    });
}

function readfileCleanWeather(filename) {
    fs.readFile(filename, 'utf8', function (err, data) {
        if (err) { console.log(err) }
        else {
            let cleanData
            let values = [];
            let sdata = data.split('\n');
            for (let i = 4; i < sdata.length - 3; i++) {
                sdata[i].split(/\s+/);
                cleanData = sdata[i]
                cleanData = cleanData.split(/\s+/)
                cleanData.splice(0, 1);
                values.push(cleanData);
            }
            var w_result = getMinDiff(values, 1, 2, 0);
            console.log(`\nDay ${w_result[0]} has the smallest temperature spread, with ${w_result[1]} degree(s) difference.`);
            showMenu();
        }
    });
}

function getMinDiff(values, maxcolidx, mincolidx, dispcolidx) {
    let dispVal = []
    let minVals = []
    for (i = 0; i < values.length; i++) {
        minVals.push(Math.abs(parseInt(values[i][maxcolidx]) - parseInt(values[i][mincolidx])));
        dispVal.push(values[i][dispcolidx]);
    }

    dispVal.splice(0, 1)
    dispVal = dispVal.filter(function (el) {
        return el !== undefined;
    });

    minVals = minVals.filter(Boolean)
    let obj = Object.assign.apply({}, dispVal.map((v, i) => ({ [v]: minVals[i] })));
    let result = Object.keys(obj).map(function (key) {
        return [key, obj[key]];
    });

    var sorted = quickSort(result);
    return sorted;
}

function quickSort(unsortedArray) {
    if (unsortedArray.length <= 1) {
        return unsortedArray;
    }
    var pivot = unsortedArray[0];
    var left = [];
    var right = [];
    for (let i = 1; i < unsortedArray.length; i++) {
        unsortedArray[i][1] < pivot[1] ? left.push(unsortedArray[i]) : right.push(unsortedArray[i]);
    }
    return quickSort(left).concat(pivot, quickSort(right));
};
