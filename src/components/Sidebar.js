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
  Logout,
} from "@mui/icons-material";

const Sidebar = ({
  sidebarItems,
  accountSettings,
  selectedKey,
  onSelect,
  onLogout,
  onEditProfile,
  onPasswordChange,
}) => {
  const handleAccountSettingClick = (key) => {
    if (key === "editProfile") {
      onEditProfile();
    } else if (key === "changePassword") {
      onPasswordChange();
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
        Bản thân
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

      <Typography variant="subtitle1" fontWeight={600}>
        Quản lý tài khoản
      </Typography>
      <List disablePadding>
        {accountSettings.map((item) => (
          <ListItemButton
            key={item.key}
            onClick={() => handleAccountSettingClick(item.key)}
            sx={{ borderRadius: 1 }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>

      <Box sx={{ mt: "auto" }}>
        <Button
          variant="outlined"
          color="error"
          fullWidth
          startIcon={<Logout />}
          onClick={onLogout}
          sx={{ textTransform: "none" }}
        >
          Đăng xuất
        </Button>
      </Box>
    </Box>
  );
};

export default Sidebar;
