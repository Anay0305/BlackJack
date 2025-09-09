let deck, playerHand, dealerHand, balance = 0;
const balanceDisplay = document.getElementById("balance");
let hideDealerCard = true;

function checkPassword() {
  const input = document.getElementById("password-input").value;
  if(input === "GARVIT100"){
    document.getElementById("password-message").innerText = "Password Accepted!";
    document.getElementById("balance-setup").style.display = "block";
  } else {
    document.getElementById("password-message").innerText = "Wrong Password!";
  }
}

function setBalance(){
  let inputBalance = parseInt(document.getElementById("balance-input").value);
  if(isNaN(inputBalance) || inputBalance < 1){
    alert("Enter a valid balance!");
    return;
  }
  if(inputBalance > 200000) inputBalance = 200000;
  balance = inputBalance;
  balanceDisplay.innerText = balance;
  document.getElementById("password-screen").style.display = "none";
  document.getElementById("game-screen").style.display = "block";
}

function createDeck() {
  const suits = ['♠','♥','♦','♣'];
  const values = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
  let newDeck = [];
  for(let suit of suits){
    for(let value of values){
      newDeck.push({suit, value});
    }
  }
  return newDeck.sort(() => Math.random() - 0.5);
}

function getValue(card){
  if(['J','Q','K'].includes(card.value)) return 10;
  if(card.value === 'A') return 11;
  return parseInt(card.value);
}

function handValue(hand){
  let total = 0, aces = 0;
  for(let card of hand){
    total += getValue(card);
    if(card.value === 'A') aces++;
  }
  while(total > 21 && aces > 0){
    total -= 10;
    aces--;
  }
  return total;
}

function renderHands(){
  const dealerCards = document.getElementById("dealer-cards");
  const playerCards = document.getElementById("player-cards");
  dealerCards.innerHTML = '';
  playerCards.innerHTML = '';

  dealerHand.forEach((card, i) => {
    const div = document.createElement("div");
    div.className = "card";
    if(i === 1 && hideDealerCard){ 
      div.innerText = "🂠"; // hidden card
      div.style.background = "black";
      div.style.color = "white";
    } else {
      div.innerText = card.value + card.suit;
    }
    dealerCards.appendChild(div);
  });

  playerHand.forEach(card => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerText = card.value + card.suit;
    playerCards.appendChild(div);
  });
}

function startGame(){
  deck = createDeck();
  playerHand = [deck.pop(), deck.pop()];
  dealerHand = [deck.pop(), deck.pop()];
  hideDealerCard = true;
  renderHands();
  document.getElementById("deal-btn").disabled = true;
  document.getElementById("hit-btn").disabled = false;
  document.getElementById("stand-btn").disabled = false;
  document.getElementById("message").innerText = "";
}

function hit(){
  playerHand.push(deck.pop());
  renderHands();
  if(handValue(playerHand) > 21){
    document.getElementById("message").innerText = "You Busted! Dealer Wins!";
    balance -= 1000;
    endRound();
  }
}

function stand(){
  hideDealerCard = false;
  renderHands();

  while(handValue(dealerHand) < 17){
    dealerHand.push(deck.pop());
    renderHands();
  }

  const playerTotal = handValue(playerHand);
  const dealerTotal = handValue(dealerHand);

  if(dealerTotal > 21 || playerTotal > dealerTotal){
    document.getElementById("message").innerText = "You Win!";
    balance += 1000;
  } else if(playerTotal < dealerTotal){
    document.getElementById("message").innerText = "Dealer Wins!";
    balance -= 1000;
  } else {
    document.getElementById("message").innerText = "Push!";
  }
  endRound();
}

function endRound(){
  document.getElementById("deal-btn").disabled = false;
  document.getElementById("hit-btn").disabled = true;
  document.getElementById("stand-btn").disabled = true;
  if(balance > 200000) balance = 200000;
  if(balance < 0) balance = 0;
  balanceDisplay.innerText = balance;
}
