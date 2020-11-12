// NOTE: this example uses the chess.js library:
// https://github.com/jhlywa/chess.js

var board = Chessboard('myBoard')
var game = null
var algorithmMethod = null

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
    case 'Random':
      algorithmMethod = makeRandomMove
      break
    case 'First':
      algorithmMethod = makeFirstMove
      break
  }
}