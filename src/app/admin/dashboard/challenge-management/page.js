"use client"

import { useState, useEffect, useRef } from 'react';
import { toast, Toaster } from 'react-hot-toast';



export default function AdminDashboard() {
  const [challenges, setChallenges] = useState([]);
  const [showChallengeForm, setShowChallengeForm] = useState(false);
  const [challengeTitle, setChallengeTitle] = useState("");
  const [targetType, setTargetType] = useState("user");
  const [targetName, setTargetName] = useState("");
  const [stepsEnabled, setStepsEnabled] = useState(false);
  const [squatsEnabled, setSquatsEnabled] = useState(false);
  const [pushupsEnabled, setPushupsEnabled] = useState(false);
  const [stepsTarget, setStepsTarget] = useState("");
  const [squatsTarget, setSquatsTarget] = useState("");
  const [pushupsTarget, setPushupsTarget] = useState("");
  const [deadline, setDeadline] = useState("");
  const [winBonus, setWinBonus] = useState("");
  const [teams, setTeams] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const challengeFormRef = useRef(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deadLine, setDeadLine] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [editValues, setEditValues] = useState({});
  const [heads, setHeads] = useState([]);
  useEffect(() => {
    fetch('/api/challenges')
      .then(res => res.json())
      .then(data => {
        console.log(data);
          setChallenges(data);
        
      });
  }, [showChallengeForm]);
  
  useEffect(() => {
    // Fetch teams for dropdown if needed
    fetch('/api/admin/users')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const allTeams = Array.from(new Set(data.users.map(u => u.team).filter(Boolean)));
          setTeams(allTeams);
        }
      });
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      const data = await response.json();
      if (data.success) {
        setUsers(data.users);
      } else {
        toast.error('Failed to fetch user data');
      }
    } catch (error) {
      toast.error('Error fetching users');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading admin dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      
      

      <div className="max-w-7xl mx-auto p-6 relative " style={{ color: "black", display: "block" }}>
        {/* Existing Challenges Section */}
        <div className="mb-8">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 className="text-2xl font-bold mb-4">Existing Challenges</h2>
            <button
              className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow font-bold mb-6"
              onClick={() => setShowChallengeForm(true)}
            >
              Add Challenge
          </button></div>
          {challenges.length === 0 ? (
            <div className="text-gray-500">No challenges found.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-1 gap-6" >
              {challenges.map((challenge, idx) => (
                <div key={idx} className="bg-white rounded-lg shadow p-4"style={{width:'fill'}}>
                  <h3 className="text-lg font-bold mb-2">{challenge.title}</h3>
                  <div className="mb-1"><span className="font-semibold">Target:</span> {challenge.type} - {challenge.name}</div>
                  {challenge.steps && <div><span className="font-semibold">Steps:</span> {challenge.steps}</div>}
                  {challenge.squats && <div><span className="font-semibold">Squats:</span> {challenge.squats}</div>}
                  {challenge.pushups && <div><span className="font-semibold">Pushups:</span> {challenge.pushups}</div>}
                  <div><span className="font-semibold">Win Bonus:</span> {challenge.winbonus}</div>
                  <div><span className="font-semibold">Deadline:</span> {challenge.deadline}</div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {showChallengeForm && (
          <div
            className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
            onClick={e => {
              if (e.target === e.currentTarget) setShowChallengeForm(false);
            }}
          >
            <div ref={challengeFormRef} className="bg-white rounded-xl shadow-xl p-8 w-full max-w-lg relative">
              <h2 className="text-xl font-bold mb-4">Add Challenge</h2>
              <form
                onSubmit={async e => {
                  e.preventDefault();
                  console.log(typeof(targetName),targetName);
                  if (targetType === 'user') {
                    if (!challengeTitle || !targetName  || !deadline) {
                      toast.error('Please fill all required fields');
                      return;
                    }
                  }
                  else if (targetType === 'team') {
                    if (!challengeTitle || !deadline) {
                      toast.error('Please fill all required fields');
                      return;
                    }
                  }
                  const payload = {
                    title: challengeTitle,
                    type: targetType,
                    name: (targetType === 'all_users' || targetType === 'all_teams') ? 'all' : targetName,
                    steps: stepsEnabled ? stepsTarget : null,
                    squats: squatsEnabled ? squatsTarget : null,
                    pushups: pushupsEnabled ? pushupsTarget : null,
                    winbonus: winBonus,
                    deadline,
                  };
                  const res = await fetch('/api/challenges', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                  });
                  console.log(res);
                  if (res.ok) {
                    toast.success('Challenge added!');
                    setChallengeTitle("");
                    setTargetType("user");
                    setTargetName("");
                    setStepsEnabled(false);
                    setSquatsEnabled(false);
                    setPushupsEnabled(false);
                    setStepsTarget("");
                    setSquatsTarget("");
                    setPushupsTarget("");
                    setDeadline("");
                    setWinBonus("");
                    setSearchTerm("");
                    setShowChallengeForm(false);
                  } else {
                    toast.error('Failed to add challenge');
                  }
                }}
              >
                <input
                  type="text"
                  className="w-full mb-3 p-2 border rounded"
                  placeholder="Challenge Title"
                  value={challengeTitle}
                  onChange={e => setChallengeTitle(e.target.value)}
                  required
                />
                <div className="mb-3">
                  <label className="mr-2 font-semibold">Target:</label>
                  <select
                    value={targetType}
                    onChange={e => setTargetType(e.target.value)}
                    className="p-2 border rounded"
                  >
                    <option value="user">User</option>
                    <option value="team">Team</option>
                    <option value="all_users">All Users</option>
                    <option value="all_teams">All Teams</option>
                  </select>
                </div>
                <div className="mb-3">
                  {!(targetType === 'all_users' || targetType === 'all_teams') && (
                <>
                  <label className="mr-2 font-semibold">{targetType === 'user' ? 'User' : 'Team'}:</label>
                  <input
                    type="text"
                    className="p-2 border rounded w-full mb-2"
                    placeholder={`Search ${targetType}s...`}
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                  />
                  <select
                    value={targetName}
                    onChange={e => setTargetName(e.target.value)}
                    className="p-2 border rounded w-full"
                  >
                    <option value="">select name</option>
                    {(targetType === 'user'
                      ? users.filter(u => u.username.toLowerCase().includes(searchTerm.toLowerCase()))
                      : teams.filter(t => t.toLowerCase().includes(searchTerm.toLowerCase()))
                    ).map((item, idx) => (
                      <option key={idx} value={targetType === 'user' ? item.username : item}>
                        {targetType === 'user' ? item.username : item}
                      </option>
                    ))}
                  </select>
                </>
              )}
                </div>
                <div className="mb-3 flex gap-4">
                  <label className="font-semibold">Enable:</label>
                  <label><input type="checkbox" checked={stepsEnabled} onChange={e => setStepsEnabled(e.target.checked)} /> Steps</label>
                  <label><input type="checkbox" checked={squatsEnabled} onChange={e => setSquatsEnabled(e.target.checked)} /> Squats</label>
                  <label><input type="checkbox" checked={pushupsEnabled} onChange={e => setPushupsEnabled(e.target.checked)} /> Pushups</label>
                </div>
                {stepsEnabled && (
                  <input
                    type="number"
                    className="w-full mb-3 p-2 border rounded"
                    placeholder="Steps Target"
                    value={stepsTarget}
                    onChange={e => setStepsTarget(e.target.value)}
                  />
                )}
                {squatsEnabled && (
                  <input
                    type="number"
                    className="w-full mb-3 p-2 border rounded"
                    placeholder="Squats Target"
                    value={squatsTarget}
                    onChange={e => setSquatsTarget(e.target.value)}
                  />
                )}
                {pushupsEnabled && (
                  <input
                    type="number"
                    className="w-full mb-3 p-2 border rounded"
                    placeholder="Pushups Target"
                    value={pushupsTarget}
                    onChange={e => setPushupsTarget(e.target.value)}
                  />
                )}
                <input
                  type="number"
                  className="w-full mb-3 p-2 border rounded"
                  placeholder="Win Bonus"
                  value={winBonus}
                  onChange={e => setWinBonus(e.target.value)}
                />
                <input
                  type="date"
                  className="w-full mb-3 p-2 border rounded"
                  value={deadline}
                  onChange={e => setDeadline(e.target.value)}
                  required
                />
                <div className="flex gap-4 mt-4">
                  <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded-lg font-bold">Submit</button>
                  <button type="button" className="bg-gray-300 px-6 py-2 rounded-lg font-bold" onClick={() => setShowChallengeForm(false)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}