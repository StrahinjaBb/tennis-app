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
    borderRadius: '12px',
    border: 'none',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
    padding: '24px',
    background: 'white',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    backdropFilter: 'blur(3px)',
  }
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
    if (user?.roleType !== 'USER' && user?.roleType !== 'ADMIN') {
      return;
    }

    if (!isSlotAvailable(slotInfo.start, slotInfo.end)) {
      toast.error('This time slot is already booked');
      return;
    }
    setSelectedSlot(slotInfo);
    setSelectedEvent(null);
    setModalIsOpen(true);
  }, [isSlotAvailable, user]);

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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => navigateWeek('prev')} 
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
          >
            &lt; Prethodno
          </button>
          <button 
            onClick={goToToday} 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            Danas
          </button>
          <button 
            onClick={() => navigateWeek('next')} 
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
          >
            Dalje &gt;
          </button>
        </div>
        <h2 className="text-xl font-bold text-gray-800">
          {moment(toolbar.date).tz("Europe/Belgrade").format('MMMM YYYY')}
        </h2>
      </div>
    );
  };

  const EventComponent = ({ event }) => (
    <div className="p-2 bg-blue-600 text-white rounded-lg shadow-sm">
      <div className="font-medium">
        {event.user.firstName} {event.user.lastName}
      </div>
      <div className="text-xs">
        {moment(event.start).tz("Europe/Belgrade").format('H:mm')} - {moment(event.end).tz("Europe/Belgrade").format('H:mm')}
      </div>
    </div>
  );

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Raspored termina</h1>
          <p className="text-gray-600">Zakažite termine</p>
        </div>

        {/* Calendar Container */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: '70vh' }}
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
            eventPropGetter={(event) => ({
              style: {
                backgroundColor: '#2563EB',
                borderColor: '#1D4ED8',
                color: '#FFFFFF',
              },
            })}
          />
        </div>
      </div>

      {/* Appointment Details Modal */}
      {selectedEvent && (
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={() => setModalIsOpen(false)}
          style={customStyles}
          contentLabel="Appointment Details"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Appointment Details</h2>
          <div className="mb-6 bg-blue-50 p-4 rounded-lg border border-blue-100">
            <div className="font-medium text-blue-800 mb-2">
              With: {selectedEvent.user.firstName} {selectedEvent.user.lastName}
            </div>
            <div className="text-gray-700">
              <div>{moment(selectedEvent.start).tz("Europe/Belgrade").format('MMMM Do YYYY')}</div>
              <div>
                {moment(selectedEvent.start).tz("Europe/Belgrade").format('H:mm')} - {moment(selectedEvent.end).tz("Europe/Belgrade").format('H:mm')}
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            {((user && selectedEvent.user.id === user.id) || user?.roleType === 'ADMIN') && (
              <button
                onClick={onDeleteAppointment}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm"
              >
                Cancel Booking
              </button>
            )}
            <button
              onClick={() => setModalIsOpen(false)}
              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
            >
              Close
            </button>
          </div>
        </Modal>
      )}

      {/* Create Appointment Modal */}
      {selectedSlot && (
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={() => setModalIsOpen(false)}
          style={customStyles}
          contentLabel="Create Appointment"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Book Court Time</h2>
          <form onSubmit={handleSubmit(onCreateAppointment)}>
            <div className="mb-6 bg-blue-50 p-4 rounded-lg border border-blue-100">
              <label className="block text-sm font-medium text-blue-800 mb-1">Date & Time</label>
              <div className="text-gray-700">
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

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setModalIsOpen(false)}
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
              >
                Confirm Booking
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default AppointmentsPage;