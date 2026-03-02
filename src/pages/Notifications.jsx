import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { Container, Paper, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Notifications() {
  const [messages, setMessages] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMessages = async () => {
      const querySnapshot = await getDocs(collection(db, "wheelchair/notifications"));
      setMessages(querySnapshot.docs.map(doc => doc.data()));
    };
    fetchMessages();
  }, []);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Notifications</Typography>
      {messages.map((msg, i) => (
        <Paper key={i} elevation={4} sx={{ p: 2, mb: 2, borderRadius: 2 }}>
          <Typography>{msg.message}</Typography>
          <Typography variant="caption">{msg.timestamp}</Typography>
        </Paper>
      ))}
      <Button variant="outlined" onClick={() => navigate("/home")}>Back</Button>
    </Container>
  );
}
