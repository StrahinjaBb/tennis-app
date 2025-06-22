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

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 max-w-md">
        <p className="font-medium">Error loading players</p>
        <p>{error}</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Players Ranking</h1>
          <p className="text-gray-600">View player statistics by league</p>
        </div>

        {/* League Selector */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="w-full sm:w-auto">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select League
              </label>
              <select
                value={selectedLeague}
                onChange={handleLeagueChange}
                className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-all"
              >
                <option value="A">League A</option>
                <option value="B">League B</option>
              </select>
            </div>
            <div className="w-full sm:w-auto">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
                <p className="text-xs text-blue-600 font-medium">TOTAL PLAYERS</p>
                <p className="text-2xl font-bold text-blue-700">{players.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Players Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-blue-600">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Rank
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Player
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Points
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Matches
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    League
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {players.length > 0 ? (
                  players.map((player, index) => (
                    <tr key={player.id} className="hover:bg-blue-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{index + 1}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-medium">
                              {player.firstName.charAt(0)}{player.lastName.charAt(0)}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {player.firstName} {player.lastName}
                            </div>
                            <div className="text-sm text-gray-500">
                              @{player.username}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 font-bold">{player.points || 0}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 font-bold">{player.matches || 0}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          player.league === 'A' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-purple-100 text-purple-800'
                        }`}>
                          {player.league || '-'}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                      No players found in this league
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Stats Summary */}
        {players.length > 0 && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-sm font-medium text-gray-500">Top Player</p>
              <p className="text-xl font-bold text-gray-900">
                {players[0].firstName} {players[0].lastName}
              </p>
              <p className="text-sm text-gray-500">{players[0].points} points</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-sm font-medium text-gray-500">Most Matches</p>
              <p className="text-xl font-bold text-gray-900">
                {players.reduce((prev, current) => (prev.matches > current.matches) ? prev : current).firstName}
              </p>
              <p className="text-sm text-gray-500">
                {players.reduce((prev, current) => (prev.matches > current.matches) ? prev : current).matches} matches
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-sm font-medium text-gray-500">Active Players</p>
              <p className="text-xl font-bold text-gray-900">
                {players.filter(p => p.userStatus === 'ACTIVE').length}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayersList;