// frontend/src/app/dashboard/analyze/page.tsx (Analysis Interface)
"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Upload, 
  Image as ImageIcon, 
  Video, 
  FileText, 
  X, 
  Shield, 
  AlertCircle,
  CheckCircle2,
  Loader2,
  Scan,
  Brain,
  FileSearch,
  ArrowRight,
  Mic,
  Mail,
  MessageSquare
} from "lucide-react";
import { useDropzone } from "react-dropzone";
import { analyzeImage, analyzeVideo, analyzeAudio, analyzeDocument } from "@/lib/api";

const analysisTypes = [
  { id: "image", label: "Image Forensics", icon: ImageIcon, desc: "Detect manipulation, deepfakes, and metadata analysis" },
  { id: "video", label: "Video Analysis", icon: Video, desc: "Frame-by-frame verification and temporal consistency" },
  { id: "document", label: "Document Check", icon: FileText, desc: "PDF integrity and digital signature verification" },
  { id: "audio", label: "Audio Forensics", icon: Mic, desc: "Voice cloning detection and waveform analysis" },
  { id: "email", label: "Email Verification", icon: Mail, desc: "Phishing detection and sender identity verification" },
  { id: "text", label: "Text Detection", icon: MessageSquare, desc: "AI-generated text detection (LLM forensics)" },
];

const analysisSteps = [
  { id: "upload", label: "Upload", icon: Upload },
  { id: "scanning", label: "Scanning", icon: Scan },
  { id: "ai-analysis", label: "AI Analysis", icon: Brain },
  { id: "results", label: "Results", icon: FileSearch },
];

