import React,{Component} from 'react';
import logo from './logo.svg';
import './App.css';
import web3 from './web3';
import lottery from './lottery';

class App extends Component {
  state={
    manager:'',
    players:'',
    balance:'',
    value:'',
    message:''
  };
  
  async componentDidMount(){
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);
   
    

    this.setState({manager,players,balance});

  }

  onSubmit = async event =>{
    event.preventDefault();

    const accounts = await web3.eth.getAccounts();

    this.setState({message:'Waiting on transaction sucess... '})

    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value,'ether')

    });

    this.setState({message: 'You have been entered!!'});


  };

  onClick = async event =>{
    event.preventDefault();

    const accounts = await web3.eth.getAccounts();

    this.setState({message:'Picking a winner'});

    await lottery.methods.pickWinner().send({
      from : accounts[0]
    });

    this.setState({message: 'Winner Picked!!' });
  };

  render(){
    return (
      <div>
        <h2 className='MainHead'>Lottery Contract</h2>
        <p className='MainHead'>This contract is managaed by {this.state.manager}.
            There are currently {this.state.players.length} people entered,
            competing to win {web3.utils.fromWei(this.state.balance, 'ether')} ether! 
        </p>
        <hr />

        <form className='MainHead' onSubmit={this.onSubmit} >
          <h4 className='MainHead'>Want to try luck?</h4>
          <div>
            <label className='MainHead'>Amount of ether to enter</label>
              <input value={this.state.value} 
              onChange={event=>this.setState({value : event.target.value})} 
              />
          </div>
          <button class='MainHead' >Enter</button>
        </form>

        <hr />

        <h1>{this.state.message}</h1>

        

        <h4 className='MainHead'>Ready to pick a winner</h4>
        <button onClick={this.onClick}  class="container" >Pick a Winner</button>

      </div>
    );
  }
}

export default App;
