const validator = require("validator");

export default class Login {
    constructor(formClass) {
        this.form = document.querySelector(formClass);
    }

    init() {
        this.events()
    }

    events() {
        if (!this.form) return;
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            // alert('form nãoo enviado')
            this.validate(e);
        })
    }

    validate(e) {
        const el = e.target;
        const emailInput = el.querySelector('input[name="email"]')
        const passwordInput = el.querySelector('input[name="password"]')
        console.log(emailInput.value, passwordInput.value);
        let error = false;

        if (!validator.isEmail(emailInput.value)) {
            this.criaAviso(emailInput, 'Email inválido')
            error = true;
        } else {
            this.criaAviso(emailInput, '')
        }

        if (passwordInput.value.length < 6 || passwordInput.value.length > 50) {
            this.criaAviso(passwordInput, 'Senha deve ter entre 6 e 50 caracteres')
            error = true;
        } else {
            this.criaAviso(passwordInput, '')
        }
    
        if (!error) {
            el.submit();
        } 
    }

    criaAviso(el, mensagem) {
        const nextElement = el.nextElementSibling;
        if (nextElement && nextElement.classList.contains('invalid-feedback')) { //Se existe substitui
            nextElement.textContent = mensagem;
            nextElement.style.display = 'block';
        } else { //Cria o elemento
            const elementFeedback = document.createElement('div');
            elementFeedback.className = 'invalid-feedback d-block'; // d-block pra ficar visível sempre que necessário
            elementFeedback.textContent = mensagem;
            elementFeedback.style.display = 'block';
            // Insere abaixo do input
            el.insertAdjacentElement('afterend', elementFeedback);
        }

    }
}