const _ = require('underscore')

module.exports = (batch) => {

  const { students, askedStudents } = batch

  //if no color yet, find solution
  const redStudents = students.filter((s) => {
    return s.days[s.days.length-1].color === 'red'
  })

  const yellowStudents = students.filter((s) => {
    return s.days[s.days.length-1].color === 'yellow'
  })

  const greenStudents = students.filter((s) => {
    return s.days[s.days.length-1].color === 'green'
  })

  //if no color yet, find solution
  const redAskedStudents = askedStudents.filter((s) => {
    return s.days[s.days.length-1].color === 'red'
  })

  const yellowAskedStudents = askedStudents.filter((s) => {
    return s.days[s.days.length-1].color === 'yellow'
  })

  const greenAskedStudents = askedStudents.filter((s) => {
    return s.days[s.days.length-1].color === 'green'
  })

  let percentageRed = Math.round((redAskedStudents.length / askedStudents.length) * 100) / 100
  let percentageYellow = Math.round((yellowAskedStudents.length / askedStudents.length) * 100) / 100
  let percentageGreen = Math.round((greenAskedStudents.length / askedStudents.length) * 100) / 100

  let randomStudent = []

  if (percentageRed < 0.50 && redStudents.length > 0) {
    randomStudent = [_.sample(redStudents)]
  } else if (percentageYellow < 0.34 && yellowStudents.length > 0) {
    randomStudent = [_.sample(yellowStudents)]
  } else if (percentageGreen < 0.19 && greenStudents.length > 0) {
    randomStudent = [_.sample(greenStudents)]
  } else {
    randomStudent = [_.sample(students)]
  }

  console.log('Random student: ' + randomStudent)

  newAskedStudents = askedStudents.concat(randomStudent)

  return {
    ...batch,
    askedStudents: newAskedStudents,
  }



  //Might come in handy for checking how is allowed to edit remarks

  // const imaPlayer = playerIds.includes(userId)
  //
  // if (!imaPlayer) {
  //   let err = new Error('You are not a player in this batch!')
  //   err.status = 401
  //   throw err
  // }

  // if (players.length < 2) {
  //   let err = new Error('You can not play alone!')
  //   err.status = 422
  //   throw err
  // }
  //
  // const currentPlayer = batch.players
  //   .filter(p => p.userId.toString() === userId)[0]
  // const alreadyMoved = currentPlayer && !!currentPlayer.symbol
  //
  // if (alreadyMoved) {
  //   let err = new Error('You already made your move!')
  //   err.status = 422
  //   throw err
  // }
  //
  // // can we make a move?
  // if (!data.move) {
  //   let err = new Error('Please tell us your move!')
  //   err.status = 422
  //   throw err
  // }
  //
  // const { move } = data
  // if (!['rock', 'paper', 'scissors'].includes(move)) {
  //   let err = new Error(`${move} is not a valid move!`)
  //   err.status = 422
  //   throw err
  // }
  //
  // // make the move
  // const newPlayers = batch.players.map((player) => {
  //   if (player.userId.toString() === userId) {
  //     player.symbol = move
  //   }
  //
  //   return player
  // })
  //
  // // can we determine a winner after the move was made?
  // const movesCount = newPlayers
  //   .filter(p => !!p.symbol)
  //   .length
  //
  // if (movesCount === newPlayers.length) {
  //   // we can determine a winner
  //   const sortedPlayers = newPlayers.sort(sortByMoves)
  //   const moves = sortedPlayers.map(p => p.symbol)
  //
  //   // it's a draw
  //   if (moves[0] === moves[1]) {
  //     return {
  //       ...batch,
  //       players: newPlayers,
  //       draw: true
  //     }
  //   }
  //
  //   return {
  //     ...batch,
  //     players: newPlayers,
  //     winnerId: sortedPlayers[1].userId,
  //     draw: false
  //   }
  // }
  //
  // return { ...batch, players: newPlayers }
}
