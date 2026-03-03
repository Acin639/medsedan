import { useEffect, useState } from "react";
import { Container, Paper, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Help({ coords = { lat: -1.2921, lng: 36.8219 } }) {
  const [contacts, setContacts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        // Step 1: Nearby Search
        const nearbyResponse = await fetch(
          `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${coords.lat},${coords.lng}&radius=5000&type=hospital&key=YOUR_API_KEY`
        );
        const nearbyData = await nearbyResponse.json();

        // Step 2: Fetch details for each place
        const detailedContacts = await Promise.all(
          (nearbyData.results || []).map(async (place) => {
            const detailsResponse = await fetch(
              `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=name,formatted_phone_number,opening_hours&key=YOUR_API_KEY`
            );
            const detailsData = await detailsResponse.json();
            return {
              name: detailsData.result.name,
              phone: detailsData.result.formatted_phone_number || "No phone available",
              hours: detailsData.result.opening_hours?.weekday_text || []
            };
          })
        );

        setContacts(detailedContacts);
      } catch (err) {
        console.error("Error fetching contacts:", err);
      }
    };

    fetchContacts();
  }, [coords]);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Nearby Help Centers</Typography>
      {contacts.map((c, i) => (
        <Paper key={i} elevation={5} sx={{ p: 2, mb: 2, borderRadius: 2 }}>
          <Typography variant="h6">{c.name}</Typography>
          <Typography>{c.phone}</Typography>
          {c.hours.length > 0 && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              {c.hours.join(", ")}
            </Typography>
          )}
        </Paper>
      ))}
      <Button variant="outlined" onClick={() => navigate("/home")}>Back</Button>
    </Container>
  );
}
