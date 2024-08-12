'use client';
import { Box, Stack, TextField, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Checkbox, FormControlLabel } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import InfoIcon from '@mui/icons-material/Info';
import FeedbackIcon from '@mui/icons-material/Feedback'; 
import SaveIcon from '@mui/icons-material/Save'; 
import NewChatIcon from '@mui/icons-material/Chat'; 
import FavoritesIcon from '@mui/icons-material/Favorite'; 
import DeleteIcon from '@mui/icons-material/Delete'; 
import { useState, useRef, useEffect } from 'react';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

export default function Home() {
  const [messages, setMessages] = useState([{
    role: 'assistant',
    content: 'Hello! I am Bujji, specialized in Java and C++. How can I assist you with your programming queries today?',
  }]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [notification, setNotification] = useState('');
  const [showBubble, setShowBubble] = useState(false);
  const [openInfo, setOpenInfo] = useState(false);
  const [openFeedback, setOpenFeedback] = useState(false); 
  const [feedback, setFeedback] = useState('');
  const [savedChats, setSavedChats] = useState([]); 
  const [showFavorites, setShowFavorites] = useState(false); 
  const [selectedChats, setSelectedChats] = useState([]); 
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sanitizeText = (text) => {
    return text.replace(/\*/g, '');
  };

  const sendMessage = async () => {
    const userMessage = message.trim();
    if (!userMessage) return;

    setMessages((prevMessages) => [
      ...prevMessages,
      { role: 'user', content: userMessage },
      { role: 'assistant', content: '...' },
    ]);
    setMessage('');
    setIsLoading(true);
    setShowBubble(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, { role: 'user', content: userMessage }],
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      setMessages((prevMessages) => [
        ...prevMessages.slice(0, -1),
        { role: 'assistant', content: sanitizeText(data.content) },
      ]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prevMessages) => [
        ...prevMessages.slice(0, -1),
        { role: 'assistant', content: 'Sorry, there was an error processing your request.' },
      ]);
    } finally {
      setIsLoading(false);
      setShowBubble(false);
    }
  };

  const handleFocus = () => {
    if (message === '') {
      setMessage('');
    }
  };

  const handleToggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    setNotification(newMode ? 'Switched to Dark Mode!' : 'Switched to Light Mode!');
    setTimeout(() => setNotification(''), 4000);
  };

  const backgroundGradient = isDarkMode 
    ? 'linear-gradient(180deg, #003366, #006699)' 
    : 'linear-gradient(180deg, #ffcf99, #ff9966)';

  const textColor = isDarkMode ? 'white' : '#000';
  const robotGifSrc = '/Robo.gif';
  const robotProfileSrc = '/Robo.png';
  const borderColor = isDarkMode ? '#007BFF' : '#ff9966';

  const handleInfoClick = () => {
    setOpenInfo(true);
  };

  const handleCloseInfo = () => {
    setOpenInfo(false);
  };

  const handleFeedbackClick = () => {
    setOpenFeedback(true);
  };

  const handleCloseFeedback = () => {
    setOpenFeedback(false);
  };

  const handleSubmitFeedback = () => {
    console.log('Feedback submitted:', feedback);
    setFeedback('');
    setOpenFeedback(false);
  };

  const handleSaveChat = () => {
    setSavedChats((prevSavedChats) => [
      ...prevSavedChats,
      { id: Date.now(), messages }
    ]);
    setNotification('Chat saved!');
    setTimeout(() => setNotification(''), 4000);
  };

  const handleNewChat = () => {
    setMessages([{
      role: 'assistant',
      content: 'Hello! I am Bujji, specialized in Java and C++. How can I assist you with your programming queries today?',
    }]);
    setMessage('');
  };

  const handleShowFavorites = () => {
    setShowFavorites(!showFavorites);
  };

  const handleSelectChat = (id) => {
    setSelectedChats((prevSelectedChats) => 
      prevSelectedChats.includes(id) 
      ? prevSelectedChats.filter(chatId => chatId !== id)
      : [...prevSelectedChats, id]
    );
  };

  const handleDeleteSelectedChats = () => {
    setSavedChats((prevSavedChats) => 
      prevSavedChats.filter(chat => !selectedChats.includes(chat.id))
    );
    setSelectedChats([]);
    setNotification('Selected chats deleted!');
    setTimeout(() => setNotification(''), 4000);
  };

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="row"
      p={2}
      style={{ 
        background: backgroundGradient,
        backgroundSize: 'cover', 
        overflow: 'hidden' 
      }}
    >
      <Box
        width="60%"
        display="flex"
        flexDirection="column"
        p={2}
        style={{
          background: 'inherit',
          borderRadius: '32px',
          overflow: 'hidden',
          border: `12px solid ${borderColor}`,
        }}
      >
        <Stack
          direction="column"
          spacing={2}
          flexGrow={1}
          overflowY="auto"
          style={{ 
            maxHeight: 'calc(100% - 64px)', 
            overflowY: 'auto', 
            paddingRight: '10px',
            background: 'inherit',
            scrollbarWidth: 'thin',
            scrollbarColor: isDarkMode ? '#0056b3 #003366' : '#ff9966 #ffcf99'
          }}
        >
          {messages.map((msg, index) => (
            <Box
              key={index}
              display="flex"
              alignItems="center"
              justifyContent={msg.role === 'assistant' ? 'flex-start' : 'flex-end'}
              style={{ position: 'relative', marginBottom: '8px' }}
            >
              {msg.role === 'assistant' && (
                <img
                  src={robotProfileSrc}
                  alt="Robot Profile"
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    marginRight: '8px',
                  }}
                />
              )}
              <Box
                bgcolor={msg.role === 'assistant' ? (isDarkMode ? '#007BFF' : '#ff9966') : (isDarkMode ? '#0056b3' : '#ffcf99')}
                color={textColor}
                borderRadius={16}
                p={2}
                maxWidth="75%"
                wordBreak="break-word"
                style={{ 
                  border: `5px solid ${isDarkMode ? '#0056b3' : '#ff9966'}`,
                  boxShadow: 'none',
                  position: 'relative'
                }}
              >
                <pre style={{ margin: 0, overflowWrap: 'break-word', whiteSpace: 'pre-wrap' }}>
                  <code>{msg.content}</code>
                </pre>
              </Box>
            </Box>
          ))}
          <div ref={messagesEndRef} />
        </Stack>
        <Stack direction="row" spacing={2} position="relative" bottom={0} width="100%" bgcolor="transparent" p={2} borderRadius={16} style={{ boxShadow: 'none', border: 'none' }}>
        <TextField
          placeholder="Message"
          fullWidth
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onFocus={handleFocus}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          InputProps={{
            style: {
              color: isDarkMode ? 'white' : 'black' 
            }
          }}
          style={{
            backgroundColor: isDarkMode ? '#333' : '#fff', 
            borderRadius: '8px',
          }}
        />
          <IconButton
            onClick={sendMessage}
            disabled={isLoading}
            style={{ 
              color: isDarkMode ? '#FFFFFF' : '#000000', 
              marginLeft: '8px', 
              borderRadius: '100%', 
              backgroundColor: isDarkMode ? '#007BFF' : '#f0f4f7',
              padding: '17px',
            }}
            sx={{ fontSize: '3rem' }}
          >
            <SendIcon />
          </IconButton>
        </Stack>
      </Box>
      <Box
        position="relative"
        height="100%"
        p={2}
      >
        {isLoading && (
          <Box
            position="absolute"
            bgcolor="rgba(0, 0, 0, 0.5)"
            color="white"
            borderRadius="8px"
            p={2}
            style={{
              textAlign: 'center',
              width: '200px',
              padding: '10px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            }}
          >
            <Typography variant="body2" component="p">Typing...</Typography>
          </Box>
        )}
        <img
          src={robotGifSrc}
          alt="Robot"
          style={{
            width: '400px',
            height: '400px',
            position: 'absolute',
            bottom: '150px',
            right: '-460px',
            transform: `translate(${Math.sin(Date.now() / 1000) * 10}px, ${Math.cos(Date.now() / 1000) * 10}px)`,
            transition: 'transform 0.1s ease-out',
            borderRadius: '50%',
            border: `8px solid ${borderColor}`
          }}
        />
      </Box>
      <Box
        position="absolute"
        top={8}
        right={250}
        display="flex"
        alignItems={"center"}
        justifyContent="center"
        zIndex={9999}
        width="40px"
        height="40px"
      >
        <IconButton onClick={handleToggleTheme} style={{ color: textColor }}>
          {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
        </IconButton>
      </Box>
      <Box
        position="absolute"
        bottom={16}
        right={16}
        zIndex={100}
      >
        <IconButton onClick={handleInfoClick} style={{ color: textColor }}>
          <InfoIcon />
        </IconButton>
      </Box>
      <Box
        position="absolute"
        bottom={16}
        right={80}
        zIndex={100}
      >
        <IconButton onClick={handleFeedbackClick} style={{ color: textColor }}>
          <FeedbackIcon />
        </IconButton>
      </Box>
      <Box
        position="absolute"
        bottom={16}
        right={144}
        zIndex={100}
      >
        <IconButton onClick={handleSaveChat} style={{ color: textColor }}>
          <SaveIcon />
        </IconButton>
      </Box>
      <Box
        position="absolute"
        bottom={16}
        right={200}
        zIndex={100}
      >
        <IconButton onClick={handleNewChat} style={{ color: textColor }}>
          <NewChatIcon />
        </IconButton>
      </Box>
      <Box
        position="absolute"
        bottom={16}
        right={256}
        zIndex={100}
      >
        <IconButton onClick={handleShowFavorites} style={{ color: textColor }}>
          <FavoritesIcon />
        </IconButton>
      </Box>

      <Dialog open={openInfo} onClose={handleCloseInfo}>
        <DialogTitle>About This App</DialogTitle>
        <DialogContent>
          <Typography>
            This application is a chatbot for programming support, specifically focused on Java and C++. Created by Ishank Pujari.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseInfo} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openFeedback} onClose={handleCloseFeedback}>
        <DialogTitle>Feedback</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Your Feedback"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseFeedback} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmitFeedback} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={showFavorites} onClose={handleShowFavorites}>
        <DialogTitle>Saved Chats</DialogTitle>
        <DialogContent>
          {savedChats.length === 0 ? (
            <Typography>No saved chats.</Typography>
          ) : (
            <Box>
              {savedChats.map(chat => (
                <Box key={chat.id} mb={2}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={selectedChats.includes(chat.id)}
                        onChange={() => handleSelectChat(chat.id)}
                      />
                    }
                    label={`Chat ${chat.id}`}
                  />
                  {chat.messages.map((msg, index) => (
                    <Box
                      key={index}
                      display="flex"
                      alignItems="center"
                      justifyContent={msg.role === 'assistant' ? 'flex-start' : 'flex-end'}
                      style={{ position: 'relative', marginBottom: '8px' }}
                    >
                      {msg.role === 'assistant' && (
                        <img
                          src={robotProfileSrc}
                          alt="Robot Profile"
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            marginRight: '8px',
                          }}
                        />
                      )}
                      <Box
                        bgcolor={msg.role === 'assistant' ? (isDarkMode ? '#007BFF' : '#ff9966') : (isDarkMode ? '#0056b3' : '#ffcf99')}
                        color={textColor}
                        borderRadius={16}
                        p={2}
                        maxWidth="75%"
                        wordBreak="break-word"
                        style={{ 
                          border: `1px solid ${isDarkMode ? '#0056b3' : '#ff9966'}`,
                          boxShadow: 'none',
                          position: 'relative'
                        }}
                      >
                        <pre style={{ margin: 0, overflowWrap: 'break-word', whiteSpace: 'pre-wrap' }}>
                          <code>{msg.content}</code>
                        </pre>
                      </Box>
                    </Box>
                  ))}
                </Box>
              ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteSelectedChats} color="primary" startIcon={<DeleteIcon />}>
            Delete Selected
          </Button>
          <Button onClick={handleShowFavorites} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
