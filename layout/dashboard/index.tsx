"use client";
import React, { useEffect } from "react";

import { NoContent } from "@assets/common";
import LogoIcon from "@assets/icons/logo-icon";
import { IsFetching } from "@components/table-components";
import { getSocket } from "@contexts/socket/socket";
import { socketEvent } from "@enums/event";
import FilterListIcon from "@mui/icons-material/FilterList";
import {
  Avatar,
  AvatarGroup,
  Badge,
  Box,
  Divider,
  Drawer,
  Grid2 as Grid,
  IconButton,
  Paper,
  Popover,
  Stack,
  Typography,
  useTheme
} from "@mui/material";
import {
  useGetChatsListQuery,
  usePostCreateChatMutation,
} from "@services/chats/chat-api";
import { useGetContactsListQuery } from "@services/contacts/contacts-api";
import dayjs from "dayjs";
import Link from "next/link";
import toast from "react-hot-toast";
import TopNavBar from "./top-navbar";

function DashBoardLayout(props: any) {
  const { children } = props;
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [onlineUsers, setOnlineUsers] = React.useState<any>([]);
  ///socket works
  const socket = getSocket();
   useEffect(() => {
     const handleOnlineUsers = (data: any) => {
       setOnlineUsers(data);
     };

     socket.on(socketEvent.onlineUsers, handleOnlineUsers);

     return () => {
       socket.off(socketEvent.onlineUsers, handleOnlineUsers);
     };
   }, [onlineUsers, socket]);

  const toggleDrawer = (newOpen: boolean) => () => {
    setDrawerOpen(newOpen);
  };
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  //apis
  const { data, isLoading, isFetching, isError } = useGetContactsListQuery({});
  const theme = useTheme();
  const [CreateChat] = usePostCreateChatMutation();

  const handleCreateSingleChat = async (memberid: any) => {
    try {
      const payload = {
        body: {
          members: [memberid],
          name: "not a group chat",
          groupChat: false,
        },
      };

      const { successMessage } = await CreateChat(payload).unwrap();

      toast.success(String(successMessage ?? "Chat created successfully"));
    } catch (error: any) {
      console.log("error", error?.data?.errorMessage);
      toast.error(
        String(error?.data?.errorMessage?.message ?? "Something went wrong!")
      );
    }
  };

  if (isFetching) {
    return (
      <Box>
        <IsFetching isFetching />
      </Box>
    );
  }

  return (
    <Box>
      <TopNavBar socket={socket} toggleDrawer={toggleDrawer} />
      <Drawer open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box
          sx={{
            borderRadius: 1,
            backgroundColor: "background.paper",
            height: "100%",
            minHeight: "75vh",
            maxWidth: 440,
            a: {
              textDecoration: "none",
            },
          }}
        >
          <LogoIcon
            sx={{
              width: 200,
              height: 50,
              my: 2,
            }}
          />
          <Stack gap={1}>
            <Paper variant="elevation" elevation={0} sx={{ p: 1 }}>
              <Stack gap={2}>
                <Stack flexDirection={"row"} gap={2} alignItems={"center"}>
                  <Typography
                    variant="body1"
                    fontWeight={"bold"}
                    color="neutral.600"
                  >
                    Chats
                  </Typography>
                  <IconButton
                    aria-describedby={id}
                    onClick={handleClick}
                    sx={{
                      ml: "auto",
                      color: "primary.main",
                      backgroundColor: "background.paper",
                    }}
                  >
                    <FilterListIcon />
                  </IconButton>
                  <Popover
                    id={id}
                    open={open}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "left",
                    }}
                  >
                    <Stack p={1} px={2} pl={0.8} gap={1}>
                      <Typography
                        variant="subtitle2"
                        color="neutral.600"
                        fontWeight={"bold"}
                        pl={0.4}
                      >
                        All Contacts
                      </Typography>
                      {isLoading || isFetching ? (
                        <Box>
                          <IsFetching isFetching />
                        </Box>
                      ) : data?.data?.friends &&
                        data?.data?.friends.length > 0 &&
                        !isError ? (
                        <Box
                          height={"100%"}
                          width={"100%"}
                          sx={{
                            overflowY: "scroll",
                            "&::-webkit-scrollbar": {
                              width: "0.4em",
                            },
                            "&::-webkit-scrollbar-thumb": {
                              backgroundColor: theme.palette.primary.main,
                              borderRadius: 2,
                            },
                          }}
                        >
                          {data?.data?.friends?.map(
                            ({
                              avatar,
                              firstName,
                              lastName,
                              email,
                              _id,
                            }: any) => (
                              <Stack
                                flexDirection={"row"}
                                gap={1}
                                justifyContent={"space-between"}
                                alignItems={"center"}
                                width={"100%"}
                                mb={1}
                                sx={{ cursor: "pointer" }}
                                onClick={() => handleCreateSingleChat(_id)}
                              >
                                {avatar ? (
                                  <Avatar
                                    src={avatar?.url}
                                    alt={
                                      firstName.charAt(0).toUpperCase() ?? "A"
                                    }
                                    variant="circular"
                                    sx={{ width: 40, height: 40 }}
                                  />
                                ) : (
                                  <Avatar
                                    variant="circular"
                                    sx={{ width: 40, height: 40 }}
                                  >
                                    {/* {firstName.charAt(0).toUpperCase()} */}
                                  </Avatar>
                                )}

                                <Stack mr={"auto"}>
                                  <Typography
                                    variant="body1"
                                    color="initial"
                                    mr={"auto"}
                                  >
                                    {firstName ?? ""} {lastName ?? ""}
                                  </Typography>
                                  <Typography
                                    variant="subtitle2"
                                    color="initial"
                                    mr={"auto"}
                                  >
                                    {email ?? "-"}
                                  </Typography>
                                </Stack>
                              </Stack>
                            )
                          )}
                        </Box>
                      ) : (
                        <Box
                          display={"flex"}
                          justifyContent={"center"}
                          width={"100%"}
                        >
                          <NoContent sx={{ fontSize: 180, opacity: 0.6 }} />
                        </Box>
                      )}
                    </Stack>
                  </Popover>
                </Stack>
                <Stack
                  gap={2}
                  sx={{
                    overflowY: "auto",
                    height: "100%",
                    maxHeight: "50vh",
                    "&::-webkit-scrollbar": {
                      width: "3px",
                      height: "3px",
                    },
                    "&::-webkit-scrollbar-thumb": {
                      backgroundColor: "primary.main",
                      borderRadius: "6px",
                    },
                  }}
                >
                  <ChatMain onlineUsers={onlineUsers} />
                </Stack>
              </Stack>
            </Paper>
          </Stack>
        </Box>
      </Drawer>
      <Grid px={2} pt={2} spacing={2} container>
       
          <Grid size={3} sx={{ display: { xs: "none", lg: "block" } }}>
            <Box
              sx={{
                borderRadius: 1,
                backgroundColor: "background.paper",

                a: {
                  textDecoration: "none",
                },
              }}
            >
              <Stack gap={1}>
                <Paper variant="elevation" elevation={0} sx={{ p: 1 }}>
                  <Stack gap={2}>
                    <Stack flexDirection={"row"} gap={2} alignItems={"center"}>
                      <Typography
                        variant="body1"
                        fontWeight={"bold"}
                        color="neutral.600"
                      >
                        Chats
                      </Typography>
                      <IconButton
                        aria-describedby={id}
                        onClick={handleClick}
                        sx={{
                          ml: "auto",
                          color: "primary.main",
                          backgroundColor: "background.paper",
                        }}
                      >
                        <FilterListIcon />
                      </IconButton>
                      <Popover
                        id={id}
                        open={open}
                        anchorEl={anchorEl}
                        onClose={handleClose}
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "left",
                        }}
                      >
                        <Stack p={1} px={2} pl={0.8} gap={1}>
                          <Typography
                            variant="subtitle2"
                            color="neutral.600"
                            fontWeight={"bold"}
                            pl={0.4}
                          >
                            All Contacts
                          </Typography>
                          {isLoading || isFetching ? (
                            <Box>
                              <IsFetching isFetching />
                            </Box>
                          ) : data?.data?.friends &&
                            data?.data?.friends.length > 0 &&
                            !isError ? (
                            <Box
                              height={220}
                              width={"100%"}
                              sx={{
                                overflowY: "scroll",
                                "&::-webkit-scrollbar": {
                                  width: "0.4em",
                                },
                                "&::-webkit-scrollbar-thumb": {
                                  backgroundColor: theme.palette.primary.main,
                                  borderRadius: 2,
                                },
                              }}
                            >
                              {data?.data?.friends?.map(
                                ({
                                  avatar,
                                  _id,
                                  firstName,
                                  lastName,
                                  email,
                                }: any) => (
                                  <Stack
                                    flexDirection={"row"}
                                    gap={1}
                                    justifyContent={"space-between"}
                                    alignItems={"center"}
                                    width={"100%"}
                                    mb={1}
                                    sx={{ cursor: "pointer" }}
                                    onClick={() => handleCreateSingleChat(_id)}
                                  >
                                    {avatar ? (
                                      <Avatar
                                        src={avatar?.url}
                                        alt={
                                          firstName.charAt(0).toUpperCase() ??
                                          "A"
                                        }
                                        variant="circular"
                                        sx={{ width: 40, height: 40 }}
                                      />
                                    ) : (
                                      <Avatar
                                        variant="circular"
                                        sx={{ width: 40, height: 40 }}
                                      >
                                        {/* {firstName.charAt(0).toUpperCase()} */}
                                      </Avatar>
                                    )}

                                    <Stack mr={"auto"}>
                                      <Typography
                                        variant="body1"
                                        color="initial"
                                        mr={"auto"}
                                      >
                                        {firstName ?? ""} {lastName ?? ""}
                                      </Typography>
                                      <Typography
                                        variant="subtitle2"
                                        color="initial"
                                        mr={"auto"}
                                      >
                                        {email ?? "-"}
                                      </Typography>
                                    </Stack>
                                  </Stack>
                                )
                              )}
                            </Box>
                          ) : (
                            <Box
                              display={"flex"}
                              justifyContent={"center"}
                              width={"100%"}
                            >
                              <NoContent sx={{ fontSize: 180, opacity: 0.6 }} />
                            </Box>
                          )}
                        </Stack>
                      </Popover>
                    </Stack>
                    <ChatMain onlineUsers={onlineUsers} />
                  </Stack>
                </Paper>
              </Stack>
            </Box>
          </Grid>
      

        <Grid size={{ xs: 12, lg: 9 }}>
          <Box
            sx={{
              borderRadius: 1,
              backgroundColor: "background.paper",
              px: 2,
              pt: 2,
              pb: 1,
              minHeight: "500px",
              height: "100%",
            }}
          >
            {children}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default DashBoardLayout;

