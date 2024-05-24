require('dotenv').config()
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const nightmare = require("nightmare")();

const args =  process.argv.slice(2)
const url = args[0]
const minPrice = args[1]

checkPrice()

async function checkPrice() {
  const priceString = await nightmare.goto(url)
                                     .wait(".a-offscreen")
                                     .evaluate(() => document.getElementsByClassName("a-offscreen").innerText)
                                     .end();
    const priceNumber = parseFloat(priceString)
    if (priceNumber < minPrice) {
        sendEmail('Price is low', 
            `The price on ${url} has dropped below ${minPrice}`
        )
        console.log("It is cheap")
    } 
}

function sendEmail(subject, body) {
    const email = {
        to: 'qevesevi.eheliha@jollyfree.com',
        from: 'amazon-price-chceker@example.com',
        subject: subject,
        text: body,
        html: body

    }

    return sgMail.send(email)
}
