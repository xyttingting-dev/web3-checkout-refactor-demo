import React from 'react';
import { Settings, ShieldCheck, X, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

export const SandboxSelector = ({ onSelectPath, onClose }: { onSelectPath: (path: 'success' | 'fail') => void, onClose: () => void }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm"
        >
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden relative">
                <div className="bg-gray-900 p-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-white">
                        <Settings size={18} className="animate-spin-slow" />
                        <span className="font-bold text-sm tracking-wide">SANDBOX CONTROL</span>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <X size={18} />
                    </button>
                </div>

                <div className="p-6 flex flex-col gap-3">
                    <button
                        onClick={() => onSelectPath('success')}
                        className="p-4 bg-green-50 border border-green-100 rounded-xl flex items-center justify-between hover:bg-green-100 transition-all group"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-200 rounded-lg flex items-center justify-center text-green-700">
                                <ShieldCheck size={20} />
                            </div>
                            <div className="text-left">
                                <div className="font-bold text-gray-900 text-sm">Flow A: Success</div>
                                <div className="text-[10px] text-gray-500">Connect &rarr; Sign &rarr; 200 OK</div>
                            </div>
                        </div>
                    </button>

                    <button
                        onClick={() => onSelectPath('fail')}
                        className="p-4 bg-orange-50 border border-orange-100 rounded-xl flex items-center justify-between hover:bg-orange-100 transition-all group"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-orange-200 rounded-lg flex items-center justify-center text-orange-700">
                                <Globe size={20} />
                            </div>
                            <div className="text-left">
                                <div className="font-bold text-gray-900 text-sm">Flow B: Fallback</div>
                                <div className="text-[10px] text-gray-500">Timeout &rarr; Error 410 &rarr; DApp</div>
                            </div>
                        </div>
                    </button>

                    <div className="text-[10px] text-center text-gray-300 mt-2">
                        Only visible in Demo Environment
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
