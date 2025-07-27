import { useState, useEffect, useCallback } from 'react';
import moment from 'moment-timezone';
import { getAppointments, createAppointment, deleteAppointment } from '../api/appointmentApi';
import { useForm } from 'react-hook-form';
import Modal from 'react-modal';
import { getUserById } from "../api/userApi";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'moment/locale/sr';

moment.tz.setDefault("Europe/Belgrade");
moment.locale('sr');

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
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [currentDate, setCurrentDate] = useState(moment());
  const { register, handleSubmit, reset } = useForm();
  const navigate = useNavigate();

  // Generate days to display (3 days)
  const generateDays = () => {
    const days = [];
    const startDate = moment(currentDate).startOf('day');
    
    for (let i = 0; i < 3; i++) {
      days.push(moment(startDate).add(i, 'days'));
    }
    return days;
  };

  // Generate time slots for the day (8AM to 11PM)
  const generateTimeSlots = () => {
    const slots = [];
    const startTime = moment().startOf('day').hour(8); // 8 AM
    const endTime = moment().startOf('day').hour(23); // 11 PM
    
    let time = moment(startTime);
    while (time.isBefore(endTime)) {
      slots.push(moment(time));
      time.add(1, 'hour');
    }
    // Dodajemo poslednji termin 23:00-24:00
    slots.push(moment(endTime));
    return slots;
  };

  const isSlotAvailable = useCallback((time) => {
    return !appointments.some(app => {
      const appStart = moment(app.startTime);
      return appStart.isSame(time, 'hour');
    });
  }, [appointments]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const userData = await getUserById(userId);
        setUser(userData);
      } catch (error) {
        console.error("Greška pri dohvaćanju korisnika:", error);
        // navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  const fetchAppointments = useCallback(async () => {
    try {
      const response = await getAppointments();
      setAppointments(response);
    } catch (err) {
      toast.error('Greška pri učitavanju termina');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const navigateDays = (direction) => {
    setCurrentDate(prevDate => {
      const newDate = moment(prevDate);
      const today = moment();
      const twoWeeksLater = moment().add(14, 'days');
      const twoWeeksBefore = moment().subtract(14, 'days');

      if (direction === 'next') {
        // Proveri da li je unutar dozvoljenog opsega
        const testDate = moment(newDate).add(3, 'days');
        if (testDate.isAfter(twoWeeksLater)) {
          toast.info('Možete videti samo dve nedelje unapred');
          return newDate;
        }
        newDate.add(3, 'days');
      } else {
        // Proveri da li je unutar dozvoljenog opsega
        const testDate = moment(newDate).subtract(3, 'days');
        if (testDate.isBefore(twoWeeksBefore)) {
          toast.info('Možete videti samo dve nedelje unazad');
          return newDate;
        }
        newDate.subtract(3, 'days');
      }
      return newDate;
    });
  };

  const handleSlotClick = (time) => {
    if (user?.roleType !== 'USER' && user?.roleType !== 'ADMIN') {
      return;
    }

    if (!isSlotAvailable(time)) {
      toast.error('Ovaj termin je već rezervisan');
      return;
    }
    
    setSelectedSlot({
      startTime: moment(time),
      endTime: moment(time).add(1, 'hour')
    });
    setSelectedEvent(null);
    setModalIsOpen(true);
  };

  const handleEventClick = (appointment) => {
    setSelectedEvent(appointment);
    setSelectedSlot(null);
    setModalIsOpen(true);
  };

  const onCreateAppointment = async () => {
    try {
      if (!isSlotAvailable(selectedSlot.startTime)) {
        toast.error('Ovaj termin je više dostupan');
        return;
      }

      const appointmentData = {
        startTime: selectedSlot.startTime.format('YYYY-MM-DDTHH:mm:ss'),
        endTime: selectedSlot.endTime.format('YYYY-MM-DDTHH:mm:ss'),
        user: user
      };

      await createAppointment(appointmentData);
      await fetchAppointments();
      setModalIsOpen(false);
      reset();
      toast.success('Termin uspešno rezervisan!');
    } catch (err) {
      toast.error('Greška pri rezervaciji termina');
    }
  };

  const onDeleteAppointment = async () => {
    try {
      await deleteAppointment(selectedEvent.id);
      setAppointments(appointments.filter(a => a.id !== selectedEvent.id));
      setModalIsOpen(false);
      toast.success('Termin uspešno otkazan');
    } catch (err) {
      toast.error('Greška pri otkazivanju termina');
    }
  };

  const goToToday = () => {
    setCurrentDate(moment());
  };

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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Appointments calendar</h1>
          <p className="text-gray-600">Reserve your appointments</p>
        </div>

        {/* Controls */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex space-x-2">
            <button 
              onClick={() => navigateDays('prev')} 
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
            >
              &lt; Previous
            </button>
            <button 
              onClick={goToToday} 
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              Today
            </button>
            <button 
              onClick={() => navigateDays('next')} 
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
            >
              Next &gt;
            </button>
          </div>
          <h2 className="text-xl font-bold text-gray-800">
            {currentDate.format('MMMM YYYY')}
          </h2>
        </div>

        {/* Scheduler */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="grid grid-cols-3 gap-4">
            {generateDays().map(day => (
              <div key={day.format('YYYY-MM-DD')} className="border rounded-lg">
                <div className="bg-gray-50 p-3 border-b text-center font-medium">
                  {day.format('dddd, D. MMMM')}
                </div>
                <div className="p-2">
                  {generateTimeSlots().map(timeSlot => {
                    const slotTime = moment(day)
                      .hour(timeSlot.hour())
                      .minute(timeSlot.minute());
                    
                    const appointment = appointments.find(app => 
                      moment(app.startTime).isSame(slotTime, 'hour')
                    );

                    return (
                      <div
                        key={slotTime.format('HH:mm')}
                        className={`p-3 mb-2 rounded-lg cursor-pointer ${
                          appointment 
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                        onClick={() => 
                          appointment 
                            ? handleEventClick(appointment) 
                            : handleSlotClick(slotTime)
                        }
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-medium">
                            {slotTime.format('HH:mm')}
                          </span>
                          {appointment && (
                            <span>
                              {appointment.user.firstName} {appointment.user.lastName}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Appointment Details Modal */}
      {selectedEvent && (
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={() => setModalIsOpen(false)}
          style={customStyles}
          contentLabel="Detalji termina"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Detalji termina</h2>
          <div className="mb-6 bg-blue-50 p-4 rounded-lg border border-blue-100">
            <div className="font-medium text-blue-800 mb-2">
              Sa: {selectedEvent.user.firstName} {selectedEvent.user.lastName}
            </div>
            <div className="text-gray-700">
              <div>{moment(selectedEvent.startTime).format('D. MMMM YYYY')}</div>
              <div>
                {moment(selectedEvent.startTime).format('HH:mm')} - {moment(selectedEvent.endTime).format('HH:mm')}
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            {((user && selectedEvent.user.id === user.id) || user?.roleType === 'ADMIN') && (
              <button
                onClick={onDeleteAppointment}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm"
              >
                Otkaži termin
              </button>
            )}
            <button
              onClick={() => setModalIsOpen(false)}
              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
            >
              Zatvori
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
          contentLabel="Rezervacija termina"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Rezervacija terena</h2>
          <form onSubmit={handleSubmit(onCreateAppointment)}>
            <div className="mb-6 bg-blue-50 p-4 rounded-lg border border-blue-100">
              <label className="block text-sm font-medium text-blue-800 mb-1">Datum i vreme</label>
              <div className="text-gray-700">
                {selectedSlot && (
                  <>
                    <div>{selectedSlot.startTime.format('D. MMMM YYYY')}</div>
                    <div>
                      {selectedSlot.startTime.format('HH:mm')} - {selectedSlot.endTime.format('HH:mm')}
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
                Book appointment
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default AppointmentsPage;