import React from 'react';
import { render } from 'react-dom';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import { getRecommendations, loadClusters } from '../api';
import LoLoMoCover from '../components/LoLoMoCover';
import LoMoCover from '../components/LoMoCover';

import '../index.html';
import '../res/app.less';


export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      clusters: [],
      selections: [],
      recomendations: []
    };
  }

  componentDidMount() {
    this.initialLoad();
  }

  async initialLoad() {
    const clusters = await loadClusters();
    this.setState({ clusters });
  }

  async handleMoClick(movie) {
    let selections = [...this.state.selections];
    if (!movie.selected) {
      movie.selected = true;
      selections.push(movie);
    } else {
      movie.selected = false;
      const index = this.state.selections.indexOf(movie);
      selections.splice(index, 1);
    }
    const recomendations = await getRecommendations(selections.map(m => m.id));
    this.setState({ clusters: [...this.state.clusters], recomendations, selections });
  }

  render() {
    return (
      <div className="cnm-analysis-app">
        <section className="all">
          <header>
            <h3>所有影片</h3>
          </header>
          <main>
            <LoLoMoCover data={this.state.clusters} displayCheck={true} onMoClick={movie => this.handleMoClick(movie)} />
          </main>
        </section>

        <section className="recommendations">
          <div>
            <h3>选中的影片 (<span>{this.state.selections.length}</span> 部)</h3>
            <LoMoCover data={this.state.selections} small={true} displayTitle={false} onMoClick={movie => this.handleMoClick(movie)} />
          </div>
          <div>
            <h3>推荐的影片 (<span>{this.state.recomendations.length}</span> 部)</h3>
            <LoMoCover data={this.state.recomendations} onMoClick={movie => this.handleMoClick(movie)} />
          </div>
        </section>
      </div>
    );
  }
}


render(
  <App />,
  document.getElementById('cnm-root')
);
