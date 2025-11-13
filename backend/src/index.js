import express from "express";
import dotenv from "dotenv";
import path from "path";
import { clerkClient, clerkMiddleware, getAuth } from '@clerk/express';
import { connectDB } from "./lib/db.js";
import fileUpload from "express-fileupload";
import cors from "cors";
import { createServer } from "http";
import { initializeSocket } from "./lib/socket.js";
import userRoutes from "./routes/user.route.js";
import adminRoutes from "./routes/admin.route.js";
import authRoutes from "./routes/auth.route.js";
import albumRoutes from "./routes/album.route.js"
import statRoutes from "./routes/stat.route.js";
import debugRoutes from "./routes/debug.route.js";
import songRoutes from "./routes/song.route.js";

dotenv.config();

const app = express();
const __dirname = path.resolve();
const port = process.env.PORT;
const server = createServer(app);

initializeSocket(server);

app.use(cors(
    {
        origin: "http://localhost:3000",
        credentials: true,
    }
));

app.use(express.json());
// Simple request logger to make incoming requests visible in logs (helps debug callbacks)
app.use((req, res, next) => {
    console.log(`[req] ${req.method} ${req.path} - body:`, req.body);
    // Log a few request headers that are important for CORS/auth
    console.log('[req] headers:', {
        origin: req.headers.origin,
        referer: req.headers.referer,
        host: req.headers.host,
        authorization: req.headers.authorization ? 'present' : 'missing',
        'content-type': req.headers['content-type']
    });

    if (req.method === 'OPTIONS') {
        console.log('[req] OPTIONS preflight detected');
        return res.sendStatus(204);
    }

    next();
});
app.use(clerkMiddleware());
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: path.join(__dirname, "tmp"),
    createParentPath: true,
    limits:{
        fileSize: 10*2024*2024, // 10MB
    }
}));

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/albums", albumRoutes);
app.use("/api/stats", statRoutes);
app.use('/debug', debugRoutes);
app.use("/api/songs", songRoutes);

app.use((err, req, res, next) => {
    res.status(500).json({ message: process.env.NODE_ENV === "production" ? "Internal server error" : err.message });
})

server.listen(port, () => {
    console.log("Server is running on port 5000")

    connectDB();
})