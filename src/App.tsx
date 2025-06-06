import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
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
  Paper
} from "@mui/material";
import { MaterialReactTable, MRT_ColumnDef } from 'material-react-table';

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

interface Gathering {
  Fiber: {
    Total: number;
  };
  Hide: {
    Total: number;
  };
  Ore: {
    Total: number;
  };
  Rock: {
    Total: number;
  };
  Wood: {
    Total: number;
  };
}

interface LifetimeStatistics {
  FishingFame: number;
  Gathering: Gathering;
}

interface Member {
  Name: string;
  Id: string;
  GuildName: string;
  KillFame: number;
  FameRatio: number;
  AverageItemPower: number;
  LastOnlineAt: string;
  LifetimeStatistics: LifetimeStatistics;
}

export default function GuildInfoSearch() {
  const [server, setServer] = useState<string>("EU");
  const [guildName, setGuildName] = useState<string>("");
  const [guildInfo, setGuildInfo] = useState<Guild | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const guildParam = params.get("guild");
    const serverParam = params.get("server");
    if (guildParam) setGuildName(guildParam);
    if (serverParam) setServer(serverParam);
    if (guildParam) {
      handleSearch(guildParam, serverParam || server);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = async (name?: string, srv?: string) => {
    const searchName = name || guildName;
    const selectedServer = srv || server;
    if (!searchName) return;
    setLoading(true);

    // Update query parameters
    const newParams = new URLSearchParams();
    newParams.set("guild", searchName);
    newParams.set("server", selectedServer);
    window.history.pushState({}, '', `${window.location.pathname}?${newParams.toString()}`);

    const domainSuffix = selectedServer === "EU" ? "-am" : selectedServer === "Asia" ? "-sgp" : "";
    try {
      const searchUrl = `https://corsproxy.io/?url=https://gameinfo${domainSuffix}.albiononline.com/api/gameinfo/search?q=${encodeURIComponent(searchName)}`;
      const searchRes = await fetch(searchUrl);
      const searchData: SearchResponse = await searchRes.json();

      const guild = searchData.guilds.find(g => g.Name.toLowerCase() === searchName.toLowerCase());
      if (!guild) {
        alert("Guild not found.");
        setGuildInfo(null);
        setMembers([]);
        setLoading(false);
        return;
      }

      const guildId = guild.Id;
      const guildInfoUrl = `https://corsproxy.io/?url=https://gameinfo${domainSuffix}.albiononline.com/api/gameinfo/guilds/${guildId}`;
      const guildMembersUrl = `https://corsproxy.io/?url=https://gameinfo${domainSuffix}.albiononline.com/api/gameinfo/guilds/${guildId}/members`;
      const [guildInfoRes, membersRes] = await Promise.all([
        fetch(guildInfoUrl),
        fetch(guildMembersUrl),
      ]);

      const guildInfoData: Guild = await guildInfoRes.json();
      const membersData: Member[] = await membersRes.json();

      setGuildInfo({ ...guildInfoData, region: selectedServer });
      setMembers(membersData);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch guild info.");
    }
    setLoading(false);
  };

  const columns: MRT_ColumnDef<Member>[] = [
    {
      accessorKey: 'Name',
      header: 'Name',
    },
    {
      accessorKey: 'LifetimeStatistics.Gathering.Fiber.Total',
      header: 'Fiber'
    },
    {
      accessorKey: 'LifetimeStatistics.Gathering.Hide.Total',
      header: 'Hide'
    },
    {
      accessorKey: 'LifetimeStatistics.Gathering.Ore.Total',
      header: 'Ore'
    },
    {
      accessorKey: 'LifetimeStatistics.Gathering.Rock.Total',
      header: 'Rock'
    },
    {
      accessorKey: 'LifetimeStatistics.Gathering.Wood.Total',
      header: 'Wood'
    },
    {
      accessorKey: 'LifetimeStatistics.FishingFame',
      header: "Fishing"
    }
  ];

  return (
    <>
      <AppBar position="static">
        <Toolbar sx={{ justifyContent: "center" }}>
          <Typography variant="h6">
            Albion Online Guild Viewer
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" style={{ marginTop: "2rem", marginBottom: "2rem" }}>
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
          onClick={() => handleSearch()}
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
              <Typography><strong>Member Count:</strong> {guildInfo.MemberCount}</Typography>
            </CardContent>
          </Card>
        )}

        {members.length > 0 && (
          <Paper style={{ marginTop: "2rem" }}>
            <MaterialReactTable columns={columns} data={members} />
          </Paper>
        )}
      </Container>
    </>
  );
}
