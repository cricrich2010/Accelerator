"use strict";
//const my = require('mysql2');

//import mysql
const { exit } = require('process');
const { cnxSql } = require('./mysql.js');

// In Node.js
const seedrandom = require('seedrandom');
const generator = seedrandom('[your here]');
const randomNm = generator;


//import { LoremIpsum } from "lorem-ipsum";
const LoremIpsum = require("lorem-ipsum").LoremIpsum;
const lorem = new LoremIpsum({
    sentencesPerParagraph: {
        max: 8,
        min: 4
    },
    wordsPerSentence: {
        max: 16,
        min: 4
    },
    random: randomNm
});




//imort mongodb

//connect mongoDB


//query my sql


// using promise and return query result
const queryProm = (qString, qParam) => {
    return new Promise((resolve, reject) => {
        //console.log(qString)
        cnxSql.query(
            qString,
            qParam,
            (error, data, fields) => {
                if (error) {
                    console.log(error)
                    return reject(error);
                } else {
                    return resolve({ data, fields });
                }
            }
        );
    });
};


//query My data
async function getMy_and_loadMongo() {
    console.log("RERERE wonderfull")

    let { data: trials, fields: ftrials } = await queryProm("select trialcode from Trials")
    console.log(trials)
    //patient + inv + trial
    let { data: patients, fields: fieldpatients } = await queryProm("select trialcode, login, investigatorlogin from Subscriptions where role= ? ", ['patient'])
    console.log(patients)
    console.log('nbpatient', patients.length)

    let { data: nbpattri, fields: fnbpattri } = await queryProm("select trialcode, count(login) from Subscriptions where role=? GROUP BY trialcode order by trialcode;", ['patient'])
    console.log(nbpattri)

    let { data: nbinvtri, fields: fnbinvtri } = await queryProm("select trialcode, count(login) from Subscriptions where role=? group by trialcode", ['investigator'])
    console.log(nbinvtri)
    //let { data: nbtri, fields: fnbtri } = await queryProm("select trialcode, login, investigatorlogin from Subscriptions where role= ? ", ['patient'])
    //console.log(nbtri)
    const trialWindows = 3
    //const startdate = new Date(2022, 9, 1, 6) //'2022-09-01 06:00'
    let currentdate = new Date(2022, 9, 1, 6) //'2022-09-01 06:00'
    console.log(currentdate)
    let nbMessaeWeight = 100

    //nb note is only following the patient (forgot trial and inv)
    //as patient are randomly distributed accroos the trial and patient, last patient my belongs to the first trial.
    //hence for each patient the number of note follow squar patient id nb of note. whatever the patient order. Again due to rand distribution, we dont care the order either.
    patients.forEach((it, index) => {
        it.nbNote = Math.floor(randomNm() * (Math.pow(index + 9, 1 / 2)))
        console.log(it.nbNote)
    });

    patients.forEach((it, index) => {
        //for each note : prefer inv note for smal num
        it.noteOrder = ""
        console.log(3 / (it.nbNote + 1));
        for (let noNote = 0; noNote < it.nbNote; noNote++) {
            currentdate = new Date(currentdate.getTime() + Math.floor(randomNm() * 6 * 60 + 1) * 60000); // add 1 min up to 6 hours
            if (randomNm() > (3 / (it.nbNote + 1))) {
                it.noteOrder = it.noteOrder + ",patient"
                // add to mongo 
                console.log('patient', it.login, currentdate, 'Message', lorem.generateSentences(Math.floor(1 + randomNm() * 5)))
            } else {
                it.noteOrder = it.noteOrder + ",INV"
                console.log('INV', it.investigatorlogin, currentdate, 'Message', lorem.generateSentences(Math.floor(1 + randomNm() * 5)))
            }
        }
        console.log(it.noteOrder)
        Math.see
    });

    //randomize nb message  by inv


    //randomize nb message by patient

    //for each add record ins mongo
    exit()

}

async function clearAndGenerateDataset() {
    //constant for data set generation
    const nbTrials = 20
    const nbctms = Math.floor(nbTrials / 4)
    const nbInvestigators = nbTrials
    const nbPatients = 12 * nbTrials
    // Trials and Users are root items 
    const TrialsList = generateTrialsListe(nbTrials)
    const ctmList = generateUserListe(nbctms, "ctm")
    const investigatorList = generateUserListe(nbInvestigators, "inv")
    const patList = generateUserListe(nbPatients, "pat")
    //generate roles and status

    //generate subscriptions

}

function generateTrialsListe(nbTrials) {
    const trialsList = Array(nbTrials)
    return trialsList.map((it, ind) => {
        const trialcode = "Tri" + ('0000' + ind).slice(-4)
        const description = lorem.generateSentences(Math.floor(1 + randomNm() * 10))
        return { trialcode: trialcode, description: description }
    })
}

function generateUserListe(nbUser, prefixUser) {
    const ctmList = Array(nbctm)
    return ctmList.map((it, ind) => {
        const login = prefixUser + ('0000' + ind).slice(-4)
        const email = prefixUser + ('0000' + ind).slice(-4) + "@accelerator.net"
        return { trialcode: trialcode, description: description }
    })
}


getMy_and_loadMongo()


