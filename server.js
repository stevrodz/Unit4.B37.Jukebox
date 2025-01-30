const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

// 🟢 Users Routes
app.get('/users', async (req, res) => {
    const users = await prisma.user.findMany();
    res.json(users);
});

app.get('/users/:id', async (req, res) => {
    const user = await prisma.user.findUnique({
        where: { id: parseInt(req.params.id) },
        include: { playlists: true },
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
});

// 🟢 Playlists Routes
app.get('/playlists', async (req, res) => {
    const playlists = await prisma.playlist.findMany();
    res.json(playlists);
});

app.post('/playlists', async (req, res) => {
    const { name, description, ownerId, trackIds } = req.body;
    try {
        const playlist = await prisma.playlist.create({
            data: {
                name,
                description,
                ownerId,
                tracks: {
                    create: trackIds.map(trackId => ({ trackId }))
                }
            }
        });
        res.status(201).json(playlist);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.get('/playlists/:id', async (req, res) => {
    const playlist = await prisma.playlist.findUnique({
        where: { id: parseInt(req.params.id) },
        include: { tracks: { include: { track: true } } },
    });
    if (!playlist) return res.status(404).json({ error: "Playlist not found" });
    res.json(playlist);
});

// 🟢 Tracks Routes
app.get('/tracks', async (req, res) => {
    const tracks = await prisma.track.findMany();
    res.json(tracks);
});

app.get('/tracks/:id', async (req, res) => {
    const track = await prisma.track.findUnique({
        where: { id: parseInt(req.params.id) },
    });
    if (!track) return res.status(404).json({ error: "Track not found" });
    res.json(track);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
