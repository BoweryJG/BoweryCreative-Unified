"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_session_1 = __importDefault(require("express-session"));
const dotenv_1 = __importDefault(require("dotenv"));
const magic_link_1 = require("./routes/magic-link");
const auth_1 = require("./routes/auth");
const post_1 = require("./routes/post");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === 'production' }
}));
// Routes
app.use('/magic', magic_link_1.magicLinkRouter);
app.use('/auth', auth_1.authRouter);
app.use('/api/posts', post_1.postRouter);
// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'BoweryCreative Social Media Manager' });
});
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`⚡ Lightning server running on port ${PORT}`);
});
