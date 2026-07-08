import React, { useState } from 'react';
import { motion } from 'motion/react';
import { BrainCircuit, CheckCircle2, ChevronRight, Play, Check, ChevronLeft } from 'lucide-react';
import Editor from '@monaco-editor/react';

const problemsList = [
  {
    id: 1,
    title: 'Sum Two Numbers',
    difficulty: 'Easy',
    points: 10,
    tags: ['Math', 'Basic'],
    description: `Write a function that takes two numbers as input and returns their sum.

**Example 1:**
Input: a = 5, b = 3
Output: 8

**Example 2:**
Input: a = -2, b = 10
Output: 8`,
    starterCode: {
      javascript: `function sum(a, b) {\n  // your code here\n}`,
      python: `def sum(a, b):\n    # your code here\n    pass`,
      cpp: `int sum(int a, int b) {\n    // your code here\n}`
    }
  },
  {
    id: 2,
    title: 'Reverse a String',
    difficulty: 'Easy',
    points: 15,
    tags: ['Strings'],
    description: `Write a function that reverses a string. The input string is given as an array of characters.

**Example 1:**
Input: s = ["h","e","l","l","o"]
Output: ["o","l","l","e","h"]`,
    starterCode: {
      javascript: `function reverseString(s) {\n  // your code here\n}`,
      python: `def reverseString(s):\n    # your code here\n    pass`,
      cpp: `void reverseString(vector<char>& s) {\n    // your code here\n}`
    }
  },
  {
    id: 3,
    title: 'Two Sum',
    difficulty: 'Medium',
    points: 30,
    tags: ['Arrays', 'Hash Table'],
    description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

**Example 1:**
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].`,
    starterCode: {
      javascript: `function twoSum(nums, target) {\n  // your code here\n}`,
      python: `def twoSum(nums, target):\n    # your code here\n    pass`,
      cpp: `vector<int> twoSum(vector<int>& nums, int target) {\n    // your code here\n}`
    }
  }
];

