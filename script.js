// NOTE: this example uses the chess.js library:
// https://github.com/jhlywa/chess.js

var board = Chessboard('myBoard')
var game = null
var algorithmMethod = null

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

  // only pick up pieces for White
  if (piece.search(/^b/) !== -1) return false
}

function makeRandomMove () {
  var possibleMoves = game.moves()

  // game over
  if (possibleMoves.length === 0) return

  var randomIdx = Math.floor(Math.random() * possibleMoves.length)
  game.move(possibleMoves[randomIdx])
  board.position(game.fen())
}

function makeFirstMove () {
  var possibleMoves = game.moves()

  // game over
  if (possibleMoves.length === 0) return

  game.move(possibleMoves[0])
  board.position(game.fen())
}

function makePositionEvaluationMove () {
  var possibleMoves = game.moves()

  // game over
  if (possibleMoves.length === 0) return

  var opponentValue = getPlayerValue('w')
  var selectedMoveIndex = Math.floor(Math.random() * possibleMoves.length)

  for (var i = 0; i < possibleMoves.length; i++) {
    // simulate making a move
    game.move(possibleMoves[i])

    var newOpponentValue = getPlayerValue('w')
    if (opponentValue > newOpponentValue) {
      opponentValue = newOpponentValue
      selectedMoveIndex = i
    }

    // undo the move
    game.undo()
  }

  game.move(possibleMoves[selectedMoveIndex])
  board.position(game.fen())
}

function getPlayerValue (color) {
  var value = 0

  for (var i = 0; i < 8; i++) {
    for (var j = 0; j < 8; j++) {
      var piece = game.board()[i][j]
      if (piece && piece.color == color) {
        value += pieceValues[piece.type]
      }
    }
  }

  return value
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
  window.setTimeout(algorithmMethod, 250)
}

// update the board position after the piece snap
// for castling, en passant, pawn promotion
function onSnapEnd () {
  board.position(game.fen())
}

function startGame() {
  var config = {
    draggable: true,
    position: 'start',
    onDragStart: onDragStart,
    onDrop: onDrop,
    onSnapEnd: onSnapEnd
  }

  board = Chessboard('myBoard', config)
  game = new Chess()

  var algorithm = document.getElementById('algorithms').value
  switch (algorithm) {
    case 'Random Move':
      algorithmMethod = makeRandomMove
      break
    case 'First Move':
      algorithmMethod = makeFirstMove
      break
      case 'Position Evaluation':
        algorithmMethod = makePositionEvaluationMove
        break
  }
}