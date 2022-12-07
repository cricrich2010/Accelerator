import logo from './logo.svg';
import './App.css';
import { Trials } from './trials.js'




function App() {
  return (
    <div className="App-host">
      <header className="App-header">
        <h1>Trials accelerator</h1>
        <p>Welcome to my clinical trial accelerator. <br></br>
          Leveraging the new technologies, I'm here to make your and your patient live better. <br></br>
          You will be able to start new trials at unkown rate, with no sweat and a dramatically reduced cost. <br></br>
          Check and accept investigators for your study<br></br>
          Investigator onboard new patient in no time<br></br>
          And Patient equiped with applicaton to provide live feedback with minimal effort.</p>
        <img src={logo} className="App-logo" alt="logo" />
        <p>You can spend few mins to discover the ongoing trial I'm supportin
        </p>
        <Trials className="TrialsListe" />
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React Trial Accelerator
        </a>
      </header>
    </div>
  );
}



export default App;
