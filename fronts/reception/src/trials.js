import { useSelector } from 'react-redux'

export function Trials() {
    // componment that display the trials list according current useur role
    const trials = useSelector(selTrials)



    return (""


    )

}


import { useDispatch } from 'react-redux'
import { addTrialToReduxStore } from './basketSlice'

async function fetch_trials() {
    const dispatch = useDispatch()

    fetch('/trials').then((resp) => { console.log(resp); return resp.json() })
        .then((data) => {
            console.log(data);
            let CB_Sites = document.getElementById('CB_SiteList');
            let SitesL = data.map((obj) => `<option value="${obj['Site']}" >${obj['Site']}</option> `);
            let htmlStr = SitesL.reduce((agg, item) => agg += item);
            CB_Sites.innerHTML = htmlStr;
            CB_Sites.addEventListener("change", gather_Site_data);
            gather_Site_data();
        }).catch(() => { bidon });

}