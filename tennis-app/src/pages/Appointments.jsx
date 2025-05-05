// src/pages/AppointmentsPage.jsx
import { useState, useEffect, useCallback } from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { getAppointments, createAppointment, deleteAppointment } from '../api/appointmentApi';
import { useForm } from 'react-hook-form';
import Modal from 'react-modal';

// Set up moment localizer
const localizer = momentLocalizer(moment);

// Modal styles
const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '400px',
    maxWidth: '90%',
  },
};

Modal.setAppElement('#root');

const AppointmentsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const { register, handleSubmit, reset } = useForm();

  // Fetch appointments
  const fetchAppointments = useCallback(async () => {
    try {
      const response = await getAppointments();
      const formattedEvents = response.map(appointment => ({
        id: appointment.id,
        title: `Appointment with ${appointment.user.firstName} ${appointment.user.lastName}`,
        start: new Date(appointment.startTime),
        end: new Date(appointment.endTime),
        user: appointment.user,
      }));
      setEvents(formattedEvents);
    } catch (err) {
      setError('Failed to fetch appointments');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  // Handle slot selection
  const handleSelectSlot = useCallback((slotInfo) => {
    setSelectedSlot(slotInfo);
    setModalIsOpen(true);
  }, []);

  // Handle appointment creation
  const onCreateAppointment = async (data) => {
    try {
      const appointmentData = {
        startTime: selectedSlot.start.toISOString(),
        endTime: selectedSlot.end.toISOString(),
        notes: data.notes,
      };
      await createAppointment(appointmentData);
      await fetchAppointments();
      setModalIsOpen(false);
      reset();
    } catch (err) {
      setError('Failed to create appointment');
    }
  };

  // Handle appointment deletion
  const onDeleteAppointment = async (event) => {
    try {
      await deleteAppointment(event.id);
      setEvents(events.filter(e => e.id !== event.id));
    } catch (err) {
      setError('Failed to cancel appointment');
    }
  };

  // Event component customization
  const EventComponent = ({ event }) => (
    <div className="p-1">
      <div className="font-semibold">{event.title}</div>
      <div className="text-xs">
        {moment(event.start).format('h:mm A')} - {moment(event.end).format('h:mm A')}
      </div>
      <button 
        onClick={(e) => {
          e.stopPropagation();
          onDeleteAppointment(event);
        }}
        className="mt-1 text-xs text-red-500 hover:text-red-700"
      >
        Cancel
      </button>
    </div>
  );

  if (loading) return <div className="p-4">Loading appointments...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-4 h-screen flex flex-col">
      <h1 className="text-2xl font-bold mb-6">Tennis Court Schedule</h1>
      
      <div className="flex-grow">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%' }}
          selectable
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectSlot}
          defaultView={Views.WEEK}
          min={new Date(0, 0, 0, 8, 0, 0)} // 8 AM
          max={new Date(0, 0, 0, 20, 0, 0)} // 8 PM
          components={{
            event: EventComponent,
          }}
        />
      </div>

      {/* Appointment Creation Modal */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        style={customStyles}
        contentLabel="Create Appointment"
      >
        <h2 className="text-xl font-bold mb-4">Create New Appointment</h2>
        <form onSubmit={handleSubmit(onCreateAppointment)}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Date & Time</label>
            <div className="border p-2 rounded">
              {selectedSlot && (
                <>
                  <div>{moment(selectedSlot.start).format('MMMM Do YYYY')}</div>
                  <div>
                    {moment(selectedSlot.start).format('h:mm A')} - {moment(selectedSlot.end).format('h:mm A')}
                  </div>
                </>
              )}
            </div>
          </div>
          
          <div className="mb-4">
            <label htmlFor="notes" className="block text-gray-700 mb-2">
              Notes (Optional)
            </label>
            <textarea
              id="notes"
              {...register('notes')}
              className="w-full border rounded p-2"
              rows={3}
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setModalIsOpen(false)}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Book Appointment
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AppointmentsPage;