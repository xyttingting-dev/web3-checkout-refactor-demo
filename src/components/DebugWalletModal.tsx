import { X, CheckCircle, AlertOctagon } from 'lucide-react';

interface DebugWalletModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    onFailure: () => void;
    walletName: string;
}

export const DebugWalletModal = ({ isOpen, onClose, onSuccess, onFailure, walletName }: DebugWalletModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 relative overflow-hidden animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded-full w-fit mb-1">Debug Mode</span>
                        <h3 className="text-lg font-bold text-gray-900">Test {walletName} Flow</h3>
                    </div>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 text-gray-400 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="space-y-3">
                    {/* Path A */}
                    <button
                        onClick={onSuccess}
                        className="w-full flex items-center justify-between p-4 rounded-xl border-2 border-green-100 bg-green-50/50 hover:bg-green-50 hover:border-green-200 transition-all group"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 group-hover:scale-110 transition-transform">
                                <CheckCircle size={20} fill="currentColor" className="text-white" />
                            </div>
                            <div className="text-left">
                                <div className="text-sm font-bold text-gray-900">Simulate Success</div>
                                <div className="text-xs text-gray-500">Sign & Broadcast Tx</div>
                            </div>
                        </div>
                    </button>

                    {/* Path B */}
                    <button
                        onClick={onFailure}
                        className="w-full flex items-center justify-between p-4 rounded-xl border-2 border-red-100 bg-red-50/50 hover:bg-red-50 hover:border-red-200 transition-all group"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 group-hover:scale-110 transition-transform">
                                <AlertOctagon size={20} fill="currentColor" className="text-white" />
                            </div>
                            <div className="text-left">
                                <div className="text-sm font-bold text-gray-900">Simulate Failure</div>
                                <div className="text-xs text-gray-500">DeepLink/Connection Failed</div>
                            </div>
                        </div>
                    </button>
                </div>

                <p className="mt-6 text-center text-xs text-gray-400 text-balance">
                    This modal is only visible in <strong>Development/Test</strong> environments to validate payment flows.
                </p>

                {/* Background Decor */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none"></div>
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-fuchsia-500/5 rounded-full blur-2xl pointer-events-none"></div>
            </div>
        </div>
    );
};
