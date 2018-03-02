import React, { Component } from 'react';
import './App.css';
import LocationSelector from './LocationSelector.jsx';
import moment from 'moment';

class App extends Component {
  constructor() {
    super();

    this.state = {
      center: { lat: 35.681167, lng: 139.767052 },
      radius: 500,
      from_date: moment().add(30, 'days').format("YYYY-MM-DD"),
      to_date: moment().add(33, 'days').format("YYYY-MM-DD"),
      min_charge: 8000,
      max_charge: 15000
    };
  }

  onLocationChange(center, radius) {
    this.setState({
      center,
      radius
    });
  }

  feedUrl() {
    const { center, radius, from_date, to_date, min_charge, max_charge } = this.state;
    const url = new URL('/feed.xml', window.location.href);

    url.searchParams.append('latitude', center.lat);
    url.searchParams.append('longitude', center.lng);
    url.searchParams.append('from', from_date);
    url.searchParams.append('to', to_date);
    url.searchParams.append('min_charge', min_charge);
    url.searchParams.append('max_charge', max_charge);
    url.searchParams.append('search_radius', Math.floor(radius / 100) / 10);

    return url.toString();
  }

  render() {
    const { center, radius, from_date, to_date, min_charge, max_charge } = this.state;
    const onLocationChange = this.onLocationChange.bind(this);

    return (
      <div className="container">
        <h3>vacanthotelsearch</h3>
        <div className="section">
          <h5>where</h5>
          <div className="row location-selector">
            <div className="input-field col s12">
              <LocationSelector
                {
                  ...{
                    center,
                    radius,
                    onLocationChange
                  }
                }
              />
            </div>
          </div>
        </div>
        <div className="section">
          <h5>when</h5>
          <div className="row">
            <div className="input-field col s6">
              <input
                id="from-date"
                type="date"
                className="validate"
                defaultValue={from_date}
                onChange={(event) => this.setState({ from_date: event.target.value })}
                required
              />
            </div>
            <div className="input-field col s6">
              <input
                id="to-date"
                type="date"
                className="validate"
                defaultValue={to_date}
                onChange={(event) => this.setState({ to_date: event.target.value })}
                required
              />
            </div>
          </div>
        </div>
        <div className="section">
          <h5>how much</h5>
          <div className="row">
            <div className="input-field col s6">
              <input
                id="min-charge"
                type="number"
                step="100"
                className="validate"
                defaultValue={min_charge}
                onChange={(event) => this.setState({ min_charge: event.target.value })}
                required
              />
              <label htmlFor="min-charge">Min charge</label>
            </div>
            <div className="input-field col s6">
              <input
                id="max-charge"
                type="number"
                step="100"
                className="validate"
                defaultValue={max_charge}
                onChange={(event) => this.setState({ max_charge: event.target.value })}
                required
              />
              <label htmlFor="max-charge">Max charge</label>
            </div>
          </div>
        </div>
        <div className="section">
          <h4>feed</h4>
          <div className="row">
            <div className="col s12">
              <ul>
                <li>
                  <a href="https://ifttt.com/applets/E9K2refq-rss-to-ifttt-app">RSS to IFTTT App</a>
                </li>
                <li>
                  <a href="https://slack.com/apps/A0F81R7U7-rss">Slack RSS App</a>
                </li>
              </ul>
            </div>
          </div>
          <div className="row">
            <div className="input-field col s12">
              <textarea
                id="textarea1"
                className="materialize-textarea"
                value={this.feedUrl()}
                onClick={(event) => event.target.select()}></textarea>
              <label htmlFor="textarea1">URL</label>
            </div>
          </div>
          <div className="row">
            <div className="col s12">
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
