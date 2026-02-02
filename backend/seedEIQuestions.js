const mongoose = require('mongoose');

// Use environment variable or default to local MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mba-career-assessment';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const questionSchema = new mongoose.Schema({
  questionNumber: { type: Number, required: true },
  text: { type: String, required: true },
  category: { type: String },
  test: { type: String, required: true, default: 'RIASEC' },
  options: { type: [String], default: undefined },
  correctAnswer: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const Question = mongoose.model('Question', questionSchema);

/**
 * TEIQue-ASF (Trait Emotional Intelligence Questionnaire - Adolescent Short Form)
 * 30 Questions with 7-point Likert Scale
 * 
 * Reverse-scored items (handled in server.js): 2, 4, 5, 7, 8, 10, 12, 13, 14, 16, 18, 22, 25, 26, 28
 * 
 * Factor Items:
 * - Well-being: 5, 9, 12, 20, 24, 27
 * - Self-control: 4, 7, 15, 19, 22, 30
 * - Emotionality: 1, 2, 8, 13, 16, 17, 23, 28
 * - Sociability: 6, 10, 11, 21, 25, 26
 */
const eiQuestions = [
  // Emotionality items
  { questionNumber: 1, text: "Expressing my emotions with words is not a problem for me.", test: 'EI', category: 'Emotionality' },
  { questionNumber: 2, text: "I often find it difficult to see things from another person's viewpoint.", test: 'EI', category: 'Emotionality' }, // R
  
  // Additional item (not in main 4 factors - contributes to global)
  { questionNumber: 3, text: "On the whole, I'm a highly motivated person.", test: 'EI', category: 'Global' },
  
  // Self-control items
  { questionNumber: 4, text: "I usually find it difficult to regulate my emotions.", test: 'EI', category: 'Self-control' }, // R
  
  // Well-being items
  { questionNumber: 5, text: "I generally don't find life enjoyable.", test: 'EI', category: 'Well-being' }, // R
  
  // Sociability items
  { questionNumber: 6, text: "I can deal effectively with people.", test: 'EI', category: 'Sociability' },
  
  // Self-control items
  { questionNumber: 7, text: "I tend to change my mind frequently.", test: 'EI', category: 'Self-control' }, // R
  
  // Emotionality items
  { questionNumber: 8, text: "Many times, I can't figure out what emotion I'm feeling.", test: 'EI', category: 'Emotionality' }, // R
  
  // Well-being items
  { questionNumber: 9, text: "I feel that I have a number of good qualities.", test: 'EI', category: 'Well-being' },
  
  // Sociability items
  { questionNumber: 10, text: "I normally find it difficult to stand up for my rights.", test: 'EI', category: 'Sociability' }, // R
  { questionNumber: 11, text: "I'm usually able to influence the way other people feel.", test: 'EI', category: 'Sociability' },
  
  // Well-being items
  { questionNumber: 12, text: "On the whole, I have a gloomy perspective on most things.", test: 'EI', category: 'Well-being' }, // R
  
  // Emotionality items
  { questionNumber: 13, text: "Those close to me often complain that I don't treat them right.", test: 'EI', category: 'Emotionality' }, // R
  
  // Additional item (contributes to global)
  { questionNumber: 14, text: "I often find it difficult to adjust my life according to the circumstances.", test: 'EI', category: 'Global' }, // R
  
  // Self-control items
  { questionNumber: 15, text: "On the whole, I'm able to deal with stress.", test: 'EI', category: 'Self-control' },
  
  // Emotionality items
  { questionNumber: 16, text: "I often find it difficult to show my affection to those close to me.", test: 'EI', category: 'Emotionality' }, // R
  { questionNumber: 17, text: "I'm normally able to 'get into someone's shoes' and experience their emotions.", test: 'EI', category: 'Emotionality' },
  
  // Additional item (contributes to global)
  { questionNumber: 18, text: "I normally find it difficult to keep myself motivated.", test: 'EI', category: 'Global' }, // R
  
  // Self-control items
  { questionNumber: 19, text: "I'm usually able to find ways to control my emotions when I want to.", test: 'EI', category: 'Self-control' },
  
  // Well-being items
  { questionNumber: 20, text: "On the whole, I'm pleased with my life.", test: 'EI', category: 'Well-being' },
  
  // Sociability items
  { questionNumber: 21, text: "I would describe myself as a good negotiator.", test: 'EI', category: 'Sociability' },
  
  // Self-control items
  { questionNumber: 22, text: "I tend to get involved in things I later wish I could get out of.", test: 'EI', category: 'Self-control' }, // R
  
  // Emotionality items
  { questionNumber: 23, text: "I often pause and think about my feelings.", test: 'EI', category: 'Emotionality' },
  
  // Well-being items
  { questionNumber: 24, text: "I believe I'm full of personal strengths.", test: 'EI', category: 'Well-being' },
  
  // Sociability items
  { questionNumber: 25, text: "I tend to 'back down' even if I know I'm right.", test: 'EI', category: 'Sociability' }, // R
  { questionNumber: 26, text: "I don't seem to have any power at all over other people's feelings.", test: 'EI', category: 'Sociability' }, // R
  
  // Well-being items
  { questionNumber: 27, text: "I generally believe that things will work out fine in my life.", test: 'EI', category: 'Well-being' },
  
  // Emotionality items
  { questionNumber: 28, text: "I find it difficult to bond well even with those close to me.", test: 'EI', category: 'Emotionality' }, // R
  
  // Additional items (contribute to global)
  { questionNumber: 29, text: "Generally, I'm able to adapt to new environments.", test: 'EI', category: 'Global' },
  
  // Self-control items
  { questionNumber: 30, text: "Others admire me for being relaxed.", test: 'EI', category: 'Self-control' }
];

async function seedEIQuestions() {
  try {
    // Delete existing EI questions
    const deleteResult = await Question.deleteMany({ test: 'EI' });
    console.log(`🗑️  Deleted ${deleteResult.deletedCount} existing EI questions`);

    // Insert new EI questions
    const insertResult = await Question.insertMany(eiQuestions);
    console.log(`✅ Successfully seeded ${insertResult.length} TEIQue-ASF (EI) questions`);

    // Summary
    console.log('\n📊 Question Summary:');
    console.log('-----------------------------------');
    console.log('Total Questions: 30');
    console.log('Scale: 7-point Likert (1 = Completely Disagree → 7 = Completely Agree)');
    console.log('\nReverse-scored items: 2, 4, 5, 7, 8, 10, 12, 13, 14, 16, 18, 22, 25, 26, 28');
    console.log('\nFactors:');
    console.log('  • Well-being (6 items): 5, 9, 12, 20, 24, 27');
    console.log('  • Self-control (6 items): 4, 7, 15, 19, 22, 30');
    console.log('  • Emotionality (8 items): 1, 2, 8, 13, 16, 17, 23, 28');
    console.log('  • Sociability (6 items): 6, 10, 11, 21, 25, 26');
    console.log('  • Global items: 3, 14, 18, 29');
    console.log('-----------------------------------');

    mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  } catch (error) {
    console.error('❌ Error seeding EI questions:', error);
    mongoose.connection.close();
    process.exit(1);
  }
}

seedEIQuestions();
