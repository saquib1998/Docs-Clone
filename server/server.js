const mongoose = require('mongoose');
const Document = require('./Document');
const express = require('express');
const http = require('http');
const cors = require('cors');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const app = express();
const server = http.createServer(app);
app.use(express.json())
app.use(cors({
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // If you're using cookies or other authentication
  }));

const store = new MongoDBStore({
    uri: process.env.MongoUrl, // MongoDB connection URI
    collection: 'sessions', // Name of the sessions collection in MongoDB
    expires: 1000 * 60 * 60 * 24 * 7, // Session expiration time (7 days)
    connectionOptions: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // Add other MongoDB configuration options here if needed
    },
  });
  
  app.use(
    session({
      secret: 'your-secret-key', // Change this to a strong, random secret
      resave: false,
      saveUninitialized: false,
      store: store,
      cookie: {
        secure: false, // Set to true in production if using HTTPS
        maxAge: 1000 * 60 * 60 * 24 * 7, // Cookie expiration time (7 days)
      },
    })
  );

mongoose.connect("mongodb+srv://saquib1998:0MTznb98wPdlinyz@cluster0.inslkge.mongodb.net/")

const io = require('socket.io')(server, {
    cors: {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST'], // Specify the allowed HTTP methods
    },
  });

io.on('connection', socket => {
    socket.on('get-document', async (documentId, userEmail, name) => {
        const document =  await findOrCreateDocument(documentId, userEmail, name)
        socket.join(documentId)  
        socket.emit('load-document', document.data)
        socket.on('send-changes', delta => {
            socket.broadcast.to(documentId).emit('recieve-changes', delta)
        })
        socket.on("save-document", async data => {
            await Document.findByIdAndUpdate(documentId, { data })
          })
    })
})

const defaultValue = ''
async function findOrCreateDocument(id, email, name) {
    if (id == null || name == null) return
  
    const document = await Document.findById(id)
    if (document) return document
    return  await Document.create({ _id: id, data: defaultValue,  owner: email, name: name})
}

app.post('/authenticate', async (req, res) => {
    req.session.user = req.body;
    res.send("authenticated")
})

app.get('/documents/:email', async (req, res) => {
    var docs = await Document.find({owner: req.params.email})
    res.send(docs ? docs : []);
})



const PORT = 3001;
server.listen(PORT, () => {
console.log(`Server is listening on port ${PORT}`);
});
