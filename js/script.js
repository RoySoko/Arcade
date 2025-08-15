
// Arcade 1 — All variables instantiated at top
let endZoneEl = null;
let farewellShown = false;

// 8-Ball answers 
const eightBallResponses = [
  "Definitely yes.",
  "Most likely.",
  "Ask again later.",
  "Cannot predict now.",
  "Don't count on it.",
  "Very doubtful.",
  "Signs point to yes.",
  "Outlook not so good."
];

// BNH scoreboard 
let bnhWins = 0, bnhLosses = 0, bnhTies = 0;

// Guessing Game state
let guessTarget = null, guessAttempts = 0;

window.addEventListener('DOMContentLoaded', () => {
  endZoneEl = document.getElementById('endZone');
});

/** Ask y/n with validation; returns true for yes, false for no/cancel. */
function askYesNo(message) {
  while (true) {
    const raw = prompt(message);
    if (raw === null) { alert("You cancelled."); return false; }
    const a = raw.trim().toLowerCase();
    if (a === 'y' || a === 'yes') return true;
    if (a === 'n' || a === 'no') return false;
    alert('Please enter "y" or "n".');
  }
}

/** After any Single Game ends, decide whether to keep the Playing session going. */
function finalizeSingleGame() {
  
  const pickAnother = (askYesNo('Would you like to pick another game to play?  y/n') ? true : false);
  if (pickAnother) {
    alert('Okay! Click another button to launch a game.');
    return;
  }
  if (!farewellShown && endZoneEl) {
    farewellShown = true;
    endZoneEl.style.display = 'block';
    endZoneEl.innerHTML = `
      <p>Thanks for playing the Arcade! Come back anytime.</p>
      <button class="reload-btn" onclick="location.reload()">Play Again (Reload)</button>
    `;
  }
}

/** Random int in [min, max] */
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


function normalizeBNH(s) {
  if (!s) return null;
  const t = s.trim().toLowerCase();
  if (['b','bear'].includes(t)) return 'bear';
  if (['n','ninja'].includes(t)) return 'ninja';
  if (['h','hunter'].includes(t)) return 'hunter';
  return null;
}

// 1) Guessing Game — Arrow Function
window.playGuess = () => {
  let keepPlaying = true;

  while (keepPlaying) {
    // Start one Single Game
    guessTarget = randInt(1, 10);
    guessAttempts = 0;

    // Keep prompting until correct or cancel
    while (true) {
      const raw = prompt('Guess a Number between 1 and 10. (Cancel to stop this game.)');
      if (raw === null) { alert('You cancelled. Ending this game.'); keepPlaying = false; break; }

      const val = Number(raw);
      if (!Number.isInteger(val) || val < 1 || val > 10) { alert('Please enter a WHOLE number between 1 and 10.'); continue; }

      guessAttempts++;
      if (val === guessTarget) {
        alert(`You guessed it in ${guessAttempts} guesses!`);
        break; 
      }
      alert(val < guessTarget ? 'Your guess was too low, guess again.' : 'Your guess was too high, guess again.');
    }

    if (!keepPlaying) break;

    // exit the loop 
    keepPlaying = (askYesNo('Would you like to keep playing this game? y/n') ? true : false);
  }

  finalizeSingleGame();
};

// 2) Consult the Oracle 
window.playEightBall = function () {
  let keepPlaying = true;

  while (keepPlaying) {
    const q = prompt('Ask a yes-or-no question for the Oracle. (Cancel to stop this game.)');
    if (q === null) { alert('You cancelled. Ending this game.'); keepPlaying = false; break; }

    const trimmed = q.trim();
    if (!trimmed) { alert('Please enter a question (not empty).'); continue; }

    const reply = eightBallResponses[randInt(0, eightBallResponses.length - 1)];
    alert(`You asked: "${trimmed}"\nThe Oracle says: ${reply}`);


    keepPlaying = (askYesNo('Would you like to keep playing this game? y/n') ? true : false);
  }

  finalizeSingleGame();
};

// 3) Bear, Ninja, Hunter 
function playBNH() {
  // Ask for name 
  let playerName = prompt('Welcome to Bear, Ninja, Hunter! Please enter your name to get started:');
  if (playerName === null) { alert('You cancelled.'); finalizeSingleGame(); return; }
  playerName = playerName.trim();
  if (playerName === '') { alert('Invalid Entry'); finalizeSingleGame(); return; }

  alert(`Hi ${playerName}! Let's Play!!`);

  // Reset scoreboard for this Playing session
  bnhWins = 0; bnhLosses = 0; bnhTies = 0;

  let keepPlaying = true;
  while (keepPlaying) {
    const rawChoice = prompt('Choose: Bear, Ninja, or Hunter (b/n/h). Cancel to stop this game.');
    if (rawChoice === null) { alert('You cancelled. Ending this game.'); keepPlaying = false; break; }

    const user = normalizeBNH(rawChoice);
    if (!user) { alert('Invalid Entry. Please type bear/ninja/hunter (or b/n/h).'); continue; }

    const comp = ['bear','ninja','hunter'][randInt(0,2)];

    let outcome;
    if (user === comp) {
      outcome = "It's a tie!";
      bnhTies++;
    } else if (
      (user === 'bear' && comp === 'ninja') ||
      (user === 'ninja' && comp === 'hunter') ||
      (user === 'hunter' && comp === 'bear')
    ) {
      outcome = 'You Win!!';
      bnhWins++;
    } else {
      outcome = 'You Lose!!';
      bnhLosses++;
    }

    alert(
      `${playerName}, you chose ${user}!\n` +
      `The computer chose ${comp}!\n` +
      `${outcome}\n\n` +
      `Wins: ${bnhWins}  Losses: ${bnhLosses}  Ties: ${bnhTies}`
    );

    keepPlaying = (askYesNo('Would you like to keep playing this game? y/n') ? true : false);
  }

  finalizeSingleGame();
}
