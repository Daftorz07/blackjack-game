
//Patron Modulo - Funcion anonima autoinvocada
const moduloBlackjack = (() => {

    'use strict';

    let deck = [];
    const tipos = ['C', 'D', 'H', 'S'];
    const especiales = ['A', 'J', 'Q', 'K'];

    let puntosJugadores = [];

    //Referencias del HTML
    const btnPedir = document.querySelector('#btnPedir');
    const btnDetener = document.querySelector('#btnDetener');
    const btnNuevo = document.querySelector('#btnNuevo');

    const divCartasJugadores = document.querySelectorAll('.divCartas');
    const puntosHTML = document.querySelectorAll('small');


    //Inicia el juego
    const iniciarJuego = (numeroJugadores = 2) => {

        deck = crearDeck();
        puntosJugadores = [];

        for (let i = 0; i < numeroJugadores; i++) {
            puntosJugadores.push(i);
        }

        console.clear();

        puntosHTML.forEach( elem => elem.innerText = 0);
        divCartasJugadores.forEach(elem => elem.innerHTML = '');

        btnPedir.disabled = false;
        btnDetener.disabled = false;
    }

    //Creando la baraja de cargar
    const crearDeck = () => {

        deck = [];

        for (let i = 2; i <= 10; i++) {
            for (let tipo of tipos) {
                deck.push(i + tipo)
            }
        }

        for (let tipo of tipos) {
            for (let especial of especiales) {
                deck.push(especial + tipo)
            }
        }

        return _.shuffle(deck);
    }


    //Tomar una carta de la baraja
    const pedirCarta = () => {

        if (deck.length === 0) {
            throw ("No hay mas cartas")
        }

        return deck.pop();
    }

    //Calculando el valor de las cartas
    const valorCarta = (carta) => {

        const valor = carta.substring(0, carta.length - 1);
        return (isNaN(valor)) ? ((valor === 'A') ? 11 : 10) : valor * 1
    }


    // Turnos: 0 = primer jugador y el último es la computadora
    const acumularPuntos = (carta, turno) => {

        puntosJugadores[turno] = puntosJugadores[turno] + valorCarta(carta);
        puntosHTML[turno].innerText = puntosJugadores[turno];
        return puntosJugadores[turno];
    }

    //Crear carta 
    const crearCarta = (carta, turno) => {

        const imgCarta = document.createElement('img');
        imgCarta.src = `assets/img/cartas/${carta}.png`;
        imgCarta.classList.add('carta');
        divCartasJugadores[turno].append(imgCarta);
    }

    const determinarGanador = () => {

        const [puntosMinimos, puntosComputador] = puntosJugadores;

        setTimeout(() => {
            //Mensajes del juego
            if (puntosComputador === puntosMinimos) {
                alert('Nadie gana :(');
            } else if (puntosMinimos > 21) {
                alert('Computadora gana')
            } else if (puntosComputador > 21) {
                alert('Jugador Gana')
            } else {
                alert('Computadora Gana')
            }
        }, 100);
    }

    //Turno de la computadora
    const turnoComputadora = (puntosMinimos) => {

        let puntosComputador = 0;

        do {

            const carta = pedirCarta();
            const turnoComputadora = puntosJugadores.length - 1;

            puntosComputador = acumularPuntos(carta, turnoComputadora);
            crearCarta(carta, turnoComputadora);

        } while ((puntosComputador < puntosMinimos) && (puntosMinimos <= 21));

        determinarGanador();

    }

    btnPedir.addEventListener('click', () => {

        const carta = pedirCarta()
        const puntosJugador = acumularPuntos(carta, 0);
        crearCarta(carta, 0);

        //Alerta si el usuario supera los 21
        if (puntosJugador > 21) {

            console.warn('Lo siento mucho, perdiste');
            btnPedir.disabled = true;
            btnDetener.disabled = true;
            turnoComputadora(puntosJugador);

        } else if (puntosJugador === 21) {

            console.warn('21, genial!')
            btnPedir.disabled = true;
            btnDetener.disabled = true;
            turnoComputadora(puntosJugador);

        }
    });

    btnDetener.addEventListener('click', () => {
        btnPedir.disabled = true;
        btnDetener.disabled = true;
        turnoComputadora(puntosJugadores[0]);
    });

    btnNuevo.addEventListener('click', () => {

        iniciarJuego();
    });

    return {
        nuevoJuego: iniciarJuego
    };

})(); // Fin del patron modular
