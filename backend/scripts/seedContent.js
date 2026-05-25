const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const User = require('../models/User');
const Exam = require('../models/Exam');
const Question = require('../models/Question');

const SUBJECTS = [
  {
    title: 'Mathematics',
    description: 'Algebra, geometry, and arithmetic fundamentals.',
    durationMinutes: 30,
    questions: [
      {
        questionText: 'What is the value of 15 × 8?',
        options: ['100', '120', '130', '115'],
        correctOptionIndex: 1,
      },
      {
        questionText: 'The sum of angles in a triangle is:',
        options: ['90°', '180°', '270°', '360°'],
        correctOptionIndex: 1,
      },
      {
        questionText: 'Solve for x: 2x + 6 = 14',
        options: ['2', '4', '6', '8'],
        correctOptionIndex: 1,
      },
      {
        questionText: 'What is the square root of 144?',
        options: ['10', '11', '12', '14'],
        correctOptionIndex: 2,
      },
      {
        questionText: 'A circle with radius 7 has area (use π ≈ 22/7):',
        options: ['44 sq units', '154 sq units', '49 sq units', '22 sq units'],
        correctOptionIndex: 1,
      },
      {
        questionText: 'Which number is prime?',
        options: ['21', '29', '33', '39'],
        correctOptionIndex: 1,
      },
      {
        questionText: 'Convert 3/4 to a percentage:',
        options: ['34%', '50%', '75%', '80%'],
        correctOptionIndex: 2,
      },
      {
        questionText: 'The formula for the area of a rectangle is:',
        options: ['2(l + w)', 'l × w', 'πr²', '½ × b × h'],
        correctOptionIndex: 1,
      },
    ],
  },
  {
    title: 'Science',
    description: 'Physics, chemistry, and biology basics.',
    durationMinutes: 35,
    questions: [
      {
        questionText: 'The chemical symbol for water is:',
        options: ['CO₂', 'H₂O', 'O₂', 'NaCl'],
        correctOptionIndex: 1,
      },
      {
        questionText: 'Which planet is known as the Red Planet?',
        options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
        correctOptionIndex: 1,
      },
      {
        questionText: 'The powerhouse of the cell is the:',
        options: ['Nucleus', 'Ribosome', 'Mitochondria', 'Golgi body'],
        correctOptionIndex: 2,
      },
      {
        questionText: 'Speed is defined as:',
        options: ['Force × time', 'Distance / time', 'Mass × acceleration', 'Energy / time'],
        correctOptionIndex: 1,
      },
      {
        questionText: 'Which gas do plants absorb during photosynthesis?',
        options: ['Oxygen', 'Nitrogen', 'Carbon dioxide', 'Hydrogen'],
        correctOptionIndex: 2,
      },
      {
        questionText: 'The unit of electric current is:',
        options: ['Volt', 'Ohm', 'Ampere', 'Watt'],
        correctOptionIndex: 2,
      },
      {
        questionText: 'Human blood is slightly:',
        options: ['Acidic', 'Neutral', 'Alkaline (basic)', 'Strongly acidic'],
        correctOptionIndex: 2,
      },
      {
        questionText: 'Sound cannot travel through:',
        options: ['Air', 'Water', 'Vacuum', 'Steel'],
        correctOptionIndex: 2,
      },
    ],
  },
  {
    title: 'English',
    description: 'Grammar, vocabulary, and comprehension.',
    durationMinutes: 25,
    questions: [
      {
        questionText: 'Choose the correct spelling:',
        options: ['Recieve', 'Receive', 'Receeve', 'Receve'],
        correctOptionIndex: 1,
      },
      {
        questionText: 'She ___ to school every day.',
        options: ['go', 'goes', 'going', 'gone'],
        correctOptionIndex: 1,
      },
      {
        questionText: 'Antonym of "ancient" is:',
        options: ['Old', 'Modern', 'Historic', 'Classic'],
        correctOptionIndex: 1,
      },
      {
        questionText: 'Which is a proper noun?',
        options: ['city', 'river', 'India', 'country'],
        correctOptionIndex: 2,
      },
      {
        questionText: '"Quickly" is an example of a:',
        options: ['Noun', 'Verb', 'Adverb', 'Adjective'],
        correctOptionIndex: 2,
      },
      {
        questionText: 'The plural of "child" is:',
        options: ['Childs', 'Children', 'Childes', 'Childrens'],
        correctOptionIndex: 1,
      },
      {
        questionText: 'A sentence that asks a question ends with a:',
        options: ['Period', 'Comma', 'Question mark', 'Exclamation mark'],
        correctOptionIndex: 2,
      },
      {
        questionText: 'Synonym of "happy" is:',
        options: ['Sad', 'Angry', 'Joyful', 'Tired'],
        correctOptionIndex: 2,
      },
    ],
  },
  {
    title: 'History',
    description: 'World history and Indian independence movement.',
    durationMinutes: 30,
    questions: [
      {
        questionText: 'India gained independence in:',
        options: ['1942', '1945', '1947', '1950'],
        correctOptionIndex: 2,
      },
      {
        questionText: 'The First World War began in:',
        options: ['1914', '1918', '1939', '1945'],
        correctOptionIndex: 0,
      },
      {
        questionText: 'Who was the first Prime Minister of India?',
        options: ['Mahatma Gandhi', 'Jawaharlal Nehru', 'Sardar Patel', 'Dr. Ambedkar'],
        correctOptionIndex: 1,
      },
      {
        questionText: 'The French Revolution began in:',
        options: ['1689', '1789', '1889', '1989'],
        correctOptionIndex: 1,
      },
      {
        questionText: 'The Mughal Empire was founded by:',
        options: ['Akbar', 'Babur', 'Aurangzeb', 'Humayun'],
        correctOptionIndex: 1,
      },
      {
        questionText: 'The Great Wall of China was built primarily to:',
        options: ['Trade routes', 'Defense', 'Tourism', 'Farming'],
        correctOptionIndex: 1,
      },
      {
        questionText: 'UNESCO stands for United Nations Educational, Scientific and ___ Organization.',
        options: ['Cultural', 'Commercial', 'Constitutional', 'Colonial'],
        correctOptionIndex: 0,
      },
      {
        questionText: 'The Indus Valley Civilization is associated with cities like:',
        options: ['Delhi and Mumbai', 'Harappa and Mohenjo-daro', 'Rome and Athens', 'London and Paris'],
        correctOptionIndex: 1,
      },
    ],
  },
  {
    title: 'Computer Science',
    description: 'Programming concepts, hardware, and the internet.',
    durationMinutes: 35,
    questions: [
      {
        questionText: 'HTML stands for:',
        options: [
          'Hyper Text Markup Language',
          'High Tech Modern Language',
          'Home Tool Markup Language',
          'Hyper Transfer Markup Language',
        ],
        correctOptionIndex: 0,
      },
      {
        questionText: 'Which is a programming language?',
        options: ['HTTP', 'Python', 'HTML', 'CSS'],
        correctOptionIndex: 1,
      },
      {
        questionText: 'RAM is:',
        options: ['Permanent storage', 'Volatile memory', 'A type of CPU', 'An operating system'],
        correctOptionIndex: 1,
      },
      {
        questionText: 'In binary, the decimal number 5 is:',
        options: ['100', '101', '110', '111'],
        correctOptionIndex: 1,
      },
      {
        questionText: 'A loop that runs at least once is often implemented with:',
        options: ['for', 'while', 'do-while', 'if'],
        correctOptionIndex: 2,
      },
      {
        questionText: 'The brain of the computer is the:',
        options: ['Monitor', 'Keyboard', 'CPU', 'Printer'],
        correctOptionIndex: 2,
      },
      {
        questionText: 'HTTPS adds ___ to HTTP.',
        options: ['Speed', 'Security (encryption)', 'Storage', 'Graphics'],
        correctOptionIndex: 1,
      },
      {
        questionText: 'Which data structure is FIFO?',
        options: ['Stack', 'Queue', 'Tree', 'Graph'],
        correctOptionIndex: 1,
      },
    ],
  },
];

