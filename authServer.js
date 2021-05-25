const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
require('dotenv').config()

app.use(express.json());

app.delete('/logout', (req, res) => {
  refreshTokens = refreshTokens.filter(token => token !== req.body.token)
  res.sendStatus(204)
})

let refreshTokens = []

app.post('/token', (req, res) => {
  const refreshToken = req.body.token;
  if(refreshToken === null) return res.sendStatus(401)
  if(!refreshTokens.includes(refreshToken)) return res.sendStatus(403)
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if(err) return res.sendStatus(403)
    const accessToken = generateAccesToken({name: user.name})
    res.json({ accessToken: accessToken })
  })
})

app.post('/login', (req, res) => {
  //authenticate the user
  const username = req.body.username;
  const user = {name: username}
  const accessToken = generateAccesToken(user)
  const refreshToken = createRefreshToken(user)
  refreshTokens.push(refreshToken);
  res.json({accessToken: accessToken, refreshToken: refreshToken})
});

function generateAccesToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15s'})
}

function createRefreshToken(user) {
  return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
}

app.listen(4000);