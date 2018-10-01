import React, { Component } from 'react';
import './App.css';
import { Provider, connect } from 'react-redux'

// REDUX

// 'imports' redux
var redux = require('redux');

// parameters
const maxLengthMain = 12;
const maxLengthTop = 58;
const maxVal = () => {
  let n = '';
  for (let i=0; i<maxLengthMain; i++){
    n = n.concat('9');
  }
  return n;
}

// default state
const initialState = {
  main: '0',
  top: ''
}

// action types
const APPEND_NUM = 'APPEND_NUM';
const RESET = 'RESET';
const APPEND_DECIMAL = 'APPEND_DECIMAL';
const OPERATOR = 'OPERATOR';
const EQUALS = 'EQUALS';

// action creators:
const appendNumber = (num) => {
  return {
    type: APPEND_NUM,
    num: num
  }
}
const resetDisplay = () => {
  return {
    type: RESET
  }
}

const appendOperator = (operator) => {
  return {
    type: OPERATOR,
    operator: operator
  };
}

const equals = () => {
  return {
    type: EQUALS
  }
}

const appendDecimal = () => {
  return {
    type: APPEND_DECIMAL,
  };
}

// reducer
const reducer = (state = initialState, action) => {
  let newState = Object.create(state);
  if (newState.main === 'Too large') {newState.main = '0'}
  switch (action.type) {
    case APPEND_NUM:
      if (/=/.test(newState.top)) {
        return {
          main: action.num,
          top: action.num
        }
      }
      if (newState.main.length >= maxLengthMain) { return state };
      if (newState.main === '0') {
        if (action.num === '0') {
          return newState;
        } else
          return { main: action.num, top: action.num };
      } else if (newState.main === '+' || newState.main === '-') {
        return {
          main: action.num,
          top: newState.top.concat(action.num)
        }
      } else if (newState.main === '*' || newState.main === '/') {
        return {
          main: action.num,
          top: newState.top.concat(action.num)
        };
      } else {
        return {
          main: newState.main.concat(action.num),
          top: newState.top.concat(action.num)
        }
      }
    case OPERATOR:
      if (/=/.test(newState.top)) {
        return {
          top: state.main.concat(action.operator),
          main: action.operator
        };
      }
      if (newState.main === '0' && newState.top === '') {
        if (action.operator === '*' || action.operator === '/') {
          return newState;
        } else {
          return {
            main: action.operator,
            top: action.operator
          };
        }
      } else if (newState.main === '+' || newState.main === '-') {
        return newState;
      } else if (newState.main === '*' || newState.main === '/') {
        return newState;
      } else {
        return {
          main: action.operator,
          top: newState.top.concat(action.operator)
        };
      }
    case APPEND_DECIMAL:
      if (newState.main.length >= maxLengthMain) { return newState };
      if (/\./.test(newState.main)) {
        return state;
      }
      if (newState.main === '0') {
        if (newState.top === '') {
          return {
            main: '0.',
            top: '0.'
          };
        } else {
          return {
            main: '0.',
            top: newState.top.concat('.')
          };
        }
      }
      if (newState.main === '+' || newState.main === '-' || newState.main === '*' || newState.main === '/') {
        return {
          main: '0.',
          top: newState.top.concat('0.')
        };
      }
      return {
        main: newState.main.concat('.'),
        top: newState.top.concat('.')
      };
    case EQUALS:
      let result;
      if (/=/.test(newState.top)) { return newState; }
      if (newState.top === '' || newState.top === '+' || newState.top === '-' || newState.top === '*' || newState.top === '/') {
        result = '0';
      } else {
        result = eval(newState.top).toString();
      }
      if (eval(result) > maxVal()){
        return {
          main: 'Too large',
          top: ''
        }
      }
      if (result.length > maxLengthMain) {
        result = result.slice(0,maxLengthMain);
      }
      if (/\./.test(result)){
        while (result[result.length-1] === '0') {
          result = result.slice(0,result.length-1);
        }
      }
      return {
        main: result,
        top: newState.top.concat('=', result)
      };
    case RESET:
      return initialState;
    default:
      return state;
  }
}

