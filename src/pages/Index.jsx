import { useState } from "react";
import { Box, Button, Heading, Input, Stack, Text, Image, Flex, IconButton } from "@chakra-ui/react";
import { FaSearch, FaPlay, FaPause } from "react-icons/fa";

const CLIENT_ID = "4642e3fdf761477991140a71ec36597e";
const CLIENT_SECRET = "1f1ef85b93cc467290f77cdcca6b5cd1";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [playingTrackPreview, setPlayingTrackPreview] = useState(null);

  const handleSearch = async () => {
    if (!accessToken) {
      // Obtain access token
      const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)}`,
        },
        body: "grant_type=client_credentials",
      });
      const data = await response.json();
      setAccessToken(data.access_token);
    }

    // Search for tracks
    const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(searchQuery)}&type=track&limit=10`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const data = await response.json();
    setSearchResults(data.tracks.items);
  };

  const togglePlayPause = (previewUrl) => {
    const audio = new Audio(previewUrl);

    if (playingTrackPreview === previewUrl) {
      audio.pause();
      setPlayingTrackPreview(null);
    } else {
      if (playingTrackPreview) {
        const currentAudio = new Audio(playingTrackPreview);
        currentAudio.pause();
      }
      audio.play();
      setPlayingTrackPreview(previewUrl);
    }
  };

  return (
    <Box p={8}>
      <Heading as="h1" size="xl" mb={8}>
        Spotify Song Search
      </Heading>
      <Stack spacing={4} mb={8}>
        <Input placeholder="Search for a song" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        <Button leftIcon={<FaSearch />} onClick={handleSearch}>
          Search
        </Button>
      </Stack>
      <Stack spacing={4}>
        {searchResults.map((track) => (
          <Flex key={track.id} p={4} borderWidth={1} borderRadius="md" alignItems="center">
            <Image src={track.album.images[2].url} alt={track.album.name} mr={4} />
            <Box>
              <Text fontWeight="bold">{track.name}</Text>
              <Text>{track.artists[0].name}</Text>
            </Box>
            <IconButton ml="auto" icon={playingTrackPreview === track.preview_url ? <FaPause /> : <FaPlay />} aria-label={playingTrackPreview === track.preview_url ? "Pause Preview" : "Play Preview"} onClick={() => togglePlayPause(track.preview_url)} isDisabled={!track.preview_url} />
          </Flex>
        ))}
      </Stack>
    </Box>
  );
};

export default Index;
