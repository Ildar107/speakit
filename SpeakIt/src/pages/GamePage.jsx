import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Pagination } from 'react-bootstrap';
import routes from '../constants/routes';
import WordsSet from '../components/words/WordsSet';

class GamePage extends Component {

    constructor(props) {
    super(props);
    this.state = props.state;
  }

  getWords = async (page, group) => {
    const url = `https://afternoon-falls-25894.herokuapp.com/words?page=${page}&group=${group}`;
    const res = await fetch(url);
    const json = await res.json();
    this.setState({
        words: json,
        currentImage: json && json.length > 0 ? json[0].image : ''
    });
  };

  handlePageChange = ({target: { innerText }}) => {
    this.getWords(Number(innerText) - 1, this.state.activeGroup);
    this.setState({ 
        activePage: Number(innerText) - 1,
        currentTranslate: ''
     });
    this.clearResults();
  };

  handleGroupChange = async ({target: { innerText }}) => {
    this.getWords(this.state.activePage,  Number(innerText) - 1);
    this.setState({ 
        activeGroup: Number(innerText) - 1,
        skip: 0,
        currentTranslate: ''
     });
    this.clearResults();
  };

  moveToFirstPage = () => {
    this.setState({ 
        pages:  Array.from({length: 10}, (x, i) => i + 1),
        skip: 0,
        currentTranslate: '',
        activePage: 0,
     });
     this.getWords(0, this.state.activeGroup);
     this.clearResults();
  }

  moveToRight = () => {
    const nextSize = this.state.skip - this.state.shift;
    this.getWords(nextSize, this.state.activeGroup);
    this.setState({ 
        pages:  Array.from({length: 10}, (x, i) => i + nextSize + 1),
        skip: nextSize,
        currentTranslate: '',
        activePage: nextSize,
     });
     this.clearResults();
  }

  moveToLeft = () => {
    const nextSize = this.state.skip + this.state.shift;
    this.getWords(nextSize, this.state.activeGroup);
    this.setState({ 
        pages:  Array.from({length: 10}, (x, i) => i + nextSize + 1),
        skip: this.state.skip + this.state.shift,
        currentTranslate: '',
        activePage: nextSize,
     });
     this.clearResults();
}

  moveToLastPage = () => {
    this.setState({ 
        pages:  Array.from({length: 10}, (x, i) => i + 20 + 1),
        skip: 20,
        currentTranslate: '',
        activePage: 29
    });
    this.clearResults();
    this.getWords(29, this.state.activeGroup);
    
  }

  getTranslate = async(englishWord) => {
    const url = `https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20200426T115419Z.97bb9a32a36038b3.031a34722fc5dd5a26a8dd0a1871ea5dcdf6db29&text=${englishWord}&lang=en-ru`;
    const res = await fetch(url);
    const json = await res.json();
    this.setState({currentTranslate: json.text[0]})
    console.log(JSON.stringify(json))
  }
  
  onTrainingClick= (e) => {
    if(!this.state.isSpeakMode) {
        e.currentTarget.querySelector('audio')?.play();
        if(this.state.words[e.currentTarget.dataset.index] && this.state.words[e.currentTarget.dataset.index].word) {
            this.getTranslate(this.state.words[e.currentTarget.dataset.index].word)
        }
        this.setState({ currentImage: this.state.words[e.currentTarget.dataset.index]?.image})
    }
  }

  clearResults = () => {
    this.setState({
        knownWords: []
    })
  }

  recognitionResultEventHandler = (e) => {
    const transcript = Array.from(e.results)
      .map(result => result[0])
      .map(result => result.transcript)
      .join('')
      .toLowerCase();
      console.log(transcript)
    const wordMatch = this.state.words.find((x) => x.word.toLowerCase() === transcript && !this.state.knownWords.includes(x));
    if(wordMatch) {
        const knownWords = Array.from(this.state.knownWords);
        knownWords.push(wordMatch);
        this.setState({
            currentTranscript: transcript,
            knownWords: knownWords,
            currentImage: wordMatch.image
        });
      if(knownWords.length === 20) {
        document.querySelector('#results').click();
      }
    } else {
        this.setState({currentTranscript: transcript});
    }
  }

  recognitionEndEventHandler = () => {
    if(this.state.isSpeakMode)
      this.state.recognition.start();
  }


  turnOnSpeak = () => {
    this.setState({
        isSpeakMode: true,
        knownWords: []
    });
    this.state.recognition.addEventListener('result', this.recognitionResultEventHandler)
    this.state.recognition.addEventListener('end', this.recognitionEndEventHandler);
    this.state.recognition.start();
  }
  
