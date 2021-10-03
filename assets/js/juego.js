

const miModulo = (() => {
    'use strict';
    let nombreJugador = (prompt("BIENVENIDO A BLACKJACK\n Ingresa tu Nombre")).toLowerCase(),
        deck = [];
    const tipos = ['C','D','H','S'],
        especiales = ['A','J','Q','K'];

    let puntosJugadores = [];

    // Referencias del HTML
    const btnPedir = document.querySelector('#btnPedir'),
        btnDetener= document.querySelector('#btnDetener'),
        btnNuevo= document.querySelector('#btnNuevo');

    const divCartasJugadores = document.querySelectorAll('.divCartas'),
        puntosHTML = document.querySelectorAll('small'),
        nombreHTML= document.querySelector('.nombre-jugador-1');
    
    const capitalizarNombre = (nombre) => {
        if(nombre != '') {
            nombre = nombre.charAt(0).toUpperCase() + nombre.slice(1);
        } else {
            nombre = 'Jugador 1';
        }
            return nombre;
    }
    let nombreCapitalizado = capitalizarNombre(nombreJugador);
    nombreHTML.innerText = nombreCapitalizado;
    // Esta funcion inicializa el juego
    const inicializarJuego = (numJugadores = 2) => {
        deck = crearDeck();
        puntosJugadores = [];
        for( let i =0; i<numJugadores; i++) {
            puntosJugadores.push(0);
        }
        console.clear;
        puntosHTML.forEach(elem => elem.innerText = 0);
        divCartasJugadores.forEach(elem => elem.innerHTML = '');

        btnPedir.disabled = false;
        btnDetener.disabled = false;
    }

    // Esta funcion crea un nuevo deck
    const crearDeck = () => {
        deck = [];
        for(let i =2; i<=10; i++) {
            for(let tipo of tipos) {
                deck.push(i + tipo);
            }
        }

        for( let tipo of tipos) {
            for( let especial of especiales) {
                deck.push(especial + tipo);
            }
        }
        return _.shuffle( deck );
    }

    // Esta funcion me permite tomar una carta
    const pedirCarta = () => {

        if(deck.length === 0) {
            throw 'No hay cartas en el deck';
        }
        return deck.pop();
    }

    const valorCarta = ( carta ) => {
        const valor = carta.substring(0, carta.length - 1);
        return (isNaN( valor )) ?
                (valor === 'A') ? 11 : 10
                : valor * 1;
    }

    // Turno: 0 = primerjugador y el último sera la computadora
    const acumularPuntos = (carta, turno) => {

        puntosJugadores[turno] = puntosJugadores[turno] + valorCarta(carta);
        puntosHTML[turno].innerText = puntosJugadores[turno];
        return puntosJugadores[turno];
    }

    const crearCarta = (carta, turno) => {
        const imgCarta = document.createElement('img');
        imgCarta.src = `assets/cartas/${carta}.png`;
        imgCarta.classList.add('carta');
        divCartasJugadores[turno].append(imgCarta);
    }

    const determinarGanador = () => {

        const [puntosMinimos, puntosComputadora] = puntosJugadores;

        setTimeout(() => {
            if(puntosComputadora === puntosMinimos) {
                alert(`De no creer ${nombreCapitalizado}, fue empate.`);
            } else if(puntosMinimos > puntosComputadora && puntosMinimos <= 21  || puntosComputadora > 21) {
                alert(`La fortuna te sonrie ${nombreCapitalizado}!!!...Ganaste!!!`);
            } else if(puntosMinimos < puntosComputadora && puntosComputadora <= 21 || puntosMinimos > 21) {
                alert(`Mala suerte ${nombreCapitalizado}...sera la próxima.`);
            }
        }, 100);
    }
    // Turno de la computadora
    const turnocomputadora = (puntosMinimos) => {

        let puntosComputadora = 0;

        do{
            const carta = pedirCarta();
            puntosComputadora = acumularPuntos(carta, puntosJugadores.length - 1);
            crearCarta(carta, puntosJugadores.length - 1);

        } while((puntosComputadora < puntosMinimos) && (puntosMinimos <= 21));

        determinarGanador();
    }

    // Eventos
    btnPedir.addEventListener('click', () => {

        const carta = pedirCarta();
        const puntosJugador = acumularPuntos(carta, 0);

        crearCarta(carta, 0);

        if(puntosJugador > 21 ) {
            btnPedir.disabled = true;
            btnDetener.disabled = true;
            turnocomputadora(puntosJugador);
        } else if (puntosJugador === 21) {
            btnPedir.disabled = true;
            btnDetener.disabled = true;
            turnocomputadora(puntosJugador);

        }

    });

    btnDetener.addEventListener('click', () => {
        btnPedir.disabled = true;
        btnDetener.disabled = true;

        turnocomputadora(puntosJugadores[0]);
    });

    return {
        nuevoJuego: inicializarJuego
    };
    
})();

