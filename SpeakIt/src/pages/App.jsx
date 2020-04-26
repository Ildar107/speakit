import React, { Suspense, Component } from 'react';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import Loader from '../components/loader/Loader';
import MainPage from './MainPage';
import routes from '../constants/routes';
import GamePage from './GamePage';
import ResultPage from './ResultPage';
import StatsPage from './StatsPage';
import StoreContext from '../context/StoreContext'

const SpeechRecognition = window.SpeechRecognition 
    || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.interimResults = true;
recognition.lang = 'en-US'

let stats = window.localStorage.getItem('stats') ? JSON.parse(window.localStorage.getItem('stats')) : [];

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
    isSpeakMode: false,
    shift: 10,
    recognition: recognition,
    changeParentState: (state) => {
      this.setState(state);
    },
    updateStats: (state) => {
      stats.unshift({
        time: (new Date()).toLocaleDateString(),
        page: state.activePage + 1,
        group: state.activeGroup + 1,
        errors: state.words.filter((x) => !state.knownWords.includes(x)).length,
        success: state.knownWords.length
      })
      stats = stats.slice(0,10);
      localStorage.setItem('stats', JSON.stringify(stats));
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
              <Route path={routes.STATS} exact>
                <StatsPage />
              </Route>
              <Route>
                <MainPage />
              </Route>
            </Switch>
          </Router>
        </StoreContext.Provider>
      </Suspense>
    );
  }
}

export default App;
