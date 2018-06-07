import { Client } from '@syr/bus';

let client = new Client('com.derek.testApp');

let input = document.createElement('input');
input.value = 2;
document.body.appendChild(input);

let button = document.createElement('button');
button.textContent = "Double";
document.body.appendChild(button);

let halfButton = document.createElement('button');
halfButton.textContent = "Halve";
document.body.appendChild(halfButton);

let squareButton = document.createElement('button');
squareButton.textContent = "Square";
document.body.appendChild(squareButton);

let rootButton = document.createElement('button');
rootButton.textContent = "Sqrt";
document.body.appendChild(rootButton);


rootButton.onclick = function() {
  let returnPromise = client.message('syr://com.derek.scientificMathApp/root', {
    num: input.value,
  });
  returnPromise.then(result => {
    input.value = result;
  });
}

squareButton.onclick = function() {
  let returnPromise = client.message('syr://com.derek.scientificMathApp/square', {
    num: input.value,
  });
  returnPromise.then(result => {
    input.value = result;
  });
}

button.onclick = function() {
  let returnPromise = client.message('syr://com.derek.mathApp/double', {
    num: input.value,
  });
  returnPromise.then(result => {
    input.value = result;
  });
}

halfButton.onclick = function() {
  let returnPromise = client.message('syr://com.derek.mathApp/halve', {
    num: input.value,
  });
  returnPromise.then(result => {
    input.value = result;
  });
}