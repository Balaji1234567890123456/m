let express = require('express')
const app = express()
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const path = require('path')
const dbpath = path.join(__dirname, 'cricketTeam.db')
app.use(express.json())
let db = null
let initial = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    })
    app.listen(3003, () => {
      console.log('success')
    })
  } catch (e) {
    console.log(`error ${e.message}`)
    process.exit(1)
  }
}
initial()
let convert = dataobject => {
  return {
    playerId: dataobject.player_id,
    playerName: dataobject.player_name,
    jerseyNumber: dataobject.jersey_number,
    role: dataobject.role,
  }
}
app.get('/players/', async (request, response) => {
  let a = `SELECT *
           FROM cricket_team;`
  let b = await db.all(a)
  response.send(b.map(eachPlayer => convert(eachPlayer)))
})
app.post('/players/', async (request, response) => {
  let j = request.body
  let {playerName, jerseyNumber, role} = j
  let inserted = `INSERT INTO cricket_team
                  (player_name,jersey_number,role)
                  VALUES("${playerName}",${jerseyNumber},"${role}");`
  let c = await db.run(inserted)
  response.send('Player Added to Team')
})
app.get('/players/:playerId/', async (request, response) => {
  let {playerId} = request.params
  let get_players = `SELECT *
                   FROM cricket_team
                   WHERE player_id=${playerId};`
  let p = await db.get(get_players)
  response.send(convert(p))
})
app.put('/players/:playerId/', async (request, response) => {
  let {playerId} = request.params
  let details = request.body
  let {playerName, jerseyNumber, role} = details
  let updated_details = `UPDATE cricket_team
                      SET 
                      player_id="${playerName}",
                      jersey_number=${jerseyNumber},
                      role="${role}"
                      WHERE player_id=${playerId};`
  let o = await db.run(updated_details)
  response.send('Player Details Updated')
})
app.delete('/players/:playerId/', async (request, response) => {
  let {playerId} = request.params
  let i = `DELETE FROM cricket_team
         WHERE player_id=${playerId}`
  let p = await db.run(i)
  response.send('Player Removed')
})
module.exports = app
