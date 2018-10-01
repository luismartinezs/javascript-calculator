var redux = require('redux');
// Before implementing program in Components, I will create a javascript prgram that does the same

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

// actions:
// appendNumber
const appendNumber = (num) => {
    return {
        type: APPEND_NUM,
        num: num
    }
}
// resetDisplay
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
    switch (action.type) {
        case APPEND_NUM:
            if (newState.main.length >= 14) { return state };
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
            if (newState.main.length >= 14) { return state };
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
            if (/=/.test(newState.top)) { return state; }
            if (newState.top === '' || newState.top === '+' || newState.top === '-' || newState.top === '*' || newState.top === '/') {
                result = '0';
            } else {
                result = eval(newState.top).toString();
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


// Everything below is for testing purposes, do not use as part of the store

// Visualize on terminal
const display = function () {
    console.log('Current display:');
    console.log('    top:', store.getState().top);
    console.log('    main:', store.getState().main);
}

// Evaluate expression:
const evalExp = (str) => {
    return eval(str);
}

const evalPrint = (str) => {
    console.log(evalExp(str));
}


// Input / output testing env:

const calculator = (str, result, v = 'silent') => {
    console.log('*** New calculation ***');
    let arr = str.split('');
    if (v === 'verbose') { display(); }
    for (let i = 0; i < arr.length; i++) {
        if ((/[0-9]/).test(arr[i])) {
            if (v === 'verbose') { console.log('Number called'); }
            store.dispatch(appendNumber(arr[i]));
        }
        if ((/[\+\-\/\*]/).test(arr[i])) {
            if (v === 'verbose') { console.log('Operator called'); }
            store.dispatch(appendOperator(arr[i]));
        }
        if ((/=/).test(arr[i])) {
            if (v === 'verbose') { console.log('Equal called'); }
            store.dispatch(equals());
        }
        if ((/\./).test(arr[i])) {
            if (v === 'verbose') { console.log('Dot called'); }
            store.dispatch(appendDecimal());
        }
        if (v === 'verbose') { console.log('Passed value:', arr[i]); }
        if (v === 'verbose') { display(); }
        if (v === 'verbose') { console.log('----'); }
    }
    display();
    shouldBe(result);
    store.dispatch(resetDisplay());
}

const shouldBe = (str) => {
    console.log('Main should be ' + str);
    console.log('');
}

// Tests:
// calculator('1=', '1'); // OK
// calculator('0=', '0'); // OK
// calculator('+=', '0'); // OK
// calculator('-=', '0'); // OK
// calculator('3+4=', '7'); // OK
// calculator('3+0=', '3'); // OK
// calculator('0+0', '0'); // OK
// calculator('3+0+3=', '6'); // OK
// calculator('*=', '0'); // OK
// calculator('8*8=', '64'); // oK
// calculator('*8=', '8'); // OK
// calculator('4/2=', '2'); // OK
// calculator('4+2=', '6'); // OK
// calculator('1+1*2/2=', '2'); // OK
// calculator('1234=', '1234'); // OK
// calculator('10+10*10=', '110'); // OK
// calculator('=', '0'); // oK
// calculator('++=', '0'); // OK
// calculator('3++4-*2/*-//2=', '6'); // OK
// calculator('3.4=', '3.4'); // OK
// calculator('2.0+1.1=', '3.1'); // OK
// calculator('1+1==', '2'); // OK
// calculator('1+2-1*2/1+1.1=', '2.1'); // OK
// calculator('0.=', '0');  // OK
// calculator('0.1=', '0.1'); // OK
// calculator('29.=', '29'); // OK
// calculator('6+0.1=', '6.1'); // OK
// calculator('6+.1=', '6.1'); // OK
// calculator('00+1=', '1'); // OK
// calculator('-1+2=','1'); // OK
calculator('9999+999999999999999999999999999999999999999999999999999999999=','9999');
calculator('99999999999999*99999999999=','');
calculator('100*100=','');