import { useEffect, useState } from "react";
import { Container, Paper, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { realtimeDB } from "../firebase";   // make sure you export realtimeDB in firebase.js
import { ref, onValue } from "firebase/database";

export default function Help() {
  const [contacts, setContacts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Reference to your database path
    const helpRef = ref(realtimeDB, "wheelchair/helpcenters");

    // Listen for data changes
    const unsub = onValue(helpRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        // Convert object {0:{...},1:{...}} into array
        setContacts(Object.values(data));
      } else {
        setContacts([]);
      }
    });

    return () => unsub();
  }, []);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Nearby Help Centers</Typography>
      {contacts.length === 0 ? (
        <Typography>No help centers found</Typography>
      ) : (
        contacts.map((c, i) => (
          <Paper key={i} elevation={5} sx={{ p: 2, mb: 2, borderRadius: 2 }}>
            <Typography variant="h6">{c.name}</Typography>
            <Typography>{c.phone}</Typography>
            {c.hours && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                {c.hours}
              </Typography>
            )}
          </Paper>
        ))
      )}
      
    </Container>
  );
          }
