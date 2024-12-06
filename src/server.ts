import express from "express"
import dotenv from "dotenv"
import cors from 'cors';
import { Server as SocketIOServer } from "socket.io"
import mongoose from "mongoose"
import { createServer } from 'http';
import cookieParser from 'cookie-parser';
import authRouter from "./routes/auth.routes"
import pollRouter from "./routes/poll.routes"
import voteSocket from "./sockets/vote.socket"
import path from 'path';

dotenv.config()

const app = express()
const server = createServer(app)

app.use(express.static(path.join(__dirname, 'public')));
app.use(cors({
  origin: ['*', 'http://localhost:4321'],
  credentials:true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  // allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(cookieParser());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World')
})
app.use('/api/auth', authRouter);
app.use('/api/poll', pollRouter)


const io = new SocketIOServer(server, {
  cors: {
    origin: "http://localhost:4321/",
    methods: ["GET", "POST"]
  }
});




const URI = process.env.DB!
mongoose
  .connect(URI, { dbName: 'voting-app' })
  .then(() => {
    console.log('Connected to MongoDB database');

    voteSocket(io);

    const PORT = process.env.PORT || 3001;
    server.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });