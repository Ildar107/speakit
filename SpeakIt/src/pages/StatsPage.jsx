import React, { Component } from 'react';
import ResultWordItem from '../components/ResultWordItem/ResultWordItem';
import { Link } from 'react-router-dom';
import routes from '../constants/routes';

class StatsPage extends Component {
 constructor(props) {
   super(props);
   this.stats = window.localStorage.getItem('stats') ? JSON.parse(window.localStorage.getItem('stats')) : [];
 }
  render = () => {
    return (
        <div className="stats__container">
            {this.stats.map((x, i) => {
                return (
                    <div className="stats__item" key={i}>
                        <span className="stats__time">{x.time}</span>
                        <span className="stats__level">{`level: ${x.group}`}</span>
                        <span className="stats__page">{`page: ${x.page}`}</span>
                        <span className="stats__error">{`errors: ${x.errors}`}</span>
                        <span className="stats__success">{`success: ${x.success}`}</span>
                    </div>
                )
            })}
           
           <div className="stats__control">
               <Link to={routes.GAME}  className="btn btn-primary btn-lg">Return to game</Link>
           </div>
        </div>
    );
  }
}

export default StatsPage;