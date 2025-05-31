// src/pages/PlayersList.jsx
import { useState, useEffect } from 'react';
import { getLeaguePlayers } from '../api/userApi';

const PlayersList = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedLeague, setSelectedLeague] = useState('A');
  const [error, setError] = useState(null);

  const fetchPlayers = async (league) => {
    try {
      setLoading(true);
      setError(null);
      
      // Ispravka: getLeaguePlayers već vraća podatke direktno
      const playersData = await getLeaguePlayers(league);
      setPlayers(playersData);
    } catch (err) {
      setError(err.message || 'Failed to load players');
      console.error('Error fetching players:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlayers(selectedLeague);
  }, [selectedLeague]);

  const handleLeagueChange = (e) => {
    setSelectedLeague(e.target.value);
  };

  if (loading) return <div className="p-4">Loading players...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Players List</h1>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select League:
        </label>
        <select
          value={selectedLeague}
          onChange={handleLeagueChange}
          className="border rounded px-3 py-2 w-40"
        >
          <option value="A">League A</option>
          <option value="B">League B</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-3 px-4 border">Rank</th>
              <th className="py-3 px-4 border">Name</th>
              <th className="py-3 px-4 border">Points</th>
            </tr>
          </thead>
          <tbody>
            {players && players.length > 0 ? (
              players.map((player, index) => (
                <tr key={player.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border">{index + 1}</td>
                  <td className="py-2 px-4 border">
                    {player.firstName} {player.lastName}
                  </td>
                  <td className="py-2 px-4 border">{player.points || 0}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="py-4 px-4 border text-center">
                  No players found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PlayersList;