const run = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('Set MONGO_URI in .env');
    process.exit(1);
  }

  await mongoose.connect(uri);

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@exam.local';
  const admin = await User.findOne({ email: adminEmail, role: 'admin' });
  if (!admin) {
    console.error(`No admin user found (${adminEmail}). Run: npm run seed:admin`);
    process.exit(1);
  }

  let created = 0;
  let skipped = 0;

  for (const subject of SUBJECTS) {
    let exam = await Exam.findOne({ title: subject.title, createdBy: admin._id });

    if (exam) {
      const qCount = await Question.countDocuments({ exam: exam._id });
      if (qCount >= subject.questions.length) {
        console.log(`Skip (exists): ${subject.title} (${qCount} questions)`);
        skipped += 1;
        continue;
      }
      await Question.deleteMany({ exam: exam._id });
      console.log(`Refresh questions: ${subject.title}`);
    } else {
      exam = await Exam.create({
        title: subject.title,
        description: subject.description,
        durationMinutes: subject.durationMinutes,
        isPublished: true,
        createdBy: admin._id,
      });
      console.log(`Created exam: ${subject.title}`);
      created += 1;
    }

    if (!exam.isPublished) {
      exam.isPublished = true;
      await exam.save();
    }

    for (const q of subject.questions) {
      await Question.create({
        exam: exam._id,
        questionText: q.questionText,
        options: q.options,
        correctOptionIndex: q.correctOptionIndex,
      });
    }
    console.log(`  → ${subject.questions.length} questions added`);
  }

  console.log(`\nDone. New exams: ${created}, skipped: ${skipped}, total subjects: ${SUBJECTS.length}`);
  process.exit(0);
};

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
