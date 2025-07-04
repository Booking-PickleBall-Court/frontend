import {
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Button,
} from "@mui/material";
import {
  HelpOutline,
  WhatsApp,
  Logout,
} from "@mui/icons-material";

const Sidebar = ({
  sidebarItems,
  accountSettings,
  selectedKey,
  onSelect,
  onLogout,
  onEditProfile,
}) => {
  const handleAccountSettingClick = (key) => {
    if (key === "editProfile") {
      onEditProfile();
    } else {
      onSelect(key);
    }
  };

  return (
    <Box
      sx={{
        width: 280,
        bgcolor: "white",
        borderRight: "1px solid #ddd",
        px: 2,
        py: 3,
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}
    >
      <Typography variant="subtitle1" fontWeight={600}>
        ME
      </Typography>
      <List disablePadding>
        {sidebarItems.map((item) => (
          <ListItemButton
            key={item.key}
            selected={selectedKey === item.key}
            onClick={() => onSelect(item.key)}
            sx={{ borderRadius: 1 }}
          >
            <ListItemIcon
              sx={{ color: selectedKey === item.key ? "#5372F0" : "inherit" }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>

      <Divider />

      <Box>
        <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
          ACCOUNT SETTINGS
        </Typography>
        <List disablePadding>
          {accountSettings.map((item) =>
            item.key !== "language" ? (
              <ListItemButton
                key={item.key}
                selected={selectedKey === item.key}
                onClick={() => handleAccountSettingClick(item.key)}
                sx={{ borderRadius: 1 }}
              >
                <ListItemIcon
                  sx={{
                    color: selectedKey === item.key ? "#5372F0" : "inherit",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            ) : null
          )}
        </List>
      </Box>

      <Divider />

      <Typography
        variant="subtitle1"
        fontWeight={600}
        sx={{ cursor: "pointer" }}
      >
        SUPPORT
      </Typography>
      <List disablePadding>
        <ListItemButton onClick={() => alert("Help Centre clicked")}>
          <ListItemIcon>
            <HelpOutline />
          </ListItemIcon>
          <ListItemText primary="Help Centre" />
        </ListItemButton>
        <ListItemButton onClick={() => alert("WhatsApp Us clicked")}>
          <ListItemIcon>
            <WhatsApp />
          </ListItemIcon>
          <ListItemText primary="WhatsApp Us" />
        </ListItemButton>
      </List>

      <Button
        variant="text"
        color="primary"
        startIcon={<Logout />}
        sx={{ mt: "auto", justifyContent: "flex-start" }}
        onClick={onLogout}
      >
        LOG OUT
      </Button>
    </Box>
  );
};

export default Sidebar;
