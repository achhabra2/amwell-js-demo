// Node.JS Example
const CiscoSpark = require('ciscospark');

// JWT helper library
const jwt = require('./jwt');


// Initialize Spark SDK with your access token
const Spark = CiscoSpark.init({
  credentials: {
    authorization: {
      access_token: process.env.ACCESS_TOKEN // Your access token loaded from .env file
    }
  }
});

/**
 * 
 * 
 * @param {string} roomTitle Title of Spark Space
 * @param {Array} guestUsers Array of Guest Users
 * @returns {object} 
 */
async function workflow(roomTitle, guestUsers) {
  // Get the details of the BOT Account
  let me = await Spark.people.get('me')
  console.log(`Received My Account Details: ${me.id}`)
  // Create a room or "space"
  let room = await Spark.rooms.create({ title: roomTitle })
  console.log(`Successfully created Spark Space...`)
  // Get the membership ID to make the room moderated
  let moderator = await Spark.memberships.list({ roomId: room.id, personId: me.id })
  let moderatorMembership = moderator.items[0]
  // Update the membership of the bot to become a moderator
  moderatorMembership.isModerator = true;
  await Spark.memberships.update(moderatorMembership)
  console.log(`Successfully updated membership to moderator...`)

  // Logic to generate JWT Tokens
  // Logic to get Spark Access Tokens
  // Logic to get personId of Guest Accounts
  let members = await Promise.all(guestUsers.map(user => jwt.generateGuestToken(user)))
  console.log(`Got Guest User tokens...`)

  // Update memberships to space with Guest Users
  await Promise.all(members.map(member => {
    return Spark.memberships.create({ roomId: room.id, personId: member.personDetail.id })
  }))


  return { room, members }
}

workflow('Test Room Title', ['Guest 1', 'Guest 2']).then(result => console.log(result))