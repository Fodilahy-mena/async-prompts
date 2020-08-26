
function wait(ms = 0) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function destroyPopup(popup) {
    popup.classList.remove('open');
    await wait(1000);

    // remove the popup from the DOM
    popup.remove();

    // remove it from the js memory
    popup = null;
}

function ask(optins) {
    // options object will have an attribute with the questions, and the option for a cancel button 
    return new Promise(async function(resolve) {
        // First we need to create a popup with all the fields in it

        const popup = document.createElement('form');
        popup.classList.add('popup');
        popup.insertAdjacentHTML(
            'afterbegin', 
            `<fieldset>
                <label>${optins.title}</label>
                <input type="text" name="input"/>
                <button type="submit">Submit</button>
            </fieldset>
        `);
        console.log(popup);
        // check if they want a cancel button
        if(optins.cancel) {
            const skipButton = document.createElement('button');
            skipButton.type = 'button'; // so it doesn't submit
            skipButton.textContent = 'Cancel';
            popup.firstElementChild.appendChild(skipButton);
            //TODO: listen for a click on that cancel button

            skipButton.addEventListener('click', () => {
                resolve(null);
                destroyPopup(popup);
            }, { once: true });

        }
        // listen for the submit event on the inputs
        popup.addEventListener('submit', (e) => {
            e.preventDefault();
            console.log('Submitted');
            resolve(e.target.input.value);
            destroyPopup(popup);
        }, { once: true }
        );

        // when someone does submit it, resolve the data that was in the input box

        // insert that popup in the DOM

        document.body.appendChild(popup);

        await wait(50);
        popup.classList.add('open');
    });
}

async function askQuetion(e) {
    const button = e.currentTarget;
    const cancel = 'cancel' in button.dataset;
    // const cancel = button.hasAttribute('[data-cancel]');
    const answer = await ask({ 
        title: button.dataset.question,
        cancel,
    });
    console.log(answer);
}

const buttons = document.querySelectorAll('[data-question]');
buttons.forEach(button => button.addEventListener('click', askQuetion));




const questions = [
    { title: 'What is your name?'},
    { title: 'What is your age?', cancel: true },
    { title: 'Where are you from?'},
    { title: 'Do you have a husband or a wife?'},
    { title: 'What is your dogs name?'},
];

async function asyncMap(array, callBack) {
   const results = [];
   for (const item of array) {
       results.push(await callBack(item));
       
   }
   return results;
}

async function go() {
    const answers = await asyncMap(questions, ask);
    console.log(answers);
    console.log(answers[0]);

}

go();
