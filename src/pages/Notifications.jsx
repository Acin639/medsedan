import { useEffect, useState } from "react";
import { db } from "../firebase";
import { ref, onValue } from "firebase/database";
import { Container, Paper, Typography, Button, CircularProgress, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Notifications() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      setLoading(true);
      // Reference to your database path
      const notificationsRef = ref(db, "wheelchair/notifications");
      
      // Listen for data changes
      const unsubscribe = onValue(
        notificationsRef,
        (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            // Convert object to array if needed
            const messageArray = Array.isArray(data) 
              ? data 
              : Object.values(data);
            console.log("Fetched messages:", messageArray);
            setMessages(messageArray);
            setError(null);
          } else {
            console.log("No notifications found");
            setMessages([]);
          }
          setLoading(false);
        },
        (error) => {
          console.error("Error fetching notifications:", error);
          setError(`Failed to load notifications: ${error.message}`);
          setMessages([]);
          setLoading(false);
        }
      );

      // Cleanup subscription on unmount
      return () => unsubscribe();
    } catch (err) {
      console.error("Error:", err);
      setError(`Error: ${err.message}`);
      setLoading(false);
    }
  }, []);

  if (loading) return <Container sx={{ mt: 4 }}><CircularProgress /></Container>;

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Notifications</Typography>
      
      {error && <Alert severity="error">{error}</Alert>}
      
      {messages.length === 0 ? (
        <Alert severity="info">No notifications found</Alert>
      ) : (
        messages.map((msg, i) => (
          <Paper key={i} elevation={4} sx={{ p: 2, mb: 2, borderRadius: 2 }}>
            <Typography>{msg.message}</Typography>
            <Typography variant="caption">{msg.timestamp}</Typography>
          </Paper>
        ))
      )}
      
      <Button variant="outlined" onClick={() => navigate("/home")}>Back</Button>
    </Container>
  );
}
