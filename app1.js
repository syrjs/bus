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