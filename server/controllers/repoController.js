import Analysis from '../models/Analysis.js';
import { parseGithubUrl, fetchRepoDetails, fetchRepoTree, fetchFileContent } from '../utils/github.js';
import { analyzeRepoWithAI, chatWithRepo } from '../utils/openRouter.js';

// @desc    Analyze a new repository
// @route   POST /api/repo/analyze
// @access  Private
export const analyzeRepo = async (req, res) => {
  try {
    const { repoUrl } = req.body;

    if (!repoUrl) {
      return res.status(400).json({ message: 'Repository URL is required' });
    }

    const { owner, repo } = parseGithubUrl(repoUrl);

    // Fetch details from GitHub
    const repoDetails = await fetchRepoDetails(owner, repo);
    const tree = await fetchRepoTree(owner, repo, repoDetails.default_branch);
    
    // Attempt to fetch key files for context
    const readmeContent = await fetchFileContent(owner, repo, 'README.md');
    const packageJsonContent = await fetchFileContent(owner, repo, 'package.json');

    // Send to OpenRouter for AI Analysis
    const explanation = await analyzeRepoWithAI(repoDetails, tree, readmeContent, packageJsonContent);

    // Save to Database
    const analysis = await Analysis.create({
      user: req.user._id,
      repoUrl,
      repoName: repoDetails.name,
      owner,
      tree,
      explanation,
      rawAnalysis: JSON.stringify(explanation)
    });

    res.status(201).json(analysis);

  } catch (error) {
    console.error("Analyze Repo Error:", error);
    // Determine specific error to return
    const message = error.response?.data?.message || error.message || 'Failed to analyze repository';
    res.status(500).json({ message, details: error.stack });
  }
};

// @desc    Get user's past analyses
// @route   GET /api/repo/history
// @access  Private
export const getAnalysisHistory = async (req, res) => {
  try {
    const history = await Analysis.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch history' });
  }
};

// @desc    Get specific analysis by ID
// @route   GET /api/repo/:id
// @access  Private
export const getAnalysisById = async (req, res) => {
  try {
    const analysis = await Analysis.findById(req.params.id);
    
    if (!analysis) {
      return res.status(404).json({ message: 'Analysis not found' });
    }

    // Ensure user owns this analysis
    if (analysis.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    res.json(analysis);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch analysis' });
  }
};

// @desc    Chat with repository context
// @route   POST /api/repo/:id/chat
// @access  Private
export const chatWithAnalysis = async (req, res) => {
  try {
    const { message, chatHistory } = req.body;
    const analysis = await Analysis.findById(req.params.id);

    if (!analysis) {
      return res.status(404).json({ message: 'Analysis not found' });
    }

    // Ensure user owns this analysis
    if (analysis.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Detect if user is asking about a specific file or DB/API
    let fileContext = "";
    const msgLower = message.toLowerCase();
    
    // Smart DB/API File Injection
    const isDbApiQuery = ['database', 'db', 'schema', 'model', 'api', 'route', 'endpoint', 'controller'].some(kw => msgLower.includes(kw));
    
    let filesToFetch = [];
    
    if (isDbApiQuery) {
      // Look for schema, models, routes
      const relevantFiles = analysis.tree.filter(f => 
        f.type === 'blob' && 
        (f.path.includes('model') || f.path.includes('schema') || f.path.includes('route') || f.path.includes('controller') || f.path.includes('api'))
      ).slice(0, 2); // Max 2 relevant architectural files to avoid massive context
      filesToFetch.push(...relevantFiles);
    }

    // Regular specific file word match
    const words = message.split(/[\s,]+/);
    for (const word of words) {
      if (word.length > 3) {
        const foundFile = analysis.tree.find(f => f.path.endsWith(word) && f.type === 'blob');
        if (foundFile && !filesToFetch.find(f => f.path === foundFile.path)) {
          filesToFetch.push(foundFile);
        }
      }
    }

    // Limit to 3 files total to prevent token limit errors
    filesToFetch = filesToFetch.slice(0, 3);

    for (const file of filesToFetch) {
      const content = await fetchFileContent(analysis.owner, analysis.repoName, file.path);
      if (content) {
        fileContext += `Content of ${file.path}:\n${content.substring(0, 2000)}\n\n`;
      }
    }

    const reply = await chatWithRepo(analysis, message, chatHistory, fileContext);
    res.json({ reply });

  } catch (error) {
    console.error("Chat Error:", error);
    res.status(500).json({ message: 'Failed to get chat response' });
  }
};
