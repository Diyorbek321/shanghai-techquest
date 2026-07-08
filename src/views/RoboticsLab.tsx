import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Cpu, 
  Settings, 
  Play, 
  Square, 
  Terminal as TerminalIcon, 
  Radio, 
  Gauge, 
  Zap, 
  Activity,
  AlertTriangle,
  RefreshCcw,
  Eye,
  Info,
  Maximize2
} from 'lucide-react';
import { ViewType } from '../types';

export function RoboticsLab() {
  const [selectedBoard, setSelectedBoard] = useState<'arduino' | 'nodemcu'>('arduino');
  const [selectedLanguage, setSelectedLanguage] = useState<'cpp' | 'python' | 'javascript'>('cpp');
  const [connectedComponents, setConnectedComponents] = useState<string[]>(['Internal LED']);
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<{msg: string, type: 'info' | 'error' | 'success' | 'warn'}[]>([
    { msg: "Neural Link Established with Hardware Emulator", type: 'success' },
    { msg: "Select components and language to begin protocol design.", type: 'info' }
  ]);
  const [sensors, setSensors] = useState({ distance: 45, light: 12, voltage: 12.4 });
  
  const boilerplates = {
    cpp: "#include <Arduino.h>\n\nvoid setup() {\n  Serial.begin(9600);\n  pinMode(13, OUTPUT);\n}\n\nvoid loop() {\n  digitalWrite(13, HIGH);\n  delay(1000);\n  digitalWrite(13, LOW);\n  delay(1000);\n}",
    python: "import machine\nimport time\n\nled = machine.Pin(2, machine.Pin.OUT)\n\nwhile True:\n    led.on()\n    time.sleep(1)\n    led.off()\n    time.sleep(1)",
    javascript: "const { Board, Led } = require('johnny-five');\nconst board = new Board();\n\nboard.on('ready', () => {\n  const led = new Led(13);\n  led.blink(1000);\n});"
  };

  const [code, setCode] = useState(boilerplates.cpp);

  useEffect(() => {
    setCode(boilerplates[selectedLanguage]);
  }, [selectedLanguage]);

  const components = [
    { id: 'ultrasonic', name: 'Ultrasonic Sensor', icon: <Eye size={14} />, pins: 'VCC, GND, TRIG(9), ECHO(10)' },
    { id: 'pir', name: 'PIR Motion', icon: <Activity size={14} />, pins: 'VCC, GND, OUT(2)' },
    { id: 'led', name: 'RGB LED', icon: <Zap size={14} />, pins: 'R(3), G(5), B(6)' },
    { id: 'servo', name: 'Micro Servo', icon: <RefreshCcw size={14} />, pins: 'VCC, GND, PWM(11)' },
  ];

  const toggleComponent = (compId: string) => {
    if (connectedComponents.includes(compId)) {
      setConnectedComponents(prev => prev.filter(id => id !== compId));
      addLog(`Disconnected: ${compId}`, 'warn');
    } else {
      setConnectedComponents(prev => [...prev, compId]);
      addLog(`Connected ${compId} to Breadboard`, 'success');
    }
  };

  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  // Mock sensor fluctuation
  useEffect(() => {
    const interval = setInterval(() => {
      setSensors(prev => ({
        ...prev,
        distance: Math.max(0, Math.min(200, prev.distance + (Math.random() * 4 - 2))),
        light: Math.max(0, Math.min(100, prev.light + (Math.random() * 2 - 1))),
        voltage: Math.max(11, Math.min(12.6, prev.voltage - 0.001))
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const runSimulation = () => {
    setIsRunning(true);
    addLog("Compiling Logic...", "info");
    setTimeout(() => {
      addLog("Deployment Successful.", "success");
      addLog("Rover Executing Protocol: 'moveForward(50)'", "info");
    }, 1500);
  };

  const stopSimulation = () => {
    setIsRunning(false);
    addLog("Emergency Halt Triggered.", "warn");
  };

  const addLog = (msg: string, type: 'info' | 'error' | 'success' | 'warn') => {
    setLogs(prev => [...prev, { msg, type }]);
  };

  return (
    <div className="max-w-7xl mx-auto py-6 space-y-6">
      {/* Header with Board & Language Selector */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 glass-panel p-6 border border-white/10 rounded-2xl bg-black/40 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-brand-cyan/10 rounded-xl border border-brand-cyan/20">
              <Cpu size={32} className="text-brand-cyan" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-white italic tracking-tighter uppercase">Circuit Designer</h1>
                <span className="text-[10px] bg-brand-cyan/20 text-brand-cyan px-2 py-0.5 rounded border border-brand-cyan/30 font-mono">BETA</span>
              </div>
              <div className="flex gap-4 mt-2">
                <select 
                  value={selectedBoard}
                  onChange={(e) => setSelectedBoard(e.target.value as any)}
                  className="bg-black/40 border border-white/10 rounded px-2 py-1 text-[10px] text-gray-300 font-mono focus:border-brand-cyan outline-none"
                >
                  <option value="arduino">ARDUINO_UNO_R3</option>
                  <option value="nodemcu">ESP8266_NODEMCU</option>
                </select>
                <select 
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value as any)}
                  className="bg-black/40 border border-white/10 rounded px-2 py-1 text-[10px] text-brand-purple font-mono focus:border-brand-purple outline-none"
                >
                  <option value="cpp">C++ (Arduino)</option>
                  <option value="python">MicroPython</option>
                  <option value="javascript">JavaScript (J5)</option>
                </select>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            {!isRunning ? (
              <button onClick={runSimulation} className="flex items-center gap-2 px-6 py-3 bg-brand-cyan text-black font-black rounded-xl hover:bg-brand-cyan/80 shadow-[0_0_20px_rgba(0,217,255,0.4)] uppercase text-xs">
                <Play size={16} fill="currentColor" /> Deploy Code
              </button>
            ) : (
              <button onClick={stopSimulation} className="flex items-center gap-2 px-6 py-3 bg-brand-red text-white font-black rounded-xl hover:bg-brand-red/80 shadow-[0_0_20px_rgba(239,68,68,0.4)] uppercase text-xs">
                <Square size={16} fill="currentColor" /> Stop Simulation
              </button>
            )}
          </div>
        </div>

        <div className="glass-panel p-6 border border-white/10 rounded-2xl bg-black/40">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">Signal Health</p>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(i => <div key={i} className={`w-1 h-4 rounded-full ${i <= 4 ? 'bg-brand-cyan shadow-[0_0_5px_#00D9FF]' : 'bg-white/10'}`} />)}
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">Latency</p>
              <p className="text-xl font-mono text-white">24<span className="text-xs text-gray-500">ms</span></p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Col: Inventory */}
        <div className="lg:col-span-3 space-y-6">
          <div className="glass-panel p-5 border border-white/10 rounded-2xl bg-black/40">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
              <Settings size={14} className="text-brand-cyan" /> 
              Hardware Inventory
            </h3>
            <div className="space-y-3">
              {components.map((comp) => (
                <button
                  key={comp.id}
                  onClick={() => toggleComponent(comp.id)}
                  className={`w-full p-3 rounded-xl border transition-all text-left group ${
                    connectedComponents.includes(comp.id) 
                      ? 'bg-brand-cyan/10 border-brand-cyan/50' 
                      : 'bg-white/5 border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] text-gray-300 font-bold flex items-center gap-2">
                      <div className={connectedComponents.includes(comp.id) ? 'text-brand-cyan' : 'text-gray-500'}>
                        {comp.icon}
                      </div>
                      {comp.name}
                    </span>
                    {connectedComponents.includes(comp.id) && <div className="w-1.5 h-1.5 rounded-full bg-brand-cyan animate-pulse shadow-[0_0_5px_#00D9FF]" />}
                  </div>
                  <p className="text-[8px] text-gray-600 font-mono truncate">{comp.pins}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="glass-panel p-5 border border-white/10 rounded-2xl bg-black/40">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
              <Radio size={14} className="text-brand-purple" /> 
              Pinout Mapping
            </h3>
            <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
              {connectedComponents.map(id => {
                const comp = components.find(c => c.id === id);
                return (
                  <div key={id} className="text-[9px] font-mono p-2 bg-black/40 border border-white/5 rounded flex justify-between items-center">
                    <span className="text-gray-400">{comp?.name || id}</span>
                    <span className="text-brand-purple">{comp?.pins.split(',')[0]}</span>
                  </div>
                );
              })}
              {connectedComponents.length === 0 && <p className="text-[10px] text-gray-600 italic">No hardware connected.</p>}
            </div>
          </div>

          <div className="glass-panel p-5 border border-white/10 rounded-2xl bg-brand-purple/5">
            <h3 className="text-xs font-bold text-brand-purple uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
              <Info size={14} /> 
              Mission Log
            </h3>
            <div className="p-3 bg-black/40 border border-brand-purple/20 rounded-xl">
              <p className="text-xs text-white font-bold mb-1">Task: Perimeter Patrol</p>
              <p className="text-[10px] text-gray-500 leading-relaxed">
                Configure the rover to navigate the obstacle course without colliding with red barriers. Use readSensor() to monitor proximity.
              </p>
            </div>
          </div>
        </div>

        {/* Center Col: Logic Editor */}
        <div className="lg:col-span-6 space-y-6">
          <div className="glass-panel border border-white/10 rounded-2xl overflow-hidden flex flex-col bg-black/60 h-[500px]">
            <div className="px-4 py-2 bg-white/5 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-[10px] text-gray-400 font-mono uppercase tracking-widest flex items-center gap-2">
                  <TerminalIcon size={12} /> protocol_controller.js
                </span>
              </div>
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
              </div>
            </div>
            
            <div className="flex-1 relative font-mono text-sm">
              <div className="absolute left-0 top-0 bottom-0 w-10 bg-white/5 border-r border-white/5 flex flex-col items-center pt-4 text-[10px] text-gray-600">
                {[...Array(20)].map((_, i) => <div key={i} className="h-5">{i + 1}</div>)}
              </div>
              <textarea 
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="absolute inset-0 left-10 w-[calc(100%-2.5rem)] h-full bg-transparent p-4 text-brand-cyan focus:outline-none resize-none z-10"
                spellCheck={false}
              />
            </div>

            <div className="p-3 bg-black/40 border-t border-white/10 flex justify-between items-center">
              <span className="text-[10px] text-gray-500 font-mono">UTF-8 | JAVASCRIPT | 1.2 KB</span>
              <button 
                onClick={() => setCode(`// Resetting to base protocol...\nfunction onUpdate() {\n  moveForward(100);\n}`)}
                className="text-[10px] text-gray-500 hover:text-white flex items-center gap-1 transition-colors"
              >
                <RefreshCcw size={10} /> Reset Logic
              </button>
            </div>
          </div>

          {/* Live Output Terminal */}
          <div className="glass-panel border border-white/10 rounded-2xl overflow-hidden bg-black/80 h-[200px] flex flex-col">
            <div className="px-4 py-1 bg-white/5 border-b border-white/10 text-[10px] text-gray-500 uppercase tracking-widest flex items-center gap-2">
              <Activity size={10} /> Live Diagnostic Output
            </div>
            <div className="flex-1 p-4 overflow-y-auto font-mono text-xs space-y-1">
              {logs.map((log, i) => (
                <div key={i} className={`flex gap-3 ${
                  log.type === 'error' ? 'text-brand-red' : 
                  log.type === 'success' ? 'text-brand-cyan' : 
                  log.type === 'warn' ? 'text-brand-orange' : 'text-gray-400'
                }`}>
                  <span className="text-gray-700 select-none">[{new Date().toLocaleTimeString([], {hour12: false})}]</span>
                  <span>{log.type === 'error' ? '✖' : log.type === 'success' ? '✔' : 'ℹ'} {log.msg}</span>
                </div>
              ))}
              <div ref={terminalEndRef} />
            </div>
          </div>
        </div>

        {/* Right Col: Simulation View */}
        <div className="lg:col-span-3 space-y-6">
          <div className="glass-panel border border-white/10 rounded-2xl overflow-hidden flex flex-col bg-black/40 h-full min-h-[400px]">
            <div className="px-4 py-2 bg-white/5 border-b border-white/10 flex justify-between items-center">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                <Maximize2 size={12} /> Test Bench
              </h3>
              <div className="flex gap-2">
                <div className="w-2 h-2 rounded-full bg-brand-cyan animate-ping" />
                <span className="text-[10px] text-brand-cyan font-bold">LIVE_FEED</span>
              </div>
            </div>
            
            <div className="flex-1 relative flex items-center justify-center p-8">
              {/* Simulation Grid */}
              <div className="absolute inset-4 border border-white/5 rounded-xl bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px]" />
              
              {/* Virtual Board */}
              <motion.div 
                animate={isRunning ? { 
                  y: [-5, 5, -5],
                  rotate: [0, 1, -1, 0],
                } : {}}
                transition={{ duration: 4, repeat: Infinity }}
                className="relative z-10 w-48 h-48 flex items-center justify-center"
              >
                <div className={`absolute inset-0 blur-3xl rounded-full transition-colors ${selectedBoard === 'arduino' ? 'bg-brand-cyan/10' : 'bg-brand-purple/10'}`} />
                <div className={`w-full h-full bg-[#1a1a1a] border-2 rounded-2xl relative shadow-2xl transition-all ${
                  selectedBoard === 'arduino' ? 'border-brand-cyan/50 shadow-brand-cyan/20' : 'border-brand-purple/50 shadow-brand-purple/20'
                }`}>
                  {/* ICs and Ports */}
                  <div className="absolute top-4 left-4 w-12 h-6 bg-black/60 rounded border border-white/10 flex items-center justify-center">
                    <div className="w-8 h-1 bg-gray-700 rounded-full" />
                  </div>
                  <div className="absolute bottom-4 right-4 w-10 h-10 bg-black/40 rounded-lg border border-white/5 flex items-center justify-center">
                    <Cpu size={24} className={selectedBoard === 'arduino' ? 'text-brand-cyan/30' : 'text-brand-purple/30'} />
                  </div>
                  
                  {/* Connected Components Visualization */}
                  <div className="absolute -right-12 top-0 bottom-0 flex flex-col justify-center gap-2">
                    {connectedComponents.filter(id => id !== 'Internal LED').map(id => {
                      const comp = components.find(c => c.id === id);
                      return (
                        <motion.div 
                          key={id}
                          initial={{ x: 20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          className="w-10 h-10 bg-black/60 border border-white/10 rounded-lg flex items-center justify-center text-brand-cyan shadow-lg"
                        >
                          {comp?.icon}
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Pin Headers */}
                  <div className="absolute top-0 left-8 right-8 h-2 flex justify-between">
                    {[...Array(8)].map((_, i) => <div key={i} className="w-1 h-full bg-black/80 rounded-b" />)}
                  </div>
                  <div className="absolute bottom-0 left-8 right-8 h-2 flex justify-between">
                    {[...Array(8)].map((_, i) => <div key={i} className="w-1 h-full bg-black/80 rounded-t" />)}
                  </div>
                </div>
              </motion.div>

              {/* Obstacles */}
              <div className="absolute top-10 right-10 w-12 h-12 bg-brand-red/20 border border-brand-red/50 rounded-lg flex items-center justify-center text-brand-red opacity-50">
                <AlertTriangle size={20} />
              </div>
            </div>

            <div className="p-4 bg-white/5 border-t border-white/10">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] text-gray-500">Core Performance</span>
                <span className="text-[10px] text-brand-cyan">98.2% Efficiency</span>
              </div>
              <div className="w-full h-1 bg-white/5 rounded-full">
                <div className="w-4/5 h-full bg-brand-cyan shadow-[0_0_10px_#00D9FF]" />
              </div>
            </div>
          </div>

          {/* Real-World Bridge */}
          <div className="glass-panel p-6 border border-white/10 rounded-2xl bg-black/40">
            <h3 className="text-xs font-bold text-white uppercase tracking-[0.2em] mb-4">Export Protocol</h3>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-brand-cyan">1</span>
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-gray-200 uppercase">Generate Binary</p>
                  <p className="text-[10px] text-gray-500">Compiles for {selectedBoard.toUpperCase()} via {selectedLanguage.toUpperCase()} toolchain.</p>
                </div>
              </div>
              <button className="w-full py-3 bg-brand-purple/20 hover:bg-brand-purple/30 border border-brand-purple/40 rounded-xl text-[10px] font-black text-brand-purple transition-all uppercase tracking-[0.2em] flex items-center justify-center gap-2">
                <TerminalIcon size={12} /> Download .hex file
              </button>
              <div className="h-px bg-white/5" />
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-brand-cyan">2</span>
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-gray-200">Wiring Schematic</p>
                  <p className="text-[10px] text-gray-500">PDF map of all {connectedComponents.length} connections.</p>
                </div>
              </div>
              <button className="w-full py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-bold text-white transition-all uppercase tracking-widest">
                Export Wiring Diagram
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
