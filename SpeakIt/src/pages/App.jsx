import React, { Suspense, Component } from 'react';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import Loader from '../components/loader/Loader';
import MainPage from './MainPage';
import routes from '../constants/routes';
import GamePage from './GamePage';
import ResultPage from './ResultPage';
import StoreContext from '../context/StoreContext'

const SpeechRecognition = window.SpeechRecognition 
    || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.interimResults = true;
recognition.lang = 'en-US'

class App extends Component {
 constructor(props) {
   super(props);
   this.state = {
    currentTranslate: '',
    currentTranscript: '',
    currentImage: '',
    activeGroup: 0,
    activePage: 0,
    skip: 0,
    pages:  Array.from({length: 10}, (x, i) => i + 1),
    words: [],
    knownWords: [],
    isNewGame: true,
    recognition: recognition,
    changeParentState: (state) => {
      this.setState(state);
    }
   }
 }
  render = () => {
    return (
    <Suspense fallback={<Loader />}>
        <StoreContext.Provider value={this.state}>
          <Router>
            <Switch>
              <Route path={routes.LANDING} exact>
                <MainPage />
              </Route>
              <Route path={routes.GAME} exact>
                <GamePage state={this.state}/>
              </Route>
              <Route path={routes.RESULTS} exact>
                <ResultPage state={this.state} />
              </Route>
            </Switch>
          </Router>
        </StoreContext.Provider>
      </Suspense>
    );
  }
}

export default App;
