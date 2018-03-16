const request = require('superagent')
const JWT_URL = 'https://7s6pizsaij.execute-api.us-west-2.amazonaws.com/dev/jwt'
const ACCESS_TOKEN_URL = 'https://api.ciscospark.com/v1/jwt/login'
const PERSON_DETAILS_URL = 'https://api.ciscospark.com/v1/people/me'

/**
 * Helper Function to Generate Guest Tokens
 * Access tokens and return Person Details
 * 
 * @param {string} guestName 
 * @returns {object} AccessToken and Person Details Objects
 */
async function generateGuestToken(guestName) {
  let jwtResponse = await request.post(JWT_URL).send({ name: guestName })
  jwt = jwtResponse.body.token
  console.log(`Received JWT: ${jwt}`)
  let accessTokenResponse = await request.post(ACCESS_TOKEN_URL)
    .set({ 'Authorization': `Bearer ${jwt}` })
  let accessToken = accessTokenResponse.body.token
  let personDetailResponse = await request.get(PERSON_DETAILS_URL)
    .set({ 'Authorization': `Bearer ${accessToken}` })
  let personDetail = personDetailResponse.body
  return { accessToken, personDetail }
}

module.exports = { generateGuestToken };