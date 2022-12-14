import { useSelector, useDispatch } from 'react-redux'
import { addTrialReduxStore, removeTrialReduxStore, clearTrialReduxStore } from './redux/trialsSlice.js'
import { getTrialsTrialsReduxStore, getTrialsCountReduxStore } from './redux/trialsSlice.js'

export function TrialsTable() {
    // componment that display the trials list according current useur role
    const trials = useSelector(getTrialsTrialsReduxStore)
    const dispatch = useDispatch()

    //trial patern { id: 0, name: 'trials_fake_00', description: 'bidon trial description' }

    console.log(trials);
    console.log('obj data key :', Object.keys(trials[0]))
    let Headers = Object.keys(trials[0])



    return (<table className="trialslist">
        <thead>
            <tr>
                {Headers.map((header) => (
                    <th >
                        {header}
                    </th>
                ))}
            </tr>
        </thead>
        <tbody>
            {trials.map((trial) => (
                <tr >
                    {Headers.map(header => {
                        <td>{trial.header}</td>
                    })}
                </tr>
            ))}

        </tbody>
    </table>
    )

}


async function fetch_trials() {
    const dispatch = useDispatch()

    fetch('/trials').then((resp) => { console.log(resp); return resp.json() })
        .then((data) => {
            console.log(data);
            console.log('obj data key :', Object.keys(data[0]))
            data.map(item => dispatch(addTrialReduxStore, item))

        }).catch((err) => { console.log(err) });

}
