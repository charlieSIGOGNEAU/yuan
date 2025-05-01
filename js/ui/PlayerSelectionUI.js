export class PlayerSelectionUI {
    constructor() {
        this.currentPlayer = 1;
        this.buttons = [
            document.getElementById('player1-btn'),
            document.getElementById('player2-btn'),
            document.getElementById('player3-btn')
        ];
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.buttons.forEach((btn, idx) => {
            btn.addEventListener('click', () => {
                this.selectPlayer(idx + 1);
            });
        });
    }

    selectPlayer(playerNumber) {
        this.currentPlayer = playerNumber;
        this.buttons.forEach((btn, idx) => {
            if (idx + 1 === playerNumber) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        // Émettre un événement personnalisé pour informer les autres composants
        const event = new CustomEvent('playerSelected', { 
            detail: { playerNumber } 
        });
        document.dispatchEvent(event);
    }

    getCurrentPlayer() {
        return this.currentPlayer;
    }
} 