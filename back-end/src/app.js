import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import folderRoutes from "./routes/folder.routes.js";
import noteRoutes from "./routes/note.routes.js";


const app = express();

app.use(express.json());

app.use(cookieParser());

app.use(cors(
    {
        origin: "http://localhost:3000",
        credentials: true,
    }
));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.use("/api/folders", folderRoutes);
app.use("/api/notes", noteRoutes);



export default app;
