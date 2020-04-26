import React, { Component } from 'react';
import ResultWordItem from '../components/ResultWordItem/ResultWordItem';
import { Link } from 'react-router-dom';
import routes from '../constants/routes';

class ResultPage extends Component {
 constructor(props) {
   super(props);
 }

  playAudio = (e) => {
    e.currentTarget.querySelector('audio')?.play();
  }

  setNewGame = () => {
      this.props.state.updateStats(this.props.state);
      this.props.state.changeParentState({isSpeakMode: false});
  }

   render = () => {
    return (
        <div className="result__container">
            <div className="error__title">
                <p>Ошибок <span className="badge badge-primary"> {this.props.state.words.filter((x) => !this.props.state.knownWords.includes(x)).length}</span></p>
            </div>
            <div className="error__words">
                {this.props.state.words.filter((x) => !this.props.state.knownWords.includes(x)).map((x, i) => {
                    return (
                        <ResultWordItem playAudio={this.playAudio} audio={x.audio} word={x.word} transcription={x.transcription} key={i}/>
                    )
                })}
            </div>
            <div className="success__title">
                <p>Знаю <span className="badge badge-success"> {this.props.state.knownWords.length}</span></p>
            </div>
            <div className="success__words">
                    {this.props.state.knownWords.map((x, i) => {
                    return (
                        <ResultWordItem playAudio={this.playAudio} audio={x.audio} word={x.word} transcription={x.transcription}  key={i}/>
                    )
                })}
            </div>
            <div className="result__control">
                <Link to={routes.GAME}  className="btn btn-primary btn-lg" >Return</Link>
                <Link to={routes.GAME}  className="btn btn-primary btn-lg" onClick={this.setNewGame}>New game</Link>
                <Link to={routes.STATS}  className="btn btn-primary btn-lg">Statistics</Link>
                </div>
        </div>
    );
  }
}

export default ResultPage;