  turnOffSpeak = () => {
    this.setState({
        isSpeakMode: false
    })
    this.clearResults();
    this.state.recognition.stop();
    this.state.recognition.abort();
    this.props.state.updateStats(this.state);
  }

  onGetResults = () => {
    this.props.state.changeParentState(this.state);
    this.state.recognition.stop();
    this.state.recognition.removeEventListener('result', this.recognitionResultEventHandler)
    this.state.recognition.removeEventListener('end', this.recognitionEndEventHandler);
    
  }

  componentDidMount () {
    if(this.state.words.length === 0) {
      this.getWords(this.state.activePage, this.state.activeGroup);
    }
    if(this.props.state.words.length > 0 && this.state.isSpeakMode) {
      this.state.recognition.addEventListener('result', this.recognitionResultEventHandler)
      this.state.recognition.addEventListener('end', this.recognitionEndEventHandler);
      this.state.recognition.start();
    }
  }

  render() {
    return (
      <div className="game">
        <div className="game__level">
        <Pagination size="lg" >
            {
                Array.from({length: 6}, (x, i) => i + 1).map((x) => {
                    return (
                        <Pagination.Item key={x} active={x === (this.state.activeGroup + 1)} onClick={this.handleGroupChange}>
                            {x}
                        </Pagination.Item>
                    );
                })
            }
        </Pagination>
        <div className="progress__container">
            <label>Score {this.state.knownWords.length}/20</label>  
            <div className="progress">
                <div className="progress-bar" role="progressbar" style={{width: (this.state.knownWords.length/20 * 100) + '%'}} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
            </div>
            </div>
        </div>
        <div className="game-image-container">
          <img alt="" src={`https://raw.githubusercontent.com/ildar107/rslang-data/master/data/${this.state.currentImage?.replace('files/', '')}`}  crossOrigin = "Anonymous"/>
          <div className="form-group">
                <fieldset >
                <span className={`micro ${this.state.isSpeakMode ? 'micro_active' : ''}`}>
                    <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="microphone" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 512" ><path fill="#EB6864" d="M176 352c53.02 0 96-42.98 96-96V96c0-53.02-42.98-96-96-96S80 42.98 80 96v160c0 53.02 42.98 96 96 96zm160-160h-16c-8.84 0-16 7.16-16 16v48c0 74.8-64.49 134.82-140.79 127.38C96.71 376.89 48 317.11 48 250.3V208c0-8.84-7.16-16-16-16H16c-8.84 0-16 7.16-16 16v40.16c0 89.64 63.97 169.55 152 181.69V464H96c-8.84 0-16 7.16-16 16v16c0 8.84 7.16 16 16 16h160c8.84 0 16-7.16 16-16v-16c0-8.84-7.16-16-16-16h-56v-33.77C285.71 418.47 352 344.9 352 256v-48c0-8.84-7.16-16-16-16z"></path></svg> 
                    </span>
                <input 
                    className={`form-control ${this.state.isSpeakMode ? 'input_active' : ''}`}
                    id="disabledInput"
                    type="text"
                    value={this.state.isSpeakMode ? this.state.currentTranscript : this.state.currentTranslate} 
                    disabled
                    />
                </fieldset>
            </div>
        </div>
        <WordsSet words={this.state.words} trainingClick={this.onTrainingClick} isSpeakMode={this.state.isSpeakMode} knownWords={this.state.knownWords}/>
        <Pagination size="lg" >
            <Pagination.First onClick={this.moveToFirstPage}/>
            <Pagination.Prev onClick={this.moveToRight}  disabled = {this.state.skip + this.state.shift === 10 ? true : false} />
             {this.state.pages.map((x) => {
                return (
                 <Pagination.Item key={x} active={x === (this.state.activePage + 1)} onClick={this.handlePageChange}>
                 {x}
               </Pagination.Item>
                )
            })}
            <Pagination.Next onClick={this.moveToLeft}  disabled = {this.state.skip + this.state.shift === 30 ? true : false}/>
            <Pagination.Last onClick={this.moveToLastPage}/>
        </Pagination>
        <div className="control">
          <button type="button" id="restart" className="btn btn-primary btn-lg" onClick={this.turnOffSpeak}>Restart</button>
          <button 
            type="button" 
            id="speak" 
            className={`btn btn-primary btn-lg ${this.state.isSpeakMode ? 'speak_active' : ''}`}
            disabled={this.state.isSpeakMode}
            onClick={this.turnOnSpeak}>
                Speak please
          </button>
          <Link to={routes.RESULTS}  id="results" className="btn btn-primary btn-lg" onClick={this.onGetResults}>Results</Link>
        </div>
      </div>
    );
  }
}

export default GamePage;