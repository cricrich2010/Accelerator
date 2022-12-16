//allowed routes
// patern : "route" : list of allowed role(s) for this route
const AllowedUrl = {
    "/": ['any'],
    '/login': ['any'],
    '/registration': ['any'],
    '/trials': ['any'],
    '/trialinvestigatorsubscribe': ['investigator'],
    '/patienthistory': ['patient', 'investigator', 'ctm'],
    '/confirmdrugs': ['patient'],
    '/patientaddnote': ['patient'],
    '/trialpatientadd': ['investigator', 'ctm'],
    '/trialpatients': ['investigator', 'ctm'],
    '/trialpatientsaddnote': ['investigator'],
    '/trialnew': ['ctm'],
    '/trialinvestigators': ['ctm'],
    '/acceptinvestigator': ['ctm'],
    '/wtrialinfo': ['any'],
    '/wtrialinvestigators': ['any'],
    '/wtrialinvestigatorspending': ['any'],
    '/wNewTrial': ['any'],
    '/wtrialpatients': ['any']
}
// revert the logic to specify free route only
//think about rout access by role


function firewall(req, res, next) {
    //console.log('firewall: in', 'req.url:', req.url, 'user is auth: ', req.authenticated,'user role: ', req.role )
    //role is obsolete and only the user role is usfull
    console.log('firewall: in', 'req.url:', req.url, 'user role: ', req.role)
    //console.log(req)
    //let isAuth = req.authenticated
    let qRole = req.role
    let qUrl = req.url
    if (!(req.url.indexOf('?') === -1)) { qUrl = req.url.substr(0, req.url.indexOf('?')).toLowerCase() }
    console.log("computed url:", qUrl)

    let fake = 1 / 0
    //drop request for any unknown route/ but annoing for debug
    //console.log(Object.keys(AllowedUrl), 'test in', qUrl, '-->', (Object.keys(AllowedUrl).includes(qUrl)))
    console.log('Re', 'test in', qUrl, '-->', (Object.keys(AllowedUrl).includes(qUrl)))
    if (!(Object.keys(AllowedUrl).includes(qUrl))) {
        console.log('Firwall rejected address', qUrl)
        res.status(403);
        res.statusMessage = "You are not allowed to access to this content"
        res.end()
        return
    }

    if (AllowedUrl[qUrl].includes('any')) {
        //allowed url -> you pass
        console.log('firewall: allowed url')
        next()
    } else if (AllowedUrl[qUrl].includes(qRole)) {
        //allowed url -> you pass
        console.log('firewall: role allowed url')
        next()
    } else {
        // access is denied
        console.log('firewall: url access denied', qUrl)
        res.status(403);
        res.statusMessage = "You are not allowed to access to this content"
        res.end()
    }
};

module.exports.firewall = firewall;

