export const getStats = async (req, res) => {
    try {
        // const totalSongs = await Song.countDocuments();
        // const totalUsers = await User.countDocuments();
        // const totalAlbums = await Album.countDocuments();

        const [totalSongs, totalAlbums, totalUsers] = await Promise.all([
            Song.countDocuments(),
            Album.countDocuments(),
            User.countDocuments(),

            Song.aggregate([
                {
                    $unionWith: {
                        coll: "albums",
                        pipeline: []
                    }
                },
                {
                    $group: {
                        _id: "$artist"
                    }
                },
                {
                    $count: "count",
                }
            ])
        ]);
        res.status(200).json({
            totalAlbums,
            totalSongs,
            totalUsers,
            totalArists: uniqueArtist[0]?.count || 0
        })
    } catch (error) {
        next(error);
    }
}