export default function AnalyzePage() {
  const [selectedType, setSelectedType] = useState("image");
  const [files, setFiles] = useState<File[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<any>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(prev => [...prev, ...acceptedFiles]);
  }, []);

  const getAccept = (): Record<string, string[]> => {
    switch (selectedType) {
      case 'image': return { 'image/*': [] };
      case 'video': return { 'video/*': [] };
      case 'document': return { 'application/pdf': [] };
      case 'audio': return { 'audio/*': [] };
      case 'email': return { '.eml': [], '.msg': [] };
      case 'text': return { 'text/plain': [], 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [] };
      default: return { 'image/*': [] };
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: getAccept(),
    multiple: true
  });

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  /* eslint-disable @typescript-eslint/no-unused-vars */
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const startAnalysis = async () => {
    if (files.length === 0 && selectedType !== "text" && selectedType !== "email") return;

    setIsAnalyzing(true);
    setCurrentStep(1);
    setResults(null);

    // Initial delay for UX (Scanning step)
    await new Promise(resolve => setTimeout(resolve, 1500));
    setCurrentStep(2);

    try {
      let data;
      
      switch (selectedType) {
        case "image":
          if (files.length > 0) data = await analyzeImage(files[0]);
          break;
        case "video":
           if (files.length > 0) data = await analyzeVideo(files[0]);
          break;
        case "audio":
           if (files.length > 0) data = await analyzeAudio(files[0]);
          break;
         case "document":
           if (files.length > 0) data = await analyzeDocument(files[0]);
           break;
        case "text":
          // Assuming there's a text input state elsewhere, or we handle file as text source
          // For now, let's keep it simple or prompt user - implementing generic fallback
           break;
        case "email":
           break;
        default:
          break;
      }

      if (data) {
        // Transform backend response to UI format
        // Backend returns: { trust_score, deepfake_probability, verdict, explanation, details: { findings: [], ...categoryScores } }
        
        // Map backend findings to UI findings
        const findings = data.details?.findings || [];
        const mappedFindings = findings.map((f: any) => ({
             type: f.category || "General",
             status: f.score > 80 ? "valid" : f.score > 50 ? "warning" : "danger",
             detail: f.reason || "Analysis complete"
        }));

        // Fallback findings if empty
        if (mappedFindings.length === 0) {
             mappedFindings.push({
                 type: "Analysis Complete",
                 status: data.trust_score > 80 ? "valid" : data.trust_score > 50 ? "warning" : "danger",
                 detail: data.explanation || "Forensic analysis completed successfully"
             });
        }

        // Extract category scores (texture, lighting, anatomy, background, semantics, etc.)
        const categoryScores: Record<string, number> = {};
        if (data.details) {
          Object.keys(data.details).forEach(key => {
            if (key !== 'findings' && typeof data.details[key] === 'number') {
              categoryScores[key] = data.details[key];
            }
          });
        }

        const uiResults = {
            authenticity: data.trust_score,
            aiPercentage: data.deepfake_probability,
            verdict: data.verdict,
            explanation: data.explanation,
            manipulated: data.deepfake_probability > 50,
            confidence: data.trust_score > 80 ? "High" : data.trust_score > 50 ? "Medium" : "Low",
            categoryScores: categoryScores,
            findings: mappedFindings
        };

        setCurrentStep(3);
        await new Promise(resolve => setTimeout(resolve, 500));
        setResults(uiResults);
      }
      
    } catch (error) {
      console.error("Analysis failed:", error);
      alert("Analysis failed. Please check backend connection.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Helper for text/email input (can be expanded later)
  // For now we focus on file uploads as per UI

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-white">New Forensic Analysis</h1>
        <p className="text-slate-400">Select content type and upload files for verification</p>
      </div>

      {/* Analysis Type Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {analysisTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => setSelectedType(type.id)}
            className={`relative p-6 rounded-2xl border-2 transition-all text-left group ${
              selectedType === type.id
                ? "border-sky-500 bg-sky-500/10"
                : "border-slate-800 bg-slate-900/50 hover:border-slate-700 hover:bg-slate-800/50"
            }`}
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors ${
              selectedType === type.id ? "bg-sky-500 text-white" : "bg-slate-800 text-slate-400 group-hover:bg-slate-700"
            }`}>
              <type.icon className="w-6 h-6" />
            </div>
            <h3 className={`font-semibold mb-1 ${selectedType === type.id ? "text-white" : "text-slate-300"}`}>
              {type.label}
            </h3>
            <p className="text-sm text-slate-400">{type.desc}</p>
            
            {selectedType === type.id && (
              <motion.div
                layoutId="selected-indicator"
                className="absolute top-4 right-4 w-6 h-6 bg-sky-500 rounded-full flex items-center justify-center"
              >
                <CheckCircle2 className="w-4 h-4 text-white" />
              </motion.div>
            )}
          </button>
        ))}
      </div>

      {/* Upload Area */}
      <AnimatePresence mode="wait">
        {!results && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div
              {...getRootProps()}
              className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer ${
                isDragActive
                  ? "border-sky-500 bg-sky-500/10"
                  : "border-slate-700 bg-slate-900/50 hover:border-slate-600 hover:bg-slate-800/30"
              }`}
            >
              <input {...getInputProps()} />
              <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-slate-800 flex items-center justify-center">
                <Upload className={`w-10 h-10 ${isDragActive ? "text-sky-400" : "text-slate-400"}`} />
              </div>
              <p className="text-lg font-medium text-white mb-2">
                {isDragActive ? "Drop files here" : "Drag & drop files here"}
              </p>
              <p className="text-sm text-slate-400 mb-4">or click to browse from your computer</p>
              <button className="px-6 py-2.5 bg-slate-800 text-white rounded-xl font-medium hover:bg-slate-700 transition-colors">
                Select Files
              </button>
            </div>

            {/* File List */}
            {files.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="space-y-3"
              >
                <h4 className="text-sm font-medium text-slate-300">Selected Files ({files.length})</h4>
                <div className="space-y-2">
                  {files.map((file, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center justify-between p-4 bg-slate-900/50 border border-slate-800 rounded-xl"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center">
                          {selectedType === 'image' && <ImageIcon className="w-5 h-5 text-purple-400" />}
                          {selectedType === 'video' && <Video className="w-5 h-5 text-rose-400" />}
                          {selectedType === 'document' && <FileText className="w-5 h-5 text-amber-400" />}
                          {selectedType === 'audio' && <Mic className="w-5 h-5 text-sky-400" />}
                          {selectedType === 'email' && <Mail className="w-5 h-5 text-emerald-400" />}
                          {selectedType === 'text' && <MessageSquare className="w-5 h-5 text-indigo-400" />}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white truncate max-w-[200px] sm:max-w-xs">{file.name}</p>
                          <p className="text-xs text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFile(index)}
                        className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-rose-400 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))}
                </div>
                
                <button
                  onClick={startAnalysis}
                  disabled={isAnalyzing}
                  className="w-full py-4 bg-gradient-to-r from-sky-500 to-indigo-600 text-white rounded-xl font-semibold text-lg hover:from-sky-400 hover:to-indigo-500 transition-all shadow-lg shadow-sky-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      Start Analysis
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Analysis Progress */}
      {isAnalyzing && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-8 bg-slate-900/50 border border-slate-800 rounded-2xl text-center space-y-6"
        >
          <div className="flex justify-center gap-2">
            {analysisSteps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex flex-col items-center gap-2 ${
                  index <= currentStep ? "text-sky-400" : "text-slate-600"
                }`}>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                    index < currentStep ? "bg-sky-500 border-sky-500 text-white" :
                    index === currentStep ? "border-sky-500 text-sky-400 animate-pulse" :
                    "border-slate-700 text-slate-600"
                  }`}>
                    {index < currentStep ? <CheckCircle2 className="w-6 h-6" /> : <step.icon className="w-6 h-6" />}
                  </div>
                  <span className="text-xs font-medium">{step.label}</span>
                </div>
                {index < analysisSteps.length - 1 && (
                  <div className={`w-12 h-0.5 mx-2 ${
                    index < currentStep ? "bg-sky-500" : "bg-slate-800"
                  }`} />
                )}
              </div>
            ))}
          </div>
          <p className="text-slate-400">Processing forensic analysis... Please wait</p>
        </motion.div>
      )}

      {/* Results */}
      {results && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Authenticity vs AI Percentage Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Authenticity Card */}
            <div className="p-8 bg-gradient-to-br from-emerald-500/10 to-sky-500/10 border border-emerald-500/20 rounded-2xl text-center">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-emerald-500/20 border-4 border-emerald-500 flex items-center justify-center">
                <span className="text-3xl font-bold text-emerald-400">{results.authenticity}%</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-1">Authentic Content</h3>
              <p className="text-emerald-400 font-medium">{results.confidence} Confidence</p>
            </div>

            {/* AI Generated Card */}
            <div className="p-8 bg-gradient-to-br from-rose-500/10 to-orange-500/10 border border-rose-500/20 rounded-2xl text-center">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-rose-500/20 border-4 border-rose-500 flex items-center justify-center">
                <span className="text-3xl font-bold text-rose-400">{results.aiPercentage}%</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-1">AI Generated</h3>
              <p className="text-rose-400 font-medium">Deepfake Probability</p>
            </div>
          </div>

          {/* Verdict Badge */}
          <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-2xl text-center">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-sky-500/10 border border-sky-500/30 rounded-full">
              <Shield className="w-5 h-5 text-sky-400" />
              <span className="text-lg font-bold text-sky-300">Verdict: {results.verdict}</span>
            </div>
            {results.explanation && (
              <p className="mt-4 text-slate-300 max-w-2xl mx-auto">{results.explanation}</p>
            )}
          </div>

          {/* Category Scores (if available) */}
          {results.categoryScores && Object.keys(results.categoryScores).length > 0 && (
            <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-2xl">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-400" />
                Forensic Analysis Breakdown
              </h3>
              <div className="space-y-3">
                {Object.entries(results.categoryScores).map(([category, score]: [string, any]) => (
                  <div key={category}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-300 capitalize">{category}</span>
                      <span className="text-slate-400">{score}/100</span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-sky-500 to-purple-500 rounded-full transition-all"
                        style={{ width: `${score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Detailed Findings */}
          <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-2xl">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <FileSearch className="w-5 h-5 text-amber-400" />
              Detailed Findings
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {results.findings.map((finding: any, index: number) => (
                <div
                  key={index}
                  className={`p-4 rounded-xl border ${
                    finding.status === 'valid' ? 'bg-emerald-500/5 border-emerald-500/20' :
                    finding.status === 'warning' ? 'bg-amber-500/5 border-amber-500/20' :
                    'bg-rose-500/5 border-rose-500/20'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`mt-0.5 ${
                      finding.status === 'valid' ? 'text-emerald-400' :
                      finding.status === 'warning' ? 'text-amber-400' :
                      'text-rose-400'
                    }`}>
                      {finding.status === 'valid' ? <CheckCircle2 className="w-5 h-5" /> :
                       finding.status === 'warning' ? <AlertCircle className="w-5 h-5" /> :
                       <Shield className="w-5 h-5" />}
                    </div>
                    <div>
                      <h4 className="font-medium text-white">{finding.type}</h4>
                      <p className="text-sm text-slate-400">{finding.detail}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={() => {
                setResults(null);
                setFiles([]);
                setCurrentStep(0);
              }}
              className="flex-1 py-3 bg-slate-800 text-white rounded-xl font-medium hover:bg-slate-700 transition-colors"
            >
              New Analysis
            </button>
            <button className="flex-1 py-3 bg-sky-500 text-white rounded-xl font-medium hover:bg-sky-400 transition-colors">
              Download Report
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}