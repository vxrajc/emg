const express = require('express')
const app = express()
const port = process.env.port

const quotes = [
    "The only way to do great work is to love what you do. – Steve Jobs",
    "Success is not final, failure is not fatal: it is the courage to continue that counts. – Winston Churchill",
    "Believe you can and you're halfway there. – Theodore Roosevelt",
    "Your time is limited, so don’t waste it living someone else’s life. – Steve Jobs",
    "Do what you can, with what you have, where you are. – Theodore Roosevelt",
    "Hardships often prepare ordinary people for an extraordinary destiny. – C.S. Lewis",
    "Don’t watch the clock; do what it does. Keep going. – Sam Levenson",
    "It does not matter how slowly you go as long as you do not stop. – Confucius",
    "Act as if what you do makes a difference. It does. – William James",
    "Keep your face always toward the sunshine—and shadows will fall behind you. – Walt Whitman",
    "Opportunities don't happen, you create them. – Chris Grosser",
    "You are never too old to set another goal or to dream a new dream. – C.S. Lewis",
    "Dream big and dare to fail. – Norman Vaughan",
    "The best way to predict the future is to create it. – Peter Drucker",
    "Everything you’ve ever wanted is on the other side of fear. – George Addair"
  ];
  
  app.get('/', (req, res) => {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    res.json({ quote: randomQuote });
  });
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})