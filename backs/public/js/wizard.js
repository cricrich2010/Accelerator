
let AuthToken = "wizard"

let fetchOptions = { headers: { AuthToken: "wizard" } }

function Fetch_trials_liste() {
    fetch('/trials', fetchOptions).then((resp) => { console.log(resp); return resp.json() })
        .then((data) => {
            console.log(data);

            let CB_trials = document.getElementById('CB_trials');
            let trialsL = data.map((obj) => `<option value="${obj['trialcode']}" >${obj['trialcode']}</option> `);
            let htmlStr = trialsL.reduce((agg, item) => agg += item);
            CB_trials.innerHTML = htmlStr;
            CB_trials.addEventListener("change", gather_trial_data);
            gather_trial_data();
        });
}

function gather_trial_data() {
    let CB_trials = document.getElementById('CB_trials');
    console.log("fetch trial data for ", CB_trials.value)
    Fetch_trial_desc();
    Fetch_trial_inv();
    Fetch_trial_inv_pend();
    Fetch_trial_pat()
    //Fetch_trial_patients();

}


function Fetch_trial_desc() {
    let CB_trials = document.getElementById('CB_trials');
    console.log("fetch trial details for ", CB_trials.value)
    fetch('/wtrialinfo?trial=' + CB_trials.value, fetchOptions)
        .then((resp) => { console.log(resp); return resp.json() })
        .then((data) => {
            console.log('Fetch_trial_desc data ', data);
            console.log('Fetch_trial_desc [data] ', data[0]);
            //console.log(Object(data[0]).keys())
            console.log(data[0]['trialcode'])
            console.log(data[0].trialcode)
            document.getElementById('Trial_trial').innerText = data[0]['trialcode'];
            document.getElementById('Trial_trialStatus').innerText = data[0]['status'];
            document.getElementById('Trial_description').innerText = data[0]['description'];
            document.getElementById('Trial_ctm').innerText = data[0]['login'];
            document.getElementById('Trial_ctmemail').innerText = data[0]['email'];

            //document.getElementById('Site_Size').innerText = "not yet available";
            //document.getElementById('Line_site_header').innerText = data[0]['City'];
            //document.getElementById('TheImage').remove()
            // let TheImage = document.createElement('img')
            // TheImage.src = "https://picsum.photos/200/300?random=" + 
            // (Math.floor(Math.random() * (20 - 1) + 1 ))
            // TheImage.id = "TheImage"
            // document.getElementById('imgsite').appendChild(TheImage)
            document.getElementById('TheImage').src = "https://picsum.photos/300/200?random=" +
                (Math.floor(Math.random() * (20 - 1) + 1))


        });
}



function Fetch_trial_inv() {
    let CB_trials = document.getElementById('CB_trials');
    console.log("fetch trial investigator for ", CB_trials.value)
    fetch('/wtrialinvestigators?trial=' + CB_trials.value).then((resp) => { console.log(resp); return resp.json() })
        .then((data) => {
            //console.log(data);
            let tbElement = document.getElementById('trialinvestigators');
            //header
            //console.log('obj data:', data)
            //console.log('obj data 0 :', data[0])
            //console.log('obj data key :', Object.keys(data[0]))
            //let Headers = data[0].keys()
            let Headers = Object.keys(data[0])
            //console.log(Headers)
            let htmlStrH = Headers.reduce((agg, it) => agg += `<th>${it}</th>`, "")
            htmlStrH = `<thead><tr>${htmlStrH}</tr></thead>`
            //rows
            let SitesL = data.reduce((agg, obj) => agg += obj_val_to_cell_table(obj))
            SitesL = `<tbody>${SitesL}</tbody>`
            tbElement.innerHTML = htmlStrH + SitesL;
            //tbElement.appendChild(sTable)
        });
}



function Fetch_trial_pat() {
    let CB_trials = document.getElementById('CB_trials');
    console.log("fetch trial pat for ", CB_trials.value)
    fetch('/wpatients?trial=' + CB_trials.value).then((resp) => { console.log(resp); return resp.json() })
        .then((data) => {
            //console.log(data);
            let tbElement = document.getElementById('trialpatients');
            //header
            //console.log('obj data:', data)
            //console.log('obj data 0 :', data[0])
            //console.log('obj data key :', Object.keys(data[0]))
            //let Headers = data[0].keys()
            let Headers = Object.keys(data[0])
            //console.log(Headers)
            let htmlStrH = Headers.reduce((agg, it) => agg += `<th>${it}</th>`, "")
            htmlStrH = `<thead><tr>${htmlStrH}</tr></thead>`
            //rows
            let SitesL = data.reduce((agg, obj) => agg += obj_val_to_cell_table(obj))
            SitesL = `<tbody>${SitesL}</tbody>`
            tbElement.innerHTML = htmlStrH + SitesL;
            //tbElement.appendChild(sTable)
        });
}




