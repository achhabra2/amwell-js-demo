// Node.JS Example
const CiscoSpark = require('ciscospark');

// JWT helper library
const jwt = require('./jwt');


// Initialize Spark SDK with your access token
const Spark = CiscoSpark.init({
  credentials: {
    authorization: {
      access_token: 'YOUR ACCESS TOKEN'
    }
  }
});

async function workflow() {
  // Get the details of the BOT Account
  let me = await Spark.people.get('me')
  // Create a room or "space"
  let room = await Spark.rooms.create({ title: 'JS SDK Demo' })
  // Get the membership ID to make the room moderated
  let moderator = await Spark.memberships.list({ roomId: room.id, personId: me.id })
  let moderatorMembership = moderator.items[0]
  // Update the membership of the bot to become a moderator
  moderatorMembership.isModerator = true;
  await Spark.memberships.update(moderatorMembership)

  // Logic to generate JWT Tokens
  // Logic to get Spark Access Tokens
  // Logic to get personId of Guest Accounts
  let guestOne = await jwt.generateGuestToken('John Doe')
  let guestTwo = await jwt.generateGuestToken('Jane Smith')


  // Update memberships to space with Guest Users
  let members = [guestOne.personDetail.id, guestTwo.personDetail.id];
  await Promise.all(members.map(member => {
    return Spark.memberships.create({ roomId: room.id, personId: member })
  }))

  return room
}

workflow().then(room => console.log(room))