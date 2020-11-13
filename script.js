// NOTE: this example uses the chess.js library:
// https://github.com/jhlywa/chess.js

var board = Chessboard('myBoard')
var game = null
var playerColour = null
var computerColour = null

var pieceValues = {
  'p': 10,
  'n': 30,
  'b': 30,
  'r': 50,
  'q': 100,
  'k': 900
}

function onDragStart (source, piece, position, orientation) {
  // do not pick up pieces if the game is over
  if (game.game_over()) return false

  // only pick up pieces for the player
  if ((playerColour === 'w' && piece.search(/^b/) !== -1) ||
      (playerColour === 'b' && piece.search(/^w/) !== -1)) return false
}

function onDrop (source, target) {
  // see if the move is legal
  var move = game.move({
    from: source,
    to: target,
    promotion: 'q' // NOTE: always promote to a queen for example simplicity
  })

  // illegal move
  if (move === null) return 'snapback'

  // make legal move for black based on selected computer algorithm
  window.setTimeout(makeComputerMove, 250)
}

// update the board position after the piece snap
// for castling, en passant, pawn promotion
function onSnapEnd () {
  board.position(game.fen())
}

function makeComputerMove () {
  var possibleMoves = game.moves()

  // game over
  if (possibleMoves.length === 0) return

  var totalScore = getScoreForColour(computerColour) - getScoreForColour(playerColour)
  var selectedMoveIndex = Math.floor(Math.random() * possibleMoves.length)
  console.log(`Old Score: ${totalScore}`)

  for (var i = 0; i < possibleMoves.length; i++) {
    game.move(possibleMoves[i])

    var possibleMoves2 = game.moves()
    var computerScore = Number.MAX_VALUE

    for (var j = 0; j < possibleMoves2.length; j++) {
      game.move(possibleMoves2[j])

      var newComputerScore = getScoreForColour(computerColour)
      if (computerScore > newComputerScore) {
        computerScore = newComputerScore
      }

      game.undo()
    }

    var newTotalScore = newComputerScore - getScoreForColour(playerColour)
      if (totalScore < newTotalScore) {
        totalScore = newTotalScore
        selectedMoveIndex = i
      }

    game.undo()
  }

  console.log(`New Score: ${totalScore}`)
  game.move(possibleMoves[selectedMoveIndex])
  board.position(game.fen())
}

function getScoreForColour (color) {
  var value = 0

  for (var i = 0; i < 8; i++) {
    for (var j = 0; j < 8; j++) {
      var piece = game.board()[i][j]
      if (piece && piece.color === color) {
        value += pieceValues[piece.type]
      }
    }
  }

  return value
}

function startGame() {
  playerColour = document.getElementById('playerColour').value

  if (playerColour === 'random') {
    playerColour = Math.random() < 0.5 ? 'w' : 'b'
  }

  computerColour = playerColour === 'w' ? 'b' : 'w'

  var config = {
    draggable: true,
    position: 'start',
    onDragStart: onDragStart,
    onDrop: onDrop,
    onSnapEnd: onSnapEnd,
    orientation: playerColour === 'w' ? 'white' : 'black'
  }

  board = Chessboard('myBoard', config)
  game = new Chess()

  // If player is black, computer goes first
  if (playerColour === 'b') window.setTimeout(makeComputerMove, 250)
}