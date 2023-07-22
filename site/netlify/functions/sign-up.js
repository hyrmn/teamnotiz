const axios = require('axios').default

exports.handler = async (event) => {

  const msg = JSON.stringify({
    email: event.queryStringParameters.newsletterEmail,
    referrer_url: 'teamnotiz.com',
    metadata: {},
    tags: ['teamnotiz.com'],
  })

  const headers = {
    Authorization: 'Token ' + process.env['BUTTONDOWN_TOKEN'],
    'Content-Type': 'application/json',
    'Content-Length': msg.length,
  }

  const qry = event.queryStringParameters

  console.log(`POST ${msg}`)

  try {
    const result = await axios.post(
      'https://api.buttondown.email/v1/subscribers',
      msg,
      { headers: headers },
    )

    return {
      statusCode: 200,
      body: `You're signed up!`,
    }
  } catch (err) {
    console.log("Error response")
    console.log(err)
    if (err.response.status == 400) {
      console.log('they signed up already')
      return {
        statusCode: 200,
        body: "You're signed up!",
      }
    }
    return {
      statusCode: 400,
      body: "We weren't able to sign you up",
    }
  }
}