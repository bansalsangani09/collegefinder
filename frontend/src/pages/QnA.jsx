import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Plus, Send, User, Trash2, Pencil, X } from 'lucide-react';
import { getQuestions, askQuestion, answerQuestion, deleteQuestion, updateQuestion } from '../api';
import { useAuth } from '../context/AuthContext';
import { Loader } from '../components/Loader';
import toast from 'react-hot-toast';

export default function QnA() {
  const { user, isAuthenticated } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showAskForm, setShowAskForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const [answeringId, setAnsweringId] = useState(null);
  const [answerText, setAnswerText] = useState('');

  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const res = await getQuestions();
      setQuestions(res.data.data);
    } catch (err) {
      toast.error('Failed to load questions.');
    } finally {
      setLoading(false);
    }
  };

  const handleAsk = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) return toast.error('Please login to ask a question.');
    if (!newTitle.trim() || !newDesc.trim()) return toast.error('Fill all fields.');

    try {
      const res = await askQuestion({ title: newTitle, description: newDesc });
      setQuestions([res.data.data, ...questions]);
      setNewTitle('');
      setNewDesc('');
      setShowAskForm(false);
      toast.success('Question posted!');
    } catch (err) {
      toast.error('Failed to post question.');
    }
  };

  const handleAnswer = async (e, id) => {
    e.preventDefault();
    if (!isAuthenticated) return toast.error('Please login to answer.');
    if (!answerText.trim()) return toast.error('Enter an answer.');

    try {
      const res = await answerQuestion(id, { text: answerText });
      setQuestions(questions.map((q) => (q._id === id ? res.data.data : q)));
      setAnsweringId(null);
      setAnswerText('');
      toast.success('Answer posted!');
    } catch (err) {
      toast.error('Failed to post answer.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this question?')) return;
    try {
      await deleteQuestion(id);
      setQuestions(questions.filter((q) => q._id !== id));
      toast.success('Question deleted.');
    } catch (err) {
      toast.error('Failed to delete question.');
    }
  };

  const handleUpdate = async (e, id) => {
    e.preventDefault();
    if (!editTitle.trim() || !editDesc.trim()) return toast.error('Fill all fields.');
    try {
      const res = await updateQuestion(id, { title: editTitle, description: editDesc });
      setQuestions(questions.map((q) => (q._id === id ? res.data.data : q)));
      setEditingId(null);
      toast.success('Question updated!');
    } catch (err) {
      toast.error('Failed to update question.');
    }
  };

  if (loading) return <Loader text="Loading discussions..." />;

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
              <MessageSquare size={32} />
            </div>
            <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Community Q&A</h1>
              <p className="text-slate-500 font-bold">Ask questions and help fellow students.</p>
            </div>
          </div>
          <button
            onClick={() => {
              if (!isAuthenticated) return toast.error('Please login to ask a question.');
              setShowAskForm(!showAskForm);
            }}
            className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-black uppercase tracking-widest text-sm hover:bg-indigo-700 transition-all flex items-center gap-2"
          >
            {showAskForm ? 'Cancel' : <><Plus size={18} /> Ask Question</>}
          </button>
        </div>

        {showAskForm && (
          <motion.form
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleAsk}
            className="bg-white p-6 rounded-2xl shadow-xl border border-slate-200 mb-10"
          >
            <div className="mb-4">
              <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Title</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="What is your question?"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div className="mb-6">
              <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Description</label>
              <textarea
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="Provide more details..."
                rows={4}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
              />
            </div>
            <button type="submit" className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-black uppercase tracking-widest text-sm hover:bg-indigo-700 transition-all">
              Post Question
            </button>
          </motion.form>
        )}

        <div className="space-y-6">
          {questions.length === 0 ? (
            <div className="text-center py-20 text-slate-500 font-bold">No questions asked yet. Be the first!</div>
          ) : (
            questions.map((q) => (
              <motion.div key={q._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-200 flex flex-col gap-6">
                <div>
                  {editingId === q._id ? (
                    <form onSubmit={(e) => handleUpdate(e, q._id)} className="space-y-4 mb-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                      <textarea
                        value={editDesc}
                        onChange={(e) => setEditDesc(e.target.value)}
                        rows={3}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                      />
                      <div className="flex gap-2">
                        <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-lg text-xs font-black uppercase tracking-widest">Save</button>
                        <button type="button" onClick={() => setEditingId(null)} className="px-4 py-2 bg-slate-200 text-slate-600 rounded-lg text-xs font-black uppercase tracking-widest">Cancel</button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-black text-slate-900">{q.title}</h3>
                        {(user?.id === q.authorId || user?.role === 'admin') && (
                          <div className="flex gap-1">
                            <button
                              onClick={() => {
                                setEditingId(q._id);
                                setEditTitle(q.title);
                                setEditDesc(q.description);
                              }}
                              className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"
                              title="Edit Question"
                            >
                              <Pencil size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(q._id)}
                              className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                              title="Delete Question"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        )}
                      </div>
                      <p className="text-slate-600 mb-4">{q.description}</p>
                    </>
                  )}
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                    <User size={14} /> {q.authorName} • {new Date(q.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <div className="pl-4 md:pl-8 border-l-2 border-indigo-100 flex flex-col gap-4">
                  <h4 className="text-xs font-black uppercase tracking-widest text-indigo-500">Answers ({q.answers.length})</h4>
                  {q.answers.map((ans, i) => (
                    <div key={i} className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <p className="text-slate-700 mb-2">{ans.text}</p>
                      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        <User size={12} /> {ans.authorName} • {new Date(ans.date).toLocaleDateString()}
                      </div>
                    </div>
                  ))}

                  {answeringId === q._id ? (
                    <form onSubmit={(e) => handleAnswer(e, q._id)} className="mt-2 flex gap-3">
                      <input
                        type="text"
                        value={answerText}
                        onChange={(e) => setAnswerText(e.target.value)}
                        placeholder="Write your answer..."
                        className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                      <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all flex items-center justify-center">
                        <Send size={16} />
                      </button>
                    </form>
                  ) : (
                    <button
                      onClick={() => {
                        if (!isAuthenticated) return toast.error('Please login to answer.');
                        setAnsweringId(q._id);
                      }}
                      className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-indigo-600 self-start transition-colors"
                    >
                      Write an answer...
                    </button>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