const ChatMain = ({ onlineUsers }:any) => {
  const { data, isLoading, isFetching, isError } = useGetChatsListQuery({});
  const theme = useTheme();
  if (isFetching) {
    return (
      <Box>
        <IsFetching isFetching />
      </Box>
    );
  }

  return (
    <Stack
      gap={2}
      sx={{
        overflowY: "auto",
        height: "78vh",
        "&::-webkit-scrollbar": {
          width: "3px",
          height: "3px",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "primary.main",
          borderRadius: "6px",
        },
      }}
    >
      {isLoading || isFetching ? (
        <Box>
          <IsFetching isFetching />
        </Box>
      ) : data?.data && data?.data.length > 0 && !isError ? (
        <Box
          width={"100%"}
          sx={{
            overflowY: "scroll",
            height: "85vh",
            "&::-webkit-scrollbar": {
              width: "0.4em",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: theme.palette.primary.main,
              borderRadius: 2,
            },
          }}
        >
          {data?.data?.map((item: any) => (
            <ChatList onlineUsers={onlineUsers} key={item?._id} {...item} />
          ))}
        </Box>
      ) : (
        <Box height={"85vh"} display={"flex"} justifyContent={"center"} width={"100%"}>
          <Typography variant="body1" color="neutral.400">
            Select a friend to start a chat
          </Typography>
        </Box>
      )}
    </Stack>
  );
};

