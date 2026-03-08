import SonicMapBoard from "@/components/SonicMapBoard";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center pt-24 pb-12 px-6 sm:px-12 relative selection:bg-purple-500/30">
      {/* Background decorations */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-purple-600/10 blur-[120px]"></div>
        <div className="absolute top-[20%] -right-[10%] w-[30%] h-[50%] rounded-full bg-blue-600/10 blur-[120px]"></div>
      </div>

      {/* Hero Section */}
      <div className="w-full max-w-5xl mx-auto text-center space-y-8 mb-16">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-purple-300">
          <span className="flex h-2 w-2 rounded-full bg-purple-500 animate-pulse"></span>
          <span>Now in Early Beta</span>
        </div>
        
        <h1 className="text-5xl sm:text-7xl font-bold tracking-tight text-white drop-shadow-sm">
          Map Your <span className="text-gradient bg-gradient-to-r from-purple-400 to-blue-500">Sound</span>
        </h1>
        
        <p className="max-w-2xl mx-auto text-lg sm:text-xl text-zinc-400 leading-relaxed">
          Decompose music into interactive Sonic Nodes. Weave Aura Flows in an infinite spatial canvas to generate your ultimate AI Tribute.
        </p>

        <div className="flex items-center justify-center gap-4 pt-4">
          <button className="px-8 py-3 rounded-full bg-white text-black font-semibold hover:bg-zinc-200 hover:scale-[1.02] active:scale-95 transition-all duration-200">
            Open Sonic Blueprint
          </button>
          <button className="px-8 py-3 rounded-full bg-white/5 text-white border border-white/10 font-medium hover:bg-white/10 hover:scale-[1.02] active:scale-95 transition-all duration-200">
            Learn More
          </button>
        </div>
      </div>

      {/* App Workspace Area */}
      <div className="w-full max-w-6xl mx-auto flex-1 flex flex-col">
        <div className="flex-1 min-h-[600px] w-full p-1 rounded-3xl bg-gradient-to-b from-white/10 to-transparent shadow-2xl transition-all duration-500 hover:shadow-purple-500/10 hover:border-white/20">
          <SonicMapBoard />
        </div>
      </div>
    </main>
  );
}