function Fetch_trial_inv_pend() {
    let CB_trials = document.getElementById('CB_trials');
    console.log("fetch prodLines for ", CB_trials.value)
    fetch('/wtrialinvestigatorspending?trial=' + CB_trials.value).then((resp) => { console.log(resp); return resp.json() })
        .then((data) => {
            //console.log(data);
            let tbElement = document.getElementById('trialpendinginvestigators');

            //header
            //console.log('obj data:', data)
            //console.log('obj data 0 :', data[0])
            console.log('obj data key :', Object.keys(data[0]))
            //let Headers = data[0].keys()
            let Headers = Object.keys(data[0])
            //console.log('headers', Headers)
            let htmlStrH = Headers.reduce((agg, it) => agg += `<th>${it}</th>`, "")
            htmlStrH = `<thead><tr>${htmlStrH}</tr></thead>`
            //rows
            let SitesL = data.reduce((agg, obj) => agg += obj_val_to_cell_table(obj))
            SitesL = '<tbody>' + SitesL + '</tbody>'
            //console.log(SitesL)
            //console.log(htmlStrH + SitesL)
            tbElement.innerHTML = htmlStrH.toString() + SitesL.toString();
            //console.log(tbElement.innerHTML)
            //tbElement.appendChild(sTable)
        });
}


function Fetch_trial_patients() {
    let CB_trials = document.getElementById('CB_trials');
    console.log("fetch patient for ", CB_trials.value)
    fetch('/wtrialpatients?trial=' + CB_trials.value).then((resp) => { console.log(resp); return resp.json() })
        .then((data) => {
            //console.log(data);
            let tbElement = document.getElementById('trialpatients');
            //header
            //console.log('obj data:', data)
            //console.log('obj data 0 :', data[0])
            console.log('obj data key :', Object.keys(data[0]))
            //let Headers = data[0].keys()
            let Headers = Object.keys(data[0])
            //console.log(Headers)
            let htmlStrH = Headers.reduce((agg, it) => agg += `<th>${it}</th>`, "")
            htmlStrH = `<thead><tr>${htmlStrH}</tr></thead>`
            //rows
            let SitesL = data.reduce((agg, obj) => agg += obj_val_to_cell_table(obj))
            SitesL = `<tbody>${SitesL}</tbody>`
            tbElement.innerHTML = htmlStrH + SitesL;
            //tbElement.appendChild(sTable)
        });
}

function obj_val_to_cell_table(js_obj) {
    let Headers = Object.keys(js_obj)
    let tr_string = ""
    for (let i = 0; i < Headers.length; i += 1) {

        tr_string = tr_string + `<td>${js_obj[Headers[i]]}</td>`
    }
    return `<tr>${tr_string}<tr>`.toString()
}

function DisplayLoginform() {
    console.log("DisplyLoginform: Event")
    let loginform = document.getElementById('loginInput')
    if (loginform.style.display = "none") { loginform.style.display = "block" }
    else { loginform.style.display = "none" }


}
function LoginOperation() {
    console.log("LoginOperation: Event")
    if (document.getElementById('RB_login').checked) {
        let pwconf = document.getElementsByClassName('PWconfirm');
        console.log(pwconf);
        for (let it of pwconf) {
            it.style.visibility = 'hidden';
        }
    } else {
        let pwconf = document.getElementsByClassName('PWconfirm')
        console.log(typeof (pwconf))
        console.log(pwconf)
        for (let it of pwconf) {
            it.style.visibility = 'visible';
        }
    }
}
function LoginSendCC() {

    //let qPath = document.getElementByName('RB_login').value

    //let RB_Login = document.getElementsByName('RB_login')
    let RB_Login = Array.from(document.getElementsByName('RB_login')).find((radio) => radio.checked).value;

    console.log(RB_Login)
    console.log(document.getElementById('tb_userID').value)
    console.log(document.getElementById('tb_passwd').value)

    let qPath = RB_Login
    let tb_userID = document.getElementById('tb_userID').value
    let tb_passwd = document.getElementById('tb_passwd').value
    if (!RB_Login) { return; }
    let qoptions =
    {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify({ 'FirstName': tb_userID, 'Auth': tb_passwd })
    }
    fetch(qPath, qoptions)
        .then((response) => {
            if (!response.ok) {
                alert(response.statusText)
            } else {
                response.json()
            }
        })
        .then((data) => {
            console.log("login token:", data);

            this.AuthToken = data.AuthToken
        })
}

function New_Trial() {
    let TB_trialID = document.getElementById('TB_trialID').value;
    let TB_TrialDes = document.getElementById('TB_TrialDes').value

    let qoptions =
    {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'AuthToken': this.AuthToken
        },
        method: "POST",
        body: JSON.stringify({ trialcode: TB_trialID, description: TB_TrialDes })
    }
    fetch('/wNewTrial', qoptions)
        .then((response) => {
            if (!(response.ok)) {
                alert(response.statusText)
            } else {
                response.json()
                Fetch_trials_liste()
            }
        })
        .then((data) => {
            console.log('New Line (json) data (should be empty) : ', data);

            // this.AuthToken = data.AuthToken
        })


}




document.getElementById('loginInput').addEventListener('click', DisplayLoginform);
document.getElementById('LoginOperation').addEventListener('click', LoginOperation);
document.getElementById('BT_login_send').addEventListener('click', LoginSendCC);
document.getElementById('BT_ADDTrial').addEventListener('click', New_Trial);

// document.getElementById('RB_ChPass').addEventListener('click',RB_ChPass);
//document.getElementById('New_User').addEventListener('click',New_User);
Fetch_trials_liste()