const ChatList = (props: any) => {
  const {
    _id,
    members,
    groupChat,
    name,
    onlineUsers=[],
  } = props;

  return (
    <>
      <Link href={{ pathname: `/dashboard`, query: { chatId: _id } }}>
        <Stack gap={1} alignItems={"flex-start"} sx={{ width: "100%", px: 1 }}>
          <Stack
            justifyContent="space-between"
            alignItems="center"
            flexDirection={"row"}
            width="100%"
            gap={1}
            py={1}
          >
            <AvatarGroup max={4}>
              {members.map((member: any) => (
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  variant="dot"
                  sx={(theme) => ({
                    "& .MuiBadge-badge": {
                      backgroundColor: onlineUsers.includes(member?._id)
                        ? "#44b700"
                        : "neutral.400",
                      color: onlineUsers.includes(member?._id)
                        ? "#44b700"
                        : "neutral.400",
                      boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
                      "&::after": {
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        borderRadius: "50%",
                        animation: "ripple 1.2s infinite ease-in-out",
                        border: "1px solid currentColor",
                        content: '""',
                      },
                    },
                    "@keyframes ripple": {
                      "0%": {
                        transform: "scale(.8)",
                        opacity: 1,
                      },
                      "100%": {
                        transform: "scale(2.4)",
                        opacity: 0,
                      },
                    },
                  })}
                >
                  <Avatar
                    sx={{
                      width: 50,
                      height: 50,
                      fontSize: 14,
                      fontWeight: "bold",
                      color: "white",
                      bgcolor: "primary.main",
                    }}
                    alt=""
                    variant="rounded"
                    src={member?.avatar?.url}
                  >
                    {member?.firstName.charAt(0).toUpperCase()}
                  </Avatar>
                </Badge>
              ))}
            </AvatarGroup>

            <Stack gap={1}>
              <Typography
                variant="body1"
                fontWeight={"bold"}
                color="text.primary"
                sx={{
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {groupChat
                  ? name
                  : `${members[0]?.firstName} ${members[0]?.lastName}`}
              </Typography>
              {/* <Typography
                variant="subtitle2"
                fontWeight={"bold"}
                color="neutral.600"
                sx={{
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {subtitle}
              </Typography> */}
            </Stack>
            <Stack
              justifyContent={"space-between"}
              ml={"auto"}
              alignContent={"center"}
              alignItems={"center"}
            >
              <Typography
                whiteSpace={"nowrap"}
                color="neutral.600"
                fontSize={12}
              >
                {dayjs().format("hh:mm A")}
              </Typography>
              {/* {unread > 0 && (
                <Box
                  sx={{
                    width: "25px",
                    height: "25px",
                    bgcolor: "primary.main",
                    borderRadius: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    sx={{
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                    variant="subtitle1"
                    color="common.white"
                  >
                    {unread}
                  </Typography>
                </Box>
              )} */}
            </Stack>
          </Stack>
          <Divider
            variant="fullWidth"
            orientation="horizontal"
            sx={{ borderColor: "neutral.300" }}
          />
        </Stack>
      </Link>
    </>
  );
};