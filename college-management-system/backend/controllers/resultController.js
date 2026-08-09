const Result = require('../models/Result');

const addResult = async (req, res) => {
  try {
    const result = await Result.create(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getResults = async (req, res) => {
  try {
    const filter = {};
    if (req.query.student) filter.student = req.query.student;
    if (req.query.semester) filter.semester = req.query.semester;

    const results = await Result.find(filter)
      .populate('student', 'rollNumber')
      .populate('course', 'name code credits');

    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateResult = async (req, res) => {
  try {
    const result = await Result.findById(req.params.id);
    if (!result) return res.status(404).json({ message: 'Result not found' });

    result.marksObtained = req.body.marksObtained ?? result.marksObtained;
    result.maxMarks = req.body.maxMarks ?? result.maxMarks;
    await result.save(); // triggers the grade pre-save hook again

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteResult = async (req, res) => {
  try {
    const result = await Result.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ message: 'Result not found' });
    res.json({ message: 'Result removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { addResult, getResults, updateResult, deleteResult };
