import { useState, useEffect, useCallback } from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment-timezone';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { getAppointments, createAppointment, deleteAppointment } from '../api/appointmentApi';
import { useForm } from 'react-hook-form';
import Modal from 'react-modal';
import { getUserById } from "../api/userApi";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

moment.tz.setDefault("Europe/Belgrade");
const localizer = momentLocalizer(moment);

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
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const { register, handleSubmit, reset } = useForm();
  const navigate = useNavigate();

  const isSlotAvailable = useCallback((start, end) => {
    return !events.some(event => {
      const eventStart = new Date(event.start);
      const eventEnd = new Date(event.end);
      return (
        (start >= eventStart && start < eventEnd) ||
        (end > eventStart && end <= eventEnd) ||
        (start <= eventStart && end >= eventEnd)
      );
    });
  }, [events]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const userData = await getUserById(userId);
        setUser(userData);
      } catch (error) {
        console.error("Greška pri dohvaćanju korisnika:", error);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  const fetchAppointments = useCallback(async () => {
    try {
      const response = await getAppointments();
      const formattedEvents = response.map(appointment => ({
        id: appointment.id,
        title: `${appointment.user.firstName} ${appointment.user.lastName}`,
        start: new Date(appointment.startTime),
        end: new Date(appointment.endTime),
        user: appointment.user,
      }));
      setEvents(formattedEvents);
    } catch (err) {
      toast.error('Failed to fetch appointments');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const navigateWeek = (direction) => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      if (direction === 'next') {
        newDate.setDate(newDate.getDate() + 7);
      } else {
        newDate.setDate(newDate.getDate() - 7);
      }
      return newDate;
    });
  };

  const handleSlotClick = useCallback((slotInfo) => {
    if (user.roleType !== 'USER' && user.roleType !== 'ADMIN') {
      return;
    }

    if (!isSlotAvailable(slotInfo.start, slotInfo.end)) {
      toast.error('This time slot is already booked');
      return;
    }
    setSelectedSlot(slotInfo);
    setSelectedEvent(null);
    setModalIsOpen(true);
  }, [isSlotAvailable]);

  const handleEventClick = useCallback((event) => {
    setSelectedEvent(event);
    setSelectedSlot(null);
    setModalIsOpen(true);
  }, []);

  const onCreateAppointment = async () => {
    try {
      if (!isSlotAvailable(selectedSlot.start, selectedSlot.end)) {
        toast.error('This time slot is no longer available');
        return;
      }

      const appointmentData = {
        startTime: moment(selectedSlot.start).tz("Europe/Belgrade").format('YYYY-MM-DDTHH:mm:ss'),
        endTime: moment(selectedSlot.end).tz("Europe/Belgrade").format('YYYY-MM-DDTHH:mm:ss'),
        user: user
      };

      await createAppointment(appointmentData);
      await fetchAppointments();
      setModalIsOpen(false);
      reset();
      toast.success('Appointment booked successfully!');
    } catch (err) {
      toast.error('Failed to create appointment');
    }
  };

  const onDeleteAppointment = async () => {
    try {
      await deleteAppointment(selectedEvent.id);
      setEvents(events.filter(e => e.id !== selectedEvent.id));
      setModalIsOpen(false);
      toast.success('Appointment cancelled successfully');
    } catch (err) {
      toast.error('Failed to cancel appointment');
    }
  };

  const CustomToolbar = (toolbar) => {
    const goToToday = () => {
      toolbar.onNavigate('TODAY');
      setCurrentDate(new Date());
    };

    return (
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-4">
          <button onClick={() => navigateWeek('prev')} className="px-3 py-1 border rounded hover:bg-gray-100">
            &lt; Previous Week
          </button>
          <button onClick={goToToday} className="px-3 py-1 border rounded hover:bg-gray-100">
            Today
          </button>
          <button onClick={() => navigateWeek('next')} className="px-3 py-1 border rounded hover:bg-gray-100">
            Next Week &gt;
          </button>
        </div>
        <span className="text-lg font-semibold">
          {moment(toolbar.date).tz("Europe/Belgrade").format('MMMM YYYY')}
        </span>
      </div>
    );
  };

  const EventComponent = ({ event }) => (
    <div className="p-1 font-semibold">
      {event.user.firstName} {event.user.lastName}
    </div>
  );

  if (loading) return <div className="p-4">Loading appointments...</div>;

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
          onSelectSlot={handleSlotClick}
          onSelectEvent={handleEventClick}
          defaultView={Views.WEEK}
          view={Views.WEEK}
          date={currentDate}
          onNavigate={setCurrentDate}
          min={new Date(0, 0, 0, 7, 0, 0)}
          max={new Date(0, 0, 0, 22, 0, 0)}
          components={{
            event: EventComponent,
            toolbar: CustomToolbar,
          }}
          step={30}
          timeslots={2}
        />
      </div>

      {selectedEvent && (
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={() => setModalIsOpen(false)}
          style={customStyles}
          contentLabel="Appointment Details"
        >
          <h2 className="text-xl font-bold mb-4">Appointment Details</h2>
          <div className="mb-4">
            <div className="border p-2 rounded">
              <div className="font-medium mb-2">
                With: {selectedEvent.user.firstName} {selectedEvent.user.lastName}
              </div>
              <div>
                <div>{moment(selectedEvent.start).tz("Europe/Belgrade").format('MMMM Do YYYY')}</div>
                <div>
                  {moment(selectedEvent.start).tz("Europe/Belgrade").format('H:mm')} - {moment(selectedEvent.end).tz("Europe/Belgrade").format('H:mm')}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            {((user && selectedEvent.user.id === user.id) || user.roleType === 'ADMIN') && (
              <button
                onClick={onDeleteAppointment}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete Appointment
              </button>
            )}
            <button
              onClick={() => setModalIsOpen(false)}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Close
            </button>
          </div>
        </Modal>
      )}

      {selectedSlot && (
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
                    <div>{moment(selectedSlot.start).tz("Europe/Belgrade").format('MMMM Do YYYY')}</div>
                    <div>
                      {moment(selectedSlot.start).tz("Europe/Belgrade").format('H:mm')} - {moment(selectedSlot.end).tz("Europe/Belgrade").format('H:mm')}
                    </div>
                  </>
                )}
              </div>
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
      )}
    </div>
  );
};

export default AppointmentsPage;
