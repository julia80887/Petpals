import React, { useState, useContext } from "react";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import PersonAdd from "@mui/icons-material/PersonAdd";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import PetsIcon from "@mui/icons-material/Pets";
import { useNavigate } from "react-router-dom";
import FeedIcon from "@mui/icons-material/Feed";

import { LoginContext } from "../../contexts/LoginContext";

export default function ShelterAccountMenu({prevPicture, setPrevPicture}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const open = Boolean(anchorEl);
  const { currentUser, setCurrentUser } = useContext(LoginContext);
  const shelter_name = localStorage.getItem("shelter_name");
  const id = localStorage.getItem("id");
  const profile_photo = localStorage.getItem("profile_photo");

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  function handleLogout() {
    setPrevPicture("");
    localStorage.removeItem("access");
    localStorage.removeItem("username");
    localStorage.removeItem("shelter_name");
    localStorage.removeItem("id");
    localStorage.removeItem("profile_photo");
    setCurrentUser({});
    navigate(
      "/?type=&shelter=&gender=&color=&lt_size=&gt_size=&status=&order_by=name"
    );
  }
  function handleProfile() {
    navigate(`/profile/shelter/${localStorage.getItem("id")}`);
  }
  function handlePets() {
    navigate("/pets/");
  }
  function handleApplication() {
    navigate(`/pet/applications/`);
  }
  function handleNotifications() {}

  return (
    <React.Fragment>
      <Box sx={{ display: "flex", alignItems: "center", textAlign: "center" }}>
        <IconButton
          onClick={handleClick}
          size="small"
          sx={{ ml: 2 }}
          aria-controls={open ? "account-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
        >
          <Avatar sx={{ width: 32, height: 32 }} src={prevPicture} />
        </IconButton>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={handleProfile}>
          <Avatar src={prevPicture} /> Edit Profile
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleApplication}>
          <ListItemIcon>
            <FeedIcon fontSize="medium" color="brown"></FeedIcon>
          </ListItemIcon>
          My Applications
        </MenuItem>
        <Divider />
        <MenuItem onClick={handlePets}>
          <ListItemIcon>
            <PetsIcon fontSize="medium" color="brown"></PetsIcon>
          </ListItemIcon>
          My Pets
        </MenuItem>
        <Divider />

        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
}
