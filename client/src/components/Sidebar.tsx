import React from 'react';
import { List, ListItem, ListItemIcon, ListItemText, Divider, styled } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import TableChartIcon from '@mui/icons-material/TableChart';
import ReceiptIcon from '@mui/icons-material/Receipt';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import Logo from 'src/assets/img/admin-removebg-preview.png';
import { Link } from 'react-router-dom';

const SidebarContainer = styled('div')(() => ({
  width: '250px',
  backgroundColor: '#36363C',
  color: '#fff',
  height: '160vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}));

const LogoContainer = styled('div')(() => ({
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  padding: '20px 0',
}));

const SidebarItem = styled(ListItem)(({ active }) => ({
  '&:hover': {
    backgroundColor: active ? '#E63673' : '#525256',
    color: 'white',
    borderRadius: '10px',
    width: '230px',
  },
  backgroundColor: active ? '#E63673' : 'transparent',
  color: 'white',
  borderRadius: '10px',
  width: '230px',
  margin: '10px  auto',
}));

const Sidebar = () => {
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const handleListItemClick = (_event: React.MouseEvent<HTMLLIElement, MouseEvent>, index: React.SetStateAction<number>) => {
    setSelectedIndex(index);
  };

  return (
    <SidebarContainer sx={{ borderRadius: '5px' }}>
      <LogoContainer>
        <Link to={'/admin'} style={{ textDecoration: 'none' }}>
          <img src={Logo} alt="Logo" width={100} />
        </Link>
      </LogoContainer>

      <Divider sx={{ width: '100%' }} color='pink' />

      <List component="nav">
        <Link to={'/admin'} style={{ textDecoration: 'none' }}>
          <SidebarItem
            button
            active={selectedIndex === 0}
            onClick={(event) => handleListItemClick(event, 0)}
          >
            <ListItemIcon>
              <DashboardIcon sx={{ color: 'white' }} />
            </ListItemIcon>
            <ListItemText primary="Bảng điều khiển" />
          </SidebarItem>
        </Link>

        <Link to={'/admin'} style={{ textDecoration: 'none' }}>
          <SidebarItem
            button
            active={selectedIndex === 1}
            onClick={(event) => handleListItemClick(event, 1)}
          >
            <ListItemIcon>
              <TableChartIcon sx={{ color: 'white' }} />
            </ListItemIcon>
            <ListItemText primary="Sản phẩm" />
          </SidebarItem>
        </Link>

        <Link to={'/admin/category/list'} style={{ textDecoration: 'none' }}>
          <SidebarItem
            button
            active={selectedIndex === 2}
            onClick={(event) => handleListItemClick(event, 2)}
          >
            <ListItemIcon>
              <ReceiptIcon sx={{ color: 'white' }} />
            </ListItemIcon>
            <ListItemText primary="Danh mục" />
          </SidebarItem>
        </Link>

        <Link to={'#'} style={{ textDecoration: 'none' }}>
          <SidebarItem
            button
            active={selectedIndex === 6}
            onClick={(event) => handleListItemClick(event, 6)}
          >
            <ListItemIcon>
              <AccountCircleIcon sx={{ color: 'white' }} />
            </ListItemIcon>
            <ListItemText primary="Người dùng" />
          </SidebarItem>
        </Link>

        <Link to={'/'} style={{ textDecoration: 'none' }}>
          <SidebarItem
            button
            active={selectedIndex === 7}
            onClick={(event) => handleListItemClick(event, 7)}
          >
            <ListItemIcon>
              <ExitToAppIcon sx={{ color: 'white' }} />
            </ListItemIcon>
            <ListItemText primary="Website" />
          </SidebarItem>
        </Link>

      </List>
    </SidebarContainer>
  );
};

export default Sidebar;
