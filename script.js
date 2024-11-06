class ClickerGame {
    constructor() {
        this.points = 0; 
        this.gainedPoints = 0;
        this.pointsPerClick = 1; 
        this.autoClickerCost = 40; 
        this.multiplierCost = 20; 
        this.autoClickerActive = false; 
        this.autoClickInterval = null; 
        this.multiplier = 1; 
        this.maxPointsReached = 0;
        this.autoClickLevel = 0;
        this.healthPoints = 0; 
        this.evolutionThresholds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];  
        this.currentPokemonIndex = 0; 
        this.currentHealth = 0;

        
        this.pointsDisplay = document.getElementById('points'); 
        this.clickBtn = document.getElementById('clickBtn'); 
        this.buyAutoClickerBtn = document.getElementById('buyAutoClicker'); 
        this.buyMultiplierBtn = document.getElementById('buyMultiplier'); 
        this.autoClickerCostDisplay = document.getElementById('autoClickerCost'); 
        this.multiplierCostDisplay = document.getElementById('multiplierCost'); 
        this.notificationDisplay = document.getElementById('notification');
        this.pointsGainContainer = document.getElementById('points-gain-container');
        this.pokemonImage = document.getElementById('pokemonImage');
        this.currentPokeballImage = 'Media/pokeball/poke-ball.png';
        this.progressBar = document.getElementById('progressBar');

        
        // Initialisation des événements
        this.initEvents();
        this.setupPopup();

        
        
        // Affichage initial des coûts et des boutons
        this.updateCostDisplays(); 
        this.updatePurchaseButtons();
        this.updateProgressBar(); 
        this.startLegendaryPokemonAppearance();
        this.backgroundMusic = document.getElementById('backgroundMusic');
        this.startBackgroundMusic();

        this.initMusicButtons();
    }

    initMusicButtons() {
        const muteBtn = document.getElementById('muteMusic');
        const unmuteBtn = document.getElementById('unmuteMusic');

        // Fonction pour gérer les clics sur les boutons
        function handleButtonClick(clickedBtn, otherBtn) {
            otherBtn.classList.remove('active');
            clickedBtn.classList.add('active');
        }

        muteBtn.addEventListener('click', () => {
            this.muteMusic();
            handleButtonClick(muteBtn, unmuteBtn);
        });
        
        unmuteBtn.addEventListener('click', () => {
            this.unmuteMusic();
            handleButtonClick(unmuteBtn, muteBtn);
        });
    }


    // Initialisation des événements
    initEvents() {
        this.clickBtn.addEventListener('click', () => this.handleClick());
        this.buyAutoClickerBtn.addEventListener('click', () => this.buyAutoClicker());
        this.buyMultiplierBtn.addEventListener('click', () => this.buyMultiplier());
        
        const reset = document.getElementById('reset');
        reset.addEventListener('click', () => this.resetGame());

        document.getElementById('muteMusic').addEventListener('click', () => this.muteMusic());
        document.getElementById('unmuteMusic').addEventListener('click', () => this.unmuteMusic());

    }

    // Gestion du son
    startBackgroundMusic() {
        this.backgroundMusic.volume = 0.2; 
        this.backgroundMusic.play().catch(error => {
            console.log("Erreur lors de la lecture de la musique : ", error);
        });
    }
    muteMusic() {
        this.backgroundMusic.pause();
    }
    
    unmuteMusic() {
        this.backgroundMusic.play();
    }

    // Mettre à jour l'affichage des points
    updatePointsDisplay() {
        this.pointsDisplay.textContent = this.points; 
        this.updatePurchaseButtons(); 
    }

    // Mettre à jour l'affichage des coûts
    updateCostDisplays() {
        this.autoClickerCostDisplay.textContent = this.autoClickerCost; 
        this.multiplierCostDisplay.textContent = this.multiplierCost; 
    }


    // Vérifier et mettre à jour l'état des boutons d'achat
    updatePurchaseButtons() {
        if (this.autoClickerActive) {
            this.buyAutoClickerBtn.classList.add('disabled'); 
            this.buyAutoClickerBtn.disabled = true; 
            this.buyAutoClickerBtn.textContent = "Autoclicker acheté"; 
        } else {
            this.buyAutoClickerBtn.disabled = this.points < this.autoClickerCost; 
            this.buyAutoClickerBtn.classList.toggle('disabled', this.buyAutoClickerBtn.disabled); 
        }
        this.buyMultiplierBtn.classList.toggle('disabled', this.points < this.multiplierCost); 
    }

    // Gestion du clic qui génère des points
    playClickSound() {
        const notificationSound = document.getElementById('clickSound');
        notificationSound.currentTime = 0; 
        notificationSound.play(); 
    }

    handleClick() {
        this.points += this.pointsPerClick * this.multiplier; 
        this.gainedPoints += this.pointsPerClick * this.multiplier;
        if (this.points > this.maxPointsReached) {
            this.maxPointsReached = this.points;
        }
        this.updatePointsDisplay(); 
        this.showPointsGain(`+${this.pointsPerClick * this.multiplier}`);
        this.updateProgressBar();
        this.changePokeballImage();
        this.playClickSound();
    }

    /******************************* réinitialiser le jeu ****************************************/
    /*********************************************************************************************/
    resetGame() {
        const popup = document.getElementById('resetConfirmationPopup');
        popup.classList.remove('hidden'); 
    
        document.getElementById('confirmReset').onclick = () => {
           
            this.points = 0;
            this.gainedPoints = 0;
            this.pointsPerClick = 1;
            this.autoClickerCost = 40;
            this.multiplierCost = 20;
            this.autoClickerActive = false;
            clearInterval(this.autoClickInterval);
            this.autoClickInterval = null;
            this.multiplier = 1;
            this.maxPointsReached = 0;
            this.autoClickLevel = 0;
            this.currentPokemonIndex = 0;
            this.currentHealth = 0;
            this.currentPokeballImage = 'Media/pokeball/poke-ball.png';
    
            this.updatePointsDisplay();
            this.updateCostDisplays();
            this.updatePurchaseButtons();
            this.updatePokemonImage();
            this.progressBar.style.width = '0%';
    
            const timerDisplay = document.getElementById('autoClickerTimer');
            const timerValue = document.getElementById('timerValue');
            timerDisplay.style.display = 'none'; 
            timerValue.textContent = 15;
    
            const containers = document.querySelectorAll('.pokemon-container-hidden');
            containers.forEach(container => {
                container.style.display = 'none'; 
                const pokemonImage = container.querySelector('img');
                if (pokemonImage) {
                    pokemonImage.hidden = true;
                }
            });
    
            const progressBarContainer = document.querySelector('.progress-bar-container');
            progressBarContainer.style.display = 'block';
            const pokeballImage = document.getElementById('clickBtn');
            if (pokeballImage) {
                pokeballImage.src = this.currentPokeballImage;
            }
            this.showNotification("Jeu réinitialisé.");
    
            
            popup.classList.add('hidden');
        };
    
        
        document.getElementById('cancelReset').onclick = () => {
            this.showNotification("Réinitialisation annulée.");
            popup.classList.add('hidden');
        };
    }


    resetGameWithoutConfirmation() {
        this.points = 0;
        this.gainedPoints = 0;
        this.pointsPerClick = 1;
        this.autoClickerCost = 40;
        this.multiplierCost = 20;
        this.autoClickerActive = false;
        clearInterval(this.autoClickInterval);
        this.autoClickInterval = null;
        this.multiplier = 1;
        this.maxPointsReached = 0;
        this.autoClickLevel = 0;
        this.currentPokemonIndex = 0;
        this.currentHealth = 0;
        this.currentPokeballImage = 'Media/pokeball/poke-ball.png';
    
        this.updatePointsDisplay();
        this.updateCostDisplays();
        this.updatePurchaseButtons();
        this.updatePokemonImage();
        this.progressBar.style.width = '0%';
    
        const timerDisplay = document.getElementById('autoClickerTimer');
        const timerValue = document.getElementById('timerValue');
        timerDisplay.style.display = 'none'; 
        timerValue.textContent = 15;
    
        const containers = document.querySelectorAll('.pokemon-container-hidden');
        containers.forEach(container => {
            container.style.display = 'none'; 
            const pokemonImage = container.querySelector('img');
            if (pokemonImage) {
                pokemonImage.hidden = true;
            }
        });
    
        const progressBarContainer = document.querySelector('.progress-bar-container');
        progressBarContainer.style.display = 'block';
        const pokeballImage = document.getElementById('clickBtn');
        if (pokeballImage) {
            pokeballImage.src = this.currentPokeballImage;
        }
    }

    /******************************* Pokemon Légendaires ****************************************/
    /********************************************************************************************/
    startLegendaryPokemonAppearance() {
        let legendaryIndex = 1;

        setInterval(() => {
            this.showLegendaryPokemon(legendaryIndex);
            legendaryIndex++;

            if (legendaryIndex > 16) {
                legendaryIndex = 1;
            }
        }, 45000);
    }

    showLegendaryPokemon(index) {
        const img = document.createElement('img');
        img.src = `media/legendaire/${index}.png`;
        img.classList.add('legendary-pokemon');
        img.draggable = false;
        
        
        const positionZone = Math.floor(Math.random() * 3);

        if (positionZone === 0) { 
            // Côté gauche
            img.style.left = '0';
            img.style.top = `${Math.random() * 50}%`;
        } else if (positionZone === 1) { 
            // Côté droit
            img.style.left = 'calc(100% - 200px)'; 
            img.style.top = `${Math.random() * 50}%`;
        } else { 
            // Bas de l'écran
            img.style.left = `${Math.random() * 50}%`;
            img.style.top = 'calc(100% - 150px)'; 
        }

        document.body.appendChild(img);
        setTimeout(() => img.classList.add('show'), 50); 

        img.addEventListener('click', (event) => {
            const gain = 500;
            this.points += gain;
            this.gainedPoints += gain;
            this.updatePointsDisplay();
            this.updateProgressBar();
            this.showPointsGain(`+${gain}`, event);
            this.showNotification("+500 points obtenus en capturant un Pokémon légendaire");
            img.classList.remove('show');
            img.classList.add('hide'); 
            setTimeout(() => img.remove(), 500);
        });

        setTimeout(() => {
            if (document.body.contains(img)) {
                img.classList.remove('show'); 
                img.classList.add('hide');
                setTimeout(() => img.remove(), 500); // 
            }
        }, 3000);
    }

    /******************************* Popup ***********************************************/
    /*************************************************************************************/
    setupPopup() {
        const openPopupBtn = document.getElementById('openRulesPopupBtn');
        const popup = document.getElementById('openPopup');
        const closePopupBtn = document.getElementById('closePopup');

        openPopupBtn.addEventListener('click', () => {
            popup.style.visibility = 'visible';
            popup.style.opacity = '1';
        });

        closePopupBtn.addEventListener('click', () => {
            popup.style.opacity = '0';
            setTimeout(() => popup.style.visibility = 'hidden', 300);
        });
    }

    /******************************* L'évolution des Pokemons ****************************************/
    /*************************************************************************************************/

    //  Mise à jour des images 
    updatePokemonImage() {
        this.pokemonImage.src = `media/pokemon/${this.currentPokemonIndex + 1}.png`;
        this.currentHealth = 0; 
        this.gainedPoints = 0;
        this.progressBar.style.display = 'block'; 
    }

    // Barre de progression
    updateProgressBar() {
        const maxHealth = 2000;
        this.currentHealth = Math.min(this.gainedPoints, maxHealth); 
        const percentage = (this.currentHealth / maxHealth) * 100; 
        this.progressBar.style.transition = 'width 0.5s ease'; 
        this.progressBar.style.width = `${percentage}%`; 
        if (this.currentHealth >= maxHealth) {
            this.checkEvolution();     
        }
    }

    // Verification du Progression
    checkEvolution() {
        if (this.currentPokemonIndex < this.evolutionThresholds.length - 1) {
            if (this.currentHealth >= this.evolutionThresholds[this.currentPokemonIndex]) {
                this.currentPokemonIndex++;
                this.gainedPoints = 0;  
                this.animateEvolution();
            }
        } else if (this.currentPokemonIndex === this.evolutionThresholds.length - 1) {
                this.currentHealth = 2000;
                this.progressBar.style.width = '100%';
                const progressBarContainer = document.querySelector('.progress-bar-container');
                progressBarContainer.style.display = 'none'; 
                this.displayEndGame(); 
        } 

        // Garder les pokemons qui ont atteint leurs formes finales
        if (this.currentPokemonIndex === 4) {
            const container4 = document.getElementById('container4');
            const pokemonImage4 = document.getElementById('pokemonImage4'); 
            container4.style.display = 'block';
            pokemonImage4.hidden = false; 
        }
        if (this.currentPokemonIndex === 9) {
            const container9 = document.getElementById('container9');
            const pokemonImage9 = document.getElementById('pokemonImage9');
            container9.style.display = 'block';
            pokemonImage9.hidden = false; 
        }
    }

    //  Animation de l'évolution 
    animateEvolution() {
        const evolutionSound = document.getElementById('evolutionSound');
        evolutionSound.currentTime = 0; 
        evolutionSound.play(); 
        this.pokemonImage.style.transition = 'opacity 0.5s ease';
        this.pokemonImage.style.opacity = 0; 
    
        setTimeout(() => {
            this.updatePokemonImage(); 
            this.pokemonImage.style.opacity = 1; 
            this.showNotification('Votre pokemon a évolué')
        }, 500);        
        this.updateProgressBar();
    }
    

    /******************************* l'autoclicker ****************************************/
    /**************************************************************************************/
    buyAutoClicker() {
        if (this.points >= this.autoClickerCost) {
            this.points -= this.autoClickerCost;
            this.updatePointsDisplay();
            this.autoClickerCost *= 2;
            this.updateCostDisplays();
            this.autoClickLevel++;
            
            if (this.autoClickLevel === 1) {
                this.showNotification(`Autoclicker activé. Il génère ${this.autoClickLevel} point par seconde.`);
            } else {
                this.showNotification(`Autoclicker amélioré. Il génère maintenant ${this.autoClickLevel} points par seconde.`);
            }
    
            document.getElementById("autoClickPointsDisplay").textContent = `+${this.autoClickLevel}/s`;
    
            // Affichage du timer
            const timerDisplay = document.getElementById('autoClickerTimer');
            const timerValue = document.getElementById('timerValue');
            timerDisplay.style.display = 'block';
            let timeRemaining = 15;
    
            timerValue.textContent = timeRemaining;
    
            // Jouer le son du timer
            const timerSound = document.getElementById('timerSound');
            timerSound.currentTime = 0;
            timerSound.play(); 
    
            // Démarrer le timer visuel et l'autoclick
            this.autoClickInterval = setInterval(() => {
                this.points += this.autoClickLevel;
                this.gainedPoints += this.autoClickLevel;
                this.updatePointsDisplay();
                this.showPointsGain(`+${this.autoClickLevel}`);
                this.updateProgressBar();
            }, 1000);
    
            const countdownInterval = setInterval(() => {
                timeRemaining--;
                timerValue.textContent = timeRemaining;
    
                if (timeRemaining <= 0) {
                    clearInterval(countdownInterval);
                    clearInterval(this.autoClickInterval);
                    timerDisplay.style.display = 'none';
                    this.autoClickerActive = false;
                    this.updatePurchaseButtons();
                }
            }, 1000);
    
            this.autoClickerActive = true;
            this.updatePurchaseButtons();
        }
    }
    

    /******************************* Multiplicateur ****************************************/
    /**************************************************************************************/
    buyMultiplier() {
        if (this.points >= this.multiplierCost) {
            this.points -= this.multiplierCost; 
            this.multiplier += 1; 
            this.multiplierCost *= 2; 
            this.updatePointsDisplay(); 
            this.updateCostDisplays(); 
            this.updatePurchaseButtons();
            const pointsParClic = this.pointsPerClick * this.multiplier;
            document.getElementById("pointsPerClickDisplay").textContent = `x${pointsParClic}`;
            this.showNotification(`Multiplicateur acheté. Vous gagnez ${this.pointsPerClick * this.multiplier} points par clic.`); 
        }
    }


    /******************************* les notifications ******************************/
    /********************************************************************************/
    showNotification(message) {
        console.log("Notification:", message); 
        this.notificationDisplay.textContent = message;
        this.notificationDisplay.style.opacity = 1;

        const notificationSound = document.getElementById('notificationSound');
        notificationSound.currentTime = 0;
        notificationSound.play();
    
        setTimeout(() => {
            this.notificationDisplay.style.opacity = 0;
        }, 4000);
    }
    

    /*******************************  Pokeball ****************************************/
    /**********************************************************************************/

    showPointsGain(gain) {
        const gainElement = document.createElement('span');
        gainElement.classList.add('points-gain');
        gainElement.textContent = gain;

        const xOffset = Math.random() * 100 - 25; 
        const yOffset = Math.random() * 10 - 5;  
        const clickBtnRect = this.clickBtn.getBoundingClientRect();

        gainElement.style.left = `${clickBtnRect.left + xOffset}px`;
        gainElement.style.top = `${clickBtnRect.top + yOffset}px`;

        document.body.appendChild(gainElement);

        setTimeout(() => {
            gainElement.remove();
        }, 2000);
    }

    // Changement de Pokeball
    changePokeballImage() {
        const pokeballImage = document.getElementById('clickBtn');
        let newImage = this.currentPokeballImage; 
        if (this.maxPointsReached >= 20500) {
            newImage = 'media/pokeball/master-ball.png';
        } 
        else if (this.maxPointsReached >= 17500) {
            newImage = 'media/pokeball/heal-ball.png';
        } 
        else if (this.maxPointsReached >= 14500) {
            newImage = 'media/pokeball/ultra-ball.png';
        } 
        else if (this.maxPointsReached >= 11500) {
            newImage = 'media/pokeball/great-ball.png';
        } 
        else if (this.maxPointsReached >= 9500) {
            newImage = 'media/pokeball/net-ball.png';
        } 
        else if (this.maxPointsReached >= 7500) {
            newImage = 'media/pokeball/dive-ball.png';
        }
        else if (this.maxPointsReached >= 5500) {
            newImage = 'media/pokeball/luxury-ball.png';
        }
        else if (this.maxPointsReached >= 2500) {
            newImage = 'media/pokeball/repeat-ball.png';
        }
        else if (this.maxPointsReached >= 500) {
            newImage = 'media/pokeball/premier-ball.png';
        }
        if (newImage !== this.currentPokeballImage) {
            pokeballImage.classList.add('change'); 
            setTimeout(() => {
                pokeballImage.classList.remove('change'); 
            }, 500);
    
            pokeballImage.src = newImage; 
            this.currentPokeballImage = newImage;
            const ballName = newImage.split('/').pop().split('.')[0].replace('-', ' ');
            this.showNotification(`Vous avez débloqué la ${ballName.charAt(0).toUpperCase() + ballName.slice(1)}`);
        }
    }


    /*******************************  Fin du jeu ****************************************/
    /**********************************************************************************/
    displayEndGame() {
        const endGame = document.getElementById('endGame');
        endGame.classList.remove('hidden');
        this.backgroundMusic.pause();
        const endGameSound = document.getElementById('endGameSound');
        endGameSound.play();
    
        const playAgainButton = document.getElementById('playAgain');
        playAgainButton.textContent = 'Rejouer'; 
        playAgainButton.onclick = () => {
            this.resetGameWithoutConfirmation(); 
            endGame.classList.add('hidden');
        };
        const fireworksContainer = document.querySelector('.fireworks');
        fireworksContainer.classList.add('active');
    
        setTimeout(() => {
        fireworksContainer.classList.remove('active');
        }, 5000); 
    } 
}

/******************************* Initialisation du jeu ****************************************/
document.addEventListener('DOMContentLoaded', () => {
    const game = new ClickerGame(); 
});