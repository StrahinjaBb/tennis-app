import { useEffect, useState } from "react";
import { getUserById } from "../api/userApi";
import { useNavigate } from "react-router-dom";
import { getAppointments, createAppointment } from "../api/appointmentApi";
import {
  addWeeks,
  subWeeks,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  setHours,
  setMinutes,
  addMinutes,
  isEqual,
  isSameDay,
  isWithinInterval,
  parseISO,
} from "date-fns";

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [canReserve, setCanReserve] = useState(false);
  const [duration, setDuration] = useState(30);
  const navigate = useNavigate();

  const generateTimeSlots = (start, end, step) => {
    const [startHour, startMin] = start.split(":").map(Number);
    const [endHour, endMin] = end.split(":").map(Number);

    const slots = [];
    let current = setMinutes(setHours(new Date(), startHour), startMin);
    const endTime = setMinutes(setHours(new Date(), endHour), endMin);

    while (current < endTime) {
      slots.push(new Date(current));
      current = addMinutes(current, step);
    }

    return slots;
  };

  const timeSlots = generateTimeSlots("08:00", "22:00", 30);

  useEffect(() => {
    loadAppointments();
  }, [currentWeek]);

  const loadAppointments = async () => {
    try {
      const data = await getAppointments();
      setAppointments(data.map(a => ({
        ...a,
        startTime: parseISO(a.startTime),
        endTime: parseISO(a.endTime)
      })));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const userData = await getUserById(userId);
        setCanReserve(userData.roleType === "ADMIN" || userData.roleType === "USER");
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

  const handleCreateAppointment = async (day, time) => {
    if (!user || !canReserve) {
      alert("Nemate pravo da pravite rezervaciju.");
      return;
    }

    const startTime = setHours(setMinutes(new Date(day), time.getMinutes()), time.getHours());
    const endTime = addMinutes(startTime, duration);

    try {
      await createAppointment({
        user: { id: user.id },
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
      });

      alert(`Uspešno kreiran termin (${duration} minuta)!`);
      loadAppointments();
    } catch (error) {
      console.error("Greška pri kreiranju termina:", error);
      alert("Greška pri kreiranju termina.");
    }
  };

  const daysOfWeek = eachDayOfInterval({
    start: startOfWeek(currentWeek, { weekStartsOn: 1 }),
    end: endOfWeek(currentWeek, { weekStartsOn: 1 }),
  });

  if (loading) return <div className="p-4">Učitavanje...</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">Zdravo, {user.firstName}!</h1>
      <p className="text-lg mt-2">Uloga: {user.roleType}</p>

      <div className="flex items-center gap-4 mt-6 mb-4">
        <button onClick={() => setCurrentWeek(subWeeks(currentWeek, 1))} className="bg-gray-200 px-4 py-2 rounded">← Nazad</button>
        <span className="font-medium">
          {format(startOfWeek(currentWeek, { weekStartsOn: 1 }), "dd.MM.yyyy")} -{" "}
          {format(endOfWeek(currentWeek, { weekStartsOn: 1 }), "dd.MM.yyyy")}
        </span>
        <button onClick={() => setCurrentWeek(addWeeks(currentWeek, 1))} className="bg-gray-200 px-4 py-2 rounded">Napred →</button>
      </div>

      <div className="mb-4">
        <label className="mr-2 font-medium">Trajanje termina:</label>
        <select
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          className="border p-2 rounded"
        >
          <option value={30}>30 minuta</option>
          <option value={60}>60 minuta</option>
          <option value={90}>90 minuta</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="table-auto border border-gray-300 w-full">
          <thead>
            <tr>
              <th className="border p-2 w-24">Vreme</th>
              {daysOfWeek.map(day => (
                <th key={day.toISOString()} className="border p-2 text-center">
                  {format(day, "EEE dd.MM")}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timeSlots.map((slotTime) => (
              <tr key={slotTime.toISOString()}>
                <td className="border p-2 text-sm">{format(slotTime, "HH:mm")}</td>
                {daysOfWeek.map((day) => {
                  const slotStart = setHours(setMinutes(new Date(day), slotTime.getMinutes()), slotTime.getHours());
                  const slotEnd = addMinutes(slotStart, 30);

                  const appt = appointments.find(appt =>
                    isSameDay(appt.startTime, day) &&
                    isWithinInterval(slotStart, { start: appt.startTime, end: appt.endTime })
                  );

                  return (
                    <td
                      key={day.toISOString() + slotTime.toISOString()}
                      className={`border p-2 text-center cursor-pointer ${appt ? "bg-blue-200" : "hover:bg-green-100"}`}
                      onClick={() => !appt && handleCreateAppointment(day, slotTime)}
                    >
                      {appt ? `${format(appt.startTime, "HH:mm")} - ${format(appt.endTime, "HH:mm")}` : ""}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
