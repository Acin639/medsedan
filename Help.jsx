import { useEffect, useState } from "react";
import { Container, Paper, Typography, Button, CircularProgress, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Help({ coords = { lat: 0, lng: 0 } }) {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Using Google Places API (you need to set up your API key)
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${coords.lat},${coords.lng}&radius=5000&type=hospital&key=YOUR_GOOGLE_API_KEY`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" }
          }
        );
        
        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.results && data.results.length > 0) {
          setContacts(data.results);
        } else {
          setError("No nearby help centers found in your area.");
          setContacts([]);
        }
      } catch (err) {
        console.error("Error fetching contacts:", err);
        setError(`Failed to load help centers: ${err.message}`);
        setContacts([]);
      } finally {
        setLoading(false);
      }
    };
    
    if (coords.lat && coords.lng) {
      fetchContacts();
    } else {
      setError("Location not available. Please enable location services.");
      setLoading(false);
    }
  }, [coords]);

  if (loading) {
    return (
      <Container sx={{ mt: 4, textAlign: "center" }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading nearby help centers...</Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Nearby Help Centers</Typography>
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      {contacts.length === 0 ? (
        <Alert severity="info">No help centers found nearby</Alert>
      ) : (
        contacts.map((c, i) => (
          <Paper key={i} elevation={5} sx={{ p: 2, mb: 2, borderRadius: 2 }}>
            <Typography variant="h6">{c.name}</Typography>
            <Typography variant="body2">{c.vicinity}</Typography>
            {c.phone && <Typography variant="body2">Phone: {c.phone}</Typography>}
            {c.rating && <Typography variant="body2">Rating: {c.rating} ⭐</Typography>}
          </Paper>
        ))
      )}
      
      <Button variant="outlined" onClick={() => navigate("/home")} sx={{ mt: 2 }}>Back</Button>
    </Container>
  );
}