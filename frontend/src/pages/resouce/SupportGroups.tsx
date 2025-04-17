import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const groups = [
  {
    id: 1,
    name: 'ADHD Allies - Virtual Meet',
    type: 'Virtual',
    focus: 'ADHD',
    description: 'Weekly Zoom calls with others experiencing ADHD. Share tips, support, and stories.',
    link: '#',
  },
  {
    id: 2,
    name: 'Dyslexia Peer Circle',
    type: 'Local',
    focus: 'Dyslexia',
    description: 'Local meetups and events for dyslexic individuals and families in your city.',
    link: '#',
  },
  {
    id: 3,
    name: 'Neurodivergent Voices Community',
    type: 'Virtual',
    focus: 'General',
    description: 'Online community for sharing and supporting all neurodivergent individuals.',
    link: '#',
  },
  {
    id: 4,
    name: 'Autism Spectrum Meetup',
    type: 'Local',
    focus: 'Autism',
    description: 'Friendly local meetups focused on connecting the autism community together.',
    link: '#',
  },
];

const filters = ['All', 'ADHD', 'Dyslexia', 'Autism', 'General'];

export default function SupportGroups() {
  const navigate = useNavigate();
  const [groupType, setGroupType] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [focusFilter, setFocusFilter] = useState('All');

  const filteredGroups = groups.filter((group) => {
    const matchesType = groupType === 'All' || group.type === groupType;
    const matchesFocus = focusFilter === 'All' || group.focus === focusFilter;
    const matchesSearch = group.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesFocus && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#10121c] to-[#1b1e2b] text-white p-6 md:p-12">
      <motion.button
        onClick={() => navigate("/resources")}
        className="flex items-center gap-2 text-purple-400 hover:text-purple-600 font-semibold mb-6"
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
      >
        <ArrowLeft size={20} />
        Back to Resources
      </motion.button>

      <motion.h1
        className="text-3xl md:text-4xl font-bold mb-4"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        Find Support Groups
      </motion.h1>

      <p className="text-gray-300 mb-6">Connect with others through local or virtual communities.</p>

      <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search groups..."
          className="w-full md:w-1/3 p-2 rounded-md bg-[#252a41] text-white border border-gray-600 focus:outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="flex gap-2">
          <button
            onClick={() => setGroupType('All')}
            className={`px-3 py-1 rounded-full text-sm ${groupType === 'All' ? 'bg-purple-500' : 'bg-gray-700 hover:bg-purple-500'}`}
          >
            All
          </button>
          <button
            onClick={() => setGroupType('Virtual')}
            className={`px-3 py-1 rounded-full text-sm ${groupType === 'Virtual' ? 'bg-purple-500' : 'bg-gray-700 hover:bg-purple-500'}`}
          >
            Virtual
          </button>
          <button
            onClick={() => setGroupType('Local')}
            className={`px-3 py-1 rounded-full text-sm ${groupType === 'Local' ? 'bg-purple-500' : 'bg-gray-700 hover:bg-purple-500'}`}
          >
            Local
          </button>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap mb-6">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setFocusFilter(filter)}
            className={`px-3 py-1 rounded-full text-sm ${focusFilter === filter ? 'bg-emerald-500' : 'bg-gray-700 hover:bg-emerald-500'}`}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredGroups.length > 0 ? (
          filteredGroups.map((group, idx) => (
            <motion.div
              key={group.id}
              className="bg-[#252a41] rounded-2xl p-5 shadow-lg border border-purple-900 hover:border-purple-500 transition-colors"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <h3 className="text-xl font-semibold mb-2 text-purple-300">{group.name}</h3>
              <p className="text-gray-400 mb-3">{group.description}</p>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>{group.type} • {group.focus}</span>
                <a href={group.link} className="text-purple-400 hover:text-purple-600 font-medium">
                  Join Forum →
                </a>
              </div>
            </motion.div>
          ))
        ) : (
          <p className="text-gray-400">No support groups found matching your search.</p>
        )}
      </div>
    </div>
  );
}
