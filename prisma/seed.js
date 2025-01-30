const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    // Create Users
    const users = [];
    for (let i = 1; i <= 5; i++) {
        users.push(await prisma.user.create({
            data: { username: `user${i}` }
        }));
    }

    // Create Tracks
    const tracks = [];
    for (let i = 1; i <= 20; i++) {
        tracks.push(await prisma.track.create({
            data: { name: `Track ${i}` }
        }));
    }

    // Create Playlists
    for (let i = 1; i <= 10; i++) {
        const owner = users[Math.floor(Math.random() * users.length)];
        const trackIds = tracks
            .sort(() => 0.5 - Math.random()) // Shuffle
            .slice(0, Math.floor(Math.random() * 5) + 3) // Pick 3-7 tracks
            .map(t => ({ trackId: t.id }));

        await prisma.playlist.create({
            data: {
                name: `Playlist ${i}`,
                description: `This is playlist ${i}`,
                ownerId: owner.id,
                tracks: { create: trackIds }
            }
        });
    }

    console.log('Database seeded! ✅');
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