// Create store

const store = redux.createStore(reducer);

// REACT

// distplay calculation top can take around 34 characters
// display calculation can take 14 chars
class Presentational extends Component {
  constructor(props) {
    super(props);
    this.addNumber = this.addNumber.bind(this);
    this.addOperator = this.addOperator.bind(this);
    this.addDecimal = this.addDecimal.bind(this);
    this.returnResult = this.returnResult.bind(this);
    this.reset = this.reset.bind(this);
  }
  addNumber = (str) => () => {
    this.props.appendNewNumber(str);
  }
  addOperator = (str) => () => {
    this.props.appendNewOperator(str);
  }
  addDecimal() {
    this.props.appendNewDecimal();
  }
  returnResult() {
    this.props.returnEquals();
  }
  reset() {
    this.props.resetDisplay();
  }
  render() {
    return (
      <div className="App app-bg container-center">
        <div id='frame' className='container-center'>
          <div id='display-panel' className='container-center'>
            <div id='display'>
              <p id='display-calculation-top'>{this.props.top}</p>
              <p id='display-calculation'>{this.props.main}</p>
            </div>
          </div>
          <div className='grid-container'>
            <div className='grid-item text-vertical-center btn-pink-dark' id='clear' onClick={this.reset}>AC</div>
            <div className='grid-item text-vertical-center btn-pink' id='divide' onClick={this.addOperator('/')}>&divide;</div>
            <div className='grid-item text-vertical-center btn-pink' id='multiply' onClick={this.addOperator('*')}>&times;</div>
            <div className='grid-item text-vertical-center btn-white' id='seven' onClick={this.addNumber('7')}>7</div>
            <div className='grid-item text-vertical-center btn-white' id='eight' onClick={this.addNumber('8')}>8</div>
            <div className='grid-item text-vertical-center btn-white' id='nine' onClick={this.addNumber('9')}>9</div>
            <div className='grid-item text-vertical-center btn-pink' id='subtract' onClick={this.addOperator('-')}>-</div>
            <div className='grid-item text-vertical-center btn-white' id='four' onClick={this.addNumber('4')}>4</div>
            <div className='grid-item text-vertical-center btn-white' id='five' onClick={this.addNumber('5')}>5</div>
            <div className='grid-item text-vertical-center btn-white' id='six' onClick={this.addNumber('6')}>6</div>
            <div className='grid-item text-vertical-center btn-pink' id='add' onClick={this.addOperator('+')}>+</div>
            <div className='grid-item text-vertical-center btn-white' id='one' onClick={this.addNumber('1')}>1</div>
            <div className='grid-item text-vertical-center btn-white' id='two' onClick={this.addNumber('2')}>2</div>
            <div className='grid-item text-vertical-center btn-white' id='three' onClick={this.addNumber('3')}>3</div>
            <div className='grid-item text-vertical-center btn-pink' id='equals' onClick={this.returnResult}>=</div>
            <div className='grid-item text-vertical-center btn-white' id='zero' onClick={this.addNumber('0')}>0</div>
            <div className='grid-item text-vertical-center btn-white' id='decimal' onClick={this.addDecimal}>.</div>
          </div>
        </div>
      </div>
    );
  }
}

// REACT-REDUX

function mapStateToProps(state) {
  return {
    main: store.getState().main,
    top: store.getState().top
  };
}

function mapDispatchToProps(dispatch) {
  return {
    appendNewNumber: (num) => {
      dispatch(appendNumber(num));
    },
    appendNewOperator: (operator) => {
      dispatch(appendOperator(operator));
    },
    appendNewDecimal: () => {
      dispatch(appendDecimal());
    },
    returnEquals: () => {
      dispatch(equals());
    },
    resetDisplay: () => {
      dispatch(resetDisplay());
    }
  }
}

const Container = connect(mapStateToProps, mapDispatchToProps)(Presentational);

class AppWrapper extends Component {
  render() {
    return (
      <Provider store={store}>
        <Container />
      </Provider>
    );
  }
}

export default AppWrapper;
