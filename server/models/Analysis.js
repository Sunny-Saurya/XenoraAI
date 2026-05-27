import mongoose from 'mongoose';

const analysisSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
  },

  repoUrl: {
    type: String,
    required: true,
  },

  repoName: {
    type: String,
    required: true,
  },

  owner: {
    type: String,
    required: true,
  },

  tree: {
    type: Array,
    required: false,
  },

  explanation: {

    purpose: {
      type: String,
      default: "",
    },

    architecture: {
      type: String,
      default: "",
    },

    workflow: {
      type: String,
      default: "",
    },

    setup: {
      type: String,
      default: "",
    },

    importantFiles: {
      type: [String],
      default: [],
    },

    mermaidDiagram: {
      type: String,
      default: "",
    },

    healthScore: {
      overall: { type: Number, default: 0 },
      codeQuality: { type: Number, default: 0 },
      architecture: { type: Number, default: 0 },
      maintainability: { type: Number, default: 0 },
    },

    analysisPoints: [{
      label: String,
      value: String,
      status: { type: String, enum: ['good', 'average', 'poor'] }
    }],

    interviewQuestions: {
      type: [String],
      default: [],
    }
  },

  rawAnalysis: {
    type: String,
    default: "",
  }

}, {
  timestamps: true
});

const Analysis = mongoose.model('Analysis', analysisSchema);

export default Analysis;