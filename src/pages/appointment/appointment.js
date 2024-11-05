import React, { useState, useEffect } from 'react';
import { Button, Box, Grid, Typography, Card, CardContent, Alert, CircularProgress, Grid2 } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const AppointmentPage = () => {
  const navigate = useNavigate();

  // States to store doctor data, appointment slots, errors, and loading states
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch doctors on page load
  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      try {
        // Replace with actual API call
        const response = await fetch('http://localhost:8080/api/doctor');
        const data = await response.json();
        setDoctors(data);
      } catch (err) {
        setError('Failed to load doctors');
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  // Fetch appointments for a selected doctor
  const fetchAppointments = async (doctorId) => {
    setLoading(true);
    setSelectedDoctor(doctorId);
    try {
      // Replace with actual API call
      const response = await fetch(`http://localhost:8080/api/appointment/doctor/${doctorId}`);
      const data = await response.json();
      setAppointments(data);
    } catch (err) {
      setError('Failed to load appointment slots');
    } finally {
      setLoading(false);
    }
  };

  // Handle booking an appointment
  const handleBookAppointment = async (slot) => {
    setLoading(true);
    slot.status = "N";
    try {
      const response = await fetch('http://localhost:8080/api/appointment/'+slot.id, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(slot),
      });
      const data = await response.json();

      if (response.ok) {
        alert('Appointment booked successfully');
        navigate('/appointments');
      } else {
        setError(data.message || 'Failed to book appointment');
      }
    } catch (err) {
      setError('Failed to book appointment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        View & Book Appointments
      </Typography>

      {/* Display loading indicator */}
      {loading && <CircularProgress />}

      {/* Show error if any */}
      {error && <Alert severity="error">{error}</Alert>}

      {/* Show doctors */}
      {!loading && !error && (
        <Grid container spacing={3}>
          {doctors.map((doctor) => (
            <Grid item xs={12} sm={6} md={4} key={doctor.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{doctor.name}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {doctor.specialization}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Contact: {doctor.city} {doctor.state}
                  </Typography>
                  <Button
                    variant="contained"
                    sx={{ mt: 2 }}
                    onClick={() => fetchAppointments(doctor.id)}
                  >
                    View Available Slots
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Show available appointment slots for the selected doctor */}
      {appointments.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5">Available Slots</Typography>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            {appointments.map((slot) => (
              <Grid2 item xs={12} sm={6} md={4} key={slot.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">{new Date(slot.date).toLocaleDateString()}</Typography>
                    <Typography variant="h6">{slot.slot}</Typography>
                    {slot.status === 'Y' ? (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleBookAppointment(slot)}
                      >
                        Book Appointment
                      </Button>
                    ) : (
                      <Typography variant="body2" color="textSecondary">
                        Already Booked
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid2>
            ))}
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default AppointmentPage;
