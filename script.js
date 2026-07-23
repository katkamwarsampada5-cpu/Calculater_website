const display=document.getElementById('input');
const previous=document.getElementById('previousInput');
const buttons=document.querySelectorAll('[data-value]');
let expression='';

const operators=['+','-','*','/'];

function render(){display.value=expression||'0';}

function evaluateExpression(){
  if(!expression.trim()) return;
  try{
    if(!/^[0-9+\-*/().\s]+$/.test(expression)) throw new Error();
    const result=Function('"use strict";return ('+expression+')')();
    if(!Number.isFinite(result)) throw new Error();
    previous.textContent=expression+' =';
    expression=Number.isInteger(result)?String(result):String(parseFloat(result.toFixed(10)));
    render();
  }catch{
    previous.textContent='Invalid calculation';
    display.value='Error';
    expression='';
  }
}

function append(value){
  const last=expression.slice(-1);

  if(value==='.' && expression.split(/[+\-*/()]/).pop().includes('.')) return;

  if(operators.includes(value)){
    if(!expression && value!=='-') return;
    if(operators.includes(last)) expression=expression.slice(0,-1);
  }

  if(value==='('){
    expression+=(/[0-9)]/.test(last)?'*(':'(');
  }else if(value===')'){
    const open=(expression.match(/\(/g)||[]).length;
    const close=(expression.match(/\)/g)||[]).length;
    if(open<=close || !expression || operators.includes(last) || last==='(') return;
    expression+=')';
  }else{
    expression+=value;
  }
  render();
}

function handle(value){
  if(value==='AC'){expression='';previous.textContent='';render();return;}
  if(value==='DEL'){expression=expression.slice(0,-1);render();return;}
  if(value==='='){evaluateExpression();return;}
  if(value==='%'){
    if(!expression) return;
    expression='('+expression+')/100';
    evaluateExpression();
    return;
  }
  append(value);
}

buttons.forEach(button=>button.addEventListener('click',()=>handle(button.dataset.value)));

document.addEventListener('keydown',e=>{
  const key=e.key;
  if(/[0-9.+\-*/()]/.test(key)) handle(key);
  else if(key==='Enter'||key==='=') handle('=');
  else if(key==='Backspace') handle('DEL');
  else if(key==='Escape') handle('AC');
  else if(key==='%') handle('%');
});