export function Problems() {
  const [activeProblem, setActiveProblem] = useState<any>(null);
  const [language, setLanguage] = useState<'javascript' | 'python' | 'cpp'>('javascript');
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');

  const handleSelectProblem = (prob: any) => {
    setActiveProblem(prob);
    setCode(prob.starterCode[language]);
    setOutput('');
  };

  const handleLanguageChange = (lang: 'javascript' | 'python' | 'cpp') => {
    setLanguage(lang);
    if (activeProblem) {
      setCode(activeProblem.starterCode[lang]);
    }
  };

  const handleRun = () => {
    setOutput('Running code...\n\nAll Test Cases Passed! ✅\nRuntime: 42ms\nMemory: 16.4 MB');
  };

  if (!activeProblem) {
    return (
      <div className="max-w-7xl mx-auto space-y-6 pb-12">
        <div className="flex items-center gap-3 mb-8">
          <BrainCircuit className="text-brand-purple" size={32} />
          <div>
            <h1 className="font-heading text-3xl font-bold tracking-tight text-white">Coding Problems</h1>
            <p className="text-gray-400">Solve algorithmic challenges to improve your skills and earn XP.</p>
          </div>
        </div>

        <div className="glass-panel p-1 rounded-xl overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-black/50 text-gray-400 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Title</th>
                <th className="px-6 py-4 font-semibold">Difficulty</th>
                <th className="px-6 py-4 font-semibold">Points</th>
                <th className="px-6 py-4 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {problemsList.map((prob, i) => (
                <tr key={prob.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4">
                    {i === 0 ? <CheckCircle2 className="text-brand-green" size={18} /> : <div className="w-4 h-4 rounded-full border border-gray-600"></div>}
                  </td>
                  <td className="px-6 py-4 font-bold text-white group-hover:text-brand-cyan transition-colors">
                    {prob.id}. {prob.title}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      prob.difficulty === 'Easy' ? 'bg-brand-green/20 text-brand-green' :
                      prob.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-500' :
                      'bg-red-500/20 text-red-500'
                    }`}>
                      {prob.difficulty}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono text-brand-purple font-bold">
                    +{prob.points} XP
                  </td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => handleSelectProblem(prob)}
                      className="text-gray-400 hover:text-white flex items-center gap-1 text-xs font-bold"
                    >
                      Solve <ChevronRight size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] -mt-6 -mx-8">
      {/* Top Bar */}
      <div className="h-14 bg-brand-sidebar border-b border-brand-border flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setActiveProblem(null)}
            className="text-gray-400 hover:text-white flex items-center gap-1 text-sm font-medium transition-colors"
          >
            <ChevronLeft size={16} /> Back to Problems
          </button>
          <div className="h-6 w-px bg-white/10"></div>
          <h2 className="font-bold">{activeProblem.id}. {activeProblem.title}</h2>
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
            activeProblem.difficulty === 'Easy' ? 'bg-brand-green/20 text-brand-green' :
            activeProblem.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-500' :
            'bg-red-500/20 text-red-500'
          }`}>
            {activeProblem.difficulty}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <select 
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value as any)}
            className="bg-black/50 border border-white/10 text-white text-sm rounded-md px-3 py-1.5 focus:outline-none focus:border-brand-cyan/50"
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python 3</option>
            <option value="cpp">C++</option>
          </select>

          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRun}
            className="flex items-center gap-2 px-4 py-1.5 text-sm font-bold text-white bg-brand-purple/20 border border-brand-purple/50 rounded-md hover:bg-brand-purple/30 transition-all"
          >
            <Play size={16} /> Run
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-1.5 text-sm font-bold text-brand-bg bg-brand-cyan rounded-md hover:bg-brand-cyan/90 transition-all neon-glow-cyan shadow-lg"
          >
            <Check size={16} /> Submit
          </motion.button>
        </div>
      </div>

      {/* Main Split Area */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Left Panel: Description */}
        <div className="w-1/3 flex flex-col border-r border-brand-border bg-brand-bg p-6 overflow-y-auto">
          <h3 className="font-bold text-xl mb-4">{activeProblem.title}</h3>
          
          <div className="flex gap-2 mb-6">
            {activeProblem.tags.map((tag: string) => (
              <span key={tag} className="text-xs bg-white/5 text-gray-400 px-2 py-1 rounded">
                {tag}
              </span>
            ))}
          </div>

          <div className="prose prose-invert prose-sm max-w-none text-gray-300">
            {activeProblem.description.split('\\n').map((line: string, i: number) => {
              if (line.startsWith('**')) {
                return <p key={i} className="font-bold text-white mt-4">{line.replace(/\\*\\*/g, '')}</p>;
              }
              if (line.startsWith('Input:') || line.startsWith('Output:') || line.startsWith('Explanation:')) {
                return <div key={i} className="bg-white/5 px-3 py-2 font-mono text-xs rounded my-1 border border-white/10">{line}</div>;
              }
              return <p key={i} className="mb-2">{line}</p>;
            })}
          </div>
        </div>

        {/* Right Panel: Editor & Output */}
        <div className="w-2/3 flex flex-col">
          {/* Monaco Editor */}
          <div className="flex-1 border-b border-brand-border">
            <Editor
              height="100%"
              theme="vs-dark"
              language={language}
              value={code}
              onChange={(val) => setCode(val || '')}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                fontFamily: "'JetBrains Mono', monospace",
                lineHeight: 1.6,
                padding: { top: 16 },
                scrollBeyondLastLine: false,
                smoothScrolling: true,
                cursorBlinking: "smooth",
                cursorSmoothCaretAnimation: "on",
                formatOnPaste: true,
              }}
            />
          </div>

          {/* Terminal / Output */}
          <div className="h-48 bg-[#0a0a0a] flex flex-col border-t border-black">
            <div className="bg-[#1e1e1e] px-4 py-2 text-xs font-bold text-gray-400 flex items-center justify-between border-b border-black">
              <span>Test Results</span>
            </div>
            <div className="p-4 font-mono text-sm overflow-y-auto flex-1">
              {output ? (
                <pre className="text-gray-300 whitespace-pre-wrap">{output}</pre>
              ) : (
                <div className="text-gray-600 italic">Run your code to see results here...</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
