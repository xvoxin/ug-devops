import React from 'react';
import axios from 'axios';

class App extends React.Component {

    constructor(props) {
        super(props);
    
        this.state = {
          nok: 0,
          pln: 0,
          history: []
        };
      }

      onCalculateClicked = async () => {
        const response = await axios.get(`/api/exchange/${this.state.nok}`);
        this.setState({ pln: response.data });
      };
      
      onNokValueChanged = (event) => {
        this.setState({ nok: event.target.value });
      };
    
      onUpdateHistoryClicked = async () => {
        const response = await axios.get(`/api/history`);
        this.setState({ history: response.data });
      };

      render() {
        return (
            <div>

                <div>
                    <p>NOK: </p>
                    <input type="number" value={this.state.nok} onChange={this.onNokValueChanged}/>
                    <p>PLN:</p>
                    <p>{this.state.pln}</p>
                    <button onClick={this.onCalculateClicked}>Calculate</button>
                </div>
                <div>
                    <p>History</p>
                    <button onClick={this.onUpdateHistoryClicked}>Update</button>
                    { this.state.history.map((item, i) => <p key={i}>NOK: {item["nok"]}, PLN: {item["pln"]}</p>) }
                    
                </div>

            </div>
        )


      }

}

export default App;