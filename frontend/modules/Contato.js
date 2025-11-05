const validator = require("validator");

export default class Contato {
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
            this.validate(e);
        })
    }

    validate(e) {
        const el = e.target;
        const nomeInput = el.querySelector('input[name="nome"]')
        const sobrenomeInput = el.querySelector('input[name="sobrenome"]')
        const emailInput = el.querySelector('input[name="email"]')
        const telefoneInput = el.querySelector('input[name="telefone"]')
        console.log(nomeInput.value, sobrenomeInput.value, emailInput.value, telefoneInput.value);
        let error = false;


        //Checagem campo nome
        if (!validator.isAlpha(nomeInput.value)) {
            this.criaAviso(nomeInput, 'Nome deve conter apenas letras')
            error = true;
        } else {
            this.criaAviso(nomeInput, '')
        }


        //Checagem campo sobrenome
        if (!validator.isAlpha(sobrenomeInput.value)) {
            this.criaAviso(sobrenomeInput, 'Sobrenome deve conter apenas letras')
            error = true;
        } else {
            this.criaAviso(sobrenomeInput, '')
        }

        //Checagem Campo email
        if (!validator.isEmail(emailInput.value)) {
            this.criaAviso(emailInput, 'Email inválido')
            error = true;
        } else {
            this.criaAviso(emailInput, '')
        }

        //Checagem Campo Telefone
        if (!validator.isNumeric(telefoneInput.value)) {
            this.criaAviso(telefoneInput, 'Telefone deve conter apenas números')
            error = true;
        } else {
            this.criaAviso(telefoneInput, '')
        }


        //Senão tiver erros envia o formulário
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