import React, { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Card,
  CardContent,
  CircularProgress,
} from "@mui/material";

interface Guild {
  Id: string;
  Name: string;
  AllianceId: string | null;
  KillFame: number;
  DeathFame: number;
  MemberCount: number;
  region?: string;
}

interface SearchResponse {
  guilds: Guild[];
}

export default function GuildInfoSearch() {
  const [server, setServer] = useState<string>("EU");
  const [guildName, setGuildName] = useState<string>("");
  const [guildInfo, setGuildInfo] = useState<Guild | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSearch = async () => {
    if (!guildName) return;
    setLoading(true);
    const domainSuffix = server === "EU" ? "-am" : server === "Asia" ? "-sgp" : "";
    try {
      const searchUrl = `https://gameinfo${domainSuffix}.albiononline.com/api/gameinfo/search?q=${encodeURIComponent(guildName)}`;
      const searchRes = await fetch(searchUrl);
      const searchData: SearchResponse = await searchRes.json();

      const guild = searchData.guilds.find(g => g.Name.toLowerCase() === guildName.toLowerCase());
      if (!guild) {
        alert("Guild not found.");
        setGuildInfo(null);
        setLoading(false);
        return;
      }

      const guildId = guild.Id;
      const guildInfoUrl = `https://gameinfo${domainSuffix}.albiononline.com/api/gameinfo/guilds/${guildId}`;
      const guildInfoRes = await fetch(guildInfoUrl);
      const guildInfoData: Guild = await guildInfoRes.json();

      setGuildInfo({ ...guildInfoData, region: server });
    } catch (err) {
      console.error(err);
      alert("Failed to fetch guild info.");
    }
    setLoading(false);
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: "2rem" }}>
      <Typography variant="h4" gutterBottom align="center">
        Albion Guild Info Lookup
      </Typography>

      <FormControl fullWidth margin="normal">
        <InputLabel id="server-select-label">Server</InputLabel>
        <Select
          labelId="server-select-label"
          value={server}
          label="Server"
          onChange={(e) => setServer(e.target.value)}
        >
          <MenuItem value="EU">EU</MenuItem>
          <MenuItem value="NA">NA</MenuItem>
          <MenuItem value="Asia">Asia</MenuItem>
        </Select>
      </FormControl>

      <TextField
        fullWidth
        label="Guild Name"
        value={guildName}
        onChange={(e) => setGuildName(e.target.value)}
        margin="normal"
      />

      <Button
        fullWidth
        variant="contained"
        color="primary"
        onClick={handleSearch}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} /> : "Search"}
      </Button>

      {guildInfo && (
        <Card style={{ marginTop: "2rem" }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              {guildInfo.Name}
            </Typography>
            <Typography><strong>ID:</strong> {guildInfo.Id}</Typography>
            <Typography><strong>Alliance:</strong> {guildInfo.AllianceId || "None"}</Typography>
            <Typography><strong>Region:</strong> {guildInfo.region}</Typography>
            <Typography><strong>Kill Fame:</strong> {guildInfo.KillFame.toLocaleString()}</Typography>
            <Typography><strong>Death Fame:</strong> {guildInfo.DeathFame.toLocaleString()}</Typography>
            <Typography><strong>Member Count:</strong> {guildInfo.MemberCount}</Typography>
          </CardContent>
        </Card>
      )}
    </Container>
  );
}
