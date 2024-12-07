"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const socket_io_1 = require("socket.io");
const mongoose_1 = __importDefault(require("mongoose"));
const http_1 = require("http");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const poll_routes_1 = __importDefault(require("./routes/poll.routes"));
const vote_socket_1 = __importDefault(require("./sockets/vote.socket"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
app.use((0, cors_1.default)({
    origin: ['http://localhost:4321'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'Accept',
        'Origin'
    ]
}));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.get('/', (req, res) => {
    res.send('Hello World');
});
app.use('/api/auth', auth_routes_1.default);
app.use('/api/poll', poll_routes_1.default);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "http://localhost:4321/",
        methods: ["GET", "POST"]
    }
});
const URI = process.env.DB;
mongoose_1.default
    .connect(URI, { dbName: 'voting-app' })
    .then(() => {
    console.log('Connected to MongoDB database');
    (0, vote_socket_1.default)(io);
    const PORT = process.env.PORT || 3001;
    server.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
})
    .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});
