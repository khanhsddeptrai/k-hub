import {
    Box,
    Avatar,
    Typography,
    TextField,
    IconButton,
    List,
    ListItemAvatar,
    ListItemText,
    Paper,
    Badge,
    ListItemButton
} from '@mui/material';
import { Send, MoreVert, ArrowBack } from '@mui/icons-material';
import { useState } from 'react';

// Định nghĩa interface với kiểu dữ liệu chính xác
interface Message {
    id: number;
    text: string;
    sender: 'me' | 'them';
    timestamp: string;
}

interface ChatUser {
    name: string;
    avatar: string;
    online: boolean;
}

interface Chat {
    id: number;
    user: ChatUser;
    lastMessage: string;
    unread: number;
    messages: Message[];
}

const ChatPage = () => {
    const [chats, setChats] = useState<Chat[]>([
        {
            id: 1,
            user: {
                name: "Jaden Chance",
                avatar: "",
                online: true
            },
            lastMessage: "Hey, how are you doing?",
            unread: 2,
            messages: [
                { id: 1, text: "Hey there!", sender: 'them', timestamp: "10:30 AM" },
                { id: 2, text: "How are you?", sender: 'them', timestamp: "10:31 AM" },
                { id: 3, text: "I'm good, thanks!", sender: 'me', timestamp: "10:35 AM" },
                { id: 4, text: "What about you?", sender: 'me', timestamp: "10:35 AM" },
                { id: 5, text: "Hey, how are you doing?", sender: 'them', timestamp: "11:42 AM" }
            ]
        },
        {
            id: 2,
            user: {
                name: "Rose James",
                avatar: "",
                online: false
            },
            lastMessage: "Meeting at 3pm",
            unread: 0,
            messages: [
                { id: 1, text: "Don't forget our meeting", sender: 'them', timestamp: "9:15 AM" },
                { id: 2, text: "Meeting at 3pm", sender: 'them', timestamp: "9:16 AM" }
            ]
        }
    ]);

    const [activeChat, setActiveChat] = useState<number | null>(1);
    const [newMessage, setNewMessage] = useState("");

    const handleSendMessage = () => {
        if (newMessage.trim() === "") return;

        const updatedChats = chats.map(chat => {
            if (chat.id === activeChat) {
                const newMsg: Message = {
                    id: chat.messages.length + 1,
                    text: newMessage,
                    sender: 'me',
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                };

                return {
                    ...chat,
                    messages: [...chat.messages, newMsg],
                    lastMessage: newMessage,
                    unread: 0
                };
            }
            return chat;
        });

        setChats(updatedChats);
        setNewMessage("");
    };

    const currentChat = chats.find(chat => chat.id === activeChat);

    return (
        <Box sx={{
            display: 'flex',
            height: 'calc(100vh - 64px)',
            maxWidth: 1000,
            mx: 'auto',
            borderLeft: '1px solid',
            borderColor: 'divider',
        }}>
            {/* Chat area (ở giữa) */}
            {currentChat ? (
                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    {/* Chat header */}
                    <Box sx={{
                        p: 2,
                        display: 'flex',
                        alignItems: 'center',
                        borderBottom: '1px solid',
                        borderColor: 'divider'
                    }}>
                        <IconButton sx={{ mr: 1, display: { sm: 'none' } }}>
                            <ArrowBack />
                        </IconButton>
                        <Badge
                            overlap="circular"
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                            variant="dot"
                            color={currentChat.user.online ? "success" : "default"}
                        >
                            <Avatar src={currentChat.user.avatar} sx={{ mr: 2 }} />
                        </Badge>
                        <Typography variant="subtitle1" fontWeight="bold">
                            {currentChat.user.name}
                        </Typography>
                        <Box sx={{ flexGrow: 1 }} />
                        <IconButton>
                            <MoreVert />
                        </IconButton>
                    </Box>

                    {/* Messages */}
                    <Box sx={{
                        flex: 1,
                        p: 2,
                        overflowY: 'auto',
                        bgcolor: 'background.default',
                        scrollbarWidth: 'none !important', // Ẩn scrollbar trên Firefox
                        '&::-webkit-scrollbar': {
                            display: 'none !important', // Ẩn scrollbar trên Chrome, Safari
                        },
                        '-ms-overflow-style': 'none !important', // Ẩn scrollbar trên Edge
                    }}>
                        {currentChat.messages.map(message => (
                            <Box
                                key={message.id}
                                sx={{
                                    display: 'flex',
                                    justifyContent: message.sender === 'me' ? 'flex-end' : 'flex-start',
                                    mb: 2
                                }}
                            >
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 1.5,
                                        maxWidth: '70%',
                                        bgcolor: message.sender === 'me' ? 'primary.main' : 'background.paper',
                                        color: message.sender === 'me' ? 'white' : 'text.primary',
                                        borderRadius: message.sender === 'me'
                                            ? '18px 18px 0 18px'
                                            : '18px 18px 18px 0'
                                    }}
                                >
                                    <Typography>{message.text}</Typography>
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            display: 'block',
                                            textAlign: 'right',
                                            color: message.sender === 'me' ? 'rgba(255,255,255,0.7)' : 'text.secondary'
                                        }}
                                    >
                                        {message.timestamp}
                                    </Typography>
                                </Paper>
                            </Box>
                        ))}
                    </Box>

                    {/* Message input */}
                    <Box sx={{
                        p: 2,
                        borderTop: '1px solid',
                        borderColor: 'divider'
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <TextField
                                fullWidth
                                placeholder="Type a message"
                                variant="outlined"
                                size="small"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                sx={{ mr: 1 }}
                            />
                            <IconButton
                                color="primary"
                                onClick={handleSendMessage}
                                disabled={!newMessage.trim()}
                            >
                                <Send />
                            </IconButton>
                        </Box>
                    </Box>
                </Box>
            ) : (
                <Box sx={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'background.default'
                }}>
                    <Typography variant="h6" color="text.secondary">
                        Select a chat to start messaging
                    </Typography>
                </Box>
            )}

            {/* Chat list sidebar (ở bên phải) */}
            <Box sx={{
                width: 250,
                borderLeft: '1px solid',
                borderColor: 'divider',
                display: 'flex',
                flexDirection: 'column'
            }}>
                {/* Chat list */}
                <Box sx={{ flex: 1, overflowY: 'auto' }}>
                    <List sx={{ p: 0 }}>
                        {chats.map(chat => (
                            <ListItemButton
                                key={chat.id}
                                component="button"
                                selected={activeChat === chat.id}
                                onClick={() => setActiveChat(chat.id)}
                                sx={{

                                    width: '100%',
                                    '&.Mui-selected': {
                                        backgroundColor: 'action.selected'
                                    }

                                }}
                            >
                                <ListItemAvatar>
                                    <Badge
                                        overlap="circular"
                                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                        variant="dot"
                                        color={chat.user.online ? "success" : "default"}
                                    >
                                        <Avatar src={chat.user.avatar} />
                                    </Badge>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={chat.user.name}
                                    secondary={chat.lastMessage}
                                    secondaryTypographyProps={{
                                        noWrap: true,
                                        color: 'text.secondary'
                                    }}
                                />
                                {chat.unread > 0 && (
                                    <Box sx={{
                                        bgcolor: 'primary.main',
                                        color: 'white',
                                        borderRadius: '50%',
                                        width: 24,
                                        height: 24,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '0.75rem'
                                    }}>
                                        {chat.unread}
                                    </Box>
                                )}
                            </ListItemButton>
                        ))}
                    </List>
                </Box>
            </Box>
        </Box >
    );
};

export default ChatPage;